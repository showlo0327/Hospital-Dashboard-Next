"""
Ping Engine — Production-critical health monitoring.

Prioritizes STABILITY over responsiveness:
  - Offline requires N consecutive failures (no flapping)
  - Recovery requires M consecutive successes (no false recovery)
  - Latency uses rolling average of last W successful pings
  - Statistics cached per scan cycle

All operational parameters are read from system_config (system_config.json).
The engine re-reads config at the start of every scan cycle for dynamic updates.
A future Settings page can modify system_config.json via the Backend API.

Architecture:
  Config (system_config.json) → PingWorker → HistoryBuffer → HealthCalculator → StatusCalculator → StatisticsCache
"""

import time
import threading
import logging
from collections import deque
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from typing import Optional

from ping3 import ping

from app.core.config import system_config
from app.repositories.device_repository import device_repository
from app.models.enums import DeviceStatus

logger = logging.getLogger("ping_engine")


# ── Data Structures ────────────────────────────────────

@dataclass
class PingResult:
    """Single ping result."""
    timestamp: float = 0.0
    success: bool = False
    latency: float = 0.0


@dataclass
class DeviceState:
    """Per-device runtime state (not persisted to assets.json)."""
    device_id: str
    ip: str
    history: deque = field(default_factory=lambda: deque(maxlen=20))
    consecutive_failures: int = 0
    consecutive_successes: int = 0
    current_status: str = "Unknown"
    rolling_latency: float = 0.0
    availability: float = 0.0
    packet_loss: float = 0.0
    last_updated: str = ""


# ── Status Calculator ──────────────────────────────────

class StatusCalculator:
    """
    Anti-flap status machine.

    State transitions:
      Online    → stays Online    (intermittent failures < offline_threshold)
      Online    → Warning         (1+ failures but < offline_threshold)
      Warning   → Offline         (offline_threshold consecutive failures)
      Offline   → stays Offline   (until recovery_threshold successes)
      Offline   → Recovering      (1+ consecutive success, but < recovery_threshold)
      Recovering → Online         (recovery_threshold consecutive successes)
      Recovering → Offline        (any failure during recovery)
    """

    @staticmethod
    def compute(
        state: DeviceState,
        result: PingResult,
        offline_threshold: int = 5,
        recovery_threshold: int = 3,
    ) -> str:
        prev = state.current_status

        if result.success:
            state.consecutive_successes += 1
            state.consecutive_failures = 0
        else:
            state.consecutive_failures += 1
            state.consecutive_successes = 0

        cf = state.consecutive_failures
        cs = state.consecutive_successes

        # Offline/recovering → need recovery
        if prev in (DeviceStatus.Offline.value, "Recovering"):
            if cf >= 1:
                return DeviceStatus.Offline.value
            if cs >= recovery_threshold:
                return DeviceStatus.Online.value
            return "Recovering"

        # Online/Warning → check failures
        if cf >= offline_threshold:
            return DeviceStatus.Offline.value

        if cf >= 1:
            return DeviceStatus.Warning.value

        return DeviceStatus.Online.value


# ── Health Calculator ──────────────────────────────────

class HealthCalculator:
    """Compute availability, packet loss, and rolling latency from history."""

    @staticmethod
    def compute(state: DeviceState, latency_window: int = 5) -> None:
        history = list(state.history)
        if not history:
            state.availability = 0.0
            state.packet_loss = 0.0
            state.rolling_latency = 0.0
            return

        total = len(history)
        successful = [r for r in history if r.success]

        state.availability = round((len(successful) / total) * 100, 2)
        state.packet_loss = round(((total - len(successful)) / total) * 100, 2)

        # Rolling average of last N successful pings
        recent = successful[-latency_window:]
        state.rolling_latency = round(sum(r.latency for r in recent) / len(recent), 2) if recent else 0.0


# ── Statistics Cache ───────────────────────────────────

@dataclass
class StatisticsCache:
    """Aggregated statistics, refreshed once per scan cycle."""
    total: int = 0
    online: int = 0
    offline: int = 0
    warning: int = 0
    recovering: int = 0
    avg_latency: float = 0.0
    online_pct: float = 0.0
    last_scan: Optional[float] = None

    def refresh(self, states: dict[str, DeviceState]) -> None:
        state_list = list(states.values())
        self.total = len(state_list)
        if self.total == 0:
            self.online = self.offline = self.warning = self.recovering = 0
            self.avg_latency = self.online_pct = 0.0
            self.last_scan = time.time()
            return

        self.online = sum(1 for s in state_list if s.current_status == "Online")
        self.offline = sum(1 for s in state_list if s.current_status == "Offline")
        self.warning = sum(1 for s in state_list if s.current_status == "Warning")
        self.recovering = sum(1 for s in state_list if s.current_status == "Recovering")

        online_states = [s for s in state_list if s.current_status == "Online"]
        self.avg_latency = round(
            sum(s.rolling_latency for s in online_states) / len(online_states), 2
        ) if online_states else 0.0

        self.online_pct = round((self.online / self.total) * 100, 2)
        self.last_scan = time.time()


# ── Ping Worker ────────────────────────────────────────

class PingWorker:
    """
    Background ping engine.

    All operational parameters are loaded from system_config at init time
    and re-read at the start of every scan cycle (dynamic config updates).
    """

    def __init__(self):
        cfg = system_config.ping
        self.history_size: int = cfg.history_size
        self.latency_window: int = cfg.latency_window
        self.offline_threshold: int = cfg.offline_threshold
        self.recovery_threshold: int = cfg.recovery_threshold
        self.workers: int = cfg.worker_count
        self.scan_interval: int = cfg.scan_interval_seconds
        self.timeout: int = cfg.ping_timeout_seconds
        self.ttl: int = cfg.ping_ttl
        self.enabled: bool = cfg.enabled

        self._executor: Optional[ThreadPoolExecutor] = None
        self._thread: Optional[threading.Thread] = None
        self._running: bool = False

        # Per-device runtime state (not persisted)
        self._states: dict[str, DeviceState] = {}
        self._states_lock = threading.Lock()

        # Cached statistics
        self.statistics = StatisticsCache()

    # ── Public API ──

    def start(self) -> None:
        """Start the ping engine background thread."""
        if self._running:
            return
        self._running = True
        self._refresh_config()
        self._executor = ThreadPoolExecutor(max_workers=self.workers, thread_name_prefix="ping")
        self._thread = threading.Thread(target=self._run_loop, daemon=True, name="ping-engine")
        self._thread.start()
        logger.info(
            "Ping engine started (workers=%d, interval=%ds, timeout=%ds, offline_threshold=%d, recovery_threshold=%d)",
            self.workers, self.scan_interval, self.timeout, self.offline_threshold, self.recovery_threshold,
        )

    def stop(self) -> None:
        """Stop the ping engine gracefully."""
        self._running = False
        if self._thread:
            self._thread.join(timeout=10)
        if self._executor:
            self._executor.shutdown(wait=True)
        logger.info("Ping engine stopped")

    def get_device_state(self, device_id: str) -> Optional[DeviceState]:
        """Get runtime state for a device."""
        with self._states_lock:
            return self._states.get(device_id)

    def get_all_states(self) -> dict[str, DeviceState]:
        """Get all device runtime states (snapshot)."""
        with self._states_lock:
            return dict(self._states)

    def get_statistics(self) -> StatisticsCache:
        """Get cached statistics."""
        return self.statistics

    # ── Internal ──

    def reload_inventory(self) -> int:
        """Reload device inventory from repository. Called after CRUD/import.
        Returns count of new devices loaded."""
        new_devices = device_repository.get_all()
        count = 0
        with self._states_lock:
            repo_ids = {d["id"] for d in new_devices}
            stale = [did for did in self._states if did not in repo_ids]
            for did in stale:
                del self._states[did]
            for d in new_devices:
                did = d["id"]
                if did not in self._states:
                    self._states[did] = DeviceState(
                        device_id=did,
                        ip=d.get("ip", ""),
                        history=deque(maxlen=self.history_size),
                        current_status=d.get("status", "Unknown"),
                    )
                    count += 1
        logger.info("Ping inventory reloaded: %%d new, %%d removed, %%d total",
                     count, len(stale), len(self._states))
        return count

    def _refresh_config(self) -> None:
        """Re-read config from system_config.json (dynamic updates)."""
        system_config.reload()
        cfg = system_config.ping
        self.history_size = cfg.history_size
        self.latency_window = cfg.latency_window
        self.offline_threshold = cfg.offline_threshold
        self.recovery_threshold = cfg.recovery_threshold
        self.workers = cfg.worker_count
        self.scan_interval = cfg.scan_interval_seconds
        self.timeout = cfg.ping_timeout_seconds
        self.ttl = cfg.ping_ttl
        self.enabled = cfg.enabled

    def _run_loop(self) -> None:
        """Main ping loop — re-reads config each cycle, scans all devices."""
        while self._running:
            try:
                self._refresh_config()
                if self.enabled:
                    self._scan_all()
                else:
                    logger.debug("Ping engine disabled by config — skipping scan")
            except Exception:
                logger.exception("Ping scan failed")
            time.sleep(self.scan_interval)

    def _scan_all(self) -> None:
        """Ping all devices concurrently, update states and persist."""
        devices = device_repository.get_all()
        if not devices:
            return

        futures = {}
        for d in devices:
            device_id = d["id"]
            ip = d.get("ip", "")
            if ip:
                futures[
                    self._executor.submit(self._ping_one, device_id, ip)
                ] = device_id

        for future in as_completed(futures):
            try:
                device_id, result = future.result(timeout=self.timeout + 1)
                self._process_result(device_id, result)
            except Exception:
                logger.exception("Ping future failed for device")

        # Persist status/latency updates to repository
        updates = {}
        with self._states_lock:
            for device_id, state in self._states.items():
                last_ts = state.history[-1].timestamp if state.history else time.time()
                updates[device_id] = {
                    "status": state.current_status,
                    "latency": state.rolling_latency,
                    "availability": state.availability,
                    "packetLoss": state.packet_loss,
                    "updated": f"{int(time.time() - last_ts)}s ago" if state.history else "—",
                    "history": [r.latency if r.success else 0 for r in state.history],
                }

        for device_id, fields in updates.items():
            device_repository.update(device_id, fields)

        # Refresh statistics cache
        self.statistics.refresh(self._states)

    def _ping_one(self, device_id: str, ip: str) -> tuple[str, PingResult]:
        """Ping a single device. Returns (device_id, result)."""
        result = PingResult(timestamp=time.time())
        try:
            rtt = ping(ip, timeout=self.timeout, ttl=self.ttl, unit="ms")
            if rtt is not None and rtt is not False:
                result.success = True
                result.latency = round(rtt, 2)
            else:
                result.success = False
                result.latency = 0.0
        except Exception:
            result.success = False
            result.latency = 0.0
        return device_id, result

    def _process_result(self, device_id: str, result: PingResult) -> None:
        """Update runtime state for a device after a ping result."""
        with self._states_lock:
            if device_id not in self._states:
                device = device_repository.get_by_id(device_id)
                self._states[device_id] = DeviceState(
                    device_id=device_id,
                    ip=device.get("ip", "") if device else "",
                    history=deque(maxlen=self.history_size),
                    current_status=device.get("status", "Unknown") if device else "Unknown",
                )

            state = self._states[device_id]
            state.history.append(result)

            new_status = StatusCalculator.compute(
                state, result,
                offline_threshold=self.offline_threshold,
                recovery_threshold=self.recovery_threshold,
            )
            state.current_status = new_status

            HealthCalculator.compute(state, latency_window=self.latency_window)

            state.last_updated = time.strftime("%H:%M:%S", time.localtime(result.timestamp))


# ── Singleton ──────────────────────────────────────────

ping_engine = PingWorker()

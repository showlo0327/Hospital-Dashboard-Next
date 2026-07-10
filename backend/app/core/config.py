"""
Application configuration — loaded from environment or defaults.

Two-tier config:
  1. Environment / server config    → hardcoded defaults + env vars (HOST, PORT, DEBUG, etc.)
  2. System config                  → system_config.json (ping, csv, snmp, ui params)
                                     → dynamically reloadable at runtime
"""

import json
import os
import threading
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

# ── Project paths ──────────────────────────────────────

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = Path(os.getenv("DATA_DIR", PROJECT_ROOT / "app" / "data"))
ASSETS_FILE = DATA_DIR / "assets.json"
SYSTEM_CONFIG_FILE = DATA_DIR / "system_config.json"

# ── Server ─────────────────────────────────────────────

HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
DEBUG = os.getenv("DEBUG", "true").lower() == "true"
API_PREFIX = "/api"
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")


# ── System Config ──────────────────────────────────────

# Hard defaults — used when system_config.json is missing or has missing keys.
_SYSTEM_CONFIG_DEFAULTS = {
    "ping": {
        "history_size": 20,
        "latency_window": 5,
        "offline_threshold": 5,
        "recovery_threshold": 3,
        "worker_count": 50,
        "scan_interval_seconds": 30,
        "ping_timeout_seconds": 2,
        "ping_ttl": 64,
        "enabled": True,
    },
    "csv": {
        "max_file_size_mb": 10,
        "allowed_encodings": ["utf-8", "utf-8-sig", "gbk", "gb2312"],
        "default_encoding": "utf-8",
    },
    "snmp": {
        "enabled": False,
        "default_port": 161,
        "default_community": "public",
        "timeout_seconds": 3,
        "retries": 2,
        "scan_interval_seconds": 300,
    },
    "ui": {
        "auto_refresh_enabled": False,
        "auto_refresh_interval_seconds": 60,
        "default_view": "list",
    },
}


@dataclass
class PingConfig:
    """Ping Engine operational parameters — read from system_config.json."""
    history_size: int = 20
    latency_window: int = 5
    offline_threshold: int = 5
    recovery_threshold: int = 3
    worker_count: int = 50
    scan_interval_seconds: int = 30
    ping_timeout_seconds: int = 2
    ping_ttl: int = 64
    enabled: bool = True


@dataclass
class CsvConfig:
    max_file_size_mb: int = 10
    allowed_encodings: list[str] = field(default_factory=lambda: ["utf-8", "utf-8-sig", "gbk", "gb2312"])
    default_encoding: str = "utf-8"


@dataclass
class SnmpConfig:
    enabled: bool = False
    default_port: int = 161
    default_community: str = "public"
    timeout_seconds: int = 3
    retries: int = 2
    scan_interval_seconds: int = 300


@dataclass
class UiConfig:
    auto_refresh_enabled: bool = False
    auto_refresh_interval_seconds: int = 60
    default_view: str = "list"


class SystemConfig:
    """
    Centralized system configuration.

    Reads from system_config.json. Supports runtime reload for dynamic
    parameter changes (e.g. from a future Settings page).

    Thread-safe reads via a reader-writer lock.
    """

    def __init__(self, filepath: Optional[Path] = None):
        self._filepath = filepath or SYSTEM_CONFIG_FILE
        self._lock = threading.RLock()
        self._raw: dict = {}
        self.ping: PingConfig = PingConfig()
        self.csv: CsvConfig = CsvConfig()
        self.snmp: SnmpConfig = SnmpConfig()
        self.ui: UiConfig = UiConfig()
        self.load()

    # ── Public ──

    def load(self) -> None:
        """Load (or reload) configuration from disk."""
        raw = self._read_file()
        with self._lock:
            self._raw = raw
            self.ping = self._parse_ping(raw.get("ping", {}))
            self.csv = self._parse_csv(raw.get("csv", {}))
            self.snmp = self._parse_snmp(raw.get("snmp", {}))
            self.ui = self._parse_ui(raw.get("ui", {}))

    def reload(self) -> None:
        """Alias for load — re-read config from disk for dynamic updates."""
        self.load()

    def to_dict(self) -> dict:
        """Return the full raw config dict (for API responses)."""
        with self._lock:
            return dict(self._raw)

    # ── Internal ──

    def _read_file(self) -> dict:
        if not self._filepath.exists():
            return {}
        try:
            with open(self._filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, OSError):
            return {}

    @staticmethod
    def _parse_ping(raw: dict) -> PingConfig:
        defaults = _SYSTEM_CONFIG_DEFAULTS["ping"]
        return PingConfig(
            history_size=int(raw.get("history_size", defaults["history_size"])),
            latency_window=int(raw.get("latency_window", defaults["latency_window"])),
            offline_threshold=int(raw.get("offline_threshold", defaults["offline_threshold"])),
            recovery_threshold=int(raw.get("recovery_threshold", defaults["recovery_threshold"])),
            worker_count=int(raw.get("worker_count", defaults["worker_count"])),
            scan_interval_seconds=int(raw.get("scan_interval_seconds", defaults["scan_interval_seconds"])),
            ping_timeout_seconds=int(raw.get("ping_timeout_seconds", defaults["ping_timeout_seconds"])),
            ping_ttl=int(raw.get("ping_ttl", defaults["ping_ttl"])),
            enabled=bool(raw.get("enabled", defaults["enabled"])),
        )

    @staticmethod
    def _parse_csv(raw: dict) -> CsvConfig:
        defaults = _SYSTEM_CONFIG_DEFAULTS["csv"]
        return CsvConfig(
            max_file_size_mb=int(raw.get("max_file_size_mb", defaults["max_file_size_mb"])),
            allowed_encodings=list(raw.get("allowed_encodings", defaults["allowed_encodings"])),
            default_encoding=str(raw.get("default_encoding", defaults["default_encoding"])),
        )

    @staticmethod
    def _parse_snmp(raw: dict) -> SnmpConfig:
        defaults = _SYSTEM_CONFIG_DEFAULTS["snmp"]
        return SnmpConfig(
            enabled=bool(raw.get("enabled", defaults["enabled"])),
            default_port=int(raw.get("default_port", defaults["default_port"])),
            default_community=str(raw.get("default_community", defaults["default_community"])),
            timeout_seconds=int(raw.get("timeout_seconds", defaults["timeout_seconds"])),
            retries=int(raw.get("retries", defaults["retries"])),
            scan_interval_seconds=int(raw.get("scan_interval_seconds", defaults["scan_interval_seconds"])),
        )

    @staticmethod
    def _parse_ui(raw: dict) -> UiConfig:
        defaults = _SYSTEM_CONFIG_DEFAULTS["ui"]
        return UiConfig(
            auto_refresh_enabled=bool(raw.get("auto_refresh_enabled", defaults["auto_refresh_enabled"])),
            auto_refresh_interval_seconds=int(raw.get("auto_refresh_interval_seconds", defaults["auto_refresh_interval_seconds"])),
            default_view=str(raw.get("default_view", defaults["default_view"])),
        )


# ── Singleton ──────────────────────────────────────────

system_config = SystemConfig()

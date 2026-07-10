"""
Device Repository — the ONLY layer allowed to read/write assets.json.

No API route, service, or utility may access the filesystem directly.
All data access flows through this repository.

Future: swap for database-backed repository without modifying services or API.
"""

import json
import threading
from typing import Optional

from app.core.config import ASSETS_FILE
from app.models.enums import DeviceType, DeviceStatus


# Thread-safe lock for file writes
_lock = threading.Lock()


def _read_raw() -> list[dict]:
    """Read all devices from assets.json. Internal — not exposed outside repository."""
    if not ASSETS_FILE.exists():
        return []
    with open(ASSETS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def _write_raw(devices: list[dict]) -> None:
    """Write all devices to assets.json. Internal — not exposed outside repository."""
    with _lock:
        ASSETS_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(ASSETS_FILE, "w", encoding="utf-8") as f:
            json.dump(devices, f, indent=2, ensure_ascii=False)


class DeviceRepository:
    """Repository for device CRUD operations. Single source of truth for device data."""

    # ── Read ──

    def get_all(self) -> list[dict]:
        """Return all devices."""
        return _read_raw()

    def get_by_id(self, device_id: str) -> Optional[dict]:
        """Return a single device by id, or None."""
        devices = _read_raw()
        return next((d for d in devices if d["id"] == device_id), None)

    def get_by_status(self, status: DeviceStatus) -> list[dict]:
        """Return devices filtered by status."""
        devices = _read_raw()
        return [d for d in devices if d.get("status") == status.value]

    def count(self) -> int:
        """Return total device count."""
        return len(_read_raw())

    # ── Write ──

    def create(self, device: dict) -> dict:
        """Create a new device. The caller must provide the full dict including generated id."""
        devices = _read_raw()
        devices.append(device)
        _write_raw(devices)
        return device

    def update(self, device_id: str, updates: dict) -> Optional[dict]:
        """Update an existing device. Returns updated dict or None if not found."""
        devices = _read_raw()
        for d in devices:
            if d["id"] == device_id:
                d.update(updates)
                _write_raw(devices)
                return d
        return None

    def delete(self, device_id: str) -> bool:
        """Delete a device by id. Returns True if deleted, False if not found."""
        devices = _read_raw()
        new_devices = [d for d in devices if d["id"] != device_id]
        if len(new_devices) == len(devices):
            return False
        _write_raw(new_devices)
        return True

    def exists(self, device_id: str) -> bool:
        """Check if a device exists by id."""
        return self.get_by_id(device_id) is not None


# Singleton instance
device_repository = DeviceRepository()

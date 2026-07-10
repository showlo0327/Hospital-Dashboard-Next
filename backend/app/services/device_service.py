"""
Device Service — business logic for device CRUD operations.

All business rules live here. The API layer delegates to services.
Services delegate data access to the repository layer.

Future: CSV import, SNMP discovery, ping status updates all flow through here.
"""

import uuid
from typing import Optional

from app.repositories.device_repository import device_repository
from app.schemas.device import DeviceCreateRequest, DeviceUpdateRequest
from app.models.enums import DeviceStatus


class DeviceService:
    """Business logic for device management."""

    def get_all(self) -> list[dict]:
        return device_repository.get_all()

    def get_by_id(self, device_id: str) -> Optional[dict]:
        return device_repository.get_by_id(device_id)

    def create(self, payload: DeviceCreateRequest) -> dict:
        device = payload.model_dump()
        device["id"] = self._generate_id()
        device.setdefault("history", [])
        device.setdefault("updated", "just now")
        return device_repository.create(device)

    def update(self, device_id: str, payload: DeviceUpdateRequest) -> Optional[dict]:
        updates = payload.model_dump(exclude_unset=True)
        if not updates:
            return device_repository.get_by_id(device_id)
        return device_repository.update(device_id, updates)

    def delete(self, device_id: str) -> bool:
        return device_repository.delete(device_id)

    def _generate_id(self) -> str:
        """Generate a unique device id (D + 3-digit sequence)."""
        existing = device_repository.get_all()
        max_num = 0
        for d in existing:
            if d["id"].startswith("D") and d["id"][1:].isdigit():
                max_num = max(max_num, int(d["id"][1:]))
        return f"D{max_num + 1:03d}"


# Singleton
device_service = DeviceService()

"""
Dashboard Service — business logic for dashboard statistics.

All statistics are derived from the device repository.
Never hardcoded — always computed.
"""

from app.repositories.device_repository import device_repository
from app.models.enums import DeviceStatus


class DashboardService:
    """Compute dashboard statistics from device data."""

    def get_statistics(self) -> dict:
        devices = device_repository.get_all()
        total = len(devices)

        online = sum(1 for d in devices if d.get("status") == DeviceStatus.Online.value)
        offline = sum(1 for d in devices if d.get("status") == DeviceStatus.Offline.value)
        warning = sum(1 for d in devices if d.get("status") == DeviceStatus.Warning.value)
        maintenance = sum(1 for d in devices if d.get("status") == DeviceStatus.Maintenance.value)
        unknown = total - online - offline - warning - maintenance

        online_devices = [d for d in devices if d.get("status") == DeviceStatus.Online.value]
        avg_latency = 0.0
        if online_devices:
            avg_latency = round(
                sum(d.get("latency", 0) for d in online_devices) / len(online_devices), 1
            )

        online_pct = 0.0
        if total > 0:
            online_pct = round((online / total) * 1000) / 10

        return {
            "total": total,
            "online": online,
            "offline": offline,
            "warning": warning,
            "maintenance": maintenance,
            "unknown": unknown,
            "averageLatency": avg_latency,
            "onlinePercentage": online_pct,
        }


# Singleton
dashboard_service = DashboardService()

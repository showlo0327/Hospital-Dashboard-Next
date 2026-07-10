"""
Ping Engine API routes — /api/ping

Endpoints:
  GET /api/ping/status/{device_id}  — current ping state for one device
  GET /api/ping/status              — all device ping states
  GET /api/ping/statistics          — cached aggregated statistics
"""

from fastapi import APIRouter

from app.schemas.common import APIResponse
from app.schemas.ping import (
    DevicePingStateResponse,
    PingResultResponse,
    PingStatisticsResponse,
    PingStatusListResponse,
)
from app.services.ping_engine import ping_engine

router = APIRouter(prefix="/ping", tags=["Ping Engine"])


# ── Helpers ────────────────────────────────────────────

def _build_state_response(device_id: str, state) -> DevicePingStateResponse:
    """Convert an internal DeviceState to the API response model."""
    if state is None:
        return DevicePingStateResponse(device_id=device_id)

    return DevicePingStateResponse(
        device_id=state.device_id,
        device_name=getattr(state, "device_name", ""),
        ip=state.ip,
        status=state.current_status,
        latency=round(state.rolling_latency, 2),
        availability=state.availability,
        packet_loss=state.packet_loss,
        history=[
            PingResultResponse(
                timestamp=r.timestamp,
                success=r.success,
                latency=r.latency,
            )
            for r in state.history
        ],
        last_updated=state.last_updated,
    )


# ── Routes ─────────────────────────────────────────────

@router.get("/status/{device_id}", response_model=APIResponse)
async def get_device_ping_status(device_id: str):
    """Get the current ping state for a single device."""
    state = ping_engine.get_device_state(device_id)
    data = _build_state_response(device_id, state)
    return APIResponse(data=data.model_dump())


@router.get("/status", response_model=APIResponse)
async def get_all_ping_status():
    """Get ping states for all devices."""
    all_states = ping_engine.get_all_states()
    devices = []
    for device_id, state in all_states.items():
        devices.append(_build_state_response(device_id, state))
    result = PingStatusListResponse(devices=devices, total=len(devices))
    return APIResponse(data=result.model_dump())


@router.post("/reload", response_model=APIResponse)
async def reload_ping_inventory():
    """Reload device inventory after CRUD/import operations."""
    count = ping_engine.reload_inventory()
    return APIResponse(
        data={"devices_loaded": count},
        message=f"Inventory reloaded: {count} new devices",
    )


@router.get("/statistics", response_model=APIResponse)
async def get_ping_statistics():
    """Get cached aggregated ping statistics."""
    stats = ping_engine.get_statistics()
    data = PingStatisticsResponse(
        total=stats.total,
        online=stats.online,
        offline=stats.offline,
        warning=stats.warning,
        recovering=getattr(stats, "recovering", 0),
        avg_latency=round(stats.avg_latency, 2),
        online_pct=round(stats.online_pct, 2),
        last_scan=stats.last_scan,
    )
    return APIResponse(data=data.model_dump())

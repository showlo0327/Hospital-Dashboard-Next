"""
Ping Engine schemas — request/response models for the Ping API.

Naming convention:
  - *Response models     → API-facing serialization
  - *Request models      → client input (future filters/pagination)
  - Internal dataclasses → ping_engine.py (not exposed)

No domain entities from models/ are exposed directly — schemas act as
the API contract layer between the router and the service.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# ── Ping Result ────────────────────────────────────────

class PingResultResponse(BaseModel):
    """Single ping result (one entry in the history buffer)."""
    timestamp: float = Field(..., description="Unix epoch time of ping")
    success: bool = Field(..., description="Whether the ping succeeded")
    latency: float = Field(0.0, description="RTT in milliseconds (0 if failed)")


# ── Device Ping State ──────────────────────────────────

class DevicePingStateResponse(BaseModel):
    """Full runtime ping state for a single device."""
    device_id: str = Field(..., description="Unique device identifier")
    device_name: str = Field("", description="Human-readable device name")
    ip: str = Field("", description="Target IP address")
    status: str = Field("Unknown", description="Current device status (Online/Warning/Offline/Recovering)")
    latency: float = Field(0.0, description="Rolling average latency (ms)")
    availability: float = Field(0.0, description="Availability percentage (0-100)")
    packet_loss: float = Field(0.0, description="Packet loss percentage (0-100)")
    history: list[PingResultResponse] = Field(default_factory=list, description="Last 20 ping results")
    last_updated: str = Field("", description="Human-readable last update time")


# ── Ping Statistics ────────────────────────────────────

class PingStatisticsResponse(BaseModel):
    """Aggregated ping statistics across all devices."""
    total: int = Field(0, description="Total devices being pinged")
    online: int = Field(0, description="Devices currently Online")
    offline: int = Field(0, description="Devices currently Offline")
    warning: int = Field(0, description="Devices currently Warning")
    recovering: int = Field(0, description="Devices currently Recovering")
    avg_latency: float = Field(0.0, description="Average latency across all online devices (ms)")
    online_pct: float = Field(0.0, description="Percentage of devices online (0-100)")
    last_scan: Optional[datetime] = Field(None, description="Timestamp of last completed scan cycle")


# ── Ping Status List ───────────────────────────────────

class PingStatusListResponse(BaseModel):
    """Wrapper for listing all device ping states."""
    devices: list[DevicePingStateResponse] = Field(default_factory=list)
    total: int = 0

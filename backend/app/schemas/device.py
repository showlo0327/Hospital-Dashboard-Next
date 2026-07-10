"""Pydantic schemas for device endpoints."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.models.enums import DeviceType, DeviceStatus


# ── Request Schemas ──

class DeviceCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=128)
    ip: str = Field(..., min_length=1, max_length=45)
    mac: str = Field(default="", max_length=17)
    type: DeviceType
    vendor: str = Field(..., min_length=1, max_length=64)
    model: str = Field(..., min_length=1, max_length=64)
    building: str = Field(default="", max_length=64)
    floor: str = Field(default="", max_length=16)
    department: str = Field(default="", max_length=64)
    location: str = Field(default="", max_length=128)
    remark: str = Field(default="", max_length=256)
    status: DeviceStatus = DeviceStatus.Unknown
    latency: float = Field(default=0, ge=0)
    availability: float = Field(default=0, ge=0, le=100)
    packetLoss: float = Field(default=0, ge=0, le=100)

    model_config = {"extra": "forbid"}


class DeviceUpdateRequest(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=128)
    ip: Optional[str] = Field(default=None, min_length=1, max_length=45)
    mac: Optional[str] = Field(default=None, max_length=17)
    type: Optional[DeviceType] = None
    vendor: Optional[str] = Field(default=None, min_length=1, max_length=64)
    model: Optional[str] = Field(default=None, min_length=1, max_length=64)
    building: Optional[str] = Field(default=None, max_length=64)
    floor: Optional[str] = Field(default=None, max_length=16)
    department: Optional[str] = Field(default=None, max_length=64)
    location: Optional[str] = Field(default=None, max_length=128)
    remark: Optional[str] = Field(default=None, max_length=256)
    status: Optional[DeviceStatus] = None
    latency: Optional[float] = Field(default=None, ge=0)
    availability: Optional[float] = Field(default=None, ge=0, le=100)
    packetLoss: Optional[float] = Field(default=None, ge=0, le=100)

    model_config = {"extra": "forbid"}


# ── Response Schemas ──

class DeviceResponse(BaseModel):
    id: str
    name: str
    ip: str
    mac: str = ""
    type: DeviceType
    vendor: str
    model: str
    building: str
    floor: str
    department: str
    location: str
    remark: str = ""
    status: DeviceStatus
    latency: float
    availability: float
    packetLoss: float
    updated: str
    history: list[float] = []


class DeviceListResponse(BaseModel):
    total: int
    devices: list[DeviceResponse]

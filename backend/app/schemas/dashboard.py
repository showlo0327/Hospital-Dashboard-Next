"""Pydantic schemas for dashboard endpoints."""

from pydantic import BaseModel


class DeviceStatisticsResponse(BaseModel):
    total: int
    online: int
    offline: int
    warning: int
    maintenance: int = 0
    unknown: int = 0
    averageLatency: float
    onlinePercentage: float


class DashboardResponse(BaseModel):
    statistics: DeviceStatisticsResponse

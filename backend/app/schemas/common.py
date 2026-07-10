"""Common API response schemas."""

from typing import Any, Optional
from pydantic import BaseModel


class APIResponse(BaseModel):
    """Standard API envelope."""
    success: bool = True
    message: str = "ok"
    data: Optional[Any] = None


class ErrorResponse(BaseModel):
    """Standard error envelope."""
    success: bool = False
    message: str
    detail: Optional[str] = None


class HealthResponse(BaseModel):
    status: str = "healthy"
    version: str = "2.8.0"

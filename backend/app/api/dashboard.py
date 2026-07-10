"""Dashboard API routes — /api/dashboard"""

from fastapi import APIRouter
from app.schemas.common import APIResponse
from app.services.dashboard_service import dashboard_service

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/statistics", response_model=APIResponse)
async def get_statistics():
    stats = dashboard_service.get_statistics()
    return APIResponse(data=stats)

"""System API routes — /api/system"""

from fastapi import APIRouter
from app.schemas.common import HealthResponse, APIResponse

router = APIRouter(prefix="/system", tags=["System"])


@router.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse()

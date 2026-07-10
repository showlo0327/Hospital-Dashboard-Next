"""API root router — aggregates all sub-routers under /api."""

from fastapi import APIRouter
from app.api.devices import router as devices_router
from app.api.dashboard import router as dashboard_router
from app.api.system import router as system_router
from app.api.ping import router as ping_router
from app.api.csv import router as csv_router

api_router = APIRouter(prefix="/api")
api_router.include_router(devices_router)
api_router.include_router(dashboard_router)
api_router.include_router(system_router)
api_router.include_router(ping_router)
api_router.include_router(csv_router)

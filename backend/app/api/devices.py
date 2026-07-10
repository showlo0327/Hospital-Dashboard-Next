"""Device API routes — /api/devices"""

from fastapi import APIRouter, HTTPException
from app.schemas.common import APIResponse
from app.schemas.device import (
    DeviceCreateRequest,
    DeviceUpdateRequest,
    DeviceListResponse,
)
from app.services.device_service import device_service

router = APIRouter(prefix="/devices", tags=["Devices"])


@router.get("", response_model=APIResponse)
async def list_devices():
    devices = device_service.get_all()
    return APIResponse(
        data=DeviceListResponse(total=len(devices), devices=devices).model_dump(),
    )


@router.get("/{device_id}", response_model=APIResponse)
async def get_device(device_id: str):
    device = device_service.get_by_id(device_id)
    if not device:
        raise HTTPException(status_code=404, detail=f"Device {device_id} not found")
    return APIResponse(data=device)


@router.post("", response_model=APIResponse, status_code=201)
async def create_device(payload: DeviceCreateRequest):
    device = device_service.create(payload)
    return APIResponse(data=device, message="Device created")


@router.put("/{device_id}", response_model=APIResponse)
async def update_device(device_id: str, payload: DeviceUpdateRequest):
    device = device_service.update(device_id, payload)
    if not device:
        raise HTTPException(status_code=404, detail=f"Device {device_id} not found")
    return APIResponse(data=device, message="Device updated")


@router.delete("/{device_id}", response_model=APIResponse)
async def delete_device(device_id: str):
    deleted = device_service.delete(device_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Device {device_id} not found")
    return APIResponse(message="Device deleted")

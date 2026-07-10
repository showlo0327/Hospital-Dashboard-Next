"""
CSV Import API routes — /api/csv

Endpoints:
  POST /api/csv/validate   — Parse + validate CSV, return per-row results
  POST /api/csv/import     — Import validated rows, return summary
  GET  /api/csv/template   — Download CSV template
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse

from app.schemas.common import APIResponse
from app.schemas.csv import (
    CsvValidationResponse,
    CsvImportRequest,
    CsvImportSummary,
    CsvTemplateInfo,
)
from app.services.csv_service import csv_service

router = APIRouter(prefix="/csv", tags=["CSV Import"])


@router.post("/validate", response_model=APIResponse)
async def validate_csv(body: CsvImportRequest):
    """Parse and validate CSV content. Returns per-row errors, warnings, and can_import flag."""
    try:
        rows = csv_service.parse_csv(body.content, body.encoding)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not rows:
        raise HTTPException(status_code=400, detail="CSV file is empty or has no data rows")

    validation_rows = csv_service.validate_rows(rows)

    valid = sum(1 for r in validation_rows if r["status"] == "valid")
    warning = sum(1 for r in validation_rows if r["status"] == "warning")
    error = sum(1 for r in validation_rows if r["status"] == "error")

    # Re-parse to get clean Pydantic models
    row_models = [
        {
            "row": r["row"],
            "name": r["name"],
            "ip": r["ip"],
            "status": r["status"],
            "errors": r["errors"],
            "warnings": r["warnings"],
        }
        for r in validation_rows
    ]

    data = CsvValidationResponse(
        total_rows=len(validation_rows),
        valid_rows=valid,
        warning_rows=warning,
        error_rows=error,
        rows=row_models,
        can_import=(error == 0 and (valid + warning) > 0),
    )
    return APIResponse(data=data.model_dump())


@router.post("/import", response_model=APIResponse)
async def import_csv(body: CsvImportRequest):
    """Import validated CSV rows into the device repository. Idempotent by IP."""
    try:
        rows = csv_service.parse_csv(body.content, body.encoding)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not rows:
        raise HTTPException(status_code=400, detail="CSV file is empty or has no data rows")

    # Validate first
    validation_rows = csv_service.validate_rows(rows)

    # Import valid + warning rows
    result = csv_service.import_devices(rows, validation_rows, body.duplicate_action)

    data = CsvImportSummary(
        total=result["total"],
        imported=result["imported"],
        skipped=result["skipped"],
        updated=result["updated"],
        failed=result["failed"],
        errors=result["errors"],
    )
    return APIResponse(data=data.model_dump(), message="Import completed")


@router.get("/template", response_class=PlainTextResponse)
async def download_template():
    """Download a CSV template with headers and example rows."""
    csv_content = csv_service.generate_template_csv()
    return PlainTextResponse(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=hospital_device_template.csv"},
    )


@router.get("/template/info", response_model=APIResponse)
async def template_info():
    """Get CSV template metadata (columns, valid device types)."""
    data = CsvTemplateInfo()
    return APIResponse(data=data.model_dump())

"""
CSV Import schemas — request/response models for the CSV import workflow.

Covers:
  - Validation row results (per-row errors/warnings)
  - Preview response (before import)
  - Import result summary (after import)
  - Template download
"""

from typing import Optional
from pydantic import BaseModel, Field
from app.models.enums import DeviceType


# ── Per-Row Validation ────────────────────────────────

class CsvRowValidation(BaseModel):
    """Validation result for a single CSV row."""
    row: int = Field(..., description="1-based row number in CSV")
    name: str = Field(default="", description="Device name from CSV")
    ip: str = Field(default="", description="IP address from CSV")
    status: str = Field("valid", description="valid | warning | error")
    errors: list[str] = Field(default_factory=list, description="Blocking errors")
    warnings: list[str] = Field(default_factory=list, description="Non-blocking warnings")


# ── Validation Response ───────────────────────────────

class CsvValidationResponse(BaseModel):
    """Response for POST /api/csv/validate."""
    total_rows: int = 0
    valid_rows: int = 0
    warning_rows: int = 0
    error_rows: int = 0
    rows: list[CsvRowValidation] = Field(default_factory=list)
    can_import: bool = False


# ── Import Request ────────────────────────────────────

class CsvImportRequest(BaseModel):
    """Request body for POST /api/csv/import."""
    filename: str = Field(..., description="Original CSV filename")
    content: str = Field(..., description="Raw CSV content as string")
    duplicate_action: str = Field("skip", description="skip | replace")
    encoding: str = Field("utf-8", description="CSV file encoding")


# ── Import Result ─────────────────────────────────────

class CsvImportSummary(BaseModel):
    """Summary returned after CSV import completes."""
    total: int = 0
    imported: int = 0
    skipped: int = 0
    updated: int = 0
    failed: int = 0
    errors: list[str] = Field(default_factory=list)


# ── Template Info ─────────────────────────────────────

class CsvTemplateInfo(BaseModel):
    """Information about the downloadable CSV template."""
    filename: str = "hospital_device_template.csv"
    columns: list[str] = Field(default_factory=lambda: [
        "Name", "IP", "MAC", "Vendor", "Model", "DeviceType",
        "Building", "Floor", "Department", "Location", "Remark",
    ])
    device_types: list[str] = Field(default_factory=lambda: [t.value for t in DeviceType])

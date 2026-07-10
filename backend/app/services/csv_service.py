"""
CSV Import Service — full asset import workflow.

Workflow:
  1. Parse CSV content
  2. Validate every row (missing fields, invalid IP, unknown types, duplicates)
  3. Preview results → frontend shows errors/warnings
  4. Import valid rows (skip or replace duplicates by IP)
  5. Return summary (imported, skipped, updated, failed)

Idempotency:
  - Duplicate detection by IP address (case-insensitive)
  - skip mode:  existing IPs are skipped (no duplicates created)
  - replace mode: existing IPs are updated in-place

Data source:
  - assets.json via device_repository (centralized)
"""

import csv
import io
import ipaddress
import re
import uuid
import time
import logging
from typing import Optional

from app.repositories.device_repository import device_repository
from app.models.enums import DeviceType, DeviceStatus

logger = logging.getLogger("csv_service")

# ── Constants ─────────────────────────────────────────

CSV_COLUMNS = [
    "Name", "IP", "MAC", "Vendor", "Model", "DeviceType",
    "Building", "Floor", "Department", "Location", "Remark",
]

REQUIRED_COLUMNS = ["Name", "IP"]

VALID_DEVICE_TYPES = {t.value for t in DeviceType}

# IPv4 regex (quick pre-check; full validation uses ipaddress module)
IPV4_PATTERN = re.compile(
    r"^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$"
)


# ── Parse ─────────────────────────────────────────────

def _parse_csv(content: str, encoding: str = "utf-8") -> list[dict]:
    """
    Parse CSV content into a list of row dicts.
    Skips completely empty rows. Returns at most one dict per row.
    """
    # Try the requested encoding, fall back to utf-8-sig, gbk
    encodings = [encoding, "utf-8-sig", "gbk", "utf-8"]
    last_error = None

    for enc in encodings:
        try:
            text = content if isinstance(content, str) else content.decode(enc)
            break
        except (UnicodeDecodeError, AttributeError) as e:
            last_error = e
    else:
        raise ValueError(f"Failed to decode CSV: {last_error}")

    reader = csv.DictReader(io.StringIO(text))
    if reader.fieldnames is None:
        raise ValueError("CSV has no header row")

    rows: list[dict] = []
    for row_num, raw in enumerate(reader, start=2):  # row 1 = header
        # Skip completely empty rows
        if not any(v.strip() for v in raw.values() if v):
            continue
        # Normalize keys to match expected columns (case-insensitive)
        normalized = {}
        for k, v in raw.items():
            key_lower = k.strip().lower()
            for col in CSV_COLUMNS:
                if key_lower == col.lower():
                    normalized[col] = (v or "").strip()
                    break
            else:
                # Keep unknown columns too (won't hurt)
                normalized[k.strip()] = (v or "").strip()
        rows.append(normalized)

    return rows


# ── Validation ────────────────────────────────────────

def _validate_ip(ip_str: str) -> Optional[str]:
    """Validate IPv4 address. Returns error message or None."""
    if not ip_str or not ip_str.strip():
        return "Missing IP address"
    if not IPV4_PATTERN.match(ip_str.strip()):
        return f"Invalid IPv4 address: {ip_str}"
    try:
        ipaddress.IPv4Address(ip_str.strip())
    except ValueError:
        return f"Invalid IPv4 address: {ip_str}"
    return None


def _validate_device_type(type_str: str) -> Optional[str]:
    """Validate device type. Returns error message or None."""
    if not type_str or not type_str.strip():
        return None  # optional field, Unknown is default
    if type_str.strip() not in VALID_DEVICE_TYPES:
        valid_list = ", ".join(sorted(VALID_DEVICE_TYPES))
        return f"Unknown device type '{type_str}'. Valid: {valid_list}"
    return None


def validate_rows(rows: list[dict]) -> list[dict]:
    """
    Validate all parsed rows. Returns list of validation results.

    Each result dict:
      { row, name, ip, status: valid|warning|error, errors: [...], warnings: [...] }
    """
    results: list[dict] = []
    seen_ips: dict[str, int] = {}  # ip -> first row number (within this CSV)

    # Get existing IPs from repository for duplicate detection
    existing_devices = device_repository.get_all()
    existing_ips: set[str] = {
        d.get("ip", "").strip().lower() for d in existing_devices if d.get("ip")
    }

    for row_idx, row in enumerate(rows):
        row_num = row_idx + 2  # 1-based, header is row 1
        name = row.get("Name", "")
        ip = row.get("IP", "")
        errors: list[str] = []
        warnings: list[str] = []

        # Required: Name
        if not name:
            errors.append("Missing device name")

        # Required: IP
        ip_error = _validate_ip(ip)
        if ip_error:
            errors.append(ip_error)
        else:
            ip_lower = ip.strip().lower()
            # Duplicate within this CSV
            if ip_lower in seen_ips:
                errors.append(f"Duplicate IP in CSV (first at row {seen_ips[ip_lower]})")
            else:
                seen_ips[ip_lower] = row_num
            # Duplicate with existing device
            if ip_lower in existing_ips:
                warnings.append("IP already exists in system — will be skipped or replaced")

        # Optional: DeviceType validation
        type_str = row.get("DeviceType", "")
        type_error = _validate_device_type(type_str)
        if type_error:
            warnings.append(type_error)

        # Determine overall status
        if errors:
            status = "error"
        elif warnings:
            status = "warning"
        else:
            status = "valid"

        results.append({
            "row": row_num,
            "name": name,
            "ip": ip,
            "status": status,
            "errors": errors,
            "warnings": warnings,
        })

    return results


# ── Import ────────────────────────────────────────────

def import_devices(
    rows: list[dict],
    validation_results: list[dict],
    duplicate_action: str = "skip",
) -> dict:
    """
    Import valid and warning rows into the device repository.

    Args:
        rows:          Parsed CSV rows
        validation_results: Validation results (same order as rows)
        duplicate_action:  "skip" or "replace"

    Returns:
        { total, imported, skipped, updated, failed, errors: [...] }

    Idempotent: duplicates detected by IP, never creates duplicate devices.
    """
    summary = {"total": 0, "imported": 0, "skipped": 0, "updated": 0, "failed": 0, "errors": []}

    # Build IP → device map for duplicate detection
    existing_devices = device_repository.get_all()
    ip_to_device: dict[str, dict] = {}
    for d in existing_devices:
        ip_lower = d.get("ip", "").strip().lower()
        if ip_lower:
            ip_to_device[ip_lower] = d

    for idx, (row, vr) in enumerate(zip(rows, validation_results)):
        if vr["status"] == "error":
            summary["failed"] += 1
            summary["errors"].append(f"Row {vr['row']}: {', '.join(vr['errors'])}")
            continue

        summary["total"] += 1
        ip = row.get("IP", "").strip()
        ip_lower = ip.lower()

        device_data = {
            "name": row.get("Name", "").strip(),
            "ip": ip,
            "mac": row.get("MAC", "").strip(),
            "type": row.get("DeviceType", "") or DeviceType.Unknown.value,
            "vendor": row.get("Vendor", ""),
            "model": row.get("Model", ""),
            "building": row.get("Building", ""),
            "floor": row.get("Floor", ""),
            "department": row.get("Department", ""),
            "location": row.get("Location", ""),
            "remark": row.get("Remark", ""),
            "status": DeviceStatus.Unknown.value,
            "latency": 0,
            "availability": 100.0,
            "packetLoss": 0,
            "updated": "Just now",
            "history": [],
        }

        # Check for existing device by IP
        if ip_lower in ip_to_device:
            existing = ip_to_device[ip_lower]
            if duplicate_action == "replace":
                existing.update(device_data)
                existing["id"] = existing["id"]  # preserve original id
                device_repository.update(existing["id"], device_data)
                summary["updated"] += 1
            else:
                summary["skipped"] += 1
        else:
            # New device — generate unique id
            device_data["id"] = _generate_id()
            device_repository.create(device_data)
            summary["imported"] += 1

    return summary


def _generate_id() -> str:
    """Generate a unique device id (D + 3-digit sequence)."""
    existing = device_repository.get_all()
    max_num = 0
    for d in existing:
        did = d.get("id", "")
        if did.startswith("D") and did[1:].isdigit():
            max_num = max(max_num, int(did[1:]))
    return f"D{max_num + 1:03d}"


# ── Template ──────────────────────────────────────────

def generate_template_csv() -> str:
    """Generate a downloadable CSV template with headers and example rows."""
    header = ",".join(CSV_COLUMNS)

    # Example rows demonstrating common device types
    examples = [
        "Core-SW-01,10.12.0.10,AA:BB:CC:DD:EE:01,Cisco,Catalyst 9500X,CoreSwitch,Main Campus,B1,IT Infrastructure,Data Center Rack A1,",
        "HIS-SRV-01,10.12.0.50,AA:BB:CC:DD:EE:02,Dell,PowerEdge R750,Server,Main Campus,B1,HIS,Server Room,",
        "FW-Main-01,10.12.0.1,AA:BB:CC:DD:EE:03,Palo Alto,PA-5250,Firewall,Main Campus,1F,IT Security,Network Room,",
        "AP-2F-01,10.12.2.100,AA:BB:CC:DD:EE:04,Aruba,AP-535,WirelessAP,Main Campus,2F,Nursing,Corridor,",
        "PC-Reception-01,10.12.1.200,AA:BB:CC:DD:EE:05,Lenovo,ThinkCentre M90q,DesktopPC,Main Campus,1F,Administration,Reception Desk,",
    ]

    return "\n".join([header] + examples)


# ── Singleton ─────────────────────────────────────────

csv_service = type("CsvService", (), {
    "parse_csv": staticmethod(_parse_csv),
    "validate_rows": staticmethod(validate_rows),
    "import_devices": staticmethod(import_devices),
    "generate_template_csv": staticmethod(generate_template_csv),
    "COLUMNS": CSV_COLUMNS,
    "REQUIRED_COLUMNS": REQUIRED_COLUMNS,
})()

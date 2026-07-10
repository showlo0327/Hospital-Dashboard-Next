/**
 * CSV Service — wraps the FastAPI CSV import endpoints.
 *
 * Architecture: Component → Store → Service → API Client → Backend
 */

import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { CsvValidationResponse, CsvImportSummary, CsvTemplateInfo, DuplicateAction } from '@/types/csv'

// ── Runtime backend detection (matches store pattern) ──
async function isBackendAvailable(): Promise<boolean> {
  try {
    const resp = await fetch('http://localhost:8000/api/system/health', { signal: AbortSignal.timeout(2000) })
    return resp.ok
  } catch { return false }
}

/** Add CSV endpoints (not in the original endpoints file since it's new). */
const CSV_ENDPOINTS = {
  VALIDATE: '/csv/validate',
  IMPORT: '/csv/import',
  TEMPLATE_INFO: '/csv/template/info',
}

export const csvService = {
  /** Validate CSV content — returns per-row results. */
  async validate(filename: string, content: string, encoding: string = 'utf-8'): Promise<CsvValidationResponse> {
    if (await isBackendAvailable()) {
      return apiClient.post<CsvValidationResponse>(CSV_ENDPOINTS.VALIDATE, {
        filename,
        content,
        encoding,
      })
    }
    console.warn('[csvService] Backend unavailable — using mock validation')
    return mockValidate(content)
  },

  /** Import validated CSV. Idempotent by IP. */
  async importCsv(
    filename: string,
    content: string,
    duplicateAction: DuplicateAction,
    encoding: string = 'utf-8',
  ): Promise<CsvImportSummary> {
    // Always try backend first — only fall back to mock if unreachable
    if (await isBackendAvailable()) {
      return apiClient.post<CsvImportSummary>(CSV_ENDPOINTS.IMPORT, {
        filename,
        content,
        duplicate_action: duplicateAction,
        encoding,
      })
    }
    console.warn('[csvService] Backend unavailable — using mock import (NO real data written)')
    return mockImport(content, duplicateAction)
  },

  /** Get template metadata (columns, valid types). */
  async getTemplateInfo(): Promise<CsvTemplateInfo> {
    if (await isBackendAvailable()) {
      return apiClient.get<CsvTemplateInfo>(CSV_ENDPOINTS.TEMPLATE_INFO)
    }
    return {
      filename: 'hospital_device_template.csv',
      columns: ['Name', 'IP', 'MAC', 'Vendor', 'Model', 'DeviceType', 'Building', 'Floor', 'Department', 'Location', 'Remark'],
      device_types: ['CoreSwitch', 'AccessSwitch', 'Firewall', 'WirelessAP', 'Server', 'DesktopPC', 'Printer', 'MedicalDevice', 'Unknown'],
    }
  },
}

// ── Mock implementations (for development without backend) ──

function mockValidate(content: string): CsvValidationResponse {
  const lines = content.trim().split('\n')
  if (lines.length < 2) {
    return { total_rows: 0, valid_rows: 0, warning_rows: 0, error_rows: 0, rows: [], can_import: false }
  }
  const rows: CsvValidationResponse['rows'] = []
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',')
    const name = cols[0]?.trim() || ''
    const ip = cols[1]?.trim() || ''
    const errors: string[] = []
    const warnings: string[] = []
    if (!name) errors.push('Missing device name')
    if (!ip) errors.push('Missing IP address')
    if (ip && !/^\d+\.\d+\.\d+\.\d+$/.test(ip)) errors.push('Invalid IPv4 address')
    rows.push({
      row: i + 1,
      name,
      ip,
      status: errors.length ? 'error' : warnings.length ? 'warning' : 'valid',
      errors,
      warnings,
    })
  }
  const errorRows = rows.filter(r => r.status === 'error').length
  return {
    total_rows: rows.length,
    valid_rows: rows.filter(r => r.status === 'valid').length,
    warning_rows: rows.filter(r => r.status === 'warning').length,
    error_rows: errorRows,
    rows,
    can_import: errorRows === 0 && rows.length > 0,
  }
}

function mockImport(content: string, duplicateAction: DuplicateAction): CsvImportSummary {
  const lines = content.trim().split('\n')
  const dataRows = Math.max(0, lines.length - 1)
  return {
    total: dataRows,
    imported: duplicateAction === 'skip' ? dataRows : 0,
    skipped: 0,
    updated: duplicateAction === 'replace' ? dataRows : 0,
    failed: 0,
    errors: [],
  }
}

/**
 * CSV Import types — mirrors backend schemas/csv.py.
 */

/** Per-row validation result. */
export interface CsvRowValidation {
  row: number
  name: string
  ip: string
  status: 'valid' | 'warning' | 'error'
  errors: string[]
  warnings: string[]
}

/** Validation response from POST /api/csv/validate. */
export interface CsvValidationResponse {
  total_rows: number
  valid_rows: number
  warning_rows: number
  error_rows: number
  rows: CsvRowValidation[]
  can_import: boolean
}

/** Import result summary from POST /api/csv/import. */
export interface CsvImportSummary {
  total: number
  imported: number
  skipped: number
  updated: number
  failed: number
  errors: string[]
}

/** Template metadata from GET /api/csv/template/info. */
export interface CsvTemplateInfo {
  filename: string
  columns: string[]
  device_types: string[]
}

/** Duplicate handling mode. */
export type DuplicateAction = 'skip' | 'replace'

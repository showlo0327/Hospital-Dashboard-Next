/**
 * Frontend API types — mirrors the backend Pydantic response schemas.
 *
 * Every API response is wrapped in the standard APIResponse envelope.
 * These types are shared by the API client, services, and stores.
 */

import type { Device } from './device'

// ═══════════════════════════════════════════════════════
// Data Mode
// ═══════════════════════════════════════════════════════

/**
 * Centralized data source toggle.
 *
 * 'mock'    — uses the mock repository (services/mock/)
 * 'backend' — uses the FastAPI backend (services/*.service.ts)
 *
 * Switch this to 'backend' when the backend server is running.
 * Future: read from environment variable or localStorage setting.
 */
export type DataMode = 'mock' | 'backend'

/** Current data mode — change here to switch globally. */
export const DATA_MODE: DataMode = (import.meta.env.VITE_DATA_MODE as DataMode) || 'mock'

// ═══════════════════════════════════════════════════════
// Standard API Envelope
// ═══════════════════════════════════════════════════════

export interface APIResponse<T = unknown> {
  success: boolean
  message: string
  data: T | null
}

export interface APIError {
  success: false
  message: string
  detail?: string
}

// ═══════════════════════════════════════════════════════
// Device Endpoints
// ═══════════════════════════════════════════════════════

/** Backend GET /api/devices returns { total, devices } inside the API envelope. */
export interface DeviceListWrapper {
  total: number
  devices: Device[]
}

export interface DeviceCreatePayload {
  name: string
  ip: string
  mac?: string
  type: string
  vendor: string
  model: string
  building: string
  floor: string
  department: string
  location: string
  remark?: string
}

export interface DeviceUpdatePayload extends Partial<DeviceCreatePayload> {
  status?: string
  latency?: number
  availability?: number
  packetLoss?: number
}

// ═══════════════════════════════════════════════════════
// Dashboard Endpoints
// ═══════════════════════════════════════════════════════

/** Backend GET /api/dashboard/statistics returns this inside the API envelope. */
export interface DashboardStatisticsResponse {
  total: number
  online: number
  offline: number
  warning: number
  maintenance: number
  unknown: number
  averageLatency: number
  onlinePercentage: number
}

// ═══════════════════════════════════════════════════════
// System Endpoints
// ═══════════════════════════════════════════════════════

export interface SystemHealthResponse {
  status: string
  version: string
}

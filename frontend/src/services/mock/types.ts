/**
 * Mock data layer types.
 * Mirror of the backend API contract — replaced by API types in production.
 */
import type { Device, DeviceStatus } from '@/types/device'

/** Derived dashboard statistics computed from device repository. */
export interface DeviceStatistics {
  total: number
  online: number
  offline: number
  warning: number
  averageLatency: number
  onlinePercentage: number
}

/** Device repository public contract. */
export interface DeviceRepository {
  getAll(): Device[]
  getById(id: string): Device | undefined
  getByStatus(status: DeviceStatus): Device[]
  getStatistics(): DeviceStatistics
  create(device: Device): Device
  update(id: string, updates: Partial<Device>): Device | undefined
  delete(id: string): boolean
}

/**
 * Unified mock data facade — SINGLE SOURCE OF TRUTH.
 *
 * All UI components, stores, and services consume data through this facade.
 * Future: swap mock repository for FastAPI repository without modifying consumers.
 */
import type { Device } from '@/types/device'
import { DeviceStatus } from '@/types/device'
import { getAllDevices } from './devices'
import { computeStatistics } from './statistics'
import type { DeviceStatistics, DeviceRepository } from './types'

class MockDeviceRepository implements DeviceRepository {
  private devices: Device[]

  constructor() {
    this.devices = this._loadFromStorage() || getAllDevices()
  }

  private _loadFromStorage(): Device[] | null {
    try {
      const stored = localStorage.getItem('hospital_devices_mock')
      if (stored) return JSON.parse(stored) as Device[]
    } catch { /* ignore corrupt data */ }
    return null
  }

  private _saveToStorage(): void {
    try {
      localStorage.setItem('hospital_devices_mock', JSON.stringify(this.devices))
    } catch { /* storage full or unavailable */ }
  }

  getAll(): Device[] {
    return this.devices
  }

  getById(id: string): Device | undefined {
    return this.devices.find((d) => d.id === id)
  }

  getByStatus(status: DeviceStatus): Device[] {
    return this.devices.filter((d) => d.status === status)
  }

  getStatistics(): DeviceStatistics {
    return computeStatistics(this.devices)
  }

  create(device: Device): Device {
    this.devices.push(device)
    this._saveToStorage()
    return device
  }

  update(id: string, updates: Partial<Device>): Device | undefined {
    const idx = this.devices.findIndex((d) => d.id === id)
    if (idx === -1) return undefined
    this.devices[idx] = { ...this.devices[idx], ...updates }
    this._saveToStorage()
    return this.devices[idx]
  }

  delete(id: string): boolean {
    const len = this.devices.length
    this.devices = this.devices.filter((d) => d.id !== id)
    this._saveToStorage()
    return this.devices.length < len
  }
}

/** Singleton instance — consumed by Pinia store. */
export const deviceRepository: DeviceRepository = new MockDeviceRepository()

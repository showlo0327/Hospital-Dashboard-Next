/**
 * Device Service — wraps the FastAPI device endpoints.
 *
 * Every method here calls the centralized API client.
 * No component or store may call apiClient directly — always through a service.
 *
 * Architecture: Component → Store → Service → API Client → Backend
 */

import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { Device } from '@/types/device'
import type { DeviceCreatePayload, DeviceUpdatePayload, DeviceListWrapper } from '@/types/api'

// ── Data Source Audit ──
const AUDIT_TAG = '[DataAudit:deviceService]'

export const deviceService = {
  /**
   * Fetch all devices.
   *
   * Backend returns: APIResponse<{ total, devices: Device[] }>
   * We unwrap to just Device[] for the store.
   */
  async getAll(): Promise<Device[]> {
    const wrapper = await apiClient.get<DeviceListWrapper>(ENDPOINTS.DEVICES)
    const count = wrapper.devices?.length ?? 0
    console.log(AUDIT_TAG, 'getAll() → API returned', count, 'devices | first ip =', wrapper.devices?.[0]?.ip ?? 'N/A')
    return wrapper.devices ?? []
  },

  /** Fetch a single device by id. */
  async getById(id: string): Promise<Device> {
    return apiClient.get<Device>(ENDPOINTS.DEVICE_BY_ID(id))
  },

  /** Create a new device. */
  async create(payload: DeviceCreatePayload): Promise<Device> {
    return apiClient.post<Device>(ENDPOINTS.DEVICES, payload)
  },

  /** Update an existing device. */
  async update(id: string, payload: DeviceUpdatePayload): Promise<Device> {
    return apiClient.put<Device>(ENDPOINTS.DEVICE_BY_ID(id), payload)
  },

  /** Delete a device. */
  async remove(id: string): Promise<void> {
    return apiClient.delete<void>(ENDPOINTS.DEVICE_BY_ID(id))
  },
}

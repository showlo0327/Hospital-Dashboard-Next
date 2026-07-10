/**
 * Assets composable — device CRUD operations layered over the store.
 *
 * Provides create/update/delete actions that delegate to either
 * the mock repository or the backend service based on DATA_MODE.
 *
 * Architecture: Page → useAssets → useDeviceStore → Service/Mock → Backend/Repo
 */

import { ref } from 'vue'
import { useDeviceStore } from '@/stores/devices'
import { deviceService } from '@/services/deviceService'
import { DATA_MODE } from '@/types/api'
import { deviceRepository } from '@/services/mock/repository'
import type { Device } from '@/types/device'
import type { DeviceCreatePayload, DeviceUpdatePayload } from '@/types/api'

export function useAssets() {
  const store = useDeviceStore()
  const saving = ref(false)
  const saveError = ref<string | null>(null)

  async function createDevice(payload: DeviceCreatePayload): Promise<Device | null> {
    saving.value = true
    saveError.value = null
    try {
      if (DATA_MODE === 'mock') {
        // Mock: generate id and add to repository
        const newDevice: Device = {
          id: `D${String(deviceRepository.getAll().length + 1).padStart(3, '0')}`,
          name: payload.name,
          ip: payload.ip,
          type: payload.type as Device['type'],
          vendor: payload.vendor,
          model: payload.model,
          building: payload.building,
          floor: payload.floor,
          location: payload.location,
          department: payload.department,
          status: 'Unknown' as Device['status'],
          latency: 0,
          availability: 100,
          packetLoss: 0,
          updated: 'Just now',
          history: [],
        }
        deviceRepository.create(newDevice)
        await store.fetchAll()
        return newDevice
      }
      const device = await deviceService.create(payload)
      await store.fetchAll()
      return device
    } catch (err) {
      saveError.value = err instanceof Error ? err.message : 'Failed to create device'
      return null
    } finally {
      saving.value = false
    }
  }

  async function updateDevice(id: string, payload: DeviceUpdatePayload): Promise<Device | null> {
    saving.value = true
    saveError.value = null
    try {
      if (DATA_MODE === 'mock') {
        const updated = deviceRepository.update(id, payload as Partial<Device>)
        await store.fetchAll()
        return updated ?? null
      }
      const device = await deviceService.update(id, payload)
      await store.fetchAll()
      return device
    } catch (err) {
      saveError.value = err instanceof Error ? err.message : 'Failed to update device'
      return null
    } finally {
      saving.value = false
    }
  }

  async function deleteDevice(id: string): Promise<boolean> {
    saving.value = true
    saveError.value = null
    try {
      if (DATA_MODE === 'mock') {
        const ok = deviceRepository.delete(id)
        await store.fetchAll()
        return ok
      }
      await deviceService.remove(id)
      await store.fetchAll()
      return true
    } catch (err) {
      saveError.value = err instanceof Error ? err.message : 'Failed to delete device'
      return false
    } finally {
      saving.value = false
    }
  }

  return {
    saving,
    saveError,
    createDevice,
    updateDevice,
    deleteDevice,
  }
}

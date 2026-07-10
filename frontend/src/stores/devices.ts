/**
 * Devices Pinia store — the single source of device data for all components.
 *
 * Supports two modes via the centralized DATA_MODE flag:
 *   'mock'    → synchronous mock repository (services/mock/)
 *   'backend' → async FastAPI backend (services/deviceService.ts)
 *
 * Public contract:
 *   devices      — reactive Device[] (always available)
 *   statistics   — derived DeviceStatistics (always available)
 *   loading      — true while fetching from backend (false in mock mode)
 *   error        — error message or null
 *   fetchAll()   — load devices (no-op after first call in mock mode)
 *   getById()    — lookup by id (works in both modes)
 *   createDevice — create new device, persist, refresh
 *   updateDevice — update existing device, persist, refresh
 *   deleteDevice — delete device, persist, refresh
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Device, DeviceStatus } from '@/types/device'
import { DATA_MODE } from '@/types/api'
import type { DeviceStatistics } from '@/services/mock/types'
import { deviceRepository } from '@/services/mock/repository'
import { deviceService } from '@/services/deviceService'

// ── Data Source Audit ──
const AUDIT_TAG = '[DataAudit:deviceStore]'

export const useDeviceStore = defineStore('devices', () => {
  // ── State ──
  const devices = ref<Device[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const _initialized = ref(false)
  let _backendChecked = false
  let _pollInterval: ReturnType<typeof setInterval> | null = null

  // ── Derived statistics ──
  const statistics = computed<DeviceStatistics>(() => {
    const all = devices.value
    const total = all.length
    const online = all.filter((d) => d.status === ('Online' as DeviceStatus)).length
    const offline = all.filter((d) => d.status === ('Offline' as DeviceStatus)).length
    const warning = all.filter((d) => d.status === ('Warning' as DeviceStatus)).length
    const onlineDevices = all.filter((d) => d.status === ('Online' as DeviceStatus))
    const averageLatency =
      onlineDevices.length > 0
        ? Math.round(onlineDevices.reduce((sum, d) => sum + d.latency, 0) / onlineDevices.length)
        : 0
    const onlinePercentage = total > 0 ? Math.round((online / total) * 1000) / 10 : 0
    return { total, online, offline, warning, averageLatency, onlinePercentage }
  })

  // ── Auto-polling (backend mode only) ──

  /** Start periodic data refresh. Call from page onMounted. */
  function startPolling(): void {
    if (_effectiveMode !== 'backend') return
    stopPolling() // clear any existing
    _pollInterval = setInterval(async () => {
      try {
        const fresh = await deviceService.getAll()
        console.log(AUDIT_TAG, 'poll →', fresh.length, 'devices')
        devices.value = fresh
        error.value = null
      } catch (err) {
        console.error(AUDIT_TAG, 'poll → FAILED:', err)
        error.value = err instanceof Error ? err.message : 'Polling failed'
      }
    }, 10_000)
  }

  /** Stop periodic refresh. Call from page onUnmounted. */
  function stopPolling(): void {
    if (_pollInterval !== null) {
      clearInterval(_pollInterval)
      _pollInterval = null
    }
  }

  // ── Helpers ──

  function _refreshFromRepo() {
    devices.value = deviceRepository.getAll()
  }

  async function _notifyPingEngine() {
    if (_effectiveMode !== 'backend') return
    try {
      await fetch('/api/ping/reload', { method: 'POST' })
    } catch { /* best-effort, don't block UI */ }
  }

  // ── Actions ──

  async function fetchAll(): Promise<void> {
    // Show loading state on first load or whenever devices are empty
    if (devices.value.length === 0) {
      loading.value = true
    }

    // First call: detect backend availability
    if (!_backendChecked) {
      _backendChecked = true
      const backendAvailable = await _detectBackend()
      if (backendAvailable) {
        console.log(AUDIT_TAG, 'fetchAll() → backend available, loading real data')
      } else if (_effectiveMode === 'mock') {
        console.log(AUDIT_TAG, 'fetchAll() → backend unavailable, falling back to mock')
      }
    }

    // Mock mode: load from mock repository
    if (_effectiveMode === 'mock') {
      if (!_initialized.value || devices.value.length === 0) {
        devices.value = deviceRepository.getAll()
        console.log(AUDIT_TAG, 'fetchAll() → mock loaded', devices.value.length, 'devices')
        _initialized.value = true
      }
      loading.value = false
      return
    }
    console.log(AUDIT_TAG, 'fetchAll() → backend mode, calling deviceService.getAll()')
    loading.value = true
    error.value = null
    try {
      devices.value = await deviceService.getAll()
      console.log(AUDIT_TAG, 'fetchAll() → backend returned', devices.value.length, 'devices')
    } catch (err) {
      console.error(AUDIT_TAG, 'fetchAll() → backend FAILED:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load devices'
    } finally {
      loading.value = false
      _initialized.value = true
    }
  }

  function getById(id: string): Device | undefined {
    if (_effectiveMode === 'mock') return deviceRepository.getById(id)
    return devices.value.find((d) => d.id === id)
  }

  async function createDevice(payload: Omit<Device, 'id' | 'status' | 'latency' | 'availability' | 'packetLoss' | 'updated' | 'history'> & { remark?: string }): Promise<Device> {
    const now = new Date().toLocaleString('zh-CN', { hour12: false })
    const history = Array.from({ length: 30 }, () => 0)
    if (_effectiveMode === 'mock') {
      const maxId = devices.value.reduce((max, d) => {
        const num = parseInt(d.id.replace('D', ''), 10)
        return num > max ? num : max
      }, 0)
      const device: Device = {
        id: `D${String(maxId + 1).padStart(3, '0')}`,
        status: 'Unknown' as DeviceStatus,
        latency: 0, availability: 0, packetLoss: 0,
        updated: now, history,
        ...payload,
      } as Device
      deviceRepository.create(device)
      _refreshFromRepo()
      _notifyPingEngine()
      return device
    }
    const created = await deviceService.create({
      name: payload.name, ip: payload.ip, mac: payload.mac || '', type: payload.type,
      vendor: payload.vendor, model: payload.model,
      building: payload.building, floor: payload.floor,
      department: payload.department, location: payload.location,
      remark: payload.remark || '',
    })
    await fetchAll()
    _notifyPingEngine()
    return created
  }

  async function updateDevice(id: string, payload: Partial<Device>): Promise<Device | undefined> {
    if (_effectiveMode === 'mock') {
      const updated = deviceRepository.update(id, payload)
      if (updated) _refreshFromRepo()
      _notifyPingEngine()
      return updated
    }
    await deviceService.update(id, payload)
    await fetchAll()
    _notifyPingEngine()
    return devices.value.find(d => d.id === id)
  }

  async function deleteDevice(id: string): Promise<boolean> {
    if (_effectiveMode === 'mock') {
      const ok = deviceRepository.delete(id)
      if (ok) _refreshFromRepo()
      _notifyPingEngine()
      return ok
    }
    await deviceService.remove(id)
    await fetchAll()
    _notifyPingEngine()
    return true
  }

  // ── Runtime data source detection ──
  // Priority: VITE_DATA_MODE env → auto-detect backend → mock fallback
  //
  // CRITICAL: Demo/mock data must NEVER be the default.
  // On init, stay EMPTY. On first fetchAll, try backend first.
  // Only fall back to mock if backend is definitely unavailable.
  let _effectiveMode: 'mock' | 'backend' = DATA_MODE

  async function _detectBackend(): Promise<boolean> {
    try {
      const resp = await fetch('http://localhost:8000/api/system/health', { signal: AbortSignal.timeout(2000) })
      if (resp.ok) {
        console.log(AUDIT_TAG, 'Backend DETECTED — switching to backend mode')
        _effectiveMode = 'backend'
        return true
      }
    } catch { /* backend not available */ }
    return false
  }

  // DO NOT load any data at module init.
  // Pages must explicitly call fetchAll() which determines the correct source.
  // This prevents demo/mock data from ever being the default display.
  console.log(AUDIT_TAG, 'MODULE INIT → empty, waiting for fetchAll() | DATA_MODE =', DATA_MODE)

  return {
    devices, statistics, loading, error,
    fetchAll, getById,
    createDevice, updateDevice, deleteDevice,
    startPolling, stopPolling,
  }
})

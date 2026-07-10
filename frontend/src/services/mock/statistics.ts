/**
 * Derived dashboard statistics.
 * Never hardcode — always computed from the device repository.
 */
import type { Device } from '@/types/device'
import { DeviceStatus } from '@/types/device'
import type { DeviceStatistics } from './types'

export function computeStatistics(devices: Device[]): DeviceStatistics {
  const total = devices.length
  const online = devices.filter((d) => d.status === DeviceStatus.Online).length
  const offline = devices.filter((d) => d.status === DeviceStatus.Offline).length
  const warning = devices.filter((d) => d.status === DeviceStatus.Warning).length

  const onlineDevices = devices.filter((d) => d.status === DeviceStatus.Online)
  const averageLatency =
    onlineDevices.length > 0
      ? Math.round(
          onlineDevices.reduce((sum, d) => sum + d.latency, 0) / onlineDevices.length,
        )
      : 0

  const onlinePercentage = total > 0 ? Math.round((online / total) * 1000) / 10 : 0

  return { total, online, offline, warning, averageLatency, onlinePercentage }
}

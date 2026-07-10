/**
 * Device Selection composable — manages selected device state via the UI store.
 *
 * Used by DashboardPage, DeviceList, DeviceGrid, and InspectorPanel.
 * Single source of truth: useUIStore.selectedDeviceId.
 *
 * Architecture: Component → useDeviceSelection → useUIStore + useDeviceStore
 */

import { computed } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useDeviceStore } from '@/stores/devices'

export function useDeviceSelection() {
  const ui = useUIStore()
  const deviceStore = useDeviceStore()

  const selectedDevice = computed(() => {
    if (!ui.selectedDeviceId) return null
    return deviceStore.getById(ui.selectedDeviceId) ?? null
  })

  function select(id: string | null) {
    ui.selectDevice(id)
  }

  function clear() {
    ui.clearSelection()
  }

  return {
    selectedDeviceId: computed(() => ui.selectedDeviceId),
    selectedDevice,
    select,
    clear,
  }
}

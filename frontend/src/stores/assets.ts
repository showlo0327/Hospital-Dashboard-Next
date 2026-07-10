/**
 * Assets Pinia store — master data management for the Assets page.
 *
 * Delegates listing to useDeviceStore. Provides asset-specific state
 * like search query, filter state, pagination, and selection.
 *
 * Architecture: Page → useAssetsStore → useDeviceStore → Service/Mock → Backend/Repo
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useDeviceStore } from './devices'

export const useAssetsStore = defineStore('assets', () => {
  const deviceStore = useDeviceStore()

  // ── Search & Filter ──
  const searchQuery = ref('')
  const filterOpen = ref(false)

  const filteredDevices = computed(() => {
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return deviceStore.devices
    return deviceStore.devices.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.ip.includes(q) ||
        d.vendor.toLowerCase().includes(q) ||
        d.model.toLowerCase().includes(q) ||
        d.building.toLowerCase().includes(q) ||
        d.floor.toLowerCase().includes(q) ||
        (d as any).department?.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q),
    )
  })

  // ── Selection ──
  const selectedIds = ref<string[]>([])

  function setSelection(ids: string[]) {
    selectedIds.value = ids
  }

  function clearSelection() {
    selectedIds.value = []
  }

  // ── Pagination ──
  const currentPage = ref(1)
  const pageSize = 20

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredDevices.value.length / pageSize)),
  )

  const paginatedDevices = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return filteredDevices.value.slice(start, start + pageSize)
  })

  return {
    searchQuery,
    filterOpen,
    filteredDevices,
    selectedIds,
    setSelection,
    clearSelection,
    currentPage,
    pageSize,
    totalPages,
    paginatedDevices,
  }
})

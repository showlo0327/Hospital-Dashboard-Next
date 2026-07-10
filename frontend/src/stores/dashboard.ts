/**
 * Dashboard Pinia store — cached dashboard statistics from the backend.
 *
 * Architecture: Component → useDashboardStore → dashboardService → API Client → Backend
 *
 * In mock mode, delegates to the device store's computed statistics.
 */

import { ref } from 'vue'
import { defineStore } from 'pinia'
import { DATA_MODE } from '@/types/api'
import type { DashboardStatisticsResponse } from '@/types/api'
import { dashboardService } from '@/services/dashboardService'
import { useDeviceStore } from './devices'

export const useDashboardStore = defineStore('dashboard', () => {
  const statistics = ref<DashboardStatisticsResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  /** Fetch statistics from backend or derive from mock store. */
  async function fetchStatistics(): Promise<void> {
    if (DATA_MODE === 'mock') {
      const deviceStore = useDeviceStore()
      const s = deviceStore.statistics
      statistics.value = {
        total: s.total,
        online: s.online,
        offline: s.offline,
        warning: s.warning,
        averageLatency: s.averageLatency,
        onlinePercentage: s.onlinePercentage,
      }
      return
    }

    loading.value = true
    error.value = null
    try {
      statistics.value = await dashboardService.getStatistics()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load statistics'
    } finally {
      loading.value = false
    }
  }

  return {
    statistics,
    loading,
    error,
    fetchStatistics,
  }
})

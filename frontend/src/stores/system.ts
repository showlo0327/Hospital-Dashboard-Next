/**
 * System Pinia store — backend health and config state.
 *
 * Architecture: Component → useSystemStore → systemService → API Client → Backend
 *
 * Future: getConfig(), updateConfig() for the Settings page.
 */

import { ref } from 'vue'
import { defineStore } from 'pinia'
import { DATA_MODE } from '@/types/api'
import type { SystemHealthResponse } from '@/types/api'
import { systemService } from '@/services/systemService'

export const useSystemStore = defineStore('system', () => {
  const health = ref<SystemHealthResponse | null>(null)
  const healthLoading = ref(false)
  const healthError = ref<string | null>(null)

  /** Check backend health. In mock mode, returns a synthetic response. */
  async function checkHealth(): Promise<void> {
    if (DATA_MODE === 'mock') {
      health.value = { status: 'healthy (mock)', version: '2.10.0-mock' }
      return
    }

    healthLoading.value = true
    healthError.value = null
    try {
      health.value = await systemService.getHealth()
    } catch (err) {
      healthError.value = err instanceof Error ? err.message : 'Health check failed'
    } finally {
      healthLoading.value = false
    }
  }

  return {
    health,
    healthLoading,
    healthError,
    checkHealth,
  }
})

/**
 * System Service — wraps the FastAPI system endpoints.
 *
 * Current: health check
 * Future:  getConfig(), updateConfig()
 *
 * Architecture: Component → Store → Service → API Client → Backend
 */

import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { SystemHealthResponse } from '@/types/api'

export const systemService = {
  /** Check backend health. */
  async getHealth(): Promise<SystemHealthResponse> {
    return apiClient.get<SystemHealthResponse>(ENDPOINTS.SYSTEM_HEALTH)
  },
}

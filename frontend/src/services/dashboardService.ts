/**
 * Dashboard Service — wraps the FastAPI dashboard endpoints.
 *
 * Architecture: Component → Store → Service → API Client → Backend
 */

import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { DashboardStatisticsResponse } from '@/types/api'

export const dashboardService = {
  /** Fetch aggregated dashboard statistics. */
  async getStatistics(): Promise<DashboardStatisticsResponse> {
    return apiClient.get<DashboardStatisticsResponse>(ENDPOINTS.DASHBOARD_STATISTICS)
  },
}

/**
 * API endpoint constants — single source of truth for route paths.
 *
 * Every backend route is defined here exactly once.
 * Services reference these constants — never hardcode URL strings.
 */

export const ENDPOINTS = {
  // Devices
  DEVICES: '/devices',
  DEVICE_BY_ID: (id: string) => `/devices/${id}`,

  // Dashboard
  DASHBOARD_STATISTICS: '/dashboard/statistics',

  // Ping
  PING_STATUS: '/ping/status',
  PING_STATUS_BY_ID: (id: string) => `/ping/status/${id}`,
  PING_STATISTICS: '/ping/statistics',

  // System
  SYSTEM_HEALTH: '/system/health',
} as const

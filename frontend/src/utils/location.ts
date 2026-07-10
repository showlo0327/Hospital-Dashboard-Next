/**
 * Unified Location Path formatter — SINGLE SOURCE OF TRUTH.
 *
 * Every location summary must use this formatter.
 * Never concatenate building/floor/department/location manually.
 *
 * Format: Building › Floor › Department › Location
 *
 * Future expansion: Campus › Building › Floor › Department › Location
 * (add `campus` parameter — existing callers remain unaffected)
 *
 * @example
 *   formatLocationPath({ building: '门诊楼', floor: '1F', department: '急诊科', location: '203诊室' })
 *   // → '门诊楼 › 1F › 急诊科 › 203诊室'
 *
 * @example
 *   formatLocationPath({ building: 'Main Campus', floor: 'B1', department: 'IT' })
 *   // → 'Main Campus › B1 › IT'
 */

export interface LocationParts {
  campus?: string
  building?: string
  floor?: string
  department?: string
  location?: string
}

/** Hierarchy separator — visually represents location depth. */
export const LOCATION_SEPARATOR = ' › '

/**
 * Format a location path from device location parts.
 * Skips empty/undefined parts automatically.
 */
export function formatLocationPath(parts: LocationParts): string {
  const segments: string[] = []

  if (parts.campus) segments.push(parts.campus)
  if (parts.building) segments.push(parts.building)
  if (parts.floor) segments.push(parts.floor)
  if (parts.department) segments.push(parts.department)
  if (parts.location) segments.push(parts.location)

  return segments.join(LOCATION_SEPARATOR)
}

/**
 * Format a full location path from a device-like object.
 * Convenience wrapper — same as formatLocationPath but destructures for you.
 */
export function formatDeviceLocation(device: {
  campus?: string
  building?: string
  floor?: string
  department?: string
  location?: string
}): string {
  return formatLocationPath({
    campus: device.campus,
    building: device.building,
    floor: device.floor,
    department: device.department,
    location: device.location,
  })
}

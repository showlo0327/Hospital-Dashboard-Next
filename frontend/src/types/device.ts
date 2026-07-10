/**
 * ─── Hospital Device Type System ───
 *
 * SINGLE SOURCE OF TRUTH for every device type in the application.
 * Never use raw strings for device types — always reference this system.
 *
 * Modules that depend on this system:
 *   - Device Card System    (components/devices/*)
 *   - Device List View       (components/devices/DeviceList*)
 *   - Device Grid View       (components/devices/DeviceGrid*)
 *   - Inspector Panel        (components/layout/DeviceDetailPanel*)
 *   - Search Results         (future)
 *   - Assets Preview         (future)
 *   - SNMP Module            (future)
 *   - Alarm Center           (future)
 *   - CSV Import             (future)
 *   - Backend Ping Engine    (future)
 *
 * @version 2.3.1 — Centralized Device Type System
 */

// ═══════════════════════════════════════════════════════════════════════════
// Device Category
// ═══════════════════════════════════════════════════════════════════════════

export enum DeviceCategory {
  Network = 'Network',
  Compute = 'Compute',
  Endpoint = 'Endpoint',
  Other = 'Other',
}

// ═══════════════════════════════════════════════════════════════════════════
// Device Type
// ═══════════════════════════════════════════════════════════════════════════

export enum DeviceType {
  // ── Network ──
  CoreSwitch = 'CoreSwitch',
  AggregationSwitch = 'AggregationSwitch',
  AccessSwitch = 'AccessSwitch',
  Firewall = 'Firewall',
  WirelessAP = 'WirelessAP',
  Internet = 'Internet',

  // ── Compute ──
  Server = 'Server',
  VirtualizationPlatform = 'VirtualizationPlatform',

  // ── Endpoint ──
  DesktopPC = 'DesktopPC',
  CloudDesktop = 'CloudDesktop',
  PDA = 'PDA',
  MedicalDevice = 'MedicalDevice',
  SelfServiceKiosk = 'SelfServiceKiosk',
  Printer = 'Printer',

  // ── Other ──
  Unknown = 'Unknown',
}

// ═══════════════════════════════════════════════════════════════════════════
// Device Status
// ═══════════════════════════════════════════════════════════════════════════

export enum DeviceStatus {
  Online = 'Online',
  Warning = 'Warning',
  Offline = 'Offline',
  Maintenance = 'Maintenance',
  Unknown = 'Unknown',
}

// ═══════════════════════════════════════════════════════════════════════════
// Device Type Metadata
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Every device type carries rich metadata so that display components
 * never need to encode device-specific knowledge.
 */
export interface DeviceTypeMeta {
  /** Enum key (e.g. DeviceType.CoreSwitch) */
  type: DeviceType
  /** Human-readable display name (e.g. "Core Switch") */
  displayName: string
  /** Top-level category */
  category: DeviceCategory
  /**
   * Badge accent color — Tailwind border/text class for the type badge.
   * Format: "border-{color}-400 text-{color}-700 dark:text-{color}-400"
   */
  badgeColor: string
  /** Short description shown in tooltips / inspector */
  description: string
  /** Notes for future modules (SNMP OID, MIB, discovery hints) */
  futureExtensionNotes: string
}

// ═══════════════════════════════════════════════════════════════════════════
// Centralized Metadata Map
// ═══════════════════════════════════════════════════════════════════════════

export const DEVICE_TYPE_META: Record<DeviceType, DeviceTypeMeta> = {
  // ── Network ──
  [DeviceType.CoreSwitch]: {
    type: DeviceType.CoreSwitch,
    displayName: 'Core Switch',
    category: DeviceCategory.Network,
    badgeColor:
      'border-blue-400 text-blue-700 dark:border-blue-400 dark:text-blue-300',
    description: 'High-capacity backbone switch at the network core layer.',
    futureExtensionNotes:
      'SNMP: BRIDGE-MIB, CISCO-STACK-MIB. Discovery: CDP/LLDP neighbors.',
  },
  [DeviceType.AggregationSwitch]: {
    type: DeviceType.AggregationSwitch,
    displayName: 'Aggregation Switch',
    category: DeviceCategory.Network,
    badgeColor:
      'border-cyan-400 text-cyan-700 dark:border-cyan-400 dark:text-cyan-300',
    description: 'Distribution-layer switch aggregating access switches.',
    futureExtensionNotes:
      'SNMP: BRIDGE-MIB. Uplink monitoring via IF-MIB ifHCInOctets.',
  },
  [DeviceType.AccessSwitch]: {
    type: DeviceType.AccessSwitch,
    displayName: 'Access Switch',
    category: DeviceCategory.Network,
    badgeColor:
      'border-teal-400 text-teal-700 dark:border-teal-400 dark:text-teal-300',
    description: 'Edge switch connecting endpoint devices.',
    futureExtensionNotes:
      'SNMP: BRIDGE-MIB dot1dTpFdbTable for MAC address tracking.',
  },
  [DeviceType.Firewall]: {
    type: DeviceType.Firewall,
    displayName: 'Firewall',
    category: DeviceCategory.Network,
    badgeColor:
      'border-red-400 text-red-700 dark:border-red-400 dark:text-red-300',
    description: 'Network security appliance enforcing access policies.',
    futureExtensionNotes:
      'SNMP: CISCO-FIREWALL-MIB. Session/throughput counters.',
  },
  [DeviceType.WirelessAP]: {
    type: DeviceType.WirelessAP,
    displayName: 'Wireless AP',
    category: DeviceCategory.Network,
    badgeColor:
      'border-violet-400 text-violet-700 dark:border-violet-400 dark:text-violet-300',
    description: '802.11 wireless access point for client connectivity.',
    futureExtensionNotes:
      'SNMP: IEEE802dot11-MIB. Client count, channel utilization.',
  },
  [DeviceType.Internet]: {
    type: DeviceType.Internet,
    displayName: 'Internet',
    category: DeviceCategory.Network,
    badgeColor:
      'border-sky-400 text-sky-700 dark:border-sky-400 dark:text-sky-300',
    description: 'Internet gateway or upstream ISP link.',
    futureExtensionNotes:
      'SNMP: IF-MIB. WAN interface monitoring, throughput baselines.',
  },

  // ── Compute ──
  [DeviceType.Server]: {
    type: DeviceType.Server,
    displayName: 'Server',
    category: DeviceCategory.Compute,
    badgeColor:
      'border-emerald-400 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300',
    description: 'Physical or virtual server hosting hospital applications.',
    futureExtensionNotes:
      'SNMP: HOST-RESOURCES-MIB. CPU, memory, disk, process monitoring.',
  },
  [DeviceType.VirtualizationPlatform]: {
    type: DeviceType.VirtualizationPlatform,
    displayName: 'Virtualization Platform',
    category: DeviceCategory.Compute,
    badgeColor:
      'border-purple-400 text-purple-700 dark:border-purple-400 dark:text-purple-300',
    description: 'Hypervisor or container orchestration platform.',
    futureExtensionNotes:
      'SNMP: VMWARE-VMINFO-MIB. VM inventory, resource pools.',
  },

  // ── Endpoint ──
  [DeviceType.DesktopPC]: {
    type: DeviceType.DesktopPC,
    displayName: 'Desktop PC',
    category: DeviceCategory.Endpoint,
    badgeColor:
      'border-slate-400 text-slate-700 dark:border-slate-400 dark:text-slate-300',
    description: 'Standard desktop workstation for clinical or admin staff.',
    futureExtensionNotes:
      'SNMP: HOST-RESOURCES-MIB. Agentless polling preferred.',
  },
  [DeviceType.CloudDesktop]: {
    type: DeviceType.CloudDesktop,
    displayName: 'Cloud Desktop',
    category: DeviceCategory.Endpoint,
    badgeColor:
      'border-indigo-400 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300',
    description: 'Virtual desktop infrastructure (VDI) thin client.',
    futureExtensionNotes:
      'Agent-based monitoring via VDI broker API. SNMP limited.',
  },
  [DeviceType.PDA]: {
    type: DeviceType.PDA,
    displayName: 'PDA',
    category: DeviceCategory.Endpoint,
    badgeColor:
      'border-amber-400 text-amber-700 dark:border-amber-400 dark:text-amber-300',
    description: 'Handheld device for mobile clinical workflows.',
    futureExtensionNotes:
      'Wi-Fi RSSI monitoring. Connection stability baselines.',
  },
  [DeviceType.MedicalDevice]: {
    type: DeviceType.MedicalDevice,
    displayName: 'Medical Device',
    category: DeviceCategory.Endpoint,
    badgeColor:
      'border-rose-400 text-rose-700 dark:border-rose-400 dark:text-rose-300',
    description: 'Networked medical equipment (monitors, ventilators, pumps).',
    futureExtensionNotes:
      'Safety-critical. SNMP read-only. Alert on any connectivity change.',
  },
  [DeviceType.SelfServiceKiosk]: {
    type: DeviceType.SelfServiceKiosk,
    displayName: 'Self-Service Kiosk',
    category: DeviceCategory.Endpoint,
    badgeColor:
      'border-orange-400 text-orange-700 dark:border-orange-400 dark:text-orange-300',
    description: 'Patient check-in or information kiosk.',
    futureExtensionNotes:
      'Application-level health checks via HTTP endpoint.',
  },
  [DeviceType.Printer]: {
    type: DeviceType.Printer,
    displayName: 'Printer',
    category: DeviceCategory.Endpoint,
    badgeColor:
      'border-stone-400 text-stone-700 dark:border-stone-400 dark:text-stone-300',
    description: 'Networked printer or multi-function device.',
    futureExtensionNotes:
      'SNMP: PRINTER-MIB. Toner levels, page counts, jam alerts.',
  },

  // ── Other ──
  [DeviceType.Unknown]: {
    type: DeviceType.Unknown,
    displayName: 'Unknown',
    category: DeviceCategory.Other,
    badgeColor:
      'border-gray-400 text-gray-600 dark:border-gray-500 dark:text-gray-400',
    description: 'Unclassified or auto-discovered device pending identification.',
    futureExtensionNotes:
      'Discovery-only. Prompt user to classify during CSV import.',
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Retrieve full metadata for a device type.
 * Falls back to Unknown metadata if type is not found.
 */
export function getDeviceTypeMeta(type: DeviceType): DeviceTypeMeta {
  return DEVICE_TYPE_META[type] ?? DEVICE_TYPE_META[DeviceType.Unknown]
}

/**
 * Get all device types belonging to a category.
 */
export function getDeviceTypesByCategory(category: DeviceCategory): DeviceType[] {
  return Object.values(DEVICE_TYPE_META)
    .filter((meta) => meta.category === category)
    .map((meta) => meta.type)
}

/**
 * Get the human-readable display name for a device type.
 */
export function getDeviceDisplayName(type: DeviceType): string {
  return getDeviceTypeMeta(type).displayName
}

/**
 * Get the category of a device type.
 */
export function getDeviceCategory(type: DeviceType): DeviceCategory {
  return getDeviceTypeMeta(type).category
}

// ═══════════════════════════════════════════════════════════════════════════
// Device Data Model
// ═══════════════════════════════════════════════════════════════════════════

export interface Device {
  id: string
  name: string
  ip: string
  mac: string
  type: DeviceType
  vendor: string
  model: string
  building: string
  floor: string
  location: string
  department: string
  remark: string
  status: DeviceStatus
  latency: number
  availability: number
  packetLoss: number
  updated: string
  history: number[]
}

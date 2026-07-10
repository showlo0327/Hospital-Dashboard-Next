# DEVICE_STANDARD

## Centralized Device Type System (v2.5.0)

**Single source of truth** — `types/device.ts`

Never use raw strings for device types. Every module references `DeviceType` enum,
`DEVICE_TYPE_META` map, and helper functions from the centralized system.

---

---

## Device Data Model

### Required Fields

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Auto-generated (D001, D002, ...) |
| `name` | `string` | Human-readable device name |
| `ip` | `string` | IPv4 address (e.g. 10.10.1.1) |
| `type` | `DeviceType` | Enum value from centralized type system |
| `status` | `DeviceStatus` | Current status (Online/Warning/Offline/Unknown) |

### Optional Fields

| Field | Type | Description |
|---|---|---|
| `mac` | `string` | MAC address (AA:BB:CC:DD:EE:FF format) |
| `vendor` | `string` | Manufacturer name |
| `model` | `string` | Device model number |
| `building` | `string` | Building name |
| `floor` | `string` | Floor identifier (e.g. 1F, B1) |
| `department` | `string` | Department name |
| `location` | `string` | Room or area description |
| `remark` | `string` | Free-text notes |

### Display Format

**Location Summary**: `Building › Floor › Department › Location`

Example: `门诊楼 › 1F › 急诊科 › 203诊室`

Separator: ` › ` (hierarchy arrow, U+203A + space)

All location display uses `formatLocationPath()` from `utils/location.ts`.
No manual concatenation permitted.

Future expansion: `Campus › Building › Floor › Department › Location`

This format is used consistently across DeviceCard, Inspector, and any location display.

### MAC Address Validation

- Accepts: `AA:BB:CC:DD:EE:FF`, `AA-BB-CC-DD-EE-FF`, `AABBCCDDEEFF`
- Normalized to: `AA:BB:CC:DD:EE:FF` (colon-separated uppercase)
- Field is optional — empty MAC is valid


## Device Categories

| Category | Enum | Description |
|---|---|---|
| Network | `DeviceCategory.Network` | Infrastructure: switches, firewalls, APs, internet gateways |
| Compute | `DeviceCategory.Compute` | Servers, hypervisors, container platforms |
| Endpoint | `DeviceCategory.Endpoint` | User-facing: PCs, medical devices, kiosks, printers |
| Other | `DeviceCategory.Other` | Unclassified / auto-discovered |

---

## Device Types

### Network Devices

| Enum Key | Display Name | Badge Color | Description |
|---|---|---|---|
| `CoreSwitch` | Core Switch | Blue | High-capacity backbone switch |
| `AggregationSwitch` | Aggregation Switch | Cyan | Distribution-layer aggregation switch |
| `AccessSwitch` | Access Switch | Teal | Edge switch for endpoints |
| `Firewall` | Firewall | Red | Security appliance |
| `WirelessAP` | Wireless AP | Violet | 802.11 access point |
| `Internet` | Internet | Sky | ISP gateway / WAN link |

### Compute

| Enum Key | Display Name | Badge Color | Description |
|---|---|---|---|
| `Server` | Server | Emerald | Physical/virtual server |
| `VirtualizationPlatform` | Virtualization Platform | Purple | Hypervisor / container platform |

### Endpoints

| Enum Key | Display Name | Badge Color | Description |
|---|---|---|---|
| `DesktopPC` | Desktop PC | Slate | Clinical/admin workstation |
| `CloudDesktop` | Cloud Desktop | Indigo | VDI thin client |
| `PDA` | PDA | Amber | Handheld mobile device |
| `MedicalDevice` | Medical Device | Rose | Networked medical equipment |
| `SelfServiceKiosk` | Self-Service Kiosk | Orange | Patient check-in kiosk |
| `Printer` | Printer | Stone | Networked printer/MFD |

### Other

| Enum Key | Display Name | Badge Color | Description |
|---|---|---|---|
| `Unknown` | Unknown | Gray | Unclassified pending identification |

---

## Device Type Metadata

Every `DeviceType` carries a `DeviceTypeMeta` record with:

| Field | Type | Purpose |
|---|---|---|
| `type` | `DeviceType` | Enum key |
| `displayName` | `string` | Human-readable label |
| `category` | `DeviceCategory` | Top-level grouping |
| `badgeColor` | `string` | Tailwind border/text classes |
| `description` | `string` | Tooltip / inspector description |
| `futureExtensionNotes` | `string` | SNMP OID, MIB, discovery hints |

## Helper Functions

| Function | Returns | Purpose |
|---|---|---|
| `getDeviceTypeMeta(type)` | `DeviceTypeMeta` | Full metadata for a type |
| `getDeviceDisplayName(type)` | `string` | Display name |
| `getDeviceCategory(type)` | `DeviceCategory` | Category |
| `getDeviceTypesByCategory(cat)` | `DeviceType[]` | All types in a category |

## Device Data Model

| Field | Type | Example |
|---|---|---|
| `id` | `string` | uuid |
| `name` | `string` | Core-SW-OR-01 |
| `ip` | `string` | 10.12.0.11 |
| `type` | `DeviceType` | `DeviceType.CoreSwitch` |
| `vendor` | `string` | Cisco |
| `model` | `string` | Catalyst 9500X |
| `building` | `string` | Main Campus |
| `floor` | `string` | 3F |
| `location` | `string` | Operating Theater MDF |
| `latency` | `number` | 4 (ms) |
| `availability` | `number` | 99.99 (%) |
| `packetLoss` | `number` | 0 (%) |
| `status` | `DeviceStatus` | `DeviceStatus.Online` |
| `updated` | `string` | ISO 8601 |
| `history` | `number[]` | Last 30 ping values |

## Status Enum

| Enum Key | Display | Meaning |
|---|---|---|
| `Online` | Online | packetLoss === 0 AND latency < 100ms |
| `Warning` | Warning | packetLoss 1–49 OR latency ≥ 100ms |
| `Offline` | Offline | packetLoss === 100 |
| `Maintenance` | Maintenance | Planned downtime |
| `Unknown` | Unknown | No data available |

## Device Card Design System

### Component Inventory

14 atomic components in `components/devices/`:

| # | Component | Responsibility |
|---|---|---|
| 1 | `DeviceInfo` | Base label + value primitive |
| 2 | `DeviceIcon` | Device-type icon (centralized icon map) |
| 3 | `DeviceStatusBadge` | 5-state status pill |
| 4 | `DeviceHeader` | Name + IP row |
| 5 | `DeviceVendor` | Thin wrapper → DeviceInfo |
| 6 | `DeviceModel` | Thin wrapper → DeviceInfo |
| 7 | `DeviceLocation` | Building · Floor · Location |
| 8 | `DeviceLatency` | Traffic-light color coding |
| 9 | `DeviceHealthIndicator` | Availability % with dot |
| 10 | `DeviceSparkline` | SVG polyline (30 points) |
| 11 | `DeviceUpdatedTime` | "Updated {time}" text |
| 12 | `DeviceActions` | Slot-based action container |
| 13 | `DeviceSkeleton` | Loading placeholder |
| 14 | `DeviceCard` | Glass composite card |

### Card Specifications

| Property | Value |
|---|---|
| Min height | 258px |
| Border radius | 22px |
| Background | white/80% glass (dark: white/8%) |
| Shadow | 0 14px 38px rgba(15,23,42,0.07) |
| Hover | 150ms, -0.5px Y, shadow: 0 20px 55px |
| Selected | Scale 1.01, blue ring (primary/30), shadow: 0 16px 44px rgba(0,122,255,0.15) |
| Loading | DeviceSkeleton — pulsing, identical dimensions |
| Backdrop | blur-xl |

### Mock Data

16 devices in `composables/useDevices.ts`, covering all DeviceTypes:
- 6 Network, 2 Compute, 7 Endpoint, 1 Other
- Statuses: 11 Online, 2 Warning, 1 Offline, 1 Unknown, 1 Maintenance (future)
- Each device has a 30-point ping history array for DeviceSparkline

---

## Device Status Rules (v2.9.0 — Ping Engine)

The Ping Engine enforces anti-flap status transitions:

| Transition | Rule |
|---|---|
| Online → Warning | 1+ consecutive ping failures (but < 5) |
| Online → Offline | 5 consecutive ping failures |
| Offline → Online | 3 consecutive successful pings (recovery) |
| Recovering → Offline | Any failure during recovery resets to Offline |
| Warning → Online | Immediate upon first successful ping |

### Design decisions

- **Stability over responsiveness** — avoid status flapping in hospital environments
- **"Recovering"** is a runtime-only state (not a DeviceStatus enum value) — used internally by StatusCalculator
- **Latency** is a rolling average of the last 5 successful pings (not single-point)
- **History** buffer: 20 results per device (deque, maxlen=20)
- **Statistics** cached per scan cycle (30s default)

---

## CSV Import (v3.0.0)

### Template Columns

| Column | Required | Example |
|---|---|---|
| Name | ✅ | `Core-SW-01` |
| IP | ✅ | `10.12.0.10` |
| Vendor | | `Cisco` |
| Model | | `Catalyst 9500X` |
| DeviceType | | `CoreSwitch` |
| Building | | `Main Campus` |
| Floor | | `B1` |
| Department | | `IT Infrastructure` |
| Location | | `Data Center Rack A1` |
| Remark | | free text |

### Idempotency

- Duplicates detected by **IP address** (case-insensitive)
- `skip` mode (default): existing IPs are skipped — never creates duplicates
- `replace` mode: existing IPs are updated in-place
- Same CSV imported 10 times → no duplicate devices

### After Import

1. Asset list refreshes automatically
2. Dashboard statistics recompute from updated repository
3. Ping engine picks up new IPs on next scan cycle (≤30s)

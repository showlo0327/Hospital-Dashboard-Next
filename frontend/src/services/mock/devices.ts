/**
 * Centralized mock device repository — SINGLE SOURCE OF TRUTH.
 * 40 realistic hospital network devices across 4 campuses.
 *
 * Every UI component, store, and service must consume devices from here.
 * Never duplicate device data in components or composables.
 */
import { DeviceType, DeviceStatus } from '@/types/device'
import type { Device } from '@/types/device'

function h(values: number[]): number[] {
  return Array.from({ length: 30 }, (_, i) => values[i % values.length] ?? 4)
}

function stable(values: number[], spread = 2): number[] {
  const base = values[0] ?? 4
  return Array.from({ length: 30 }, () => base + Math.floor(Math.random() * spread))
}

export const devices: Device[] = [
  // ═══════════════════════════════════════════════════════════════
  // MAIN CAMPUS — 18 devices
  // ═══════════════════════════════════════════════════════════════

  // ── B1 (Basement / Data Center) — 4 devices ──
  {
    id: 'D001', name: 'Core-SW-DC-01', ip: '10.12.0.11',
    type: DeviceType.CoreSwitch, vendor: 'Cisco', model: 'Catalyst 9500X',
    building: 'Main Campus', floor: 'B1', department: 'IT Infrastructure',
    location: 'Data Center Rack A1',
    status: DeviceStatus.Online, latency: 4, availability: 99.99, packetLoss: 0,
    updated: '3 sec ago', history: h([4, 5, 4, 4, 6, 5, 4, 5, 4, 4, 5, 4, 6, 5, 4, 4, 7, 5, 4, 4, 5, 4, 6, 5, 4, 4, 5, 4, 6, 5]),
  },
  {
    id: 'D002', name: 'HIS-SRV-DC-02', ip: '10.12.0.51',
    type: DeviceType.Server, vendor: 'Dell', model: 'PowerEdge R750',
    building: 'Main Campus', floor: 'B1', department: 'HIS',
    location: 'Data Center Rack A3',
    status: DeviceStatus.Online, latency: 1, availability: 99.995, packetLoss: 0,
    updated: '1 sec ago', history: stable([1], 1),
  },
  {
    id: 'D003', name: 'VCS-Cluster-DC-03', ip: '10.12.0.60',
    type: DeviceType.VirtualizationPlatform, vendor: 'VMware', model: 'vSphere 8.0',
    building: 'Main Campus', floor: 'B1', department: 'IT Infrastructure',
    location: 'Data Center Rack B1',
    status: DeviceStatus.Online, latency: 3, availability: 99.98, packetLoss: 0,
    updated: '2 sec ago', history: stable([3], 1),
  },
  {
    id: 'D004', name: 'Agg-SW-DC-04', ip: '10.12.0.22',
    type: DeviceType.AggregationSwitch, vendor: 'HPE', model: 'Aruba 8320',
    building: 'Main Campus', floor: 'B1', department: 'IT Infrastructure',
    location: 'Data Center Rack D2',
    status: DeviceStatus.Online, latency: 7, availability: 99.96, packetLoss: 0,
    updated: '5 sec ago', history: stable([7], 2),
  },

  // ── 1F (Lobby, Admin, Reception) — 5 devices ──
  {
    id: 'D005', name: 'FW-Main-05', ip: '10.12.0.1',
    type: DeviceType.Firewall, vendor: 'Palo Alto', model: 'PA-5250',
    building: 'Main Campus', floor: '1F', department: 'IT Security',
    location: 'Security Operations Room',
    status: DeviceStatus.Online, latency: 2, availability: 99.999, packetLoss: 0,
    updated: '2 sec ago', history: stable([2], 1),
  },
  {
    id: 'D006', name: 'PC-Reception-06', ip: '10.12.1.201',
    type: DeviceType.DesktopPC, vendor: 'Lenovo', model: 'ThinkCentre M90q',
    building: 'Main Campus', floor: '1F', department: 'Administration',
    location: 'Reception Desk',
    status: DeviceStatus.Online, latency: 15, availability: 99.5, packetLoss: 0,
    updated: '18 sec ago', history: stable([15], 3),
  },
  {
    id: 'D007', name: 'ISP-Gateway-07', ip: '203.0.113.1',
    type: DeviceType.Internet, vendor: 'ISP', model: 'Dual WAN Gateway',
    building: 'Main Campus', floor: '1F', department: 'IT Infrastructure',
    location: 'MDF ISP Room',
    status: DeviceStatus.Online, latency: 28, availability: 99.75, packetLoss: 0,
    updated: '4 sec ago', history: stable([28], 4),
  },
  {
    id: 'D008', name: 'PRT-Admissions-08', ip: '10.12.1.90',
    type: DeviceType.Printer, vendor: 'HP', model: 'LaserJet M507',
    building: 'Main Campus', floor: '1F', department: 'Admissions',
    location: 'Admissions Office',
    status: DeviceStatus.Online, latency: 22, availability: 99.1, packetLoss: 0,
    updated: '14 sec ago', history: stable([22], 3),
  },
  {
    id: 'D009', name: 'Kiosk-Lobby-09', ip: '10.12.1.180',
    type: DeviceType.SelfServiceKiosk, vendor: 'KIOSK', model: 'K-Health 200',
    building: 'Main Campus', floor: '1F', department: 'Outpatient',
    location: 'Main Lobby',
    status: DeviceStatus.Offline, latency: 0, availability: 0, packetLoss: 100,
    updated: '5 min ago', history: h([0]),
  },

  // ── 2F (Wards, Nurse Stations) — 3 devices ──
  {
    id: 'D010', name: 'AP-2F-Nurse-10', ip: '10.12.2.101',
    type: DeviceType.WirelessAP, vendor: 'Aruba', model: 'AP-535',
    building: 'Main Campus', floor: '2F', department: 'Nursing',
    location: 'Nurse Station Corridor',
    status: DeviceStatus.Warning, latency: 45, availability: 98.5, packetLoss: 2.1,
    updated: '22 sec ago', history: h([35, 38, 42, 45, 48, 40, 52, 38, 44, 46, 50, 42, 38, 45, 48, 52, 40, 44, 46, 38, 50, 42, 45, 48, 38, 44, 50, 42, 46, 38]),
  },
  {
    id: 'D011', name: 'MED-Infusion-2F-11', ip: '10.12.2.135',
    type: DeviceType.MedicalDevice, vendor: 'B. Braun', model: 'Space Station',
    building: 'Main Campus', floor: '2F', department: 'Nursing',
    location: 'Ward 2A Nurses Station',
    status: DeviceStatus.Online, latency: 7, availability: 99.97, packetLoss: 0,
    updated: '6 sec ago', history: stable([7], 1),
  },
  {
    id: 'D012', name: 'VDI-Station-2F-12', ip: '10.12.2.50',
    type: DeviceType.CloudDesktop, vendor: 'IGEL', model: 'UD Pocket',
    building: 'Main Campus', floor: '2F', department: 'Nursing',
    location: 'Ward 2B Nurse Desk',
    status: DeviceStatus.Online, latency: 18, availability: 99.3, packetLoss: 0,
    updated: '11 sec ago', history: stable([18], 3),
  },

  // ── 3F (Operating Theater, Pharmacy) — 3 devices ──
  {
    id: 'D013', name: 'Acc-SW-3F-13', ip: '10.12.3.33',
    type: DeviceType.AccessSwitch, vendor: 'Huawei', model: 'S5735-L48P4X',
    building: 'Main Campus', floor: '3F', department: 'IT Infrastructure',
    location: 'Operating Theater IDF',
    status: DeviceStatus.Online, latency: 11, availability: 99.89, packetLoss: 0,
    updated: '7 sec ago', history: stable([11], 2),
  },
  {
    id: 'D014', name: 'VDI-Pharmacy-14', ip: '10.12.3.88',
    type: DeviceType.CloudDesktop, vendor: 'IGEL', model: 'UD Pocket',
    building: 'Main Campus', floor: '3F', department: 'Pharmacy',
    location: 'Pharmacy Dispensary',
    status: DeviceStatus.Online, latency: 16, availability: 99.4, packetLoss: 0,
    updated: '9 sec ago', history: stable([16], 2),
  },
  {
    id: 'D015', name: 'PRT-Pharmacy-15', ip: '10.12.3.91',
    type: DeviceType.Printer, vendor: 'HP', model: 'LaserJet M507',
    building: 'Main Campus', floor: '3F', department: 'Pharmacy',
    location: 'Pharmacy Back Office',
    status: DeviceStatus.Warning, latency: 72, availability: 97.8, packetLoss: 4.5,
    updated: '30 sec ago', history: h([65, 70, 72, 75, 68, 72, 78, 65, 70, 74, 72, 68, 75, 70, 72, 78, 65, 70, 74, 72, 68, 75, 70, 72, 78, 65, 70, 74, 72, 68]),
  },

  // ── 4F (ICU, Pediatrics) — 2 devices ──
  {
    id: 'D016', name: 'MED-Vent-ICU-16', ip: '10.12.4.120',
    type: DeviceType.MedicalDevice, vendor: 'Dräger', model: 'Evita V600',
    building: 'Main Campus', floor: '4F', department: 'ICU',
    location: 'ICU Bay 4',
    status: DeviceStatus.Online, latency: 10, availability: 99.99, packetLoss: 0,
    updated: '8 sec ago', history: stable([10], 1),
  },
  {
    id: 'D017', name: 'Kiosk-Peds-17', ip: '10.12.4.150',
    type: DeviceType.SelfServiceKiosk, vendor: 'KIOSK', model: 'K-Health 200',
    building: 'Main Campus', floor: '4F', department: 'Pediatrics',
    location: 'Pediatric Wing Lobby',
    status: DeviceStatus.Online, latency: 11, availability: 99.6, packetLoss: 0,
    updated: '10 sec ago', history: stable([11], 2),
  },

  // ── 5F (Lab, Wards) — 3 devices ──
  {
    id: 'D018', name: 'Acc-SW-5F-18', ip: '10.12.5.33',
    type: DeviceType.AccessSwitch, vendor: 'Cisco', model: 'Catalyst 9300',
    building: 'Main Campus', floor: '5F', department: 'IT Infrastructure',
    location: 'Ward 5B IDF',
    status: DeviceStatus.Online, latency: 12, availability: 99.87, packetLoss: 0,
    updated: '6 sec ago', history: stable([12], 2),
  },
  {
    id: 'D019', name: 'PC-Lab-5F-19', ip: '10.12.5.75',
    type: DeviceType.DesktopPC, vendor: 'HP', model: 'EliteDesk 800 G9',
    building: 'Main Campus', floor: '5F', department: 'Laboratory',
    location: 'Clinical Lab',
    status: DeviceStatus.Online, latency: 16, availability: 99.4, packetLoss: 0,
    updated: '13 sec ago', history: stable([16], 2),
  },
  {
    id: 'D020', name: 'AP-5F-Ward-20', ip: '10.12.5.105',
    type: DeviceType.WirelessAP, vendor: 'Aruba', model: 'AP-535',
    building: 'Main Campus', floor: '5F', department: 'Nursing',
    location: 'Ward 5A Corridor',
    status: DeviceStatus.Online, latency: 19, availability: 99.3, packetLoss: 0,
    updated: '15 sec ago', history: stable([19], 3),
  },

  // ═══════════════════════════════════════════════════════════════
  // EMERGENCY — 5 devices
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'D021', name: 'Acc-SW-ER-21', ip: '10.12.10.44',
    type: DeviceType.AccessSwitch, vendor: 'Cisco', model: 'Catalyst 9300',
    building: 'Emergency', floor: '1F', department: 'IT Infrastructure',
    location: 'ER Nurse Station',
    status: DeviceStatus.Online, latency: 9, availability: 99.91, packetLoss: 0,
    updated: '5 sec ago', history: stable([9], 2),
  },
  {
    id: 'D022', name: 'PDA-ER-Triage-22', ip: '10.12.10.55',
    type: DeviceType.PDA, vendor: 'Zebra', model: 'TC52-HC',
    building: 'Emergency', floor: '1F', department: 'Emergency',
    location: 'ER Triage Desk',
    status: DeviceStatus.Warning, latency: 85, availability: 96.2, packetLoss: 5.5,
    updated: '32 sec ago', history: h([65, 78, 82, 90, 75, 85, 92, 70, 80, 88, 95, 72, 68, 85, 90, 78, 82, 95, 70, 75, 88, 92, 68, 80, 85, 90, 72, 78, 95, 82]),
  },
  {
    id: 'D023', name: 'PRT-ER-23', ip: '10.12.10.88',
    type: DeviceType.Printer, vendor: 'Canon', model: 'imageRUNNER ADVANCE',
    building: 'Emergency', floor: '1F', department: 'Emergency',
    location: 'ER Admin Desk',
    status: DeviceStatus.Warning, latency: 95, availability: 97.1, packetLoss: 8.3,
    updated: '35 sec ago', history: h([85, 92, 98, 90, 95, 100, 88, 94, 97, 92, 96, 99, 90, 95, 98, 93, 97, 100, 91, 96, 99, 94, 98, 92, 95, 97, 100, 93, 96, 99]),
  },
  {
    id: 'D024', name: 'MED-Monitor-ER-24', ip: '10.12.10.130',
    type: DeviceType.MedicalDevice, vendor: 'Philips', model: 'IntelliVue MX800',
    building: 'Emergency', floor: '1F', department: 'Emergency',
    location: 'ER Bay 3',
    status: DeviceStatus.Online, latency: 8, availability: 99.95, packetLoss: 0,
    updated: '4 sec ago', history: stable([8], 1),
  },
  {
    id: 'D025', name: 'AP-ER-Wait-25', ip: '10.12.10.110',
    type: DeviceType.WirelessAP, vendor: 'Aruba', model: 'AP-535',
    building: 'Emergency', floor: '1F', department: 'Emergency',
    location: 'ER Waiting Area',
    status: DeviceStatus.Online, latency: 22, availability: 99.1, packetLoss: 0,
    updated: '12 sec ago', history: stable([22], 3),
  },

  // ═══════════════════════════════════════════════════════════════
  // OUTPATIENT — 6 devices
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'D026', name: 'Acc-SW-OPD-26', ip: '10.12.20.33',
    type: DeviceType.AccessSwitch, vendor: 'Huawei', model: 'S5735-L48P4X',
    building: 'Outpatient', floor: '1F', department: 'IT Infrastructure',
    location: 'OPD Building IDF',
    status: DeviceStatus.Online, latency: 13, availability: 99.85, packetLoss: 0,
    updated: '7 sec ago', history: stable([13], 2),
  },
  {
    id: 'D027', name: 'Kiosk-OPD-Reg-27', ip: '10.12.20.180',
    type: DeviceType.SelfServiceKiosk, vendor: 'KIOSK', model: 'K-Health 200',
    building: 'Outpatient', floor: '1F', department: 'Outpatient',
    location: 'OPD Registration Lobby',
    status: DeviceStatus.Online, latency: 14, availability: 99.45, packetLoss: 0,
    updated: '16 sec ago', history: stable([14], 3),
  },
  {
    id: 'D028', name: 'PDA-OPD-Reg-28', ip: '10.12.20.160',
    type: DeviceType.PDA, vendor: 'Zebra', model: 'TC52-HC',
    building: 'Outpatient', floor: '1F', department: 'Outpatient',
    location: 'OPD Registration Desk',
    status: DeviceStatus.Online, latency: 38, availability: 98.9, packetLoss: 1.2,
    updated: '20 sec ago', history: stable([38], 5),
  },
  {
    id: 'D029', name: 'PC-Consult-2F-29', ip: '10.12.20.210',
    type: DeviceType.DesktopPC, vendor: 'Lenovo', model: 'ThinkCentre M90q',
    building: 'Outpatient', floor: '2F', department: 'Outpatient',
    location: 'Consultation Room 2F-5',
    status: DeviceStatus.Online, latency: 17, availability: 99.2, packetLoss: 0,
    updated: '19 sec ago', history: stable([17], 3),
  },
  {
    id: 'D030', name: 'PRT-OPD-2F-30', ip: '10.12.20.92',
    type: DeviceType.Printer, vendor: 'HP', model: 'LaserJet M507',
    building: 'Outpatient', floor: '2F', department: 'Outpatient',
    location: 'OPD 2F Nurse Station',
    status: DeviceStatus.Online, latency: 24, availability: 98.95, packetLoss: 0,
    updated: '17 sec ago', history: stable([24], 3),
  },
  {
    id: 'D031', name: 'AP-OPD-3F-31', ip: '10.12.20.115',
    type: DeviceType.WirelessAP, vendor: 'Aruba', model: 'AP-535',
    building: 'Outpatient', floor: '3F', department: 'Outpatient',
    location: 'OPD 3F Corridor',
    status: DeviceStatus.Online, latency: 26, availability: 99.0, packetLoss: 0,
    updated: '14 sec ago', history: stable([26], 4),
  },

  // ═══════════════════════════════════════════════════════════════
  // BRANCH HOSPITAL A — 4 devices
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'D032', name: 'Core-SW-BrA-32', ip: '172.16.1.11',
    type: DeviceType.CoreSwitch, vendor: 'HPE', model: 'Aruba 8400',
    building: 'Branch Hospital A', floor: '1F', department: 'IT Infrastructure',
    location: 'Branch A MDF',
    status: DeviceStatus.Online, latency: 18, availability: 99.7, packetLoss: 0,
    updated: '10 sec ago', history: stable([18], 2),
  },
  {
    id: 'D033', name: 'FW-BrA-33', ip: '172.16.1.1',
    type: DeviceType.Firewall, vendor: 'Fortinet', model: 'FortiGate 200F',
    building: 'Branch Hospital A', floor: '1F', department: 'IT Security',
    location: 'Branch A Security Room',
    status: DeviceStatus.Online, latency: 12, availability: 99.85, packetLoss: 0,
    updated: '8 sec ago', history: stable([12], 2),
  },
  {
    id: 'D034', name: 'MED-Infusion-BrA-34', ip: '172.16.1.135',
    type: DeviceType.MedicalDevice, vendor: 'B. Braun', model: 'Space Station',
    building: 'Branch Hospital A', floor: '2F', department: 'Nursing',
    location: 'Branch A Ward 2',
    status: DeviceStatus.Online, latency: 15, availability: 99.5, packetLoss: 0,
    updated: '11 sec ago', history: stable([15], 2),
  },
  {
    id: 'D035', name: 'UNK-BrA-New-35', ip: '172.16.1.200',
    type: DeviceType.Unknown, vendor: 'Unknown', model: '—',
    building: 'Branch Hospital A', floor: '3F', department: 'Unknown',
    location: 'New Wing IDF',
    status: DeviceStatus.Unknown, latency: 0, availability: 0, packetLoss: 0,
    updated: '1 hr ago', history: h([0]),
  },

  // ═══════════════════════════════════════════════════════════════
  // BRANCH HOSPITAL B — 4 devices
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'D036', name: 'Core-SW-BrB-36', ip: '172.16.2.11',
    type: DeviceType.CoreSwitch, vendor: 'Cisco', model: 'Catalyst 9500',
    building: 'Branch Hospital B', floor: 'B1', department: 'IT Infrastructure',
    location: 'Branch B MDF',
    status: DeviceStatus.Online, latency: 21, availability: 99.6, packetLoss: 0,
    updated: '9 sec ago', history: stable([21], 3),
  },
  {
    id: 'D037', name: 'PC-Reception-BrB-37', ip: '172.16.2.201',
    type: DeviceType.DesktopPC, vendor: 'Dell', model: 'OptiPlex 7080',
    building: 'Branch Hospital B', floor: '1F', department: 'Administration',
    location: 'Branch B Reception',
    status: DeviceStatus.Online, latency: 20, availability: 99.1, packetLoss: 0,
    updated: '14 sec ago', history: stable([20], 3),
  },
  {
    id: 'D038', name: 'PRT-BrB-38', ip: '172.16.2.90',
    type: DeviceType.Printer, vendor: 'Canon', model: 'imageRUNNER ADVANCE',
    building: 'Branch Hospital B', floor: '1F', department: 'Administration',
    location: 'Branch B Admin Office',
    status: DeviceStatus.Warning, latency: 55, availability: 97.5, packetLoss: 3.2,
    updated: '28 sec ago', history: h([50, 52, 55, 58, 52, 55, 60, 50, 54, 56, 52, 55, 58, 52, 56, 60, 50, 54, 58, 52, 55, 60, 50, 54, 56, 52, 55, 58, 54, 50]),
  },
  {
    id: 'D039', name: 'Srv-PACS-BrB-39', ip: '172.16.2.51',
    type: DeviceType.Server, vendor: 'HPE', model: 'ProLiant DL380 Gen11',
    building: 'Branch Hospital B', floor: 'B1', department: 'Radiology',
    location: 'Branch B Server Room',
    status: DeviceStatus.Online, latency: 6, availability: 99.93, packetLoss: 0,
    updated: '4 sec ago', history: stable([6], 1),
  },

  // ═══════════════════════════════════════════════════════════════
  // BRANCH HOSPITAL C — 3 devices
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'D040', name: 'Core-SW-BrC-40', ip: '172.16.3.11',
    type: DeviceType.CoreSwitch, vendor: 'Huawei', model: 'S12700E',
    building: 'Branch Hospital C', floor: '1F', department: 'IT Infrastructure',
    location: 'Branch C MDF',
    status: DeviceStatus.Online, latency: 25, availability: 99.5, packetLoss: 0,
    updated: '8 sec ago', history: stable([25], 3),
  },
  {
    id: 'D041', name: 'Acc-SW-BrC-41', ip: '172.16.3.33',
    type: DeviceType.AccessSwitch, vendor: 'Huawei', model: 'S5735-L48P4X',
    building: 'Branch Hospital C', floor: '2F', department: 'IT Infrastructure',
    location: 'Branch C Ward IDF',
    status: DeviceStatus.Online, latency: 27, availability: 99.4, packetLoss: 0,
    updated: '10 sec ago', history: stable([27], 3),
  },
  {
    id: 'D042', name: 'UNK-BrC-Basement-42', ip: '172.16.3.200',
    type: DeviceType.Unknown, vendor: 'Unknown', model: '—',
    building: 'Branch Hospital C', floor: 'B1', department: 'Unknown',
    location: 'Basement Storage Room',
    status: DeviceStatus.Offline, latency: 0, availability: 0, packetLoss: 100,
    updated: '8 min ago', history: h([0]),
  },
]

export function getAllDevices(): Device[] {
  return devices
}

export function getDeviceById(id: string): Device | undefined {
  return devices.find((d) => d.id === id)
}

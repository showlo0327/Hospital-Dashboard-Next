"""
Shared backend enums — single source of truth for device types and statuses.

These enums mirror the frontend types/device.ts enum definitions.
All API schemas, services, and repositories use these enums.
"""

from enum import Enum


class DeviceCategory(str, Enum):
    Network = "Network"
    Compute = "Compute"
    Endpoint = "Endpoint"
    Other = "Other"


class DeviceType(str, Enum):
    # Network
    CoreSwitch = "CoreSwitch"
    AggregationSwitch = "AggregationSwitch"
    AccessSwitch = "AccessSwitch"
    Firewall = "Firewall"
    WirelessAP = "WirelessAP"
    Internet = "Internet"

    # Compute
    Server = "Server"
    VirtualizationPlatform = "VirtualizationPlatform"

    # Endpoint
    DesktopPC = "DesktopPC"
    CloudDesktop = "CloudDesktop"
    PDA = "PDA"
    MedicalDevice = "MedicalDevice"
    SelfServiceKiosk = "SelfServiceKiosk"
    Printer = "Printer"

    # Other
    Unknown = "Unknown"


class DeviceStatus(str, Enum):
    Online = "Online"
    Warning = "Warning"
    Offline = "Offline"
    Maintenance = "Maintenance"
    Unknown = "Unknown"


class Health(str, Enum):
    Good = "Good"
    Warning = "Warning"
    Critical = "Critical"
    Unknown = "Unknown"

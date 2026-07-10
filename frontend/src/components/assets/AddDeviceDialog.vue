<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X, Plus, Pencil, AlertCircle, Loader2 } from 'lucide-vue-next'
import { DeviceType, DeviceCategory, DEVICE_TYPE_META, getDeviceTypesByCategory } from '@/types/device'
import type { Device } from '@/types/device'
import { useDeviceStore } from '@/stores/devices'

/**
 * AddDeviceDialog — create or edit a single device.
 *
 * In create mode (no `device` prop): empty form, title "Add Device", calls createDevice().
 * In edit mode (`device` prop): pre-filled form, title "Edit Device", calls updateDevice().
 *
 * @prop device — optional existing device for edit mode
 *
 * @emits close, created, updated
 *
 * Component Maturity: Production Ready
 */
const props = defineProps<{ device?: Device | null }>()
const emit = defineEmits<{
  close: []
  created: [device: Device]
  updated: [device: Device]
}>()

const isEdit = computed(() => !!props.device)

const deviceStore = useDeviceStore()

const name = ref('')
const ip = ref('')
const mac = ref('')
const type = ref<DeviceType>(DeviceType.Unknown)
const vendor = ref('')
const model = ref('')
const building = ref('')
const floor = ref('')
const department = ref('')
const location = ref('')
const remark = ref('')

// Populate on edit
watch(() => props.device, (d) => {
  if (d) {
    name.value = d.name
    ip.value = d.ip
    type.value = d.type
    vendor.value = d.vendor
    model.value = d.model
    building.value = d.building
    floor.value = d.floor
    department.value = d.department ?? ''
    location.value = d.location
    mac.value = d.mac ?? ''
    remark.value = d.remark ?? ''
  }
}, { immediate: true })

const saving = ref(false)
const saveError = ref('')
const fieldErrors = ref<Record<string, string>>({})
const touchedFields = ref<Set<string>>(new Set())

const categoryLabels: Record<DeviceCategory, string> = {
  [DeviceCategory.Network]: 'Network Devices',
  [DeviceCategory.Compute]: 'Compute',
  [DeviceCategory.Endpoint]: 'Endpoints',
  [DeviceCategory.Other]: 'Other',
}

const typeOptions = computed(() =>
  (Object.values(DeviceCategory) as DeviceCategory[]).map((cat) => ({
    label: categoryLabels[cat],
    options: getDeviceTypesByCategory(cat).map((t) => ({
      value: t,
      label: DEVICE_TYPE_META[t].displayName,
    })),
  })),
)

const ipRegex = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/

function validateField(field: string): string {
  switch (field) {
    case 'name': return !name.value.trim() ? 'Device name is required' : ''
    case 'ip': {
      if (!ip.value.trim()) return 'IP address is required'
      if (!ipRegex.test(ip.value)) return 'Invalid IPv4 address'
      const dup = deviceStore.devices.find((d) => d.ip === ip.value.trim() && (!isEdit.value || d.id !== props.device!.id))
      if (dup) return `IP already exists (${dup.name})`
      return ''
    }
    case 'mac': {
      if (!mac.value.trim()) return ''
      const macRegex = /^([0-9A-Fa-f]{2}[:-]?){5}([0-9A-Fa-f]{2})$/
      if (!macRegex.test(mac.value.trim())) return 'Invalid MAC address (use AA:BB:CC:DD:EE:FF)'
      return ''
    }
    case 'type': return type.value === DeviceType.Unknown ? 'Please select a device type' : ''
    default: return ''
  }
}

function touch(field: string) {
  touchedFields.value.add(field)
  const err = validateField(field)
  if (err) fieldErrors.value[field] = err
  else delete fieldErrors.value[field]
}

function validateAll(): boolean {
  let valid = true
  for (const f of ['name', 'ip', 'type']) {
    touchedFields.value.add(f)
    const err = validateField(f)
    if (err) { fieldErrors.value[f] = err; valid = false }
    else delete fieldErrors.value[f]
  }
  return valid
}

async function handleSave() {
  if (!validateAll()) return
  saving.value = true
  saveError.value = ''
  try {
    if (isEdit.value) {
      const updated = await deviceStore.updateDevice(props.device!.id, {
        name: name.value.trim(),
        ip: ip.value.trim(),
        mac: mac.value.trim(),
        type: type.value,
        vendor: vendor.value.trim(),
        model: model.value.trim(),
        building: building.value.trim(),
        floor: floor.value.trim(),
        department: department.value.trim(),
        location: location.value.trim(),
      })
      if (updated) emit('updated', updated)
    } else {
      const device = await deviceStore.createDevice({
        name: name.value.trim(),
        ip: ip.value.trim(),
        mac: mac.value.trim(),
        type: type.value,
        vendor: vendor.value.trim(),
        model: model.value.trim(),
        building: building.value.trim(),
        floor: floor.value.trim(),
        department: department.value.trim(),
        location: location.value.trim(),
        remark: remark.value.trim(),
      })
      emit('created', device)
    }
  } catch (err) {
    saveError.value = err instanceof Error ? err.message : 'Failed to save device'
  } finally {
    saving.value = false
  }
}

const formValid = computed(() => {
  if (!name.value.trim() || !ip.value.trim() || type.value === DeviceType.Unknown) return false
  if (!ipRegex.test(ip.value)) return false
  return true
})

function fieldClass(field: string) {
  const base = 'h-10 w-full rounded-[15px] border bg-white/48 px-3.5 text-[14px] text-foreground placeholder:text-muted-foreground/40 shadow-sm outline-none transition'
  if (fieldErrors.value[field]) return base + ' border-red-400 focus:border-red-500 focus:shadow-[0_0_0_2px_rgba(239,68,68,0.15)]'
  return base + ' border-border focus:border-primary/40 focus:bg-white/80 focus:shadow-[0_0_0_2px_rgba(0,122,255,0.12)] dark:bg-white/8 dark:focus:bg-white/12'
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="emit('close')">
    <div class="relative w-full max-w-[560px] max-h-[88vh] overflow-hidden rounded-[28px] border border-white/70 bg-white/92 shadow-[0_24px_64px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#141820]/94 flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-border px-6 py-4 shrink-0">
        <div class="flex items-center gap-3">
          <div :class="isEdit ? 'grid size-9 place-items-center rounded-[16px] bg-amber-500/10 text-amber-600' : 'grid size-9 place-items-center rounded-[16px] bg-green-500/10 text-green-600'">
            <Pencil v-if="isEdit" :size="18" />
            <Plus v-else :size="18" />
          </div>
          <div>
            <h2 class="text-[16px] font-semibold">{{ isEdit ? 'Edit Device' : 'Add Device' }}</h2>
            <p class="text-[11px] text-muted-foreground">{{ isEdit ? 'Update device information' : 'Manually create a single network device' }}</p>
          </div>
        </div>
        <button type="button" class="grid size-8 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground" @click="emit('close')">
          <X :size="17" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        <div v-if="saveError" class="flex items-center gap-2 rounded-2xl border border-red-300/60 bg-red-50 px-4 py-3 text-[13px] text-red-700 dark:border-red-800/40 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle :size="16" /> {{ saveError }}
        </div>
        <div>
          <label class="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Device Name <span class="text-red-500">*</span></label>
          <input v-model="name" :class="fieldClass('name')" placeholder="e.g. Core-SW-DC-02" @blur="touch('name')" />
          <p v-if="fieldErrors.name" class="mt-1 text-[12px] text-red-500">{{ fieldErrors.name }}</p>
        </div>
        <div>
          <label class="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">IP Address <span class="text-red-500">*</span></label>
          <input v-model="ip" :class="fieldClass('ip')" placeholder="e.g. 192.168.1.100" @blur="touch('ip')" />
          <p v-if="fieldErrors.ip" class="mt-1 text-[12px] text-red-500">{{ fieldErrors.ip }}</p>
        </div>
        <div>
          <label class="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">MAC Address</label>
          <input v-model="mac" :class="fieldClass('mac')" placeholder="e.g. AA:BB:CC:DD:EE:FF" @blur="touch('mac')" />
          <p v-if="fieldErrors.mac" class="mt-1 text-[12px] text-red-500">{{ fieldErrors.mac }}</p>
        </div>
        <div>
          <label class="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Device Type <span class="text-red-500">*</span></label>
          <select v-model="type" :class="fieldClass('type')" @change="touch('type')">
            <option :value="DeviceType.Unknown" disabled>Select a device type...</option>
            <optgroup v-for="group in typeOptions" :key="group.label" :label="group.label">
              <option v-for="opt in group.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </optgroup>
          </select>
          <p v-if="fieldErrors.type" class="mt-1 text-[12px] text-red-500">{{ fieldErrors.type }}</p>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Vendor</label><input v-model="vendor" :class="fieldClass('vendor')" placeholder="e.g. Cisco" /></div>
          <div><label class="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Model</label><input v-model="model" :class="fieldClass('model')" placeholder="e.g. Catalyst 9500X" /></div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Building</label><input v-model="building" :class="fieldClass('building')" placeholder="e.g. Main Campus" /></div>
          <div><label class="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Floor</label><input v-model="floor" :class="fieldClass('floor')" placeholder="e.g. 3F" /></div>
        </div>
        <div><label class="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Department</label><input v-model="department" :class="fieldClass('department')" placeholder="e.g. Cardiology" /></div>
        <div><label class="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Location</label><input v-model="location" :class="fieldClass('location')" placeholder="e.g. Server Room A3" /></div>
        <div v-if="!isEdit">
          <label class="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Remark</label>
          <textarea v-model="remark" rows="2" class="h-20 w-full resize-none rounded-[15px] border border-border bg-white/48 px-3.5 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground/40 shadow-sm outline-none transition focus:border-primary/40 focus:bg-white/80 focus:shadow-[0_0_0_2px_rgba(0,122,255,0.12)] dark:bg-white/8 dark:focus:bg-white/12" placeholder="Optional notes..." />
        </div>
      </div>

      <div class="flex items-center gap-3 border-t border-border px-6 py-4 shrink-0">
        <button type="button" class="flex-1 rounded-2xl border border-border bg-white/60 py-2.5 text-[14px] font-semibold transition hover:bg-white dark:bg-white/8 dark:hover:bg-white/12" @click="emit('close')">Cancel</button>
        <button type="button" class="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-2.5 text-[14px] font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-40" :disabled="!formValid || saving" @click="handleSave">
          <Loader2 v-if="saving" :size="16" class="animate-spin" />
          <Pencil v-else-if="isEdit" :size="16" />
          <Plus v-else :size="16" />
          {{ saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Device' }}
        </button>
      </div>
    </div>
  </div>
</template>

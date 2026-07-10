<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { Device } from '@/types/device'
import { useDeviceStore } from '@/stores/devices'
import { useUIStore } from '@/stores/ui'
import { DATA_MODE } from '@/types/api'
import BaseWorkspaceHeader from '@/components/dashboard/workspace/BaseWorkspaceHeader.vue'
import AssetsToolbar from '@/components/assets/AssetsToolbar.vue'
import AssetsFilterPanel from '@/components/assets/AssetsFilterPanel.vue'
import AssetsBatchActions from '@/components/assets/AssetsBatchActions.vue'
import AssetsTable from '@/components/assets/AssetsTable.vue'
import AssetsPagination from '@/components/assets/AssetsPagination.vue'
import AssetsEmptyState from '@/components/assets/AssetsEmptyState.vue'
import ImportDialog from '@/components/assets/ImportDialog.vue'
import AddDeviceDialog from '@/components/assets/AddDeviceDialog.vue'
import ConfirmDialog from '@/components/assets/ConfirmDialog.vue'
import { WifiOff, RefreshCw } from 'lucide-vue-next'

const deviceStore = useDeviceStore()
const ui = useUIStore()

// ── Data Source Audit ──
const AUDIT_TAG = '[DataAudit:AssetsPage]'

onMounted(async () => {
  console.log(AUDIT_TAG, 'mount → DATA_MODE =', DATA_MODE, '| store has', deviceStore.devices.length, 'devices')
  // fetchAll auto-detects backend availability and switches data source if needed
  await deviceStore.fetchAll()
  deviceStore.startPolling()
  console.log(AUDIT_TAG, 'mount → after fetchAll:', deviceStore.devices.length, 'devices')
})

onUnmounted(() => {
  deviceStore.stopPolling()
})

watch(() => ui.importDialogRequested, (val) => {
  if (val) { importOpen.value = true; ui.clearImportDialogRequest() }
}, { immediate: true })

// ── Dialogs ──
const importOpen = ref(false)
const addDialogOpen = ref(false)
const editDevice = ref<Device | null>(null)
const deleteTarget = ref<Device | null>(null)
const deleteLoading = ref(false)
const batchDeleteTarget = ref(false)
const batchDeleteLoading = ref(false)

// ── Search & Filter ──
const searchQuery = ref('')
const filterOpen = ref(false)
const refreshing = ref(false)

// ── Filter state ──
const assetsFilter = ref({
  status: '', deviceType: '', vendor: '', building: '', floor: '', department: '',
})

const filteredDevices = computed(() => {
  let result = deviceStore.devices
  const q = searchQuery.value.toLowerCase().trim()
  if (q) {
    result = result.filter(d =>
      d.name.toLowerCase().includes(q) || d.ip.includes(q) ||
      d.vendor.toLowerCase().includes(q) || d.model.toLowerCase().includes(q) ||
      d.building.toLowerCase().includes(q) || d.floor.toLowerCase().includes(q) ||
      (d.department ?? '').toLowerCase().includes(q) || d.location.toLowerCase().includes(q),
    )
  }
  const f = assetsFilter.value
  if (f.status) result = result.filter(d => d.status === f.status)
  if (f.deviceType) result = result.filter(d => d.type === f.deviceType)
  if (f.vendor) result = result.filter(d => d.vendor === f.vendor)
  if (f.building) result = result.filter(d => d.building === f.building)
  if (f.floor) result = result.filter(d => d.floor === f.floor)
  if (f.department) result = result.filter(d => d.department === f.department)
  return result
})

// ── Selection ──
const selectedIds = ref<string[]>([])
const assetsTableRef = ref<InstanceType<typeof AssetsTable> | null>(null)
function onSelectionChange(ids: string[]) { selectedIds.value = ids }
function clearBatchSelection() { assetsTableRef.value?.clearSelection() }

// ── Pagination ──
const currentPage = ref(1)
const pageSize = 20
const totalPages = computed(() => Math.max(1, Math.ceil(filteredDevices.value.length / pageSize)))
const paginatedDevices = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredDevices.value.slice(start, start + pageSize)
})

// ── Refresh ──
async function refreshAssets() {
  refreshing.value = true
  clearBatchSelection()
  try {
    await deviceStore.fetchAll()
  } catch {
    // error is set by store
  } finally {
    refreshing.value = false
  }
}

// ── Edit: open edit dialog ──
function onEdit(id: string) {
  const d = deviceStore.getById(id)
  if (d) { editDevice.value = d; addDialogOpen.value = true }
}

// ── Delete: confirm then delete ──
function onDelete(id: string) {
  const d = deviceStore.getById(id)
  if (d) deleteTarget.value = d
}

async function confirmBatchDelete() {
  batchDeleteLoading.value = true
  const ids = [...selectedIds.value]
  for (const id of ids) {
    await deviceStore.deleteDevice(id)
  }
  batchDeleteLoading.value = false
  batchDeleteTarget.value = false
  clearBatchSelection()
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleteLoading.value = true
  const deletedId = deleteTarget.value.id
  await deviceStore.deleteDevice(deletedId)
  deleteLoading.value = false
  // If deleted device is in inspector, close it
  if (ui.selectedDeviceId === deletedId) ui.clearSelection()
  deleteTarget.value = null
}

// ── Add / Edit callbacks ──
function onDeviceCreated() { addDialogOpen.value = false; editDevice.value = null }
function onDeviceUpdated() { addDialogOpen.value = false; editDevice.value = null }
function onImported() { importOpen.value = false }
</script>

<template>
  <div>
    <BaseWorkspaceHeader
      label="Master Data"
      title="Assets"
      subtitle="Manage all hospital network assets."
      :search-enabled="false"
      :refresh-enabled="true"
      :filter-enabled="false"
      :more-menu-enabled="false"
      :refreshing="refreshing"
      @refresh="refreshAssets"
    />

    <!-- Error state -->
    <div v-if="deviceStore.error" class="mt-3 flex items-center gap-3 rounded-[22px] border border-red-300/60 bg-red-50/80 px-5 py-4 text-sm text-red-800 backdrop-blur-xl dark:border-red-800/40 dark:bg-red-950/40 dark:text-red-300">
      <WifiOff class="h-5 w-5 shrink-0 text-red-500" />
      <span class="flex-1">{{ deviceStore.error }}</span>
      <button class="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700" @click="deviceStore.fetchAll()">
        <RefreshCw class="h-3.5 w-3.5" /> Retry
      </button>
    </div>

    <!-- Toolbar -->
    <div v-if="!deviceStore.error" class="mt-3 space-y-3">
      <AssetsToolbar
        v-model:search-query="searchQuery"
        :filter-open="filterOpen"
        @toggle-filter="filterOpen = !filterOpen"
        @add="editDevice = null; addDialogOpen = true"
        @import="importOpen = true"
      />
      <AssetsFilterPanel :open="filterOpen" @close="filterOpen = false" />
      <AssetsBatchActions :selected-count="selectedIds.length" @clear="clearBatchSelection" @delete="batchDeleteTarget = true" />
    </div>

    <!-- Table -->
    <div v-if="!deviceStore.error" class="mt-3 overflow-hidden rounded-[22px] border border-white/70 bg-white/72 shadow-[0_12px_32px_rgba(31,41,55,0.055)] backdrop-blur-xl dark:border-white/10 dark:bg-white/8">
      <template v-if="deviceStore.loading && deviceStore.devices.length === 0">
        <div class="flex items-center justify-center px-6 py-16 text-sm text-muted-foreground">Loading assets...</div>
      </template>
      <template v-else-if="filteredDevices.length > 0">
        <AssetsTable
          ref="assetsTableRef"
          :devices="paginatedDevices"
          @edit="onEdit"
          @delete="onDelete"
          @selection-change="onSelectionChange"
        />
        <AssetsPagination
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-items="filteredDevices.length"
          :page-size="pageSize"
          @update:current-page="currentPage = $event"
        />
      </template>
      <AssetsEmptyState v-else />
    </div>

    <!-- Add / Edit dialog -->
    <AddDeviceDialog
      v-if="addDialogOpen"
      :device="editDevice"
      @close="addDialogOpen = false; editDevice = null"
      @created="onDeviceCreated"
      @updated="onDeviceUpdated"
    />

    <!-- Import dialog -->
    <ImportDialog v-if="importOpen" @close="importOpen = false" @imported="onImported" />

    <!-- Batch delete confirmation -->
    <ConfirmDialog
      v-if="batchDeleteTarget"
      :title="'Batch Delete'"
      :message="'Are you sure you want to delete ' + selectedIds.length + ' devices? This action cannot be undone.'"
      confirm-label="Delete All"
      :loading="batchDeleteLoading"
      @confirm="confirmBatchDelete"
      @cancel="batchDeleteTarget = false"
    />

    <!-- Delete confirmation -->
    <ConfirmDialog
      v-if="deleteTarget"
      :title="'Delete Device'"
      :message="'Are you sure you want to delete ' + deleteTarget.name + ' (' + deleteTarget.ip + ')? This action cannot be undone.'"
      confirm-label="Delete"
      :loading="deleteLoading"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>

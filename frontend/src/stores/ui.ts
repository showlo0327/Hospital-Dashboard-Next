import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const DARK_KEY = 'hospital_dark_mode'

function loadDark(): boolean {
  try {
    const raw = localStorage.getItem(DARK_KEY)
    if (raw !== null) return raw === 'true'
  } catch {}
  // Fall back to system preference
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

function saveDark(value: boolean): void {
  try { localStorage.setItem(DARK_KEY, String(value)) } catch {}
}

export const useUIStore = defineStore('ui', () => {
  const dark = ref(loadDark())
  const sidebarCollapsed = ref(false)
  const selectedDeviceId = ref<string | null>(null)
  const inspectorOpen = ref(false)
  const importDialogRequested = ref(false)

  // Persist dark mode on change
  watch(dark, (val) => saveDark(val), { immediate: false })

  function toggleDark() {
    dark.value = !dark.value
  }

  function toggleSidebar() { sidebarCollapsed.value = !sidebarCollapsed.value }
  function selectDevice(id: string | null) { selectedDeviceId.value = id; if (id) inspectorOpen.value = true }
  function clearSelection() { selectedDeviceId.value = null; inspectorOpen.value = false }
  function openInspector(id: string) { selectedDeviceId.value = id; inspectorOpen.value = true }
  function closeInspector() { inspectorOpen.value = false }
  function requestImportDialog() { importDialogRequested.value = true }
  function clearImportDialogRequest() { importDialogRequested.value = false }

  return {
    dark, sidebarCollapsed,
    selectedDeviceId, inspectorOpen,
    importDialogRequested,
    toggleDark, toggleSidebar,
    selectDevice, clearSelection,
    openInspector, closeInspector,
    requestImportDialog, clearImportDialogRequest,
  }
})

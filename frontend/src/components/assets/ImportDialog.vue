<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  X, Upload, Download, FileText, CheckCircle2, AlertTriangle,
  XCircle, ChevronRight, RefreshCw, FileSpreadsheet,
} from 'lucide-vue-next'
import { csvService } from '@/services/csvService'
import { useDeviceStore } from '@/stores/devices'
import type { CsvValidationResponse, CsvImportSummary, DuplicateAction } from '@/types/csv'

/**
 * ImportDialog — full CSV import workflow.
 *
 * Steps: Upload → Validate → Preview → Import → Result → Refresh
 *
 * Emits:
 *   @close     — dialog closed
 *   @imported  — import completed successfully
 *
 * Component Maturity: Production Ready
 */

const emit = defineEmits<{
  close: []
  imported: []
}>()

const deviceStore = useDeviceStore()

// ── Step state ──
type Step = 'upload' | 'validating' | 'preview' | 'importing' | 'result'
const step = ref<Step>('upload')

// ── File state ──
const file = ref<File | null>(null)
const fileContent = ref('')
const filename = ref('')
const encoding = ref('utf-8')
const dragOver = ref(false)

// ── Validation ──
const validation = ref<CsvValidationResponse | null>(null)
const validationError = ref('')

// ── Import ──
const duplicateAction = ref<DuplicateAction>('skip')
const importResult = ref<CsvImportSummary | null>(null)
const importError = ref('')

// ── Computed ──

const canImport = computed(() => validation.value?.can_import ?? false)
const errorRows = computed(() => validation.value?.rows.filter(r => r.status === 'error') ?? [])
const warningRows = computed(() => validation.value?.rows.filter(r => r.status === 'warning') ?? [])
const validRows = computed(() => validation.value?.rows.filter(r => r.status === 'valid') ?? [])

// ── Actions ──

function onDragOver(e: DragEvent) {
  e.preventDefault()
  dragOver.value = true
}
function onDragLeave() { dragOver.value = false }
function onDrop(e: DragEvent) {
  e.preventDefault()
  dragOver.value = false
  const f = e.dataTransfer?.files?.[0]
  if (f) selectFile(f)
}
function onFileInput(e: Event) {
  const input = e.target as HTMLInputElement
  const f = input.files?.[0]
  if (f) selectFile(f)
}

function selectFile(f: File) {
  file.value = f
  filename.value = f.name
  const reader = new FileReader()
  reader.onload = () => {
    fileContent.value = reader.result as string
  }
  reader.readAsText(f, encoding.value)
}

function downloadTemplate() {
  const headers = ['Name', 'IP', 'MAC', 'Vendor', 'Model', 'DeviceType', 'Building', 'Floor', 'Department', 'Location', 'Remark']
  const csv = headers.join(',') + '\n'
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'hospital_device_template.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

async function doValidate() {
  if (!fileContent.value) return
  step.value = 'validating'
  validationError.value = ''
  try {
    validation.value = await csvService.validate(filename.value, fileContent.value, encoding.value)
    step.value = 'preview'
  } catch (err) {
    validationError.value = err instanceof Error ? err.message : 'Validation failed'
    step.value = 'upload'
  }
}

async function doImport() {
  if (!validation.value?.can_import) return
  step.value = 'importing'
  importError.value = ''
  try {
    importResult.value = await csvService.importCsv(
      filename.value,
      fileContent.value,
      duplicateAction.value,
      encoding.value,
    )
    step.value = 'result'
  } catch (err) {
    importError.value = err instanceof Error ? err.message : 'Import failed'
    step.value = 'preview'
  }
}

async function doRefresh() {
  await deviceStore.fetchAll()
  emit('imported')
}

function reset() {
  step.value = 'upload'
  file.value = null
  fileContent.value = ''
  filename.value = ''
  validation.value = null
  validationError.value = ''
  importResult.value = null
  importError.value = ''
  duplicateAction.value = 'skip'
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" >
    <div
      class="relative w-full max-w-[720px] max-h-[85vh] overflow-hidden rounded-[28px] border border-white/70 bg-white/92 shadow-[0_24px_64px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#141820]/94 flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-border px-6 py-4 shrink-0">
        <div class="flex items-center gap-3">
          <div class="grid size-9 place-items-center rounded-[16px] bg-primary/10 text-primary">
            <FileSpreadsheet :size="18" />
          </div>
          <div>
            <h2 class="text-[16px] font-semibold">Import CSV</h2>
            <p class="text-[11px] text-muted-foreground">Import hospital network devices from CSV</p>
          </div>
        </div>
        <button
          class="grid size-8 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          type="button" @click="emit('close')"
        >
          <X :size="17" />
        </button>
      </div>

      <!-- Body — scrollable -->
      <div class="flex-1 overflow-y-auto px-6 py-5 overscroll-contain">

        <!-- ── STEP: Upload ── -->
        <template v-if="step === 'upload'">
          <p class="mb-4 text-[13px] text-muted-foreground">
            Download the template, fill in your devices, then upload the CSV file.
          </p>

          <!-- Template download -->
          <button
            class="mb-5 inline-flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-[13px] font-semibold text-primary transition hover:bg-primary/10"
            @click="downloadTemplate"
          >
            <Download :size="15" />
            Download CSV Template
          </button>

          <!-- File drop zone -->
          <div
            class="flex flex-col items-center justify-center gap-3 rounded-[22px] border-2 border-dashed px-6 py-12 transition relative" :class="dragOver
              ? 'border-primary/50 bg-primary/5'
              : 'border-border bg-white/40 dark:bg-white/5'"
            @dragover="onDragOver"
            @dragleave="onDragLeave"
            @drop="onDrop"
          >
            <Upload :size="28" class="text-muted-foreground/60" />
            <p class="text-[13px] font-medium text-muted-foreground">
              Drop CSV file here or click to browse
            </p>
            <input
              type="file"
              accept=".csv"
              class="absolute inset-0 cursor-pointer opacity-0"
              @change="onFileInput"
            />
          </div>

          <!-- File selected -->
          <div
            v-if="file"
            class="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-white/60 px-4 py-3 dark:bg-white/8"
          >
            <FileText :size="18" class="text-primary" />
            <span class="flex-1 text-[13px] font-medium">{{ file.name }}</span>
            <span class="text-[11px] text-muted-foreground">{{ (file.size / 1024).toFixed(1) }} KB</span>
          </div>

          <!-- Validation error -->
          <div
            v-if="validationError"
            class="mt-4 flex items-center gap-2 rounded-2xl border border-red-300/60 bg-red-50 px-4 py-3 text-[13px] text-red-700 dark:border-red-800/40 dark:bg-red-950/30 dark:text-red-400"
          >
            <XCircle :size="16" />
            {{ validationError }}
          </div>

          <!-- Validate button -->
          <button
            v-if="file"
            class="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-2.5 text-[14px] font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            @click="doValidate"
          >
            Validate CSV
            <ChevronRight :size="16" />
          </button>
        </template>

        <!-- ── STEP: Validating ── -->
        <template v-if="step === 'validating'">
          <div class="flex flex-col items-center justify-center gap-3 py-16">
            <RefreshCw :size="28" class="animate-spin text-primary" />
            <p class="text-[14px] font-medium text-muted-foreground">Validating CSV...</p>
          </div>
        </template>

        <!-- ── STEP: Preview ── -->
        <template v-if="step === 'preview' && validation">
          <!-- Summary badges -->
          <div class="mb-5 flex flex-wrap gap-3">
            <div class="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-[12px] font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <CheckCircle2 :size="14" /> {{ validation.valid_rows }} valid
            </div>
            <div class="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[12px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <AlertTriangle :size="14" /> {{ validation.warning_rows }} warnings
            </div>
            <div class="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-[12px] font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
              <XCircle :size="14" /> {{ validation.error_rows }} errors
            </div>
          </div>

          <!-- Error rows -->
          <div v-if="errorRows.length" class="mb-4">
            <p class="mb-2 text-[12px] font-semibold uppercase tracking-wider text-red-600">Errors (must fix)</p>
            <div class="space-y-1.5 max-h-[180px] overflow-y-auto">
              <div
                v-for="row in errorRows"
                :key="row.row"
                class="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50/60 px-3 py-2 text-[12px] dark:border-red-800/30 dark:bg-red-950/20"
              >
                <XCircle :size="14" class="mt-0.5 shrink-0 text-red-500" />
                <div>
                  <span class="font-semibold">Row {{ row.row }}</span>
                  <span v-if="row.name"> — {{ row.name }}</span>
                  <span v-if="row.ip"> ({{ row.ip }})</span>
                  <ul class="mt-1 list-inside list-disc text-red-600 dark:text-red-400">
                    <li v-for="e in row.errors" :key="e">{{ e }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Warning rows -->
          <div v-if="warningRows.length" class="mb-4">
            <p class="mb-2 text-[12px] font-semibold uppercase tracking-wider text-amber-600">Warnings</p>
            <div class="space-y-1.5 max-h-[180px] overflow-y-auto">
              <div
                v-for="row in warningRows"
                :key="row.row"
                class="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2 text-[12px] dark:border-amber-800/30 dark:bg-amber-950/20"
              >
                <AlertTriangle :size="14" class="mt-0.5 shrink-0 text-amber-500" />
                <div>
                  <span class="font-semibold">Row {{ row.row }}</span>
                  <span v-if="row.name"> — {{ row.name }}</span>
                  <span v-if="row.ip"> ({{ row.ip }})</span>
                  <ul class="mt-1 list-inside list-disc text-amber-600 dark:text-amber-400">
                    <li v-for="w in row.warnings" :key="w">{{ w }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Duplicate action -->
          <div v-if="canImport" class="mb-4">
            <p class="mb-2 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Duplicate Handling</p>
            <div class="flex gap-2">
              <button
                class="rounded-xl px-4 py-2 text-[13px] font-semibold transition"
                :class="duplicateAction === 'skip'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-border bg-white/60 text-muted-foreground dark:bg-white/8'"
                @click="duplicateAction = 'skip'"
              >
                Skip Existing
              </button>
              <button
                class="rounded-xl px-4 py-2 text-[13px] font-semibold transition"
                :class="duplicateAction === 'replace'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-border bg-white/60 text-muted-foreground dark:bg-white/8'"
                @click="duplicateAction = 'replace'"
              >
                Replace Existing
              </button>
            </div>
          </div>

          <!-- Import error -->
          <div
            v-if="importError"
            class="mb-4 flex items-center gap-2 rounded-2xl border border-red-300/60 bg-red-50 px-4 py-3 text-[13px] text-red-700 dark:border-red-800/40 dark:bg-red-950/30 dark:text-red-400"
          >
            <XCircle :size="16" />
            {{ importError }}
          </div>

          <!-- Action buttons -->
          <div class="flex gap-3">
            <button
              class="flex-1 rounded-2xl border border-border bg-white/60 py-2.5 text-[14px] font-semibold transition hover:bg-white dark:bg-white/8 dark:hover:bg-white/12"
              @click="reset"
            >
              Back
            </button>
            <button
              class="flex-1 rounded-2xl bg-primary py-2.5 text-[14px] font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-40"
              :disabled="!canImport"
              @click="doImport"
            >
              Import {{ validation.valid_rows + validation.warning_rows }} Devices
            </button>
          </div>
        </template>

        <!-- ── STEP: Importing ── -->
        <template v-if="step === 'importing'">
          <div class="flex flex-col items-center justify-center gap-3 py-16">
            <RefreshCw :size="28" class="animate-spin text-primary" />
            <p class="text-[14px] font-medium text-muted-foreground">Importing devices...</p>
          </div>
        </template>

        <!-- ── STEP: Result ── -->
        <template v-if="step === 'result' && importResult">
          <div class="flex flex-col items-center gap-3 py-6">
            <div class="grid size-14 place-items-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <CheckCircle2 :size="28" />
            </div>
            <h3 class="text-[17px] font-semibold">Import Complete</h3>
          </div>

          <!-- Stats grid -->
          <div class="mb-6 grid grid-cols-2 gap-3">
            <div class="rounded-2xl border border-border bg-white/60 p-4 text-center dark:bg-white/8">
              <p class="text-[24px] font-bold text-primary">{{ importResult.imported }}</p>
              <p class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Imported</p>
            </div>
            <div class="rounded-2xl border border-border bg-white/60 p-4 text-center dark:bg-white/8">
              <p class="text-[24px] font-bold text-amber-600">{{ importResult.updated }}</p>
              <p class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Updated</p>
            </div>
            <div class="rounded-2xl border border-border bg-white/60 p-4 text-center dark:bg-white/8">
              <p class="text-[24px] font-bold text-muted-foreground">{{ importResult.skipped }}</p>
              <p class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Skipped</p>
            </div>
            <div class="rounded-2xl border border-border bg-white/60 p-4 text-center dark:bg-white/8">
              <p class="text-[24px] font-bold text-red-600">{{ importResult.failed }}</p>
              <p class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Failed</p>
            </div>
          </div>

          <!-- Errors detail -->
          <div v-if="importResult.errors.length" class="mb-4">
            <p class="mb-2 text-[12px] font-semibold uppercase tracking-wider text-red-600">Details</p>
            <div class="space-y-1">
              <p
                v-for="(e, i) in importResult.errors"
                :key="i"
                class="text-[12px] text-red-600 dark:text-red-400"
              >{{ e }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              class="flex-1 rounded-2xl border border-border bg-white/60 py-2.5 text-[14px] font-semibold transition hover:bg-white dark:bg-white/8 dark:hover:bg-white/12"
              @click="emit('close')"
            >
              Close
            </button>
            <button
              class="flex-1 rounded-2xl bg-primary py-2.5 text-[14px] font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
              @click="doRefresh"
            >
              Refresh & Close
            </button>
          </div>
        </template>

      </div>
    </div>
  </div>
</template>

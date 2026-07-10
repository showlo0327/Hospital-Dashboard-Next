<script setup lang="ts">
import { computed } from 'vue'
import { X } from 'lucide-vue-next'
import { useUIStore } from '@/stores/ui'
import { useDeviceStore } from '@/stores/devices'
import DeviceInspector from '@/components/dashboard/inspector/DeviceInspector.vue'

/**
 * Persistent right-side Inspector Panel.
 *
 * Hidden by default. Opens on Device Card/List click.
 * Smooth 200ms slide-in/out synchronized with workspace resize.
 *
 * Design Tokens Used:
 *   --inspector-width (316px), --header-height (64px)
 */
const ui = useUIStore()
const deviceStore = useDeviceStore()

const selectedDevice = computed(() => {
  if (!ui.selectedDeviceId) return null
  return deviceStore.getById(ui.selectedDeviceId) ?? null
})
</script>

<template>
  <Teleport to="body">
    <Transition name="inspector">
      <aside
        v-if="ui.inspectorOpen"
        class="fixed bottom-4 right-0 z-30 w-[var(--inspector-width)] overflow-y-auto overscroll-contain rounded-l-[28px] border border-white/70 bg-white/92 p-4 shadow-[-12px_0_48px_rgba(15,23,42,0.10)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#141820]/94"
        style="top: calc(var(--header-height) + 14px); scrollbar-width: none"
      >
        <button
          type="button"
          class="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          @click="ui.closeInspector()"
        >
          <X :size="16" />
        </button>

        <DeviceInspector :device="selectedDevice" />
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
aside::-webkit-scrollbar { display: none; }

.inspector-enter-active {
  animation: slideIn 200ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.inspector-leave-active {
  animation: slideOut 200ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}

@keyframes slideOut {
  from { transform: translateX(0);    opacity: 1; }
  to   { transform: translateX(100%); opacity: 0; }
}
</style>

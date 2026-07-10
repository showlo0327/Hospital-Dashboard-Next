<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserCircle2, LogOut, ChevronDown } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const open = ref(false)

function toggleMenu() {
  open.value = !open.value
}

function closeMenu() {
  open.value = false
}

function handleLogout() {
  closeMenu()
  auth.logout()
  router.push({ name: 'login' })
}

// Close on outside click
function onBlur(e: FocusEvent) {
  // Use setTimeout so we don't close before click registers
  setTimeout(() => {
    if (!(e.relatedTarget as HTMLElement)?.closest('.user-menu-container')) {
      open.value = false
    }
  }, 150)
}
</script>

<template>
  <div class="user-menu-container relative">
    <button
      class="toolbar gap-1.5"
      @click="toggleMenu"
      @blur="onBlur"
    >
      <UserCircle2 :size="15" />
      <span class="hidden sm:inline text-[13px] font-medium">{{ auth.user?.username ?? 'Admin' }}</span>
      <ChevronDown :size="12" class="text-muted-foreground/60" />
    </button>

    <!-- Dropdown -->
    <Transition name="drop">
      <div
        v-if="open"
        class="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-border bg-white/94 shadow-[0_16px_48px_rgba(15,23,42,0.15)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#141b2a]/96"
      >
        <div class="border-b border-border px-4 py-3">
          <p class="text-[13px] font-semibold">{{ auth.user?.username ?? 'Admin' }}</p>
          <p class="text-[11px] text-muted-foreground">{{ auth.user?.role ?? 'Administrator' }}</p>
        </div>
        <div class="py-1">
          <button
            class="flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
            @click="handleLogout"
          >
            <LogOut :size="14" />
            Logout
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.drop-enter-active,
.drop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.96);
}
</style>

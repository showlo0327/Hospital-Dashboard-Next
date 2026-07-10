<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { ArrowRight, Check, Eye, EyeOff, KeyRound, LockKeyhole, UserRound } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import BrandMark from './BrandMark.vue'

const emit = defineEmits<{ signedIn: [] }>()

const showPassword = ref(false)
const remember = ref(true)
const loading = ref(false)
const signedIn = ref(false)
const loginError = ref('')
const shakeBtn = ref(false)

const username = ref('')
const password = ref('')
const passwordRef = ref<HTMLInputElement | null>(null)

const authStore = useAuthStore()

function handleSignIn(e: Event) {
  e.preventDefault()
  loginError.value = ''
  shakeBtn.value = false

  if (!username.value.trim() || !password.value.trim()) {
    loginError.value = 'Please enter username and password.'
    triggerShake()
    return
  }

  loading.value = true
  setTimeout(() => {
    const ok = authStore.login(username.value.trim(), password.value)
    loading.value = false
    if (ok) {
      signedIn.value = true
      setTimeout(() => emit('signedIn'), 600)
    } else {
      loginError.value = 'Invalid username or password.'
      password.value = ''
      triggerShake()
      nextTick(() => passwordRef.value?.focus())
    }
  }, 650)
}

function triggerShake() {
  shakeBtn.value = true
  setTimeout(() => { shakeBtn.value = false }, 350)
}
</script>

<template>
  <div
    class="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/[0.68] p-7 shadow-[0_28px_90px_rgba(28,67,120,0.15),0_4px_16px_rgba(28,67,120,0.05)] backdrop-blur-[26px] transition-colors duration-500 sm:p-9 dark:border-white/[0.13] dark:bg-[#141b2a]/[0.68] dark:shadow-[0_30px_90px_rgba(0,0,0,0.34)]"
  >
    <!-- Top glow line -->
    <div
      class="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90"
    />

    <!-- Header: Brand + NOC badge -->
    <div class="flex items-start justify-between">
      <BrandMark />
      <div
        class="rounded-full border border-[#c9ddff]/70 bg-[#eff6ff]/65 px-3 py-1.5 font-mono text-[10px] font-medium tracking-[0.08em] text-[#3777c9] dark:border-[#4e7cbf]/30 dark:bg-[#1e3658]/50 dark:text-[#a1ccff]"
      >
        NOC ACCESS
      </div>
    </div>

    <!-- Title -->
    <div class="mt-8">
      <p class="text-sm font-medium text-[#3B82F6]">Hospital Dashboard</p>
      <h2 class="mt-1.5 text-[30px] font-semibold tracking-[-0.025em]">Welcome back</h2>
      <p class="mt-2 text-sm leading-6 text-muted-foreground">
        Enter your credentials to continue to the operations workspace.
      </p>
    </div>

    <!-- Success state — replaces everything -->
    <div
      v-if="signedIn"
      class="mt-7 rounded-2xl border border-[#34C759]/25 bg-[#34C759]/10 px-4 py-4 text-sm text-[#23783a] dark:text-[#79e591]"
    >
      <div class="flex items-center gap-2 font-semibold">
        <Check :size="17" />
        Identity verified
      </div>
      <p class="mt-1 pl-6 text-xs opacity-90">Redirecting you to the dashboard...</p>
    </div>

    <!-- Sign-in form — always visible unless success -->
    <form v-else class="mt-7 space-y-4" @submit="handleSignIn" novalidate>
      <!-- Username -->
      <label class="block">
        <span class="mb-2 block text-sm font-medium">Username</span>
        <div class="login-input">
          <UserRound :size="18" />
          <input
            v-model="username"
            required
            type="text"
            autocomplete="username"
            placeholder="Enter your username"
          />
        </div>
      </label>

      <!-- Password -->
      <label class="block">
        <span class="mb-2 block text-sm font-medium">Password</span>
        <div class="login-input">
          <LockKeyhole :size="18" />
          <input
            ref="passwordRef"
            v-model="password"
            required
            autocomplete="current-password"
            placeholder="Enter your password"
            :type="showPassword ? 'text' : 'password'"
          />
          <button
            type="button"
            class="grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
            aria-label="Toggle password visibility"
            @click="showPassword = !showPassword"
          >
            <EyeOff v-if="showPassword" :size="17" />
            <Eye v-else :size="17" />
          </button>
        </div>
      </label>

      <!-- Remember + Forgot -->
      <div class="flex items-center justify-between pt-1">
        <button
          type="button"
          class="flex items-center gap-2 text-sm text-muted-foreground"
          @click="remember = !remember"
        >
          <span
            class="grid size-[18px] place-items-center rounded-[6px] border transition"
            :class="remember
              ? 'border-primary bg-primary text-white'
              : 'border-[#b5c0d2] bg-white/50 dark:bg-white/5'"
          >
            <Check v-if="remember" :size="13" :stroke-width="3" />
          </span>
          Remember me
        </button>
        <button type="button" class="text-sm font-medium text-primary transition hover:text-[#176ce3]">
          Forgot password?
        </button>
      </div>

      <!-- Submit button -->
      <button
        type="submit"
        :disabled="loading"
        class="mt-2 flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#3B82F6] text-[15px] font-semibold text-white shadow-[0_12px_26px_rgba(59,130,246,0.3)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#3276e5] hover:shadow-[0_16px_32px_rgba(59,130,246,0.4)] active:translate-y-0 active:scale-[0.99] disabled:cursor-wait disabled:opacity-80"
        :class="{ 'shake': shakeBtn }"
      >
        <template v-if="loading">
          <span class="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
          Signing in...
        </template>
        <template v-else>
          Sign In
          <ArrowRight :size="18" />
        </template>
      </button>

      <!-- Error message — below the button -->
      <p
        v-if="loginError"
        class="text-center text-[13px] font-medium text-red-600 dark:text-red-400"
      >
        {{ loginError }}
      </p>
    </form>

    <!-- Footer note -->
    <div class="mt-7 flex items-center gap-2 border-t border-[#93a4bf]/15 pt-5 text-xs text-muted-foreground">
      <KeyRound :size="14" class="text-primary" />
      <span>Protected with enterprise identity controls</span>
    </div>
  </div>
</template>

<style scoped>
.login-input {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  border-radius: 15px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(255, 255, 255, 0.55);
  padding: 0 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
  backdrop-filter: blur(12px);
}
.login-input:focus-within {
  border-color: rgba(59, 130, 246, 0.45);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  background: rgba(255, 255, 255, 0.8);
}
.login-input input {
  flex: 1;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}
.login-input input::placeholder {
  color: var(--muted-foreground);
  opacity: 0.45;
}
.dark .login-input {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
}
.dark .login-input:focus-within {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(59, 130, 246, 0.5);
}

/* ── Shake animation ── */
.shake {
  animation: shake 0.3s ease-in-out;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  15% { transform: translateX(-4px); }
  30% { transform: translateX(4px); }
  45% { transform: translateX(-3px); }
  60% { transform: translateX(3px); }
  75% { transform: translateX(-1px); }
  90% { transform: translateX(1px); }
}
</style>

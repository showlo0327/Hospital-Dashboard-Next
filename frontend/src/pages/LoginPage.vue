<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Moon, Sun, Braces, Workflow, ServerCog, ShieldCheck } from 'lucide-vue-next'
import BrandMark from '@/components/login/BrandMark.vue'
import LoginCard from '@/components/login/LoginCard.vue'
import { useUIStore } from '@/stores/ui'

const router = useRouter()
const ui = useUIStore()

function onSignedIn() {
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <div :class="{ dark: ui.dark }">
    <main
      class="relative h-screen overflow-hidden bg-[#f5f8fe] text-foreground transition-colors duration-500 dark:bg-[#090d16] [font-family:Inter,system-ui,sans-serif]"
    >
      <!-- Grid pattern -->
      <div
        class="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.075)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.075)_1px,transparent_1px)] bg-[size:34px_34px] dark:opacity-70"
      />
      <!-- Radial gradient overlay -->
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.95),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(35,75,135,0.12),transparent_55%)]"
      />

      <!-- Glass orbs -->
      <div aria-hidden="true" class="pointer-events-none absolute -left-32 top-[4%] size-[560px] rounded-full bg-[#70b8ff]/32 blur-3xl dark:bg-[#126ee0]/18" />
      <div aria-hidden="true" class="pointer-events-none absolute left-[32%] top-[42%] size-[470px] rounded-full bg-[#80e4ef]/22 blur-3xl dark:bg-[#1a8d9b]/14" />
      <div aria-hidden="true" class="pointer-events-none absolute -right-20 top-[-14%] size-[610px] rounded-full bg-[#b9c6ff]/32 blur-3xl dark:bg-[#4564c9]/15" />
      <div aria-hidden="true" class="pointer-events-none absolute bottom-[-24%] right-[12%] size-[580px] rounded-full bg-[#5ebcff]/18 blur-3xl dark:bg-[#1278c9]/12" />

      <!-- Content -->
      <div class="relative mx-auto flex h-screen max-w-[1440px] flex-col overflow-hidden px-6 py-4 lg:px-10 xl:px-14">
        <!-- Header -->
        <header class="flex shrink-0 items-center justify-between">
          <div class="flex items-center gap-3">
            <BrandMark />
            <div>
              <p class="text-[15px] font-semibold tracking-[-0.01em]">Hospital Dashboard</p>
              <p class="mt-0.5 text-xs text-muted-foreground">Network Operations Platform</p>
            </div>
          </div>
          <button
            class="group inline-flex h-11 items-center gap-2 rounded-2xl border border-white/75 bg-white/55 px-3.5 text-sm font-medium text-muted-foreground shadow-[0_8px_28px_rgba(15,23,42,0.06)] backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:bg-white/80 hover:text-foreground dark:border-white/10 dark:bg-white/[0.07] dark:hover:bg-white/[0.12]"
            aria-label="Toggle color mode"
            @click="ui.toggleDark()"
          >
            <Sun v-if="ui.dark" :size="16" class="text-[#79b6ff]" />
            <Moon v-else :size="16" class="text-[#356fc7]" />
            <span class="hidden sm:inline">{{ ui.dark ? 'Light Mode' : 'Dark Mode' }}</span>
          </button>
        </header>

        <!-- Hero + Login Card -->
        <section class="flex flex-1 items-center py-2 lg:py-4">
          <div class="grid w-full items-center gap-16 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-14 xl:gap-24">
            <!-- Hero (hidden on mobile) -->
            <div class="hidden max-w-[570px] lg:flex lg:flex-col lg:self-stretch lg:items-start">
              <div
                class="mb-8 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-3 py-1.5 text-xs font-medium text-[#286fcf] shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:text-[#8ec4ff]"
              >
                <span class="size-1.5 rounded-full bg-[#34C759] shadow-[0_0_10px_#34C759]" />
                Secure operations workspace
              </div>
              <h1
                class="max-w-[540px] text-[52px] font-semibold leading-[1.08] tracking-[-0.035em] text-[#17233a] dark:text-[#f3f7ff] xl:text-[64px]"
              >
                Operate with calm, connected clarity.
              </h1>
              <p class="mt-6 max-w-[455px] text-lg leading-8 text-[#667995] dark:text-[#a7b6cc]">
                Hospital Dashboard brings every essential network signal into one trusted operations platform.
              </p>

              <!-- Tech stack badges -->
              <div class="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
                <div class="flex -space-x-2.5" aria-label="Technology stack">
                  <span
                    title="FastAPI"
                    class="grid size-9 place-items-center rounded-full border-2 border-white bg-gradient-to-br from-[#d3faf4] to-[#99eadd] text-[#0b9d8d] shadow-[0_4px_12px_rgba(18,170,151,0.12)] dark:border-[#090d16] dark:from-[#1f4d47] dark:to-[#163d39] dark:text-[#6fd9cc]"
                  >
                    <ServerCog :size="16" :stroke-width="2.15" />
                  </span>
                  <span
                    title="Vue 3"
                    class="grid size-9 place-items-center rounded-full border-2 border-white bg-gradient-to-br from-[#d9f7e8] to-[#b0eccb] text-[#28a650] shadow-[0_4px_12px_rgba(40,166,80,0.12)] dark:border-[#090d16] dark:from-[#1f4a32] dark:to-[#173b27] dark:text-[#6de09a]"
                  >
                    <Workflow :size="16" :stroke-width="2.15" />
                  </span>
                  <span
                    title="TypeScript"
                    class="grid size-9 place-items-center rounded-full border-2 border-white bg-gradient-to-br from-[#e0e8ff] to-[#b9c9ff] text-[#476ad5] shadow-[0_4px_12px_rgba(71,106,213,0.16)] dark:border-[#090d16] dark:from-[#293f84] dark:to-[#202e68] dark:text-[#9db7ff]"
                  >
                    <Braces :size="16" :stroke-width="2.15" />
                  </span>
                </div>
                <span>
                  Built with Passion for
                  <strong
                    class="bg-gradient-to-r from-[#3B82F6] via-[#5B70E8] to-[#8B5CF6] bg-clip-text text-[16px] font-bold tracking-[-0.015em] text-transparent"
                  >
                    Code
                  </strong>
                  &amp; Technology
                </span>
              </div>
              <!-- Copyright — bottom-left, aligns with footer baseline -->
              <p class="mt-auto text-[11px] text-muted-foreground/65">
                © 2026 Hospital Dashboard
              </p>
            </div>

            <!-- Right column: Login Card + Footer -->
            <div class="mx-auto flex w-full max-w-[440px] flex-col justify-center">
              <LoginCard @signed-in="onSignedIn" />
              <!-- Footer — centered under the card -->
              <div class="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground/65">
                <span>Hospital Dashboard</span>
                <span class="inline-block size-1 shrink-0 select-none rounded-full bg-muted-foreground/35" aria-hidden="true" />
                <span>Version 0.9.0</span>
                <span class="hidden sm:inline-block size-1 shrink-0 select-none rounded-full bg-muted-foreground/35" aria-hidden="true" />
                <span class="hidden sm:inline">Powered by 关耳同学zzZ</span>
              </div>
            </div>
          </div>
        </section>


      </div>
    </main>
  </div>
</template>

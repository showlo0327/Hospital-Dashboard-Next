<script setup lang="ts">
import { Stethoscope } from 'lucide-vue-next'
import GlobalSearch from '@/components/shared/GlobalSearch.vue'
import CurrentTime from '@/components/shared/CurrentTime.vue'
import ThemeToggle from '@/components/shared/ThemeToggle.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-40 h-[64px] border-b border-white/60 bg-white/68 backdrop-blur-2xl dark:border-white/10 dark:bg-[#121620]/72"
  >
    <div class="flex h-full items-center gap-2.5 px-4">
      <!-- Logo + Title -->
      <div class="flex items-center gap-2.5 pr-2">
        <div
          class="grid size-8 place-items-center rounded-[15px] bg-primary text-primary-foreground shadow-md shadow-blue-500/20"
        >
          <Stethoscope :size="16" />
        </div>
        <h1 class="text-[17px] font-semibold tracking-[-0.005em]">
          Hospital Dashboard
        </h1>
      </div>

      <!-- Global Search -->
      <GlobalSearch />

      <!-- Right-side controls -->
      <CurrentTime />
      <ThemeToggle />
      <UserAvatar />
    </div>
  </header>
</template>

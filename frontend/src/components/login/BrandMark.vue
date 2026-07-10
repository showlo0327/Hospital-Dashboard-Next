<script setup lang="ts">
import { ShieldCheck } from 'lucide-vue-next'

withDefaults(defineProps<{ size?: 'sm' | 'md' | 'lg' }>(), { size: 'md' })

const sizes: Record<string, { container: string; icon: number }> = {
  sm:  { container: 'size-[42px] rounded-[14px]', icon: 20 },
  md:  { container: 'size-[54px] rounded-[19px]', icon: 27 },
  lg:  { container: 'size-[64px] rounded-[22px]', icon: 32 },
}
</script>

<template>
  <div
    :class="sizes[size].container"
    class="relative grid place-items-center overflow-hidden bg-gradient-to-br from-[#4F9BFF] via-[#3B82F6] to-[#2465D4] text-white shadow-[0_12px_30px_rgba(59,130,246,0.36)]"
  >
    <div class="absolute -right-3 -top-3 size-10 rounded-full bg-white/30 blur-md" />
    <ShieldCheck class="relative" :size="sizes[size].icon" :stroke-width="1.8" />
  </div>
</template>

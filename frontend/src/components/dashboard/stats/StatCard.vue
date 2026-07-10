<script setup lang="ts">
import type { Component } from 'vue'
import StatIcon from './StatIcon.vue'
import StatNumber from './StatNumber.vue'
import StatSubtitle from './StatSubtitle.vue'

/**
 * Composed stat card — glass appearance, Apple widget style.
 *
 * States:
 *   Normal  — Glass card with subtle shadow, 150ms hover lift
 *   Active  — Darker background, primary border, soft shadow
 *   Clickable — cursor-pointer, click emits @select
 *
 * @prop label     — Card title (e.g. "Total Devices")
 * @prop value     — Numeric or string display value
 * @prop meta      — Subtitle metadata line
 * @prop icon      — Lucide icon component
 * @prop toneClass — Icon color classes
 * @prop active    — Active/filtered state (default false)
 * @prop clickable — Enable click interaction (default true)
 *
 * @emits select — Fired on click when clickable
 */
defineProps<{
  label: string
  value: string | number
  meta: string
  icon: Component
  toneClass: string
  active?: boolean
  clickable?: boolean
}>()

const emit = defineEmits<{ select: [] }>()
</script>

<template>
  <div
    class="group rounded-[20px] border p-3.5 backdrop-blur-xl transition duration-[160ms] ease-in-out"
    :class="[
      clickable !== false ? 'cursor-pointer' : '',
      active
        ? 'border-primary/40 bg-white/92 shadow-[0_12px_36px_rgba(0,122,255,0.12)] scale-[1.015] dark:border-primary/40 dark:bg-white/14 dark:shadow-[0_12px_36px_rgba(10,132,255,0.16)]'
        : 'border-white/70 bg-white/72 shadow-[0_12px_32px_rgba(31,41,55,0.055)] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(31,41,55,0.10)] dark:border-white/10 dark:bg-white/8',
    ]"
    @click="emit('select')"
  >
    <div class="flex items-start justify-between gap-3">
      <p class="text-[10px] font-semibold uppercase leading-4 tracking-[0.13em] text-muted-foreground">
        {{ label }}
      </p>
      <StatIcon :icon="icon" :tone-class="toneClass" />
    </div>
    <StatNumber :value="value" />
    <StatSubtitle :text="meta" />
  </div>
</template>

<script setup lang="ts">
/**
 * Device name + IP address row.
 *
 * Typography hierarchy (Apple HIG):
 *   Level 1 — Device Name:  17px semibold, primary color
 *   Level 2 — IP Address:   13px JetBrains Mono, secondary color
 *
 * @prop name — Device display name (e.g. "Core-SW-OR-01")
 * @prop ip   — IPv4 address (e.g. "10.12.0.11")
 */
defineProps<{
  name: string
  ip: string
}>()
</script>

<template>
  <div class="min-w-0 flex-1">
    <h3 class="truncate text-[17px] font-semibold leading-[1.3]">{{ name }}</h3>
    <p class="mt-0.5 truncate font-mono text-[13px] leading-[1.35] text-muted-foreground" style="font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', monospace;">{{ ip }}</p>
  </div>
</template>

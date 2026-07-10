<script setup lang="ts">
/**
 * Base primitive — label + value display pair.
 * Used by all device info sub-components (Vendor, Model, Location, etc.).
 *
 * @prop label   — Small muted label above the value
 * @prop value   — Display value (semibold, truncated)
 * @prop wide    — When true, spans 2 columns in a grid layout
 *
 * @slot default — Override the value rendering
 *
 * Design Tokens Used:
 *   --color-muted-foreground, --font-weight-medium
 */
defineProps<{
  label: string
  value?: string | number
  wide?: boolean
}>()
</script>

<template>
  <div :class="['min-w-0', wide ? 'col-span-2' : '']">
    <p class="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
      {{ label }}
    </p>
    <p class="mt-0.5 truncate text-[12.5px] font-semibold">
      <slot>
        {{ value ?? '—' }}
      </slot>
    </p>
  </div>
</template>

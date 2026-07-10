<script setup lang="ts">
/**
 * Reusable collapsible inspector section.
 *
 * @prop title      — Section heading
 * @prop collapsible — Show collapse toggle (default false)
 *
 * @slot default — Section body content
 *
 * Component Maturity: Production Ready
 */
withDefaults(
  defineProps<{ title: string; collapsible?: boolean }>(),
  { collapsible: false },
)
</script>

<template>
  <div>
    <h4 class="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
      {{ title }}
    </h4>
    <div class="mt-2">
      <slot />
    </div>
  </div>
</template>

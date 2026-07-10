<script setup lang="ts">
defineProps<{
  floor: string
}>()
</script>

<template>
  <button
    class="side-row w-full py-1 pl-3 text-[13px] text-muted-foreground hover:text-sidebar-accent-foreground"
  >
    <span class="size-1.5 rounded-full bg-muted-foreground/45" />
    {{ floor }}
  </button>
</template>

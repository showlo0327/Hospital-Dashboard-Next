<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'

/**
 * Workspace refresh button.
 *
 * @prop loading — Show spinning animation during refresh
 *
 * @emits refresh — Parent should reload data.
 *
 * Component Maturity: Production Ready
 */
withDefaults(defineProps<{ loading?: boolean }>(), { loading: false })
const emit = defineEmits<{ refresh: [] }>()
</script>

<template>
  <button class="toolbar" :disabled="loading" @click="emit('refresh')">
    <RefreshCw :size="15" :class="{ 'animate-spin': loading }" />
    <span class="hidden sm:inline">{{ loading ? 'Refreshing...' : 'Refresh' }}</span>
  </button>
</template>

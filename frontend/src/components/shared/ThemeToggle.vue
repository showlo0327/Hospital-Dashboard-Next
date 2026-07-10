<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()
</script>

<template>
  <button class="toolbar" @click="ui.toggleDark()">
    <Sun v-if="ui.dark" :size="15" />
    <Moon v-else :size="15" />
  </button>
</template>

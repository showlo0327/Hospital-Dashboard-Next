<script setup lang="ts">
import { Clock3 } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted } from 'vue'

const time = ref('')

function updateTime() {
  time.value = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

let timer: ReturnType<typeof setInterval>
onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})
onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <button class="toolbar">
    <Clock3 :size="15" />
    {{ time }}
  </button>
</template>

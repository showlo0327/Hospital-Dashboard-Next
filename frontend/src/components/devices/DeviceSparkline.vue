<script setup lang="ts">
import { computed } from 'vue'

/**
 * SVG polyline sparkline for mini ping-history display.
 * 30 data points, no axes, colored by device status.
 *
 * @prop values — Array of numeric ping values (length should be 30)
 * @prop color  — Tailwind color class for the stroke
 * @prop height — SVG height in pixels (default 34)
 *
 * Future: API will supply 30-point history arrays in real time.
 *
 * Design Tokens Used:
 *   --color-chart-2, --color-chart-3, --color-chart-5, --color-muted-foreground
 */
const props = withDefaults(
  defineProps<{
    values: number[]
    color: string
    height?: number
  }>(),
  { height: 34 },
)

const points = computed(() => {
  if (props.values.length === 0) return ''
  const h = props.height
  const max = Math.max(...props.values, 1)
  const stepX = 100 / (props.values.length - 1)
  return props.values
    .map((v, i) => {
      const x = (i * stepX).toFixed(1)
      const y = (h - (v / max) * (h - 4) - 2).toFixed(1)
      return `${x},${y}`
    })
    .join(' ')
})

const viewBox = computed(() => `0 0 100 ${props.height}`)
</script>

<template>
  <svg
    :viewBox="viewBox"
    :height="height"
    class="w-full overflow-visible"
    preserveAspectRatio="none"
    role="img"
    aria-label="Ping latency sparkline"
  >
    <polyline
      v-if="values.length > 0"
      :points="points"
      fill="none"
      :stroke="`currentColor`"
      :class="color"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      vector-effect="non-scaling-stroke"
    />
  </svg>
</template>

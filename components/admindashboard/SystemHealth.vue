<template>
  <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg sm:text-xl font-bold text-gray-900">Module Completions (Last 2 Weeks)</h2>
    </div>

    <div v-if="data.length === 0" class="text-center py-8 text-gray-500">
      <p>No completion data available</p>
    </div>

    <div v-else class="relative h-52 sm:h-64">
      <svg
        :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
        class="w-full h-full border border-gray-200 rounded"
        preserveAspectRatio="xMidYMid meet"
      >
        <!-- Grid lines -->
        <defs>
          <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        <!-- Y-axis labels -->
        <text
          v-for="tick in yTicks"
          :key="tick"
          :x="30"
          :y="chartHeight - 20 - tick * yScale"
          class="text-xs fill-gray-600"
          text-anchor="end"
        >
          {{ tick }}
        </text>

        <!-- X-axis labels -->
        <text
          v-for="(point, index) in data"
          :key="point.date"
          v-show="index % visibleXLabelStep === 0 || index === data.length - 1"
          :x="50 + index * xStep"
          :y="chartHeight - 5"
          class="text-xs fill-gray-600"
          text-anchor="middle"
        >
          {{ formatDate(point.date) }}
        </text>

        <!-- Line -->
        <polyline
          :points="linePoints"
          fill="none"
          stroke="#3b82f6"
          stroke-width="2"
        />

        <!-- Data points -->
        <circle
          v-for="(point, index) in data"
          :key="point.date"
          :cx="50 + index * xStep"
          :cy="chartHeight - 20 - point.completions * yScale"
          r="4"
          fill="#3b82f6"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const chartWidth = 600
const chartHeight = 220

const maxCompletions = computed(() => {
  return Math.max(...props.data.map(d => d.completions), 1)
})

const yTicks = computed(() => {
  const max = maxCompletions.value
  const ticks = []
  for (let i = 0; i <= max; i += Math.max(1, Math.floor(max / 5))) {
    ticks.push(i)
  }
  return ticks
})

const yScale = computed(() => {
  return (chartHeight - 40) / maxCompletions.value
})

const xStep = computed(() => {
  if (props.data.length <= 1) return chartWidth - 100
  return (chartWidth - 100) / (props.data.length - 1)
})

const visibleXLabelStep = computed(() => {
  if (props.data.length <= 5) return 1
  return Math.ceil(props.data.length / 5)
})

const linePoints = computed(() => {
  return props.data.map((point, index) => {
    const x = 50 + index * xStep.value
    const y = chartHeight - 20 - point.completions * yScale.value
    return `${x},${y}`
  }).join(' ')
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>


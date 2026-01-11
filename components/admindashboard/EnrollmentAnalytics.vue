<template>
  <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-900">Enrollment Analytics</h2>
    </div>
    
    <div class="h-64 relative">
      <svg viewBox="0 0 400 200" class="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <!-- Grid lines -->
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0" />
          </linearGradient>
        </defs>
        
        <!-- Y-axis labels -->
        <g v-for="(tick, index) in yTicks" :key="'y-' + index">
          <line 
            :x1="padding" 
            :y1="padding + (chartHeight - 2 * padding) - (tick / maxValue) * (chartHeight - 2 * padding)"
            :x2="chartWidth - padding" 
            :y2="padding + (chartHeight - 2 * padding) - (tick / maxValue) * (chartHeight - 2 * padding)"
            stroke="#e5e7eb" 
            stroke-width="1"
            stroke-dasharray="2,2"
          />
          <text 
            :x="padding - 10" 
            :y="padding + (chartHeight - 2 * padding) - (tick / maxValue) * (chartHeight - 2 * padding) + 4"
            text-anchor="end" 
            class="text-xs fill-gray-500"
          >
            {{ tick }}
          </text>
        </g>
        
        <!-- Area under line -->
        <path 
          :d="areaPath" 
          fill="url(#lineGradient)"
        />
        
        <!-- Line -->
        <path 
          :d="linePath" 
          fill="none" 
          stroke="#3b82f6" 
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        
        <!-- Data points -->
        <circle 
          v-for="(point, index) in chartPoints" 
          :key="'point-' + index"
          :cx="point.x" 
          :cy="point.y" 
          r="5" 
          fill="#3b82f6"
          stroke="white"
          stroke-width="2"
        />
        
        <!-- X-axis labels -->
        <g v-for="(label, index) in labels" :key="'x-' + index">
          <text 
            :x="padding + (index * xStep)" 
            :y="chartHeight - padding + 20"
            text-anchor="middle" 
            class="text-xs fill-gray-600"
          >
            {{ label }}
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => [
      { day: 'Mon', value: 18 },
      { day: 'Tues', value: 22 },
      { day: 'Wed', value: 28 },
      { day: 'Thurs', value: 35 },
      { day: 'Fri', value: 32 }
    ]
  }
})

const chartWidth = 400
const chartHeight = 200
const padding = 40

// Use viewBox for responsive scaling, but keep calculations based on fixed dimensions

const maxValue = computed(() => {
  return Math.max(...props.data.map(d => d.value), 40)
})

const labels = computed(() => props.data.map(d => d.day))

const xStep = computed(() => {
  return (chartWidth - 2 * padding) / (props.data.length - 1)
})

const chartPoints = computed(() => {
  return props.data.map((item, index) => ({
    x: padding + (index * xStep.value),
    y: padding + (chartHeight - 2 * padding) - (item.value / maxValue.value) * (chartHeight - 2 * padding)
  }))
})

const linePath = computed(() => {
  if (chartPoints.value.length === 0) return ''
  
  let path = `M ${chartPoints.value[0].x} ${chartPoints.value[0].y}`
  for (let i = 1; i < chartPoints.value.length; i++) {
    path += ` L ${chartPoints.value[i].x} ${chartPoints.value[i].y}`
  }
  return path
})

const areaPath = computed(() => {
  if (chartPoints.value.length === 0) return ''
  
  let path = `M ${chartPoints.value[0].x} ${chartHeight - padding}`
  path += ` L ${chartPoints.value[0].x} ${chartPoints.value[0].y}`
  
  for (let i = 1; i < chartPoints.value.length; i++) {
    path += ` L ${chartPoints.value[i].x} ${chartPoints.value[i].y}`
  }
  
  const lastPoint = chartPoints.value[chartPoints.value.length - 1]
  path += ` L ${lastPoint.x} ${chartHeight - padding} Z`
  
  return path
})

const yTicks = computed(() => {
  const ticks = []
  const step = maxValue.value / 4
  for (let i = 0; i <= 4; i++) {
    ticks.push(Math.round(i * step))
  }
  return ticks
})
</script>


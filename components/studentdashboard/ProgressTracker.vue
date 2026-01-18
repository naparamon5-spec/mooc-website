<template>
  <div class="bg-white rounded-lg p-4 shadow-sm">
    <h3 class="text-sm font-semibold text-gray-800 mb-3">Progress Tracker</h3>
    <div class="flex flex-col items-center">
      <div class="relative w-20 h-20">
        <svg class="transform -rotate-90 w-20 h-20">
          <circle
            cx="40"
            cy="40"
            r="32"
            stroke="#e5e7eb"
            stroke-width="8"
            fill="none"
          />
          <circle
            cx="40"
            cy="40"
            r="32"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="offset"
            stroke="#3b82f6"
            stroke-width="8"
            fill="none"
            class="transition-all duration-300"
          />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-lg font-bold text-gray-800">{{ progress }}%</span>
        </div>
      </div>
      <p class="text-xs text-gray-600 mt-2 text-center">{{ moduleName }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  progress: {
    type: Number,
    default: 60
  },
  moduleName: {
    type: String,
    default: 'Current Module'
  }
})

const radius = 32
const circumference = 2 * Math.PI * radius

const offset = computed(() => {
  return circumference - (props.progress / 100) * circumference
})
</script>


<template>
  <div class="bg-white rounded-lg p-4 shadow-sm">
    <h3 class="text-sm font-semibold text-gray-800 mb-3">Overall Progress</h3>
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
      <p class="text-xs text-gray-600 mt-2 text-center font-medium">
        {{ completedModules }} / {{ totalModules }} Modules
      </p>
      <p class="text-xs text-gray-500 mt-1 text-center">
        {{ getProgressDescription }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  completedModules: {
    type: Number,
    default: 0
  },
  completedLessonsInCurrentModule: {
    type: Number,
    default: 0
  },
  totalModules: {
    type: Number,
    default: 5
  },
  lessonsPerModule: {
    type: Number,
    default: 4
  }
})

// Calculation: Each module = 20%, Each lesson = 5%
// Total modules: 5 * 20% = 100%
// Each module has 4 lessons: 4 * 5% = 20%
const progress = computed(() => {
  const moduleProgress = props.completedModules * 20
  const lessonProgress = props.completedLessonsInCurrentModule * 5
  return Math.min(moduleProgress + lessonProgress, 100)
})

const radius = 32
const circumference = computed(() => 2 * Math.PI * radius)
const offset = computed(() => circumference.value - (progress.value / 100) * circumference.value)

const getProgressDescription = computed(() => {
  const pct = progress.value;
  if (pct === 0) return 'Not started';
  if (pct < 20) return 'Just getting started';
  if (pct < 40) return '20% complete';
  if (pct < 60) return '40% complete';
  if (pct < 80) return '60% complete';
  if (pct < 100) return '80% complete';
  return 'Congratulations! Complete!';
})
</script>


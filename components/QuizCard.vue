<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
    <!-- Quiz Header -->
    <div class="bg-gradient-to-r from-primary-50 to-primary-100 p-4">
      <h3 class="font-semibold text-gray-900">{{ quiz.title }}</h3>
      <p class="text-xs text-gray-600 mt-1 line-clamp-2">{{ quiz.description }}</p>
    </div>

    <!-- Quiz Details -->
    <div class="p-4 space-y-3">
      <!-- Questions Count -->
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600">Questions:</span>
        <span class="font-semibold text-gray-900">{{ quiz.questions?.length || 0 }}</span>
      </div>

      <!-- Passing Score -->
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600">Pass Score:</span>
        <span class="font-semibold text-gray-900">{{ quiz.passing_score || 70 }}%</span>
      </div>

      <!-- Status Badge -->
      <div v-if="hasAttempted" class="flex items-center justify-between text-sm">
        <span class="text-gray-600">Your Score:</span>
        <span
          :class="userScore >= (quiz.passing_score || 70) 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'"
          class="px-3 py-1 rounded-full text-xs font-semibold"
        >
          {{ userScore }}%
        </span>
      </div>

      <!-- Status Text -->
      <div v-if="hasAttempted" class="text-xs">
        <span v-if="userPassed" class="text-green-600 font-medium">✓ Passed</span>
        <span v-else class="text-red-600 font-medium">✗ Failed - Try Again</span>
      </div>
    </div>

    <!-- Action Button -->
    <div class="border-t border-gray-200 p-4">
      <button
        @click="$emit('start-quiz')"
        :disabled="loading"
        :class="hasAttempted && userPassed 
          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
          : 'bg-primary-600 text-white hover:bg-primary-700'"
        class="w-full py-2 rounded-lg font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Loading...' : hasAttempted && userPassed ? 'Retake Quiz' : hasAttempted ? 'Retake Quiz' : 'Start Quiz' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  quiz: {
    type: Object,
    required: true,
  },
  userResult: {
    type: Object,
    default: null,
  },
})

defineEmits(['start-quiz'])

const loading = ref(false)

const hasAttempted = computed(() => !!props.userResult)
const userScore = computed(() => props.userResult?.score || 0)
const userPassed = computed(() => props.userResult?.passed || false)
</script>

<style scoped>
/* Add any component-specific styles here if necessary */
</style>

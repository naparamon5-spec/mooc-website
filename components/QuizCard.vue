<template>
  <div
    class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary-200 transition cursor-pointer flex flex-col h-full"
    @click="startQuiz"
  >
    <!-- Quiz Header -->
    <div class="p-4 pb-3">
      <h3 class="font-semibold text-gray-900 line-clamp-2">
        {{ quiz.title }}
      </h3>
      <p v-if="quiz.description" class="text-xs text-gray-600 mt-1 line-clamp-2">
        {{ quiz.description }}
      </p>
    </div>

    <!-- Quiz Details -->
    <div class="px-4 pb-4 space-y-2 text-xs text-gray-600 flex-1">
      <div class="flex items-center justify-between">
        <span>Questions</span>
        <span class="font-semibold text-gray-900 text-sm">
          {{ quiz.questions?.length || 0 }}
        </span>
      </div>

      <div class="flex items-center justify-between">
        <span>Pass score</span>
        <span class="font-semibold text-gray-900 text-sm">
          {{ quiz.passing_score || 70 }}%
        </span>
      </div>

      <div v-if="hasAttempted" class="pt-2 space-y-1">
        <div class="flex items-center justify-between">
          <span>Your score</span>
          <span
            :class="userScore >= (quiz.passing_score || 70)
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'"
            class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
          >
            {{ userScore }}%
          </span>
        </div>
        <p class="text-[11px]">
          <span v-if="userPassed" class="text-green-600 font-medium">Passed</span>
          <span v-else class="text-red-600 font-medium">Failed — try again</span>
        </p>
      </div>
    </div>

    <!-- Action Button -->
    <div class="border-t border-gray-100 p-3 mt-auto">
      <button
        type="button"
        @click.stop="startQuiz"
        :disabled="loading"
        :class="hasAttempted && userPassed
          ? 'bg-green-50 text-green-700 hover:bg-green-100'
          : 'bg-primary-600 text-white hover:bg-primary-700'"
        class="w-full py-2 rounded-lg font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Loading...' : hasAttempted ? 'Retake quiz' : 'Start quiz' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

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

const router = useRouter()
const loading = ref(false)

const hasAttempted = computed(() => !!props.userResult)
const userScore = computed(() => props.userResult?.score || 0)
const userPassed = computed(() => props.userResult?.passed || false)

const startQuiz = () => {
  loading.value = true
  router.push(`/quizzes/${props.quiz.id}`)
}
</script>

<style scoped>
/* Add any component-specific styles here if necessary */
</style>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <DashboardHeader />

    <main class="max-w-6xl w-full mx-auto px-6 lg:px-8 py-10 flex-grow flex">
      <div v-if="loading" class="text-center py-12 flex-1">
        <p class="text-gray-600">Loading quiz...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6 flex-1">
        <p>{{ error }}</p>
        <button @click="router.back()" class="mt-4 text-sm underline">Go Back</button>
      </div>

      <div v-else-if="!quiz && !loading" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700 mb-6 flex-1">
        Quiz not found.
      </div>

      <div v-else-if="quiz" class="flex w-full flex-col lg:flex-row gap-6 lg:gap-8">
        <!-- Sidebar with question numbers -->
        <aside class="w-full lg:w-1/4 xl:w-1/5 bg-white p-5 lg:p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24 self-start max-h-[70vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">Questions</h3>
          <ul class="space-y-2">
            <li
              v-for="(q, idx) in quiz.questions"
              :key="idx"
              @click="currentQuestionIndex = idx as number"
              class="cursor-pointer px-3 py-2 rounded-full text-center text-sm font-medium transition-colors"
              :class="[
                currentQuestionIndex === (idx as number)
                  ? 'bg-primary-600 text-white'
                  : isAnswered(idx as number)
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200',
              ]"
            >
              {{ (idx as number) + 1 }}
            </li>
          </ul>
        </aside>

        <!-- Main quiz content -->
        <div class="flex-1">
          <div class="mb-8">
            <h1 class="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-3">
              {{ quiz.title }}
            </h1>
            <p v-if="quiz.description" class="text-gray-700 mb-5 max-w-3xl">
              {{ quiz.description }}
            </p>

            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div class="text-sm text-gray-600">
                Question
                <span class="font-semibold">
                  {{ currentQuestionIndex + 1 }} / {{ quiz.questions.length }}
                </span>
              </div>

              <div class="w-full sm:w-1/2 lg:w-2/5">
                <div class="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{{ progress }}%</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary-600 transition-all duration-300"
                    :style="{ width: `${progress}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!result">
            <div v-if="currentQuestion" class="mb-10 bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[260px] flex flex-col justify-between">
              <p class="font-semibold mb-6 text-xl leading-relaxed">
                {{ currentQuestionIndex + 1 }}. {{ currentQuestion.question }}
              </p>

              <div v-if="currentQuestion.type === 'multiple_choice'" class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <label
                  v-for="(opt, oi) in currentQuestion.options"
                  :key="oi"
                  class="flex items-center gap-3 cursor-pointer rounded-xl border border-gray-200 px-4 py-3 hover:border-primary-300 hover:bg-primary-50/40 transition"
                >
                  <input
                    type="radio"
                    :name="`q${currentQuestionIndex}`"
                    :value="oi"
                    v-model="answers[currentQuestionIndex]"
                    class="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 flex-shrink-0"
                  />
                  <span class="text-gray-800 text-sm md:text-base leading-snug">{{ opt }}</span>
                </label>
              </div>

              <div v-else-if="currentQuestion.type === 'true_false'" class="space-y-3">
                <label class="flex items-center gap-3 cursor-pointer rounded-xl border border-gray-200 px-4 py-3 hover:border-primary-300 hover:bg-primary-50/40 transition">
                  <input
                    type="radio"
                    :name="`q${currentQuestionIndex}`"
                    value="True"
                    v-model="answers[currentQuestionIndex]"
                    class="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 flex-shrink-0"
                  />
                  <span class="text-gray-800 text-sm md:text-base">True</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer rounded-xl border border-gray-200 px-4 py-3 hover:border-primary-300 hover:bg-primary-50/40 transition">
                  <input
                    type="radio"
                    :name="`q${currentQuestionIndex}`"
                    value="False"
                    v-model="answers[currentQuestionIndex]"
                    class="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 flex-shrink-0"
                  />
                  <span class="text-gray-800 text-sm md:text-base">False</span>
                </label>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-3">
              <button
                v-if="currentQuestionIndex > 0"
                @click="currentQuestionIndex--"
                class="inline-flex justify-center items-center bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-medium"
              >
                Previous
              </button>
              <button
                v-if="currentQuestionIndex < quiz.questions.length - 1"
                @click="currentQuestionIndex++"
                class="inline-flex justify-center items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 text-sm font-medium"
              >
                Next
              </button>
              <button
                v-else
                @click="submitQuiz"
                :disabled="submitting || !allAnswered"
                class="inline-flex justify-center items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
              >
                {{ submitting ? 'Submitting...' : 'Submit Quiz' }}
              </button>
            </div>
          </div>

          <div v-else class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 class="text-2xl font-semibold mb-4">
              {{ result.passed ? 'Congratulations!' : 'Quiz Completed' }}
            </h2>
            <p class="mb-2">Your score: {{ result.score }}%</p>
            <p
              :class="result.passed ? 'text-green-600' : 'text-red-600'"
              class="font-medium"
            >
              {{ result.passed ? 'You passed the quiz.' : 'You did not pass. Please try again.' }}
            </p>
            <div class="mt-6 flex gap-3">
              <button
                v-if="!result.passed"
                @click="retakeQuiz"
                class="bg-primary-100 text-primary-700 px-4 py-2 rounded hover:bg-primary-200"
              >
                Retake Quiz
              </button>

              <button
                @click="goBack"
                class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Back to Module
              </button>
            </div>
          </div>

          <!-- Success Modal for Passed Quiz -->
          <SuccessModal
            v-if="result?.passed && showSuccessModal"
            :title="'Quiz Passed!'"
            :message="`Congratulations! You passed the quiz and earned the ${earnedBadgeName} badge.`"
            :buttonText="'Continue to Module'"
            @close="handleSuccessModalClose"
          />
        </div>
      </div>
    </main>

    <footer class="bg-primary-600 text-white text-center py-4">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardHeader from '~/components/studentdashboard/DashboardHeader.vue'
import SuccessModal from '~/components/SuccessModal.vue'
import { useQuizManagement } from '~/composables/useQuizManagement'
import { useCourseProgress } from '~/composables/useCourseProgress'
import { useModuleManagement } from '~/composables/useModuleManagement'

const route = useRoute()
const router = useRouter()
const quizId = computed(() => route.params.id as string)

const { fetchQuizById, submitQuizAnswers } = useQuizManagement()
const { completeModule, badgeMapping } = useCourseProgress()
const { fetchModules, modules } = useModuleManagement()

const quiz = ref<any>(null)
const loading = ref(false)
const error = ref('')
const answers = ref<Record<number, string | number>>({})
const result = ref<any>(null)
const submitting = ref(false)
const currentQuestionIndex = ref(0)
const showSuccessModal = ref(false)

const currentQuestion = computed(() => quiz.value?.questions[currentQuestionIndex.value])

const allAnswered = computed(() => {
  if (!quiz.value?.questions?.length) return false
  for (let i = 0; i < quiz.value.questions.length; i += 1) {
    if (answers.value[i] === undefined) {
      return false
    }
  }
  return true
})

const progress = computed(() => {
  if (!quiz.value?.questions?.length) return 0
  let answeredCount = 0
  for (let i = 0; i < quiz.value.questions.length; i += 1) {
    if (answers.value[i] !== undefined) {
      answeredCount += 1
    }
  }
  return Math.round((answeredCount / quiz.value.questions.length) * 100)
})

const isAnswered = (idx: number) => answers.value[idx] !== undefined

const earnedBadgeName = computed(() => {
  if (!quiz.value?.level || !quiz.value?.module_id) return 'Unknown Badge'
  
  const courseLevel = quiz.value.level
  const moduleId = quiz.value.module_id
  
  // Find module position in sorted list
  const sortedModules = modules.value
    .filter((m: any) => m.level === courseLevel)
    .slice()
    .sort((a: any, b: any) => {
      const aNum = parseInt(a.title?.match(/\d+/)?.[0] || '0', 10)
      const bNum = parseInt(b.title?.match(/\d+/)?.[0] || '0', 10)
      return aNum - bNum
    })
  
  const modulePosition = sortedModules.findIndex(m => String(m.id) === String(moduleId)) + 1 // 1-indexed
  
  const courseBadges = badgeMapping[courseLevel as keyof typeof badgeMapping]
  if (courseBadges && modulePosition > 0) {
    return courseBadges[modulePosition] || 'Unknown Badge'
  }
  return 'Unknown Badge'
})

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    console.log('Fetching quiz with ID:', quizId.value)
    const data = await fetchQuizById(quizId.value)
    console.log('Quiz data received:', data)
    if (data) {
      quiz.value = data
      currentQuestionIndex.value = 0
    } else {
      error.value = 'Quiz not found.'
    }
    
    // Fetch modules to determine badge
    await fetchModules()
  } catch (err) {
    error.value = 'Failed to load quiz.'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
})

const submitQuiz = async () => {
  if (!quiz.value) return
  submitting.value = true
  try {
    const res = await submitQuizAnswers(quizId.value, answers.value)
    if (res) {
      result.value = res

      // If user passed, mark the linked module as completed and show success modal
      if (res.passed && quiz.value?.module_id && quiz.value?.level) {
        completeModule(quiz.value.level, String(quiz.value.module_id))
        showSuccessModal.value = true
      }
    }
  } catch (err) {
    console.error('Error submitting quiz', err)
  } finally {
    submitting.value = false
  }
}

const retakeQuiz = () => {
  result.value = null
  answers.value = {}
  currentQuestionIndex.value = 0
}

const handleSuccessModalClose = () => {
  showSuccessModal.value = false
  goBack()
}

const goBack = () => {
  if (quiz.value?.module_id) {
    router.push(`/modules/${quiz.value.module_id}`)
  } else {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
/* optionally add global quiz styles */
</style>

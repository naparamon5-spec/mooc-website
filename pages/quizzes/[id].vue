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

      <div v-else-if="isLocked" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700 mb-6 flex-1">
        <p>Quiz is locked. You must complete lesson 4 of this module to access the quiz.</p>
        <button @click="router.back()" class="mt-4 text-sm underline">Go Back</button>
      </div>

      <div v-else-if="!quiz" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700 mb-6 flex-1">
        Quiz not found.
      </div>

      <div v-else-if="quiz" class="flex w-full flex-col lg:flex-row gap-6 lg:gap-8">
        <!-- Sidebar with question numbers -->
        <aside
          v-if="!isReviewOnly"
          class="w-full lg:w-1/4 xl:w-1/5 bg-white p-5 lg:p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24 self-start max-h-[70vh] overflow-y-auto"
        >
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

            <div v-if="!isReviewOnly" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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

          <!-- Review-only mode (already taken): show score + ONLY selected answers -->
          <div v-if="isReviewOnly" class="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 class="text-2xl font-semibold mb-2">Quiz already taken</h2>
            <p class="text-gray-700 mb-4">
              Your score: <span class="font-semibold">{{ existingResult?.score ?? 0 }}%</span>
              <span class="text-gray-500">/ {{ quiz.passing_score || 70 }}%</span>
            </p>
            <p
              class="font-medium mb-6"
              :class="existingResult?.passed ? 'text-green-600' : 'text-red-600'"
            >
              {{ existingResult?.passed ? 'Passed' : 'Not passed — you can try again' }}
            </p>

            <!-- Badge earned (only if passed and linked to a module) -->
            <div
              v-if="existingResult?.passed && quiz?.module_id"
              class="mb-8 flex items-center gap-4 p-4 rounded-xl border border-green-100 bg-green-50"
            >
              <img
                :src="badgeImage"
                :alt="earnedBadgeName"
                class="w-16 h-16 object-contain"
              />
              <div class="min-w-0">
                <p class="text-sm text-green-800 font-semibold">Badge earned</p>
                <p class="text-lg font-bold text-green-900 truncate">
                  {{ earnedBadgeName }}
                </p>
              </div>
            </div>

            <div class="space-y-6">
              <div
                v-for="(q, idx) in quiz.questions"
                :key="`review-${idx}`"
                class="border border-gray-100 rounded-xl p-4"
              >
                <p class="font-semibold text-gray-900 mb-2">
                  {{ idx + 1 }}. {{ q.question }}
                </p>
                <div class="text-sm text-gray-700">
                  <span class="font-medium text-gray-600">Your answer:</span>
                  <span class="ml-2">
                    {{ getSelectedAnswerText(q, idx) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-8 flex flex-wrap gap-3 justify-end">
              <button
                type="button"
                class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                @click="goBack"
              >
                Back to Module
              </button>
              <button
                type="button"
                class="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
                @click="startRetake"
              >
                Retake Quiz
              </button>
            </div>
          </div>

          <div v-else-if="!result">
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
                    v-model="answers[answerKey(currentQuestionIndex)]"
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
                    v-model="answers[answerKey(currentQuestionIndex)]"
                    class="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 flex-shrink-0"
                  />
                  <span class="text-gray-800 text-sm md:text-base">True</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer rounded-xl border border-gray-200 px-4 py-3 hover:border-primary-300 hover:bg-primary-50/40 transition">
                  <input
                    type="radio"
                    :name="`q${currentQuestionIndex}`"
                    value="False"
                    v-model="answers[answerKey(currentQuestionIndex)]"
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

        </div>
      </div>
    </main>

    <footer class="bg-primary-600 text-white text-center py-4">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>

    <!-- Success Modal for Passed Quiz -->
    <SuccessModal
      v-if="result?.passed && showSuccessModal"
      :isOpen="showSuccessModal"
      :title="'Quiz Passed!'"
      :message="`Congratulations! You passed the quiz and earned the ${earnedBadgeName} badge.`"
      :buttonText="continueButtonText"
      :secondary-button-text="'Back to Dashboard'"
      :image-src="badgeImage"
      @close="handleSuccessModalClose"
      @secondary="handleSecondaryAction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
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
const { completeModule, badgeMapping, courseProgress, loadProgressFromSupabase } = useCourseProgress()
const { fetchModules, modules } = useModuleManagement()

// ✅ useNuxtApp() called at top-level setup, not inside async functions
const { $supabase } = useNuxtApp()

const quiz = ref<any>(null)
const loading = ref(false)
const error = ref('')
// ✅ Type matches submitQuizAnswers signature exactly:
//    { [questionId: string]: string | number | undefined }
const answers = ref<{ [key: string]: string | number | undefined }>({})
const result = ref<any>(null)
const existingResult = ref<any | null>(null)
const isRetaking = ref(false)
const submitting = ref(false)
const currentQuestionIndex = ref(0)
const showSuccessModal = ref(false)

// ✅ Mirrors the key logic in submitQuizAnswers:
//    prefer question.id if it exists, otherwise fall back to String(index)
//    This ensures answers are stored and looked up under the same key used for scoring
const answerKey = (index: number): string => {
  const q = quiz.value?.questions?.[index]
  return q?.id ?? String(index)
}

const isReviewOnly = computed(() => {
  return !!existingResult.value && !isRetaking.value && !result.value
})

const isLocked = computed(() => {
  // If the user already has a result for this quiz, show results/review mode.
  if (existingResult.value) return false

  if (!quiz.value?.module_id || !quiz.value?.level) return false
  const courseLevel = quiz.value.level
  if (courseLevel !== 'beginner' && courseLevel !== 'advanced') return false
  const moduleId = quiz.value.module_id
  const levelProgress = courseProgress.value[courseLevel as 'beginner' | 'advanced']
  if (!levelProgress) return false
  const completedLessons = levelProgress.completedLessons.get(moduleId)
  return !completedLessons?.has(3)
})

const nextModuleId = computed(() => {
  if (!quiz.value?.level || !quiz.value?.module_id || !modules.value.length) return null
  const courseLevel = quiz.value.level
  const sorted = modules.value
    .filter((m: any) => m.level === courseLevel)
    .slice()
    .sort((a: any, b: any) => {
      const aNum = parseInt(a.title?.match(/\d+/)?.[0] || '0', 10)
      const bNum = parseInt(b.title?.match(/\d+/)?.[0] || '0', 10)
      return aNum - bNum
    })
  const idx = sorted.findIndex((m: any) => String(m.id) === String(quiz.value.module_id))
  if (idx >= 0 && idx < sorted.length - 1) {
    return String(sorted[idx + 1].id)
  }
  return null
})

const continueButtonText = computed(() => {
  return nextModuleId.value ? 'Continue to Next Module' : 'Back to Dashboard'
})

const currentQuestion = computed(() => quiz.value?.questions[currentQuestionIndex.value])

const allAnswered = computed(() => {
  if (!quiz.value?.questions?.length) return false
  for (let i = 0; i < quiz.value.questions.length; i += 1) {
    if (answers.value[answerKey(i)] === undefined) return false
  }
  return true
})

const progress = computed(() => {
  if (!quiz.value?.questions?.length) return 0
  let answeredCount = 0
  for (let i = 0; i < quiz.value.questions.length; i += 1) {
    if (answers.value[answerKey(i)] !== undefined) answeredCount += 1
  }
  return Math.round((answeredCount / quiz.value.questions.length) * 100)
})

const isAnswered = (idx: number) => answers.value[answerKey(idx)] !== undefined

const earnedBadgeName = computed(() => {
  if (!quiz.value?.level || !quiz.value?.module_id) return 'Unknown Badge'
  const courseLevel = quiz.value.level
  if (courseLevel !== 'beginner' && courseLevel !== 'advanced') return 'Unknown Badge'
  const moduleId = quiz.value.module_id
  const sortedModules = modules.value
    .filter((m: any) => m.level === courseLevel)
    .slice()
    .sort((a: any, b: any) => {
      const aNum = parseInt(a.title?.match(/\d+/)?.[0] || '0', 10)
      const bNum = parseInt(b.title?.match(/\d+/)?.[0] || '0', 10)
      return aNum - bNum
    })
  const modulePosition = sortedModules.findIndex((m: any) => String(m.id) === String(moduleId)) + 1
  const courseBadges = badgeMapping[courseLevel as keyof typeof badgeMapping]
  if (courseBadges && modulePosition > 0) {
    return courseBadges[modulePosition] || 'Unknown Badge'
  }
  return 'Unknown Badge'
})

const badgeImage = computed(() => {
  const map: Record<string, string> = {
    'LITERACY SCHOLAR': '/assets/MODULE1.png',
    'MEDIA SYSTEMS ADEPT': '/assets/MODULE2.png',
    'MEDIA LINGUIST': '/assets/MODULE3.png',
    'EQUITY ADVOCATE': '/assets/MODULE4.png',
    'RESPONSIBLE CITIZEN': '/assets/MODULE5.png',
    'CYBER GUARDIAN': '/assets/MODULE6.png',
    'GENERATIVE THINKER': '/assets/MODULE7.png',
    'DIGITAL MAVEN': '/assets/MODULE8.png',
    'MEDIA ANALYST': '/assets/MODULE9.png',
    'ETHICAL MEDIA CREATOR': '/assets/MODULE10.png',
  }
  return map[earnedBadgeName.value] || '/assets/default-badge.png'
})

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await fetchQuizById(quizId.value)
    if (data) {
      quiz.value = data
      currentQuestionIndex.value = 0
    } else {
      error.value = 'Quiz not found.'
    }
    await fetchModules()
    await loadProgressFromSupabase()
    await fetchExistingResult()
  } catch (err) {
    error.value = 'Failed to load quiz.'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
})

// ✅ $supabase used directly — no useNuxtApp() call inside async function
const fetchExistingResult = async () => {
  try {
    const { data: { user } } = await $supabase.auth.getUser()
    if (!user) return

    const { data, error: dbError } = await $supabase
      .from('quiz_results')
      .select('score, passed, answers, created_at')
      .eq('user_id', user.id)
      .eq('quiz_id', quizId.value)
      .maybeSingle()

    if (dbError) {
      console.error('Error fetching existing quiz result:', dbError)
      return
    }

    existingResult.value = data || null
  } catch (e) {
    console.error('Error fetching existing quiz result:', e)
  }
}

const getSelectedAnswerText = (question: any, idx: number) => {
  const saved = existingResult.value?.answers
  // ✅ Use same key logic as answerKey() so review display matches saved data
  const key = question?.id ?? String(idx)
  const raw = saved ? (saved[key] ?? saved[String(idx)]) : undefined
  if (raw === undefined || raw === null) return 'No answer'

  if (question?.type === 'multiple_choice') {
    const oi = typeof raw === 'number' ? raw : parseInt(String(raw), 10)
    if (Number.isFinite(oi) && Array.isArray(question.options) && question.options[oi] != null) {
      return question.options[oi]
    }
    return 'Answer recorded'
  }

  if (question?.type === 'true_false') {
    return String(raw)
  }

  return String(raw)
}

const startRetake = () => {
  isRetaking.value = true
  existingResult.value = null
  result.value = null
  answers.value = {}
  currentQuestionIndex.value = 0
}

// ✅ answers.value passed directly — no conversion needed,
//    type already matches { [questionId: string]: string | number | undefined }
const submitQuiz = async () => {
  if (!quiz.value) return
  submitting.value = true
  try {
    const res = await submitQuizAnswers(quizId.value, answers.value)
    if (res) {
      result.value = res
      if (res.passed && quiz.value?.module_id && quiz.value?.level) {
        completeModule(quiz.value.level, String(quiz.value.module_id))
      }
    }
  } catch (err) {
    console.error('Error submitting quiz', err)
  } finally {
    submitting.value = false
  }
}

watch(result, (val) => {
  if (val?.passed) {
    showSuccessModal.value = true
  }
})

const retakeQuiz = () => {
  result.value = null
  answers.value = {}
  currentQuestionIndex.value = 0
}

const handleSuccessModalClose = () => {
  showSuccessModal.value = false
  if (nextModuleId.value) {
    router.push(`/modules/${nextModuleId.value}`)
  } else {
    router.push('/dashboard')
  }
}

const handleSecondaryAction = () => {
  showSuccessModal.value = false
  router.push('/dashboard')
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
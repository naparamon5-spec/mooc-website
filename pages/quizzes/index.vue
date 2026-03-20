<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <DashboardHeader :student-name="studentName" />
    
    <main class="flex-grow">
      <div class="max-w-full mx-auto px-4 md:px-8 lg:px-12 py-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-8">All Available Quizzes</h1>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <svg class="w-12 h-12 text-primary-600 animate-spin mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-gray-600 mt-4 text-lg">Loading quizzes...</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!quizzes || quizzes.length === 0" class="flex items-center justify-center py-20">
          <div class="text-center max-w-md mx-auto">
            <div class="mb-4">
              <svg class="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-700 mb-2">No Quizzes Available</h2>
            <p class="text-gray-500 mb-6">
              There are no quizzes available at the moment. Check back later or continue with your modules.
            </p>
            <router-link 
              to="/dashboard" 
              class="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition"
            >
              Go to Dashboard
            </router-link>
          </div>
        </div>

        <!-- Quizzes Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <QuizCard
            v-for="quiz in quizzes"
            :key="quiz.id"
            :quiz="quiz"
            :user-result="quizResultsById[String(quiz.id)] || null"
            :is-locked="isQuizLocked(quiz)"
            @show-result="openResultModal"
          />
        </div>
      </div>
    </main>

    <!-- Result Modal -->
    <div
      v-if="showResultModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
      @click.self="closeResultModal"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-gray-100">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          Your score
        </h2>
        <p class="text-gray-700 mb-4">
          <span class="font-semibold">{{ selectedQuizTitle }}</span>
        </p>

        <div class="flex items-center justify-between mb-3">
          <span class="text-gray-600">Score</span>
          <span
            class="px-3 py-1 rounded-full text-sm font-semibold"
            :class="selectedResult?.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
          >
            {{ selectedResult?.score ?? 0 }}%
          </span>
        </div>

        <p
          class="text-sm font-medium mb-6"
          :class="selectedResult?.passed ? 'text-green-700' : 'text-red-700'"
        >
          {{ selectedResult?.passed ? 'Passed' : 'Not passed — you can try again' }}
        </p>

        <div class="flex gap-3 justify-end">
          <button
            type="button"
            class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            @click="closeResultModal"
          >
            Close
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700"
            @click="retakeSelectedQuiz"
          >
            Retake
          </button>
        </div>
      </div>
    </div>

    <footer class="bg-primary-600 text-white text-center py-4">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DashboardHeader from '~/components/studentdashboard/DashboardHeader.vue';
import QuizCard from '~/components/QuizCard.vue';
import { useQuizManagement } from '~/composables/useQuizManagement'
import { useCourseProgress } from '~/composables/useCourseProgress'
import { useRouter } from 'vue-router'

const { quizzes, loading, fetchQuizzes } = useQuizManagement()
const { courseProgress, loadProgressFromSupabase } = useCourseProgress()
const router = useRouter()

const studentName = ref('')
const quizResultsById = ref<Record<string, any>>({})

const showResultModal = ref(false)
const selectedResult = ref<any | null>(null)
const selectedQuizId = ref<string | null>(null)
const selectedQuizTitle = ref<string>('')

onMounted(async () => {
  await fetchQuizzes()
  await fetchQuizResults()
  await loadProgressFromSupabase()
})

const fetchQuizResults = async () => {
  try {
    const { $supabase } = useNuxtApp()
    const { data: { user } } = await $supabase.auth.getUser()
    if (!user) return

    const { data, error } = await $supabase
      .from('quiz_results')
      .select('quiz_id, score, passed, created_at')
      .eq('user_id', user.id)

    if (error) {
      console.error('Error loading quiz results:', error)
      return
    }

    const map: Record<string, any> = {}
    ;(data || []).forEach((row: any) => {
      map[String(row.quiz_id)] = row
    })
    quizResultsById.value = map
  } catch (e) {
    console.error('Error loading quiz results:', e)
  }
}

const openResultModal = ({ quiz, result }: any) => {
  selectedQuizId.value = String(quiz?.id ?? '')
  selectedQuizTitle.value = quiz?.title || 'Quiz'
  selectedResult.value = result || null
  showResultModal.value = true
}

const closeResultModal = () => {
  showResultModal.value = false
  selectedResult.value = null
  selectedQuizId.value = null
  selectedQuizTitle.value = ''
}

const retakeSelectedQuiz = () => {
  if (!selectedQuizId.value) return
  const id = selectedQuizId.value
  closeResultModal()
  router.push(`/quizzes/${id}`)
}

const isQuizLocked = (quiz: any) => {
  // If user has already attempted this quiz, do not lock it.
  if (quizResultsById[String(quiz.id)]) return false

  if (!quiz?.module_id || !quiz?.level) return false

  const courseLevel = quiz.level
  if (courseLevel !== 'beginner' && courseLevel !== 'advanced') return false

  const moduleId = quiz.module_id
  const levelProgress = courseProgress.value[courseLevel as 'beginner' | 'advanced']
  if (!levelProgress) return false

  const completedLessons = levelProgress.completedLessons.get(moduleId)
  // Require completion of lesson 4 (zero-based index 3)
  return !completedLessons?.has(3)
}
</script>

<style scoped>
/* Add any component-specific styles here if necessary */
</style>
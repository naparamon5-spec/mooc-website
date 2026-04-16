<template>
  <div class="min-h-screen bg-gray-50">
    <DashboardHeader />

    <main class="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 flex-grow flex flex-col items-stretch">
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

      <div v-else-if="quiz" class="flex w-full min-w-0 flex-col lg:flex-row lg:items-start gap-4 sm:gap-6 lg:gap-8">
        <!-- Question nav: horizontal scroll on small screens (left-aligned), sidebar on lg+ -->
        <aside
          v-if="!isReviewOnly"
          class="w-full min-w-0 lg:w-1/4 xl:w-1/5 shrink-0 bg-white p-4 sm:p-5 lg:p-6 rounded-2xl shadow-sm border border-gray-100 lg:sticky lg:top-24 lg:max-h-[70vh] lg:overflow-y-auto"
        >
          <h3 class="text-base sm:text-lg font-semibold mb-3 lg:mb-4 text-left">Questions</h3>
          <ul
            class="flex flex-row flex-nowrap gap-2 overflow-x-auto pb-1 -mx-1 px-1 [scrollbar-width:thin] lg:flex-col lg:flex-wrap lg:overflow-visible lg:space-y-0 lg:gap-2 lg:pb-0 lg:mx-0 lg:px-0"
            role="list"
          >
            <li
              v-for="(q, idx) in quiz.questions"
              :key="idx"
              @click="currentQuestionIndex = idx as number"
              class="cursor-pointer shrink-0 min-w-[2.75rem] h-10 px-3 rounded-full text-sm font-medium transition-colors flex items-center justify-center lg:w-full lg:min-w-0 lg:justify-center"
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
        <div class="flex-1 min-w-0">
          <div class="mb-8">
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-3">
              {{ quiz.title }}
            </h1>
            <p v-if="quiz.description" class="text-gray-700 mb-5 max-w-3xl">
              {{ quiz.description }}
            </p>

            <div v-if="!isReviewOnly" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div class="text-sm text-gray-600">
                Question
                <span class="font-semibold">{{ currentQuestionIndex + 1 }} / {{ quiz.questions.length }}</span>
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

          <!-- Quiz Image -->
          <div v-if="quiz.image_url" class="mb-8">
            <img
              :src="quiz.image_url"
              :alt="quiz.title"
              class="w-full h-auto rounded-2xl shadow-md object-cover max-h-96"
            />
          </div>

          <!-- Review-only mode -->
          <div v-if="isReviewOnly" class="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 class="text-2xl font-semibold mb-2">Quiz already taken</h2>
            <p class="text-gray-700 mb-4">
              Your score: <span class="font-semibold">{{ existingResult?.score ?? 0 }}%</span>
              <span class="text-gray-500"> / {{ quiz.passing_score || 70 }}%</span>
            </p>
            <p
              class="font-medium mb-6"
              :class="existingResult?.passed ? 'text-green-600' : 'text-red-600'"
            >
              {{ existingResult?.passed ? 'Passed' : 'Not passed — you can try again' }}
            </p>

            <!-- Badge earned -->
            <div
              v-if="existingResult?.passed && quiz?.module_id"
              class="mb-8 flex items-center gap-4 p-4 rounded-xl border border-green-100 bg-green-50"
            >
              <img :src="badgeImage" :alt="earnedBadgeName" class="w-16 h-16 object-contain" />
              <div class="min-w-0">
                <p class="text-sm text-green-800 font-semibold">Badge earned</p>
                <p class="text-lg font-bold text-green-900 truncate">{{ earnedBadgeName }}</p>
              </div>
            </div>

            <div class="space-y-6">
              <div
                v-for="(q, idx) in quiz.questions"
                :key="`review-${idx}`"
                class="border border-gray-100 rounded-xl p-4"
              >
                <p class="font-semibold text-gray-900 mb-2">{{ (idx as number) + 1 }}. {{ q.question }}</p>
                <div class="text-sm text-gray-700">
                  <span class="font-medium text-gray-600">Your answer:</span>
                  <span class="ml-2">{{ getSelectedAnswerText(q, idx as number) }}</span>
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

          <!-- Active quiz -->
          <div v-else-if="!result">
            <div
              v-if="currentQuestion"
              class="mb-10 bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[260px] flex flex-col justify-between"
            >
              <!-- Question Image -->
              <div v-if="currentQuestion.questionImageUrl" class="mb-6 rounded-lg overflow-hidden">
                <img
                  :src="currentQuestion.questionImageUrl"
                  :alt="currentQuestion.question"
                  class="w-full h-auto max-h-96 object-cover rounded-lg"
                />
              </div>

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
                    @change="answers[answerKey(currentQuestionIndex)] = oi"
                    :checked="answers[answerKey(currentQuestionIndex)] === oi"
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

          <!-- Result (failed) -->
          <div v-else class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 class="text-2xl font-semibold mb-4">
              {{ result.passed ? 'Congratulations!' : 'Quiz Completed' }}
            </h2>
            <p class="mb-2">Your score: {{ result.score }}%</p>
            <p :class="result.passed ? 'text-green-600' : 'text-red-600'" class="font-medium">
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

    <!--
      BADGE SUCCESS MODAL
      Always shown first when quiz is passed.
      Button label changes to "View Your Certificate" when it's the last module.
    -->
    <SuccessModal
      v-if="result?.passed && showSuccessModal"
      :isOpen="showSuccessModal"
      :title="'Quiz Passed!'"
      :message="`Congratulations! You passed the quiz and earned the ${earnedBadgeName} badge.`"
      :buttonText="isLastCourseModule ? 'View Your Certificate 🎓' : continueButtonText"
      :secondary-button-text="'Back to Dashboard'"
      :image-src="badgeImage"
      @close="handleSuccessModalClose"
      @secondary="handleSecondaryAction"
    />

    <!--
      CERTIFICATE MODAL
      Shown after the badge modal closes, only when the last module of a course is completed.
      Template URL will be auto-resolved from database if not provided.
    -->
    <CertificateModal
      v-if="showCertificateModal"
      :isOpen="showCertificateModal"
      :student-name="studentName"
      :template-url="certificateTemplateUrl"
      :course-level="(quiz?.level as 'beginner' | 'advanced')"
      @close="handleCertificateClose"
      @nextCourse="handleCertificateNextCourse"
      @backToDashboard="handleCertificateBackToDashboard"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardHeader from '~/components/studentdashboard/DashboardHeader.vue'
import SuccessModal from '~/components/SuccessModal.vue'
import CertificateModal from '~/components/CertificateModal.vue'
import { useQuizManagement } from '~/composables/useQuizManagement'
import { useCourseProgress } from '~/composables/useCourseProgress'
import { useModuleManagement } from '~/composables/useModuleManagement'
import { useUserProfile } from '~/composables/useUserProfile'
import { useCertificateTemplates } from '~/composables/useCertificateTemplates'
import { useBadgeManagement } from '~/composables/useBadgeManagement'

const route = useRoute()
const router = useRouter()
const quizId = computed(() => route.params.id as string)

const { fetchQuizById, submitQuizAnswers } = useQuizManagement()
const { completeModule, courseProgress, loadProgressFromSupabase } = useCourseProgress()
const { fetchModules, modules } = useModuleManagement()
const { fetchUserProfile } = useUserProfile()
const { templates: certificateTemplates, fetchTemplates: fetchCertificateTemplates } = useCertificateTemplates()
const { getBadge } = useBadgeManagement()

// useNuxtApp() called at top-level setup, not inside async functions
const { $supabase } = useNuxtApp()

const quiz = ref<any>(null)
const loading = ref(false)
const error = ref('')
const answers = ref<{ [key: string]: string | number | undefined }>({})
const result = ref<any>(null)
const existingResult = ref<any | null>(null)
const isRetaking = ref(false)
const submitting = ref(false)
const currentQuestionIndex = ref(0)
const showSuccessModal = ref(false)
const showCertificateModal = ref(false)
const studentName = ref('Student')
const badgeImage = ref('/assets/default-badge.png')
const resolvedBadgeName = ref('Unknown Badge')
const certificateSaved = ref(false)

// Use question.id if present, else fallback to string index — must match submitQuizAnswers
const answerKey = (index: number): string => {
  const q = quiz.value?.questions?.[index]
  return q?.id ?? String(index)
}

const isReviewOnly = computed(() => {
  return !!existingResult.value && !isRetaking.value && !result.value
})

const isLocked = computed(() => {
  if (existingResult.value) return false
  if (!quiz.value?.module_id || !quiz.value?.level) return false
  const courseLevel = quiz.value.level
  if (courseLevel !== 'beginner' && courseLevel !== 'advanced') return false
  const moduleId = quiz.value.module_id
  const levelProgress = courseProgress.value[courseLevel as 'beginner' | 'advanced']
  if (!levelProgress) return false
  const completedLessons = levelProgress.completedLessons.get(moduleId)

  // Unlock should be based on the module's actual lesson count.
  // Some advanced modules may not have a lesson at index 3, so hardcoding `3`
  // can keep the quiz locked forever.
  const module = modules.value.find((m: any) => String(m.id) === String(moduleId))
  const requiredLessonIndex = Array.isArray(module?.lessons) && module.lessons.length > 0
    ? module.lessons.length - 1
    : 3

  return !completedLessons?.has(requiredLessonIndex)
})

const nextModuleId = computed(() => {
  if (!quiz.value?.level || !quiz.value?.module_id || !modules.value.length) return null
  const courseLevel = quiz.value.level
  const sorted = modules.value
    .filter((m: any) => m.level === courseLevel && m.is_active)
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

// True when the completed module is the LAST active module of its course level
// Works for both beginner (module 5) and advanced (module 10)
const isLastCourseModule = computed(() => {
  if (!quiz.value?.level || !quiz.value?.module_id) return false
  const courseLevel = quiz.value.level as 'beginner' | 'advanced'

  const courseMods = modules.value
    .filter((m: any) => m.level === courseLevel && m.is_active)
    .slice()
    .sort((a: any, b: any) => {
      const aNum = parseInt(a.title?.match(/\d+/)?.[0] || '0', 10)
      const bNum = parseInt(b.title?.match(/\d+/)?.[0] || '0', 10)
      return aNum - bNum
    })

  if (courseMods.length === 0) return false
  const lastModule = courseMods[courseMods.length - 1]
  return String(quiz.value.module_id) === String(lastModule.id)
})

// Pull the certificate template URL from DB based on course level — not hardcoded
const certificateTemplateUrl = computed((): string | undefined => {
  if (!quiz.value?.level) return undefined
  const tmpl = certificateTemplates.value.find(
    (t: any) => t.course_level === quiz.value.level
  )
  return tmpl?.template_url || undefined
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

const getCurrentModulePosition = () => {
  if (!quiz.value?.level || !quiz.value?.module_id) return 0

  const sortedModules = modules.value
    .filter((m: any) => m.level === quiz.value.level && m.is_active)
    .slice()
    .sort((a: any, b: any) => {
      const aNum = parseInt(a.title?.match(/\d+/)?.[0] || '0', 10)
      const bNum = parseInt(b.title?.match(/\d+/)?.[0] || '0', 10)
      return aNum - bNum
    })

  return sortedModules.findIndex((m: any) => String(m.id) === String(quiz.value.module_id)) + 1
}

const earnedBadgeName = computed(() => resolvedBadgeName.value)

const resolveEarnedBadge = async () => {
  if (!quiz.value?.level || !quiz.value?.module_id) {
    resolvedBadgeName.value = 'Unknown Badge'
    badgeImage.value = '/assets/default-badge.png'
    return
  }

  const courseLevel = quiz.value.level
  if (courseLevel !== 'beginner' && courseLevel !== 'advanced') {
    resolvedBadgeName.value = 'Unknown Badge'
    badgeImage.value = '/assets/default-badge.png'
    return
  }

  const modulePosition = getCurrentModulePosition()
  if (modulePosition <= 0) {
    resolvedBadgeName.value = 'Unknown Badge'
    badgeImage.value = '/assets/default-badge.png'
    return
  }

  try {
    const badge = await getBadge(courseLevel, modulePosition)
    resolvedBadgeName.value = badge?.badge_name || 'Unknown Badge'
    badgeImage.value = badge?.image_url || '/assets/default-badge.png'
  } catch (err) {
    console.error('Error resolving earned badge:', err)
    resolvedBadgeName.value = 'Unknown Badge'
    badgeImage.value = '/assets/default-badge.png'
  }
}

watch(
  [quiz, modules],
  async () => {
    await resolveEarnedBadge()
  },
  { immediate: true, deep: true }
)

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
    await fetchCertificateTemplates()
    await fetchExistingResult()
    await loadStudentName()
    await resolveEarnedBadge()
  } catch (err) {
    error.value = 'Failed to load quiz.'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
})

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

const loadStudentName = async () => {
  try {
    const userData = await fetchUserProfile()
    if (userData?.full_name) {
      studentName.value = userData.full_name
    }
  } catch (err) {
    console.error('Error loading student profile:', err)
  }
}

// Saves certificate record to DB — works for both beginner and advanced
// Uses actual table schema: module_id, course_level, student_id, issued_at
const saveCertificateToDatabase = async () => {
  try {
    const { data: { user } } = await $supabase.auth.getUser()
    if (!user || !quiz.value?.level || !quiz.value?.module_id) {
      console.log('❌ Missing user, quiz level, or module_id')
      return
    }

    console.log('💾 Saving certificate for:', quiz.value.level, 'Module:', quiz.value.module_id, 'User:', user.id)

    // Verify template is available from already-loaded templates
    const template = certificateTemplates.value.find(t => t.course_level === quiz.value.level)
    if (!template?.template_url) {
      console.error('❌ No certificate template found for', quiz.value.level)
      return
    }
    console.log('✅ Template found:', template.course_level)

    // Check if certificate already exists for this user, module, and course level to prevent duplicates
    const { data: existingCerts, error: checkError } = await $supabase
      .from('certificates')
      .select('id')
      .eq('student_id', user.id)
      .eq('module_id', quiz.value.module_id)
      .eq('course_level', quiz.value.level)

    if (checkError) {
      console.error('❌ Error checking for existing certificate:', checkError)
      return
    }

    // If certificate already exists, don't create a duplicate
    if (existingCerts && existingCerts.length > 0) {
      console.log('✅ Certificate already exists for this module, skipping duplicate creation')
      return
    }

    // Insert certificate record using actual table schema
    const certificateData = {
      student_id: user.id,
      module_id: quiz.value.module_id,
      course_level: quiz.value.level,
      certificate_url: null, // Generated on-the-fly during download, not pre-generated
      issued_at: new Date().toISOString()
    }

    console.log('📝 Inserting certificate with data:', certificateData)

    const { data: insertedData, error: insertError } = await $supabase
      .from('certificates')
      .insert([certificateData])
      .select()

    if (insertError) {
      console.error('❌ Error saving certificate:', insertError)
      return
    }

    console.log('✅ Certificate saved successfully:', insertedData)
  } catch (err) {
    console.error('❌ Error saving certificate to database:', err)
  }
}

const getSelectedAnswerText = (question: any, idx: number) => {
  const saved = existingResult.value?.answers
  const key = question?.id ?? String(idx)
  const raw = saved ? (saved[key] ?? saved[String(idx)]) : undefined
  if (raw === undefined || raw === null) return 'No answer'

  if (question?.type === 'multiple_choice') {
    const oi: number = typeof raw === 'number' ? raw : parseInt(String(raw), 10)
    if (Number.isFinite(oi) && Array.isArray(question.options) && oi >= 0 && question.options[oi] != null) {
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

const submitQuiz = async () => {
  if (!quiz.value) return
  submitting.value = true
  try {
    const res = await submitQuizAnswers(quizId.value, answers.value)
    if (res) {
      result.value = res
      if (res.passed && quiz.value?.module_id && quiz.value?.level) {
        completeModule(quiz.value.level, String(quiz.value.module_id))
        // Small delay to ensure badge is persisted before modals open
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
  } catch (err) {
    console.error('Error submitting quiz', err)
  } finally {
    submitting.value = false
  }
}

// Watch result: when quiz is passed, save certificate and show it
watch(result, async (val) => {
  if (val?.passed) {
    if (isLastCourseModule.value) {
      // Prevent saving certificate multiple times for the same quiz completion
      if (certificateSaved.value) {
        console.log('✅ Certificate already saved for this quiz, skipping duplicate call')
        return
      }
      
      // Ensure templates are loaded before showing certificate modal
      if (certificateTemplates.value.length === 0) {
        console.log('🔄 Templates not loaded yet, fetching...')
        await fetchCertificateTemplates()
      }
      
      const tmpl = certificateTemplates.value.find(t => t.course_level === quiz.value.level)
      console.log('📜 Certificate template data:', {
        courseLevelNeeded: quiz.value.level,
        foundTemplate: tmpl,
        templateUrl: tmpl?.template_url,
        allTemplates: certificateTemplates.value.map(t => ({ level: t.course_level, url: t.template_url?.substring(0, 50) }))
      })
      
      // Mark certificate as saved to prevent duplicates
      certificateSaved.value = true
      
      // Save certificate to database
      await saveCertificateToDatabase()
      // Small delay to let save complete
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Show certificate modal immediately after quiz completion
      showCertificateModal.value = true
    } else {
      // Not the last module - just show badge modal
      showSuccessModal.value = true
    }
  }
})

const retakeQuiz = () => {
  result.value = null
  answers.value = {}
  currentQuestionIndex.value = 0
  certificateSaved.value = false
}

// Badge modal primary button handler
// If last module → close badge modal and open certificate modal
// Otherwise navigate to next module or dashboard
const handleSuccessModalClose = () => {
  showSuccessModal.value = false
  if (isLastCourseModule.value) {
    showCertificateModal.value = true
  } else if (nextModuleId.value) {
    router.push(`/modules/${nextModuleId.value}`)
  } else {
    router.push('/dashboard')
  }
}

// Badge modal secondary button (Back to Dashboard)
const handleSecondaryAction = () => {
  showSuccessModal.value = false
  router.push('/dashboard')
}

// Certificate modal handlers
const handleCertificateClose = () => {
  showCertificateModal.value = false
  router.push('/dashboard')
}

const handleCertificateNextCourse = () => {
  showCertificateModal.value = false
  router.push('/dashboard?course=advanced')
}

const handleCertificateBackToDashboard = () => {
  showCertificateModal.value = false
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
/* quiz styles */
</style>

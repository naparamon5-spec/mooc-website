<template>
  <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
    <h3 class="text-lg font-bold text-gray-900 mb-6">
      {{ isEditMode ? 'Edit Quiz' : 'Create New Quiz' }}
    </h3>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Title -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Quiz Title <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.title"
          type="text"
          placeholder="e.g., Media Literacy Fundamentals"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          v-model="formData.description"
          placeholder="Brief description of the quiz..."
          rows="3"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        ></textarea>
      </div>

      <!-- Level -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Course Level <span class="text-red-500">*</span>
        </label>
        <select
          v-model="formData.level"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        >
          <option value="beginner">Beginner</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <!-- Module -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Assign to Module <span class="text-red-500">*</span>
        </label>
        <select
          v-model="formData.moduleId"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        >
          <option value="">Select a module</option>
          <option
            v-for="module in availableModules"
            :key="module.id"
            :value="module.id"
          >
            {{ module.title }}
          </option>
        </select>
        <p class="text-xs text-gray-500 mt-1">Each module can only have one quiz assigned to it</p>
      </div>

      <!-- Passing Score -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Passing Score (%) <span class="text-red-500">*</span>
        </label>
        <input
          v-model.number="formData.passingScore"
          type="number"
          min="0"
          max="100"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>

      <!-- Questions Section -->
      <div class="border-t border-gray-200 pt-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h4 class="text-md font-semibold text-gray-900">Questions</h4>
            <p class="text-xs text-gray-500 mt-1">{{ 
              formData.level === 'beginner' && fifthBeginnerModuleId && formData.moduleId === fifthBeginnerModuleId 
                ? 'Beginner Module 5 requires exactly 20 questions'
                : 'Add up to 10 questions (maximum)'
            }}</p>
          </div>
          <button
            type="button"
            @click="addQuestion"
            :disabled="formData.questions.length >= maxQuestions"
            class="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm font-medium hover:bg-primary-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Add Question
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="formData.questions.length === 0" class="text-center py-8 bg-gray-50 rounded">
          <p class="text-gray-500">No questions added yet. Click "Add Question" to start.</p>
          <p class="text-xs text-gray-400 mt-2">{{ 
            formData.level === 'beginner' && fifthBeginnerModuleId && formData.moduleId === fifthBeginnerModuleId 
              ? 'Beginner Module 5: exactly 20 questions required'
              : 'Maximum: 10 questions per quiz'
          }}</p>
        </div>

        <!-- Questions List -->
        <div v-else class="space-y-6">
          <template v-for="(question, idx) in formData.questions" :key="idx">
            <div
              v-if="question"
              class="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <!-- Question Number and Delete -->
              <div class="flex items-center justify-between mb-4">
                <h5 class="font-semibold text-gray-900">Question {{ idx + 1 }}</h5>
                <button
                  type="button"
                  @click="removeQuestion(idx)"
                  class="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>

              <!-- Question Text -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Question <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="question.question"
                  placeholder="Enter the question..."
                  rows="2"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                ></textarea>
              </div>

              <!-- Question Type -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Question Type <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="question.type"
                  @change="updateQuestionType(idx)"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                </select>
              </div>

              <!-- Options -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Options
                </label>
                <div class="space-y-2">
                  <div
                    v-for="(option, optIdx) in question.options"
                    :key="optIdx"
                    class="flex gap-2"
                  >
                    <input
                      v-model="question.options[optIdx]"
                      type="text"
                      :placeholder="`Option ${optIdx + 1}`"
                      class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      type="button"
                      @click="removeOption(idx, optIdx)"
                      v-if="question.options.length > 1"
                      class="text-red-600 hover:text-red-800 px-2 py-2"
                    >
                      ✕
                    </button>
                  </div>

                  <button
                    v-if="question.type === 'multiple_choice'"
                    type="button"
                    @click="addOption(idx)"
                    class="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  >
                    + Add Option
                  </button>
                </div>
              </div>

              <!-- Correct Answer -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Correct Answer <span class="text-red-500">*</span>
                </label>
                <select
                  v-if="question.type === 'true_false'"
                  v-model="question.correctAnswer"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select correct answer</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
                <select
                  v-else
                  v-model.number="question.correctAnswer"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select correct answer</option>
                  <option
                    v-for="(option, optIdx) in question.options"
                    :key="optIdx"
                    :value="optIdx"
                  >
                    {{ option || `Option ${optIdx + 1}` }}
                  </option>
                </select>
              </div>

            </div><!-- end question card -->
          </template><!-- end v-for -->
        </div><!-- end v-else -->

      </div><!-- end Questions Section -->

      <!-- Form Actions -->
      <div class="flex gap-3 pt-6 border-t border-gray-200">
        <button
          type="submit"
          :disabled="loading"
          class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Saving...' : isEditMode ? 'Update Quiz' : 'Create Quiz' }}
        </button>
        <button
          type="button"
          @click="$emit('cancel')"
          class="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p class="font-semibold text-sm">Error:</p>
        <p class="text-sm">{{ error }}</p>
      </div>

    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, onMounted, computed } from 'vue'
import { useQuizManagement, type Quiz, type QuizQuestion } from '~/composables/useQuizManagement'
import { useModuleManagement } from '~/composables/useModuleManagement'

const props = defineProps({
  quiz: {
    type: Object as any,
    default: null,
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['save', 'cancel'])

const { createQuiz, updateQuiz, loading, error, fetchQuizzes, quizzes } = useQuizManagement()
const { fetchModules, modules } = useModuleManagement()

const formData = reactive<Quiz>({
  title: '',
  description: '',
  moduleId: '',
  level: 'beginner',
  questions: [],
  passingScore: 70,
})

const initializeForm = () => {
  if (props.quiz) {
    formData.title = props.quiz.title || ''
    formData.description = props.quiz.description || ''
    formData.moduleId = props.quiz.moduleId || props.quiz.module_id || ''
    formData.level = props.quiz.level || 'beginner'
    formData.passingScore = props.quiz.passing_score || 70
    // Deep clone questions to avoid reference issues
    formData.questions = props.quiz.questions ? JSON.parse(JSON.stringify(props.quiz.questions)) : []
  } else {
    formData.title = ''
    formData.description = ''
    formData.moduleId = ''
    formData.level = 'beginner'
    formData.passingScore = 70
    formData.questions = []
  }
}

onMounted(async () => {
  initializeForm()
  await fetchModules()
  await fetchQuizzes()
})

// Filter modules by selected course level and exclude modules that already have quizzes
const availableModules = computed(() => {
  if (!formData.level) return []
  
  // Get modules that match the selected level
  let levelModules = modules.value.filter((m: any) => m.level === formData.level)
  
  // Get module IDs that already have quizzes assigned (handle both moduleId and module_id)
  const assignedModuleIds = quizzes.value
    .filter(q => q.moduleId || q.module_id) // Handle both naming conventions
    .map(q => q.moduleId || q.module_id)
  
  // Filter out modules that already have quizzes, but keep the current module in edit mode
  levelModules = levelModules.filter(module => {
    if (props.isEditMode && (props.quiz?.moduleId === module.id || props.quiz?.module_id === module.id)) {
      return true // Keep current module in edit mode
    }
    return !assignedModuleIds.includes(module.id)
  })
  
  return levelModules
})

// Identify the 5th beginner module based on numeric part in title
const fifthBeginnerModuleId = computed(() => {
  const beginnerModules = modules.value
    .filter((m: any) => m.level === 'beginner')
    .slice()
    .sort((a: any, b: any) => {
      const aNum = parseInt(a.title?.match(/\d+/)?.[0] || '0', 10)
      const bNum = parseInt(b.title?.match(/\d+/)?.[0] || '0', 10)
      return aNum - bNum
    })
  return beginnerModules[4]?.id || null
})

// Watch for changes to props
watch(() => props.quiz, () => {
  initializeForm()
}, { deep: true })

// Calculate max questions based on module
const maxQuestions = computed(() => {
  if (
    formData.level === 'beginner' &&
    fifthBeginnerModuleId.value &&
    formData.moduleId === fifthBeginnerModuleId.value
  ) {
    return 20 // Module 5 needs exactly 20 questions
  }
  return 10 // Default max is 10 questions
})

const addQuestion = () => {
  const newQuestion: QuizQuestion = {
    question: '',
    type: 'multiple_choice',
    options: ['', ''],
    correctAnswer: 0,
  }
  formData.questions.push(newQuestion)
}

const removeQuestion = (index: number) => {
  formData.questions.splice(index, 1)
}

const addOption = (questionIndex: number) => {
  const q = formData.questions[questionIndex]
  if (q) q.options.push('')
}

const removeOption = (questionIndex: number, optionIndex: number) => {
  const q = formData.questions[questionIndex]
  if (q) q.options.splice(optionIndex, 1)
}

const updateQuestionType = (questionIndex: number) => {
  const question = formData.questions[questionIndex]
  if (!question) return
  if (question.type === 'true_false') {
    question.options = ['True', 'False']
    question.correctAnswer = 'false' // Store as string for true/false
  } else {
    question.options = ['', '']
    question.correctAnswer = 0
  }
}

const submitForm = async () => {
  if (!formData.title) {
    alert('Please enter a quiz title')
    return
  }

  if (!formData.moduleId) {
    alert('Please select a module to assign this quiz to')
    return
  }

  if (formData.questions.length === 0) {
    alert('Please add at least one question')
    return
  }

  // Special rule: Beginner Module 5 quiz must have exactly 20 questions
  if (
    formData.level === 'beginner' &&
    fifthBeginnerModuleId.value &&
    formData.moduleId === fifthBeginnerModuleId.value
  ) {
    if (formData.questions.length !== 20) {
      alert('The quiz for Beginner Module 5 must have exactly 20 questions.')
      return
    }
  } else {
    // For all other quizzes: maximum 10 questions
    if (formData.questions.length > 10) {
      alert('Maximum 10 questions allowed per quiz')
      return
    }
  }

  // Check if the selected module already has a quiz (except in edit mode for the same quiz)
  if (!props.isEditMode) {
    const existingQuiz = quizzes.value.find(q => (q.moduleId || q.module_id) === formData.moduleId)
    if (existingQuiz) {
      alert('This module already has a quiz assigned to it. Please select a different module.')
      return
    }
  }

  // Validate all questions
  for (const q of formData.questions) {
    if (!q) continue
    if (!q.question) {
      alert('Please fill in all question texts')
      return
    }
    if (q.options.length === 0 || q.options.some(opt => !opt)) {
      alert('Please fill in all options')
      return
    }
    if (q.correctAnswer === '' || q.correctAnswer === null || q.correctAnswer === undefined) {
      alert('Please select correct answer for all questions')
      return
    }
  }

  if (props.isEditMode) {
    if (props.quiz && props.quiz.id) {
      await updateQuiz(props.quiz.id, formData)
    } else {
      console.error('Edit mode enabled but quiz prop is missing')
      return
    }
  } else {
    await createQuiz(formData)
  }

  if (!error.value) {
    emit('save')
  }
}
</script>
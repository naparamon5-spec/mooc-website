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

      <!-- Image Upload -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Quiz Image
        </label>
        <div class="flex items-center gap-2 mb-2">
          <input
            ref="quizImageInput"
            type="file"
            accept="image/*"
            @change="handleQuizImageUpload"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <span v-if="imageUploadingQuiz" class="text-sm text-blue-600">Uploading...</span>
        </div>
        <p class="text-xs text-gray-500 mb-3">Select an image file to upload at the top of the quiz</p>
        <div v-if="formData.imageUrl" class="p-3 border border-gray-200 rounded-lg bg-gray-50">
          <p class="text-xs text-gray-600 mb-2">Image preview:</p>
          <img 
            :src="formData.imageUrl" 
            :alt="formData.title"
            class="w-full h-48 object-cover rounded"
            @error="handleImageError"
          />
        </div>
      </div>

      <!-- Questions Section -->
      <div class="border-t border-gray-200 pt-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h4 class="text-md font-semibold text-gray-900">Questions</h4>
            <!-- Dynamic hint based on selected module -->
            <p class="text-xs mt-1" :class="isLastModule ? 'text-amber-600 font-semibold' : 'text-gray-500'">
              {{ isLastModule
                ? `Last module (${formData.level === 'beginner' ? 'Module 5' : 'Module 10'}) requires exactly 20 questions — ${formData.questions.length}/20`
                : `Add up to 10 questions — ${formData.questions.length}/10`
              }}
            </p>
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
          <p class="text-xs text-gray-400 mt-2">
            {{ isLastModule
              ? `${formData.level === 'beginner' ? 'Beginner Module 5' : 'Advanced Module 10'}: exactly 20 questions required`
              : 'Maximum: 10 questions per quiz'
            }}
          </p>
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

              <!-- Question Image -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Question Image (Optional)
                </label>
                <div class="flex items-center gap-2 mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    @change="(e) => handleQuestionImageUpload(e, idx)"
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <span v-if="imageUploadingQuestions[idx]" class="text-sm text-blue-600">Uploading...</span>
                </div>
                <p class="text-xs text-gray-500 mb-3">Upload an image instead of text for visual questions</p>
                
                <!-- Image Preview -->
                <div v-if="question.questionImageUrl" class="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <p class="text-xs text-gray-600 mb-2">Image preview:</p>
                  <img 
                    :src="question.questionImageUrl" 
                    :alt="question.question"
                    class="w-full h-48 object-cover rounded"
                    @error="handleImageError"
                  />
                </div>
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

            </div>
          </template>
        </div>

      </div>

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

const { createQuiz, updateQuiz, loading, error, fetchQuizzes, quizzes, uploadImage } = useQuizManagement()
const { fetchModules, modules } = useModuleManagement()

const imageUploadingQuiz = ref(false)
const imageUploadingQuestions = ref<Record<number, boolean>>({})

const formData = reactive<Quiz>({
  title: '',
  description: '',
  moduleId: '',
  level: 'beginner',
  questions: [],
  passingScore: 70,
  imageUrl: '',
})

const initializeForm = () => {
  if (props.quiz) {
    formData.title = props.quiz.title || ''
    formData.description = props.quiz.description || ''
    formData.moduleId = props.quiz.moduleId || props.quiz.module_id || ''
    formData.level = props.quiz.level || 'beginner'
    formData.passingScore = props.quiz.passing_score || 70
    formData.imageUrl = props.quiz.imageUrl || props.quiz.image_url || ''
    formData.questions = props.quiz.questions ? JSON.parse(JSON.stringify(props.quiz.questions)) : []
  } else {
    formData.title = ''
    formData.description = ''
    formData.moduleId = ''
    formData.level = 'beginner'
    formData.passingScore = 70
    formData.imageUrl = ''
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

  let levelModules = modules.value.filter((m: any) => m.level === formData.level)

  const assignedModuleIds = quizzes.value
    .filter(q => q.moduleId || q.module_id)
    .map(q => q.moduleId || q.module_id)

  levelModules = levelModules.filter(module => {
    if (props.isEditMode && (props.quiz?.moduleId === module.id || props.quiz?.module_id === module.id)) {
      return true
    }
    return !assignedModuleIds.includes(module.id)
  })

  return levelModules
})

// Get the last module ID for the currently selected level
// Beginner → last is Module 5, Advanced → last is Module 10
const lastModuleId = computed(() => {
  const levelModules = modules.value
    .filter((m: any) => m.level === formData.level && m.is_active)
    .slice()
    .sort((a: any, b: any) => {
      const aNum = parseInt(a.title?.match(/\d+/)?.[0] || '0', 10)
      const bNum = parseInt(b.title?.match(/\d+/)?.[0] || '0', 10)
      return aNum - bNum
    })
  return levelModules[levelModules.length - 1]?.id || null
})

// True when the selected module is the last module of its level
const isLastModule = computed(() => {
  if (!formData.moduleId || !lastModuleId.value) return false
  return formData.moduleId === lastModuleId.value
})

watch(() => props.quiz, () => {
  initializeForm()
}, { deep: true })

// Max questions: 20 for last module, 10 for all others
const maxQuestions = computed(() => isLastModule.value ? 20 : 10)

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
    question.correctAnswer = 'false'
  } else {
    question.options = ['', '']
    question.correctAnswer = 0
  }
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  console.error('Failed to load option image:', img.src)
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

  // Last module (Module 5 beginner / Module 10 advanced) → exactly 20 questions required
  if (isLastModule.value) {
    if (formData.questions.length !== 20) {
      const label = formData.level === 'beginner' ? 'Beginner Module 5' : 'Advanced Module 10'
      alert(`The quiz for ${label} must have exactly 20 questions. You currently have ${formData.questions.length}.`)
      return
    }
  } else {
    // All other modules → max 10 questions
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

const handleQuizImageUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  try {
    imageUploadingQuiz.value = true
    const file = target.files[0]
    const publicUrl = await uploadImage(file)
    formData.imageUrl = publicUrl
    target.value = '' // Reset file input
  } catch (err) {
    console.error('Failed to upload quiz image:', err)
    alert('Failed to upload image. Please try again.')
  } finally {
    imageUploadingQuiz.value = false
  }
}

const handleQuestionImageUpload = async (e: Event, questionIdx: number) => {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  try {
    imageUploadingQuestions.value[questionIdx] = true
    const file = target.files[0]
    const publicUrl = await uploadImage(file)
    if (formData.questions[questionIdx]) {
      formData.questions[questionIdx].questionImageUrl = publicUrl
    }
    target.value = '' // Reset file input
  } catch (err) {
    console.error('Failed to upload question image:', err)
    alert('Failed to upload image. Please try again.')
  } finally {
    imageUploadingQuestions.value[questionIdx] = false
  }
}
</script>
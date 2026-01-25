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
          <h4 class="text-md font-semibold text-gray-900">Questions</h4>
          <button
            type="button"
            @click="addQuestion"
            class="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm font-medium hover:bg-primary-200 transition"
          >
            + Add Question
          </button>
        </div>

        <!-- Questions List -->
        <div v-if="formData.questions.length === 0" class="text-center py-8 bg-gray-50 rounded">
          <p class="text-gray-500">No questions added yet. Click "Add Question" to start.</p>
        </div>

        <div v-else class="space-y-6">
          <div
            v-for="(question, idx) in formData.questions"
            :key="idx"
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
                v-model="question.correctAnswer"
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
import { ref, watch, reactive } from 'vue'
import { useQuizManagement, type Quiz, type QuizQuestion } from '~/composables/useQuizManagement'

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

const { createQuiz, updateQuiz, loading, error } = useQuizManagement()

const formData = reactive<Quiz>({
  title: props.quiz?.title || '',
  description: props.quiz?.description || '',
  moduleId: props.quiz?.module_id || '',
  level: props.quiz?.level || 'beginner',
  questions: props.quiz?.questions || [],
  passingScore: props.quiz?.passing_score || 70,
})

// Watch for changes to props
watch(() => props.quiz, (newQuiz) => {
  if (newQuiz) {
    formData.title = newQuiz.title || ''
    formData.description = newQuiz.description || ''
    formData.moduleId = newQuiz.module_id || ''
    formData.level = newQuiz.level || 'beginner'
    formData.questions = newQuiz.questions || []
    formData.passingScore = newQuiz.passing_score || 70
  }
}, { deep: true })

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
  formData.questions[questionIndex].options.push('')
}

const removeOption = (questionIndex: number, optionIndex: number) => {
  formData.questions[questionIndex].options.splice(optionIndex, 1)
}

const updateQuestionType = (questionIndex: number) => {
  const question = formData.questions[questionIndex]
  if (question.type === 'true_false') {
    question.options = ['True', 'False']
    question.correctAnswer = 0
  } else {
    question.options = ['', '']
    question.correctAnswer = 0
  }
}

const submitForm = async () => {
  // Validation
  if (!formData.title) {
    alert('Please enter a quiz title')
    return
  }

  if (formData.questions.length === 0) {
    alert('Please add at least one question')
    return
  }

  // Check all questions are valid
  for (const q of formData.questions) {
    if (!q.question) {
      alert('Please fill in all question texts')
      return
    }
    if (q.options.length === 0 || q.options.some(opt => !opt)) {
      alert('Please fill in all options')
      return
    }
    if (q.correctAnswer === '') {
      alert('Please select correct answer for all questions')
      return
    }
  }

  if (props.isEditMode) {
    await updateQuiz(props.quiz.id, formData)
  } else {
    await createQuiz(formData)
  }

  if (!error.value) {
    emit('save')
  }
}
</script>

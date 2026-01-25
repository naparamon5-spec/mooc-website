<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-100">
    <!-- Header -->
    <div class="p-6 border-b border-gray-200">
      <h3 class="text-lg font-bold text-gray-900">All Quizzes</h3>
      <p class="text-sm text-gray-600 mt-1">{{ quizzes.length }} quiz{{ quizzes.length !== 1 ? 'zes' : '' }} created</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-8 text-center">
      <p class="text-gray-600">Loading quizzes...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="quizzes.length === 0" class="p-8 text-center">
      <p class="text-gray-500">No quizzes created yet.</p>
      <p class="text-sm text-gray-500 mt-2">Create your first quiz to get started!</p>
    </div>

    <!-- Quiz List -->
    <div v-else class="divide-y divide-gray-200">
      <div
        v-for="quiz in quizzes"
        :key="quiz.id"
        class="p-6 hover:bg-gray-50 transition"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h4 class="text-md font-semibold text-gray-900">{{ quiz.title }}</h4>
            <p class="text-sm text-gray-600 mt-1">{{ quiz.description }}</p>

            <!-- Quiz Meta -->
            <div class="flex items-center gap-4 mt-3">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="quiz.level === 'beginner' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'">
                {{ quiz.level === 'beginner' ? 'Beginner' : 'Advanced' }}
              </span>
              <span class="text-xs text-gray-500">
                {{ quiz.questions?.length || 0 }} questions
              </span>
              <span class="text-xs text-gray-500">
                Passing: {{ quiz.passing_score || 70 }}%
              </span>
              <span class="text-xs text-gray-500">
                Created: {{ formatDate(quiz.created_at) }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 ml-4">
            <button
              @click="$emit('edit', quiz)"
              class="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition"
            >
              Edit
            </button>
            <button
              @click="confirmDelete(quiz)"
              class="px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Delete Quiz?</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete "<strong>{{ quizToDelete?.title }}</strong>"? This action cannot be undone.
        </p>
        <div class="flex gap-3">
          <button
            @click="deleteQuiz"
            :disabled="loading"
            class="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50"
          >
            {{ loading ? 'Deleting...' : 'Delete' }}
          </button>
          <button
            @click="showDeleteConfirm = false"
            class="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuizManagement, type Quiz } from '~/composables/useQuizManagement'

defineProps({
  quizzes: {
    type: Array as any,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['edit', 'deleted'])

const { deleteQuiz, loading } = useQuizManagement()

const showDeleteConfirm = ref(false)
const quizToDelete = ref<Quiz | null>(null)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const confirmDelete = (quiz: Quiz) => {
  quizToDelete.value = quiz
  showDeleteConfirm.value = true
}

const deleteQuizAction = async () => {
  if (quizToDelete.value?.id) {
    const success = await deleteQuiz(quizToDelete.value.id)
    if (success) {
      showDeleteConfirm.value = false
      quizToDelete.value = null
      emit('deleted')
    }
  }
}
</script>

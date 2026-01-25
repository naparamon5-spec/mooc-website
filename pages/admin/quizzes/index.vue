<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <AdminHeader :admin-name="adminName" />

    <!-- MAIN CONTENT -->
    <main class="flex-1">
  <div class="max-w-full px-4 md:px-8 lg:px-12 py-8">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Quizzes</h1>
          <p class="text-gray-600 mt-2">
            Create and manage quizzes for your courses
          </p>
        </div>

        <!-- Quiz List -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Quiz Management</h2>
          <button
            @click="startCreateQuiz"
            class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition"
          >
            + Create Quiz
          </button>
        </div>

        <QuizList
          :quizzes="quizzes"
          :loading="loading"
          @edit="startEditQuiz"
          @deleted="handleQuizDeleted"
        />

        <!-- Quiz Form Modal -->
        <div
          v-if="showForm"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
        >
          <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
            <div class="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 class="text-xl font-bold text-gray-900">
                {{ isEditMode ? 'Edit Quiz' : 'Create New Quiz' }}
              </h3>
              <button
                @click="handleCancel"
                class="text-gray-500 hover:text-gray-700"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="overflow-y-auto max-h-[calc(100vh-180px)] px-6 py-4">
              <QuizForm
                :quiz="selectedQuiz"
                :is-edit-mode="isEditMode"
                @save="handleQuizSaved"
                @cancel="handleCancel"
              />
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- FOOTER -->
    <footer class="bg-primary-600 text-white text-center py-4">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import AdminHeader from '~/components/admindashboard/AdminHeader.vue'
import QuizForm from '~/components/admindashboard/QuizForm.vue'
import QuizList from '~/components/admindashboard/QuizList.vue'
import { useQuizManagement } from '~/composables/useQuizManagement'
import { useUserProfile } from '~/composables/useUserProfile'

definePageMeta({ middleware: 'auth' })

useHead({
  title: 'Quizzes - Admin - MIL MOOC',
})

const adminName = ref("Admin User")
const showForm = ref(false)
const isEditMode = ref(false)
const selectedQuiz = ref(null)

const { quizzes, loading, fetchQuizzes } = useQuizManagement()
const { fetchUserProfile } = useUserProfile()

onMounted(async () => {
  try {
    const userData = await fetchUserProfile()
    if (userData?.full_name) {
      adminName.value = userData.full_name
    }

    await fetchQuizzes()
  } catch (err) {
    console.error('Error loading admin page:', err)
  }
})

const startCreateQuiz = () => {
  selectedQuiz.value = null
  isEditMode.value = false
  showForm.value = true
}

const startEditQuiz = (quiz) => {
  selectedQuiz.value = quiz
  isEditMode.value = true
  showForm.value = true
}

const handleQuizSaved = () => {
  showForm.value = false
  selectedQuiz.value = null
  isEditMode.value = false
}

const handleCancel = () => {
  showForm.value = false
  selectedQuiz.value = null
  isEditMode.value = false
}

const handleQuizDeleted = () => {
  console.log('Quiz deleted successfully')
}
</script>


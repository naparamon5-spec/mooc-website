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
          :quizzes="sortedQuizzes"
          :loading="loading"
          @edit="startEditQuiz"
          @deleted="handleQuizDeleted"
        />
      </div>
    </main>

    <!-- FOOTER -->
    <footer class="bg-primary-600 text-white text-center py-4">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>

    <!-- Quiz Form Modal — Teleported to body for correct stacking -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showForm"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="handleCancel"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="handleCancel" />

          <!-- Dialog panel -->
          <div class="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] ring-1 ring-gray-200">

            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div class="flex items-center gap-3">
                <!-- Icon badge -->
                <div class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-base font-semibold text-gray-900 leading-tight">
                    {{ isEditMode ? 'Edit Quiz' : 'Create New Quiz' }}
                  </h3>
                  <p class="text-xs text-gray-400 leading-tight mt-0.5">
                    {{ isEditMode ? 'Update quiz details and questions' : 'Fill in the details below to add a new quiz' }}
                  </p>
                </div>
              </div>
              <button
                @click="handleCancel"
                class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Scrollable body -->
            <div class="overflow-y-auto flex-1 px-6 py-5">
              <QuizForm
                :quiz="selectedQuiz"
                :is-edit-mode="isEditMode"
                @save="handleQuizSaved"
                @cancel="handleCancel"
              />
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminHeader from '~/components/admindashboard/AdminHeader.vue'
import QuizForm from '~/components/admindashboard/QuizForm.vue'
import QuizList from '~/components/admindashboard/QuizList.vue'
import { useQuizManagement } from '~/composables/useQuizManagement'
import { useUserProfile } from '~/composables/useUserProfile'

definePageMeta({ middleware: 'auth' })

useHead({
  title: 'Quizzes - Admin - MIL MOOC',
})

const adminName = ref('Admin User')
const showForm = ref(false)
const isEditMode = ref(false)
const selectedQuiz = ref(null)

const { quizzes, loading, fetchQuizzes } = useQuizManagement()
const { fetchUserProfile } = useUserProfile()

// Sort quizzes: oldest (first created) at the top
const sortedQuizzes = computed(() =>
  [...(quizzes.value ?? [])].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )
)

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
  // Deep clone to avoid modifying the original quiz object
  selectedQuiz.value = JSON.parse(JSON.stringify(quiz))
  isEditMode.value = true
  showForm.value = true
}

const handleQuizSaved = async () => {
  showForm.value = false
  selectedQuiz.value = null
  isEditMode.value = false
  await fetchQuizzes()
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

<style scoped>
/* Modal enter/leave transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative {
  transform: scale(0.96) translateY(8px);
  opacity: 0;
}
.modal-leave-to .relative {
  transform: scale(0.96) translateY(8px);
  opacity: 0;
}
</style>
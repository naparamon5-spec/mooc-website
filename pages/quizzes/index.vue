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
          />
        </div>
      </div>
    </main>

    <footer class="bg-primary-600 text-white text-center py-4">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DashboardHeader from '~/components/studentdashboard/DashboardHeader.vue';
import QuizCard from '~/components/QuizCard.vue';
import { useQuizManagement } from '~/composables/useQuizManagement'
import { useRouter } from 'vue-router'

const { quizzes, loading, fetchQuizzes } = useQuizManagement()
const router = useRouter()

const studentName = ref('')

onMounted(async () => {
  await fetchQuizzes()
})
</script>

<style scoped>
/* Add any component-specific styles here if necessary */
</style>
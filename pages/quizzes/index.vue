<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <DashboardHeader :student-name="studentName"  />
    <div class="max-w-full mx-auto px-4 md:px-8 lg:px-12 py-8 flex-grow">
      <h1 class="text-4xl font-bold text-gray-800 mb-8">Quizzes</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuizCard v-for="quiz in quizzes" :key="quiz.id" :quiz="quiz" />
      </div>
    </div>
    <!-- Footer -->
    <footer class="bg-primary-600 text-white text-center py-4">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import QuizCard from '~/components/QuizCard.vue';
import DashboardHeader from '~/components/studentdashboard/DashboardHeader.vue';

const quizzes = ref([
  {
    id: 1,
    title: 'Introduction to Web Development',
    description: 'Test your knowledge on the basics of HTML, CSS, and JavaScript.',
    questions: 10,
    duration: '15 min',
    difficulty: 'Beginner',
  },
  {
    id: 2,
    title: 'Advanced JavaScript Concepts',
    description: 'Challenge yourself with advanced topics like closures, prototypes, and async/await.',
    questions: 15,
    duration: '25 min',
    difficulty: 'Intermediate',
  },
  {
    id: 3,
    title: 'Vue.js Fundamentals',
    description: 'Assess your understanding of Vue.js core concepts, components, and reactivity.',
    questions: 12,
    duration: '20 min',
    difficulty: 'Intermediate',
  },
  {
    id: 4,
    title: 'Nuxt.js for Modern Web Apps',
    description: 'Explore server-side rendering, routing, and state management in Nuxt.js.',
    questions: 10,
    duration: '18 min',
    difficulty: 'Advanced',
  },
  {
    id: 5,
    title: 'Understanding CSS Grid and Flexbox',
    description: 'Deep dive into modern CSS layout techniques.',
    questions: 8,
    duration: '10 min',
    difficulty: 'Beginner',
  },
]);

// You might want to fetch quizzes from an API in a real application
// onMounted(async () => {
//   const response = await fetch('/api/quizzes');
//   quizzes.value = await response.json();
// });
</script>

<style scoped>
/* Add any component-specific styles here if necessary */
</style>
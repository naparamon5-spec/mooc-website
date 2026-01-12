<template>
  <div class="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
    <div>
      <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ quiz.title }}</h2>
      <p class="text-gray-600 text-sm mb-4">{{ quiz.description }}</p>
    </div>
    <div class="mt-auto">
      <div class="flex items-center text-gray-500 text-xs mb-4">
        <span class="mr-4">
          <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.546-1.38 2.336-1.42 2.704-.946a1.536 1.536 0 011.026 1.547l-.148 1.48a.74.74 0 00.106.634l.654.785a.74.74 0 00.627.186l1.378-.344c.484-.12.986.136.986.666v1.44a.75.75 0 00.75.75h.75a.75.75 0 00.75-.75v-.31c.42-.51-.157-1.127-.723-1.077-.42.037-.81-.22-.977-.61l-.645-1.55c-.244-.588-.705-.882-1.378-.718l-1.378.344a.74.74 0 00-.627-.186l-.654-.785a.74.74 0 00-.106-.634L11 9.77c-.368-.48-.604-.848-.908-1.503-.312-.66-.99-.958-1.745-.635l-1.192.477c-.45.18-.76-.08-.76-.554V9z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3"></path>
          </svg>
          {{ quiz.questions }} Questions
        </span>
        <span class="mr-4">
          <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {{ quiz.duration }}
        </span>
        <span>
          <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          {{ quiz.difficulty }}
        </span>
      </div>
      <button class="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition duration-300">
        Start Quiz
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  quiz: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
/* Add any component-specific styles here if necessary */
</style>

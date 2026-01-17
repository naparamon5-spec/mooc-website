<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="text-center p-8">
      <div class="max-w-md mx-auto">
        <svg class="mx-auto h-48 w-auto text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 class="mt-8 text-5xl font-extrabold text-gray-900 dark:text-white">404 - Page Not Found</h1>
      <p class="mt-4 text-lg text-gray-500 dark:text-gray-400">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <div class="mt-8">
        <button @click="handleClearError" class="px-8 py-3 text-base font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          Go back home
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  error: Object
})

const handleClearError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white">
    <div class="text-center px-4">
      <!-- 404 Icon -->
      <div class="mb-8">
        <svg class="w-24 h-24 mx-auto text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v2m0 4v2M7 9h.01M17 9h.01M7 13h.01M17 13h.01M7 17h.01M17 17h.01"/>
        </svg>
      </div>

      <!-- Error Code -->
      <h1 class="text-6xl font-bold text-sky-600 mb-4">404</h1>

      <!-- Error Title -->
      <h2 class="text-3xl font-bold text-slate-800 mb-3">Page Not Found</h2>

      <!-- Error Description -->
      <p class="text-lg text-slate-600 mb-8 max-w-md mx-auto">
        Sorry, the page you're looking for doesn't exist or you don't have permission to access it.
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink to="/" class="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-6 py-3 font-medium shadow hover:brightness-105 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4v4"/>
          </svg>
          Go to Home
        </NuxtLink>

        <button @click="goBack" class="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-sky-600 text-sky-600 px-6 py-3 font-medium hover:bg-sky-50 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Go Back
        </button>
      </div>

      <!-- Help Text -->
      <p class="text-sm text-slate-500 mt-8">
        If you think this is a mistake, please contact support.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

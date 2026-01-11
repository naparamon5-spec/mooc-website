<template>
  <div class="w-full px-4 md:px-8 lg:px-12">
    <Card class="shadow-md">
    <template #header>
      <div class="bg-blue-900 text-white text-center py-6 px-6 rounded-t-lg">
        <h2 class="text-2xl font-bold">What you'll learn</h2>
      </div>
    </template>
    <template #content>
      <div class="p-8">
        <div class="flex items-center gap-4 mb-6 last:mb-0">
          <div class="flex-shrink-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" stroke="#1e3a8a" stroke-width="2" fill="none"/>
              <circle cx="16" cy="12" r="3" fill="#1e3a8a"/>
              <path d="M10 22c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#1e3a8a" stroke-width="2"/>
              <rect x="20" y="8" width="8" height="8" rx="1" stroke="#1e3a8a" stroke-width="2" fill="none"/>
              <path d="M22 10h4M22 12h4M22 14h2" stroke="#1e3a8a" stroke-width="1.5"/>
            </svg>
          </div>
          <p class="text-blue-900 text-lg">Recognize reliable information online</p>
        </div>
        <div class="flex items-center gap-4 mb-6 last:mb-0">
          <div class="flex-shrink-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4L20 12L28 13L22 19L23 27L16 23L9 27L10 19L4 13L12 12L16 4Z" fill="#1e3a8a"/>
              <rect x="18" y="6" width="8" height="8" rx="1" stroke="#1e3a8a" stroke-width="2" fill="none"/>
              <path d="M20 8h4M20 10h4M20 12h2" stroke="white" stroke-width="1.5"/>
            </svg>
          </div>
          <p class="text-blue-900 text-lg">Think critically about media content</p>
        </div>
        <div class="flex items-center gap-4 mb-6 last:mb-0">
          <div class="flex-shrink-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12c0-2.21 1.79-4 4-4h8c2.21 0 4 1.79 4 4v8c0 2.21-1.79 4-4 4h-8c-2.21 0-4-1.79-4-4v-8z" fill="#1e3a8a"/>
              <path d="M12 16h8M12 18h6" stroke="white" stroke-width="1.5"/>
            </svg>
          </div>
          <p class="text-blue-900 text-lg">Engage responsibly in digital spaces</p>
        </div>
      </div>
    </template>
    </Card>
  </div>
</template>

<script setup>
import Card from 'primevue/card'
</script>

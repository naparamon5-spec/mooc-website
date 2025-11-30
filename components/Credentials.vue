<template>
  <Card class="shadow-md">
    <template #header>
      <div class="bg-blue-900 text-white text-center py-6 px-6 rounded-t-lg">
        <h2 class="text-2xl font-bold">Earn recognized credentials</h2>
      </div>
    </template>
    <template #content>
      <div class="p-8">
        <div class="flex items-center gap-4 mb-6 last:mb-0">
          <div class="flex-shrink-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4L20 8L26 6L24 12L28 16L22 18L20 24L16 20L12 24L10 18L4 16L8 12L6 6L12 8L16 4Z" fill="#1e3a8a"/>
              <circle cx="16" cy="16" r="4" fill="white"/>
            </svg>
          </div>
          <p class="text-blue-900 text-lg">Collect 10 badges</p>
        </div>
        <div class="flex items-center gap-4 mb-6 last:mb-0">
          <div class="flex-shrink-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="6" width="16" height="20" rx="2" stroke="#1e3a8a" stroke-width="2" fill="none"/>
              <path d="M12 10h8M12 14h8M12 18h6" stroke="#1e3a8a" stroke-width="1.5"/>
              <path d="M14 22h4" stroke="#1e3a8a" stroke-width="1.5"/>
            </svg>
          </div>
          <p class="text-blue-900 text-lg">Earn your certificate of completion</p>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'
</script>

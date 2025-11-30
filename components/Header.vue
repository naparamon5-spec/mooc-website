<template>
  <header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="6" width="16" height="20" rx="2" stroke="#1e3a8a" stroke-width="2" fill="none"/>
          <path d="M12 10h8M12 14h8M12 18h6" stroke="#1e3a8a" stroke-width="1.5"/>
          <rect x="20" y="12" width="12" height="16" rx="2" stroke="#1e3a8a" stroke-width="2" fill="none"/>
          <circle cx="26" cy="18" r="2" fill="#1e3a8a"/>
          <path d="M24 22h4" stroke="#1e3a8a" stroke-width="1.5"/>
        </svg>
        <span class="text-2xl font-bold text-blue-900">MIL MOOC</span>
      </div>
      <nav class="flex items-center gap-4">
        <Button label="Log In" text severity="secondary" class="text-blue-900" />
        <Button label="Enroll for free" class="bg-blue-900" />
      </nav>
    </div>
  </header>
</template>

<script setup>
import Button from 'primevue/button'
</script>

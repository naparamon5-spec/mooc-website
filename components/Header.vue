<template>
  <header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <!-- Logo and text -->
      <div class="flex items-center gap-1">
        <img src="/assets/logo.png" alt="MIL MOOC Logo" class="h-28 w-auto" />
      </div>

      <!-- Navigation buttons -->
      <nav class="flex items-center gap-6">
        <Button label="Log In" text severity="secondary" class="text-blue-900" />
        <Button label="Enroll for free" severity="info" class="bg-blue-900 text-white" />
      </nav>
    </div>
  </header>
</template>

<script setup>
import Button from 'primevue/button'
</script>

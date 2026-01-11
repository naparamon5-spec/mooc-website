<template>
  <header class="bg-primary-600 text-white">
  <div class="w-full flex items-center justify-between py-4 px-4 md:px-8 lg:px-12">
      <NuxtLink to="/" class="flex items-center gap-3">
        <img src="/assets/logo.png" alt="MIL MOOC" class="h-12 w-auto rounded-md shadow-sm bg-white" />
        <div class="hidden sm:block">
          <div class="text-sm font-semibold text-white">MIL MOOC</div>
          <div class="text-xs text-white/90">Media & Information Literacy</div>
        </div>
      </NuxtLink>

  <nav class="hidden md:flex items-center gap-6">
        <button class="btn-primary ml-2 font-semibold">Enroll for free</button>
        <NuxtLink to="/login" class="text-sm text-white/90 font-medium">Log in</NuxtLink>
      </nav>

      <!-- Mobile menu -->
      <div class="md:hidden">
        <button @click="open = !open" aria-label="Open menu" class="p-2 rounded-md text-white/90">
          <svg v-if="!open" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

    </div>

  <transition name="fade">
  <div v-if="open" class="md:hidden bg-primary-600">
        <div class="px-4 py-4 space-y-3">
          <button class="w-full btn-primary font-semibold">Enroll for free</button>
          <NuxtLink to="/login" class="block text-center text-white/90 font-semibold">Log in</NuxtLink>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

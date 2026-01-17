<template>
  <header class="bg-primary-600 text-white border-b border-gray-200 sticky top-0 z-50">
    <div class="relative w-full flex items-center justify-between py-4 px-4 md:px-8 lg:px-12">
      <!-- Mobile header -->
      <div class="w-full flex items-center justify-between md:hidden">
        <div class="w-1/3 flex justify-start">
          <button @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Open menu" class="p-2 rounded-md text-white">
            <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="w-1/3 flex justify-center">
          <NuxtLink to="/" class="flex items-center">
            <img src="/assets/logo.png" alt="MIL MOOC" class="h-10 w-auto rounded-md shadow-sm bg-white" />
          </NuxtLink>
        </div>
        <div class="w-1/3 flex justify-end items-center gap-2">
          <button class="relative p-2 text-white hover:text-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          <div class="relative">
            <button @click="dropdownOpen = !dropdownOpen" class="flex items-center gap-2 p-2 text-white hover:text-gray-200 transition-colors">
              <div class="h-8 w-8 rounded-full bg-white flex items-center justify-center text-primary-600 text-sm font-semibold">
                {{ userInitials }}
              </div>
            </button>
            <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
              <hr class="my-2" />
              <a href="#" @click.prevent="logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop header -->
      <div class="hidden md:flex w-full items-center justify-between">
        <!-- Desktop Logo -->
        <NuxtLink to="/" class="flex items-center gap-3">
          <img src="/assets/logo.png" alt="MIL MOOC" class="h-10 w-auto rounded-md shadow-sm bg-white" />
          <div class="hidden sm:block">
            <div class="text-lg font-bold text-white">MIL MOOC</div>
          </div>
        </NuxtLink>
        
        <!-- Desktop Nav -->
        <nav class="flex justify-center items-center gap-6">
          <NuxtLink 
            to="/dashboard" 
            class="text-sm font-medium transition-colors"
            :class="currentRoute === '/dashboard' ? 'text-white border-b-2 border-white pb-1' : 'text-white hover:text-gray-200'"
          >
            Home
          </NuxtLink>
          <NuxtLink 
            to="/modules" 
            class="text-sm font-medium transition-colors"
            :class="currentRoute === '/modules' ? 'text-white border-b-2 border-white pb-1' : 'text-white hover:text-gray-200'"
          >
            Modules
          </NuxtLink>
          <NuxtLink 
            to="/quizzes" 
            class="text-sm font-medium transition-colors"
            :class="currentRoute === '/quizzes' ? 'text-white border-b-2 border-white pb-1' : 'text-white hover:text-gray-200'"
          >
            Quizzes
          </NuxtLink>
          <NuxtLink 
            to="/resources" 
            class="text-sm font-medium transition-colors"
            :class="currentRoute === '/resources' ? 'text-white border-b-2 border-white pb-1' : 'text-white hover:text-gray-200'"
          >
            Resource Hub
          </NuxtLink>
        </nav>

        <!-- Right side: Icons & User avatar -->
        <div class="flex items-center gap-4">
          <button class="relative p-2 text-white hover:text-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          <div class="relative">
            <button @click="dropdownOpen = !dropdownOpen" class="flex items-center gap-2 p-2 text-white hover:text-gray-200 transition-colors">
              <div class="h-8 w-8 rounded-full bg-white flex items-center justify-center text-primary-600 text-sm font-semibold">
                {{ userInitials }}
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
              <hr class="my-2" />
              <a href="#" @click.prevent="logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <transition name="fade">
      <div v-if="mobileMenuOpen" class="md:hidden bg-primary-600 border-t border-primary-700">
        <div class="px-4 py-4 space-y-3">
          <NuxtLink to="/" class="block text-white font-medium" :class="{ 'bg-primary-700 rounded-md px-2 py-1': currentRoute === '/' }">Home</NuxtLink>
          <NuxtLink to="/modules" class="block text-white font-medium" :class="{ 'bg-primary-700 rounded-md px-2 py-1': currentRoute === '/modules' }">Modules</NuxtLink>
          <NuxtLink to="/quizzes" class="block text-white font-medium" :class="{ 'bg-primary-700 rounded-md px-2 py-1': currentRoute === '/quizzes' }">Quizzes</NuxtLink>
          <NuxtLink to="/resources" class="block text-white font-medium" :class="{ 'bg-primary-700 rounded-md px-2 py-1': currentRoute === '/resources' }">Resource Hub</NuxtLink>
        </div>
      </div>
    </transition>
  </header>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const dropdownOpen = ref(false)
const mobileMenuOpen = ref(false)

const nuxtApp = useNuxtApp()
const supabase = nuxtApp.$supabase

async function logout() {
  try {
    if (supabase?.auth?.signOut) {
      await supabase.auth.signOut()
    }
  } catch (e) {
    // ignore
  }
  const refreshCookie = useCookie('sb-refresh-token')
  refreshCookie.value = null
  navigateTo('/login')
}

const props = defineProps({
  studentName: {
    type: String,
    default: 'Student'
  }
})

const currentRoute = computed(() => route.path)

const userInitials = computed(() => {
  const name = props.studentName.split(' ')
  if (name.length >= 2) {
    return (name[0][0] + name[1][0]).toUpperCase()
  }
  return props.studentName.substring(0, 2).toUpperCase()
})

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdownOpen.value && !event.target.closest('.relative')) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<!-- <style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Ensure all header content is white when header uses bg-primary-600 */
.bg-primary-600 :where(a, .text-sm, button, svg, .h-8, .block) {
  color: white !important;
}

.bg-primary-600 svg {
  stroke: white !important;
  fill: white !important;
}

.bg-primary-600 .text-primary-600 {
  /* override any text-primary-600 utilities inside header */
  color: white !important;
}

.bg-primary-600 .h-8 {
  background-color: rgba(255,255,255,0.12) !important; /* keep contrast for avatar background */
}
</style> -->


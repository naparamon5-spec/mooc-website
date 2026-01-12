<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white">
    <div class="w-full max-w-lg bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-sky-100">
      <!-- Logo -->
      <div class="flex justify-center mb-4">
        <img src="/assets/logo.png" alt="MIL MOOC" class="h-28 w-auto object-contain"/>
      </div>

      <form @submit.prevent="onSubmit" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-sky-700 mb-1">Email</label>
          <input v-model="email" type="email" placeholder="Enter your email address"
            :class="[inputClass, errors.email && errorClass]"/>
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">
            {{ errors.email }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-sky-700 mb-1">Password</label>
          <div class="relative">
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Enter your password"
              :class="[inputClass, 'pr-12', errors.password && errorClass]"/>
            <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-2.5 text-sky-600 hover:text-sky-800">
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.176-3.568M6.18 6.18A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.98 9.98 0 01-4.043 5.19M6.18 6.18L3 3m3.18 3.18L21 21"/>
              </svg>
            </button>
          </div>
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">
            {{ errors.password }}
          </p>
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center text-sm text-sky-700">
            <input type="checkbox" v-model="remember" class="mr-2 h-4 w-4 text-sky-600 rounded focus:ring-sky-500" />
            Remember me
          </label>
          <NuxtLink to="/forgot-password" class="text-sm text-sky-600 hover:underline">Forgot Password?</NuxtLink>
        </div>

        <button type="submit" :disabled="loading"
          class="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-4 py-2 font-medium shadow hover:brightness-105 transition disabled:opacity-70 disabled:cursor-not-allowed">
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>

      <p class="mt-6 text-sm text-center text-sky-700">
        Don't have an account?
        <NuxtLink to="/signup" class="font-medium text-sky-800 hover:underline">Sign Up</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { validateEmail, validatePassword } from '~/utils/validation/auth'

const email = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const toast = useToast()

const errors = ref({
  email: '',
  password: ''
})

const inputClass =
  'mt-1 block w-full rounded-lg border border-sky-200 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400'

const errorClass =
  'border-red-400 focus:ring-red-300 focus:border-red-400'

const supabase = useNuxtApp().$supabase

function validateForm() {
  errors.value.email = validateEmail(email.value)
  errors.value.password = validatePassword(password.value)

  return !errors.value.email && !errors.value.password
}

async function onSubmit() {
  if (!validateForm()) return

  loading.value = true
  errorMsg.value = ''
  try {
    // Sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) throw error

    toast.add({ severity: 'success', summary: 'Login Successful', detail: 'Welcome back!', life: 3000 });

    // Navigate to dashboard
    navigateTo('/')
  } catch (err: any) {
    console.log(err)
    errorMsg.value = err.message || 'Login failed'
    toast.add({ severity: 'error', summary: 'Login Failed', detail: errorMsg.value, life: 3000 });
  } finally {
    loading.value = false
  }
}
</script>

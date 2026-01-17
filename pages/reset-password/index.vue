<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white">
    <div class="w-full max-w-lg bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-sky-100">
      <div class="flex justify-center mb-4">
        <img src="/assets/logo.png" alt="MIL MOOC" class="h-28 w-auto object-contain"/>
      </div>

      <div v-if="!submitted">
        <h2 class="text-2xl font-bold text-center text-sky-800 mb-4">Reset Your Password</h2>
        <p class="text-center text-sky-700 mb-6">Enter your new password below.</p>
        <form @submit.prevent="handleResetPassword" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-sky-700 mb-1">Password</label>
            <input v-model="password" type="password" required placeholder="Enter your new password"
              class="mt-1 block w-full rounded-lg border border-sky-200 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-sky-700 mb-1">Confirm Password</label>
            <input v-model="confirmPassword" type="password" required placeholder="Confirm your new password"
              class="mt-1 block w-full rounded-lg border border-sky-200 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"/>
          </div>

          <button type="submit" :disabled="loading"
            class="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-4 py-2 mt-4 font-medium shadow hover:brightness-105 transition disabled:opacity-70 disabled:cursor-not-allowed">
            {{ loading ? 'Resetting...' : 'Reset Password' }}
          </button>
        </form>
      </div>

      <SuccessModal   :isOpen="submitted"
title="Password Reset Successful" message="You can now sign in with your new password." @close="closeModal" />

      <!-- <p class="mt-6 text-sm text-center text-sky-700">
        Remember your password?
        <NuxtLink to="/login" class="font-medium text-sky-800 hover:underline">Sign In</NuxtLink>
      </p> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SuccessModal from '@/components/SuccessModal.vue'

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const submitted = ref(false)
const errorMsg = ref('')

const supabase = useNuxtApp().$supabase

async function handleResetPassword() {
  if (password.value !== confirmPassword.value) {
    errorMsg.value = "Passwords do not match."
    // You might want to show this error to the user
    console.error(errorMsg.value)
    return
  }

  loading.value = true
  errorMsg.value = ''
  try {
    const { error } = await supabase.auth.updateUser({ password: password.value })
    if (error) throw error
    submitted.value = true
  } catch (err: any) {
    errorMsg.value = err.message || 'Failed to reset password'
    // You might want to show this error to the user
    console.error(errorMsg.value)
  } finally {
    loading.value = false
  }
}

function closeModal() {
  submitted.value = false
  password.value = ''
  confirmPassword.value = ''
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white">
    <div
      v-if="!submitted"
      class="w-full max-w-lg bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-sky-100"
    >
      <!-- Logo -->
      <div class="flex justify-center mb-4">
        <img
          src="/assets/logo.png"
          alt="MIL MOOC"
          class="h-28 w-auto object-contain"
        />
      </div>

      <!-- Title -->
      <h2 class="text-2xl font-bold text-center text-sky-800 mb-2">
        Forgot your password?
      </h2>
      <p class="text-center text-sky-700 mb-6 text-sm">
        Enter your email and we’ll send you a password reset link.
      </p>

      <!-- Form -->
      <form @submit.prevent="handleForgotPassword" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-sky-700 mb-1">
            Email <span class="text-red-500">*</span>
          </label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="Email address"
            :class="[inputClass, errorMsg && errorClass]"
          />
          <p v-if="errorMsg" class="mt-1 text-sm text-red-600">
            {{ errorMsg }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-4 py-2 font-medium shadow hover:brightness-105 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Sending reset link...' : 'Send reset link' }}
        </button>
      </form>

      <!-- Footer -->
      <p class="mt-6 text-sm text-center text-sky-700">
        Remember your password?
        <NuxtLink to="/login" class="font-medium text-sky-800 hover:underline">
          Sign in
        </NuxtLink>
      </p>
    </div>

    <!-- Success Modal -->
    <SuccessModal
      :isOpen="submitted"
      title="Check your email"
      message="We’ve sent a password reset link to your email address."
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SuccessModal from '~/components/SuccessModal.vue'

const email = ref('')
const loading = ref(false)
const submitted = ref(false)
const errorMsg = ref('')

const { $supabase } = useNuxtApp()

const inputClass =
  'mt-1 block w-full rounded-lg border border-sky-200 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400'

const errorClass =
  'border-red-400 focus:ring-red-300 focus:border-red-400'

async function handleForgotPassword() {
  loading.value = true
  errorMsg.value = ''

  try {
    const { error } = await $supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) throw error
    submitted.value = true
  } catch (err: any) {
    errorMsg.value = err.message || 'Failed to send reset link'
  } finally {
    loading.value = false
  }
}

function closeModal() {
  submitted.value = false
  navigateTo('/login')
}
</script>

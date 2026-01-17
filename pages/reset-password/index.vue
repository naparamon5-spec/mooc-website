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
        Reset your password
      </h2>
      <p class="text-center text-sky-700 mb-6 text-sm">
        Enter and confirm your new password below.
      </p>

      <!-- Invalid Link -->
      <p
        v-if="error"
        class="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600 text-center"
      >
        {{ error }}
      </p>

      <!-- Form -->
      <form v-if="!error" @submit.prevent="handleResetPassword" class="space-y-5">
        <!-- New Password -->
        <div>
          <label class="block text-sm font-medium text-sky-700 mb-1">
            New password <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="New password"
              :class="[inputClass, errorMsg && errorClass]"
              @input="validate"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-2.5 text-sky-600 hover:text-sky-800"
            >
              <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block text-sm font-medium text-sky-700 mb-1">
            Confirm password <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              placeholder="Confirm password"
              :class="[inputClass, errorMsg && errorClass]"
              @input="validate"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-2.5 text-sky-600 hover:text-sky-800"
            >
              <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
          <p v-if="errorMsg" class="mt-1 text-sm text-red-600">
            {{ errorMsg }}
          </p>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-4 py-2 font-medium shadow hover:brightness-105 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Resetting password...' : 'Reset password' }}
        </button>
      </form>
    </div>

    <!-- Success Modal -->
    <SuccessModal
      :isOpen="submitted"
      title="Password reset successful"
      message="You can now sign in using your new password."
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SuccessModal from '@/components/SuccessModal.vue'
import { validatePassword, validateConfirmPassword } from '~/utils/validation/auth'

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const submitted = ref(false)
const errorMsg = ref('')
const error = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const { $supabase } = useNuxtApp()

const inputClass =
  'mt-1 block w-full rounded-lg border border-sky-200 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 pr-10'

const errorClass =
  'border-red-400 focus:ring-red-300 focus:border-red-400'

function validate() {
  const passwordError = validatePassword(password.value)
  if (password.value && passwordError) {
    errorMsg.value = passwordError
    return
  }

  const confirmError = validateConfirmPassword(password.value, confirmPassword.value)
  if (confirmPassword.value && confirmError) {
    errorMsg.value = confirmError
    return
  }

  errorMsg.value = ''
}

onMounted(async () => {
  const { data, error: sessionError } = await $supabase.auth.getSession()
  if (sessionError || !data.session) {
    error.value = 'Invalid or expired reset link.'
  }
})

async function handleResetPassword() {
  const passwordError = validatePassword(password.value)
  if (passwordError) {
    errorMsg.value = passwordError
    return
  }
  const confirmError = validateConfirmPassword(password.value, confirmPassword.value)
  if (confirmError) {
    errorMsg.value = confirmError
    return
  }

  errorMsg.value = ''
  loading.value = true

  try {
    const { error } = await $supabase.auth.updateUser({
      password: password.value
    })
    if (error) throw error
    submitted.value = true
  } catch (err: any) {
    errorMsg.value = err.message || 'Failed to reset password.'
  } finally {
    loading.value = false
  }
}

function closeModal() {
  submitted.value = false
  navigateTo('/login')
}
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-sm">
    <h2 class="text-xl font-bold text-gray-800 mb-4">Security Settings</h2>

    <p v-if="successMessage" class="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700">
      {{ successMessage }}
    </p>
    <p v-if="errorMessage" class="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">
      {{ errorMessage }}
    </p>

    <form @submit.prevent="changePassword">
      <div class="space-y-4">
        <div>
          <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <div class="relative">
            <input
              :type="showCurrent ? 'text' : 'password'"
              id="currentPassword"
              v-model="passwords.current"
              :disabled="loading"
              class="w-full px-4 py-2 pr-11 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 disabled:opacity-60"
              autocomplete="current-password"
            />
            <button
              type="button"
              :disabled="loading"
              :aria-label="showCurrent ? 'Hide password' : 'Show password'"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              @click="showCurrent = !showCurrent"
            >
              <svg v-if="!showCurrent" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.176-3.568M6.18 6.18A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.98 9.98 0 01-4.043 5.19M6.18 6.18L3 3m3.18 3.18L21 21"/>
              </svg>
            </button>
          </div>
        </div>
        <div>
          <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <div class="relative">
            <input
              :type="showNew ? 'text' : 'password'"
              id="newPassword"
              v-model="passwords.new"
              :disabled="loading"
              class="w-full px-4 py-2 pr-11 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 disabled:opacity-60"
              autocomplete="new-password"
            />
            <button
              type="button"
              :disabled="loading"
              :aria-label="showNew ? 'Hide password' : 'Show password'"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              @click="showNew = !showNew"
            >
              <svg v-if="!showNew" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.176-3.568M6.18 6.18A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.98 9.98 0 01-4.043 5.19M6.18 6.18L3 3m3.18 3.18L21 21"/>
              </svg>
            </button>
          </div>
          <p class="mt-1 text-xs text-gray-500">At least 6 characters</p>
        </div>
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <div class="relative">
            <input
              :type="showConfirm ? 'text' : 'password'"
              id="confirmPassword"
              v-model="passwords.confirm"
              :disabled="loading"
              class="w-full px-4 py-2 pr-11 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 disabled:opacity-60"
              autocomplete="new-password"
            />
            <button
              type="button"
              :disabled="loading"
              :aria-label="showConfirm ? 'Hide password' : 'Show password'"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              @click="showConfirm = !showConfirm"
            >
              <svg v-if="!showConfirm" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.176-3.568M6.18 6.18A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.98 9.98 0 01-4.043 5.19M6.18 6.18L3 3m3.18 3.18L21 21"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="mt-6 text-right">
        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Updating...' : 'Change Password' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { validatePassword, validateConfirmPassword } from '~/utils/validation/auth'

const { $supabase } = useNuxtApp()

const passwords = ref({
  current: '',
  new: '',
  confirm: '',
})
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function changePassword() {
  errorMessage.value = ''
  successMessage.value = ''

  const newPwd = passwords.value.new
  const confirmPwd = passwords.value.confirm
  const currentPwd = passwords.value.current

  if (!currentPwd?.trim()) {
    errorMessage.value = 'Current password is required.'
    return
  }

  const pwdError = validatePassword(newPwd)
  if (pwdError) {
    errorMessage.value = pwdError
    return
  }

  const confirmError = validateConfirmPassword(newPwd, confirmPwd)
  if (confirmError) {
    errorMessage.value = confirmError
    return
  }

  loading.value = true

  try {
    const { data: { session }, error: sessionError } = await $supabase.auth.getSession()
    if (sessionError || !session?.user?.email) {
      errorMessage.value = 'Session expired. Please sign in again.'
      return
    }

    const { error: signInError } = await $supabase.auth.signInWithPassword({
      email: session.user.email,
      password: currentPwd,
    })
    if (signInError) {
      errorMessage.value = 'Current password is incorrect.'
      return
    }

    const { error: updateError } = await $supabase.auth.updateUser({
      password: newPwd,
    })
    if (updateError) throw updateError

    successMessage.value = 'Password changed successfully.'
    passwords.value = { current: '', new: '', confirm: '' }
  } catch (err: any) {
    errorMessage.value = err?.message ?? 'Failed to change password. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

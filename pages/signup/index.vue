<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white">
    <div
      v-if="!showSuccessModal"
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
      <div class="text-center mb-4">
        <h1 class="text-2xl font-bold text-sky-800">Create an Account</h1>
        <p class="text-center text-sky-700 mb-6 text-sm">Join us and start your learning journey!</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="onSubmit" class="space-y-5">

        <!-- Full Name -->
        <div>
          <label class="block text-sm font-medium text-sky-700 mb-1">
            Full name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="name"
            type="text"
            placeholder="Full Name"
            :class="[inputClass, errors.name && errorClass]"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">
            {{ errors.name }}
          </p>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-sky-700 mb-1">
            Email <span class="text-red-500">*</span>
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="Email Address"
            :class="[inputClass, errors.email && errorClass]"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">
            {{ errors.email }}
          </p>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-sky-700 mb-1">
            Password <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="Password"
              :class="[inputClass, 'pr-12', errors.password && errorClass]"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-2.5 text-sky-600 hover:text-sky-800"
            >
              <svg
                v-if="!showPassword"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.176-3.568M6.18 6.18A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.98 9.98 0 01-4.043 5.19M6.18 6.18L3 3m3.18 3.18L21 21"
                />
              </svg>
            </button>
          </div>
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">
            {{ errors.password }}
          </p>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-4 py-2 font-medium shadow hover:brightness-105 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Creating account...' : 'Create account' }}
        </button>
      </form>

      <!-- Footer -->
      <p class="mt-6 text-sm text-center text-sky-700">
        Already have an account?
        <NuxtLink to="/login" class="font-medium text-sky-800 hover:underline">
          Log in
        </NuxtLink>
      </p>
    </div>

    <!-- Success Modal -->
    <SuccessModal
      :isOpen="showSuccessModal"
      title="Account Created!"
      :message="modalMessage"
      @close="handleModalClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SuccessModal from '~/components/SuccessModal.vue'
import { validateName, validateEmail, validatePassword } from '~/utils/validation/auth'

const { $supabase } = useNuxtApp()
const router = useRouter()

/* =====================
   State
===================== */
const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const showSuccessModal = ref(false)
const countdown = ref(5)

const errors = ref({
  name: '',
  email: '',
  password: ''
})

let countdownInterval: ReturnType<typeof setInterval> | null = null

/* =====================
   Styles
===================== */
const inputClass =
  'mt-1 block w-full rounded-lg border border-sky-200 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400'

const errorClass =
  'border-red-400 focus:ring-red-300 focus:border-red-400'

/* =====================
   Modal Message
===================== */
const modalMessage = computed(() => {
  if (countdown.value > 1) {
    return `Please check your email for verification. Redirecting to login in ${countdown.value} seconds...`
  }
  if (countdown.value === 1) {
    return 'Please check your email for verification. Redirecting to login in 1 second...'
  }
  return 'Redirecting to login...'
})

/* =====================
   Validation
===================== */
function validateForm() {
  errors.value.name = validateName(name.value)
  errors.value.email = validateEmail(email.value)
  errors.value.password = validatePassword(password.value)

  return !errors.value.name && !errors.value.email && !errors.value.password
}

/* =====================
   Submit
===================== */
async function onSubmit() {
  if (!validateForm()) return

  try {
    loading.value = true

    const { error } = await $supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          full_name: name.value
        }
      }
    })

    if (error) throw error

    showSuccessModal.value = true
    countdown.value = 5

    countdownInterval = setInterval(() => {
      countdown.value--
      if (countdown.value === 0) {
        clearInterval(countdownInterval!)
        redirectToLogin()
      }
    }, 1000)

  } catch (err: any) {
    alert(err.message)
  } finally {
    loading.value = false
  }
}

/* =====================
   Helpers
===================== */
function redirectToLogin() {
  router.push('/login')
}

function handleModalClose() {
  if (countdownInterval) clearInterval(countdownInterval)
  redirectToLogin()
}
</script>

<template>
  <!-- Modal -->
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md ring-1 ring-gray-200">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-base font-semibold text-gray-900 leading-tight">
              {{ isEditMode ? 'Edit User Account' : 'Create New Account' }}
            </h2>
            <p class="text-xs text-gray-400 mt-0.5">
              {{ isEditMode ? 'Update the user\'s details below' : 'Fill in the details to create an account' }}
            </p>
          </div>
        </div>
        <button
          @click="closeModal"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Form body -->
      <form @submit.prevent="submitForm" class="px-6 py-5 space-y-4">

        <!-- Full Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.fullName"
            type="text"
            placeholder="Enter full name"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            required
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            Email <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.email"
            type="email"
            placeholder="Enter email address"
            :disabled="isEditMode"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
            required
          />
        </div>

        <!-- Password (create only) -->
        <div v-if="!isEditMode">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            Password <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.password"
            type="password"
            placeholder="Enter password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            required
          />
        </div>

        <!-- Error -->
        <div v-if="errorMessage" class="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          <svg class="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ errorMessage }}
        </div>

        <!-- Success -->
        <div v-if="successMessage" class="flex items-start gap-2.5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          <svg class="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ successMessage }}
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-2">
          <button
            type="button"
            @click="closeModal"
            class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            {{ isSubmitting ? 'Loading...' : (isEditMode ? 'Update' : 'Create') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUserManagement } from '~/composables/useUserManagement'

interface Props {
  isOpen: boolean
  isEditMode: boolean
  userData?: {
    id: string
    name: string
    email: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  isEditMode: false
})

const emit = defineEmits(['close', 'success'])
const { createUser, updateUser } = useUserManagement()

const formData = ref({ fullName: '', email: '', password: '' })
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal && props.isEditMode && props.userData) {
      formData.value = { fullName: props.userData.name, email: props.userData.email, password: '' }
    } else if (newVal) {
      formData.value = { fullName: '', email: '', password: '' }
    }
    errorMessage.value = ''
    successMessage.value = ''
  }
)

const submitForm = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isSubmitting.value = true

  try {
    if (props.isEditMode && props.userData) {
      const result = await updateUser(props.userData.id, {
        fullName: formData.value.fullName,
        email: formData.value.email
      })

      if (result.success) {
        successMessage.value = 'User updated successfully!'
        isSubmitting.value = false
        setTimeout(() => {
          emit('success')
          closeModal()
        }, 1500)
      } else {
        errorMessage.value = result.error || 'Failed to update user'
        isSubmitting.value = false
      }
    } else {
      const result = await createUser({
        email: formData.value.email,
        password: formData.value.password,
        fullName: formData.value.fullName
      })

      if (result.success) {
        successMessage.value = 'Account created successfully!'
        isSubmitting.value = false
        setTimeout(() => {
          emit('success')
          closeModal()
        }, 1500)
      } else {
        errorMessage.value = result.error || 'Failed to create account'
        isSubmitting.value = false
      }
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'An error occurred'
    isSubmitting.value = false
  }
}

const closeModal = () => {
  emit('close')
  formData.value = { fullName: '', email: '', password: '' }
  errorMessage.value = ''
  successMessage.value = ''
}
</script>

<style scoped>
</style>
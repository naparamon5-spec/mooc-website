<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">
        {{ isEditMode ? 'Edit User Account' : 'Create New Account' }}
      </h2>

      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Full Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.fullName"
            type="text"
            placeholder="Enter full name"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
            required
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.email"
            type="email"
            placeholder="Enter email address"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
            required
            :disabled="isEditMode"
          />
        </div>

        <!-- Password (only for create) -->
        <div v-if="!isEditMode">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Password <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.password"
            type="password"
            placeholder="Enter password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
            required
          />
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {{ errorMessage }}
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {{ successMessage }}
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-4">
          <button
            type="button"
            @click="closeModal"
            class="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:bg-gray-400"
          >
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

const formData = ref({
  fullName: '',
  email: '',
  password: ''
})

const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Initialize form data when modal opens
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal && props.isEditMode && props.userData) {
      formData.value = {
        fullName: props.userData.name,
        email: props.userData.email,
        password: ''
      }
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
        setTimeout(() => {
          emit('success')
          closeModal()
        }, 1500)
      } else {
        errorMessage.value = result.error || 'Failed to update user'
      }
    } else {
      const result = await createUser({
        email: formData.value.email,
        password: formData.value.password,
        fullName: formData.value.fullName
      })

      if (result.success) {
        successMessage.value = 'Account created successfully!'
        setTimeout(() => {
          emit('success')
          closeModal()
        }, 1500)
      } else {
        errorMessage.value = result.error || 'Failed to create account'
      }
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'An error occurred'
  } finally {
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

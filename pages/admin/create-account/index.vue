<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <AdminHeader :admin-name="adminName" />

    <div class="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-12">
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-8 md:p-12">
        <!-- Title -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Create Instructor Account</h1>
          <p class="text-gray-600 mt-2">Add a new instructor to the platform</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="onSubmit" class="space-y-6">
          <!-- Row 1: Full Name and Email -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Full Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.fullName"
                type="text"
                placeholder="John Doe"
                :class="[
                  'w-full px-4 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition',
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                ]"
              />
              <p v-if="errors.fullName" class="mt-1 text-sm text-red-600">
                {{ errors.fullName }}
              </p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.email"
                type="email"
                placeholder="instructor@example.com"
                :class="[
                  'w-full px-4 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition',
                  errors.email ? 'border-red-500' : 'border-gray-300'
                ]"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">
                {{ errors.email }}
              </p>
            </div>
          </div>

          <!-- Row 2: Password and Confirm Password -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Password <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  :class="[
                    'w-full px-4 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition',
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  ]"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.176-3.568M6.18 6.18A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.98 9.98 0 01-4.043 5.19M6.18 6.18L3 3m3.18 3.18L21 21" />
                  </svg>
                </button>
              </div>
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">
                {{ errors.password }}
              </p>
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="••••••••"
                :class="[
                  'w-full px-4 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition',
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                ]"
              />
              <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
                {{ errors.confirmPassword }}
              </p>
            </div>
          </div>

          <!-- Row 3: Department and Phone -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Role Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Role <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.role"
                :class="[
                  'w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition',
                  'border-gray-300'
                ]"
              >
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <!-- Department/Subject -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Department / Subject Area
              </label>
              <input
                v-model="form.department"
                type="text"
                placeholder="e.g., Media Literacy, Digital Arts"
                :class="[
                  'w-full px-4 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition',
                  'border-gray-300'
                ]"
              />
            </div>
          </div>

          <!-- Row 4: Phone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Phone Number (Optional)
            </label>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              :class="[
                'w-full px-4 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition',
                'border-gray-300'
              ]"
            />
          </div>

          <!-- Row 5: Permissions (Full Width) -->
          <div class="space-y-4 pt-4">
            <!-- Can Create Courses Toggle -->
            <div class="flex items-center gap-3">
              <input
                v-model="form.canCreateCourses"
                type="checkbox"
                id="canCreateCourses"
                class="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <label for="canCreateCourses" class="text-sm font-medium text-gray-700">
                Allow this instructor to create and manage courses
              </label>
            </div>

            <!-- Can Manage Users Toggle -->
            <div class="flex items-center gap-3">
              <input
                v-model="form.canManageUsers"
                type="checkbox"
                id="canManageUsers"
                class="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <label for="canManageUsers" class="text-sm font-medium text-gray-700">
                Allow this instructor to manage users
              </label>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="generalError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-700">{{ generalError }}</p>
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm text-green-700">{{ successMessage }}</p>
          </div>

          <!-- Buttons -->
          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Creating account...' : 'Create Instructor Account' }}
            </button>
            <NuxtLink
              to="/admin"
              class="flex-1 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition text-center"
            >
              Cancel
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminHeader from '~/components/admindashboard/AdminHeader.vue'
import { validateEmail, validatePassword } from '~/utils/validation/auth'

definePageMeta({ middleware: 'auth' })

useHead({
  title: 'Create Instructor Account - MIL MOOC',
})

const adminName = ref('Admin')
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const generalError = ref('')
const successMessage = ref('')

const form = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'instructor',
  department: '',
  phone: '',
  canCreateCourses: true,
  canManageUsers: false
})

const errors = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validateForm = (): boolean => {
  errors.value = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
  generalError.value = ''

  if (!form.value.fullName.trim()) {
    errors.value.fullName = 'Full name is required'
  }

  if (!form.value.email.trim()) {
    errors.value.email = 'Email is required'
  } else if (!validateEmail(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
  }

  if (!form.value.password) {
    errors.value.password = 'Password is required'
  } else if (!validatePassword(form.value.password)) {
    errors.value.password = 'Password must be at least 8 characters long'
  }

  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = 'Please confirm your password'
  } else if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
  }

  return !Object.values(errors.value).some(error => error)
}

const onSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  generalError.value = ''
  successMessage.value = ''

  try {
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.value.email,
      password: form.value.password
    })

    if (authError) {
      generalError.value = authError.message || 'Failed to create account'
      return
    }

    if (authData.user) {
      // Create profile with selected role
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: form.value.fullName,
          email: form.value.email,
          role: form.value.role,
          department: form.value.department || null,
          phone: form.value.phone || null,
          can_create_courses: form.value.canCreateCourses,
          can_manage_users: form.value.canManageUsers,
          is_active: true,
          created_at: new Date().toISOString()
        })

      if (profileError) {
        generalError.value = profileError.message || 'Failed to create instructor profile'
        return
      }

      successMessage.value = `Instructor account created successfully! Welcome, ${form.value.fullName}.`
      
      // Reset form
      form.value = {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'instructor',
        department: '',
        phone: '',
        canCreateCourses: true,
        canManageUsers: false
      }

      // Redirect after 2 seconds
      setTimeout(() => {
        navigateTo('/admin')
      }, 2000)
    }
  } catch (err: any) {
    generalError.value = err.message || 'An unexpected error occurred'
    console.error('Error creating instructor account:', err)
  } finally {
    loading.value = false
  }
}
</script>
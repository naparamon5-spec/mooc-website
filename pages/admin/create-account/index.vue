<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <AdminHeader :admin-name="adminName" />

    <div class="w-full px-4 md:px-8 lg:px-12 py-12">
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-8 md:p-12">
        <!-- Title and Create Button -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Manage Accounts</h1>
            <p class="text-gray-600 mt-2">View and create instructor and admin accounts</p>
          </div>
          <button
            @click="openModal"
            class="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition"
          >
            Create Account
          </button>
        </div>

        <!-- Users List -->
        <div v-if="usersLoading" class="text-center py-8">
          <p class="text-gray-600">Loading users...</p>
        </div>
        <div v-else-if="usersError" class="text-center py-8">
          <p class="text-red-600">{{ usersError }}</p>
        </div>
        <div v-else-if="users.length === 0" class="text-center py-8">
          <p class="text-gray-600">No instructors or admins found.</p>
        </div>
        <div v-else class="w-full">
          <table class="w-full table-fixed divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th style="width:15%" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th style="width:22%" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th style="width:9%" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th style="width:9%" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th style="width:13%" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th style="width:10%" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th style="width:22%" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id">
                <td class="px-4 py-4 text-sm font-medium text-gray-900 truncate">{{ user.name }}</td>
                <td class="px-4 py-4 text-sm text-gray-500 truncate">{{ user.email }}</td>
                <td class="px-4 py-4">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  ]">
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-4 py-4">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]">
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-4 py-4 text-sm text-gray-500 truncate">{{ user.phone || '-' }}</td>
                <td class="px-4 py-4 text-sm text-gray-500">{{ new Date(user.createdAt).toLocaleDateString() }}</td>
                <td class="px-4 py-4">
                  <div v-if="user.id !== currentUserId" class="flex gap-2">
                    <!-- Toggle Status Button -->
                    <button
                      @click="toggleUserStatus(user)"
                      :disabled="togglingUserId === user.id"
                      :class="[
                        'inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap',
                        user.isActive
                          ? 'border-red-200 text-red-700 bg-red-50 hover:bg-red-100'
                          : 'border-green-200 text-green-700 bg-green-50 hover:bg-green-100'
                      ]"
                    >
                      <svg v-if="togglingUserId === user.id" class="w-3 h-3 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      <svg v-else-if="user.isActive" class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                      </svg>
                      <svg v-else class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {{ togglingUserId === user.id ? 'Updating...' : user.isActive ? 'Deactivate' : 'Activate' }}
                    </button>

                    <!-- Delete Button -->
                    <button
                      @click="promptDeleteUser(user)"
                      :disabled="deletingUserId === user.id"
                      class="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      <svg v-if="deletingUserId === user.id" class="w-3 h-3 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      <svg v-else class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      {{ deletingUserId === user.id ? 'Deleting...' : 'Delete' }}
                    </button>
                  </div>
                  <span v-else class="text-xs text-gray-400 italic">You</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Toggle / Delete error -->
        <div v-if="toggleError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-700">{{ toggleError }}</p>
        </div>
      </div>
    </div>

    <!-- ── Create Account Modal ── -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div class="relative w-full max-w-lg bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
          <div class="p-6 md:p-8">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-900">Create New Account</h3>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="onSubmit" class="space-y-5">
              <!-- Row 1: Full Name and Email -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
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
                  <p v-if="errors.fullName" class="mt-1 text-sm text-red-600">{{ errors.fullName }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
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
                  <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
                </div>
              </div>

              <!-- Row 2: Password and Confirm Password -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
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
                    <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700">
                      <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.176-3.568M6.18 6.18A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.98 9.98 0 01-4.043 5.19M6.18 6.18L3 3m3.18 3.18L21 21"/>
                      </svg>
                    </button>
                  </div>
                  <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirm Password <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <input
                      v-model="form.confirmPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      placeholder="••••••••"
                      :class="[
                        'w-full px-4 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition',
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      ]"
                    />
                    <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700">
                      <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.176-3.568M6.18 6.18A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.98 9.98 0 01-4.043 5.19M6.18 6.18L3 3m3.18 3.18L21 21"/>
                      </svg>
                    </button>
                  </div>
                  <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
                </div>
              </div>

              <!-- Row 3: Role and Phone -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Role <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.role"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  >
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number <span class="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <!-- Error / Success -->
              <div v-if="generalError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-700">{{ generalError }}</p>
              </div>
              <div v-if="successMessage" class="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p class="text-sm text-green-700">{{ successMessage }}</p>
              </div>

              <!-- Buttons -->
              <div class="flex gap-3 pt-2">
                <button
                  type="submit"
                  :disabled="loading"
                  class="flex-1 bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {{ loading ? 'Creating account...' : 'Create Account' }}
                </button>
                <button
                  type="button"
                  @click="closeModal"
                  class="flex-1 bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── Delete Confirmation Dialog ── -->
    <Teleport to="body">
      <div
        v-if="showDeleteDialog"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
        @click.self="cancelDelete"
      >
        <div class="relative w-full max-w-sm bg-white rounded-xl shadow-2xl p-6">
          <!-- Icon -->
          <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
          </div>

          <h3 class="text-lg font-semibold text-gray-900 text-center mb-1">Delete Account</h3>
          <p class="text-sm text-gray-500 text-center mb-6">
            Are you sure you want to delete
            <span class="font-semibold text-gray-700">{{ userToDelete?.name }}</span>'s account?
            This action <span class="text-red-600 font-medium">cannot be undone</span>.
          </p>

          <div class="flex gap-3">
            <button
              @click="cancelDelete"
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              @click="confirmDelete"
              :disabled="deletingUserId === userToDelete?.id"
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span v-if="deletingUserId === userToDelete?.id" class="inline-flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Deleting...
              </span>
              <span v-else>Yes, Delete</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AdminHeader from '~/components/admindashboard/AdminHeader.vue'
import { validateEmail, validatePassword, validateConfirmPassword } from '~/utils/validation/auth'
import { useAdminUserManagement } from '~/composables/useAdminUserManagement'

definePageMeta({ middleware: 'auth' })

useHead({
  title: 'Create Account - MIL MOOC',
})

const adminName = ref('Admin')
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const generalError = ref('')
const successMessage = ref('')
const showModal = ref(false)
const currentUserId = ref<string | null>(null)

// Toggle state
const togglingUserId = ref<string | null>(null)
const toggleError = ref('')

// Delete state
const deletingUserId = ref<string | null>(null)
const showDeleteDialog = ref(false)
const userToDelete = ref<any>(null)

const { users, loading: usersLoading, error: usersError, fetchUsers, updateUserStatus, removeUser } = useAdminUserManagement()

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

// Helper: returns axios headers with Bearer token
const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json'
})

onMounted(() => {
  fetchUsers()
  const { $supabase } = useNuxtApp()
  $supabase.auth.getUser().then(({ data: { user } }) => {
    if (user?.id) {
      currentUserId.value = user.id
    }
  })
})

const validateForm = (): boolean => {
  errors.value = { fullName: '', email: '', password: '', confirmPassword: '' }
  generalError.value = ''

  if (!form.value.fullName.trim()) {
    errors.value.fullName = 'Full name is required'
    return false
  }

  const emailErr = validateEmail(form.value.email)
  if (emailErr) { errors.value.email = emailErr; return false }

  const pwdErr = validatePassword(form.value.password)
  if (pwdErr) { errors.value.password = pwdErr; return false }

  const confirmErr = validateConfirmPassword(form.value.password, form.value.confirmPassword)
  if (confirmErr) { errors.value.confirmPassword = confirmErr; return false }

  return true
}

const onSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  generalError.value = ''
  successMessage.value = ''

  try {
    const { $supabase } = useNuxtApp()
    const { data: { session } } = await $supabase.auth.getSession()
    if (!session?.access_token) {
      generalError.value = 'Session expired. Please sign in again.'
      return
    }

    const { data: result } = await axios.post<{ success: boolean; userId?: string }>(
      '/api/admin/create-account',
      {
        fullName: form.value.fullName.trim(),
        email: form.value.email.trim(),
        password: form.value.password,
        role: form.value.role,
        phone: form.value.phone?.trim() || undefined,
        access_token: session.access_token,
        refresh_token: session.refresh_token ?? ''
      },
      { headers: getAuthHeaders(session.access_token) }
    )

    if (result?.success) {
      successMessage.value = `Account created successfully. ${form.value.fullName} can sign in now.`
      form.value = {
        fullName: '', email: '', password: '', confirmPassword: '',
        role: 'instructor', department: '', phone: '',
        canCreateCourses: true, canManageUsers: false
      }
      showModal.value = false
      fetchUsers()
    }
  } catch (err: any) {
    generalError.value =
      err?.response?.data?.statusMessage ||
      err?.response?.data?.message ||
      err?.message ||
      'Failed to create account'
    console.error('Error creating account:', err)
  } finally {
    loading.value = false
  }
}

// Toggle active/inactive
const toggleUserStatus = async (user: any) => {
  if (togglingUserId.value) return
  toggleError.value = ''
  togglingUserId.value = user.id

  const newStatus = !user.isActive

  try {
    const { $supabase } = useNuxtApp()
    const { data: { session } } = await $supabase.auth.getSession()
    if (!session?.access_token) {
      toggleError.value = 'Session expired. Please sign in again.'
      return
    }

    await axios.patch(
      '/api/admin/toggle-user-status',
      { userId: user.id, isActive: newStatus },
      { headers: getAuthHeaders(session.access_token) }
    )

    updateUserStatus(user.id, newStatus)
  } catch (err: any) {
    toggleError.value =
      err?.response?.data?.statusMessage ||
      err?.response?.data?.message ||
      err?.message ||
      'Failed to update account status'
    console.error('Error toggling user status:', err)
  } finally {
    togglingUserId.value = null
  }
}

// Open delete confirmation dialog
const promptDeleteUser = (user: any) => {
  userToDelete.value = user
  showDeleteDialog.value = true
  toggleError.value = ''
}

const cancelDelete = () => {
  showDeleteDialog.value = false
  userToDelete.value = null
}

// Confirmed — actually delete
const confirmDelete = async () => {
  if (!userToDelete.value || deletingUserId.value) return

  const user = userToDelete.value
  deletingUserId.value = user.id
  toggleError.value = ''

  try {
    const { $supabase } = useNuxtApp()
    const { data: { session } } = await $supabase.auth.getSession()
    if (!session?.access_token) {
      toggleError.value = 'Session expired. Please sign in again.'
      return
    }

    // axios DELETE — userId passed as query param (body-less, reliable across all servers)
    await axios.delete('/api/admin/delete-user', {
      headers: getAuthHeaders(session.access_token),
      params: { userId: user.id }
    })

    removeUser(user.id)
    showDeleteDialog.value = false
    userToDelete.value = null
  } catch (err: any) {
    toggleError.value =
      err?.response?.data?.statusMessage ||
      err?.response?.data?.message ||
      err?.message ||
      'Failed to delete account'
    console.error('Error deleting user:', err)
  } finally {
    deletingUserId.value = null
  }
}

const openModal = () => {
  showModal.value = true
  generalError.value = ''
  successMessage.value = ''
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    fullName: '', email: '', password: '', confirmPassword: '',
    role: 'instructor', department: '', phone: '',
    canCreateCourses: true, canManageUsers: false
  }
  errors.value = { fullName: '', email: '', password: '', confirmPassword: '' }
}
</script>
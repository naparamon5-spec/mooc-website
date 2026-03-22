<template>
  <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-900">User Management</h2>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-wrap gap-3 mb-6">
      <button
        @click="handleExport"
        class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
      >
        Export Users
      </button>
    </div>

    <!-- Search and Filter Bar -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name or email..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div class="w-full md:w-40">
        <select
          v-model="statusFilter"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      <button
        v-if="searchQuery || statusFilter"
        @click="clearFilters"
        class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Clear Filters
      </button>
    </div>

    <!-- Results Count -->
    <div v-if="filteredUsers.length > 0" class="mb-4 text-sm text-gray-600">
      Showing {{ filteredUsers.length }} of {{ users?.length || 0 }} students
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Loading users...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
      <p class="font-semibold">Error Loading Users:</p>
      <p class="text-sm">{{ error }}</p>
      <p class="text-xs mt-2">Make sure your Supabase table has students with role='student'</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && (!users || users.length === 0)" class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
      <p class="font-semibold">No Students Found</p>
      <p class="text-sm">No student accounts found in the system.</p>
    </div>

    <!-- No Results State -->
    <div v-else-if="filteredUsers.length === 0" class="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded mb-4">
      <p class="font-semibold">No Results Found</p>
      <p class="text-sm">No students match your search or filter criteria.</p>
    </div>

    <!-- User Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200">
            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
            <th class="text-center py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(user, index) in filteredUsers"
            :key="index"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td class="py-3 px-4 text-sm text-gray-900">{{ user.name }}</td>
            <td class="py-3 px-4 text-sm text-gray-600">{{ user.email }}</td>
            <td class="py-3 px-4 text-sm text-gray-600">
              <span class="capitalize">{{ user.role }}</span>
            </td>
            <td class="py-3 px-4">
              <span
                class="inline-block px-3 py-1 rounded-full text-xs font-medium"
                :class="getStatusClass(user.status)"
              >
                {{ user.status }}
              </span>
            </td>
            <td class="py-3 px-4">
              <div class="flex gap-1 justify-center items-center">

                <!-- Activate / Deactivate Button -->
                <button
                  @click="toggleStatus(user.id)"
                  :disabled="togglingUserId === user.id"
                  :title="user.isActive ? 'Deactivate user' : 'Activate user'"
                  :class="[
                    'inline-flex items-center justify-center w-8 h-8 rounded-lg border transition disabled:opacity-50 disabled:cursor-not-allowed',
                    user.isActive
                      ? 'border-red-200 text-red-600 bg-red-50 hover:bg-red-100'
                      : 'border-green-200 text-green-600 bg-green-50 hover:bg-green-100'
                  ]"
                >
                  <!-- Spinner -->
                  <svg v-if="togglingUserId === user.id" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  <!-- Deactivate icon (ban/circle-slash) -->
                  <svg v-else-if="user.isActive" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                  </svg>
                  <!-- Activate icon (check-circle) -->
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </button>

                <!-- Divider -->
                <span class="w-px h-5 bg-gray-200 mx-0.5"></span>

                <!-- Edit Button -->
                <button
                  @click="openEditModal(user)"
                  title="Edit user"
                  class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>

                <!-- Delete Button -->
                <button
                  @click="handleDelete(user.id)"
                  title="Delete user"
                  class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a1 1 0 00-1-1h-4a1 1 0 00-1 1H5a1 1 0 000 2h14a1 1 0 000-2z"/>
                  </svg>
                </button>

              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Toggle Error -->
    <div v-if="toggleError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-700">{{ toggleError }}</p>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div v-if="showDeleteDialog" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showDeleteDialog = false" />

      <!-- Dialog -->
      <div class="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 flex flex-col items-center gap-4">
        <!-- Icon -->
        <div class="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
          <svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a1 1 0 00-1-1h-4a1 1 0 00-1 1H5a1 1 0 000 2h14a1 1 0 000-2z" />
          </svg>
        </div>

        <!-- Text -->
        <div class="text-center">
          <h3 class="text-lg font-bold text-gray-900">Delete User</h3>
          <p class="text-sm text-gray-500 mt-1">
            Are you sure you want to delete
            <span class="font-semibold text-gray-800">{{ userToDelete?.name }}</span>?
            <br />This action <span class="text-red-600 font-medium">cannot be undone</span>.
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 w-full mt-2">
          <button
            @click="showDeleteDialog = false"
            class="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface UserItem {
  id: string
  name: string
  email: string
  role: string
  status: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const props = defineProps<{
  users?: UserItem[]
  loading?: boolean
  error?: string
}>()

const emit = defineEmits(['action', 'refresh'])

const showDeleteDialog = ref(false)
const userToDelete = ref<UserItem | null>(null)
const searchQuery = ref('')
const statusFilter = ref('')
const togglingUserId = ref<string | null>(null)
const toggleError = ref('')

const filteredUsers = computed(() => {
  if (!props.users) return []
  return props.users.filter(user => {
    const searchLower = searchQuery.value.toLowerCase()
    const matchesSearch = searchLower === '' ||
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    const matchesStatus = statusFilter.value === '' || user.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const getStatusClass = (status: string) => {
  return status === 'Active'
    ? 'bg-green-100 text-green-700'
    : 'bg-red-100 text-red-700'
}

const openEditModal = (user: UserItem) => {
  emit('action', 'edit', user)
}

const toggleStatus = async (userId: string) => {
  if (togglingUserId.value) return
  toggleError.value = ''
  togglingUserId.value = userId

  try {
    await emit('action', 'toggle-status', userId)
  } catch (err: any) {
    toggleError.value = err?.message || 'Failed to update status'
  } finally {
    togglingUserId.value = null
  }
}

const handleDelete = (userId: string) => {
  const user = props.users?.find(u => u.id === userId) ?? null
  userToDelete.value = user
  showDeleteDialog.value = true
}

const confirmDelete = () => {
  if (userToDelete.value) {
    emit('action', 'delete', userToDelete.value.id)
  }
  showDeleteDialog.value = false
  userToDelete.value = null
}

const handleExport = () => {
  emit('action', 'export')
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
}
</script>
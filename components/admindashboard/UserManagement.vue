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
                class="inline-block px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition"
                :class="getStatusClass(user.status)"
                @click="toggleStatus(user.id)"
                :title="`Click to ${user.isActive ? 'deactivate' : 'activate'}`"
              >
                {{ user.status }}
              </span>
            </td>
            <td class="py-3 px-4">
              <div class="flex gap-2 justify-center">
                <button
                  @click="openEditModal(user)"
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  title="Edit user"
                >
                  Edit
                </button>
                <button
                  @click="handleDelete(user.id)"
                  class="text-red-600 hover:text-red-800 text-sm font-medium"
                  title="Delete user"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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

const toggleStatus = (userId: string) => {
  emit('action', 'toggle-status', userId)
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
<template>
  <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-900">User Management</h2>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex flex-wrap gap-3 mb-6">
      <button 
        @click="openCreateModal"
        class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
      >
        Create Account
      </button>
      <button 
        @click="handleExport"
        class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
      >
        Export Users
      </button>
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
      <p class="text-sm">Click "Create Account" to add new student accounts to the system.</p>
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
            v-for="(user, index) in (users || [])" 
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
                <!-- <button
                  @click="handleDelete(user.id)"
                  class="text-red-600 hover:text-red-800 text-sm font-medium"
                  title="Delete user"
                >
                  Delete
                </button> -->
              </div>
            </td>
          </tr>
          <tr v-if="!(users && users.length > 0)">
            <td colspan="5" class="py-8 text-center text-gray-500">
              No users found
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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

defineProps<{
  users?: UserItem[]
  loading?: boolean
  error?: string
}>()

const emit = defineEmits(['action', 'refresh'])

const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedUser = ref(null)
const loading = ref(false)
const error = ref('')

const getStatusClass = (status: string) => {
  return status === 'Active'
    ? 'bg-green-100 text-green-700'
    : 'bg-red-100 text-red-700'
}

const openCreateModal = () => {
  selectedUser.value = null
  showCreateModal.value = true
  emit('action', 'create')
}

const openEditModal = (user: any) => {
  selectedUser.value = user
  showEditModal.value = true
  emit('action', 'edit', user)
}

const toggleStatus = (userId: string) => {
  emit('action', 'toggle-status', userId)
}

const handleDelete = (userId: string) => {
  if (confirm('Are you sure you want to delete this user?')) {
    emit('action', 'delete', userId)
  }
}

const handleExport = () => {
  emit('action', 'export')
}
</script>


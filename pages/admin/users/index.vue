<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <AdminHeader :admin-name="adminName" />

    <!-- MAIN CONTENT -->
    <main class="flex-1">
  <div class="max-w-full px-4 md:px-8 lg:px-12 py-8">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
          <p class="text-gray-600 mt-2">
            Manage all students, their accounts, and enrollment status
          </p>
        </div>

        <UserManagement
          :users="users"
          :loading="loading"
          :error="error || ''"
          @action="handleUserAction"
        />
      </div>
    </main>

    <!-- User Modal -->
    <UserModal
      :is-open="showUserModal"
      :is-edit-mode="isEditMode"
      :user-data="selectedUser"
      @close="showUserModal = false"
      @success="handleModalSuccess"
    />

    <!-- FOOTER -->
    <footer class="bg-primary-600 text-white text-center py-4">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminHeader from '~/components/admindashboard/AdminHeader.vue'
import UserManagement from '~/components/admindashboard/UserManagement.vue'
import UserModal from '~/components/admindashboard/UserModal.vue'
import { useUserManagement } from '~/composables/useUserManagement'

useHead({
  title: 'User Management - Admin - MIL MOOC',
})

const adminName = ref("Admin User")
const showUserModal = ref(false)
const isEditMode = ref(false)
const selectedUser = ref<any>(null)

const {
  users,
  loading,
  error,
  fetchUsers,
  toggleUserStatus,
  deleteUser
} = useUserManagement()

// Fetch users on component mount
onMounted(async () => {
  await fetchUsers()
})

interface UserData {
  id: string
  name: string
  email: string
  role: string
  status: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const handleUserAction = async (actionType: string, payload?: any) => {
  switch (actionType) {
    case 'create':
      isEditMode.value = false
      selectedUser.value = null
      showUserModal.value = true
      break

    case 'edit':
      isEditMode.value = true
      selectedUser.value = payload
      showUserModal.value = true
      break

    case 'toggle-status':
      await toggleUserStatus(payload)
      break

    case 'delete':
      await deleteUser(payload)
      break

    case 'export':
      exportUsers()
      break

    default:
      console.log('Action:', actionType)
  }
}

const handleModalSuccess = () => {
  showUserModal.value = false
  // Refresh users list after successful update
  fetchUsers()
}

const exportUsers = () => {
  const userList = users.value as UserData[]

  if (userList.length === 0) {
    alert('No users to export')
    return
  }

  const headers = ['Name', 'Email', 'Role', 'Status', 'Created At']

  const csvRows = [
    headers.join(','),
    ...userList.map((user: UserData) => [
      `"${user.name ?? ''}"`,
      `"${user.email ?? ''}"`,
      `"${user.role ?? ''}"`,
      `"${user.status ?? ''}"`,
      `"${user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : ''}"`
    ].join(','))
  ]

  const title = `"MIL MOOC — User Export"`
  const generated = `"Generated: ${new Date().toLocaleString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })}"`
  const totalRow = `"Total Users: ${userList.length}"`

  const fullCsv = [title, generated, totalRow, '', ...csvRows].join('\n')

  const blob = new Blob([fullCsv], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}
</script>


<template>
  <div class="min-h-screen bg-gray-50">
    <AdminHeader :admin-name="adminName" />
    
    <div class="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
        <p class="text-gray-600 mt-2">Manage all users, their accounts, and enrollment status</p>
      </div>

      <UserManagement
        :users="allUsers"
        :actions="userActions"
        @action="handleUserAction"
      />
    </div>

    <!-- Footer -->
    <footer class="bg-primary-600 text-white text-center py-4 mt-8">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminHeader from '~/components/admindashboard/AdminHeader.vue'
import UserManagement from '~/components/admindashboard/UserManagement.vue'

useHead({
  title: 'User Management - Admin - MIL MOOC',
})

const adminName = ref("Admin User")

const allUsers = ref([
  { name: 'Jessica Santos', email: 'jessica.santos@example.com', status: 'Inactive' },
  { name: 'Joricka Brub', email: 'brub.joric@example.com', status: '80%' },
  { name: 'Mark Newtor', email: 'new.mark@example.com', status: '98%' },
  { name: 'Jame Wat', email: 'james.w2@example.com', status: '67%' },
  { name: 'Bert Chan', email: 'chan.bert@example.com', status: '52%' },
  { name: 'Dane White', email: 'white.dane@example.com', status: 'Inactive' },
  { name: 'Sarah Johnson', email: 'sarah.j@example.com', status: '95%' },
  { name: 'Michael Chen', email: 'michael.chen@example.com', status: '45%' },
  { name: 'Emily Davis', email: 'emily.davis@example.com', status: '88%' },
  { name: 'David Wilson', email: 'david.wilson@example.com', status: 'Inactive' }
])

const userActions = ref([
  { label: 'Create Account', type: 'create' },
  { label: 'Edit Account', type: 'edit' },
  { label: 'Suspend/Deactivate Accounts', type: 'suspend' },
  { label: 'Bulk Import', type: 'bulk-import' },
  { label: 'Export Users', type: 'export' }
])

const handleUserAction = (actionType) => {
  console.log('User action:', actionType)
  // Handle user management actions
  // You can add navigation or modal logic here
}
</script>


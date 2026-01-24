<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <AdminHeader :admin-name="adminName" />

    <!-- MAIN CONTENT -->
    <main class="flex-1">
      <div class="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Manage Modules</h1>
          <p class="text-gray-600 mt-2">
            Create, edit, and manage course modules
          </p>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <p class="text-gray-600">
            Module management interface coming soon...
          </p>
        </div>
      </div>
    </main>

    <!-- FOOTER -->
    <footer class="bg-primary-600 text-white text-center py-4">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import AdminHeader from '~/components/admindashboard/AdminHeader.vue'

useHead({
  title: 'Manage Modules - Admin - MIL MOOC',
})

const adminName = ref("Admin User")
</script>


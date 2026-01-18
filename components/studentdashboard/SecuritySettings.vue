<template>
  <div class="bg-white p-6 rounded-lg shadow-sm">
    <h2 class="text-xl font-bold text-gray-800 mb-4">Security Settings</h2>
    <form @submit.prevent="changePassword">
      <div class="space-y-4">
        <div>
          <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input type="password" id="currentPassword" v-model="passwords.current" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
        </div>
        <div>
          <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input type="password" id="newPassword" v-model="passwords.new" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
        </div>
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input type="password" id="confirmPassword" v-model="passwords.confirm" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
        </div>
      </div>
      <div class="mt-6 text-right">
        <button type="submit" class="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">Change Password</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const passwords = ref({
  current: '',
  new: '',
  confirm: '',
})

const changePassword = () => {
  // Add logic to change password
  if (passwords.value.new !== passwords.value.confirm) {
    alert("New passwords do not match.")
    return
  }
  console.log("Password change requested for:", passwords.value)
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-900">User Management</h2>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex flex-wrap gap-3 mb-6">
      <button 
        v-for="action in actions" 
        :key="action.label"
        @click="$emit('action', action.type)"
        class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
      >
        {{ action.label }}
      </button>
    </div>

    <!-- User Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200">
            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(user, index) in users" 
            :key="index"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td class="py-3 px-4 text-sm text-gray-900">{{ user.name }}</td>
            <td class="py-3 px-4 text-sm text-gray-600">{{ user.email }}</td>
            <td class="py-3 px-4">
              <span 
                class="inline-block px-3 py-1 rounded-full text-xs font-medium"
                :class="getStatusClass(user.status)"
              >
                {{ user.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  users: {
    type: Array,
    default: () => []
  },
  actions: {
    type: Array,
    default: () => [
      { label: 'Create Account', type: 'create' },
      { label: 'Edit Account', type: 'edit' },
      { label: 'Suspend/Deactivate Accounts', type: 'suspend' }
    ]
  }
})

defineEmits(['action'])

const getStatusClass = (status) => {
  if (status === 'Inactive') {
    return 'bg-red-100 text-red-700'
  }
  if (typeof status === 'string' && status.includes('%')) {
    const percentage = parseInt(status)
    if (percentage >= 80) {
      return 'bg-green-100 text-green-700'
    } else if (percentage >= 50) {
      return 'bg-yellow-100 text-yellow-700'
    } else {
      return 'bg-orange-100 text-orange-700'
    }
  }
  return 'bg-gray-100 text-gray-700'
}
</script>


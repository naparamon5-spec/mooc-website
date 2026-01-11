<template>
  <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-900">System Health</h2>
    </div>
    
    <div class="grid grid-cols-2 gap-4">
      <div 
        v-for="(metric, index) in metrics" 
        :key="index"
        class="flex items-center justify-between p-3 rounded-lg border border-gray-100"
      >
        <span class="text-sm font-medium text-gray-700">{{ metric.label }}</span>
        <span 
          class="px-3 py-1 rounded-full text-xs font-medium"
          :class="getStatusClass(metric.status, metric.value)"
        >
          {{ metric.value || metric.status }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  metrics: {
    type: Array,
    default: () => [
      { label: 'Server Load', status: 'Low', value: null },
      { label: 'Storage Usage', status: 'Warning', value: '89%' },
      { label: 'API Uptime', status: 'Good', value: '91%' },
      { label: 'Security Status', status: 'Good', value: null },
      { label: 'Error Logs', status: 'Warning', value: null },
      { label: 'Network and Bandwidth', status: 'Good', value: null },
      { label: 'Server Performance', status: 'Good', value: null },
      { label: 'Database Health', status: 'Good', value: null }
    ]
  }
})

const getStatusClass = (status, value) => {
  if (value && value.includes('%')) {
    const percentage = parseInt(value)
    if (percentage >= 90) {
      return 'bg-red-100 text-red-700'
    } else if (percentage >= 70) {
      return 'bg-orange-100 text-orange-700'
    } else {
      return 'bg-green-100 text-green-700'
    }
  }
  
  if (status === 'Good' || status === 'Low') {
    return 'bg-green-100 text-green-700'
  } else if (status === 'Warning') {
    return 'bg-orange-100 text-orange-700'
  } else {
    return 'bg-red-100 text-red-700'
  }
}
</script>


<template>
  <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-900">Module Completion (last 2 weeks)</h2>
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
      { label: 'MODULE 1: Intro to Media Literacy', status: '', value: 87 },
      { label: 'MODULE 2: Digital Citizenship', status: '', value: 64 },
      { label: 'MODULE 3: Misinformation & Bias', status: '', value: 52 },
      { label: 'MODULE 4: Critical Analysis', status: '', value: 43 },
      { label: 'MODULE 5: Digital Rights & Privacy', status: '', value: 31 },
      { label: 'MODULE 6: Content Creation Basics', status: '', value: 18 },
      { label: 'MODULE 7: Advanced Topics', status: '', value: 9 },
      { label: 'MODULE 8: Project Showcase', status: '', value: 4 }
    ]
  }
})

const getStatusClass = (status, value) => {
  // numeric values represent completion counts for modules
  if (typeof value === 'number') {
    // thresholds can be adjusted; high counts = green
    if (value >= 50) {
      return 'bg-green-100 text-green-700'
    } else if (value >= 20) {
      return 'bg-orange-100 text-orange-700'
    } else {
      return 'bg-red-100 text-red-700'
    }
  }

  if (value && typeof value === 'string' && value.includes('%')) {
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


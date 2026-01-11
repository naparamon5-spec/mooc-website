<template>
  <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-sm font-medium text-gray-600">{{ title }}</h3>
      <div v-if="icon" class="text-primary-600">
        <component :is="icon" class="h-5 w-5" />
      </div>
    </div>
    <div class="flex items-baseline gap-2">
      <p class="text-3xl font-bold text-gray-900">{{ value }}</p>
      <span v-if="subtitle" class="text-sm text-gray-500">{{ subtitle }}</span>
    </div>
    <div v-if="trend" class="mt-2 flex items-center gap-1">
      <span :class="trend.type === 'up' ? 'text-green-600' : 'text-red-600'" class="text-xs font-medium">
        {{ trend.value }}
      </span>
      <span class="text-xs text-gray-500">{{ trend.label }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: Object,
    default: null
  },
  trend: {
    type: Object,
    default: null
  }
})
</script>


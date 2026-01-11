<template>
  <div class="bg-white rounded-lg p-4 shadow-sm">
    <h3 class="text-sm font-semibold text-gray-800 mb-3">Course Completion Status</h3>
    <div class="flex items-center justify-between">
      <span class="text-sm text-gray-600">{{ status }}</span>
      <span class="text-sm font-semibold text-gray-800">{{ completed }}/{{ total }} modules</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  status: {
    type: String,
    default: 'In progress'
  },
  completed: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 5
  }
})
</script>


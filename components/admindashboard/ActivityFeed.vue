<template>
  <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-900">Activity Feed</h2>
    </div>
    
    <div class="space-y-2">
      <div 
        v-for="(activity, index) in activities" 
        :key="index"
        class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div class="flex-shrink-0 mt-1">
          <div 
            class="h-2 w-2 rounded-full"
            :class="activity.type === 'error' ? 'bg-red-500' : activity.type === 'warning' ? 'bg-orange-500' : 'bg-green-500'"
          ></div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-900">{{ activity.message }}</p>
          <div class="flex items-center gap-2 mt-1">
            <span v-if="activity.timestamp" class="text-xs text-gray-500">{{ activity.timestamp }}</span>
            <span v-if="activity.count" class="text-xs font-medium text-red-600">{{ activity.count }}</span>
            <button 
              v-if="activity.retry" 
              @click="$emit('retry', activity)"
              class="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
        <div v-if="activity.showWarningIcon" class="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activities: {
    type: Array,
    default: () => []
  }
})

defineEmits(['retry'])
</script>


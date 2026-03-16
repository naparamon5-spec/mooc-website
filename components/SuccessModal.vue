<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">{{ title }}</h3>
        <div v-if="imageSrc" class="mb-4 flex justify-center">
          <img :src="imageSrc" alt="badge" class="h-24 w-24 object-contain" />
        </div>
        <p class="text-gray-600 mb-6">
          {{ message }}
        </p>
        <div class="flex flex-col sm:flex-row gap-3">
          <button 
            @click="$emit('close')" 
            class="flex-1 inline-flex justify-center rounded-lg bg-sky-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:text-sm"
          >
            {{ buttonText }}
          </button>
          <button
            v-if="secondaryButtonText"
            @click="$emit('secondary')"
            class="flex-1 inline-flex justify-center rounded-lg bg-gray-200 px-4 py-2 text-base font-medium text-gray-800 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 sm:text-sm"
          >
            {{ secondaryButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Success!'
  },
  message: {
    type: String,
    default: 'Operation completed successfully.'
  },
  buttonText: {
    type: String,
    default: 'Continue'
  },
  secondaryButtonText: {
    type: String,
    default: ''
  },
  imageSrc: {
    type: String,
    default: ''
  }
})

defineEmits(['close', 'secondary'])
</script>

<template>
  <div
    class="relative rounded-lg overflow-hidden border-2 transition-all duration-200"
    :class="[
      isRestricted
        ? 'border-gray-300 bg-gray-50 opacity-60 cursor-not-allowed'
        : isActive
        ? 'border-primary-600 bg-white shadow-lg cursor-pointer hover:shadow-xl'
        : 'border-gray-200 bg-white cursor-pointer hover:shadow-md'
    ]"
    @click="!isRestricted && $emit('click')"
  >
    <!-- Restricted Overlay -->
    <div
      v-if="isRestricted"
      class="absolute inset-0 bg-white/80 flex items-center justify-center z-10"
    >
      <span class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-semibold">
        Restricted
      </span>
    </div>

    <!-- Module Image/Thumbnail -->
    <div class="h-32 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center relative overflow-hidden">
      <div class="absolute inset-0 flex items-center justify-center">
        <!-- Placeholder for module thumbnail - can be replaced with actual images -->
        <div class="text-4xl">{{ emoji }}</div>
      </div>
      <div v-if="isActive && !isRestricted" class="absolute top-2 right-2">
        <div class="bg-green-500 rounded-full p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Module Info -->
    <div class="p-4">
      <h3 class="font-semibold text-sm text-gray-800 mb-1 line-clamp-2">
        {{ title }}
      </h3>
      <p v-if="subtitle" class="text-xs text-gray-600 line-clamp-1">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isRestricted: {
    type: Boolean,
    default: false
  },
  emoji: {
    type: String,
    default: '📚'
  }
})

defineEmits(['click'])
</script>
<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>



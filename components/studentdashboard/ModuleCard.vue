<template>
  <div
    class="relative rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
    :class="[
      isRestricted
        ? 'border-gray-300 bg-gray-50 opacity-60 cursor-not-allowed'
        : isActive
        ? 'border-primary-600 bg-white shadow-xl cursor-pointer hover:shadow-2xl ring-2 ring-primary-300'
        : 'border-gray-200 bg-white cursor-pointer hover:shadow-lg'
    ]"
    @click="!isRestricted && $emit('click')"
  >
    <!-- Restricted Overlay -->
    <div
      v-if="isRestricted"
      class="absolute inset-0 bg-gradient-to-br from-gray-800/60 to-gray-900/60 flex items-center justify-center z-10"
    >
      <div class="text-center">
        <span class="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold block mb-2">🔒 Locked</span>
        <p class="text-white text-xs">Complete previous module</p>
      </div>
    </div>

    <!-- Image Only -->
    <div class="w-full relative overflow-hidden">
      <img 
        v-if="imageUrl"
        :src="imageUrl"
        :alt="title"
        class="w-full h-auto object-contain"
      />
      <!-- Completion Badge -->
      <div v-if="isCompleted" class="absolute top-2 right-2 z-20">
        <div class="bg-green-500 rounded-full p-2 shadow-lg animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isActive: { type: Boolean, default: false },
  isRestricted: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  title: { type: String, default: "" },  // optional, used for alt
  imageUrl: { type: String, default: "" },
  moduleId: { type: Number, default: null },
})

defineEmits(['click'])
</script>

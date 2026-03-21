<template>
  <div
    class="module-card relative rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 aspect-[5/6] w-full bg-gray-100"
    :class="[
      isRestricted
        ? 'border-gray-300 opacity-60 cursor-not-allowed'
        : isActive
        ? 'border-primary-600 shadow-xl cursor-pointer hover:shadow-2xl ring-2 ring-primary-300'
        : 'border-gray-200 cursor-pointer hover:shadow-lg'
    ]"
    @click="!isRestricted && $emit('click')"
  >
    <!-- Restricted Overlay -->
    <div
      v-if="isRestricted"
      class="absolute inset-0 bg-gradient-to-br from-gray-800/60 to-gray-900/60 flex items-center justify-center z-10"
    >
      <div class="text-center px-2">
        <span class="bg-gray-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold block mb-1">🔒 Locked</span>
        <p class="text-white text-xs leading-tight">{{ restrictionMessage }}</p>
      </div>
    </div>

    <!-- Image fills entire card -->
    <div class="absolute inset-0">
      <img
        v-if="cardImageUrl"
        :src="cardImageUrl"
        :alt="title"
        class="w-full h-full object-cover"
      />
      <img
        v-else-if="imageUrl"
        :src="imageUrl"
        :alt="title"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
        <span class="text-4xl">{{ emoji }}</span>
      </div>
    </div>

    <!-- Completion Badge -->
    <div v-if="isCompleted" class="absolute top-2 right-2 z-20">
      <div class="bg-green-500 rounded-full p-1.5 shadow-lg animate-pulse">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 text-white"
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
</template>

<script setup lang="ts">
const props = defineProps({
  isActive: { type: Boolean, default: false },
  isRestricted: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  restrictionMessage: { type: String, default: 'Complete previous module' },
  title: { type: String, default: "" },
  emoji: { type: String, default: "" },
  cardImageUrl: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  moduleId: { type: String, default: null },
})

defineEmits(['click'])
</script>
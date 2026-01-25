<template>
  <div
    class="relative rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer"
    :class="[
      module.is_restricted
        ? 'border-gray-300 bg-gray-50 opacity-60 cursor-not-allowed'
        : module.is_active
        ? 'border-primary-600 bg-white shadow-lg hover:shadow-xl'
        : 'border-gray-200 bg-white hover:shadow-md'
    ]"
    @click="!module.is_restricted && $emit('edit', module)"
  >
    <!-- Restricted Overlay -->
    <div
      v-if="module.is_restricted"
      class="absolute inset-0 bg-white/80 flex items-center justify-center z-10"
    >
      <span class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-semibold">
        Restricted
      </span>
    </div>

    <!-- Module Image or Emoji - Full Height -->
    <div class="w-full h-48 flex items-center justify-center bg-gray-100 relative group">
      <img
        v-if="module.image_url"
        :src="module.image_url"
        :alt="module.title"
        class="w-full h-full object-cover"
      />
      <img
        v-else-if="module.image"
        :src="`/assets/${getImageName}.png`"
        :alt="module.title"
        class="w-full h-full object-cover"
      />
      <span v-else class="text-6xl">{{ module.emoji || '📚' }}</span>
      
      <!-- Hover Overlay with Title -->
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-4">
        <p v-if="!module.is_restricted" class="text-white font-bold text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {{ module.title }}
        </p>
      </div>

      <!-- Completion Badge -->
      <div v-if="module.is_completed" class="absolute top-2 right-2">
        <div class="bg-green-500 rounded-full p-2 shadow-lg">
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

<script setup>
import { computed } from 'vue'

const numberToWords = (num) => {
  const words = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
    10: 'ten'
  }
  return words[num] || `module${num}`
}

const props = defineProps({
  module: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const getImageName = computed(() => {
  if (typeof props.module.image === 'number') {
    return numberToWords(props.module.image)
  }
  return props.module.image
})

// Show only first 2 learning outcomes
const displayOutcomes = computed(() => {
  if (!props.module.learning_outcomes) return []
  const outcomes = Array.isArray(props.module.learning_outcomes) ? props.module.learning_outcomes : []
  return outcomes.slice(0, 2)
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

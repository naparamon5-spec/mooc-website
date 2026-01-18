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

    <!-- All Modules - Full Image Display -->
    <div class="w-full relative">
      <img 
        :src="`/assets/${getImageName()}.png`"
        :alt="title"
        class="w-full h-full object-cover"
      />
      <!-- Completion Badge -->
      <div v-if="isCompleted" class="absolute top-2 right-2">
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

<script setup lang="ts">
const numberToWords = (num: number | null): string => {
  const words: Record<number, string> = {
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
  return words[num || 0] || `module${num}`
}

const props = defineProps({
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
  isCompleted: {
    type: Boolean,
    default: false
  },
  emoji: {
    type: String,
    default: '📚'
  },
  moduleId: {
    type: Number,
    default: null
  }
})

const getImageName = (): string => {
  return numberToWords(props.moduleId)
}

defineEmits(['click'])
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
<template>
  <Transition name="fade" mode="out-in">
    <div
      v-if="module"
      :key="module.id"
      class="bg-gradient-to-br from-white to-primary-50
             rounded-xl p-4 shadow-lg hover:shadow-xl
             transition-shadow duration-300
             border-2 border-primary-200
             relative overflow-hidden"
    >
      <!-- Decorative accent -->
      <div
        class="absolute top-0 right-0 w-28 h-28 bg-primary-100
               rounded-full -mr-14 -mt-14 opacity-20"
      ></div>

      <div class="relative z-10">
        <!-- Title -->
        <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-2xl">{{ module.emoji || '📚' }}</span>
          {{ module.title }}
        </h3>

        <!-- Description -->
        <p class="text-gray-700 mb-3 leading-relaxed text-base">
          {{ module.description }}
        </p>

        <!-- Outcomes -->
        <div v-if="outcomesList.length">
          <h4
            class="text-sm font-semibold text-gray-800 mb-2
                   flex items-center gap-1.5"
          >
            <span class="text-base">🎯</span>
            Key Learning Outcomes
          </h4>

          <ul class="space-y-1">
            <li
              v-for="(outcome, index) in outcomesList"
              :key="index"
              class="flex items-start gap-2
                     text-gray-700
                     p-1 rounded-md
                     transition-colors
                     text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-primary-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{{ outcome }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Transition>
</template>


<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  module: {
    type: Object,
    default: null
  }
});

// Handle both learning_outcomes (snake_case from DB) and learningOutcomes (camelCase)
const outcomesList = computed(() => {
  if (!props.module) return []
  return props.module.learning_outcomes || props.module.learningOutcomes || []
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
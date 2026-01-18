<template>
  <Transition name="fade" mode="out-in">
    <div
      v-if="module"
      :key="module.id"
      class="bg-white rounded-xl p-6 shadow-sm mb-4 hover:shadow-md transition-shadow duration-300 border border-gray-100 relative overflow-hidden"
    >
      <!-- Left Accent Bar -->
      <div class="absolute left-0 top-0 h-full w-1 bg-primary-500 rounded-l-xl"></div>

      <!-- Module Content -->
      <div class="relative">
        <!-- Module Title -->
        <h3 class="text-xl font-bold text-gray-800 mb-4">
          {{ module.title }}
        </h3>

        <!-- Module Description -->
        <p class="text-gray-600 mb-6">
          {{ module.description }}
        </p>

        <!-- Key Learning Outcomes -->
        <div>
          <h4 class="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
            Key Learning Outcomes
          </h4>
          <ul class="space-y-1">
            <li
              v-for="(outcome, index) in module.learningOutcomes"
              :key="index"
              class="flex items-start gap-3 text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5"
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
defineProps({
  module: {
    type: Object,
    default: null
  }
});
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

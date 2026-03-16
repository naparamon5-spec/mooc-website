<template>
  <Transition name="fade" mode="out-in">
    <div
      v-if="module"
      :key="module.id"
      class="rounded-xl p-6 shadow-md border border-blue-200 overflow-hidden
             bg-gradient-to-br from-blue-100 to-blue-50"
    >
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Content left -->
        <div class="flex-1 min-w-0">
          <p class="text-gray-700 mb-1">Hi there! Here's what you need to learn for</p>
          <h3 class="text-xl font-bold mb-3" style="color: #001a4d;">
            {{ module.title }}
          </h3>

          <p class="text-gray-700 mb-4 leading-relaxed text-base">
            {{ module.description }}
          </p>

          <!-- DepEd's Most Essential Learning Competencies -->
          <div v-if="outcomesList.length" class="mt-4">
            <h4 class="text-sm font-bold text-gray-800 mb-2">
              DepEd's Most Essential Learning Competencies
            </h4>
            <ul class="space-y-2 text-gray-700 text-sm ml-4 list-disc">
              <li
                v-for="(outcome, index) in outcomesList"
                :key="index"
                class="leading-relaxed"
              >
                {{ outcome }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Meli on the right, facing left -->
        <div class="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
          <img
            src="~/assets/welcome.png"
            alt="Meli - your MIL guide"
            class="w-full h-full object-contain meli-face-left"
          />
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

/* Flip image so Meli faces left (toward the content) */
.meli-face-left {
  transform: scaleX(-1);
}
</style>
<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 w-full max-w-md mx-4 shadow-xl animate-fade-in">
      <!-- Success Icon -->
      <div class="flex justify-center mb-6">
        <div class="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>

      <!-- Title -->
      <h2 class="text-2xl font-bold text-center text-gray-900 mb-2">
        Module Completed!
      </h2>

      <!-- Module Name -->
      <p class="text-center text-gray-600 mb-6">
        {{ moduleName }}
        <span v-if="studentName" class="block text-sm text-gray-500 mt-1">Completed by {{ studentName }}</span>
      </p>

      <!-- Badge Display -->
      <div class="bg-primary-50 rounded-lg p-6 mb-6 text-center">
        <p class="text-sm text-gray-600 mb-3">You Earned a Badge!</p>
        <div class="flex flex-col items-center">
          <div class="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <p class="text-lg font-bold text-primary-600">{{ badgeName }}</p>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex flex-col gap-3">
        <button
          @click="handleNextModule"
          class="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          Continue to Next Module
        </button>
        <button
          @click="handleBackToDashboard"
          class="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean;
  moduleName: string;
  badgeName: string;
  studentName?: string;
  currentModuleId: number;
  totalModules: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  nextModule: [];
  backToDashboard: [];
}>();

const handleNextModule = () => {
  if (props.currentModuleId < props.totalModules) {
    emit('nextModule');
  } else {
    emit('backToDashboard');
  }
};

const handleBackToDashboard = () => {
  emit('backToDashboard');
};
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-in-out;
}
</style>

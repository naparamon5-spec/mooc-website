<template>
  <Teleport to="body" v-if="isOpen">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
      @click="closeModal"
    />

    <!-- Modal -->
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        class="bg-gradient-to-br from-sky-50 to-indigo-50 rounded-2xl shadow-2xl max-w-2xl w-full border-2 border-sky-200 overflow-hidden animate-bounce-in"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
          <!-- Character Illustration -->
          <div class="md:col-span-1 flex items-center justify-center">
            <div class="text-center">
              <div v-if="mode === 'onboarding'" class="text-8xl mb-4 animate-pulse">👨‍🏫</div>
              <div v-else class="text-8xl mb-4 animate-pulse">🚀</div>
              <p class="text-sm text-sky-700 font-semibold mt-2">{{ characterName }}</p>
            </div>
          </div>

          <!-- Content -->
          <div class="md:col-span-2 flex flex-col justify-between">
            <div>
              <h2 class="text-2xl md:text-3xl font-bold text-sky-900 mb-4">
                {{ title }}
              </h2>
              <div class="space-y-3 text-sky-800">
                <p v-for="(message, index) in messages" :key="index" class="leading-relaxed">
                  {{ message }}
                </p>
              </div>
            </div>

            <!-- Quick Tips (if available) -->
            <div v-if="tips && tips.length > 0" class="mt-6 bg-white/60 rounded-lg p-4 border border-sky-200">
              <h3 class="font-bold text-sky-900 mb-2 flex items-center gap-2">
                <span>💡</span> Quick Tips
              </h3>
              <ul class="space-y-1">
                <li v-for="(tip, index) in tips" :key="index" class="text-sm text-sky-700 flex items-start gap-2">
                  <span class="text-sky-600 font-bold min-w-fit">•</span>
                  <span>{{ tip }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="bg-sky-100/50 border-t border-sky-200 px-8 py-4 flex gap-3 justify-end">
          <button
            v-if="showSkip"
            @click="skipTutorial"
            class="px-4 py-2 rounded-lg text-sky-600 hover:bg-sky-200 font-medium transition-colors"
          >
            Skip
          </button>
          <button
            @click="closeModal"
            class="px-6 py-2 rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 text-white hover:brightness-105 font-medium transition-all"
          >
            {{ buttonText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  isOpen: boolean
  mode?: 'onboarding' | 'module' // onboarding for new users, module for module intro
  title?: string
  messages?: string[]
  tips?: string[]
  buttonText?: string
  showSkip?: boolean
  characterName?: string
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'onboarding',
  title: 'Welcome to Your Learning Journey!',
  messages: () => [
    'Hello! I\'m your personal learning guide. I\'m here to help you navigate through this course and make sure you get the most out of every lesson.',
    'Throughout your journey, I\'ll appear to guide you through important milestones and provide helpful tips to enhance your learning experience.'
  ],
  tips: () => [
    'Complete all modules in order to unlock advanced content',
    'Take quizzes to test your knowledge and earn badges',
    'Visit your dashboard to track your progress',
    'Reach out if you need any help!'
  ],
  buttonText: 'Got it, Let\'s Start!',
  showSkip: true,
  characterName: 'Alex'
})

const emit = defineEmits<{
  close: []
  skip: []
}>()

const closeModal = () => {
  emit('close')
}

const skipTutorial = () => {
  emit('skip')
}
</script>

<style scoped>
@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>

<template>
  <!-- Inline Course Agreement: only this card + Beginner tab; modules/description hidden by parent -->
  <div class="w-full">
    <!-- Beginner / Advanced tabs (only show the active one) -->
    <div class="mb-4">
      <div class="flex flex-wrap gap-2 items-center">
        <button
          v-if="currentLevel === 'beginner'"
          type="button"
          class="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-base font-semibold text-white transition-all shadow-md"
          style="background-color: #001a4d;"
          disabled
        >
          Beginner Course
        </button>
        <button
          v-if="currentLevel === 'advanced'"
          type="button"
          class="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-base font-semibold text-white transition-all shadow-md"
          style="background-color: #001a4d;"
          disabled
        >
          Advanced Course
        </button>
      </div>
    </div>

    <!-- Large light blue agreement card (match image) -->
    <div class="w-full rounded-xl overflow-hidden border border-blue-200 bg-gradient-to-r from-blue-100 to-blue-50 p-6 md:p-8">
      <div class="flex flex-col md:flex-row items-start gap-6">
        <!-- Character left -->
        <div class="flex-shrink-0 w-32 h-32 md:w-40 md:h-40">
          <img
            src="~/assets/welcome.png"
            alt="Course guide"
            class="w-full h-full object-contain"
          />
        </div>

        <!-- Content right -->
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl md:text-3xl font-bold mb-3" style="color: #001a4d;">
            {{ currentLevel === 'beginner' ? 'Beginner Course' : 'Advanced Course' }} - Course Agreement
          </h1>
          <p class="text-gray-700 mb-4 leading-relaxed">
            Before we continue learning Media and Information Literacy, I want to remind you that this course is here to help you think critically and use media responsibly at your own pace.
          </p>
          <p class="text-gray-700 mb-4 leading-relaxed">
            To help you stay on track and complete the course within the suggested timeframe, we'll be sending friendly reminders to your registered email.
          </p>

          <div class="bg-white/70 border-l-4 border-blue-600 rounded-lg p-4 mb-5">
            <p class="font-semibold text-gray-900 mb-3">If I am inactive, I agree to receive:</p>
            <ul class="space-y-2 text-gray-700 ml-2">
              <li><strong>1st reminder:</strong> after 1 week</li>
              <li><strong>2nd reminder:</strong> after 2 weeks</li>
              <li><strong>3rd reminder:</strong> after 3 weeks</li>
              <li><strong>4th reminder:</strong> my progress will be reset</li>
            </ul>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center gap-4">
            <label class="flex items-start gap-3 cursor-pointer order-2 sm:order-1">
              <input
                v-model="agreementChecked"
                type="checkbox"
                class="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700">
                I understand and agree to the terms above. I acknowledge that I may receive reminders and that my progress may be reset if I remain inactive.
              </span>
            </label>
            <button
              type="button"
              @click="handleAgree"
              :disabled="!agreementChecked || isLoading"
              class="px-8 py-3 rounded-lg font-semibold text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 order-1 sm:order-2"
              style="background-color: #001a4d;"
            >
              <span v-if="isLoading" class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{{ isLoading ? 'Processing...' : 'I agree' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  courseLevel?: 'beginner' | 'advanced'
}>()

const emit = defineEmits<{
  agree: []
}>()

const agreementChecked = ref(false)
const isLoading = ref(false)
const { $supabase } = useNuxtApp()
const currentLevel = props.courseLevel || 'beginner'

const handleAgree = async () => {
  if (!agreementChecked.value) return

  isLoading.value = true
  try {
    const { data: { user } } = await $supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await $supabase
      .from('profiles')
      .update({
        course_agreement_accepted: true,
        course_agreement_accepted_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) throw error

    emit('agree')
  } catch (error) {
    console.error('Error accepting course agreement:', error)
    alert('Error accepting agreement. Please try again.')
  } finally {
    isLoading.value = false
  }
}
</script>

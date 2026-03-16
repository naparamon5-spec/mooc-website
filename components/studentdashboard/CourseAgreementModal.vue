<template>
  <!-- Course Agreement Modal - Shown for new users -->
  <Teleport to="body">
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      @click.self="preventClose"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 p-8">
        <!-- Header with Character -->
        <div class="flex items-start gap-6 mb-6">
          <div class="flex-1">
            <h1 class="text-3xl font-bold mb-2" style="color: #001a4d;">
              Hello there again!
            </h1>
            <p class="text-lg text-gray-700 font-medium">
              Before we continue learning Media and Information Literacy, I want to remind you that this course is here to help you think critically and use media responsibly at your own pace.
            </p>
          </div>
          <!-- Instructor Character -->
          <div class="flex-shrink-0 w-32 h-32">
            <img 
              src="~/assets/welcome.png" 
              alt="Instructor" 
              class="w-full h-full object-contain"
            />
          </div>
        </div>

        <!-- Agreement Details -->
        <div class="bg-blue-50 border-l-4 border-blue-600 p-6 rounded mb-6">
          <p class="text-gray-700 mb-4">
            To help you stay on track and complete the course within the suggested timeframe, we'll be sending friendly reminders to your registered email.
          </p>
          
          <p class="font-semibold text-gray-900 mb-3">If I am inactive, I agree to receive:</p>
          <ul class="space-y-2 text-gray-700 ml-4">
            <li class="flex items-start">
              <span class="mr-3">•</span>
              <span><strong>1st reminder:</strong> after 1 week</span>
            </li>
            <li class="flex items-start">
              <span class="mr-3">•</span>
              <span><strong>2nd reminder:</strong> after 2 weeks</span>
            </li>
            <li class="flex items-start">
              <span class="mr-3">•</span>
              <span><strong>3rd reminder:</strong> after 3 weeks</span>
            </li>
            <li class="flex items-start">
              <span class="mr-3">•</span>
              <span><strong>4th reminder:</strong> my progress will be reset</span>
            </li>
          </ul>
        </div>

        <!-- Agreement Checkbox -->
        <div class="mb-6">
          <label class="flex items-start gap-3 cursor-pointer">
            <input
              v-model="agreementChecked"
              type="checkbox"
              class="w-5 h-5 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700">
              I understand and agree to the terms and conditions outlined above. I acknowledge that I may receive reminders about my course progress and that my progress may be reset if I remain inactive.
            </span>
          </label>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 justify-end">
          <button
            v-if="allowCancel"
            @click="handleDecline"
            class="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Decline
          </button>
          <button
            @click="handleAgree"
            :disabled="!agreementChecked || isLoading"
            class="px-8 py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-white"
            style="background-color: #001a4d; cursor: pointer;"
          >
            <span v-if="isLoading" class="inline-block animate-spin">⏳</span>
            <span>{{ isLoading ? 'Processing...' : 'I agree' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Props {
  isOpen: boolean
  allowCancel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  allowCancel: false
})

const emit = defineEmits<{
  agree: []
  decline: []
  close: []
}>()

const agreementChecked = ref(false)
const isLoading = ref(false)
const { $supabase } = useNuxtApp()

const showModal = computed(() => props.isOpen)

const handleAgree = async () => {
  if (!agreementChecked.value) return
  
  isLoading.value = true
  try {
    // Get current user
    const { data: { user } } = await $supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Mark course agreement as accepted
    const { error } = await $supabase
      .from('profiles')
      .update({
        course_agreement_accepted: true,
        course_agreement_accepted_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) throw error

    // Emit agree event
    emit('agree')
  } catch (error) {
    console.error('Error accepting course agreement:', error)
    alert('Error accepting agreement. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const handleDecline = () => {
  emit('decline')
}

const preventClose = () => {
  if (!props.allowCancel) return
  emit('close')
}
</script>

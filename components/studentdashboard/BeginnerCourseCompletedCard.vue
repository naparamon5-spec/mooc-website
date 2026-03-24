<template>
  <div v-if="isVisible && isBeginnerCourse" class="w-full rounded-xl overflow-hidden border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 md:p-8 mb-8">
    <div class="flex flex-col md:flex-row items-center gap-8">
      <!-- Content on the left -->
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl md:text-3xl font-bold mb-4" style="color: #001a4d;">
          Congratulations on successfully completing the
          <span class="text-blue-600 font-bold">Beginner Course</span>
          in Media and Information Literacy.
        </h2>

        <p class="text-gray-700 mb-4 leading-relaxed text-sm md:text-base">
          You have built a strong foundation in understanding media, evaluating information, and practicing responsible digital citizenship.
        </p>

        <p class="text-gray-700 mb-6 leading-relaxed text-sm md:text-base">
          Keep your momentum going by taking the <span class="font-semibold">Advanced Course</span>,
          where you can deepen your skills, explore more complex topics, and grow into a more critical and empowered media user and creator.
        </p>

        <!-- Button -->
        <button
          @click="handleProceedAdvanced"
          class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-base flex items-center gap-2"
        >
          Proceed to Advanced Course →
        </button>
      </div>

      <!-- Character on the right -->
      <div class="flex-shrink-0 w-32 h-32 md:w-48 md:h-48">
        <img
          src="~/assets/welcome.png"
          alt="Congratulations character"
          class="w-full h-full object-contain"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCourseProgress } from '~/composables/useCourseProgress'

const router = useRouter()
const route = useRoute()
const { isBeginnerCourseCompleted } = useCourseProgress()
const { $supabase } = useNuxtApp()

const emit = defineEmits<{
  dismissed: []
}>()

const shouldShow = ref(false)
const dismissed = ref(false)
const isBeginnerCourse = ref(false)

const isVisible = computed(() => shouldShow.value && !dismissed.value)

const updateCourseLevel = () => {
  const courseParam = route.query.course as string
  const savedCourse = sessionStorage.getItem('activeCourseTab')
  const currentCourse = courseParam || savedCourse || 'beginner'
  isBeginnerCourse.value = currentCourse === 'beginner'
}

onMounted(async () => {
  try {
    updateCourseLevel()

    const { data: { user } } = await $supabase.auth.getUser()
    if (!user) return

    // Check if beginner course is completed
    const isCompleted = isBeginnerCourseCompleted()
    
    // Check if user has viewed the congratulations card
    const { data: profile } = await $supabase
      .from('profiles')
      .select('beginner_completion_card_dismissed')
      .eq('id', user.id)
      .single()

    const isDismissed = profile?.beginner_completion_card_dismissed

    if (isCompleted && !isDismissed && isBeginnerCourse.value) {
      shouldShow.value = true
    }
  } catch (err) {
    console.error('Error checking beginner course completion:', err)
  }
})

const handleProceedAdvanced = () => {
  markCardAsDismissed()
  emit('dismissed')
  router.push('/dashboard?course=advanced')
}

const handleDismiss = () => {
  dismissed.value = true
  markCardAsDismissed()
}

const markCardAsDismissed = async () => {
  try {
    const { data: { user } } = await $supabase.auth.getUser()
    if (!user) return

    await $supabase
      .from('profiles')
      .update({ beginner_completion_card_dismissed: true })
      .eq('id', user.id)
  } catch (err) {
    console.error('Error marking card as dismissed:', err)
  }
}

// Watch for route changes to update course level when returning to beginner course
watch(() => route.query.course, () => {
  updateCourseLevel()
})

// Also watch sessionStorage for tab changes
watch(() => sessionStorage.getItem('activeCourseTab'), () => {
  updateCourseLevel()
})
</script>

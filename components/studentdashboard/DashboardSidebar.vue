<template>
  <aside class="bg-primary-100 rounded-lg p-6 space-y-4 h-fit sticky top-20">
    <div>
      <h2 class="text-lg font-bold text-primary-600 mb-1">
        Welcome, {{ studentName }}!
      </h2>
    </div>

    <!-- Course Navigation -->
    <nav class="bg-white rounded-lg shadow p-4">
      <h3 class="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">Courses</h3>
      <ul class="space-y-2">
        <li>
          <a
            href="#"
            @click.prevent="switchCourseLevel('beginner')"
            class="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
            :class="{
              'bg-primary-100 text-primary-700 font-semibold': activeCourse === 'beginner',
              'text-gray-700': activeCourse !== 'beginner'
            }"
          >
            <span class="mr-2 text-lg">📚</span>
            <span>Beginner Course</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            @click.prevent="switchCourseLevel('advanced')"
            class="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
            :class="{
              'bg-primary-100 text-primary-700 font-semibold': activeCourse === 'advanced',
              'text-gray-700': activeCourse !== 'advanced',
              'opacity-50 cursor-not-allowed': !isBeginnerCourseCompleted
            }"
            :disabled="!isBeginnerCourseCompleted"
          >
            <span class="mr-2 text-lg">🚀</span>
            <span>Advanced Course</span>
          </a>
        </li>
      </ul>
    </nav>

    <ProgressTracker
      :completed-modules="completedModules"
      :completed-lessons-in-current-module="completedLessonsInCurrentModule"
      :total-modules="totalModules"
      :lessons-per-module="4"
    />

    <BadgesDisplay :badges="badges" />

    <CourseCompletionStatus
      :status="completionStatus"
      :completed="completedModules"
      :total="totalModules"
    />
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import ProgressTracker from './ProgressTracker.vue'
import CourseCompletionStatus from './CourseCompletionStatus.vue'
import BadgesDisplay from './BadgesDisplay.vue'
import { useCourseProgress } from '~/composables/useCourseProgress'

const { isBeginnerCourseCompleted: isBeginnerComplete } = useCourseProgress()

const props = defineProps({
  studentName: {
    type: String,
    default: "Student's name"
  },
  progress: {
    type: Number,
    default: 60
  },
  currentModule: {
    type: String,
    default: 'Introduction to Media and Information Literacy'
  },
  badges: {
    type: Array,
    default: () => [
      { name: 'LITERACY SCHOLAR', earned: true },
      { name: 'MEDIA SYSTEMS ADEPT', earned: true },
      { name: 'MEDIA LINGUIST', earned: true },
      { name: 'EQUITY ADVOCATE', earned: true },
      { name: 'RESPONSIBLE CITIZEN', earned: true }
    ]
  },
  completionStatus: {
    type: String,
    default: 'In progress'
  },
  completedModules: {
    type: Number,
    default: 0
  },
  completedLessonsInCurrentModule: {
    type: Number,
    default: 0
  },
  totalModules: {
    type: Number,
    default: 5
  },
  activeCourse: {
    type: String,
    default: 'beginner'
  }
})

const emit = defineEmits(['switchCourse'])

const isBeginnerCourseCompleted = computed(() => {
  return isBeginnerComplete()
})

const switchCourseLevel = (levelId) => {
  emit('switchCourse', levelId)
}
</script>


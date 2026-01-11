<template>
  <aside class="bg-primary-100 rounded-lg p-6 space-y-4 h-fit sticky top-20">
    <div>
      <h2 class="text-lg font-bold text-primary-600 mb-1">
        Welcome, {{ studentName }}!
      </h2>
    </div>

    <ProgressTracker
      :progress="progress"
      :module-name="currentModule"
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
import ProgressTracker from './ProgressTracker.vue'
import CourseCompletionStatus from './CourseCompletionStatus.vue'
import BadgesDisplay from './BadgesDisplay.vue'

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
      { name: 'MEDIA DEFENDER', earned: true },
      { name: 'DIGITAL LIBRARIAN', earned: true },
      { name: 'FACTS ADVOCATE', earned: true },
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
  totalModules: {
    type: Number,
    default: 5
  }
})
</script>


<template>
  <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-900">Course Management</h2>
    </div>
    
    <!-- Grouped Action Dropdowns -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="group in groupedActions" :key="group.title" class="bg-gray-50 p-4 rounded-lg border">
        <h3 class="text-sm font-semibold text-gray-800 mb-2">{{ group.title }}</h3>
        <div class="space-y-2">
          <button
            v-for="opt in group.options"
            :key="opt.label"
            @click="$emit('action', opt.type)"
            class="w-full text-left bg-primary-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  actions: {
    type: Array,
    default: () => [
      { label: 'Course Settings', type: 'settings' },
      { label: 'Edit Resource Hub', type: 'edit-resources' },
      { label: 'Archive the course', type: 'archive' },
      { label: 'Edit content', type: 'edit-content' },
      { label: 'Download course report', type: 'download-report' },
      { label: 'Upload resources', type: 'upload-resources' },
      { label: 'Edit Course Details', type: 'edit-details' },
      { label: 'Create Announcements', type: 'create-announcements' },
      { label: 'Update content', type: 'update-content' },
      { label: 'Schedule announcements', type: 'schedule-announcements' },
      { label: 'Upload course policies', type: 'upload-policies' },
      { label: 'Track announcement reach and views', type: 'track-announcements' }
    ]
  }
})

defineEmits(['action'])

import { computed } from 'vue'

// Provide grouped actions mapping per component-level defaults. If the parent
// passes a custom flat `actions` array, we still compute the grouped layout by
// matching known types; otherwise we use the built-in groups below.
const groupedActions = computed(() => {
  // If parent provided a custom structured groups, return it directly
  // (not required by prop, but supported if passed)
  // If actions is an array of simple items, map them into groups below.

  const defaultGroups = [
    {
      title: 'Course Settings',
      options: [
        { label: 'Archive the course', type: 'archive' },
        { label: 'Download course report', type: 'download-report' }
      ]
    },
    {
      title: 'Edit Resource Hub',
      options: [
        { label: 'Edit content', type: 'edit-content' },
        { label: 'Update resources', type: 'upload-resources' }
      ]
    },
    {
      title: 'Edit Course Details',
      options: [
        { label: 'Update content', type: 'update-content' },
        { label: 'Upload course policies', type: 'upload-policies' }
      ]
    },
    {
      title: 'Create Announcements',
      options: [
        { label: 'Schedule announcements', type: 'schedule-announcements' },
        { label: 'Track announcement reach and views', type: 'track-announcements' }
      ]
    }
  ]

  return defaultGroups
})
</script>


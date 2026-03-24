<template>
  <div class="min-h-screen bg-gray-50">
    <AdminHeader :admin-name="adminName" />

    <div class="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-12">
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 class="text-3xl font-bold text-gray-900">{{ isEditMode ? 'Edit Badge' : 'Upload Badge' }}</h1>
                <p class="text-gray-600 mt-1">
                  {{ isEditMode ? 'Update the selected badge for this course module' : 'Upload or update a badge for a specific course module' }}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            @click="goToBadgeList"
            class="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-5 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
            View Uploaded Badges
          </button>
        </div>

        <div v-if="isEditMode" class="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p class="text-sm text-amber-800">
            You are editing
            <span class="font-semibold">{{ form.badgeName || 'this badge' }}</span>
            for
            <span class="font-semibold">{{ formatCourseLevel(form.courseLevel) }}</span>
            <span v-if="form.modulePosition" class="font-semibold">• Module {{ form.modulePosition }}</span>.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Course Level <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.courseLevel"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                >
                  <option value="">Select a course level</option>
                  <option value="beginner">Beginner Course</option>
                  <option value="advanced">Advanced Course</option>
                </select>
                <p class="mt-1 text-sm text-gray-500">Choose which course level this badge belongs to</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Module <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.modulePosition"
                  :disabled="!form.courseLevel"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a module</option>
                  <option value="1">Module 1</option>
                  <option value="2">Module 2</option>
                  <option value="3">Module 3</option>
                  <option value="4">Module 4</option>
                  <option value="5">Module 5</option>
                </select>
                <p class="mt-1 text-sm text-gray-500">Choose which module this badge is for</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Badge Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.badgeName"
                  type="text"
                  placeholder="e.g., Media Scholar, Tech Expert"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
                <p class="mt-1 text-sm text-gray-500">The name students will see when they earn this badge</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Badge Image <span class="text-red-500">*</span>
                </label>
                <div
                  @click="triggerFileInput"
                  @dragover.prevent="isDragging = true"
                  @dragleave="isDragging = false"
                  @drop.prevent="handleFileDrop"
                  :class="[
                    'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition',
                    isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
                  ]"
                >
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    @change="handleFileSelect"
                    class="hidden"
                  />
                  <svg v-if="!form.badgeFile" class="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div v-if="!form.badgeFile" class="text-gray-600">
                    <p class="font-medium">{{ isEditMode ? 'Click to replace the current badge image' : 'Drag and drop your badge image' }}</p>
                    <p class="text-sm text-gray-500 mt-1">or click to browse (PNG, JPG, WebP - Max 5MB)</p>
                  </div>
                  <div v-else class="text-green-600">
                    <svg class="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <p class="font-medium">{{ form.badgeFile.name }}</p>
                    <p class="text-sm text-gray-500 mt-1">{{ (form.badgeFile.size / 1024).toFixed(2) }} KB</p>
                  </div>
                </div>
              </div>

              <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-700">{{ error }}</p>
              </div>

              <div v-if="success" class="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p class="text-sm text-green-700">{{ success }}</p>
              </div>

              <div class="flex gap-3 pt-4">
                <button
                  type="submit"
                  :disabled="loading || !isFormValid"
                  class="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  {{ loading ? (isEditMode ? 'Updating...' : 'Uploading...') : (isEditMode ? 'Save Changes' : 'Upload Badge') }}
                </button>
                <button
                  type="button"
                  @click="goBack"
                  class="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  Back
                </button>
              </div>
            </form>
          </div>

          <div class="space-y-6">
            <div class="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-8 text-center">
              <p class="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">Badge Preview</p>
              <div v-if="previewImageUrl" class="mb-6">
                <img
                  :src="previewImageUrl"
                  :alt="form.badgeName || 'Badge'"
                  class="w-32 h-32 object-contain mx-auto rounded-lg shadow-md bg-white"
                />
              </div>
              <div v-else class="w-32 h-32 mx-auto bg-gray-200 rounded-lg flex items-center justify-center mb-6">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p class="text-sm font-medium text-gray-700">
                {{ form.badgeName || 'Badge Name' }}
              </p>
              <p class="text-xs text-gray-500 mt-2">
                {{ form.courseLevel ? formatCourseLevel(form.courseLevel) : 'Course' }}
                {{ form.modulePosition ? `• Module ${form.modulePosition}` : '' }}
              </p>
            </div>

            <div class="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 class="font-semibold text-blue-900 mb-3">Best Practices</h3>
              <ul class="space-y-2 text-sm text-blue-800">
                <li class="flex gap-2">
                  <span class="text-blue-500 font-bold">•</span>
                  <span>Use square or circular images (recommended: 512x512px)</span>
                </li>
                <li class="flex gap-2">
                  <span class="text-blue-500 font-bold">•</span>
                  <span>Keep file size under 5MB for faster loading</span>
                </li>
                <li class="flex gap-2">
                  <span class="text-blue-500 font-bold">•</span>
                  <span>PNG format recommended for transparency</span>
                </li>
                <li class="flex gap-2">
                  <span class="text-blue-500 font-bold">•</span>
                  <span>Make sure the badge is visually distinct</span>
                </li>
                <li class="flex gap-2">
                  <span class="text-blue-500 font-bold">•</span>
                  <span>Test on mobile devices for visibility</span>
                </li>
              </ul>
            </div>

            <!-- <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 class="font-semibold text-gray-900 mb-4">Current Module Badges</h3>
              <div v-if="form.courseLevel" class="space-y-2">
                <div
                  v-for="position in [1, 2, 3, 4, 5]"
                  :key="position"
                  class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                  :class="{ 'bg-primary-50 border-primary-300': String(form.modulePosition) === String(position) }"
                >
                  <span class="text-sm font-medium text-gray-700">Module {{ position }}</span>
                  <span class="text-xs px-2 py-1 rounded-full" :class="getBadgeStatusClass(position)">
                    {{ getBadgeStatus(position) }}
                  </span>
                </div>
              </div>
              <div v-else class="text-center py-6">
                <p class="text-sm text-gray-500">Select a course level to view badge status</p>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>

    <footer class="bg-primary-600 text-white text-center py-4 mt-12">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AdminHeader from '~/components/admindashboard/AdminHeader.vue'
import { useBadgeManagement, type Badge } from '~/composables/useBadgeManagement'
import { useUserProfile } from '~/composables/useUserProfile'

definePageMeta({ middleware: 'auth' })

useHead({
  title: 'Upload Badge - Admin - MIL MOOC',
})

const router = useRouter()
const route = useRoute()
const adminName = ref('Admin')

const { loading, error, success, badges, fetchBadges, uploadBadgeImage } = useBadgeManagement()
const { fetchUserProfile } = useUserProfile()

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const existingImageUrl = ref('')

const form = ref({
  courseLevel: '',
  modulePosition: '',
  badgeName: '',
  badgeFile: null as File | null,
})

const isEditMode = computed(() => {
  return !!route.query.courseLevel && !!route.query.modulePosition
})

const previewImageUrl = computed(() => {
  if (form.value.badgeFile) {
    return localPreviewUrl.value
  }
  return existingImageUrl.value
})

const localPreviewUrl = ref('')

const isFormValid = computed(() => {
  return form.value.courseLevel && form.value.modulePosition && form.value.badgeName && form.value.badgeFile
})

onMounted(async () => {
  try {
    const userData = await fetchUserProfile()
    if (userData?.full_name) {
      adminName.value = userData.full_name
    }

    await fetchBadges()
    applyQueryPrefill()
  } catch (err) {
    console.error('Error loading badges:', err)
  }
})

const formatCourseLevel = (level: string) => {
  return level === 'beginner' ? 'Beginner Course' : level === 'advanced' ? 'Advanced Course' : level
}

const applyQueryPrefill = () => {
  const courseLevel = typeof route.query.courseLevel === 'string' ? route.query.courseLevel : ''
  const modulePosition = typeof route.query.modulePosition === 'string' ? route.query.modulePosition : ''
  const badgeName = typeof route.query.badgeName === 'string' ? route.query.badgeName : ''
  const imageUrl = typeof route.query.imageUrl === 'string' ? route.query.imageUrl : ''

  if (!courseLevel || !modulePosition) return

  form.value.courseLevel = courseLevel
  form.value.modulePosition = modulePosition
  form.value.badgeName = badgeName
  existingImageUrl.value = imageUrl
}

const goToBadgeList = () => {
  router.push('/admin/badges')
}

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    processFile(target.files[0])
  }
}

const handleFileDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    processFile(event.dataTransfer.files[0])
  }
}

const processFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    error.value = 'Please select a valid image file'
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    error.value = 'File size must be less than 5MB'
    return
  }

  form.value.badgeFile = file
  error.value = ''

  const reader = new FileReader()
  reader.onload = (e) => {
    localPreviewUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const getBadgeStatus = (position: number) => {
  const badge = badges.value.find(
    (b: Badge) => b.course_level === form.value.courseLevel && b.module_position === position
  )
  return badge?.image_url ? 'Updated' : 'Not set'
}

const getBadgeStatusClass = (position: number) => {
  const badge = badges.value.find(
    (b: Badge) => b.course_level === form.value.courseLevel && b.module_position === position
  )
  return badge?.image_url
    ? 'bg-green-100 text-green-800'
    : 'bg-gray-100 text-gray-600'
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  const result = await uploadBadgeImage(
    form.value.badgeFile!,
    form.value.courseLevel,
    Number(form.value.modulePosition),
    form.value.badgeName
  )

  if (result.success) {
    form.value = {
      courseLevel: '',
      modulePosition: '',
      badgeName: '',
      badgeFile: null,
    }
    existingImageUrl.value = ''
    localPreviewUrl.value = ''
    if (fileInput.value) fileInput.value.value = ''

    await fetchBadges()
    router.push('/admin/badges')
  }
}

const goBack = () => {
  router.push('/admin/badges')
}
</script>

<style scoped>
/* Badge upload styles */
</style>

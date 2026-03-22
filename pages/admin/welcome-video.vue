<template>
  <div class="min-h-screen bg-gray-50">
    <AdminHeader :admin-name="adminName" />

    <div class="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <button
            @click="navigateTo('/admin')"
            class="mb-3 text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2 text-sm"
          >
            ← Back to Dashboard
          </button>
          <h1 class="text-3xl font-bold text-gray-900">Welcome Videos</h1>
          <p class="text-gray-600 mt-1">Manage welcome videos shown to students when they access each course</p>
        </div>
      </div>

      <!-- ─────────────────────────────────────────── -->
      <!-- BEGINNER WELCOME VIDEO -->
      <!-- ─────────────────────────────────────────── -->
      <div class="mb-4 flex items-center gap-3">
        <span class="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Beginner Course</span>
        <span class="text-gray-500 text-sm">Shown when students first open the Beginner Course</span>
      </div>

      <!-- Beginner Upload Card -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-4">
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-900 mb-2">Upload Beginner Welcome Video</label>
          <p class="text-sm text-gray-600 mb-4">Supported formats: MP4 only (Max 20MB)</p>
          <p v-if="fileError" class="text-sm text-red-600 mb-4">{{ fileError }}</p>

          <div
            @drop="handleDrop"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            class="relative border-2 border-dashed px-6 py-12 rounded-lg transition-colors"
            :class="isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-gray-50'"
          >
            <div class="text-center">
              <svg v-if="!selectedFile" class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v12a4 4 0 01-4 4H12a4 4 0 01-4-4V12a4 4 0 014-4h16l8 8z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <svg v-else class="mx-auto h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p v-if="!selectedFile" class="text-gray-600 font-medium mt-2">
                Drag your video here or
                <label class="text-primary-600 hover:text-primary-700 cursor-pointer font-semibold">
                  browse
                  <input
                    ref="fileInput"
                    type="file"
                    accept=".mp4,video/mp4"
                    @change="handleFileSelect"
                    class="hidden"
                  />
                </label>
              </p>
              <p v-else class="text-green-600 font-medium mt-2">{{ selectedFile.name }}</p>
              <p v-if="!selectedFile" class="text-xs text-gray-500 mt-1">or paste from clipboard</p>
            </div>
          </div>

          <button
            v-if="selectedFile"
            @click="() => { selectedFile = null; fileError = ''; if (fileInput) fileInput.value = ''; }"
            class="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Choose different file
          </button>
        </div>

        <div v-if="isUploading" class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Uploading...</span>
            <span class="text-sm text-gray-600">{{ uploadProgress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-primary-600 h-2 rounded-full transition-all" :style="{ width: uploadProgress + '%' }"></div>
          </div>
        </div>

        <button
          v-if="selectedFile && !isUploading"
          @click="uploadVideo"
          class="w-full bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isUploading"
        >
          Upload Beginner Welcome Video
        </button>
      </div>

      <!-- Beginner Current Video -->
      <div v-if="currentVideoUrl" class="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-12">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Current Beginner Welcome Video</h2>
        <div class="mb-4 bg-black rounded-lg overflow-hidden" style="aspect-ratio: 16 / 9;">
          <video :src="currentVideoUrl" controls class="w-full h-full"></video>
        </div>
        <p class="text-sm text-gray-600 mb-4">Uploaded: {{ formatDate(currentVideoDate) }}</p>
        <button
          @click="deleteVideo"
          class="text-red-600 hover:text-red-700 font-semibold text-sm"
          :disabled="isDeleting"
        >
          {{ isDeleting ? 'Deleting...' : 'Delete Current Beginner Video' }}
        </button>
      </div>

      <div v-else class="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center mb-12">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p class="text-gray-600 font-medium">No beginner welcome video uploaded yet</p>
        <p class="text-sm text-gray-500">Upload a video above to replace the welcome card</p>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-200 mb-10"></div>

      <!-- ─────────────────────────────────────────── -->
      <!-- ADVANCED WELCOME VIDEO -->
      <!-- ─────────────────────────────────────────── -->
      <div class="mb-4 flex items-center gap-3">
        <span class="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Advanced Course</span>
        <span class="text-gray-500 text-sm">Shown when students first unlock the Advanced Course</span>
      </div>

      <!-- Advanced Upload Card -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-4">
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-900 mb-2">Upload Advanced Welcome Video</label>
          <p class="text-sm text-gray-600 mb-4">Supported formats: MP4 only (Max 20MB)</p>
          <p v-if="advancedFileError" class="text-sm text-red-600 mb-4">{{ advancedFileError }}</p>

          <div
            @drop="handleAdvancedDrop"
            @dragover.prevent="isDraggingAdvanced = true"
            @dragleave="isDraggingAdvanced = false"
            class="relative border-2 border-dashed px-6 py-12 rounded-lg transition-colors"
            :class="isDraggingAdvanced ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-gray-50'"
          >
            <div class="text-center">
              <svg v-if="!selectedAdvancedFile" class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v12a4 4 0 01-4 4H12a4 4 0 01-4-4V12a4 4 0 014-4h16l8 8z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <svg v-else class="mx-auto h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p v-if="!selectedAdvancedFile" class="text-gray-600 font-medium mt-2">
                Drag your video here or
                <label class="text-primary-600 hover:text-primary-700 cursor-pointer font-semibold">
                  browse
                  <input
                    ref="advancedFileInput"
                    type="file"
                    accept=".mp4,video/mp4"
                    @change="handleAdvancedFileSelect"
                    class="hidden"
                  />
                </label>
              </p>
              <p v-else class="text-green-600 font-medium mt-2">{{ selectedAdvancedFile.name }}</p>
              <p v-if="!selectedAdvancedFile" class="text-xs text-gray-500 mt-1">or paste from clipboard</p>
            </div>
          </div>

          <button
            v-if="selectedAdvancedFile"
            @click="() => { selectedAdvancedFile = null; advancedFileError = ''; if (advancedFileInput) advancedFileInput.value = ''; }"
            class="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Choose different file
          </button>
        </div>

        <div v-if="isUploadingAdvanced" class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Uploading...</span>
            <span class="text-sm text-gray-600">{{ uploadAdvancedProgress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-primary-600 h-2 rounded-full transition-all" :style="{ width: uploadAdvancedProgress + '%' }"></div>
          </div>
        </div>

        <button
          v-if="selectedAdvancedFile && !isUploadingAdvanced"
          @click="uploadAdvancedVideo"
          class="w-full bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isUploadingAdvanced"
        >
          Upload Advanced Welcome Video
        </button>
      </div>

      <!-- Advanced Current Video -->
      <div v-if="currentAdvancedVideoUrl" class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Current Advanced Welcome Video</h2>
        <div class="mb-4 bg-black rounded-lg overflow-hidden" style="aspect-ratio: 16 / 9;">
          <video :src="currentAdvancedVideoUrl" controls class="w-full h-full"></video>
        </div>
        <p class="text-sm text-gray-600 mb-4">Uploaded: {{ formatDate(currentAdvancedVideoDate) }}</p>
        <button
          @click="deleteAdvancedVideo"
          class="text-red-600 hover:text-red-700 font-semibold text-sm"
          :disabled="isDeletingAdvanced"
        >
          {{ isDeletingAdvanced ? 'Deleting...' : 'Delete Current Advanced Video' }}
        </button>
      </div>

      <div v-else class="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p class="text-gray-600 font-medium">No advanced welcome video uploaded yet</p>
        <p class="text-sm text-gray-500">Upload a video above to show students when they unlock the Advanced Course</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminHeader from '~/components/admindashboard/AdminHeader.vue'
import { useUserProfile } from '~/composables/useUserProfile'

definePageMeta({ middleware: 'auth' })

useHead({
  title: 'Welcome Videos - MIL MOOC Admin',
})

const { $supabase } = useNuxtApp()
const { fetchUserProfile } = useUserProfile()
const adminName = ref('Admin User')

const MAX_FILE_SIZE = 20 * 1024 * 1024

// ── Beginner ──────────────────────────────────────
const BEGINNER_VIDEO_ID = '00000000-0000-0000-0000-000000000001'
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const isDragging = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const currentVideoUrl = ref('')
const currentVideoDate = ref('')
const isDeleting = ref(false)
const fileError = ref('')

// ── Advanced ──────────────────────────────────────
const ADVANCED_VIDEO_ID = '00000000-0000-0000-0000-000000000002'
const advancedFileInput = ref<HTMLInputElement | null>(null)
const selectedAdvancedFile = ref<File | null>(null)
const isDraggingAdvanced = ref(false)
const isUploadingAdvanced = ref(false)
const uploadAdvancedProgress = ref(0)
const currentAdvancedVideoUrl = ref('')
const currentAdvancedVideoDate = ref('')
const isDeletingAdvanced = ref(false)
const advancedFileError = ref('')

onMounted(async () => {
  const userData = await fetchUserProfile()
  if (userData?.full_name) adminName.value = userData.full_name
  await loadCurrentVideo()
  await loadAdvancedVideo()
})

// ── Beginner helpers ───────────────────────────────
const validateFile = (file: File, errorRef: { value: string }): boolean => {
  if (file.type !== 'video/mp4' && !file.name.toLowerCase().endsWith('.mp4')) {
    errorRef.value = 'Only MP4 format is allowed'
    return false
  }
  if (file.size > MAX_FILE_SIZE) {
    errorRef.value = `File size must be less than 20MB (Current: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`
    return false
  }
  return true
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  fileError.value = ''
  if (input.files?.[0]) {
    if (validateFile(input.files[0], fileError)) selectedFile.value = input.files[0]
    else selectedFile.value = null
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  fileError.value = ''
  if (event.dataTransfer?.files?.[0]) {
    if (validateFile(event.dataTransfer.files[0], fileError)) selectedFile.value = event.dataTransfer.files[0]
    else selectedFile.value = null
  }
}

const loadCurrentVideo = async () => {
  try {
    const { data } = await $supabase
      .from('welcome_video_metadata')
      .select('video_url, updated_at')
      .eq('id', BEGINNER_VIDEO_ID)
      .maybeSingle()
    if (data) {
      currentVideoUrl.value = data.video_url
      currentVideoDate.value = data.updated_at
    }
  } catch (err) {
    console.warn('Error loading beginner video:', err)
  }
}

const uploadVideo = async () => {
  if (!selectedFile.value) return
  if (!validateFile(selectedFile.value, fileError)) return

  const fileName = `welcome-video-${Date.now()}.mp4`
  isUploading.value = true
  uploadProgress.value = 0

  try {
    const { error } = await $supabase.storage
      .from('welcome-videos')
      .upload(fileName, selectedFile.value, { cacheControl: '3600', upsert: false })
    if (error) throw error

    const { data: publicData } = $supabase.storage.from('welcome-videos').getPublicUrl(fileName)

    await $supabase.from('welcome_video_metadata').upsert(
      {
        id: BEGINNER_VIDEO_ID,
        video_url: publicData.publicUrl,
        file_name: fileName,
        uploaded_by: (await $supabase.auth.getUser()).data.user?.id,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'id' }
    )

    currentVideoUrl.value = publicData.publicUrl
    currentVideoDate.value = new Date().toISOString()
    selectedFile.value = null
    fileError.value = ''
    if (fileInput.value) fileInput.value.value = ''
    alert('Beginner welcome video uploaded successfully!')
  } catch (err) {
    console.error('Error uploading beginner video:', err)
    fileError.value = 'Failed to upload video. Please try again.'
    alert('Failed to upload video. Please try again.')
  } finally {
    isUploading.value = false
  }
}

const deleteVideo = async () => {
  if (!confirm('Are you sure you want to delete the current beginner welcome video?')) return
  isDeleting.value = true
  try {
    const fileName = currentVideoUrl.value.split('/').pop()
    if (fileName) await $supabase.storage.from('welcome-videos').remove([fileName])
    await $supabase.from('welcome_video_metadata').delete().eq('id', BEGINNER_VIDEO_ID)
    currentVideoUrl.value = ''
    currentVideoDate.value = ''
  } catch (err) {
    console.error('Error deleting beginner video:', err)
    alert('Failed to delete video. Please try again.')
  } finally {
    isDeleting.value = false
  }
}

// ── Advanced helpers ───────────────────────────────
const handleAdvancedFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  advancedFileError.value = ''
  if (input.files?.[0]) {
    if (validateFile(input.files[0], advancedFileError)) selectedAdvancedFile.value = input.files[0]
    else selectedAdvancedFile.value = null
  }
}

const handleAdvancedDrop = (event: DragEvent) => {
  event.preventDefault()
  isDraggingAdvanced.value = false
  advancedFileError.value = ''
  if (event.dataTransfer?.files?.[0]) {
    if (validateFile(event.dataTransfer.files[0], advancedFileError)) selectedAdvancedFile.value = event.dataTransfer.files[0]
    else selectedAdvancedFile.value = null
  }
}

const loadAdvancedVideo = async () => {
  try {
    const { data } = await $supabase
      .from('welcome_video_metadata')
      .select('video_url, updated_at')
      .eq('id', ADVANCED_VIDEO_ID)
      .maybeSingle()
    if (data) {
      currentAdvancedVideoUrl.value = data.video_url
      currentAdvancedVideoDate.value = data.updated_at
    }
  } catch (err) {
    console.warn('Error loading advanced video:', err)
  }
}

const uploadAdvancedVideo = async () => {
  if (!selectedAdvancedFile.value) return
  if (!validateFile(selectedAdvancedFile.value, advancedFileError)) return

  const fileName = `advanced-welcome-video-${Date.now()}.mp4`
  isUploadingAdvanced.value = true
  uploadAdvancedProgress.value = 0

  try {
    const { error } = await $supabase.storage
      .from('advanced-welcome-videos')
      .upload(fileName, selectedAdvancedFile.value, { cacheControl: '3600', upsert: false })
    if (error) throw error

    const { data: publicData } = $supabase.storage.from('advanced-welcome-videos').getPublicUrl(fileName)

    await $supabase.from('welcome_video_metadata').upsert(
      {
        id: ADVANCED_VIDEO_ID,
        video_url: publicData.publicUrl,
        file_name: fileName,
        uploaded_by: (await $supabase.auth.getUser()).data.user?.id,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'id' }
    )

    currentAdvancedVideoUrl.value = publicData.publicUrl
    currentAdvancedVideoDate.value = new Date().toISOString()
    selectedAdvancedFile.value = null
    advancedFileError.value = ''
    if (advancedFileInput.value) advancedFileInput.value.value = ''
    alert('Advanced welcome video uploaded successfully!')
  } catch (err) {
    console.error('Error uploading advanced video:', err)
    advancedFileError.value = 'Failed to upload video. Please try again.'
    alert('Failed to upload advanced video. Please try again.')
  } finally {
    isUploadingAdvanced.value = false
  }
}

const deleteAdvancedVideo = async () => {
  if (!confirm('Are you sure you want to delete the current advanced welcome video?')) return
  isDeletingAdvanced.value = true
  try {
    const fileName = currentAdvancedVideoUrl.value.split('/').pop()
    if (fileName) await $supabase.storage.from('advanced-welcome-videos').remove([fileName])
    await $supabase.from('welcome_video_metadata').delete().eq('id', ADVANCED_VIDEO_ID)
    currentAdvancedVideoUrl.value = ''
    currentAdvancedVideoDate.value = ''
  } catch (err) {
    console.error('Error deleting advanced video:', err)
    alert('Failed to delete video. Please try again.')
  } finally {
    isDeletingAdvanced.value = false
  }
}

// ── Shared ─────────────────────────────────────────
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
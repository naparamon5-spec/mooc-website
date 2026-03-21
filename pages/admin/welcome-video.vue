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
          <h1 class="text-3xl font-bold text-gray-900">Welcome Video</h1>
          <p class="text-gray-600 mt-1">Upload a welcome video to replace the welcome card shown to students</p>
        </div>
      </div>

      <!-- Upload Card -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-900 mb-2">Upload Welcome Video</label>
          <p class="text-sm text-gray-600 mb-4">Supported formats: MP4 only (Max 20MB)</p>
          <p v-if="fileError" class="text-sm text-red-600 mb-4">{{ fileError }}</p>

          <!-- Drag and Drop Area -->
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
              <p v-else class="text-green-600 font-medium mt-2">
                {{ selectedFile.name }}
              </p>
              <p v-if="!selectedFile" class="text-xs text-gray-500 mt-1">or paste from clipboard</p>
            </div>
          </div>

          <!-- Clear Selection -->
          <button
            v-if="selectedFile"
            @click="() => { selectedFile = null; fileError = ''; }"
            class="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Choose different file
          </button>
        </div>

        <!-- Upload Progress -->
        <div v-if="isUploading" class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Uploading...</span>
            <span class="text-sm text-gray-600">{{ uploadProgress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-primary-600 h-2 rounded-full transition-all"
              :style="{ width: uploadProgress + '%' }"
            ></div>
          </div>
        </div>

        <!-- Upload Button -->
        <button
          v-if="selectedFile && !isUploading"
          @click="uploadVideo"
          class="w-full bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isUploading"
        >
          Upload Video
        </button>
      </div>

      <!-- Current Welcome Video -->
      <div v-if="currentVideoUrl" class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Current Welcome Video</h2>
        <div class="mb-4 bg-black rounded-lg overflow-hidden" style="aspect-ratio: 16 / 9;">
          <video
            :src="currentVideoUrl"
            controls
            class="w-full h-full"
          ></video>
        </div>
        <p class="text-sm text-gray-600 mb-4">Uploaded: {{ formatDate(currentVideoDate) }}</p>
        <button
          @click="deleteVideo"
          class="text-red-600 hover:text-red-700 font-semibold text-sm"
          :disabled="isDeleting"
        >
          {{ isDeleting ? 'Deleting...' : 'Delete Current Video' }}
        </button>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p class="text-gray-600 font-medium">No welcome video uploaded yet</p>
        <p class="text-sm text-gray-500">Upload a video above to replace the welcome card</p>
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
  title: 'Update Welcome Card - MIL MOOC Admin',
})

const { $supabase } = useNuxtApp()
const { fetchUserProfile } = useUserProfile()
const fileInput = ref<HTMLInputElement | null>(null)
const adminName = ref('Admin User')

const selectedFile = ref<File | null>(null)
const isDragging = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const currentVideoUrl = ref<string>('')
const currentVideoDate = ref<string>('')
const isDeleting = ref(false)
const fileError = ref<string>('')

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 MB in bytes

// Load current welcome video on mount
onMounted(async () => {
  const userData = await fetchUserProfile()
  if (userData?.full_name) {
    adminName.value = userData.full_name
  }
  await loadCurrentVideo()
})

// Handle file selection
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  fileError.value = ''
  
  if (input.files && input.files[0]) {
    const file = input.files[0]
    
    // Check file type
    if (file.type !== 'video/mp4' && !file.name.toLowerCase().endsWith('.mp4')) {
      fileError.value = 'Only MP4 format is allowed'
      selectedFile.value = null
      return
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      fileError.value = `File size must be less than 20MB (Current: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`
      selectedFile.value = null
      return
    }
    
    selectedFile.value = file
  }
}

// Handle drag and drop
const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  fileError.value = ''
  
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    const file = event.dataTransfer.files[0]
    
    // Check file type
    if (file.type !== 'video/mp4' && !file.name.toLowerCase().endsWith('.mp4')) {
      fileError.value = 'Only MP4 format is allowed'
      selectedFile.value = null
      return
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      fileError.value = `File size must be less than 20MB (Current: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`
      selectedFile.value = null
      return
    }
    
    selectedFile.value = file
  }
}

// Upload video to Supabase
const uploadVideo = async () => {
  if (!selectedFile.value) return

  const file = selectedFile.value
  
  // Final validation check
  if (file.type !== 'video/mp4' && !file.name.toLowerCase().endsWith('.mp4')) {
    fileError.value = 'Only MP4 format is allowed'
    return
  }
  
  if (file.size > MAX_FILE_SIZE) {
    fileError.value = `File size must be less than 20MB (Current: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`
    return
  }

  const fileName = `welcome-video-${Date.now()}.mp4`

  isUploading.value = true
  uploadProgress.value = 0

  try {
    // Delete previous video if exists
    if (currentVideoUrl.value) {
      const previousFileName = `welcome-video-${Date.now()}.${currentVideoUrl.value.split('.').pop()}`
      try {
        await $supabase.storage.from('welcome-videos').remove([previousFileName])
      } catch (err) {
        console.warn('Could not delete previous video:', err)
      }
    }

    // Upload new video
    const { data, error } = await $supabase.storage
      .from('welcome-videos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data: publicData } = $supabase.storage
      .from('welcome-videos')
      .getPublicUrl(fileName)

    const videoUrl = publicData.publicUrl

    // Save metadata to database
    await $supabase.from('welcome_video_metadata').upsert(
      {
        id: '00000000-0000-0000-0000-000000000001', // Single row ID
        video_url: videoUrl,
        file_name: fileName,
        uploaded_by: (await $supabase.auth.getUser()).data.user?.id,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'id' }
    )

    // Update state
    currentVideoUrl.value = videoUrl
    currentVideoDate.value = new Date().toISOString()
    selectedFile.value = null
    fileError.value = ''
    uploadProgress.value = 0
    
    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = ''
    }

    // Show success message
    console.log('Video uploaded successfully')
    alert('Video uploaded successfully!')
  } catch (err) {
    console.error('Error uploading video:', err)
    fileError.value = 'Failed to upload video. Please try again.'
    alert('Failed to upload video. Please try again.')
  } finally {
    isUploading.value = false
  }
}

// Load current welcome video
const loadCurrentVideo = async () => {
  try {
    const { data, error } = await $supabase
      .from('welcome_video_metadata')
      .select('video_url, updated_at')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.warn('Could not load video metadata:', error)
      return
    }

    if (data) {
      currentVideoUrl.value = data.video_url
      currentVideoDate.value = data.updated_at
    }
  } catch (err) {
    console.warn('Error loading current video:', err)
  }
}

// Delete current video
const deleteVideo = async () => {
  if (!confirm('Are you sure you want to delete the current welcome video?')) {
    return
  }

  isDeleting.value = true
  try {
    // Delete from storage
    const fileName = currentVideoUrl.value.split('/').pop()
    if (fileName) {
      await $supabase.storage.from('welcome-videos').remove([fileName])
    }

    // Delete metadata
    await $supabase
      .from('welcome_video_metadata')
      .delete()
      .eq('id', '00000000-0000-0000-0000-000000000001')

    currentVideoUrl.value = ''
    currentVideoDate.value = ''
  } catch (err) {
    console.error('Error deleting video:', err)
    alert('Failed to delete video. Please try again.')
  } finally {
    isDeleting.value = false
  }
}

// Format date
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

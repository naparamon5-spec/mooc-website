<template>
  <div class="welcome-video-container">
    <video
      v-if="videoUrl"
      :src="videoUrl"
      controls
      autoplay
      class="welcome-video"
    ></video>
    <div v-else class="welcome-video-placeholder">
      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      <p class="text-sm text-gray-600">No video available</p>
    </div>
    <button
      class="welcome-video-btn"
      :disabled="isSaving"
      @click="onClickHere"
    >
      {{ isSaving ? '…' : 'Continue' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCourseAgreement } from '~/composables/useCourseAgreement'

const emit = defineEmits<{
  openAgreement: []
}>()

const { markWelcomeClicked } = useCourseAgreement()
const { $supabase } = useNuxtApp()
const isSaving = ref(false)
const videoUrl = ref<string>('')

// Load welcome video on mount
onMounted(async () => {
  try {
    const { data, error } = await $supabase
      .from('welcome_video_metadata')
      .select('video_url')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .single()

    // Suppress 406 and PGRST116 errors (not found or not acceptable) - just means no video uploaded yet
    if (error) {
      if (error.code === 'PGRST116') {
        console.info('No welcome video found')
        return
      }
      // Silently ignore 406 errors (common when table is empty)
      console.info('Welcome video not ready')
      return
    }

    if (data?.video_url) {
      videoUrl.value = data.video_url
    }
  } catch (err) {
    console.info('Welcome video check skipped')
  }
})

const onClickHere = async () => {
  const { data: { user } } = await $supabase.auth.getUser()
  if (!user?.id) return
  isSaving.value = true
  try {
    await markWelcomeClicked(user.id)
  } catch (e) {
    console.warn('Could not save welcome clicked (run add_welcome_clicked_at.sql?):', e)
  } finally {
    isSaving.value = false
    emit('openAgreement')
  }
}
</script>

<style scoped>
.welcome-video-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #dce8f8;
  border: 1px solid #b8d0ef;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 12px;
  width: 100%;
  box-sizing: border-box;
}

.welcome-video {
  width: 100%;
  height: auto;
  max-height: 300px;
  border-radius: 8px;
  background: black;
  object-fit: contain;
}

.welcome-video-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #1f2937;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
}

.welcome-video-btn {
  background: linear-gradient(135deg, #001a4d 0%, #003d99 100%);
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 26, 77, 0.2);
  align-self: flex-start;
}

.welcome-video-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 26, 77, 0.25);
}

.welcome-video-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .welcome-video-container {
    padding: 14px;
    gap: 12px;
  }

  .welcome-video {
    max-height: 220px;
  }
}
</style>

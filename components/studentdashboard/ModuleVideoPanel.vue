<template>
  <div class="module-video-container">
    <video
      v-if="module && module.video_url"
      :src="module.video_url"
      controls
      class="module-video"
    ></video>
    <div v-else class="module-video-placeholder">
      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      <p class="text-sm text-gray-600">No video available</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  module: {
    type: Object,
    default: null
  },
  showTitle: {
    type: Boolean,
    default: true
  }
});
</script>

<style scoped>
.module-video-container {
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

.module-video {
  width: 100%;
  height: auto;
  max-height: 320px;
  border-radius: 8px;
  background: black;
  object-fit: contain;
}

.module-video-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #1f2937;
  width: 100%;
  max-height: 320px;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
}

@media (max-width: 640px) {
  .module-video-container {
    padding: 14px;
    gap: 12px;
  }

  .module-video {
    max-height: 220px;
  }
}
</style>

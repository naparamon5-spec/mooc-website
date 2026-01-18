<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg max-w-2xl w-full shadow-2xl animate-fade-in">
      <!-- Certificate -->
      <div class="bg-gradient-to-br from-primary-50 to-primary-100 p-12 relative border-8 border-primary-600">
        <!-- Decorative corners -->
        <div class="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary-600"></div>
        <div class="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary-600"></div>
        <div class="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary-600"></div>
        <div class="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary-600"></div>

        <div class="text-center">
          <!-- Badge Icon -->
          <div class="flex justify-center mb-6">
            <div class="w-24 h-24 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>

          <!-- Certificate Title -->
          <h1 class="text-4xl font-bold text-primary-600 mb-2">Certificate of Completion</h1>
          <p class="text-gray-600 text-lg mb-8">Media and Information Literacy Beginner Course</p>

          <!-- Decorative Line -->
          <div class="w-48 h-1 bg-gradient-to-r from-transparent via-primary-600 to-transparent mx-auto mb-8"></div>

          <!-- Certificate Text -->
          <div class="mb-8">
            <p class="text-gray-700 text-lg mb-4">This certifies that</p>
            <p class="text-3xl font-bold text-primary-600 mb-4">{{ studentName }}</p>
            <p class="text-gray-700 text-lg mb-4">has successfully completed all modules of the</p>
            <p class="text-2xl font-semibold text-gray-800 mb-6">Media and Information Literacy (MIL) Beginner Course</p>
          </div>

          <!-- Decorative Line -->
          <div class="w-48 h-1 bg-gradient-to-r from-transparent via-primary-600 to-transparent mx-auto mb-8"></div>

          <!-- Date -->
          <p class="text-gray-600 mb-8">
            Completed on: <span class="font-semibold text-gray-800">{{ completionDate }}</span>
          </p>

          <!-- Signature -->
          <div class="flex justify-around mb-4 px-8">
            <div class="text-center">
              <div class="h-12 mb-2"></div>
              <p class="text-gray-700 font-semibold">MIL MOOC</p>
              <p class="text-sm text-gray-600">Platform</p>
            </div>
          </div>

          <!-- Certificate ID -->
          <p class="text-xs text-gray-500 mt-4">Certificate ID: {{ certificateId }}</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="bg-gray-50 px-8 py-6 flex flex-col sm:flex-row gap-4">
        <button
          @click="downloadCertificate"
          class="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Certificate
        </button>
        <button
          @click="handleNextModule"
          class="flex-1 bg-blue-100 text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
        >
          Continue to Advanced Course
        </button>
        <button
          @click="handleBackToDashboard"
          class="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  isOpen: boolean;
  studentName: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  nextCourse: [];
  backToDashboard: [];
}>();

const completionDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const certificateId = computed(() => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `MIL-${timestamp}-${random}`
})

const downloadCertificate = () => {
  // Create a canvas element to generate the certificate as an image
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 800
  const ctx = canvas.getContext('2d')!

  // Background gradient simulation
  const gradient = ctx.createLinearGradient(0, 0, 1200, 800)
  gradient.addColorStop(0, '#f0f9ff')
  gradient.addColorStop(1, '#e0f2fe')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1200, 800)

  // Border
  ctx.strokeStyle = '#0c3a66'
  ctx.lineWidth = 12
  ctx.strokeRect(20, 20, 1160, 760)

  // Decorative corners
  ctx.fillStyle = '#0c3a66'
  const cornerSize = 30
  // Top-left
  ctx.fillRect(20, 20, cornerSize, 2)
  ctx.fillRect(20, 20, 2, cornerSize)
  // Top-right
  ctx.fillRect(1180 - cornerSize, 20, cornerSize, 2)
  ctx.fillRect(1180, 20, 2, cornerSize)
  // Bottom-left
  ctx.fillRect(20, 780, cornerSize, 2)
  ctx.fillRect(20, 780 - cornerSize, 2, cornerSize)
  // Bottom-right
  ctx.fillRect(1180 - cornerSize, 780, cornerSize, 2)
  ctx.fillRect(1180, 780 - cornerSize, 2, cornerSize)

  // Title
  ctx.font = 'bold 48px Arial'
  ctx.fillStyle = '#083358'
  ctx.textAlign = 'center'
  ctx.fillText('Certificate of Completion', 600, 120)

  // Subtitle
  ctx.font = '24px Arial'
  ctx.fillStyle = '#4b6b84'
  ctx.fillText('Media and Information Literacy Beginner Course', 600, 170)

  // Decorative line
  ctx.strokeStyle = '#083358'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(300, 220)
  ctx.lineTo(900, 220)
  ctx.stroke()

  // Certificate text
  ctx.font = '20px Arial'
  ctx.fillStyle = '#374151'
  ctx.fillText('This certifies that', 600, 300)

  ctx.font = 'bold 36px Arial'
  ctx.fillStyle = '#083358'
  ctx.fillText(props.studentName, 600, 370)

  ctx.font = '20px Arial'
  ctx.fillStyle = '#374151'
  ctx.fillText('has successfully completed all modules of the', 600, 430)

  ctx.font = 'bold 28px Arial'
  ctx.fillStyle = '#1f2937'
  ctx.fillText('Media and Information Literacy (MIL) Beginner Course', 600, 490)

  // Decorative line
  ctx.strokeStyle = '#083358'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(300, 540)
  ctx.lineTo(900, 540)
  ctx.stroke()

  // Date
  ctx.font = '18px Arial'
  ctx.fillStyle = '#6b7280'
  ctx.fillText(`Completed on: ${completionDate.value}`, 600, 610)

  // Certificate ID
  ctx.font = '12px Arial'
  ctx.fillStyle = '#9ca3af'
  ctx.fillText(`Certificate ID: ${certificateId.value}`, 600, 750)

  // Download
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = `MIL-Certificate-${props.studentName.replace(/\s+/g, '-')}.png`
  link.click()
}

const handleNextModule = () => {
  emit('nextCourse')
}

const handleBackToDashboard = () => {
  emit('backToDashboard')
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-in-out;
}
</style>

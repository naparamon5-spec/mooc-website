<template>
  <!-- Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="emit('close')"
  >
    <!-- Page-level Close Button -->
    <button
      @click="emit('close')"
      class="fixed top-6 right-6 z-[60] bg-white text-primary-700 hover:text-primary-900 rounded-full p-3 shadow-xl hover:scale-105 transition"
      aria-label="Close"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    <!-- Modal -->
    <div
      class="bg-white rounded-lg w-96 shadow-2xl animate-fade-in overflow-hidden flex flex-col max-h-[90vh]"
    >
      <!-- Certificate -->
      <div
        class="bg-gradient-to-br from-primary-50 to-primary-100 p-6 relative border-4 border-primary-600 overflow-y-auto"
      >
        <!-- Decorative corners -->
        <div class="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary-600"></div>
        <div class="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary-600"></div>
        <div class="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary-600"></div>
        <div class="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary-600"></div>

        <div class="text-center">
          <!-- Badge Icon -->
          <div class="flex justify-center mb-3">
            <img src="/assets/logo.png" alt="MIL MOOC" class="h-16 w-20 border-primary-600" />
          </div>

          <!-- Title -->
          <h1 class="text-2xl font-bold text-primary-600 mb-1">
            Certificate of Completion
          </h1>
          <p class="text-gray-600 text-sm mb-4">
            Media and Information Literacy Beginner Course
          </p>

          <!-- Divider -->
          <div
            class="w-32 h-0.5 bg-gradient-to-r from-transparent via-primary-600 to-transparent mx-auto mb-4"
          ></div>

          <!-- Certificate Text -->
          <div class="mb-4">
            <p class="text-gray-700 text-xs mb-2">This certifies that</p>
            <p class="text-lg font-bold text-primary-600 mb-2">
              {{ studentName }}
            </p>
            <p class="text-gray-700 text-xs mb-2">
              has successfully completed all modules of the
            </p>
            <p class="text-sm font-semibold text-gray-800">
              Media and Information Literacy (MIL) Beginner Course
            </p>
          </div>

          <!-- Divider -->
          <div
            class="w-32 h-0.5 bg-gradient-to-r from-transparent via-primary-600 to-transparent mx-auto mb-4"
          ></div>

          <!-- Date -->
          <p class="text-gray-600 mb-4 text-xs">
            Completed on:
            <span class="font-semibold text-gray-800">
              {{ completionDate }}
            </span>
          </p>

          <!-- Signature -->
          <div class="flex justify-around mb-2 px-4">
            <div class="text-center">
              <div class="h-6 mb-1"></div>
              <p class="text-gray-700 font-semibold text-xs">MIL MOOC</p>
              <p class="text-xs text-gray-600">Platform</p>
            </div>
          </div>

          <!-- Certificate ID -->
          <p class="text-xs text-gray-500 mt-2">
            Certificate ID: {{ certificateId }}
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="bg-gray-50 px-4 py-4 flex flex-col gap-2">
        <button
          @click="downloadCertificate"
          class="w-full bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2 text-sm"
        >
          Download Certificate
        </button>

        <button
          @click="handleNextModule"
          class="w-full bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition text-sm"
        >
          Continue to Advanced Course
        </button>

        <button
          @click="handleBackToDashboard"
          class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition text-sm"
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
  isOpen: boolean
  studentName: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  nextCourse: []
  backToDashboard: []
}>()

const completionDate = computed(() =>
  new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
)

const certificateId = computed(() => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `MIL-${timestamp}-${random}`
})

const downloadCertificate = async () => {
  const { jsPDF } = await import('jspdf')
  const html2canvas = (await import('html2canvas')).default

  // Create a temporary div with certificate content
  const tempDiv = document.createElement('div')
  tempDiv.style.width = '8.5in'
  tempDiv.style.height = '11in'
  tempDiv.style.position = 'absolute'
  tempDiv.style.left = '-9999px'
  tempDiv.style.top = '0'
  tempDiv.style.backgroundColor = '#f0f9ff'
  tempDiv.style.padding = '40px'
  tempDiv.style.fontFamily = 'Arial, sans-serif'
  tempDiv.style.boxSizing = 'border-box'
  tempDiv.style.border = '8px solid #0c3a66'

  tempDiv.innerHTML = `
    <div style="text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center;">
      <div style="margin-bottom: 30px;">
        <img src="/assets/logo.png" alt="MIL MOOC" style="width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; object-fit: cover; border: 3px solid #0c3a66;" />
      </div>

      <h1 style="font-size: 36px; color: #083358; margin: 0 0 10px 0; font-weight: bold;">Certificate of Achievement</h1>
      
      <h2 style="font-size: 24px; color: #0c3a66; margin: 0 0 20px 0; font-weight: bold;">Media and Information Literacy (MIL) Beginner Course</h2>

      <div style="width: 200px; height: 2px; background: linear-gradient(to right, transparent, #083358, transparent); margin: 0 auto 30px;"></div>

      <p style="font-size: 16px; color: #374151; margin: 0 0 10px 0;">This certifies that</p>

      <h3 style="font-size: 28px; color: #083358; margin: 0 0 15px 0; font-weight: bold;">${props.studentName}</h3>

      <p style="font-size: 16px; color: #374151; margin: 0 0 5px 0;">has successfully completed all modules of the</p>

      <p style="font-size: 18px; color: #1f2937; margin: 0 0 20px 0; font-weight: bold;">Media and Information Literacy (MIL) Beginner Course</p>

      <p style="font-size: 14px; color: #6b7280; margin: 0 0 30px 0;">Beginner Level Course</p>

      <div style="width: 200px; height: 2px; background: linear-gradient(to right, transparent, #083358, transparent); margin: 0 auto 30px;"></div>

      <p style="font-size: 14px; color: #6b7280; margin: 0 0 10px 0;">Earned on: <strong>${completionDate.value}</strong></p>

      <p style="font-size: 11px; color: #9ca3af; margin: 0;">Certificate ID: ${certificateId.value}</p>
    </div>
  `

  document.body.appendChild(tempDiv)

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#f0f9ff'
    })

    // Create PDF from canvas (A4 size)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const imgData = canvas.toDataURL('image/png')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

    // Download PDF
    const fileName = `Certificate-${props.studentName.replace(/\s+/g, '-')}.pdf`
    pdf.save(fileName)
  } finally {
    // Clean up temporary div
    document.body.removeChild(tempDiv)
  }
}

const handleNextModule = () => emit('nextCourse')
const handleBackToDashboard = () => emit('backToDashboard')
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

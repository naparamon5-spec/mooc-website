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
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Modal -->
    <div class="bg-white rounded-lg w-96 shadow-2xl animate-fade-in overflow-hidden flex flex-col max-h-[90vh]">

      <!-- Certificate preview area -->
      <div
        class="bg-gradient-to-br from-primary-50 to-primary-100 p-6 relative border-4 border-primary-600 overflow-y-auto"
        :style="certificateBackgroundStyle"
      >
        <!-- Decorative corners -->
        <div class="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary-600"></div>
        <div class="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary-600"></div>
        <div class="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary-600"></div>
        <div class="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary-600"></div>

        <div class="text-center">
          <div class="flex justify-center mb-3">
            <img src="/assets/logo.png" alt="MIL MOOC" class="h-16 w-20 border-primary-600" />
          </div>

          <h1 class="text-2xl font-bold text-primary-600 mb-1">Certificate of Completion</h1>
          <p class="text-gray-600 text-sm mb-4">
            Media and Information Literacy {{ courseLevel === 'advanced' ? 'Advanced' : 'Beginner' }} Course
          </p>

          <div class="w-32 h-0.5 bg-gradient-to-r from-transparent via-primary-600 to-transparent mx-auto mb-4"></div>

          <div class="mb-4">
            <p class="text-gray-700 text-xs mb-2">This certifies that</p>
            <p class="text-lg font-bold text-primary-600 mb-2">{{ studentName }}</p>
            <p class="text-gray-700 text-xs mb-2">has successfully completed all modules of the</p>
            <p class="text-sm font-semibold text-gray-800">
              Media and Information Literacy (MIL) {{ courseLevel === 'advanced' ? 'Advanced' : 'Beginner' }} Course
            </p>
          </div>

          <div class="w-32 h-0.5 bg-gradient-to-r from-transparent via-primary-600 to-transparent mx-auto mb-4"></div>

          <p class="text-gray-600 mb-4 text-xs">
            Completed on: <span class="font-semibold text-gray-800">{{ completionDate }}</span>
          </p>

          <div class="flex justify-around mb-2 px-4">
            <div class="text-center">
              <div class="h-6 mb-1"></div>
              <p class="text-gray-700 font-semibold text-xs">MIL MOOC</p>
              <p class="text-xs text-gray-600">Platform</p>
            </div>
          </div>

          <p class="text-xs text-gray-500 mt-2">Certificate ID: {{ certificateId }}</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="bg-gray-50 px-4 py-4 flex flex-col gap-2">
        <button
          @click="downloadCertificate"
          :disabled="downloading"
          class="w-full bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2 text-sm disabled:opacity-60"
        >
          <svg v-if="!downloading" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <svg v-else class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ downloading ? 'Generating PDF...' : 'Download Certificate' }}
        </button>

        <button
          v-if="courseLevel === 'beginner'"
          @click="emit('nextCourse')"
          class="w-full bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition text-sm"
        >
          Continue to Advanced Course
        </button>

        <button
          @click="emit('backToDashboard')"
          class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition text-sm"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  isOpen: boolean
  studentName: string
  templateUrl?: string
  courseLevel?: 'beginner' | 'advanced'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  nextCourse: []
  backToDashboard: []
}>()

const downloading = ref(false)

const certificateId = computed(() => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `MIL-${timestamp}-${random}`
})

const completionDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const certificateBackgroundStyle = computed(() => {
  if (props.templateUrl && !props.templateUrl.toLowerCase().includes('.pdf')) {
    return {
      backgroundImage: `url('${props.templateUrl}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }
  }
  return {}
})

const downloadCertificate = async () => {
  downloading.value = true
  let tempDiv: HTMLDivElement | null = null

  try {
    const { jsPDF } = await import('jspdf')
    const html2canvas = (await import('html2canvas')).default

    const levelLabel = props.courseLevel === 'advanced' ? 'Advanced' : 'Beginner'
    const hasImageTemplate =
      !!props.templateUrl && !props.templateUrl.toLowerCase().includes('.pdf')

    tempDiv = document.createElement('div')
    tempDiv.style.width = '1122px'
    tempDiv.style.height = '794px'
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    tempDiv.style.top = '0'
    tempDiv.style.fontFamily = 'Arial, sans-serif'
    tempDiv.style.boxSizing = 'border-box'
    tempDiv.style.overflow = 'hidden'

    if (hasImageTemplate) {
      tempDiv.style.backgroundImage = `url('${props.templateUrl}')`
      tempDiv.style.backgroundSize = 'cover'
      tempDiv.style.backgroundPosition = 'center'
      tempDiv.style.backgroundRepeat = 'no-repeat'
    } else {
      tempDiv.style.background = 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #e0f2fe 100%)'
      tempDiv.style.border = '12px solid #0c3a66'
    }

    if (hasImageTemplate) {
      // Overlay text on top of uploaded template image
      tempDiv.innerHTML = `
        <div style="
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="text-align:center;width:70%;">
            <p style="font-size:13px;color:#374151;margin:0 0 8px;">This certifies that</p>
            <h2 style="font-size:44px;color:#083358;margin:0 0 14px;font-weight:bold;
              text-shadow:1px 1px 3px rgba(255,255,255,0.95);">
              ${props.studentName}
            </h2>
            <p style="font-size:14px;color:#374151;margin:0 0 4px;
              text-shadow:1px 1px 2px rgba(255,255,255,0.9);">
              has successfully completed all modules of the
            </p>
            <p style="font-size:20px;color:#083358;font-weight:bold;margin:0 0 24px;
              text-shadow:1px 1px 2px rgba(255,255,255,0.9);">
              Media and Information Literacy (MIL) ${levelLabel} Course
            </p>
            <p style="font-size:13px;color:#374151;margin:0 0 6px;
              text-shadow:1px 1px 2px rgba(255,255,255,0.9);">
              Completed on: <strong>${completionDate.value}</strong>
            </p>
            <p style="font-size:11px;color:#6b7280;
              text-shadow:1px 1px 2px rgba(255,255,255,0.9);">
              Certificate ID: ${certificateId.value}
            </p>
          </div>
        </div>
      `
    } else {
      // Full default certificate design
      tempDiv.innerHTML = `
        <div style="
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          box-sizing: border-box;
          position: relative;
        ">
          <!-- Corner decorations -->
          <div style="position:absolute;top:24px;left:24px;width:44px;height:44px;
            border-top:3px solid #083358;border-left:3px solid #083358;"></div>
          <div style="position:absolute;top:24px;right:24px;width:44px;height:44px;
            border-top:3px solid #083358;border-right:3px solid #083358;"></div>
          <div style="position:absolute;bottom:24px;left:24px;width:44px;height:44px;
            border-bottom:3px solid #083358;border-left:3px solid #083358;"></div>
          <div style="position:absolute;bottom:24px;right:24px;width:44px;height:44px;
            border-bottom:3px solid #083358;border-right:3px solid #083358;"></div>

          <img src="/assets/logo.png" alt="MIL MOOC"
            style="width:80px;height:80px;object-fit:contain;margin-bottom:20px;" />

          <h1 style="font-size:38px;color:#083358;margin:0 0 8px;font-weight:bold;
            letter-spacing:2px;text-align:center;">
            Certificate of Completion
          </h1>

          <p style="font-size:15px;color:#6b7280;margin:0 0 20px;text-align:center;">
            Media and Information Literacy (MIL) ${levelLabel} Course
          </p>

          <div style="width:320px;height:2px;
            background:linear-gradient(to right,transparent,#083358,transparent);
            margin:0 0 20px;"></div>

          <p style="font-size:14px;color:#374151;margin:0 0 8px;text-align:center;">
            This certifies that
          </p>

          <h2 style="font-size:44px;color:#083358;margin:0 0 16px;font-weight:bold;
            text-align:center;">
            ${props.studentName}
          </h2>

          <p style="font-size:14px;color:#374151;margin:0 0 4px;text-align:center;">
            has successfully completed all modules of the
          </p>

          <p style="font-size:18px;color:#1f2937;margin:0 0 20px;font-weight:bold;
            text-align:center;">
            Media and Information Literacy (MIL) ${levelLabel} Course
          </p>

          <div style="width:320px;height:2px;
            background:linear-gradient(to right,transparent,#083358,transparent);
            margin:0 0 20px;"></div>

          <p style="font-size:13px;color:#6b7280;margin:0 0 8px;text-align:center;">
            Completed on: <strong style="color:#374151;">${completionDate.value}</strong>
          </p>

          <p style="font-size:11px;color:#9ca3af;text-align:center;">
            Certificate ID: ${certificateId.value}
          </p>
        </div>
      `
    }

    document.body.appendChild(tempDiv)

    // Wait for background image to fully load before capturing canvas
    if (hasImageTemplate) {
      await new Promise<void>((resolve) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => resolve()
        img.onerror = () => resolve()
        img.src = props.templateUrl!
      })
      // Small buffer to ensure styles are applied
      await new Promise(r => setTimeout(r, 200))
    }

    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: hasImageTemplate ? null : '#e0f2fe'
    })

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })

    const imgData = canvas.toDataURL('image/png')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

    const fileName = `MIL-${levelLabel}-Certificate-${props.studentName.replace(/\s+/g, '-')}.pdf`
    pdf.save(fileName)
  } catch (err) {
    console.error('Error generating certificate PDF:', err)
  } finally {
    downloading.value = false
    if (tempDiv && document.body.contains(tempDiv)) {
      document.body.removeChild(tempDiv)
    }
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-in-out;
}
</style>
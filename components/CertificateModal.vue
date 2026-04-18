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
      class="bg-white rounded-lg w-full max-w-2xl shadow-2xl animate-fade-in overflow-hidden flex flex-col max-h-[90vh]"
    >
      <!-- Header -->
      <div class="bg-primary-600 text-white px-6 py-4 border-b-2 border-primary-700">
        <h2 class="text-xl font-bold">Your Certificate of Completion 🎓</h2>
        <p class="text-sm text-primary-100">{{ courseLevel === 'beginner' ? 'Media & Information Literacy - Beginner Course' : 'Media & Information Literacy - Advanced Course' }}</p>
      </div>

      <!-- PDF Preview -->
      <div class="flex-1 overflow-y-auto bg-gray-100 p-6 flex items-center justify-center">
        <div v-if="loading" class="text-center flex items-center justify-center h-full">
          <div class="inline-block">
            <svg class="animate-spin h-12 w-12 text-primary-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-gray-600 font-semibold">Rendering your certificate...</p>
          </div>
        </div>

        <div v-else-if="error" class="text-center text-red-600 py-8">
          <p class="font-semibold">{{ error }}</p>
          <p class="text-sm text-gray-600 mt-2">Please try downloading instead or contact support.</p>
        </div>

        <iframe
          v-else
          :src="previewUrl"
          class="w-full h-full shadow-lg rounded-lg border-0"
        ></iframe>
      </div>

      <!-- Action Buttons -->
      <div class="bg-gray-50 px-6 py-4 border-t-2 border-gray-200 flex flex-col gap-2 sm:flex-row">
        <button
          @click="downloadCertificate"
          :disabled="downloadingPdf"
          class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {{ downloadingPdf ? 'Downloading...' : 'Download Certificate' }}
        </button>

        <button
          @click="handleBackToDashboard"
          class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition text-sm"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { useCertificateTemplates } from '~/composables/useCertificateTemplates'

interface Props {
  isOpen: boolean
  studentName: string
  templateUrl?: string
  courseLevel: 'beginner' | 'advanced'
}

const props = withDefaults(defineProps<Props>(), {
  templateUrl: ''
})

const emit = defineEmits<{
  close: []
  nextCourse: []
  backToDashboard: []
}>()

const previewUrl = ref<string>('')
const loading = ref(true)
const error = ref<string | null>(null)
const downloadingPdf = ref(false)
const resolvedTemplateUrl = ref<string>('')
const NAME_X_OFFSET = 100
const NAME_Y_RATIO = 0.45

const { templates: certificateTemplates, fetchTemplates: fetchCertificateTemplates } = useCertificateTemplates()

const getFittedNameSize = (name: string, font: any, maxWidth: number, startSize: number): number => {
  let size = startSize
  while (size > 24 && font.widthOfTextAtSize(name, size) > maxWidth) {
    size -= 1
  }
  return size
}

// Helper: convert Uint8Array to a plain ArrayBuffer to satisfy Blob constructor
const toPlainArrayBuffer = (uint8: Uint8Array): ArrayBuffer => {
  const plain = new ArrayBuffer(uint8.byteLength)
  new Uint8Array(plain).set(uint8)
  return plain
}

// Resolve template URL - use prop or fetch from database
const resolveTemplateUrl = async (): Promise<string | null> => {
  try {
    if (props.templateUrl) {
      console.log('✅ Using provided template URL:', props.templateUrl)
      return props.templateUrl
    }

    console.log('🔄 Template URL not provided, fetching by course level:', props.courseLevel)
    if (certificateTemplates.value.length === 0) {
      await fetchCertificateTemplates()
    }

    const template = certificateTemplates.value.find(t => t.course_level === props.courseLevel)
    if (template?.template_url) {
      console.log('✅ Found template URL from database:', template.template_url)
      return template.template_url
    }

    console.error('❌ No template URL found for course level:', props.courseLevel)
    return null
  } catch (err: any) {
    console.error('❌ Error resolving template URL:', err)
    return null
  }
}

// Stamp certificate with student name and create preview
const stampAndPreview = async () => {
  try {
    loading.value = true
    error.value = null

    console.log('🎓 CertificateModal: Starting certificate stamp')

    const templateUrl = await resolveTemplateUrl()
    if (!templateUrl) {
      error.value = 'No certificate template found. Please contact support.'
      loading.value = false
      console.error('❌ CertificateModal: No template URL')
      return
    }

    resolvedTemplateUrl.value = templateUrl
    console.log('📄 Starting PDF processing...')

    const existingPdfBytes = await fetch(templateUrl).then(r => {
      if (!r.ok) throw new Error(`Failed to fetch PDF: ${r.status} ${r.statusText}`)
      return r.arrayBuffer()
    })

    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    // Assign first, then guard — this is what narrows the type for TypeScript
    const page = pdfDoc.getPages()[0]
    if (!page) {
      throw new Error('PDF template has no pages.')
    }

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const pageWidth = page.getWidth()
    const pageHeight = page.getHeight()

    const studentDisplayName = props.studentName?.trim() || 'Student Name'
    const nameSize = getFittedNameSize(studentDisplayName, font, pageWidth * 0.62, 36)
    const nameWidth = font.widthOfTextAtSize(studentDisplayName, nameSize)
    page.drawText(studentDisplayName, {
      x: (pageWidth - nameWidth) / 2 + NAME_X_OFFSET,
      y: pageHeight * NAME_Y_RATIO,
      size: nameSize,
      font,
      color: rgb(0, 0, 0),
    })

    console.log('✏️ Name stamped on PDF:', props.studentName)

    const pdfUint8 = await pdfDoc.save()
    const blob = new Blob([toPlainArrayBuffer(pdfUint8)], { type: 'application/pdf' })
    previewUrl.value = URL.createObjectURL(blob)

    console.log('✅ Certificate preview ready!')
    loading.value = false
  } catch (err: any) {
    console.error('❌ CertificateModal: Error stamping certificate:', err)
    error.value = err?.message || 'Failed to render certificate. Please try downloading instead.'
    loading.value = false
  }
}

// Download certificate as PDF
const downloadCertificate = async () => {
  try {
    downloadingPdf.value = true
    console.log('⬇️ Starting certificate download...')

    if (!resolvedTemplateUrl.value) {
      error.value = 'No certificate template found'
      downloadingPdf.value = false
      return
    }

    const existingPdfBytes = await fetch(resolvedTemplateUrl.value).then(r => {
      if (!r.ok) throw new Error(`Failed to fetch PDF: ${r.status} ${r.statusText}`)
      return r.arrayBuffer()
    })

    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    // Assign first, then guard — this is what narrows the type for TypeScript
    const page = pdfDoc.getPages()[0]
    if (!page) {
      throw new Error('PDF template has no pages.')
    }

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const pageWidth = page.getWidth()
    const pageHeight = page.getHeight()

    const studentDisplayName = props.studentName?.trim() || 'Student Name'
    const nameSize = getFittedNameSize(studentDisplayName, font, pageWidth * 0.62, 36)
    const nameWidth = font.widthOfTextAtSize(studentDisplayName, nameSize)
    page.drawText(studentDisplayName, {
      x: (pageWidth - nameWidth) / 2 + NAME_X_OFFSET,
      y: pageHeight * NAME_Y_RATIO,
      size: nameSize,
      font,
      color: rgb(0, 0, 0),
    })

    // FIX 2: Copy into a plain ArrayBuffer before passing to Blob
    const pdfUint8 = await pdfDoc.save()
    const blob = new Blob([toPlainArrayBuffer(pdfUint8)], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    const timestamp = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    a.download = `${props.studentName}_Certificate_${timestamp}.pdf`
    a.click()

    URL.revokeObjectURL(url)

    console.log('✅ Certificate downloaded:', a.download)
    downloadingPdf.value = false
  } catch (err: any) {
    console.error('❌ Error downloading certificate:', err)
    error.value = 'Failed to download certificate. Please try again.'
    downloadingPdf.value = false
  }
}

const handleBackToDashboard = () => emit('backToDashboard')

onMounted(async () => {
  console.log('🚀 CertificateModal mounted')
  if (props.isOpen) {
    await stampAndPreview()
  }
})

watch(() => props.isOpen, async (isOpen) => {
  console.log('👀 Modal isOpen changed to:', isOpen)
  if (isOpen) {
    await stampAndPreview()
  }
})

watch(() => props.templateUrl, async (newUrl) => {
  console.log('🔄 Template URL changed to:', newUrl)
  if (props.isOpen) {
    await stampAndPreview()
  }
})

watch(() => props.courseLevel, async (newLevel) => {
  console.log('🔄 Course level changed to:', newLevel)
  if (props.isOpen) {
    await stampAndPreview()
  }
})
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
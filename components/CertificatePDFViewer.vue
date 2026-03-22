<template>
  <div class="w-full h-full flex items-center justify-center bg-gray-100">
    <div v-if="loading" class="text-center">
      <div class="inline-block mb-2">
        <svg class="animate-spin h-12 w-12 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <p class="text-gray-600 font-semibold">Rendering certificate...</p>
    </div>

    <div v-else-if="error" class="text-center text-red-600 p-8">
      <p>{{ error }}</p>
    </div>

    <iframe
      v-else
      :src="previewUrl"
      class="w-full h-full rounded-lg shadow-lg"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

interface Props {
  cert: any
  studentName: string
}

const props = defineProps<Props>()

const previewUrl = ref<string>('')
const loading = ref(true)
const error = ref<string | null>(null)

const stampAndPreview = async () => {
  try {
    loading.value = true
    error.value = null

    console.log('Starting certificate stamp...', props.cert)

    const templateUrl = props.cert?.template_url
    console.log('Template URL:', templateUrl)

    if (!templateUrl) {
      error.value = 'No certificate template found. Please contact support.'
      loading.value = false
      return
    }

    console.log('Fetching PDF from:', templateUrl)
    
    // Fetch the existing PDF template
    const existingPdfBytes = await fetch(templateUrl).then(r => r.arrayBuffer())
    
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const page = pdfDoc.getPages()[0]
    
    // Embed font and add student name
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    
    const pageWidth = page.getWidth()
    const pageHeight = page.getHeight()

    const nameWidth = font.widthOfTextAtSize(props.studentName, 36)

    
    // Add name in center of page
page.drawText(props.studentName, {
  x: (pageWidth - nameWidth) / 2,  // ← perfect center
  y: pageHeight * 0.57,  // ← bump this up more
  size: 36,
  font,
  color: rgb(0, 0, 0),
})

    console.log('Name stamped on PDF:', props.studentName)

    // Save and create preview URL
    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    previewUrl.value = URL.createObjectURL(blob)

    console.log('Certificate preview ready!')
    loading.value = false
  } catch (err: any) {
    console.error('Error stamping certificate:', err)
    error.value = err?.message || 'Failed to render certificate. Please try downloading instead.'
    loading.value = false
  }
}

onMounted(async () => {
  console.log('CertificatePDFViewer mounted')
  await stampAndPreview()
})

// Re-render if cert changes
watch(() => props.cert, async () => {
  console.log('Certificate data changed, re-rendering')
  await stampAndPreview()
}, { deep: true })
</script>

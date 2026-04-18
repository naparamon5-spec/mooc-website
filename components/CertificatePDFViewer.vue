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

const formatCertificateDate = (cert: any): string => {
  const rawDate = cert?.earnedAt || cert?.issued_at || cert?.completed_at || cert?.created_at
  if (!rawDate) return '—'

  const date = new Date(rawDate)
  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getCertificateSequenceOnly = (cert: any): string => {
  const fullCertificateNumber = cert?.certificateNumber || cert?.certificate_number || ''
  const match = String(fullCertificateNumber).match(/(\d{5})$/)
  return match?.[1] || 'Pending'
}

const getFittedNameSize = (name: string, font: any, maxWidth: number, startSize: number): number => {
  let size = startSize
  while (size > 24 && font.widthOfTextAtSize(name, size) > maxWidth) {
    size -= 1
  }
  return size
}

const stampAndPreview = async () => {
  try {
    loading.value = true
    error.value = null

    const templateUrl = props.cert?.template_url

    if (!templateUrl) {
      error.value = 'No certificate template found. Please contact support.'
      loading.value = false
      return
    }

    const existingPdfBytes = await fetch(templateUrl).then(r => r.arrayBuffer())
    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const page = pdfDoc.getPages()[0]

    if (!page) {
      throw new Error('Certificate template has no pages.')
    }

    const nameFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const metaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

    const pageWidth = page.getWidth()
    const pageHeight = page.getHeight()

    const studentDisplayName = props.studentName?.trim() || 'Student Name'
    const nameSize = getFittedNameSize(studentDisplayName, nameFont, pageWidth * 0.62, 36)
    const nameWidth = nameFont.widthOfTextAtSize(studentDisplayName, nameSize)

    page.drawText(studentDisplayName, {
      x: (pageWidth - nameWidth) / 2,
      y: pageHeight * 0.57,
      size: nameSize,
      font: nameFont,
      color: rgb(0, 0, 0),
    })

    const certificateDate = formatCertificateDate(props.cert)
    const dateSize = 12
    const dateWidth = metaFont.widthOfTextAtSize(certificateDate, dateSize)

    page.drawText(certificateDate, {
      x: pageWidth / 2 + 176,
      y: pageHeight * 0.365 - 9.6,
      size: dateSize,
      font: metaFont,
      color: rgb(0.1, 0.16, 0.32),
    })

    const certificateNumberText = getCertificateSequenceOnly(props.cert)
    const certificateNumberSize = 11
    const certificateNumberWidth = metaFont.widthOfTextAtSize(certificateNumberText, certificateNumberSize)

    page.drawText(certificateNumberText, {
      x: pageWidth - certificateNumberWidth - 52,
      y: 48,
      size: certificateNumberSize,
      font: metaFont,
      color: rgb(0.1, 0.16, 0.32),
    })

    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' })

    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }

    previewUrl.value = URL.createObjectURL(blob)
    loading.value = false
  } catch (err: any) {
    console.error('Error stamping certificate:', err)
    error.value = err?.message || 'Failed to render certificate. Please try downloading instead.'
    loading.value = false
  }
}

onMounted(async () => {
  await stampAndPreview()
})

watch(() => props.cert, async () => {
  await stampAndPreview()
}, { deep: true })

watch(() => props.studentName, async () => {
  await stampAndPreview()
})
</script>

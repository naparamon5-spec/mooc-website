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
          <h1 class="text-3xl font-bold text-gray-900">Certificate Template Management</h1>
        </div>
        <button
          @click="showUploadModal = true"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Upload Template
        </button>
      </div>

      <!-- Templates List -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 mb-8">
        <div class="p-6">
          <div v-if="loadingTemplates" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p class="mt-2 text-gray-600">Loading templates...</p>
          </div>

          <div v-else-if="error" class="text-center py-8">
            <p class="text-red-600">{{ error }}</p>
            <button @click="fetchTemplates" class="mt-2 text-primary-600 hover:underline">Try again</button>
          </div>

          <div v-else-if="templates.length === 0" class="text-center py-8">
            <p class="text-gray-600">No certificate templates found.</p>
            <button @click="showUploadModal = true" class="mt-2 text-primary-600 hover:underline">
              Upload your first template
            </button>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="template in templates"
              :key="template.id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">{{ template.template_name }}</h3>
                  <p class="text-gray-600 mt-1">Course Level: {{ template.course_level }}</p>
                  <p class="text-sm text-gray-500 mt-1">Created: {{ formatDate(template.created_at) }}</p>
                  <div class="mt-3 flex gap-2">
                    <button @click="viewTemplate(template)" class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">View</button>
                    <button @click="downloadTemplate(template)" class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">Download</button>
                  </div>
                </div>
                <div class="flex space-x-2 ml-4">
                  <button @click="confirmDelete(template)" class="text-red-600 hover:text-red-800 p-1" title="Delete Template">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ✅ NEW: Certificate Number Management Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-xl font-bold text-gray-900">Certificate Number Management</h2>
              <p class="text-sm text-gray-500 mt-1">
                Assign certificate numbers to students. Format: <span class="font-mono font-bold text-primary-700">MIL-B2026-00001</span> (Beginner) or <span class="font-mono font-bold text-purple-700">MIL-A2026-00001</span> (Advanced)
              </p>
            </div>
            <button
              @click="loadIssuedCertificates"
              class="text-sm text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          <!-- Next numbers preview -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p class="text-xs text-blue-500 font-medium uppercase tracking-wide mb-1">Next Beginner Certificate</p>
              <p class="font-mono text-lg font-bold text-blue-700">{{ nextBeginnerNumber }}</p>
              <p class="text-xs text-blue-600 mt-2">Automatically increments for each newly assigned beginner certificate.</p>
            </div>
            <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p class="text-xs text-purple-500 font-medium uppercase tracking-wide mb-1">Next Advanced Certificate</p>
              <p class="font-mono text-lg font-bold text-purple-700">{{ nextAdvancedNumber }}</p>
              <p class="text-xs text-purple-600 mt-2">Automatically increments for each newly assigned advanced certificate.</p>
            </div>
          </div>

          <!-- Certificates without numbers -->
          <div v-if="loadingIssuedCerts" class="text-center py-8">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
            <p class="mt-2 text-gray-500 text-sm">Loading certificates...</p>
          </div>

          <div v-else-if="pendingCertificates.length === 0 && numberedCertificates.length === 0" class="text-center py-8">
            <p class="text-gray-500 text-sm">No issued certificates found.</p>
          </div>

          <div v-else>
            <!-- Pending (no number assigned) -->
            <div v-if="pendingCertificates.length > 0" class="mb-6">
              <h3 class="text-sm font-semibold text-orange-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span class="inline-block w-2 h-2 rounded-full bg-orange-400"></span>
                Pending — No Certificate Number Assigned ({{ pendingCertificates.length }})
              </h3>
              <div class="space-y-2">
                <div
                  v-for="cert in pendingCertificates"
                  :key="cert.id"
                  class="flex items-center justify-between border border-orange-100 bg-orange-50 rounded-lg px-4 py-3"
                >
                  <div>
                    <p class="font-semibold text-gray-800 text-sm">{{ cert.student_name || 'Unknown Student' }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">
                      {{ cert.course_level === 'beginner' ? 'Beginner Course' : 'Advanced Course' }}
                      · Issued on {{ formatLongDate(cert.issued_at) }}
                    </p>
                  </div>
                  <button
                    @click="assignCertificateNumber(cert)"
                    :disabled="assigningId === cert.id"
                    class="text-sm bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg v-if="assigningId === cert.id" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    {{ assigningId === cert.id ? 'Assigning...' : 'Assign Number' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Already numbered -->
            <div v-if="numberedCertificates.length > 0">
              <h3 class="text-sm font-semibold text-green-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span class="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                Assigned ({{ numberedCertificates.length }})
              </h3>
              <div class="space-y-2">
                <div
                  v-for="cert in numberedCertificates"
                  :key="cert.id"
                  class="flex items-center justify-between border border-green-100 bg-green-50 rounded-lg px-4 py-3"
                >
                  <div>
                    <p class="font-semibold text-gray-800 text-sm">{{ cert.student_name || 'Unknown Student' }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">
                      {{ cert.course_level === 'beginner' ? 'Beginner Course' : 'Advanced Course' }}
                      · Issued on {{ formatLongDate(cert.issued_at) }}
                    </p>
                  </div>
                  <div class="flex items-center gap-2">
                    <input
                      :value="cert.certificate_number"
                      @change="updateExistingCertificateNumber(cert, ($event.target as HTMLInputElement).value)"
                      class="w-44 px-3 py-2 rounded-lg border border-green-200 bg-white text-sm font-mono text-green-700 font-bold focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <div
      v-if="showUploadModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeUploadModal"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4" @click.stop>
        <h2 class="text-xl font-bold mb-4">Upload Certificate Template</h2>

        <form @submit.prevent="uploadTemplate">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Course Level</label>
              <select v-model="selectedCourseLevel" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="beginner">Beginner</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
              <input
                v-model="templateName"
                type="text"
                placeholder="e.g., MIL Beginner Certificate 2025"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Certificate Template File (PDF Only)</label>
              <div class="relative">
                <input
                  type="file"
                  accept=".pdf"
                  @change="onTemplateFileSelected"
                  required
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  :class="fileValidationError && fileValidationError.includes('❌')
                    ? 'border-red-300 focus:ring-red-500'
                    : fileValidationError && fileValidationError.includes('✓')
                    ? 'border-green-300 focus:ring-green-500'
                    : 'border-gray-300 focus:ring-primary-500'"
                />
              </div>
              <p class="text-xs text-gray-500 mt-1">📋 Requirements: PDF file only, max 10MB</p>
              <p v-if="fileValidationError"
                 :class="fileValidationError.includes('✓') ? 'text-green-600' : 'text-red-600'"
                 class="text-xs mt-1 font-medium">
                {{ fileValidationError }}
              </p>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="closeUploadModal" class="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
            <button
              type="submit"
              :disabled="uploading || Boolean(fileValidationError && fileValidationError.includes('❌'))"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ uploading ? 'Uploading...' : 'Upload Template' }}
            </button>
          </div>

          <div v-if="uploadError" class="bg-red-50 border border-red-200 rounded-md p-3 mt-4">
            <p class="text-red-700 text-sm">{{ uploadError }}</p>
          </div>
          <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-md p-3 mt-4">
            <p class="text-green-700 text-sm">{{ successMessage }}</p>
          </div>
        </form>
      </div>
    </div>

    <!-- View Template Modal -->
    <div
      v-if="showViewModal"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      @click="closeViewModal"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden" @click.stop>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold">{{ viewingTemplate?.template_name }}</h2>
          <button @click="closeViewModal" class="text-gray-500 hover:text-gray-700 p-1">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-auto max-h-[70vh]">
          <div v-if="viewingTemplate && isImage(viewingTemplate.template_url)" class="flex justify-center">
            <img :src="viewingTemplate.template_url" :alt="viewingTemplate.template_name" class="max-w-full max-h-full object-contain" />
          </div>
          <div v-else-if="viewingTemplate && isPdf(viewingTemplate.template_url)" class="w-full h-[600px]">
            <iframe :src="viewingTemplate.template_url" class="w-full h-full border-0" title="PDF Viewer"></iframe>
          </div>
          <div v-else class="text-center py-8">
            <p class="text-gray-600">Unable to preview this file type.</p>
            <button @click="downloadTemplate(viewingTemplate!)" class="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">Download Instead</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="deletingTemplate"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="cancelDelete"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-sm mx-4" @click.stop>
        <h2 class="text-xl font-bold mb-4">Delete Template</h2>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete "{{ deletingTemplate.template_name }}"? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="cancelDelete" class="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
          <button @click="proceedDelete" :disabled="deleting" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import AdminHeader from '~/components/admindashboard/AdminHeader.vue'
import { useCertificateTemplates, type CertificateTemplate } from '~/composables/useCertificateTemplates'
import { useUserProfile } from '~/composables/useUserProfile'

definePageMeta({ middleware: 'auth' })

useHead({
  title: 'Certificate Template Management - Admin',
})

const { fetchUserProfile } = useUserProfile()
const { templates, loading: loadingTemplates, error, fetchTemplates, fetchTemplateByLevel, createTemplate, deleteTemplate, uploadTemplateImage } = useCertificateTemplates()
const nuxtApp = useNuxtApp()
const supabase = nuxtApp.$supabase

const adminName = ref('Admin User')
const showUploadModal = ref(false)
const showViewModal = ref(false)
const viewingTemplate = ref<CertificateTemplate | null>(null)
const selectedCourseLevel = ref<'beginner' | 'advanced'>('beginner')
const selectedFile = ref<File | null>(null)
const templateName = ref('')
const uploading = ref(false)
const uploadError = ref('')
const successMessage = ref('')
const deletingTemplate = ref<CertificateTemplate | null>(null)
const deleting = ref(false)
const fileValidationError = ref('')

// ✅ Certificate number management state
const allIssuedCerts = ref<any[]>([])
const loadingIssuedCerts = ref(false)
const assigningId = ref<string | null>(null)
const currentYear = new Date().getFullYear()
const nextBeginnerNumber = ref(`MIL-B${currentYear}-00001`)
const nextAdvancedNumber = ref(`MIL-A${currentYear}-00001`)

// File validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_TYPE = 'application/pdf'

// ✅ Split certs into pending vs numbered
const pendingCertificates = computed(() =>
  allIssuedCerts.value.filter(c => !c.certificate_number)
)
const numberedCertificates = computed(() =>
  allIssuedCerts.value.filter(c => !!c.certificate_number)
    .sort((a, b) => a.certificate_number.localeCompare(b.certificate_number))
)

// ✅ Load all issued certificates with student names
const loadIssuedCertificates = async () => {
  loadingIssuedCerts.value = true
  try {
    // Join certificates with profiles to get student names
    const { data, error: fetchError } = await supabase
      .from('certificates')
      .select(`
        id,
        student_id,
        course_level,
        issued_at,
        certificate_number,
        profiles:student_id (full_name)
      `)
      .order('issued_at', { ascending: false })

    if (fetchError) {
      console.error('Error loading certificates:', fetchError)
      return
    }

    allIssuedCerts.value = (data || []).map((c: any) => ({
      ...c,
      student_name: c.profiles?.full_name || 'Unknown Student'
    }))

    // Update next number previews
    await refreshNextNumbers()
  } catch (err) {
    console.error('Error loading issued certificates:', err)
  } finally {
    loadingIssuedCerts.value = false
  }
}

// ✅ Generate the next certificate number for a given level
const buildCertificateNumber = (courseLevel: 'beginner' | 'advanced', sequence: number): string => {
  const levelCode = courseLevel === 'beginner' ? 'B' : 'A'
  return `MIL-${levelCode}${currentYear}-${String(sequence).padStart(5, '0')}`
}

const extractSequenceNumber = (certificateNumber?: string | null): number => {
  if (!certificateNumber) return 0
  const match = certificateNumber.match(/(\d{5})$/)
  const sequencePart = match?.[1]

  return sequencePart ? parseInt(sequencePart, 10) : 0
}

const getNextSequenceNumber = async (courseLevel: 'beginner' | 'advanced'): Promise<number> => {
  const levelCode = courseLevel === 'beginner' ? 'B' : 'A'
  const fullPrefix = `MIL-${levelCode}${currentYear}-`

  const { data, error: fetchError } = await supabase
    .from('certificates')
    .select('certificate_number')
    .like('certificate_number', `${fullPrefix}%`)
    .order('certificate_number', { ascending: false })
    .limit(1)

  const latestCertificateNumber: string | null = data?.[0]?.certificate_number ?? null

  if (!fetchError && latestCertificateNumber) {
    return extractSequenceNumber(latestCertificateNumber) + 1
  }

  return 1
}

const generateCertificateNumber = async (courseLevel: 'beginner' | 'advanced'): Promise<string> => {
  const nextSequence = await getNextSequenceNumber(courseLevel)
  return buildCertificateNumber(courseLevel, nextSequence)
}

// ✅ Refresh the preview of next numbers
const refreshNextNumbers = async () => {
  nextBeginnerNumber.value = await generateCertificateNumber('beginner')
  nextAdvancedNumber.value = await generateCertificateNumber('advanced')
}

// ✅ Assign a certificate number to a specific cert row
const assignCertificateNumber = async (cert: any) => {
  assigningId.value = cert.id
  try {
    const courseLevel = cert.course_level as 'beginner' | 'advanced'
    const newNumber = await generateCertificateNumber(courseLevel)

    const { error: updateError } = await supabase
      .from('certificates')
      .update({ certificate_number: newNumber })
      .eq('id', cert.id)

    if (updateError) {
      console.error('Error assigning certificate number:', updateError)
      alert(`Failed to assign certificate number: ${updateError.message}`)
      return
    }

    await loadIssuedCertificates()
  } catch (err) {
    console.error('Error assigning certificate number:', err)
    alert('Failed to assign certificate number. Please try again.')
  } finally {
    assigningId.value = null
  }
}

const updateExistingCertificateNumber = async (cert: any, value: string) => {
  const normalizedValue = value.trim().toUpperCase()

  if (!normalizedValue) {
    alert('Certificate number cannot be empty.')
    await loadIssuedCertificates()
    return
  }

  const expectedPrefix = cert.course_level === 'beginner'
    ? `MIL-B${currentYear}-`
    : `MIL-A${currentYear}-`

  if (!normalizedValue.startsWith(expectedPrefix) || !/\d{5}$/.test(normalizedValue)) {
    alert(`Certificate number must follow this format: ${expectedPrefix}00001`)
    await loadIssuedCertificates()
    return
  }

  const { error: updateError } = await supabase
    .from('certificates')
    .update({ certificate_number: normalizedValue })
    .eq('id', cert.id)

  if (updateError) {
    console.error('Error updating certificate number:', updateError)
    alert(`Failed to update certificate number: ${updateError.message}`)
    await loadIssuedCertificates()
    return
  }

  await loadIssuedCertificates()
}

// Validate PDF signature (magic bytes)
const validatePdfSignature = async (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const arr = new Uint8Array(e.target?.result as ArrayBuffer).slice(0, 5)
      const header = String.fromCharCode.apply(null, Array.from(arr))
      resolve(header.startsWith('%PDF'))
    }
    reader.onerror = () => resolve(false)
    reader.readAsArrayBuffer(file.slice(0, 5))
  })
}

const selectedTemplate = computed(() => {
  return templates.value.find(t => t.course_level === selectedCourseLevel.value) || null
})

// ✅ formatDate for table display (short)
const formatDate = (value: string | undefined) => {
  if (!value) return '-'
  return new Date(value).toLocaleString()
}

// ✅ formatLongDate: "March 24, 2026"
const formatLongDate = (dateString: string): string => {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
const isPdf = (url: string) => /\.pdf$/i.test(url)

const onTemplateFileSelected = async (e: Event) => {
  const target = e.target as HTMLInputElement
  fileValidationError.value = ''

  if (target.files && target.files.length > 0) {
    const file = target.files[0]

    if (!file) {
      selectedFile.value = null
      fileValidationError.value = ''
      return
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      fileValidationError.value = '❌ Only PDF files are allowed. Selected file must have .pdf extension.'
      selectedFile.value = null
      return
    }

    if (file.type && file.type !== ALLOWED_MIME_TYPE) {
      fileValidationError.value = `❌ Invalid file type: ${file.type}. Only PDF files (application/pdf) are allowed.`
      selectedFile.value = null
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)
      fileValidationError.value = `❌ File too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maximum allowed: ${sizeMB}MB.`
      selectedFile.value = null
      return
    }

    const isPdfValid = await validatePdfSignature(file)
    if (!isPdfValid) {
      fileValidationError.value = '❌ Invalid PDF file. The file appears to be corrupted or is not a valid PDF.'
      selectedFile.value = null
      return
    }

    selectedFile.value = file
    fileValidationError.value = `✓ Valid PDF selected: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`
  } else {
    selectedFile.value = null
    fileValidationError.value = ''
  }
}

const uploadTemplate = async () => {
  if (fileValidationError.value && fileValidationError.value.includes('❌')) {
    uploadError.value = fileValidationError.value
    return
  }

  if (!selectedFile.value) {
    uploadError.value = '❌ Please select a PDF file to upload.'
    return
  }

  if (!templateName.value.trim()) {
    uploadError.value = '❌ Please enter a template name.'
    return
  }

  uploading.value = true
  uploadError.value = ''
  successMessage.value = ''

  try {
    const publicUrl = await uploadTemplateImage(selectedFile.value)
    const existing = selectedTemplate.value

    if (existing && existing.id) {
      await deleteTemplate(existing.id)
    }

    const created = await createTemplate({
      course_level: selectedCourseLevel.value,
      template_name: templateName.value.trim(),
      template_url: publicUrl,
    } as CertificateTemplate)

    if (created) {
      successMessage.value = `✓ Template uploaded successfully for ${selectedCourseLevel.value} course.`
      templateName.value = ''
      selectedFile.value = null
      fileValidationError.value = ''
      await fetchTemplates()
      setTimeout(() => { closeUploadModal() }, 1500)
    }
  } catch (err) {
    const errorMsg = (err as Error).message || 'Upload failed'
    if (errorMsg.includes('PDF') || errorMsg.includes('pdf')) {
      uploadError.value = `❌ PDF Error: ${errorMsg}.`
    } else if (errorMsg.includes('file') || errorMsg.includes('File')) {
      uploadError.value = `❌ File Error: ${errorMsg}.`
    } else {
      uploadError.value = `❌ Upload failed: ${errorMsg}`
    }
  } finally {
    uploading.value = false
  }
}

const closeUploadModal = () => {
  showUploadModal.value = false
  templateName.value = ''
  selectedFile.value = null
  uploadError.value = ''
  successMessage.value = ''
  fileValidationError.value = ''
}

const viewTemplate = (template: CertificateTemplate) => {
  viewingTemplate.value = template
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
  viewingTemplate.value = null
}

const downloadTemplate = (template: CertificateTemplate) => {
  const link = document.createElement('a')
  link.href = template.template_url
  link.download = template.template_name + (template.template_url.includes('.pdf') ? '.pdf' : '.jpg')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const confirmDelete = (template: CertificateTemplate) => {
  deletingTemplate.value = template
}

const cancelDelete = () => {
  deletingTemplate.value = null
}

const proceedDelete = async () => {
  if (!deletingTemplate.value) return
  deleting.value = true
  try {
    await deleteTemplate(deletingTemplate.value.id!)
    deletingTemplate.value = null
    await fetchTemplates()
  } catch (err) {
    console.error('Error deleting template:', err)
  } finally {
    deleting.value = false
  }
}

onMounted(async () => {
  const userData = await fetchUserProfile()
  if (userData?.full_name) {
    adminName.value = userData.full_name
  }
  await fetchTemplates()
  await loadIssuedCertificates()
})
</script>

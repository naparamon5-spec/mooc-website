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
      <div class="bg-white rounded-lg shadow-sm border border-gray-100">
        <div class="p-6">
          <div v-if="loadingTemplates" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p class="mt-2 text-gray-600">Loading templates...</p>
          </div>

          <div v-else-if="error" class="text-center py-8">
            <p class="text-red-600">{{ error }}</p>
            <button @click="fetchTemplates" class="mt-2 text-primary-600 hover:underline">
              Try again
            </button>
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
                    <button
                      @click="viewTemplate(template)"
                      class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View
                    </button>
                    <button
                      @click="downloadTemplate(template)"
                      class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Download
                    </button>
                  </div>
                </div>
                <div class="flex space-x-2 ml-4">
                  <button
                    @click="confirmDelete(template)"
                    class="text-red-600 hover:text-red-800 p-1"
                    title="Delete Template"
                  >
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
    </div>

    <!-- Upload Modal -->
    <div
      v-if="showUploadModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeUploadModal"
    >
      <div
        class="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        @click.stop
      >
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Certificate Template File (image/PDF)</label>
              <input
                type="file"
                accept="image/*,.pdf"
                @change="onTemplateFileSelected"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="closeUploadModal"
              class="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="uploading"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {{ uploading ? 'Uploading...' : 'Upload Template' }}
            </button>
          </div>

          <p v-if="uploadError" class="text-red-600 mt-2">{{ uploadError }}</p>
          <p v-if="successMessage" class="text-green-600 mt-2">{{ successMessage }}</p>
        </form>
      </div>
    </div>

    <!-- View Template Modal -->
    <div
      v-if="showViewModal"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      @click="closeViewModal"
    >
      <div
        class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold">{{ viewingTemplate?.template_name }}</h2>
          <button
            @click="closeViewModal"
            class="text-gray-500 hover:text-gray-700 p-1"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-auto max-h-[70vh]">
          <div v-if="viewingTemplate && isImage(viewingTemplate.template_url)" class="flex justify-center">
            <img
              :src="viewingTemplate.template_url"
              :alt="viewingTemplate.template_name"
              class="max-w-full max-h-full object-contain"
            />
          </div>

          <div v-else-if="viewingTemplate && isPdf(viewingTemplate.template_url)" class="w-full h-[600px]">
            <iframe
              :src="viewingTemplate.template_url"
              class="w-full h-full border-0"
              title="PDF Viewer"
            ></iframe>
          </div>

          <div v-else class="text-center py-8">
            <p class="text-gray-600">Unable to preview this file type.</p>
            <button
              @click="downloadTemplate(viewingTemplate!)"
              class="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              Download Instead
            </button>
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
      <div
        class="bg-white rounded-lg p-6 w-full max-w-sm mx-4"
        @click.stop
      >
        <h2 class="text-xl font-bold mb-4">Delete Template</h2>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete "{{ deletingTemplate.template_name }}"?
          This action cannot be undone.
        </p>

        <div class="flex justify-end space-x-3">
          <button
            @click="cancelDelete"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            @click="proceedDelete"
            :disabled="deleting"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
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

const selectedTemplate = computed(() => {
  return templates.value.find(t => t.course_level === selectedCourseLevel.value) || null
})

const formatDate = (value: string | undefined) => {
  if (!value) return '-'
  return new Date(value).toLocaleString()
}

const isImage = (url: string) => {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
}

const isPdf = (url: string) => {
  return /\.pdf$/i.test(url)
}

const onTemplateFileSelected = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
  } else {
    selectedFile.value = null
  }
}

const uploadTemplate = async () => {
  if (!selectedFile.value) {
    uploadError.value = 'Please select a template file to upload.'
    return
  }

  if (!templateName.value.trim()) {
    uploadError.value = 'Please enter a template name.'
    return
  }

  uploading.value = true
  uploadError.value = ''
  successMessage.value = ''

  try {
    const publicUrl = await uploadTemplateImage(selectedFile.value)
    const existing = selectedTemplate.value

    if (existing && existing.id) {
      // Optionally, update old record path - for now we recreate as new entry.
      await deleteTemplate(existing.id)
    }

    const created = await createTemplate({
      course_level: selectedCourseLevel.value,
      template_name: templateName.value.trim(),
      template_url: publicUrl,
    } as CertificateTemplate)

    if (created) {
      successMessage.value = `Template uploaded and saved for ${selectedCourseLevel.value} course.`
      templateName.value = '' // Reset form
      selectedFile.value = null
      await fetchTemplates()
      // Close modal after successful upload
      setTimeout(() => {
        closeUploadModal()
      }, 1500)
    }
  } catch (err) {
    uploadError.value = (err as Error).message || 'Upload failed'
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

const removeTemplate = async (id: string | undefined) => {
  if (!id) return
  await deleteTemplate(id)
  await fetchTemplates()
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
})
</script>

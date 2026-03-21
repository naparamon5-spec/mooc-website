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
          <h1 class="text-3xl font-bold text-gray-900">Resource Management</h1>
        </div>
        <button
          @click="showAddModal = true"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Add Resource
        </button>
      </div>

      <!-- Resources List -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100">
        <div class="p-6">
          <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p class="mt-2 text-gray-600">Loading resources...</p>
          </div>

          <div v-else-if="error" class="text-center py-8">
            <p class="text-red-600">{{ error }}</p>
            <button @click="fetchResources" class="mt-2 text-primary-600 hover:underline">
              Try again
            </button>
          </div>

          <div v-else-if="resources.length === 0" class="text-center py-8">
            <p class="text-gray-600">No resources found.</p>
            <button @click="showAddModal = true" class="mt-2 text-primary-600 hover:underline">
              Add your first resource
            </button>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="resource in resources"
              :key="resource.id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">{{ resource.title }}</h3>
                  <p class="text-gray-600 mt-1">{{ resource.description }}</p>
                  <div class="flex items-center mt-2 space-x-4">
                    <a
                      :href="resource.link"
                      target="_blank"
                      class="text-primary-600 hover:underline text-sm"
                    >
                      {{ resource.link }}
                    </a>
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="tag in resource.tags"
                        :key="tag"
                        class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex space-x-2 ml-4">
                  <button
                    @click="editResource(resource)"
                    class="text-blue-600 hover:text-blue-800 p-1"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(resource)"
                    class="text-red-600 hover:text-red-800 p-1"
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

    <!-- Add/Edit Modal -->
    <div
      v-if="showAddModal || editingResource"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeModal"
    >
      <div
        class="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        @click.stop
      >
        <h2 class="text-xl font-bold mb-4">
          {{ editingResource ? 'Edit Resource' : 'Add Resource' }}
        </h2>

        <form @submit.prevent="saveResource">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="form.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Link</label>
              <input
                v-model="form.link"
                type="url"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <input
                @change="handleImageUpload"
                type="file"
                accept="image/*"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p class="text-xs text-gray-500 mt-1">Upload an image file (optional)</p>
              <div v-if="imagePreview" class="mt-2">
                <img :src="imagePreview" alt="Preview" class="w-32 h-32 object-cover rounded border" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
              <input
                v-model="tagsInput"
                type="text"
                placeholder="Vue.js, Frontend, Framework"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="deletingResource"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="cancelDelete"
    >
      <div
        class="bg-white rounded-lg p-6 w-full max-w-sm mx-4"
        @click.stop
      >
        <h2 class="text-xl font-bold mb-4">Delete Resource</h2>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete "{{ deletingResource.title }}"?
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
import { useResources } from '~/composables/useResources'
import { useUserProfile } from '~/composables/useUserProfile'

definePageMeta({ middleware: 'auth' })

useHead({
  title: 'Resource Management - Admin',
})

const { fetchUserProfile } = useUserProfile()
const { resources, loading, error, fetchResources, addResource, updateResource, deleteResource, uploadImage } = useResources()

const adminName = ref('Admin User')
const showAddModal = ref(false)
const editingResource = ref<Resource | null>(null)
const deletingResource = ref<Resource | null>(null)
const saving = ref(false)
const deleting = ref(false)

const form = ref({
  title: '',
  description: '',
  link: '',
})

const tagsInput = ref('')
const imageFile = ref<File | null>(null)
const imagePreview = ref<string>('')

interface Resource {
  id: number
  title: string
  description: string
  link: string
  image?: string
  tags: string[]
}

onMounted(async () => {
  const userData = await fetchUserProfile()
  if (userData?.full_name) {
    adminName.value = userData.full_name
  }
  await fetchResources()
})

const editResource = (resource: Resource) => {
  editingResource.value = resource
  form.value = {
    title: resource.title,
    description: resource.description,
    link: resource.link,
  }
  tagsInput.value = resource.tags.join(', ')
  imagePreview.value = resource.image || ''
  imageFile.value = null
}

const closeModal = () => {
  showAddModal.value = false
  editingResource.value = null
  form.value = { title: '', description: '', link: '' }
  tagsInput.value = ''
  imageFile.value = null
  imagePreview.value = ''
}

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    imageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const saveResource = async () => {
  saving.value = true
  try {
    let imageUrl = imagePreview.value

    // Upload image if a new file was selected
    if (imageFile.value) {
      imageUrl = await uploadImage(imageFile.value)
    }

    const resourceData = {
      title: form.value.title,
      description: form.value.description,
      link: form.value.link,
      image: imageUrl || undefined,
      tags: tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag),
    }

    if (editingResource.value) {
      await updateResource(editingResource.value.id, resourceData)
    } else {
      await addResource(resourceData)
    }

    closeModal()
  } catch (err) {
    console.error('Error saving resource:', err)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (resource: Resource) => {
  deletingResource.value = resource
}

const cancelDelete = () => {
  deletingResource.value = null
}

const proceedDelete = async () => {
  if (!deletingResource.value) return

  deleting.value = true
  try {
    await deleteResource(deletingResource.value.id)
    deletingResource.value = null
  } catch (err) {
    console.error('Error deleting resource:', err)
  } finally {
    deleting.value = false
  }
}
</script>
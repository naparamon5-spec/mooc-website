<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <AdminHeader :admin-name="adminName" />

    <!-- MAIN CONTENT -->
    <main class="flex-1">
  <div class="max-w-full px-4 md:px-8 lg:px-12 py-8">
        <!-- Header Section -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Manage Modules</h1>
            <p class="text-gray-600 mt-2">
              Create, edit, and manage course modules ({{ totalModules }} modules)
            </p>
          </div>
          <button
            @click="openCreateModal"
            class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center gap-2 shadow-sm"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Module
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-lg shadow-sm p-12 text-center">
          <p class="text-gray-600">Loading modules...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
          {{ error }}
        </div>

        <!-- Tabs for Beginner and Advanced -->
        <div v-else class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <!-- Tab Buttons -->
          <div class="flex border-b border-gray-200">
            <button
              @click="activeTab = 'beginner'"
              :class="[
                'flex-1 px-6 py-4 text-center font-medium transition-colors',
                activeTab === 'beginner'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              Beginner ({{ beginnerModules.length }})
            </button>
            <button
              @click="activeTab = 'advanced'"
              :class="[
                'flex-1 px-6 py-4 text-center font-medium transition-colors',
                activeTab === 'advanced'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              Advanced ({{ advancedModules.length }})
            </button>
          </div>

          <!-- Tab Content -->
          <div class="p-6">
            <!-- Beginner Modules -->
            <div v-if="activeTab === 'beginner'">
              <div v-if="beginnerModules.length === 0" class="text-center py-12">
                <p class="text-gray-500 mb-4">No beginner modules yet</p>
                <button
                  @click="openCreateModal('beginner')"
                  class="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Create the first beginner module →
                </button>
              </div>
              <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ModuleCard
                  v-for="module in beginnerModules"
                  :key="module.id"
                  :module="module"
                  @edit="editModule"
                  @delete="deleteModule"
                />
              </div>
            </div>

            <!-- Advanced Modules -->
            <div v-if="activeTab === 'advanced'">
              <div v-if="advancedModules.length === 0" class="text-center py-12">
                <p class="text-gray-500 mb-4">No advanced modules yet</p>
                <button
                  @click="openCreateModal('advanced')"
                  class="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Create the first advanced module →
                </button>
              </div>
              <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ModuleCard
                  v-for="module in advancedModules"
                  :key="module.id"
                  :module="module"
                  @edit="editModule"
                  @delete="deleteModule"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Module Form Modal (Advanced with Content Editing) -->
    <ModuleFormAdvanced
      :isOpen="showModuleForm"
      :module="selectedModuleForEdit"
      :loading="formLoading"
      @close="closeModal"
      @submit="handleFormSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Delete Module?</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete "<strong>{{ moduleToDelete?.title }}</strong>"? This action cannot be undone.
        </p>
        <div class="flex items-center justify-end gap-3">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            :disabled="formLoading"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ formLoading ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <footer class="bg-primary-600 text-white text-center py-4">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import AdminHeader from '~/components/admindashboard/AdminHeader.vue'
import ModuleCard from '~/components/admindashboard/ModuleCard.vue'
import ModuleFormAdvanced from '~/components/admindashboard/ModuleFormAdvanced.vue'
import { useModuleManagement } from '~/composables/useModuleManagement'

useHead({
  title: 'Manage Modules - Admin - MIL MOOC',
})

const adminName = ref("Admin User")
const activeTab = ref('beginner')
const showModuleForm = ref(false)
const showDeleteConfirm = ref(false)
const selectedModuleForEdit = ref(null)
const moduleToDelete = ref(null)
const formLoading = ref(false)

const {
  modules,
  loading,
  error,
  fetchModules,
  createModule,
  updateModule,
  deleteModule: deleteModuleApi,
  beginnerModules,
  advancedModules,
  totalModules
} = useModuleManagement()

// Load modules on mount
onMounted(async () => {
  await fetchModules()
})

const openCreateModal = (level = null) => {
  selectedModuleForEdit.value = null
  showModuleForm.value = true
  // Pre-select level if provided
  if (level && selectedModuleForEdit.value) {
    selectedModuleForEdit.value.level = level
  }
}

const editModule = (module) => {
  selectedModuleForEdit.value = module
  showModuleForm.value = true
}

const closeModal = () => {
  showModuleForm.value = false
  selectedModuleForEdit.value = null
}

const handleFormSubmit = async (formData) => {
  formLoading.value = true
  try {
    if (selectedModuleForEdit.value?.id) {
      // Update existing module
      await updateModule(selectedModuleForEdit.value.id, formData)
    } else {
      // Create new module
      await createModule(formData)
    }
    closeModal()
  } catch (err) {
    console.error('Error saving module:', err)
  } finally {
    formLoading.value = false
  }
}

const deleteModule = (module) => {
  moduleToDelete.value = module
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!moduleToDelete.value?.id) return

  formLoading.value = true
  try {
    await deleteModuleApi(moduleToDelete.value.id)
    showDeleteConfirm.value = false
    moduleToDelete.value = null
  } catch (err) {
    console.error('Error deleting module:', err)
  } finally {
    formLoading.value = false
  }
}
</script>


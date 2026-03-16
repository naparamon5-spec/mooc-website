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
            @click="openCreateModal()"
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

        <!-- Tabs -->
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

    <!-- FOOTER -->
    <footer class="bg-primary-600 text-white text-center py-4">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>

    <!-- ── Module Form Modal ── -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showModuleForm"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="closeModal"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="closeModal" />

          <!-- Panel -->
          <div class="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] ring-1 ring-gray-200">

            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
              <div>
                <h3 class="text-base font-semibold text-gray-900 leading-tight">
                  {{ selectedModuleForEdit ? 'Edit Module' : 'Create New Module' }}
                </h3>
                <p class="text-xs text-gray-400 mt-0.5">
                  {{ selectedModuleForEdit ? 'Update module details and content' : 'Fill in the details to add a new module' }}
                </p>
              </div>
              <button
                @click="closeModal"
                class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Scrollable body -->
            <div class="overflow-y-auto flex-1 px-6 py-5">
              <ModuleFormAdvanced
                :isOpen="showModuleForm"
                :module="selectedModuleForEdit"
                :loading="formLoading"
                @close="closeModal"
                @submit="handleFormSubmit"
              />
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── Delete Confirmation Modal ── -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showDeleteConfirm"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="showDeleteConfirm = false"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="showDeleteConfirm = false" />

          <!-- Panel -->
          <div class="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md ring-1 ring-gray-200">

            <!-- Header -->
            <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
              <div class="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 class="text-base font-semibold text-gray-900 leading-tight">Delete Module</h3>
                <p class="text-xs text-gray-400 mt-0.5">This action cannot be undone</p>
              </div>
            </div>

            <!-- Body -->
            <div class="px-6 py-5">
              <p class="text-sm text-gray-600">
                Are you sure you want to delete
                <span class="font-semibold text-gray-900">"{{ moduleToDelete?.title }}"</span>?
                All content inside this module will be permanently removed.
              </p>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                @click="showDeleteConfirm = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                @click="confirmDelete"
                :disabled="formLoading"
                class="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg v-if="formLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                {{ formLoading ? 'Deleting...' : 'Delete Module' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
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

const adminName = ref('Admin User')
const activeTab = ref('beginner')
const showModuleForm = ref(false)
const showDeleteConfirm = ref(false)
const selectedModuleForEdit = ref(null)
const moduleToDelete = ref(null)
const formLoading = ref(false)
const preselectedLevel = ref(null)

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

onMounted(async () => {
  await fetchModules()
})

const openCreateModal = (level = null) => {
  selectedModuleForEdit.value = null
  preselectedLevel.value = level
  showModuleForm.value = true
}

const editModule = (module) => {
  selectedModuleForEdit.value = module
  showModuleForm.value = true
}

const closeModal = () => {
  showModuleForm.value = false
  selectedModuleForEdit.value = null
  preselectedLevel.value = null
}

const handleFormSubmit = async (formData) => {
  formLoading.value = true
  try {
    if (selectedModuleForEdit.value?.id) {
      await updateModule(selectedModuleForEdit.value.id, formData)
    } else {
      await createModule({ ...formData, level: formData.level || preselectedLevel.value })
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

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative {
  transform: scale(0.96) translateY(8px);
  opacity: 0;
}
.modal-leave-to .relative {
  transform: scale(0.96) translateY(8px);
  opacity: 0;
}
</style>
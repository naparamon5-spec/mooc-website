<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
    >
      <!-- Header -->
      <div
        class="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white"
      >
        <h2 class="text-2xl font-bold text-gray-900">
          {{ isEditMode ? 'Edit Module' : 'Create New Module' }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>

      <!-- Form -->
      <div class="p-6 space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Module Title *
          </label>
          <input
            v-model="form.title"
            type="text"
            class="w-full px-4 py-2 border rounded-lg"
            placeholder="MODULE 1: Introduction"
          />
        </div>

        <!-- Level + Emoji -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">Level *</label>
            <select v-model="form.level" class="w-full px-4 py-2 border rounded-lg">
              <option value="">Select Level</option>
              <option value="beginner">Beginner</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Emoji *</label>
            <input
              v-model="form.emoji"
              type="text"
              maxlength="2"
              class="w-full px-4 py-2 border rounded-lg"
              placeholder="📘"
            />
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium mb-2">Description *</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <!-- Image -->
        <div>
          <label class="block text-sm font-medium mb-2">Module Image</label>

          <div v-if="imagePreview || form.image_url" class="relative mb-3">
            <img
              :src="imagePreview || form.image_url"
              class="w-full h-48 object-cover rounded border"
            />
            <button
              v-if="imagePreview"
              @click="clearImage"
              class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>

          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleImageUpload"
          />

          <button
            type="button"
            @click="fileInput?.click()"
            class="px-4 py-2 border rounded-lg"
          >
            {{ imagePreview ? 'Change Image' : 'Upload Image' }}
          </button>
        </div>

        <!-- Learning Outcomes -->
        <div>
          <label class="block text-sm font-medium mb-2">Learning Outcomes</label>

          <div
            v-for="(outcome, index) in form.learning_outcomes"
            :key="index"
            class="flex gap-2 mb-2"
          >
            <input
              v-model="form.learning_outcomes[index]"
              class="flex-1 px-4 py-2 border rounded-lg"
            />
            <button
              @click="removeOutcome(index)"
              class="text-red-600"
            >
              Remove
            </button>
          </div>

          <button
            @click="addOutcome"
            class="px-4 py-2 border rounded-lg text-sm"
          >
            + Add Outcome
          </button>
        </div>

        <!-- Active -->
        <div class="flex items-center gap-2">
          <input type="checkbox" v-model="form.is_active" />
          <span>Active Module</span>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="sticky bottom-0 flex justify-end gap-3 p-6 border-t bg-gray-50"
      >
        <button
          @click="$emit('close')"
          class="px-6 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          @click="handleSubmit"
          :disabled="loading"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {{ loading ? 'Saving...' : isEditMode ? 'Update' : 'Create' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  module: Object,
  loading: Boolean
})

const emit = defineEmits(['close', 'submit'])

const fileInput = ref(null)
const imagePreview = ref('')
const imageFile = ref(null)

const form = ref({
  title: '',
  level: '',
  emoji: '',
  description: '',
  learning_outcomes: [],
  is_active: true,
  image_url: ''
})

const isEditMode = computed(() => !!props.module?.id)

watch(
  () => props.module,
  (m) => {
    if (!m) return
    form.value = {
      title: m.title || '',
      level: m.level || '',
      emoji: m.emoji || '',
      description: m.description || '',
      learning_outcomes: Array.isArray(m.learning_outcomes) ? [...m.learning_outcomes] : [],
      is_active: m.is_active !== false,
      image_url: m.image_url || ''
    }
    imagePreview.value = m.image_url || ''
  },
  { immediate: true }
)

const addOutcome = () => {
  form.value.learning_outcomes.push('')
}

const removeOutcome = (i) => {
  form.value.learning_outcomes.splice(i, 1)
}

const handleImageUpload = (e) => {
  const file = e.target.files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    alert('Max 5MB only')
    return
  }

  imageFile.value = file

  const reader = new FileReader()
  reader.onload = (ev) => {
    imagePreview.value = ev.target.result
  }
  reader.readAsDataURL(file)
}

const clearImage = () => {
  imagePreview.value = ''
  imageFile.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const handleSubmit = () => {
  if (!form.value.title || !form.value.level || !form.value.emoji || !form.value.description) {
    alert('Fill all required fields')
    return
  }

  emit('submit', {
    ...form.value,
    learning_outcomes: form.value.learning_outcomes.filter(o => o.trim()),
    imageFile: imageFile.value
  })
}
</script>

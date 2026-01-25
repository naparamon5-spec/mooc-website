<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
      <!-- Header -->
      <div class="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
        <h2 class="text-2xl font-bold text-gray-900">
          {{ isEditMode ? 'Edit Module' : 'Create New Module' }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-200 bg-gray-50 px-6">
        <button
          @click="activeTab = 'basic'"
          :class="[
            'px-6 py-4 font-medium transition-colors border-b-2',
            activeTab === 'basic'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          ]"
        >
          Basic Info
        </button>
        <button
          @click="activeTab = 'content'"
          :class="[
            'px-6 py-4 font-medium transition-colors border-b-2',
            activeTab === 'content'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          ]"
        >
          Content & Lessons
        </button>
      </div>

      <!-- Form Content -->
      <div class="p-6 space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto">
        <!-- BASIC INFO TAB -->
        <div v-if="activeTab === 'basic'" class="space-y-6">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Module Title <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., MODULE 1: Introduction to Media Literacy"
            />
          </div>

          <!-- Subtitle -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Subtitle (Optional)
            </label>
            <input
              v-model="form.subtitle"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Beginner Level"
            />
          </div>

          <!-- Level and Emoji -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Level <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.level"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Level</option>
                <option value="beginner">Beginner</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Emoji Icon <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.emoji"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., 📚"
                maxlength="2"
              />
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Description <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.description"
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Module description..."
            />
          </div>

          <!-- Image Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Module Image
            </label>
            <div class="space-y-3">
              <!-- Image Preview -->
              <div v-if="imagePreview || form.image_url" class="relative">
                <img 
                  :src="imagePreview || form.image_url" 
                  alt="Module preview" 
                  class="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
                <button
                  v-if="imagePreview"
                  @click="clearImage"
                  type="button"
                  class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <!-- File Input -->
              <div class="flex items-center gap-3">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleModuleImageUpload"
                  class="hidden"
                />
                <button
                  @click="fileInput?.$el?.click() || $refs.fileInput?.click()"
                  type="button"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {{ imagePreview ? 'Change Image' : 'Upload Image' }}
                </button>
                <span v-if="!imagePreview && !form.image_url" class="text-sm text-gray-500">
                  JPG, PNG, WebP (Max 5MB)
                </span>
              </div>
            </div>
          </div>

          <!-- Learning Outcomes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Learning Outcomes
            </label>
            <div class="space-y-2 mb-3">
              <div v-for="(outcome, index) in form.learning_outcomes" :key="index" class="flex gap-2">
                <input
                  v-model="form.learning_outcomes[index]"
                  type="text"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Learning outcome..."
                />
                <button
                  @click="removeOutcome(index)"
                  class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
            <button
              @click="addOutcome"
              class="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors"
            >
              + Add Outcome
            </button>
          </div>

          <!-- Is Active -->
          <div class="flex items-center gap-3">
            <input
              v-model="form.is_active"
              type="checkbox"
              id="is_active"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
            />
            <label for="is_active" class="text-sm font-medium text-gray-700">
              Active Module
            </label>
          </div>
        </div>

        <!-- CONTENT & LESSONS TAB -->
        <div v-if="activeTab === 'content'" class="space-y-6">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Module Lessons</h3>
              <button
                @click="addLesson"
                class="px-3 py-2 text-sm font-medium text-primary-600 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors"
              >
                + Add Lesson
              </button>
            </div>

            <div v-if="form.lessons.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
              <p class="text-gray-500">No lessons yet. Click "Add Lesson" to create one.</p>
            </div>

            <div v-else class="space-y-6">
              <div
                v-for="(lesson, index) in form.lessons"
                :key="index"
                class="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <!-- Lesson Header -->
                <div class="flex items-center justify-between mb-4">
                  <h4 class="font-semibold text-gray-900">Lesson {{ index + 1 }}</h4>
                  <button
                    @click="removeLesson(index)"
                    class="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    Remove
                  </button>
                </div>

                <!-- Lesson Title -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Title <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.lessons[index].title"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Introduction to MIL"
                  />
                </div>

                <!-- Lesson Content -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    HTML Content <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    v-model="form.lessons[index].htmlContent"
                    rows="6"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                    placeholder="HTML content (supports basic HTML tags)..."
                  />
                  <p class="text-xs text-gray-500 mt-2">
                    Tip: You can use basic HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;img&gt;, etc.
                  </p>
                </div>

                <!-- Image Upload for Lesson -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Add Image to Lesson
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    @change="(e) => handleImageUpload(e, index)"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p class="text-xs text-gray-500 mt-2">
                    After upload, the image URL will be added to your content
                  </p>
                  <div v-if="form.lessons[index].image_url" class="mt-3 p-3 bg-white rounded border border-gray-200">
                    <p class="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                    <img
                      :src="form.lessons[index].image_url"
                      :alt="form.lessons[index].title"
                      class="max-w-full h-32 object-cover rounded"
                    />
                    <button
                      @click="removeImage(index)"
                      class="mt-2 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="sticky bottom-0 flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
        <button
          @click="$emit('close')"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          @click="handleSubmit"
          :disabled="loading"
          class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Saving...' : (isEditMode ? 'Update Module' : 'Create Module') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  module: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

const activeTab = ref('basic')
const fileInput = ref(null)
const imagePreview = ref('')
const imageFile = ref(null)

const form = ref({
  title: '',
  subtitle: '',
  level: '',
  emoji: '',
  description: '',
  image_url: '',
  learning_outcomes: [],
  is_active: true,
  lessons: []
})

const isEditMode = computed(() => !!props.module?.id)

const resetForm = () => {
  form.value = {
    title: '',
    subtitle: '',
    level: '',
    emoji: '',
    description: '',
    image_url: '',
    learning_outcomes: [],
    is_active: true,
    lessons: []
  }
  imagePreview.value = ''
  imageFile.value = null
}

// Watch for module changes to populate form
watch(
  () => props.module,
  (newModule) => {
    if (newModule) {
      form.value = {
        title: newModule.title || '',
        subtitle: newModule.subtitle || '',
        level: newModule.level || '',
        emoji: newModule.emoji || '',
        description: newModule.description || '',
        image_url: newModule.image_url || '',
        learning_outcomes: Array.isArray(newModule.learning_outcomes) 
          ? [...newModule.learning_outcomes]
          : [],
        is_active: newModule.is_active !== false,
        lessons: Array.isArray(newModule.lessons) && newModule.lessons.length > 0
          ? JSON.parse(JSON.stringify(newModule.lessons))
          : []
      }
      imagePreview.value = newModule.image_url || ''
      imageFile.value = null
    } else {
      resetForm()
      activeTab.value = 'basic'
    }
  },
  { immediate: true }
)

const addOutcome = () => {
  form.value.learning_outcomes.push('')
}

const removeOutcome = (index) => {
  form.value.learning_outcomes.splice(index, 1)
}

const addLesson = () => {
  form.value.lessons.push({
    title: '',
    htmlContent: '',
    image_url: ''
  })
}

const removeLesson = (index) => {
  form.value.lessons.splice(index, 1)
}

const removeImage = (index) => {
  form.value.lessons[index].image_url = ''
}

const handleModuleImageUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image size must be less than 5MB')
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file')
    return
  }

  imageFile.value = file

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result || ''
  }
  reader.readAsDataURL(file)
}

const clearImage = () => {
  imagePreview.value = ''
  imageFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleImageUpload = (event, lessonIndex) => {
  const file = event.target.files?.[0]
  if (!file) return

  // Create a FileReader to convert image to base64
  const reader = new FileReader()
  reader.onload = (e) => {
    // Store as data URL (base64)
    form.value.lessons[lessonIndex].image_url = e.target?.result || ''
  }
  reader.readAsDataURL(file)
}

const handleSubmit = () => {
  if (!form.value.title || !form.value.level || !form.value.emoji || !form.value.description) {
    alert('Please fill in all required basic fields')
    return
  }

  const outcomes = form.value.learning_outcomes.filter(o => o.trim() !== '')
  const lessons = form.value.lessons.filter(l => l.title.trim() && l.htmlContent.trim())

  emit('submit', {
    ...form.value,
    learning_outcomes: outcomes,
    lessons: lessons.length > 0 ? lessons : undefined,
    imageFile: imageFile.value
  })
}
</script>

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

          <!-- Level (full width now) -->
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

              <div class="flex items-center gap-3">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleModuleImageUpload"
                  class="hidden"
                />
                <button
                  @click="$refs.fileInput?.click()"
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
                <div class="flex items-center justify-between mb-4">
                  <h4 class="font-semibold text-gray-900">Lesson {{ index + 1 }}</h4>
                  <button
                    @click="removeLesson(index)"
                    class="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    Remove
                  </button>
                </div>

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

                <!-- Lesson Content Blocks (NO HTML) -->
                <div class="mb-4">
                  <div class="flex items-center justify-between mb-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Lesson Content <span class="text-red-500">*</span>
                    </label>
                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        @click="addTextBlock(index)"
                        class="px-3 py-1 text-sm font-medium text-primary-600 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors"
                      >
                        + Text
                      </button>
                      <button
                        type="button"
                        @click="addImageBlock(index)"
                        class="px-3 py-1 text-sm font-medium text-primary-600 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors"
                      >
                        + Image
                      </button>
                    </div>
                  </div>

                  <p class="text-xs text-gray-500 mb-3">
                    Use the blocks below to match the template: text → image → text (repeat as needed). No HTML tags.
                  </p>

                  <div v-if="!Array.isArray(lesson.blocks) || lesson.blocks.length === 0" class="text-center py-6 bg-white rounded border border-gray-200">
                    <p class="text-sm text-gray-600">No content blocks yet. Add a Text block to start.</p>
                  </div>

                  <div v-else class="space-y-4">
                    <div
                      v-for="(block, blockIndex) in lesson.blocks"
                      :key="`${index}-${blockIndex}`"
                      class="bg-white rounded-lg border border-gray-200 p-3"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <p class="text-sm font-semibold text-gray-800">
                          {{ block.type === 'image' ? 'Image' : 'Text' }} Block {{ blockIndex + 1 }}
                        </p>
                        <button
                          type="button"
                          @click="removeBlock(index, blockIndex)"
                          class="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          Remove
                        </button>
                      </div>

                      <div v-if="block.type === 'text'">
                        <textarea
                          v-model="form.lessons[index].blocks[blockIndex].text"
                          rows="6"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Write your lesson content here..."
                        />
                        <p class="text-xs text-gray-500 mt-2">
                          Tip: Use blank lines to separate paragraphs. Lists can be written with dashes.
                        </p>
                      </div>

                      <div v-else-if="block.type === 'image'" class="space-y-3">
                        <input
                          type="file"
                          accept="image/*"
                          @change="(e) => handleBlockImageUpload(e, index, blockIndex)"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <div v-if="block.src" class="p-3 bg-gray-50 rounded border border-gray-200">
                          <p class="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                          <img
                            :src="block.src"
                            :alt="form.lessons[index].title || 'Lesson image'"
                            class="w-full max-h-72 object-contain rounded"
                          />
                          <button
                            type="button"
                            @click="clearBlockImage(index, blockIndex)"
                            class="mt-2 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            Remove Image
                          </button>
                        </div>
                        <p class="text-xs text-gray-500">
                          Upload an image to display between text sections (you can add multiple image blocks).
                        </p>
                      </div>
                    </div>
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

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  module: { type: Object, default: null },
  loading: { type: Boolean, default: false }
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
    description: '',
    image_url: '',
    learning_outcomes: [],
    is_active: true,
    lessons: []
  }
  imagePreview.value = ''
  imageFile.value = null
}

const normalizeLesson = (lesson: any) => {
  const safeLesson = { ...(lesson || {}) }

  const stripHtmlToText = (input: string) => {
    // Lightweight sanitizer for legacy stored HTML so it doesn't show raw tags in the new editor.
    // Convert common block separators to newlines, then strip remaining tags.
    return (input || '')
      .replace(/<\s*br\s*\/?\s*>/gi, '\n')
      .replace(/<\/\s*p\s*>/gi, '\n\n')
      .replace(/<\/\s*li\s*>/gi, '\n')
      .replace(/<\s*li[^>]*>/gi, '- ')
      .replace(/<\/\s*(ul|ol)\s*>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }

  // Backward compatibility: if old htmlContent/image_url exist, convert into blocks.
  if (!Array.isArray(safeLesson.blocks) || safeLesson.blocks.length === 0) {
    const blocks: any[] = []

    const htmlContent = typeof safeLesson.htmlContent === 'string' ? safeLesson.htmlContent.trim() : ''
    if (htmlContent) {
      blocks.push({ type: 'text', text: stripHtmlToText(htmlContent) })
    }

    const imageUrl = typeof safeLesson.image_url === 'string' ? safeLesson.image_url.trim() : ''
    if (imageUrl) {
      blocks.push({ type: 'image', src: imageUrl })
    }

    safeLesson.blocks = blocks
  } else {
    // Ensure each block has expected shape
    safeLesson.blocks = safeLesson.blocks
      .filter((b: any) => b && (b.type === 'text' || b.type === 'image'))
      .map((b: any) => (b.type === 'image'
        ? { type: 'image', src: b.src || '' }
        : { type: 'text', text: b.text || '' }
      ))
  }

  // Remove legacy fields from UI usage (keep them if needed elsewhere; submit will omit them)
  return safeLesson
}

watch(
  () => props.module,
  (newModule) => {
    if (newModule) {
      form.value.title = newModule.title || ''
      form.value.subtitle = newModule.subtitle || ''
      form.value.level = newModule.level || ''
      form.value.description = newModule.description || ''
      form.value.image_url = newModule.image_url || ''
      form.value.learning_outcomes = Array.isArray(newModule.learning_outcomes)
        ? [...newModule.learning_outcomes]
        : []
      form.value.is_active = newModule.is_active !== false
      form.value.lessons = Array.isArray(newModule.lessons) && newModule.lessons.length > 0
        ? JSON.parse(JSON.stringify(newModule.lessons)).map((l: any) => normalizeLesson(l))
        : []
      imagePreview.value = newModule.image_url || ''
      imageFile.value = null
    } else {
      resetForm()
      activeTab.value = 'basic'
    }
  },
  { immediate: true }
)

const addOutcome = () => form.value.learning_outcomes.push('')
const removeOutcome = (index) => form.value.learning_outcomes.splice(index, 1)
const addLesson = () => form.value.lessons.push({ title: '', blocks: [{ type: 'text', text: '' }] })
const removeLesson = (index) => form.value.lessons.splice(index, 1)

const addTextBlock = (lessonIndex: number) => {
  if (!Array.isArray(form.value.lessons[lessonIndex].blocks)) form.value.lessons[lessonIndex].blocks = []
  form.value.lessons[lessonIndex].blocks.push({ type: 'text', text: '' })
}

const addImageBlock = (lessonIndex: number) => {
  if (!Array.isArray(form.value.lessons[lessonIndex].blocks)) form.value.lessons[lessonIndex].blocks = []
  form.value.lessons[lessonIndex].blocks.push({ type: 'image', src: '' })
}

const removeBlock = (lessonIndex: number, blockIndex: number) => {
  if (!Array.isArray(form.value.lessons[lessonIndex].blocks)) return
  form.value.lessons[lessonIndex].blocks.splice(blockIndex, 1)
}

const handleModuleImageUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { alert('Image size must be less than 5MB'); return }
  if (!file.type.startsWith('image/')) { alert('Please select a valid image file'); return }
  imageFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => { imagePreview.value = e.target?.result || '' }
  reader.readAsDataURL(file)
}

const clearImage = () => {
  imagePreview.value = ''
  imageFile.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const handleBlockImageUpload = (event: any, lessonIndex: number, blockIndex: number) => {
  const file = event.target.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { alert('Image size must be less than 5MB'); return }
  if (!file.type.startsWith('image/')) { alert('Please select a valid image file'); return }
  const reader = new FileReader()
  reader.onload = (e) => {
    if (!Array.isArray(form.value.lessons[lessonIndex].blocks)) form.value.lessons[lessonIndex].blocks = []
    if (!form.value.lessons[lessonIndex].blocks[blockIndex] || form.value.lessons[lessonIndex].blocks[blockIndex].type !== 'image') {
      return
    }
    form.value.lessons[lessonIndex].blocks[blockIndex].src = e.target?.result || ''
  }
  reader.readAsDataURL(file)
}

const clearBlockImage = (lessonIndex: number, blockIndex: number) => {
  if (!Array.isArray(form.value.lessons[lessonIndex].blocks)) return
  const block = form.value.lessons[lessonIndex].blocks[blockIndex]
  if (block?.type === 'image') block.src = ''
}

const handleSubmit = () => {
  if (!form.value.title || !form.value.level || !form.value.description) {
    alert('Please fill in all required fields')
    return
  }
  const outcomes = form.value.learning_outcomes.filter(o => o.trim() !== '')
  const lessons = form.value.lessons
    .map((l: any) => normalizeLesson(l))
    .map((l: any) => ({
      title: (l.title || '').trim(),
      blocks: Array.isArray(l.blocks) ? l.blocks : []
    }))
    .filter((l: any) => {
      if (!l.title) return false
      if (!Array.isArray(l.blocks) || l.blocks.length === 0) return false
      return l.blocks.some((b: any) => (
        (b.type === 'text' && typeof b.text === 'string' && b.text.trim() !== '') ||
        (b.type === 'image' && typeof b.src === 'string' && b.src.trim() !== '')
      ))
    })

  emit('submit', {
    ...form.value,
    learning_outcomes: outcomes,
    lessons: lessons.length > 0 ? lessons : undefined,
    imageFile: imageFile.value
  })
}
</script>
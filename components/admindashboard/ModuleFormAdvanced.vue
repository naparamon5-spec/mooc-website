<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
      <!-- Header -->
      <div class="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
        <h2 class="text-2xl font-bold text-gray-900">
          {{ isEditMode ? 'Edit Module' : 'Create New Module' }}
        </h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-200 bg-gray-50 px-6">
        <button
          @click="activeTab = 'basic'"
          :class="['px-6 py-4 font-medium transition-colors border-b-2', activeTab === 'basic' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-600 hover:text-gray-900']"
        >Basic Info</button>
        <button
          @click="activeTab = 'content'"
          :class="['px-6 py-4 font-medium transition-colors border-b-2', activeTab === 'content' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-600 hover:text-gray-900']"
        >Content & Lessons</button>
      </div>

      <!-- Form Content -->
      <div class="p-6 space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto">

        <!-- BASIC INFO TAB -->
        <div v-if="activeTab === 'basic'" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Module Title <span class="text-red-500">*</span></label>
            <input v-model="form.title" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g., MODULE 1: Introduction to Media Literacy" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Subtitle (Optional)</label>
            <input v-model="form.subtitle" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g., Beginner Level" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Introduction <span class="text-red-500">*</span></label>
            <textarea v-model="form.introduction" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="A brief introduction to this module..." />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Level <span class="text-red-500">*</span></label>
            <select v-model="form.level" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Select Level</option>
              <option value="beginner">Beginner</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description <span class="text-red-500">*</span></label>
            <textarea v-model="form.description" rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Module description..." />
          </div>

          <!-- Module Image -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Module Image</label>
            <div class="space-y-3">
              <div v-if="imagePreview || form.image_url" class="relative">
                <img :src="imagePreview || form.image_url" alt="Module preview" class="w-full h-48 object-cover rounded-lg border border-gray-300" />
                <button v-if="imagePreview" @click="clearImage" type="button" class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div class="flex items-center gap-3">
                <input ref="fileInput" type="file" accept="image/*" @change="handleModuleImageUpload" class="hidden" />
                <button @click="fileInput?.click()" type="button" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">{{ imagePreview ? 'Change Image' : 'Upload Image' }}</button>
                <span v-if="!imagePreview && !form.image_url" class="text-sm text-gray-500">JPG, PNG, WebP (Max 5MB)</span>
              </div>
            </div>
          </div>

          <!-- Module Card Image -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Module Card Image</label>
            <div class="space-y-3">
              <div v-if="cardImagePreview || form.card_image_url" class="relative">
                <img :src="cardImagePreview || form.card_image_url" alt="Module card preview" class="w-full h-48 object-cover rounded-lg border border-gray-300" />
                <button v-if="cardImagePreview" @click="clearCardImage" type="button" class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div class="flex items-center gap-3">
                <input ref="cardImageFileInput" type="file" accept="image/*" @change="handleCardImageUpload" class="hidden" />
                <button @click="cardImageFileInput?.click()" type="button" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">{{ cardImagePreview ? 'Change Image' : 'Upload Image' }}</button>
                <span v-if="!cardImagePreview && !form.card_image_url" class="text-sm text-gray-500">JPG, PNG, WebP (Max 5MB)</span>
              </div>
            </div>
          </div>

          <!-- Module Video -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Module Video</label>
            <div class="space-y-3">
              <div v-if="videoPreview || form.video_url" class="relative bg-gray-900 rounded-lg border border-gray-300 h-48 flex items-center justify-center">
                <video :src="videoPreview || form.video_url" class="w-full h-full object-contain rounded-lg" controls />
                <button v-if="videoPreview" @click="clearVideo" type="button" class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div class="flex items-center gap-3">
                <input ref="videoFileInput" type="file" accept="video/*" @change="handleVideoUpload" class="hidden" />
                <button @click="videoFileInput?.click()" type="button" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">{{ videoPreview ? 'Change Video' : 'Upload Video' }}</button>
                <span v-if="!videoPreview && !form.video_url" class="text-sm text-gray-500">MP4, WebM, OGG (Max 50MB)</span>
              </div>
            </div>
          </div>

          <!-- Module PPT -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Module PPT</label>
            <div class="space-y-3">
              <div v-if="pptFileName || form.ppt_url" class="bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-800 mb-1">Current / Selected PPT</p>
                  <p class="text-xs text-gray-500 break-all">{{ pptFileName || (form.ppt_url ? form.ppt_url.split('/').pop() : '') }}</p>
                  <a v-if="form.ppt_url" :href="form.ppt_url" target="_blank" rel="noopener noreferrer" class="text-sm text-primary-600 hover:text-primary-700 underline inline-block mt-2">Open PPT</a>
                </div>
                <button @click="clearPpt" type="button" class="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors shrink-0">Remove</button>
              </div>
              <div class="flex items-center gap-3">
                <input ref="pptFileInput" type="file" accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" @change="handlePptUpload" class="hidden" />
                <button @click="pptFileInput?.click()" type="button" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">{{ pptFileName ? 'Change PPT' : 'Upload PPT' }}</button>
                <span v-if="!pptFileName && !form.ppt_url" class="text-sm text-gray-500">PPT / PPTX (Max 50MB)</span>
              </div>
            </div>
          </div>

          <!-- Learning Outcomes Label -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Learning Outcomes Label (Optional)</label>
            <input v-model="form.learning_outcomes_label" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g., DepEd's Most Essential Learning Competencies" />
            <p class="text-xs text-gray-500 mt-1">This label will be displayed above the learning outcomes on the student dashboard</p>
          </div>

          <!-- Learning Outcomes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Learning Outcomes</label>
            <div class="space-y-2 mb-3">
              <div v-for="(outcome, index) in form.learning_outcomes" :key="index" class="flex gap-2">
                <input v-model="form.learning_outcomes[index]" type="text" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Learning outcome..." />
                <button @click="removeOutcome(index)" class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">Remove</button>
              </div>
            </div>
            <button @click="addOutcome" class="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors">+ Add Outcome</button>
          </div>

          <!-- Is Active -->
          <div class="flex items-center gap-3">
            <input v-model="form.is_active" type="checkbox" id="is_active" class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500" />
            <label for="is_active" class="text-sm font-medium text-gray-700">Active Module</label>
          </div>
        </div>

        <!-- CONTENT & LESSONS TAB -->
        <div v-if="activeTab === 'content'" class="space-y-6">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Module Lessons</h3>
              <button @click="addLesson" class="px-3 py-2 text-sm font-medium text-primary-600 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors">+ Add Lesson</button>
            </div>

            <div v-if="form.lessons.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
              <p class="text-gray-500">No lessons yet. Click "Add Lesson" to create one.</p>
            </div>

            <div v-else class="space-y-6">
              <div v-for="(lesson, index) in form.lessons" :key="index" class="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="font-semibold text-gray-900">Lesson {{ index + 1 }}</h4>
                  <button @click="removeLesson(index)" class="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors">Remove</button>
                </div>

                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Lesson Title <span class="text-red-500">*</span></label>
                  <input v-model="lesson.title" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g., Introduction to MIL" />
                </div>

                <!-- Lesson Content Blocks -->
                <div class="mb-4">
                  <div class="flex items-center justify-between mb-2">
                    <label class="block text-sm font-medium text-gray-700">Lesson Content <span class="text-red-500">*</span></label>
                    <div class="flex items-center gap-2">
                      <button type="button" @click="addTextBlock(index)" class="px-3 py-1 text-sm font-medium text-primary-600 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors">+ Text</button>
                      <button type="button" @click="addImageBlock(index)" class="px-3 py-1 text-sm font-medium text-primary-600 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors">+ Image</button>
                      <button type="button" @click="addVideoBlock(index)" class="px-3 py-1 text-sm font-medium text-primary-600 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors">+ Video</button>
                    </div>
                  </div>

                  <!-- Layout Legend -->
                  <div class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
                    <p class="font-semibold mb-1">💡 Layout Tips:</p>
                    <p>Set a block to <strong>Left (50%)</strong> and the next block to <strong>Right (50%)</strong> to display them side-by-side in one row. Mix text + image, image + text, video + text, etc. Use <strong>Full Width</strong> for standalone blocks.</p>
                  </div>

                  <div v-if="!Array.isArray(lesson.blocks) || lesson.blocks.length === 0" class="text-center py-6 bg-white rounded border border-gray-200">
                    <p class="text-sm text-gray-600">No content blocks yet. Add a Text block to start.</p>
                  </div>

                  <div v-else class="space-y-3">
                    <div
                      v-for="(block, blockIndex) in lesson.blocks"
                      :key="`${index}-${blockIndex}`"
                      class="bg-white rounded-lg border border-gray-200 p-3"
                      :class="{
                        'border-l-4 border-l-blue-400': block.layout === 'left',
                        'border-l-4 border-l-green-400': block.layout === 'right',
                        'border-l-4 border-l-purple-400': block.layout === 'center',
                      }"
                    >
                      <!-- Block Header: type label + layout selector + remove -->
                      <div class="flex items-center justify-between mb-3 gap-2 flex-wrap">
                        <div class="flex items-center gap-2">
                          <span class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
                            :class="{
                              'bg-gray-100 text-gray-700': block.type === 'text',
                              'bg-blue-100 text-blue-700': block.type === 'image',
                              'bg-purple-100 text-purple-700': block.type === 'video',
                            }"
                          >
                            <span v-if="block.type === 'text'">📝</span>
                            <span v-else-if="block.type === 'image'">🖼️</span>
                            <span v-else>🎬</span>
                            {{ block.type === 'image' ? 'Image' : block.type === 'video' ? 'Video' : 'Text' }} Block {{ blockIndex + 1 }}
                          </span>

                          <!-- Layout Selector -->
                          <div class="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1">
                            <span class="text-xs text-gray-500 mr-1 font-medium">Layout:</span>
                            <button
                              v-for="opt in layoutOptions"
                              :key="opt.value"
                              type="button"
                              @click="block.layout = opt.value as BlockLayout"
                              :title="opt.label"
                              class="px-2 py-1 text-xs rounded transition-colors font-medium"
                              :class="block.layout === opt.value
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-600 hover:bg-gray-200'"
                            >
                              {{ opt.icon }} {{ opt.label }}
                            </button>
                          </div>
                        </div>

                        <button type="button" @click="removeBlock(index, blockIndex)" class="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors">Remove</button>
                      </div>

                      <!-- Layout preview hint -->
                      <div v-if="block.layout === 'left' || block.layout === 'right'" class="mb-2 text-xs px-2 py-1 rounded inline-flex items-center gap-1"
                        :class="block.layout === 'left' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'"
                      >
                        <span>{{ block.layout === 'left' ? '⬅️ Left column (50%)' : '➡️ Right column (50%)' }}</span>
                        <span class="opacity-70">— pair with a {{ block.layout === 'left' ? 'Right' : 'Left' }} block to display side-by-side</span>
                      </div>
                      <div v-else-if="block.layout === 'center'" class="mb-2 text-xs px-2 py-1 rounded inline-flex items-center gap-1 bg-purple-50 text-purple-700">
                        ↔️ Centered
                      </div>

                      <!-- TEXT Block -->
                      <div v-if="block.type === 'text'">
                        <textarea
                          v-model="block.text"
                          rows="6"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Write your lesson content here..."
                        />
                        <p class="text-xs text-gray-500 mt-1">Use blank lines to separate paragraphs. Start lines with "- " for bullet lists.</p>
                      </div>

                      <!-- IMAGE Block -->
                      <div v-else-if="block.type === 'image'" class="space-y-3">
                        <!-- Alignment for image -->
                        <div v-if="block.layout === 'full-width' || block.layout === 'center'" class="flex items-center gap-2">
                          <span class="text-xs text-gray-500 font-medium">Image align:</span>
                          <div class="flex gap-1">
                            <button v-for="align in ['left','center','right']" :key="align" type="button"
                              @click="block.align = align as BlockAlign"
                              class="px-2 py-1 text-xs rounded border transition-colors"
                              :class="(block.align || 'center') === align ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 text-gray-600 hover:bg-gray-100'"
                            >
                              {{ align === 'left' ? '⬅ Left' : align === 'center' ? '↔ Center' : 'Right ➡' }}
                            </button>
                          </div>
                        </div>
                        <input type="file" accept="image/*" @change="(e) => handleBlockImageUpload(e, index, blockIndex)" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        <div v-if="block.src" class="p-3 bg-gray-50 rounded border border-gray-200">
                          <p class="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                          <img :src="block.src" :alt="lesson.title || 'Lesson image'" class="w-full max-h-72 object-contain rounded" />
                          <button type="button" @click="clearBlockImage(index, blockIndex)" class="mt-2 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors">Remove Image</button>
                        </div>
                        <p class="text-xs text-gray-500">Upload an image to display in this block.</p>
                      </div>

                      <!-- VIDEO Block -->
                      <div v-else-if="block.type === 'video'" class="space-y-3">
                        <input type="file" accept="video/*" @change="(e) => handleBlockVideoUpload(e, index, blockIndex)" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        <div v-if="block.src" class="p-3 bg-gray-50 rounded border border-gray-200">
                          <p class="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                          <video :src="block.src" class="w-full max-h-72 object-contain rounded" controls />
                          <button type="button" @click="clearBlockVideo(index, blockIndex)" class="mt-2 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors">Remove Video</button>
                        </div>
                        <p class="text-xs text-gray-500">Upload a video to display in this block.</p>
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
        <button @click="$emit('close')" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">Cancel</button>
        <button @click="handleSubmit" :disabled="loading" class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
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
const fileInput = ref<HTMLInputElement | null>(null)
const imagePreview = ref<string>('')
const imageFile = ref<File | null>(null)
const cardImageFileInput = ref<HTMLInputElement | null>(null)
const cardImagePreview = ref<string>('')
const cardImageFile = ref<File | null>(null)
const videoFileInput = ref<HTMLInputElement | null>(null)
const videoPreview = ref<string>('')
const videoFile = ref<File | null>(null)
const pptFileInput = ref<HTMLInputElement | null>(null)
const pptFileName = ref<string>('')
const pptFile = ref<File | null>(null)

/**
 * Layout options for blocks.
 *
 * full-width : spans the entire content column
 * left       : occupies the left 50% of a two-column row
 * right      : occupies the right 50% of a two-column row
 * center     : 60% width, horizontally centered
 */
const layoutOptions = [
  { value: 'full-width', label: 'Full',   icon: '⬛' },
  { value: 'left',       label: 'Left',   icon: '⬅️' },
  { value: 'right',      label: 'Right',  icon: '➡️' },
  { value: 'center',     label: 'Center', icon: '↔️' },
]

type BlockLayout = 'full-width' | 'left' | 'right' | 'center'
type BlockAlign  = 'left' | 'center' | 'right'

interface LessonBlock {
  type: 'text' | 'image' | 'video'
  text?: string
  src?: string
  layout?: BlockLayout   // NEW
  align?: BlockAlign     // NEW — extra alignment hint for images inside full-width / center
}

interface Lesson {
  title: string
  blocks: LessonBlock[]
}

interface ModuleForm {
  title: string
  subtitle: string
  introduction: string
  level: string
  description: string
  learning_outcomes_label: string
  image_url: string
  card_image_url: string
  video_url: string
  ppt_url: string
  learning_outcomes: string[]
  is_active: boolean
  lessons: Lesson[]
}

const form = ref<ModuleForm>({
  title: '',
  subtitle: '',
  introduction: '',
  level: '',
  description: '',
  learning_outcomes_label: "DepEd's Most Essential Learning Competencies",
  image_url: '',
  card_image_url: '',
  video_url: '',
  ppt_url: '',
  learning_outcomes: [],
  is_active: true,
  lessons: []
})

const isEditMode = computed(() => !!props.module?.id)

const resetForm = () => {
  form.value = {
    title: '', subtitle: '', introduction: '', level: '', description: '',
    learning_outcomes_label: "DepEd's Most Essential Learning Competencies",
    image_url: '', card_image_url: '', video_url: '', ppt_url: '',
    learning_outcomes: [], is_active: true, lessons: []
  }
  imagePreview.value = ''; imageFile.value = null
  cardImagePreview.value = ''; cardImageFile.value = null
  videoPreview.value = ''; videoFile.value = null
  pptFileName.value = ''; pptFile.value = null
}

const normalizeLesson = (lesson: any) => {
  const safeLesson = { ...(lesson || {}) }

  const stripHtmlToText = (input: string) =>
    (input || '')
      .replace(/<\s*br\s*\/?\s*>/gi, '\n').replace(/<\/\s*p\s*>/gi, '\n\n')
      .replace(/<\/\s*li\s*>/gi, '\n').replace(/<\s*li[^>]*>/gi, '- ')
      .replace(/<\/\s*(ul|ol)\s*>/gi, '\n\n').replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/\n{3,}/g, '\n\n').trim()

  if (!Array.isArray(safeLesson.blocks) || safeLesson.blocks.length === 0) {
    const blocks: any[] = []
    const htmlContent = typeof safeLesson.htmlContent === 'string' ? safeLesson.htmlContent.trim() : ''
    if (htmlContent) blocks.push({ type: 'text', text: stripHtmlToText(htmlContent), layout: 'full-width' })
    const imageUrl = typeof safeLesson.image_url === 'string' ? safeLesson.image_url.trim() : ''
    if (imageUrl) blocks.push({ type: 'image', src: imageUrl, layout: 'full-width', align: 'center' })
    safeLesson.blocks = blocks
  } else {
    safeLesson.blocks = safeLesson.blocks
      .filter((b: any) => b && (b.type === 'text' || b.type === 'image' || b.type === 'video'))
      .map((b: any) => {
        const base = { layout: (b.layout || 'full-width') as BlockLayout }
        if (b.type === 'image') return { type: 'image', src: b.src || '', align: b.align || 'center', ...base }
        if (b.type === 'video') return { type: 'video', src: b.src || '', ...base }
        return { type: 'text', text: b.text || '', ...base }
      })
  }
  return safeLesson
}

watch(
  () => props.module,
  (newModule) => {
    if (newModule) {
      form.value.title = newModule.title || ''
      form.value.subtitle = newModule.subtitle || ''
      form.value.introduction = newModule.introduction || ''
      form.value.level = newModule.level || ''
      form.value.description = newModule.description || ''
      form.value.learning_outcomes_label = newModule.learning_outcomes_label || "DepEd's Most Essential Learning Competencies"
      form.value.image_url = newModule.image_url || ''
      form.value.card_image_url = newModule.card_image_url || ''
      form.value.video_url = newModule.video_url || ''
      form.value.ppt_url = newModule.ppt_url || ''
      form.value.learning_outcomes = Array.isArray(newModule.learning_outcomes) ? [...newModule.learning_outcomes] : []
      form.value.is_active = newModule.is_active !== false
      form.value.lessons = Array.isArray(newModule.lessons) && newModule.lessons.length > 0
        ? JSON.parse(JSON.stringify(newModule.lessons)).map((l: any) => normalizeLesson(l)) : []
      imagePreview.value = newModule.image_url || ''; imageFile.value = null
      cardImagePreview.value = newModule.card_image_url || ''; cardImageFile.value = null
      videoPreview.value = newModule.video_url || ''; videoFile.value = null
      pptFileName.value = ''; pptFile.value = null
    } else {
      resetForm(); activeTab.value = 'basic'
    }
  },
  { immediate: true }
)

const addOutcome = () => form.value.learning_outcomes.push('')
const removeOutcome = (index: number) => form.value.learning_outcomes.splice(index, 1)
const addLesson = () => form.value.lessons.push({ title: '', blocks: [{ type: 'text', text: '', layout: 'full-width' }] })
const removeLesson = (index: number) => form.value.lessons.splice(index, 1)

const addTextBlock = (lessonIndex: number) => {
  const lesson = form.value.lessons[lessonIndex]
  if (lesson && !Array.isArray(lesson.blocks)) lesson.blocks = []
  if (lesson) lesson.blocks.push({ type: 'text', text: '', layout: 'full-width' })
}
const addImageBlock = (lessonIndex: number) => {
  const lesson = form.value.lessons[lessonIndex]
  if (lesson && !Array.isArray(lesson.blocks)) lesson.blocks = []
  if (lesson) lesson.blocks.push({ type: 'image', src: '', layout: 'full-width', align: 'center' })
}
const addVideoBlock = (lessonIndex: number) => {
  const lesson = form.value.lessons[lessonIndex]
  if (lesson && !Array.isArray(lesson.blocks)) lesson.blocks = []
  if (lesson) lesson.blocks.push({ type: 'video', src: '', layout: 'full-width' })
}
const removeBlock = (lessonIndex: number, blockIndex: number) => {
  const lesson = form.value.lessons[lessonIndex]
  if (!lesson || !Array.isArray(lesson.blocks)) return
  lesson.blocks.splice(blockIndex, 1)
}

// ── file handlers (unchanged) ──────────────────────────────────────────────
const handleModuleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { alert('Image size must be less than 5MB'); return }
  if (!file.type.startsWith('image/')) { alert('Please select a valid image file'); return }
  imageFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => { imagePreview.value = (e.target?.result as string) || '' }
  reader.readAsDataURL(file)
}
const clearImage = () => { imagePreview.value = ''; imageFile.value = null; if (fileInput.value) fileInput.value.value = '' }

const handleCardImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { alert('Image size must be less than 5MB'); return }
  if (!file.type.startsWith('image/')) { alert('Please select a valid image file'); return }
  cardImageFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => { cardImagePreview.value = (e.target?.result as string) || '' }
  reader.readAsDataURL(file)
}
const clearCardImage = () => { cardImagePreview.value = ''; cardImageFile.value = null; if (cardImageFileInput.value) cardImageFileInput.value.value = '' }

const handleVideoUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 50 * 1024 * 1024) { alert('Video size must be less than 50MB'); return }
  if (!file.type.startsWith('video/')) { alert('Please select a valid video file'); return }
  videoFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => { videoPreview.value = (e.target?.result as string) || '' }
  reader.readAsDataURL(file)
}
const clearVideo = () => { videoPreview.value = ''; videoFile.value = null; if (videoFileInput.value) videoFileInput.value.value = '' }

const handlePptUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 50 * 1024 * 1024) { alert('PPT size must be less than 50MB'); return }
  const lowerName = file.name.toLowerCase()
  const mimeOk = ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(file.type)
  if (!mimeOk && !lowerName.endsWith('.ppt') && !lowerName.endsWith('.pptx')) { alert('Please select a valid PPT/PPTX file'); return }
  pptFile.value = file; pptFileName.value = file.name
}
const clearPpt = () => {
  if (pptFileName.value) { pptFileName.value = ''; pptFile.value = null }
  else form.value.ppt_url = ''
  if (pptFileInput.value) pptFileInput.value.value = ''
}

const handleBlockImageUpload = (event: Event, lessonIndex: number, blockIndex: number) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { alert('Image size must be less than 5MB'); return }
  if (!file.type.startsWith('image/')) { alert('Please select a valid image file'); return }
  const reader = new FileReader()
  reader.onload = (e) => {
    const block = form.value.lessons[lessonIndex]?.blocks?.[blockIndex]
    if (block?.type === 'image') block.src = (e.target?.result as string) || ''
  }
  reader.readAsDataURL(file)
}
const clearBlockImage = (lessonIndex: number, blockIndex: number) => {
  const block = form.value.lessons[lessonIndex]?.blocks?.[blockIndex]
  if (block?.type === 'image') block.src = ''
}

const handleBlockVideoUpload = (event: Event, lessonIndex: number, blockIndex: number) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 50 * 1024 * 1024) { alert('Video size must be less than 50MB'); return }
  if (!file.type.startsWith('video/')) { alert('Please select a valid video file'); return }
  const reader = new FileReader()
  reader.onload = (e) => {
    const block = form.value.lessons[lessonIndex]?.blocks?.[blockIndex]
    if (block?.type === 'video') block.src = (e.target?.result as string) || ''
  }
  reader.readAsDataURL(file)
}
const clearBlockVideo = (lessonIndex: number, blockIndex: number) => {
  const block = form.value.lessons[lessonIndex]?.blocks?.[blockIndex]
  if (block?.type === 'video') block.src = ''
}

const handleSubmit = () => {
  if (!form.value.title || !form.value.introduction || !form.value.level || !form.value.description) {
    alert('Please fill in all required fields'); return
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
        (b.type === 'text'  && typeof b.text === 'string' && b.text.trim() !== '') ||
        (b.type === 'image' && typeof b.src  === 'string' && b.src.trim()  !== '') ||
        (b.type === 'video' && typeof b.src  === 'string' && b.src.trim()  !== '')
      ))
    })

  emit('submit', {
    ...form.value,
    learning_outcomes: outcomes,
    lessons: lessons.length > 0 ? lessons : undefined,
    imageFile: imageFile.value,
    cardImageFile: cardImageFile.value,
    videoFile: videoFile.value,
    pptFile: pptFile.value
  })
}
</script>
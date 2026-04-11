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
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Image Width (px)</label>
                  <input v-model="form.image_width" type="text" placeholder="e.g., 100%" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  <p class="text-xs text-gray-500 mt-1">Use % for responsive or px for fixed width</p>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Image Height (px)</label>
                  <input v-model="form.image_height" type="text" placeholder="e.g., auto" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  <p class="text-xs text-gray-500 mt-1">Use auto to maintain aspect ratio</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Module Thumbnail -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Module Thumbnail</label>
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

          <!-- Description Panel Image -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description Panel Image</label>
            <p class="text-xs text-gray-500 mb-3">
              This image appears on the right side of the blue description card shown to students. If none is uploaded, the default Meli mascot will be shown.
            </p>
            <div class="space-y-3">
              <div v-if="descPanelImagePreview || form.description_panel_image_url" class="relative">
                <img
                  :src="descPanelImagePreview || form.description_panel_image_url"
                  alt="Description panel image preview"
                  class="w-full h-48 object-contain rounded-lg border border-gray-300 bg-blue-50"
                />
                <button
                  v-if="descPanelImagePreview || form.description_panel_image_url"
                  @click="clearDescPanelImage"
                  type="button"
                  class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div class="flex items-center gap-3">
                <input ref="descPanelImageFileInput" type="file" accept="image/*" @change="handleDescPanelImageUpload" class="hidden" />
                <button @click="descPanelImageFileInput?.click()" type="button" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  {{ descPanelImagePreview || form.description_panel_image_url ? 'Change Image' : 'Upload Image' }}
                </button>
                <span v-if="!descPanelImagePreview && !form.description_panel_image_url" class="text-sm text-gray-500">JPG, PNG, WebP (Max 5MB)</span>
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
                      <!-- Block Header -->
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
                        <!-- Toolbar -->
                        <div class="mb-2 flex flex-wrap items-center gap-1.5">
                          <!-- Bold -->
                          <button
                            type="button"
                            @mousedown.prevent="applyFormat(index, blockIndex, 'bold')"
                            class="px-3 py-1 text-xs font-bold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
                            title="Bold (Ctrl+B)"
                          >B</button>

                          <!-- Italic -->
                          <button
                            type="button"
                            @mousedown.prevent="applyFormat(index, blockIndex, 'italic')"
                            class="px-3 py-1 text-xs italic text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
                            title="Italic (Ctrl+I)"
                          >I</button>

                          <!-- Underline -->
                          <button
                            type="button"
                            @mousedown.prevent="applyFormat(index, blockIndex, 'underline')"
                            class="px-3 py-1 text-xs underline text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
                            title="Underline (Ctrl+U)"
                          >U</button>

                          <!-- Bullet List -->
                          <button
                            type="button"
                            @mousedown.prevent="applyFormat(index, blockIndex, 'insertUnorderedList')"
                            class="px-3 py-1 text-xs text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
                            title="Bullet List"
                          >• List</button>

                          <!-- Font Size control — all mousedown.prevent to keep editor selection alive -->
                          <div class="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-1.5 py-0.5">
                            <!-- Decrease -->
                            <button
                              type="button"
                              @mousedown.prevent="changeFontSizeBy(index, blockIndex, -1)"
                              class="w-5 h-5 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded text-sm font-bold leading-none select-none"
                              title="Decrease font size"
                            >−</button>

                            <!-- Size input: mousedown.prevent keeps editor selection; focus still works via click -->
                            <input
                              :id="`lesson-fs-${index}-${blockIndex}`"
                              type="text"
                              :value="getFontSizeDisplay(index, blockIndex)"
                              inputmode="numeric"
                              autocomplete="off"
                              maxlength="3"
                              placeholder="16"
                              class="w-9 px-1 py-0.5 text-xs border border-gray-200 rounded text-gray-900 text-center font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-primary-500"
                              @mousedown.prevent="onFontSizeInputMousedown(index, blockIndex, $event)"
                              @focus="onFontSizeInputFocus(index, blockIndex, $event)"
                              @blur="onFontSizeInputBlur(index, blockIndex, $event)"
                              @input="onFontSizeInputChange(index, blockIndex, $event)"
                              @keydown.enter.prevent="onFontSizeInputEnter(index, blockIndex, $event)"
                              @keydown.up.prevent="changeFontSizeBy(index, blockIndex, 1)"
                              @keydown.down.prevent="changeFontSizeBy(index, blockIndex, -1)"
                            />

                            <!-- Increase -->
                            <button
                              type="button"
                              @mousedown.prevent="changeFontSizeBy(index, blockIndex, 1)"
                              class="w-5 h-5 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded text-sm font-bold leading-none select-none"
                              title="Increase font size"
                            >+</button>
                          </div>

                          <!-- Highlight -->
                          <button
                            type="button"
                            @mousedown.prevent="applyHighlight(index, blockIndex)"
                            class="px-3 py-1 text-xs text-amber-900 border border-amber-300 rounded-lg bg-amber-50 hover:bg-amber-100 active:bg-amber-200 transition-colors"
                            title="Highlight"
                          >Mark</button>

                          <!-- Link -->
                          <button
                            type="button"
                            @mousedown.prevent="openLinkModal(index, blockIndex)"
                            class="px-3 py-1 text-xs text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 active:bg-blue-100 transition-colors"
                            title="Insert link"
                          >Link</button>

                          <!-- Clear -->
                          <button
                            type="button"
                            @mousedown.prevent="clearFormatting(index, blockIndex)"
                            class="px-3 py-1 text-xs text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
                            title="Clear Formatting"
                          >Clear</button>
                        </div>

                        <!-- Editor -->
                        <div
                          :ref="(el) => setTextBlockRef(el, index, blockIndex)"
                          class="min-h-[180px] w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1"
                          contenteditable="true"
                          spellcheck="true"
                          @input="handleTextBlockInput(index, blockIndex, $event)"
                          @blur="syncTextBlockHtml(index, blockIndex)"
                          @focus="onEditorFocus(index, blockIndex)"
                          @mouseup="onEditorSelectionChange(index, blockIndex)"
                          @keyup="onEditorSelectionChange(index, blockIndex)"
                          @keydown="handleEditorKeydown(index, blockIndex, $event)"
                          data-placeholder="Write your lesson content here..."
                        />
                        <p class="text-xs text-gray-500 mt-1">Select text then choose a size, or set the size first and start typing — just like Word.</p>
                      </div>

                      <!-- IMAGE Block -->
                      <div v-else-if="block.type === 'image'" class="space-y-3">
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
                        <div class="grid grid-cols-2 gap-3">
                          <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Width (Optional)</label>
                            <input v-model="block.width" type="text" placeholder="e.g., 300px, 50%, auto" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            <p class="text-xs text-gray-400 mt-1">Leave empty for responsive width</p>
                          </div>
                          <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Height (Optional)</label>
                            <input v-model="block.height" type="text" placeholder="e.g., 200px, auto" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            <p class="text-xs text-gray-400 mt-1">Leave empty for auto height</p>
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

    <!-- Insert link dialog -->
    <Teleport to="body">
      <div
        v-if="showLinkModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="link-modal-title"
      >
        <div class="absolute inset-0 bg-black/55 backdrop-blur-sm" @click="closeLinkModal" />
        <div
          class="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden"
          @click.stop
        >
          <div class="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 text-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </span>
              <div>
                <h3 id="link-modal-title" class="text-lg font-semibold text-white">Add link</h3>
                <p class="text-xs text-primary-100">Paste a URL; optional label overrides selected text.</p>
              </div>
            </div>
            <button type="button" class="rounded-lg p-2 text-white/90 hover:bg-white/10 transition-colors" aria-label="Close" @click="closeLinkModal">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">URL <span class="text-red-500">*</span></label>
              <input
                ref="linkModalUrlInputRef"
                v-model="linkModalUrl"
                type="text"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
                placeholder="https://example.org or /internal-path"
                autocomplete="url"
                @keydown.enter.prevent="confirmLinkModal"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Link text <span class="text-gray-400 font-normal">(optional)</span></label>
              <input
                v-model="linkModalText"
                type="text"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
                placeholder="Shown to students; leave blank to keep selection"
                @keydown.enter.prevent="confirmLinkModal"
              />
            </div>
            <p v-if="linkModalError" class="text-sm text-red-600">{{ linkModalError }}</p>
            <div class="flex justify-end gap-2 pt-2">
              <button type="button" class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors" @click="closeLinkModal">Cancel</button>
              <button type="button" class="px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors shadow-sm" @click="confirmLinkModal">Insert link</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  module: { type: Object, default: null },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'submit'])

// ── State ────────────────────────────────────────────────────────────────────

const activeTab = ref('basic')
const fileInput = ref<HTMLInputElement | null>(null)
const imagePreview = ref<string>('')
const imageFile = ref<File | null>(null)
const cardImageFileInput = ref<HTMLInputElement | null>(null)
const cardImagePreview = ref<string>('')
const cardImageFile = ref<File | null>(null)
const descPanelImageFileInput = ref<HTMLInputElement | null>(null)
const descPanelImagePreview = ref<string>('')
const descPanelImageFile = ref<File | null>(null)
const videoFileInput = ref<HTMLInputElement | null>(null)
const videoPreview = ref<string>('')
const videoFile = ref<File | null>(null)
const pptFileInput = ref<HTMLInputElement | null>(null)
const pptFileName = ref<string>('')
const pptFile = ref<File | null>(null)

// ── Text editor refs & selection ─────────────────────────────────────────────

const textBlockRefs = ref<Record<string, HTMLDivElement | null>>({})

/**
 * Per-editor state for the font-size feature.
 *
 * `displaySize`   – the value shown in the Px input (reflects cursor position or selection)
 * `pendingSize`   – size chosen when caret is collapsed; applied to the NEXT characters typed
 * `savedRange`    – snapshot of the selection taken just before a toolbar button fires
 *                   (needed because @mousedown.prevent keeps focus in the editor but some
 *                    browsers still drop the selection)
 */
interface EditorFontState {
  displaySize: number   // what the Px input shows
  pendingSize: number | null  // size queued for next keypress (collapsed caret mode)
  savedRange: Range | null
}

const editorFontState = ref<Record<string, EditorFontState>>({})

const FONT_SIZE_DEFAULT = 16
const FONT_SIZE_MIN = 8
const FONT_SIZE_MAX = 96

function clampPx(n: number) {
  return Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, Math.round(n)))
}

function getEditorKey(li: number, bi: number) { return `${li}-${bi}` }

function ensureEditorState(li: number, bi: number): EditorFontState {
  const key = getEditorKey(li, bi)
  if (!editorFontState.value[key]) {
    editorFontState.value[key] = { displaySize: FONT_SIZE_DEFAULT, pendingSize: null, savedRange: null }
  }
  return editorFontState.value[key]!
}

function getEditorEl(li: number, bi: number): HTMLDivElement | null {
  return textBlockRefs.value[getEditorKey(li, bi)] ?? null
}

// ── Link modal ───────────────────────────────────────────────────────────────

const showLinkModal = ref(false)
const linkModalUrl = ref('')
const linkModalText = ref('')
const linkModalError = ref('')
const linkModalLessonIndex = ref(-1)
const linkModalBlockIndex = ref(-1)
const linkModalUrlInputRef = ref<HTMLInputElement | null>(null)

// ── Layout options ───────────────────────────────────────────────────────────

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
  layout?: BlockLayout
  align?: BlockAlign
  width?: string
  height?: string
}
interface Lesson { title: string; blocks: LessonBlock[] }
interface ModuleForm {
  title: string; subtitle: string; introduction: string; level: string
  description: string; learning_outcomes_label: string
  image_url: string; image_width?: string; image_height?: string
  card_image_url: string; description_panel_image_url: string
  video_url: string; ppt_url: string
  learning_outcomes: string[]; is_active: boolean; lessons: Lesson[]
}

const form = ref<ModuleForm>({
  title: '', subtitle: '', introduction: '', level: '', description: '',
  learning_outcomes_label: "DepEd's Most Essential Learning Competencies",
  image_url: '', card_image_url: '', description_panel_image_url: '',
  video_url: '', ppt_url: '',
  learning_outcomes: [], is_active: true, lessons: []
})

const isEditMode = computed(() => !!props.module?.id)

// ── Font-size display helper ─────────────────────────────────────────────────

/**
 * Returns what should be shown in the Px input.
 * Reads from editorFontState so the value is always reactive.
 */
function getFontSizeDisplay(li: number, bi: number): string {
  const key = getEditorKey(li, bi)
  return String(editorFontState.value[key]?.displaySize ?? FONT_SIZE_DEFAULT)
}

/**
 * Reads the computed font-size of the node at the current cursor/selection.
 */
function readFontSizeAtCaret(editor: HTMLElement, range: Range): number {
  let node: Node = range.startContainer
  if (node.nodeType === Node.TEXT_NODE) node = node.parentNode as Node
  if (!editor.contains(node as Node)) return FONT_SIZE_DEFAULT
  return Math.round(parseFloat(getComputedStyle(node as Element).fontSize) || FONT_SIZE_DEFAULT)
}

/**
 * After any caret move (mouseup / keyup) update the displayed font size.
 * Never called when the Px input itself is focused.
 */
function onEditorSelectionChange(li: number, bi: number) {
  const editor = getEditorEl(li, bi)
  const state  = ensureEditorState(li, bi)
  const sel    = window.getSelection()
  if (!editor || !sel || !sel.rangeCount) return
  const range  = sel.getRangeAt(0)
  if (!editor.contains(range.commonAncestorContainer)) return

  // Save range for toolbar use
  try { state.savedRange = range.cloneRange() } catch { /* ignore */ }

  // Update display — if there's a pending size from the user, keep showing that
  if (state.pendingSize !== null) {
    state.displaySize = state.pendingSize
  } else {
    state.displaySize = readFontSizeAtCaret(editor, range)
  }
}

function onEditorFocus(li: number, bi: number) {
  // Small delay so the selection is committed before we read it
  nextTick(() => onEditorSelectionChange(li, bi))
}

// ── Apply font size (the core Word-like mechanic) ────────────────────────────

/**
 * Word-like font size:
 *  • If text is selected → wrap it in a <span style="font-size:Xpx">
 *  • If caret is collapsed → store as pendingSize; on the next keydown
 *    we wrap the typed character in a span with that size.
 */
function applyFontSize(li: number, bi: number, px: number) {
  const size   = clampPx(px)
  const editor = getEditorEl(li, bi)
  const state  = ensureEditorState(li, bi)
  if (!editor) return

  // Restore / get current selection
  editor.focus()
  let range: Range | null = null
  const sel = window.getSelection()

  if (state.savedRange) {
    try {
      if (editor.contains(state.savedRange.commonAncestorContainer)) {
        sel?.removeAllRanges()
        sel?.addRange(state.savedRange.cloneRange())
      }
    } catch { /* stale */ }
  }

  if (sel && sel.rangeCount > 0) {
    const r = sel.getRangeAt(0)
    if (editor.contains(r.commonAncestorContainer)) range = r
  }

  if (!range) {
    range = document.createRange()
    range.selectNodeContents(editor)
    range.collapse(false)
    sel?.removeAllRanges()
    sel?.addRange(range)
  }

  state.displaySize = size

  if (range.collapsed) {
    // ── Collapsed caret: set pending size so next typed chars use it ──
    state.pendingSize = size

    /**
     * Insert an invisible marker span. The `beforeinput` / `keydown` handler
     * will pick this up and apply the size to the next real character.
     * We DON'T insert a zero-width space here — that corrupts the text.
     * Instead we rely purely on the pendingSize flag + the keydown wrapper below.
     */
  } else {
    // ── There IS a selection: wrap it ──
    state.pendingSize = null
    const reselectedRange = wrapSelectionWithFontSize(editor, range, size, sel)
    syncTextBlockHtml(li, bi)
    // Save the re-selection so repeated +/− clicks keep the text selected & keep applying
    try { state.savedRange = reselectedRange.cloneRange() } catch { /* ignore */ }
  }
}

/**
 * Wraps the current selection in <span style="font-size:Xpx">.
 * Handles the surroundContents failure gracefully by extracting + re-inserting.
 */
function wrapSelectionWithFontSize(
  editor: HTMLElement, range: Range, px: number, sel: Selection | null
): Range {
  const span = document.createElement('span')
  span.style.fontSize = `${px}px`

  try {
    range.surroundContents(span)
  } catch {
    // Partial selections across tags — extract and rewrap
    const frag = range.extractContents()
    span.appendChild(frag)
    range.insertNode(span)
  }

  // Re-SELECT the entire span so repeated +/− clicks keep working on the same text
  const reselect = document.createRange()
  reselect.selectNodeContents(span)
  sel?.removeAllRanges()
  sel?.addRange(reselect)
  return reselect
}

/**
 * Intercept keydown on the editor while pendingSize is set.
 * We wrap printable characters in a size span, then clear pendingSize.
 */
function handleEditorKeydown(li: number, bi: number, event: KeyboardEvent) {
  const state = ensureEditorState(li, bi)
  if (state.pendingSize === null) return

  // Ignore control keys, shortcuts, etc.
  if (event.ctrlKey || event.metaKey || event.altKey) return
  if (event.key.length !== 1) return  // Not a printable character

  event.preventDefault()

  const editor = getEditorEl(li, bi)
  if (!editor) return

  const px   = state.pendingSize
  const char = event.key

  const sel = window.getSelection()
  let range: Range | null = null

  if (state.savedRange) {
    try {
      if (editor.contains(state.savedRange.commonAncestorContainer)) {
        sel?.removeAllRanges()
        sel?.addRange(state.savedRange.cloneRange())
      }
    } catch { /* stale */ }
  }

  if (sel && sel.rangeCount > 0) {
    const r = sel.getRangeAt(0)
    if (editor.contains(r.commonAncestorContainer)) range = r
  }

  if (!range) {
    range = document.createRange()
    range.selectNodeContents(editor)
    range.collapse(false)
    sel?.removeAllRanges()
    sel?.addRange(range)
  }

  // Delete selected content first (if any)
  if (!range.collapsed) range.deleteContents()

  // Insert the character inside a sized span
  const span = document.createElement('span')
  span.style.fontSize = `${px}px`
  span.textContent = char
  range.insertNode(span)

  // Move caret to end of the span — stays "inside" the size context
  const after = document.createRange()
  after.setStartAfter(span)
  after.collapse(true)
  sel?.removeAllRanges()
  sel?.addRange(after)

  // Save for next keystroke — keep pendingSize active so continuous typing uses the same size
  try { state.savedRange = after.cloneRange() } catch { /* ignore */ }

  syncTextBlockHtml(li, bi)
  state.displaySize = px  // keep the Px field stable while typing
}

// ── +/− buttons ─────────────────────────────────────────────────────────────

function changeFontSizeBy(li: number, bi: number, delta: number) {
  const state = ensureEditorState(li, bi)
  const current = state.displaySize
  applyFontSize(li, bi, current + delta)
}

// ── Px input handlers ────────────────────────────────────────────────────────

function onFontSizeInputMousedown(li: number, bi: number, event: MouseEvent) {
  // Snapshot the editor selection BEFORE focus moves to the input
  const editor = getEditorEl(li, bi)
  const state  = ensureEditorState(li, bi)
  const sel    = window.getSelection()
  if (editor && sel && sel.rangeCount > 0) {
    const r = sel.getRangeAt(0)
    if (editor.contains(r.commonAncestorContainer)) {
      try { state.savedRange = r.cloneRange() } catch { /* ignore */ }
    }
  }
  // Manually focus the input (since we prevented default which blocks auto-focus)
  const input = event.target as HTMLInputElement
  nextTick(() => { input.focus(); input.select() })
}

function onFontSizeInputFocus(li: number, bi: number, event: FocusEvent) {
  // Snapshot selection (may already be done by mousedown handler above)
  const editor = getEditorEl(li, bi)
  const state  = ensureEditorState(li, bi)
  const sel    = window.getSelection()
  if (editor && sel && sel.rangeCount > 0) {
    const r = sel.getRangeAt(0)
    if (editor.contains(r.commonAncestorContainer)) {
      try { state.savedRange = r.cloneRange() } catch { /* ignore */ }
    }
  }
  const input = event.target as HTMLInputElement
  nextTick(() => input.select())
}

function onFontSizeInputChange(li: number, bi: number, event: Event) {
  // Live update while typing — strip non-digits, apply when in valid range
  const input = event.target as HTMLInputElement
  const raw   = input.value.replace(/\D/g, '')
  input.value = raw
  if (!raw) return
  const val = parseInt(raw, 10)
  if (isNaN(val) || val < FONT_SIZE_MIN || val > FONT_SIZE_MAX) return
  const state = ensureEditorState(li, bi)
  state.displaySize = val
  applyFontSize(li, bi, val)
}

function onFontSizeInputBlur(li: number, bi: number, event: FocusEvent) {
  const input = event.target as HTMLInputElement
  const val   = parseInt(input.value, 10)
  if (!isNaN(val)) applyFontSize(li, bi, val)
  // Restore focus + selection back to editor
  nextTick(() => {
    const editor = getEditorEl(li, bi)
    const state  = ensureEditorState(li, bi)
    if (!editor) return
    editor.focus()
    if (state.savedRange) {
      try {
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(state.savedRange.cloneRange())
      } catch { /* stale */ }
    }
  })
}

function onFontSizeInputEnter(li: number, bi: number, event: KeyboardEvent) {
  const input = event.target as HTMLInputElement
  const val   = parseInt(input.value, 10)
  if (!isNaN(val)) applyFontSize(li, bi, val)
  // Return focus + restore selection
  nextTick(() => {
    const editor = getEditorEl(li, bi)
    const state  = ensureEditorState(li, bi)
    if (!editor) return
    editor.focus()
    if (state.savedRange) {
      try {
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(state.savedRange.cloneRange())
      } catch { /* stale */ }
    }
  })
}

// ── Regular format commands (bold, italic, etc.) ─────────────────────────────

function applyFormat(li: number, bi: number, command: string) {
  const editor = getEditorEl(li, bi)
  const state  = ensureEditorState(li, bi)
  if (!editor) return

  editor.focus()

  if (state.savedRange) {
    try {
      if (editor.contains(state.savedRange.commonAncestorContainer)) {
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(state.savedRange.cloneRange())
      }
    } catch { /* stale */ }
  }

  try { document.execCommand('styleWithCSS', false, 'false') } catch { /* ignore */ }
  document.execCommand(command, false)
  syncTextBlockHtml(li, bi)
}

const HIGHLIGHT_COLOR = '#fef08a'

function applyHighlight(li: number, bi: number) {
  const editor = getEditorEl(li, bi)
  const state  = ensureEditorState(li, bi)
  if (!editor) return

  editor.focus()
  if (state.savedRange) {
    try {
      if (editor.contains(state.savedRange.commonAncestorContainer)) {
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(state.savedRange.cloneRange())
      }
    } catch { /* stale */ }
  }

  try { document.execCommand('styleWithCSS', false, 'true') } catch { /* ignore */ }
  const applied = document.execCommand('hiliteColor', false, HIGHLIGHT_COLOR)
  if (!applied) document.execCommand('backColor', false, HIGHLIGHT_COLOR)
  syncTextBlockHtml(li, bi)
}

function clearFormatting(li: number, bi: number) {
  const editor = getEditorEl(li, bi)
  const state  = ensureEditorState(li, bi)
  if (!editor) return

  editor.focus()
  if (state.savedRange) {
    try {
      if (editor.contains(state.savedRange.commonAncestorContainer)) {
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(state.savedRange.cloneRange())
      }
    } catch { /* stale */ }
  }

  document.execCommand('removeFormat', false)
  syncTextBlockHtml(li, bi)

  // Reset pending size and re-read display
  const key = getEditorKey(li, bi)
  if (editorFontState.value[key]) {
    editorFontState.value[key]!.pendingSize = null
  }
  nextTick(() => onEditorSelectionChange(li, bi))
}

// ── Editor ref + HTML sync ────────────────────────────────────────────────────

const normalizeEditorHtml = (html: string) => {
  const cleaned = (html || '').trim()
  if (!cleaned || cleaned === '<br>') return '<p><br></p>'
  return cleaned
}

const setTextBlockRef = (el: Element | { $el?: Element } | null, li: number, bi: number) => {
  const key = getEditorKey(li, bi)
  const resolved = el && '$el' in el ? el.$el : el
  textBlockRefs.value[key] = resolved as HTMLDivElement | null
  if (!resolved) return
  const div   = resolved as HTMLDivElement
  const block = form.value.lessons[li]?.blocks?.[bi]
  if (!block || block.type !== 'text') return
  if (document.activeElement === div) return
  const normalized = normalizeEditorHtml(block.text || '')
  if (div.innerHTML !== normalized) div.innerHTML = normalized
}

const handleTextBlockInput = (li: number, bi: number, event: Event) => {
  const lesson = form.value.lessons[li]
  const block  = lesson?.blocks?.[bi]
  const target = event.target as HTMLDivElement | null
  if (!lesson || !block || block.type !== 'text' || !target) return
  block.text = normalizeEditorHtml(target.innerHTML)

  // After normal typing, update selection display
  const state = ensureEditorState(li, bi)
  const sel   = window.getSelection()
  if (sel && sel.rangeCount > 0) {
    const r = sel.getRangeAt(0)
    const editor = getEditorEl(li, bi)
    if (editor && editor.contains(r.commonAncestorContainer)) {
      try { state.savedRange = r.cloneRange() } catch { /* ignore */ }
    }
  }
}

const syncTextBlockHtml = (li: number, bi: number) => {
  const lesson = form.value.lessons[li]
  const block  = lesson?.blocks?.[bi]
  const editor = getEditorEl(li, bi)
  if (!lesson || !block || block.type !== 'text' || !editor) return
  block.text = normalizeEditorHtml(editor.innerHTML)
  if (editor.innerHTML !== block.text) editor.innerHTML = block.text
}

// ── Form helpers ─────────────────────────────────────────────────────────────

const resetForm = () => {
  form.value = {
    title: '', subtitle: '', introduction: '', level: '', description: '',
    learning_outcomes_label: "DepEd's Most Essential Learning Competencies",
    image_url: '', card_image_url: '', description_panel_image_url: '',
    video_url: '', ppt_url: '',
    learning_outcomes: [], is_active: true, lessons: []
  }
  imagePreview.value = ''; imageFile.value = null
  cardImagePreview.value = ''; cardImageFile.value = null
  descPanelImagePreview.value = ''; descPanelImageFile.value = null
  videoPreview.value = ''; videoFile.value = null
  pptFileName.value = ''; pptFile.value = null
  editorFontState.value = {}
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
    if (imageUrl) blocks.push({ type: 'image', src: imageUrl, layout: 'full-width', align: 'center', width: safeLesson.image_width || undefined, height: safeLesson.image_height || undefined })
    safeLesson.blocks = blocks
  } else {
    safeLesson.blocks = safeLesson.blocks
      .filter((b: any) => b && (b.type === 'text' || b.type === 'image' || b.type === 'video'))
      .map((b: any) => {
        const base = { layout: (b.layout || 'full-width') as BlockLayout }
        if (b.type === 'image') return { type: 'image', src: b.src || '', align: b.align || 'center', width: b.width || undefined, height: b.height || undefined, ...base }
        if (b.type === 'video') return { type: 'video', src: b.src || '', width: b.width || undefined, height: b.height || undefined, ...base }
        return { type: 'text', text: typeof b.text === 'string' ? normalizeEditorHtml(b.text) : '<p></p>', ...base }
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
      form.value.description_panel_image_url = newModule.description_panel_image_url || ''
      form.value.video_url = newModule.video_url || ''
      form.value.ppt_url = newModule.ppt_url || ''
      form.value.learning_outcomes = Array.isArray(newModule.learning_outcomes) ? [...newModule.learning_outcomes] : []
      form.value.is_active = newModule.is_active !== false
      form.value.lessons = Array.isArray(newModule.lessons) && newModule.lessons.length > 0
        ? JSON.parse(JSON.stringify(newModule.lessons)).map((l: any) => normalizeLesson(l)) : []
      editorFontState.value = {}
      imagePreview.value = newModule.image_url || ''; imageFile.value = null
      cardImagePreview.value = newModule.card_image_url || ''; cardImageFile.value = null
      descPanelImagePreview.value = newModule.description_panel_image_url || ''; descPanelImageFile.value = null
      videoPreview.value = newModule.video_url || ''; videoFile.value = null
      pptFileName.value = ''; pptFile.value = null
    } else {
      resetForm(); activeTab.value = 'basic'
    }
  },
  { immediate: true }
)

// ── Lesson/block CRUD ─────────────────────────────────────────────────────────

const addOutcome  = () => form.value.learning_outcomes.push('')
const removeOutcome = (i: number) => form.value.learning_outcomes.splice(i, 1)
const addLesson   = () => form.value.lessons.push({ title: '', blocks: [{ type: 'text', text: '', layout: 'full-width' }] })
const removeLesson = (i: number) => form.value.lessons.splice(i, 1)

const addTextBlock  = (li: number) => { const l = form.value.lessons[li]; if (l) { if (!Array.isArray(l.blocks)) l.blocks = []; l.blocks.push({ type: 'text', text: '', layout: 'full-width' }) } }
const addImageBlock = (li: number) => { const l = form.value.lessons[li]; if (l) { if (!Array.isArray(l.blocks)) l.blocks = []; l.blocks.push({ type: 'image', src: '', layout: 'full-width', align: 'center' }) } }
const addVideoBlock = (li: number) => { const l = form.value.lessons[li]; if (l) { if (!Array.isArray(l.blocks)) l.blocks = []; l.blocks.push({ type: 'video', src: '', layout: 'full-width' }) } }

const removeBlock = (li: number, bi: number) => {
  const lesson = form.value.lessons[li]
  if (!lesson || !Array.isArray(lesson.blocks)) return
  const key = getEditorKey(li, bi)
  delete textBlockRefs.value[key]
  delete editorFontState.value[key]
  lesson.blocks.splice(bi, 1)
}

// ── Link modal ────────────────────────────────────────────────────────────────

const openLinkModal = (li: number, bi: number) => {
  linkModalError.value = ''
  const state = ensureEditorState(li, bi)
  let seed = ''
  if (state.savedRange) {
    try { if (!state.savedRange.collapsed) seed = state.savedRange.toString() } catch { /* stale */ }
  }
  linkModalLessonIndex.value = li
  linkModalBlockIndex.value  = bi
  linkModalUrl.value  = ''
  linkModalText.value = seed
  showLinkModal.value = true
  nextTick(() => linkModalUrlInputRef.value?.focus())
}

const closeLinkModal = () => {
  showLinkModal.value = false; linkModalUrl.value = ''; linkModalText.value = ''
  linkModalError.value = ''; linkModalLessonIndex.value = -1; linkModalBlockIndex.value = -1
}

const confirmLinkModal = () => {
  linkModalError.value = ''
  const urlRaw = linkModalUrl.value.trim()
  if (!urlRaw) { linkModalError.value = 'Please enter a URL.'; return }
  let href = urlRaw.replace(/\s+/g, '')
  if (/^\s*javascript:/i.test(href) || href.toLowerCase().startsWith('data:')) { linkModalError.value = 'That link type is not allowed.'; return }
  if (!/^https?:\/\//i.test(href) && !href.startsWith('/') && !href.startsWith('#') && !href.startsWith('mailto:')) href = `https://${href}`

  const li = linkModalLessonIndex.value
  const bi = linkModalBlockIndex.value
  const editor = getEditorEl(li, bi)
  const state  = ensureEditorState(li, bi)
  if (!editor || li < 0 || bi < 0) { closeLinkModal(); return }

  editor.focus()
  const sel = window.getSelection()

  if (state.savedRange) {
    try {
      if (editor.contains(state.savedRange.commonAncestorContainer)) {
        sel?.removeAllRanges()
        sel?.addRange(state.savedRange.cloneRange())
      }
    } catch { /* stale */ }
  }

  let range: Range | null = null
  if (sel && sel.rangeCount > 0) {
    const r = sel.getRangeAt(0)
    if (editor.contains(r.commonAncestorContainer)) range = r
  }
  if (!range) {
    range = document.createRange()
    range.selectNodeContents(editor)
    range.collapse(false)
    sel?.removeAllRanges()
    sel?.addRange(range)
  }

  const label = linkModalText.value.trim()
  const a = document.createElement('a')
  a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer'

  if (range.collapsed) {
    a.textContent = label || href
    range.insertNode(a)
    const nr = document.createRange(); nr.setStartAfter(a); nr.collapse(true)
    sel?.removeAllRanges(); sel?.addRange(nr)
  } else {
    const display = label || range.toString()
    range.deleteContents(); a.textContent = display; range.insertNode(a)
    const nr = document.createRange(); nr.setStartAfter(a); nr.collapse(true)
    sel?.removeAllRanges(); sel?.addRange(nr)
  }

  syncTextBlockHtml(li, bi)
  closeLinkModal()
}

watch(() => props.isOpen, (open) => { if (!open) closeLinkModal() })
onUnmounted(() => { /* nothing extra needed now */ })

// ── File handlers ─────────────────────────────────────────────────────────────

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

const handleDescPanelImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { alert('Image size must be less than 5MB'); return }
  if (!file.type.startsWith('image/')) { alert('Please select a valid image file'); return }
  descPanelImageFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => { descPanelImagePreview.value = (e.target?.result as string) || '' }
  reader.readAsDataURL(file)
}
const clearDescPanelImage = () => {
  descPanelImagePreview.value = ''; descPanelImageFile.value = null
  form.value.description_panel_image_url = ''
  if (descPanelImageFileInput.value) descPanelImageFileInput.value.value = ''
}

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

const handleBlockImageUpload = (event: Event, li: number, bi: number) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { alert('Image size must be less than 5MB'); return }
  if (!file.type.startsWith('image/')) { alert('Please select a valid image file'); return }
  const reader = new FileReader()
  reader.onload = (e) => {
    const block = form.value.lessons[li]?.blocks?.[bi]
    if (block?.type === 'image') block.src = (e.target?.result as string) || ''
  }
  reader.readAsDataURL(file)
}
const clearBlockImage = (li: number, bi: number) => {
  const block = form.value.lessons[li]?.blocks?.[bi]
  if (block?.type === 'image') block.src = ''
}

const handleBlockVideoUpload = (event: Event, li: number, bi: number) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 50 * 1024 * 1024) { alert('Video size must be less than 50MB'); return }
  if (!file.type.startsWith('video/')) { alert('Please select a valid video file'); return }
  const reader = new FileReader()
  reader.onload = (e) => {
    const block = form.value.lessons[li]?.blocks?.[bi]
    if (block?.type === 'video') block.src = (e.target?.result as string) || ''
  }
  reader.readAsDataURL(file)
}
const clearBlockVideo = (li: number, bi: number) => {
  const block = form.value.lessons[li]?.blocks?.[bi]
  if (block?.type === 'video') block.src = ''
}

// ── Submit ────────────────────────────────────────────────────────────────────

const handleSubmit = () => {
  if (!form.value.title || !form.value.introduction || !form.value.level || !form.value.description) {
    alert('Please fill in all required fields'); return
  }
  const outcomes = form.value.learning_outcomes.filter(o => o.trim() !== '')
  const lessons = form.value.lessons
    .map((l: any) => normalizeLesson(l))
    .map((l: any) => ({ title: (l.title || '').trim(), blocks: Array.isArray(l.blocks) ? l.blocks : [] }))
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
    ...form.value, learning_outcomes: outcomes,
    lessons: lessons.length > 0 ? lessons : undefined,
    imageFile: imageFile.value, cardImageFile: cardImageFile.value,
    descPanelImageFile: descPanelImageFile.value, videoFile: videoFile.value, pptFile: pptFile.value
  })
}
</script>
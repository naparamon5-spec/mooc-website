<template>
  <div class="bg-white">
    <!-- Header -->
    <DashboardHeader :activeModuleId="parseInt(moduleId)" />

    <!-- Completion Modal -->
    <ModuleCompletionModal
      v-if="!isLastModule && module"
      :isOpen="showCompletionModal"
      :moduleName="module?.title || ''"
      :badgeName="earnedBadgeName"
      :studentName="studentName"
      :currentModuleId="parseInt(moduleId)"
      :totalModules="5"
      @nextModule="handleNextModule"
      @backToDashboard="handleBackToDashboard"
    />

    <!-- Certificate Modal (for last module) -->
    <CertificateModal
      v-if="isLastModule && module"
      :isOpen="showCompletionModal"
      :studentName="studentName"
      @nextCourse="handleAdvancedCourse"
      @backToDashboard="handleBackToDashboard"
    />

    <main class="bg-primary-100 max-w-full mx-auto px-4 md:px-8 lg:px-12 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Sidebar -->
      <aside class="lg:col-span-1">
        <nav class="bg-white rounded-lg shadow p-4">
          <h2 class="text-xl font-bold text-gray-800 mb-6">Curriculum</h2>
          <div class="space-y-2">
            <div v-for="(mod, moduleIndex) in sidebarModules" :key="mod.id" class="space-y-1">
              <div
                @click="isModuleAccessible(String(mod.id), moduleIndex) && goToModule(String(mod.id), -1)"
                class="p-3 rounded-lg cursor-pointer font-bold text-sm transition-colors border-b-2"
                :class="[
                  String(mod.id) === moduleId && currentLessonIndex === -1
                    ? 'bg-primary-600 text-white border-b-primary-700'
                    : String(mod.id) === moduleId
                    ? 'bg-primary-100 text-primary-700 border-b-primary-300'
                    : 'text-gray-800 hover:bg-gray-100 border-b-transparent',
                  !isModuleAccessible(String(mod.id), moduleIndex) && 'opacity-50 cursor-not-allowed hover:bg-white'
                ]"
              >
                <span class="mr-2">{{ mod.emoji }}</span>
                <span>{{ mod.title }}</span>
                <span v-if="!isModuleAccessible(String(mod.id), moduleIndex)" class="ml-2 text-xs">🔒</span>
              </div>

              <div v-if="mod.lessons && mod.lessons.length > 0" class="pl-4 space-y-1">
                <div
                  v-for="(lesson, lessonIndex) in mod.lessons"
                  :key="`${mod.id}-${lessonIndex}`"
                  @click="isModuleAccessible(String(mod.id), moduleIndex) && goToModule(String(mod.id), Number(lessonIndex))"
                  class="p-2 rounded text-xs transition-colors"
                  :class="[
                    isModuleAccessible(String(mod.id), moduleIndex) ? 'cursor-pointer hover:bg-gray-100' : 'cursor-not-allowed',
                    String(mod.id) === moduleId && currentLessonIndex === lessonIndex
                      ? 'bg-primary-500 text-white font-semibold'
                      : String(mod.id) === moduleId ? 'text-primary-600 font-medium' : 'text-gray-600',
                    !isModuleAccessible(String(mod.id), moduleIndex) && 'opacity-50'
                  ]"
                >
                  <span v-if="String(mod.id) === moduleId && currentLessonIndex === lessonIndex" class="mr-2">▶️</span>
                  <span v-else class="mr-2">•</span>
                  {{ lesson.title }}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <section class="md:col-span-3">
        <div v-if="loading" class="text-center py-12">
          <p class="text-gray-600">Loading module...</p>
        </div>

        <div v-else-if="module">
          <!-- Module Banner (only on intro) -->
          <div v-if="currentLessonIndex === -1 && module?.image_url" class="mb-6 rounded-lg overflow-hidden">
            <img :src="module.image_url" :alt="module.title" class="w-full h-64 object-cover" />
          </div>

          <!-- Module Intro Section -->
          <div v-if="currentLessonIndex === -1" class="space-y-6 mb-6">
            <ModuleDescriptionPanel :module="module" />
            <div v-if="module?.introduction" class="bg-gray-50 p-4 rounded-lg border-l-4 border-primary-600">
              <p class="text-gray-700 whitespace-pre-line">{{ module.introduction }}</p>
            </div>
            <div class="ppt-viewer-wrapper">
              <iframe v-if="module?.ppt_url" :src="pptEmbedSrc" class="ppt-iframe" frameborder="0" allowfullscreen />
              <div v-else class="ppt-viewer-placeholder">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p class="text-sm text-gray-600">No PPT available</p>
              </div>
            </div>
            <div v-if="module?.ppt_url" class="flex justify-end">
              <a :href="module.ppt_url" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700 underline text-sm font-medium">
                If the PPT doesn't display, click to open →
              </a>
            </div>
            <div class="flex justify-end mt-8">
              <button @click="goToNextLesson" class="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2">
                Continue to Lesson 1 →
              </button>
            </div>
          </div>

          <!-- Lessons Section -->
          <template v-if="currentLessonIndex >= 0">
            <div class="flex justify-between items-center mb-6">
              <div>
                <h2 class="text-3xl font-bold text-gray-900">
                  Lesson {{ currentLessonIndex + 1 }}: {{ currentLesson?.title }}
                </h2>
              </div>
              <div class="text-lg font-semibold text-primary-600">
                {{ currentLessonIndex + 1 }} / {{ module?.lessons?.length || 0 }}
              </div>
            </div>

            <!-- Lesson content rendered from block rows -->
            <div v-if="currentLesson" class="prose max-w-none mb-8 text-gray-700 bg-white p-6 rounded-lg">
              <div class="space-y-6">
                <template v-for="(row, rowIndex) in renderRows(getLessonBlocks(currentLesson))" :key="`row-${rowIndex}`">

                  <!-- ─── NEWSPAPER WRAP LAYOUT ─── -->
                  <!-- IMAGE first in blocks → float LEFT, text wraps on the RIGHT -->
                  <div
                    v-if="row.wrapLayout && row.wrapSide === 'left' && row.blocks.length === 2"
                    class="text-wrap-container"
                  >
                    <div class="wrap-image-float-left">
                      <BlockRenderer :block="row.blocks[0]" :lessonTitle="currentLesson?.title || ''" />
                    </div>
                    <div class="wrap-text-content">
                      <BlockRenderer :block="row.blocks[1]" :lessonTitle="currentLesson?.title || ''" />
                    </div>
                  </div>

                  <!-- TEXT first in blocks → float image RIGHT, text wraps on the LEFT -->
                  <div
                    v-else-if="row.wrapLayout && row.wrapSide === 'right' && row.blocks.length === 2"
                    class="text-wrap-container"
                  >
                    <div class="wrap-image-float-right">
                      <BlockRenderer :block="row.blocks[1]" :lessonTitle="currentLesson?.title || ''" />
                    </div>
                    <div class="wrap-text-content">
                      <BlockRenderer :block="row.blocks[0]" :lessonTitle="currentLesson?.title || ''" />
                    </div>
                  </div>

                  <!-- ─── TWO-COLUMN ROW (left + right pair) ─── -->
                  <div
                    v-else-if="!row.wrapLayout && row.blocks.length === 2 && row.blocks[0] && row.blocks[1]"
                    class="flex flex-col sm:flex-row gap-6 items-start"
                  >
                    <div class="flex-1 min-w-0 w-full overflow-hidden">
                      <BlockRenderer :block="(row.blocks[0] as LessonBlock)" :lessonTitle="currentLesson?.title || ''" />
                    </div>
                    <div class="flex-1 min-w-0 w-full overflow-hidden">
                      <BlockRenderer :block="(row.blocks[1] as LessonBlock)" :lessonTitle="currentLesson?.title || ''" />
                    </div>
                  </div>

                  <!-- ─── SINGLE BLOCK ROW ─── -->
                  <div v-else-if="row.blocks.length === 1 && row.blocks[0]">
                    <div :class="getSingleBlockWrapperClass(row.blocks[0] as LessonBlock)">
                      <BlockRenderer :block="(row.blocks[0] as LessonBlock)" :lessonTitle="currentLesson?.title || ''" />
                    </div>
                  </div>

                </template>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between items-center mt-12">
              <button
                v-if="currentLessonIndex >= 0"
                @click="goToPreviousLesson"
                class="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200"
              >
                {{ currentLessonIndex === 0 ? '← Back to Intro' : '← Previous Lesson' }}
              </button>

              <button
                v-if="currentLessonIndex < (module?.lessons?.length || 0) - 1"
                @click="markLessonAndGoToNext"
                class="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700"
              >Next Lesson →</button>

              <button
                v-else-if="!isCurrentModuleCompleted"
                @click="markLessonAsComplete"
                class="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 ml-auto flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Take Quiz
              </button>

              <button
                v-else-if="isCurrentModuleCompleted && hasNextModule"
                @click="handleNextModule"
                class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 ml-auto flex items-center gap-2"
              >Next Module →</button>

              <button
                v-else-if="isCurrentModuleCompleted && !hasNextModule"
                @click="handleBackToDashboard"
                class="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 ml-auto flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Return to Dashboard
              </button>
            </div>
          </template>
        </div>
      </section>
    </main>

    <!-- Quiz Prompt Dialog -->
    <div v-if="showQuizDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Module Quiz</h2>
        <p class="text-gray-600 mb-4">Before you can complete this module, you need to pass the quiz.</p>
        <div v-if="quizLoading" class="text-gray-600 py-4">Loading quiz information...</div>
        <div v-else-if="quizError" class="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">{{ quizError }}</div>
        <div v-else-if="quizInfo" class="space-y-2 mb-4">
          <p><span class="font-semibold">Topic:</span> {{ quizInfo.title }}</p>
          <p><span class="font-semibold">Number of items:</span> {{ quizInfo.questions?.length || 0 }}</p>
          <p><span class="font-semibold">Passing score:</span> {{ quizInfo.passing_score || 70 }}%</p>
        </div>
        <div class="flex justify-end gap-3 mt-4">
          <button v-if="quizInfo" type="button" @click="showQuizDialog = false" class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
          <button v-if="quizInfo" type="button" @click="goToQuiz" :disabled="!quizInfo || !!quizError" class="px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">Take Quiz</button>
          <button v-if="!quizInfo && quizError" type="button" @click="showQuizDialog = false" class="px-4 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700">Close</button>
        </div>
      </div>
    </div>

    <footer class="bg-primary-600 text-white text-center py-4">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>
  </div>
</template>

<!--
  ────────────────────────────────────────────────────────────────────
  Inline sub-component: BlockRenderer
  Renders a single block (text | image | video) with its layout/align.
  ────────────────────────────────────────────────────────────────────
-->
<script lang="ts">
import { defineComponent, h } from 'vue'

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

export const BlockRenderer = defineComponent({
  name: 'BlockRenderer',
  props: {
    block: { type: Object as () => LessonBlock, required: true },
    lessonTitle: { type: String, default: '' }
  },
  setup(props) {
    return () => {
      const b = props.block as any

      if (b.type === 'text') {
        const paragraphs = splitIntoSegments(b.text || '')
        return h('div', { class: 'space-y-4' }, paragraphs.map((seg: any, i: number) => {
          if (seg.type === 'ul') {
            return h('ul', { class: 'list-disc pl-6 text-gray-700', key: i },
              seg.items.map((item: string, j: number) => h('li', { key: j, class: 'mb-1' }, item))
            )
          }
          return h('p', { class: 'text-gray-700 leading-relaxed text-base', key: i }, seg.text)
        }))
      }

      if (b.type === 'image' && b.src) {
        const alignClass = b.align === 'left' ? 'justify-start' : b.align === 'right' ? 'justify-end' : 'justify-center'
        const imgStyle: Record<string, string> = {}
        if (b.width) imgStyle.width = b.width
        if (b.height) imgStyle.height = b.height
        return h('div', { class: `flex ${alignClass} my-2` },
          h('img', {
            src: b.src,
            alt: props.lessonTitle || 'Lesson image',
            class: 'rounded-lg border border-gray-100',
            style: Object.keys(imgStyle).length > 0 ? imgStyle : { width: '100%', height: 'auto' }
          })
        )
      }

      if (b.type === 'video' && b.src) {
        return h('div', { class: 'flex justify-center my-2' },
          h('video', {
            src: b.src,
            controls: true,
            class: 'w-full h-auto rounded-lg border border-gray-100'
          })
        )
      }

      return h('div')
    }
  }
})

/** Split plain text into paragraph / bullet-list segments */
function splitIntoSegments(text: string) {
  const t = (text || '').trim()
  if (!t) return []
  const paragraphs = t.split(/\n\s*\n/g).map((s: string) => s.trim()).filter(Boolean)
  return paragraphs.map((p: string) => {
    const lines = p.split('\n').map((l: string) => l.trim()).filter(Boolean)
    const allBullets = lines.length > 0 && lines.every((l: string) => /^-\s+/.test(l))
    if (allBullets) {
      return { type: 'ul', items: lines.map((l: string) => l.replace(/^-\s+/, '').trim()).filter(Boolean) }
    }
    return { type: 'p', text: p }
  })
}
</script>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import DashboardHeader from '~/components/studentdashboard/DashboardHeader.vue'
import ModuleDescriptionPanel from '~/components/studentdashboard/ModuleDescriptionPanel.vue'
import ModuleCompletionModal from '~/components/ModuleCompletionModal.vue'
import CertificateModal from '~/components/CertificateModal.vue'
import { useCourseProgress } from '~/composables/useCourseProgress'
import { useModuleManagement } from '~/composables/useModuleManagement'
import { useQuizManagement } from '~/composables/useQuizManagement'
import { useUserProfile } from '~/composables/useUserProfile'
import { useOnboarding } from '~/composables/useOnboarding'

// ── Route ──────────────────────────────────────────────────────────────────
const route = useRoute()
const moduleIdRaw = computed(() => { const id = route.params.id; return Array.isArray(id) ? id[0] : id || '1' })
const moduleId = computed(() => moduleIdRaw.value || '1')
const lessonParam = computed(() => { const lesson = route.query.lesson; return lesson ? parseInt(lesson as string) : -1 })

// ── State ──────────────────────────────────────────────────────────────────
const currentLessonIndex = ref(-1)
const completedLessons = ref(new Set())
const showCompletionModal = ref(false)
const showModuleCharacterModal = ref(false)
const showQuizDialog = ref(false)
const quizInfo = ref<any | null>(null)
const quizLoading = ref(false)
const quizError = ref<string | null>(null)
const studentName = ref('Student Name')
const module = ref<any>(null)

const { completeModule, badgeMapping, isModuleCompleted, completeLessonInModule, getTotalProgressPercentage, clearProgress, loadProgressFromSupabase } = useCourseProgress()
const { fetchModuleById, fetchModules, modules, loading } = useModuleManagement()
const { fetchQuizForModule } = useQuizManagement()
const { fetchUserProfile } = useUserProfile()
const { hasSeenModuleIntro, markModuleIntroAsSeen, initializeOnboarding } = useOnboarding()

// ── Computed ───────────────────────────────────────────────────────────────
const currentCourseLevel = computed(() => module.value?.level || 'beginner')
const sidebarModules = computed(() => allModules.value.filter((m: any) => m.level === currentCourseLevel.value).slice(0, 5))
const isLastModule = computed(() => {
  if (!module.value) return false
  const mods = sidebarModules.value
  return mods.length > 0 && String(module.value.id) === String(mods[mods.length - 1].id)
})
const earnedBadgeName = computed(() => {
  const courseLevel = module.value?.level || 'beginner'
  const sortedModules = allModules.value.filter((m: any) => m.level === courseLevel).slice(0, 5)
  const modulePosition = sortedModules.findIndex((m: any) => String(m.id) === String(moduleId.value)) + 1
  const courseBadges = badgeMapping[courseLevel as keyof typeof badgeMapping]
  return (courseBadges && modulePosition > 0) ? courseBadges[modulePosition] || 'Unknown Badge' : 'Unknown Badge'
})
const allModules = computed(() =>
  modules.value.slice().sort((a: any, b: any) => {
    const aNum = parseInt(a.title?.match(/\d+/)?.[0] || '0', 10)
    const bNum = parseInt(b.title?.match(/\d+/)?.[0] || '0', 10)
    return aNum - bNum
  })
)
const currentLesson = computed(() => {
  if (!module.value?.lessons?.length) return null
  return module.value.lessons[currentLessonIndex.value] || null
})
const isCurrentModuleCompleted = computed(() => isModuleCompleted(module.value?.level || 'beginner', moduleId.value))
const hasNextModule = computed(() => {
  const mods = sidebarModules.value
  const idx = mods.findIndex((m: any) => String(m.id) === moduleId.value)
  return idx >= 0 && idx < mods.length - 1
})
const pptEmbedSrc = computed(() => {
  const url = module.value?.ppt_url
  return url ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}` : ''
})

// ── Block rendering helpers ────────────────────────────────────────────────

const stripHtmlToText = (input: string) =>
  (input || '')
    .replace(/<\s*br\s*\/?\s*>/gi, '\n').replace(/<\/\s*p\s*>/gi, '\n\n')
    .replace(/<\/\s*h[1-6]\s*>/gi, '\n\n').replace(/<\s*h[1-6][^>]*>/gi, '')
    .replace(/<\/\s*li\s*>/gi, '\n').replace(/<\s*li[^>]*>/gi, '- ')
    .replace(/<\/\s*(ul|ol)\s*>/gi, '\n\n').replace(/<\s*(ul|ol)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\n{3,}/g, '\n\n').trim()

const legacyHtmlToBlocks = (html: string): LessonBlock[] => {
  const input = (html || '').trim()
  if (!input) return []
  const blocks: LessonBlock[] = []
  const imgRegex = /<img\b[^>]*\bsrc\s*=\s*(['"])(.*?)\1[^>]*>/gi
  let lastIndex = 0; let match: RegExpExecArray | null
  while ((match = imgRegex.exec(input)) !== null) {
    const beforeText = stripHtmlToText(input.slice(lastIndex, match.index))
    const src = (match[2] || '').trim()
    if (beforeText) blocks.push({ type: 'text', text: beforeText, layout: 'full-width' })
    if (src) blocks.push({ type: 'image', src, layout: 'full-width', align: 'center' })
    lastIndex = match.index + match[0].length
  }
  const afterText = stripHtmlToText(input.slice(lastIndex))
  if (afterText) blocks.push({ type: 'text', text: afterText, layout: 'full-width' })
  return blocks
}

const getLessonBlocks = (lesson: any): LessonBlock[] => {
  if (!lesson) return []
  if (Array.isArray(lesson.blocks) && lesson.blocks.length > 0) {
    return lesson.blocks
      .filter((b: any) => b && (b.type === 'text' || b.type === 'image' || b.type === 'video'))
      .map((b: any) => {
        const layout = (b.layout || 'full-width') as BlockLayout
        if (b.type === 'image') return { type: 'image' as const, src: b.src || '', layout, align: (b.align || 'center') as BlockAlign }
        if (b.type === 'video') return { type: 'video' as const, src: b.src || '', layout }
        return { type: 'text' as const, text: b.text || '', layout }
      })
  }
  const blocks: LessonBlock[] = []
  const htmlContent = typeof lesson.htmlContent === 'string' ? lesson.htmlContent.trim() : ''
  if (htmlContent) blocks.push(...legacyHtmlToBlocks(htmlContent))
  const imageUrl = typeof lesson.image_url === 'string' ? lesson.image_url.trim() : ''
  if (imageUrl) blocks.push({ type: 'image', src: imageUrl, layout: 'full-width', align: 'center' })
  return blocks
}

// ── Types ──────────────────────────────────────────────────────────────────
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

interface RowGroup {
  blocks: LessonBlock[]
  wrapLayout?: boolean
  wrapSide?: 'left' | 'right'
}

const renderRows = (blocks: LessonBlock[]): RowGroup[] => {
  const rows: RowGroup[] = []
  let i = 0
  while (i < blocks.length) {
    const current = blocks[i]!
    const next = blocks[i + 1]

    // IMAGE → TEXT  ⟹  float image LEFT, text wraps right
    if (current.type === 'image' && next?.type === 'text') {
      rows.push({ blocks: [current, next], wrapLayout: true, wrapSide: 'left' })
      i += 2

    // TEXT → IMAGE  ⟹  float image RIGHT, text wraps left
    } else if (current.type === 'text' && next?.type === 'image') {
      rows.push({ blocks: [current, next], wrapLayout: true, wrapSide: 'right' })
      i += 2

    // Explicit left + right column pair
    } else if (current.layout === 'left' && next?.layout === 'right') {
      rows.push({ blocks: [current, next], wrapLayout: false })
      i += 2

    // Single block fallback
    } else {
      rows.push({ blocks: [current], wrapLayout: false })
      i++
    }
  }
  return rows
}

const getSingleBlockWrapperClass = (block: LessonBlock): string => {
  switch (block.layout) {
    case 'center': return 'mx-auto w-full sm:w-3/5'
    case 'left':   return 'mr-auto w-full sm:w-1/2'
    case 'right':  return 'ml-auto w-full sm:w-1/2'
    default:       return 'w-full'
  }
}

// ── Lifecycle / watchers ───────────────────────────────────────────────────
onMounted(async () => {
  try {
    const userData = await fetchUserProfile()
    if (userData?.full_name) studentName.value = userData.full_name
    await fetchAllModules()
    initializeOnboarding()
    if (!hasSeenModuleIntro(moduleId.value)) {
      setTimeout(() => { showModuleCharacterModal.value = true }, 500)
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  } catch (err) { console.error('Error on mount:', err) }
})

onMounted(async () => {
  try { clearProgress(); await loadProgressFromSupabase() }
  catch (err) { console.error('Error loading progress:', err) }
})

const handleModuleCharacterClose = () => { showModuleCharacterModal.value = false; markModuleIntroAsSeen(moduleId.value) }
const handleModuleCharacterSkip  = () => { showModuleCharacterModal.value = false; markModuleIntroAsSeen(moduleId.value) }

const fetchAllModules = async () => {
  try { if (!modules.value.length) await fetchModules() }
  catch (err) { console.error('Error fetching all modules:', err) }
}

const checkAndOpenQuizDialog = async () => {
  if (!module.value) return
  quizLoading.value = true; quizError.value = null; quizInfo.value = null
  try {
    const data = await fetchQuizForModule(String(module.value.id))
    if (!data) { quizError.value = 'The quiz for this module is not ready yet. Please check back later or contact your instructor.'; showQuizDialog.value = true; return }
    quizInfo.value = data as any; showQuizDialog.value = true
  } catch (err) { console.error('Error checking quiz:', err); quizError.value = 'Failed to load quiz information. Please try again later.'; showQuizDialog.value = true }
  finally { quizLoading.value = false }
}

const goToQuiz = () => {
  if (!quizInfo.value?.id) return
  showQuizDialog.value = false; window.scrollTo({ top: 0, behavior: 'auto' })
  navigateTo(`/quizzes/${quizInfo.value.id}`)
}

const goToPreviousLesson = () => { if (currentLessonIndex.value > -1) { currentLessonIndex.value--; window.scrollTo({ top: 0, behavior: 'smooth' }) } }
const goToNextLesson = () => {
  if (currentLessonIndex.value === -1) { currentLessonIndex.value = 0; window.scrollTo({ top: 0, behavior: 'smooth' }) }
  else if (module.value?.lessons && currentLessonIndex.value < module.value.lessons.length - 1) { currentLessonIndex.value++; window.scrollTo({ top: 0, behavior: 'smooth' }) }
}

const markLessonAsComplete = async () => {
  completedLessons.value.add(currentLessonIndex.value)
  completeLessonInModule(module.value?.level || 'beginner', moduleId.value, currentLessonIndex.value)
  if (module.value?.lessons) {
    const allDone = module.value.lessons.every((_: any, idx: number) => completedLessons.value.has(idx))
    if (allDone) await checkAndOpenQuizDialog()
  }
}

const handleNextModule = () => {
  const mods = sidebarModules.value
  const idx = mods.findIndex((m: any) => String(m.id) === moduleId.value)
  if (idx >= 0 && idx + 1 < mods.length) {
    showCompletionModal.value = false; currentLessonIndex.value = 0; completedLessons.value.clear()
    window.scrollTo({ top: 0, behavior: 'smooth' }); navigateTo(`/modules/${mods[idx + 1].id}`)
  }
}
const handleAdvancedCourse = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); navigateTo('/dashboard?course=advanced') }
const handleBackToDashboard = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); navigateTo('/dashboard') }
const markLessonAndGoToNext = () => {
  markLessonAsComplete()
  if (module.value?.lessons && currentLessonIndex.value < module.value.lessons.length - 1) { currentLessonIndex.value++; window.scrollTo({ top: 0, behavior: 'smooth' }) }
}
const goToModule = (id: string, lessonIndex = -1) => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  navigateTo(lessonIndex === -1 ? `/modules/${id}` : `/modules/${id}?lesson=${lessonIndex}`)
}
const isModuleAccessible = (modId: string, index: number) => {
  if (index === 0) return true
  const prevMod = sidebarModules.value[index - 1] as any
  return prevMod ? isModuleCompleted(prevMod.level || 'beginner', String(prevMod.id)) : false
}

watch(moduleId, async (newId) => {
  const data = await fetchModuleById(newId)
  if (data) {
    module.value = data
    currentLessonIndex.value = lessonParam.value >= 0 ? lessonParam.value : -1
    completedLessons.value.clear()
    if (module.value) useHead({ title: `${module.value.title} - MIL MOOC` })
  }
}, { immediate: true })

const fromQuiz = computed(() => route.query.fromQuiz === '1')
watch(fromQuiz, (val) => { if (val && module.value) showCompletionModal.value = true }, { immediate: true })
watch(lessonParam, (val) => {
  if (val >= 0 && val !== currentLessonIndex.value) { currentLessonIndex.value = val; window.scrollTo({ top: 0, behavior: 'smooth' }) }
  else if (val === -1 && currentLessonIndex.value !== -1) { currentLessonIndex.value = -1; window.scrollTo({ top: 0, behavior: 'smooth' }) }
})
</script>

<style>
.prose p  { margin-bottom: 1em; line-height: 1.6; }
.prose ul { margin-bottom: 1em; }
.prose li { margin-bottom: 0.5em; }

/* ═══════════════════════════════════════════════════════════════════
   NEWSPAPER WRAP LAYOUT
   ═══════════════════════════════════════════════════════════════════ */

.text-wrap-container {
  display: flow-root;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.wrap-image-float-right {
  float: right;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
  max-width: 42%;
  clear: none;
}

.wrap-image-float-left {
  float: left;
  margin-right: 1.5rem;
  margin-bottom: 1rem;
  max-width: 42%;
  clear: none;
}

.wrap-image-float-right img,
.wrap-image-float-left img {
  width: 100%;
  height: auto;
  border-radius: 0.5rem;
  display: block;
}

.wrap-text-content {
  overflow: visible;
}

.wrap-text-content p {
  margin-bottom: 1em;
  line-height: 1.6;
}

.wrap-text-content ul {
  margin-bottom: 1em;
  list-style-position: inside;
}

.wrap-text-content li {
  margin-bottom: 0.5em;
}

@media (max-width: 640px) {
  .wrap-image-float-right,
  .wrap-image-float-left {
    float: none;
    max-width: 100%;
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 1.5rem;
  }

  .text-wrap-container {
    display: block;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   GENERAL IMAGE STYLING
   ═══════════════════════════════════════════════════════════════════ */

.prose img {
  width: 100% !important;
  height: auto !important;
  max-width: 100%;
  border-radius: 0.5rem;
  display: block;
  object-fit: cover;
}

.flex.flex-col.sm\:flex-row img {
  margin: 0;
}

div:not(.flex) .prose img {
  margin: 2rem 0;
}

/* ═══════════════════════════════════════════════════════════════════
   PPT VIEWER
   ═══════════════════════════════════════════════════════════════════ */

.ppt-viewer-wrapper {
  width: 100%;
  background: #1f2937;
  border: 1px solid #b8c7e3;
  border-radius: 12px;
  aspect-ratio: 16 / 9;
  max-height: 700px;
  overflow: hidden;
}
.ppt-iframe {
  width: 100%;
  height: 100%;
  border: 0;
  background: #ffffff;
}
.ppt-viewer-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #1f2937;
  color: #cbd5e1;
  padding: 16px;
}
</style>
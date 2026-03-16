<template>
  <div class="bg-white">
    <!-- Header -->
    <DashboardHeader :activeModuleId="parseInt(moduleId)" />

    <!-- Instructor Character Modal for Module Intro -->
    <InstructorCharacter
      :isOpen="showModuleCharacterModal"
      mode="module"
      :title="`Welcome to ${module?.title}! 🚀`"
      :messages="[
        `Let's dive into ${module?.title}! This module covers important concepts you need to master.`,
        'Take your time reading through each lesson carefully. You can navigate between lessons using the previous and next buttons.',
        `After reading all lessons, you'll need to complete the module quiz to get the badge and unlock the next module. Good luck!`
      ]"
      :tips="[
        `This module has ${module?.lessons?.length || 0} lessons`,
        'Read each lesson carefully to prepare for the quiz',
        'You need to pass the quiz to earn your badge',
        'Take notes while reading to help you remember key concepts'
      ]"
      buttonText="Let's Get Started!"
      :showSkip="true"
      characterName="Alex"
      @close="handleModuleCharacterClose"
      @skip="handleModuleCharacterSkip"
    />

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

    <main
      class="bg-primary-100 max-w-full mx-auto px-4 md:px-8 lg:px-12 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8"
    >
      <!-- Sidebar -->
      <aside class="lg:col-span-1">
        <nav class="bg-white rounded-lg shadow p-4">
          <h2 class="text-xl font-bold text-gray-800 mb-6">Curriculum</h2>
          <div class="space-y-2">
            <div
              v-for="(mod, moduleIndex) in allModules"
              :key="mod.id"
              class="space-y-1"
            >
              <!-- Module Title -->
              <div
                @click="isModuleAccessible(String(mod.id), moduleIndex) && goToModule(String(mod.id), 0)"
                class="p-3 rounded-lg cursor-pointer font-bold text-sm transition-colors border-b-2"
                :class="[
                  String(mod.id) === moduleId
                    ? 'bg-primary-600 text-white border-b-primary-700'
                    : 'text-gray-800 hover:bg-gray-100 border-b-transparent',
                  !isModuleAccessible(String(mod.id), moduleIndex) && 'opacity-50 cursor-not-allowed hover:bg-white'
                ]"
              >
                <span class="mr-2">{{ mod.emoji }}</span>
                <span>{{ mod.title }}</span>
                <span v-if="!isModuleAccessible(String(mod.id), moduleIndex)" class="ml-2 text-xs">🔒</span>
              </div>

              <!-- Lessons List -->
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
                      : String(mod.id) === moduleId
                      ? 'text-primary-600 font-medium'
                      : 'text-gray-600',
                    !isModuleAccessible(String(mod.id), moduleIndex) && 'opacity-50'
                  ]"
                >
                  <span v-if="mod.id === parseInt(moduleId) && currentLessonIndex === lessonIndex" class="mr-2">▶️</span>
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
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <p class="text-gray-600">Loading module...</p>
        </div>

        <!-- Module Content -->
        <div v-else-if="module">
          <!-- Module Banner/Image -->
          <div v-if="module?.image_url" class="mb-6 rounded-lg overflow-hidden">
            <img
              :src="module.image_url"
              :alt="module.title"
              class="w-full h-64 object-cover"
            />
          </div>

          <!-- Module Description Panel -->
          <div v-if="module" class="mb-6">
            <ModuleDescriptionPanel :module="module" />
          </div>

          <!-- Title & Progress -->
          <div class="flex justify-between items-center mb-6">
            <div>
              <h1 class="text-4xl font-extrabold text-gray-900 mb-2">
                {{ module?.emoji }} {{ module?.title }}
              </h1>
              <p v-if="module?.subtitle" class="text-lg text-gray-600">
                {{ module.subtitle }}
              </p>
            </div>
            <div class="text-lg font-semibold text-primary-600">
              {{ currentLessonIndex + 1 }} / {{ module?.lessons?.length || 0 }}
            </div>
          </div>

          <!-- Module Description -->
          <div v-if="module?.description" class="bg-gray-50 p-4 rounded-lg mb-6 border-l-4 border-primary-600">
            <p class="text-gray-700">{{ module.description }}</p>
          </div>

          <!-- Lesson Title -->
          <div v-if="currentLesson" class="mb-4">
            <h2 class="text-2xl font-bold text-gray-800">
              Lesson {{ currentLessonIndex + 1 }}: {{ currentLesson.title }}
            </h2>
          </div>

          <!-- Lesson Content (supports inserting image via [[IMAGE]] placeholder) -->
          <div
            v-if="currentLesson"
            class="prose max-w-none mb-8 text-gray-700 bg-white p-6 rounded-lg"
          >
            <div class="space-y-6">
              <template v-for="(block, blockIndex) in getLessonBlocks(currentLesson)" :key="`block-${blockIndex}`">
                <!-- Text block -->
                <div v-if="block.type === 'text'" class="space-y-4">
                  <template v-for="(segment, segIndex) in splitIntoSegments(block.text)" :key="`seg-${blockIndex}-${segIndex}`">
                    <p v-if="segment.type === 'p'" class="text-gray-700 leading-relaxed text-base">
                      {{ segment.text }}
                    </p>
                    <ul v-else-if="segment.type === 'ul'" class="list-disc pl-6 text-gray-700">
                      <li v-for="(item, itemIndex) in segment.items" :key="`li-${blockIndex}-${segIndex}-${itemIndex}`">
                        {{ item }}
                      </li>
                    </ul>
                  </template>
                </div>

                <!-- Image block -->
                <div v-else-if="block.type === 'image' && block.src" class="my-2">
                  <img
                    :src="block.src"
                    :alt="currentLesson.title || 'Lesson image'"
                    class="w-full rounded-lg border border-gray-100"
                  />
                </div>
              </template>
            </div>
          </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between items-center mt-12">
          <button
            v-if="currentLessonIndex > 0"
            @click="goToPreviousLesson"
            class="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200"
          >
            ← Previous Lesson
          </button>

          <button
            v-if="currentLessonIndex < (module?.lessons?.length || 0) - 1"
            @click="markLessonAndGoToNext"
            class="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700"
            :class="{ 'ml-auto': currentLessonIndex === 0 }"
          >
            Next Lesson →
          </button>

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
          >
            Next Module →
          </button>

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
        </div>
      </section>
    </main>

    <!-- Quiz Prompt Dialog -->
    <div
      v-if="showQuizDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Module Quiz</h2>
        <p class="text-gray-600 mb-4">
          Before you can complete this module, you need to pass the quiz.
        </p>

        <div v-if="quizLoading" class="text-gray-600 py-4">
          Loading quiz information...
        </div>

        <div v-else-if="quizError" class="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
          {{ quizError }}
        </div>

        <div v-else-if="quizInfo" class="space-y-2 mb-4">
          <p><span class="font-semibold">Topic:</span> {{ quizInfo.title }}</p>
          <p><span class="font-semibold">Number of items:</span> {{ quizInfo.questions?.length || 0 }}</p>
          <p><span class="font-semibold">Passing score:</span> {{ quizInfo.passing_score || 70 }}%</p>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button
            v-if="quizInfo"
            type="button"
            @click="showQuizDialog = false"
            class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            v-if="quizInfo"
            type="button"
            @click="goToQuiz"
            :disabled="!quizInfo || !!quizError"
            class="px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Take Quiz
          </button>
          <button
            v-if="!quizInfo && quizError"
            type="button"
            @click="showQuizDialog = false"
            class="px-4 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-primary-600 text-white text-center py-4">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import DashboardHeader from '~/components/studentdashboard/DashboardHeader.vue';
import ModuleDescriptionPanel from '~/components/studentdashboard/ModuleDescriptionPanel.vue';
import ModuleCompletionModal from '~/components/ModuleCompletionModal.vue';
import CertificateModal from '~/components/CertificateModal.vue';
import { useCourseProgress } from '~/composables/useCourseProgress';
import { useModuleManagement } from '~/composables/useModuleManagement';
import { useQuizManagement } from '~/composables/useQuizManagement';
import { useUserProfile } from '~/composables/useUserProfile';
import { useOnboarding } from '~/composables/useOnboarding';

const route = useRoute();
const moduleIdRaw = computed(() => {
  const id = route.params.id;
  return Array.isArray(id) ? id[0] : id || '1';
});
const moduleId = computed(() => moduleIdRaw.value || '1');

// Get lesson parameter from query string
const lessonParam = computed(() => {
  const lesson = route.query.lesson;
  return lesson ? parseInt(lesson as string) : 0;
});

const currentLessonIndex = ref(0);
const completedLessons = ref(new Set());
const showCompletionModal = ref(false);
const showModuleCharacterModal = ref(false);
const showQuizDialog = ref(false);
const quizInfo = ref<any | null>(null);
const quizLoading = ref(false);
const quizError = ref<string | null>(null);
const studentName = ref("Student Name");
const { completeModule, badgeMapping, isModuleCompleted, completeLessonInModule, getTotalProgressPercentage, clearProgress, loadProgressFromSupabase } = useCourseProgress();
const { fetchModuleById, fetchModules, modules, loading } = useModuleManagement();
const { fetchQuizForModule } = useQuizManagement();
const { fetchUserProfile } = useUserProfile();
const { hasSeenModuleIntro, markModuleIntroAsSeen, initializeOnboarding } = useOnboarding();

const module = ref<any>(null);

const isLastModule = computed(() => {
  const sortedModules = allModules.value;
  if (!sortedModules.length || !module.value) return false;
  const lastId = String(sortedModules[sortedModules.length - 1].id);
  return String(module.value.id) === lastId;
});

const earnedBadgeName = computed(() => {
  const courseLevel = module.value?.level || 'beginner';
  
  // Find module position in sorted list
  const sortedModules = allModules.value.filter(m => m.level === courseLevel);
  const modulePosition = sortedModules.findIndex(m => String(m.id) === String(moduleId.value)) + 1; // 1-indexed
  
  const courseBadges = badgeMapping[courseLevel as keyof typeof badgeMapping];
  if (courseBadges && modulePosition > 0) {
    return courseBadges[modulePosition] || 'Unknown Badge';
  }
  return 'Unknown Badge';
});

const allModules = computed(() => {
  return modules.value
    .slice()
    .sort((a: any, b: any) => {
      const aNum = parseInt(a.title?.match(/\d+/)?.[0] || '0', 10);
      const bNum = parseInt(b.title?.match(/\d+/)?.[0] || '0', 10);
      return aNum - bNum;
    });
});

const allBeginnerModules = computed(() =>
  allModules.value.filter((m: any) => m.level === 'beginner'),
);

// Fetch all modules on mount to show in sidebar
onMounted(async () => {
  try {
    // Fetch user profile to get full_name
    const userData = await fetchUserProfile();
    if (userData?.full_name) {
      studentName.value = userData.full_name;
    }
    await fetchAllModules();
    
    // Initialize onboarding state
    initializeOnboarding();
    
    // Show character modal if user hasn't seen intro for this module yet
    if (!hasSeenModuleIntro(moduleId.value)) {
      // Wait for module to load before showing modal
      setTimeout(() => {
        showModuleCharacterModal.value = true;
      }, 500);
    }
    
    window.scrollTo({ top: 0, behavior: 'auto' });
  } catch (err) {
    console.error('Error on mount:', err);
  }
});

// Handle module character modal close
const handleModuleCharacterClose = () => {
  showModuleCharacterModal.value = false;
  markModuleIntroAsSeen(moduleId.value);
};

// Handle module character modal skip
const handleModuleCharacterSkip = () => {
  showModuleCharacterModal.value = false;
  markModuleIntroAsSeen(moduleId.value);
};

const fetchAllModules = async () => {
  try {
    if (!modules.value.length) {
      await fetchModules();
    }
  } catch (err) {
    console.error('Error fetching all modules:', err);
  }
};

const checkAndOpenQuizDialog = async () => {
  if (!module.value) return;
  quizLoading.value = true;
  quizError.value = null;
  quizInfo.value = null;

  try {
    const data = await fetchQuizForModule(String(module.value.id));
    if (!data) {
      // No quiz exists for this module - show message and prevent proceeding
      quizError.value = 'The quiz for this module is not ready yet. Please check back later or contact your instructor.';
      showQuizDialog.value = true;
      return;
    }
    quizInfo.value = data as any;
    showQuizDialog.value = true;
  } catch (err) {
    console.error('Error checking quiz:', err);
    quizError.value = 'Failed to load quiz information. Please try again later.';
    showQuizDialog.value = true;
  } finally {
    quizLoading.value = false;
  }
};

const goToQuiz = () => {
  if (!quizInfo.value?.id) return;
  showQuizDialog.value = false;
  window.scrollTo({ top: 0, behavior: 'auto' });
  navigateTo(`/quizzes/${quizInfo.value.id}`);
};

const currentLesson = computed(() => {
  if (!module.value || !module.value.lessons || module.value.lessons.length === 0) {
    return null;
  }
  return module.value.lessons[currentLessonIndex.value] || null;
});

const isCurrentModuleCompleted = computed(() => {
  const level = module.value?.level || 'beginner';
  return isModuleCompleted(level, moduleId.value);
});

const goToPreviousLesson = () => {
  if (currentLessonIndex.value > 0) {
    currentLessonIndex.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const goToNextLesson = () => {
  if (module.value && module.value.lessons && currentLessonIndex.value < module.value.lessons.length - 1) {
    currentLessonIndex.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const hasNextModule = computed(() => {
  const currentIndex = allModules.value.findIndex(
    (m: any) => String(m.id) === moduleId.value,
  );
  return currentIndex >= 0 && currentIndex < allModules.value.length - 1;
});

const progressPercentage = computed(() => {
  const level = module.value?.level || 'beginner';
  const totalModules = allModules.value.filter(m => m.level === level).length;
  const totalLessons = module.value?.lessons?.length || 0;
  return getTotalProgressPercentage(level, totalModules, moduleId.value, totalLessons);
});

type LessonBlock = { type: 'text'; text: string } | { type: 'image'; src: string }

const stripHtmlToText = (input: string) => {
  // Convert common HTML structures into readable plain text.
  return (input || '')
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<\/\s*p\s*>/gi, '\n\n')
    .replace(/<\/\s*h[1-6]\s*>/gi, '\n\n')
    .replace(/<\s*h[1-6][^>]*>/gi, '')
    .replace(/<\/\s*li\s*>/gi, '\n')
    .replace(/<\s*li[^>]*>/gi, '- ')
    .replace(/<\/\s*(ul|ol)\s*>/gi, '\n\n')
    .replace(/<\s*(ul|ol)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const legacyHtmlToBlocks = (html: string): LessonBlock[] => {
  const input = (html || '').trim()
  if (!input) return []

  const blocks: LessonBlock[] = []
  const imgRegex = /<img\b[^>]*\bsrc\s*=\s*(['"])(.*?)\1[^>]*>/gi

  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = imgRegex.exec(input)) !== null) {
    const before = input.slice(lastIndex, match.index)
    const src = (match[2] || '').trim()

    const beforeText = stripHtmlToText(before)
    if (beforeText) blocks.push({ type: 'text', text: beforeText })
    if (src) blocks.push({ type: 'image', src })

    lastIndex = match.index + match[0].length
  }

  const after = input.slice(lastIndex)
  const afterText = stripHtmlToText(after)
  if (afterText) blocks.push({ type: 'text', text: afterText })

  return blocks
}

const getLessonBlocks = (lesson: any): LessonBlock[] => {
  if (!lesson) return []

  // New format (safe blocks, no HTML)
  if (Array.isArray(lesson.blocks) && lesson.blocks.length > 0) {
    return lesson.blocks
      .filter((b: any) => b && (b.type === 'text' || b.type === 'image'))
      .map((b: any) => (b.type === 'image'
        ? ({ type: 'image', src: typeof b.src === 'string' ? b.src : '' } as const)
        : ({ type: 'text', text: typeof b.text === 'string' ? b.text : '' } as const)
      ))
  }

  // Backward compatibility (old htmlContent + single image_url)
  const blocks: LessonBlock[] = []
  const htmlContent = typeof lesson.htmlContent === 'string' ? lesson.htmlContent.trim() : ''
  if (htmlContent) {
    blocks.push(...legacyHtmlToBlocks(htmlContent))
  }

  const imageUrl = typeof lesson.image_url === 'string' ? lesson.image_url.trim() : ''
  if (imageUrl) blocks.push({ type: 'image', src: imageUrl })

  return blocks
}

const splitIntoSegments = (text: string) => {
  const t = (text || '').trim()
  if (!t) return []

  const paragraphs = t.split(/\n\s*\n/g).map(s => s.trim()).filter(Boolean)
  const segments: Array<
    | { type: 'p'; text: string }
    | { type: 'ul'; items: string[] }
  > = []

  for (const p of paragraphs) {
    const lines = p.split('\n').map(l => l.trim()).filter(Boolean)
    const allBullets = lines.length > 0 && lines.every(l => /^-\s+/.test(l))
    if (allBullets) {
      segments.push({ type: 'ul', items: lines.map(l => l.replace(/^-\s+/, '').trim()).filter(Boolean) })
    } else {
      segments.push({ type: 'p', text: p })
    }
  }

  return segments
}

const markLessonAsComplete = async () => {
  completedLessons.value.add(currentLessonIndex.value);
  const currentModuleId = moduleId.value; // Use the string ID directly
  const level = module.value?.level || 'beginner';
  completeLessonInModule(level, currentModuleId, currentLessonIndex.value);

  // Check if all lessons in the current module are completed
  if (module.value && module.value.lessons) {
    const allCurrentLessonsCompleted = module.value.lessons.every((lesson: any, index: number) =>
      completedLessons.value.has(index)
    );
    if (allCurrentLessonsCompleted) {
      // All lessons done – check if quiz exists before allowing completion
      await checkAndOpenQuizDialog();
    }
  }
};

const handleNextModule = () => {
  const currentIndex = allBeginnerModules.value.findIndex(
    (m: any) => String(m.id) === moduleId.value,
  );
  const nextModuleIndex = currentIndex + 1;
  if (currentIndex >= 0 && nextModuleIndex < allBeginnerModules.value.length) {
    // Close modal first
    showCompletionModal.value = false;
    // Reset lesson index and completed lessons for new module
    currentLessonIndex.value = 0;
    completedLessons.value.clear();
    // Navigate
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigateTo(`/modules/${allBeginnerModules.value[nextModuleIndex].id}`);
  }
};

const handleAdvancedCourse = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  navigateTo('/dashboard?course=advanced');
};

const handleBackToDashboard = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  navigateTo('/dashboard');
};

const markLessonAndGoToNext = () => {
  markLessonAsComplete();
  if (currentLessonIndex.value < module.value.lessons.length - 1) {
    goToNextLesson();
  }
};

const goToModule = (id: string, lessonIndex: number = 0) => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  navigateTo(`/modules/${id}?lesson=${lessonIndex}`);
};

const isModuleAccessible = (moduleId: string, index: number) => {
  // Modules are ordered consistently in allModules; unlock sequentially
  if (index === 0) {
    return true;
  }

  if (index > 0) {
    const prevMod = allModules.value[index - 1] as any;
    if (prevMod) {
      return isModuleCompleted(prevMod.level || 'beginner', String(prevMod.id));
    }
  }
  return false;
};

// Load module data on mount or when moduleId changes
watch(moduleId, async (newModuleId) => {
  const moduleData = await fetchModuleById(newModuleId);
  if (moduleData) {
    module.value = moduleData;
    // Set lesson from query param if provided, otherwise start at 0
    currentLessonIndex.value = lessonParam.value;
    // Clear completed lessons for this module (user hasn't completed any yet in this view)
    completedLessons.value.clear();

    if (module.value) {
      useHead({
        title: `${module.value.title} - MIL MOOC`,
      });
    }
  }
}, { immediate: true });

// Load progress and modules on component mount
onMounted(async () => {
  try {
    clearProgress();
    await loadProgressFromSupabase();
  } catch (err) {
    console.error('Error loading progress:', err);
  }
});

// When coming back from a passed quiz, automatically show completion modal
const fromQuiz = computed(() => route.query.fromQuiz === '1');

watch(fromQuiz, (val) => {
  if (val && module.value) {
    showCompletionModal.value = true;
  }
}, { immediate: true });

// Watch for lesson parameter changes
watch(lessonParam, (newLessonParam) => {
  if (newLessonParam !== currentLessonIndex.value && newLessonParam >= 0) {
    currentLessonIndex.value = newLessonParam;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});
</script>

<style>
/* Keep original prose feel while rendering safe blocks (no v-html). */
.prose p {
  margin-bottom: 1em;
  line-height: 1.6;
}
.prose ul {
  margin-bottom: 1em;
}
.prose li {
  margin-bottom: 0.5em;
}
</style>
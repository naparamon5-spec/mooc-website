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
              v-for="(mod, moduleIndex) in allBeginnerModules"
              :key="mod.id"
              class="space-y-1"
            >
              <!-- Module Title -->
              <div
                @click="isModuleAccessible(String(mod.id), moduleIndex) && goToModule(String(mod.id), 0)"
                class="p-3 rounded-lg cursor-pointer font-bold text-sm transition-colors"
                :class="[
                  mod.id === moduleId
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-800 hover:bg-gray-100',
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
                  class="p-2 rounded text-xs transition-colors"
                  :class="[
                    mod.id === moduleId && currentLessonIndex === lessonIndex
                      ? 'bg-primary-500 text-white font-semibold'
                      : mod.id === moduleId
                      ? 'text-primary-600 font-medium'
                      : 'text-gray-600',
                    !isModuleAccessible(String(mod.id), moduleIndex) && 'opacity-50'
                  ]"
                >
                  <span v-if="mod.id === parseInt(moduleId) && currentLessonIndex === lessonIndex" class="mr-2">✓</span>
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

          <!-- Lesson Content -->
          <div
            v-if="currentLesson"
            class="prose max-w-none mb-8 text-gray-700 bg-white p-6 rounded-lg"
            v-html="currentLesson.htmlContent"
          />

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
            v-else
            @click="markLessonAsComplete"
            class="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 ml-auto"
          >
            Complete Module ✓
          </button>
        </div>
        </div>
      </section>
    </main>

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
const studentName = ref("Student's Name");
const { completeModule, badgeMapping, isModuleCompleted, completeLessonInModule, getTotalProgressPercentage } = useCourseProgress();
const { fetchModuleById, modules, loading } = useModuleManagement();

const module = ref<any>(null);

const isLastModule = computed(() => {
  // Check if this is the 5th beginner module (last module)
  const allBeginnerModules = modules.value.filter(m => m.level === 'beginner');
  const sortedModules = allBeginnerModules.sort((a, b) => {
    const aNum = parseInt(a.title.match(/\d+/)?.[0] || '0');
    const bNum = parseInt(b.title.match(/\d+/)?.[0] || '0');
    return aNum - bNum;
  });
  return sortedModules.length > 0 && module.value?.id === sortedModules[sortedModules.length - 1].id;
});

const earnedBadgeName = computed(() => {
  const courseLevel = 'beginner' as const;
  
  // Find module position in sorted list
  const sortedModules = allBeginnerModules.value;
  const modulePosition = sortedModules.findIndex(m => m.id === moduleId.value) + 1; // 1-indexed
  
  const courseBadges = badgeMapping[courseLevel];
  if (courseBadges && modulePosition > 0) {
    return courseBadges[modulePosition] || 'Unknown Badge';
  }
  return 'Unknown Badge';
});

const allBeginnerModules = computed(() => {
  return modules.value
    .filter(m => m.level === 'beginner')
    .sort((a, b) => {
      const aNum = parseInt(a.title.match(/\d+/)?.[0] || '0');
      const bNum = parseInt(b.title.match(/\d+/)?.[0] || '0');
      return aNum - bNum;
    });
});

// Fetch all modules on mount to show in sidebar
onMounted(async () => {
  await fetchAllModules();
  window.scrollTo({ top: 0, behavior: 'auto' });
});

const fetchAllModules = async () => {
  const { $supabase } = useNuxtApp();
  const supabase = $supabase;
  try {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('level', 'beginner')
      .order('id', { ascending: true });
    
    if (error) throw error;
    if (data) {
      // Update modules with fetched data
      modules.value = data;
    }
  } catch (err) {
    console.error('Error fetching all modules:', err);
  }
};

const currentLesson = computed(() => {
  if (!module.value || !module.value.lessons || module.value.lessons.length === 0) {
    return null;
  }
  return module.value.lessons[currentLessonIndex.value] || null;
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

const progressPercentage = computed(() => {
  const totalLessons = module.value?.lessons?.length || 0;
  return getTotalProgressPercentage('beginner', 5, moduleId.value, totalLessons);
});

const markLessonAsComplete = () => {
  completedLessons.value.add(currentLessonIndex.value);
  const currentModuleId = moduleId.value; // Use the string ID directly
  completeLessonInModule('beginner', currentModuleId, currentLessonIndex.value);

  // Check if all lessons in the current module are completed
  if (module.value && module.value.lessons) {
    const allCurrentLessonsCompleted = module.value.lessons.every((lesson: any, index: number) =>
      completedLessons.value.has(index)
    );
    if (allCurrentLessonsCompleted) {
      completeModule('beginner', currentModuleId);
      showCompletionModal.value = true;
    }
  }
};

const handleNextModule = () => {
  const nextModuleIndex = allBeginnerModules.value.findIndex(m => m.id === moduleId.value) + 1;
  if (nextModuleIndex < allBeginnerModules.value.length) {
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
  if (index === 0) {
    return true;
  }
  if (index > 0) {
    const prevMod = allBeginnerModules.value[index - 1];
    if (prevMod) {
      return isModuleCompleted('beginner', prevMod.id);
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

// Watch for lesson parameter changes
watch(lessonParam, (newLessonParam) => {
  if (newLessonParam !== currentLessonIndex.value && newLessonParam >= 0) {
    currentLessonIndex.value = newLessonParam;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});
</script>

<style>
/* Basic styling for content rendered with v-html for better readability */
.prose h2 {
  font-size: 1.5em;
  font-weight: 600;
  margin-bottom: 0.5em;
}
.prose p {
  margin-bottom: 1em;
  line-height: 1.6;
}
.prose ul {
  list-style-position: inside;
  padding-left: 1.5em;
  margin-bottom: 1em;
}
.prose li {
  margin-bottom: 0.5em;
}
</style>

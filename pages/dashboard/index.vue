<template>
  <div class="bg-gray-50 flex flex-col min-h-screen">
    <DashboardHeader :student-name="studentName" />

    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block mb-2">
          <svg class="animate-spin h-12 w-12 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p class="text-gray-600 font-semibold">Loading your courses...</p>
      </div>
    </div>

    <div v-else class="flex-1 max-w-full mx-auto px-4 md:px-8 lg:px-12 py-8 overflow-y-auto overflow-x-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <DashboardSidebar
            :student-name="studentName"
            :current-module="currentCourseData.currentModule"
            :badges="currentCourseData.badges"
            :completion-status="currentCourseData.completionStatus"
            :completed-modules="currentCourseData.completedModules"
            :completed-lessons-in-current-module="currentCourseData.completedLessonsInCurrentModule"
            :total-modules="currentCourseData.totalModules"
            :active-course="currentCourseLevel"
            @switch-course="switchCourseLevel"
          />
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3">
          <!-- Course Level Selector -->
 <div class="mb-4">
  <div class="flex gap-4 relative items-start">
    <button
      v-for="level in courseLevels"
      :key="level.id"
      @click="switchCourseLevel(level.id)"
      :disabled="level.id === 'advanced' && !isBeginnerCourseCompleted()"
      class="px-6 py-2 rounded-lg min-w-[160px] font-semibold transition-all duration-200
             relative group whitespace-nowrap"
      :class="
        currentCourseLevel === level.id
          ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg'
          : level.id === 'advanced' && !isBeginnerCourseCompleted()
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
      "
    >
      {{ level.name }}

      <!-- Tooltip -->
      <div
        v-if="level.id === 'advanced' && !isBeginnerCourseCompleted()"
        class="invisible group-hover:visible
               absolute left-full top-1/2 -translate-y-1/2 ml-3
               px-3 py-2 bg-gray-900 text-white text-sm rounded
               whitespace-nowrap z-20"
      >
        Complete the Beginner Course to unlock Advanced
        <div
          class="absolute right-full top-1/2 -translate-y-1/2
                 border-4 border-transparent border-r-gray-900"
        ></div>
      </div>
    </button>
  </div>
</div>


          <!-- Modules Grid with Header -->
          <div v-if="currentModules.length > 0">
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
              <ModuleCard
                v-for="(module, index) in currentModules"
                :key="`${currentCourseLevel}-${module.id}`"
                :title="module.title"
                :subtitle="module.subtitle"
                :is-active="selectedModule?.id === module.id"
                :is-restricted="!isModuleAccessible(module.id, index)"
                :is-completed="isModuleCompleted(currentCourseLevel as 'beginner' | 'advanced', module.id)"
                :emoji="module.emoji"
                :module-id="module.id"
                :image-url="module.image_url"
                @click="selectModule(module)"
              />
            </div>
          </div>

          <!-- Module Description with Learning Outcomes -->
          <div v-if="selectedModule" class="mb-4">
            <ModuleDescriptionPanel :module="selectedModule" />
          </div>

          <!-- Footer Buttons -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <button
              class="px-4 py-2 rounded-lg font-semibold transition-all duration-200 bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg hover:scale-105 text-sm"
            >
              ❓ FAQs
            </button>
            <button
              class="px-4 py-2 rounded-lg font-semibold transition-all duration-200 bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg hover:scale-105 text-sm"
            >
              🚨 Report Fraud
            </button>
            <button
              class="px-4 py-2 rounded-lg font-semibold transition-all duration-200 bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg hover:scale-105 text-sm"
            >
              ℹ️ About Us
            </button>
          </div>
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
import { ref, computed, watchEffect, watch, onMounted } from "vue";
// Protect this page with the `auth` middleware
definePageMeta({ middleware: 'auth' })
import DashboardHeader from "~/components/studentdashboard/DashboardHeader.vue";
import DashboardSidebar from "~/components/studentdashboard/DashboardSidebar.vue";
import ModuleCard from "~/components/studentdashboard/ModuleCard.vue";
import ModuleDescriptionPanel from "~/components/studentdashboard/ModuleDescriptionPanel.vue";
import { useCourseProgress } from "~/composables/useCourseProgress";
import { useUserProfile } from "~/composables/useUserProfile";
import { useRoute } from 'vue-router';
import { useModuleManagement } from "~/composables/useModuleManagement";

useHead({
  title: "Dashboard - MIL MOOC",
});

const route = useRoute();

const studentName = ref("Student's name");
const isLoading = ref(true);
const { fetchUserProfile } = useUserProfile();

// Fetch user profile and modules on mount
onMounted(async () => {
  try {
    const userData = await fetchUserProfile();
    if (userData?.full_name) {
      studentName.value = userData.full_name;
    }
    
    // Load all modules (no level filter - fetch everything)
    if (modules.value.length === 0) {
      await fetchModules();
    }

    // Load progress from Supabase
    await loadProgressFromSupabase();
  } finally {
    isLoading.value = false;
  }
});

const { 
  getCompletedModules, 
  getEarnedBadges,
  getAllBadges,
  getProgressPercentage, 
  getCompletionStatus,
  getCurrentModule,
  getCompletedCount,
  isBeginnerCourseCompleted,
  isModuleCompleted,
  courseProgress,
  getTotalProgressPercentage,
  completeLessonInModule,
  getCompletedLessons,
  badgeMapping,
  completeModule,
  loadProgressFromSupabase
} = useCourseProgress();

const { fetchModuleById, modules, fetchModules } = useModuleManagement();

// Currently selected module
const selectedModule = ref<any>(null);

// Course levels configuration
const courseLevels = ref([
  { id: "beginner", name: "Beginner Course" },
  { id: "advanced", name: "Advanced Course" },
]);

// Current course level
const currentCourseLevel = ref("beginner");

// Initialize course level from route query if present
watchEffect(() => {
  const courseParam = route.query.course as string;
  if (courseParam === 'advanced' && isBeginnerCourseCompleted()) {
    currentCourseLevel.value = 'advanced';
  } else if (courseParam === 'advanced' && !isBeginnerCourseCompleted()) {
    currentCourseLevel.value = 'beginner';
  }
});

// Computed properties for current course data
const currentCourseData = computed(() => {
  const courseLevel = currentCourseLevel.value as 'beginner' | 'advanced'
  const dbModules = currentModules.value;
  
  // Get completed modules count
  const completedModulesCount = getCompletedCount(courseLevel);
  
  // Get completed lessons in the current (next incomplete) module
  let completedLessonsInCurrent = 0;
  const firstIncompleteModule = dbModules.find((m: any) => !isModuleCompleted(courseLevel, m.id));
  if (firstIncompleteModule) {
    const completedLessons = getCompletedLessons(courseLevel, firstIncompleteModule.id);
    completedLessonsInCurrent = completedLessons.length;
  }
  
  return {
    modules: dbModules,
    totalModules: dbModules.length,
    completionStatus: getCompletionStatus(courseLevel, dbModules.length),
    currentModule: getCurrentModule(courseLevel, dbModules),
    completedModules: completedModulesCount,
    completedLessonsInCurrentModule: completedLessonsInCurrent,
    badges: getAllBadges(courseLevel),
  }
});

const currentModules = computed(() => {
  const courseLevel = currentCourseLevel.value as 'beginner' | 'advanced'
  
  // Get modules from database filtered by level, sorted by creation date
  const dbModules = modules.value
    .filter(m => m.level === courseLevel)
    .sort((a, b) => {
      // Sort by created_at to maintain consistent order
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateA - dateB;
    });
  
  return dbModules;
});

// Check if a module is accessible
const isModuleAccessible = (moduleId: string, index: number): boolean => {
  const courseLevel = currentCourseLevel.value as 'beginner' | 'advanced'
  
  // First module is always accessible
  if (index === 0) return true;
  
  // Check if the previous module is completed
  if (index > 0) {
    const previousModule = currentModules.value[index - 1];
    return isModuleCompleted(courseLevel, previousModule.id);
  }
  return false;
};

const switchCourseLevel = (levelId: string) => {
  if (levelId === 'advanced' && !isBeginnerCourseCompleted()) {
    return; // Prevent switching to advanced if beginner not completed
  }
  currentCourseLevel.value = levelId;
};

// Watch for changes in currentModules to set initial selectedModule to first incomplete
watchEffect(() => {
  if (currentModules.value && currentModules.value.length > 0) {
    const courseLevel = currentCourseLevel.value as 'beginner' | 'advanced'
    
    // Always select the first incomplete module (current active module)
    const firstIncompleteModule = currentModules.value.find(m => !isModuleCompleted(courseLevel, m.id));
    
    if (firstIncompleteModule) {
      selectedModule.value = firstIncompleteModule;
    } else {
      // If all modules completed, show first module
      selectedModule.value = currentModules.value[0];
    }
  } else {
    selectedModule.value = null;
  }
});

// Select a module and navigate to it
const selectModule = (module: any) => {
  const index = currentModules.value.findIndex(m => m.id === module.id);
  const courseLevel = currentCourseLevel.value as 'beginner' | 'advanced'
  
  // Only allow navigation to accessible modules
  if (isModuleAccessible(module.id, index)) {
    selectedModule.value = module;
    navigateTo(`/modules/${module.id}`);
  }
};

// Get module progress percentage (20% per module when completed, or based on lesson completion)
const getModuleProgress = (moduleId: string): number => {
  if (isModuleCompleted(currentCourseLevel.value as 'beginner' | 'advanced', moduleId)) {
    return 100;
  }
  
  const completedLessons = getCompletedLessons(currentCourseLevel.value as 'beginner' | 'advanced', moduleId);
  const totalLessons = 4; // Assuming 4 lessons per module
  return Math.round((completedLessons.length / totalLessons) * 100);
};

// Get count of completed lessons for a module
const getCompletedLessonsCount = (moduleId: string): number => {
  return getCompletedLessons(currentCourseLevel.value as 'beginner' | 'advanced', moduleId).length;
};

// Check if a lesson is completed
const isLessonCompleted = (moduleId: string, lessonIndex: number): boolean => {
  const completedLessons = getCompletedLessons(currentCourseLevel.value as 'beginner' | 'advanced', moduleId);
  return completedLessons.includes(lessonIndex);
};

// Get badge name for a module
const getBadgeForModule = (moduleId: string): string => {
  const courseLevel = currentCourseLevel.value as 'beginner' | 'advanced';
  const courseBadges = badgeMapping[courseLevel];
  
  // Find the position of this module in the current modules list
  const moduleIndex = currentModules.value.findIndex(m => m.id === moduleId);
  if (moduleIndex >= 0 && courseBadges) {
    const modulePosition = moduleIndex + 1; // 1-indexed for badge matching
    const badgeName = (courseBadges as any)[modulePosition];
    if (badgeName) return badgeName;
  }
  
  return 'Achievement Unlocked';
};

// Navigate to a specific lesson
const goToLesson = (moduleId: string, lessonIndex: number) => {
  navigateTo(`/modules/${moduleId}?lesson=${lessonIndex}`);
};
</script>

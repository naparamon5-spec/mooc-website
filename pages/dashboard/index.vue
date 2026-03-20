<template>
  <div class="bg-gray-50 flex flex-col min-h-screen">
    <DashboardHeader :student-name="studentName" />

    <!-- Course Agreement Modal (fallback; inline card used after "Click here!") -->
    <CourseAgreementModal
      :isOpen="showAgreementModal"
      :allowCancel="false"
      @agree="handleAgreementAccepted"
      @decline="handleAgreementDeclined"
    />

    <!-- Instructor Character Modal for Onboarding -->
    <InstructorCharacter
      :isOpen="showCharacterModal"
      mode="onboarding"
      title="Welcome to Your Learning Journey!"
      :messages="[
        `Hello ${studentName}! 👋 I'm Alex, your personal learning guide.`,
        'I\'m here to help you navigate through this course and make sure you get the most out of every lesson.',
        'Complete modules in order, earn badges, and track your progress on your dashboard. Whenever you start a new module, I\'ll be here to guide you!',
      ]"
      :tips="[
        'Complete all modules in order to unlock advanced content',
        'Take quizzes to test your knowledge and earn badges',
        'Visit your dashboard to track your progress',
        'Reach out from the about us section if you need any help!'
      ]"
      buttonText="Got it, Let's Start!"
      :showSkip="true"
      characterName="Alex"
      @close="handleCharacterClose"
      @skip="handleCharacterSkip"
    />

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

    <div v-else class="flex-1 max-w-full mx-auto px-4 md:px-8 lg:px-12 py-1 overflow-x-hidden">

      <!-- ── Phase / Overdue notice banner (only shown after agreement) ── -->
      <div class="pt-2">
        <NoticesCard
          :key="'notices-' + noticeCardKey"
          :show-welcome-step="false"
          @open-agreement="onOpenAgreement"
        />
      </div>

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
          <!-- After "Click here!": only agreement card; modules and description hidden -->
          <template v-if="showAgreementStep">
            <CourseAgreementCard
              @agree="handleAgreementAccepted"
            />
          </template>

          <template v-else>

            <!-- ── Beginner / Advanced tabs ── -->
            <div class="mb-4">
              <div class="flex flex-wrap gap-2 items-center">
                <button
                  v-for="level in courseLevels"
                  :key="level.id"
                  @click="switchCourseLevel(level.id)"
                  :disabled="level.id === 'advanced' && !isBeginnerCourseCompleted()"
                  class="px-6 py-3 rounded-full text-base font-semibold transition-all relative group"
                  :class="
                    currentCourseLevel === level.id
                      ? 'text-white shadow-md'
                      : level.id === 'advanced' && !isBeginnerCourseCompleted()
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  "
                  :style="currentCourseLevel === level.id ? { backgroundColor: '#001a4d' } : {}"
                >
                  {{ level.name }}
                  <div
                    v-if="level.id === 'advanced' && !isBeginnerCourseCompleted()"
                    class="invisible group-hover:visible absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded z-20 whitespace-nowrap"
                  >
                    Complete the Beginner Course to unlock Advanced
                    <div class="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                  </div>
                </button>
              </div>
            </div>

            <!-- ── Modules Grid ── -->
            <div v-if="currentModules.length > 0">
              <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
                <ModuleCard
                  v-for="(module, index) in currentModules"
                  :key="`${currentCourseLevel}-${module.id}`"
                  :title="module.title"
                  :subtitle="module.subtitle"
                  :is-active="selectedModule?.id === module.id"
                  :is-restricted="!isModuleAccessible(module.id, index)"
                  :restriction-message="!hasAcceptedAgreement ? 'Accept the course agreement to unlock modules' : 'Complete previous module'"
                  :is-completed="isModuleCompleted(currentCourseLevel as 'beginner' | 'advanced', module.id)"
                  :emoji="module.emoji"
                  :module-id="module.id"
                  :image-url="module.image_url"
                  @click="selectModule(module)"
                />
              </div>
            </div>

            <!-- ── Welcome Video (below modules, replaces description) ── -->
            <WelcomeVideo
              v-if="showWelcomeVideo"
              @open-agreement="onOpenAgreement"
            />

            <!-- ── Module Video (hidden during welcome step) ── -->
            <div v-else-if="selectedModule" class="mb-4">
              <ModuleVideoPanel :module="selectedModule" />
            </div>

          </template>

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
definePageMeta({ middleware: 'auth' })
import DashboardHeader from "~/components/studentdashboard/DashboardHeader.vue";
import DashboardSidebar from "~/components/studentdashboard/DashboardSidebar.vue";
import ModuleCard from "~/components/studentdashboard/ModuleCard.vue";
import ModuleVideoPanel from "~/components/studentdashboard/ModuleVideoPanel.vue";
import NoticesCard from "~/components/studentdashboard/NoticesCard.vue";
import WelcomeCard from "~/components/studentdashboard/WelcomeCard.vue";
import WelcomeVideo from "~/components/studentdashboard/WelcomeVideo.vue";
import CourseAgreementModal from "~/components/studentdashboard/CourseAgreementModal.vue";
import CourseAgreementCard from "~/components/studentdashboard/CourseAgreementCard.vue";
import { useCourseProgress } from "~/composables/useCourseProgress";
import { useUserProfile } from "~/composables/useUserProfile";
import { useOnboarding } from "~/composables/useOnboarding";
import { useModuleAutoAssignment } from "~/composables/useModuleAutoAssignment";
import { useCourseAgreement } from "~/composables/useCourseAgreement";
import { useRoute } from 'vue-router';
import { useModuleManagement } from "~/composables/useModuleManagement";

useHead({ title: "Dashboard - MIL MOOC" });

const route = useRoute();

const studentName = ref("Student's name");
const showCharacterModal = ref(false);
const showAgreementModal = ref(false);
const isLoading = ref(true);
const { fetchUserProfile } = useUserProfile();
const { hasSeenOnboarding, initializeOnboarding, markOnboardingAsSeen } = useOnboarding();
const { hasAcceptedCourseAgreement, hasClickedWelcome } = useCourseAgreement();
const hasWelcomeVideo = ref(false);

// Tracks whether the user has accepted the course agreement.
// Used to lock module access until acceptance (including Module 1).
const hasAcceptedAgreement = ref(false);

// True when user has not agreed yet and has not clicked "Click here!" — show welcome video below modules
const showWelcomeVideo = ref(false);
// True after "Click here!" until they click "I agree" — show inline agreement card, hide modules and description
const showAgreementStep = ref(false);
// Increment when user accepts agreement so NoticesCard remounts and refetches agreement date
const noticeCardKey = ref(0);

onMounted(async () => {
  try {
    clearProgress();
    await loadProgressFromSupabase();
    
    const { $supabase } = useNuxtApp();
    const { data: { user } } = await $supabase.auth.getUser();
    
    // Check if welcome video exists
    try {
      const { data } = await $supabase
        .from('welcome_video_metadata')
        .select('video_url')
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .single();
      
      if (data?.video_url) {
        hasWelcomeVideo.value = true;
      }
    } catch (err) {
      console.warn('Could not check for welcome video:', err);
    }
    
    const userData = await fetchUserProfile();
    if (userData?.full_name) {
      studentName.value = userData.full_name;
    }
    
    if (user?.id) {
      const hasAgreed = await hasAcceptedCourseAgreement(user.id);
      hasAcceptedAgreement.value = hasAgreed;

      if (!hasAgreed) {
        const clickedWelcome = await hasClickedWelcome(user.id);
        if (!clickedWelcome) {
          // Step 1: Show modules + welcome video below them
          showWelcomeVideo.value = true;
        } else {
          // Step 2: They clicked "Click here!" — show inline agreement card
          showAgreementStep.value = true;
        }
      }
    }
    
    if (user?.id) {
      const { ensureModulesAssigned, checkDeadlineStatus } = useModuleAutoAssignment();
      await ensureModulesAssigned(user.id);
      await checkDeadlineStatus(user.id);
    }
    
    if (modules.value.length === 0) {
      await fetchModules();
    }

    initializeOnboarding();
    
    if (!hasSeenOnboarding.value) {
      showCharacterModal.value = true;
    }
  } finally {
    isLoading.value = false;
  }
});

const handleCharacterClose = async () => {
  showCharacterModal.value = false;
  await markOnboardingAsSeen();
};

const handleCharacterSkip = async () => {
  showCharacterModal.value = false;
  await markOnboardingAsSeen();
};

// After "Click here!" — show inline agreement, hide modules and description
const onOpenAgreement = () => {
  showWelcomeVideo.value = false;
  showAgreementStep.value = true;
};

const handleAgreementAccepted = async () => {
  showAgreementModal.value = false;
  showWelcomeVideo.value = false;
  showAgreementStep.value = false;
  noticeCardKey.value += 1;
  hasAcceptedAgreement.value = true;

  try {
    const { $supabase } = useNuxtApp();
    const { data: { user } } = await $supabase.auth.getUser();
    
    if (user?.id) {
      const { ensureModulesAssigned, checkDeadlineStatus } = useModuleAutoAssignment();
      await ensureModulesAssigned(user.id);
      await checkDeadlineStatus(user.id);
    }
    
    if (modules.value.length === 0) {
      await fetchModules();
    }

    initializeOnboarding();
    
    if (!hasSeenOnboarding.value) {
      showCharacterModal.value = true;
    }
  } catch (error) {
    console.error('Error after agreement acceptance:', error);
  }
};

const handleAgreementDeclined = () => {
  showAgreementModal.value = false;
};

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
  loadProgressFromSupabase,
  clearProgress,
} = useCourseProgress();

const { fetchModuleById, modules, fetchModules } = useModuleManagement();

const selectedModule = ref<any>(null);

const courseLevels = ref([
  { id: "beginner", name: "Beginner Course" },
  { id: "advanced", name: "Advanced Course" },
]);

const currentCourseLevel = ref("beginner");

watchEffect(() => {
  const courseParam = route.query.course as string;
  if (courseParam === 'advanced' && isBeginnerCourseCompleted()) {
    currentCourseLevel.value = 'advanced';
  } else if (courseParam === 'advanced' && !isBeginnerCourseCompleted()) {
    currentCourseLevel.value = 'beginner';
  }
});

const currentCourseData = computed(() => {
  const courseLevel = currentCourseLevel.value as 'beginner' | 'advanced'
  const dbModules = currentModules.value;
  
  const completedModulesCount = getCompletedCount(courseLevel);
  
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
  return modules.value
    .filter(m => m.level === courseLevel && m.is_active)
    .slice()
    .sort((a, b) => {
      const aNum = parseInt(a.title?.match(/\d+/)?.[0] || '0', 10);
      const bNum = parseInt(b.title?.match(/\d+/)?.[0] || '0', 10);
      return aNum - bNum;
    });
});

const isModuleAccessible = (moduleId: string, index: number): boolean => {
  // Modules should remain locked until the student agrees to the course agreement.
  if (!hasAcceptedAgreement.value) return false;

  const courseLevel = currentCourseLevel.value as 'beginner' | 'advanced'
  if (index === 0) return true;
  if (index > 0) {
    const previousModule = currentModules.value[index - 1];
    return isModuleCompleted(courseLevel, previousModule.id);
  }
  return false;
};

const switchCourseLevel = (levelId: string) => {
  if (levelId === 'advanced' && !isBeginnerCourseCompleted()) return;
  currentCourseLevel.value = levelId;
};

watchEffect(() => {
  if (currentModules.value && currentModules.value.length > 0) {
    const courseLevel = currentCourseLevel.value as 'beginner' | 'advanced'
    const firstIncompleteModule = currentModules.value.find(m => !isModuleCompleted(courseLevel, m.id));
    if (firstIncompleteModule) {
      selectedModule.value = firstIncompleteModule;
    } else {
      selectedModule.value = currentModules.value[0];
    }
  } else {
    selectedModule.value = null;
  }
});

const selectModule = (module: any) => {
  const index = currentModules.value.findIndex(m => m.id === module.id);
  if (isModuleAccessible(module.id, index)) {
    selectedModule.value = module;
    navigateTo(`/modules/${module.id}`);
  }
};

const getModuleProgress = (moduleId: string): number => {
  if (isModuleCompleted(currentCourseLevel.value as 'beginner' | 'advanced', moduleId)) return 100;
  const completedLessons = getCompletedLessons(currentCourseLevel.value as 'beginner' | 'advanced', moduleId);
  return Math.round((completedLessons.length / 4) * 100);
};

const getCompletedLessonsCount = (moduleId: string): number => {
  return getCompletedLessons(currentCourseLevel.value as 'beginner' | 'advanced', moduleId).length;
};

const isLessonCompleted = (moduleId: string, lessonIndex: number): boolean => {
  const completedLessons = getCompletedLessons(currentCourseLevel.value as 'beginner' | 'advanced', moduleId);
  return completedLessons.includes(lessonIndex);
};

const getBadgeForModule = (moduleId: string): string => {
  const courseLevel = currentCourseLevel.value as 'beginner' | 'advanced';
  const courseBadges = badgeMapping[courseLevel];
  const moduleIndex = currentModules.value.findIndex(m => m.id === moduleId);
  if (moduleIndex >= 0 && courseBadges) {
    const badgeName = (courseBadges as any)[moduleIndex + 1];
    if (badgeName) return badgeName;
  }
  return 'Achievement Unlocked';
};

const goToLesson = (moduleId: string, lessonIndex: number) => {
  navigateTo(`/modules/${moduleId}?lesson=${lessonIndex}`);
};
</script>
<template>
  <div class="bg-gray-50 flex flex-col min-h-screen">
    <DashboardHeader :student-name="studentName" />

    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block mb-1">
          <svg class="animate-spin h-12 w-12 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p class="text-gray-600 font-semibold">Loading your courses...</p>
      </div>
    </div>

    <div v-else class="flex-1 w-full px-4 md:px-8 lg:px-12 py-1">
      <div class="pt-1">
        <NoticesCard
          :key="'notices-' + noticeCardKey"
          :show-welcome-step="false"
          @open-agreement="onOpenAgreement"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-2 mt-1">
        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-1">
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
        <div class="lg:col-span-3 min-w-0">
          <template v-if="showAgreementStep">
            <CourseAgreementCard :course-level="currentCourseLevel as 'beginner' | 'advanced'" @agree="handleAgreementAccepted" />
          </template>

          <template v-else>
            <!-- Beginner / Advanced tabs -->
            <div class="mb-2">
              <div class="flex flex-wrap gap-1 items-center">
                <button
                  v-for="level in courseLevels"
                  :key="level.id"
                  @click="switchCourseLevel(level.id)"
                  :disabled="level.id === 'advanced' && !isBeginnerCourseCompleted(beginnerModules.length)"
                  class="px-4 py-2 rounded-full text-base font-semibold transition-all relative group"
                  :class="
                    currentCourseLevel === level.id
                      ? 'text-white shadow-md'
                      : level.id === 'advanced' && !isBeginnerCourseCompleted(beginnerModules.length)
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  "
                  :style="currentCourseLevel === level.id ? { backgroundColor: '#001a4d' } : {}"
                >
                  {{ level.name }}
                  <div
                    v-if="level.id === 'advanced' && !isBeginnerCourseCompleted(beginnerModules.length)"
                    class="invisible group-hover:visible absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded z-20 whitespace-nowrap"
                  >
                    Complete the Beginner Course to unlock Advanced
                    <div class="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                  </div>
                </button>
              </div>
            </div>

            <!-- Modules Grid (for beginner) -->
            <div v-if="currentModules.length > 0 && currentCourseLevel === 'beginner'">
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-2">
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
                  :card-image-url="module.card_image_url"
                  :image-url="module.image_url"
                  @click="selectModule(module)"
                />
              </div>
            </div>

            <!-- Modules Grid (for advanced) -->
            <div v-if="currentModules.length > 0 && currentCourseLevel === 'advanced'" class="mb-2">
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-2">
                <ModuleCard
                  v-for="(module, index) in currentModules"
                  :key="`${currentCourseLevel}-${module.id}`"
                  :title="module.title"
                  :subtitle="module.subtitle"
                  :is-active="selectedModule?.id === module.id"
                  :is-restricted="showAdvancedWelcomeVideo || !isModuleAccessible(module.id, index)"
                  :restriction-message="showAdvancedWelcomeVideo ? 'Click continue on the welcome video to proceed' : !hasAcceptedAgreement ? 'Accept the course agreement to unlock modules' : 'Complete previous module'"
                  :is-completed="isModuleCompleted(currentCourseLevel as 'beginner' | 'advanced', module.id)"
                  :emoji="module.emoji"
                  :module-id="module.id"
                  :card-image-url="module.card_image_url"
                  :image-url="module.image_url"
                  @click="selectModule(module)"
                />
              </div>
            </div>

            <!-- Welcome Video (Beginner) -->
            <WelcomeVideo
              v-if="showWelcomeVideo && currentCourseLevel === 'beginner'"
              @open-agreement="onOpenAgreement"
            />

            <!-- Welcome Video (Advanced) -->
            <AdvancedWelcomeVideo
              v-if="showAdvancedWelcomeVideo && currentCourseLevel === 'advanced'"
              @continue="handleAdvancedWelcomeContinue"
            />

            <!-- Beginner Course Completed Card (replaces video panel when beginner course completed) -->
            <BeginnerCourseCompletedCard
              v-if="currentCourseLevel === 'beginner' && isBeginnerCourseCompleted(beginnerModules.length) && !showWelcomeVideo && !showAdvancedWelcomeVideo && !cardDismissed"
              @dismissed="cardDismissed = true"
            />

            <!-- Module Video (shows when beginner course not complete or card dismissed) -->
            <div v-if="selectedModule && !showWelcomeVideo && !showAdvancedWelcomeVideo && !(currentCourseLevel === 'beginner' && isBeginnerCourseCompleted(beginnerModules.length) && !cardDismissed)" class="mb-2">
              <ModuleVideoPanel :module="selectedModule" />
            </div>

          </template>

          <!-- Footer Buttons -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3 mb-3">
            <button class="px-4 py-2 rounded-lg font-semibold transition-all duration-200 bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg hover:scale-105 text-sm">
              ❓ FAQs
            </button>
            <button class="px-4 py-2 rounded-lg font-semibold transition-all duration-200 bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg hover:scale-105 text-sm">
              🚨 Report Fraud
            </button>
            <button class="px-4 py-2 rounded-lg font-semibold transition-all duration-200 bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg hover:scale-105 text-sm">
              ℹ️ About Us
            </button>
          </div>
        </div>
      </div>
    </div>

    <footer class="bg-primary-600 text-white text-center py-4">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from "vue";
definePageMeta({ middleware: 'auth' })
import DashboardHeader from "~/components/studentdashboard/DashboardHeader.vue";
import DashboardSidebar from "~/components/studentdashboard/DashboardSidebar.vue";
import ModuleCard from "~/components/studentdashboard/ModuleCard.vue";
import ModuleVideoPanel from "~/components/studentdashboard/ModuleVideoPanel.vue";
import NoticesCard from "~/components/studentdashboard/NoticesCard.vue";
import WelcomeCard from "~/components/studentdashboard/WelcomeCard.vue";
import WelcomeVideo from "~/components/studentdashboard/WelcomeVideo.vue";
import AdvancedWelcomeVideo from "~/components/studentdashboard/AdvancedWelcomeVideo.vue";
import CourseAgreementCard from "~/components/studentdashboard/CourseAgreementCard.vue";
import BeginnerCourseCompletedCard from "~/components/studentdashboard/BeginnerCourseCompletedCard.vue";
import { useCourseProgress } from "~/composables/useCourseProgress";
import { useUserProfile } from "~/composables/useUserProfile";
import { useOnboarding } from "~/composables/useOnboarding";
import { useModuleAutoAssignment } from "~/composables/useModuleAutoAssignment";
import { useCourseAgreement } from "~/composables/useCourseAgreement";
import { useRoute } from 'vue-router';
import { useModuleManagement } from "~/composables/useModuleManagement";
import { useBadgeManagement } from "~/composables/useBadgeManagement";

useHead({ title: "Dashboard - MIL MOOC" });

const route = useRoute();
const studentName = ref("Student's name");
const showCharacterModal = ref(false);
const isLoading = ref(true);
const { fetchUserProfile } = useUserProfile();
const { hasSeenOnboarding, initializeOnboarding, markOnboardingAsSeen } = useOnboarding();
const { hasAcceptedCourseAgreement, hasClickedWelcome, hasClickedAdvancedWelcome, markAdvancedWelcomeClicked } = useCourseAgreement();
const hasWelcomeVideo = ref(false);
const hasAcceptedAgreement = ref(false);
const showWelcomeVideo = ref(false);
const showAgreementStep = ref(false);
const showAdvancedWelcomeVideo = ref(false);
const noticeCardKey = ref(0);
const cardDismissed = ref(false);

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
const { badges: uploadedBadges, fetchBadges } = useBadgeManagement();
type UploadedBadge = {
  course_level: string;
  module_position: number;
  badge_name?: string | null;
  image_url?: string | null;
};

const selectedModule = ref<any>(null);
const courseLevels = ref([
  { id: "beginner", name: "Beginner Course" },
  { id: "advanced", name: "Advanced Course" },
]);
const currentCourseLevel = ref("beginner");

// Real count of active beginner modules from DB — passed to isBeginnerCourseCompleted()
// so it works regardless of how many modules exist, not hardcoded to 5
const beginnerModules = computed(() =>
  modules.value.filter((m: any) => m.level === 'beginner' && m.is_active)
)

onMounted(async () => {
  try {
    clearProgress();
    await loadProgressFromSupabase();

    const { $supabase } = useNuxtApp();
    const { data: { user } } = await $supabase.auth.getUser();

    try {
      const { data } = await $supabase
        .from('welcome_video_metadata')
        .select('video_url')
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .single();
      if (data?.video_url) hasWelcomeVideo.value = true;
    } catch (err) {
      console.warn('Could not check for welcome video:', err);
    }

    const userData = await fetchUserProfile();
    if (userData?.full_name) studentName.value = userData.full_name;

    if (user?.id) {
      const hasAgreed = await hasAcceptedCourseAgreement(user.id);
      hasAcceptedAgreement.value = hasAgreed;
      if (!hasAgreed) {
        const clickedWelcome = await hasClickedWelcome(user.id);
        if (!clickedWelcome) {
          showWelcomeVideo.value = true;
        } else {
          showAgreementStep.value = true;
        }
      }
    }

    if (user?.id) {
      const { ensureModulesAssigned, checkDeadlineStatus } = useModuleAutoAssignment();
      await ensureModulesAssigned(user.id);
      await checkDeadlineStatus(user.id);
    }

    await fetchBadges();

    // Fetch modules first so beginnerModules.value.length is accurate below
    if (modules.value.length === 0) await fetchModules();
    initializeOnboarding();
    if (!hasSeenOnboarding.value) showCharacterModal.value = true;

    // Restore active tab AFTER progress + modules are loaded
    const courseParam = route.query.course as string;
    const totalBeginner = beginnerModules.value.length;

    if (courseParam === 'advanced' && isBeginnerCourseCompleted(totalBeginner)) {
      currentCourseLevel.value = 'advanced';
    } else if (!courseParam) {
      const saved = sessionStorage.getItem('activeCourseTab');
      if (saved === 'advanced' && isBeginnerCourseCompleted(totalBeginner)) {
        currentCourseLevel.value = 'advanced';
      }
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

const onOpenAgreement = () => {
  showWelcomeVideo.value = false;
  showAgreementStep.value = true;
};

const handleAgreementAccepted = async () => {
  showWelcomeVideo.value = false;
  showAdvancedWelcomeVideo.value = false;
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
    if (modules.value.length === 0) await fetchModules();
    initializeOnboarding();
    if (!hasSeenOnboarding.value) showCharacterModal.value = true;
  } catch (error) {
    console.error('Error after agreement acceptance:', error);
  }
};

const handleAdvancedWelcomeContinue = () => {
  showAdvancedWelcomeVideo.value = false;
  showAgreementStep.value = true;
};

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

  const mergedBadges = getAllBadges(courseLevel).map((badge: any, index: number) => {
    const uploadedBadge = (uploadedBadges.value as UploadedBadge[]).find(
      (b) => b.course_level === courseLevel && Number(b.module_position) === index + 1
    );

    return {
      ...badge,
      name: uploadedBadge?.badge_name || badge.name,
      imageUrl: uploadedBadge?.image_url || null,
      modulePosition: index + 1,
    };
  });

  return {
    modules: dbModules,
    totalModules: dbModules.length,
    completionStatus: getCompletionStatus(courseLevel, dbModules.length),
    currentModule: getCurrentModule(courseLevel, dbModules),
    completedModules: completedModulesCount,
    completedLessonsInCurrentModule: completedLessonsInCurrent,
    badges: mergedBadges,
  }
});

const currentModules = computed(() => {
  const courseLevel = currentCourseLevel.value as 'beginner' | 'advanced'
  return modules.value
    .filter((m: any) => m.level === courseLevel && m.is_active)
    .slice()
    .sort((a: any, b: any) => {
      const aNum = parseInt(a.title?.match(/\d+/)?.[0] || '0', 10);
      const bNum = parseInt(b.title?.match(/\d+/)?.[0] || '0', 10);
      return aNum - bNum;
    });
});

const isModuleAccessible = (moduleId: string, index: number): boolean => {
  if (!hasAcceptedAgreement.value) return false;
  if (index === 0) return true;
  const previousModule = currentModules.value[index - 1];
  return isModuleCompleted(currentCourseLevel.value as 'beginner' | 'advanced', previousModule.id);
};

const switchCourseLevel = async (levelId: string) => {
  if (levelId === 'advanced' && !isBeginnerCourseCompleted(beginnerModules.value.length)) return;
  
  // Reset card dismissal when returning to beginner course
  if (levelId === 'beginner') {
    cardDismissed.value = false;
  }
  
  if (levelId === 'advanced') {
    const { $supabase } = useNuxtApp();
    const { data: { user } } = await $supabase.auth.getUser();
    if (user?.id) await checkAndShowAdvancedWelcome(user.id);
  }
  currentCourseLevel.value = levelId;
  sessionStorage.setItem('activeCourseTab', levelId);
};

const checkAndShowAdvancedWelcome = async (userId: string) => {
  try {
    const hasSeenWelcome = await hasClickedAdvancedWelcome(userId);
    if (!hasSeenWelcome) showAdvancedWelcomeVideo.value = true;
  } catch (err) {
    console.warn('Could not check advanced welcome status:', err);
  }
};

watchEffect(() => {
  if (currentModules.value && currentModules.value.length > 0) {
    const courseLevel = currentCourseLevel.value as 'beginner' | 'advanced'
    const firstIncompleteModule = currentModules.value.find((m: any) => !isModuleCompleted(courseLevel, m.id));
    if (!selectedModule.value || !currentModules.value.some((m: any) => m.id === selectedModule.value.id)) {
      selectedModule.value = firstIncompleteModule ?? currentModules.value[0];
    }
  } else {
    selectedModule.value = null;
  }
});

const selectModule = (module: any) => {
  const index = currentModules.value.findIndex((m: any) => m.id === module.id);
  if (isModuleAccessible(module.id, index)) {
    if (selectedModule.value?.id === module.id) {
      navigateTo(`/modules/${module.id}`);
    } else {
      selectedModule.value = module;
    }
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
  const moduleIndex = currentModules.value.findIndex((m: any) => m.id === moduleId);
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

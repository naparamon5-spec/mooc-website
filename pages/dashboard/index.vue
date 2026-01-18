<template>
  <div class="bg-gray-50 flex flex-col">
    <DashboardHeader :student-name="studentName" />

    <div class="flex-1 max-w-full mx-auto px-4 md:px-8 lg:px-12 py-8 overflow-y-auto overflow-x-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <DashboardSidebar
            :student-name="studentName"
            :progress="currentCourseData.progress"
            :current-module="currentCourseData.currentModule"
            :badges="currentCourseData.badges"
            :completion-status="currentCourseData.completionStatus"
            :completed-modules="currentCourseData.completedModules"
            :total-modules="currentCourseData.totalModules"
            :active-course="currentCourseLevel"
            @switch-course="switchCourseLevel"
          />
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3">
          <!-- Course Level Selector -->
          <div class="mb-6 flex gap-4 relative">
            <button
              v-for="level in courseLevels"
              :key="level.id"
              @click="switchCourseLevel(level.id)"
              :disabled="level.id === 'advanced' && !isBeginnerCourseCompleted()"
              class="px-6 py-3 rounded-lg font-semibold transition-colors relative group"
              :class="
                currentCourseLevel === level.id
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : level.id === 'advanced' && !isBeginnerCourseCompleted()
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              "
            >
              {{ level.name }}
              <!-- Tooltip for locked advanced course -->
              <div
                v-if="level.id === 'advanced' && !isBeginnerCourseCompleted()"
                class="invisible group-hover:visible absolute left-full top-1/2 transform -translate-y-1/2 ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-10"
              >
                Complete the Beginner Course to unlock Advanced
                <div class="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
              </div>
            </button>
          </div>

       <!-- Modules Grid -->
<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
  <ModuleCard
    v-for="(module, index) in currentModules"
    :key="`${currentCourseLevel}-${module.id}`"
    :title="module.title"
    :subtitle="module.subtitle"
    :is-active="selectedModule?.id === module.id"
    :is-restricted="!isModuleAccessible(module.id)"
    :is-completed="isModuleCompleted(currentCourseLevel as 'beginner' | 'advanced', module.id)"
    :emoji="module.emoji"
    :module-id="module.id"
    @click="selectModule(module)"
  />
</div>
              <!-- Module Description -->
          <ModuleDescriptionPanel :module="selectedModule" />

          <!-- Footer Buttons -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-">
            <button
              class="bg-primary-100 text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-primary-200 transition-colors"
            >
              FAQs
            </button>
            <button
              class="bg-primary-100 text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-primary-200 transition-colors"
            >
              Report Fraud or False Information
            </button>
            <button
              class="bg-primary-100 text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-primary-200 transition-colors"
            >
              About us
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
import { ref, computed, watchEffect, watch } from "vue";
// Protect this page with the `auth` middleware
definePageMeta({ middleware: 'auth' })
import DashboardHeader from "~/components/studentdashboard/DashboardHeader.vue";
import DashboardSidebar from "~/components/studentdashboard/DashboardSidebar.vue";
import ModuleCard from "~/components/studentdashboard/ModuleCard.vue";
import ModuleDescriptionPanel from "~/components/studentdashboard/ModuleDescriptionPanel.vue";
import { useCourseProgress } from "~/composables/useCourseProgress";
import { useRoute } from 'vue-router';

useHead({
  title: "Dashboard - MIL MOOC",
});

const route = useRoute();

const studentName = ref("Student's name");
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
  getTotalProgressPercentage
} = useCourseProgress();

// Watch for progress changes to ensure dashboard updates
watch(() => courseProgress.value, () => {
  // This triggers re-computation of currentCourseData
  // Auto-switch to next module when current is completed
  const courseLevel = currentCourseLevel.value as 'beginner' | 'advanced'
  if (selectedModule.value && isModuleCompleted(courseLevel, selectedModule.value.id)) {
    const nextModuleId = selectedModule.value.id + 1;
    const nextModule = currentModules.value.find(m => m.id === nextModuleId);
    if (nextModule && isModuleAccessible(nextModuleId)) {
      selectedModule.value = nextModule;
    }
  }
}, { deep: true });

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

// Course data structure - stores data for each course level
const courseData = ref({
  beginner: {
    totalModules: 5,
    modules: [
      {
        id: 1,
        title: "MODULE 1: Introduction to Media and Information Literacy",
        subtitle: "",
        isActive: true,
        isRestricted: false,
        emoji: "📱",
        description:
          "This module introduces learners to the fundamental concepts of Media and Information Literacy (MIL). It focuses on understanding the role of media in society and recognizing the types of information encountered daily. Learners will explore common challenges in the digital information landscape, including misinformation, disinformation, and malinformation, and understand their social, cultural, and ethical implications.",
        learningOutcomes: [
          "Define Media and Information Literacy and its relevance in the digital age.",
          "Identify the differences between misinformation, disinformation, and malinformation.",
          "Develop a foundation for responsible and critical engagement with media content.",
        ],
      },
      {
        id: 2,
        title: "MODULE 2: Media in the Age of Algorithms",
        subtitle: "",
        isActive: false,
        isRestricted: true,
        emoji: "🤖",
        description:
          "This module examines how algorithms shape the media we consume and the information we receive. Learners will understand the mechanics of algorithmic content curation, explore the impact of filter bubbles and echo chambers, and learn how to think critically about algorithm-driven media environments.",
        learningOutcomes: [
          "Understand how algorithms curate and prioritize media content.",
          "Recognize the impact of filter bubbles on information diversity.",
          "Evaluate the ethical implications of algorithmic media distribution.",
          "Develop strategies to break free from algorithmic constraints.",
        ],
      },
      {
        id: 3,
        title: "MODULE 3: How the Media talks",
        subtitle: "",
        isActive: false,
        isRestricted: true,
        emoji: "💬",
        description:
          "This module focuses on media language and the techniques used to communicate messages. Learners will analyze narrative structures, visual language, sound design, and rhetorical devices used in various media forms. Understanding media language is key to decoding messages and recognizing persuasion techniques.",
        learningOutcomes: [
          "Identify and analyze media language techniques and conventions.",
          "Understand narrative structures in different media formats.",
          "Recognize visual and audio rhetoric in media content.",
          "Decode hidden messages and persuasion strategies in media.",
        ],
      },
      {
        id: 4,
        title: "MODULE 4: Media Representations",
        subtitle: "",
        isActive: false,
        isRestricted: true,
        emoji: "👥",
        description:
          "This module explores how media represents different groups, cultures, and perspectives. Learners will examine stereotypes, biases, and representation gaps in media, and understand how media shapes social perceptions. Critical analysis of representation is essential for recognizing and challenging media bias.",
        learningOutcomes: [
          "Analyze media representations of diverse groups and cultures.",
          "Identify stereotypes and biases in media content.",
          "Understand the impact of media representation on social perception.",
          "Recognize and challenge underrepresentation in media.",
        ],
      },
      {
        id: 5,
        title: "MODULE 5: Digital Citizenship",
        subtitle: "",
        isActive: false,
        isRestricted: true,
        emoji: "🌐",
        description:
          "This final module brings all concepts together and focuses on becoming a responsible digital citizen. Learners will apply media literacy skills to navigate the digital world responsibly, protect their privacy, engage ethically online, and contribute positively to digital communities.",
        learningOutcomes: [
          "Apply media literacy principles to digital environments.",
          "Protect personal privacy and digital security.",
          "Engage ethically and respectfully in online communities.",
          "Contribute to a more informed and responsible digital society.",
        ],
      },
    ],
  },
  advanced: {
    totalModules: 5,
    modules: [
      {
        id: 1,
        title: "MODULE 1: Advanced Media Analysis",
        subtitle: "",
        isActive: false,
        isRestricted: true,
        emoji: "🔍",
        description:
          "This advanced module delves deep into sophisticated media analysis techniques and critical evaluation methods.",
        learningOutcomes: [
          "Master advanced media analysis frameworks.",
          "Apply critical thinking to complex media scenarios.",
          "Develop expertise in media research methodologies.",
        ],
      },
      {
        id: 2,
        title: "MODULE 2: Advanced Algorithmic Literacy",
        subtitle: "",
        isActive: false,
        isRestricted: true,
        emoji: "🧠",
        description: "",
        learningOutcomes: [],
      },
      {
        id: 3,
        title: "MODULE 3: Advanced Communication Strategies",
        subtitle: "",
        isActive: false,
        isRestricted: true,
        emoji: "📡",
        description: "",
        learningOutcomes: [],
      },
      {
        id: 4,
        title: "MODULE 4: Advanced Media Production",
        subtitle: "",
        isActive: false,
        isRestricted: true,
        emoji: "🎬",
        description: "",
        learningOutcomes: [],
      },
      {
        id: 5,
        title: "MODULE 5: Advanced Digital Leadership",
        subtitle: "",
        isActive: false,
        isRestricted: true,
        emoji: "👑",
        description: "",
        learningOutcomes: [],
      },
    ],
  },
});

// Computed properties for current course data
const currentCourseData = computed(() => {
  const courseLevel = currentCourseLevel.value as 'beginner' | 'advanced'
  const baseData = courseData.value[courseLevel]!
  
  // Calculate progress including lessons - use the first incomplete module as current
  const firstIncompleteModule = baseData.modules.find(m => !isModuleCompleted(courseLevel, m.id))
  const currentModuleId = firstIncompleteModule?.id || 1
  const totalLessons = 4 // assuming 4 lessons per module based on the content
  
  const advancedProgress = getTotalProgressPercentage(courseLevel, baseData.totalModules, currentModuleId, totalLessons)
  
  return {
    modules: baseData.modules,
    totalModules: baseData.totalModules,
    progress: advancedProgress,
    completionStatus: getCompletionStatus(courseLevel, baseData.totalModules),
    currentModule: getCurrentModule(courseLevel, baseData.modules),
    completedModules: getCompletedCount(courseLevel),
    badges: getAllBadges(courseLevel),
  }
});

const currentModules = computed(() => {
  const courseLevel = currentCourseLevel.value as 'beginner' | 'advanced'
  return courseData.value[courseLevel]!.modules;
});

// Check if a module is accessible
const isModuleAccessible = (moduleId: number): boolean => {
  const courseLevel = currentCourseLevel.value as 'beginner' | 'advanced'
  
  // Module 1 is always accessible
  if (moduleId === 1) return true;
  
  // Check if previous module is completed
  return isModuleCompleted(courseLevel, moduleId - 1);
};

const switchCourseLevel = (levelId: string) => {
  if (levelId === 'advanced' && !isBeginnerCourseCompleted()) {
    return; // Prevent switching to advanced if beginner not completed
  }
  currentCourseLevel.value = levelId;
};

// Watch for changes in currentCourseData or currentCourseLevel to set initial selectedModule
watchEffect(() => {
  if (currentCourseData.value?.modules && currentCourseData.value.modules.length > 0) {
    // Only set initial module if nothing is selected
    if (!selectedModule.value) {
      selectedModule.value = currentCourseData.value.modules[0];
    } else {
      // Check if the selected module still exists in current course
      const selectedModuleStillExists = currentCourseData.value.modules.find(m => m.id === selectedModule.value.id);
      if (!selectedModuleStillExists) {
        // If selected module doesn't exist (course changed), reset to first module
        selectedModule.value = currentCourseData.value.modules[0];
      }
    }
  } else {
    selectedModule.value = null;
  }
});

// Select a module
const selectModule = (module: any) => {
  selectedModule.value = module;
  if (isModuleAccessible(module.id)) {
    navigateTo(`/modules/${module.id}`);
  }
};
</script>

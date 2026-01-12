<template>
  <div class="min-h-screen bg-gray-50">
    <DashboardHeader :student-name="studentName" />

    <div class="max-w-full mx-auto px-4 md:px-8 lg:px-12 py-8">
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
          />
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3">
          <!-- Course Level Selector -->
          <div class="mb-6 flex gap-4">
            <button
              v-for="level in courseLevels"
              :key="level.id"
              @click="switchCourseLevel(level.id)"
              class="px-6 py-3 rounded-lg font-semibold transition-colors"
              :class="
                currentCourseLevel === level.id
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              "
            >
              {{ level.name }}
            </button>
          </div>

          <!-- Modules Grid -->
          <div
            class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
          >
            <ModuleCard
              v-for="(module, index) in currentModules"
              :key="`${currentCourseLevel}-${module.id}`"
              :title="module.title"
              :subtitle="module.subtitle"
              :is-active="module.isActive"
              :is-restricted="module.isRestricted"
              :emoji="module.emoji"
              @click="selectModule(module)"
            />
          </div>
              <!-- Module Description -->
          <div
            v-if="selectedModule"
            class="bg-white rounded-lg p-6 shadow-sm mb-6"
          >
            <h3 class="text-xl font-bold text-gray-800 mb-4">
              {{ selectedModule.title }}
            </h3>
            <p class="text-gray-600 leading-relaxed mb-6">
              {{ selectedModule.description }}
            </p>

            <!-- Key Learning Outcomes -->
            <div>
              <h4 class="text-lg font-semibold text-gray-800 mb-3">
                Key Learning Outcomes
              </h4>
              <ul class="space-y-2">
                <li
                  v-for="(outcome, index) in selectedModule.learningOutcomes"
                  :key="index"
                  class="flex items-start gap-3 text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{{ outcome }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Footer Buttons -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

<script setup>
import { ref, computed } from "vue";
import DashboardHeader from "~/components/studentdashboard/DashboardHeader.vue";
import DashboardSidebar from "~/components/studentdashboard/DashboardSidebar.vue";
import ModuleCard from "~/components/studentdashboard/ModuleCard.vue";

useHead({
  title: "Dashboard - MIL MOOC",
});

const studentName = ref("Student's name");

// Currently selected module
const selectedModule = ref(null);

// Course levels configuration
const courseLevels = ref([
  { id: "beginner", name: "Beginner Course" },
  { id: "advanced", name: "Advanced Course" },
]);

// Current course level
const currentCourseLevel = ref("beginner");

// Course data structure - stores data for each course level
const courseData = ref({
  beginner: {
    progress: 60,
    currentModule: "Introduction to Media and Information Literacy",
    completionStatus: "In progress",
    completedModules: 0,
    totalModules: 5,
    badges: [
      { name: "LITERACY SCHOLAR", earned: true },
      { name: "MEDIA DEFENDER", earned: true },
      { name: "DIGITAL LIBRARIAN", earned: true },
      { name: "FACTS ADVOCATE", earned: true },
      { name: "RESPONSIBLE CITIZEN", earned: true },
      { name: "RESPONSIBLE CITIZEN", earned: true },
      { name: "RESPONSIBLE CITIZEN", earned: true },
      { name: "RESPONSIBLE CITIZEN", earned: true },
      { name: "RESPONSIBLE CITIZEN", earned: true },
      { name: "RESPONSIBLE CITIZEN", earned: true },
    ],
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
        description: "",
        learningOutcomes: [],
      },
      {
        id: 3,
        title: "MODULE 3: How the Media talks",
        subtitle: "",
        isActive: false,
        isRestricted: true,
        emoji: "💬",
        description: "",
        learningOutcomes: [],
      },
      {
        id: 4,
        title: "MODULE 4: Media Representations",
        subtitle: "",
        isActive: false,
        isRestricted: true,
        emoji: "👥",
        description: "",
        learningOutcomes: [],
      },
      {
        id: 5,
        title: "MODULE 5: Digital Citizenship",
        subtitle: "",
        isActive: false,
        isRestricted: true,
        emoji: "🌐",
        description: "",
        learningOutcomes: [],
      },
    ],
  },
  advanced: {
    progress: 0,
    currentModule: "Advanced Media Analysis",
    completionStatus: "Not started",
    completedModules: 0,
    totalModules: 5,
    badges: [
      { name: "ADVANCED ANALYST", earned: false },
      { name: "CRITICAL THINKER", earned: false },
      { name: "MEDIA EXPERT", earned: false },
      { name: "RESEARCH MASTER", earned: false },
      { name: "DIGITAL LEADER", earned: false },
    ],
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
  return courseData.value[currentCourseLevel.value];
});

const currentModules = computed(() => {
  return courseData.value[currentCourseLevel.value].modules;
});

// Watch for changes in currentCourseData or currentCourseLevel to set initial selectedModule
watchEffect(() => {
  if (currentCourseData.value && currentCourseData.value.modules.length > 0) {
    if (!selectedModule.value || selectedModule.value.id !== currentCourseData.value.modules[0].id) {
      selectedModule.value = currentCourseData.value.modules[0];
    }
  } else {
    selectedModule.value = null;
  }
});

// Select a module
const selectModule = (module) => {
  selectedModule.value = module;
  if (!module.isRestricted) {
    navigateTo(`/modules/${module.id}`);
  }
};
</script>

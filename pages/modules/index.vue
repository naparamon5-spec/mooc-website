<template>
  <div class="min-h-screen bg-gray-50">
    <DashboardHeader :student-name="studentName" />

    <div class="max-w-full mx-auto px-4 md:px-8 lg:px-12 py-8">
      <div class="grid grid-cols-1">
        <!-- Main Content -->
        <div class="lg:col-span-4">
          <!-- Modules Grid - Display ALL modules here -->
          <h2 class="text-3xl font-bold text-gray-800 mb-6">All Available Modules</h2>
          <div
            class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-8"
          >
            <ModuleCard
              v-for="(module, index) in allAvailableModules"
              :key="module.id"
              :title="module.title"
              :subtitle="module.subtitle"
              :is-active="module.isActive"
              :is-restricted="module.isRestricted"
              :emoji="module.emoji"
              @click="selectModule(module)"
            />
          </div>

  </div>
  </div>
</div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from "vue";
import DashboardHeader from "~/components/studentdashboard/DashboardHeader.vue";
import ModuleCard from "~/components/studentdashboard/ModuleCard.vue";

useHead({
  title: "Modules Dashboard - MIL MOOC",
});

const studentName = ref("Student's name");

// Currently selected module for description display
const selectedModule = ref(null);

// Placeholder for course data, for a module dashboard we'll consolidate all modules
const courseData = ref({
  all: {
    progress: 0, // Not directly relevant for an all-modules view
    currentModule: "Explore All Modules",
    completionStatus: "N/A",
    completedModules: 0,
    totalModules: 0,
    badges: [], // Not directly relevant
    modules: [
      {
        id: 1,
        title: "MODULE 1: Introduction to Media and Information Literacy",
        subtitle: "Beginner",
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
        htmlContent: `
          <h4 class="text-lg font-semibold text-gray-800 mb-3">Understanding MIL</h4>
          <p class="text-gray-600 leading-relaxed mb-4">
            Media and Information Literacy (MIL) empowers individuals to critically
            engage with media and information. In an age dominated by digital
            platforms, understanding MIL is crucial for discerning facts from
            fiction, recognizing biases, and making informed decisions. This module
            lays the groundwork for becoming a responsible and effective digital citizen.
          </p>
          <img src="/assets/megaphone.png" alt="Megaphone" class="w-full h-48 object-cover rounded-lg mb-4">
          <p class="text-gray-600 leading-relaxed mb-4">
            The digital landscape is constantly evolving, presenting both immense
            opportunities and significant challenges. From social media feeds to online
            news portals, information bombards us from every direction. Without a
            strong foundation in MIL, individuals can easily fall prey to
            misinformation, disinformation, and malinformation, which can have
            far-reaching consequences on personal beliefs, societal cohesion, and even
            democratic processes.
          </p>
          <h4 class="text-lg font-semibold text-gray-800 mb-3">Key Concepts Explored</h4>
          <ul class="list-disc list-inside text-gray-600 mb-4">
            <li>The fundamental role of media in shaping public opinion and culture.</li>
            <li>Different types of information: factual, opinion, propaganda.</li>
            <li>Identifying and combating fake news, hoaxes, and manipulated content.</li>
            <li>The ethical responsibilities of information creators and consumers.</li>
          </ul>
          <p class="text-gray-600 leading-relaxed">
            By understanding these concepts, learners will develop the skills
            necessary to navigate the complex information ecosystem with confidence
            and critical awareness.
          </p>
        `,
      },
      {
        id: 2,
        title: "MODULE 2: Media in the Age of Algorithms",
        subtitle: "Beginner",
        isActive: false,
        isRestricted: true,
        emoji: "🤖",
        description: "Explore how algorithms shape our media consumption and impact the spread of information, and learn strategies to navigate algorithmic biases.",
        learningOutcomes: [
          "Understand the basics of algorithmic filtering and its effects on media.",
          "Identify common biases in algorithmic news feeds and social media.",
          "Develop strategies for diversifying information sources beyond algorithmic recommendations.",
        ],
        htmlContent: `
          <h4 class="text-lg font-semibold text-gray-800 mb-3">Algorithms and Your News Feed</h4>
          <p class="text-gray-600 leading-relaxed mb-4">
            In today's digital world, algorithms play a significant role in determining
            what information we see online. From social media platforms to search
            engines, these complex systems personalize our experiences, often showing
            us content that aligns with our past interactions and preferences. While
            this can be convenient, it also creates "filter bubbles" and "echo chambers,"
            limiting our exposure to diverse perspectives.
          </p>
          <img src="/assets/megaphone.png" alt="Algorithm visualization" class="w-full h-48 object-cover rounded-lg mb-4">
          <p class="text-gray-600 leading-relaxed mb-4">
            Understanding how algorithms work is the first step towards media literacy
            in the digital age. This module will demystify the concepts behind algorithmic
            curation, helping you to identify its presence and evaluate its impact on
            the information you consume. We will explore how these systems can
            unintentionally amplify certain viewpoints and suppress others, leading
            to a skewed perception of reality.
          </p>
          <h4 class="text-lg font-semibold text-gray-800 mb-3">Navigating Algorithmic Bias</h4>
          <ul class="list-disc list-inside text-gray-600 mb-4">
            <li>How data collection influences algorithmic outcomes.</li>
            <li>Recognizing and mitigating the effects of filter bubbles.</li>
            <li>Strategies for seeking out diverse and credible information sources.</li>
            <li>The ethical implications of AI-driven content recommendations.</li>
          </ul>
          <p class="text-gray-600 leading-relaxed">
            By completing this module, you will be better equipped to critically
            analyze the information presented to you online and to actively seek out
            a more balanced and comprehensive understanding of the world.
          </p>
        `,
      },
      {
        id: 3,
        title: "MODULE 3: How the Media Talks: Narrative, Persuasion & Influence",
        subtitle: "Beginner",
        isActive: false,
        isRestricted: true,
        emoji: "💬",
        description: "Delve into the art of media storytelling, examining how narratives are constructed, persuasive techniques are employed, and public opinion is influenced.",
        learningOutcomes: [
          "Analyze the structural components of media narratives.",
          "Identify and deconstruct various persuasive techniques used in media.",
          "Understand the mechanisms of media influence on public perception and behavior.",
        ],
      },
      {
        id: 4,
        title: "MODULE 4: Media Representations: Stereotypes, Diversity & Inclusion",
        subtitle: "Beginner",
        isActive: false,
        isRestricted: true,
        emoji: "👥",
        description: "Examine how different groups are represented in media, focusing on stereotypes, the importance of diversity, and the impact of inclusive portrayals.",
        learningOutcomes: [
          "Critically analyze media portrayals for stereotypes and biases.",
          "Understand the social and cultural impact of media representations.",
          "Advocate for diverse and inclusive representation in media content.",
        ],
      },
      {
        id: 5,
        title: "MODULE 5: Digital Citizenship: Rights, Responsibilities & Ethics Online",
        subtitle: "Beginner",
        isActive: false,
        isRestricted: true,
        emoji: "🌐",
        description: "Learn about your rights and responsibilities in the digital world, ethical online behavior, and how to contribute positively to digital communities.",
        learningOutcomes: [
          "Define digital citizenship and its core principles.",
          "Understand digital rights and responsibilities in online interactions.",
          "Apply ethical frameworks to navigate complex digital dilemmas and contribute positively.",
        ],
      },
      // Advanced Modules (copied from index.vue for demonstration)
      {
        id: 6,
        title: "MODULE 1: Advanced Media Analysis",
        subtitle: "Advanced",
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
        id: 7,
        title: "MODULE 2: Advanced Algorithmic Literacy",
        subtitle: "Advanced",
        isActive: false,
        isRestricted: true,
        emoji: "🧠",
        description: "Deep dive into the complexities of algorithms, their societal implications, and how to develop more transparent and ethical AI systems.",
        learningOutcomes: [
          "Critically evaluate the ethical implications of advanced algorithms.",
          "Propose solutions for algorithmic bias and lack of transparency.",
          "Design strategies for fostering ethical AI development and deployment.",
        ],
      },
      {
        id: 8,
        title: "MODULE 3: Advanced Communication Strategies",
        subtitle: "Advanced",
        isActive: false,
        isRestricted: true,
        emoji: "📡",
        description: "Master advanced communication theories and strategies for effective and persuasive messaging across diverse media platforms and audiences.",
        learningOutcomes: [
          "Apply advanced communication theories to real-world scenarios.",
          "Develop highly persuasive and ethical communication campaigns.",
          "Analyze the effectiveness of complex communication strategies across platforms.",
        ],
      },
      {
        id: 9,
        title: "MODULE 4: Advanced Media Production",
        subtitle: "Advanced",
        isActive: false,
        isRestricted: true,
        emoji: "🎬",
        description: "Gain hands-on experience and advanced skills in producing high-quality media content, from concept development to post-production and distribution.",
        learningOutcomes: [
          "Execute advanced media production workflows.",
          "Utilize sophisticated tools for media creation and editing.",
          "Develop a portfolio of professional-quality media projects.",
        ],
      },
      {
        id: 10,
        title: "MODULE 5: Advanced Digital Leadership",
        subtitle: "Advanced",
        isActive: false,
        isRestricted: true,
        emoji: "👑",
        description: "Cultivate leadership skills for the digital age, focusing on innovation, ethical governance, and shaping the future of digital media and information.",
        learningOutcomes: [
          "Lead innovative digital projects with ethical considerations.",
          "Formulate policies for responsible digital governance.",
          "Inspire and guide teams in the evolving digital landscape.",
        ],
      },
    ],
  },
});

// For a modules dashboard, we want to display all modules
const allAvailableModules = computed(() => {
  // Combine all modules from different course levels if necessary,
  // or just use the consolidated 'all' entry
  return courseData.value.all.modules;
});

// Computed properties for current course data (adapted for this page)
// These might be simplified or removed if not strictly needed for the 'all modules' view
const currentCourseData = computed(() => {
  return courseData.value.all; // Always refer to the 'all' entry
});

const currentModules = computed(() => {
  return allAvailableModules.value;
});

// Watch for changes to set initial selectedModule for description
watchEffect(() => {
  if (!selectedModule.value && allAvailableModules.value.length > 0) {
    selectedModule.value = allAvailableModules.value[0];
  }
});

// Select a module to display its description
const selectModule = (module) => {
  selectedModule.value = module;
};

// Navigate to the specific module page (pages/modules/[id].vue)
const goToModulePage = (id) => {
  navigateTo(`/modules/${id}`);
};
</script>
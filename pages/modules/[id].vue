<template>
  <div>
    <!-- Header -->
    <DashboardHeader :activeModuleId="parseInt(moduleId)" />

    <main
      class="max-w-full mx-auto px-4 md:px-8 lg:px-12 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8"
    >
      <!-- Sidebar -->
      <aside class="lg:col-span-1">
        <nav class="bg-white rounded-lg shadow p-4 sticky top-8">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Modules</h2>
          <ul class="space-y-2">
            <li v-for="(mod, modIndex) in allModules" :key="mod.id">
              <a
                href="#"
                @click.prevent="isModuleAccessible(mod.id, modIndex) ? goToModule(mod.id) : null"
                class="flex items-center p-2 rounded-md hover:bg-gray-100"
                :class="{
                  'bg-primary-100 text-primary-700 font-semibold': mod.id === parseInt(moduleId),
                  'opacity-50 cursor-not-allowed': !isModuleAccessible(mod.id, modIndex)
                }"
              >
                <span class="mr-2 text-xl">{{ mod.emoji }}</span>
                <span>{{ mod.title }}</span>
                <svg
                  v-if="completedModules.has(mod.id)"
                  class="ml-auto h-5 w-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  />
                </svg>
              </a>
              <ul v-if="mod.id === parseInt(moduleId) && module.content && module.content.length" class="ml-8 mt-2 space-y-1">
                <li v-for="(lesson, index) in module.content" :key="index">
                  <a
                    href="#"
                    @click.prevent="selectLesson(index)"
                    class="flex items-center p-2 rounded-md hover:bg-gray-100"
                    :class="{
                      'bg-primary-50 text-primary-600 font-medium': index === currentLessonIndex,
                    }"
                  >
                    <span class="mr-2 text-primary-600">{{ index + 1 }}.</span>
                    <span>{{ lesson.title }}</span>
                    <svg
                      v-if="completedLessons.has(index)"
                      class="ml-auto h-5 w-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Main Content -->
      <section class="md:col-span-3">
        <!-- Title & Progress -->
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-4xl font-extrabold text-gray-900">
            {{ module?.title }}
          </h1>
          <div class="text-lg font-semibold text-primary-600">
            {{ progressPercentage }}% Complete
          </div>
        </div>

        <!-- Lesson Content -->
        <div
          class="prose max-w-none mb-8 text-gray-700"
          v-html="currentLesson.htmlContent"
        />

        <!-- Navigation Buttons -->
        <div class="flex justify-between items-center mt-12">
          <button
            v-if="currentLessonIndex > 0"
            @click="goToPreviousLesson"
            class="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300"
          >
            Previous Lesson
          </button>

          <button
            @click="markLessonAndGoToNext"
            :disabled="
              !module ||
              !module.content ||
              (currentLessonIndex === module.content.length - 1 && completedLessons.has(currentLessonIndex))
            "
            class="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
            :class="{ 'ml-auto': currentLessonIndex === 0 }"
          >
            {{
              completedLessons.has(currentLessonIndex)
                ? (currentLessonIndex === module.content.length - 1 ? 'Module Completed!' : 'Completed')
                : (currentLessonIndex === module.content.length - 1 ? 'Finish Module' : 'Mark as Complete')
            }}
          </button>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-primary-600 text-white text-center py-4 mt-16">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import DashboardHeader from '~/components/studentdashboard/DashboardHeader.vue';

const route = useRoute();
const moduleId = route.params.id;
const currentLessonIndex = ref(0);
const completedLessons = ref(new Set());
const completedModules = ref(new Set());

const allModules = [
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
];

const selectLesson = (index) => {
  currentLessonIndex.value = index;
};

const currentLesson = computed(() => {
  if (!module.value || !module.value.content || module.value.content.length === 0) {
    return { title: 'No lesson selected', htmlContent: '<p>Please select a lesson from the sidebar.</p>' };
  }
  return module.value.content[currentLessonIndex.value];
});


const goToPreviousLesson = () => {
  if (currentLessonIndex.value > 0) {
    currentLessonIndex.value--;
  }
};

const goToNextLesson = () => {
  if (module.value && module.value.content && currentLessonIndex.value < module.value.content.length - 1) {
    currentLessonIndex.value++;
  }
};

const progressPercentage = computed(() => {
  if (!module.value || !module.value.content || module.value.content.length === 0) return 0;
  return Math.round((completedLessons.value.size / module.value.content.length) * 100);
});

const markLessonAsComplete = () => {
  completedLessons.value.add(currentLessonIndex.value);

  // Check if all lessons in the current module are completed
  if (module.value && module.value.content) {
    const allCurrentLessonsCompleted = module.value.content.every((_, index) =>
      completedLessons.value.has(index)
    );
    if (allCurrentLessonsCompleted) {
      completedModules.value.add(parseInt(moduleId));
    }
  }
};

const markLessonAndGoToNext = () => {
  markLessonAsComplete();
  if (currentLessonIndex.value < module.value.content.length - 1) {
    goToNextLesson();
  }
};

const goToModule = (id) => {
  navigateTo(`/modules/${id}`);
};

const isModuleAccessible = (id, index) => {
  if (id === 1) { // First module is always accessible
    return true;
  }
  // Check if the previous module is completed
  if (index > 0) {
    const previousModuleId = allModules[index - 1].id;
    return completedModules.value.has(previousModuleId);
  }
  return false;
};

// Placeholder module data
const module = ref({
  title: 'Loading...',
  emoji: '', // Initialize emoji
  images: [], // Images will be handled within lessons or as module banners
  description: 'Loading module description...',
  content: [
    {
      title: 'Introduction to Module',
      htmlContent: '<p>Loading lesson content...</p>',
    },
  ],
});

// In a real application, you would fetch the module data from an API based on moduleId
onMounted(() => {
  const selectedModule = allModules.find((m) => m.id === parseInt(moduleId));

  if (selectedModule) {
    module.value.title = selectedModule.title;
    module.value.description = selectedModule.description;
    module.value.emoji = selectedModule.emoji;
  }
  // Simulating an API call to fetch module data
  setTimeout(() => {
    const seed = moduleId.replace(/[^0-9]/g, '') || 1;
    module.value.content = [
      {
        title: 'Introduction to Media & Information Literacy (MIL)',
        htmlContent: `
          <h2>Welcome to Your Journey in MIL!</h2>
          <p>Welcome to Module ${moduleId}. In this first section, we will cover the foundational principles of Media and Information Literacy (MIL). MIL equips individuals with the critical thinking skills to engage with media and information effectively in an increasingly complex digital world. We'll explore why MIL is more relevant now than ever. The ability to critically analyze and interpret various forms of media is paramount in today's interconnected society.</p>
          <h3>What is Media Literacy?</h3>
          <p>Media literacy is the ability to access, analyze, evaluate, create, and act using all forms of communication. It's about understanding how media messages are constructed, why they are constructed, and what effects they have on individuals and society. This includes traditional media like television and newspapers, as well as digital platforms, social media, and online news. Developing media literacy helps you recognize persuasive techniques, identify stereotypes, and understand the influence of media ownership.</p>
          <img src="https://picsum.photos/seed/${seed}_1/1200/675" alt="Introduction to MIL" class="w-full h-auto object-cover rounded-xl shadow-lg my-4">
          <h3>What is Information Literacy?</h3>
          <p>Information literacy is the ability to find, evaluate, organize, and use information from various sources effectively and ethically. It's crucial for academic success, professional development, and informed decision-making in daily life. In an era of information overload, being information literate means you can distinguish reliable sources from unreliable ones, understand different types of information (e.g., scholarly, journalistic, opinion), and use information legally and respectfully, avoiding plagiarism.</p>
          <blockquote>
            <p>“The illiterate of the 21st century will not be those who cannot read and write, but those who cannot learn, unlearn, and relearn.” – Alvin Toffler</p>
          </blockquote>
          <p>This module aims to provide you with the tools to become a more discerning consumer and a responsible creator of information. We'll build a strong foundation for critical engagement with all forms of content you encounter daily.</p>
        `,
      },
      {
        title: 'Understanding Misinformation, Disinformation & Malinformation',
        htmlContent: `
          <h2>Navigating the Digital Information Landscape</h2>
          <p>Now that you have a solid foundation in MIL, let's explore one of the most pressing challenges in the digital age: the spread of false and misleading information. Understanding the nuances between misinformation, disinformation, and malinformation is crucial for critical engagement. These three terms are often used interchangeably, but they represent distinct phenomena with different intentions and impacts.</p>
          <h3>Misinformation</h3>
          <ul>
            <li><strong>Definition:</strong> False information that is spread, regardless of intent to mislead. It's often shared unknowingly by individuals who believe it to be true, or without checking its veracity.</li>
            <li><strong>Example:</strong> Sharing an outdated news article about a flood, genuinely believing it's current and relevant to a new event. Another example could be forwarding a chain message with health advice that isn't medically sound, but you believe it could help someone.</li>
            <li><strong>Impact:</strong> Can lead to confusion, misplaced trust, and inefficient resource allocation, though typically less harmful than disinformation due to lack of malicious intent.</li>
          </ul>
          <img src="https://picsum.photos/seed/${seed}_5/1200/675" alt="Misinformation vs Disinformation" class="w-full h-auto object-cover rounded-xl shadow-lg my-4">
          <h3>Disinformation</h3>
          <ul>
            <li><strong>Definition:</strong> Deliberately false information created and spread to deceive and mislead a target audience. There is malicious intent behind its creation and dissemination, often for political, financial, or personal gain.</li>
            <li><strong>Example:</strong> A political campaign creating fake news stories to discredit an opponent, knowing the stories are false. State-sponsored propaganda aimed at destabilizing an adversary is also a prime example.</li>
            <li><strong>Impact:</strong> Can severely damage public trust, manipulate elections, incite violence, and polarize societies, posing significant threats to democracy and social cohesion.</li>
          </ul>
          <h3>Malinformation</h3>
          <ul>
            <li><strong>Definition:</strong> Information that is based on reality (true information), but used out of context, exaggerated, or selectively presented to mislead, harm, or manipulate.</li>
            <li><strong>Example:</strong> Leaking private, true information about a person (e.g., their address or medical history) to damage their reputation or put them at risk. Another case could be presenting a genuine quote out of its original context to drastically alter its meaning and incite public outrage.</li>
            <li><strong>Impact:</strong> Undermines privacy, can lead to harassment, and erode trust in legitimate information, blurring the lines between truth and manipulation.</li>
          </ul>
          <p>Distinguishing these forms requires critical analysis of the source, context, and intent behind the information. It's not just about whether the information is true or false, but also about *why* it's being shared and *what effect* it's intended to have.</p>
          <h4>Further Reading:</h4>
          <ul>
            <li><a href="https://www.unesco.org/en/articles/misinformation-disinformation-and-malinformation-what-are-differences" target="_blank">UNESCO: Misinformation, Disinformation, and Malinformation - What are the differences?</a></li>
            <li><a href="https://firstdraftnews.org/latest/disinformation-misinformation-malinformation-what-is-the-difference/" target="_blank">First Draft: Misinformation, Disinformation, Malinformation: What is the difference?</a></li>
          </ul>
        `,
      },
      {
        title: 'Evaluating Information Sources: Fact-Checking & Bias',
        htmlContent: `
          <h2>Becoming a Digital Detective</h2>
          <p>In this section, we will equip you with practical strategies to evaluate the credibility of information sources and identify potential biases. Not all sources are created equal, and a healthy dose of skepticism is your best tool. Developing these skills will empower you to make informed decisions and avoid falling prey to misleading narratives.</p>
          <h3>The CRAAP Test for Source Evaluation:</h3>
          <p>A widely used and effective method for evaluating information sources is the CRAAP Test. Each letter represents a key criterion:</p>
          <ul>
            <li><strong>C - Currency:</strong> Refers to the timeliness of the information. When was the information published or posted? Has it been revised or updated? Is the information current enough for your topic, or is older information more appropriate (e.g., historical data)?</li>
            <li><strong>R - Relevance:</strong> Does the information relate directly to your topic or answer your question? Is it appropriate for your level of understanding? Is it too basic, too advanced, or just right? Who is the intended audience?</li>
            <li><strong>A - Authority:</strong> What are the source's credentials? Who created this content, and what makes them an expert on the subject? Is the author affiliated with a reputable organization? Are their qualifications stated?</li>
            <li><strong>A - Accuracy:</strong> Can you verify the information with other reliable sources? Is the information supported by evidence? Are there any obvious errors in grammar, spelling, or facts? Does the source appear to be objective or biased?</li>
            <li><strong>P - Purpose:</strong> Why was the information created? Is the purpose to inform, educate, entertain, persuade, or sell something? Is the content presented objectively, or does it contain propaganda or overt bias? Understanding the purpose helps you identify potential underlying agendas.</li>
          </ul>
          <img src="https://picsum.photos/seed/${seed}_6/1200/675" alt="Fact-checking and Bias" class="w-full h-auto object-cover rounded-xl shadow-lg my-4">
          <h3>Identifying Bias:</h3>
          <p>Bias can be subtle or overt, and all sources have some degree of perspective. Critical readers learn to recognize different forms of bias:</p>
          <ul>
            <li><strong>Omission:</strong> Leaving out facts or perspectives that would contradict the author's viewpoint.</li>
            <li><strong>Selection and Placement:</strong> Choosing to include certain stories or facts while excluding others, or placing them prominently to emphasize a particular narrative.</li>
            <li><strong>Loaded Language:</strong> Using words with strong emotional connotations to sway opinion without presenting logical arguments.</li>
            <li><strong>Spin:</strong> Twisting or reframing a story to present a particular angle, often minimizing negative aspects or exaggerating positive ones.</li>
            <li><strong>Confirmation Bias:</strong> The tendency to seek out and interpret information in a way that confirms one's existing beliefs, often leading to a disregard for contradictory evidence.</li>
          </ul>
          <p>By consistently applying these techniques and being aware of different forms of bias, you can significantly improve your ability to discern reliable information from misleading content and develop a more nuanced understanding of complex issues.</p>
        `,
      },
      {
        title: 'Conclusion and Responsible Digital Citizenship',
        htmlContent: `
          <h2>Your Role as an Informed Citizen</h2>
          <p>In this final section of the module, we consolidate your learning and focus on practical application, emphasizing the importance of responsible digital citizenship. Becoming media and information literate isn't just about personal skill; it's about contributing positively to the digital community and fostering a healthy information ecosystem for everyone.</p>
          <h3>Key Takeaways from This Module:</h3>
          <ul>
            <li>Media and Information Literacy is a vital skill for navigating the modern world, empowering you to critically engage with vast amounts of information.</li>
            <li>Understanding the differences between misinformation, disinformation, and malinformation is critical for protecting yourself and others from manipulation and harm.</li>
            <li>Employing tools like the CRAAP test helps in evaluating information sources, ensuring you rely on credible and accurate information.</li>
            <li>Recognizing and analyzing various forms of bias is essential for a balanced perspective.</li>
          </ul>
          <img src="https://picsum.photos/seed/${seed}_7/1200/675" alt="Responsible Digital Citizen" class="w-full h-auto object-cover rounded-xl shadow-lg my-4">
          <h3>What is Responsible Digital Citizenship?</h3>
          <p>It encompasses safe, ethical, and legal participation in digital society. This includes respecting intellectual property (e.g., citing sources, avoiding plagiarism), protecting personal data and privacy online, engaging in constructive online discourse rather than aggressive or inflammatory communication, and actively combating the spread of false information by reporting it and promoting accurate sources. A responsible digital citizen is aware of their digital footprint and strives to use technology for positive societal impact.</p>
          <p>Your journey in MIL is ongoing. The digital landscape constantly evolves, and so should your critical thinking skills. Keep questioning, keep evaluating, and always strive to be a positive force in the information ecosystem. The skills you've gained here are foundational for lifelong learning and active participation in the digital age. When you are ready, click the button below to mark this module as complete.</p>
        `,
      },
    ];
    if (module.value) {
      useHead({
        title: `${module.value.title} - MIL MOOC`,
      })
    }
  }, 300);
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

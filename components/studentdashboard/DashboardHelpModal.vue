<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="panel"
        class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-gray-900/60 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        @click.self="emitClose"
      >
        <div
          class="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-3xl max-h-[min(92vh,900px)] flex flex-col overflow-hidden border border-gray-100"
          @keydown.esc.prevent="emitClose"
        >
          <header
            class="flex-shrink-0 flex items-start justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/80"
          >
            <div class="min-w-0">
              <h2 :id="titleId" class="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                {{ heading }}
              </h2>
              <p v-if="subheading" class="text-sm text-gray-600 mt-0.5">{{ subheading }}</p>
            </div>
            <button
              type="button"
              class="flex-shrink-0 rounded-lg p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200/80 transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="Close"
              @click="emitClose"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>

          <div class="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 text-gray-700 text-sm sm:text-base leading-relaxed">
            <!-- FAQs -->
            <div v-if="panel === 'faqs'" class="space-y-2">
              <details
                v-for="(item, i) in faqItems"
                :key="i"
                class="group rounded-xl border border-gray-200 bg-white open:shadow-sm transition-shadow"
              >
                <summary
                  class="cursor-pointer list-none flex items-center justify-between gap-3 px-4 py-3 font-semibold text-gray-900 hover:bg-gray-50 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset [&::-webkit-details-marker]:hidden"
                >
                  <span class="pr-2"><span class="text-primary-600 font-bold mr-1">{{ i + 1 }}.</span>{{ item.q }}</span>
                  <svg
                    class="w-5 h-5 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div class="px-4 pb-4 pt-0 text-gray-600 border-t border-gray-100">
                  <p class="pt-3">{{ item.a }}</p>
                </div>
              </details>
              <p class="pt-4 text-sm text-gray-600 border-t border-gray-100 mt-4">
                <span class="font-semibold text-gray-800">Contact:</span>
                <a
                  class="text-primary-700 hover:text-primary-800 underline underline-offset-2 break-all"
                  href="mailto:maeannbardaje@gmail.com"
                >maeannbardaje@gmail.com</a>
              </p>
            </div>

            <!-- Report fraud -->
            <div v-else-if="panel === 'fraud'" class="space-y-6">
              <p class="text-gray-600">
                Use the channels below for scams, phishing, impersonation, and other online fraud. Official links open in a new tab.
              </p>

              <section v-for="block in fraudBlocks" :key="block.title" class="rounded-xl border border-gray-200 bg-gray-50/50 p-4 sm:p-5">
                <h3 class="text-base font-bold text-gray-900 mb-2">{{ block.title }}</h3>
                <p class="text-gray-700 whitespace-pre-line">{{ block.body }}</p>
                <ul v-if="block.links?.length" class="mt-3 space-y-1.5">
                  <li v-for="(link, j) in block.links" :key="j">
                    <a
                      :href="link.href"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-primary-700 hover:text-primary-900 font-medium underline underline-offset-2 break-all inline-flex items-center gap-1"
                    >
                      {{ link.label }}
                      <span class="sr-only">(opens in new tab)</span>
                      <svg class="w-3.5 h-3.5 flex-shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </section>
            </div>

            <!-- About -->
            <div v-else-if="panel === 'about'" class="space-y-4">
              <p>
                Welcome to this learning platform, created by Mae-Ann E. Bardaje as part of a thesis project dedicated to developing an engaging and accessible space for learning Media and Information Literacy. This website was made with the hope of helping learners build the knowledge, skills, and confidence they need to better understand media, evaluate information, and navigate the digital world responsibly.
              </p>
              <p>
                As the creator of this platform, I wanted to design a learning space that is not only educational but also warm, supportive, and meaningful for every learner. This project is more than a requirement for my thesis. It is a reflection of my passion for education and my belief that learners deserve tools and opportunities that will help them grow into critical thinkers and responsible digital citizens.
              </p>
              <p class="pt-2 border-t border-gray-100">
                <span class="font-semibold text-gray-900">Comments and suggestions:</span>
                <a
                  class="text-primary-700 hover:text-primary-800 underline underline-offset-2 break-all ml-1"
                  href="mailto:bardajemaeann@gmail.com"
                >bardajemaeann@gmail.com</a>
              </p>
            </div>
          </div>

          <footer class="flex-shrink-0 px-4 sm:px-6 py-3 border-t border-gray-100 bg-gray-50/80">
            <button
              type="button"
              class="w-full sm:w-auto sm:min-w-[120px] px-4 py-2.5 rounded-lg font-semibold text-white transition shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              style="background-color: #001a4d"
              @click="emitClose"
            >
              Close
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onUnmounted } from "vue";

export type HelpPanel = "faqs" | "fraud" | "about" | null;

const props = defineProps<{
  panel: Exclude<HelpPanel, null>;
}>();

const emit = defineEmits<{
  close: [];
}>();

const titleId = "dashboard-help-modal-title";

const faqItems = [
  {
    q: "What is this website about?",
    a: "This website is an online learning platform designed to help learners develop their Media and Information Literacy skills. It offers self-paced modules, interactive lessons, quizzes, activities, and assessments that guide learners in understanding media, information, technology, online behavior, and responsible digital participation.",
  },
  {
    q: "Who can use this website?",
    a: "This website is intended for students, teachers, and other learners who want to improve their understanding of media and information in the digital age. It can be used by beginners who are still learning the basics, as well as more advanced learners who want to deepen their knowledge and skills.",
  },
  {
    q: "Do I need to create an account to access the course?",
    a: "Yes. Creating an account allows the system to record your progress, track completed modules, save quiz scores, and issue badges or certificates. Your account also helps you continue from where you left off whenever you log back in.",
  },
  {
    q: "Is the course self-paced?",
    a: "Yes. The course is designed to be self-paced, which means learners can study the lessons at their own speed and at their own preferred time. This setup is helpful for learners who have different schedules, learning styles, and levels of familiarity with the topics.",
  },
  {
    q: "How long does it take to finish one module?",
    a: "The time needed to finish a module may vary depending on the learner, but each module is generally designed to be completed within a few hours. Some learners may finish faster, while others may take more time, especially if they review the lessons carefully or repeat the activities for better understanding.",
  },
  {
    q: "Can I access the website using a mobile phone?",
    a: "Yes, as long as the website is compatible with mobile devices and you have internet access. However, for a better learning experience, especially when reading long lessons, answering quizzes, or working on performance tasks, using a laptop or desktop computer may be more convenient.",
  },
  {
    q: "What happens if I do not finish a module in one sitting?",
    a: "Your progress can be saved through your account, so you can continue your lesson later. This allows learners to pause and return to the course without needing to start over, provided that their account remains active and the system settings allow progress retention.",
  },
  {
    q: "Are there quizzes and activities in every module?",
    a: "Yes. Most modules include quizzes, reflection tasks, or interactive activities to help learners apply what they have learned. These are included not only to test memory, but also to build understanding, critical thinking, and responsible decision-making in real-life digital situations.",
  },
  {
    q: "Will I receive a badge or certificate after completing the course?",
    a: "Yes, the website includes a badge and certificate system. Learners may receive digital badges for completing individual modules and a certificate after successfully finishing all required modules in the course. These serve as proof of participation and achievement.",
  },
  {
    q: "What should I do if I forget my password or cannot log in?",
    a: "If you forget your password, you should use the password recovery or reset option on the login page. If the issue continues, you may need to contact the website administrator or support team for help.",
  },
];

const fraudBlocks = [
  {
    title: "Cybercrime Investigation and Coordinating Center (CICC)",
    body: "For online scams, phishing, fake sellers, text scams, impersonation, or other online fraud, report through the official complaint portal, by email at report@cicc.gov.ph, or hotline 1326.",
    links: [{ label: "CICC report portal", href: "https://cicc.gov.ph/report/?ref=cybersecurity.ph" }],
  },
  {
    title: "Philippine National Police Anti-Cybercrime Group (PNP ACG)",
    body: "You may report cybercrime-related incidents through (02) 8723-0401 local 7491, 0961-829-8083, 0915-589-8506, or acg@pnp.gov.ph. Useful for phishing, hacking, online harassment, account takeovers, and other internet-based fraud complaints.",
    links: [{ label: "File a complaint (PHCC)", href: "https://www.phcc.gov.ph/enforcement/file-a-complaint" }],
  },
  {
    title: "National Bureau of Investigation — Cybercrime Division",
    body: "For investigation and formal complaint channels: Report to NBI and online complaint options are available on the NBI site. Cybercrime Division email: ccd@nbi.gov.ph. NBI hotline: 8523-82-31.",
    links: [],
  },
  {
    title: "Bangko Sentral ng Pilipinas (BSP)",
    body: "If the fraud involves a bank, credit card, remittance service, pawnshop, payment system, or electronic money issuer, contact your provider first, then escalate unresolved complaints to the BSP Consumer Protection and Market Conduct Office: consumeraffairs@bsp.gov.ph, (02) 5306-2584, (02) 8708-7087, or (02) 8811-1277 local 2584.",
    links: [{ label: "BSP consumer assistance channels", href: "https://www.bsp.gov.ph/Pages/InclusiveFinance/PYMContacts.aspx" }],
  },
  {
    title: "Securities and Exchange Commission (SEC)",
    body: "For online lending apps, financing companies, or investment scams: lending and financing complaints — flcd_complaints@sec.gov.ph or (02) 8818-5990. Investment scams — epd@sec.gov.ph, (02) 8818-6337, 0961-519-7819, or 0961-684-4088.",
    links: [{ label: "SEC ticket portal (iMessage)", href: "https://imessage.sec.gov.ph/" }],
  },
  {
    title: "National Privacy Commission (NPC)",
    body: "If your personal information was misused, leaked, or used for identity theft: complaints@privacy.gov.ph, (+63 2) 5322-1322 local 114 or 115, 0905-506-1478, or 0970-818-0555.",
    links: [{ label: "Filing a complaint (NPC)", href: "https://privacy.gov.ph/filing-a-complaint/" }],
  },
  {
    title: "National Telecommunications Commission (NTC)",
    body: "For scam texts, spoofed numbers, or telecom-related concerns (Globe, Smart, DITO, PLDT, and similar): 1682 or consumer@ntc.gov.ph.",
    links: [{ label: "File a complaint (PHCC)", href: "https://www.phcc.gov.ph/enforcement/file-a-complaint" }],
  },
];

const heading = computed(() => {
  if (props.panel === "faqs") return "Frequently Asked Questions";
  if (props.panel === "fraud") return "Report fraud & cybercrime";
  return "About this platform";
});

const subheading = computed(() => {
  if (props.panel === "fraud") return "Official reporting channels in the Philippines";
  if (props.panel === "about") return "MIL MOOC thesis project";
  return null;
});

function emitClose() {
  emit("close");
}

function lockBody(lock: boolean) {
  if (typeof document === "undefined") return;
  document.body.style.overflow = lock ? "hidden" : "";
}

watch(
  () => props.panel,
  () => lockBody(true),
  { immediate: true }
);

onUnmounted(() => {
  lockBody(false);
});
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-active .bg-white,
.modal-fade-leave-active .bg-white {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .bg-white,
.modal-fade-leave-to .bg-white {
  transform: translateY(12px);
  opacity: 0.95;
}
@media (min-width: 640px) {
  .modal-fade-enter-from .bg-white,
  .modal-fade-leave-to .bg-white {
    transform: scale(0.98);
  }
}
</style>

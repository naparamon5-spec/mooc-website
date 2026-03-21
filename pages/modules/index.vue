<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <DashboardHeader :student-name="studentName" />

    <main class="w-full px-4 md:px-8 lg:px-12 py-3 flex-grow">
      <h2 class="text-4xl font-bold text-gray-800 mb-4">All Available Modules</h2>

      <div v-if="loading" class="text-center py-2 flex items-center justify-center">
        <p class="text-gray-600">Loading modules...</p>
      </div>
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-2 text-red-700 mb-3">
        {{ error }}
      </div>

      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2"
      >
        <ModuleCard
          v-for="(module, index) in allAvailableModules"
          :key="module.id"
          :title="module.title"
          :subtitle="module.subtitle"
          :is-active="true"
          :is-restricted="!isModuleAccessible(module.id, index)"
          :restriction-message="!hasAcceptedAgreement ? 'Accept the course agreement to unlock modules' : 'Complete previous module'"
          :is-completed="isModuleCompleted(module.level, module.id)"
          :emoji="module.emoji"
          :module-id="module.id"
          :card-image-url="module.card_image_url"
          :image-url="module.image_url"
          @click="selectModule(module)"
        />
      </div>
    </main>

    <footer class="bg-primary-600 text-white text-center py-4">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import DashboardHeader from "~/components/studentdashboard/DashboardHeader.vue";
import ModuleCard from "~/components/studentdashboard/ModuleCard.vue";
import { useCourseProgress } from "~/composables/useCourseProgress";
import { useModuleManagement } from "~/composables/useModuleManagement";
import { useCourseAgreement } from "~/composables/useCourseAgreement";

const studentName = ref("Student's name");

const { isModuleCompleted } = useCourseProgress();
const { modules, loading, error, fetchModules } = useModuleManagement();

const selectedModule = ref(null);
const router = useRouter();

const { hasAcceptedCourseAgreement } = useCourseAgreement();
const hasAcceptedAgreement = ref(false);

const allAvailableModules = computed(() => {
  const beginnerModules = modules.value
    .filter(m => m.level === 'beginner' && m.is_active)
    .sort((a, b) => {
      const aNum = parseInt(a.title.match(/\d+/)?.[0] || '0');
      const bNum = parseInt(b.title.match(/\d+/)?.[0] || '0');
      return aNum - bNum;
    });

  const advancedModules = modules.value
    .filter(m => m.level === 'advanced' && m.is_active)
    .sort((a, b) => {
      const aNum = parseInt(a.title.match(/\d+/)?.[0] || '0');
      const bNum = parseInt(b.title.match(/\d+/)?.[0] || '0');
      return aNum - bNum;
    });

  return [...beginnerModules, ...advancedModules];
});

watch(
  () => allAvailableModules.value,
  (newModules) => {
    if (!selectedModule.value && newModules.length > 0) {
      selectedModule.value = newModules[0];
    }
  },
  { immediate: true }
);

const isModuleAccessible = (moduleId, index) => {
  if (!hasAcceptedAgreement.value) return false;
  if (index === 0) return true;

  const currentModule = allAvailableModules.value[index];
  const previousModule = allAvailableModules.value[index - 1];

  if (previousModule.level === 'beginner' && currentModule.level === 'advanced') {
    const allBeginnerCompleted = modules.value
      .filter(m => m.level === 'beginner')
      .every(m => isModuleCompleted('beginner', m.id));
    return allBeginnerCompleted;
  }

  return isModuleCompleted(previousModule.level, previousModule.id);
};

const selectModule = (module) => {
  selectedModule.value = module;
  const index = allAvailableModules.value.findIndex((m) => m.id === module.id);
  if (isModuleAccessible(module.id, index)) {
    router.push(`/modules/${module.id}`);
  }
};

onMounted(async () => {
  document.title = "Modules Dashboard - MIL MOOC";

  const { $supabase } = useNuxtApp();
  const { data: { user } } = await $supabase.auth.getUser();

  if (user?.id) {
    hasAcceptedAgreement.value = await hasAcceptedCourseAgreement(user.id);
  }

  await fetchModules();
});
</script>
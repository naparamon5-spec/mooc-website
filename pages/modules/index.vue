<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <DashboardHeader :student-name="studentName" />

    <!-- Main Content -->
    <main class="flex-1 w-full px-4 md:px-8 lg:px-12 py-4 flex flex-col">
      <h2 class="text-3xl font-bold text-gray-800 mb-6">All Available Modules</h2>

      <!-- Loading / Error -->
      <div v-if="loading" class="text-center py-6 flex-1 flex items-center justify-center">
        <p class="text-gray-600">Loading modules...</p>
      </div>
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
        {{ error }}
      </div>

     <!-- Modules Grid -->
      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        <ModuleCard
          v-for="(module, index) in allAvailableModules"
          :key="module.id"
          :title="module.title"
          :subtitle="module.subtitle"
          :is-active="module.level === 'beginner'"
          :is-restricted="!isModuleAccessible(module.id, index)"
          :is-completed="isModuleCompleted('beginner', module.id)"
          :emoji="module.emoji"
          :module-id="module.id"
          :image-url="module.image_url"
          class="h-full" 
          @click="selectModule(module)"
        />
      </div>
    </main>

    <!-- Footer -->
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

const studentName = ref("Student's name");

const { isModuleCompleted } = useCourseProgress();
const { modules, loading, error, fetchModules } = useModuleManagement();

const selectedModule = ref(null);
const router = useRouter();

const completedModules = computed(() => {
  return new Set(
    modules.value.filter(m => isModuleCompleted("beginner", m.id)).map(m => m.id)
  );
});

const allAvailableModules = computed(() => modules.value);

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
  if (index === 0) return true;
  const previousModule = allAvailableModules.value[index - 1];
  return isModuleCompleted("beginner", previousModule.id);
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
  await fetchModules("beginner");
});
</script>

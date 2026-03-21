<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <DashboardHeader />

    <main class="max-w-full mx-auto px-4 md:px-8 lg:px-12 py-3 flex-grow">
      <section class="text-center mb-4">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-2">Discover Your Learning Resources</h1>
        <p class="text-lg text-gray-600 max-w-4xl mx-auto">
          Explore a curated collection of articles, tutorials, tools, and supplementary materials to enhance your learning journey.
        </p>
      </section>

      <section class="mb-3">
        <div class="relative max-w-3xl mx-auto">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search resources..."
            class="w-full pl-12 pr-4 py-2 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </section>

      <section>
        <h2 class="text-3xl font-bold text-gray-800 mb-4 text-center">Featured Resources</h2>
        <div v-if="loading" class="text-center py-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-2 text-gray-600">Loading resources...</p>
        </div>
        <div v-else-if="error" class="text-center py-10">
          <p class="text-red-600">{{ error }}</p>
        </div>
        <div v-else-if="filteredResources.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ResourceCard
            v-for="resource in filteredResources"
            :key="resource.id"
            :resource="resource"
          />
        </div>
        <div v-else class="text-center text-gray-600 text-lg py-10">
          No resources found matching your search.
        </div>
      </section>
    </main>
    <!-- Footer -->
    <footer class="bg-primary-600 text-white text-center py-4">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import DashboardHeader from '~/components/studentdashboard/DashboardHeader.vue';
import ResourceCard from '~/components/ResourceCard.vue';
import { useResources } from '~/composables/useResources';

interface Resource {
  id: number;
  title: string;
  description: string;
  link: string;
  image?: string;
  tags: string[];
}

const searchTerm = ref('');
const { resources, loading, error, fetchResources } = useResources();

onMounted(async () => {
  await fetchResources();
});

const filteredResources = computed(() => {
  if (!searchTerm.value) return resources.value;
  const term = searchTerm.value.toLowerCase();
  return resources.value.filter(resource =>
    resource.title.toLowerCase().includes(term) ||
    resource.description.toLowerCase().includes(term) ||
    resource.tags.some(tag => tag.toLowerCase().includes(term))
  );
});
</script>

<style scoped>
/* No specific styles needed if Tailwind is configured correctly */
</style>

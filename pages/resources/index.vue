<template>
  <div class="min-h-screen bg-gray-100">
    <DashboardHeader />

    <main class="container mx-auto px-4 py-8">
      <section class="text-center mb-12">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-4">Discover Your Learning Resources</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore a curated collection of articles, tutorials, tools, and supplementary materials to enhance your learning journey.
        </p>
      </section>

      <section class="mb-10">
        <div class="relative max-w-xl mx-auto">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search resources..."
            class="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </section>

      <section>
        <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Resources</h2>
        <div v-if="filteredResources.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DashboardHeader from '~/components/studentdashboard/DashboardHeader.vue';
import ResourceCard from '~/components/ResourceCard.vue';

interface Resource {
  id: number;
  title: string;
  description: string;
  link: string;
  image?: string;
  tags: string[];
}

const searchTerm = ref('');

const resources = ref<Resource[]>([
  {
    id: 1,
    title: 'Getting Started with Vue 3',
    description: 'A comprehensive guide to building your first application with Vue 3, covering reactivity, components, and the Composition API.',
    link: 'https://vuejs.org/guide/introduction.html',
    image: 'https://via.placeholder.com/400x200/42b883/ffffff?text=Vue+3',
    tags: ['Vue.js', 'Frontend', 'Framework'],
  },
  {
    id: 2,
    title: 'Introduction to Nuxt 3',
    description: 'Learn how to leverage Nuxt 3 for full-stack development, server-side rendering, and static site generation.',
    link: 'https://nuxt.com/docs/getting-started/introduction',
    image: 'https://via.placeholder.com/400x200/003C3C/ffffff?text=Nuxt+3',
    tags: ['Nuxt.js', 'Fullstack', 'SSR'],
  },
  {
    id: 3,
    title: 'Mastering Tailwind CSS',
    description: 'Dive deep into utility-first CSS with Tailwind. Build beautiful, responsive designs without ever leaving your HTML.',
    link: 'https://tailwindcss.com/docs',
    image: 'https://via.placeholder.com/400x200/38bdf8/ffffff?text=Tailwind+CSS',
    tags: ['CSS', 'Styling', 'Design'],
  },
  {
    id: 4,
    title: 'Understanding JavaScript Asynchronicity',
    description: 'A detailed explanation of async/await, Promises, and callbacks in JavaScript to handle asynchronous operations effectively.',
    link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function',
    image: 'https://via.placeholder.com/400x200/F0DB4F/323330?text=JavaScript',
    tags: ['JavaScript', 'Programming', 'Asynchronous'],
  },
  {
    id: 5,
    title: 'Git and GitHub Fundamentals',
    description: 'Learn the essentials of version control with Git and collaboration workflows using GitHub for team projects.',
    link: 'https://docs.github.com/en/get-started/quickstart/hello-world',
    image: 'https://via.placeholder.com/400x200/F1502F/ffffff?text=Git+GitHub',
    tags: ['Git', 'Version Control', 'Collaboration'],
  },
  {
    id: 6,
    title: 'Introduction to Web Accessibility',
    description: 'Discover principles and practices for building inclusive web experiences that are usable by everyone, regardless of ability.',
    link: 'https://www.w3.org/WAI/fundamentals/accessibility-intro/',
    image: 'https://via.placeholder.com/400x200/663399/ffffff?text=Accessibility',
    tags: ['Accessibility', 'Web Development', 'Inclusive Design'],
  },
]);

const filteredResources = computed(() => {
  if (!searchTerm.value) {
    return resources.value;
  }
  const lowerCaseSearchTerm = searchTerm.value.toLowerCase();
  return resources.value.filter(resource =>
    resource.title.toLowerCase().includes(lowerCaseSearchTerm) ||
    resource.description.toLowerCase().includes(lowerCaseSearchTerm) ||
    resource.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm))
  );
});
</script>

<style scoped>
/* No specific styles needed if Tailwind is configured correctly */
</style>

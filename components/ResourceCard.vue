<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
    <div v-if="resource.image" class="w-full h-40 bg-gray-200 flex items-center justify-center overflow-hidden">
      <img :src="resource.image" :alt="resource.title" class="w-full h-full object-cover">
    </div>
    <div class="p-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ resource.title }}</h3>
      <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ resource.description }}</p>
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tag in resource.tags"
          :key="tag"
          class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
        >
          {{ tag }}
        </span>
      </div>
      <a
        :href="resource.link"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Access Resource
        <svg class="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0l-6 6"></path></svg>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">


interface Resource {
  id: number;
  title: string;
  description: string;
  link: string;
  image?: string;
  tags: string[];
}

const props = defineProps<{
  resource: Resource;
}>();
</script>

<style scoped>
/* Add any specific styles here if needed, but Tailwind should handle most. */
</style>

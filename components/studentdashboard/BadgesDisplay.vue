<template>
  <div class="bg-white rounded-lg p-4 shadow-sm">
    <h3 class="text-sm font-semibold text-gray-800 mb-3">Badges</h3>
    <div class="grid grid-cols-5 gap-2">
      <div
        v-for="(badge, index) in badges"
        :key="index"
        class="flex flex-col items-center"
      >
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center"
          :class="badge.earned ? 'bg-primary-600' : 'bg-gray-200'"
        >
          <svg
            v-if="badge.earned"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p
          class="text-[8px] text-center mt-1 leading-tight"
          :class="badge.earned ? 'text-gray-800 font-medium' : 'text-gray-400'"
        >
          {{ badge.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  badges: {
    type: Array,
    default: () => [
      { name: 'LITERACY SCHOLAR', earned: true },
      { name: 'MEDIA DEFENDER', earned: true },
      { name: 'DIGITAL LIBRARIAN', earned: true },
      { name: 'FACTS ADVOCATE', earned: true },
      { name: 'RESPONSIBLE CITIZEN', earned: true }
    ]
  }
})
</script>


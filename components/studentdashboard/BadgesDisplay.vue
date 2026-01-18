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
          class="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden border-2 transition-all"
          :class="badge.earned ? 'border-primary-600 shadow-md' : 'border-gray-300 opacity-50 grayscale'"
        >
          <img 
            :src="getBadgeImage(badge.name)"
            :alt="badge.name"
            class="w-full h-full object-cover"
          />
        </div>
        <p
          class="text-[8px] text-center mt-2 leading-tight font-medium"
          :class="badge.earned ? 'text-gray-800' : 'text-gray-400'"
        >
          {{ badge.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Badge {
  name: string
  earned: boolean
}

const props = defineProps({
  badges: {
    type: Array as () => Badge[],
    default: () => [
      { name: 'LITERACY SCHOLAR', earned: true },
      { name: 'MEDIA SYSTEMS ADEPT', earned: true },
      { name: 'MEDIA LINGUIST', earned: true },
      { name: 'EQUITY ADVOCATE', earned: true },
      { name: 'RESPONSIBLE CITIZEN', earned: true }
    ]
  }
})

const badgeImages: Record<string, string> = {
  'LITERACY SCHOLAR': '/assets/MODULE1.png',
  'MEDIA SYSTEMS ADEPT': '/assets/MODULE2.png',
  'MEDIA LINGUIST': '/assets/MODULE3.png',
  'EQUITY ADVOCATE': '/assets/MODULE4.png',
  'RESPONSIBLE CITIZEN': '/assets/MODULE5.png',
  'CYBER GUARDIAN': '/assets/MODULE6.png',
  'GENERATIVE THINKER': '/assets/MODULE7.png',
  'DIGITAL MAVEN': '/assets/MODULE8.png',
  'MEDIA ANALYST': '/assets/MODULE9.png',
  'ETHICAL MEDIA CREATOR': '/assets/MODULE10.png'
}

const getBadgeImage = (badgeName: string): string => {
  return badgeImages[badgeName] || '/assets/default-badge.png'
}
</script>
<template>
  <div class="min-h-screen bg-gray-50">
    <AdminHeader :admin-name="adminName" />

    <div class="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 py-12">
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0-4-4m4 4-4 4M5 19h14M5 5h14" />
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Uploaded Badges</h1>
              <p class="text-gray-600 mt-1">Displaying badge records from the `badges` table</p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              @click="goToUploadPage"
              class="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Upload Badge
            </button>

            <button
              type="button"
              @click="goBack"
              class="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-5 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m7-7l-7 7 7 7" />
              </svg>
              Back
            </button>
          </div>
        </div>

        <div class="mb-6 flex flex-wrap items-center gap-3">
          <span class="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold">
            {{ badges.length }} total badges
          </span>
          <!-- <span class="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-semibold">
            {{ uploadedBadgeCount }} with image
          </span> -->
        </div>

        <div class="mb-8 flex flex-wrap gap-3">
          <button
            type="button"
            @click="activeTab = 'beginner'"
            class="px-5 py-2.5 rounded-lg font-semibold transition"
            :class="activeTab === 'beginner' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            Beginner Badges
          </button>
          <button
            type="button"
            @click="activeTab = 'advanced'"
            class="px-5 py-2.5 rounded-lg font-semibold transition"
            :class="activeTab === 'advanced' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            Advanced Badges
          </button>
        </div>

        <div v-if="loading" class="py-16 text-center text-gray-500">
          Loading badges...
        </div>

        <div v-else-if="error" class="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>

        <div v-else-if="filteredBadges.length" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <button
            v-for="badge in filteredBadges"
            :key="`${badge.course_level}-${badge.module_position}-${badge.id || badge.badge_name}`"
            type="button"
            @click="editBadge(badge)"
            class="w-full text-left border border-gray-200 rounded-xl p-5 bg-gray-50 hover:bg-white hover:shadow-sm hover:border-primary-300 transition focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <div class="flex items-start gap-4">
              <div class="w-24 h-24 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                <img
                  :src="getBadgeDisplayImage(badge)"
                  :alt="badge.badge_name"
                  class="w-full h-full object-contain"
                  @error="handleImageError"
                />
              </div>

              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-primary-600 uppercase tracking-wide">
                  {{ formatCourseLevel(badge.course_level) }}
                </p>
                <h3 class="text-base font-bold text-gray-900 break-words">
                  {{ badge.badge_name }}
                </h3>
                <p class="text-sm text-gray-600 mt-1">
                  Module {{ badge.module_position }}
                </p>
                <!-- <p
                  class="text-xs inline-flex px-2 py-1 rounded-full mt-3"
                  :class="badge.image_url ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
                >
                  {{ badge.image_url }}
                </p> -->
                <!-- <p class="text-xs text-primary-600 font-medium mt-3">
                  Click to edit this badge
                </p> -->
              </div>
            </div>
          </button>
        </div>

        <div v-else class="text-center py-16 border border-dashed border-gray-300 rounded-xl bg-gray-50">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-gray-700 font-medium">No {{ activeTab }} badge records found</p>
          <p class="text-sm text-gray-500 mt-1">Create the first {{ activeTab }} badge by clicking the Upload Badge button.</p>
        </div>
      </div>
    </div>

    <footer class="bg-primary-600 text-white text-center py-4 mt-12">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminHeader from '~/components/admindashboard/AdminHeader.vue'
import { useBadgeManagement, type Badge } from '~/composables/useBadgeManagement'
import { useUserProfile } from '~/composables/useUserProfile'

definePageMeta({ middleware: 'auth' })

useHead({
  title: 'Uploaded Badges - Admin - MIL MOOC',
})

const router = useRouter()
const adminName = ref('Admin')
const activeTab = ref<'beginner' | 'advanced'>('beginner')

const { loading, error, badges, fetchBadges } = useBadgeManagement()
const { fetchUserProfile } = useUserProfile()

const fallbackImages: Record<'beginner' | 'advanced', Record<number, string>> = {
  beginner: {
    1: '/assets/MODULE1.png',
    2: '/assets/MODULE2.png',
    3: '/assets/MODULE3.png',
    4: '/assets/MODULE4.png',
    5: '/assets/MODULE5.png',
  },
  advanced: {
    1: '/assets/MODULE6.png',
    2: '/assets/MODULE7.png',
    3: '/assets/MODULE8.png',
    4: '/assets/MODULE9.png',
    5: '/assets/MODULE10.png',
  },
}

const uploadedBadgeCount = computed(() => {
  return badges.value.filter((badge) => !!badge.image_url).length
})

const filteredBadges = computed(() => {
  return badges.value
    .filter((badge) => badge.course_level === activeTab.value)
    .sort((a, b) => a.module_position - b.module_position)
})

onMounted(async () => {
  try {
    const userData = await fetchUserProfile()
    if (userData?.full_name) {
      adminName.value = userData.full_name
    }

    await fetchBadges()
  } catch (err) {
    console.error('Error loading badges:', err)
  }
})

const formatCourseLevel = (level: string) => {
  return level === 'beginner' ? 'Beginner Course' : level === 'advanced' ? 'Advanced Course' : level
}

const getBadgeDisplayImage = (badge: Badge) => {
  if (badge.image_url) {
    return badge.image_url
  }

  const courseLevel = badge.course_level === 'advanced' ? 'advanced' : 'beginner'
  return fallbackImages[courseLevel]?.[badge.module_position] || '/assets/default-badge.png'
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/assets/default-badge.png'
}

const editBadge = (badge: Badge) => {
  router.push({
    path: '/admin/upload-badge',
    query: {
      courseLevel: badge.course_level,
      modulePosition: String(badge.module_position),
      badgeName: badge.badge_name,
      imageUrl: badge.image_url || '',
    },
  })
}

const goToUploadPage = () => {
  router.push('/admin/upload-badge')
}

const goBack = () => {
  router.push('/admin')
}
</script>

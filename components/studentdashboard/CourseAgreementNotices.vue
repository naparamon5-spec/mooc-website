<template>
  <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-900">Course Agreement & Notices</h2>
    </div>

    <!-- Account Status Alert -->
    <div
      v-if="isAccountDeactivated"
      class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
    >
      <div class="flex items-start">
        <svg
          class="w-5 h-5 text-red-600 mt-0.5 mr-3"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <div>
          <h3 class="font-semibold text-red-900">Account Deactivated</h3>
          <p class="text-sm text-red-700 mt-1">
            Your account has been deactivated due to incomplete course modules.
            Please contact an administrator to reactivate your account.
          </p>
        </div>
      </div>
    </div>

    <!-- Overdue Modules Warning -->
    <div
      v-if="hasOverdueModules && !isAccountDeactivated"
      class="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4"
    >
      <div class="flex items-start">
        <svg
          class="w-5 h-5 text-amber-600 mt-0.5 mr-3"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        <div>
          <h3 class="font-semibold text-amber-900">Overdue Module</h3>
          <p class="text-sm text-amber-700 mt-1">
            You have overdue module(s) that require immediate attention. Complete them to avoid account restrictions.
          </p>
        </div>
      </div>
    </div>

    <!-- Notices List -->
    <div v-if="notices.length > 0" class="mb-6">
      <h3 class="font-semibold text-gray-900 mb-3">Your Notices</h3>
      <div class="space-y-3">
        <div
          v-for="notice in notices"
          :key="notice.id"
          class="border rounded-lg p-4"
          :class="[
            notice.is_read
              ? 'bg-gray-50 border-gray-200'
              : 'bg-blue-50 border-blue-200',
            notice.notice_type === 'second_notice'
              ? 'border-red-200 bg-red-50'
              : ''
          ]"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span
                  class="inline-block px-2 py-1 text-xs font-semibold rounded-full"
                  :class="[
                    notice.notice_type === 'first_notice'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ notice.notice_type === 'first_notice' ? 'First Notice' : 'Final Notice' }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ formatDate(notice.sent_at) }}
                </span>
              </div>
              <p class="text-sm text-gray-700 mt-2">{{ notice.notice_message }}</p>
            </div>
            <button
              v-if="!notice.is_read"
              @click="acknowledgeNotice(notice.id)"
              class="ml-4 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Mark as Read
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Current Assignments -->
    <div v-if="assignments.length > 0">
      <h3 class="font-semibold text-gray-900 mb-3">Your Module Assignments</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-2 px-3 font-semibold text-gray-700">Module</th>
              <th class="text-left py-2 px-3 font-semibold text-gray-700">Deadline</th>
              <th class="text-left py-2 px-3 font-semibold text-gray-700">Days Left</th>
              <th class="text-left py-2 px-3 font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="assignment in assignments"
              :key="assignment.id"
              class="border-b border-gray-200 hover:bg-gray-50"
            >
              <td class="py-3 px-3 text-gray-900">{{ assignment.module_title }}</td>
              <td class="py-3 px-3 text-gray-600">{{ formatDate(assignment.deadline) }}</td>
              <td class="py-3 px-3">
                <span
                  class="inline-block px-2 py-1 rounded text-xs font-semibold"
                  :class="[
                    daysLeft(assignment.deadline) < 0
                      ? 'bg-red-100 text-red-800'
                      : daysLeft(assignment.deadline) < 3
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-green-100 text-green-800'
                  ]"
                >
                  {{ daysLeft(assignment.deadline) < 0 ? 'Overdue' : `${daysLeft(assignment.deadline)} days` }}
                </span>
              </td>
              <td class="py-3 px-3">
                <span
                  class="inline-block px-2 py-1 rounded text-xs font-semibold"
                  :class="[
                    assignment.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : assignment.status === 'overdue'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                  ]"
                >
                  {{ assignment.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- No Assignments -->
    <div v-else class="text-center py-8 text-gray-500">
      <p>No module assignments at this time.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useCourseAgreement } from '~/composables/useCourseAgreement'

const { getUserAssignments, getUserNotices, markNoticeAsRead } = useCourseAgreement()
const { $supabase } = useNuxtApp()
const supabase = $supabase

// Get authenticated user
const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

const assignments = ref<any[]>([])
const notices = ref<any[]>([])
const loading = ref(false)
const moduleTitleById = ref<Map<string, string>>(new Map())

const hasOverdueModules = computed(() => {
  return assignments.value.some(
    (a) => a.status === 'overdue' || daysLeft(a.deadline) < 0
  )
})

const isAccountDeactivated = ref(false)

const checkAccountStatus = async (userId: string) => {
  try {
    const { data } = await supabase
      .from('profiles')
      .select('is_active')
      .eq('id', userId)
      .single()
    isAccountDeactivated.value = data?.is_active === false
  } catch (error) {
    console.error('Error checking account status:', error)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const daysLeft = (deadline: string) => {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const acknowledgeNotice = async (noticeId: number) => {
  try {
    await markNoticeAsRead(noticeId)
    notices.value = notices.value.map((n) =>
      n.id === noticeId ? { ...n, is_read: true } : n
    )
  } catch (error) {
    console.error('Error acknowledging notice:', error)
  }
}

const loadModuleTitles = async (moduleIds: string[]) => {
  if (moduleIds.length === 0) return
  const { data, error } = await supabase
    .from('modules')
    .select('id, title')
    .in('id', moduleIds)
  if (error) {
    console.error('Error loading module titles:', error)
    return
  }
  const map = new Map<string, string>()
  for (const m of data || []) map.set(m.id, m.title || m.id)
  moduleTitleById.value = map
}

onMounted(async () => {
  loading.value = true
  try {
    const user = await getUser()
    if (!user) {
      console.error('User not authenticated')
      return
    }

    await Promise.all([
      checkAccountStatus(user.id),
      (async () => {
        const data = await getUserAssignments(user.id)
        const raw = data || []
        const ids = Array.from(new Set(raw.map((a: any) => a.module_id).filter(Boolean)))
        await loadModuleTitles(ids)
        assignments.value = raw.map((a: any) => ({
          ...a,
          module_title: moduleTitleById.value.get(a.module_id) || a.module_id
        }))
      })(),
      (async () => {
        const data = await getUserNotices(user.id)
        notices.value = data
      })()
    ])
  } catch (error) {
    console.error('Error loading assignments and notices:', error)
  } finally {
    loading.value = false
  }
})
</script>

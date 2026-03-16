<template>
  <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-900">Course Agreement Management</h2>
      <button
        @click="checkOverdueModules"
        :disabled="checkingOverdue"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {{ checkingOverdue ? 'Checking...' : 'Check Overdue Modules' }}
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p class="text-sm text-blue-600 font-semibold">Total Assignments</p>
        <p class="text-2xl font-bold text-blue-900 mt-2">{{ totalAssignments }}</p>
      </div>
      <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p class="text-sm text-amber-600 font-semibold">First Notices Sent</p>
        <p class="text-2xl font-bold text-amber-900 mt-2">{{ firstNoticeCount }}</p>
      </div>
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-sm text-red-600 font-semibold">Second Notices Sent</p>
        <p class="text-2xl font-bold text-red-900 mt-2">{{ secondNoticeCount }}</p>
      </div>
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p class="text-sm text-purple-600 font-semibold">Accounts Deactivated</p>
        <p class="text-2xl font-bold text-purple-900 mt-2">{{ deactivatedCount }}</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6 border-b border-gray-200">
      <button
        v-for="tab in ['assignments', 'overdue', 'deactivated']"
        :key="tab"
        @click="activeTab = tab"
        class="px-4 py-2 font-medium text-sm transition-colors"
        :class="[
          activeTab === tab
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        {{ tab === 'assignments' ? 'All Assignments' : tab === 'overdue' ? 'Overdue Modules' : 'Deactivated Accounts' }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Loading...</p>
    </div>

    <!-- All Assignments Tab -->
    <div v-else-if="activeTab === 'assignments'">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Student ID</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Module</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Deadline</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Course Level</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="assignment in allAssignments"
              :key="assignment.id"
              class="border-b border-gray-200 hover:bg-gray-50"
            >
              <td class="py-3 px-4 text-gray-900">{{ assignment.user_id.substring(0, 8) }}</td>
              <td class="py-3 px-4 text-gray-600">{{ assignment.module_id.substring(0, 8) }}</td>
              <td class="py-3 px-4 text-gray-600">{{ formatDate(assignment.deadline) }}</td>
              <td class="py-3 px-4">
                <span
                  class="inline-block px-2 py-1 rounded text-xs font-semibold"
                  :class="[
                    assignment.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : assignment.status === 'overdue'
                        ? 'bg-red-100 text-red-800'
                        : assignment.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ assignment.status }}
                </span>
              </td>
              <td class="py-3 px-4 text-gray-600">{{ assignment.course_level }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="allAssignments.length === 0" class="text-center py-8 text-gray-500">
        <p>No assignments found.</p>
      </div>
    </div>

    <!-- Overdue Modules Tab -->
    <div v-else-if="activeTab === 'overdue'">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Student ID</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Module</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Deadline</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Days Overdue</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Notices Sent</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="assignment in overdueAssignments"
              :key="assignment.id"
              class="border-b border-gray-200 hover:bg-gray-50"
            >
              <td class="py-3 px-4 text-gray-900">{{ assignment.user_id.substring(0, 8) }}</td>
              <td class="py-3 px-4 text-gray-600">{{ assignment.module_id.substring(0, 8) }}</td>
              <td class="py-3 px-4 text-gray-600">{{ formatDate(assignment.deadline) }}</td>
              <td class="py-3 px-4">
                <span class="inline-block px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800">
                  {{ getDaysOverdue(assignment.deadline) }} days
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="text-xs space-y-1">
                  <div
                    v-if="getNoticesForAssignment(assignment.id)?.some((n: any) => n.notice_type === 'first_notice')"
                    class="text-amber-700 font-semibold"
                  >
                    ✓ First Notice
                  </div>
                  <div
                    v-if="getNoticesForAssignment(assignment.id)?.some((n: any) => n.notice_type === 'second_notice')"
                    class="text-red-700 font-semibold"
                  >
                    ✓ Second Notice
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="overdueAssignments.length === 0" class="text-center py-8 text-gray-500">
        <p>No overdue modules at this time.</p>
      </div>
    </div>

    <!-- Deactivated Accounts Tab -->
    <div v-else-if="activeTab === 'deactivated'">
      <div v-if="deactivatedAccounts.length > 0" class="mb-4">
        <button
          @click="reactivateSelected"
          :disabled="selectedForReactivation.length === 0 || reactivating"
          class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {{ reactivating ? 'Reactivating...' : `Reactivate Selected (${selectedForReactivation.length})` }}
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4">
                <input
                  type="checkbox"
                  @change="toggleAllDeactivated"
                  :checked="selectedForReactivation.length === deactivatedAccounts.length"
                />
              </th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Student ID</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Deactivated At</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="account in deactivatedAccounts"
              :key="account.id"
              class="border-b border-gray-200 hover:bg-gray-50"
            >
              <td class="py-3 px-4">
                <input
                  type="checkbox"
                  :checked="selectedForReactivation.includes(account.id)"
                  @change="toggleAccountSelection(account.id)"
                />
              </td>
              <td class="py-3 px-4 text-gray-900">{{ account.id.substring(0, 8) }}...</td>
              <td class="py-3 px-4 text-gray-600">
                {{ account.deactivated_at ? formatDate(account.deactivated_at) : 'N/A' }}
              </td>
              <td class="py-3 px-4 text-gray-600 text-xs">{{ account.account_deactivation_reason }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="deactivatedAccounts.length === 0" class="text-center py-8 text-gray-500">
        <p>No deactivated accounts.</p>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" class="mt-4" :class="[messageType === 'success' ? 'text-green-700' : 'text-red-700']">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const { $supabase } = useNuxtApp()
const supabase = $supabase
const activeTab = ref('assignments')
const loading = ref(false)
const checkingOverdue = ref(false)
const reactivating = ref(false)

const allAssignments = ref<any[]>([])
const overdueAssignments = ref<any[]>([])
const deactivatedAccounts = ref<any[]>([])
const allNotices = ref<any[]>([])
const selectedForReactivation = ref<string[]>([])

const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const totalAssignments = computed(() => allAssignments.value.length)
const firstNoticeCount = computed(() =>
  allNotices.value.filter((n) => n.notice_type === 'first_notice').length
)
const secondNoticeCount = computed(() =>
  allNotices.value.filter((n) => n.notice_type === 'second_notice').length
)
const deactivatedCount = computed(() => deactivatedAccounts.value.length)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getDaysOverdue = (deadline: string) => {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = now.getTime() - deadlineDate.getTime()
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

const getNoticesForAssignment = (assignmentId: number) => {
  return allNotices.value.filter((n) => n.module_assignment_id === assignmentId)
}

const checkOverdueModules = async () => {
  try {
    checkingOverdue.value = true
    const response = await fetch('/api/notices/check-overdue', { method: 'POST' })
    const result = await response.json()
    message.value = result.message
    messageType.value = 'success'
    await loadAllData()
  } catch (error: any) {
    message.value = error.message || 'Error checking overdue modules'
    messageType.value = 'error'
  } finally {
    checkingOverdue.value = false
  }
}

const toggleAccountSelection = (accountId: string) => {
  const index = selectedForReactivation.value.indexOf(accountId)
  if (index > -1) {
    selectedForReactivation.value.splice(index, 1)
  } else {
    selectedForReactivation.value.push(accountId)
  }
}

const toggleAllDeactivated = () => {
  if (selectedForReactivation.value.length === deactivatedAccounts.value.length) {
    selectedForReactivation.value = []
  } else {
    selectedForReactivation.value = deactivatedAccounts.value.map((a) => a.id)
  }
}

const reactivateSelected = async () => {
  try {
    reactivating.value = true
    const response = await fetch('/api/notices/bulk-reactivate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds: selectedForReactivation.value })
    })
    const result = await response.json()
    message.value = result.message
    messageType.value = 'success'
    selectedForReactivation.value = []
    await loadAllData()
  } catch (error: any) {
    message.value = error.message || 'Error reactivating accounts'
    messageType.value = 'error'
  } finally {
    reactivating.value = false
  }
}

const loadAllData = async () => {
  try {
    loading.value = true

    // Fetch all assignments
    const { data: assignments } = await supabase
      .from('module_assignments')
      .select('*')
      .order('deadline', { ascending: true })

    allAssignments.value = assignments || []

    // Fetch overdue assignments
    const now = new Date().toISOString()
    const { data: overdue } = await supabase
      .from('module_assignments')
      .select('*')
      .lt('deadline', now)
      .in('status', ['pending', 'in_progress'])

    overdueAssignments.value = overdue || []

    // Fetch deactivated accounts
    const { data: deactivated } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_active', false)
      .not('deactivated_at', 'is', null)

    deactivatedAccounts.value = deactivated || []

    // Fetch all notices
    const { data: notices } = await supabase
      .from('student_notices')
      .select('*')

    allNotices.value = notices || []
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadAllData()
})
</script>

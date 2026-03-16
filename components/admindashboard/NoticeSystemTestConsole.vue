<template>
  <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-900">📬 Automated Notice System</h2>
      <button
        @click="showConsole = !showConsole"
        class="text-sm px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        {{ showConsole ? 'Hide' : 'Show' }} Details
      </button>
    </div>

    <div v-if="!showConsole" class="text-gray-600 text-sm">
      ℹ️ The system automatically:
      <br />✅ Assigns 2-week deadline to all modules when student enrolls
      <br />✅ Sends first notice announcement at day 7
      <br />✅ Sends final message and deactivates account at day 14
    </div>

    <div v-else class="space-y-6">
      <!-- How It Works -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="font-semibold text-blue-900 mb-2">🔄 How The System Works</h3>
        <div class="text-sm text-blue-800 space-y-1">
          <div>✅ <strong>Automatic:</strong> All 5 modules get 2-week deadline when student enrolls</div>
          <div>✅ <strong>Day 7 (Overdue):</strong> Automatic announcement sent to student</div>
          <div>✅ <strong>Day 14 (Severely Overdue):</strong> Final message sent + account deactivated</div>
          <div>✅ <strong>Admin:</strong> Can reactivate accounts anytime</div>
        </div>
      </div>

      <!-- System Status -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <p class="text-sm text-green-600 font-semibold">Auto Assignments</p>
          <p class="text-2xl font-bold text-green-900 mt-2">{{ totalAssignments }}</p>
          <p class="text-xs text-green-600 mt-1">2-week deadlines</p>
        </div>
        <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p class="text-sm text-amber-600 font-semibold">Day 7 Announcements</p>
          <p class="text-2xl font-bold text-amber-900 mt-2">{{ firstNoticeCount }}</p>
          <p class="text-xs text-amber-600 mt-1">Sent to students</p>
        </div>
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-sm text-red-600 font-semibold">Day 14 Messages</p>
          <p class="text-2xl font-bold text-red-900 mt-2">{{ secondNoticeCount }}</p>
          <p class="text-xs text-red-600 mt-1">Account deactivated</p>
        </div>
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p class="text-sm text-purple-600 font-semibold">Inactive Accounts</p>
          <p class="text-2xl font-bold text-purple-900 mt-2">{{ deactivatedCount }}</p>
          <p class="text-xs text-purple-600 mt-1">Awaiting reactivation</p>
        </div>
      </div>

      <!-- Automatic Check -->
      <div class="border-t-2 border-green-500 pt-4">
        <h3 class="font-semibold text-gray-900 mb-3">🔔 Trigger Automatic Checks</h3>
        <p class="text-sm text-gray-600 mb-3">
          Normally runs daily at midnight. Click here to run immediately:
        </p>
        <button
          @click="checkAndSendNotices"
          :disabled="checking"
          class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 font-medium"
        >
          {{ checking ? 'Processing...' : '▶ Check Now & Send Notices' }}
        </button>
        <div v-if="checkResult" class="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm">
          <div class="font-semibold text-green-900 mb-2">✅ Results:</div>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div>📊 Processed Assignments: {{ checkResult.processedCount }}</div>
            <div>📢 Day 7 Announcements Sent: {{ checkResult.firstNoticeCount }}</div>
            <div>📮 Day 14 Messages Sent: {{ checkResult.secondNoticeCount }}</div>
            <div>🔒 Accounts Deactivated: {{ checkResult.deactivatedCount }}</div>
          </div>
          <p class="text-xs text-green-600 mt-2">{{ checkResult.message }}</p>
        </div>
      </div>

      <!-- View Overdue Modules -->
      <div class="border-t pt-4">
        <h3 class="font-semibold text-gray-900 mb-3">📋 View Overdue Modules</h3>
        <button
          @click="loadOverdueModules"
          :disabled="loadingOverdue"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          {{ loadingOverdue ? 'Loading...' : 'Show Overdue Modules' }}
        </button>

        <div v-if="overdueModules.length > 0" class="mt-3 overflow-x-auto">
          <table class="w-full text-sm border border-gray-200 rounded">
            <thead>
              <tr class="bg-gray-100 border-b">
                <th class="text-left p-2 font-semibold">Student</th>
                <th class="text-left p-2 font-semibold">Days Overdue</th>
                <th class="text-left p-2 font-semibold">Status</th>
                <th class="text-left p-2 font-semibold">Notice Sent</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="module in overdueModules" :key="module.id" class="border-b hover:bg-gray-50">
                <td class="p-2">{{ module.user_id.substring(0, 8) }}</td>
                <td class="p-2">
                  <span class="inline-block px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800">
                    {{ getDaysOverdue(module.deadline) }} days
                  </span>
                </td>
                <td class="p-2">{{ module.status }}</td>
                <td class="p-2">
                  <span v-if="hasFirstNotice(module.id)" class="text-xs text-amber-700">✓ Day 7</span>
                  <span v-if="hasSecondNotice(module.id)" class="text-xs text-red-700">✓ Day 14</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else-if="showOverdue" class="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
          ✅ No overdue modules. All students are on track!
        </div>
      </div>

      <!-- Deactivated Accounts Management -->
      <div class="border-t pt-4 pb-4">
        <h3 class="font-semibold text-gray-900 mb-3">👥 Deactivated Accounts</h3>
        <button
          @click="loadDeactivatedAccounts"
          :disabled="loadingAccounts"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm mb-3"
        >
          {{ loadingAccounts ? 'Loading...' : 'Show Deactivated Accounts' }}
        </button>

        <div v-if="deactivatedAccounts.length > 0" class="mb-3">
          <button
            @click="reactivateAllSelected"
            :disabled="selectedAccounts.length === 0 || reactivating"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
          >
            {{ reactivating ? 'Reactivating...' : `Reactivate Selected (${selectedAccounts.length})` }}
          </button>
        </div>

        <div v-if="deactivatedAccounts.length > 0" class="overflow-x-auto">
          <table class="w-full text-sm border border-gray-200 rounded">
            <thead>
              <tr class="bg-gray-100 border-b">
                <th class="text-left p-2">
                  <input
                    type="checkbox"
                    @change="toggleAllAccounts"
                    :checked="selectedAccounts.length === deactivatedAccounts.length"
                  />
                </th>
                <th class="text-left p-2 font-semibold">Email</th>
                <th class="text-left p-2 font-semibold">Deactivated</th>
                <th class="text-left p-2 font-semibold">Reason</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="account in deactivatedAccounts" :key="account.id" class="border-b hover:bg-gray-50">
                <td class="p-2">
                  <input
                    type="checkbox"
                    :checked="selectedAccounts.includes(account.id)"
                    @change="toggleAccount(account.id)"
                  />
                </td>
                <td class="p-2">{{ account.email }}</td>
                <td class="p-2 text-xs">{{ formatDate(account.deactivated_at) }}</td>
                <td class="p-2 text-xs text-gray-600">{{ account.account_deactivation_reason }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else-if="showAccounts" class="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
          ✅ No deactivated accounts!
        </div>
      </div>

      <!-- Info -->
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-600">
        <strong>ℹ️ How It Works:</strong>
        <ul class="mt-2 space-y-1">
          <li>• When a student enrolls, all 5 modules are automatically assigned with a 2-week deadline</li>
          <li>• The system automatically checks daily (or manually above) for overdue modules</li>
          <li>• At 7 days overdue: An announcement is sent to the student (remains active)</li>
          <li>• At 14 days overdue: A final message is sent and the account is automatically deactivated</li>
          <li>• Admin can reactivate accounts anytime using the table above</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { $supabase } = useNuxtApp()
const supabase = $supabase

const showConsole = ref(false)
const checking = ref(false)
const loadingOverdue = ref(false)
const loadingAccounts = ref(false)
const reactivating = ref(false)

const checkResult = ref<any>(null)
const overdueModules = ref<any[]>([])
const deactivatedAccounts = ref<any[]>([])
const selectedAccounts = ref<string[]>([])
const showOverdue = ref(false)
const showAccounts = ref(false)

const totalAssignments = ref(0)
const firstNoticeCount = ref(0)
const secondNoticeCount = ref(0)
const deactivatedCount = ref(0)

const allNotices = ref<any[]>([])

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

const hasFirstNotice = (assignmentId: number) => {
  return allNotices.value.some(
    (n) => n.module_assignment_id === assignmentId && n.notice_type === 'first_notice'
  )
}

const hasSecondNotice = (assignmentId: number) => {
  return allNotices.value.some(
    (n) => n.module_assignment_id === assignmentId && n.notice_type === 'second_notice'
  )
}

const checkAndSendNotices = async () => {
  try {
    checking.value = true
    const response = await fetch('/api/notices/check-overdue', { method: 'POST' })
    const result = await response.json()
    checkResult.value = result
    await loadStats()
  } catch (error: any) {
    console.error('Error:', error)
  } finally {
    checking.value = false
  }
}

const loadOverdueModules = async () => {
  try {
    loadingOverdue.value = true
    showOverdue.value = true

    const now = new Date().toISOString()
    const { data } = await supabase
      .from('module_assignments')
      .select('*')
      .lt('deadline', now)
      .in('status', ['pending', 'in_progress'])

    overdueModules.value = data || []
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loadingOverdue.value = false
  }
}

const loadDeactivatedAccounts = async () => {
  try {
    loadingAccounts.value = true
    showAccounts.value = true

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_active', false)
      .not('deactivated_at', 'is', null)

    deactivatedAccounts.value = data || []
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loadingAccounts.value = false
  }
}

const toggleAccount = (accountId: string) => {
  const index = selectedAccounts.value.indexOf(accountId)
  if (index > -1) {
    selectedAccounts.value.splice(index, 1)
  } else {
    selectedAccounts.value.push(accountId)
  }
}

const toggleAllAccounts = () => {
  if (selectedAccounts.value.length === deactivatedAccounts.value.length) {
    selectedAccounts.value = []
  } else {
    selectedAccounts.value = deactivatedAccounts.value.map((a) => a.id)
  }
}

const reactivateAllSelected = async () => {
  try {
    reactivating.value = true
    const response = await fetch('/api/notices/bulk-reactivate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds: selectedAccounts.value })
    })
    const result = await response.json()
    selectedAccounts.value = []
    await loadDeactivatedAccounts()
    await loadStats()
  } catch (error: any) {
    console.error('Error:', error)
  } finally {
    reactivating.value = false
  }
}

const loadStats = async () => {
  try {
    const { data: assignments } = await supabase
      .from('module_assignments')
      .select('*')

    const { data: notices } = await supabase
      .from('student_notices')
      .select('*')

    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_active', false)
      .not('deactivated_at', 'is', null)

    totalAssignments.value = assignments?.length || 0
    allNotices.value = notices || []
    firstNoticeCount.value = notices?.filter((n) => n.notice_type === 'first_notice').length || 0
    secondNoticeCount.value = notices?.filter((n) => n.notice_type === 'second_notice').length || 0
    deactivatedCount.value = profiles?.length || 0
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

onMounted(async () => {
  await loadStats()
})
</script>

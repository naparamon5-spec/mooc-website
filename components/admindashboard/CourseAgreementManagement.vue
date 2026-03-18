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
        <p class="text-sm text-purple-600 font-semibold">Overdue Assignments</p>
        <p class="text-2xl font-bold text-purple-900 mt-2">{{ overdueAssignments.length }}</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6 border-b border-gray-200">
      <button
        v-for="tab in ['assignments', 'overdue']"
        :key="tab"
        @click="activeTab = tab"
        class="px-4 py-2 font-medium text-sm transition-colors"
        :class="[
          activeTab === tab
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        {{ tab === 'assignments' ? 'All Assignments' : 'Overdue Modules' }}
      </button>
    </div>

    <!-- Search / Filters -->
    <div v-if="!loading" class="flex flex-col lg:flex-row gap-3 mb-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by Student ID or Module title..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="w-full lg:w-44">
        <select
          v-model="statusFilter"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="pending">pending</option>
          <option value="in_progress">in_progress</option>
          <option value="completed">completed</option>
          <option value="overdue">overdue</option>
        </select>
      </div>
      <div class="w-full lg:w-44">
        <select
          v-model="levelFilter"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Levels</option>
          <option value="beginner">beginner</option>
          <option value="advanced">advanced</option>
        </select>
      </div>
<div class="w-full lg:w-72 min-w-0">
  <select
    v-model="moduleFilter"
    class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden text-ellipsis"
  >
          <option value="">All Modules</option>
          <option v-for="module in uniqueModules" :key="module" :value="module">{{ module }}</option>
        </select>
      </div>
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
              v-for="assignment in paginatedRows"
              :key="assignment.id"
              class="border-b border-gray-200 hover:bg-gray-50"
            >
              <td class="py-3 px-4 text-gray-900">{{ assignment.student_id_display }}</td>
              <td class="py-3 px-4 text-gray-600">{{ assignment.module_title }}</td>
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
      <div v-if="filteredRows.length === 0" class="text-center py-8 text-gray-500">
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
              v-for="assignment in paginatedRows"
              :key="assignment.id"
              class="border-b border-gray-200 hover:bg-gray-50"
            >
              <td class="py-3 px-4 text-gray-900">{{ assignment.student_id_display }}</td>
              <td class="py-3 px-4 text-gray-600">{{ assignment.module_title }}</td>
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
      <div v-if="filteredRows.length === 0" class="text-center py-8 text-gray-500">
        <p>No overdue modules at this time.</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && filteredRows.length > 0" class="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="text-sm text-gray-600">
        Showing {{ pageStart + 1 }}–{{ pageEnd }} of {{ filteredRows.length }}
      </div>
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2 mr-4">
          <label for="rows-per-page" class="text-sm text-gray-600">Rows:</label>
        <select
  id="rows-per-page"
  v-model.number="rowsPerPage"
  class="px-3 py-1 pr-7 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[4.5rem]"
>
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
          </select>
        </div>
        <button
          class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Prev
        </button>
        <span class="text-sm text-gray-700">Page {{ currentPage }} / {{ totalPages }}</span>
        <button
          class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
          :disabled="currentPage >= totalPages"
          @click="currentPage++"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" class="mt-4" :class="[messageType === 'success' ? 'text-green-700' : 'text-red-700']">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

type AssignmentRow = {
  id: number
  user_id: string
  module_id: string
  deadline: string
  status: string
  course_level: string
  student_id_display: string
  module_title: string
}

const { $supabase } = useNuxtApp()
const supabase = $supabase
const activeTab = ref('assignments')
const loading = ref(false)
const checkingOverdue = ref(false)

const allAssignments = ref<AssignmentRow[]>([])
const overdueAssignments = ref<AssignmentRow[]>([])
const allNotices = ref<any[]>([])

const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const searchQuery = ref('')
const statusFilter = ref('')
const levelFilter = ref('')
const moduleFilter = ref('')
const rowsPerPage = ref(10)
const currentPage = ref(1)

const totalAssignments = computed(() => allAssignments.value.length)
const firstNoticeCount = computed(() =>
  allNotices.value.filter((n) => n.notice_type === 'first_notice').length
)
const secondNoticeCount = computed(() =>
  allNotices.value.filter((n) => n.notice_type === 'second_notice').length
)

const uniqueModules = computed(() => {
  const modules = new Set<string>()
  allAssignments.value.forEach(a => modules.add(a.module_title))
  return Array.from(modules).sort()
})

watch([activeTab, rowsPerPage, searchQuery, statusFilter, levelFilter, moduleFilter], () => {
  currentPage.value = 1
})

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

const filteredRows = computed(() => {
  const rows = activeTab.value === 'assignments' ? allAssignments.value : overdueAssignments.value
  const q = searchQuery.value.trim().toLowerCase()

  return rows.filter((r) => {
    const matchesQuery =
      !q ||
      r.student_id_display.toLowerCase().includes(q) ||
      r.module_title.toLowerCase().includes(q)

    const matchesStatus = !statusFilter.value || r.status === statusFilter.value
    const matchesLevel = !levelFilter.value || r.course_level === levelFilter.value
    const matchesModule = !moduleFilter.value || r.module_title === moduleFilter.value

    return matchesQuery && matchesStatus && matchesLevel && matchesModule
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / rowsPerPage.value)))
const pageStart = computed(() => (currentPage.value - 1) * rowsPerPage.value)
const pageEnd = computed(() => Math.min(filteredRows.value.length, pageStart.value + rowsPerPage.value))
const paginatedRows = computed(() => filteredRows.value.slice(pageStart.value, pageEnd.value))

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

const resolveDisplayData = async (assignments: any[]) => {
  const moduleIds = Array.from(new Set(assignments.map((a) => a.module_id).filter(Boolean)))
  const userIds = Array.from(new Set(assignments.map((a) => a.user_id).filter(Boolean)))

  const [modulesRes, profilesRes] = await Promise.all([
    moduleIds.length
      ? supabase.from('modules').select('id, title').in('id', moduleIds)
      : Promise.resolve({ data: [] as any[] }),
    userIds.length
      ? supabase.from('profiles').select('id, student_id').in('id', userIds)
      : Promise.resolve({ data: [] as any[] })
  ])

  const moduleTitleById = new Map<string, string>()
  for (const m of modulesRes.data || []) moduleTitleById.set(m.id, m.title || m.id)

  const studentIdByUserId = new Map<string, string>()
  for (const p of profilesRes.data || []) {
    studentIdByUserId.set(p.id, p.student_id || p.id?.substring?.(0, 8) || '—')
  }

  return (assignments || []).map((a: any) => {
    const moduleTitle = moduleTitleById.get(a.module_id) || a.module_id
    const studentId = studentIdByUserId.get(a.user_id) || a.user_id?.substring?.(0, 8) || '—'

    const row: AssignmentRow = {
      id: a.id,
      user_id: a.user_id,
      module_id: a.module_id,
      deadline: a.deadline,
      status: a.status,
      course_level: a.course_level,
      student_id_display: studentId,
      module_title: moduleTitle
    }
    return row
  })
}

const loadAllData = async () => {
  try {
    loading.value = true

    // Fetch all assignments
    const { data: assignments } = await supabase
      .from('module_assignments')
      .select('*')
      .order('deadline', { ascending: true })

    allAssignments.value = await resolveDisplayData(assignments || [])

    // Fetch overdue assignments
    const now = new Date().toISOString()
    const { data: overdue } = await supabase
      .from('module_assignments')
      .select('*')
      .lt('deadline', now)
      .in('status', ['pending', 'in_progress'])

    overdueAssignments.value = await resolveDisplayData(overdue || [])

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

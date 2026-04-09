<template>
  <div class="w-full">

    <!-- ───── Overdue Banner ───── -->
    <div
      v-if="activeOverdueAssignments.length > 0 && !dismissedOverdue"
      class="notice-banner notice-overdue"
    >
      <span class="banner-dot overdue-dot">!</span>
      <div class="banner-body">
        <strong>Overdue reminder: please finish your assigned module</strong>
        <span>{{ getOverdueSummary() }} — {{ getDaysOverdueStatus() }}</span>
      </div>
      <button class="banner-action overdue-action" @click="goToFirstModule">
        View now
      </button>
      <button class="banner-close" aria-label="Dismiss" @click="dismissedOverdue = true">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <!-- ───── Phase notice (after I agree): Week 1–4, dismissible permanently ───── -->
    <div
      v-else-if="notices.length === 0 && phaseNotice"
      class="notice-banner notice-clear"
    >
      <span class="banner-dot clear-dot">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <div class="banner-body">
        <strong>{{ phaseNotice.title }}</strong>
        <span>{{ phaseNotice.message }}</span>
      </div>
      <button class="banner-close" aria-label="Remove" @click="dismissPhaseNotice">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCourseAgreement } from '~/composables/useCourseAgreement'

const DISMISSED_PHASES_KEY_PREFIX = 'mooc_notice_dismissed_phases_'

const { getUserNotices, getCourseAgreementAcceptedAt } = useCourseAgreement()

const dismissedOverdue = ref(false)
const dismissedPhases = ref<number[]>([])
const agreementAcceptedAt = ref<string | null>(null)
const currentUserId = ref<string | null>(null)
const notices = ref<any[]>([])
const overdueAssignments = ref<any[]>([])

const PHASE_NOTICES: { title: string; message: string }[] = [
  { title: 'All clear', message: "You're on track with all modules." },
  { title: 'All clear', message: "Week 2 — You're on track. Keep it up!" },
  { title: 'All clear', message: "Week 3 — You're on track. Almost there!" },
  { title: 'All clear', message: "You're on track. Continue with the rest of the modules." }
]

function getDaysSinceAgreement(): number {
  if (!agreementAcceptedAt.value) return -1
  const accepted = new Date(agreementAcceptedAt.value).getTime()
  return Math.floor((Date.now() - accepted) / (24 * 60 * 60 * 1000))
}

function getCurrentPhase(): number {
  const days = getDaysSinceAgreement()
  if (days < 0) return 0
  if (days < 7) return 1
  if (days < 14) return 2
  if (days < 21) return 3
  return 4
}

function getDismissedPhases(userId: string): number[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(DISMISSED_PHASES_KEY_PREFIX + userId)
    if (!raw) return []
    const parsed = JSON.parse(raw) as number[]
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
}

function setDismissedPhases(userId: string, phases: number[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(DISMISSED_PHASES_KEY_PREFIX + userId, JSON.stringify(phases))
  } catch {}
}

const phaseNotice = computed(() => {
  if (!agreementAcceptedAt.value || !currentUserId.value) return null
  const phase = getCurrentPhase()
  if (phase < 1 || phase > 4) return null
  if (dismissedPhases.value.includes(phase)) return null
  return PHASE_NOTICES[phase - 1]
})

function dismissPhaseNotice() {
  const phase = getCurrentPhase()
  if (phase < 1 || phase > 4 || !currentUserId.value) return
  const next = [...new Set([...dismissedPhases.value, phase])]
  dismissedPhases.value = next
  setDismissedPhases(currentUserId.value, next)
}

const normalizeCourseLevel = (courseLevel: string | null | undefined) => {
  const normalized = String(courseLevel || 'general').toLowerCase()
  if (normalized === 'advance') return 'advanced'
  return normalized
}

const activeOverdueAssignments = computed(() => {
  const beginnerAssignments = overdueAssignments.value.filter(
    assignment => normalizeCourseLevel(assignment.course_level) === 'beginner'
  )

  if (beginnerAssignments.length > 0) return beginnerAssignments

  return overdueAssignments.value.filter(
    assignment => normalizeCourseLevel(assignment.course_level) === 'advanced'
  )
})

const overdueAssignmentsByCourseLevel = computed(() => {
  const groups: Record<string, any[]> = {}

  for (const assignment of activeOverdueAssignments.value) {
    const level = normalizeCourseLevel(assignment.course_level)
    if (!groups[level]) groups[level] = []
    groups[level].push(assignment)
  }

  return groups
})

const formatCourseLevelLabel = (courseLevel: string) => {
  if (courseLevel === 'beginner') return 'Beginner'
  if (courseLevel === 'advanced' || courseLevel === 'advance') return 'Advanced'
  return courseLevel.charAt(0).toUpperCase() + courseLevel.slice(1)
}

const getOverdueSummary = () => {
  if (activeOverdueAssignments.value.length === 0) return 'No overdue modules'

  const summaries = Object.entries(overdueAssignmentsByCourseLevel.value).map(([courseLevel, assignments]) => {
    return `${formatCourseLevelLabel(courseLevel)}: ${assignments.length} module(s)`
  })

  return summaries.join(' • ')
}

const getDaysOverdueStatus = () => {
  if (activeOverdueAssignments.value.length === 0) return 'No pending'
  const mostOverdueAssignment = [...activeOverdueAssignments.value].sort((a, b) => {
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  })[0]
  const daysOverdue = mostOverdueAssignment ? getDaysOverdue(mostOverdueAssignment.id) : 0

  if (daysOverdue >= 28) return 'Fourth notice level — please contact the administrator immediately'
  if (daysOverdue >= 21) return 'Third notice level — urgent action required'
  if (daysOverdue >= 14) return 'Second notice level — account is at risk'
  if (daysOverdue >= 7) return 'First notice level — 7+ days overdue'
  if (daysOverdue > 0) return `${daysOverdue} day(s) overdue`
  return 'Due date already passed — please complete it as soon as possible'
}

const getDaysOverdue = (assignmentId: number) => {
  const assignment = overdueAssignments.value.find(a => a.id === assignmentId)
  if (!assignment) return 0
  return Math.floor((Date.now() - new Date(assignment.deadline).getTime()) / (1000 * 60 * 60 * 24))
}

const goToFirstModule = async () => {
  if (activeOverdueAssignments.value.length === 0) return

  const assignment = [...activeOverdueAssignments.value].sort((a, b) => {
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  })[0]

  if (assignment) await navigateTo(`/modules/${assignment.module_id}`)
}

const loadNotices = async () => {
  try {
    const { $supabase } = useNuxtApp()
    const { data: { user } } = await $supabase.auth.getUser()
    if (!user?.id) return

    currentUserId.value = user.id
    agreementAcceptedAt.value = await getCourseAgreementAcceptedAt(user.id)
    dismissedPhases.value = getDismissedPhases(user.id)
    notices.value = await getUserNotices(user.id) || []

    const { data: overdueData } = await $supabase
      .from('module_assignments')
      .select('*')
      .eq('user_id', user.id)
      .lt('deadline', new Date().toISOString())
      .in('status', ['pending', 'in_progress', 'overdue'])
      .order('deadline', { ascending: true })

    overdueAssignments.value = overdueData || []
  } catch (error) {
    console.error('Error loading notices:', error)
  }
}

onMounted(() => { loadNotices() })
</script>

<style scoped>
.notice-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  border-radius: 8px;
  font-size: 13.5px;
  margin-bottom: 12px;
  line-height: 1;
}

.banner-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.banner-body strong { font-weight: 600; font-size: 13px; display: block; }
.banner-body span   { font-size: 12px; opacity: 0.75; }

.banner-dot {
  width: 20px; height: 20px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700;
  flex-shrink: 0; line-height: 1;
}

.banner-action {
  padding: 4px 12px; border-radius: 6px;
  font-size: 12px; font-weight: 600;
  border: none; cursor: pointer;
  white-space: nowrap; flex-shrink: 0;
}

.banner-close {
  width: 22px; height: 22px;
  border-radius: 5px; border: none;
  background: transparent; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; opacity: 0.45;
  transition: opacity 0.15s; padding: 0; color: inherit;
}
.banner-close:hover { opacity: 1; }

.notice-clear { background-color: #eaf6ee; border: 1px solid #a3d9b5; color: #155724; }
.notice-clear .banner-body strong { color: #155724; }
.notice-clear .banner-body span   { color: #1e7a40; }
.clear-dot { background-color: #27ae60; color: #ffffff; }

.notice-overdue { background-color: #fff8e6; border: 1px solid #f0c040; color: #7a4c00; }
.notice-overdue .banner-body strong { color: #7a4c00; }
.notice-overdue .banner-body span   { color: #9a6300; }
.overdue-dot { background-color: #e6a817; color: #ffffff; }
.overdue-action { background-color: #b85c00; color: #ffffff; }
.overdue-action:hover { background-color: #9a4d00; }
</style>

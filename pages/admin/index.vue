<template>
  <div class="min-h-screen bg-gray-50">
    <AdminHeader :admin-name="adminName" />
    
  <div class="max-w-full px-4 md:px-8 lg:px-12 py-8">
      <!-- Top Row Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Enrolled Students"
          :value="totalEnrolled"
        />
        <MetricCard
          title="Active Students"
          :value="activeStudents"
        />
        <MetricCard
          title="Inactive Students"
          :value="inactiveStudents"
        />
        <MetricCard
          title="Completed"
          :value="completed"
          subtitle="in 2026"
        />
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Course Management -->
        <div class="lg:col-span-1">
          <CourseManagement
            @action="handleCourseAction"
          />
        </div>

        <!-- System Health -->
        <div class="lg:col-span-1">
          <SystemHealth :data="dailyCompletions" />
        </div>
      </div>

      <!-- Analytics Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Enrollment Analytics -->
        <EnrollmentAnalytics :data="enrollmentAnalyticsData" />

        <!-- Course Completion Rate -->
        <CourseCompletionRate :data="courseCompletionRates" />
      </div>

      <!-- 2-Week Course Agreement Management -->
      <div class="mb-8">
        <CourseAgreementManagement />
      </div>

      <!-- Test Console -->
      <!-- <div class="mb-8">
        <NoticeSystemTestConsole />
      </div> -->
    </div>

    <!-- Course Report Dialog -->
    <CourseReportDialog
      :is-open="showReportDialog"
      :module-completion-stats="moduleCompletionStats"
      :enrollment-data="dailyEnrollments"
      :course-completion-rates="courseCompletionRates"
      @close="showReportDialog = false"
    />

    <!-- Footer -->
    <footer class="bg-primary-600 text-white text-center py-4">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import AdminHeader from '~/components/admindashboard/AdminHeader.vue'
import MetricCard from '~/components/admindashboard/MetricCard.vue'
import CourseManagement from '~/components/admindashboard/CourseManagement.vue'
import ActivityFeed from '~/components/admindashboard/ActivityFeed.vue'
import EnrollmentAnalytics from '~/components/admindashboard/EnrollmentAnalytics.vue'
import CourseCompletionRate from '~/components/admindashboard/CourseCompletionRate.vue'
import SystemHealth from '~/components/admindashboard/SystemHealth.vue'
import CourseAgreementManagement from '~/components/admindashboard/CourseAgreementManagement.vue'
import CourseReportDialog from '~/components/admindashboard/CourseReportDialog.vue'
import NoticeSystemTestConsole from '~/components/admindashboard/NoticeSystemTestConsole.vue'
import { useUserProfile } from '~/composables/useUserProfile'
import { useAdminMetrics } from '~/composables/useAdminMetrics'
import { useUserManagement } from '~/composables/useUserManagement'

definePageMeta({ middleware: 'auth' })

useHead({
  title: 'Admin Dashboard - MIL MOOC',
})

const { fetchUserProfile } = useUserProfile()
const { totalEnrolled, activeStudents, pendingEnrollments, completed, moduleCompletionStats, dailyCompletions, dailyEnrollments, courseCompletionRates, fetchMetrics, fetchDailyEnrollments, fetchModuleCompletionStats, fetchCourseCompletionRates } = useAdminMetrics()
const { users: dbUsers, loading: usersLoading, error: usersError, fetchUsers } = useUserManagement()
const adminName = ref("Admin User")
const inactiveStudents = ref(0)

const { $supabase } = useNuxtApp()
const supabase = $supabase

// Report dialog state
const showReportDialog = ref(false)

// Fetch user profile and metrics on mount
onMounted(async () => {
  try {
    const userData = await fetchUserProfile();
    if (userData?.full_name) {
      adminName.value = userData.full_name;
    }
    
    // Fetch enrollment metrics from Supabase
    await fetchMetrics();
    // Fetch daily enrollments/signups (last 14 days)
    await fetchDailyEnrollments();
    // Fetch module completion stats (last 2 weeks)
    await fetchModuleCompletionStats();
    // Fetch course completion rates by year
    await fetchCourseCompletionRates();
    
    // Fetch users from database
    await fetchUsers();
    
    // Fetch inactive students count
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', false)
    
    inactiveStudents.value = count || 0
  } catch (err) {
    console.error('Error loading admin data:', err);
  }
});

const activities = ref([
  { 
    message: 'New student registration', 
    timestamp: '2 mins ago',
    type: 'success'
  },
  { 
    message: 'Publish edited module',
    type: 'success'
  },
  { 
    message: 'Upload failed',
    retry: true,
    type: 'error'
  },
  { 
    message: 'System warning: High memory usage',
    showWarningIcon: true,
    type: 'warning'
  },
  { 
    message: 'Reports due',
    count: '4',
    type: 'warning'
  },
])

// Transform dailyEnrollments into format for EnrollmentAnalytics (last 7 days)
const enrollmentAnalyticsData = computed(() => {
  const last7Days = dailyEnrollments.value.slice(-7)
  return last7Days.map(item => ({
    day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
    value: item.enrollments
  }))
})

// module completion counts used to illustrate how quickly each module is being finished
// (data pulled from the last 14 days)
const moduleMetrics = ref<Array<{ label: string, status?: string, value: number | null }>>([])

// whenever moduleCompletionStats changes we rebuild moduleMetrics
watch(moduleCompletionStats, (newStats) => {
  moduleMetrics.value = newStats.map(s => ({
    label: s.title,
    status: '',
    value: s.completions
  }))
}, { immediate: true })

const handleUserAction = (actionType: string) => {
  console.log('User action:', actionType)
  // Handle user management actions
}

const handleCourseAction = (actionType: string) => {
  console.log('Course action:', actionType)
  if (actionType === 'upload-resources') {
    navigateTo('/admin/resources')
  } else if (actionType === 'change-welcome-card') {
    navigateTo('/admin/welcome-video')
  } else if (actionType === 'download-report') {
    showReportDialog.value = true
  } else {
    // Handle other course management actions
  }
}

const handleRetry = (activity: any) => {
  console.log('Retry activity:', activity)
  // Handle retry logic
}
</script>


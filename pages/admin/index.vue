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
          title="Pending Enrollments"
          :value="pendingEnrollments"
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

        <!-- Activity Feed -->
        <div class="lg:col-span-1">
          <ActivityFeed
            :activities="activities"
            @retry="handleRetry"
          />
        </div>
      </div>

      <!-- Analytics Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Enrollment Analytics -->
        <EnrollmentAnalytics :data="enrollmentData" />

        <!-- Course Completion Rate -->
        <CourseCompletionRate :data="completionData" />
      </div>

      <!-- System Health -->
      <div class="mb-8">
        <SystemHealth :metrics="systemMetrics" />
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-primary-600 text-white text-center py-4">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminHeader from '~/components/admindashboard/AdminHeader.vue'
import MetricCard from '~/components/admindashboard/MetricCard.vue'
import CourseManagement from '~/components/admindashboard/CourseManagement.vue'
import ActivityFeed from '~/components/admindashboard/ActivityFeed.vue'
import EnrollmentAnalytics from '~/components/admindashboard/EnrollmentAnalytics.vue'
import CourseCompletionRate from '~/components/admindashboard/CourseCompletionRate.vue'
import SystemHealth from '~/components/admindashboard/SystemHealth.vue'
import { useUserProfile } from '~/composables/useUserProfile'
import { useAdminMetrics } from '~/composables/useAdminMetrics'
import { useUserManagement } from '~/composables/useUserManagement'

definePageMeta({ middleware: 'auth' })

useHead({
  title: 'Admin Dashboard - MIL MOOC',
})

const { fetchUserProfile } = useUserProfile()
const { totalEnrolled, activeStudents, pendingEnrollments, completed, fetchMetrics } = useAdminMetrics()
const { users: dbUsers, loading: usersLoading, error: usersError, fetchUsers } = useUserManagement()
const adminName = ref("Admin User")

// Fetch user profile and metrics on mount
onMounted(async () => {
  try {
    const userData = await fetchUserProfile();
    if (userData?.full_name) {
      adminName.value = userData.full_name;
    }
    
    // Fetch enrollment metrics from Supabase
    await fetchMetrics();
    
    // Fetch users from database
    await fetchUsers();
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

const enrollmentData = ref([
  { day: 'Mon', value: 18 },
  { day: 'Tues', value: 22 },
  { day: 'Wed', value: 28 },
  { day: 'Thurs', value: 35 },
  { day: 'Fri', value: 32 }
])

const completionData = ref([
  { year: '2026', percentage: 10 },
  { year: '2027', percentage: 20 },
  { year: '2028', percentage: 30 },
  { year: '2029', percentage: 40 }
])

const systemMetrics = ref([
  { label: 'Server Load', status: 'Low', value: null },
  { label: 'Storage Usage', status: 'Warning', value: '89%' },
  { label: 'API Uptime', status: 'Good', value: '91%' },
  { label: 'Security Status', status: 'Good', value: null },
  { label: 'Error Logs', status: 'Warning', value: null },
  { label: 'Network and Bandwidth', status: 'Good', value: null },
  { label: 'Server Performance', status: 'Good', value: null },
  { label: 'Database Health', status: 'Good', value: null }
])

const handleUserAction = (actionType) => {
  console.log('User action:', actionType)
  // Handle user management actions
}

const handleCourseAction = (actionType) => {
  console.log('Course action:', actionType)
  // Handle course management actions
}

const handleRetry = (activity) => {
  console.log('Retry activity:', activity)
  // Handle retry logic
}
</script>


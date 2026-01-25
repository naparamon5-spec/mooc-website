import { ref } from 'vue'

export const useAdminMetrics = () => {
  const nuxtApp = useNuxtApp()
  const supabase = nuxtApp.$supabase
  
  const totalEnrolled = ref(0)
  const activeStudents = ref(0)
  const pendingEnrollments = ref(0)
  const completed = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Fetch all enrollment metrics
  const fetchMetrics = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      console.log('Starting to fetch admin metrics...')
      
      // 1. Total Students (all students in profiles table with role='student')
      // If that doesn't work, try counting auth users
      let totalCount = 0
      const { count: profileCount, error: profileError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'student')
      
      if (profileError) {
        console.warn('Error counting from profiles table:', profileError)
        // Try getting full data instead of count
        const { data: profileData, error: dataError } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'student')
        
        if (!dataError && profileData) {
          totalCount = profileData.length
        } else {
          console.warn('Both count and data queries failed for profiles')
        }
      } else {
        totalCount = profileCount || 0
      }
      totalEnrolled.value = totalCount
      console.log('Total students:', totalEnrolled.value)

      // 2. Active Students - count students that are not banned
      try {
        const { data: activeStudentsData } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'student')
          .or('is_active.is.true,is_active.is.null')
        
        activeStudents.value = activeStudentsData?.length || totalEnrolled.value
      } catch (activeErr) {
        console.warn('Error counting active students, using total:', activeErr)
        activeStudents.value = totalEnrolled.value
      }
      console.log('Active students:', activeStudents.value)

      // 3. Pending Enrollments - count from enrollments table if it exists
      try {
        const { count: pendingCount } = await supabase
          .from('enrollments')
          .select('*', { count: 'exact', head: true })
          .eq('enrollment_status', 'pending')
        
        pendingEnrollments.value = pendingCount || 0
      } catch (pendingErr) {
        console.warn('Error counting pending enrollments:', pendingErr)
        pendingEnrollments.value = 0
      }
      console.log('Pending enrollments:', pendingEnrollments.value)

      // 4. Completed Beginner Course (all 5 beginner modules done)
      try {
        const { data: completedStudents } = await supabase
          .from('module_completion')
          .select('user_id')
          .eq('course_level', 'beginner')
        
        if (completedStudents && completedStudents.length > 0) {
          // Count users who have completed all 5 beginner modules
          const userCompletionCount: { [key: string]: number } = {}
          completedStudents.forEach((record: any) => {
            userCompletionCount[record.user_id] = (userCompletionCount[record.user_id] || 0) + 1
          })
          
          const completedCount = Object.values(userCompletionCount).filter(count => count === 5).length
          completed.value = completedCount
        } else {
          completed.value = 0
        }
      } catch (completedErr) {
        console.warn('Error counting completed courses:', completedErr)
        completed.value = 0
      }
      console.log('Completed courses:', completed.value)

      // Log the metrics for debugging
      console.log('✓ Admin Metrics Retrieved:', {
        totalEnrolled: totalEnrolled.value,
        activeStudents: activeStudents.value,
        pendingEnrollments: pendingEnrollments.value,
        completed: completed.value
      })
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch metrics'
      console.error('✗ Error fetching metrics:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    totalEnrolled,
    activeStudents,
    pendingEnrollments,
    completed,
    isLoading,
    error,
    fetchMetrics
  }
}
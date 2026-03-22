import { ref } from 'vue'

export const useAdminMetrics = () => {
  const nuxtApp = useNuxtApp()
  const supabase = nuxtApp.$supabase
  
  const totalEnrolled = ref(0)
  const activeStudents = ref(0)
  const pendingEnrollments = ref(0)
  const completed = ref(0)
  const moduleCompletionStats = ref<Array<{ title: string, completions: number }>>([])
  const dailyCompletions = ref<Array<{ date: string, completions: number }>>([])
  const dailyEnrollments = ref<Array<{ date: string, enrollments: number }>>([])
  const courseCompletionRates = ref<Array<{ year: string, percentage: number }>>([])
  const recentModuleCompletions = ref<Array<{ user_id: string, module_id: string, course_level: string, completed_at: string }>>([])
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

  // Fetch daily enrollments (signups/registrations) for the last 14 days
  const fetchDailyEnrollments = async () => {
    try {
      const fourteenDaysAgo = new Date()
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', fourteenDaysAgo.toISOString())
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError

      // Group by date
      const enrollmentStats: { [key: string]: number } = {}

      data?.forEach((item: any) => {
        const date = new Date(item.created_at).toISOString().split('T')[0] // YYYY-MM-DD
        enrollmentStats[date] = (enrollmentStats[date] || 0) + 1
      })

      dailyEnrollments.value = Object.entries(enrollmentStats)
        .map(([date, enrollments]) => ({
          date,
          enrollments
        }))
        .sort((a, b) => a.date.localeCompare(b.date))

      console.log('Daily Enrollments Data:', dailyEnrollments.value)
    } catch (err: any) {
      console.error('Error fetching daily enrollments:', err)
      dailyEnrollments.value = []
    }
  }

  // Fetch module completion stats for the last 14 days
  const fetchModuleCompletionStats = async () => {
    try {
      const fourteenDaysAgo = new Date()
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

      // First try to get data with module title
      const { data, error: fetchError } = await supabase
        .from('module_completion')
        .select(`
          id,
          module_id,
          created_at,
          completed_at,
          modules(id, title)
        `)
        .gte('completed_at', fourteenDaysAgo.toISOString())
        .order('completed_at', { ascending: true })

      if (fetchError) {
        console.warn('Error fetching module completions with join:', fetchError.message)
        throw fetchError
      }

      console.log('Module completion data fetched:', data?.length ?? 0, 'records')

      // Group by module title
      const moduleStats: { [key: string]: number } = {}
      const dailyStats: { [key: string]: number } = {}

      data?.forEach((item: any) => {
        const title = item.modules?.title || `Module ${item.module_id}`
        moduleStats[title] = (moduleStats[title] || 0) + 1

        const date = new Date(item.completed_at || item.created_at).toISOString().split('T')[0] // YYYY-MM-DD
        dailyStats[date] = (dailyStats[date] || 0) + 1
      })

      moduleCompletionStats.value = Object.entries(moduleStats).map(([title, completions]) => ({
        title,
        completions
      }))

      dailyCompletions.value = Object.entries(dailyStats)
        .map(([date, completions]) => ({
          date,
          completions
        }))
        .sort((a, b) => a.date.localeCompare(b.date))

      console.log('✓ Module Completion Stats:', {
        totalRecords: data?.length ?? 0,
        uniqueModules: moduleCompletionStats.value.length,
        dailyDays: dailyCompletions.value.length
      })
    } catch (err: any) {
      console.error('Error fetching module completion stats:', err.message || err)
      moduleCompletionStats.value = []
      dailyCompletions.value = []
    }
  }

  // Fetch course completion rates by year
  const fetchCourseCompletionRates = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('course_completion_rates')
        .select('year, completion_percentage, total_students, completed_students')
        .order('year', { ascending: true })

      if (fetchError) throw fetchError

      courseCompletionRates.value = data?.map(item => ({
        year: item.year.toString(),
        percentage: Number(item.completion_percentage),
        completion_percentage: Number(item.completion_percentage),
        total_students: item.total_students,
        completed_students: item.completed_students
      })) || []
    } catch (err: any) {
      console.error('Error fetching course completion rates:', err)
      courseCompletionRates.value = []
    }
  }

  // Fetch all completed modules in the last 2 weeks
  const fetchRecentModuleCompletions = async () => {
    try {
      const fourteenDaysAgo = new Date()
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

      const { data, error: fetchError } = await supabase
        .from('module_completion')
        .select('user_id, module_id, course_level, completed_at')
        .gte('completed_at', fourteenDaysAgo.toISOString())
        .order('completed_at', { ascending: false })

      if (fetchError) throw fetchError

      recentModuleCompletions.value = data?.map(item => ({
        user_id: item.user_id,
        module_id: item.module_id,
        course_level: item.course_level,
        completed_at: item.completed_at || new Date().toISOString()
      })) || []

      console.log('Recent module completions fetched:', recentModuleCompletions.value.length, 'records')
    } catch (err: any) {
      console.error('Error fetching recent module completions:', err)
      recentModuleCompletions.value = []
    }
  }

  return {
    totalEnrolled,
    activeStudents,
    pendingEnrollments,
    completed,
    moduleCompletionStats,
    dailyCompletions,
    dailyEnrollments,
    courseCompletionRates,
    recentModuleCompletions,
    isLoading,
    error,
    fetchMetrics,
    fetchDailyEnrollments,
    fetchModuleCompletionStats,
    fetchCourseCompletionRates,
    fetchRecentModuleCompletions
  }
}
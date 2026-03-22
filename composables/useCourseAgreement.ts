import { ref, computed } from 'vue'

interface ModuleAssignment {
  id: number
  user_id: string
  module_id: string
  course_level: string
  assigned_at: string
  deadline: string
  completed_at: string | null
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
}

interface StudentNotice {
  id: number
  user_id: string
  module_assignment_id: number
  notice_type: 'first_notice' | 'second_notice'
  notice_message: string
  sent_at: string
  acknowledged_at: string | null
  is_read: boolean
}

export const useCourseAgreement = () => {
  const { $supabase } = useNuxtApp()
  const supabase = $supabase
  
  const moduleAssignments = ref<ModuleAssignment[]>([])
  const studentNotices = ref<StudentNotice[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Assign a module to a student with 2-week deadline
  const assignModuleToStudent = async (
    userId: string,
    moduleId: string,
    courseLevel: 'beginner' | 'advanced'
  ) => {
    try {
      loading.value = true
      error.value = null

      // Calculate 2-week deadline
      const now = new Date()
      const deadline = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)

      const { data, error: insertError } = await supabase
        .from('module_assignments')
        .insert({
          user_id: userId,
          module_id: moduleId,
          course_level: courseLevel,
          assigned_at: now.toISOString(),
          deadline: deadline.toISOString(),
          status: 'pending'
        })
        .select()

      if (insertError) throw insertError

      return data?.[0] || null
    } catch (err: any) {
      error.value = err.message
      console.error('Error assigning module:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get all assignments for a specific user
  const getUserAssignments = async (userId: string) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await supabase
        .from('module_assignments')
        .select('*')
        .eq('user_id', userId)
        .order('deadline', { ascending: true })

      if (fetchError) throw fetchError

      moduleAssignments.value = data || []
      return data || []
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching assignments:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get overdue assignments (deadline passed but not completed)
  const getOverdueAssignments = async () => {
    try {
      loading.value = true
      error.value = null

      const now = new Date().toISOString()

      const { data, error: fetchError } = await supabase
        .from('module_assignments')
        .select('*')
        .lt('deadline', now)
        .in('status', ['pending', 'in_progress'])

      if (fetchError) throw fetchError

      return data || []
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching overdue assignments:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Check and send first notice for overdue modules
  const checkAndSendFirstNotice = async (assignmentId: number, userId: string) => {
    try {
      // Check if first notice already sent
      const { data: existingNotice, error: checkError } = await supabase
        .from('student_notices')
        .select('*')
        .eq('module_assignment_id', assignmentId)
        .eq('notice_type', 'first_notice')
        .single()

      if (checkError && checkError.code !== 'PGRST116') throw checkError

      if (existingNotice) {
        return { alreadySent: true, message: 'First notice already sent' }
      }

      // Create first notice
      const noticeMessage = `This is your first reminder: You have 7 days to complete your assigned module. Please finish it to avoid account restrictions.`

      const { data: notice, error: noticeError } = await supabase
        .from('student_notices')
        .insert({
          user_id: userId,
          module_assignment_id: assignmentId,
          notice_type: 'first_notice',
          notice_message: noticeMessage,
          sent_at: new Date().toISOString(),
          is_read: false
        })
        .select()

      if (noticeError) throw noticeError

      // Update profile to track first notice
      await supabase
        .from('profiles')
        .update({ first_notice_sent_at: new Date().toISOString() })
        .eq('id', userId)

      return { success: true, notice: notice?.[0] }
    } catch (err: any) {
      error.value = err.message
      console.error('Error sending first notice:', err)
      throw err
    }
  }

  // Check and send second notice.
  // NOTE: We do NOT deactivate accounts automatically; account status is managed in Admin "User Management".
  const checkAndSendSecondNoticeAndDeactivate = async (
    assignmentId: number,
    userId: string
  ) => {
    try {
      // Check if second notice already sent
      const { data: existingNotice, error: checkError } = await supabase
        .from('student_notices')
        .select('*')
        .eq('module_assignment_id', assignmentId)
        .eq('notice_type', 'second_notice')
        .single()

      if (checkError && checkError.code !== 'PGRST116') throw checkError

      if (existingNotice) {
        return { alreadySent: true, message: 'Second notice already sent' }
      }

      // Create second notice
      const noticeMessage = `This is your final notice: Your account will be deactivated if you do not complete your assigned module immediately. Please complete it now to restore full access.`

      const { data: notice, error: noticeError } = await supabase
        .from('student_notices')
        .insert({
          user_id: userId,
          module_assignment_id: assignmentId,
          notice_type: 'second_notice',
          notice_message: noticeMessage,
          sent_at: new Date().toISOString(),
          is_read: false
        })
        .select()

      if (noticeError) throw noticeError

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          second_notice_sent_at: new Date().toISOString(),
          is_overdue: true
        })
        .eq('id', userId)

      if (updateError) throw updateError

      // Update assignment status to overdue
      await supabase
        .from('module_assignments')
        .update({ status: 'overdue' })
        .eq('id', assignmentId)

      return {
        success: true,
        notice: notice?.[0],
        accountDeactivated: false
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Error sending second notice and deactivating:', err)
      throw err
    }
  }

  // Get all notices for a specific user
  const getUserNotices = async (userId: string) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await supabase
        .from('student_notices')
        .select('*')
        .eq('user_id', userId)
        .order('sent_at', { ascending: false })

      if (fetchError) throw fetchError

      studentNotices.value = data || []
      return data || []
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching notices:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Mark notice as read
  const markNoticeAsRead = async (noticeId: number) => {
    try {
      const { error: updateError } = await supabase
        .from('student_notices')
        .update({
          is_read: true,
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', noticeId)

      if (updateError) throw updateError

      return { success: true }
    } catch (err: any) {
      error.value = err.message
      console.error('Error marking notice as read:', err)
      throw err
    }
  }

  // Reactivate a deactivated student account
  const reactivateStudentAccount = async (userId: string, reason: string) => {
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          is_active: true,
          deactivated_at: null,
          account_deactivation_reason: null,
          is_overdue: false
        })
        .eq('id', userId)

      if (updateError) throw updateError

      return { success: true }
    } catch (err: any) {
      error.value = err.message
      console.error('Error reactivating account:', err)
      throw err
    }
  }

  // Get unread notices count
  const getUnreadNoticeCount = async (userId: string) => {
    try {
      const { count, error: fetchError } = await supabase
        .from('student_notices')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false)

      if (fetchError) throw fetchError

      return count || 0
    } catch (err: any) {
      error.value = err.message
      console.error('Error getting unread notice count:', err)
      return 0
    }
  }

  // Update module assignment status
  const updateAssignmentStatus = async (
    assignmentId: number,
    status: 'pending' | 'in_progress' | 'completed' | 'overdue'
  ) => {
    try {
      const { error: updateError } = await supabase
        .from('module_assignments')
        .update({
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', assignmentId)

      if (updateError) throw updateError

      return { success: true }
    } catch (err: any) {
      error.value = err.message
      console.error('Error updating assignment status:', err)
      throw err
    }
  }

  // Check if user has accepted course agreement
  const hasAcceptedCourseAgreement = async (userId: string): Promise<boolean> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('course_agreement_accepted')
        .eq('id', userId)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError

      return data?.course_agreement_accepted || false
    } catch (err: any) {
      console.error('Error checking course agreement status:', err)
      return false
    }
  }

  // Get when user accepted the course agreement (for phase-based notice display)
  const getCourseAgreementAcceptedAt = async (userId: string): Promise<string | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('course_agreement_accepted_at')
        .eq('id', userId)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError

      return data?.course_agreement_accepted_at || null
    } catch (err: any) {
      console.error('Error getting course agreement accepted at:', err)
      return null
    }
  }

  // Check if user has clicked the welcome "Click here!" (step before course agreement)
  const hasClickedWelcome = async (userId: string): Promise<boolean> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('welcome_clicked_at')
        .eq('id', userId)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError

      return !!data?.welcome_clicked_at
    } catch (err: any) {
      console.error('Error checking welcome clicked status:', err)
      return false
    }
  }

  // Mark that user clicked the welcome "Click here!" (so next step is course agreement)
  const markWelcomeClicked = async (userId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          welcome_clicked_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) throw updateError

      return { success: true }
    } catch (err: any) {
      error.value = err.message
      console.error('Error marking welcome as clicked:', err)
      throw err
    }
  }

  // Check if user has clicked the advanced welcome video
const hasClickedAdvancedWelcome = async (userId: string): Promise<boolean> => {
  try {
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('advanced_welcome_clicked_at')
      .eq('id', userId)
      .single()

    // If column doesn't exist (400) or row not found, treat as not clicked
    if (fetchError) {
      if (fetchError.code !== 'PGRST116') {
        console.warn('Could not fetch advanced_welcome_clicked_at:', fetchError.message)
      }
      return false  // ← was: throw fetchError
    }

    return !!data?.advanced_welcome_clicked_at
  } catch (err: any) {
    console.error('Error checking advanced welcome clicked status:', err)
    return false
  }
}

  // Mark that user clicked the advanced welcome video
  const markAdvancedWelcomeClicked = async (userId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          advanced_welcome_clicked_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) throw updateError

      return { success: true }
    } catch (err: any) {
      error.value = err.message
      console.error('Error marking advanced welcome as clicked:', err)
      throw err
    }
  }

  // Mark course agreement as accepted
  const markCourseAgreementAccepted = async (userId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          course_agreement_accepted: true,
          course_agreement_accepted_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) throw updateError

      return { success: true }
    } catch (err: any) {
      error.value = err.message
      console.error('Error marking course agreement as accepted:', err)
      throw err
    }
  }

  return {
    moduleAssignments,
    studentNotices,
    loading,
    error,
    assignModuleToStudent,
    getUserAssignments,
    getOverdueAssignments,
    checkAndSendFirstNotice,
    checkAndSendSecondNoticeAndDeactivate,
    getUserNotices,
    markNoticeAsRead,
    reactivateStudentAccount,
    getUnreadNoticeCount,
    updateAssignmentStatus,
    hasAcceptedCourseAgreement,
    getCourseAgreementAcceptedAt,
    markCourseAgreementAccepted,
    hasClickedWelcome,
    markWelcomeClicked,
    hasClickedAdvancedWelcome,
    markAdvancedWelcomeClicked
  }
}

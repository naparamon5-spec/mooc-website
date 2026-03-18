// server/api/notices/check-overdue.post.ts
// This endpoint checks for overdue modules and sends notices
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Supabase configuration missing'
      })
    }

    const sbAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Get all overdue assignments (deadline passed, not completed)
    const now = new Date().toISOString()

    const { data: overdueAssignments, error: fetchError } = await sbAdmin
      .from('module_assignments')
      .select('*')
      .lt('deadline', now)
      .in('status', ['pending', 'in_progress'])

    if (fetchError) throw fetchError

    let processedCount = 0
    let firstNoticeCount = 0
    let secondNoticeCount = 0

    for (const assignment of overdueAssignments || []) {
      const userId = assignment.user_id
      const assignmentId = assignment.id

      // Calculate days overdue
      const deadlineDate = new Date(assignment.deadline)
      const daysOverdue = Math.floor(
        (now as any - deadlineDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      // Get existing notices for this assignment
      const { data: notices } = await sbAdmin
        .from('student_notices')
        .select('notice_type')
        .eq('module_assignment_id', assignmentId)

      const firstNoticeSent = notices?.some((n: any) => n.notice_type === 'first_notice')
      const secondNoticeSent = notices?.some((n: any) => n.notice_type === 'second_notice')

      // Send first notice at 7 days overdue
      if (daysOverdue >= 7 && !firstNoticeSent && !secondNoticeSent) {
        const noticeMessage = `This is your first reminder: You have 7 days to complete your assigned module. Please finish it to avoid account restrictions.`

        const { error: noticeError } = await sbAdmin
          .from('student_notices')
          .insert({
            user_id: userId,
            module_assignment_id: assignmentId,
            notice_type: 'first_notice',
            notice_message: noticeMessage,
            sent_at: new Date().toISOString(),
            is_read: false
          })

        if (!noticeError) {
          await sbAdmin
            .from('profiles')
            .update({ first_notice_sent_at: new Date().toISOString() })
            .eq('id', userId)

          firstNoticeCount++
        }
      }

      // Send second notice and deactivate at 14 days overdue
      if (daysOverdue >= 14 && firstNoticeSent && !secondNoticeSent) {
        const noticeMessage = `This is your final notice: Your account will be deactivated if you do not complete your assigned module immediately.`

        const { error: noticeError } = await sbAdmin
          .from('student_notices')
          .insert({
            user_id: userId,
            module_assignment_id: assignmentId,
            notice_type: 'second_notice',
            notice_message: noticeMessage,
            sent_at: new Date().toISOString(),
            is_read: false
          })

        if (!noticeError) {
          // Track that the student is overdue and that the final notice was sent.
          // NOTE: We do NOT deactivate accounts automatically here; account activation/deactivation
          // is only managed from the Admin "User Management" page.
          await sbAdmin
            .from('profiles')
            .update({
              second_notice_sent_at: new Date().toISOString(),
              is_overdue: true
            })
            .eq('id', userId)

          // Update assignment status
          await sbAdmin
            .from('module_assignments')
            .update({ status: 'overdue' })
            .eq('id', assignmentId)

          secondNoticeCount++
        }
      }

      processedCount++
    }

    return {
      success: true,
      processedCount,
      firstNoticeCount,
      secondNoticeCount,
      message: `Processed ${processedCount} overdue assignments. Sent ${firstNoticeCount} first notices and ${secondNoticeCount} second notices.`
    }
  } catch (error: any) {
    console.error('Error checking overdue modules:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error checking overdue modules'
    })
  }
})



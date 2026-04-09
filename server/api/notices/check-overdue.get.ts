// server/api/notices/check-overdue.get.ts
// GET wrapper for Vercel Cron support — same logic as POST endpoint
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async () => {
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
    let thirdNoticeCount = 0
    let fourthNoticeCount = 0

    for (const assignment of overdueAssignments || []) {
      const userId = assignment.user_id
      const assignmentId = assignment.id

      const { data: completion } = await sbAdmin
        .from('module_completion')
        .select('id, completed_at')
        .eq('user_id', userId)
        .eq('module_id', assignment.module_id)
        .eq('course_level', assignment.course_level)
        .maybeSingle()

      if (completion) {
        await sbAdmin
          .from('module_assignments')
          .update({
            status: 'completed',
            completed_at: completion.completed_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', assignmentId)

        continue
      }

      await sbAdmin
        .from('module_assignments')
        .update({
          status: 'overdue',
          updated_at: new Date().toISOString()
        })
        .eq('id', assignmentId)

      const deadlineDate = new Date(assignment.deadline)
      const daysOverdue = Math.floor(
        (Date.now() - deadlineDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      const { data: notices } = await sbAdmin
        .from('student_notices')
        .select('notice_type')
        .eq('module_assignment_id', assignmentId)

      const firstNoticeSent = notices?.some((n: any) => n.notice_type === 'first_notice')
      const secondNoticeSent = notices?.some((n: any) => n.notice_type === 'second_notice')
      const thirdNoticeSent = notices?.some((n: any) => n.notice_type === 'third_notice')
      const fourthNoticeSent = notices?.some((n: any) => n.notice_type === 'fourth_notice')

      if (daysOverdue >= 7 && !firstNoticeSent) {
        const { error: noticeError } = await sbAdmin
          .from('student_notices')
          .insert({
            user_id: userId,
            module_assignment_id: assignmentId,
            notice_type: 'first_notice',
            notice_message: 'This is your first reminder: your assigned module is now 7 days overdue. Please complete it as soon as possible.',
            sent_at: new Date().toISOString(),
            is_read: false
          })

        if (!noticeError) {
          await sbAdmin
            .from('profiles')
            .update({
              first_notice_sent_at: new Date().toISOString(),
              is_overdue: true,
              last_notice_check: new Date().toISOString()
            })
            .eq('id', userId)

          firstNoticeCount++
        }
      }

      if (daysOverdue >= 14 && !secondNoticeSent) {
        const { error: noticeError } = await sbAdmin
          .from('student_notices')
          .insert({
            user_id: userId,
            module_assignment_id: assignmentId,
            notice_type: 'second_notice',
            notice_message: 'This is your second reminder: your assigned module is now 14 days overdue. Please complete it immediately to avoid further escalation.',
            sent_at: new Date().toISOString(),
            is_read: false
          })

        if (!noticeError) {
          await sbAdmin
            .from('profiles')
            .update({
              second_notice_sent_at: new Date().toISOString(),
              is_overdue: true,
              last_notice_check: new Date().toISOString()
            })
            .eq('id', userId)

          secondNoticeCount++
        }
      }

      if (daysOverdue >= 21 && !thirdNoticeSent) {
        const { error: noticeError } = await sbAdmin
          .from('student_notices')
          .insert({
            user_id: userId,
            module_assignment_id: assignmentId,
            notice_type: 'third_notice',
            notice_message: 'This is your third reminder: your assigned module is now 21 days overdue. Immediate completion is required.',
            sent_at: new Date().toISOString(),
            is_read: false
          })

        if (!noticeError) {
          await sbAdmin
            .from('profiles')
            .update({
              is_overdue: true,
              last_notice_check: new Date().toISOString()
            })
            .eq('id', userId)

          thirdNoticeCount++
        }
      }

      if (daysOverdue >= 28 && !fourthNoticeSent) {
        const { error: noticeError } = await sbAdmin
          .from('student_notices')
          .insert({
            user_id: userId,
            module_assignment_id: assignmentId,
            notice_type: 'fourth_notice',
            notice_message: 'This is your fourth reminder: your assigned module is now 28 days overdue. Please coordinate with the administrator immediately.',
            sent_at: new Date().toISOString(),
            is_read: false
          })

        if (!noticeError) {
          await sbAdmin
            .from('profiles')
            .update({
              is_overdue: true,
              last_notice_check: new Date().toISOString()
            })
            .eq('id', userId)

          fourthNoticeCount++
        }
      }

      if (daysOverdue < 7) {
        await sbAdmin
          .from('profiles')
          .update({
            is_overdue: true,
            last_notice_check: new Date().toISOString()
          })
          .eq('id', userId)
      }

      processedCount++
    }

    return {
      success: true,
      processedCount,
      firstNoticeCount,
      secondNoticeCount,
      thirdNoticeCount,
      fourthNoticeCount,
      message: `Processed ${processedCount} overdue assignments. Sent ${firstNoticeCount} first notices, ${secondNoticeCount} second notices, ${thirdNoticeCount} third notices, and ${fourthNoticeCount} fourth notices.`
    }
  } catch (error: any) {
    console.error('Error checking overdue modules:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error checking overdue modules'
    })
  }
})

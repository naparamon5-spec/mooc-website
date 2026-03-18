// server/api/notices/bulk-reactivate.post.ts
// This endpoint reactivates multiple student accounts
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { userIds } = body

    if (!Array.isArray(userIds) || userIds.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'userIds must be a non-empty array'
      })
    }

    const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Supabase configuration missing'
      })
    }

    const sbAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Reactivate selected accounts
    const { error: updateError } = await sbAdmin
      .from('profiles')
      .update({
        is_active: true,
        deactivated_at: null,
        account_deactivation_reason: null,
        is_overdue: false
      })
      .in('id', userIds)

    if (updateError) throw updateError

    return {
      success: true,
      reactivatedCount: userIds.length,
      message: `Successfully reactivated ${userIds.length} student account(s).`
    }
  } catch (error: any) {
    console.error('Error reactivating accounts:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error reactivating accounts'
    })
  }
})

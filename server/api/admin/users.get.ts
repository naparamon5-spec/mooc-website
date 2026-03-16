/**
 * Get all instructors and admins.
 * Uses service role so it works regardless of RLS. Caller must be an admin (Bearer token).
 */
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const supabaseUrl = (config.public.supabaseUrl as string) || ''
    const supabaseAnonKey = (config.public.supabaseAnonKey as string) || ''
    const supabaseServiceKey = (config.supabaseServiceRoleKey as string) || process.env.SUPABASE_SERVICE_ROLE_KEY || ''

    if (!supabaseUrl?.trim()) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Missing Supabase URL. Set NUXT_PUBLIC_SUPABASE_URL in .env'
      })
    }
    if (!supabaseServiceKey?.trim()) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Missing Supabase service role key. Add SUPABASE_SERVICE_ROLE_KEY to your .env (get it in Supabase Dashboard → Settings → API → service_role)'
      })
    }

    // Get token from Authorization header
    const token = getHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '')
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const authClient = createClient(supabaseUrl, supabaseAnonKey)
    const { data: { user }, error: userError } = await authClient.auth.getUser(token)
    if (userError || !user?.id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired session'
      })
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Fetch instructors and admins
    const { data, error: fetchError } = await adminClient
      .from('profiles')
      .select('id, email, full_name, role, is_active, phone, created_at, updated_at')
      .in('role', ['instructor', 'admin'])
      .order('created_at', { ascending: false })

    if (fetchError) {
      throw createError({
        statusCode: 500,
        statusMessage: fetchError.message || 'Failed to fetch users'
      })
    }

    return {
      success: true,
      users: data || []
    }
  } catch (e: any) {
    if (e.statusCode) throw e
    throw createError({
      statusCode: 500,
      statusMessage: e?.message || 'An unexpected error occurred'
    })
  }
})
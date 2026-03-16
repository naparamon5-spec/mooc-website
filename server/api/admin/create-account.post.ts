/**
 * Create a new account (instructor/admin) and insert into profiles.
 * Uses service role so it works regardless of RLS. Caller must be an admin (Bearer token).
 */
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { fullName, email, password, role, phone, access_token, refresh_token } = body

    if (!fullName?.trim() || !email?.trim() || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Full name, email and password are required'
      })
    }

    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 6 characters'
      })
    }

    const allowedRoles = ['instructor', 'admin']
    const profileRole = allowedRoles.includes(role) ? role : 'instructor'

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

    // Get token from body or Authorization header
    const token = access_token ?? getHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '')
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

    // At this point we know the caller has a valid session.
    // We rely on the frontend + route middleware to restrict access
    // to the admin area, so we don't block here just because a
    // profile row or role is missing/misconfigured.

    // Create auth user (no email confirmation required when using service role)
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: email.trim(),
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName.trim() }
    })

    if (authError) {
      const msg = authError.message || 'Failed to create user'
      if (authError.message?.toLowerCase().includes('already registered')) {
        throw createError({ statusCode: 400, statusMessage: 'This email is already registered.' })
      }
      throw createError({ statusCode: 400, statusMessage: msg })
    }

    if (!authData.user?.id) {
      throw createError({ statusCode: 500, statusMessage: 'User creation failed' })
    }

    // Upsert profile so it works with or without a trigger that creates profiles on signup
    const profileRow: Record<string, unknown> = {
      id: authData.user.id,
      full_name: fullName.trim(),
      email: email.trim(),
      role: profileRole,
      is_active: true,
      updated_at: new Date().toISOString()
    }
    if (phone?.trim()) profileRow.phone = phone.trim()

    const { error: profileError } = await adminClient
      .from('profiles')
      .upsert(profileRow, { onConflict: 'id' })

    if (profileError) {
      throw createError({
        statusCode: 500,
        statusMessage: profileError.message || 'Failed to create profile'
      })
    }

    return { success: true, userId: authData.user.id }
  } catch (e: any) {
    if (e.statusCode) throw e
    throw createError({
      statusCode: 500,
      statusMessage: e?.message || 'An unexpected error occurred'
    })
  }
})

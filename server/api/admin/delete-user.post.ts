import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userId } = body

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'userId is required' })
  }

  const supabaseUrl = process.env.SUPABASE_URL
    || process.env.NUXT_PUBLIC_SUPABASE_URL
    || useRuntimeConfig().public.supabaseUrl

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    || process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY
    || useRuntimeConfig().supabaseServiceRoleKey

  if (!supabaseUrl || !serviceRoleKey) {
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'Missing Supabase URL or Service Role Key in environment variables' 
    })
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Delete auth user first (this cascades and removes profile if you have ON DELETE CASCADE)
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

  if (authError) {
    throw createError({ statusCode: 500, statusMessage: `Auth delete failed: ${authError.message}` })
  }

  // Then delete profile row (in case no cascade is set)
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .delete()
    .eq('id', userId)

  if (profileError) {
    // Log but don't throw — auth user is already deleted
    console.warn('Profile delete warning:', profileError.message)
  }

  return { success: true }
})
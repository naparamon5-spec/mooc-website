import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const body = ['DELETE', 'POST'].includes(getMethod(event)) ? await readBody(event).catch(() => ({})) : {}
  const userId = (body as any)?.userId || query.userId

  if (!userId || typeof userId !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'userId is required' })
  }

  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.NUXT_PUBLIC_SUPABASE_URL ||
    useRuntimeConfig().public.supabaseUrl

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY ||
    useRuntimeConfig().supabaseServiceRoleKey

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

  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .delete()
    .eq('id', userId)

  if (profileError) {
    console.warn('Profile delete warning:', profileError.message)
  }

  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

  if (authError) {
    throw createError({
      statusCode: 500,
      statusMessage: `Auth delete failed: ${authError.message}`
    })
  }

  return { success: true }
})

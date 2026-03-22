import { defineEventHandler, readBody, createError } from 'h3'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  // 1. Verify the requesting user is authenticated
  const authHeader = event.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const token = authHeader.replace('Bearer ', '')
  const config = useRuntimeConfig()

  const supabaseUrl = config.public.supabaseUrl
  const supabaseServiceKey = config.supabaseServiceRoleKey  // matches your nuxt.config.ts exactly

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase config:', { supabaseUrl: !!supabaseUrl, supabaseServiceKey: !!supabaseServiceKey })
    throw createError({ statusCode: 500, statusMessage: 'Server configuration error' })
  }

  // 2. Use service role client — bypasses RLS so update always saves
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // 3. Verify the caller is a real authenticated user
  const { data: { user: caller }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !caller) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid session' })
  }

  // 4. Verify the caller is an admin
  const { data: callerProfile, error: callerError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', caller.id)
    .single()

  if (callerError || callerProfile?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: Admins only' })
  }

  // 5. Read request body
  const body = await readBody(event)
  const { userId, isActive } = body

  if (!userId || typeof isActive !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: 'userId and isActive are required' })
  }

  // 6. Update is_active in profiles table
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      is_active: isActive,
      deactivated_at: isActive ? null : new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (updateError) {
    console.error('Failed to update user status:', updateError)
    throw createError({ statusCode: 500, statusMessage: 'Failed to update account status' })
  }

  // 7. If deactivating, revoke all active sessions for that user
  if (!isActive) {
    const { error: signOutError } = await supabase.auth.admin.signOut(userId)
    if (signOutError) {
      console.warn('Could not revoke user sessions:', signOutError.message)
    }
  }

  return { success: true, isActive }
})
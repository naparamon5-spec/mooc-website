// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client-side to avoid hydration issues
  if (process.server) {
    return
  }

  const nuxtApp = useNuxtApp()
  const { $supabase } = nuxtApp

  // Guard against undefined supabase client
  if (!$supabase || !$supabase.auth) {
    return
  }

  try {
    // Get current session - this will restore from storage if available
    const { data: { session }, error: sessionError } = await $supabase.auth.getSession()

    // If no session found, redirect to login
    if (!session || sessionError) {
      console.error('No session found or error:', sessionError)
      return navigateTo('/login')
    }

    // Try to refresh the access token if expired
    try {
      const { data, error } = await $supabase.auth.refreshSession()
      if (error) {
        console.error('Token refresh failed:', error)
        return navigateTo('/login')
      }
    } catch (e) {
      console.error('Token refresh error:', e)
      // Don't redirect immediately, let them continue
    }
    
    // Check user role and validate access permissions
    try {
      const userId = session.user?.id
      if (userId) {
        const { data: profile, error } = await $supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single()

        if (!error && profile?.role) {
          const role = String(profile.role).toLowerCase()
          const isAdmin = role === 'administrator' || role === 'admin' || role === 'instructor'

          // Redirect admins accessing student area to admin
          if (isAdmin && to.path.startsWith('/dashboard')) {
            return navigateTo('/admin')
          }

          // Redirect non-admins trying to access admin area to 404
          if (!isAdmin && to.path.startsWith('/admin')) {
            return navigateTo('/404')
          }
        }
      }
    } catch (e) {
      // Silently ignore profile check errors - let user continue
      console.debug('Profile check error (non-blocking):', e)
    }
  } catch (e) {
    console.error('Auth middleware error:', e)
    return navigateTo('/login')
  }
})

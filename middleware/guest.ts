// middleware/guest.ts
export default defineNuxtRouteMiddleware(async () => {
  // Only run on client-side
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
    // Get current session
    const { data: { session } } = await $supabase.auth.getSession()

    // If there's an active session, redirect away from guest-only pages
    if (session) {
      return navigateTo('/dashboard')
    }
  } catch (e) {
    // Handle any auth errors gracefully
    console.debug('Guest middleware error:', e)
    return
  }
})

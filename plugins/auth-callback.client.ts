/**
 * When Supabase email confirmation redirects with hash params (#access_token=...&type=signup),
 * redirect the user to /auth/confirm so the confirm page can complete the flow.
 * Supabase often redirects to the site root; this ensures we land on the confirm page.
 */
export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  const hash = window.location.hash
  const pathname = window.location.pathname

  const hasAuthParams =
    hash.includes('access_token=') ||
    hash.includes('refresh_token=')

  const isConfirmPage = pathname === '/auth/confirm' || pathname.endsWith('/auth/confirm')

  if (hasAuthParams && !isConfirmPage) {
    window.location.replace('/auth/confirm' + hash)
  }
})

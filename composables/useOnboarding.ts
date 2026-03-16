import { ref, computed } from 'vue'

export const useOnboarding = () => {
  const hasSeenOnboarding = ref(false)
  const completedModuleIntros = ref<Record<string | number, boolean>>({})

  // Initialize from localStorage
  const initializeOnboarding = () => {
    if (import.meta.server) return

    const saved = localStorage.getItem('hasSeenOnboarding')
    const savedModules = localStorage.getItem('completedModuleIntros')

    hasSeenOnboarding.value = saved === 'true'
    if (savedModules) {
      try {
        completedModuleIntros.value = JSON.parse(savedModules)
      } catch (e) {
        console.error('Failed to parse module intros:', e)
      }
    }
  }

  // Mark onboarding as seen
  const markOnboardingAsSeen = async () => {
    hasSeenOnboarding.value = true
    localStorage.setItem('hasSeenOnboarding', 'true')

    // Also save to database if user is authenticated
    try {
      const nuxtApp = useNuxtApp()
      const supabase = nuxtApp.$supabase

      if (supabase?.auth) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user?.id) {
          await supabase.from('profiles').update({
            has_seen_onboarding: true,
            updated_at: new Date().toISOString()
          }).eq('id', session.user.id)
        }
      }
    } catch (err) {
      console.warn('Could not save onboarding status to database:', err)
    }
  }

  // Check if user has seen intro for specific module
  const hasSeenModuleIntro = (moduleId: string | number): boolean => {
    return completedModuleIntros.value[moduleId] === true
  }

  // Mark module intro as seen
  const markModuleIntroAsSeen = (moduleId: string | number) => {
    completedModuleIntros.value[moduleId] = true
    localStorage.setItem('completedModuleIntros', JSON.stringify(completedModuleIntros.value))
  }

  // Skip all tutorials (don't show again)
  const skipAllTutorials = async () => {
    await markOnboardingAsSeen()
  }

  return {
    hasSeenOnboarding,
    completedModuleIntros,
    initializeOnboarding,
    markOnboardingAsSeen,
    hasSeenModuleIntro,
    markModuleIntroAsSeen,
    skipAllTutorials
  }
}

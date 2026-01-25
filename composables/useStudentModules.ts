import { ref, computed } from 'vue'

/**
 * Composable for fetching and managing course modules from Supabase
 * Used by student-facing pages to display available modules
 */
export const useStudentModules = () => {
  const { $supabase } = useNuxtApp()
  const supabase = $supabase
  const modules = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch all active modules for a specific level
   * @param level - 'beginner' or 'advanced'
   */
  const fetchModulesByLevel = async (level: string = 'beginner') => {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('modules')
        .select('*')
        .eq('level', level)
        .eq('is_active', true)
        .order('id', { ascending: true })

      if (fetchError) throw fetchError

      modules.value = data || []
      return data
    } catch (err: any) {
      error.value = err.message
      console.error(`Error fetching ${level} modules:`, err)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch a single module by ID
   */
  const fetchModuleById = async (moduleId: number) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('modules')
        .select('*')
        .eq('id', moduleId)
        .single()

      if (fetchError) throw fetchError

      return data
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching module:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Get all active modules across both levels
   */
  const fetchAllActiveModules = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('modules')
        .select('*')
        .eq('is_active', true)
        .order('level', { ascending: true })
        .order('id', { ascending: true })

      if (fetchError) throw fetchError

      modules.value = data || []
      return data
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching all modules:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // Computed properties
  const beginnerModules = computed(() => {
    return modules.value.filter(m => m.level === 'beginner')
  })

  const advancedModules = computed(() => {
    return modules.value.filter(m => m.level === 'advanced')
  })

  const activeModules = computed(() => {
    return modules.value.filter(m => m.is_active)
  })

  return {
    modules,
    loading,
    error,
    fetchModulesByLevel,
    fetchModuleById,
    fetchAllActiveModules,
    beginnerModules,
    advancedModules,
    activeModules,
  }
}

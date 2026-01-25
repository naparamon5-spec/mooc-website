import { ref, computed } from 'vue'

export const useModuleManagement = () => {
  const { $supabase } = useNuxtApp()
  const supabase = $supabase
  const modules = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Normalize module data from Supabase
  const normalizeModule = (module: any) => {
    return {
      ...module,
      lessons: typeof module.lessons === 'string' ? JSON.parse(module.lessons) : (module.lessons || []),
      learning_outcomes: typeof module.learning_outcomes === 'string' ? JSON.parse(module.learning_outcomes) : (module.learning_outcomes || [])
    }
  }

  // Upload image to Supabase Storage
  const uploadModuleImage = async (file: File, moduleId?: string) => {
    try {
      const fileName = `module-${moduleId || Date.now()}-${file.name}`
      const filePath = `module-images/${fileName}`

      const { data, error: uploadError } = await supabase.storage
        .from('module-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get the public URL
      const { data: publicData } = supabase.storage
        .from('module-images')
        .getPublicUrl(filePath)

      return publicData?.publicUrl || null
    } catch (err: any) {
      console.error('Error uploading image:', err)
      throw err
    }
  }

  // Fetch all modules from Supabase
  const fetchModules = async (level?: string) => {
    loading.value = true
    error.value = null
    try {
      let query = supabase.from('modules').select('*')
      
      if (level) {
        query = query.eq('level', level)
      }
      
      const { data, error: fetchError } = await query.order('created_at', { ascending: true })

      if (fetchError) throw fetchError

      modules.value = (data || []).map(normalizeModule)
      return modules.value
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching modules:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // Fetch a single module by ID
  const fetchModuleById = async (moduleId: string) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('modules')
        .select('*')
        .eq('id', moduleId)
        .single()

      if (fetchError) throw fetchError

      return normalizeModule(data)
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching module:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Create a new module
  const createModule = async (moduleData: any) => {
    loading.value = true
    error.value = null
    try {
      const { data: userData } = await supabase.auth.getUser()
      
      let imageUrl = moduleData.image_url
      
      // Upload image if provided
      if (moduleData.imageFile) {
        try {
          imageUrl = await uploadModuleImage(moduleData.imageFile)
        } catch (uploadErr: any) {
          error.value = `Image upload failed: ${uploadErr.message}`
          console.error('Image upload error:', uploadErr)
          // Continue with module creation without image
          imageUrl = null
        }
      }
      
      // Prepare data for Supabase
      const dataToSave = {
        title: moduleData.title,
        subtitle: moduleData.subtitle,
        description: moduleData.description,
        level: moduleData.level,
        emoji: moduleData.emoji,
        image_url: imageUrl,
        lessons: moduleData.lessons ? JSON.stringify(moduleData.lessons) : '[]',
        learning_outcomes: moduleData.learning_outcomes ? JSON.stringify(moduleData.learning_outcomes) : '[]',
        created_by: userData?.user?.id
      }

      const { data, error: createError } = await supabase
        .from('modules')
        .insert([dataToSave])
        .select()

      if (createError) throw createError

      if (data && data[0]) {
        const module = normalizeModule(data[0])
        modules.value.push(module)
        return module
      }
      return null
    } catch (err: any) {
      error.value = err.message
      console.error('Error creating module:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Update an existing module
  const updateModule = async (moduleId: string, moduleData: any) => {
    loading.value = true
    error.value = null
    try {
      let imageUrl = moduleData.image_url
      
      // Upload image if provided
      if (moduleData.imageFile) {
        try {
          imageUrl = await uploadModuleImage(moduleData.imageFile, moduleId)
        } catch (uploadErr: any) {
          error.value = `Image upload failed: ${uploadErr.message}`
          console.error('Image upload error:', uploadErr)
          // Continue with module update without new image
        }
      }
      
      // Prepare data for Supabase
      const dataToSave = {
        title: moduleData.title,
        subtitle: moduleData.subtitle,
        description: moduleData.description,
        level: moduleData.level,
        emoji: moduleData.emoji,
        image_url: imageUrl || moduleData.image_url,
        lessons: moduleData.lessons ? JSON.stringify(moduleData.lessons) : '[]',
        learning_outcomes: moduleData.learning_outcomes ? JSON.stringify(moduleData.learning_outcomes) : '[]',
        updated_at: new Date().toISOString()
      }

      const { data, error: updateError } = await supabase
        .from('modules')
        .update(dataToSave)
        .eq('id', moduleId)
        .select()

      if (updateError) throw updateError

      if (data && data[0]) {
        const module = normalizeModule(data[0])
        const index = modules.value.findIndex(m => m.id === moduleId)
        if (index !== -1) {
          modules.value[index] = module
        }
        return module
      }
      return null
    } catch (err: any) {
      error.value = err.message
      console.error('Error updating module:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Delete a module
  const deleteModule = async (moduleId: string) => {
    loading.value = true
    error.value = null
    try {
      const { error: deleteError } = await supabase
        .from('modules')
        .delete()
        .eq('id', moduleId)

      if (deleteError) throw deleteError

      modules.value = modules.value.filter(m => m.id !== moduleId)
      return true
    } catch (err: any) {
      error.value = err.message
      console.error('Error deleting module:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // Get module by ID from local state
  const getModuleById = (moduleId: string) => {
    return modules.value.find(m => m.id === moduleId)
  }

  // Get modules by level (beginner or advanced)
  const getModulesByLevel = (level: string) => {
    return modules.value.filter(m => m.level === level)
  }

  // Computed properties
  const beginnerModules = computed(() => {
    return modules.value.filter(m => m.level === 'beginner')
  })

  const advancedModules = computed(() => {
    return modules.value.filter(m => m.level === 'advanced')
  })

  const totalModules = computed(() => {
    return modules.value.length
  })

  return {
    modules,
    loading,
    error,
    fetchModules,
    fetchModuleById,
    createModule,
    updateModule,
    deleteModule,
    getModuleById,
    getModulesByLevel,
    beginnerModules,
    advancedModules,
    totalModules,
  }
}

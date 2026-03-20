import { ref, computed } from 'vue'

export const useModuleManagement = () => {
  const { $supabase } = useNuxtApp()
  const supabase = $supabase
  const modules = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Helper: consistently sort modules by the numeric part in their title
  // e.g. "Module 1", "Module 2" so that Module 1 always appears first
  const sortByModuleNumber = (a: any, b: any) => {
    const aNum = parseInt(a.title?.match(/\d+/)?.[0] || '0', 10)
    const bNum = parseInt(b.title?.match(/\d+/)?.[0] || '0', 10)
    return aNum - bNum
  }

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

  // Upload card image to Supabase Storage
  const uploadCardImage = async (file: File, moduleId?: string) => {
    try {
      const fileName = `card-${moduleId || Date.now()}-${file.name}`
      const filePath = `module-card-images/${fileName}`

      const { data, error: uploadError } = await supabase.storage
        .from('module-card-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get the public URL
      const { data: publicData } = supabase.storage
        .from('module-card-images')
        .getPublicUrl(filePath)

      return publicData?.publicUrl || null
    } catch (err: any) {
      console.error('Error uploading card image:', err)
      throw err
    }
  }

  // Upload video to Supabase Storage
  const uploadModuleVideo = async (file: File, moduleId?: string) => {
    try {
      const fileName = `video-${moduleId || Date.now()}-${file.name}`
      const filePath = `module-videos/${fileName}`

      const { data, error: uploadError } = await supabase.storage
        .from('module-videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get the public URL
      const { data: publicData } = supabase.storage
        .from('module-videos')
        .getPublicUrl(filePath)

      return publicData?.publicUrl || null
    } catch (err: any) {
      console.error('Error uploading video:', err)
      throw err
    }
  }

  // Upload PPT to Supabase Storage
  const uploadModulePpt = async (file: File, moduleId?: string) => {
    try {
      const fileName = `ppt-${moduleId || Date.now()}-${file.name}`
      const filePath = `module-ppts/${fileName}`

      const { data, error: uploadError } = await supabase.storage
        .from('module-ppts')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      const { data: publicData } = supabase.storage
        .from('module-ppts')
        .getPublicUrl(filePath)

      return publicData?.publicUrl || null
    } catch (err: any) {
      console.error('Error uploading PPT:', err)
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

      modules.value = (data || []).map(normalizeModule).sort(sortByModuleNumber)
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
      let cardImageUrl = moduleData.card_image_url
      let videoUrl = moduleData.video_url
      let pptUrl = moduleData.ppt_url
      
      // Upload image if provided
      if (moduleData.imageFile) {
        try {
          imageUrl = await uploadModuleImage(moduleData.imageFile)
        } catch (uploadErr: any) {
          error.value = `Image upload failed: ${uploadErr.message}`
          console.error('Image upload error:', uploadErr)
          imageUrl = null
        }
      }

      // Upload card image if provided
      if (moduleData.cardImageFile) {
        try {
          cardImageUrl = await uploadCardImage(moduleData.cardImageFile)
        } catch (uploadErr: any) {
          error.value = `Card image upload failed: ${uploadErr.message}`
          console.error('Card image upload error:', uploadErr)
          cardImageUrl = null
        }
      }

      // Upload video if provided
      if (moduleData.videoFile) {
        try {
          videoUrl = await uploadModuleVideo(moduleData.videoFile)
        } catch (uploadErr: any) {
          error.value = `Video upload failed: ${uploadErr.message}`
          console.error('Video upload error:', uploadErr)
          videoUrl = null
        }
      }

      // Upload PPT if provided
      if (moduleData.pptFile) {
        try {
          pptUrl = await uploadModulePpt(moduleData.pptFile)
        } catch (uploadErr: any) {
          error.value = `PPT upload failed: ${uploadErr.message}`
          console.error('PPT upload error:', uploadErr)
          pptUrl = null
        }
      }
      
      // Prepare data for Supabase
      const dataToSave = {
        title: moduleData.title,
        subtitle: moduleData.subtitle,
        introduction: moduleData.introduction,
        description: moduleData.description,
        learning_outcomes_label: moduleData.learning_outcomes_label || "DepEd's Most Essential Learning Competencies",
        level: moduleData.level,
        emoji: moduleData.emoji,
        image_url: imageUrl,
        card_image_url: cardImageUrl,
        video_url: videoUrl,
        ppt_url: pptUrl,
        lessons: moduleData.lessons ? JSON.stringify(moduleData.lessons) : '[]',
        learning_outcomes: moduleData.learning_outcomes ? JSON.stringify(moduleData.learning_outcomes) : '[]',
        is_active: moduleData.is_active !== false, // Default to true if not specified
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
      let cardImageUrl = moduleData.card_image_url
      let videoUrl = moduleData.video_url
      let pptUrl = moduleData.ppt_url
      
      // Upload image if provided
      if (moduleData.imageFile) {
        try {
          imageUrl = await uploadModuleImage(moduleData.imageFile, moduleId)
        } catch (uploadErr: any) {
          error.value = `Image upload failed: ${uploadErr.message}`
          console.error('Image upload error:', uploadErr)
        }
      }

      // Upload card image if provided
      if (moduleData.cardImageFile) {
        try {
          cardImageUrl = await uploadCardImage(moduleData.cardImageFile, moduleId)
        } catch (uploadErr: any) {
          error.value = `Card image upload failed: ${uploadErr.message}`
          console.error('Card image upload error:', uploadErr)
        }
      }

      // Upload video if provided
      if (moduleData.videoFile) {
        try {
          videoUrl = await uploadModuleVideo(moduleData.videoFile, moduleId)
        } catch (uploadErr: any) {
          error.value = `Video upload failed: ${uploadErr.message}`
          console.error('Video upload error:', uploadErr)
        }
      }

      // Upload PPT if provided
      if (moduleData.pptFile) {
        try {
          pptUrl = await uploadModulePpt(moduleData.pptFile, moduleId)
        } catch (uploadErr: any) {
          error.value = `PPT upload failed: ${uploadErr.message}`
          console.error('PPT upload error:', uploadErr)
        }
      }
      
      // Prepare data for Supabase
      const dataToSave = {
        title: moduleData.title,
        subtitle: moduleData.subtitle,
        introduction: moduleData.introduction,
        description: moduleData.description,
        learning_outcomes_label: moduleData.learning_outcomes_label || "DepEd's Most Essential Learning Competencies",
        level: moduleData.level,
        emoji: moduleData.emoji,
        image_url: imageUrl || moduleData.image_url,
        card_image_url: cardImageUrl || moduleData.card_image_url,
        video_url: videoUrl || moduleData.video_url,
        ppt_url: pptUrl || moduleData.ppt_url,
        lessons: moduleData.lessons ? JSON.stringify(moduleData.lessons) : '[]',
        learning_outcomes: moduleData.learning_outcomes ? JSON.stringify(moduleData.learning_outcomes) : '[]',
        is_active: moduleData.is_active !== false, // Default to true if not specified
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
    return modules.value
      .filter(m => m.level === 'beginner')
      .slice()
      .sort(sortByModuleNumber)
  })

  const advancedModules = computed(() => {
    return modules.value
      .filter(m => m.level === 'advanced')
      .slice()
      .sort(sortByModuleNumber)
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

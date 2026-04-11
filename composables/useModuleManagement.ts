import { ref, computed } from 'vue'

export const useModuleManagement = () => {
  const { $supabase } = useNuxtApp()
  const supabase = $supabase
  const modules = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const sortByModuleNumber = (a: any, b: any) => {
    const aNum = parseInt(a.title?.match(/\d+/)?.[0] || '0', 10)
    const bNum = parseInt(b.title?.match(/\d+/)?.[0] || '0', 10)
    return aNum - bNum
  }

  const normalizeModule = (module: any) => {
    return {
      ...module,
      lessons: typeof module.lessons === 'string' ? JSON.parse(module.lessons) : (module.lessons || []),
      learning_outcomes: typeof module.learning_outcomes === 'string' ? JSON.parse(module.learning_outcomes) : (module.learning_outcomes || [])
    }
  }

  const isDataUrl = (value: unknown) =>
    typeof value === 'string' && value.trim().startsWith('data:')

  const sanitizeLessonsForStorage = (lessons: any[] | undefined) => {
    if (!Array.isArray(lessons)) return []

    const hasEmbeddedMedia = lessons.some((lesson) =>
      Array.isArray(lesson?.blocks) &&
      lesson.blocks.some((block: any) =>
        (block?.type === 'image' || block?.type === 'video') && isDataUrl(block?.src)
      )
    )

    if (hasEmbeddedMedia) {
      throw new Error(
        'Lesson block image/video uploads are still stored as local previews. Please remove newly added lesson media blocks or upload them through storage-backed URLs before saving.'
      )
    }

    return lessons.map((lesson) => ({
      ...lesson,
      blocks: Array.isArray(lesson?.blocks)
        ? lesson.blocks.map((block: any) => {
            if (block?.type === 'text') {
              return {
                type: 'text',
                text: typeof block.text === 'string' ? block.text : '',
                layout: block.layout || 'full-width',
              }
            }

            if (block?.type === 'image') {
              return {
                type: 'image',
                src: typeof block.src === 'string' ? block.src : '',
                layout: block.layout || 'full-width',
                align: block.align || 'center',
                width: block.width || undefined,
                height: block.height || undefined,
              }
            }

            if (block?.type === 'video') {
              return {
                type: 'video',
                src: typeof block.src === 'string' ? block.src : '',
                layout: block.layout || 'full-width',
                width: block.width || undefined,
                height: block.height || undefined,
              }
            }

            return block
          })
        : [],
    }))
  }

  const deleteFileFromUrl = async (publicUrl: string | null, bucketName: string) => {
    if (!publicUrl) return
    try {
      const urlParts = publicUrl.split('/object/public/')
      if (urlParts.length !== 2) return
      const filePath = urlParts[1]
      if (!filePath) return
      await supabase.storage.from(bucketName).remove([filePath])
    } catch (err: any) {
      console.warn(`Could not delete old file: ${err.message}`)
    }
  }

  const uploadModuleImage = async (file: File, moduleId?: string) => {
    try {
      const fileName = `module-${moduleId || Date.now()}-${file.name}`
      const { data, error: uploadError } = await supabase.storage
        .from('module-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })
      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)
      if (!data?.path) throw new Error('File upload completed but no path returned')
      const { data: publicData } = supabase.storage.from('module-images').getPublicUrl(fileName)
      if (!publicData?.publicUrl) throw new Error('Could not generate public URL for uploaded file')
      return publicData.publicUrl
    } catch (err: any) {
      throw new Error(err.message || 'Unknown error uploading image')
    }
  }

  const uploadCardImage = async (file: File, moduleId?: string) => {
    try {
      const fileName = `card-${moduleId || Date.now()}-${file.name}`
      const { data, error: uploadError } = await supabase.storage
        .from('module-card-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })
      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)
      if (!data?.path) throw new Error('File upload completed but no path returned')
      const { data: publicData } = supabase.storage.from('module-card-images').getPublicUrl(fileName)
      if (!publicData?.publicUrl) throw new Error('Could not generate public URL for uploaded file')
      return publicData.publicUrl
    } catch (err: any) {
      throw new Error(err.message || 'Unknown error uploading card image')
    }
  }

  // Upload description panel image to Supabase Storage
  const uploadDescPanelImage = async (file: File, moduleId?: string) => {
    try {
      const fileName = `desc-panel-${moduleId || Date.now()}-${file.name}`
      const { data, error: uploadError } = await supabase.storage
        .from('module-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })
      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)
      if (!data?.path) throw new Error('File upload completed but no path returned')
      const { data: publicData } = supabase.storage.from('module-images').getPublicUrl(fileName)
      if (!publicData?.publicUrl) throw new Error('Could not generate public URL for uploaded file')
      return publicData.publicUrl
    } catch (err: any) {
      throw new Error(err.message || 'Unknown error uploading description panel image')
    }
  }

  const uploadModuleVideo = async (file: File, moduleId?: string) => {
    try {
      const fileName = `video-${moduleId || Date.now()}-${file.name}`
      const { data, error: uploadError } = await supabase.storage
        .from('module-videos')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })
      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)
      if (!data?.path) throw new Error('File upload completed but no path returned')
      const { data: publicData } = supabase.storage.from('module-videos').getPublicUrl(fileName)
      if (!publicData?.publicUrl) throw new Error('Could not generate public URL for uploaded file')
      return publicData.publicUrl
    } catch (err: any) {
      throw new Error(err.message || 'Unknown error uploading video')
    }
  }

  const uploadModulePpt = async (file: File, moduleId?: string) => {
    try {
      const fileName = `ppt-${moduleId || Date.now()}-${file.name}`
      const { data, error: uploadError } = await supabase.storage
        .from('module-ppts')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })
      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)
      if (!data?.path) throw new Error('File upload completed but no path returned')
      const { data: publicData } = supabase.storage.from('module-ppts').getPublicUrl(fileName)
      if (!publicData?.publicUrl) throw new Error('Could not generate public URL for uploaded file')
      return publicData.publicUrl
    } catch (err: any) {
      throw new Error(err.message || 'Unknown error uploading PPT')
    }
  }

  const fetchModules = async (level?: string) => {
    loading.value = true
    error.value = null
    try {
      let query = supabase.from('modules').select(`
        id,
        title,
        subtitle,
        level,
        emoji,
        image_url,
        card_image_url,
        description_panel_image_url,
        is_active,
        created_at,
        updated_at
      `)
      if (level) query = query.eq('level', level)
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

  const createModule = async (moduleData: any) => {
    loading.value = true
    error.value = null
    try {
      const { data: userData } = await supabase.auth.getUser()

      let imageUrl = moduleData.image_url
      let cardImageUrl = moduleData.card_image_url
      let descPanelImageUrl = moduleData.description_panel_image_url
      let videoUrl = moduleData.video_url
      let pptUrl = moduleData.ppt_url

      if (moduleData.imageFile) {
        try {
          imageUrl = await uploadModuleImage(moduleData.imageFile)
        } catch (uploadErr: any) {
          const msg = `Failed to upload module image: ${uploadErr.message || 'Unknown error'}`
          error.value = msg; throw new Error(msg)
        }
      }

      if (moduleData.cardImageFile) {
        try {
          cardImageUrl = await uploadCardImage(moduleData.cardImageFile)
        } catch (uploadErr: any) {
          const msg = `Failed to upload card image: ${uploadErr.message || 'Unknown error'}`
          error.value = msg; throw new Error(msg)
        }
      }

      // Upload description panel image if provided
      if (moduleData.descPanelImageFile) {
        try {
          descPanelImageUrl = await uploadDescPanelImage(moduleData.descPanelImageFile)
        } catch (uploadErr: any) {
          const msg = `Failed to upload description panel image: ${uploadErr.message || 'Unknown error'}`
          error.value = msg; throw new Error(msg)
        }
      }

      if (moduleData.videoFile) {
        try {
          videoUrl = await uploadModuleVideo(moduleData.videoFile)
        } catch (uploadErr: any) {
          const msg = `Failed to upload video: ${uploadErr.message || 'Unknown error'}`
          error.value = msg; throw new Error(msg)
        }
      }

      if (moduleData.pptFile) {
        try {
          pptUrl = await uploadModulePpt(moduleData.pptFile)
        } catch (uploadErr: any) {
          const msg = `Failed to upload PowerPoint: ${uploadErr.message || 'Unknown error'}`
          error.value = msg; throw new Error(msg)
        }
      }

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
        description_panel_image_url: descPanelImageUrl || null, // ← ADDED
        video_url: videoUrl,
        ppt_url: pptUrl,
        lessons: JSON.stringify(sanitizeLessonsForStorage(moduleData.lessons)),
        learning_outcomes: moduleData.learning_outcomes ? JSON.stringify(moduleData.learning_outcomes) : '[]',
        is_active: moduleData.is_active !== false,
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

  const updateModule = async (moduleId: string, moduleData: any) => {
    loading.value = true
    error.value = null
    try {
      let imageUrl = moduleData.image_url
      let cardImageUrl = moduleData.card_image_url
      let descPanelImageUrl = moduleData.description_panel_image_url
      let videoUrl = moduleData.video_url
      let pptUrl = moduleData.ppt_url

      if (moduleData.imageFile) {
        try {
          if (moduleData.image_url) await deleteFileFromUrl(moduleData.image_url, 'module-images')
          imageUrl = await uploadModuleImage(moduleData.imageFile, moduleId)
        } catch (uploadErr: any) {
          const msg = `Failed to upload module image: ${uploadErr.message || 'Unknown error'}`
          error.value = msg; throw new Error(msg)
        }
      }

      if (moduleData.cardImageFile) {
        try {
          if (moduleData.card_image_url) await deleteFileFromUrl(moduleData.card_image_url, 'module-card-images')
          cardImageUrl = await uploadCardImage(moduleData.cardImageFile, moduleId)
        } catch (uploadErr: any) {
          const msg = `Failed to upload card image: ${uploadErr.message || 'Unknown error'}`
          error.value = msg; throw new Error(msg)
        }
      }

      // Upload description panel image if a new file was selected
      if (moduleData.descPanelImageFile) {
        try {
          if (moduleData.description_panel_image_url) {
            await deleteFileFromUrl(moduleData.description_panel_image_url, 'module-images')
          }
          descPanelImageUrl = await uploadDescPanelImage(moduleData.descPanelImageFile, moduleId)
        } catch (uploadErr: any) {
          const msg = `Failed to upload description panel image: ${uploadErr.message || 'Unknown error'}`
          error.value = msg; throw new Error(msg)
        }
      }

      if (moduleData.videoFile) {
        try {
          if (moduleData.video_url) await deleteFileFromUrl(moduleData.video_url, 'module-videos')
          videoUrl = await uploadModuleVideo(moduleData.videoFile, moduleId)
        } catch (uploadErr: any) {
          const msg = `Failed to upload video: ${uploadErr.message || 'Unknown error'}`
          error.value = msg; throw new Error(msg)
        }
      }

      if (moduleData.pptFile) {
        try {
          if (moduleData.ppt_url) await deleteFileFromUrl(moduleData.ppt_url, 'module-ppts')
          pptUrl = await uploadModulePpt(moduleData.pptFile, moduleId)
        } catch (uploadErr: any) {
          const msg = `Failed to upload PowerPoint: ${uploadErr.message || 'Unknown error'}`
          error.value = msg; throw new Error(msg)
        }
      }

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
        description_panel_image_url: descPanelImageUrl ?? null, // ← ADDED (null clears it if removed)
        video_url: videoUrl || moduleData.video_url,
        ppt_url: pptUrl || moduleData.ppt_url,
        lessons: JSON.stringify(sanitizeLessonsForStorage(moduleData.lessons)),
        learning_outcomes: moduleData.learning_outcomes ? JSON.stringify(moduleData.learning_outcomes) : '[]',
        is_active: moduleData.is_active !== false,
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
        if (index !== -1) modules.value[index] = module
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

  const getModuleById = (moduleId: string) => modules.value.find(m => m.id === moduleId)
  const getModulesByLevel = (level: string) => modules.value.filter(m => m.level === level)

  const beginnerModules = computed(() =>
    modules.value.filter(m => m.level === 'beginner').slice().sort(sortByModuleNumber)
  )
  const advancedModules = computed(() =>
    modules.value.filter(m => m.level === 'advanced').slice().sort(sortByModuleNumber)
  )
  const totalModules = computed(() => modules.value.length)

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

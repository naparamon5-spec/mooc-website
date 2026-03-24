import { ref } from 'vue'

export interface Badge {
  id?: string
  badge_name: string
  course_level: string
  module_position: number
  image_url?: string | null
  created_at?: string
  updated_at?: string
}

export const useBadgeManagement = () => {
  const { $supabase } = useNuxtApp()
  const supabase = $supabase

  const loading = ref(false)
  const error = ref('')
  const success = ref('')
  const badges = ref<Badge[]>([])

  // Fetch all badges with their metadata
  const fetchBadges = async () => {
    loading.value = true
    error.value = ''
    try {
      const { data, error: err } = await supabase
        .from('badges')
        .select('*')
        .order('course_level')
        .order('module_position')

      if (err) throw err
      badges.value = data || []
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch badges'
      console.error('Error fetching badges:', err)
    } finally {
      loading.value = false
    }
  }

  // Upload badge image and update database
  const uploadBadgeImage = async (file: File, courseLevel: string, modulePosition: number, badgeName: string) => {
    loading.value = true
    error.value = ''
    success.value = ''

    try {
      // Validate inputs
      if (!file || !courseLevel || !modulePosition || !badgeName) {
        throw new Error('All fields are required')
      }

      // Validate file is an image
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image')
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB')
      }

      // Create a unique filename
      const timestamp = Date.now()
      const fileName = `${courseLevel}-module-${modulePosition}-${timestamp}-${file.name}`
      const filePath = `badges/${fileName}`

      // Upload to storage
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('badges-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadErr) throw uploadErr

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('badges-images')
        .getPublicUrl(filePath)

      const publicUrl = urlData?.publicUrl

      // Update or create badge record in database
      const { data: existingBadge, error: checkErr } = await supabase
        .from('badges')
        .select('id')
        .eq('course_level', courseLevel)
        .eq('module_position', modulePosition)
        .maybeSingle()

      if (checkErr) throw checkErr

      if (existingBadge) {
        // Update existing badge
        const { error: updateErr } = await supabase
          .from('badges')
          .update({
            badge_name: badgeName,
            image_url: publicUrl,
          })
          .eq('id', existingBadge.id)

        if (updateErr) throw updateErr
      } else {
        // Create new badge
        const { error: insertErr } = await supabase
          .from('badges')
          .insert({
            badge_name: badgeName,
            course_level: courseLevel,
            module_position: modulePosition,
            image_url: publicUrl,
          })

        if (insertErr) throw insertErr
      }

      success.value = `Badge updated successfully for ${courseLevel} - Module ${modulePosition}`
      await fetchBadges()
      return { success: true, url: publicUrl }
    } catch (err: any) {
      error.value = err.message || 'Failed to upload badge'
      console.error('Error uploading badge:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Get badge by course level and module position
  const getBadge = async (courseLevel: string, modulePosition: number) => {
    try {
      const { data, error: err } = await supabase
        .from('badges')
        .select('*')
        .eq('course_level', courseLevel)
        .eq('module_position', modulePosition)
        .maybeSingle()

      if (err) throw err
      return (data as Badge | null) || null
    } catch (err: any) {
      console.error('Error fetching badge:', err)
      return null
    }
  }

  // Get badge image URL by course level and module position
  const getBadgeImageUrl = async (courseLevel: string, modulePosition: number) => {
    try {
      const badge = await getBadge(courseLevel, modulePosition)
      return badge?.image_url || null
    } catch (err) {
      console.error('Error getting badge image URL:', err)
      return null
    }
  }

  // Get badge image URL by badge name
  const getBadgeImageUrlByName = async (badgeName: string) => {
    try {
      const { data, error: err } = await supabase
        .from('badges')
        .select('image_url')
        .eq('badge_name', badgeName)
        .maybeSingle()

      if (err) throw err

      return data?.image_url || null
    } catch (err) {
      console.error('Error getting badge image URL by name:', err)
      return null
    }
  }

  // Delete badge image
  const deleteBadgeImage = async (courseLevel: string, modulePosition: number) => {
    loading.value = true
    error.value = ''

    try {
      const badge = await getBadge(courseLevel, modulePosition)
      if (!badge?.image_url) {
        throw new Error('Badge not found')
      }

      // Extract file path from URL (remove domain and public path)
      const urlParts = badge.image_url.split('/storage/v1/object/public/badges-images/')
      if (urlParts.length !== 2) {
        throw new Error('Invalid badge URL format')
      }
      const filePath = urlParts[1]
      if (!filePath) {
        throw new Error('Invalid badge URL format')
      }

      // Delete from storage
      const { error: deleteErr } = await supabase.storage
        .from('badges-images')
        .remove([filePath])

      if (deleteErr) throw deleteErr

      // Update database to remove image_url
      const { error: updateErr } = await supabase
        .from('badges')
        .update({ image_url: null })
        .eq('course_level', courseLevel)
        .eq('module_position', modulePosition)

      if (updateErr) throw updateErr

      success.value = 'Badge image deleted successfully'
      await fetchBadges()
    } catch (err: any) {
      error.value = err.message || 'Failed to delete badge'
      console.error('Error deleting badge:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    success,
    badges,
    fetchBadges,
    uploadBadgeImage,
    getBadge,
    getBadgeImageUrl,
    getBadgeImageUrlByName,
    deleteBadgeImage,
  }
}

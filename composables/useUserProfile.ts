import { ref, computed } from 'vue'

export interface UserProfile {
  id: string
  full_name: string
  email: string
  role: string
  student_id: string
  profile_pic_url: string | null
  created_at: string
}

export const useUserProfile = () => {
  const profile = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const userInitials = computed(() => {
    if (!profile.value?.full_name) return '?'
    const names = profile.value.full_name.split(' ')
    return names.map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
  })

  const fetchUserProfile = async () => {
    loading.value = true
    error.value = null

    try {
      const nuxtApp = useNuxtApp()
      const supabase = nuxtApp.$supabase

      if (!supabase || !supabase.auth) {
        error.value = 'Supabase client not available'
        return null
      }

      // Get current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !session?.user?.id) {
        error.value = 'No active session'
        return null
      }

      // Fetch user profile from profiles table
      const { data: userData, error: fetchError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, student_id, profile_pic_url, enrollment_date, created_at, language, country, phone, timezone, learning_mode, notification_preference, bio')
        .eq('id', session.user.id)
        .single()

      if (fetchError) {
        error.value = fetchError.message
        return null
      }

      profile.value = userData
      return userData
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch profile'
      console.error('Error fetching user profile:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      const nuxtApp = useNuxtApp()
      const supabase = nuxtApp.$supabase

      if (supabase?.auth) {
        await supabase.auth.signOut()
      }

      profile.value = null
      navigateTo('/login')
    } catch (err: any) {
      console.error('Logout error:', err)
      navigateTo('/login')
    }
  }

  const uploadProfilePic = async (file: File) => {
    if (!profile.value?.id) {
      error.value = 'No user profile found'
      return null
    }

    try {
      loading.value = true
      const supabase = useNuxtApp().$supabase
      
      // Create unique file name (without nested folder to avoid issues)
      const fileExt = file.name.split('.').pop()
      const fileName = `${profile.value.id}-${Date.now()}.${fileExt}`

      // Upload to Supabase Storage - use 'profiles' bucket
      const { data, error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName)

      // Update profile with image URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_pic_url: publicUrl })
        .eq('id', profile.value.id)

      if (updateError) throw updateError

      profile.value.profile_pic_url = publicUrl
      return publicUrl
    } catch (err: any) {
      error.value = err.message || 'Failed to upload profile picture'
      console.error('Upload error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    profile,
    loading,
    error,
    userInitials,
    fetchUserProfile,
    logout,
    uploadProfilePic
  }
}
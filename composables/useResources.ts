import { ref } from 'vue'

interface Resource {
  id: number
  title: string
  description: string
  link: string
  image?: string
  tags: string[]
}

export const useResources = () => {
  const { $supabase } = useNuxtApp()
  const supabase = $supabase

  const resources = ref<Resource[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchResources = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      resources.value = data || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch resources'
      console.error('Error fetching resources:', err)
    } finally {
      loading.value = false
    }
  }

  const addResource = async (resource: Omit<Resource, 'id'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('resources')
        .insert([resource])
        .select()
        .single()

      if (insertError) throw insertError
      resources.value.unshift(data)
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add resource'
      throw err
    }
  }

  const updateResource = async (id: number, updates: Partial<Resource>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('resources')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError
      const index = resources.value.findIndex(r => r.id === id)
      if (index !== -1) {
        resources.value[index] = data
      }
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update resource'
      throw err
    }
  }

  const deleteResource = async (id: number) => {
    try {
      const { error: deleteError } = await supabase
        .from('resources')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      resources.value = resources.value.filter(r => r.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete resource'
      throw err
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `resources/${fileName}`

      const { data, error: uploadError } = await supabase.storage
        .from('resources')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('resources')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to upload image'
      throw err
    }
  }

  return {
    resources,
    loading,
    error,
    fetchResources,
    addResource,
    updateResource,
    deleteResource,
    uploadImage
  }
}
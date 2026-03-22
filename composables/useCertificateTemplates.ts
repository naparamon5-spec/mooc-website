import { ref } from 'vue'

export interface CertificateTemplate {
  id?: string
  course_level: 'beginner' | 'advanced'
  template_name: string
  template_url: string
  created_at?: string
  updated_at?: string
}

export const useCertificateTemplates = () => {
  const { $supabase } = useNuxtApp()
  const supabase = $supabase

  const templates = ref<CertificateTemplate[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchTemplates = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('certificate_templates')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      templates.value = data || []
      return templates.value
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch certificate templates'
      console.error('Error fetching certificate templates:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchTemplateByLevel = async (level: 'beginner' | 'advanced') => {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('certificate_templates')
        .select('*')
        .eq('course_level', level)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError
      return data as CertificateTemplate | null
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch certificate template'
      console.error('Error fetching certificate template by level:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const createTemplate = async (template: CertificateTemplate) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: insertError } = await supabase
        .from('certificate_templates')
        .insert([template])
        .select()
        .single()

      if (insertError) throw insertError
      if (data) templates.value.unshift(data)
      return data as CertificateTemplate
    } catch (err: any) {
      error.value = err.message || 'Failed to create certificate template'
      console.error('Error creating certificate template:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteTemplate = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const { error: deleteError } = await supabase
        .from('certificate_templates')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      templates.value = templates.value.filter(t => t.id !== id)
      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to delete certificate template'
      console.error('Error deleting certificate template:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const uploadTemplateImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop() || 'png'
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `certificate-templates/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('certificate-templates')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('certificate-templates')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (err: any) {
      error.value = err.message || 'Failed to upload certificate template image'
      console.error('Error uploading certificate template image:', err)
      throw err
    }
  }

  return {
    templates,
    loading,
    error,
    fetchTemplates,
    fetchTemplateByLevel,
    createTemplate,
    deleteTemplate,
    uploadTemplateImage,
  }
}

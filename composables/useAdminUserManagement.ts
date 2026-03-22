import { ref, computed } from 'vue'

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  status: string
  isActive: boolean
  phone?: string
  createdAt: string
  updatedAt: string
}

export const useAdminUserManagement = () => {
  const { $supabase } = useNuxtApp()
  const users = ref<AdminUser[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchUsers = async () => {
    loading.value = true
    error.value = null
    try {
      console.log('Starting to fetch instructors and admins from Supabase...')

      const { data: { session } } = await $supabase.auth.getSession()
      if (!session?.access_token) {
        error.value = 'Session expired. Please sign in again.'
        return
      }

      const result = await $fetch<{ success: boolean; users: any[] }>('/api/admin/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (!result.success) {
        error.value = 'Failed to fetch users'
        return
      }

      users.value = result.users.map((user: any) => ({
        id: user.id,
        name: user.full_name || 'Unknown',
        email: user.email,
        role: user.role || 'instructor',
        status: user.is_active ? 'Active' : 'Inactive',
        isActive: user.is_active ?? true,
        phone: user.phone,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }))

      console.log('Successfully loaded instructors and admins:', users.value)
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching users:', err)
    } finally {
      loading.value = false
    }
  }

  const updateUserStatus = (userId: string, isActive: boolean) => {
    const index = users.value.findIndex(u => u.id === userId)
    if (index !== -1) {
      users.value[index] = {
        ...users.value[index],
        isActive,
        status: isActive ? 'Active' : 'Inactive'
      }
    }
  }

  return {
    users: computed(() => users.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    fetchUsers,
    updateUserStatus
  }
}
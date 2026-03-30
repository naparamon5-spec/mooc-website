import { ref, computed } from 'vue'
import axios from 'axios'

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

  // Helper: returns axios headers with Bearer token
  const getAuthHeaders = (token: string) => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  })

  const fetchUsers = async () => {
    loading.value = true
    error.value = null
    try {
      const { data: { session } } = await $supabase.auth.getSession()
      if (!session?.access_token) {
        error.value = 'Session expired. Please sign in again.'
        return
      }

      const { data: result } = await axios.get<{ success: boolean; users: any[] }>(
        '/api/admin/users',
        { headers: getAuthHeaders(session.access_token) }
      )

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
    } catch (err: any) {
      error.value =
        err?.response?.data?.statusMessage ||
        err?.response?.data?.message ||
        err?.message ||
        'Failed to fetch users'
      console.error('Error fetching users:', err)
    } finally {
      loading.value = false
    }
  }

  // Optimistic status update — no refetch needed
  const updateUserStatus = (userId: string, isActive: boolean) => {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      user.isActive = isActive
      user.status = isActive ? 'Active' : 'Inactive'
    }
  }

  // Optimistic remove — no refetch needed after delete
  const removeUser = (userId: string) => {
    users.value = users.value.filter(u => u.id !== userId)
  }

  return {
    users: computed(() => users.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    fetchUsers,
    updateUserStatus,
    removeUser
  }
}
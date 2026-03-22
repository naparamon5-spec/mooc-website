import { ref, computed } from 'vue'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const useUserManagement = () => {
  const { $supabase } = useNuxtApp()
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fetch all users with student_id from Supabase
  const fetchUsers = async () => {
    loading.value = true
    error.value = null
    try {
      console.log('Starting to fetch students from Supabase...')

      const { data, error: fetchError } = await $supabase
        .from('profiles')
        .select('id, email, full_name, role, is_active, created_at, updated_at')
        .eq('role', 'student')
        .not('student_id', 'is', null)
        .order('created_at', { ascending: false })

      console.log('Fetched student data:', data)
      console.log('Fetch error:', fetchError)

      if (fetchError) {
        const errorMessage = fetchError.message || JSON.stringify(fetchError)
        error.value = errorMessage
        console.error('Supabase fetch error details:', {
          message: fetchError.message,
          code: fetchError.code,
          fullError: fetchError
        })

        if (fetchError.code === '42P17') {
          error.value = 'Database policy error. Please disable RLS on the profiles table in Supabase settings.'
        }
        return
      }

      if (!data || data.length === 0) {
        console.log('No students found')
        users.value = []
        return
      }

      users.value = data.map((user: any) => ({
        id: user.id,
        name: user.full_name || 'Unknown',
        email: user.email,
        role: user.role || 'student',
        status: user.is_active ? 'Active' : 'Inactive',
        isActive: user.is_active ?? true,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }))

      console.log('Successfully loaded students:', users.value)
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching users:', err)
    } finally {
      loading.value = false
    }
  }

  // Create a new user account
  const createUser = async (userData: {
    email: string
    password: string
    fullName: string
  }) => {
    try {
      const { data: authData, error: authError } = await $supabase.auth.signUp({
        email: userData.email,
        password: userData.password
      })

      if (authError) throw authError

      const { data: profileData, error: profileError } = await $supabase
        .from('profiles')
        .insert({
          id: authData.user?.id,
          email: userData.email,
          full_name: userData.fullName,
          role: 'student',
          is_active: true
        })

      if (profileError) throw profileError

      await fetchUsers()
      return { success: true, data: profileData }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // Update user account
  const updateUser = async (
    userId: string,
    userData: { fullName?: string; email?: string }
  ) => {
    try {
      const { error: updateError } = await $supabase
        .from('profiles')
        .update({
          full_name: userData.fullName,
          email: userData.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) throw updateError

      await fetchUsers()
      return { success: true }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // Toggle user active status — routes through server API to bypass RLS
  const toggleUserStatus = async (userId: string) => {
    try {
      const user = users.value.find(u => u.id === userId)
      if (!user) throw new Error('User not found')

      const newStatus = !user.isActive

      // Get session token for auth header
      const { data: { session } } = await $supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('Session expired. Please sign in again.')
      }

      // Call server API — uses service role key to bypass RLS
      await $fetch('/api/admin/toggle-user-status', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: {
          userId,
          isActive: newStatus
        }
      })

      // Update local state properly (immutable update for Vue reactivity)
      const index = users.value.findIndex(u => u.id === userId)
      if (index !== -1) {
        users.value[index] = {
          ...users.value[index],
          isActive: newStatus,
          status: newStatus ? 'Active' : 'Inactive'
        }
      }

      console.log(`User ${userId} status updated to ${newStatus ? 'Active' : 'Inactive'}`)
      return { success: true }
    } catch (err: any) {
      error.value = err.message
      console.error('Error toggling user status:', err)
      return { success: false, error: err.message }
    }
  }

  // Delete user account
  const deleteUser = async (userId: string) => {
    try {
      await $fetch('/api/admin/delete-user', {
        method: 'POST',
        body: { userId }
      })

      await fetchUsers()
      return { success: true }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  return {
    users: computed(() => users.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    fetchUsers,
    createUser,
    updateUser,
    toggleUserStatus,
    deleteUser
  }
}
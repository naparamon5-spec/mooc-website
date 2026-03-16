// composables/useModuleAutoAssignment.ts
// Automatically assigns all modules to students with 2-week deadlines

import { ref } from 'vue'

interface ModuleAssignment {
  user_id: string
  module_id: string
  course_level: string
  deadline: string
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
}

export const useModuleAutoAssignment = () => {
  const { $supabase } = useNuxtApp()
  const supabase = $supabase

  // Auto-assign all modules with 2-week deadline when student enrolls
  const autoAssignModulesToStudent = async (userId: string) => {
    try {
      // Get all modules from the system
      const { data: allModules, error: modulesError } = await supabase
        .from('modules')
        .select('id, level')

      if (modulesError) throw modulesError
      if (!allModules || allModules.length === 0) return []

      // Create 2-week deadline (14 days from now)
      const deadline = new Date()
      deadline.setDate(deadline.getDate() + 14)

      // Group modules by level
      const beginnerModules = allModules.filter((m: any) => m.level === 'beginner')
      const advancedModules = allModules.filter((m: any) => m.level === 'advanced')

      const assignments: ModuleAssignment[] = []

      // Assign beginner modules
      for (const module of beginnerModules) {
        assignments.push({
          user_id: userId,
          module_id: module.id,
          course_level: 'beginner',
          deadline: deadline.toISOString(),
          status: 'pending'
        })
      }

      // Assign advanced modules (with same deadline for now)
      for (const module of advancedModules) {
        assignments.push({
          user_id: userId,
          module_id: module.id,
          course_level: 'advanced',
          deadline: deadline.toISOString(),
          status: 'pending'
        })
      }

      // Insert all assignments
      if (assignments.length > 0) {
        const { error: insertError } = await supabase
          .from('module_assignments')
          .upsert(assignments, {
            onConflict: 'user_id,module_id,course_level'
          })

        if (insertError) throw insertError
      }

      return assignments
    } catch (error) {
      console.error('Error auto-assigning modules:', error)
      throw error
    }
  }

  // Auto-assign modules when student first logs in
  const ensureModulesAssigned = async (userId: string) => {
    try {
      // Check if student already has assignments
      const { data: existing } = await supabase
        .from('module_assignments')
        .select('id')
        .eq('user_id', userId)
        .limit(1)

      // If no assignments exist, assign all modules automatically
      if (!existing || existing.length === 0) {
        await autoAssignModulesToStudent(userId)
      }
    } catch (error) {
      console.error('Error ensuring modules are assigned:', error)
    }
  }

  // Check and reset modules for week 3 (7+ days after deadline)
  const checkAndResetWeekThree = async (userId: string) => {
    try {
      // Get all assignments for this user
      const { data: assignments, error: fetchError } = await supabase
        .from('module_assignments')
        .select('id, module_id, deadline, status')
        .eq('user_id', userId)

      if (fetchError) throw fetchError
      if (!assignments || assignments.length === 0) return

      const now = new Date()
      const weekThreeResets = []

      for (const assignment of assignments) {
        const deadline = new Date(assignment.deadline)
        const daysAfterDeadline = Math.floor((now.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24))

        // Week 3: 7-13 days after deadline
        if (daysAfterDeadline >= 7 && daysAfterDeadline < 14 && assignment.status !== 'pending') {
          weekThreeResets.push(assignment.id)
        }
      }

      // Reset modules to pending for week 3
      if (weekThreeResets.length > 0) {
        const { error: updateError } = await supabase
          .from('module_assignments')
          .update({ status: 'pending' })
          .in('id', weekThreeResets)

        if (updateError) throw updateError
        console.log(`✅ Reset ${weekThreeResets.length} modules for week 3`)
      }
    } catch (error) {
      console.error('Error checking week 3 reset:', error)
    }
  }

  // Check and deactivate account for week 4 (14+ days after deadline)
  const checkAndDeactivateWeekFour = async (userId: string) => {
    try {
      // Get first assignment to check deadline
      const { data: assignments, error: fetchError } = await supabase
        .from('module_assignments')
        .select('deadline, status')
        .eq('user_id', userId)
        .limit(1)

      if (fetchError) throw fetchError
      if (!assignments || assignments.length === 0) return

      const assignment = assignments[0]
      if (!assignment?.deadline) return

      const deadline = new Date(assignment.deadline)
      const now = new Date()
      const daysAfterDeadline = Math.floor((now.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24))

      // Week 4: 14+ days after deadline
      if (daysAfterDeadline >= 14) {
        // 1. Get user profile to verify they're not already inactive
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_active')
          .eq('id', userId)
          .single()

        if (profileError && profileError.code !== 'PGRST116') throw profileError

        // Only deactivate if currently active
        if (profile?.is_active) {
          // 2. Mark user as inactive
          const { error: deactivateError } = await supabase
            .from('profiles')
            .update({
              is_active: false,
              deactivated_at: new Date().toISOString(),
              account_deactivation_reason: 'Module deadline exceeded (Week 4)'
            })
            .eq('id', userId)

          if (deactivateError) throw deactivateError

          // 3. Delete all progress for this user
          const { error: deleteProgressError } = await supabase
            .from('course_progress')
            .delete()
            .eq('user_id', userId)

          if (deleteProgressError) throw deleteProgressError

          // 4. Reset all module assignments to pending
          const { error: resetError } = await supabase
            .from('module_assignments')
            .update({ status: 'pending' })
            .eq('user_id', userId)

          if (resetError) throw resetError

          // 5. Delete quiz results
          const { error: deleteQuizError } = await supabase
            .from('quiz_results')
            .delete()
            .eq('user_id', userId)

          if (deleteQuizError) throw deleteQuizError

          console.log(`✅ Deactivated account and cleared progress for user ${userId} (Week 4)`)
        }
      }
    } catch (error) {
      console.error('Error checking week 4 deactivation:', error)
    }
  }

  // Run all deadline checks
  const checkDeadlineStatus = async (userId: string) => {
    await checkAndResetWeekThree(userId)
    await checkAndDeactivateWeekFour(userId)
  }

  return {
    autoAssignModulesToStudent,
    ensureModulesAssigned,
    checkDeadlineStatus,
    checkAndResetWeekThree,
    checkAndDeactivateWeekFour
  }
}

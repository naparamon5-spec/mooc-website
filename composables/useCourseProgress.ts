import { ref, computed } from 'vue'

// Global state for course progress
const courseProgress = ref({
  beginner: {
    completedModules: new Set<string>(), // Changed to string for UUID
    earnedBadges: new Set<string>(),
    completedLessons: new Map<string, Set<number>>(), // moduleId (UUID) -> Set of lesson indices
  },
  advanced: {
    completedModules: new Set<string>(),
    earnedBadges: new Set<string>(),
    completedLessons: new Map<string, Set<number>>(),
  },
})

// Badge mapping for each module (beginner and advanced)
// Maps course level -> module number -> badge name
const badgeMapping: Record<string, Record<number, string>> = {
  beginner: {
    1: 'LITERACY SCHOLAR',
    2: 'MEDIA SYSTEMS ADEPT',
    3: 'MEDIA LINGUIST',
    4: 'EQUITY ADVOCATE',
    5: 'RESPONSIBLE CITIZEN',
  },
  advanced: {
    1: 'CYBER GUARDIAN',
    2: 'GENERATIVE THINKER',
    3: 'DIGITAL MAVEN',
    4: 'MEDIA ANALYST',
    5: 'ETHICAL MEDIA CREATOR',
  }
}

// Helper to get badge by module position - maps from module position (1-5) to badge
const getBadgeByModulePosition = (courseLevel: 'beginner' | 'advanced', modulePosition: number): string | undefined => {
  const badges = badgeMapping[courseLevel]
  if (!badges) return undefined
  return badges[modulePosition]
}

// Helper to find module position in a list (1-indexed for badge matching)
const findModulePosition = (moduleId: string, allModules: any[]): number => {
  const filteredModules = allModules.sort((a, b) => {
    const dateA = new Date(a.created_at || 0).getTime()
    const dateB = new Date(b.created_at || 0).getTime()
    return dateA - dateB
  })
  const position = filteredModules.findIndex(m => m.id === moduleId)
  return position >= 0 ? position + 1 : 1 // 1-indexed
}

const allBadges = {
  beginner: ['LITERACY SCHOLAR', 'MEDIA SYSTEMS ADEPT', 'MEDIA LINGUIST', 'EQUITY ADVOCATE', 'RESPONSIBLE CITIZEN'],
  advanced: ['CYBER GUARDIAN', 'GENERATIVE THINKER', 'DIGITAL MAVEN', 'MEDIA ANALYST', 'ETHICAL MEDIA CREATOR']
}

export const useCourseProgress = () => {
  const { $supabase } = useNuxtApp()
  const supabase = $supabase

  // Clear all progress data (for logout or user switch)
  const clearProgress = () => {
    console.log('Clearing all progress data')
    courseProgress.value = {
      beginner: {
        completedModules: new Set<string>(),
        earnedBadges: new Set<string>(),
        completedLessons: new Map<string, Set<number>>(),
      },
      advanced: {
        completedModules: new Set<string>(),
        earnedBadges: new Set<string>(),
        completedLessons: new Map<string, Set<number>>(),
      },
    }
  }

  // Load progress from Supabase for the current user
  const loadProgressFromSupabase = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.warn('No authenticated user found')
        return
      }

      console.log('Loading progress for user:', user.id)

      // Load completed lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)

      console.log('Lessons data fetched:', lessonsData?.length ?? 0, 'records', lessonsError ? `Error: ${lessonsError.message}` : '')

      if (lessonsData) {
        lessonsData.forEach((record: any) => {
          const courseLevel = record.course_level as 'beginner' | 'advanced'
          const moduleId = record.module_id // Keep as string (UUID)
          const lessonIndex = record.lesson_index

          if (!courseProgress.value[courseLevel].completedLessons.has(moduleId)) {
            courseProgress.value[courseLevel].completedLessons.set(moduleId, new Set<number>())
          }
          courseProgress.value[courseLevel].completedLessons.get(moduleId)!.add(lessonIndex)
        })
      }

      // Load completed modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('module_completion')
        .select('*')
        .eq('user_id', user.id)

      console.log('Completed modules fetched:', modulesData?.length ?? 0, 'records', modulesError ? `Error: ${modulesError.message}` : '')

      if (modulesData) {
        modulesData.forEach((record: any) => {
          const courseLevel = record.course_level as 'beginner' | 'advanced'
          const moduleId = record.module_id // Keep as string (UUID)

          console.log(`Module completed: ${moduleId} (${courseLevel})`)
          courseProgress.value[courseLevel].completedModules.add(moduleId)
        })
      }

      // Load earned badges
      const { data: badgesData, error: badgesError } = await supabase
        .from('badges_earned')
        .select('*')
        .eq('user_id', user.id)

      console.log('Badges earned fetched:', badgesData?.length ?? 0, 'records', badgesError ? `Error: ${badgesError.message}` : '')

      if (badgesData) {
        badgesData.forEach((record: any) => {
          const courseLevel = record.course_level as 'beginner' | 'advanced'
          const badgeName = record.badge_name

          courseProgress.value[courseLevel].earnedBadges.add(badgeName)
        })
      }
    } catch (err) {
      console.error('Error loading progress from Supabase:', err)
    }
  }

  // Save lesson completion to Supabase
  const saveLessonToSupabase = async (
    courseLevel: 'beginner' | 'advanced',
    moduleId: string,
    lessonIndex: number
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          course_level: courseLevel,
          module_id: moduleId,
          lesson_index: lessonIndex,
        })

      if (error) {
        console.error('Error saving lesson progress:', error)
      }
    } catch (err) {
      console.error('Error saving lesson to Supabase:', err)
    }
  }

  // Save module completion to Supabase
  const saveModuleToSupabase = async (
    courseLevel: 'beginner' | 'advanced',
    moduleId: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('module_completion')
        .upsert({
          user_id: user.id,
          course_level: courseLevel,
          module_id: moduleId,
        })

      if (error) {
        console.error('Error saving module completion:', error)
      }
    } catch (err) {
      console.error('Error saving module to Supabase:', err)
    }
  }

  // Save badge to Supabase
  const saveBadgeToSupabase = async (
    courseLevel: 'beginner' | 'advanced',
    moduleId: string,
    badgeName: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('badges_earned')
        .upsert({
          user_id: user.id,
          course_level: courseLevel,
          module_id: moduleId,
          badge_name: badgeName,
        })

      if (error) {
        console.error('Error saving badge:', error)
      }
    } catch (err) {
      console.error('Error saving badge to Supabase:', err)
    }
  }

  // Save certificate when course is completed
  const saveCertificateToSupabase = async (
    courseLevel: 'beginner' | 'advanced'
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Check if certificate already exists
      const { data: existingCert } = await supabase
        .from('certificates')
        .select('*')
        .eq('student_id', user.id)
        .eq('course_level', courseLevel)
        .single()

      if (!existingCert) {
        const { error } = await supabase
          .from('certificates')
          .insert({
            student_id: user.id,
            course_level: courseLevel,
            issued_at: new Date().toISOString(),
          })

        if (error) {
          console.error('Error saving certificate:', error)
        }
      }
    } catch (err) {
      console.error('Error saving certificate to Supabase:', err)
    }
  }

  // Get completed modules for a specific course level
  const getCompletedModules = (courseLevel: 'beginner' | 'advanced'): string[] => {
    return Array.from(courseProgress.value[courseLevel].completedModules)
  }

  // Get earned badges for a specific course level
  const getEarnedBadges = (courseLevel: 'beginner' | 'advanced') => {
    return Array.from(courseProgress.value[courseLevel].earnedBadges).map(badge => ({
      name: badge,
      earned: true,
    }))
  }

  // Get all badges with earned status for a specific course level
  const getAllBadges = (courseLevel: 'beginner' | 'advanced') => {
    return allBadges[courseLevel].map(badge => ({
      name: badge,
      earned: courseProgress.value[courseLevel].earnedBadges.has(badge),
    }))
  }

  // Mark module as completed and award badge
  const completeModule = (courseLevel: 'beginner' | 'advanced', moduleId: string) => {
    courseProgress.value[courseLevel].completedModules.add(moduleId)
    
    // Determine module position (1-5) based on number of completed modules
    // This assumes modules are completed in order
    const modulePosition = courseProgress.value[courseLevel].completedModules.size
    
    // Get badge for this module position
    const badgeName = getBadgeByModulePosition(courseLevel, modulePosition)
    if (badgeName) {
      courseProgress.value[courseLevel].earnedBadges.add(badgeName)
      // Save badge to Supabase
      saveBadgeToSupabase(courseLevel, moduleId, badgeName)
    }
    
    // Save to Supabase
    saveModuleToSupabase(courseLevel, moduleId)

    // If all 5 modules completed, save certificate
    if (modulePosition === 5) {
      saveCertificateToSupabase(courseLevel)
    }
  }

  // Check if a module is completed
  const isModuleCompleted = (courseLevel: 'beginner' | 'advanced', moduleId: string): boolean => {
    return courseProgress.value[courseLevel].completedModules.has(moduleId)
  }

  // Get progress percentage for a course level
  const getProgressPercentage = (courseLevel: 'beginner' | 'advanced', totalModules: number): number => {
    const completed = courseProgress.value[courseLevel].completedModules.size
    return totalModules > 0 ? Math.round((completed / totalModules) * 100) : 0
  }

  // Get completion status
  const getCompletionStatus = (courseLevel: 'beginner' | 'advanced', totalModules: number): string => {
    const completed = courseProgress.value[courseLevel].completedModules.size
    if (completed === 0) return 'Not started'
    if (completed === totalModules) return 'Completed'
    return 'In progress'
  }

  // Get current module (first incomplete module or first module)
  const getCurrentModule = (courseLevel: 'beginner' | 'advanced', modules: any[]): string => {
    const firstIncomplete = modules.find(m => !isModuleCompleted(courseLevel, m.id))
    return firstIncomplete ? firstIncomplete.title : (modules[0]?.title || '')
  }

  // Get completed modules count
  const getCompletedCount = (courseLevel: 'beginner' | 'advanced'): number => {
    return courseProgress.value[courseLevel].completedModules.size
  }

  // Check if beginner course is fully completed
  const isBeginnerCourseCompleted = (): boolean => {
    return courseProgress.value.beginner.completedModules.size === 5
  }

  // Mark a lesson as completed in a module
  const completeLessonInModule = (courseLevel: 'beginner' | 'advanced', moduleId: string, lessonIndex: number) => {
    if (!courseProgress.value[courseLevel].completedLessons.has(moduleId)) {
      courseProgress.value[courseLevel].completedLessons.set(moduleId, new Set<number>())
    }
    courseProgress.value[courseLevel].completedLessons.get(moduleId)!.add(lessonIndex)
    
    // Save to Supabase
    saveLessonToSupabase(courseLevel, moduleId, lessonIndex)
  }

  // Get completed lessons for a module
  const getCompletedLessons = (courseLevel: 'beginner' | 'advanced', moduleId: string): number[] => {
    const lessons = courseProgress.value[courseLevel].completedLessons.get(moduleId)
    return lessons ? Array.from(lessons) : []
  }

  // Get total progress including lessons
  const getTotalProgressPercentage = (courseLevel: 'beginner' | 'advanced', totalModules: number, currentModuleId: string, totalLessonsInCurrentModule: number): number => {
    const completedModuleCount = courseProgress.value[courseLevel].completedModules.size
    const baseProgress = (completedModuleCount / totalModules) * 100
    
    // Add progress from current module's lessons if not completed
    if (!courseProgress.value[courseLevel].completedModules.has(currentModuleId) && totalLessonsInCurrentModule > 0) {
      const completedLessonCount = courseProgress.value[courseLevel].completedLessons.get(currentModuleId)?.size || 0
      const lessonProgress = (completedLessonCount / totalLessonsInCurrentModule) * (100 / totalModules)
      return Math.round(baseProgress + lessonProgress)
    }
    
    return Math.round(baseProgress)
  }

  return {
    courseProgress: computed(() => courseProgress.value),
    getCompletedModules,
    getEarnedBadges,
    getAllBadges,
    completeModule,
    isModuleCompleted,
    getProgressPercentage,
    getCompletionStatus,
    getCurrentModule,
    getCompletedCount,
    isBeginnerCourseCompleted,
    completeLessonInModule,
    getCompletedLessons,
    getTotalProgressPercentage,
    badgeMapping,
    loadProgressFromSupabase,
    clearProgress,
  }
}
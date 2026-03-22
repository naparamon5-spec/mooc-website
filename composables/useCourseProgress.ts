import { ref, computed } from 'vue'

// Global state for course progress
const courseProgress = ref({
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
})

// Badge mapping for each module (beginner and advanced)
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

const getBadgeByModulePosition = (courseLevel: 'beginner' | 'advanced', modulePosition: number): string | undefined => {
  const badges = badgeMapping[courseLevel]
  if (!badges) return undefined
  return badges[modulePosition]
}

const findModulePosition = (moduleId: string, allModules: any[]): number => {
  const filteredModules = allModules.sort((a, b) => {
    const dateA = new Date(a.created_at || 0).getTime()
    const dateB = new Date(b.created_at || 0).getTime()
    return dateA - dateB
  })
  const position = filteredModules.findIndex(m => m.id === moduleId)
  return position >= 0 ? position + 1 : 1
}

const allBadges = {
  beginner: ['LITERACY SCHOLAR', 'MEDIA SYSTEMS ADEPT', 'MEDIA LINGUIST', 'EQUITY ADVOCATE', 'RESPONSIBLE CITIZEN'],
  advanced: ['CYBER GUARDIAN', 'GENERATIVE THINKER', 'DIGITAL MAVEN', 'MEDIA ANALYST', 'ETHICAL MEDIA CREATOR']
}

export const useCourseProgress = () => {
  const { $supabase } = useNuxtApp()
  const supabase = $supabase

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

  const loadProgressFromSupabase = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.warn('No authenticated user found')
        return
      }

      console.log('Loading progress for user:', user.id)

      const { data: lessonsData, error: lessonsError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)

      console.log('Lessons data fetched:', lessonsData?.length ?? 0, 'records', lessonsError ? `Error: ${lessonsError.message}` : '')

      if (lessonsData) {
        lessonsData.forEach((record: any) => {
          const courseLevel = record.course_level as 'beginner' | 'advanced'
          const moduleId = record.module_id
          const lessonIndex = record.lesson_index

          if (!courseProgress.value[courseLevel].completedLessons.has(moduleId)) {
            courseProgress.value[courseLevel].completedLessons.set(moduleId, new Set<number>())
          }
          courseProgress.value[courseLevel].completedLessons.get(moduleId)!.add(lessonIndex)
        })
      }

      const { data: modulesData, error: modulesError } = await supabase
        .from('module_completion')
        .select('id, user_id, course_level, module_id, completed_at, created_at')
        .eq('user_id', user.id)

      if (modulesError) {
        console.warn('Error fetching modules:', modulesError.message, modulesError.code, modulesError.details)
      }

      console.log('Completed modules fetched:', modulesData?.length ?? 0, 'records', modulesError ? `Error: ${modulesError.message}` : '')

      if (modulesData && modulesData.length > 0) {
        modulesData.forEach((record: any) => {
          const courseLevel = record.course_level as 'beginner' | 'advanced'
          const moduleId = record.module_id

          console.log(`Module completed: ${moduleId} (${courseLevel})`)
          courseProgress.value[courseLevel].completedModules.add(moduleId)
        })
      } else if (!modulesError) {
        console.log('No module completions found for user - this is normal if no modules have been completed yet')
      }

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

      const { data: quizResults } = await supabase
        .from('quiz_results')
        .select('quiz_id, passed')
        .eq('user_id', user.id)
        .eq('passed', true)

      if (quizResults) {
        for (const result of quizResults) {
          const { data: quiz } = await supabase
            .from('quizzes')
            .select('module_id, level')
            .eq('id', result.quiz_id)
            .single()

          if (quiz?.module_id && quiz.level) {
            const courseLevel = quiz.level as 'beginner' | 'advanced'
            courseProgress.value[courseLevel].completedModules.add(quiz.module_id)
            
            // Recalculate and generate badges for modules completed via quizzes
            const allModulesForLevel = Array.from(courseProgress.value[courseLevel].completedModules)
            for (let i = 0; i < allModulesForLevel.length; i++) {
              const position = i + 1
              const badgeName = getBadgeByModulePosition(courseLevel, position)
              if (badgeName && !courseProgress.value[courseLevel].earnedBadges.has(badgeName)) {
                courseProgress.value[courseLevel].earnedBadges.add(badgeName)
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('Error loading progress from Supabase:', err)
    }
  }

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
        }, { onConflict: 'user_id,course_level,module_id,lesson_index' })

      if (error) {
        console.error('Error saving lesson progress:', error)
      }
    } catch (err) {
      console.error('Error saving lesson to Supabase:', err)
    }
  }

const saveModuleToSupabase = async (
  courseLevel: 'beginner' | 'advanced',
  moduleId: string
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.error('❌ No authenticated user for module completion')
      return
    }

    console.log('💾 Attempting to save module completion:', { userId: user.id, courseLevel, moduleId })

    // Check if the record already exists to avoid triggering DELETE on upsert
    const { data: existing, error: selectError } = await supabase
      .from('module_completion')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_level', courseLevel)
      .eq('module_id', moduleId)
      .maybeSingle()

    if (selectError) {
      console.error('❌ Error checking existing module completion:', selectError.message)
      return
    }

    if (existing) {
      console.log('✅ Module completion already recorded, skipping insert')
      return
    }

    const { error } = await supabase
      .from('module_completion')
      .insert({
        user_id: user.id,
        course_level: courseLevel,
        module_id: moduleId,
      })

    if (error) {
      console.error('❌ Error saving module completion:', error.message, error.code, error.details)
    } else {
      console.log('✅ Module completion saved successfully')
    }
  } catch (err) {
    console.error('❌ Exception saving module to Supabase:', err)
  }
}
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
        }, { onConflict: 'user_id,course_level,module_id' })

      if (error) {
        console.error('Error saving badge:', error)
      }
    } catch (err) {
      console.error('Error saving badge to Supabase:', err)
    }
  }

  const saveCertificateToSupabase = async (
    courseLevel: 'beginner' | 'advanced'
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

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

  const getCompletedModules = (courseLevel: 'beginner' | 'advanced'): string[] => {
    return Array.from(courseProgress.value[courseLevel].completedModules)
  }

  const getEarnedBadges = (courseLevel: 'beginner' | 'advanced') => {
    return Array.from(courseProgress.value[courseLevel].earnedBadges).map(badge => ({
      name: badge,
      earned: true,
    }))
  }

  const getAllBadges = (courseLevel: 'beginner' | 'advanced') => {
    return allBadges[courseLevel].map(badge => ({
      name: badge,
      earned: courseProgress.value[courseLevel].earnedBadges.has(badge),
    }))
  }

  const completeModule = (courseLevel: 'beginner' | 'advanced', moduleId: string) => {
    console.log('🎯 completeModule called:', { courseLevel, moduleId })

    courseProgress.value[courseLevel].completedModules.add(moduleId)

    const modulePosition = courseProgress.value[courseLevel].completedModules.size
    console.log('📊 Module position:', modulePosition)

    const badgeName = getBadgeByModulePosition(courseLevel, modulePosition)
    if (badgeName) {
      courseProgress.value[courseLevel].earnedBadges.add(badgeName)
      console.log('🏆 Badge earned:', badgeName)
      saveBadgeToSupabase(courseLevel, moduleId, badgeName)
    }

    console.log('💾 Saving module completion to Supabase...')
    saveModuleToSupabase(courseLevel, moduleId)

    if (modulePosition === 5) {
      console.log('🎓 Course completed! Saving certificate...')
      saveCertificateToSupabase(courseLevel)
    }
  }

  const isModuleCompleted = (courseLevel: 'beginner' | 'advanced', moduleId: string): boolean => {
    return courseProgress.value[courseLevel].completedModules.has(moduleId)
  }

  const getProgressPercentage = (courseLevel: 'beginner' | 'advanced', totalModules: number): number => {
    const completed = courseProgress.value[courseLevel].completedModules.size
    return totalModules > 0 ? Math.round((completed / totalModules) * 100) : 0
  }

  const getCompletionStatus = (courseLevel: 'beginner' | 'advanced', totalModules: number): string => {
    const completed = courseProgress.value[courseLevel].completedModules.size
    if (completed === 0) return 'Not started'
    if (completed === totalModules) return 'Completed'
    return 'In progress'
  }

  const getCurrentModule = (courseLevel: 'beginner' | 'advanced', modules: any[]): string => {
    const firstIncomplete = modules.find(m => !isModuleCompleted(courseLevel, m.id))
    return firstIncomplete ? firstIncomplete.title : (modules[0]?.title || '')
  }

  const getCompletedCount = (courseLevel: 'beginner' | 'advanced'): number => {
    return courseProgress.value[courseLevel].completedModules.size
  }

  // Accepts optional totalBeginnerModules so it works regardless of how many modules exist in DB
  const isBeginnerCourseCompleted = (totalBeginnerModules?: number): boolean => {
    const completed = courseProgress.value.beginner.completedModules.size
    if (completed === 0) return false
    // If we know the total, use it; otherwise fall back to checking if any are completed
    // and the count matches what was passed in
    if (totalBeginnerModules && totalBeginnerModules > 0) {
      return completed >= totalBeginnerModules
    }
    // Fallback: check against the DB-loaded count (at least 5 for safety)
    return completed >= 5
  }

  const completeLessonInModule = async (courseLevel: 'beginner' | 'advanced', moduleId: string, lessonIndex: number) => {
    if (!courseProgress.value[courseLevel].completedLessons.has(moduleId)) {
      courseProgress.value[courseLevel].completedLessons.set(moduleId, new Set<number>())
    }
    courseProgress.value[courseLevel].completedLessons.get(moduleId)!.add(lessonIndex)

    await saveLessonToSupabase(courseLevel, moduleId, lessonIndex)
  }

  const getCompletedLessons = (courseLevel: 'beginner' | 'advanced', moduleId: string): number[] => {
    const lessons = courseProgress.value[courseLevel].completedLessons.get(moduleId)
    return lessons ? Array.from(lessons) : []
  }

  const getTotalProgressPercentage = (courseLevel: 'beginner' | 'advanced', totalModules: number, currentModuleId: string, totalLessonsInCurrentModule: number): number => {
    const completedModuleCount = courseProgress.value[courseLevel].completedModules.size
    const baseProgress = (completedModuleCount / totalModules) * 100

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
import { ref, computed } from 'vue'

// Global state for course progress
const courseProgress = ref({
  beginner: {
    completedModules: new Set<number>(),
    earnedBadges: new Set<string>(),
    completedLessons: new Map<number, Set<number>>(), // moduleId -> Set of lesson indices
  },
  advanced: {
    completedModules: new Set<number>(),
    earnedBadges: new Set<string>(),
    completedLessons: new Map<number, Set<number>>(),
  },
})

// Badge mapping for each module
const badgeMapping: Record<number, string> = {
  1: 'LITERACY SCHOLAR',
  2: 'MEDIA DEFENDER',
  3: 'DIGITAL LIBRARIAN',
  4: 'FACTS ADVOCATE',
  5: 'RESPONSIBLE CITIZEN',
}

const allBadges = ['LITERACY SCHOLAR', 'MEDIA DEFENDER', 'DIGITAL LIBRARIAN', 'FACTS ADVOCATE', 'RESPONSIBLE CITIZEN']

export const useCourseProgress = () => {
  // Get completed modules for a specific course level
  const getCompletedModules = (courseLevel: 'beginner' | 'advanced'): number[] => {
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
    return allBadges.map(badge => ({
      name: badge,
      earned: courseProgress.value[courseLevel].earnedBadges.has(badge),
    }))
  }

  // Mark module as completed and award badge
  const completeModule = (courseLevel: 'beginner' | 'advanced', moduleId: number) => {
    courseProgress.value[courseLevel].completedModules.add(moduleId)
    const badgeName = badgeMapping[moduleId]
    if (badgeName) {
      courseProgress.value[courseLevel].earnedBadges.add(badgeName)
    }
  }

  // Check if a module is completed
  const isModuleCompleted = (courseLevel: 'beginner' | 'advanced', moduleId: number): boolean => {
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
  const completeLessonInModule = (courseLevel: 'beginner' | 'advanced', moduleId: number, lessonIndex: number) => {
    if (!courseProgress.value[courseLevel].completedLessons.has(moduleId)) {
      courseProgress.value[courseLevel].completedLessons.set(moduleId, new Set<number>())
    }
    courseProgress.value[courseLevel].completedLessons.get(moduleId)!.add(lessonIndex)
  }

  // Get completed lessons for a module
  const getCompletedLessons = (courseLevel: 'beginner' | 'advanced', moduleId: number): number[] => {
    const lessons = courseProgress.value[courseLevel].completedLessons.get(moduleId)
    return lessons ? Array.from(lessons) : []
  }

  // Get total progress including lessons
  const getTotalProgressPercentage = (courseLevel: 'beginner' | 'advanced', totalModules: number, currentModuleId: number, totalLessonsInCurrentModule: number): number => {
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
  }
}

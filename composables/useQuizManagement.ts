import { ref } from 'vue'

export interface QuizQuestion {
  id?: string
  question: string
  type: 'multiple_choice' | 'true_false'
  options: string[]
  correctAnswer: string | number
  explanation?: string
}

export interface Quiz {
  id?: string
  title: string
  description: string
  moduleId?: string
  level: 'beginner' | 'advanced'
  questions: QuizQuestion[]
  passingScore: number
  createdBy?: string
  createdAt?: string
  updatedAt?: string
}

export const useQuizManagement = () => {
  const { $supabase } = useNuxtApp()
  const supabase = $supabase

  const quizzes = ref<Quiz[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fetch all quizzes
  const fetchQuizzes = async (level?: 'beginner' | 'advanced') => {
    loading.value = true
    error.value = null

    try {
      let query = supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false })

      if (level) {
        query = query.eq('level', level)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      quizzes.value = data || []
      console.log('Fetched quizzes:', quizzes.value.length)
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching quizzes:', err)
    } finally {
      loading.value = false
    }
  }

  // Fetch a single quiz
  const fetchQuizById = async (quizId: string) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single()

      if (fetchError) throw fetchError

      return data
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching quiz:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Create a new quiz
  const createQuiz = async (quiz: Quiz) => {
    loading.value = true
    error.value = null

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error: createError } = await supabase
        .from('quizzes')
        .insert({
          title: quiz.title,
          description: quiz.description,
          module_id: quiz.moduleId,
          level: quiz.level,
          questions: quiz.questions,
          passing_score: quiz.passingScore,
          created_by: user.id,
        })
        .select()

      if (createError) throw createError

      console.log('Quiz created:', data)
      await fetchQuizzes()
      return data
    } catch (err: any) {
      error.value = err.message
      console.error('Error creating quiz:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Update a quiz
  const updateQuiz = async (quizId: string, quiz: Quiz) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('quizzes')
        .update({
          title: quiz.title,
          description: quiz.description,
          module_id: quiz.moduleId,
          level: quiz.level,
          questions: quiz.questions,
          passing_score: quiz.passingScore,
          updated_at: new Date().toISOString(),
        })
        .eq('id', quizId)
        .select()

      if (updateError) throw updateError

      console.log('Quiz updated:', data)
      await fetchQuizzes()
      return data
    } catch (err: any) {
      error.value = err.message
      console.error('Error updating quiz:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Delete a quiz
  const deleteQuiz = async (quizId: string) => {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId)

      if (deleteError) throw deleteError

      console.log('Quiz deleted')
      await fetchQuizzes()
      return true
    } catch (err: any) {
      error.value = err.message
      console.error('Error deleting quiz:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // Submit quiz answers
  const submitQuizAnswers = async (quizId: string, answers: { [questionId: string]: string | number }) => {
    loading.value = true
    error.value = null

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Fetch the quiz to calculate score
      const quiz = await fetchQuizById(quizId)
      if (!quiz) throw new Error('Quiz not found')

      // Calculate score
      let correctAnswers = 0
      const totalQuestions = quiz.questions.length

      quiz.questions.forEach((q: QuizQuestion, index: number) => {
        const userAnswer = answers[index]
        if (userAnswer.toString() === q.correctAnswer.toString()) {
          correctAnswers++
        }
      })

      const score = Math.round((correctAnswers / totalQuestions) * 100)
      const passed = score >= quiz.passing_score

      // Save quiz result
      const { data, error: saveError } = await supabase
        .from('quiz_results')
        .insert({
          user_id: user.id,
          quiz_id: quizId,
          score: score,
          passed: passed,
          answers: answers,
        })
        .select()

      if (saveError) throw saveError

      return {
        score,
        passed,
        correctAnswers,
        totalQuestions,
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Error submitting quiz:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    quizzes,
    loading,
    error,
    fetchQuizzes,
    fetchQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    submitQuizAnswers,
  }
}

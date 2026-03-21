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
  // may be null if not associated with a module
  moduleId?: string | null
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

  /**
   * Normalize any true/false value to 'true' or 'false'
   * Handles ALL formats:
   *   → 'true': 'True', 'true', 'TRUE', 1, '1', 'yes'
   *   → 'false': 'False', 'false', 'FALSE', 0, '0', 'no'
   */
  const normalizeTrueFalseToString = (value: string | number | boolean): string => {
    const str = String(value).toLowerCase().trim()
    return str === 'true' || str === '1' || str === 'yes' ? 'true' : 'false'
  }

  /**
   * Normalize any true/false value to 1 (true) or 0 (false) for comparison
   * Handles ALL formats:
   *   → 1: 'True', 'true', 'TRUE', 1, '1', 'yes', 'true'
   *   → 0: 'False', 'false', 'FALSE', 0, '0', 'no', 'false'
   */
  const normalizeTrueFalseToInt = (value: string | number | boolean): number => {
    const str = String(value).toLowerCase().trim()
    return str === 'true' || str === '1' || str === 'yes' ? 1 : 0
  }

  /**
   * Normalize a question's correctAnswer to the correct stored type:
   *   - multiple_choice → number (index)
   *   - true_false      → string ('true' or 'false')
   */
  const normalizeCorrectAnswer = (q: QuizQuestion): string | number => {
    if (q.type === 'multiple_choice') {
      return parseInt(String(q.correctAnswer), 10)
    } else if (q.type === 'true_false') {
      return normalizeTrueFalseToString(q.correctAnswer)
    }
    return String(q.correctAnswer)
  }

  /**
   * Normalize all questions in a quiz fetched from database.
   * Ensures correctAnswer is always in the right format for comparison.
   */
  const normalizeQuizData = (quiz: any): any => {
    if (!quiz || !quiz.questions) return quiz
    
    const normalizedQuestions = quiz.questions.map((q: any) => {
      if (!q) return q
      
      // Always normalize correctAnswer to ensure consistent format
      let normalizedAnswer: string | number
      
      if (q.type === 'multiple_choice') {
        normalizedAnswer = parseInt(String(q.correctAnswer), 10)
      } else if (q.type === 'true_false') {
        // Store as string: 'true' or 'false'
        normalizedAnswer = normalizeTrueFalseToString(q.correctAnswer)
      } else {
        normalizedAnswer = String(q.correctAnswer)
      }
      
      return {
        ...q,
        correctAnswer: normalizedAnswer
      }
    })
    
    return {
      ...quiz,
      questions: normalizedQuestions
    }
  }

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

      // Normalize quiz data to ensure correctAnswer is in the right format
      return normalizeQuizData(data)
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching quiz:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Fetch quiz linked to a specific module (1 quiz per module)
  const fetchQuizForModule = async (moduleId: string) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('module_id', moduleId)
        .limit(1)
        .maybeSingle()

      if (fetchError) throw fetchError

      // Normalize quiz data to ensure correctAnswer is in the right format
      return normalizeQuizData(data)
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching quiz for module:', err)
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

      // Normalize all questions before saving:
      // - multiple_choice: correctAnswer as number (option index)
      // - true_false: correctAnswer as string ('true' or 'false')
      const normalizedQuestions = quiz.questions.map((q: QuizQuestion) => ({
        ...q,
        correctAnswer: normalizeCorrectAnswer(q),
      }))

      console.log('Saving questions with normalized correctAnswers:', normalizedQuestions)

      const { data, error: createError } = await supabase
        .from('quizzes')
        .insert({
          title: quiz.title,
          description: quiz.description,
          module_id: quiz.moduleId || null,
          level: quiz.level,
          questions: normalizedQuestions,
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
      // Normalize all questions before saving:
      // - multiple_choice: correctAnswer as number (option index)
      // - true_false: correctAnswer as string ('true' or 'false')
      const normalizedQuestions = quiz.questions.map((q: QuizQuestion) => ({
        ...q,
        correctAnswer: normalizeCorrectAnswer(q),
      }))

      console.log('Updating questions with normalized correctAnswers:', normalizedQuestions)

      const { data, error: updateError } = await supabase
        .from('quizzes')
        .update({
          title: quiz.title,
          description: quiz.description,
          module_id: quiz.moduleId || null,
          level: quiz.level,
          questions: normalizedQuestions,
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
  const submitQuizAnswers = async (quizId: string, answers: { [questionId: string]: string | number | undefined }) => {
    loading.value = true
    error.value = null

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Fetch the quiz to calculate score
      const quiz = await fetchQuizById(quizId)
      if (!quiz) throw new Error('Quiz not found')

      // Normalize answers to ensure consistent key format and types
      const normalizedAnswers: { [key: string]: string | number } = {}
      const submittedAnswersDebug: any[] = []

      quiz.questions.forEach((q: QuizQuestion | undefined, index: number) => {
        if (!q) return

        const keyByQuestionId = q.id
        const keyByIndex = String(index)

        let userAnswer = answers[keyByQuestionId] ?? answers[keyByIndex]

        if (userAnswer !== undefined && userAnswer !== null && userAnswer !== '') {
          let normalizedAnswer: string | number

          if (q.type === 'multiple_choice') {
            normalizedAnswer = parseInt(String(userAnswer), 10)
            if (isNaN(normalizedAnswer)) {
              console.warn(`Invalid multiple choice answer for question ${index}:`, userAnswer)
              return
            }
          } else if (q.type === 'true_false') {
            // Normalize to 'true' or 'false' string format
            normalizedAnswer = normalizeTrueFalseToString(userAnswer)
          } else {
            normalizedAnswer = String(userAnswer)
          }

          normalizedAnswers[keyByQuestionId || keyByIndex] = normalizedAnswer
          submittedAnswersDebug.push({
            questionIndex: index,
            questionId: q.id,
            questionText: q.question.substring(0, 50),
            userAnswer: normalizedAnswer,
            correctAnswer: q.correctAnswer,
          })
        }
      })

      // Calculate score with normalized answers
      let correctAnswers = 0
      const totalQuestions = quiz.questions.length
      const scoringDebug: any[] = []

      quiz.questions.forEach((q: QuizQuestion | undefined, index: number) => {
        if (!q) return

        const key = q.id ?? String(index)
        const userAnswer = normalizedAnswers[key]

        if (userAnswer !== undefined && userAnswer !== null) {
          let isCorrect = false

          if (q.type === 'multiple_choice') {
            const userAnswerNum = typeof userAnswer === 'number' ? userAnswer : parseInt(String(userAnswer), 10)
            const correctAnswerNum = parseInt(String(q.correctAnswer), 10)
            isCorrect = !isNaN(userAnswerNum) && !isNaN(correctAnswerNum) && userAnswerNum === correctAnswerNum
          } else if (q.type === 'true_false') {
            // Both normalized to 'true' or 'false' strings for comparison
            const userStr = String(userAnswer).toLowerCase().trim()
            const correctStr = String(q.correctAnswer).toLowerCase().trim()
            isCorrect = userStr === correctStr
            
            // Enhanced debugging for true/false
            console.log(`Q${index} (true_false) - User: "${userAnswer}" → "${userStr}", Correct: "${q.correctAnswer}" → "${correctStr}", Match: ${isCorrect}`)
          } else {
            isCorrect = String(userAnswer) === String(q.correctAnswer)
          }

          if (isCorrect) {
            correctAnswers++
          }

          scoringDebug.push({
            questionIndex: index,
            questionId: q.id,
            questionType: q.type,
            userAnswer,
            correctAnswer: q.correctAnswer,
            isCorrect,
          })
        } else {
          scoringDebug.push({
            questionIndex: index,
            questionId: q.id,
            userAnswer: 'NOT ANSWERED',
            correctAnswer: q.correctAnswer,
            isCorrect: false,
          })
        }
      })

      const score = Math.round((correctAnswers / totalQuestions) * 100)
      const passed = score >= (quiz.passing_score ?? 0)

      console.log('Quiz Submission Debug:', {
        quizId,
        submittedAnswers: submittedAnswersDebug,
        scoring: scoringDebug,
        correctAnswers,
        totalQuestions,
        score,
        passed,
      })

      // Save quiz result
      const { data, error: saveError } = await supabase
        .from('quiz_results')
        .upsert({
          user_id: user.id,
          quiz_id: quizId,
          score: score,
          passed: passed,
          answers: normalizedAnswers,
        }, { onConflict: 'user_id,quiz_id' })
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
    fetchQuizForModule,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    submitQuizAnswers,
  }
}
import { ref } from 'vue'

export interface QuizQuestion {
  id?: string
  question: string
  questionImageUrl?: string | null
  type: 'multiple_choice' | 'true_false'
  options: string[]
  correctAnswer: string | number
  explanation?: string
}

export interface Quiz {
  id?: string
  title: string
  description: string
  moduleId?: string | null
  level: 'beginner' | 'advanced'
  questions: QuizQuestion[]
  passingScore: number
  imageUrl?: string | null
  createdBy?: string
  createdAt?: string
  updatedAt?: string
}

const MAX_QUESTIONS_LAST_MODULE = 20
const DEFAULT_MAX_QUESTIONS = 10

/**
 * Returns true if the given moduleId is the last active module
 * for its level (highest numeric title).
 * Beginner last = Module 5, Advanced last = Module 10.
 */
const isLastModuleForLevel = async (
  supabase: any,
  moduleId: string,
  level: 'beginner' | 'advanced'
): Promise<boolean> => {
  try {
    const { data } = await supabase
      .from('modules')
      .select('id, title')
      .eq('level', level)
      .eq('is_active', true)

    if (!data || data.length === 0) return false

    // Sort by numeric part of title ascending, pick the last one
    const sorted = [...data].sort((a: any, b: any) => {
      const aNum = parseInt(a.title?.match(/\d+/)?.[0] || '0', 10)
      const bNum = parseInt(b.title?.match(/\d+/)?.[0] || '0', 10)
      return aNum - bNum
    })

    const lastModule = sorted[sorted.length - 1]
    return lastModule?.id === moduleId
  } catch {
    return false
  }
}

export const useQuizManagement = () => {
  const { $supabase } = useNuxtApp()
  const supabase = $supabase

  const quizzes = ref<Quiz[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const normalizeTrueFalseToString = (value: string | number | boolean): string => {
    const str = String(value).toLowerCase().trim()
    return str === 'true' || str === '1' || str === 'yes' ? 'true' : 'false'
  }

  const normalizeTrueFalseToInt = (value: string | number | boolean): number => {
    const str = String(value).toLowerCase().trim()
    return str === 'true' || str === '1' || str === 'yes' ? 1 : 0
  }

  const normalizeCorrectAnswer = (q: QuizQuestion): string | number => {
    if (q.type === 'multiple_choice') {
      return parseInt(String(q.correctAnswer), 10)
    } else if (q.type === 'true_false') {
      return normalizeTrueFalseToString(q.correctAnswer)
    }
    return String(q.correctAnswer)
  }

  const normalizeQuizData = (quiz: any): any => {
    if (!quiz || !quiz.questions) return quiz

    const normalizedQuestions = quiz.questions.map((q: any) => {
      if (!q) return q

      let normalizedAnswer: string | number

      if (q.type === 'multiple_choice') {
        normalizedAnswer = parseInt(String(q.correctAnswer), 10)
      } else if (q.type === 'true_false') {
        normalizedAnswer = normalizeTrueFalseToString(q.correctAnswer)
      } else {
        normalizedAnswer = String(q.correctAnswer)
      }

      return { ...q, correctAnswer: normalizedAnswer }
    })

    return { ...quiz, questions: normalizedQuestions }
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

      if (level) query = query.eq('level', level)

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
      return normalizeQuizData(data)
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching quiz:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Fetch quiz linked to a specific module
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

      // ── Enforce question limit ──────────────────────────────────
      if (quiz.moduleId) {
        const isLast = await isLastModuleForLevel(supabase, quiz.moduleId, quiz.level)
        const max = isLast ? MAX_QUESTIONS_LAST_MODULE : DEFAULT_MAX_QUESTIONS
        const label = quiz.level === 'beginner' ? 'Beginner Module 5' : 'Advanced Module 10'

        if (isLast && quiz.questions.length !== MAX_QUESTIONS_LAST_MODULE) {
          throw new Error(
            `${label} requires exactly ${MAX_QUESTIONS_LAST_MODULE} questions. You have ${quiz.questions.length}.`
          )
        }
        if (!isLast && quiz.questions.length > DEFAULT_MAX_QUESTIONS) {
          throw new Error(
            `This module allows a maximum of ${DEFAULT_MAX_QUESTIONS} questions. You have ${quiz.questions.length}.`
          )
        }
      }

      const normalizedQuestions = quiz.questions.map((q: QuizQuestion) => ({
        ...q,
        correctAnswer: normalizeCorrectAnswer(q),
      }))

      const { data, error: createError } = await supabase
        .from('quizzes')
        .insert({
          title: quiz.title,
          description: quiz.description,
          module_id: quiz.moduleId || null,
          level: quiz.level,
          questions: normalizedQuestions,
          passing_score: quiz.passingScore,
          image_url: quiz.imageUrl || null,
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
      // ── Enforce question limit ──────────────────────────────────
      if (quiz.moduleId) {
        const isLast = await isLastModuleForLevel(supabase, quiz.moduleId, quiz.level)
        const label = quiz.level === 'beginner' ? 'Beginner Module 5' : 'Advanced Module 10'

        if (isLast && quiz.questions.length !== MAX_QUESTIONS_LAST_MODULE) {
          throw new Error(
            `${label} requires exactly ${MAX_QUESTIONS_LAST_MODULE} questions. You have ${quiz.questions.length}.`
          )
        }
        if (!isLast && quiz.questions.length > DEFAULT_MAX_QUESTIONS) {
          throw new Error(
            `This module allows a maximum of ${DEFAULT_MAX_QUESTIONS} questions. You have ${quiz.questions.length}.`
          )
        }
      }

      const normalizedQuestions = quiz.questions.map((q: QuizQuestion) => ({
        ...q,
        correctAnswer: normalizeCorrectAnswer(q),
      }))

      const { data, error: updateError } = await supabase
        .from('quizzes')
        .update({
          title: quiz.title,
          description: quiz.description,
          module_id: quiz.moduleId || null,
          level: quiz.level,
          questions: normalizedQuestions,
          passing_score: quiz.passingScore,
          image_url: quiz.imageUrl || null,
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

      const quiz = await fetchQuizById(quizId)
      if (!quiz) throw new Error('Quiz not found')

      const normalizedAnswers: { [key: string]: string | number } = {}
      const submittedAnswersDebug: any[] = []

      quiz.questions.forEach((q: QuizQuestion | undefined, index: number) => {
        if (!q) return

        const keyByQuestionId = q.id
        const keyByIndex = String(index)
        const answerKey = keyByQuestionId || keyByIndex
        let userAnswer = answers[answerKey]

        if (userAnswer !== undefined && userAnswer !== null && userAnswer !== '') {
          let normalizedAnswer: string | number

          if (q.type === 'multiple_choice') {
            normalizedAnswer = parseInt(String(userAnswer), 10)
            if (isNaN(normalizedAnswer)) {
              console.warn(`Invalid multiple choice answer for question ${index}:`, userAnswer)
              return
            }
          } else if (q.type === 'true_false') {
            normalizedAnswer = normalizeTrueFalseToString(userAnswer)
          } else {
            normalizedAnswer = String(userAnswer)
          }

          normalizedAnswers[answerKey] = normalizedAnswer
          submittedAnswersDebug.push({
            questionIndex: index,
            questionId: q.id,
            questionText: q.question.substring(0, 50),
            userAnswer: normalizedAnswer,
            correctAnswer: q.correctAnswer,
          })
        }
      })

      let correctAnswers = 0
      const totalQuestions = quiz.questions.length
      const scoringDebug: any[] = []

      quiz.questions.forEach((q: QuizQuestion | undefined, index: number) => {
        if (!q) return

        const key = q.id ?? String(index)
        const userAnswer = normalizedAnswers[key] as string | number | undefined

        if (userAnswer !== undefined && userAnswer !== null) {
          let isCorrect = false

          if (q.type === 'multiple_choice') {
            const userAnswerNum: number = typeof userAnswer === 'number' ? userAnswer : parseInt(String(userAnswer), 10)
            const correctAnswerNum: number = parseInt(String(q.correctAnswer), 10)
            isCorrect = !isNaN(userAnswerNum) && !isNaN(correctAnswerNum) && userAnswerNum === correctAnswerNum
          } else if (q.type === 'true_false') {
            const userStr = String(userAnswer).toLowerCase().trim()
            const correctStr = String(q.correctAnswer).toLowerCase().trim()
            isCorrect = userStr === correctStr
            console.log(`Q${index} (true_false) - User: "${userAnswer}" → "${userStr}", Correct: "${q.correctAnswer}" → "${correctStr}", Match: ${isCorrect}`)
          } else {
            isCorrect = String(userAnswer) === String(q.correctAnswer)
          }

          if (isCorrect) correctAnswers++

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

      const { data, error: saveError } = await supabase
        .from('quiz_results')
        .upsert({
          user_id: user.id,
          quiz_id: quizId,
          score,
          passed,
          answers: normalizedAnswers,
        }, { onConflict: 'user_id,quiz_id' })
        .select()

      if (saveError) throw saveError

      return { score, passed, correctAnswers, totalQuestions }
    } catch (err: any) {
      error.value = err.message
      console.error('Error submitting quiz:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `quiz-images/${fileName}`

      const { data, error: uploadError } = await supabase.storage
        .from('quiz-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('quiz-images')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (err: any) {
      error.value = err.message || 'Failed to upload image'
      throw err
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
    uploadImage,
  }
}
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BASE_TUTORIALS, getTutorialById, Tutorial } from '@/lib/education/base-tutorials'
import { TUTORIAL_TRANSLATIONS } from '@/lib/education/tutorial-translations'
import { useWallet } from '@/contexts/WalletContext'
import { AchievementNotificationManager } from '@/components/gamification/AchievementNotification'

type Language = 'en' | 'fr' | 'sw'

const LANGUAGES = [
  { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
  { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
  { code: 'sw' as Language, name: 'Kiswahili', flag: '🇹🇿' },
]

export default function TutorialDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { address } = useWallet()
  const tutorialId = params.tutorialId as string
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [language, setLanguage] = useState<Language>('en')
  const [isCompleting, setIsCompleting] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<{ [stepIndex: number]: number }>({})
  const [completionResult, setCompletionResult] = useState<{
    pointsEarned: number
    achievementsUnlocked: string[]
  } | null>(null)
  const [showExam, setShowExam] = useState(false)
  const [examAnswers, setExamAnswers] = useState<{ [questionIndex: number]: number }>({})
  const [currentExamQuestion, setCurrentExamQuestion] = useState(0)
  const [examCompleted, setExamCompleted] = useState(false)
  const [examScore, setExamScore] = useState(0)

  const tutorial = getTutorialById(tutorialId)
  const translations = TUTORIAL_TRANSLATIONS[tutorialId]
  
  const currentTranslation = translations?.[language] || translations?.en
  const tutorialTitle = currentTranslation?.title || tutorial?.title || ''
  const tutorialDescription = currentTranslation?.description || tutorial?.description || ''
  const steps = currentTranslation?.steps || tutorial?.steps || []

  if (!tutorial && !translations) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Tutorial Not Found</h1>
          <button
            onClick={() => router.push('/learn')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-teal-600 transition-all"
          >
            Back to Learn
          </button>
        </div>
      </div>
    )
  }

  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const isQuiz = !!step.quizQuestion

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return
    setSelectedAnswer(answerIndex)
    setIsCorrect(answerIndex === step.quizQuestion?.correctAnswer)
    setShowResult(true)
    
    // Track quiz answer for scoring
    setQuizAnswers(prev => ({
      ...prev,
      [currentStep]: answerIndex
    }))
  }

  const handleNext = async () => {
    if (isLastStep) {
      // Show exam instead of completing immediately
      setShowExam(true)
      return
    }

    if (showResult) {
      setShowResult(false)
      setSelectedAnswer(null)
      setCurrentStep(prev => prev + 1)
    } else {
      // For non-quiz steps, just move to next step
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleExamAnswer = (answerIndex: number) => {
    setExamAnswers(prev => ({
      ...prev,
      [currentExamQuestion]: answerIndex
    }))
  }

  const handleExamNext = () => {
    if (!tutorial) return
    
    if (currentExamQuestion < tutorial.exam.questions.length - 1) {
      setCurrentExamQuestion(prev => prev + 1)
    } else {
      // Calculate exam score
      let correctAnswers = 0
      tutorial.exam.questions.forEach((question, index) => {
        if (examAnswers[index] === question.correctAnswer) {
          correctAnswers++
        }
      })
      const score = Math.round((correctAnswers / tutorial.exam.questions.length) * 100)
      setExamScore(score)
      setExamCompleted(true)
    }
  }

  const handleCompleteTutorial = async () => {
    if (!address) {
      alert('Please connect your wallet to complete the tutorial')
      return
    }

    // Only allow completion if exam score is 70% or above
    if (examScore < 70) {
      alert('You need to score at least 70% on the exam to complete the tutorial.')
      return
    }

    setIsCompleting(true)
    
    try {
      // Calculate quiz score from tutorial steps
      const quizSteps = steps.filter(step => step.quizQuestion)
      let correctAnswers = 0
      let totalQuizzes = quizSteps.length

      if (totalQuizzes > 0) {
        quizSteps.forEach((step, stepIndex) => {
          const userAnswer = quizAnswers[stepIndex]
          const correctAnswer = step.quizQuestion?.correctAnswer
          if (userAnswer === correctAnswer) {
            correctAnswers++
          }
        })
      }
      
      // Use exam score as the main score, fallback to quiz score
      const finalScore = examScore > 0 ? examScore : (totalQuizzes > 0 ? Math.round((correctAnswers / totalQuizzes) * 100) : 100)

      const response = await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userAddress: address, 
          tutorialId: tutorialId, 
          quizScore: finalScore 
        }),
      })

      const result = await response.json()
      if (result.success) {
        setCompletionResult({
          pointsEarned: result.data.pointsEarned,
          achievementsUnlocked: result.data.achievementsUnlocked,
        })
        setCompleted(true)
      } else {
        console.error('Error completing tutorial:', result.error)
        alert('Failed to complete tutorial. Please try again.')
      }
    } catch (error) {
      console.error('Error completing tutorial:', error)
      alert('Failed to complete tutorial. Please try again.')
    } finally {
      setIsCompleting(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  if (showExam) {
    if (!tutorial) return null
    
    const examQuestion = tutorial.exam.questions[currentExamQuestion]
    const isLastExamQuestion = currentExamQuestion === tutorial.exam.questions.length - 1
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-[1280px] mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => setShowExam(false)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Tutorial
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              📝 Final Exam: {tutorialTitle}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Question {currentExamQuestion + 1} of {tutorial.exam.questions.length}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentExamQuestion + 1) / tutorial.exam.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Exam Question */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl border border-white/40 dark:border-gray-700/40 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {examQuestion.question}
            </h2>
            
            <div className="space-y-4">
              {examQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleExamAnswer(index)}
                  className={`w-full p-4 text-left rounded-xl border transition-all ${
                    examAnswers[currentExamQuestion] === index
                      ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      examAnswers[currentExamQuestion] === index
                        ? 'border-cyan-500 bg-cyan-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {examAnswers[currentExamQuestion] === index && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-900 dark:text-white">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentExamQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentExamQuestion === 0}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <button
              onClick={handleExamNext}
              disabled={examAnswers[currentExamQuestion] === undefined}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLastExamQuestion ? 'Finish Exam' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (examCompleted) {
    const passed = examScore >= 70
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl border border-white/40 dark:border-gray-700/40 p-8 text-center">
            <div className="text-6xl mb-6">
              {passed ? '🎉' : '📚'}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {passed ? 'Exam Passed!' : 'Exam Failed'}
            </h1>
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
              Your Score: {examScore}%
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {passed 
                ? 'Congratulations! You\'ve passed the exam and can now complete the tutorial.' 
                : 'You need to score at least 70% to pass. Review the tutorial content and try again.'
              }
            </p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setShowExam(false)
                  setExamCompleted(false)
                  setCurrentExamQuestion(0)
                  setExamAnswers({})
                  setExamScore(0)
                }}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Retake Exam
              </button>
              
              {passed && (
                <button
                  onClick={handleCompleteTutorial}
                  disabled={isCompleting}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCompleting ? 'Completing...' : 'Complete Tutorial'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (completed) {
    const completionMessages = {
      en: {
        title: 'Tutorial Complete!',
        subtitle: 'You\'ve completed',
        pointsEarned: 'Points Earned',
        achievementsUnlocked: 'Achievements Unlocked',
        back: 'Back to Learn',
        achievements: 'View Achievements'
      },
      fr: {
        title: 'Tutoriel Terminé!',
        subtitle: 'Vous avez terminé',
        pointsEarned: 'Points Gagnés',
        achievementsUnlocked: 'Réalisations Débloquées',
        back: 'Retour à l\'Apprentissage',
        achievements: 'Voir les Réalisations'
      },
      sw: {
        title: 'Mafunzo Yamekamilika!',
        subtitle: 'Umekamilisha',
        pointsEarned: 'Alama Zilizopatikana',
        achievementsUnlocked: 'Mafanikio Yamefunguliwa',
        back: 'Rudi kwa Mafunzo',
        achievements: 'Angalia Mafanikio'
      }
    }
    
    const messages = completionMessages[language]
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8 flex items-center justify-center">
        {/* Achievement Notifications */}
        {completionResult && completionResult.achievementsUnlocked.length > 0 && (
          <AchievementNotificationManager
            achievements={completionResult.achievementsUnlocked}
            onAchievementsShown={() => {}}
          />
        )}
        
        <div className="max-w-2xl w-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl border border-white/40 dark:border-gray-700/40 p-8 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {messages.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            {messages.subtitle} "{tutorialTitle}"
          </p>
          
          {/* Points and Achievements Display */}
          {completionResult && (
            <div className="mb-8 space-y-4">
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl p-4">
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400 mb-1">
                  +{completionResult.pointsEarned} {messages.pointsEarned}
                </div>
                <div className="text-sm text-yellow-600 dark:text-yellow-500">
                  🏆 Added to your total score
                </div>
              </div>
              
              {completionResult.achievementsUnlocked.length > 0 && (
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-4">
                  <div className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
                    🎖️ {messages.achievementsUnlocked}
                  </div>
                  <div className="space-y-1">
                    {completionResult.achievementsUnlocked.map(achievementId => (
                      <div key={achievementId} className="text-sm text-green-600 dark:text-green-500">
                        • {achievementId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/learn')}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              {messages.back}
            </button>
            <button
              onClick={() => router.push('/achievements')}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-teal-600 transition-all"
            >
              {messages.achievements}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const uiText = {
    en: {
      back: 'Back to Learn',
      step: 'Step',
      of: 'of',
      complete: 'Complete',
      previous: 'Previous',
      next: 'Next',
      completeTutorial: 'Complete Tutorial'
    },
    fr: {
      back: 'Retour à l\'Apprentissage',
      step: 'Étape',
      of: 'de',
      complete: 'Complet',
      previous: 'Précédent',
      next: 'Suivant',
      completeTutorial: 'Terminer le Tutoriel'
    },
    sw: {
      back: 'Rudi kwa Mafunzo',
      step: 'Hatua',
      of: 'ya',
      complete: 'Kamili',
      previous: 'Iliyotangulia',
      next: 'Inayofuata',
      completeTutorial: 'Maliza Mafunzo'
    }
  }
  
  const text = uiText[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8 pb-24 md:pb-8">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/learn')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {text.back}
          </button>
          
          {/* Language Switcher */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">🌍</span>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  language === lang.code
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {lang.flag} {lang.name}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">{tutorial?.icon || '📚'}</div>
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {tutorialTitle}
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">{tutorialDescription}</p>
            </div>
          </div>
          {tutorial && (
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
              <span className={`px-3 py-1 rounded-full ${
                tutorial.difficulty === 'beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                tutorial.difficulty === 'intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              }`}>
                {tutorial.difficulty}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {tutorial.estimatedTime} min
              </span>
              {tutorial.africanContext && (
                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                  🌍 African Focus
                </span>
              )}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>{text.step} {currentStep + 1} {text.of} {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% {text.complete}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-cyan-500 to-teal-500 h-3 rounded-full transition-all"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl border border-white/40 dark:border-gray-700/40 p-6 md:p-8 mb-8">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {step.title}
          </h2>
          
          <div className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line mb-6">
            {step.content}
          </div>

          {/* Quiz */}
          {isQuiz && step.quizQuestion && (
            <div className="mt-8">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {step.quizQuestion.question}
                </h3>
                <div className="space-y-3">
                  {step.quizQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        showResult && index === step.quizQuestion!.correctAnswer
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : showResult && selectedAnswer === index && index !== step.quizQuestion!.correctAnswer
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-cyan-500 dark:hover:border-cyan-500'
                      }`}
                    >
                      <span className="font-medium text-gray-900 dark:text-white">
                        {String.fromCharCode(65 + index)}. {option}
                      </span>
                    </button>
                  ))}
                </div>
                {showResult && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    isCorrect
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  }`}>
                    <p className={`font-medium ${
                      isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                    }`}>
                      {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {step.quizQuestion.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-4 mb-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {text.previous}
          </button>
          <button
            onClick={handleNext}
            disabled={isQuiz && !showResult}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isCompleting ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Completing...
              </>
            ) : (
              isLastStep ? text.completeTutorial : text.next
            )}
          </button>
        </div>
      </div>
    </div>
  )
}


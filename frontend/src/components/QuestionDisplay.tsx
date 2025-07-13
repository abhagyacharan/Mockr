"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { MockSession } from "../App"

interface QuestionDisplayProps {
  mockSession: MockSession | null
  setMockSession: (session: MockSession) => void
}

export default function QuestionDisplay({ mockSession, setMockSession }: QuestionDisplayProps) {
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes per question
  const [isAnswered, setIsAnswered] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!mockSession) {
      navigate("/")
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion()
          return 300
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [mockSession])

  useEffect(() => {
    setCurrentAnswer("")
    setIsAnswered(false)
    setTimeLeft(300)
  }, [mockSession?.currentQuestionIndex])

  if (!mockSession) {
    return null
  }

  const currentQuestion = mockSession.questions[mockSession.currentQuestionIndex]
  const progress = ((mockSession.currentQuestionIndex + 1) / mockSession.totalQuestions) * 100

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (value: string) => {
    setCurrentAnswer(value)
  }

  const handleSubmitAnswer = () => {
    const updatedQuestions = [...mockSession.questions]
    updatedQuestions[mockSession.currentQuestionIndex] = {
      ...currentQuestion,
      userAnswer: currentAnswer,
    }

    let newScore = mockSession.score
    if (currentQuestion.type === "mcq" && currentAnswer === currentQuestion.correctAnswer) {
      newScore += currentQuestion.points || 0
    } else if (currentQuestion.type === "qa" && currentAnswer.trim().length > 20) {
      // Simple scoring for QA - in real app, this would be more sophisticated
      newScore += Math.floor((currentQuestion.points || 0) * 0.7)
    }

    setMockSession({
      ...mockSession,
      questions: updatedQuestions,
      score: newScore,
    })

    setIsAnswered(true)
  }

  const handleNextQuestion = () => {
    if (mockSession.currentQuestionIndex < mockSession.totalQuestions - 1) {
      setMockSession({
        ...mockSession,
        currentQuestionIndex: mockSession.currentQuestionIndex + 1,
      })
    } else {
      // Complete the session
      setMockSession({
        ...mockSession,
        isCompleted: true,
      })
      navigate("/results")
    }
  }

  const handlePreviousQuestion = () => {
    if (mockSession.currentQuestionIndex > 0) {
      setMockSession({
        ...mockSession,
        currentQuestionIndex: mockSession.currentQuestionIndex - 1,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Mock Interview</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span className={`font-mono ${timeLeft < 60 ? "text-red-600" : ""}`}>{formatTime(timeLeft)}</span>
              </div>
              <div className="text-sm text-gray-600">
                Question {mockSession.currentQuestionIndex + 1} of {mockSession.totalQuestions}
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Question {mockSession.currentQuestionIndex + 1}</span>
              <span className="text-sm font-normal text-gray-600">{currentQuestion.points} points</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-lg text-gray-900">{currentQuestion.question}</p>

              {currentQuestion.type === "mcq" ? (
                <RadioGroup value={currentAnswer} onValueChange={handleAnswerChange} disabled={isAnswered}>
                  {currentQuestion.options?.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                        isAnswered
                          ? option === currentQuestion.correctAnswer
                            ? "bg-green-50 border-green-200"
                            : option === currentAnswer && option !== currentQuestion.correctAnswer
                              ? "bg-red-50 border-red-200"
                              : "bg-gray-50 border-gray-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                      {isAnswered && option === currentQuestion.correctAnswer && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="qa-answer">Your Answer</Label>
                  <Textarea
                    id="qa-answer"
                    placeholder="Type your answer here..."
                    value={currentAnswer}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    disabled={isAnswered}
                    className="min-h-[150px]"
                  />
                  <p className="text-sm text-gray-500">{currentAnswer.length} characters (minimum 20 for scoring)</p>
                </div>
              )}

              {isAnswered && currentQuestion.type === "qa" && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Feedback:</strong> Your answer has been recorded. In a real interview, focus on being
                    specific, providing examples, and demonstrating your problem-solving approach.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePreviousQuestion} disabled={mockSession.currentQuestionIndex === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="space-x-4">
            {!isAnswered ? (
              <Button onClick={handleSubmitAnswer} disabled={!currentAnswer.trim()}>
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                {mockSession.currentQuestionIndex < mockSession.totalQuestions - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "View Results"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

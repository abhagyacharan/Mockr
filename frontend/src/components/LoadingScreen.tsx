"use client"

import { Brain, Loader2, CheckCircle, FileText, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"

interface LoadingScreenProps {
  isVisible: boolean
  progress: number
}

export default function LoadingScreen({ isVisible, progress }: LoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const steps = [
    { icon: FileText, text: "Analyzing your resume...", delay: 0 },
    { icon: Brain, text: "Generating AI questions...", delay: 1000 },
    { icon: Sparkles, text: "Personalizing content...", delay: 2000 },
    { icon: CheckCircle, text: "Almost ready!", delay: 3000 },
  ]

  useEffect(() => {
    if (!isVisible) return

    const intervals: NodeJS.Timeout[] = []

    steps.forEach((step, index) => {
      const timeout = setTimeout(() => {
        setCurrentStep(index)
        if (index > 0) {
          setCompletedSteps((prev) => [...prev, index - 1])
        }
      }, step.delay)
      intervals.push(timeout)
    })

    return () => {
      intervals.forEach(clearTimeout)
    }
  }, [isVisible])

  useEffect(() => {
    if (progress >= 100) {
      setCompletedSteps((prev) => [...prev, currentStep])
    }
  }, [progress, currentStep])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-8 animate-pulse">
          <Brain className="h-12 w-12 text-blue-600" />
          <span className="text-3xl font-bold text-gray-900">Mockr</span>
        </div>

        {/* Main loading animation */}
        <div className="mb-8">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div
              className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"
              style={{ animationDuration: "1s" }}
            ></div>
            <div className="absolute inset-4 bg-blue-50 rounded-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full bg-white/30 animate-pulse"></div>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-2">{progress}% Complete</div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === index
            const isCompleted = completedSteps.includes(index)

            return (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-500 ${
                  isActive
                    ? "bg-blue-50 border border-blue-200 scale-105"
                    : isCompleted
                      ? "bg-green-50 border border-green-200"
                      : "bg-white/50 border border-gray-200"
                } ${isActive || isCompleted ? "opacity-100" : "opacity-60"}`}
                style={{
                  transform: isActive ? "translateX(8px)" : "translateX(0)",
                }}
              >
                <div
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isCompleted ? "bg-green-100" : isActive ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isCompleted ? "text-green-600" : isActive ? "text-blue-600" : "text-gray-400"
                    } ${isActive ? "animate-pulse" : ""}`}
                  />
                </div>
                <span
                  className={`text-sm font-medium ${
                    isCompleted ? "text-green-700" : isActive ? "text-blue-700" : "text-gray-500"
                  }`}
                >
                  {step.text}
                </span>
                {isCompleted && <CheckCircle className="h-4 w-4 text-green-600 ml-auto animate-bounce" />}
              </div>
            )
          })}
        </div>

        {/* Fun fact */}
        <div className="mt-8 p-4 bg-white/70 rounded-lg border border-white/50 backdrop-blur-sm">
          <p className="text-xs text-gray-600 italic">
            💡 Did you know? Our AI analyzes over 50 different aspects of your resume to create personalized questions!
          </p>
        </div>
      </div>
    </div>
  )
}

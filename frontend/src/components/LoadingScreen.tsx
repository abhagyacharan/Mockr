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
            className="absolute w-2 sm:w-3 h-2 sm:h-3 bg-blue-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-md sm:max-w-xl mx-auto px-4 sm:px-8">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-8 sm:mb-12 animate-pulse">
          <Brain className="h-10 w-10 sm:h-16 sm:w-16 text-blue-600" />
          <span className="text-3xl sm:text-5xl font-extrabold text-gray-900">Mockr</span>
        </div>

        {/* Spinner */}
        <div className="mb-8 sm:mb-12">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div
              className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"
              style={{ animationDuration: "1s" }}
            ></div>
            <div className="absolute inset-4 sm:inset-6 bg-blue-50 rounded-full flex items-center justify-center">
              <Loader2 className="h-6 w-6 sm:h-10 sm:w-10 text-blue-600 animate-spin" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-300 rounded-full h-3 sm:h-4 mb-3 sm:mb-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full bg-white/30 animate-pulse"></div>
            </div>
          </div>

          <div className="text-sm sm:text-lg text-gray-700 font-medium mb-4">
            {Math.round(progress)}% Complete
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3 sm:space-y-5 text-left">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === index
            const isCompleted = completedSteps.includes(index)

            return (
              <div
                key={index}
                className={`flex items-center space-x-3 sm:space-x-4 p-3 sm:p-5 rounded-lg sm:rounded-xl transition-all duration-500 shadow ${
                  isActive
                    ? "bg-blue-100 border border-blue-300 sm:scale-[1.03]"
                    : isCompleted
                      ? "bg-green-100 border border-green-300"
                      : "bg-white/60 border border-gray-200"
                } ${isActive || isCompleted ? "opacity-100" : "opacity-70"}`}
                style={{
                  transform: isActive && window.innerWidth >= 640 ? "translateX(10px)" : "translateX(0)",
                }}
              >
                <div
                  className={`p-2 sm:p-3 rounded-full transition-all duration-300 ${
                    isCompleted ? "bg-green-200" : isActive ? "bg-blue-200" : "bg-gray-200"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 sm:h-6 sm:w-6 ${
                      isCompleted ? "text-green-600" : isActive ? "text-blue-600" : "text-gray-500"
                    } ${isActive ? "animate-pulse" : ""}`}
                  />
                </div>
                <span
                  className={`text-sm sm:text-lg font-semibold ${
                    isCompleted ? "text-green-800" : isActive ? "text-blue-800" : "text-gray-600"
                  }`}
                >
                  {step.text}
                </span>
                {isCompleted && (
                  <CheckCircle className="hidden sm:block h-5 w-5 text-green-600 ml-auto animate-bounce" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader } from "../components/ui/card"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { Upload, FileText, Loader2, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { MockSession } from "../App"

interface UploadInterfaceProps {
  setMockSession: (session: MockSession) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  isLoading: boolean
  error: string | null
}

export default function UploadInterface({
  setMockSession,
  setIsLoading,
  setError,
  isLoading,
  error,
}: UploadInterfaceProps) {
  const [activeTab, setActiveTab] = useState<"resume" | "jd">("resume")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (
        file.type === "application/pdf" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setResumeFile(file)
        setError(null)
      } else {
        setError("Please upload a PDF or DOCX file")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (
        file.type === "application/pdf" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setResumeFile(file)
        setError(null)
      } else {
        setError("Please upload a PDF or DOCX file")
      }
    }
  }

  const generateMockQuestions = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock response data
      const mockSession: MockSession = {
        id: "session-" + Date.now(),
        currentQuestionIndex: 0,
        score: 0,
        totalQuestions: 5,
        isCompleted: false,
        questions: [
          {
            id: "1",
            type: "mcq",
            question: "What is the time complexity of binary search?",
            options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
            correctAnswer: "O(log n)",
            points: 10,
          },
          {
            id: "2",
            type: "qa",
            question: "Explain the difference between let, const, and var in JavaScript.",
            points: 15,
          },
          {
            id: "3",
            type: "mcq",
            question: "Which HTTP status code indicates a successful request?",
            options: ["404", "500", "200", "301"],
            correctAnswer: "200",
            points: 10,
          },
          {
            id: "4",
            type: "qa",
            question: "Describe your experience with React hooks and provide an example.",
            points: 20,
          },
          {
            id: "5",
            type: "mcq",
            question: "What does REST stand for?",
            options: [
              "Representational State Transfer",
              "Remote State Transfer",
              "Relational State Transfer",
              "Reactive State Transfer",
            ],
            correctAnswer: "Representational State Transfer",
            points: 10,
          },
        ],
      }

      setMockSession(mockSession)
      navigate("/questions")
    } catch (err) {
      setError("Failed to generate questions. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const canSubmit = () => {
    if (activeTab === "resume") {
      return resumeFile !== null
    } else {
      return jobDescription.trim().length > 50
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Information</h1>
          <p className="text-gray-600">
            Upload your resume or provide a job description to generate personalized mock interview questions
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "resume" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("resume")}
              >
                Upload Resume
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "jd" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("jd")}
              >
                Job Description
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === "resume" ? (
              <div className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-900">
                      {resumeFile ? resumeFile.name : "Drop your resume here"}
                    </p>
                    <p className="text-gray-600">
                      or{" "}
                      <button
                        className="text-blue-600 hover:text-blue-500 font-medium"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        browse files
                      </button>
                    </p>
                    <p className="text-sm text-gray-500">Supports PDF and DOCX files</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                  />
                </div>
                {resumeFile && (
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <FileText className="h-4 w-4" />
                    <span>Resume uploaded successfully</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <Label htmlFor="job-description">Job Description</Label>
                <Textarea
                  id="job-description"
                  placeholder="Paste the job description here... Include requirements, responsibilities, and any specific skills mentioned."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px]"
                />
                <p className="text-sm text-gray-500">{jobDescription.length}/50 characters minimum</p>
              </div>
            )}
          </CardContent>
        </Card>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => navigate("/")} disabled={isLoading}>
            Back
          </Button>
          <Button onClick={generateMockQuestions} disabled={!canSubmit() || isLoading} className="min-w-[200px]">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Questions...
              </>
            ) : (
              "Generate Mock Questions"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

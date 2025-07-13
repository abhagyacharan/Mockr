"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Loader2, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { MockSession } from "../App"

const API_BASE_URL = "http://localhost:8000" // adjust if needed

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
    const file = e.dataTransfer.files?.[0]
    if (file && (file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setResumeFile(file)
      setError(null)
    } else {
      setError("Please upload a PDF or DOCX file")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && (file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setResumeFile(file)
      setError(null)
    } else {
      setError("Please upload a PDF or DOCX file")
    }
  }

  const generateMockQuestions = async () => {
    setIsLoading(true)
    setError(null)

    try {
      let response: Response

      if (activeTab === "resume" && resumeFile) {
        const formData = new FormData()
        formData.append("file", resumeFile)

        response = await fetch(`${API_BASE_URL}/upload/resume`, {
          method: "POST",
          body: formData,
          // headers: { Authorization: `Bearer ${yourToken}` }, // add token if needed
        })
      } else if (activeTab === "jd" && jobDescription.trim().length > 50) {
        response = await fetch(`${API_BASE_URL}/upload/job-description`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${yourToken}`, // add token if needed
          },
          body: JSON.stringify({ job_description: jobDescription }),
        })
      } else {
        throw new Error("Invalid input. Provide a resume or job description.")
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to generate questions")
      }

      const session = await response.json()

      const processedQuestions = session.questions.map((q: any, index: number) => ({
        id: index.toString(),
        type: q.type || "mcq",
        question: q.question,
        options: q.options || [],
        correctAnswer: q.answer || "",
        points: 10,
      }))

      const mockSession: MockSession = {
        id: session.id,
        currentQuestionIndex: 0,
        score: 0,
        totalQuestions: session.total_questions,
        isCompleted: false,
        questions: processedQuestions,
      }

      setMockSession(mockSession)
      navigate("/questions")
    } catch (err: any) {
      setError(err.message || "An error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const canSubmit = () => {
    return activeTab === "resume" ? resumeFile !== null : jobDescription.trim().length > 50
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

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-6 bg-white border-gray-200">
          <div className="p-6">
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
          </div>
          <div className="p-6 pt-0">
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
                <label
                  htmlFor="job-description"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Job Description
                </label>
                <textarea
                  id="job-description"
                  placeholder="Paste the job description here... Include requirements, responsibilities, and any specific skills mentioned."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[200px] border-gray-300 bg-white focus-visible:ring-blue-500"
                />
                <p className="text-sm text-gray-500">{jobDescription.length}/50 characters minimum</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate("/")}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-900"
          >
            Back
          </button>
          <button
            onClick={generateMockQuestions}
            disabled={!canSubmit() || isLoading}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 min-w-[200px] bg-blue-600 text-white hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Questions...
              </>
            ) : (
              "Generate Mock Questions"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

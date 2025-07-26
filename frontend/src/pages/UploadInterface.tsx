"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Upload, FileText, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { MockSession } from "../App";
import DifficultySelector from "../components/ChooseDifficulty";
import PracticeModeSelector from "../components/PracticeModeSelector";

import { useMockSession } from "@/context/MockSessionContext";
import LoadingScreen from "../components/LoadingScreen"; // ✅ Import the new component
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const API_BASE_URL = "http://localhost:8000/api";

type UploadInterfaceProps = {
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isLoading: boolean;
  error: string | null;
};

export default function UploadInterface({
  setIsLoading,
  setError,
  isLoading,
  error,
}: UploadInterfaceProps) {
  const [activeTab, setActiveTab] = useState<"resume" | "jd">("resume");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [mockName, setMockName] = useState("");
  const [numQuestions, setNumQuestions] = useState(10);
  const [practiceMode, setPracticeMode] = useState<"mcq" | "qa">("mcq");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "easy" | "medium" | "hard"
  >("medium");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setMockSession } = useMockSession();

  // ✅ Loading screen state
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const [focusAreas, setFocusAreas] = useState<string[]>([])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const toggleFocusArea = (area: string) => {
    setFocusAreas((prev) => (prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      setResumeFile(file);
      setError(null);
    } else {
      setError("Please upload a PDF or DOCX file");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      setResumeFile(file);
      setError(null);
    } else {
      setError("Please upload a PDF or DOCX file");
    }
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 5;
      });
    }, 300);
    return interval;
  };

  const generateMockQuestions = async () => {
    setIsLoading(true);
    setError(null);
    setLoadingVisible(true);
    const interval = simulateProgress(); // Start progress animation

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found. Please log in.");

      let response: Response;

      if (activeTab === "resume" && resumeFile) {
        const formData = new FormData();
        formData.append("file", resumeFile);
        formData.append("mock_name", mockName);
        formData.append("num_questions", numQuestions.toString());
        formData.append("difficulty", selectedDifficulty);
        formData.append("practice_mode", practiceMode);

        response = await fetch(`${API_BASE_URL}/resumes/upload/`, {
          method: "POST",
          body: formData,
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (activeTab === "jd" && jobDescription.trim().length > 50) {
        const formData = new FormData();
        formData.append("title", mockName || "Untitled JD");
        formData.append("company", ""); // optional, or collect from user
        formData.append("content", jobDescription);
        formData.append("mock_name", mockName || "Untitled JD");
        formData.append("num_questions", numQuestions.toString());
        formData.append("difficulty", selectedDifficulty);
        formData.append("practice_mode", practiceMode);

        response = await fetch(`${API_BASE_URL}/job-descriptions/upload/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ DO NOT set Content-Type
          },
          body: formData,
        });
        console.log(response);
      } else {
        throw new Error("Invalid input. Provide a resume or job description.");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate questions");
      }

      const session = await response.json();

      const processedQuestions = session.questions.map(
        (q: any, index: number) => ({
          id: index.toString(),
          type: q.type || "mcq",
          question: q.question,
          options: q.options || [],
          correctAnswer: q.answer || "",
          points: 10,
        })
      );

      const mockSession: MockSession = {
        id: session.id,
        practice_mode: session.practice_mode,
        currentQuestionIndex: 0,
        score: 0,
        totalQuestions: session.total_questions,
        isCompleted: false,
        questions: processedQuestions,
      };

      setProgress(100); // Show full progress bar
      clearInterval(interval);

      setTimeout(() => {
        setMockSession(mockSession);
        navigate("/questions");
      }, 1200); // slight delay for smooth UX
    } catch (err: any) {
      setError(err.message || "An error occurred.");
      clearInterval(interval);
      setLoadingVisible(false);
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = () => {
    return activeTab === "resume"
      ? resumeFile !== null
      : jobDescription.trim().length > 50;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative">
      {/* ✅ Loading overlay */}
      <LoadingScreen isVisible={loadingVisible} progress={progress} />

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Your Information
          </h1>
          <p className="text-gray-600">
            Upload your resume or provide a job description to generate
            personalized mock interview questions
          </p>
        </div>

        <div className="rounded-lg border text-card-foreground shadow-sm mb-6 bg-white border-gray-200">
          <div className="p-6">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "resume"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("resume")}
              >
                Upload Resume
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "jd"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
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
                <div className="flex gap-4 items-end">
                  <div className="w-[70%]">
                    <label
                      htmlFor="mock-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mock Name
                    </label>
                    <input
                      type="text"
                      id="mock-name"
                      value={mockName}
                      onChange={(e) => setMockName(e.target.value)}
                      placeholder="e.g. Full Stack Developer"
                      className="w-full rounded-md border px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="w-[30%]">
                    <label
                      htmlFor="num-questions"
                      className="block text-sm font-medium text-gray-700"
                    >
                      # Questions
                    </label>
                    <input
                      type="number"
                      id="num-questions"
                      min={1}
                      max={50}
                      placeholder="e.g. 10"
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
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
                        className="text-blue-600 hover:text-blue-500 font-medium cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        browse files
                      </button>
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports PDF and DOCX files
                    </p>
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
                <PracticeModeSelector
                  practiceMode={practiceMode}
                  setPracticeMode={setPracticeMode}
                />
                <DifficultySelector
                  selectedDifficulty={selectedDifficulty}
                  setSelectedDifficulty={setSelectedDifficulty}
                />

                <div className="space-y-4">
                  <Label className="text-lg font-medium">
                    Focus Areas (Optional)
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      "Technical Skills",
                      "Leadership",
                      "Problem Solving",
                      "Communication",
                      "System Design",
                      "Behavioral",
                      "Culture Fit",
                      "Industry Knowledge",
                    ].map((area) => (
                      <Button
                        key={area}
                        variant={
                          focusAreas.includes(area) ? "default" : "outline"
                        }
                        onClick={() => toggleFocusArea(area)}
                        className="h-12"
                      >
                        {area}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="w-[70%]">
                    <label
                      htmlFor="mock-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mock Name
                    </label>
                    <input
                      type="text"
                      id="mock-name"
                      value={mockName}
                      onChange={(e) => setMockName(e.target.value)}
                      placeholder="e.g. Full Stack Developer"
                      className="w-full rounded-md border px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="w-[30%]">
                    <label
                      htmlFor="num-questions"
                      className="block text-sm font-medium text-gray-700"
                    >
                      # Questions
                    </label>
                    <input
                      type="number"
                      id="num-questions"
                      min={1}
                      max={50}
                      placeholder="e.g. 10"
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(Number(e.target.value))}
                    />
                  </div>
                </div>

                <label
                  htmlFor="job-description"
                  className="text-sm font-medium leading-none"
                >
                  Job Description
                </label>
                <textarea
                  id="job-description"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full min-h-[100px] rounded-md border px-3 py-2 text-sm"
                />
                <p className="text-sm text-gray-500">
                  {jobDescription.length}/50 characters minimum
                </p>
                <PracticeModeSelector
                  practiceMode={practiceMode}
                  setPracticeMode={setPracticeMode}
                />
                <DifficultySelector
                  selectedDifficulty={selectedDifficulty}
                  setSelectedDifficulty={setSelectedDifficulty}
                />
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
            onClick={() => navigate("/dashboard")}
            disabled={isLoading}
            className="border bg-white text-gray-900 h-10 px-4 py-2 rounded-md text-sm"
          >
            Back
          </button>
          <button
            onClick={generateMockQuestions}
            disabled={!canSubmit() || isLoading}
            className="bg-blue-600 text-white h-10 px-4 py-2 rounded-md text-sm min-w-[200px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Mock Questions"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

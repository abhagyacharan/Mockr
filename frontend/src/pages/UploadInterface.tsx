"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMockSession } from "@/context/MockSessionContext";
import type { MockSession } from "../App";

import LoadingScreen from "../components/LoadingScreen";
import PracticeModeSelector from "../components/PracticeModeSelector";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { API_BASE_URL } from "@/lib/api";

type UploadInterfaceProps = {
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isLoading: boolean;
  error: string | null;
};

type Difficulty = "easy" | "medium" | "hard";
type PracticeMode = "mcq" | "qa";

const focusAreaList = [
  "Technical Skills",
  "Leadership",
  "Problem Solving",
  "Communication",
  "System Design",
  "Behavioral",
  "Culture Fit",
  "Industry Knowledge",
];

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
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("mcq");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("medium");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);

  const [loadingVisible, setLoadingVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setMockSession } = useMockSession();

  const toggleFocusArea = (area: string) => {
    setFocusAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      setResumeFile(file);
      setError(null);
    } else {
      setError("Please upload a PDF or DOCX file");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange({ target: { files: [file] } } as any);
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
    const interval = simulateProgress();

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found. Please log in.");

      let response: Response;
      const formData = new FormData();

      formData.append("mock_name", mockName || "Untitled");
      formData.append("num_questions", numQuestions.toString());
      formData.append("difficulty", selectedDifficulty);
      formData.append("practice_mode", practiceMode);
      focusAreas.forEach((area) => formData.append("focus_areas", area));

      if (activeTab === "resume" && resumeFile) {
        formData.append("file", resumeFile);
        response = await fetch(`${API_BASE_URL}/api/resumes/upload/`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      } else if (activeTab === "jd" && jobDescription.trim().length > 50) {
        formData.append("title", mockName || "Untitled JD");
        formData.append("content", jobDescription);
        response = await fetch(`${API_BASE_URL}/api/job-descriptions/upload/`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      } else {
        throw new Error("Invalid input. Please provide valid data.");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate questions.");
      }

      const session = await response.json();

      const processedQuestions = session.questions.map((q: any, i: number) => ({
        id: i.toString(),
        type: q.type || "mcq",
        question: q.question,
        options: q.options || [],
        correctAnswer: q.answer || "",
        points: 10,
      }));

      const mockSession: MockSession = {
        id: session.id,
        practice_mode: session.practice_mode,
        currentQuestionIndex: 0,
        score: 0,
        totalQuestions: session.total_questions,
        isCompleted: false,
        questions: processedQuestions,
      };

      setProgress(100);
      clearInterval(interval);
      setTimeout(() => {
        setMockSession(mockSession);
        navigate("/questions");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoadingVisible(false);
      clearInterval(interval);
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = () =>
    activeTab === "resume" ? !!resumeFile : jobDescription.trim().length > 50;

  const renderFocusAreas = () => (
    <div className="space-y-4">
      <Label className="text-lg font-medium">Focus Areas (Optional)</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {focusAreaList.map((area) => (
          <Button
            key={area}
            variant={focusAreas.includes(area) ? "default" : "outline"}
            onClick={() => toggleFocusArea(area)}
            className="h-12 cursor-pointer"
          >
            {area}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
  <div className="min-h-screen bg-gray-50 py-4 sm:py-8 relative">
    <LoadingScreen isVisible={loadingVisible} progress={progress} />

    <div className="container mx-auto px-4 max-w-5xl">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Upload Your Information
        </h1>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          Upload your resume or a job description to generate personalized
          mock interview questions
        </p>
      </div>

      <div className="rounded-lg border bg-white shadow-sm border-gray-200 mb-6">
        <div className="p-4 sm:p-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {["resume", "jd"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as "resume" | "jd")}
                className={`flex-1 py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab === "resume" ? "Resume" : "Job Description"}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6 pt-0 space-y-4 sm:space-y-6">
          {/* Form inputs - responsive layout */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-end">
            <div className="w-full sm:w-[50%]">
              <Label className="mb-1 text-sm" htmlFor="mock-name">
                Mock Name
              </Label>
              <input
                type="text"
                id="mock-name"
                value={mockName}
                onChange={(e) => setMockName(e.target.value)}
                placeholder="e.g. Frontend Engineer"
                className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="w-full sm:w-[25%]">
              <Label className="mb-1 text-sm">Difficulty</Label>
              <Select
                value={selectedDifficulty}
                onValueChange={(value) =>
                  setSelectedDifficulty(value as Difficulty)
                }
              >
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-[25%]">
              <Label className="mb-1 text-sm" htmlFor="num-questions">
                # Questions
              </Label>
              <input
                type="number"
                id="num-questions"
                min={1}
                max={50}
                placeholder="e.g. 10"
                className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === "resume" ? (
            <>
              <div
                className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors ${
                  dragActive
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
                <p className="text-base sm:text-lg font-medium text-gray-900 mb-1">
                  {resumeFile ? resumeFile.name : "Drop your resume here"}
                </p>
                <p className="text-sm sm:text-base text-gray-600 mb-2">
                  or{" "}
                  <button
                    className="text-blue-600 hover:text-blue-500 font-medium"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    browse files
                  </button>
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Supports PDF and DOCX files
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                />
              </div>
              {resumeFile && (
                <div className="flex items-center space-x-2 text-sm text-green-600 p-3 bg-green-50 rounded-lg">
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  <span className="break-all">Resume uploaded successfully</span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <Label htmlFor="job-description" className="text-sm">
                  Job Description
                </Label>
                <p className="text-xs sm:text-sm text-gray-500">
                  {jobDescription.length}/50 characters minimum
                </p>
              </div>
              <textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full min-h-[120px] sm:min-h-[119px] rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
              />
            </>
          )}

          <PracticeModeSelector
            practiceMode={practiceMode}
            setPracticeMode={setPracticeMode}
          />

          {renderFocusAreas()}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm sm:text-base text-red-700 break-words">
              {error}
            </span>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
        <Button
          onClick={() => navigate("/dashboard")}
          variant={"outline"}
          size={"lg"}
          disabled={isLoading}
          className="w-full sm:w-auto border bg-white text-gray-900 h-10 sm:h-11 px-4 py-2 rounded-md text-sm sm:text-base cursor-pointer order-2 sm:order-1"
        >
          Back
        </Button>
        <Button
          onClick={generateMockQuestions}
          variant={"default"}
          size={"lg"}
          disabled={!canSubmit() || isLoading}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white h-10 sm:h-11 px-4 py-2 text-sm sm:text-base min-w-[200px] cursor-pointer order-1 sm:order-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span className="hidden sm:inline">Generating...</span>
              <span className="sm:hidden">Generating...</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Generate Mock Questions</span>
              <span className="sm:hidden">Generate Questions</span>
            </>
          )}
        </Button>
      </div>
    </div>
  </div>
);
}

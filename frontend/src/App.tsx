// App.tsx
"use client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UploadInterface from "./pages/UploadInterface";
import QuestionDisplay from "./pages/QuestionDisplay";
import ResultsPage from "./pages/ResultsPage";
import { useState } from "react";
import AuthModal from "./components/AuthModal";
import SessionResults from "./pages/SessionResult";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import HistoryPage from "./pages/HistoryPage";
import { MockSessionProvider } from "./context/MockSessionContext";
import { AuthProvider } from "./context/AuthContext";

export interface Question {
  id: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  userAnswer?: string;
  score?: number;
  is_correct?: "correct" | "incorrect" | "ungraded";
  feedback?: string;
  detailed_feedback?: {
    strengths?: string[];
    improvements?: string[];
  } | null;
}

export interface MockSession {
  practice_mode: "mcq" | "qa" | "open";
  id: string;
  questions: Question[];
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number;
  difficulty_level?: string;
  isCompleted?: boolean;
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthProvider>
        <MockSessionProvider>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <LandingPage
                    setIsAuthModalOpen={setIsAuthModalOpen}
                    setAuthMode={setAuthMode}
                  />
                }
              />

              <Route path="/" element={<DashboardLayout />}>
                <Route path="dashboard" element={<DashboardHome />} />
                <Route
                  path="upload"
                  element={
                    <UploadInterface
                      setIsLoading={setIsLoading}
                      setError={setError}
                      isLoading={isLoading}
                      error={error}
                    />
                  }
                />
                <Route path="history" element={<HistoryPage />} />
              </Route>

              <Route path="/questions" element={<QuestionDisplay />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/results/:sessionId" element={<SessionResults />} />
            </Routes>
            <AuthModal
              isOpen={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
              mode={authMode}
              setMode={setAuthMode}
            />
          </Router>
        </MockSessionProvider>
      </AuthProvider>
    </div>
  );
}

export default App;

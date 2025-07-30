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
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");

  return (
    <div className="min-h-screen bg-gray-50">
      <MockSessionProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <LandingPage
                  setIsAuthModalOpen={setIsAuthModalOpen}
                  setAuthMode={setAuthMode}
                  user={user}
                />
              }
            />

            {/* Dashboard and children */}
            <Route path="/" element={<DashboardLayout />}>
              <Route
                path="dashboard"
                element={<DashboardHome />}
              />
              <Route
                path="uploadinterface"
                element={
                  <UploadInterface
                    setIsLoading={setIsLoading}
                    setError={setError}
                    isLoading={isLoading}
                    error={error}
                  />
                }
              />
              <Route
                path="history"
                element={<HistoryPage user={user} setUser={setUser} />}
              />
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
            setUser={setUser}
          />
        </Router>
      </MockSessionProvider>
    </div>
  );
}

export default App;

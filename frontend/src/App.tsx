"use client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UploadInterface from "./pages/UploadInterface";
import QuestionDisplay from "./pages/QuestionDisplay";
import ResultsPage from "./pages/ResultsPage";
import { useState } from "react";
import AuthModal from "./components/AuthModal";
import Dashboard from "./pages/Dashboard";
import SessionResults from "./pages/SessionResult";
// import PrivateRoute from "./context/PrivateRoute";

import { MockSessionProvider } from "./context/MockSessionContext";
import HistoryPage from "./pages/HistoryPage";

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
            <Route
              path="/upload"
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
              path="/history"
              element={<HistoryPage user={user} setUser={setUser} />}
            />
            <Route path="/questions" element={<QuestionDisplay />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route
              path="/dashboard"
              element={<Dashboard user={user} setUser={setUser} />}
            />
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

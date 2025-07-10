"use client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UploadInterface from "./pages/UploadInterface";
import QuestionDisplay from "./pages/QuestionDisplay";
import ResultsPage from "./pages/ResultsPage";
import { useState } from "react";
import AuthModal from "./pages/AuthModal";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

// Mock data types for development
export interface Question {
  id: string;
  type: "mcq" | "qa";
  question: string;
  options?: string[];
  correctAnswer?: string;
  userAnswer?: string;
  points?: number;
}

export interface MockSession {
  id: string;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  totalQuestions: number;
  isCompleted: boolean;
}

function App() {
  const [mockSession, setMockSession] = useState<MockSession | null>(null);
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
                setMockSession={setMockSession}
                setIsLoading={setIsLoading}
                setError={setError}
                isLoading={isLoading}
                error={error}
              />
            }
          />
          <Route
            path="/questions"
            element={
              <QuestionDisplay
                mockSession={mockSession}
                setMockSession={setMockSession}
              />
            }
          />
          <Route
            path="/results"
            element={<ResultsPage mockSession={mockSession} />}
          />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard user={user} setUser={setUser}/></ProtectedRoute>}
          />
        </Routes>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          mode={authMode}
          setMode={setAuthMode}
          setUser={setUser}
        />
      </Router>
    </div>
  );
}

export default App;

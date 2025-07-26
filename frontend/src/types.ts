export interface Question {
  id: string;
  type: "mcq" | "qa" | "open"; // include 'open' if supported
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
  id: string;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  totalQuestions: number;
  isCompleted: boolean;
}
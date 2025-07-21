"use client";

import {
  Trophy,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useMockSession } from "@/context/MockSessionContext";

export default function ResultsPage() {
  const navigate = useNavigate();
  const { mockSession } = useMockSession();

  if (!mockSession) {
    navigate("/");
    return null;
  }

  const totalPossiblePoints = mockSession.totalQuestions * 100;
  const scorePercentage = (mockSession.score / totalPossiblePoints) * 100;
  const correctAnswers = mockSession.questions.filter((q) => {
    if (q.type === "mcq") {
      return q.userAnswer === q.correctAnswer;
    } else {
      return q.userAnswer && q.userAnswer.trim().length > 20;
    }
  }).length;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreGrade = (percentage: number) => {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 80) return "Good";
    if (percentage >= 70) return "Average";
    if (percentage >= 60) return "Below Average";
    return "Needs Improvement";
  };

  const getRecommendations = (percentage: number) => {
    if (percentage >= 80) {
      return [
        "Great job! You're well-prepared for interviews.",
        "Continue practicing with different question types.",
        "Focus on articulating your thoughts clearly and concisely.",
      ];
    } else if (percentage >= 60) {
      return [
        "Good foundation, but there's room for improvement.",
        "Review fundamental concepts in your field.",
        "Practice explaining complex topics in simple terms.",
        "Work on time management during responses.",
      ];
    } else {
      return [
        "Consider additional preparation before interviews.",
        "Review basic concepts and common interview questions.",
        "Practice with mock interviews regularly.",
        "Focus on understanding rather than memorizing answers.",
        "Consider taking relevant courses or tutorials.",
      ];
    }
  };

  function getScoreBadgeVariant(scorePercentage: number): string {
    if (scorePercentage >= 90) return "bg-green-200 text-green-800";
    if (scorePercentage >= 70) return "bg-yellow-200 text-yellow-800";
    if (scorePercentage >= 50) return "bg-orange-200 text-orange-800";
    return "bg-red-200 text-red-800";
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div
              className={`p-4 rounded-full ${
                scorePercentage >= 70 ? "bg-green-100" : "bg-yellow-100"
              }`}
            >
              <Trophy
                className={`h-12 w-12 ${
                  scorePercentage >= 70 ? "text-green-600" : "text-yellow-600"
                }`}
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Interview Complete!
          </h1>
          <p className="text-gray-600">
            Here's how you performed in your mock interview
          </p>
        </div>

        {/* Score Overview */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-8 border-gray-200">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              Overall Score
            </h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-center mb-6">
              <div
                className={`text-6xl font-bold mb-2 ${getScoreColor(
                  scorePercentage
                )}`}
              >
                {Math.round(mockSession.score / totalPossiblePoints * 100)}%
              </div>
              <div className="text-xl text-gray-600 mb-4">
                {mockSession.score} out of {mockSession.totalQuestions * 100} points
              </div>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getScoreBadgeVariant(
                  scorePercentage
                )}`}
              >
                {getScoreGrade(scorePercentage)}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200 mb-4">
              <div
                className="h-full w-full flex-1 transition-all bg-blue-600"
                style={{ transform: `translateX(-${100 - scorePercentage}%)` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-5 w-5 text-blue-600 mr-1" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {correctAnswers}
                </div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-purple-600 mr-1" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {mockSession.totalQuestions}
                </div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="h-5 w-5 text-orange-600 mr-1" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(
                    (correctAnswers / mockSession.totalQuestions) * 100
                  )}
                  %
                </div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Breakdown */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-8 border-gray-200">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              Question Breakdown
            </h3>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {mockSession.questions.map((question, index) => {
                const isCorrect =
                  question.type === "mcq"
                    ? question.userAnswer === question.correctAnswer
                    : question.userAnswer &&
                      question.userAnswer.trim().length > 20;

                return (
                  <div
                    key={question.id}
                    className="border rounded-lg p-4 border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">
                            Question {index + 1}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                              question.type === "mcq"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-900"
                            }`}
                          >
                            {question.type === "mcq"
                              ? "Multiple Choice"
                              : "Open Ended"}
                          </span>
                          <span className="text-sm text-gray-600">
                            {question.score} pts
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">
                          {question.question}
                        </p>
                      </div>
                      <div className="ml-4">
                        {isCorrect ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-600" />
                        )}
                      </div>
                    </div>

                    {question.type === "mcq" && (
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600">Your answer:</span>
                          <span
                            className={
                              question.userAnswer === question.correctAnswer
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {question.userAnswer || "No answer"}
                          </span>
                        </div>
                        {question.userAnswer !== question.correctAnswer && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">
                              Correct answer:
                            </span>
                            <span className="text-green-600">
                              {question.correctAnswer}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {question.type === "qa" && (
                      <div className="text-sm">
                        <div className="text-gray-600 mb-1">Your answer:</div>
                        <div className="bg-gray-50 p-2 rounded text-gray-700 max-h-20 overflow-y-auto">
                          {question.userAnswer || "No answer provided"}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-8 border-gray-200">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              Recommendations
            </h3>
          </div>
          <div className="p-6 pt-0">
            <ul className="space-y-2">
              {getRecommendations(scorePercentage).map(
                (recommendation, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{recommendation}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border  hover:text-accent-foreground h-10 px-4 py-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-900"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate("/upload")}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Take Another Mock Interview
          </button>
        </div>
      </div>
    </div>
  );
}

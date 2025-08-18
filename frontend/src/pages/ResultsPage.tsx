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
import { Button } from "@/components/ui/button";

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
    if (mockSession.practice_mode === "mcq") {
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
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div
              className={`p-3 sm:p-4 rounded-full ${
                scorePercentage >= 70 ? "bg-green-100" : "bg-yellow-100"
              }`}
            >
              <Trophy
                className={`h-10 w-10 sm:h-12 sm:w-12 ${
                  scorePercentage >= 70 ? "text-green-600" : "text-yellow-600"
                }`}
              />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            Interview Complete!
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Here's how you performed in your mock interview
          </p>
        </div>

        {/* Score Overview */}
        <div className="rounded-lg border bg-white shadow-sm mb-6 sm:mb-8 border-gray-200">
          <div className="p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">
              Overall Score
            </h3>
            <div className="text-center mb-5 sm:mb-6">
              <div
                className={`text-4xl sm:text-6xl font-bold mb-1 sm:mb-2 ${getScoreColor(
                  scorePercentage
                )}`}
              >
                {Math.round((mockSession.score / totalPossiblePoints) * 100)}%
              </div>
              <div className="text-base sm:text-xl text-gray-600 mb-2 sm:mb-4">
                {mockSession.score} out of {mockSession.totalQuestions * 100} points
              </div>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs sm:text-sm font-semibold ${getScoreBadgeVariant(
                  scorePercentage
                )}`}
              >
                {getScoreGrade(scorePercentage)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-3 sm:h-4 w-full overflow-hidden rounded-full bg-gray-200 mb-3 sm:mb-4">
              <div
                className="h-full w-full flex-1 transition-all bg-blue-600"
                style={{
                  transform: `translateX(-${100 - scorePercentage}%)`,
                }}
              />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center mb-1">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-1" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {correctAnswers}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Correct Answers
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center mb-1">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mr-1" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {mockSession.totalQuestions}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Total Questions
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center mb-1">
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 mr-1" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {Math.round((correctAnswers / mockSession.totalQuestions) * 100)}%
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Accuracy</div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Breakdown */}
        <div className="rounded-lg border bg-white shadow-sm mb-6 sm:mb-8 border-gray-200">
          <div className="p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">
              Question Breakdown
            </h3>
            <div className="space-y-4">
              {mockSession.questions.map((question, index) => {
                const isCorrect =
                  mockSession.practice_mode === "mcq"
                    ? question.userAnswer === question.correctAnswer
                    : question.userAnswer &&
                      question.userAnswer.trim().length > 20;

                return (
                  <div
                    key={question.id}
                    className="border rounded-lg p-3 sm:p-4 border-gray-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-medium text-sm sm:text-base">
                            Question {index + 1}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${
                              mockSession.practice_mode === "mcq"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-900"
                            }`}
                          >
                            {mockSession.practice_mode === "mcq"
                              ? "Multiple Choice"
                              : "Open Ended"}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-600">
                            {question.score} pts
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm sm:text-base mb-2">
                          {question.question}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0 sm:ml-4">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                        )}
                      </div>
                    </div>

                    {/* MCQ breakdown */}
                    {mockSession.practice_mode === "mcq" && (
                      <div className="space-y-1 text-xs sm:text-sm">
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

                    {/* QA breakdown */}
                    {mockSession.practice_mode === "qa" && (
                      <div className="text-xs sm:text-sm space-y-2">
                        <div>
                          <div className="text-gray-600 mb-1">Your answer:</div>
                          <div className="bg-gray-50 p-2 rounded text-gray-700 max-h-24 sm:max-h-28 overflow-y-auto">
                            {question.userAnswer || "No answer provided"}
                          </div>
                        </div>
                        {question.correctAnswer && (
                          <div>
                            <div className="text-gray-600 mb-1">
                              Correct answer:
                            </div>
                            <div className="bg-green-50 p-2 rounded text-green-700 max-h-24 sm:max-h-28 overflow-y-auto">
                              {question.correctAnswer}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="rounded-lg border bg-white shadow-sm mb-6 sm:mb-8 border-gray-200">
          <div className="p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">
              Recommendations
            </h3>
            <ul className="space-y-2">
              {getRecommendations(scorePercentage).map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-2 text-xs sm:text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span className="text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Button
            variant={"outline"}
            size={"lg"}
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer rounded-md w-full sm:w-auto"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button
            variant={"default"}
            size={"lg"}
            onClick={() => navigate("/upload")}
            className="cursor-pointer rounded-md bg-blue-500 text-white hover:bg-blue-600 w-full sm:w-auto"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Take Another Mock Interview
          </Button>
        </div>
      </div>
    </div>
  );
}

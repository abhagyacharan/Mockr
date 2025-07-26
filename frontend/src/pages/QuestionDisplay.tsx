"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMockSession } from "@/context/MockSessionContext";

export default function QuestionDisplay() {
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [sessionDuration, setSessionDuration] = useState<number>(0);

  const navigate = useNavigate();
  const { mockSession, setMockSession } = useMockSession();

  // 1. Setup total time dynamically once session loads
  useEffect(() => {
    if (!mockSession) {
      navigate("/");
      return;
    }

    const totalTime = mockSession.totalQuestions * 5 * 60; // 5 min per question
    setTimeLeft(totalTime);
    setSessionDuration(totalTime);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setMockSession({
            ...mockSession,
            isCompleted: true,
          });
          navigate("/results");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mockSession]);

  useEffect(() => {
    setCurrentAnswer("");
    setIsAnswered(false);
  }, [mockSession?.currentQuestionIndex]);

  if (!mockSession) return null;

  const currentQuestion = mockSession.questions[mockSession.currentQuestionIndex];
  const questionType = mockSession.practice_mode;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress =
    ((mockSession.currentQuestionIndex + 1) / mockSession.totalQuestions) * 100;

  const handleAnswerChange = (value: string) => {
    setCurrentAnswer(value);
  };

  const handleSubmitAnswer = async () => {
    const sessionId = mockSession.id;
    const token = localStorage.getItem("access_token");

    const answerPayload = {
      question_index: mockSession.currentQuestionIndex,
      question_text: currentQuestion.question,
      question_type: questionType,
      user_answer: currentAnswer,
      points: 100,
      time_taken: sessionDuration - timeLeft,
    };

    try {
      const res = await fetch(
        `http://localhost:8000/api/mock-sessions/${sessionId}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(answerPayload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Submit failed:", errorData.detail);
        return;
      }

      const responseData = await res.json();

      const updatedQuestions = [...mockSession.questions];
      updatedQuestions[mockSession.currentQuestionIndex] = {
        ...currentQuestion,
        userAnswer: currentAnswer,
        is_correct: responseData.is_correct,
        feedback: responseData.feedback,
        score: responseData.score,
        detailed_feedback: responseData.detailed_feedback,
      };

      setMockSession({
        ...mockSession,
        questions: updatedQuestions,
        score: mockSession.score + (responseData.score || 0),
      });

      setIsAnswered(true);
    } catch (err) {
      console.error("Error submitting answer:", err);
    }
  };

  const handleNextQuestion = () => {
    if (mockSession.currentQuestionIndex < mockSession.totalQuestions - 1) {
      setMockSession({
        ...mockSession,
        currentQuestionIndex: mockSession.currentQuestionIndex + 1,
      });
    } else {
      setMockSession({
        ...mockSession,
        isCompleted: true,
      });
      navigate("/results");
    }
  };

  const handlePreviousQuestion = () => {
    if (mockSession.currentQuestionIndex > 0) {
      setMockSession({
        ...mockSession,
        currentQuestionIndex: mockSession.currentQuestionIndex - 1,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Mock Interview</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span
                  className={`font-mono ${timeLeft < 60 ? "text-red-600" : ""}`}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Question {mockSession.currentQuestionIndex + 1} of{" "}
                {mockSession.totalQuestions}
              </div>
            </div>
          </div>
          <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Display */}
        <div className="rounded-lg border bg-white text-gray-900 shadow-sm mb-6 border-gray-200">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              {currentQuestion.question}
            </h3>

            {questionType === "mcq" ? (
              <div className="grid gap-2">
                {currentQuestion.options?.map((option, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                      isAnswered
                        ? option === currentQuestion.correctAnswer
                          ? "bg-green-50 border-green-200"
                          : option === currentAnswer &&
                            option !== currentQuestion.correctAnswer
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50 border-gray-200"
                        : "hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      id={`option-${idx}`}
                      name="mcq-option"
                      value={option}
                      checked={currentAnswer === option}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      disabled={isAnswered}
                      className="h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label
                      htmlFor={`option-${idx}`}
                      className="cursor-pointer text-sm font-medium flex-1"
                    >
                      {option}
                    </label>
                    {isAnswered && option === currentQuestion.correctAnswer && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <label htmlFor="qa-answer" className="text-sm font-medium">
                  Your Answer
                </label>
                <textarea
                  id="qa-answer"
                  value={currentAnswer}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  disabled={isAnswered}
                  placeholder="Type your answer here..."
                  className="w-full min-h-[100px] rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500">
                  {currentAnswer.length} characters (min 20 recommended)
                </p>
              </div>
            )}

            {/* Feedback after answer submission */}
            {isAnswered && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                <p className="text-sm text-blue-800">
                  <strong>Feedback:</strong> {currentQuestion.feedback}
                </p>
                {currentQuestion.detailed_feedback && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                    <p className="text-sm text-blue-800">
                      <strong>Feedback:</strong> {currentQuestion.feedback}
                    </p>

                    {Array.isArray(
                      currentQuestion.detailed_feedback.strengths
                    ) && (
                      <p className="text-sm text-blue-800">
                        <strong>Strengths:</strong>{" "}
                        {currentQuestion.detailed_feedback.strengths.join(", ")}
                      </p>
                    )}

                    {Array.isArray(
                      currentQuestion.detailed_feedback.improvements
                    ) && (
                      <p className="text-sm text-blue-800">
                        <strong>Improvements:</strong>{" "}
                        {currentQuestion.detailed_feedback.improvements.join(
                          ", "
                        )}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={mockSession.currentQuestionIndex === 0}
            className="h-10 px-4 py-2 text-sm border rounded-md bg-white hover:bg-gray-100"
          >
            <ArrowLeft className="inline w-4 h-4 mr-2" />
            Previous
          </button>

          {!isAnswered ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={!currentAnswer.trim()}
              className="h-10 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="h-10 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {mockSession.currentQuestionIndex <
              mockSession.totalQuestions - 1 ? (
                <>
                  Next <ArrowRight className="inline w-4 h-4 ml-2" />
                </>
              ) : (
                "View Results"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

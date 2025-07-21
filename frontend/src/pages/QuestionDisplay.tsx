"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useMockSession } from "@/context/MockSessionContext";;

export default function QuestionDisplay({
}) {
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes per question
  const [isAnswered, setIsAnswered] = useState(false);
  const navigate = useNavigate();
  const { mockSession, setMockSession } = useMockSession();
  
  useEffect(() => {
    console.log("mockSession in QuestionDisplay:", mockSession);
    if (!mockSession) {
      navigate("/");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mockSession]);

  useEffect(() => {
    setCurrentAnswer("");
    setIsAnswered(false);
    setTimeLeft(300);
  }, [mockSession?.currentQuestionIndex]);

  if (!mockSession) {
    return null;
  }

  const currentQuestion =
    mockSession.questions[mockSession.currentQuestionIndex];
  const progress =
    ((mockSession.currentQuestionIndex + 1) / mockSession.totalQuestions) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (value: string) => {
    setCurrentAnswer(value);
  };

  const handleSubmitAnswer = async () => {
  const sessionId = mockSession.id;
  const token = localStorage.getItem("access_token");

  if (!token) {
    console.error("No access token found");
    return;
  }

  const answerPayload = {
    question_index: mockSession.currentQuestionIndex,
    question_text: currentQuestion.question,
    question_type: currentQuestion.type,
    user_answer: currentAnswer,
    points: 100,
    time_taken: 300 - timeLeft, // calculate time spent
  };

  try {
    const res = await fetch(`http://localhost:8000/api/mock-sessions/${sessionId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(answerPayload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Failed to submit answer:", errorData.detail);
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
    };

    const newScore = mockSession.score + (responseData.score || 0);

    setMockSession({
      ...mockSession,
      questions: updatedQuestions,
      score: newScore,
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
      // Complete the session
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
          {/* Progress Bar */}
          <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full w-full flex-1 transition-all bg-blue-600"
              style={{ transform: `translateX(-${100 - progress}%)` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-6 border-gray-200">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center justify-between">
              <span>Question {mockSession.currentQuestionIndex + 1}</span>
              <span className="text-sm font-normal text-gray-600">
                {currentQuestion.score} points
              </span>
            </h3>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-6">
              <p className="text-lg text-gray-900">
                {currentQuestion.question}
              </p>

              {currentQuestion.type === "mcq" ? (
                <div className="grid gap-2">
                  {currentQuestion.options?.map((option, index) => (
                    <div
                      key={index}
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
                        id={`option-${index}`}
                        name="mcq-option"
                        value={option}
                        checked={currentAnswer === option}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        disabled={isAnswered}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option}
                      </label>
                      {isAnswered &&
                        option === currentQuestion.correctAnswer && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <label
                    htmlFor="qa-answer"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Your Answer
                  </label>
                  <textarea
                    id="qa-answer"
                    placeholder="Type your answer here..."
                    value={currentAnswer}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    disabled={isAnswered}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <p className="text-sm text-gray-500">
                    {currentAnswer.length} characters (minimum 20 for scoring)
                  </p>
                </div>
              )}

              {isAnswered && currentQuestion.type === "qa" && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Feedback:</strong> Your answer has been recorded. In
                    a real interview, focus on being specific, providing
                    examples, and demonstrating your problem-solving approach.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={mockSession.currentQuestionIndex === 0}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </button>

          <div className="space-x-4">
            {!isAnswered ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!currentAnswer.trim()}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700"
              >
                {mockSession.currentQuestionIndex <
                mockSession.totalQuestions - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "View Results"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, Clock, Play, Pause, BookOpen, FileText } from "lucide-react";
import { ResultsView } from "./MockrDemo_ResultsView";

const demoQuestions = [
  {
    id: 1,
    question: "What is the time complexity of searching in a balanced binary search tree?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 1,
    explanation: "In a balanced BST, the height is log n, so search operations take O(log n) time.",
    category: "Technical",
  },
  {
    id: 2,
    question: "Which sorting algorithm has the best average-case performance?",
    options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
    correctAnswer: 2,
    explanation: "Merge Sort has the best average-case performance of O(n log n) among the listed options.",
    category: "Algorithms",
  },
  {
    id: 3,
    question: "Which HTTP method is used to update an existing resource?",
    options: ["PUT", "GET", "POST", "DELETE"],
    correctAnswer: 0,
    explanation: "PUT is used to update an existing resource or create if it does not exist.",
    category: "Web Development",
  },
];

export function MockrDemo() {
  const [currentStep, setCurrentStep] = useState<"intro" | "question" | "results">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);

  const currentQ = demoQuestions[currentQuestion];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0 && currentStep === "question") {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, currentStep]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartDemo = () => {
    setCurrentStep("question");
    setIsPlaying(true);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
    }
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < demoQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(-1);
      setIsAnswered(false);
    } else {
      setCurrentStep("results");
      setIsPlaying(false);
    }
  };

  const handleRestart = () => {
    setCurrentStep("intro");
    setCurrentQuestion(0);
    setSelectedAnswer(-1);
    setTimeLeft(180);
    setIsPlaying(false);
    setScore(0);
    setIsAnswered(false);
  };

  return (
    <div className="relative w-full">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header bar */}
        <div className="bg-gray-100 px-3 sm:px-4 py-2.5 sm:py-3 border-b flex items-center space-x-2 text-xs sm:text-sm">
          <div className="flex space-x-1.5 sm:space-x-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-400 rounded-full"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="flex-1 bg-white rounded px-2 sm:px-3 py-1 truncate text-gray-600 ml-2 sm:ml-4">
            mockr.ai/interview/demo
          </div>
        </div>

        <div className="p-4 sm:p-6 min-h-[350px] sm:min-h-[450px]">
          {/* INTRO STEP */}
          {currentStep === "intro" && (
            <div className="text-center space-y-6 sm:space-y-8 max-w-lg mx-auto">
              {/* Icon + Title */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                  <Brain className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                    Interactive Demo
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Experience Mockr's AI-powered interview preparation
                  </p>
                </div>
              </div>

              {/* Info Cards */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <div className="flex flex-col items-center bg-blue-50 border border-blue-100 rounded-md px-4 sm:px-6 py-3 sm:py-4 w-full sm:w-64 shadow-sm">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mb-2" />
                  <div className="text-sm sm:text-base font-medium text-gray-800">
                    4 Questions
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Technical & Design
                  </div>
                </div>
                <div className="flex flex-col items-center bg-green-50 border border-green-100 rounded-md px-4 sm:px-6 py-3 sm:py-4 w-full sm:w-64 shadow-sm">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mb-2" />
                  <div className="text-sm sm:text-base font-medium text-gray-800">
                    MCQ
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">Practice Mode</div>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-2 sm:pt-4">
                <Button
                  onClick={handleStartDemo}
                  size="lg"
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base cursor-pointer"
                >
                  <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Start Demo Interview
                </Button>
              </div>
            </div>
          )}

          {/* QUESTION STEP */}
          {currentStep === "question" && (
            <div className="space-y-5 sm:space-y-6 max-w-2xl mx-auto">
              {/* Header: Badges + Timer */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-xs sm:text-sm px-2 py-1">
                    Question {currentQuestion + 1} of {demoQuestions.length}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 text-xs sm:text-sm px-2 py-1">
                    {currentQ.category}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                    <span className="font-mono">{formatTime(timeLeft)}</span>
                  </div>
                  <Button
                    variant="outline"
                    className="cursor-pointer h-8 w-8 p-0 flex items-center justify-center"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    ) : (
                      <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <Progress
                value={((currentQuestion + 1) / demoQuestions.length) * 100}
                className="h-1.5 sm:h-2"
              />

              {/* Question Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg leading-relaxed">
                    {currentQ.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <RadioGroup
                    value={selectedAnswer.toString()}
                    onValueChange={(value) => {
                      if (!isAnswered) setSelectedAnswer(Number(value));
                    }}
                    className="space-y-2 sm:space-y-3"
                  >
                    {currentQ.options.map((option, index) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrectAnswer = index === currentQ.correctAnswer;
                      const isUserWrong = isAnswered && isSelected && !isCorrectAnswer;
                      const isUserRight = isAnswered && isSelected && isCorrectAnswer;

                      return (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border text-sm sm:text-base transition-colors
                            ${
                              isUserRight
                                ? "bg-green-50 border-green-400"
                                : isUserWrong
                                ? "bg-red-50 border-red-400"
                                : isCorrectAnswer && isAnswered
                                ? "border-green-400 bg-green-50"
                                : "hover:bg-gray-50 border-gray-200"
                            }
                          `}
                        >
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <RadioGroupItem
                              value={index.toString()}
                              id={`demo-option-${index}`}
                              disabled={isAnswered}
                              className="h-4 w-4 sm:h-5 sm:w-5"
                            />
                            <Label
                              htmlFor={`demo-option-${index}`}
                              className="cursor-pointer text-xs sm:text-sm"
                            >
                              {option}
                            </Label>
                          </div>

                          {isAnswered && isCorrectAnswer && (
                            <span className="text-xs sm:text-sm text-green-700 font-semibold">
                              Correct Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </RadioGroup>

                  <Button
                    size="lg"
                    onClick={isAnswered ? handleNextQuestion : handleSubmitAnswer}
                    disabled={selectedAnswer === -1}
                    className={`w-full mt-3 sm:mt-4 cursor-pointer text-sm sm:text-base ${
                      selectedAnswer === -1
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-black text-white"
                    }`}
                  >
                    {isAnswered
                      ? currentQuestion < demoQuestions.length - 1
                        ? "Next Question"
                        : "View Results"
                      : "Submit Answer"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* RESULTS STEP */}
          {currentStep === "results" && (
            <ResultsView
              score={Math.round((score / demoQuestions.length) * 100)}
              handleRestart={handleRestart}
            />
          )}
        </div>
      </div>
    </div>
  );
}

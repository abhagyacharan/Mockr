"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, Clock, Play, Pause, File, BookOpen, FileText } from "lucide-react";
import { ResultsView } from "./MockrDemo_ResultsView";

const demoQuestions = [
  {
    id: 1,
    question:
      "What is the time complexity of searching in a balanced binary search tree?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 1,
    explanation:
      "In a balanced BST, the height is log n, so search operations take O(log n) time.",
    category: "Technical",
  },
  {
    id: 2,
    question: "Which sorting algorithm has the best average-case performance?",
    options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
    correctAnswer: 2,
    explanation:
      "Merge Sort has the best average-case performance of O(n log n) among the listed options.",
    category: "Algorithms",
  },
  {
    id: 3,
    question: "Which HTTP method is used to update an existing resource?",
    options: ["PUT", "GET", "POST", "DELETE"],
    correctAnswer: 0,
    explanation:
      "PUT is used to update an existing resource or create if it does not exist.",
    category: "Web Development",
  },
];

export function MockrDemo() {
  const [currentStep, setCurrentStep] = useState<
    "intro" | "question" | "results"
  >("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);

  const currentQ = demoQuestions[currentQuestion];
  const isCorrect = selectedAnswer === currentQ.correctAnswer;

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
      setScore((prev) => prev + 1); // 1 point per correct
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
    <div className="relative">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-100 px-4 py-3 border-b flex items-center space-x-2">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-600 ml-4">
            mockr.ai/interview/demo
          </div>
        </div>

        <div className="p-6 min-h-[450px]">
          {currentStep === "intro" && (
            <div className="text-center space-y-8 px-4">
              {/* Top Section: Icon + Title */}
              <div className="flex items-center justify-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-semibold text-gray-900">
                    Interactive Demo
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Experience Mockr's AI-powered interview preparation
                  </p>
                </div>
              </div>

              {/* Info Cards */}
              <div className="flex flex-col justify-center items-center gap-4">
                <div className="flex flex-col items-center bg-blue-50 border border-blue-100 rounded-md px-6 py-4 w-full sm:w-64 shadow-sm">
                  <FileText className="h-6 w-6 text-blue-600 mb-2" />
                  <div className="text-base font-medium text-gray-800">
                    4 Questions
                  </div>
                  <div className="text-sm text-gray-500">
                    Technical & Design
                  </div>
                </div>
                <div className="flex flex-col items-center bg-green-50 border border-green-100 rounded-md px-6 py-4 w-full sm:w-64 shadow-sm">
                  <BookOpen className="h-6 w-6 text-green-600 mb-2" />
                  <div className="text-base font-medium text-gray-800">
                    MCQ
                  </div>
                  <div className="text-sm text-gray-500">Practice Mode</div>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4">
                <Button
                  onClick={handleStartDemo}
                  size="lg"
                  className="px-6 py-3 cursor-pointer"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Demo Interview
                </Button>
              </div>
            </div>
          )}

          {currentStep === "question" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">
                    Question {currentQuestion + 1} of {demoQuestions.length}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800">
                    {currentQ.category}
                  </Badge>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="font-mono text-sm">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Progress
                value={((currentQuestion + 1) / demoQuestions.length) * 100}
                className="h-2"
              />

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg leading-relaxed">
                    {currentQ.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={selectedAnswer.toString()}
                    onValueChange={(value) => {
                      if (!isAnswered) setSelectedAnswer(Number(value));
                    }}
                  >
                    {currentQ.options.map((option, index) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrectAnswer = index === currentQ.correctAnswer;

                      const isUserWrong =
                        isAnswered && isSelected && !isCorrectAnswer;
                      const isUserRight =
                        isAnswered && isSelected && isCorrectAnswer;

                      return (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-colors
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
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem
                              value={index.toString()}
                              id={`demo-option-${index}`}
                              disabled={isAnswered}
                            />
                            <Label
                              htmlFor={`demo-option-${index}`}
                              className="cursor-pointer"
                            >
                              {option}
                            </Label>
                          </div>

                          {isAnswered && isCorrectAnswer && (
                            <span className="text-sm text-green-700 font-semibold">
                              Correct Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </RadioGroup>

                  <Button
                    size="lg"
                    onClick={
                      isAnswered ? handleNextQuestion : handleSubmitAnswer
                    }
                    disabled={selectedAnswer === -1}
                    className={`w-full mt-4 cursor-pointer ${
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

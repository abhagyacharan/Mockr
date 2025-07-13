"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  History,
  Calendar,
  Target,
  Clock,
  Trophy,
  FileText,
  BarChart3,
  User,
  LogOut,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import UploadInterface from "./UploadInterface";

interface DashboardProps {
  user: { id: string; name: string; email: string } | null;
  setUser: (user: null) => void;
}

// Mock data for user history and analytics
const mockHistory = [
  {
    id: "session-1",
    date: "2024-01-15",
    type: "Resume-based",
    score: 85,
    totalQuestions: 5,
    duration: "12 min",
    status: "completed",
  },
  {
    id: "session-2",
    date: "2024-01-12",
    type: "Job Description",
    score: 72,
    totalQuestions: 6,
    duration: "15 min",
    status: "completed",
  },
  {
    id: "session-3",
    date: "2024-01-10",
    type: "Resume-based",
    score: 91,
    totalQuestions: 4,
    duration: "10 min",
    status: "completed",
  },
  {
    id: "session-4",
    date: "2024-01-08",
    type: "Job Description",
    score: 68,
    totalQuestions: 7,
    duration: "18 min",
    status: "completed",
  },
];

const performanceMetrics = {
  totalSessions: 12,
  averageScore: 78,
  bestScore: 94,
  totalTimeSpent: "3h 24m",
  improvementRate: 15,
  strongAreas: ["Technical Skills", "Problem Solving", "Communication"],
  improvementAreas: ["System Design", "Behavioral Questions"],
};

export default function Dashboard({ user, setUser }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  if (!user) {
    navigate("/");
    return null;
  }

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">Mockr</span>
              </div>
              <div className="hidden md:block w-px h-6 bg-gray-300" />
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 border-gray-300 bg-white hover:bg-gray-50 text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Tabs */}
          <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground bg-gray-100 text-gray-600">
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                activeTab === "overview" ? "bg-white text-gray-900 shadow-sm" : ""
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                activeTab === "new-mock" ? "bg-white text-gray-900 shadow-sm" : ""
              }`}
              onClick={() => setActiveTab("new-mock")}
            >
              New Mock
            </button>
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                activeTab === "history" ? "bg-white text-gray-900 shadow-sm" : ""
              }`}
              onClick={() => setActiveTab("history")}
            >
              History
            </button>
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                activeTab === "analytics" ? "bg-white text-gray-900 shadow-sm" : ""
              }`}
              onClick={() => setActiveTab("analytics")}
            >
              Analytics
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h2>
                      <p className="text-gray-600 mb-4">
                        Ready to practice for your next interview? Your average score has improved by{" "}
                        <span className="font-semibold text-green-600">+{performanceMetrics.improvementRate}%</span>{" "}
                        this month.
                      </p>
                      <button
                        onClick={() => setActiveTab("new-mock")}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Start New Mock Interview
                      </button>
                    </div>
                    <div className="hidden md:block">
                      <Trophy className="h-16 w-16 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white border-gray-200">
                  <div className="p-6">
                    <div className="flex items-center space-x-2">
                      <Target className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Total Sessions</p>
                        <p className="text-2xl font-bold">{performanceMetrics.totalSessions}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white border-gray-200">
                  <div className="p-6">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Average Score</p>
                        <p className="text-2xl font-bold">{performanceMetrics.averageScore}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white border-gray-200">
                  <div className="p-6">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-8 w-8 text-yellow-600" />
                      <div>
                        <p className="text-sm text-gray-600">Best Score</p>
                        <p className="text-2xl font-bold">{performanceMetrics.bestScore}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white border-gray-200">
                  <div className="p-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">Time Practiced</p>
                        <p className="text-2xl font-bold">{performanceMetrics.totalTimeSpent}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Sessions */}
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white border-gray-200">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center space-x-2">
                    <History className="h-5 w-5" />
                    <span>Recent Sessions</span>
                  </h3>
                </div>
                <div className="p-6 pt-0">
                  <div className="space-y-4">
                    {mockHistory.slice(0, 3).map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <FileText className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="font-medium">{session.type}</p>
                            <p className="text-sm text-gray-600">
                              {session.date} • {session.duration}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getScoreBadgeVariant(session.score)}`}
                          >
                            {session.score}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTab("history")}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full mt-4 bg-transparent border-gray-300 bg-white hover:bg-gray-50 text-gray-900"
                  >
                    View All Sessions
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* New Mock Tab */}
          {activeTab === "new-mock" && (
            <UploadInterface
              setMockSession={() => {}}
              setIsLoading={() => {}}
              setError={() => {}}
              isLoading={false}
              error={null}
            />
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="space-y-6">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white border-gray-200">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">Session History</h3>
                </div>
                <div className="p-6 pt-0">
                  <div className="space-y-4">
                    {mockHistory.map((session) => (
                      <div
                        key={session.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <FileText className="h-8 w-8 text-gray-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">{session.type} Interview</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{session.date}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{session.duration}</span>
                                </span>
                                <span>{session.totalQuestions} questions</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${getScoreColor(session.score)}`}>
                                {session.score}%
                              </div>
                              <span
                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mt-1 ${getScoreBadgeVariant(session.score)}`}
                              >
                                {session.status}
                              </span>
                            </div>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 border-gray-300 bg-white hover:bg-gray-50 text-gray-900">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              {/* Performance Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white border-gray-200">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Performance Trend</h3>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Average Score</span>
                        <span className="font-semibold">{performanceMetrics.averageScore}%</span>
                      </div>
                      <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary bg-gray-200">
                        <div
                          className="h-full w-full flex-1 bg-primary transition-all bg-blue-600"
                          style={{ transform: `translateX(-${100 - performanceMetrics.averageScore}%)` }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Improvement Rate</span>
                        <span className="font-semibold text-green-600">+{performanceMetrics.improvementRate}%</span>
                      </div>
                      <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary bg-gray-200">
                        <div
                          className="h-full w-full flex-1 bg-primary transition-all bg-green-600"
                          style={{ transform: `translateX(-${100 - performanceMetrics.improvementRate}%)` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white border-gray-200">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Score Distribution</h3>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Excellent (80-100%)</span>
                        <span className="font-semibold">4 sessions</span>
                      </div>
                      <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary bg-gray-200">
                        <div
                          className="h-full w-full flex-1 bg-primary transition-all bg-green-600"
                          style={{ transform: `translateX(-${100 - 33}%)` }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Good (60-79%)</span>
                        <span className="font-semibold">6 sessions</span>
                      </div>
                      <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary bg-gray-200">
                        <div
                          className="h-full w-full flex-1 bg-primary transition-all bg-yellow-600"
                          style={{ transform: `translateX(-${100 - 50}%)` }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Needs Work (0-59%)</span>
                        <span className="font-semibold">2 sessions</span>
                      </div>
                      <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary bg-gray-200">
                        <div
                          className="h-full w-full flex-1 bg-primary transition-all bg-red-600"
                          style={{ transform: `translateX(-${100 - 17}%)` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strengths and Areas for Improvement */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white border-gray-200">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight text-green-600">Strong Areas</h3>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="space-y-3">
                      {performanceMetrics.strongAreas.map((area, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white border-gray-200">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight text-orange-600">
                      Areas for Improvement
                    </h3>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="space-y-3">
                      {performanceMetrics.improvementAreas.map((area, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-gray-700">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white border-gray-200">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">Personalized Recommendations</h3>
                </div>
                <div className="p-6 pt-0">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Focus on System Design</h4>
                      <p className="text-blue-800 text-sm">
                        Your scores in system design questions are below average. Consider practicing with more complex
                        architecture problems.
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Maintain Technical Strength</h4>
                      <p className="text-green-800 text-sm">
                        You're performing excellently in technical questions. Keep up the good work and continue
                        practicing regularly.
                      </p>
                    </div>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-medium text-yellow-900 mb-2">Improve Behavioral Responses</h4>
                      <p className="text-yellow-800 text-sm">
                        Work on structuring your behavioral answers using the STAR method (Situation, Task, Action,
                        Result).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

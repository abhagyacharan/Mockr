"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Brain, History, Calendar, Target, Clock, Trophy, FileText, BarChart3, User, LogOut, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import UploadInterface from "./UploadInterface"

interface DashboardProps {
  user: { id: string; name: string; email: string } | null
  setUser: (user: null) => void
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
]

const performanceMetrics = {
  totalSessions: 12,
  averageScore: 78,
  bestScore: 94,
  totalTimeSpent: "3h 24m",
  improvementRate: 15,
  strongAreas: ["Technical Skills", "Problem Solving", "Communication"],
  improvementAreas: ["System Design", "Behavioral Questions"],
}

export default function Dashboard({ user, setUser }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const navigate = useNavigate()

  if (!user) {
    navigate("/")
    return null
  }

  const handleLogout = () => {
    setUser(null)
    navigate("/")
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

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
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="new-mock">New Mock</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Welcome Section */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h2>
                    <p className="text-gray-600 mb-4">
                      Ready to practice for your next interview? Your average score has improved by{" "}
                      <span className="font-semibold text-green-600">+{performanceMetrics.improvementRate}%</span> this
                      month.
                    </p>
                    <Button onClick={() => setActiveTab("new-mock")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Start New Mock Interview
                    </Button>
                  </div>
                  <div className="hidden md:block">
                    <Trophy className="h-16 w-16 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Target className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Sessions</p>
                      <p className="text-2xl font-bold">{performanceMetrics.totalSessions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Average Score</p>
                      <p className="text-2xl font-bold">{performanceMetrics.averageScore}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Best Score</p>
                      <p className="text-2xl font-bold">{performanceMetrics.bestScore}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Time Practiced</p>
                      <p className="text-2xl font-bold">{performanceMetrics.totalTimeSpent}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="h-5 w-5" />
                  <span>Recent Sessions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                        <Badge variant={getScoreBadgeVariant(session.score)}>{session.score}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                  onClick={() => setActiveTab("history")}
                >
                  View All Sessions
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* New Mock Tab */}
          <TabsContent value="new-mock">
            <UploadInterface
              setMockSession={() => {}}
              setIsLoading={() => {}}
              setError={() => {}}
              isLoading={false}
              error={null}
            />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Session History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockHistory.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
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
                            <div className={`text-2xl font-bold ${getScoreColor(session.score)}`}>{session.score}%</div>
                            <Badge variant={getScoreBadgeVariant(session.score)} className="mt-1">
                              {session.status}
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Average Score</span>
                      <span className="font-semibold">{performanceMetrics.averageScore}%</span>
                    </div>
                    <Progress value={performanceMetrics.averageScore} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Improvement Rate</span>
                      <span className="font-semibold text-green-600">+{performanceMetrics.improvementRate}%</span>
                    </div>
                    <Progress value={performanceMetrics.improvementRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Excellent (80-100%)</span>
                      <span className="font-semibold">4 sessions</span>
                    </div>
                    <Progress value={33} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Good (60-79%)</span>
                      <span className="font-semibold">6 sessions</span>
                    </div>
                    <Progress value={50} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Needs Work (0-59%)</span>
                      <span className="font-semibold">2 sessions</span>
                    </div>
                    <Progress value={17} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Strengths and Areas for Improvement */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Strong Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {performanceMetrics.strongAreas.map((area, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">{area}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-600">Areas for Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {performanceMetrics.improvementAreas.map((area, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-gray-700">{area}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Personalized Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

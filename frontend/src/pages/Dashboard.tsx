"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";
import {
  Brain,
  Trophy,
  FileText,
  User,
  LogOut,
  Plus,
  BookOpen,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import UploadInterface from "./UploadInterface";
import HistoryPage from "./HistoryPage";
import RecentSessionsCard from "@/components/RecentSessions";
import { useAuth } from "@/context/AuthContext";

const performanceMetrics = {
  totalSessions: 12,
  averageScore: 78,
  bestScore: 94,
  totalTimeSpent: "3h 24m",
  improvementRate: 15,
  strongAreas: ["Technical Skills", "Problem Solving", "Communication"],
  improvementAreas: ["System Design", "Behavioral Questions"],
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);
  const [userMetrics, setUserMetrics] = useState<any>({});

  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !token) {
      navigate("/");
      return;
    }
    const fetchUserMetrics = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user-metrics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch metrics");
        const data = await res.json();
        setUserMetrics(data);
      } catch (error) {
        console.error("Failed to fetch user metrics:", error);
      }
    };

    const fetchUserSessions = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/mock-sessions/user-sessions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setSessionHistory(data);
      } catch (error) {
        console.error("Failed to fetch session history:", error);
      }
    };

    fetchUserMetrics();
    fetchUserSessions();
  }, [user, token]);

  if (!user) {
    navigate("/");
    return null;
  }

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Logo */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition"
            >
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Mockr</span>
            </div>

            {/* Navigation Tabs */}
            <div className="flex justify-center w-full md:w-auto">
              <div className="inline-flex h-10 items-center justify-center rounded-sm bg-gray-200 p-1 text-gray-600 overflow-x-auto">
                <button
                  className={`inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-sm px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    activeTab === "dashboard"
                      ? "bg-white text-gray-900 shadow-sm"
                      : ""
                  }`}
                  onClick={() => setActiveTab("dashboard")}
                >
                  Dashboard
                </button>
                <button
                  className={`inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-sm px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    activeTab === "new-mock"
                      ? "bg-white text-gray-900 shadow-sm"
                      : ""
                  }`}
                  onClick={() => setActiveTab("new-mock")}
                >
                  New Mock
                </button>
                <button
                  className={`inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-sm px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    activeTab === "history"
                      ? "bg-white text-gray-900 shadow-sm"
                      : ""
                  }`}
                  onClick={() => setActiveTab("history")}
                >
                  History
                </button>
                {/* <button
                  className={`inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-sm px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    activeTab === "analytics"
                      ? "bg-white text-gray-900 shadow-sm"
                      : ""
                  }`}
                  onClick={() => setActiveTab("analytics")}
                >
                  Analytics
                </button> */}
              </div>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">{user.first_name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-md cursor-pointer text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Welcome back, {user.first_name}!
                      </h2>
                      <p className="text-gray-600 mb-4">
                        Ready to practice for your next interview? Your average
                        score has improved by{" "}
                        <span className="font-semibold text-green-600">
                          +{performanceMetrics.improvementRate}%
                        </span>{" "}
                        this month.
                      </p>
                      <button
                        onClick={() => setActiveTab("new-mock")}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-md border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-md text-gray-600 mb-1">
                        Mock Sessions
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mb-1">
                        {userMetrics.completed_sessions_count}
                      </p>
                      {/* <p className="text-sm text-gray-600 mb-1">of {sessionHistory.length}</p> */}
                    </div>
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-md border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-md text-gray-600 mb-1">
                        Average Score
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {userMetrics.average_score != null
                          ? `${Math.round(userMetrics.average_score)}%`
                          : "83%"}
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-md border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-md text-gray-600 mb-1">Resume - JD</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {userMetrics.resume_sessions_count} -{" "}
                        {userMetrics.job_description_sessions_count}
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-md border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-md text-gray-600 mb-1">
                        Questions Practiced
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {userMetrics.practiced_questions_count}
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Sessions */}

              {/* <RecentSessionsTable sessionHistory={sessionHistory} /> */}
              <RecentSessionsCard
                sessions={sessionHistory}
                onViewAll={() => setActiveTab("history")} // assuming you have a tab switcher
              />
            </div>
          )}

          {/* New Mock Tab */}
          {activeTab === "new-mock" && (
            <UploadInterface
              setIsLoading={() => {}}
              setError={() => {}}
              isLoading={false}
              error={null}
            />
          )}

          {/* History Tab */}

          {activeTab === "history" && (
            <HistoryPage />
          )}

          {/* Analytics Tab */}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import {
  FileText,
  TrendingUp,
  CheckCircle,
  BookOpen,
  Trophy,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import RecentSessionsCard from "@/components/RecentSessions";
import { StatsCard } from "@/components/StatsCard";
import { useAuth } from "@/context/AuthContext";

export default function DashboardHome() {
  const [userMetrics, setUserMetrics] = useState<any>({});
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserMetrics = async () => {
      setLoadingMetrics(true);
      const res = await fetch(`${API_BASE_URL}/api/user-metrics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUserMetrics(data);
      setLoadingMetrics(false);
    };

    const fetchUserSessions = async () => {
      setLoadingMetrics(true);
      const res = await fetch(
        `${API_BASE_URL}/api/mock-sessions/user-sessions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setSessionHistory(data);
      setLoadingMetrics(false);
    };

    fetchUserMetrics();
    fetchUserSessions();
  }, [token]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-gray-600 mb-4">
              Ready to practice for your next interview? Your average score has
              improved by{" "}
              <span className="font-semibold text-green-600">
                +{userMetrics?.improvement_rate ?? 15}%
              </span>{" "}
              this month.
            </p>
            <button
              onClick={() => navigate("/uploadinterface")}
              className="inline-flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 rounded-md px-4 py-2 text-sm"
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Mock Sessions"
          value={userMetrics?.completed_sessions_count ?? 0}
          icon={<FileText className="w-6 h-6" />}
          color="blue"
          isLoading={loadingMetrics}
        />
        <StatsCard
          label="Average Score"
          value={`${Math.round(userMetrics?.average_score ?? 0)}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
          isLoading={loadingMetrics}
        />
        <StatsCard
          label="Resume - JD"
          value={`${userMetrics?.resume_sessions_count ?? 0} - ${
            userMetrics?.job_description_sessions_count ?? 0
          }`}
          icon={<CheckCircle className="w-6 h-6" />}
          color="purple"
          isLoading={loadingMetrics}
        />
        <StatsCard
          label="Questions Practiced"
          value={userMetrics?.practiced_questions_count ?? 0}
          icon={<BookOpen className="w-6 h-6" />}
          color="orange"
          isLoading={loadingMetrics}
        />
      </div>

      {/* Recent Sessions */}
      <RecentSessionsCard
        sessions={sessionHistory}
        onViewAll={() => navigate("/history")}
      />
    </div>
  );
}
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
import { Button } from "@/components/ui/button";

export default function DashboardHome() {
  const [userMetrics, setUserMetrics] = useState<any>({});
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);
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
      setLoadingSessions(true);
      const res = await fetch(
        `${API_BASE_URL}/api/mock-sessions/user-sessions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setSessionHistory(data);
      setLoadingSessions(false);
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
              Welcome, {user?.first_name}!
            </h2>
            <p className="text-gray-600 mb-4">
              Ready to practice for your next interview? Your average score can
              be improved by{" "}
              <span className="font-semibold text-green-600">
                +{userMetrics?.improvement_rate ?? 45}%
              </span>{" "}
              by practicing.
            </p>
            <button
              onClick={() => navigate("/upload")}
              className="inline-flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 rounded-sm cursor-pointer px-4 py-2 text-sm"
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

      {/* Recent Sessions or No Sessions Message */}
      {loadingSessions ? (
        <div className="rounded-lg border bg-white shadow-sm p-6">
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Loading sessions...</div>
          </div>
        </div>
      ) : sessionHistory.length > 0 ? (
        <RecentSessionsCard
          sessions={sessionHistory}
          onViewAll={() => navigate("/history")}
        />
      ) : (
        <div className="rounded-lg border bg-white shadow-sm p-6">
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <FileText className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Mock Sessions
            </h3>
            <p className="text-gray-500 mb-4">
              You haven't started any mock interviews yet. Begin your first session!
            </p>
            <Button
              variant={"default"}
              size={"lg"}
              onClick={() => navigate("/upload")}
              className="bg-blue-500 text-white hover:bg-blue-600 cursor-pointer rounded-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Start First Mock Interview
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

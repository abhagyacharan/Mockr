import { useEffect, useState } from "react";
import {
  FileText,
  Briefcase,
  Play,
  Eye,
  Trash2,
  Download,
  Calendar,
  TrendingUp,
  Clock,
  Filter,
  Search,
  BookOpen,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/api";

const formatSelectLabel = (value: string) => {
  switch (value) {
    case "resume":
      return "Resume";
    case "job_description":
      return "Job Description";
    case "completed":
      return "Completed";
    case "in-progress":
    case "ongoing":
      return "In Progress";
    case "all":
      return "All";
    case "date":
      return "Date";
    case "score":
      return "Score";
    case "questions":
      return "Questions";
    case "name":
      return "Name";
    default:
      return value;
  }
};

type SelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactElement<{
    children: React.ReactNode;
    value: string;
  }>[];
  placeholder: string;
};

const Select = ({
  value,
  onValueChange,
  children,
  placeholder,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        className="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="block truncate text-sm">
          {value === "all" ? placeholder : formatSelectLabel(value)}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
          {children.map((child, index) => (
            <div
              key={index}
              className="relative select-none py-2 pl-3 pr-9 text-sm hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                onValueChange(child.props.value);
                setIsOpen(false);
              }}
            >
              {child.props.children}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

type SelectItemProps = {
  value: string;
  children: React.ReactNode;
};

const SelectItem = ({ value, children }: SelectItemProps) => {
  return <option value={value}>{children}</option>;
};

export default function HistoryPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);
  const [userMetrics, setUserMetrics] = useState<any>({});

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const filteredSessions = [...sessionHistory]
    .filter((session) => {
      const matchesSearch = session.session_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        session.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesType =
        typeFilter === "all" ||
        session.type.toLowerCase() === typeFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === "score") {
        return (b.score ?? 0) - (a.score ?? 0);
      }
      if (sortBy === "name") {
        return a.session_name.localeCompare(b.session_name);
      }
      if (sortBy === "questions") {
        return (b.totalQuestions ?? 0) - (a.totalQuestions ?? 0);
      }
      return 0;
    });

  const deleteMockSession = async (sessionId: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/mock-sessions/${sessionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedHistory = sessionHistory.filter(
        (session) => session.id !== sessionId
      );
      setSessionHistory(updatedHistory);
    } catch (error) {
      console.error("Failed to delete mock session:", error);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Interview History
            </h1>
            <p className="text-gray-600">
              Track your progress and review past interviews
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <StatsCard
            label="Total Sessions"
            value={sessionHistory.length}
            icon={<FileText className="w-6 h-6" />}
            color="blue"
          />
          <StatsCard
            label="In Progress"
            value={sessionHistory.filter((s) => s.status === "ongoing").length}
            icon={<Clock className="w-6 h-6" />}
            color="orange"
          />
          <StatsCard
            label="Completed"
            value={
              sessionHistory.filter((s) => s.status === "completed").length
            }
            icon={<CheckCircle className="w-6 h-6" />}
            color="green"
          />
          <StatsCard
            label="Ongoing Again"
            value={sessionHistory.filter((s) => s.status === "ongoing").length}
            icon={<BookOpen className="w-6 h-6" />}
            color="orange"
          />
          <StatsCard
            label="Average Score"
            value={
              userMetrics.average_score
                ? `${Math.round(userMetrics.average_score)}%`
                : "0%"
            }
            icon={<TrendingUp className="w-6 h-6" />}
            color="purple"
          />
        </div>

        <Card>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filter & Search
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search interviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
                placeholder="Filter by status"
              >
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="ongoing">In Progress</SelectItem>
              </Select>

              <Select
                value={typeFilter}
                onValueChange={setTypeFilter}
                placeholder="Filter by type"
              >
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="resume">Resume</SelectItem>
                <SelectItem value="job_description">Job Description</SelectItem>
              </Select>

              <Select
                value={sortBy}
                onValueChange={setSortBy}
                placeholder="Sort by"
              >
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="score">Score</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="questions">Questions</SelectItem>
              </Select>
            </div>
          </div>
        </Card>

        {/* Sessions Table */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Interview Sessions ({sessionHistory.length})
            </h2>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="min-w-[900px] w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session Name
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Questions
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSessions.length > 0 ? (
                  filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="px-4 py-6 whitespace-nowrap">
                        <div className="text-base font-semibold text-gray-900">
                          {session.session_name}
                        </div>
                      </td>
                      <td className="px-4 py-6 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className="flex items-center w-fit text-sm px-3 py-1"
                        >
                          {session.type === "resume" ? (
                            <FileText className="w-4 h-4 mr-2" />
                          ) : (
                            <Briefcase className="w-4 h-4 mr-2" />
                          )}
                          {session.type === "resume"
                            ? "Resume"
                            : "Job Description"}
                        </Badge>
                      </td>
                      <td className="px-4 py-6 whitespace-nowrap">
                        {session.score && session.score !== "N/A" ? (
                          <span
                            className={`text-lg font-bold ${
                              session.score >= 80
                                ? "text-green-600"
                                : session.score >= 60
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {session.score}%
                          </span>
                        ) : (
                          <span className="text-gray-400 text-lg">-</span>
                        )}
                      </td>
                      <td className="px-4 py-6 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {session.totalQuestions} questions
                        </div>
                      </td>
                      <td className="px-4 py-6 whitespace-nowrap text-gray-600">
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(session.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-6 whitespace-nowrap">
                        <Badge
                          variant={
                            session.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                          className={`text-sm px-3 py-1 ${
                            session.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {session.status === "completed"
                            ? "Completed"
                            : "In Progress"}
                        </Badge>
                      </td>
                      <td className="px-4 py-6 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-3">
                          {session.status === "ongoing" ? (
                            <Button className="cursor-pointer" size="lg">
                              <Play className="w-4 h-4 mr-2" />
                              Continue
                            </Button>
                          ) : (
                            <>
                              <Button
                                className="cursor-pointer"
                                variant="outline"
                                size="lg"
                                onClick={() =>
                                  navigate(`/results/${session.id}`)
                                }
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button className="cursor-pointer" variant="outline" size="lg">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                              </Button>
                            </>
                          )}
                          <Button
                            variant="outline"
                            size="lg"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 cursor-pointer"
                            onClick={() => deleteMockSession(session.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-6 text-gray-500 text-sm"
                    >
                      No sessions match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

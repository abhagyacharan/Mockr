import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Briefcase, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RecentSessionsCardProps {
  sessions: any[];
  onViewAll: () => void;
}

export default function RecentSessionsCard({
  sessions,
  onViewAll,
}: RecentSessionsCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold">
          Recent Sessions
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
          className="text-sm sm:text-base font-medium cursor-pointer"
        >
          View All
        </Button>
      </CardHeader>

      <CardContent>
        {/* Desktop / Tablet Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm font-semibold">Session Name</TableHead>
                <TableHead className="text-sm font-semibold">Type</TableHead>
                <TableHead className="text-sm font-semibold">Score</TableHead>
                <TableHead className="text-sm font-semibold">Date</TableHead>
                <TableHead className="text-sm font-semibold">Status</TableHead>
                <TableHead className="text-sm font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sessions.slice(0, 3).map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="py-4 text-base font-medium">
                    {session.session_name}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className="flex items-center w-fit text-sm px-3 py-1"
                    >
                      {session.type === "resume" ? (
                        <>
                          <FileText className="w-4 h-4 mr-1" />
                          Resume
                        </>
                      ) : (
                        <>
                          <Briefcase className="w-4 h-4 mr-1" />
                          Job Description
                        </>
                      )}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-base font-semibold">
                    {session.score !== undefined && session.score !== "N/A" ? (
                      <span
                        className={`${
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
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>

                  <TableCell className="text-gray-600">
                    {new Date(session.date).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        session.status === "completed" ? "default" : "secondary"
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
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {session.status === "ongoing" ? (
                        <Button
                          className="cursor-pointer text-sm"
                          size="sm"
                          onClick={() => navigate(`/quiz/${session.id}`)}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Continue
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer text-sm"
                          onClick={() => navigate(`/results/${session.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Results
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card Layout */}
        <div className="md:hidden space-y-4">
          {sessions.slice(0, 3).map((session) => (
            <div
              key={session.id}
              className="p-4 border rounded-lg shadow-sm space-y-3 bg-white"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    {session.session_name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {new Date(session.date).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  className={`text-xs px-2 py-0.5 ${
                    session.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {session.status === "completed" ? "Completed" : "In Progress"}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Type:</span>
                  {session.type === "resume" ? (
                    <FileText className="w-3.5 h-3.5 text-gray-700" />
                  ) : (
                    <Briefcase className="w-3.5 h-3.5 text-gray-700" />
                  )}
                  <span>
                    {session.type === "resume" ? "Resume" : "Job Desc"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Score:</span>{" "}
                  {session.score && session.score !== "N/A" ? (
                    <span
                      className={`ml-1 font-semibold ${
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
                    <span className="ml-1 text-gray-400">-</span>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                {session.status === "ongoing" ? (
                  <Button
                    size="sm"
                    className="cursor-pointer text-xs px-3 py-1"
                    onClick={() => navigate(`/quiz/${session.id}`)}
                  >
                    <Play className="w-3.5 h-3.5 mr-1" />
                    Continue
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer text-xs px-3 py-1"
                    onClick={() => navigate(`/results/${session.id}`)}
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    Results
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

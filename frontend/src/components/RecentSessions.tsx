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
        <CardTitle className="text-lg">Your Mock Sessions</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
          className="text-sm font-medium cursor-pointer"
        >
          View All
        </Button>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Session Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[1%] whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sessions.slice(0, 3).map((session) => (
              <TableRow key={session.id}>
                <TableCell className="font-medium">
                  {session.session_name}
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className="flex items-center w-fit text-xs px-2 py-1"
                  >
                    {session.type === "resume" ? (
                      <>
                        <FileText className="w-3 h-3 mr-1" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Briefcase className="w-3 h-3 mr-1" />
                        Job Description
                      </>
                    )}
                  </Badge>
                </TableCell>

                <TableCell className="font-semibold">
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
                    className={`text-xs px-2 py-1 ${
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
                      <Button className="cursor-pointer" size="sm" onClick={() => navigate(`/quiz/${session.id}`)}>
                        <Play className="w-4 h-4 mr-1" />
                        Continue
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
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
      </CardContent>
    </Card>
  );
}

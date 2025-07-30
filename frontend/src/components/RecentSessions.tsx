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
        <CardTitle className="text-xl sm:text-2xl font-bold">
          Recent Sessions
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
          className="text-base font-medium cursor-pointer"
        >
          View All
        </Button>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm sm:text-base font-semibold">
                Session Name
              </TableHead>
              <TableHead className="text-sm sm:text-base font-semibold">
                Type
              </TableHead>
              <TableHead className="text-sm sm:text-base font-semibold">
                Score
              </TableHead>
              <TableHead className="text-sm sm:text-base font-semibold">
                Date
              </TableHead>
              <TableHead className="text-sm sm:text-base font-semibold">
                Status
              </TableHead>
              <TableHead className="w-[1%] whitespace-nowrap text-sm sm:text-base font-semibold text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sessions.slice(0, 3).map((session) => (
              <TableRow key={session.id}>
                <TableCell className="py-6 text-base font-medium">
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

                <TableCell className="text-base text-gray-600">
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
                        className="cursor-pointer text-base"
                        size="lg"
                        onClick={() => navigate(`/quiz/${session.id}`)}
                      >
                        <Play className="w-5 h-5 mr-1" />
                        Continue
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="lg"
                        className="cursor-pointer text-base"
                        onClick={() => navigate(`/results/${session.id}`)}
                      >
                        <Eye className="w-5 h-5 mr-1" />
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

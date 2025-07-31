"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

type UserResponse = {
  id: string;
  question_index: number;
  question_text: string;
  question_type: string;
  user_answer: string;
  is_correct: string;
  score: number;
  feedback: string;
  detailed_feedback?: any;
  time_taken: number;
};

export default function SessionResults() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/mock-sessions/${sessionId}/responses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch responses.");
        }

        const data = await res.json();
        setResponses(data);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load session results.");
        setLoading(false);
      }
    };

    fetchResponses();
  }, [sessionId, token]);

  if (loading) return <div className="p-6 text-gray-700">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button
        className="text-blue-600 mb-4 flex items-center"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to History
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Session Results</h1>

      {responses.map((resp) => (
        <div
          key={resp.id}
          className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">
              Question {resp.question_index + 1}
            </span>
            <span className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              {Math.round(resp.time_taken)}s
            </span>
          </div>

          <p className="text-gray-900 font-medium mb-2">
            {resp.question_text}
          </p>

          <div className="text-sm text-gray-800 mb-2">
            <strong>Your Answer:</strong> {resp.user_answer}
          </div>

          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              resp.is_correct === "correct" || resp.is_correct === "good"
                ? "bg-green-100 text-green-700"
                : resp.is_correct === "incorrect" || resp.is_correct === "poor"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {resp.is_correct === "correct" || resp.is_correct === "good" ? (
              <CheckCircle className="w-4 h-4 mr-2" />
            ) : (
              <XCircle className="w-4 h-4 mr-2" />
            )}
            {resp.is_correct}
          </div>

          <div className="mt-4 text-sm text-gray-700">
            <strong>Score:</strong> {resp.score}/100
          </div>

          {resp.feedback && (
            <div className="mt-2 text-sm text-gray-600">
              <strong>Feedback:</strong> {resp.feedback}
            </div>
          )}

          {resp.detailed_feedback && (
            <div className="mt-2 text-sm text-gray-600">
              <strong>Detailed Feedback:</strong>
              <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
                {JSON.stringify(resp.detailed_feedback, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

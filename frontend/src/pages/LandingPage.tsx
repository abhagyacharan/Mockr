"use client";

import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Upload, Brain, Target, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LandingPageProps {
  setIsAuthModalOpen: (open: boolean) => void;
  setAuthMode: (mode: "login" | "signup") => void;
  user: { id: string; name: string; email: string } | null;
}

export default function LandingPage({
  setIsAuthModalOpen,
  setAuthMode,
  user,
}: LandingPageProps) {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Upload className="h-8 w-8 text-blue-600" />,
      title: "Easy Upload",
      description:
        "Upload your resume or paste a job description to get started",
    },
    {
      icon: <Brain className="h-8 w-8 text-green-600" />,
      title: "AI-Generated Questions",
      description:
        "Get personalized mock interview questions tailored to your profile",
    },
    {
      icon: <Target className="h-8 w-8 text-purple-600" />,
      title: "Multiple Question Types",
      description: "Practice with both MCQ and open-ended technical questions",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-orange-600" />,
      title: "Instant Feedback",
      description: "Get immediate scoring and feedback on your performance",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition"
          >
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Mockr</span>
          </div>
          <div className="flex items-center space-x-3">
            {user ? (
              <Button onClick={() => navigate("/dashboard")}>Dashboard</Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAuthMode("login");
                    setIsAuthModalOpen(true);
                  }}
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    setAuthMode("signup");
                    setIsAuthModalOpen(true);
                  }}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Ace Your Next
            <span className="text-blue-600 block">Job Interview</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Practice with AI-generated mock interview questions tailored to your
            resume and target job description. Build confidence and improve your
            performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-3"
              onClick={() => {
                if (user) {
                  navigate("/dashboard");
                } else {
                  setAuthMode("signup");
                  setIsAuthModalOpen(true);
                }
              }}
            >
              {user ? "Go to Dashboard" : "Start Mock Interview"}
            </Button>
            {/* <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-3 bg-transparent"
            >
              Learn More
            </Button> */}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center p-6 hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/70 border-white/20 shadow-lg hover:bg-white/80"
            >
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <Card className="text-center p-8 flex-1 backdrop-blur-sm bg-white/70 border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Upload & Input</h3>
                <p className="text-gray-600">
                  Upload your resume or paste the job description you're
                  targeting
                </p>
              </CardContent>
            </Card>

            {/* Arrow 1 */}
            <div className="hidden lg:block">
              <ArrowRight className="h-8 w-8 text-gray-400" />
            </div>
            <div className="lg:hidden">
              <div className="w-px h-8 bg-gray-300"></div>
            </div>

            {/* Step 2 */}
            <Card className="text-center p-8 flex-1 backdrop-blur-sm bg-white/70 border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Practice</h3>
                <p className="text-gray-600">
                  Answer AI-generated questions tailored to your profile and
                  target role
                </p>
              </CardContent>
            </Card>

            {/* Arrow 2 */}
            <div className="hidden lg:block">
              <ArrowRight className="h-8 w-8 text-gray-400" />
            </div>
            <div className="lg:hidden">
              <div className="w-px h-8 bg-gray-300"></div>
            </div>

            {/* Step 3 */}
            <Card className="text-center p-8 flex-1 backdrop-blur-sm bg-white/70 border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Improve</h3>
                <p className="text-gray-600">
                  Get instant feedback and scoring to improve your interview
                  performance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-24">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-6 w-6" />
            <span className="text-xl font-bold">Mockr</span>
          </div>
          <p className="text-gray-400">© 2024 Mockr. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

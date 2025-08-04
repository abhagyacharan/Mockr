"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Target,
  ArrowRight,
  Star,
  FileText,
  Github,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {MockrDemo} from "@/components/MockrDemo";

interface LandingPageProps {
  setIsAuthModalOpen: (open: boolean) => void;
  setAuthMode: (mode: "login" | "signup") => void;
}

export default function LandingPage({
  setIsAuthModalOpen,
  setAuthMode,
}: LandingPageProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: "AI-Generated Questions",
      description:
        "Get personalized interview questions tailored to your resume and target job description",
      bgColor: "bg-blue-100",
    },
    {
      icon: <FileText className="h-8 w-8 text-purple-600" />,
      title: "Resume & JD Analysis",
      description:
        "Upload your resume or paste job descriptions for targeted interview preparation",
      bgColor: "bg-purple-100",
    },
    {
      icon: <Target className="h-8 w-8 text-green-600" />,
      title: "Multiple Question Types",
      description: "Practice with both MCQ and open-ended technical questions",
      bgColor: "bg-green-100",
    },
  ];

  const testimonials = [
    {
      rating: 5,
      content:
        "Mockr's AI questions were spot-on for my software engineering interview. I felt so prepared and confident!",
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      avatar: "S",
      bgColor: "bg-blue-500",
    },
    {
      rating: 5,
      content:
        "The resume-based questions helped me identify gaps in my experience. Landed my PM role at a unicorn startup!",
      name: "Michael Rodriguez",
      role: "Product Manager at Stripe",
      avatar: "M",
      bgColor: "bg-purple-500",
    },
    {
      rating: 5,
      content:
        "Perfect for behavioral questions! The feedback helped me improve my storytelling and got me into consulting.",
      name: "Aisha Patel",
      role: "Consultant at McKinsey",
      avatar: "A",
      bgColor: "bg-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-200">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition"
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
                  size={"lg"}
                  className="cursor-pointer"
                  onClick={() => {
                    setAuthMode("login");
                    setIsAuthModalOpen(true);
                  }}
                >
                  Login
                </Button>
                <Button
                  size={"lg"}
                  className="cursor-pointer"
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

      {/* Hero Section Split */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Half - Text Content */}
          <div className="text-center lg:text-left">
            <Badge variant="secondary" className="mb-4">
              AI-Powered Interview Preparation
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Ace Your Interviews with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                AI-Powered Practice
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl lg:max-w-none">
              Get personalized mock interview questions generated from your
              resume or job descriptions. Practice with confidence and land your
              dream job.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="text-lg px-8 cursor-pointer"
                onClick={() => {
                  if (user) {
                    navigate("/dashboard");
                  } else {
                    setAuthMode("signup");
                    setIsAuthModalOpen(true);
                  }
                }}
              >
                {user ? "Go to Dashboard" : "Get Started"}{" "}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="text-lg px-8 bg-white hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  if (user) {
                    navigate("/dashboard");
                  } else {
                    setAuthMode("signup");
                    setIsAuthModalOpen(true);
                  }
                }}
              >
                Try a Mock Test
              </Button>
            </div>

            {/* Trust Indicators */}
            {/* <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">Trusted by professionals at</p>
              <div className="flex items-center justify-center lg:justify-start space-x-6 opacity-60">
                <div className="text-2xl font-bold text-gray-400">Google</div>
                <div className="text-2xl font-bold text-gray-400">Meta</div>
                <div className="text-2xl font-bold text-gray-400">Amazon</div>
                <div className="text-2xl font-bold text-gray-400">Microsoft</div>
              </div>
            </div> */}
          </div>

          {/* Right Half - Interactive Demo */}
          <div className="relative">
            <MockrDemo />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Mockr?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform adapts to your specific needs and helps you
            prepare effectively
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-8 text-center">
                <div
                  className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className=" py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in just three simple steps
            </p>
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <Card className="text-center p-8 flex-1 border-0 shadow-md">
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
            <Card className="text-center p-8 flex-1 border-0 shadow-md">
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
            <Card className="text-center p-8 flex-1 border-0 shadow-md">
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
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600">
            See how Mockr helped professionals land their dream jobs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 ${testimonial.bgColor} rounded-full flex items-center justify-center text-white font-semibold`}
                  >
                    {testimonial.avatar}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of professionals who've successfully prepared with
            Mockr's AI-powered platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 bg-white text-gray-900 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                if (user) {
                  navigate("/dashboard");
                } else {
                  setAuthMode("signup");
                  setIsAuthModalOpen(true);
                }
              }}
            >
              Start Practicing Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className="h-6 w-6" />
              <span className="text-2xl font-bold">Mockr</span>
            </div>
            <p className="text-gray-400 mb-4">
              AI-powered interview preparation for your success
            </p>

            <p className="text-sm text-gray-500">
              © 2025 Mockr. All rights reserved.
            </p>

            {/* GitHub Link Section */}
            <div className="flex items-center justify-center space-x-2 mt-4">
              <span className="text-gray-400">Made with ❤️ by</span>
              <a
                href="https://github.com/abhagyacharan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                aria-label="View on GitHub"
              >
                <Github className="h-5 w-5" />
                <span>A Bhagya Charan</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

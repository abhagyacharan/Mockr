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
import { MockrDemo } from "@/components/MockrDemo";
import { motion, type Variants } from "framer-motion";

interface LandingPageProps {
  setIsAuthModalOpen: (open: boolean) => void;
  setAuthMode: (mode: "login" | "signup") => void;
}

// Animation Variants for Reusability
const sectionFadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardFadeInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

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
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-200 overflow-x-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="container mx-auto px-4 py-6"
      >
        <nav className="flex items-center justify-between">
          <motion.div
            onClick={() => navigate("/")}
            className="flex items-center space-x-3"
          >
            <Brain className="h-8 w-8 text-blue-600" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
              <span className="text-2xl font-bold text-gray-900">Mockr</span>
              <span className="text-xl text-gray-500 hidden sm:inline">|</span>
              <span className="text-lg mt-1 text-gray-500 hidden sm:inline">because <span className="font-bold italic">Interviews</span>{" "}
                shouldn't be a surprise.</span>
            </div>
          </motion.div>

          <div className="flex items-center space-x-3">
            {user ? (
              <motion.div>
                <Button className="cursor-pointer" onClick={() => navigate("/dashboard")}>Dashboard</Button>
              </motion.div>
            ) : (
              <>
                <motion.div>
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
                </motion.div>
                <motion.div>
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
                </motion.div>
              </>
            )}
          </div>
        </nav>
      </motion.header>

      {/* Hero Section Split */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Half - Text Content */}
          <motion.div
            className="text-center lg:text-left"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={cardFadeInUp}>
              <Badge variant="secondary" className="mb-4">
                AI-Powered Interview Preparation
              </Badge>
            </motion.div>
            <motion.h1
              variants={cardFadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Ace Your Interviews with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                AI-Powered Practice
              </span>
            </motion.h1>
            <motion.p
              variants={cardFadeInUp}
              className="text-xl text-gray-600 mb-8 max-w-2xl lg:max-w-none"
            >
              Get personalized mock interview questions generated from your
              resume or job descriptions. Practice with confidence and land your
              dream job.
            </motion.p>
            <motion.div
              variants={cardFadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.div>
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
              </motion.div>
              <motion.div>
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
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Half - Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="relative"
          >
            <MockrDemo />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          variants={sectionFadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Mockr?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform adapts to your specific needs and helps you
            prepare effectively
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardFadeInUp}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <Card className="border-0 shadow-lg h-full">
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            variants={sectionFadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in just three simple steps
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Step 1 */}
            <motion.div variants={cardFadeInUp} className="flex-1 w-full">
              <Card className="text-center p-8 border-0 shadow-md h-full">
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
            </motion.div>

            {/* Arrow/Line Separators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <ArrowRight className="h-8 w-8 text-gray-400 hidden lg:block" />
              <div className="w-px h-8 bg-gray-300 lg:hidden"></div>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={cardFadeInUp} className="flex-1 w-full">
              <Card className="text-center p-8 border-0 shadow-md h-full">
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
            </motion.div>
            
            {/* Arrow/Line Separators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              <ArrowRight className="h-8 w-8 text-gray-400 hidden lg:block" />
              <div className="w-px h-8 bg-gray-300 lg:hidden"></div>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={cardFadeInUp} className="flex-1 w-full">
              <Card className="text-center p-8 border-0 shadow-md h-full">
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          variants={sectionFadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600">
            See how Mockr helped professionals land their dream jobs
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardFadeInUp}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <Card className="border-0 shadow-md h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 ${testimonial.bgColor} rounded-full flex items-center justify-center text-white font-semibold`}
                    >
                      {testimonial.avatar}
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of professionals who've successfully prepared with
            Mockr's AI-powered platform
          </p>
          <motion.div
            className="flex justify-center"
          >
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
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        className="bg-gray-900 text-white py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className="h-6 w-6" />
              <span className="text-2xl font-bold">Mockr</span>
              <span className="text-lg text-gray-500 hidden sm:inline">
                | because <span className="font-bold italic">Interviews</span>{" "}
                shouldn't be a surprise.
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              AI-powered interview preparation for your success
            </p>

            <p className="text-sm text-gray-500">
              © 2025 Mockr. All rights reserved.
            </p>

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
      </motion.footer>
    </div>
  );
}

import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Trophy, ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

export function ResultsView({
  score,
  handleRestart,
}: {
  score: number;
  handleRestart: () => void;
}) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Show confetti if score >= 80
  useEffect(() => {
    if (score >= 80) {
      setShowConfetti(true);
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

      const timeout = setTimeout(() => {
        setShowConfetti(false);
      }, 10000); // stop after 5 seconds

      return () => clearTimeout(timeout);
    }
  }, [score]);

  const getScoreColor = () => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getFeedbackMessage = () => {
    if (score >= 80) return "Excellent work! You're interview-ready.";
    if (score >= 50) return "Nice effort! A bit more prep and you’re good.";
    return "Let’s improve. Try again with focus!";
  };

  return (
    <div className="text-center space-y-6 relative px-4">
      {showConfetti && (
        <Confetti width={windowSize.width} height={windowSize.height} />
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row md:items-center md:justify-center gap-4 mb-6"
      >
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <Trophy className="h-8 w-8 text-white" />
        </div>

        <div>
          <h3 className="text-2xl font-bold text-gray-900">Demo Complete!</h3>
          <p className="text-gray-600 text-sm">Here's how you performed</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="mx-auto text-center"
      >
        <div
          className={`text-4xl font-bold mb-1 ${
            score >= 80
              ? "text-green-600"
              : score >= 50
              ? "text-yellow-500"
              : "text-red-600"
          }`}
        >
          {score}%
        </div>
        <div className="text-sm text-gray-600">Final Score</div>
      </motion.div>

      <motion.p
        className={`text-sm font-medium ${getScoreColor()}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {getFeedbackMessage()}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-blue-50 p-4 rounded-lg space-y-1"
      >
        <div className="flex items-center justify-center text-blue-700 text-sm font-medium">
          <Zap className="w-5 h-5 mr-2 text-blue-600" />
          Ready for the real thing?
        </div>
        <p className="text-sm text-blue-700">
          Get personalized questions based on your resume and target job
          descriptions.
        </p>
      </motion.div>

      <motion.div
        className="space-y-3 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Button asChild className="w-full sm:w-auto" size="lg">
          <a href="/upload">
            Start Your Real Interview Prep
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>

        <Button
          variant={"outline"}
          onClick={handleRestart}
          className="w-full border sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100 text-sm font-medium py-2 px-4 rounded-md cursor-pointer"
          size="lg"
        >
          Try Demo Again
        </Button>
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { FileSearch, Clock } from "lucide-react";

export default function ATSChecker() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg rounded-2xl border bg-white/80 backdrop-blur-md shadow-xl p-8 text-center"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-blue-50 p-4">
            <FileSearch className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900">
          ATS Resume Checker
        </h1>
        <p className="mt-2 text-gray-600">
          Our AI-powered ATS (Applicant Tracking System) resume scoring tool
          will help you optimize your resume for recruiters and job portals.
        </p>

        {/* Coming Soon Banner */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 inline-flex items-center gap-2 text-yellow-700"
        >
          <Clock className="h-5 w-5" />
          <span className="font-medium">Coming Soon!</span>
        </motion.div>        
      </motion.div>
    </div>
  );
}

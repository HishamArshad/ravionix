"use client";

import { motion } from "framer-motion";
import { FileText, Zap, BookOpen } from "lucide-react";

export default function AssignmentHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      {/* Title */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Assignment Generator</h1>
          <p className="text-sm text-gray-400">
            Generate structured, academic-quality assignments instantly
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <Zap className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-400 font-medium">
            2 assignments left today
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-400 font-medium">
            12 generated this week
          </span>
        </div>
      </div>
    </motion.div>
  );
}
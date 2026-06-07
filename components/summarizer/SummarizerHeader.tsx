"use client";

import { motion } from "framer-motion";
import { Brain, Zap, BookOpen } from "lucide-react";

export default function SummarizerHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      {/* Title */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Summarizer</h1>
          <p className="text-sm text-gray-400">
            Convert long texts into concise, actionable summaries instantly
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <Zap className="w-4 h-4 text-indigo-400" />
          <span className="text-sm text-indigo-400 font-medium">
            10 summaries left today
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <BookOpen className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-400 font-medium">
            47 summaries this month
          </span>
        </div>
      </div>
    </motion.div>
  );
}
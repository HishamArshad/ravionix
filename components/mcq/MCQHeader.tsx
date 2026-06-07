"use client";

import { motion } from "framer-motion";
import { Brain, Zap, BookMarked } from "lucide-react";

export default function MCQHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      {/* Title */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">MCQ Generator</h1>
          <p className="text-sm text-gray-400">
            Generate practice questions from any text or topic
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <Brain className="w-4 h-4 text-indigo-400" />
          <span className="text-sm text-indigo-400 font-medium">
            Smart difficulty levels
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <Zap className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-400 font-medium">
            5 MCQs left today
          </span>
        </div>
      </div>
    </motion.div>
  );
}
"use client";

import { motion } from "framer-motion";
import { BookOpen, Zap, Library } from "lucide-react";

export default function CitationHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      {/* Title */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Citation Generator</h1>
          <p className="text-sm text-gray-400">
            Generate accurate citations in all major academic styles
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <Library className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-400 font-medium">
            APA · MLA · Chicago · Harvard
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-400 font-medium">
            Unlimited citations
          </span>
        </div>
      </div>
    </motion.div>
  );
}
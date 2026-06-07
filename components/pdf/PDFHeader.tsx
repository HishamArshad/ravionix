"use client";

import { motion } from "framer-motion";
import { FileSearch, Zap, Brain } from "lucide-react";

export default function PDFHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      {/* Title */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg shadow-red-500/20">
          <FileSearch className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">PDF Summarizer</h1>
          <p className="text-sm text-gray-400">
            Upload research papers and get instant AI-powered summaries
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
          <Brain className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-400 font-medium">
            Smart extraction
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500/10 border border-pink-500/20">
          <Zap className="w-4 h-4 text-pink-400" />
          <span className="text-sm text-pink-400 font-medium">
            3 PDFs left today
          </span>
        </div>
      </div>
    </motion.div>
  );
}
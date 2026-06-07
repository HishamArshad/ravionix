"use client";

import { motion } from "framer-motion";
import { Shield, CheckCircle, Zap } from "lucide-react";

export default function PlagiarismHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      {/* Title */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Plagiarism Checker</h1>
          <p className="text-sm text-gray-400">
            Scan your text against billions of sources instantly
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-400 font-medium">
            Checks Turnitin + Google
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <Zap className="w-4 h-4 text-orange-400" />
          <span className="text-sm text-orange-400 font-medium">
            3 checks left today
          </span>
        </div>
      </div>
    </motion.div>
  );
}
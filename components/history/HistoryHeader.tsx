"use client";

import { motion } from "framer-motion";
import { History, Download, Trash2 } from "lucide-react";

export default function HistoryHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center shadow-lg shadow-slate-500/20">
          <History className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Activity History</h1>
          <p className="text-sm text-gray-400">
            All your tool usage across the platform
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-gray-400 transition">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-sm text-red-400 transition">
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>
    </motion.div>
  );
}
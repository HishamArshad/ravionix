"use client";

import { motion } from "framer-motion";
import {
  Wand2,
  FileText,
  Shield,
  BookOpen,
  Calculator,
  FileSearch,
  TrendingUp,
  Clock,
} from "lucide-react";

const stats = [
  { label: "Humanizations", value: 48, icon: Wand2, color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20" },
  { label: "Assignments", value: 12, icon: FileText, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  { label: "Plagiarism Checks", value: 23, icon: Shield, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  { label: "Citations", value: 67, icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { label: "Physics Solved", value: 31, icon: Calculator, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  { label: "PDFs Summarized", value: 9, icon: FileSearch, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  { label: "This Month", value: 94, icon: TrendingUp, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
  { label: "Total Hours Saved", value: "18h", icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
];

export default function HistoryStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className={`p-4 rounded-2xl border text-center ${stat.bg}`}
        >
          <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
          <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  History,
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Eye,
  Download,
  Trash2,
  FileText,
} from "lucide-react";

const mockHistory = [
  {
    id: 1,
    title: "Physics Lab Report - Thermodynamics",
    score: 8,
    wordCount: 1240,
    sourcesFound: 2,
    date: "Today, 4:20 PM",
    status: "clean",
  },
  {
    id: 2,
    title: "Essay on Climate Change Effects",
    score: 23,
    wordCount: 980,
    sourcesFound: 5,
    date: "Today, 1:05 PM",
    status: "acceptable",
  },
  {
    id: 3,
    title: "Literature Review - Machine Learning",
    score: 41,
    wordCount: 2100,
    sourcesFound: 9,
    date: "Yesterday",
    status: "high",
  },
  {
    id: 4,
    title: "Case Study - Business Management",
    score: 12,
    wordCount: 1560,
    sourcesFound: 3,
    date: "2 days ago",
    status: "clean",
  },
];

function ScoreBadge({ score }: { score: number }) {
  if (score <= 15) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/20">
        <CheckCircle className="w-3.5 h-3.5 text-green-400" />
        <span className="text-xs font-semibold text-green-400">{score}%</span>
      </div>
    );
  }
  if (score <= 30) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
        <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
        <span className="text-xs font-semibold text-yellow-400">{score}%</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
      <XCircle className="w-3.5 h-3.5 text-red-400" />
      <span className="text-xs font-semibold text-red-400">{score}%</span>
    </div>
  );
}

export default function PlagiarismHistory() {
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const visible = mockHistory.filter((h) => !deletedIds.includes(h.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-medium text-gray-300">Check History</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">
            {visible.length}
          </span>
        </div>
        <button
          onClick={() => setDeletedIds(mockHistory.map((h) => h.id))}
          className="text-xs text-gray-500 hover:text-red-400 transition flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          Clear All
        </button>
      </div>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-xs text-gray-600 uppercase tracking-wider">
        <div className="col-span-5">Document</div>
        <div className="col-span-2">Score</div>
        <div className="col-span-2">Sources</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-1">Actions</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {visible.length === 0 ? (
          <div className="py-12 text-center">
            <Shield className="w-8 h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No checks yet</p>
          </div>
        ) : (
          visible.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 hover:bg-white/5 transition group items-center"
            >
              {/* Title */}
              <div className="md:col-span-5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-200 font-medium line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500">{item.wordCount.toLocaleString()} words</p>
                </div>
              </div>

              {/* Score */}
              <div className="md:col-span-2">
                <ScoreBadge score={item.score} />
              </div>

              {/* Sources */}
              <div className="md:col-span-2">
                <span className="text-sm text-gray-400">
                  {item.sourcesFound} source{item.sourcesFound !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Date */}
              <div className="md:col-span-2 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-gray-600" />
                <span className="text-xs text-gray-500">{item.date}</span>
              </div>

              {/* Actions */}
              <div className="md:col-span-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  title="View report"
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  title="Download PDF"
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeletedIds((p) => [...p, item.id])}
                  title="Delete"
                  className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/5 text-center">
        <button className="text-sm text-gray-500 hover:text-orange-400 transition">
          View all reports →
        </button>
      </div>
    </motion.div>
  );
}
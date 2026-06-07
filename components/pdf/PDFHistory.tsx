"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  FileText,
  Clock,
  Eye,
  Download,
  Trash2,
  ChevronDown,
  Hash,
  AlignLeft,
} from "lucide-react";

interface HistoryItem {
  id: number;
  title: string;
  type: string;
  pages: number;
  wordCount: number;
  summaryLength: "short" | "medium" | "detailed";
  date: string;
  keyPointsCount: number;
}

const mockHistory: HistoryItem[] = [
  {
    id: 1,
    title: "Impact of Climate Change on Global Agricultural Systems",
    type: "Research Paper",
    pages: 24,
    wordCount: 8420,
    summaryLength: "detailed",
    date: "Today, 4:30 PM",
    keyPointsCount: 7,
  },
  {
    id: 2,
    title: "Machine Learning in Medical Diagnosis: A Systematic Review",
    type: "Systematic Review",
    pages: 18,
    wordCount: 6200,
    summaryLength: "medium",
    date: "Today, 2:15 PM",
    keyPointsCount: 5,
  },
  {
    id: 3,
    title: "Quantum Entanglement and its Applications in Cryptography",
    type: "Research Paper",
    pages: 12,
    wordCount: 4100,
    summaryLength: "short",
    date: "Yesterday",
    keyPointsCount: 4,
  },
  {
    id: 4,
    title: "Social Media Influence on Political Opinion Formation",
    type: "Case Study",
    pages: 32,
    wordCount: 11500,
    summaryLength: "detailed",
    date: "2 days ago",
    keyPointsCount: 9,
  },
];

const LENGTH_STYLES = {
  short: "text-green-400 bg-green-500/10 border-green-500/20",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  detailed: "text-red-400 bg-red-500/10 border-red-500/20",
};

export default function PDFHistory() {
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

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
          <h3 className="text-sm font-medium text-gray-300">
            Summarized PDFs
          </h3>
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
        <div className="col-span-2">Length</div>
        <div className="col-span-2">Stats</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-1">Actions</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {visible.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="w-8 h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No PDFs summarized yet</p>
          </div>
        ) : (
          visible.map((item, i) => {
            const isExpanded = expandedId === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="hover:bg-white/5 transition"
              >
                <div
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 items-center cursor-pointer group"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  {/* Title */}
                  <div className="md:col-span-5 flex items-center gap-3">
                    <div className="w-9 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 relative">
                      <FileText className="w-4 h-4 text-red-400" />
                      <span className="absolute -bottom-1 -right-1 text-[6px] font-bold px-0.5 py-0.5 rounded bg-red-500 text-white">
                        PDF
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-200 font-medium line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.type}</p>
                    </div>
                  </div>

                  {/* Length */}
                  <div className="md:col-span-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${LENGTH_STYLES[item.summaryLength]}`}>
                      {item.summaryLength}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="md:col-span-2 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Hash className="w-3 h-3 text-gray-600" />
                      {item.pages} pages
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <AlignLeft className="w-3 h-3 text-gray-600" />
                      {item.keyPointsCount} key points
                    </div>
                  </div>

                  {/* Date */}
                  <div className="md:col-span-2 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-gray-600" />
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      title="View summary"
                      className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      title="Download"
                      className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeletedIds((p) => [...p, item.id]); }}
                      title="Delete"
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                </div>

                {/* Expanded Row */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4">
                        <div className="ml-12 p-4 rounded-xl bg-[#0d0d14] border border-white/10">
                          <div className="grid grid-cols-3 gap-3 text-center">
                            {[
                              { label: "Pages", value: item.pages },
                              { label: "Words", value: item.wordCount.toLocaleString() },
                              { label: "Key Points", value: item.keyPointsCount },
                            ].map((stat, j) => (
                              <div key={j} className="p-2 rounded-lg bg-white/5">
                                <p className="text-base font-bold text-red-400">{stat.value}</p>
                                <p className="text-[10px] text-gray-500">{stat.label}</p>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-gray-400 transition">
                              <Eye className="w-3.5 h-3.5" />
                              View Full Summary
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-xs text-red-400 transition">
                              <Download className="w-3.5 h-3.5" />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/5 text-center">
        <button className="text-sm text-gray-500 hover:text-red-400 transition">
          View all summaries →
        </button>
      </div>
    </motion.div>
  );
}
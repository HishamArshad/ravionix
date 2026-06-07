"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Globe,
  BookOpen,
  FileText,
  Newspaper,
  Video,
  Mic,
  GraduationCap,
  Database,
  Copy,
  CheckCheck,
  Trash2,
  Clock,
  ChevronDown,
} from "lucide-react";

type SourceType = "website" | "book" | "journal" | "newspaper" | "video" | "podcast" | "thesis" | "database";
type CitationStyle = "apa" | "mla" | "chicago" | "harvard" | "vancouver" | "ieee";

interface HistoryItem {
  id: number;
  sourceType: SourceType;
  style: CitationStyle;
  title: string;
  formatted: string;
  inText: string;
  date: string;
}

const mockHistory: HistoryItem[] = [
  {
    id: 1,
    sourceType: "journal",
    style: "apa",
    title: "Impact of Climate Change on Agriculture",
    formatted: `Khan, A., & Ali, B. (2023). Impact of climate change on agriculture. *Nature Climate Change*, *15*(2), 45–67. https://doi.org/10.1038/example`,
    inText: "(Khan & Ali, 2023)",
    date: "Today, 3:15 PM",
  },
  {
    id: 2,
    sourceType: "book",
    style: "mla",
    title: "Introduction to Quantum Mechanics",
    formatted: `Griffiths, David J. *Introduction to Quantum Mechanics*. Cambridge University Press, 2023.`,
    inText: "(Griffiths 45)",
    date: "Today, 11:45 AM",
  },
  {
    id: 3,
    sourceType: "website",
    style: "apa",
    title: "What is Machine Learning?",
    formatted: `Smith, J. (2022). What is machine learning? *IBM*. https://ibm.com/ml`,
    inText: "(Smith, 2022)",
    date: "Yesterday",
  },
  {
    id: 4,
    sourceType: "video",
    style: "apa",
    title: "How Quantum Computers Work",
    formatted: `Veritasium. (2023, May 10). *How quantum computers work* [Video]. YouTube. https://youtube.com/watch?v=example`,
    inText: "(Veritasium, 2023)",
    date: "2 days ago",
  },
];

const SOURCE_ICONS: Record<SourceType, React.ElementType> = {
  website: Globe,
  book: BookOpen,
  journal: FileText,
  newspaper: Newspaper,
  video: Video,
  podcast: Mic,
  thesis: GraduationCap,
  database: Database,
};

const SOURCE_COLORS: Record<SourceType, string> = {
  website: "text-blue-400 bg-blue-500/10",
  book: "text-purple-400 bg-purple-500/10",
  journal: "text-green-400 bg-green-500/10",
  newspaper: "text-yellow-400 bg-yellow-500/10",
  video: "text-red-400 bg-red-500/10",
  podcast: "text-pink-400 bg-pink-500/10",
  thesis: "text-orange-400 bg-orange-500/10",
  database: "text-cyan-400 bg-cyan-500/10",
};

const STYLE_COLORS: Record<CitationStyle, string> = {
  apa: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  mla: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  chicago: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  harvard: "text-green-400 bg-green-500/10 border-green-500/20",
  vancouver: "text-red-400 bg-red-500/10 border-red-500/20",
  ieee: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
};

export default function CitationHistory() {
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const visible = mockHistory.filter((h) => !deletedIds.includes(h.id));

  const handleCopy = async (text: string, id: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
          <h3 className="text-sm font-medium text-gray-300">Citation History</h3>
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

      {/* Items */}
      <div className="divide-y divide-white/5">
        {visible.length === 0 ? (
          <div className="py-12 text-center">
            <BookOpen className="w-8 h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No citations yet</p>
          </div>
        ) : (
          visible.map((item, i) => {
            const Icon = SOURCE_ICONS[item.sourceType];
            const isExpanded = expandedId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="p-5 hover:bg-white/5 transition"
              >
                {/* Row */}
                <div
                  className="flex items-start gap-3 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  {/* Source icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${SOURCE_COLORS[item.sourceType]}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${STYLE_COLORS[item.style]}`}>
                        {item.style.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {item.sourceType}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate font-mono">
                      {item.formatted}
                    </p>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {item.date}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(item.formatted, item.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition"
                    >
                      {copiedId === item.id ? (
                        <CheckCheck className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-gray-500" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletedIds((p) => [...p, item.id]);
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                </div>

                {/* Expanded */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 ml-12 space-y-3">
                        {/* Full citation */}
                        <div className="p-3 rounded-xl bg-[#0d0d14] border border-white/10">
                          <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">
                            Full Citation
                          </p>
                          <p className="text-xs text-gray-300 font-mono leading-relaxed">
                            {item.formatted}
                          </p>
                        </div>
                        {/* In-text */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 p-3 rounded-xl bg-[#0d0d14] border border-white/10">
                            <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">
                              In-Text
                            </p>
                            <p className="text-xs text-gray-300 font-mono">
                              {item.inText}
                            </p>
                          </div>
                          <button
                            onClick={() => handleCopy(item.inText, item.id * 100)}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                          >
                            {copiedId === item.id * 100 ? (
                              <CheckCheck className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
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
        <button className="text-sm text-gray-500 hover:text-blue-400 transition">
          View all citations →
        </button>
      </div>
    </motion.div>
  );
}
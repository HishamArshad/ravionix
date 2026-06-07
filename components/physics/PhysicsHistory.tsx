"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Calculator,
  Clock,
  Eye,
  Copy,
  CheckCheck,
  Trash2,
  ChevronDown,
  Box,
  Thermometer,
  Radio,
  Zap,
  Atom,
  Magnet,
  Sun,
  Eye as Optics,
} from "lucide-react";

interface HistoryItem {
  id: number;
  problem: string;
  answer: string;
  unit: string;
  topic: string;
  subtopic: string;
  difficulty: "basic" | "intermediate" | "advanced";
  steps: number;
  date: string;
}

const mockHistory: HistoryItem[] = [
  {
    id: 1,
    problem: "A car accelerates from rest at 3 m/s² for 5 seconds. Find the final velocity.",
    answer: "15",
    unit: "m/s",
    topic: "mechanics",
    subtopic: "Kinematics",
    difficulty: "basic",
    steps: 4,
    date: "Today, 3:45 PM",
  },
  {
    id: 2,
    problem: "Three resistors 4Ω, 6Ω, 12Ω connected in parallel across 12V. Find equivalent resistance.",
    answer: "2",
    unit: "Ω",
    topic: "electricity",
    subtopic: "Circuits",
    difficulty: "intermediate",
    steps: 5,
    date: "Today, 1:20 PM",
  },
  {
    id: 3,
    problem: "A train whistle at 500 Hz moves at 30 m/s. Speed of sound = 340 m/s. Find observed frequency.",
    answer: "547",
    unit: "Hz",
    topic: "waves",
    subtopic: "Doppler Effect",
    difficulty: "intermediate",
    steps: 3,
    date: "Yesterday",
  },
  {
    id: 4,
    problem: "Light of wavelength 400nm hits metal with work function 2.0 eV. Find max KE of electrons.",
    answer: "1.1",
    unit: "eV",
    topic: "modern",
    subtopic: "Photoelectric Effect",
    difficulty: "advanced",
    steps: 6,
    date: "2 days ago",
  },
];

const TOPIC_CONFIG: Record<string, {
  icon: React.ElementType;
  color: string;
  bg: string;
  label: string;
}> = {
  mechanics: { icon: Box, color: "text-blue-400", bg: "bg-blue-500/10", label: "Mechanics" },
  thermodynamics: { icon: Thermometer, color: "text-red-400", bg: "bg-red-500/10", label: "Thermodynamics" },
  waves: { icon: Radio, color: "text-purple-400", bg: "bg-purple-500/10", label: "Waves" },
  electricity: { icon: Zap, color: "text-orange-400", bg: "bg-orange-500/10", label: "Electricity" },
  magnetism: { icon: Magnet, color: "text-pink-400", bg: "bg-pink-500/10", label: "Magnetism" },
  modern: { icon: Atom, color: "text-cyan-400", bg: "bg-cyan-500/10", label: "Modern" },
  quantum: { icon: Sun, color: "text-violet-400", bg: "bg-violet-500/10", label: "Quantum" },
  optics: { icon: Optics, color: "text-yellow-400", bg: "bg-yellow-500/10", label: "Optics" },
};

const DIFFICULTY_STYLES = {
  basic: "text-green-400 bg-green-500/10 border-green-500/20",
  intermediate: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  advanced: "text-red-400 bg-red-500/10 border-red-500/20",
};

export default function PhysicsHistory() {
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const visible = mockHistory.filter((h) => !deletedIds.includes(h.id));

  const handleCopy = async (item: HistoryItem) => {
    await navigator.clipboard.writeText(
      `Problem: ${item.problem}\nAnswer: ${item.answer} ${item.unit}`
    );
    setCopiedId(item.id);
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
          <h3 className="text-sm font-medium text-gray-300">Solved Problems</h3>
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
        <div className="col-span-5">Problem</div>
        <div className="col-span-2">Answer</div>
        <div className="col-span-2">Topic</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-1">Actions</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {visible.length === 0 ? (
          <div className="py-12 text-center">
            <Calculator className="w-8 h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No problems solved yet</p>
          </div>
        ) : (
          visible.map((item, i) => {
            const config = TOPIC_CONFIG[item.topic] ?? TOPIC_CONFIG.mechanics;
            const Icon = config.icon;
            const isExpanded = expandedId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="hover:bg-white/5 transition"
              >
                {/* Main Row */}
                <div
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 items-center cursor-pointer group"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  {/* Problem */}
                  <div className="md:col-span-5 space-y-1">
                    <p className="text-sm text-gray-200 font-medium line-clamp-1">
                      {item.problem}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${DIFFICULTY_STYLES[item.difficulty]}`}>
                        {item.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">{item.steps} steps</span>
                      <span className="text-xs text-gray-600">{item.subtopic}</span>
                    </div>
                  </div>

                  {/* Answer */}
                  <div className="md:col-span-2">
                    <span className="text-base font-bold text-green-400">
                      {item.answer}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">{item.unit}</span>
                  </div>

                  {/* Topic */}
                  <div className="md:col-span-2">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${config.bg}`}>
                      <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                      <span className={`text-xs font-medium ${config.color}`}>
                        {config.label}
                      </span>
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
                      onClick={(e) => { e.stopPropagation(); handleCopy(item); }}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition"
                    >
                      {copiedId === item.id ? (
                        <CheckCheck className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-gray-500" />
                      )}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeletedIds((p) => [...p, item.id]); }}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                </div>

                {/* Expanded Problem */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 ml-0 md:ml-4">
                        <div className="p-4 rounded-xl bg-[#0d0d14] border border-white/10 space-y-3">
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                              Full Problem
                            </p>
                            <p className="text-sm text-gray-300 leading-relaxed">
                              {item.problem}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                              <p className="text-[10px] text-green-500 mb-0.5">Answer</p>
                              <p className="text-lg font-bold text-green-400">
                                {item.answer} <span className="text-sm">{item.unit}</span>
                              </p>
                            </div>
                            <button
                              onClick={() => handleCopy(item)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-gray-400 transition"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View Full Solution
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
        <button className="text-sm text-gray-500 hover:text-green-400 transition">
          View all solved problems →
        </button>
      </div>
    </motion.div>
  );
}
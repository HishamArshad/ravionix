"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Copy,
  CheckCheck,
  RotateCcw,
  Download,
  Wand2,
  Globe,
  GraduationCap,
  Newspaper,
  BookOpen,
  ChevronDown,
  Info,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────
interface SourceMatch {
  id: number;
  url: string;
  title: string;
  matchPercentage: number;
  matchedText: string;
  sourceType: "web" | "academic" | "news" | "book";
}

interface ScoreBreakdown {
  internet: number;
  academic: number;
  news: number;
  books: number;
}

interface PlagiarismResult {
  overallScore: number;
  aiScore: number;
  uniqueScore: number;
  wordCount: number;
  sentencesChecked: number;
  sources: SourceMatch[];
  breakdown: ScoreBreakdown;
}

interface PlagiarismResultsProps {
  result: PlagiarismResult;
  onRecheck: () => void;
}

// ── Helpers ────────────────────────────────────────────
function getScoreLevel(score: number) {
  if (score <= 15) return { label: "Excellent", color: "text-green-400", bg: "bg-green-500", ring: "ring-green-500/30", icon: CheckCircle };
  if (score <= 30) return { label: "Acceptable", color: "text-yellow-400", bg: "bg-yellow-500", ring: "ring-yellow-500/30", icon: AlertTriangle };
  return { label: "High Risk", color: "text-red-400", bg: "bg-red-500", ring: "ring-red-500/30", icon: XCircle };
}

function getSourceIcon(type: SourceMatch["sourceType"]) {
  switch (type) {
    case "web": return Globe;
    case "academic": return GraduationCap;
    case "news": return Newspaper;
    case "book": return BookOpen;
  }
}

function getSourceColor(type: SourceMatch["sourceType"]) {
  switch (type) {
    case "web": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    case "academic": return "text-purple-400 bg-purple-500/10 border-purple-500/20";
    case "news": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    case "book": return "text-green-400 bg-green-500/10 border-green-500/20";
  }
}

// ── Circular Progress ──────────────────────────────────
function CircularScore({
  score,
  size = 120,
  strokeWidth = 8,
  label,
  sublabel,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  sublabel: string;
}) {
  const level = getScoreLevel(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#scoreGrad)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={score <= 15 ? "#22c55e" : score <= 30 ? "#eab308" : "#ef4444"} />
              <stop offset="100%" stopColor={score <= 15 ? "#16a34a" : score <= 30 ? "#ca8a04" : "#dc2626"} />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${level.color}`}>{score}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className={`text-sm font-semibold ${level.color}`}>{label}</p>
        <p className="text-xs text-gray-500">{sublabel}</p>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────
export default function PlagiarismResults({
  result,
  onRecheck,
}: PlagiarismResultsProps) {
  const [expandedSource, setExpandedSource] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);
  const level = getScoreLevel(result.overallScore);

  const handleCopyReport = useCallback(async () => {
    const report = `
PLAGIARISM REPORT
=================
Overall Score: ${result.overallScore}%
AI Content: ${result.aiScore}%
Unique: ${result.uniqueScore}%
Words Checked: ${result.wordCount}
Sentences Checked: ${result.sentencesChecked}

SOURCE MATCHES
==============
${result.sources
  .map((s) => `[${s.matchPercentage}%] ${s.title}\n${s.url}\n"${s.matchedText}"`)
  .join("\n\n")}
    `.trim();
    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* ── Score Header Banner ── */}
      <div className={`p-5 rounded-2xl border ${
        result.overallScore <= 15
          ? "bg-green-500/10 border-green-500/30"
          : result.overallScore <= 30
          ? "bg-yellow-500/10 border-yellow-500/30"
          : "bg-red-500/10 border-red-500/30"
      }`}>
        <div className="flex items-center gap-3">
          <level.icon className={`w-5 h-5 ${level.color} flex-shrink-0`} />
          <div>
            <p className={`font-semibold ${level.color}`}>
              {level.label} — {result.overallScore}% similarity detected
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {result.overallScore <= 15
                ? "Your text appears mostly original. Minor matches are acceptable."
                : result.overallScore <= 30
                ? "Some similarity detected. Review highlighted sources below."
                : "High similarity detected. Significant rewriting recommended."}
            </p>
          </div>
        </div>
      </div>

      {/* ── Score Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main circular score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-1 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          <CircularScore
            score={result.overallScore}
            size={140}
            strokeWidth={10}
            label={level.label}
            sublabel="Overall Similarity"
          />
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 grid grid-cols-2 gap-3"
        >
          {[
            {
              label: "Unique Content",
              value: `${result.uniqueScore}%`,
              sub: "Original writing",
              color: "text-green-400",
              bg: "bg-green-500/10 border-green-500/20",
              icon: CheckCircle,
            },
            {
              label: "AI Content",
              value: `${result.aiScore}%`,
              sub: "AI-generated text",
              color: "text-blue-400",
              bg: "bg-blue-500/10 border-blue-500/20",
              icon: Info,
            },
            {
              label: "Words Checked",
              value: result.wordCount.toLocaleString(),
              sub: "Total words",
              color: "text-purple-400",
              bg: "bg-purple-500/10 border-purple-500/20",
              icon: CheckCheck,
            },
            {
              label: "Sources Found",
              value: result.sources.length,
              sub: `Matched sources`,
              color: "text-orange-400",
              bg: "bg-orange-500/10 border-orange-500/20",
              icon: ExternalLink,
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className={`p-4 rounded-xl border ${stat.bg} flex items-start gap-3`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color} flex-shrink-0 mt-0.5`} />
              <div>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-300 font-medium">{stat.label}</p>
                <p className="text-[10px] text-gray-500">{stat.sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Source Breakdown Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-5 rounded-2xl bg-white/5 border border-white/10"
      >
        <p className="text-sm font-medium text-gray-300 mb-4">
          Similarity by Source Type
        </p>
        <div className="space-y-3">
          {[
            { label: "Internet", value: result.breakdown.internet, color: "from-blue-500 to-cyan-500", icon: Globe },
            { label: "Academic", value: result.breakdown.academic, color: "from-purple-500 to-pink-500", icon: GraduationCap },
            { label: "News", value: result.breakdown.news, color: "from-yellow-500 to-orange-500", icon: Newspaper },
            { label: "Books", value: result.breakdown.books, color: "from-green-500 to-emerald-500", icon: BookOpen },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-28 flex-shrink-0">
                <item.icon className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-400">{item.label}</span>
              </div>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(item.value * 3, 100)}%` }}
                  transition={{ duration: 1, delay: 0.4 + i * 0.1 }}
                />
              </div>
              <span className="text-xs font-medium text-gray-400 w-10 text-right">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Source Matches ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-300">
              Matched Sources
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">
              {result.sources.length}
            </span>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {result.sources.map((source, i) => {
            const SourceIcon = getSourceIcon(source.sourceType);
            const isExpanded = expandedSource === source.id;

            return (
              <motion.div
                key={source.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="p-5"
              >
                {/* Source Header */}
                <div
                  className="flex items-start gap-4 cursor-pointer"
                  onClick={() => setExpandedSource(isExpanded ? null : source.id)}
                >
                  {/* Match % badge */}
                  <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center ${
                    source.matchPercentage >= 15
                      ? "bg-red-500/20"
                      : source.matchPercentage >= 8
                      ? "bg-yellow-500/20"
                      : "bg-green-500/20"
                  }`}>
                    <span className={`text-lg font-bold ${
                      source.matchPercentage >= 15
                        ? "text-red-400"
                        : source.matchPercentage >= 8
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}>
                      {source.matchPercentage}%
                    </span>
                  </div>

                  {/* Source Info */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${getSourceColor(source.sourceType)}`}>
                        <SourceIcon className="w-3 h-3" />
                        {source.sourceType.charAt(0).toUpperCase() + source.sourceType.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Match #{i + 1}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {source.title}
                    </p>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 truncate w-fit"
                    >
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{source.url}</span>
                    </a>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-gray-600 flex-shrink-0 transition mt-1 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Matched Text Expand */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 ml-[4.5rem]">
                        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Matched text:
                        </p>
                        <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                          <p className="text-sm text-gray-300 leading-relaxed italic">
                            "{source.matchedText}"
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Action Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10"
      >
        <div className="flex items-center gap-2 flex-1">
          <TrendingDown className="w-4 h-4 text-pink-400" />
          <p className="text-sm text-gray-400">
            High plagiarism?{" "}
            <span className="text-pink-400 font-medium">Humanize your text</span>
            {" "}to make it original.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onRecheck}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-gray-400 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Recheck
          </button>
          <button
            onClick={handleCopyReport}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition ${
              copied
                ? "bg-green-500/20 border-green-500/30 text-green-400"
                : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
            }`}
          >
            {copied ? (
              <><CheckCheck className="w-3.5 h-3.5" /> Copied!</>
            ) : (
              <><Copy className="w-3.5 h-3.5" /> Copy Report</>
            )}
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-gray-400 transition">
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </button>
          <Link
            href="/dashboard/humanizer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500/20 to-orange-500/20 border border-pink-500/30 hover:from-pink-500/30 hover:to-orange-500/30 text-sm text-pink-400 font-medium transition"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Humanize Text
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  CheckCheck,
  Download,
  Share2,
  FileText,
  List,
  BookOpen,
  Lightbulb,
  Clock,
  Zap,
  Eye,
  ChevronDown,
  Filter,
} from "lucide-react";
import type { SummaryResult } from "./SummarizerInput";
import { authService } from "../api/authService";

interface SummarizerResultProps {
  result: SummaryResult | null;
  onCopy: () => void;
  copied: boolean;
}

type ViewTab = "summary" | "keypoints" | "terms" | "questions" | "notes";

export default function SummarizerResult({
  result,
  onCopy,
  copied,
}: SummarizerResultProps) {
  const [activeTab, setActiveTab] = useState<ViewTab>("summary");
  const [showFilters, setShowFilters] = useState(false);
const [exportItemId, setExportItemId] = useState<number | null>(null);
const handleExport = async (id: number, format: "pdf" | "docx") => {
  try {
    const blob = await authService.summarizerExport(id, format);

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `summary-${id}.${format}`;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Export failed", err);
  } finally {
    setExportItemId(null);
  }
};
// console.log("FULL RESULT:", result);
  if (!result) {
    return (
      <div className="h-full min-h-[400px] rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4 text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
          <FileText className="w-8 h-8 text-gray-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">
            Summary will appear here
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Enter text and click "Generate Summary"
          </p>
        </div>
      </div>
    );
  }

  const TABS: { key: ViewTab; label: string; icon: React.ElementType; count: number }[] = [
    { key: "summary", label: "Summary", icon: FileText, count: 1 },
    { key: "keypoints", label: "Key Points", icon: List, count: result?.keyPoints?.length ?? 0 },
    { key: "terms", label: "Terms", icon: BookOpen, count: result?.keyTerms?.length ?? 0 },
    { key: "questions", label: "Questions", icon: Lightbulb, count: result?.studyQuestions?.length ?? 0 },
    { key: "notes", label: "Exam Notes", icon: Eye, count: result?.examNotes?.length ?? 0 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex flex-col"
    >
      {/* ── Header ── */}
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-500">
              {result.processingTime}s processing
            </span>
          </div>
          <div className="text-gray-700">•</div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-xs text-gray-500">
              {result.compressionRatio}% shorter
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              copied
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
            }`}
          >
            {copied ? (
              <><CheckCheck className="w-3.5 h-3.5" /> Copied!</>
            ) : (
              <><Copy className="w-3.5 h-3.5" /> Copy</>
            )}
          </button>
          <button 
            onClick={(e) => {
            e.stopPropagation();
            setExportItemId(result.id);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 border border-white/10 hover:bg-white/10 transition">
            <Download className="w-3.5 h-3.5" />
            Save
          </button> 
        </div> 
      </div>

      {/* ── Stats ── */}
      <div className="px-5 py-3 border-b border-white/5 grid grid-cols-4 gap-2">
        {[
        { icon: FileText, label: "Original", value: `${result?.originalWordCount ?? 0}w` },
        { icon: Zap, label: "Summary", value: `${result?.summaryWordCount ?? 0}w` },
        { icon: Clock, label: "Reading", value: `${result?.readingTimeSaved ?? 0}m` },
        { icon: Copy, label: "Reduction", value: `${Math.round((1 - (result?.compressionRatio ?? 0)) * 100)}%` },
        ].map((stat, i) => (
          <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 text-center">
            <stat.icon className="w-3 h-3 text-gray-500" />
            <div>
              <p className="text-[10px] text-gray-600">{stat.label}</p>
              <p className="text-xs font-semibold text-gray-200">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="flex overflow-x-auto border-b border-white/5 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex-shrink-0 flex items-center gap-2 px-5 py-3.5 text-xs font-medium transition whitespace-nowrap ${
              activeTab === tab.key
                ? "text-indigo-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === tab.key
                ? "bg-indigo-500/20 text-indigo-400"
                : "bg-white/5 text-gray-600"
            }`}>
              {tab.count}
            </span>
            {activeTab === tab.key && (
              <motion.div
                layoutId="summarizerTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto p-5">
        <AnimatePresence mode="wait">
          {/* {activeTab === "summary" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="prose prose-invert prose-sm max-w-none space-y-3"
            >
              {result.summary.split("\n\n").map((para, i) => {
                if (para.startsWith("# ")) {
                  return (
                    <h1 key={i} className="text-lg font-bold text-white mt-4 mb-2">
                      {para.replace("# ", "")}
                    </h1>
                  );
                }
                if (para.startsWith("## ")) {
                  return (
                    <h2 key={i} className="text-base font-semibold text-indigo-300 mt-3 mb-2">
                      {para.replace("## ", "")}
                    </h2>
                  );
                }
                return (
                  <p key={i} className="text-sm text-gray-300 leading-relaxed">
                    {para}
                  </p>
                );
              })}
            </motion.div>
          )} */}
{activeTab === "summary" && (
  <motion.div
    key="summary"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* PARAGRAPH */}
    {result.summary.type === "paragraph" && (
      <p className="text-sm text-gray-300 leading-relaxed">
        {result.summary.content}
      </p>
    )}

    {/* BULLET */}
    {result.summary.type === "bullet" && (
      <ul className="space-y-2 list-disc pl-5">
        {result.summary.content.map((item: string, i: number) => (
          <li key={i} className="text-sm text-gray-300">
            {item}
          </li>
        ))}
      </ul>
    )}

    {/* NOTES */}
    {result.summary.type === "notes" && (
      <div className="space-y-3">
        {result.summary.content?.sections?.map((sec: any, i: number) => (
          <div key={i}>
            <h3 className="text-indigo-300 font-semibold text-sm mb-2">
              {sec.heading}
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              {sec.points.map((p: string, j: number) => (
                <li key={j} className="text-gray-300 text-sm">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )}

    {/* STRUCTURE (future-safe) */}
{result.summary.type === "structured" && (
  <div className="space-y-4 text-gray-300 text-sm">
    {/* Title */}
    {result.summary.content?.title && (
      <h2 className="text-lg font-semibold text-white">
        {result.summary.content.title}
      </h2>
    )}

    {/* Sections */}
    {result.summary.content?.sections?.map((section: any, idx: number) => (
      <div key={idx} className="space-y-2">
        {/* Heading */}
        {section.heading && (
          <h3 className="text-md font-medium text-indigo-400">
            {section.heading}
          </h3>
        )}

        {/* Points */}
        <ul className="space-y-1 pl-4">
          {section.points?.map((point: string, i: number) => (
            <li key={i} className="list-disc text-gray-300">
              {point}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
)}
  </motion.div>
)}
          {activeTab === "keypoints" && (
            <motion.div
              key="keypoints"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {result.keyPoints.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
                >
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-indigo-400 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{point}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "terms" && (
            <motion.div
              key="terms"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {result.keyTerms.map((term, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/5"
                >
                  <p className="text-xs font-semibold text-indigo-300">{term}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "questions" && (
            <motion.div
              key="questions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {result.studyQuestions.map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10"
                >
                  <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300 leading-relaxed">{q}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "notes" && (
            <motion.div
              key="notes"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {result.examNotes.map((note, i) => {
                if (note.startsWith("**") && note.endsWith("**")) {
                  return (
                    <p key={i} className="text-xs font-bold text-indigo-400 mt-3 mb-1">
                      {note.replace(/\*\*/g, "")}
                    </p>
                  );
                }
                if (note === "") {
                  return <div key={i} className="h-1" />;
                }
                return (
                  <p key={i} className="text-xs text-gray-300 leading-relaxed font-mono">
                    {note}
                  </p>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-gray-600">
          💡 Tip: Use exam notes format for quick review before tests
        </p>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-gray-400 hover:bg-white/10 transition">
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>
      </div>
      {exportItemId && (
  <div
    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    onClick={() => setExportItemId(null)}
  >
    <div
      className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 w-[300px]"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-sm text-white mb-4">Export Format</h2>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => handleExport(exportItemId, "pdf")}
          className="py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30"
        >
          Export as PDF
        </button>

        <button
          onClick={() => handleExport(exportItemId, "docx")}
          className="py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
        >
          Export as DOCX
        </button>
      </div>

      <button
        onClick={() => setExportItemId(null)}
        className="mt-4 text-xs text-gray-500 hover:text-white w-full"
      >
        Cancel
      </button>
    </div>
  </div>
)}
    </motion.div>
  );
}
"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Copy,
  CheckCheck,
  Download,
  AlignLeft,
  List,
  BookOpen,
  HelpCircle,
  Clock,
  Hash,
  Users,
  FileSearch,
  ChevronDown,
  Wand2,
  ExternalLink,
  Layers,
} from "lucide-react";
import Link from "next/link";
import type { PDFSummaryResult } from "./PDFUploader";

interface PDFResultProps {
  result: PDFSummaryResult | null;
}

export default function PDFResult({ result }: PDFResultProps) {
  const [activeTab, setActiveTab] = useState<
    "summary" | "keypoints" | "terms" | "sections" | "questions"
  >("summary");
  const [copied, setCopied] = useState(false);
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    const text = [
      result.title,
      `Authors: ${result.authors.join(", ")}`,
      "",
      "SUMMARY",
      result.summary,
      "",
      "KEY POINTS",
      ...result.keyPoints.map((p) => `• ${p}`),
    ].join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    const text = [
      "PDF SUMMARY REPORT",
      "==================",
      `Title: ${result.title}`,
      `Authors: ${result.authors.join(", ")}`,
      `Pages: ${result.metadata.pages} | Words: ${result.metadata.wordCount.toLocaleString()}`,
      `Reading Time: ${result.readingTime} min | Summary Reading Time: ${result.summaryReadingTime} min`,
      "",
      "ABSTRACT",
      "========",
      result.abstract,
      "",
      "SUMMARY",
      "=======",
      result.summary,
      "",
      "KEY POINTS",
      "==========",
      ...result.keyPoints.map((p, i) => `${i + 1}. ${p}`),
      "",
      "KEY TERMS",
      "=========",
      ...result.keyTerms.map((t) => `${t.term}: ${t.definition}`),
      "",
      "STUDY QUESTIONS",
      "===============",
      ...result.questions.map((q, i) => `${i + 1}. ${q}`),
    ].join("\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `summary-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  // ── Empty State ────────────────────────────────────
  if (!result) {
    return (
      <div className="h-full min-h-[500px] rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4 text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
          <FileSearch className="w-8 h-8 text-gray-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">
            Summary will appear here
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Upload a PDF and click Summarize
          </p>
        </div>

        {/* Feature Preview */}
        <div className="w-full max-w-sm mt-4 space-y-2">
          {[
            { icon: AlignLeft, label: "Instant AI summary" },
            { icon: List, label: "Key points extraction" },
            { icon: BookOpen, label: "Key terms glossary" },
            { icon: HelpCircle, label: "Study questions" },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5">
              <f.icon className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-xs text-gray-400">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Result ─────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* ── Paper Info Card ── */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-12 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0 relative mt-0.5">
              <FileText className="w-5 h-5 text-red-400" />
              <span className="absolute -bottom-1 -right-1 text-[7px] font-bold px-1 py-0.5 rounded bg-red-500 text-white">
                PDF
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-gray-200 leading-tight line-clamp-2">
                {result.title}
              </h2>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Users className="w-3 h-3 text-gray-500 flex-shrink-0" />
                <p className="text-xs text-gray-400 truncate">
                  {result.authors.join(", ")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metadata Row */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { label: "Pages", value: result.metadata.pages, icon: Hash },
            { label: "Words", value: result.metadata.wordCount.toLocaleString(), icon: AlignLeft },
            { label: "Read time", value: `${result.readingTime}m`, icon: Clock },
            { label: "Summary", value: `${result.summaryReadingTime}m`, icon: FileText },
          ].map((m, i) => (
            <div key={i} className="text-center p-2 rounded-xl bg-white/5">
              <p className="text-base font-bold text-red-400">{m.value}</p>
              <p className="text-[10px] text-gray-500">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Type Badge */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
            {result.metadata.type}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
            {result.metadata.language}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
            {result.metadata.fileSize}
          </span>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        {/* Tab Bar */}
        <div className="flex overflow-x-auto border-b border-white/5 scrollbar-hide">
          {[
            { key: "summary" as const, label: "Summary", icon: AlignLeft },
            { key: "keypoints" as const, label: "Key Points", icon: List },
            { key: "terms" as const, label: "Terms", icon: BookOpen },
            { key: "sections" as const, label: "Sections", icon: Layers },
            { key: "questions" as const, label: "Questions", icon: HelpCircle },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex-shrink-0 flex items-center gap-1.5 px-5 py-3.5 text-xs font-medium transition whitespace-nowrap ${
                activeTab === tab.key
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="pdfResultTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-pink-500"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-5 max-h-72 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Summary Tab */}
            {activeTab === "summary" && (
              <motion.div
                key="summary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Abstract */}
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                  <p className="text-[10px] text-blue-400 uppercase tracking-wider mb-2 font-semibold">
                    Abstract
                  </p>
                  <p className="text-xs text-gray-300 leading-relaxed italic">
                    {result.abstract}
                  </p>
                </div>

                {/* Summary */}
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-semibold">
                    AI Summary
                  </p>
                  {result.summary.split("\n\n").map((para, i) => (
                    <p key={i} className="text-sm text-gray-300 leading-relaxed mb-3">
                      {para}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Key Points Tab */}
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
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition"
                  >
                    <div className="w-6 h-6 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-red-400">{i + 1}</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{point}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Key Terms Tab */}
            {activeTab === "terms" && (
              <motion.div
                key="terms"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {result.keyTerms.map((term, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                      <p className="text-sm font-semibold text-red-300">
                        {term.term}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed ml-4">
                      {term.definition}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Sections Tab */}
            {activeTab === "sections" && (
              <motion.div
                key="sections"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {result.sections.map((section, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="rounded-xl bg-white/5 border border-white/10 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedSection(expandedSection === i ? null : i)}
                      className="w-full flex items-center gap-3 p-3.5 hover:bg-white/5 transition text-left"
                    >
                      <div className="w-7 h-7 rounded-lg bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-pink-400">{i + 1}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-200 flex-1">
                        {section.title}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition ${expandedSection === i ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {expandedSection === i && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="px-4 pb-4 ml-10 text-xs text-gray-400 leading-relaxed">
                            {section.summary}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Questions Tab */}
            {activeTab === "questions" && (
              <motion.div
                key="questions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <p className="text-xs text-gray-500 mb-3">
                  Study questions generated from the paper:
                </p>
                {result.questions.map((q, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10 hover:bg-yellow-500/10 transition"
                  >
                    <HelpCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-300 leading-relaxed">{q}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Action Bar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 flex-1">
          <Wand2 className="w-4 h-4 text-pink-400 flex-shrink-0" />
          <p className="text-sm text-gray-400">
            Need an assignment based on this paper?{" "}
            <Link href="/dashboard/assignment" className="text-purple-400 font-medium hover:text-purple-300 transition">
              Generate it →
            </Link>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-medium transition ${
              copied
                ? "bg-green-500/20 border-green-500/30 text-green-400"
                : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
            }`}
          >
            {copied ? (
              <><CheckCheck className="w-3.5 h-3.5" /> Copied!</>
            ) : (
              <><Copy className="w-3.5 h-3.5" /> Copy</>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 hover:from-red-500/30 hover:to-pink-500/30 text-xs text-red-400 font-medium transition"
          >
            <Download className="w-3.5 h-3.5" />
            Download Report
          </button>
        </div>
      </div>
    </motion.div>
  );
}
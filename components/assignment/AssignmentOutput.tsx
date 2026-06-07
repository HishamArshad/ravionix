"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  CheckCheck,
  Download,
  Wand2,
  RotateCcw,
  FileText,
  List,
  Loader2,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { authService } from "../api/authService";

interface Assignment {
  title: string;
  content: string;
  wordCount: number;
  sections: string[];
  references?: string[];
}

interface AssignmentOutputProps {
  isGenerating: boolean;
  assignment: Assignment | null;
  onRegenerrate: () => void;
  onSendToHumanizer: (text: string) => void;
  wordCount: number;
}

// Generating steps shown during loading
const GENERATION_STEPS = [
  "Analyzing topic and requirements...",
  "Structuring outline and sections...",
  "Writing introduction...",
  "Developing main arguments...",
  "Adding supporting evidence...",
  "Crafting conclusion...",
  "Formatting references...",
  "Final polish and review...",
];

export default function AssignmentOutput({
  isGenerating,
  assignment,
  onRegenerrate,
  onSendToHumanizer,
  wordCount,
}: AssignmentOutputProps) {
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<"full" | "outline">("full");
  const [currentStep, setCurrentStep] = useState(0);

  // Cycle through steps while generating
  if (isGenerating && currentStep < GENERATION_STEPS.length - 1) {
    setTimeout(() => setCurrentStep((s) => Math.min(s + 1, GENERATION_STEPS.length - 1)), 600);
  }

  const handleCopy = useCallback(async () => {
    if (!assignment) return;
    await navigator.clipboard.writeText(assignment.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [assignment]);
const handleDownload = async (id, format: "pdf" | "docx") => {
  const blob = await authService.exportAssignment(id, format);
  console.log(blob)
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `assignment.${format}`;

  document.body.appendChild(link);
  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};
  const handleDownloadTxt = useCallback(() => {
    if (!assignment) return;

    // const blob = new Blob([assignment.content], { type: "text/plain" });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = `${assignment.title}.txt`;
    // a.click();
    // URL.revokeObjectURL(url);
  }, [assignment]);

  // ── Loading State ──────────────────────────────────────────────
  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-8">
        {/* Animated Icon */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 animate-spin" />
          <div
            className="absolute inset-2 rounded-full border-2 border-transparent border-t-blue-500 animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
          />
          <FileText className="absolute inset-0 m-auto w-7 h-7 text-purple-400" />
        </div>

        {/* Step Text */}
        <div className="text-center space-y-2">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-sm font-medium text-gray-300"
            >
              {GENERATION_STEPS[currentStep]}
            </motion.p>
          </AnimatePresence>
          <p className="text-xs text-gray-600">
            Generating ~{wordCount.toLocaleString()} words
          </p>
        </div>

        {/* Progress Steps */}
        <div className="w-full max-w-sm space-y-2">
          {GENERATION_STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`flex items-center gap-3 text-xs transition-all ${
                i < currentStep
                  ? "text-green-400"
                  : i === currentStep
                  ? "text-purple-400"
                  : "text-gray-700"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  i < currentStep
                    ? "bg-green-400"
                    : i === currentStep
                    ? "bg-purple-400 animate-pulse"
                    : "bg-gray-700"
                }`}
              />
              {step}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // ── Empty State ────────────────────────────────────────────────
  if (!assignment) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
          <FileText className="w-8 h-8 text-gray-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">
            Your assignment will appear here
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Fill out the form and click Generate
          </p>
        </div>
      </div>
    );
  }

  // ── Assignment Output ──────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
        {/* Stats */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="text-center">
            <p className="text-lg font-bold text-purple-400">
              {assignment.wordCount.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-500">Words</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-lg font-bold text-blue-400">
              {assignment.sections.length}
            </p>
            <p className="text-[10px] text-gray-500">Sections</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-lg font-bold text-green-400">
              {assignment.references?.length ?? 0}
            </p>
            <p className="text-[10px] text-gray-500">References</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onRegenerrate}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-gray-400 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Regenerate
          </button>
          {/* <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-gray-400 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button> */}
          <div className="flex justify-center items-center gap-1">
            <h1 className="text-xs">Download in: </h1>
  <button
    onClick={() => handleDownload(assignment.id, "pdf")}
    className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-300"
  >
    PDF
  </button>

  <button
    onClick={() => handleDownload(assignment.id, "docx")}
    className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300"
  >
    DOCX
  </button>
</div>
          <button
            onClick={() => onSendToHumanizer(assignment.content)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-pink-500/20 to-orange-500/20 border border-pink-500/30 hover:from-pink-500/30 hover:to-orange-500/30 text-xs text-pink-400 transition"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Humanize
          </button>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-xs font-medium transition ${
              copied
                ? "bg-green-500/20 border-green-500/30 text-green-400"
                : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
            }`}
          >
            {copied ? (
              <><CheckCheck className="w-3.5 h-3.5" /> Copied!</>
            ) : (
              <><Copy className="w-3.5 h-3.5" /> Copy All</>
            )}
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        {(["full", "outline"] as const).map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition ${
              activeView === view
                ? "bg-white/10 text-white border border-white/20"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {view === "full" ? (
              <><FileText className="w-3.5 h-3.5" /> Full Text</>
            ) : (
              <><List className="w-3.5 h-3.5" /> Outline</>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="rounded-xl bg-[#0d0d14] border border-white/10 overflow-hidden">
        {/* Title bar */}
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="text-base font-semibold text-gray-200">
            {assignment.title}
          </h2>
        </div>

        {activeView === "full" ? (
          /* Full Text */
          <div className="p-6 max-h-[500px] overflow-y-auto">
            <div className="prose prose-invert prose-sm max-w-none">
              {assignment.content.split("\n").map((line, i) => {
                if (line.startsWith("# ")) {
                  return (
                    <h1 key={i} className="text-xl font-bold text-white mt-0 mb-4">
                      {line.replace("# ", "")}
                    </h1>
                  );
                }
                if (line.startsWith("## ")) {
                  return (
                    <h2 key={i} className="text-base font-semibold text-purple-300 mt-6 mb-3 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      {line.replace("## ", "")}
                    </h2>
                  );
                }
                if (line.trim() === "") {
                  return <br key={i} />;
                }
                return (
                  <p key={i} className="text-sm text-gray-300 leading-relaxed mb-2">
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        ) : (
          /* Outline View */
          <div className="p-6 space-y-3">
            {assignment.sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-purple-400">{i + 1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-sm text-gray-300">{section}</span>
                </div>
              </motion.div>
            ))}

            {/* References List */}
            {assignment.references && assignment.references.length > 0 && (
              <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs font-semibold text-gray-400 mb-3">
                  References ({assignment.references.length})
                </p>
                <ul className="space-y-2">
                  {assignment.references.map((ref, i) => (
                    <li key={i} className="text-xs text-gray-500 pl-4 border-l border-purple-500/30">
                      {ref}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
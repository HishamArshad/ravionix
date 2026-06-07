"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  CheckCheck,
  BookOpen,
  Sparkles,
  Loader2,
  Quote,
  Hash,
  FileText,
  RefreshCw,
  Download,
  Library,
} from "lucide-react";

type CitationStyle = "apa" | "mla" | "chicago" | "harvard" | "vancouver" | "ieee";
type SourceType = "website" | "book" | "journal" | "newspaper" | "video" | "podcast" | "thesis" | "database";

interface GeneratedCitation {
  formatted: string;
  style: CitationStyle;
  sourceType: SourceType;
  inText: string;
  footnote?: string;
}

interface CitationOutputProps {
  result: GeneratedCitation | null;
  isGenerating: boolean;
  citationStyle: CitationStyle;
  sourceType: SourceType;
  onChangeStyle: (s: CitationStyle) => void;
}

const STYLE_LABELS: Record<CitationStyle, string> = {
  apa: "APA 7th",
  mla: "MLA 9th",
  chicago: "Chicago",
  harvard: "Harvard",
  vancouver: "Vancouver",
  ieee: "IEEE",
};

const COPY_TYPES = [
  { key: "formatted", label: "Full Citation", icon: FileText },
  { key: "inText", label: "In-Text", icon: Hash },
  { key: "footnote", label: "Footnote", icon: Quote },
] as const;

export default function CitationOutput({
  result,
  isGenerating,
  citationStyle,
  sourceType,
  onChangeStyle,
}: CitationOutputProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"formatted" | "inText" | "footnote">("formatted");

  const handleCopy = useCallback(async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }, []);

  const handleDownload = useCallback(() => {
    if (!result) return;
    const content = [
      `Citation Style: ${STYLE_LABELS[result.style]}`,
      `Source Type: ${result.sourceType}`,
      "",
      "FULL CITATION",
      "=============",
      result.formatted,
      "",
      "IN-TEXT CITATION",
      "================",
      result.inText,
      result.footnote ? `\nFOOTNOTE\n========\n${result.footnote}` : "",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `citation-${result.style}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Output Card */}
      <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
          <Library className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-gray-300">
            Generated Citation
          </span>
          {result && (
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/20">
              {STYLE_LABELS[result.style]}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <AnimatePresence mode="wait">
            {/* Loading */}
            {isGenerating && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center gap-4 py-12"
              >
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin" />
                  <BookOpen className="absolute inset-0 m-auto w-5 h-5 text-blue-400" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium text-gray-300">
                    Formatting citation...
                  </p>
                  <p className="text-xs text-gray-500">
                    Applying {STYLE_LABELS[citationStyle]} style rules
                  </p>
                </div>
                {/* Shimmer lines */}
                <div className="w-full space-y-2 mt-2">
                  {[100, 85, 90, 60].map((w, i) => (
                    <div
                      key={i}
                      className="h-2 bg-white/5 rounded-full overflow-hidden"
                      style={{ width: `${w}%` }}
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Empty */}
            {!isGenerating && !result && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center gap-4 py-12 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Citation will appear here
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Fill in the source details and click generate
                  </p>
                </div>

                {/* Style quick-select */}
                <div className="w-full mt-2">
                  <p className="text-xs text-gray-600 mb-2">Quick style select:</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["apa", "mla", "chicago", "harvard", "vancouver", "ieee"] as CitationStyle[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => onChangeStyle(s)}
                        className={`py-1.5 rounded-lg text-xs font-medium transition ${
                          citationStyle === s
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-white/5 text-gray-500 hover:bg-white/10"
                        }`}
                      >
                        {STYLE_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Result */}
            {!isGenerating && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Citation Type Tabs */}
                <div className="flex gap-1 p-1 bg-white/5 rounded-xl">
                  {COPY_TYPES.filter(
                    (ct) => ct.key !== "footnote" || result.footnote
                  ).map((ct) => (
                    <button
                      key={ct.key}
                      onClick={() => setActiveTab(ct.key as typeof activeTab)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition ${
                        activeTab === ct.key
                          ? "bg-white/10 text-white"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      <ct.icon className="w-3 h-3" />
                      {ct.label}
                    </button>
                  ))}
                </div>

                {/* Citation Text Box */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="relative p-4 rounded-xl bg-[#0d0d14] border border-white/10 min-h-[100px]"
                  >
                    <p className="text-sm text-gray-200 leading-relaxed font-mono pr-8">
                      {activeTab === "formatted" && result.formatted}
                      {activeTab === "inText" && result.inText}
                      {activeTab === "footnote" && (result.footnote || result.formatted)}
                    </p>
                    <button
                      onClick={() => {
                        const text =
                          activeTab === "formatted"
                            ? result.formatted
                            : activeTab === "inText"
                            ? result.inText
                            : result.footnote || result.formatted;
                        handleCopy(text, activeTab);
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/10 transition text-gray-500 hover:text-white"
                    >
                      {copiedKey === activeTab ? (
                        <CheckCheck className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </motion.div>
                </AnimatePresence>

                {/* Style switcher */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">
                    Switch style instantly:
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["apa", "mla", "chicago", "harvard", "vancouver", "ieee"] as CitationStyle[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => onChangeStyle(s)}
                        className={`py-1.5 rounded-lg text-xs font-medium transition ${
                          result.style === s
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-white/5 text-gray-500 hover:bg-white/10"
                        }`}
                      >
                        {STYLE_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        {result && !isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-5 py-4 border-t border-white/5 flex-wrap"
          >
            <button
              onClick={() =>
                handleCopy(
                  `${result.formatted}\n\nIn-text: ${result.inText}`,
                  "all"
                )
              }
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-medium transition flex-1 justify-center ${
                copiedKey === "all"
                  ? "bg-green-500/20 border-green-500/30 text-green-400"
                  : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
              }`}
            >
              {copiedKey === "all" ? (
                <><CheckCheck className="w-3.5 h-3.5" /> Copied!</>
              ) : (
                <><Copy className="w-3.5 h-3.5" /> Copy All</>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-gray-400 transition"
            >
              <Download className="w-3.5 h-3.5" />
              Save
            </button>
          </motion.div>
        )}
      </div>

      {/* Tips Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-2"
      >
        <p className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Quick Tips
        </p>
        <ul className="space-y-1.5">
          {[
            { style: "APA", tip: "Used in Psychology & Sciences at most Pakistani universities" },
            { style: "MLA", tip: "Common for English Literature assignments" },
            { style: "Chicago", tip: "Preferred for History & Humanities" },
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold flex-shrink-0 mt-0.5">
                {tip.style}
              </span>
              <span className="text-xs text-gray-500">{tip.tip}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
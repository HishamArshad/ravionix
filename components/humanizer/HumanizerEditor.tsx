"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  RotateCcw,
  Wand2,
  CheckCheck,
  AlertCircle,
  ChevronDown,
  Loader2,
  Download,
  ThumbsUp,
  ThumbsDown,
  Maximize2,
} from "lucide-react";
import { authService } from "../api/authService";
import { authState, humanizerHistory, humanizerResponse } from "../store/auth";
import ScoreBreakdown from "./ScoreBreakdown";
import { humanizerDraft } from "../store/auth";
import { useEffect } from "react";
import { toast } from "sonner";
// ── Types ──────────────────────────────────────────────
type Mode = "standard" | "aggressive" | "academic" | "casual";
type AIScore = "high" | "medium" | "low" | null;

interface ModeOption {
  value: Mode;
  label: string;
  description: string;
  color: string;
}

// ── Constants ──────────────────────────────────────────
const MODES: ModeOption[] = [
  {
    value: "standard",
    label: "Standard",
    description: "Balanced humanization for general use",
    color: "text-blue-400",
  },
  {
    value: "aggressive",
    label: "Aggressive",
    description: "Maximum humanization, alters more text",
    color: "text-red-400",
  },
  {
    value: "academic",
    label: "Academic",
    description: "Formal tone, preserves academic structure",
    color: "text-purple-400",
  },
  {
    value: "casual",
    label: "Casual",
    description: "Natural, conversational style",
    color: "text-green-400",
  },
];

const MAX_FREE_WORDS = 500;

// ── Helper ─────────────────────────────────────────────
function countWords(text: string) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}


function getAIScoreColor(score: AIScore) {
  if (score === "high") return "text-red-400";
  if (score === "medium") return "text-yellow-400";
  if (score === "low") return "text-green-400";
  return "";
}

function getAIScoreLabel(score: AIScore) {
  if (score === "high") return "High AI Detected";
  if (score === "medium") return "Medium AI Detected";
  if (score === "low") return "Looks Human ✓";
  return "";
}

// ── Component ──────────────────────────────────────────
export default function HumanizerEditor() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedMode, setSelectedMode] = useState<Mode>("standard");
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [aiScoreBefore, setAiScoreBefore] = useState<AIScore>(null);
  const [aiScoreAfter, setAiScoreAfter] = useState<AIScore>(null);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const wordCount = countWords(inputText);
  const outputWordCount = countWords(outputText);
  const isOverLimit = wordCount > MAX_FREE_WORDS;
  const selectedModeData = MODES.find((m) => m.value === selectedMode)!;

  // ── Handlers ────────────────────────────────────────
const [scores, setScores] = useState({
  naturalness: 0,
  clarity: 0,
  style_match: 0,
});
  // TODO: Replace with real Django API call
  const handleHumanize = useCallback(async () => {
    if (!inputText.trim()) return;
    if (isOverLimit) return;

    setIsLoading(true);
    setError("");
    setOutputText("");
    setAiScoreBefore(null);
    setAiScoreAfter(null);
    setFeedback(null);

try {
  const humanize = await authService.humanizer(inputText, selectedMode);

  humanizerResponse.responce.set(humanize);
  console.log(humanize)
  setOutputText(humanize.humanized_text);

  const res = await authService.humanizerHistory();
  humanizerHistory.set(res.results);
setScores({
  naturalness: humanize.scores?.naturalness ?? 0,
  clarity: humanize.scores?.clarity ?? 0,
  style_match: humanize.scores?.style_match ?? 0,
});

  const user = await authService.getMe();
        authState.user.set(user);
} 

catch (err) {

  console.log(err);

  const status = err?.response?.status;

  // backend message if exists
  const message =
    err?.response?.data?.detail ||
    err?.response?.data?.error ||
    "Something went wrong. Please try again.";

  if (status === 403) {

    setError("You have reached your daily limit. Upgrade to Pro.");

    toast.error(message);

    // optional
    // setShowUpgradeModal(true);

   
    return;
  }

  toast.error(message);

  setError(message);
} finally {
  setIsLoading(false);
}
  }, [inputText, selectedMode, isOverLimit]);

  const handleCopy = useCallback(async () => {
    if (!outputText) return;
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [outputText]);

  const handleClear = useCallback(() => {
    setInputText("");
    setOutputText("");
    setAiScoreBefore(null);
    setAiScoreAfter(null);
    setError("");
    setFeedback(null);
  }, []);
console.log(humanizerResponse.responce.id.get(), "History")
  // const handleDownload = useCallback(() => {
  //   const blob = new Blob([outputText], { type: "text/plain" });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "humanized-text.txt";
  //   a.click();
  //   URL.revokeObjectURL(url);
  // }, [outputText]);
  const draftText = humanizerDraft.text.get();
const [input, setInput] = useState("");
useEffect(() => {
  if (draftText) {
    setInputText(draftText);

    // optional: clear after use (important UX)
    humanizerDraft.text.set("");
  }
}, [draftText]);

const handleDownload = async (id, format: "pdf" | "docx") => {
  const blob = await authService.exportHistory(id, format);
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
  // ── Render ──────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-4"
    >
      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
        {/* Mode Selector */}
        <div className="relative">
          <button
            onClick={() => setModeDropdownOpen(!modeDropdownOpen)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <div className="flex flex-col items-start">
              <span className="text-xs text-gray-500">Humanize Mode</span>
              <span className={`text-sm font-medium ${selectedModeData.color}`}>
                {selectedModeData.label}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition ${
                modeDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {modeDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-2 left-0 z-50 w-72 p-2 rounded-2xl bg-[#13131f] border border-white/10 shadow-2xl"
              >
                {MODES.map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => {
                      setSelectedMode(mode.value);
                      setModeDropdownOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl transition text-left
                      ${selectedMode === mode.value
                        ? "bg-white/10"
                        : "hover:bg-white/5"
                      }`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${mode.color.replace("text-", "bg-")}`} />
                    <div>
                      <p className={`text-sm font-medium ${mode.color}`}>
                        {mode.label}
                      </p>
                      <p className="text-xs text-gray-500">{mode.description}</p>
                    </div>
                    {selectedMode === mode.value && (
                      <CheckCheck className="w-4 h-4 text-purple-400 ml-auto flex-shrink-0" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center gap-2 text-sm text-gray-400"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
          <button
            onClick={handleHumanize}
            disabled={isLoading || !inputText.trim() || isOverLimit}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 font-medium text-sm flex items-center gap-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-500/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Humanizing...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Humanize
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Editor Grid ── */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* INPUT PANEL */}
        <div className="flex flex-col rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          {/* Panel Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-300">Input Text</span>
              {aiScoreBefore && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`text-xs px-2 py-0.5 rounded-full bg-white/10 ${getAIScoreColor(aiScoreBefore)}`}
                >
                  {getAIScoreLabel(aiScoreBefore)}
                </motion.span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-xs ${
                  isOverLimit ? "text-red-400" : "text-gray-500"
                }`}
              >
                {wordCount} / {MAX_FREE_WORDS} words
              </span>
              <button className="text-gray-500 hover:text-gray-300 transition">
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Textarea */}
          <div className="relative flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your AI-generated text here...

For example: text copied from ChatGPT, Claude, Gemini, or any other AI tool."
              className="w-full h-72 p-5 bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none resize-none leading-relaxed"
            />
{isOverLimit && (
  <div className="absolute bottom-3 left-5 right-5 p-3 rounded-xl bg-black/70 backdrop-blur-md border border-red-500/30 shadow-lg">
    
    <div className="flex items-start gap-2">
      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />

      <div className="text-xs leading-relaxed text-gray-200">
        <span className="text-red-300 font-medium">
          Limit reached:
        </span>{" "}
        You've exceeded the free limit of{" "}
        <span className="text-white font-semibold">
          {MAX_FREE_WORDS} words
        </span>.
        
        <div className="mt-2">
          <button className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>

  </div>
)}
          </div>

          {/* Word progress bar */}
          <div className="px-5 pb-4">
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isOverLimit
                    ? "bg-red-500"
                    : wordCount > MAX_FREE_WORDS * 0.8
                    ? "bg-yellow-500"
                    : "bg-gradient-to-r from-pink-500 to-orange-500"
                }`}
                style={{
                  width: `${Math.min((wordCount / MAX_FREE_WORDS) * 100, 100)}%`,
                }}
              />
              
            </div>
            
          </div>
          
        </div>

        {/* OUTPUT PANEL */}
        <div className="flex flex-col rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          {/* Panel Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-300">Humanized Output</span>
              {aiScoreAfter && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`text-xs px-2 py-0.5 rounded-full bg-white/10 ${getAIScoreColor(aiScoreAfter)}`}
                >
                  {getAIScoreLabel(aiScoreAfter)}
                </motion.span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {outputText && (
                <span className="text-xs text-gray-500">{outputWordCount} words</span>
              )}
            </div>
          </div>

          {/* Output Content */}
          <div className="flex-1 relative">
            {/* Loading State */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute mt-24 inset-0 flex flex-col items-center justify-center gap-4   z-10"
                >
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-2 border-pink-500/20" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-pink-500 animate-spin" />
                    <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-orange-500 animate-spin" style={{ animationDirection: "reverse" }} />
                    <Wand2 className="absolute inset-0 m-auto w-5 h-5 text-pink-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-300">
                      Humanizing your text...
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      This takes a few seconds
                    </p>
                  </div>
                  {/* Shimmer lines */}
                  <div className="w-64 space-y-2 mt-2">
                    {[90, 75, 85, 60].map((w, i) => (
                      <div
                        key={i}
                        className="h-2 bg-white/5 rounded-full overflow-hidden"
                        style={{ width: `${w}%` }}
                      >
                        <div className="h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.5s_infinite]" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {!isLoading && !outputText && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                  <Wand2 className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Your humanized text will appear here
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Paste text on the left and click Humanize
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="flex flex-col items-center gap-3 text-center">
                  <AlertCircle className="w-10 h-10 text-red-400" />
                  <p className="text-sm text-red-400">{error}</p>
                  <button
                    onClick={handleHumanize}
                    className="text-xs text-gray-400 underline hover:text-white"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {/* Output Text */}
            {outputText && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-72 overflow-y-auto p-5"
              >
                <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {outputText}
                </p>
              </motion.div>

            )}
          </div>
<div className="mt-4 px-5 pb-5">
<ScoreBreakdown
  naturalness={scores.naturalness}
  clarity={scores.clarity}
  style_match={scores.style_match}
/>
</div>
          {/* Output Footer */}
          {outputText && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between px-5 py-3 border-t border-white/5"
            >
              {/* Feedback */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Helpful?</span>
                <button
                  onClick={() => setFeedback("up")}
                  className={`p-1.5 rounded-lg transition ${
                    feedback === "up"
                      ? "bg-green-500/20 text-green-400"
                      : "hover:bg-white/10 text-gray-500"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setFeedback("down")}
                  className={`p-1.5 rounded-lg transition ${
                    feedback === "down"
                      ? "bg-red-500/20 text-red-400"
                      : "hover:bg-white/10 text-gray-500"
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* <button
                  onClick={handleDownload}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-gray-400 hover:text-white"
                >
                  <Download className="w-3.5 h-3.5" />
                </button> */}
                          <div className="flex justify-center items-center gap-1">
            <h1 className="text-xs">Download in: </h1>
  <button
    onClick={() => handleDownload(humanizerResponse.responce.id.get(), "pdf")}
    className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-300"
  >
    PDF
  </button>

  <button
    onClick={() => handleDownload(humanizerResponse.responce.id.get(), "docx")}
    className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300"
  >
    DOCX
  </button>
</div>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition ${
                    copied
                      ? "bg-green-500/20 border-green-500/30 text-green-400"
                      : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCheck className="w-3.5 h-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── AI Score Comparison (shows after humanize) ── */}
      <AnimatePresence>
        {aiScoreBefore && aiScoreAfter && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-5 rounded-2xl bg-white/5 border border-white/10"
          >
            <p className="text-sm font-medium text-gray-300 mb-4">
              AI Detection Score Comparison
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { tool: "GPTZero", before: 94, after: 8 },
                { tool: "Turnitin AI", before: 89, after: 12 },
                { tool: "ZeroGPT", before: 91, after: 5 },
                { tool: "Copyleaks", before: 87, after: 10 },
              ].map((item) => (
                <div
                  key={item.tool}
                  className="p-4 rounded-xl bg-white/5 text-center"
                >
                  <p className="text-xs text-gray-500 mb-2">{item.tool}</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-red-400 font-bold">{item.before}%</span>
                    <span className="text-gray-600">→</span>
                    <span className="text-green-400 font-bold">{item.after}%</span>
                  </div>
                  <p className="text-xs text-green-400 mt-1">AI Detection</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
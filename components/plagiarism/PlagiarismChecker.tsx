"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Upload,
  FileText,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  ScanLine,
  Globe,
  BookOpen,
  Newspaper,
  GraduationCap,
} from "lucide-react";
import PlagiarismResults from "./PlagiarismResults";

// ── Types ──────────────────────────────────────────────
type InputMode = "text" | "file";
type ScanDepth = "standard" | "deep" | "academic";

interface ScanSource {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  proOnly: boolean;
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

// ── Constants ──────────────────────────────────────────
const SCAN_SOURCES: ScanSource[] = [
  {
    id: "internet",
    label: "Internet",
    icon: Globe,
    description: "Websites & blogs",
    proOnly: false,
  },
  {
    id: "academic",
    label: "Academic",
    icon: GraduationCap,
    description: "Research papers",
    proOnly: false,
  },
  {
    id: "news",
    label: "News",
    icon: Newspaper,
    description: "News articles",
    proOnly: false,
  },
  {
    id: "books",
    label: "Books",
    icon: BookOpen,
    description: "Published books",
    proOnly: true,
  },
];

const SCAN_DEPTHS: { value: ScanDepth; label: string; desc: string; time: string }[] = [
  { value: "standard", label: "Standard", desc: "Quick scan", time: "~10 sec" },
  { value: "deep", label: "Deep", desc: "Thorough scan", time: "~30 sec" },
  { value: "academic", label: "Academic", desc: "Scholar focus", time: "~45 sec" },
];

const MAX_FREE_WORDS = 1000;

function countWords(text: string) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

// ── Scanning Animation Steps ───────────────────────────
const SCAN_STEPS = [
  { label: "Tokenizing text...", progress: 10 },
  { label: "Querying internet sources...", progress: 25 },
  { label: "Checking academic databases...", progress: 45 },
  { label: "Scanning news archives...", progress: 60 },
  { label: "Comparing sentence patterns...", progress: 75 },
  { label: "Calculating similarity scores...", progress: 88 },
  { label: "Compiling report...", progress: 95 },
  { label: "Done!", progress: 100 },
];

// ── Main Component ─────────────────────────────────────
export default function PlagiarismChecker() {
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [inputText, setInputText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedSources, setSelectedSources] = useState<string[]>([
    "internet",
    "academic",
  ]);
  const [scanDepth, setScanDepth] = useState<ScanDepth>("standard");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStepLabel, setScanStepLabel] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = countWords(inputText);
  const isOverLimit = wordCount > MAX_FREE_WORDS;
  const canScan =
    (inputMode === "text" ? inputText.trim().length > 50 && !isOverLimit : !!uploadedFile) &&
    selectedSources.length > 0;

  // ── Source toggle ──────────────────────────────────
  const toggleSource = useCallback((id: string) => {
    setSelectedSources((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }, []);

  // ── File handling ──────────────────────────────────
  const handleFile = useCallback((file: File) => {
    const allowed = ["text/plain", "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      setError("Only .txt, .pdf, and .docx files are supported.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB.");
      return;
    }
    setError("");
    setUploadedFile(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  // ── Scan ──────────────────────────────────────────
  const handleScan = useCallback(async () => {
    if (!canScan) return;
    setIsScanning(true);
    setError("");
    setResult(null);
    setScanProgress(0);

    try {
      // Animate through steps
      for (const step of SCAN_STEPS) {
        setScanStepLabel(step.label);
        setScanProgress(step.progress);
        await new Promise((r) => setTimeout(r, 400));
      }

      // ── API CALL PLACEHOLDER ────────────────────────
      // const formData = new FormData();
      // if (inputMode === "text") {
      //   formData.append("text", inputText);
      // } else if (uploadedFile) {
      //   formData.append("file", uploadedFile);
      // }
      // formData.append("sources", JSON.stringify(selectedSources));
      // formData.append("scan_depth", scanDepth);
      //
      // const response = await fetch("http://localhost:8000/api/plagiarism/check/", {
      //   method: "POST",
      //   headers: { Authorization: `Bearer ${token}` },
      //   body: formData,
      // });
      // const data = await response.json();
      // setResult(data);
      // ───────────────────────────────────────────────

      // Simulated result
      setResult({
        overallScore: 23,
        aiScore: 31,
        uniqueScore: 76,
        wordCount: wordCount || 342,
        sentencesChecked: 28,
        sources: [
          {
            id: 1,
            url: "https://wikipedia.org/wiki/example",
            title: "Wikipedia - Example Article",
            matchPercentage: 12,
            matchedText:
              "The process of photosynthesis involves the conversion of light energy into chemical energy stored in glucose.",
            sourceType: "web",
          },
          {
            id: 2,
            url: "https://journals.example.com/article/123",
            title: "Journal of Environmental Studies (2022)",
            matchPercentage: 7,
            matchedText:
              "Climate change poses significant challenges to agricultural productivity worldwide.",
            sourceType: "academic",
          },
          {
            id: 3,
            url: "https://bbc.com/news/science",
            title: "BBC News - Science Report",
            matchPercentage: 4,
            matchedText:
              "Scientists have confirmed that global temperatures have risen by 1.1°C since pre-industrial times.",
            sourceType: "news",
          },
        ],
        breakdown: {
          internet: 12,
          academic: 7,
          news: 4,
          books: 0,
        },
      });
    } catch {
      setError("Scan failed. Please try again.");
    } finally {
      setIsScanning(false);
    }
  }, [canScan, inputMode, inputText, uploadedFile, selectedSources, scanDepth, wordCount]);

  // ── Render ─────────────────────────────────────────
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
      >
        {/* ── Input Mode Tabs ── */}
        <div className="flex border-b border-white/5">
          {(["text", "file"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => { setInputMode(mode); setError(""); }}
              className={`relative px-6 py-4 text-sm font-medium capitalize transition flex items-center gap-2 ${
                inputMode === mode ? "text-white" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {mode === "text" ? (
                <><FileText className="w-4 h-4" /> Paste Text</>
              ) : (
                <><Upload className="w-4 h-4" /> Upload File</>
              )}
              {inputMode === mode && (
                <motion.div
                  layoutId="plagTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500"
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-6">
          {/* ── Text Input ── */}
          {inputMode === "text" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-500">
                  Paste your text below
                </label>
                <span className={`text-xs ${isOverLimit ? "text-red-400" : "text-gray-500"}`}>
                  {wordCount} / {MAX_FREE_WORDS} words
                </span>
              </div>
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste the text you want to check for plagiarism here...

Minimum 50 words required for accurate results."
                  rows={8}
                  className="w-full px-5 py-4 rounded-xl bg-[#0d0d14] border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-orange-500/50 transition resize-none leading-relaxed"
                />
                {inputText && (
                  <button
                    onClick={() => setInputText("")}
                    className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Word count bar */}
              <div className="mt-2 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isOverLimit ? "bg-red-500" : "bg-gradient-to-r from-orange-500 to-red-500"
                  }`}
                  style={{
                    width: `${Math.min((wordCount / MAX_FREE_WORDS) * 100, 100)}%`,
                  }}
                />
              </div>

              {isOverLimit && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-xs text-red-400">
                    Exceeded {MAX_FREE_WORDS} word limit.{" "}
                    <button className="underline font-medium">Upgrade to Pro</button>
                    {" "}for unlimited words.
                  </p>
                </motion.div>
              )}
            </div>
          )}

          {/* ── File Upload ── */}
          {inputMode === "file" && (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !uploadedFile && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition cursor-pointer ${
                isDragging
                  ? "border-orange-500/70 bg-orange-500/5"
                  : uploadedFile
                  ? "border-green-500/50 bg-green-500/5 cursor-default"
                  : "border-white/10 hover:border-white/20 hover:bg-white/5"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,.docx"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />

              <AnimatePresence mode="wait">
                {uploadedFile ? (
                  <motion.div
                    key="uploaded"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-200">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-400 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                      Remove File
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition ${
                      isDragging ? "bg-orange-500/20" : "bg-white/5"
                    }`}>
                      <Upload className={`w-7 h-7 transition ${
                        isDragging ? "text-orange-400" : "text-gray-500"
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-300">
                        {isDragging ? "Drop your file here" : "Drag & drop your file"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        or click to browse — PDF, DOCX, TXT (max 5MB)
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ── Scan Settings ── */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Sources */}
            <div>
              <label className="block text-xs text-gray-500 mb-3">
                Sources to Scan
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SCAN_SOURCES.map((source) => {
                  const isSelected = selectedSources.includes(source.id);
                  return (
                    <button
                      key={source.id}
                      type="button"
                      onClick={() => !source.proOnly && toggleSource(source.id)}
                      className={`relative flex items-center gap-3 p-3 rounded-xl border text-left transition ${
                        source.proOnly
                          ? "opacity-50 cursor-not-allowed border-white/5 bg-white/5"
                          : isSelected
                          ? "bg-orange-500/20 border-orange-500/40"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected && !source.proOnly
                          ? "bg-orange-500/30"
                          : "bg-white/5"
                      }`}>
                        <source.icon className={`w-4 h-4 ${
                          isSelected && !source.proOnly ? "text-orange-400" : "text-gray-500"
                        }`} />
                      </div>
                      <div>
                        <p className={`text-xs font-medium ${
                          isSelected && !source.proOnly ? "text-orange-300" : "text-gray-300"
                        }`}>
                          {source.label}
                        </p>
                        <p className="text-[10px] text-gray-600">{source.description}</p>
                      </div>
                      {source.proOnly && (
                        <span className="absolute top-1.5 right-1.5 text-[9px] px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/20">
                          PRO
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scan Depth */}
            <div>
              <label className="block text-xs text-gray-500 mb-3">
                Scan Depth
              </label>
              <div className="space-y-2">
                {SCAN_DEPTHS.map((depth) => (
                  <button
                    key={depth.value}
                    type="button"
                    onClick={() => setScanDepth(depth.value)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition ${
                      scanDepth === depth.value
                        ? "bg-orange-500/20 border-orange-500/40"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                        scanDepth === depth.value
                          ? "border-orange-400"
                          : "border-gray-600"
                      }`}>
                        {scanDepth === depth.value && (
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                        )}
                      </div>
                      <div className="text-left">
                        <p className={`text-sm font-medium ${
                          scanDepth === depth.value ? "text-orange-300" : "text-gray-300"
                        }`}>
                          {depth.label}
                        </p>
                        <p className="text-xs text-gray-500">{depth.desc}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-lg">
                      {depth.time}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Scan Button */}
          <button
            onClick={handleScan}
            disabled={!canScan || isScanning}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <ScanLine className="w-5 h-5" />
                Check Plagiarism
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* ── Scanning Progress ── */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl bg-white/5 border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 rounded-full border-2 border-orange-500/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-orange-500 animate-spin" />
                  <ScanLine className="absolute inset-0 m-auto w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">
                    Scanning in progress
                  </p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={scanStepLabel}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-xs text-gray-500"
                    >
                      {scanStepLabel}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
              <span className="text-2xl font-bold text-orange-400">
                {scanProgress}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${scanProgress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Source chips scanning */}
            <div className="flex gap-2 mt-4 flex-wrap">
              {SCAN_SOURCES.filter((s) =>
                selectedSources.includes(s.id)
              ).map((source, i) => (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20"
                >
                  <source.icon className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-xs text-orange-300">{source.label}</span>
                  <Loader2 className="w-3 h-3 text-orange-400 animate-spin" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results ── */}
      <AnimatePresence>
        {result && !isScanning && (
          <PlagiarismResults result={result} onRecheck={handleScan} />
        )}
      </AnimatePresence>
    </div>
  );
}
"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  Loader2,
  AlertCircle,
  Sparkles,
  Link as LinkIcon,
  ChevronDown,
  BookOpen,
  List,
  AlignLeft,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import PDFResult from "./PDFResult";

// ── Types ──────────────────────────────────────────────
type InputMode = "upload" | "url";
type SummaryLength = "short" | "medium" | "detailed";
type SummaryFocus =
  | "general"
  | "methodology"
  | "results"
  | "conclusions"
  | "literature";
type OutputFormat = "paragraph" | "bullets" | "structured";

interface SummaryOptions {
  length: SummaryLength;
  focus: SummaryFocus;
  format: OutputFormat;
  extractKeyTerms: boolean;
  generateQuestions: boolean;
  simplifyLanguage: boolean;
}

export interface PDFSummaryResult {
  title: string;
  authors: string[];
  abstract: string;
  summary: string;
  keyPoints: string[];
  keyTerms: KeyTerm[];
  sections: SummarySection[];
  questions: string[];
  metadata: PDFMetadata;
  readingTime: number;
  summaryReadingTime: number;
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface SummarySection {
  title: string;
  summary: string;
}

export interface PDFMetadata {
  pages: number;
  wordCount: number;
  fileSize: string;
  language: string;
  type: string;
}

// ── Constants ──────────────────────────────────────────
const SUMMARY_LENGTHS: {
  value: SummaryLength;
  label: string;
  desc: string;
  words: string;
}[] = [
  { value: "short", label: "Short", desc: "Quick overview", words: "~150 words" },
  { value: "medium", label: "Medium", desc: "Balanced summary", words: "~300 words" },
  { value: "detailed", label: "Detailed", desc: "In-depth analysis", words: "~600 words" },
];

const SUMMARY_FOCUSES: {
  value: SummaryFocus;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "general", label: "General Overview", icon: BookOpen },
  { value: "methodology", label: "Methodology", icon: List },
  { value: "results", label: "Results & Findings", icon: Sparkles },
  { value: "conclusions", label: "Conclusions", icon: CheckCircle },
  { value: "literature", label: "Literature Review", icon: AlignLeft },
];

const OUTPUT_FORMATS: {
  value: OutputFormat;
  label: string;
  desc: string;
}[] = [
  { value: "paragraph", label: "Paragraphs", desc: "Flowing prose" },
  { value: "bullets", label: "Bullet Points", desc: "Scannable list" },
  { value: "structured", label: "Structured", desc: "Sections & headers" },
];

// ── Processing Steps ───────────────────────────────────
const PROCESSING_STEPS = [
  { label: "Reading PDF...", progress: 10 },
  { label: "Extracting text content...", progress: 25 },
  { label: "Identifying sections...", progress: 40 },
  { label: "Analyzing key concepts...", progress: 55 },
  { label: "Generating summary...", progress: 70 },
  { label: "Extracting key terms...", progress: 82 },
  { label: "Generating questions...", progress: 92 },
  { label: "Finalizing output...", progress: 100 },
];

// ── Default Options ────────────────────────────────────
const DEFAULT_OPTIONS: SummaryOptions = {
  length: "medium",
  focus: "general",
  format: "structured",
  extractKeyTerms: true,
  generateQuestions: true,
  simplifyLanguage: false,
};

// ── Simulated Result ───────────────────────────────────
function simulateResult(fileName: string): PDFSummaryResult {
  return {
    title: "The Impact of Climate Change on Global Agricultural Systems: A Comprehensive Review",
    authors: ["Dr. Ahmed Khan", "Prof. Sarah Johnson", "Muhammad Ali"],
    abstract:
      "This paper examines the multifaceted impacts of climate change on agricultural productivity worldwide, with particular focus on developing nations. Through meta-analysis of 142 peer-reviewed studies conducted between 2010 and 2023, we demonstrate significant correlations between rising temperatures, altered precipitation patterns, and crop yield reductions.",
    summary:
      "This comprehensive review synthesizes findings from over 140 studies to provide a thorough analysis of how climate change is reshaping agricultural systems globally. The research identifies three primary mechanisms through which climate change affects food production: thermal stress on crops, altered precipitation patterns leading to drought or flooding, and increased frequency of extreme weather events.\n\nThe authors find that staple crops including wheat, rice, and maize face yield reductions of 6-25% per degree Celsius of warming in tropical regions. Developing nations, particularly those in South Asia and Sub-Saharan Africa, face disproportionate impacts due to limited adaptive capacity and higher dependence on rain-fed agriculture.\n\nDespite these challenges, the paper also identifies promising adaptation strategies including drought-resistant crop varieties, precision irrigation systems, and diversified farming approaches that have shown success in pilot programs across multiple regions.",
    keyPoints: [
      "Global crop yields could decline by 2-6% per decade due to climate change",
      "Developing nations face disproportionate agricultural impacts",
      "Thermal stress most severe impact on staple crops like wheat and rice",
      "Water scarcity projected to affect 40% of agricultural land by 2050",
      "Adaptation strategies can offset up to 50% of projected losses",
      "Carbon dioxide fertilization effect may partially compensate for losses in some regions",
      "Economic losses from agricultural disruption could exceed $500 billion annually by 2030",
    ],
    keyTerms: [
      { term: "Thermal Stress", definition: "Heat-induced damage to plant metabolism affecting growth and yield" },
      { term: "Adaptive Capacity", definition: "Ability of agricultural systems to adjust to climate change impacts" },
      { term: "Rain-fed Agriculture", definition: "Farming that relies on natural precipitation rather than irrigation" },
      { term: "Meta-analysis", definition: "Statistical technique combining results from multiple studies" },
      { term: "Carbon Fertilization", definition: "Enhanced plant growth due to elevated atmospheric CO₂ levels" },
    ],
    sections: [
      { title: "Introduction", summary: "Frames the global challenge of feeding a growing population under climate stress, reviewing IPCC projections and establishing the scope of the review." },
      { title: "Methodology", summary: "Describes systematic literature review of 142 studies using PRISMA guidelines, with quality assessment criteria and meta-analytical approach." },
      { title: "Results", summary: "Presents quantitative findings on yield reductions, regional vulnerability assessments, and economic impact projections across different climate scenarios." },
      { title: "Adaptation Strategies", summary: "Reviews evidence for technological, agronomic, and policy interventions, evaluating effectiveness and feasibility in different contexts." },
      { title: "Conclusions", summary: "Synthesizes findings and calls for urgent international cooperation, increased research funding, and implementation of proven adaptation strategies." },
    ],
    questions: [
      "What are the primary mechanisms through which climate change affects crop yields?",
      "Why do developing nations face disproportionate agricultural impacts?",
      "What adaptation strategies have shown the most promise in pilot programs?",
      "How does carbon dioxide fertilization interact with thermal stress effects?",
      "What policy interventions does the paper recommend for most vulnerable regions?",
    ],
    metadata: {
      pages: 24,
      wordCount: 8420,
      fileSize: "2.4 MB",
      language: "English",
      type: "Research Paper",
    },
    readingTime: 34,
    summaryReadingTime: 3,
  };
}

// ── Main Component ─────────────────────────────────────
export default function PDFUploader() {
  const [inputMode, setInputMode] = useState<InputMode>("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [options, setOptions] = useState<SummaryOptions>(DEFAULT_OPTIONS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PDFSummaryResult | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateOption = useCallback(
    <K extends keyof SummaryOptions>(key: K, value: SummaryOptions[K]) => {
      setOptions((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // ── File Handling ──────────────────────────────────
  const handleFile = useCallback((file: File) => {
    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("File size must be under 20MB.");
      return;
    }
    setError("");
    setUploadedFile(file);
    setResult(null);
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

  // ── Process ────────────────────────────────────────
  const handleProcess = useCallback(async () => {
    const hasInput =
      inputMode === "upload" ? !!uploadedFile : pdfUrl.trim().length > 0;
    if (!hasInput) return;

    setIsProcessing(true);
    setError("");
    setResult(null);
    setProcessingStep(0);
    setProcessingProgress(0);

    try {
      // Animate through steps
      for (let i = 0; i < PROCESSING_STEPS.length; i++) {
        setProcessingStep(i);
        setProcessingProgress(PROCESSING_STEPS[i].progress);
        await new Promise((r) => setTimeout(r, 380));
      }

      // ── API CALL PLACEHOLDER ──────────────────────
      // const formData = new FormData();
      // if (inputMode === "upload" && uploadedFile) {
      //   formData.append("file", uploadedFile);
      // } else {
      //   formData.append("url", pdfUrl);
      // }
      // formData.append("length", options.length);
      // formData.append("focus", options.focus);
      // formData.append("format", options.format);
      // formData.append("extract_key_terms", String(options.extractKeyTerms));
      // formData.append("generate_questions", String(options.generateQuestions));
      // formData.append("simplify_language", String(options.simplifyLanguage));
      //
      // const response = await fetch("http://localhost:8000/api/pdf/summarize/", {
      //   method: "POST",
      //   headers: { Authorization: `Bearer ${token}` },
      //   body: formData,
      // });
      // const data = await response.json();
      // setResult(data);
      // ─────────────────────────────────────────────

      // Simulated result
      setResult(simulateResult(uploadedFile?.name ?? pdfUrl));
    } catch {
      setError("Failed to process PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [inputMode, uploadedFile, pdfUrl, options]);

  const handleReset = useCallback(() => {
    setUploadedFile(null);
    setPdfUrl("");
    setResult(null);
    setError("");
    setProcessingStep(0);
    setProcessingProgress(0);
  }, []);

  const canProcess =
    inputMode === "upload" ? !!uploadedFile : pdfUrl.trim().length > 10;

  // ── Render ─────────────────────────────────────────
  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-5 gap-4">
        {/* ── Left: Upload Panel (2 cols) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 flex flex-col gap-4"
        >
          {/* Input Mode Tabs */}
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="flex border-b border-white/5">
              {(["upload", "url"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => { setInputMode(mode); setError(""); setResult(null); }}
                  className={`relative flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition ${
                    inputMode === mode ? "text-white" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {mode === "upload" ? (
                    <><Upload className="w-4 h-4" /> Upload PDF</>
                  ) : (
                    <><LinkIcon className="w-4 h-4" /> PDF URL</>
                  )}
                  {inputMode === mode && (
                    <motion.div
                      layoutId="pdfTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-pink-500"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="p-5">
              {/* Upload Mode */}
              {inputMode === "upload" && (
                <AnimatePresence mode="wait">
                  {!uploadedFile ? (
                    <motion.div
                      key="dropzone"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-2xl cursor-pointer transition min-h-[200px] ${
                        isDragging
                          ? "border-red-500/70 bg-red-500/5"
                          : "border-white/10 hover:border-white/20 hover:bg-white/5"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                      />
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition ${
                        isDragging ? "bg-red-500/20" : "bg-white/5"
                      }`}>
                        <Upload className={`w-7 h-7 transition ${
                          isDragging ? "text-red-400" : "text-gray-500"
                        }`} />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-300">
                          {isDragging ? "Drop your PDF here" : "Drag & drop your PDF"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          or click to browse
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                          Max 20MB · PDF only
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="uploaded"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-3"
                    >
                      {/* File Preview Card */}
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <div className="w-12 h-14 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0 relative">
                          <FileText className="w-6 h-6 text-red-400" />
                          <span className="absolute -bottom-1 -right-1 text-[8px] font-bold px-1 py-0.5 rounded bg-red-500 text-white">
                            PDF
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-200 truncate">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            <span className="text-xs text-green-400">
                              Ready to process
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={handleReset}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Replace File */}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-gray-400 transition"
                      >
                        Replace File
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              {/* URL Mode */}
              {inputMode === "url" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">
                      PDF URL
                    </label>
                    <input
                      type="url"
                      value={pdfUrl}
                      onChange={(e) => setPdfUrl(e.target.value)}
                      placeholder="https://arxiv.org/pdf/paper.pdf"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-red-500/50 transition"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Works with arXiv, ResearchGate, and direct PDF links
                    </p>
                  </div>

                  {/* Quick URLs */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">
                      Example sources:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["arXiv", "ResearchGate", "IEEE Xplore", "PubMed"].map((s) => (
                        <span
                          key={s}
                          className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-500"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* ── Options Panel ── */}
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-gray-300">
                  Summary Options
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition ${showOptions ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showOptions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-5 border-t border-white/5 pt-4">
                    {/* Summary Length */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">
                        Summary Length
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {SUMMARY_LENGTHS.map((l) => (
                          <button
                            key={l.value}
                            onClick={() => updateOption("length", l.value)}
                            className={`p-3 rounded-xl border text-center transition ${
                              options.length === l.value
                                ? "bg-red-500/20 border-red-500/40"
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                            }`}
                          >
                            <p className={`text-xs font-medium ${
                              options.length === l.value
                                ? "text-red-300"
                                : "text-gray-300"
                            }`}>
                              {l.label}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              {l.words}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Focus Area */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">
                        Focus Area
                      </label>
                      <div className="space-y-1.5">
                        {SUMMARY_FOCUSES.map((f) => (
                          <button
                            key={f.value}
                            onClick={() => updateOption("focus", f.value)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition ${
                              options.focus === f.value
                                ? "bg-red-500/20 border-red-500/30"
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                            }`}
                          >
                            <f.icon className={`w-4 h-4 flex-shrink-0 ${
                              options.focus === f.value
                                ? "text-red-400"
                                : "text-gray-500"
                            }`} />
                            <span className={`text-xs font-medium ${
                              options.focus === f.value
                                ? "text-red-300"
                                : "text-gray-300"
                            }`}>
                              {f.label}
                            </span>
                            {options.focus === f.value && (
                              <div className="w-1.5 h-1.5 rounded-full bg-red-400 ml-auto" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Output Format */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">
                        Output Format
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {OUTPUT_FORMATS.map((f) => (
                          <button
                            key={f.value}
                            onClick={() => updateOption("format", f.value)}
                            className={`p-3 rounded-xl border text-center transition ${
                              options.format === f.value
                                ? "bg-red-500/20 border-red-500/40"
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                            }`}
                          >
                            <p className={`text-xs font-medium ${
                              options.format === f.value
                                ? "text-red-300"
                                : "text-gray-300"
                            }`}>
                              {f.label}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              {f.desc}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Toggle Options */}
                    <div className="space-y-2">
                      {[
                        { key: "extractKeyTerms" as const, label: "Extract Key Terms", desc: "Glossary of important concepts", icon: BookOpen },
                        { key: "generateQuestions" as const, label: "Generate Questions", desc: "Study questions from content", icon: HelpCircle },
                        { key: "simplifyLanguage" as const, label: "Simplify Language", desc: "Plain English explanation", icon: MessageSquare },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => updateOption(opt.key, !options[opt.key])}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border transition ${
                            options[opt.key]
                              ? "bg-red-500/10 border-red-500/20"
                              : "bg-white/5 border-white/10 hover:bg-white/10"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${
                            options[opt.key]
                              ? "bg-red-500"
                              : "bg-white/10 border border-white/20"
                          }`}>
                            {options[opt.key] && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <opt.icon className={`w-4 h-4 flex-shrink-0 ${
                            options[opt.key] ? "text-red-400" : "text-gray-500"
                          }`} />
                          <div className="text-left">
                            <p className={`text-xs font-medium ${
                              options[opt.key] ? "text-red-300" : "text-gray-300"
                            }`}>
                              {opt.label}
                            </p>
                            <p className="text-[10px] text-gray-500">{opt.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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

          {/* Process Button */}
          <button
            onClick={handleProcess}
            disabled={!canProcess || isProcessing}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Summarize PDF
              </>
            )}
          </button>
        </motion.div>

        {/* ── Right: Result Panel (3 cols) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-3"
        >
          {/* Processing State */}
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full rounded-2xl bg-white/5 border border-white/10 p-8 flex flex-col items-center justify-center gap-6"
              >
                {/* Spinner */}
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-2 border-red-500/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-red-500 animate-spin" />
                  <div
                    className="absolute inset-2 rounded-full border-2 border-transparent border-t-pink-500 animate-spin"
                    style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
                  />
                  <FileText className="absolute inset-0 m-auto w-7 h-7 text-red-400" />
                </div>

                {/* Step + Progress */}
                <div className="w-full max-w-sm text-center space-y-3">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={processingStep}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-sm font-medium text-gray-300"
                    >
                      {PROCESSING_STEPS[processingStep]?.label}
                    </motion.p>
                  </AnimatePresence>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full"
                      animate={{ width: `${processingProgress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <p className="text-2xl font-bold text-red-400">
                    {processingProgress}%
                  </p>
                </div>

                {/* Steps list */}
                <div className="w-full max-w-sm space-y-2">
                  {PROCESSING_STEPS.map((step, i) => (
                    <motion.div
                      key={i}
                      className={`flex items-center gap-2 text-xs transition ${
                        i < processingStep
                          ? "text-green-400"
                          : i === processingStep
                          ? "text-red-400"
                          : "text-gray-700"
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        i < processingStep
                          ? "bg-green-400"
                          : i === processingStep
                          ? "bg-red-400 animate-pulse"
                          : "bg-gray-700"
                      }`} />
                      {step.label}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <PDFResult result={result} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
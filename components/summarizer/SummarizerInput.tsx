"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  FileText,
  Zap,
  Loader2,
  AlertCircle,
  ChevronDown,
  Plus,
  X,
  RotateCcw,
  Copy,
  CheckCheck,
  Download,
  Lightbulb,
  List,
  Layers,
  Eye,
  BookOpen
} from "lucide-react";
import SummarizerResult from "./SummarizerResult";
import { authService } from "../api/authService";
import { authState, summarizerHistory } from "../store/auth";
import { toast } from "sonner";
// ── Types ──────────────────────────────────────────────
type SummaryLength = "short" | "medium" | "detailed";
type SummaryFormat = "paragraph" | "bullet" | "structured" | "notes";
type InputMode = "text" | "paste" | "file";

interface SummaryOptions {
  length: SummaryLength;
  format: SummaryFormat;
  language: "en" | "urdu";
  tone: "academic" | "casual" | "professional";
  includeKeywords: boolean;
  includeQuestions: boolean;
}

export interface SummaryResult {
  id: string,
  originalText: string;
  originalWordCount: number;
  summary: {
  type: "paragraph" | "bullet" | "notes" | "structure";
  content: string | string[] | any;
};
  summaryWordCount: number;
  keyPoints: string[];
  keyTerms: string[];
  studyQuestions: string[];
  examNotes: string[];
  metadata: {
    processingTime: number;
    compressionRatio: number;
    readingTimeSaved: number;
  };
}

// ── Constants ──────────────────────────────────────────
const SUMMARY_LENGTHS: {
  value: SummaryLength;
  label: string;
  desc: string;
  ratio: string;
}[] = [
  { value: "short", label: "TL;DR", desc: "Ultra-concise version", ratio: "10-15%" },
  { value: "medium", label: "Standard", desc: "Balanced summary", ratio: "20-30%" },
  { value: "detailed", label: "Comprehensive", desc: "In-depth analysis", ratio: "40-50%" },
];

const SUMMARY_FORMATS: {
  value: SummaryFormat;
  label: string;
  desc: string;
  icon: React.ElementType;
}[] = [
  { value: "paragraph", label: "Paragraph", desc: "Flowing prose", icon: FileText },
  { value: "bullet", label: "Bullet Points", desc: "Key takeaways", icon: List },
  { value: "structured", label: "Structured", desc: "Sections & headers", icon: Layers },
  // { value: "notes", label: "Exam Notes", desc: "Study-ready format", icon: Lightbulb },
];

const MAX_FREE_WORDS = 2000;

const PROCESSING_STEPS = [
  { label: "Analyzing text...", progress: 15 },
  { label: "Identifying key concepts...", progress: 35 },
  { label: "Extracting main points...", progress: 55 },
  { label: "Generating summary...", progress: 75 },
  { label: "Optimizing output...", progress: 90 },
  { label: "Finalizing summary...", progress: 100 },
];

function countWords(text: string) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

// ── Main Component ─────────────────────────────────────
export default function SummarizerInput() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [inputText, setInputText] = useState("");
  const [options, setOptions] = useState<SummaryOptions>({
    length: "medium",
    format: "bullet",
    language: "en",
    tone: "academic",
    includeKeywords: true,
    includeQuestions: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);

  const wordCount = countWords(inputText);
  const isOverLimit = wordCount > MAX_FREE_WORDS;

  const updateOption = useCallback(
    <K extends keyof SummaryOptions>(key: K, value: SummaryOptions[K]) => {
      setOptions((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // ── File Handling ──────────────────────────────────
  const handleFile = useCallback((file: File) => {
    const allowed = ["text/plain", "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      setError("Only .txt, .pdf, and .docx files are supported.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be under 10MB.");
      return;
    }
    setError("");
    // Simulate file reading
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setInputText(text.substring(0, MAX_FREE_WORDS * 1.5)); // Limit to ~3000 words
    };
    reader.readAsText(file);
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

  // ── Summarize ──────────────────────────────────────
  const handleSummarize = useCallback(async () => {
    if (!inputText.trim() || inputText.length < 100) {
      setError("Please enter at least 100 characters of text.");
      return;
    }
    if (isOverLimit) return;

    setIsProcessing(true);
    setError("");
    setResult(null);
    setProcessingStep(0);

    try {
      // Animate through steps
      for (let i = 0; i < PROCESSING_STEPS.length; i++) {
        setProcessingStep(i);
        await new Promise((r) => setTimeout(r, 350));
      }
      
          const response = await authService.summarizerGen({
      text: inputText,
      length: options.length,
      format: options.format,
      language: options.language,
      tone: options.tone,
      include_keywords: options.includeKeywords,
      include_questions: options.includeQuestions,
    }); 
    summarizerHistory.response.set((prev) => [
  response,   // new summary from backend
  ...prev
]);

// console.log(response, "Debug")
// console.log(response.reading_time_saved, "DebugReading TIme")
  //  console.log(response);
setResult({
  id: response.id,
  originalText: response.original_text,
  originalWordCount: response.original_word_count,
  summary: response.summary,
  summaryWordCount: response.summary_word_count,

  keyPoints: response.key_points || [],
  keyTerms: response.key_terms || [],
  studyQuestions: response.study_questions || [],
  examNotes: response.exam_notes || [],

  processingTime: response.processing_time ?? 0,
  compressionRatio: response.compression_ratio ?? 0,
  readingTimeSaved: response.reading_time_saved ?? 0,
});
const user = await authService.getMe()
authState.user.set(user)
      // ── API CALL PLACEHOLDER ────────────────────────
      // const response = await fetch("http://localhost:8000/api/summarizer/summarize/", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({
      //     text: inputText,
      //     length: options.length,
      //     format: options.format,
      //     language: options.language,
      //     tone: options.tone,
      //     include_keywords: options.includeKeywords,
      //     include_questions: options.includeQuestions,
      //   }),
      // });
      // const data = await response.json();
      // setResult(data);
      // ─────────────────────────────────────────────

      // Simulated response
      // const originalWords = wordCount;
      // const summaryRatio = options.length === "short" ? 0.12 : options.length === "medium" ? 0.25 : 0.45;
      // const summaryWords = Math.floor(originalWords * summaryRatio);

      // setResult({
      //   originalText: inputText,
      //   originalWordCount: originalWords,
      //   summary: generateMockSummary(inputText.substring(0, 300), options.format),
      //   summaryWordCount: summaryWords,
      //   keyPoints: [
      //     "The main topic discusses fundamental principles and their applications",
      //     "Key concepts include analysis, implementation, and optimization strategies",
      //     "Important considerations for real-world usage are highlighted",
      //     `The approach requires understanding of core ${options.length === "short" ? "basics" : "concepts and advanced topics"}`,
      //     "Best practices should be followed for optimal results",
      //   ],
      //   keyTerms: ["analysis", "implementation", "optimization", "strategy", "framework", "methodology"],
      //   studyQuestions: [
      //     "What are the main points discussed in this text?",
      //     "How do the key concepts relate to each other?",
      //     "What practical applications are mentioned?",
      //     "What are the important takeaways?",
      //     `Why is ${options.tone} approach important?`,
      //   ],
      //   examNotes: [
      //     "**Key Points to Remember:**",
      //     "• Main concept 1: Important detail",
      //     "• Main concept 2: Key implementation",
      //     "• Main concept 3: Critical consideration",
      //     "",
      //     "**Formula/Framework:** [Applicable concept]",
      //     "**Example:** [Real-world application]",
      //     "**Remember:** Always consider context and implications",
      //   ],
      //   metadata: {
      //     processingTime: Math.floor(Math.random() * 3) + 2,
      //     compressionRatio: Math.round((1 - summaryRatio) * 100),
      //     readingTimeSaved: Math.floor((originalWords / 200) * (1 - summaryRatio)),
      //   },
      // });
    } catch (err) {

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
}finally {
      setIsProcessing(false);
    }
  }, [inputText, options, isOverLimit, wordCount]);

  const handleReset = useCallback(() => {
    setInputText("");
    setResult(null);
    setError("");
    setProcessingStep(0);
  }, []);

const handleCopy = useCallback(async () => {
  if (!result) return;

  let textToCopy = "";

  const summary = result.summary;

  if (summary.type === "bullet") {
    textToCopy = summary.content.join("\n");
  } 
  else if (summary.type === "paragraph") {
    textToCopy = summary.content;
  } 
  else {
    textToCopy = JSON.stringify(summary.content, null, 2);
  }

  await navigator.clipboard.writeText(textToCopy);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
}, [result]);

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-5 gap-4">
        {/* ── Left: Input (2 cols) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 flex flex-col rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">Input Text</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs ${isOverLimit ? "text-red-400" : "text-gray-500"}`}>
                {wordCount} / {MAX_FREE_WORDS}
              </span>
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Input Modes */}
          <div className="p-4 border-b border-white/5 flex gap-2">
            {(["text", "paste", "file"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setInputMode(mode)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition capitalize ${
                  inputMode === mode
                    ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                    : "bg-white/5 text-gray-500 hover:bg-white/10"
                }`}
              >
                {mode === "file" ? "📄" : mode === "paste" ? "📋" : "✏️"} {mode}
              </button>
            ))}
          </div>

          {/* Text Area / Drop Zone */}
          <div className="flex-1 flex flex-col p-4">
            {inputMode === "text" || inputMode === "paste" ? (
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={inputMode === "paste"
                  ? "Paste your article, essay, or research paper here..."
                  : "Type or paste your text here..."}
                className="flex-1 px-4 py-3 rounded-xl bg-[#0d0d14] border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 transition resize-none"
              />
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl cursor-pointer transition ${
                  isDragging
                    ? "border-indigo-500/70 bg-indigo-500/5"
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
                <FileText className={`w-8 h-8 ${isDragging ? "text-indigo-400" : "text-gray-500"}`} />
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-300">
                    {isDragging ? "Drop your file" : "Drag & drop your file"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    or click to browse (.txt, .pdf, .docx)
                  </p>
                </div>
              </div>
            )}

            {/* Word Count Bar */}
            <div className="mt-3">
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isOverLimit
                      ? "bg-red-500"
                      : "bg-gradient-to-r from-indigo-500 to-purple-500"
                  }`}
                  style={{
                    width: `${Math.min((wordCount / MAX_FREE_WORDS) * 100, 100)}%`,
                  }}
                />
              </div>
              {isOverLimit && (
                <div className="flex items-center gap-1.5 mt-2">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                  <p className="text-xs text-red-400">
                    Exceeded limit. <button className="underline font-medium">Upgrade to Pro</button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Right: Options + Result (3 cols) ── */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Options Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4"
          >
            <h3 className="text-sm font-semibold text-gray-300">Summary Options</h3>

            <div className="grid grid-cols-2 gap-3">
              {/* Length */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">Length</label>
                <div className="space-y-1.5">
                  {SUMMARY_LENGTHS.map((len) => (
                    <button
                      key={len.value}
                      onClick={() => updateOption("length", len.value)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs transition ${
                        options.length === len.value
                          ? "bg-indigo-500/20 border-indigo-500/30"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <p className={`font-medium ${options.length === len.value ? "text-indigo-300" : "text-gray-300"}`}>
                        {len.label}
                      </p>
                      <p className={`text-[10px] mt-0.5 ${options.length === len.value ? "text-indigo-400/70" : "text-gray-600"}`}>
                        {len.ratio} of original
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">Format</label>
                <div className="space-y-1.5">
                  {SUMMARY_FORMATS.map((fmt) => (
                    <button
                      key={fmt.value}
                      onClick={() => updateOption("format", fmt.value)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs transition ${
                        options.format === fmt.value
                          ? "bg-indigo-500/20 border-indigo-500/30"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <fmt.icon className={`w-3 h-3 ${options.format === fmt.value ? "text-indigo-400" : "text-gray-500"}`} />
                        <div>
                          <p className={`font-medium ${options.format === fmt.value ? "text-indigo-300" : "text-gray-300"}`}>
                            {fmt.label}
                          </p>
                          <p className={`text-[10px] ${options.format === fmt.value ? "text-indigo-400/70" : "text-gray-600"}`}>
                            {fmt.desc}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tone + Language */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-2">Tone</label>
                <select
                  value={options.tone}
                  onChange={(e) => updateOption("tone", e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200 outline-none focus:border-indigo-500/50 transition"
                >
                  <option value="academic">Academic</option>
                  <option value="casual">Casual</option>
                  <option value="professional">Professional</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-2">Language</label>
                <select
                  value={options.language}
                  onChange={(e) => updateOption("language", e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200 outline-none focus:border-indigo-500/50 transition"
                >
                  <option value="en">English</option>
                  <option value="urdu">اردو</option>
                </select>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              {[
                { key: "includeKeywords" as const, label: "Key Terms", icon: BookOpen },
                { key: "includeQuestions" as const, label: "Study Questions", icon: Lightbulb },
              ].map((toggle) => (
                <button
                  key={toggle.key}
                  onClick={() => updateOption(toggle.key, !options[toggle.key])}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition ${
                    options[toggle.key]
                      ? "bg-indigo-500/10 border-indigo-500/20"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 ${
                    options[toggle.key] ? "bg-indigo-500" : "bg-white/10"
                  }`}>
                    {options[toggle.key] && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <toggle.icon className="w-3.5 h-3.5 text-gray-500" />
                  <span className={`text-xs font-medium ${options[toggle.key] ? "text-indigo-300" : "text-gray-300"}`}>
                    {toggle.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Summarize Button */}
            <button
              onClick={handleSummarize}
              disabled={!inputText.trim() || inputText.length < 100 || isOverLimit || isProcessing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  Generate Summary
                </>
              )}
            </button>
          </motion.div>

          {/* Result Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1"
          >
            {isProcessing ? (
              <ProcessingState step={processingStep} />
            ) : (
              <SummarizerResult result={result} onCopy={handleCopy} copied={copied} />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ── Processing State Component ─────────────────────────
function ProcessingState({ step }: { step: number }) {
  return (
    <div className="h-full min-h-[400px] rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-6 p-8">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin" />
        <div
          className="absolute inset-2 rounded-full border-2 border-transparent border-t-purple-500 animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
        />
        <Brain className="absolute inset-0 m-auto w-6 h-6 text-indigo-400" />
      </div>

      <div className="w-full max-w-sm text-center space-y-2">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-gray-300"
        >
          {PROCESSING_STEPS[step]?.label}
        </motion.p>

        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            animate={{ width: `${PROCESSING_STEPS[step]?.progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <div className="w-full max-w-sm space-y-1">
        {PROCESSING_STEPS.map((s, i) => (
          <motion.div
            key={i}
            className={`flex items-center gap-2 text-xs transition ${
              i < step
                ? "text-green-400"
                : i === step
                ? "text-indigo-400"
                : "text-gray-700"
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              i < step
                ? "bg-green-400"
                : i === step
                ? "bg-indigo-400 animate-pulse"
                : "bg-gray-700"
            }`} />
            {s.label}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Mock Summary Generator ─────────────────────────────
function generateMockSummary(text: string, format: SummaryFormat): string {
  if (format === "paragraph") {
    return `This text discusses important concepts and principles. The main themes revolve around understanding key ideas and their practical applications. The content emphasizes the importance of thorough analysis and strategic thinking. Implementation details are provided for real-world usage, making this information immediately applicable. The conclusion highlights the significance of proper methodology and best practices.`;
  }

  if (format === "bullet") {
    return `• Main point 1: Core concept that forms the foundation
- Main point 2: Key implementation strategy
- Main point 3: Important consideration for practice
- Main point 4: Critical takeaway message
- Main point 5: Practical application method`;
  }

  if (format === "structured") {
    return `# Main Concept
The primary theme discusses fundamental principles and their applications in modern contexts.

## Key Areas Covered
1. **Theory:** Understanding of underlying concepts
2. **Practice:** Real-world implementation strategies
3. **Analysis:** Methods for evaluation and improvement

## Important Points
- First crucial aspect with implications
- Second consideration for effective usage
- Third element requiring special attention

## Conclusion
The material emphasizes practical methodology and strategic thinking for success.`;
  }

  return `**Key Topics:**
1. Core Concept - Foundation of discussion
2. Implementation Method - Practical approach
3. Critical Factors - Important considerations

**Definitions to Remember:**
- Term 1: Brief definition and context
- Term 2: What it means and why it matters

**Common Mistakes to Avoid:**
❌ Overlooking foundational concepts
❌ Skipping practical implementation
✓ Always apply methodology correctly

**Exam Tips:**
💡 Remember the three main points
💡 Understand the "why" not just "what"
💡 Connect theory to practice`;
}
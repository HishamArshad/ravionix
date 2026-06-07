"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Sparkles,
  Loader2,
  AlertCircle,
  ChevronDown,
  RotateCcw,
  Upload,
  Keyboard,
  Lightbulb,
  BookOpen,
  FileText,
  X,
  Eye,
} from "lucide-react";
import MCQResult from "./MCQResult";
import { authService } from "../api/authService";
import { currentMCQRetake, mcqHistory } from "../store/auth";
import { observer } from "@legendapp/state/react";
import { toast } from "sonner";
// ── Types ──────────────────────────────────────────────
type InputMode = "text" | "file";
type QuestionCount = 5 | 10 | 20;
type DifficultyLevel = "easy" | "medium" | "hard" | "mixed";
type QuestionType = "all" | "multiple" | "true_false";

interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
} 

interface MCQuestion {
  id: number;
  question: string;
  type: "multiple" | "true_false";
  options: MCQOption[];
  correctAnswer: string;
  explanation: string;
  difficulty: DifficultyLevel;
  topic: string;
}

export interface GeneratedMCQ {
  title: string;
  topic: string;
  totalQuestions: number;
  difficulty: DifficultyLevel;
  questions: MCQuestion[];
  generatedAt: string;
  totalWords: number;
  estimatedTime: number;
}

// ── Constants ──────────────────────────────────────────
const QUESTION_COUNTS: QuestionCount[] = [5, 10, 20];

const DIFFICULTY_LEVELS: {
  value: DifficultyLevel;
  label: string;
  desc: string;
  color: string;
}[] = [
  { value: "easy", label: "Easy", desc: "Basic concepts", color: "text-green-400" },
  { value: "medium", label: "Medium", desc: "Mixed difficulty", color: "text-yellow-400" },
  { value: "hard", label: "Hard", desc: "Advanced topics", color: "text-red-400" },
  { value: "mixed", label: "Mixed", desc: "All levels combined", color: "text-blue-400" },
];

const QUESTION_TYPES: { value: QuestionType; label: string; desc: string }[] = [
  { value: "all", label: "All Types", desc: "Multiple choice & T/F" },
  { value: "multiple", label: "Multiple Choice", desc: "4-5 options per Q" },
  { value: "true_false", label: "True/False", desc: "Quick assessment" },
];

// ── Processing Steps ───────────────────────────────────
const PROCESSING_STEPS = [
  { label: "Analyzing text content...", progress: 10 },
  { label: "Identifying key concepts...", progress: 25 },
  { label: "Generating questions...", progress: 45 },
  { label: "Creating answer options...", progress: 65 },
  { label: "Writing explanations...", progress: 82 },
  { label: "Organizing by difficulty...", progress: 95 },
  { label: "Finalizing MCQ set...", progress: 100 },
];

// ── Simulated MCQ Generation ───────────────────────────
function simulateMCQGeneration(
  text: string,
  count: QuestionCount,
  difficulty: DifficultyLevel
): GeneratedMCQ {
  const sampleQuestions: MCQuestion[] = [
    {
      id: 1,
      question: "What is the SI unit of force?",
      type: "multiple",
      options: [
        { id: "a", text: "Newton (N)", isCorrect: true },
        { id: "b", text: "Pascal (Pa)", isCorrect: false },
        { id: "c", text: "Joule (J)", isCorrect: false },
        { id: "d", text: "Watt (W)", isCorrect: false },
      ],
      correctAnswer: "a",
      explanation:
        "The SI unit of force is the Newton (N), named after Sir Isaac Newton. It is defined as the force required to accelerate a mass of 1 kilogram at 1 meter per second squared (1 N = 1 kg⋅m/s²).",
      difficulty: "easy",
      topic: "Physics",
    },
    {
      id: 2,
      question:
        "Which statement best describes Newton's Second Law of Motion?",
      type: "multiple",
      options: [
        {
          id: "a",
          text: "An object at rest stays at rest unless acted upon by a force",
          isCorrect: false,
        },
        {
          id: "b",
          text: "Force equals mass times acceleration (F = ma)",
          isCorrect: true,
        },
        {
          id: "c",
          text: "Every action has an equal and opposite reaction",
          isCorrect: false,
        },
        {
          id: "d",
          text: "The total energy of a closed system is conserved",
          isCorrect: false,
        },
      ],
      correctAnswer: "b",
      explanation:
        "Newton's Second Law of Motion states that F = ma, where F is the net force applied to an object, m is its mass, and a is the acceleration produced. This shows that acceleration is directly proportional to force and inversely proportional to mass.",
      difficulty: "medium",
      topic: "Physics",
    },
    {
      id: 3,
      question: "True or False: Kinetic energy is inversely proportional to mass",
      type: "true_false",
      options: [
        { id: "a", text: "True", isCorrect: false },
        { id: "b", text: "False", isCorrect: true },
      ],
      correctAnswer: "b",
      explanation:
        "This is FALSE. Kinetic energy (KE = ½mv²) is directly proportional to mass, not inversely proportional. When mass increases while velocity remains constant, kinetic energy increases proportionally.",
      difficulty: "medium",
      topic: "Physics",
    },
  ];

  // Repeat to fill requested count
  const questions = [];
  for (let i = 0; i < count; i++) {
    const sample = sampleQuestions[i % sampleQuestions.length];
    questions.push({
      ...sample,
      id: i + 1,
    });
  }

  return {
    title: "MCQ Set: Physics Fundamentals",
    topic: "Physics",
    totalQuestions: count,
    difficulty,
    questions,
    generatedAt: new Date().toLocaleString(),
    totalWords: text.split(/\s+/).length,
    estimatedTime: Math.ceil(count * 1.5),
  };
}

// ── Main Component ─────────────────────────────────────
export default observer(function MCQGenerator() {
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [inputText, setInputText] = useState("");
  const [focusText, setFocusText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [questionCount, setQuestionCount] = useState<QuestionCount>(10);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("mixed");
  const [questionType, setQuestionType] = useState<QuestionType>("all");
  const [includeExplanations, setIncludeExplanations] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<GeneratedMCQ | null>(null);
  const [historyId, setHistoryId] = useState("")
  const wordCount = inputText.trim().split(/\s+/).length;
//   const isDragging = useState(false)[0];
//   const [setIsDragging] = useState(false);
//   const fileInputRef = useState<HTMLInputElement>(null)[1];
//   const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null);
const [isDragging, setIsDragging] = useState(false);
const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canGenerate =
    inputMode === "text"
      ? inputText.trim().length > 50
      : !!uploadedFile;

  const handleFile = useCallback((file: File) => {
    if (!["text/plain", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
      setError("Only .txt, .pdf, and .docx files are supported.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be under 10MB.");
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

  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return;
    setIsGenerating(true);
    setError("");
    setResult(null);
    setProcessingStep(0);

    try {
      // Simulate processing steps
      for (let i = 0; i < PROCESSING_STEPS.length; i++) {
        setProcessingStep(i);
        await new Promise((r) => setTimeout(r, 400));
      }

      // ── API CALL PLACEHOLDER ────────────────────────
  //     const formData = new FormData();
      
  //       formData.append("text", inputText);
  //  formData.append("topic", focusText);
   
  //     formData.append("question_count", String(questionCount));

  //     formData.append("difficulty", difficulty);
  //     formData.append("question_type", questionType);
  //     formData.append("include_explanations", String(includeExplanations));
  //     const res = await authService.mcqGen(FormData)
const res = await authService.mcqGen({
  text: inputText,
  topic: focusText,
  question_count: questionCount,
  difficulty,
  question_type: questionType,
  include_explanations: includeExplanations,
});

setResult(res.mcq);
setHistoryId(res.history_id);

mcqHistory.response.set((prev: any[] = []) => [
  {
    id: res.history_id,

    title: res.mcq.title,
    topic: res.mcq.topic || "",
    subject: "General",

    questions: res.mcq.totalQuestions,
    difficulty: res.mcq.difficulty,

    score: null,
    attempt: null,

    date: new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),

    time_spent: "",
    type: "generated",
  },

  ...prev,
]);
      // ─────────────────────────────────────────────

      // setResult(simulateMCQGeneration(inputText, questionCount, difficulty));
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
      setIsGenerating(false);
    }
  }, [canGenerate, inputMode, inputText, uploadedFile, questionCount, difficulty, questionType, includeExplanations]);

  const handleReset = useCallback(() => {
    setInputText("");
    setUploadedFile(null);
    setResult(null);
    setError("");
    setProcessingStep(0);
  }, []);
  useEffect(() => {
  return currentMCQRetake.onChange(({ value }) => {
    if (!value) return;

    setResult(value.mcq);

    setHistoryId(value.id);

    setFocusText(value.topic || "");
    setDifficulty(value.difficulty || "mixed");

    setProcessingStep(0);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}, []);

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-5 gap-4">
        {/* ── Left Panel: Input (2 cols) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
        >
          {/* Input Mode Tabs */}
          <div className="flex border-b border-white/5">
            {(["text", "file"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => { setInputMode(mode); setError(""); }}
                className={`relative flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition ${
                  inputMode === mode ? "text-white" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {mode === "text" ? (
                  <><Keyboard className="w-4 h-4" /> Paste Text</>
                ) : (
                  <><Upload className="w-4 h-4" /> Upload</>
                )}
                {inputMode === mode && (
                  <motion.div
                    layoutId="mcqTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-blue-500"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="p-5 space-y-4">
                        {/* Focus Input */}
 {/* Text Input */}
{inputMode === "text" && (
  <AnimatePresence mode="wait">
    <motion.div
      key="text"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-300">
            Study Material
          </label>
          <p className="text-xs text-gray-600 mt-0.5">
            Paste notes, textbook content, lecture material, or a topic
          </p>
        </div>

        <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
          <span className="text-xs text-gray-400">
            {wordCount} words
          </span>
        </div>
      </div>

      {/* Optional Topic */}
      <div>
        <input
          value={focusText}
          onChange={(e) => setFocusText(e.target.value)}
          type="text"
          placeholder="Optional topic (e.g. Chapter 1: Newton Laws)"
          className="w-full px-4 py-3 rounded-xl bg-[#0d0d14] border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 transition"
        />
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Example:

Newton's First Law states that an object remains at rest or in uniform motion unless acted upon by an external force...

Paste your study material here.`}
          rows={12}
          className="w-full px-4 py-4 rounded-2xl bg-[#0d0d14] border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:bg-[#101018] transition resize-none leading-7"
        />

        {/* Clear Button */}
        {inputText && (
          <button
            onClick={() => setInputText("")}
            className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Footer Tips */}
      <div className="flex items-center justify-between text-[11px] text-gray-600">
        <p>Minimum 50 words required</p>

        <div className="flex items-center gap-1">
          <BookOpen className="w-3 h-3" />
          Better notes → Better MCQs
        </div>
      </div>
    </motion.div>
  </AnimatePresence>
)}

            {/* Text Input */}
            {/* {inputMode === "text" && (
              <AnimatePresence mode="wait">
                <motion.div
                  key="text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-gray-500">
                      Paste content below
                    </label>
                    <span className="text-xs text-gray-600">
                      {wordCount} words
                    </span>
                  </div>
                  <div className="relative">
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={`Paste study material, textbook content, lecture notes, or any text...

Minimum 50 words required for MCQ generation.`}
                      rows={8}
                      className="w-full px-4 py-3 rounded-xl bg-[#0d0d14] border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 transition resize-none leading-relaxed"
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
                </motion.div>
              </AnimatePresence>
            )} */}

            {/* File Upload */}
            {inputMode === "file" && (
              <AnimatePresence mode="wait">
                <motion.div
                  key="file"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-2xl cursor-pointer transition min-h-[280px] ${
                    isDragging
                      ? "border-indigo-500/70 bg-indigo-500/5"
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

                  {uploadedFile ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <div className="w-14 h-16 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                        <FileText className="w-7 h-7 text-green-400" />
                      </div>
                      <p className="font-medium text-gray-200">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                      <div className="flex gap-2 mt-3 justify-center">
                        <button
                          onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                          className="text-xs px-3 py-1 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      <Upload className={`w-8 h-8 transition ${
                        isDragging ? "text-indigo-400" : "text-gray-500"
                      }`} />
                      <div className="text-center">
                        <p className="font-medium text-gray-300">
                          {isDragging ? "Drop file here" : "Drag & drop your file"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          or click to browse
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                          Supports .txt, .pdf, .docx (max 10MB)
                        </p>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Question Count */}
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                Number of Questions
              </label>
              <div className="flex gap-2">
                {QUESTION_COUNTS.map((count) => (
                  <button
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition ${
                      questionCount === count
                        ? "bg-indigo-500/30 border border-indigo-500/50 text-indigo-300"
                        : "bg-white/5 border border-white/10 text-gray-500 hover:bg-white/10"
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-gray-600 mt-1.5">
                Estimated time: ~{Math.ceil(questionCount * 1.5)} minutes
              </p>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DIFFICULTY_LEVELS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDifficulty(d.value)}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      difficulty === d.value
                        ? "bg-indigo-500/20 border-indigo-500/40"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <p className={`text-xs font-semibold ${
                      difficulty === d.value ? d.color : "text-gray-300"
                    }`}>
                      {d.label}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{d.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              {[
                {
                  key: "questionType",
                  label: "Question Types",
                  value: questionType,
                  options: QUESTION_TYPES,
                  onChange: (v: string) => setQuestionType(v as QuestionType),
                },
              ].map((opt) => (
                <div key={opt.key}>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    {opt.label}
                  </label>
                  <div className="flex gap-1.5">
                    {opt.options.map((o) => (
                      <button
                        key={o.value}
                        onClick={() => opt.onChange(o.value)}
                        className={`flex-1 text-center py-2 px-2 rounded-lg text-xs font-medium transition ${
                          opt.value === o.value
                            ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-300"
                            : "bg-white/5 border border-white/10 text-gray-500 hover:bg-white/10"
                        }`}
                      >
                        <span className="truncate block">{o.label}</span>
                        <span className="text-[9px] text-gray-600">{o.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Explanations Toggle */}
              <div className="flex items-center justify-between py-2">
                <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                  <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                  Include explanations
                </label>
                <button
                  onClick={() => setIncludeExplanations(!includeExplanations)}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                    includeExplanations ? "bg-indigo-500" : "bg-white/10"
                  }`}
                >
                  <motion.div
                    animate={{ x: includeExplanations ? 22 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
                  />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!canGenerate || isGenerating}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating MCQs...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate MCQs
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* ── Right Panel: Result (3 cols) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-3"
        >
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full rounded-2xl bg-white/5 border border-white/10 p-8 flex flex-col items-center justify-center gap-6 min-h-[500px]"
              >
                {/* Spinner */}
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin" />
                  <div
                    className="absolute inset-2 rounded-full border-2 border-transparent border-t-blue-500 animate-spin"
                    style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
                  />
                  <Brain className="absolute inset-0 m-auto w-7 h-7 text-indigo-400" />
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
                      className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                      animate={{
                        width: `${PROCESSING_STEPS[processingStep]?.progress || 0}%`,
                      }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <p className="text-2xl font-bold text-indigo-400">
                    {PROCESSING_STEPS[processingStep]?.progress || 0}%
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
                          ? "text-indigo-400"
                          : "text-gray-700"
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        i < processingStep
                          ? "bg-green-400"
                          : i === processingStep
                          ? "bg-indigo-400 animate-pulse"
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
                <MCQResult result={result} historyId={historyId} onReset={handleReset} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
})
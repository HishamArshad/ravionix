"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Copy,
  CheckCheck,
  Download,
  RotateCcw,
  Eye,
  Play,
  HelpCircle,
  AlertCircle,
  CheckCircle,
  X,
  ChevronDown,
  FileQuestion,
  Target,
  Clock,
  Zap,
  Share2,
  BarChart3,
} from "lucide-react";
import type { GeneratedMCQ } from "./MCQGenerator";
import { authService } from "../api/authService";

interface MCQResultProps {
  result: GeneratedMCQ | null;
  onReset: () => void;
}

export default function MCQResult({ result, onReset , historyId}: MCQResultProps) {
  const [copied, setCopied] = useState(false);
const [selectedAnswers, setSelectedAnswers] =
  useState<Record<number, string | string[]>>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [quizMode, setQuizMode] = useState(true);
  const [viewMode, setViewMode] = useState<"quiz" | "review" | "report">("quiz");

  const handleSelectAnswer = useCallback((questionId: number, optionId: string) => {
    console.log("clicked", questionId, optionId)
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
    
  }, []);
    // console.log(result, "Resilt")
  const handleCopy = useCallback(async () => {
    if (!result) return;
    const text = result.questions
      .map((q, i) => {
        const optionsText = q.options
          .map((opt) => `${opt.id.toUpperCase()}. ${opt.text}`)
          .join("\n");
        return `Q${i + 1}. ${q.question}\n${optionsText}\n\nAnswer: ${q.correctAnswer.toUpperCase()}\nExplanation: ${q.explanation}`;
      })
      .join("\n\n---\n\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  // Empty State
  if (!result) {
    return (
      <div className="h-full min-h-[500px] rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4 text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
          <FileQuestion className="w-8 h-8 text-gray-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">
            MCQ set will appear here
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Enter content and click Generate
          </p>
        </div>

        {/* Feature Preview */}
        <div className="w-full max-w-sm mt-4 space-y-2">
          {[
            { icon: Target, label: "Auto-generated questions" },
            { icon: HelpCircle, label: "Multiple difficulty levels" },
            { icon: Zap, label: "Instant answers & explanations" },
            { icon: BarChart3, label: "Performance analytics" },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5">
              <f.icon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span className="text-xs text-gray-400">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const correctAnswers = Object.entries(selectedAnswers).filter(
    ([qId, aId]) => result.questions[parseInt(qId) - 1]?.correctAnswer === aId
  ).length;
  const percentage = Math.round((correctAnswers / result.totalQuestions) * 100);
  const unattempted = result.totalQuestions - Object.keys(selectedAnswers).length;

  const difficultyBreakdown = result.questions.reduce(
  (acc, question) => {
    const difficulty = question.difficulty?.toLowerCase();

    if (difficulty === "easy") acc.easy++;
    else if (difficulty === "medium") acc.medium++;
    else if (difficulty === "hard") acc.hard++;

    return acc;
  },
  {
    easy: 0,
    medium: 0,
    hard: 0,
  }
);
console.log("selectedAnswers", selectedAnswers)
// console.log(difficultyBreakdown);
//     {
//   "score": correctAnswers,
//   "total": result.totalQuestions,
//   "percentage": percentage,
//   "difficulty_breakdown": difficultyBreakdown,
//   "answers": []
// }
   const handleFinishQuiz = async () => {
  if (!result) return;

  // supports:
  // single
  // multiple
  // true/false

  const answersPayload = result.questions.map((q) => {
    const selected = selectedAnswers[q.id];

    let isCorrect = false;

    // multiple answers
    if (Array.isArray(q.correctAnswers)) {
      const selectedArray = Array.isArray(selected)
        ? selected
        : selected
        ? [selected]
        : [];

      isCorrect =
        JSON.stringify([...selectedArray].sort()) ===
        JSON.stringify([...q.correctAnswers].sort());
    }

    // single answer
    else {
      isCorrect = selected === q.correctAnswer;
    }

    return {
      question_id: q.id,

      selected_answer: selected || null,

      correct_answer:
        q.correctAnswers || q.correctAnswer,

      is_correct: isCorrect,
    };
  });

  const correctCount = answersPayload.filter(
    (a) => a.is_correct
  ).length;

  const percentage = Math.round(
    (correctCount / result.totalQuestions) * 100
  );

  const difficultyBreakdown = result.questions.reduce(
    (acc, question) => {
      const difficulty =
        question.difficulty?.toLowerCase();

      if (difficulty === "easy") acc.easy++;
      else if (difficulty === "medium")
        acc.medium++;
      else if (difficulty === "hard")
        acc.hard++;

      return acc;
    },
    {
      easy: 0,
      medium: 0,
      hard: 0,
    }
  );

  const payload = {
    score: correctCount,

    total: result.totalQuestions,

    percentage,

    estimated_time: result.estimatedTime,

    difficulty_breakdown: difficultyBreakdown,

    answers: answersPayload,
  };

  console.log(payload);

  try {
    await authService.mcqAttempt(
      historyId,
      payload
    );

    setShowAnswers(true);
  } catch (err) {
    console.error(err);
  }
};


  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* ── Header Info ── */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Left: Title & Stats */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <FileQuestion className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-indigo-200">{result.title}</h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/20 text-indigo-400">
                  {result.totalQuestions} Qs
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  result.difficulty === "easy" ? "bg-green-500/10 text-green-400" :
                  result.difficulty === "medium" ? "bg-yellow-500/10 text-yellow-400" :
                  result.difficulty === "hard" ? "bg-red-500/10 text-red-400" :
                  "bg-blue-500/10 text-blue-400"
                }`}>
                  {result.difficulty}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                  ~{result.estimatedTime}m
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: View Modes */}
        {showAnswers && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-5 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Score</span>
                <span className={`text-2xl font-bold ${
                  percentage >= 80 ? "text-green-400" :
                  percentage >= 60 ? "text-yellow-400" :
                  "text-red-400"
                }`}>
                  {percentage}%
                </span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    percentage >= 80 ? "bg-green-500" :
                    percentage >= 60 ? "bg-yellow-500" :
                    "bg-red-500"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-green-400">{correctAnswers}</p>
                  <p className="text-[10px] text-gray-500">Correct</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-red-400">
                    {result.totalQuestions - correctAnswers - unattempted}
                  </p>
                  <p className="text-[10px] text-gray-500">Wrong</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-yellow-400">{unattempted}</p>
                  <p className="text-[10px] text-gray-500">Skipped</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── View Mode Tabs ── */}
      <div className="flex gap-2 rounded-xl bg-white/5 border border-white/10 p-1">
        {(["quiz", "review", "report"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition ${
              viewMode === mode
                ? "bg-white/10 text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {mode === "quiz" && <span>📝 Quiz</span>}
            {mode === "review" && <span>✓ Review</span>}
            {mode === "report" && <span>📊 Report</span>}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <AnimatePresence mode="wait">
        {viewMode === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {result.questions.map((question, idx) => {
              const isAnswered = selectedAnswers[question.id];
              const isCorrect = isAnswered === question.correctAnswer;

              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-4 rounded-2xl border transition ${
                    isAnswered
                      ? isCorrect
                        ? "bg-green-500/5 border-green-500/20"
                        : "bg-red-500/5 border-red-500/20"
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Question Header */}
                  <button
                    onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
                    className="w-full flex items-start gap-3 text-left"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0 pt-0.5">
                      <span className="text-xs font-semibold text-gray-500 flex-shrink-0">
                        Q{idx + 1}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-gray-500 flex-shrink-0">
                        {question.difficulty}
                      </span>
                      <p className="text-sm font-medium text-gray-200">
                        {question.question}
                      </p>
                    </div>
                    {isAnswered && (
                      isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      )
                    )}
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition flex-shrink-0 ${
                      expandedQuestion === question.id ? "rotate-180" : ""
                    }`} />
                  </button>

                  {/* Options */}
                  <AnimatePresence>
                    {expandedQuestion === question.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 ml-6 space-y-2">
                          {question.options.map((option) => {
                            const isSelected = selectedAnswers[question.id] === option.id;
                            const isCorrectAnswer = option.isCorrect;

                            return (
                              <button
                                key={option.id}
                                onClick={() => !showAnswers && handleSelectAnswer(question.id, option.id)}
                                className={`w-full flex items-start gap-3 p-3 rounded-xl border transition text-left ${
                                  isSelected
                                    ? isCorrectAnswer
                                      ? "bg-green-500/20 border-green-500/40"
                                      : "bg-red-500/20 border-red-500/40"
                                    : showAnswers && isCorrectAnswer
                                    ? "bg-green-500/10 border-green-500/20"
                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                                } disabled:cursor-not-allowed`}
                                disabled={showAnswers}
                              >
                                <span className={`text-xs font-bold px-2 py-1 rounded flex-shrink-0 ${
                                  isSelected
                                    ? isCorrectAnswer ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                    : showAnswers && isCorrectAnswer
                                    ? "bg-green-500/30 text-green-300"
                                    : "bg-white/10 text-gray-400"
                                }`}>
                                  {option.id.toUpperCase()}
                                </span>
                                <span className="text-xs text-gray-300">{option.text}</span>
                              </button>
                            );
                          })}

                          {/* Explanation */}
                          {(showAnswers || isAnswered) && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10"
                            >
                              <p className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold mb-1">
                                💡 Explanation
                              </p>
                              <p className="text-xs text-gray-300 leading-relaxed">
                                {question.explanation}
                              </p>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* Submit Button */}
            <button
              onClick={handleFinishQuiz}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-sm font-semibold text-white hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              {showAnswers ? (
                <><Eye className="w-4 h-4" /> Hide Answers</>
              ) : (
                <><CheckCircle className="w-4 h-4" /> Show Answers & Explanations</>
              )}
            </button>
          </motion.div>
        )}

        {viewMode === "report" && (
          <motion.div
            key="report"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Performance Card */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-sm font-semibold text-gray-200">Performance Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <p className="text-2xl font-bold text-green-400">{percentage}%</p>
                  <p className="text-xs text-green-400 mt-1">Score</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <p className="text-2xl font-bold text-indigo-400">{correctAnswers}/{result.totalQuestions}</p>
                  <p className="text-xs text-indigo-400 mt-1">Correct</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-2xl font-bold text-yellow-400">{result.estimatedTime}m</p>
                  <p className="text-xs text-yellow-400 mt-1">Est. Time</p>
                </div>
              </div>

              {/* Difficulty Distribution */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Difficulty Distribution</p>
                <div className="space-y-2">
                  {["easy", "medium", "hard"].map((diff) => {
                    const count = result.questions.filter((q) => q.difficulty === diff).length;
                    const pct = (count / result.totalQuestions) * 100;
                    return (
                      <div key={diff} className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 w-8 capitalize">{diff}</span>
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              diff === "easy" ? "bg-green-500" :
                              diff === "medium" ? "bg-yellow-500" :
                              "bg-red-500"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 w-8 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-sm font-semibold text-gray-200 mb-3">Recommendations</h3>
              <ul className="space-y-2">
                {percentage >= 80 ? (
                  <>
                    <li className="flex items-start gap-2.5 text-xs">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400">Excellent performance! You've mastered this topic well.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs">
                      <Zap className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400">Try harder difficulty MCQs to challenge yourself further.</span>
                    </li>
                  </>
                ) : percentage >= 60 ? (
                  <>
                    <li className="flex items-start gap-2.5 text-xs">
                      <CheckCircle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400">Good job! Review the questions you missed to improve.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400">Focus on the explanations to understand difficult concepts.</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-2.5 text-xs">
                      <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400">Study the material more carefully and try again.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs">
                      <Zap className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400">Start with easier MCQs to build your confidence.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Action Bar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 flex-1">
          <Share2 className="w-4 h-4 text-indigo-400" />
          <p className="text-sm text-gray-400">
            Share your result with classmates
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
          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-gray-400 transition">
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 text-xs text-indigo-400 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New MCQs
          </button>
        </div>
      </div>
    </motion.div>
  );
}
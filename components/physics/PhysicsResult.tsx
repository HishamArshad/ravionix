"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Copy,
  CheckCheck,
  Download,
  BookOpen,
  Lightbulb,
  ChevronDown,
  Calculator,
  Sparkles,
  Loader2,
  FileText,
  Target,
  List,
} from "lucide-react";
import type { PhysicsSolution, SolutionStep, Formula } from "./PhysicsSolver";

interface Topic {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

interface PhysicsResultProps {
  solution: PhysicsSolution | null;
  isLoading: boolean;
  topic: Topic;
}

// ── Loading Steps ──────────────────────────────────────
const LOADING_STEPS = [
  "Parsing problem statement...",
  "Identifying relevant equations...",
  "Applying physics principles...",
  "Computing step-by-step...",
  "Verifying solution...",
  "Formatting answer...",
];

// ── Step Card ──────────────────────────────────────────
function StepCard({ step, index }: { step: SolutionStep; index: number }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-xl bg-white/5 border border-white/10 overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition text-left"
      >
        <div className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-green-400">{step.number}</span>
        </div>
        <span className="text-sm font-medium text-gray-200 flex-1">{step.title}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition ${expanded ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 ml-10">
              <p className="text-xs text-gray-400 leading-relaxed">{step.content}</p>

              {step.formula && (
                <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/20">
                  <p className="text-[10px] text-green-500 uppercase tracking-wider mb-1">
                    Formula
                  </p>
                  <p className="text-sm font-mono font-bold text-green-300">
                    {step.formula}
                  </p>
                </div>
              )}

              {step.substitution && (
                <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                  <p className="text-[10px] text-blue-400 uppercase tracking-wider mb-1">
                    Substitution
                  </p>
                  <p className="text-sm font-mono text-blue-300">{step.substitution}</p>
                </div>
              )}

              {step.result && (
                <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20">
                  <p className="text-[10px] text-purple-400 uppercase tracking-wider mb-1">
                    Result
                  </p>
                  <p className="text-sm font-mono font-semibold text-purple-300">
                    {step.result}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Formula Card ───────────────────────────────────────
function FormulaCard({ formula, index }: { formula: Formula; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2"
    >
      <p className="text-xs font-semibold text-gray-300">{formula.name}</p>
      <div className="px-4 py-2 rounded-lg bg-[#0d0d14] border border-white/10 text-center">
        <span className="text-base font-mono font-bold text-green-300">
          {formula.expression}
        </span>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{formula.description}</p>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────
export default function PhysicsResult({
  solution,
  isLoading,
  topic,
}: PhysicsResultProps) {
  const [activeTab, setActiveTab] = useState<"steps" | "formulas" | "tips">("steps");
  const [copied, setCopied] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Cycle loading steps
  if (isLoading && loadingStep < LOADING_STEPS.length - 1) {
    setTimeout(() => setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1)), 450);
  }
  if (!isLoading) {
    if (loadingStep !== 0) setLoadingStep(0);
  }

  const handleCopy = useCallback(async () => {
    if (!solution) return;
    const text = [
      `Problem: ${solution.problem}`,
      `Answer: ${solution.answer} ${solution.unit}`,
      "",
      "Steps:",
      ...solution.steps.map(
        (s) => `${s.number}. ${s.title}\n   ${s.content}${s.formula ? `\n   Formula: ${s.formula}` : ""}${s.result ? `\n   Result: ${s.result}` : ""}`
      ),
      "",
      "Formulas Used:",
      ...solution.formulasUsed.map((f) => `• ${f.name}: ${f.expression}`),
    ].join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [solution]);

  const handleDownload = useCallback(() => {
    if (!solution) return;
    const text = [
      "PHYSICS SOLUTION",
      "================",
      `Problem: ${solution.problem}`,
      `Topic: ${solution.topic}`,
      `Difficulty: ${solution.difficulty}`,
      "",
      `ANSWER: ${solution.answer} ${solution.unit}`,
      "",
      "STEP-BY-STEP SOLUTION",
      "=====================",
      ...solution.steps.map(
        (s) => `\nStep ${s.number}: ${s.title}\n${s.content}${s.formula ? `\nFormula: ${s.formula}` : ""}${s.substitution ? `\nSubstitution: ${s.substitution}` : ""}${s.result ? `\nResult: ${s.result}` : ""}`
      ),
      "",
      "FORMULAS USED",
      "=============",
      ...solution.formulasUsed.map((f) => `${f.name}: ${f.expression}\n${f.description}`),
      "",
      "TIPS",
      "====",
      ...solution.tips.map((t) => `• ${t}`),
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `physics-solution-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [solution]);

  return (
    <div className="h-full flex flex-col gap-4">
      {/* ── Answer Card ── */}
      <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
          <topic.icon className={`w-4 h-4 ${topic.color}`} />
          <span className="text-sm font-medium text-gray-300">Solution</span>
          {solution && (
            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full border ${topic.bg} ${topic.color}`}>
              {topic.label}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {/* Loading */}
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-4 py-10 px-6"
              >
                <div className="relative w-14 h-14">
                  <div className="absolute inset-0 rounded-full border-2 border-green-500/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-green-500 animate-spin" />
                  <div
                    className="absolute inset-2 rounded-full border-2 border-transparent border-t-emerald-400 animate-spin"
                    style={{ animationDirection: "reverse", animationDuration: "0.7s" }}
                  />
                  <Calculator className="absolute inset-0 m-auto w-5 h-5 text-green-400" />
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingStep}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-gray-400 text-center"
                  >
                    {LOADING_STEPS[loadingStep]}
                  </motion.p>
                </AnimatePresence>
                {/* Shimmer blocks */}
                <div className="w-full space-y-2 mt-1">
                  {[100, 80, 90, 70, 60].map((w, i) => (
                    <div
                      key={i}
                      className="h-2 bg-white/5 rounded-full overflow-hidden"
                      style={{ width: `${w}%` }}
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-transparent via-green-500/20 to-transparent"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Empty */}
            {!isLoading && !solution && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center gap-3 py-10 px-6 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                  <Calculator className="w-7 h-7 text-gray-600" />
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  Solution appears here
                </p>
                <p className="text-xs text-gray-600">
                  Enter your problem and click Solve
                </p>
              </motion.div>
            )}

            {/* Solution */}
            {!isLoading && solution && (
              <motion.div
                key="solution"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 space-y-4"
              >
                {/* Final Answer Banner */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">
                      Final Answer
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {solution.answer}
                    <span className="text-lg text-gray-400 ml-2">{solution.unit}</span>
                  </p>
                </div>

                {/* Quick Meta */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-white/5 text-center">
                    <p className="text-xs text-gray-500">Steps</p>
                    <p className="text-lg font-bold text-purple-400">
                      {solution.steps.length}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 text-center">
                    <p className="text-xs text-gray-500">Formulas</p>
                    <p className="text-lg font-bold text-blue-400">
                      {solution.formulasUsed.length}
                    </p>
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {solution.difficulty_explanation}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        {solution && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 px-5 py-4 border-t border-white/5"
          >
            <button
              onClick={handleCopy}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-medium transition ${
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
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-gray-400 transition"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          </motion.div>
        )}
      </div>

      {/* ── Detailed Solution Tabs ── */}
      {solution && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex flex-col"
        >
          {/* Tabs */}
          <div className="flex border-b border-white/5">
            {[
              { key: "steps" as const, label: "Steps", icon: List, count: solution.steps.length },
              { key: "formulas" as const, label: "Formulas", icon: BookOpen, count: solution.formulasUsed.length },
              { key: "tips" as const, label: "Tips", icon: Lightbulb, count: solution.tips.length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition ${
                  activeTab === tab.key ? "text-white" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key
                    ? "bg-green-500/20 text-green-400"
                    : "bg-white/5 text-gray-600"
                }`}>
                  {tab.count}
                </span>
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="physicsTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === "steps" && (
                <motion.div
                  key="steps"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {solution.steps.map((step, i) => (
                    <StepCard key={i} step={step} index={i} />
                  ))}
                </motion.div>
              )}

              {activeTab === "formulas" && (
                <motion.div
                  key="formulas"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {solution.formulasUsed.map((f, i) => (
                    <FormulaCard key={i} formula={f} index={i} />
                  ))}

                  {/* Related Concepts */}
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" />
                      Related Concepts
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {solution.relatedConcepts.map((concept, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "tips" && (
                <motion.div
                  key="tips"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {solution.tips.map((tip, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10"
                    >
                      <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-300 leading-relaxed">{tip}</p>
                    </motion.div>
                  ))}

                  {/* Study More */}
                  <div className="mt-4 p-4 rounded-xl bg-green-500/5 border border-green-500/10 text-center">
                    <Sparkles className="w-5 h-5 text-green-400 mx-auto mb-2" />
                    <p className="text-xs font-medium text-gray-300 mb-1">
                      Want a full assignment on this?
                    </p>
                    <p className="text-[10px] text-gray-500 mb-3">
                      Use the Assignment Generator to create a complete report
                    </p>
                    <a
                      href="/dashboard/assignment"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500/20 border border-green-500/30 text-xs text-green-400 hover:bg-green-500/30 transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Open Assignment Generator
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}
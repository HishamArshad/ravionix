"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Sparkles,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
  Keyboard,
  RotateCcw,
  Lightbulb,
  BookOpen,
  Atom,
  Zap,
  Thermometer,
  Radio,
  Eye,
  Magnet,
  Sun,
  Box,
} from "lucide-react";
import PhysicsResult from "./PhysicsResult";

// ── Types ──────────────────────────────────────────────
type InputMode = "text" | "equation";
type DifficultyLevel = "basic" | "intermediate" | "advanced";

interface Topic {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  subtopics: string[];
}

interface SolverForm {
  problem: string;
  topic: string;
  subtopic: string;
  difficulty: DifficultyLevel;
  showSteps: boolean;
  showDiagram: boolean;
  showFormulas: boolean;
  units: "si" | "cgs" | "imperial";
}

export interface PhysicsSolution {
  problem: string;
  topic: string;
  difficulty: DifficultyLevel;
  answer: string;
  unit: string;
  steps: SolutionStep[];
  formulasUsed: Formula[];
  relatedConcepts: string[];
  difficulty_explanation: string;
  tips: string[];
}

export interface SolutionStep {
  number: number;
  title: string;
  content: string;
  formula?: string;
  substitution?: string;
  result?: string;
}

export interface Formula {
  name: string;
  expression: string;
  description: string;
}

// ── Physics Topics ─────────────────────────────────────
const TOPICS: Topic[] = [
  {
    id: "mechanics",
    label: "Mechanics",
    icon: Box,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/30",
    subtopics: [
      "Kinematics",
      "Newton's Laws",
      "Work & Energy",
      "Momentum",
      "Circular Motion",
      "Gravitation",
      "Rotational Motion",
    ],
  },
  {
    id: "thermodynamics",
    label: "Thermodynamics",
    icon: Thermometer,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/30",
    subtopics: [
      "Temperature & Heat",
      "Laws of Thermodynamics",
      "Kinetic Theory",
      "Entropy",
      "Heat Engines",
      "Thermal Expansion",
    ],
  },
  {
    id: "waves",
    label: "Waves & Sound",
    icon: Radio,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/30",
    subtopics: [
      "Wave Properties",
      "Sound Waves",
      "Doppler Effect",
      "Standing Waves",
      "Interference",
      "Resonance",
    ],
  },
  {
    id: "optics",
    label: "Optics",
    icon: Eye,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/30",
    subtopics: [
      "Reflection",
      "Refraction",
      "Lenses",
      "Mirrors",
      "Diffraction",
      "Polarization",
      "Interference of Light",
    ],
  },
  {
    id: "electricity",
    label: "Electricity",
    icon: Zap,
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/30",
    subtopics: [
      "Coulomb's Law",
      "Electric Field",
      "Electric Potential",
      "Capacitance",
      "Current & Resistance",
      "Circuits (Ohm's Law)",
      "Kirchhoff's Laws",
    ],
  },
  {
    id: "magnetism",
    label: "Magnetism",
    icon: Magnet,
    color: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/30",
    subtopics: [
      "Magnetic Field",
      "Magnetic Force",
      "Faraday's Law",
      "Inductance",
      "Electromagnetic Waves",
      "Maxwell's Equations",
    ],
  },
  {
    id: "modern",
    label: "Modern Physics",
    icon: Atom,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/30",
    subtopics: [
      "Photoelectric Effect",
      "Bohr Model",
      "Quantum Numbers",
      "Radioactivity",
      "Nuclear Reactions",
      "Special Relativity",
    ],
  },
  {
    id: "quantum",
    label: "Quantum Mechanics",
    icon: Sun,
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/30",
    subtopics: [
      "Wave Function",
      "Heisenberg Uncertainty",
      "Schrödinger Equation",
      "Quantum Numbers",
      "Spin",
      "Tunneling",
    ],
  },
];

// ── Difficulty Options ─────────────────────────────────
const DIFFICULTY_OPTIONS: {
  value: DifficultyLevel;
  label: string;
  desc: string;
  color: string;
}[] = [
  { value: "basic", label: "Basic", desc: "High school level", color: "text-green-400" },
  { value: "intermediate", label: "Intermediate", desc: "BS undergraduate", color: "text-yellow-400" },
  { value: "advanced", label: "Advanced", desc: "MS / Research level", color: "text-red-400" },
];

// ── Example Problems ───────────────────────────────────
const EXAMPLE_PROBLEMS = [
  {
    topic: "mechanics",
    subtopic: "Kinematics",
    problem: "A car accelerates from rest at 3 m/s² for 5 seconds. Find the final velocity and distance covered.",
    difficulty: "basic" as DifficultyLevel,
  },
  {
    topic: "electricity",
    subtopic: "Circuits (Ohm's Law)",
    problem: "Three resistors of 4Ω, 6Ω, and 12Ω are connected in parallel across a 12V battery. Find the equivalent resistance and total current.",
    difficulty: "intermediate" as DifficultyLevel,
  },
  {
    topic: "waves",
    subtopic: "Doppler Effect",
    problem: "A train whistle has a frequency of 500 Hz. If the train moves toward you at 30 m/s and the speed of sound is 340 m/s, what frequency do you hear?",
    difficulty: "intermediate" as DifficultyLevel,
  },
  {
    topic: "thermodynamics",
    subtopic: "Laws of Thermodynamics",
    problem: "1 mole of an ideal gas expands isothermally at 300K from 2L to 4L. Calculate the work done by the gas.",
    difficulty: "intermediate" as DifficultyLevel,
  },
  {
    topic: "modern",
    subtopic: "Photoelectric Effect",
    problem: "Light of wavelength 400nm falls on a metal surface with work function 2.0 eV. Find the maximum kinetic energy of emitted electrons.",
    difficulty: "intermediate" as DifficultyLevel,
  },
];

// ── Default Form ───────────────────────────────────────
const DEFAULT_FORM: SolverForm = {
  problem: "",
  topic: "mechanics",
  subtopic: "Kinematics",
  difficulty: "intermediate",
  showSteps: true,
  showDiagram: false,
  showFormulas: true,
  units: "si",
};

// ── Simulated Solution ─────────────────────────────────
function simulateSolution(form: SolverForm): PhysicsSolution {
  return {
    problem: form.problem,
    topic: form.topic,
    difficulty: form.difficulty,
    answer: "15 m/s",
    unit: "m/s",
    steps: [
      {
        number: 1,
        title: "Identify Given Information",
        content: "List all the values provided in the problem and what we need to find.",
        formula: undefined,
        substitution: "Initial velocity (u) = 0 m/s, Acceleration (a) = 3 m/s², Time (t) = 5 s",
        result: "Known: u = 0, a = 3 m/s², t = 5 s | Find: v, s",
      },
      {
        number: 2,
        title: "Select the Appropriate Kinematic Equation",
        content: "For finding final velocity when initial velocity, acceleration, and time are known, use the first kinematic equation.",
        formula: "v = u + at",
        substitution: "v = 0 + (3)(5)",
        result: "v = 15 m/s",
      },
      {
        number: 3,
        title: "Calculate Distance Using Second Equation",
        content: "Now find the distance using the second kinematic equation of motion.",
        formula: "s = ut + ½at²",
        substitution: "s = (0)(5) + ½(3)(5)²",
        result: "s = 0 + ½(3)(25) = 37.5 m",
      },
      {
        number: 4,
        title: "Verify Using Third Equation",
        content: "Cross-check the answer using v² = u² + 2as.",
        formula: "v² = u² + 2as",
        substitution: "v² = 0 + 2(3)(37.5) = 225",
        result: "v = √225 = 15 m/s ✓",
      },
    ],
    formulasUsed: [
      {
        name: "First Equation of Motion",
        expression: "v = u + at",
        description: "Relates final velocity to initial velocity, acceleration, and time",
      },
      {
        name: "Second Equation of Motion",
        expression: "s = ut + ½at²",
        description: "Gives displacement in terms of initial velocity, time, and acceleration",
      },
      {
        name: "Third Equation of Motion",
        expression: "v² = u² + 2as",
        description: "Velocity-displacement relation independent of time",
      },
    ],
    relatedConcepts: [
      "Uniform Acceleration",
      "Newton's Second Law",
      "Velocity-Time Graphs",
      "Distance-Time Graphs",
    ],
    difficulty_explanation:
      "This is a basic kinematics problem involving uniform acceleration. The key is selecting the correct equation of motion based on the given and required quantities.",
    tips: [
      "Always list known and unknown variables first",
      "Draw a velocity-time graph to visualize the motion",
      "Check units — SI units are standard (m, s, m/s)",
      "Verify your answer by substituting back into another equation",
    ],
  };
}

// ── Main Component ─────────────────────────────────────
export default function PhysicsSolver() {
  const [form, setForm] = useState<SolverForm>(DEFAULT_FORM);
  const [inputMode] = useState<InputMode>("text");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [solution, setSolution] = useState<PhysicsSolution | null>(null);
  const [showExamples, setShowExamples] = useState(false);

  const selectedTopic = TOPICS.find((t) => t.id === form.topic)!;

  const update = useCallback(
    <K extends keyof SolverForm>(key: K, value: SolverForm[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleExampleClick = useCallback((ex: typeof EXAMPLE_PROBLEMS[0]) => {
    setForm((prev) => ({
      ...prev,
      problem: ex.problem,
      topic: ex.topic,
      subtopic: ex.subtopic,
      difficulty: ex.difficulty,
    }));
    setShowExamples(false);
    setSolution(null);
  }, []);

  const handleSolve = useCallback(async () => {
    if (!form.problem.trim()) return;
    setIsLoading(true);
    setError("");
    setSolution(null);

    try {
      // ── API CALL PLACEHOLDER ────────────────────────
      // const response = await fetch("http://localhost:8000/api/physics/solve/", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({
      //     problem: form.problem,
      //     topic: form.topic,
      //     subtopic: form.subtopic,
      //     difficulty: form.difficulty,
      //     show_steps: form.showSteps,
      //     show_formulas: form.showFormulas,
      //     units: form.units,
      //   }),
      // });
      // const data = await response.json();
      // setSolution(data);
      // ───────────────────────────────────────────────

      await new Promise((r) => setTimeout(r, 2500));
      setSolution(simulateSolution(form));
    } catch {
      setError("Failed to solve the problem. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  const handleReset = useCallback(() => {
    setForm(DEFAULT_FORM);
    setSolution(null);
    setError("");
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-5 gap-4">
        {/* ── Left Panel: Input (3 cols) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">
                Problem Input
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowExamples(!showExamples)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-gray-400 transition"
              >
                <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                Examples
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-gray-400 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Example Problems Dropdown */}
            <AnimatePresence>
              {showExamples && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 pb-2">
                    <p className="text-xs text-gray-500 font-medium">
                      Click to load an example:
                    </p>
                    {EXAMPLE_PROBLEMS.map((ex, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => handleExampleClick(ex)}
                        className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-green-500/10 hover:border-green-500/30 transition group"
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex flex-col gap-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                {ex.subtopic}
                              </span>
                              <span className={`text-xs ${
                                ex.difficulty === "basic"
                                  ? "text-green-400"
                                  : ex.difficulty === "intermediate"
                                  ? "text-yellow-400"
                                  : "text-red-400"
                              }`}>
                                {ex.difficulty}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 group-hover:text-gray-200 transition line-clamp-2">
                              {ex.problem}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-green-400 transition flex-shrink-0 mt-1" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Topic Selector */}
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                Physics Topic
              </label>
              <div className="grid grid-cols-4 gap-2">
                {TOPICS.map((topic) => {
                  const isActive = form.topic === topic.id;
                  return (
                    <motion.button
                      key={topic.id}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        update("topic", topic.id);
                        update("subtopic", topic.subtopics[0]);
                        setSolution(null);
                      }}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition ${
                        isActive
                          ? topic.bg
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <topic.icon className={`w-4 h-4 ${isActive ? topic.color : "text-gray-500"}`} />
                      <span className={`text-[10px] font-medium leading-tight text-center ${
                        isActive ? topic.color : "text-gray-500"
                      }`}>
                        {topic.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Subtopic Selector */}
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                Subtopic
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedTopic.subtopics.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => update("subtopic", sub)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      form.subtopic === sub
                        ? `${selectedTopic.bg} ${selectedTopic.color}`
                        : "bg-white/5 border border-white/10 text-gray-500 hover:bg-white/10"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Problem Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-500">
                  Problem Statement <span className="text-red-400">*</span>
                </label>
                <span className="text-xs text-gray-600">
                  {form.problem.length} chars
                </span>
              </div>
              <div className="relative">
                <textarea
                  value={form.problem}
                  onChange={(e) => update("problem", e.target.value)}
                  placeholder={`Describe your ${selectedTopic.label} problem here...\n\nInclude all given values and what you need to find.\nExample: "A ball is thrown upward with initial velocity 20 m/s. Find max height."`}
                  rows={5}
                  className="w-full px-5 py-4 rounded-xl bg-[#0d0d14] border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-green-500/50 transition resize-none leading-relaxed"
                />
                {form.problem && (
                  <button
                    onClick={() => { update("problem", ""); setSolution(null); }}
                    className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Difficulty + Units Row */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Difficulty */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  Difficulty Level
                </label>
                <div className="space-y-2">
                  {DIFFICULTY_OPTIONS.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => update("difficulty", d.value)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition ${
                        form.difficulty === d.value
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        d.value === "basic"
                          ? "bg-green-500"
                          : d.value === "intermediate"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`} />
                      <div className="text-left">
                        <p className={`text-xs font-medium ${
                          form.difficulty === d.value
                            ? d.color
                            : "text-gray-300"
                        }`}>
                          {d.label}
                        </p>
                        <p className="text-[10px] text-gray-500">{d.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  Solution Options
                </label>
                <div className="space-y-2">
                  {[
                    { key: "showSteps" as const, label: "Show step-by-step", desc: "Detailed working" },
                    { key: "showFormulas" as const, label: "Show formulas", desc: "List equations used" },
                    { key: "showDiagram" as const, label: "Show diagram hint", desc: "Visual representation" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => update(opt.key, !form[opt.key])}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition ${
                        form[opt.key]
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${
                        form[opt.key]
                          ? "bg-green-500"
                          : "bg-white/10 border border-white/20"
                      }`}>
                        {form[opt.key] && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-medium text-gray-300">{opt.label}</p>
                        <p className="text-[10px] text-gray-500">{opt.desc}</p>
                      </div>
                    </button>
                  ))}

                  {/* Unit System */}
                  <div className="flex gap-2 pt-1">
                    {(["si", "cgs", "imperial"] as const).map((unit) => (
                      <button
                        key={unit}
                        onClick={() => update("units", unit)}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium transition uppercase ${
                          form.units === unit
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-white/5 text-gray-500 hover:bg-white/10"
                        }`}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Solve Button */}
            <button
              onClick={handleSolve}
              disabled={!form.problem.trim() || isLoading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Solving...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Solve Problem
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* ── Right Panel: Result (2 cols) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2"
        >
          <PhysicsResult
            solution={solution}
            isLoading={isLoading}
            topic={selectedTopic}
          />
        </motion.div>
      </div>
    </div>
  );
}
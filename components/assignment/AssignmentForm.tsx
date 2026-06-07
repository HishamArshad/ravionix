"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Sparkles,
  Loader2,
  ChevronDown,
  Plus,
  X,
  Info,
  Sliders,
  AlertCircle,
} from "lucide-react";
import AssignmentOutput from "./AssignmentOutput";
import { authService } from "../api/authService";
import { assignmentHistory } from "../store/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────
type AcademicLevel = "high_school" | "undergraduate" | "graduate" | "phd";
type AssignmentType =
  | "essay"
  | "report"
  | "research_paper"
  | "case_study"
  | "lab_report"
  | "literature_review";
type Language = "english" | "urdu";
type CitationStyle = "apa" | "mla" | "chicago" | "harvard" | "none";
type ToneType = "formal" | "semi_formal" | "analytical" | "descriptive";

interface FormData {
  topic: string;
  subject: string;
  assignmentType: AssignmentType;
  academicLevel: AcademicLevel;
  wordCount: number;
  tone: ToneType;
  citationStyle: CitationStyle;
  language: Language;
  additionalInstructions: string;
  keywords: string[];
  includeAbstract: boolean;
  includeTableOfContents: boolean;
  includeReferences: boolean;
}

interface GeneratedAssignment {
  title: string;
  content: string;
  wordCount: number;
  sections: string[];
  references?: string[];
}

// ── Options ────────────────────────────────────────────────────────
const ASSIGNMENT_TYPES: { value: AssignmentType; label: string }[] = [

  { value: "report", label: "Standard" },
  { value: "essay", label: "Essay" },
  { value: "research_paper", label: "Research Paper" },
  { value: "case_study", label: "Case Study" },
  { value: "lab_report", label: "Lab Report" },
  { value: "literature_review", label: "Literature Review" },
];

const ACADEMIC_LEVELS: { value: AcademicLevel; label: string }[] = [
  { value: "high_school", label: "High School" },
  { value: "undergraduate", label: "Undergraduate (BS)" },
  { value: "graduate", label: "Graduate (MS)" },
  { value: "phd", label: "PhD" },
];

const TONES: { value: ToneType; label: string; desc: string }[] = [
  { value: "formal", label: "Formal", desc: "Professional academic writing" },
  { value: "semi_formal", label: "Semi-Formal", desc: "Balanced and clear" },
  { value: "analytical", label: "Analytical", desc: "Critical and evaluative" },
  { value: "descriptive", label: "Descriptive", desc: "Detailed and explanatory" },
];

const CITATION_STYLES: { value: CitationStyle; label: string }[] = [
  { value: "none", label: "No Citations" },
  { value: "apa", label: "APA 7th Edition" },
  { value: "mla", label: "MLA 9th Edition" },
  { value: "chicago", label: "Chicago Style" },
  { value: "harvard", label: "Harvard Style" },
];

const WORD_COUNT_OPTIONS = [500, 750, 1000, 1500, 2000, 3000];

const DEFAULT_FORM: FormData = {
  topic: "",
  subject: "",
  assignmentType: "report",
  academicLevel: "undergraduate",
  wordCount: 1000,
  tone: "formal",
  citationStyle: "apa",
  language: "english",
  additionalInstructions: "",
  keywords: [],
  includeAbstract: false,
  includeTableOfContents: false,
  includeReferences: true,
};

// ── Sub-components ─────────────────────────────────────────────────
function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  icon,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  icon?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-left"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm text-gray-200">{selected?.label}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition flex-shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full mt-1 left-0 right-0 z-50 bg-[#13131f] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-sm text-left transition ${
                  value === opt.value
                    ? "bg-purple-500/20 text-purple-300"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
import { humanizerDraft } from "../store/auth"; 

// ── Main Component ─────────────────────────────────────────────────
export default function AssignmentForm() {
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [keywordInput, setKeywordInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [generatedAssignment, setGeneratedAssignment] =
    useState<GeneratedAssignment | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
const [mounted, setMounted] = useState(false);


const router = useRouter();

const handleSendToHumanizer = (text: string) => {
  humanizerDraft.text.set(text);
  router.push("/dashboard/humanizer");
};
  // ── Field updater ──────────────────────────────────────────────
  const update = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // ── Keywords ──────────────────────────────────────────────────
  const addKeyword = useCallback(() => {
    const kw = keywordInput.trim();
    if (kw && !form.keywords.includes(kw) && form.keywords.length < 8) {
      update("keywords", [...form.keywords, kw]);
      setKeywordInput("");
    }
  }, [keywordInput, form.keywords, update]);

  const removeKeyword = useCallback(
    (kw: string) => {
      update(
        "keywords",
        form.keywords.filter((k) => k !== kw)
      );
    },
    [form.keywords, update]
  );

  // ── Generate ──────────────────────────────────────────────────
  const handleGenerate = useCallback(async () => {
    if (!form.topic.trim() || !form.subject.trim()) return;
    setIsGenerating(true);
    setError("");
    setGeneratedAssignment(null);
    setActiveTab("preview");

    try {
      const assignment = await authService.assignmentGen(form)
         
      console.log(assignment)
      // ── API CALL PLACEHOLDER ──────────────────────────────────
      // const response = await fetch("http://localhost:8000/api/assignment/generate/", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(form),
      // });
      // const data = await response.json();
const historyFormatted = {
  ...assignment,
  word_count: assignment.wordCount,
  assignment_type: form.assignmentType,
  subject: form.subject,
  created_at: new Date().toISOString(),
};

assignmentHistory.set((prev: any[]) => [
  historyFormatted,
  ...prev,
]);

setGeneratedAssignment(assignment);
      // ─────────────────────────────────────
      // ────────────────────

      // Simulated response
      // await new Promise((r) => setTimeout(r, 3000));
      // setGeneratedAssignment({
      //   title: `${form.assignmentType.replace("_", " ").toUpperCase()}: ${form.topic}`,
      //   wordCount: form.wordCount,
      //   sections: [
      //     "Abstract",
      //     "Introduction",
      //     "Literature Review",
      //     "Methodology",
      //     "Discussion",
      //     "Conclusion",
      //     "References",
      //   ],
      //   content: `# ${form.topic}\n\n## Introduction\n\nThis ${form.assignmentType.replace("_", " ")} explores the topic of ${form.topic} within the context of ${form.subject}. The following analysis presents a comprehensive examination of the subject matter, drawing from relevant academic literature and empirical evidence.\n\n## Main Body\n\nThe study of ${form.topic} has gained significant attention in recent years. Scholars and researchers have approached this subject from multiple perspectives, contributing to a rich body of knowledge that informs our current understanding.\n\nFurthermore, the implications of ${form.topic} extend beyond theoretical frameworks, offering practical insights that can be applied in real-world contexts. This is particularly relevant in the field of ${form.subject}, where theoretical knowledge must be balanced with practical application.\n\n## Analysis\n\nUpon careful examination of the available evidence, several key themes emerge. First, the foundational concepts underlying ${form.topic} provide a necessary framework for deeper analysis. Second, the relationship between theory and practice becomes evident when examining case studies and empirical data.\n\n## Conclusion\n\nIn conclusion, this ${form.assignmentType.replace("_", " ")} has demonstrated the multifaceted nature of ${form.topic}. The analysis presented here contributes to the broader academic discourse surrounding ${form.subject}, while also highlighting areas for future research and investigation.\n\n## References\n\n1. Smith, J. (2023). *Understanding ${form.topic}*. Academic Press.\n2. Johnson, A., & Williams, B. (2022). A comprehensive review of ${form.subject}. *Journal of Academic Studies*, 45(2), 112-134.\n3. Brown, C. (2021). ${form.topic}: Theory and practice. *International Review*, 18(4), 78-95.`,
      //   references: [
      //     "Smith, J. (2023). Understanding the topic. Academic Press.",
      //     "Johnson, A., & Williams, B. (2022). A comprehensive review. Journal of Academic Studies, 45(2), 112-134.",
      //     "Brown, C. (2021). Theory and practice. International Review, 18(4), 78-95.",
      //   ],
      // });
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

    setActiveTab("form");
    return;
  }

  toast.error(message);

  setError(message);
}finally {
      setIsGenerating(false);
    }
  }, [form]);

  const isFormValid = form.topic.trim() !== "" && form.subject.trim() !== "";

  // ── Render ────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
    >
      {/* ── Tabs ── */}
      <div className="flex border-b border-white/5">
        {(["form", "preview"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-6 py-4 text-sm font-medium capitalize transition ${
              activeTab === tab ? "text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab === "form" ? "⚙️ Configure" : "📄 Output"}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
              />
            )}
          </button>
        ))}
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* ── FORM TAB ── */}
          {activeTab === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              {/* Topic + Subject */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Topic */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Assignment Topic <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.topic}
                    onChange={(e) => update("topic", e.target.value)}
                    placeholder="e.g. Climate Change and its Effects"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 focus:bg-white/10 transition"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Subject / Course <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => update("subject", e.target.value)}
                    placeholder="e.g. Environmental Science"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 focus:bg-white/10 transition"
                  />
                </div>
              </div>

              {/* Type + Level */}
              <div className="grid md:grid-cols-2 gap-4">
                <SelectField
                  label="Assignment Type"
                  value={form.assignmentType}
                  options={ASSIGNMENT_TYPES}
                  onChange={(v) => update("assignmentType", v)}
                />
                <SelectField
                  label="Academic Level"
                  value={form.academicLevel}
                  options={ACADEMIC_LEVELS}
                  onChange={(v) => update("academicLevel", v)}
                />
              </div>

              {/* Word Count */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs text-gray-500">Word Count</label>
                  <span className="text-sm font-semibold text-purple-400">
                    {form.wordCount.toLocaleString()} words
                  </span>
                </div>

                {/* Quick select buttons */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {WORD_COUNT_OPTIONS.map((wc) => (
                    <button
                      key={wc}
                      type="button"
                      onClick={() => update("wordCount", wc)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        form.wordCount === wc
                          ? "bg-purple-500/30 border border-purple-500/50 text-purple-300"
                          : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      {wc >= 1000 ? `${wc / 1000}k` : wc}
                    </button>
                  ))}
                </div>

                {/* Slider */}
                <div className="relative">
                  <input
                    type="range"
                    min={300}
                    max={5000}
                    step={100}
                    value={form.wordCount}
                    onChange={(e) => update("wordCount", Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-5
                      [&::-webkit-slider-thumb]:h-5
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-gradient-to-br
                      [&::-webkit-slider-thumb]:from-purple-500
                      [&::-webkit-slider-thumb]:to-blue-500
                      [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-webkit-slider-thumb]:shadow-lg"
                    style={{
                      background: `linear-gradient(to right, #a855f7 0%, #3b82f6 ${
                        ((form.wordCount - 300) / (5000 - 300)) * 100
                      }%, rgba(255,255,255,0.1) ${
                        ((form.wordCount - 300) / (5000 - 300)) * 100
                      }%, rgba(255,255,255,0.1) 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>300</span>
                    <span>5,000</span>
                  </div>
                </div>
              </div>

              {/* Tone Selector */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  Writing Tone
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {TONES.map((tone) => (
                    <button
                      key={tone.value}
                      type="button"
                      onClick={() => update("tone", tone.value)}
                      className={`p-3 rounded-xl border text-left transition ${
                        form.tone === tone.value
                          ? "bg-purple-500/20 border-purple-500/50"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <p
                        className={`text-sm font-medium ${
                          form.tone === tone.value
                            ? "text-purple-300"
                            : "text-gray-300"
                        }`}
                      >
                        {tone.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{tone.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Keywords{" "}
                  <span className="text-gray-600">(optional, max 8)</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                    placeholder="Add a keyword and press Enter"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 transition"
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    disabled={form.keywords.length >= 8}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-gray-400 disabled:opacity-40"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {form.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300"
                      >
                        {kw}
                        <button onClick={() => removeKeyword(kw)}>
                          <X className="w-3 h-3 hover:text-white transition" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Advanced Options Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition"
                >
                  <Sliders className="w-4 h-4" />
                  Advanced Options
                  <ChevronDown
                    className={`w-4 h-4 transition ${showAdvanced ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 space-y-4">
                        {/* Citation + Language */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <SelectField
                            label="Citation Style"
                            value={form.citationStyle}
                            options={CITATION_STYLES}
                            onChange={(v) => update("citationStyle", v)}
                          />
                          <SelectField
                            label="Language"
                            value={form.language}
                            options={[
                              { value: "english", label: "English" },
                              { value: "urdu", label: "Urdu" },
                            ]}
                            onChange={(v) => update("language", v)}
                          />
                        </div>

                        {/* Checkboxes */}
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            {
                              key: "includeAbstract" as const,
                              label: "Abstract",
                              desc: "200-word summary",
                            },
                            {
                              key: "includeTableOfContents" as const,
                              label: "Table of Contents",
                              desc: "Auto-generated",
                            },
                            {
                              key: "includeReferences" as const,
                              label: "References",
                              desc: "Bibliography section",
                            },
                          ].map((opt) => (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => update(opt.key, !form[opt.key])}
                              className={`p-3 rounded-xl border text-left transition ${
                                form[opt.key]
                                  ? "bg-blue-500/20 border-blue-500/50"
                                  : "bg-white/5 border-white/10 hover:bg-white/10"
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded mb-2 flex items-center justify-center ${
                                  form[opt.key]
                                    ? "bg-blue-500"
                                    : "bg-white/10 border border-white/20"
                                }`}
                              >
                                {form[opt.key] && (
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <p className="text-xs font-medium text-gray-300">
                                {opt.label}
                              </p>
                              <p className="text-[10px] text-gray-500">{opt.desc}</p>
                            </button>
                          ))}
                        </div>

                        {/* Additional Instructions */}
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5">
                            Additional Instructions{" "}
                            <span className="text-gray-600">(optional)</span>
                          </label>
                          <textarea
                            value={form.additionalInstructions}
                            onChange={(e) =>
                              update("additionalInstructions", e.target.value)
                            }
                            placeholder="e.g. Focus on Pakistani context, include recent statistics, avoid technical jargon..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 focus:bg-white/10 transition resize-none"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Info Note */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-500">
                  Free plan: 2 assignments/day. Results can be sent directly to
                  the{" "}
                  <span className="text-purple-400 font-medium">
                    AI Humanizer
                  </span>{" "}
                  to make them undetectable.
                </p>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!isFormValid || isGenerating}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Assignment...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Assignment
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* ── PREVIEW TAB ── */}
          {activeTab === "preview" && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <AssignmentOutput
                isGenerating={isGenerating}
                assignment={generatedAssignment}
                onRegenerrate={handleGenerate}
                onSendToHumanizer={handleSendToHumanizer}
                wordCount={form.wordCount}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
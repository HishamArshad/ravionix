"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Wand2,
  FileText,
  Shield,
  BookOpen,
  Calculator,
  FileSearch,
  Clock,
  Copy,
  Trash2,
  ChevronDown,
  CheckCheck,
  Eye,
  Download,
  X,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────
type ToolType = "humanizer" | "assignment" | "plagiarism" | "citation" | "physics" | "pdf";
type StatusType = "completed" | "failed" | "processing";

interface HistoryEntry {
  id: number;
  tool: ToolType;
  title: string;
  preview: string;
  status: StatusType;
  date: string;
  duration: string;
  wordCount?: number;
  score?: string;
}

// ── Mock Data ──────────────────────────────────────────
const MOCK_HISTORY: HistoryEntry[] = [
  { id: 1, tool: "humanizer", title: "Thermodynamics Essay Humanization", preview: "Artificial intelligence has fundamentally transformed...", status: "completed", date: "Today, 4:30 PM", duration: "3s", wordCount: 450 },
  { id: 2, tool: "assignment", title: "Climate Change Research Paper", preview: "Topic: Effects of Climate Change on Agriculture", status: "completed", date: "Today, 3:15 PM", duration: "8s", wordCount: 1500 },
  { id: 3, tool: "plagiarism", title: "Quantum Mechanics Essay Check", preview: "Similarity score: 12% — Excellent", status: "completed", date: "Today, 2:00 PM", duration: "15s", score: "12%" },
  { id: 4, tool: "citation", title: "APA Citation — Nature Journal", preview: "Khan, A. (2023). Climate impacts. Nature, 45(2)...", status: "completed", date: "Today, 1:30 PM", duration: "1s" },
  { id: 5, tool: "physics", title: "Kinematics Problem — Velocity", preview: "Final Answer: 15 m/s (4 steps)", status: "completed", date: "Today, 11:45 AM", duration: "2s", score: "15 m/s" },
  { id: 6, tool: "pdf", title: "ML in Healthcare — Summary", preview: "24 pages summarized, 7 key points extracted", status: "completed", date: "Today, 10:20 AM", duration: "22s", wordCount: 8400 },
  { id: 7, tool: "humanizer", title: "Social Media Research Text", preview: "The proliferation of social media platforms has...", status: "completed", date: "Yesterday, 6:00 PM", duration: "4s", wordCount: 620 },
  { id: 8, tool: "assignment", title: "Physics Lab Report — Optics", preview: "Topic: Refraction of Light through Glass", status: "failed", date: "Yesterday, 3:30 PM", duration: "—" },
  { id: 9, tool: "plagiarism", title: "Business Case Study Check", preview: "Similarity score: 34% — High Risk", status: "completed", date: "Yesterday, 2:00 PM", duration: "18s", score: "34%" },
  { id: 10, tool: "citation", title: "Harvard Citation — Book", preview: "Griffiths, D. (2023). Quantum Mechanics...", status: "completed", date: "Yesterday, 12:00 PM", duration: "1s" },
  { id: 11, tool: "physics", title: "Doppler Effect Calculation", preview: "Final Answer: 547 Hz (3 steps)", status: "completed", date: "2 days ago", duration: "2s", score: "547 Hz" },
  { id: 12, tool: "pdf", title: "Quantum Entanglement Paper", preview: "12 pages summarized, 4 key points extracted", status: "completed", date: "2 days ago", duration: "18s", wordCount: 4100 },
];

// ── Tool Config ────────────────────────────────────────
const TOOL_CONFIG: Record<ToolType, {
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}> = {
  humanizer: { label: "Humanizer", icon: Wand2, color: "text-pink-400", bg: "bg-pink-500/10" },
  assignment: { label: "Assignment", icon: FileText, color: "text-purple-400", bg: "bg-purple-500/10" },
  plagiarism: { label: "Plagiarism", icon: Shield, color: "text-orange-400", bg: "bg-orange-500/10" },
  citation: { label: "Citation", icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10" },
  physics: { label: "Physics", icon: Calculator, color: "text-green-400", bg: "bg-green-500/10" },
  pdf: { label: "PDF", icon: FileSearch, color: "text-red-400", bg: "bg-red-500/10" },
};

const STATUS_CONFIG: Record<StatusType, { label: string; color: string; bg: string }> = {
  completed: { label: "Completed", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  failed: { label: "Failed", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  processing: { label: "Processing", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
};

// ── Main Component ─────────────────────────────────────
export default function HistoryTable() {
  const [search, setSearch] = useState("");
  const [filterTool, setFilterTool] = useState<ToolType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<StatusType | "all">("all");
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 8;

  const filtered = useMemo(() => {
    return MOCK_HISTORY.filter((h) => {
      if (deletedIds.includes(h.id)) return false;
      if (filterTool !== "all" && h.tool !== filterTool) return false;
      if (filterStatus !== "all" && h.status !== filterStatus) return false;
      if (search && !h.title.toLowerCase().includes(search.toLowerCase()) &&
        !h.preview.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, filterTool, filterStatus, deletedIds]);

  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const handleCopy = async (entry: HistoryEntry) => {
    await navigator.clipboard.writeText(entry.preview);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
    >
      {/* ── Search + Filter Bar ── */}
      <div className="p-5 border-b border-white/5 space-y-3">
        <div className="flex gap-3">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
            <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search history..."
              className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none flex-1"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition ${
              showFilters || filterTool !== "all" || filterStatus !== "all"
                ? "bg-purple-500/20 border-purple-500/30 text-purple-400"
                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {(filterTool !== "all" || filterStatus !== "all") && (
              <span className="w-2 h-2 rounded-full bg-purple-400" />
            )}
          </button>
        </div>

        {/* Filter Row */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 pt-1">
                {/* Tool Filter */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-gray-500">Tool:</span>
                  {(["all", ...Object.keys(TOOL_CONFIG)] as const).map((tool) => (
                    <button
                      key={tool}
                      onClick={() => { setFilterTool(tool as any); setCurrentPage(1); }}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                        filterTool === tool
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                          : "bg-white/5 text-gray-500 hover:bg-white/10"
                      }`}
                    >
                      {tool === "all" ? "All" : TOOL_CONFIG[tool as ToolType].label}
                    </button>
                  ))}
                </div>
                {/* Status Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500">Status:</span>
                  {(["all", "completed", "failed"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => { setFilterStatus(s as any); setCurrentPage(1); }}
                      className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition ${
                        filterStatus === s
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                          : "bg-white/5 text-gray-500 hover:bg-white/10"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {/* Clear */}
                {(filterTool !== "all" || filterStatus !== "all") && (
                  <button
                    onClick={() => { setFilterTool("all"); setFilterStatus("all"); }}
                    className="px-3 py-1 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Table Header ── */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-xs text-gray-600 uppercase tracking-wider">
        <div className="col-span-1">Tool</div>
        <div className="col-span-4">Activity</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Details</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-1">Actions</div>
      </div>

      {/* ── Rows ── */}
      <div className="divide-y divide-white/5">
        {paginated.length === 0 ? (
          <div className="py-16 text-center">
            <History className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No activity found</p>
            {search && (
              <button onClick={() => setSearch("")} className="text-xs text-purple-400 mt-2 hover:underline">
                Clear search
              </button>
            )}
          </div>
        ) : (
          paginated.map((entry, i) => {
            const config = TOOL_CONFIG[entry.tool];
            const statusConfig = STATUS_CONFIG[entry.status];
            const isExpanded = expandedId === entry.id;
            const Icon = config.icon;

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-white/5 transition"
              >
                <div
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 items-center cursor-pointer group"
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                >
                  {/* Tool Icon */}
                  <div className="md:col-span-1">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${config.bg}`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                  </div>

                  {/* Activity */}
                  <div className="md:col-span-4">
                    <p className="text-sm font-medium text-gray-200 line-clamp-1">
                      {entry.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {entry.preview}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="md:col-span-2">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${statusConfig.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        entry.status === "completed" ? "bg-green-400" :
                        entry.status === "failed" ? "bg-red-400" : "bg-yellow-400 animate-pulse"
                      }`} />
                      <span className={statusConfig.color}>{statusConfig.label}</span>
                    </span>
                  </div>

                  {/* Details */}
                  <div className="md:col-span-2 space-y-0.5">
                    {entry.wordCount && (
                      <p className="text-xs text-gray-400">{entry.wordCount.toLocaleString()} words</p>
                    )}
                    {entry.score && (
                      <p className="text-xs text-green-400 font-medium">{entry.score}</p>
                    )}
                    <p className="text-xs text-gray-600">⏱ {entry.duration}</p>
                  </div>

                  {/* Date */}
                  <div className="md:col-span-2 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-gray-600" />
                    <span className="text-xs text-gray-500">{entry.date}</span>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCopy(entry); }}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition"
                    >
                      {copiedId === entry.id ? (
                        <CheckCheck className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-gray-500" />
                      )}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeletedIds((p) => [...p, entry.id]); }}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                </div>

                {/* Expanded Row */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4">
                        <div className="ml-0 md:ml-14 p-4 rounded-xl bg-[#0d0d14] border border-white/10 space-y-3">
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Preview</p>
                            <p className="text-xs text-gray-300 leading-relaxed">{entry.preview}</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-gray-400 transition">
                              <Eye className="w-3.5 h-3.5" />
                              View Full
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-gray-400 transition">
                              <Download className="w-3.5 h-3.5" />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
          <p className="text-xs text-gray-500">
            Showing {(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:bg-white/10 disabled:opacity-40 transition"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition ${
                  currentPage === p
                    ? "bg-purple-500/30 text-purple-300 border border-purple-500/30"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:bg-white/10 disabled:opacity-40 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
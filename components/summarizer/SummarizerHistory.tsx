"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Brain,
  Trash2,
  Eye,
  Copy,
  Download,
  Clock,
  ChevronDown,
  CheckCheck,
  FileText,
  BarChart3,
} from "lucide-react";
import { useEffect } from "react";
import { authService } from "../api/authService";
import { summarizerHistory } from "../store/auth";
import { observer } from "@legendapp/state/react";

interface HistoryItem {
  id: number;
  title: string;
  preview: string;
  originalWords: number;
  summaryWords: number;
  format: "paragraph" | "bullets" | "structured" | "notes";
  savedTime: number; // minutes
  date: string;
}

const mockHistory: HistoryItem[] = [
  {
    id: 1,
    title: "Climate Change Essay",
    preview: "This text discusses the impact of global warming on ecosystems...",
    originalWords: 1200,
    summaryWords: 300,
    format: "bullets",
    savedTime: 3,
    date: "Today, 4:30 PM",
  },
  {
    id: 2,
    title: "Quantum Physics Article",
    preview: "Quantum mechanics forms the foundation of modern physics...",
    originalWords: 850,
    summaryWords: 170,
    format: "paragraph",
    savedTime: 2,
    date: "Today, 1:15 PM",
  },
  {
    id: 3,
    title: "Business Case Study",
    preview: "Apple Inc. revolutionized the technology industry...",
    originalWords: 2000,
    summaryWords: 600,
    format: "structured",
    savedTime: 5,
    date: "Yesterday",
  },
  {
    id: 4,
    title: "Psychology Research Paper",
    preview: "Cognitive development in children follows predictable stages...",
    originalWords: 1500,
    summaryWords: 375,
    format: "notes",
    savedTime: 4,
    date: "2 days ago",
  },
];

const FORMAT_ICONS: Record<string, React.ElementType> = {
  paragraph: FileText,
  bullet: BarChart3,
  bullets: BarChart3,
  structured: ChevronDown,
  notes: Brain,
};
function safeParseSummary(input: any) {
  if (!input) return null;

  // already object
  if (typeof input === "object") return input;

  if (typeof input !== "string") return null;

  let str = input.trim();

  // 🔥 FIX: convert python dict → JSON properly
  str = str
    .replace(/'/g, '"')        // single quotes → double
    .replace(/None/g, "null")
    .replace(/True/g, "true")
    .replace(/False/g, "false");

  try {
    return JSON.parse(str);
  } catch (e) {
    // final fallback → return clean text only
    return { type: "text", content: str };
  }
}
function summaryToText(summary: any): string {
  const parsed = safeParseSummary(summary);

  if (!parsed) return "";

  // if still string after parsing attempt
  if (typeof parsed === "string") return parsed;

  // bullet format
  if (parsed.type === "bullet" || parsed.type === "bullets") {
    return (parsed.content || []).join("\n");
  }

  // paragraph
  if (parsed.type === "paragraph") {
    return parsed.content || "";
  }

  // structured
  if (parsed.type === "structured") {
    const c = parsed.content;
    if (!c) return "";

    let text = "";

    if (c.title) text += c.title + "\n\n";

    if (Array.isArray(c.sections)) {
      c.sections.forEach((sec: any) => {
        if (sec.heading) text += sec.heading + "\n";

        if (Array.isArray(sec.points)) {
          sec.points.forEach((p: string) => {
            text += "• " + p + "\n";
          });
        }

        text += "\n";
      });
    }

    return text.trim();
  }

  // fallback
  if (parsed.content && Array.isArray(parsed.content)) {
    return parsed.content.join("\n");
  }

  return typeof parsed === "object"
    ? JSON.stringify(parsed, null, 2)
    : String(parsed);
}
export default observer(function SummarizerHistory() {
  const [history, setHistory] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [page, setPage] = useState(1);
const [showConfirm, setShowConfirm] = useState(false); 
const pageSize = 5;
const [exportItemId, setExportItemId] = useState<number | null>(null);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
 const [selectedItem, setSelectedItem] = useState<any | null>(null);
const [selectedLoading, setSelectedLoading] = useState(false);
const handleExport = async (id: number, format: "pdf" | "docx") => {
  try {
    const blob = await authService.summarizerExport(id, format);

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `summary-${id}.${format}`;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Export failed", err);
  } finally {
    setExportItemId(null);
  }
};
// const handleDelete = async (id) => {
//   try {
//     await authService.singleSummazrizerDelete(id);

//       const res = await authService.summarizerHistory();
//       summarizerHistory.responce.set(res.results || [])
//     // setDeletedIds((prev) => [...prev, id]);
//   } catch (error) {
//     console.error("Delete failed:", error);
//   }
// };
const handleDelete = async (id) => {
  try {
    await authService.singleSummazrizerDelete(id);

    // instantly update UI (NO refresh needed)
    summarizerHistory.response.set((prev) =>
      prev.filter((item) => item.id !== id)
    );

  } catch (error) {
    console.error("Delete failed:", error);
  }
};
const handleViewFull = async (id: number) => {
  try {
    setSelectedLoading(true);
    setSelectedItem(null);

    const res = await authService.singleSummarizerHistory(id);
    console.log(res, "history")
    setSelectedItem(res);
  } catch (err) {
    console.error("Failed to load summary", err);
  } finally {
    setSelectedLoading(false);
  }
};
const normalizeFormat = (item: any) => {
  const t = item.summary?.type || item.format;

  if (t === "bullets") return "bullet";
  if (t === "structure") return "structured";

  return t || "paragraph";
};
  // const visible = mockHistory.filter((h) => !deletedIds.includes(h.id));
const visible = summarizerHistory.response.get()
  .slice(0, page * pageSize)
  .map((item: any) => {
   const parsedSummary = safeParseSummary(item.summary);
const summaryText = summaryToText(parsedSummary);
    return {
      id: item.id,

      title:
        (item.original_text || "")
          .slice(0, 40)
          .trim() + "...",

      preview:
        summaryText.slice(0, 90).trim() + "...",

      originalWords: item.original_word_count || 0,
      summaryWords: item.summary_word_count || 0,

    format: normalizeFormat(item),

      savedTime: item.reading_time_saved ?? 0,

      date: item.created_at
        ? new Date(item.created_at).toLocaleString()
        : "Unknown",
    };
  });
  const hasMore = visible.length < summarizerHistory.response.get().length;

// useEffect(() => {
//   const fetchHistory = async () => {
//     try {
//       setLoading(true);

//       const res = await authService.summarizerHistory();
//       summarizerHistory.responce.set(res.results || [])
//       console.log(res.results, "H2")
//       setHistory(res.results || []);
//       setPage(1);
//     } catch (err) {
//       console.log("HISTORY ERROR:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchHistory();
// }, []);
useEffect(() => {
  const fetchHistory = async () => {
    setLoading(true);

    const res = await authService.summarizerHistory();

    summarizerHistory.response.set(res.results || []);

    setLoading(false);
  };

  fetchHistory();
}, []);
const handleCopy = async (item: any) => {
 await navigator.clipboard.writeText(summaryToText(item.summary));
  setCopiedId(item.id);
  setTimeout(() => setCopiedId(null), 2000);
};
console.log(visible , "visible")
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-medium text-gray-300">Summary History</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">
            {visible.length}
          </span>
        </div>
    <button
  onClick={() => setShowConfirm(true)}
  className="text-xs text-gray-500 hover:text-red-400 transition flex items-center gap-1"
>
  <Trash2 className="w-3 h-3" />
  Clear All
</button>
      </div>

      {/* Items */}
      <div className="divide-y divide-white/5">
        {visible.length === 0 ? (
          <div className="py-12 text-center">
            <Brain className="w-8 h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No summaries yet</p>
          </div>
        ) : (
          visible.map((item, i) => {
            const Icon =
                  FORMAT_ICONS[item.format as keyof typeof FORMAT_ICONS] || Brain;
            const isExpanded = expandedId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-white/5 transition"
              >
                <div
                  className="flex items-start gap-4 px-6 py-4 cursor-pointer group"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-indigo-400" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-gray-200">{item.title}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 capitalize">
                        {item.format}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">{item.preview}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-xs text-gray-600">
                        📝 {item.originalWords} → {item.summaryWords} words
                      </span>
                      <span className="text-xs text-green-400">
                        ⏱️ Saved {item.savedTime}m reading
                      </span>
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.date}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCopy(item); }}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition"
                    >
                      {copiedId === item.id ? (
                        <CheckCheck className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-gray-500" />
                      )}
                    </button>

<button
  onClick={(e) => {
    e.stopPropagation();
    handleDelete(item.id);
  }}
  className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition"
>
  <Trash2 className="w-3.5 h-3.5" />
</button>

                    <ChevronDown className={`w-4 h-4 text-gray-600 transition ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                </div>

                {/* Expanded */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4">
                        <div className="ml-14 p-4 rounded-xl bg-[#0d0d14] border border-white/10 space-y-2">
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                              Statistics
                            </p>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="text-center">
                                <p className="text-sm font-bold text-indigo-400">{item.originalWords}</p>
                                <p className="text-[10px] text-gray-600">Original Words</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-bold text-purple-400">{item.summaryWords}</p>
                                <p className="text-[10px] text-gray-600">Summary Words</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-bold text-green-400">{Math.round(((item.originalWords - item.summaryWords) / item.originalWords) * 100)}%</p>
                                <p className="text-[10px] text-gray-600">Reduced</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
<button
  onClick={(e) => {
    e.stopPropagation();
    handleViewFull(item.id);
  }}
  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-gray-400 transition"
>
  <Eye className="w-3.5 h-3.5" />
  View Full
</button>
                      <button
  onClick={(e) => {
    e.stopPropagation();
    setExportItemId(item.id);
  }}
  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-gray-400 transition"
>
  <Download className="w-3.5 h-3.5" />
  Export
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
{hasMore && (
  <div className="px-6 py-4 text-center border-t border-white/5">
    <button
      onClick={() => setPage((p) => p + 1)}
      className="text-sm text-indigo-400 hover:text-indigo-300"
    >
      Load more
    </button>
  </div>
)}
      {/* Footer */}
      {/* <div className="px-6 py-4 border-t border-white/5 text-center">
        <button className="text-sm text-gray-500 hover:text-indigo-400 transition">
          View all summaries →
        </button>
      </div> */}
      {selectedItem && (
  <div
    className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
    onClick={() => setSelectedItem(null)}
  >
    <div
      className="bg-[#0f0f0f] border border-white/10 max-w-4xl w-full rounded-2xl overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-5 py-3 border-b border-white/10 flex justify-between">
        <h2 className="text-sm text-white font-medium">
          Full Summary
        </h2>

        <button
          onClick={() => setSelectedItem(null)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
        {selectedLoading ? (
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading...
          </div>
        ) : (
          <>
            {/* Original */}
            <div>
              <h3 className="text-xs text-gray-500 mb-1">Original</h3>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                {selectedItem?.original_text}
              </p>
            </div>

            {/* Summary */}
            <div>
              <h3 className="text-xs text-gray-500 mb-1">Summary</h3>
              {/* <p className="text-sm text-indigo-300 whitespace-pre-wrap">
                {typeof selectedItem?.summary === "string"
                  ? selectedItem.summary
                  : JSON.stringify(selectedItem?.summary, null, 2)}
              </p> */}
              <pre className="text-sm text-gray-300 whitespace-pre-wrap">
  {summaryToText(selectedItem?.summary)}
</pre>
            </div>

            {/* Key Points */}
            {selectedItem?.key_points?.length > 0 && (
              <div>
                <h3 className="text-xs text-gray-500 mb-1">Key Points</h3>
                <ul className="list-disc pl-5 text-sm text-gray-300">
                  {selectedItem.key_points.map((p: string, i: number) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Exam Notes */}
            {selectedItem?.exam_notes?.length > 0 && (
              <div>
                <h3 className="text-xs text-gray-500 mb-1">Exam Notes</h3>
                <ul className="list-disc pl-5 text-sm text-gray-300">
                  {selectedItem.exam_notes.map((p: string, i: number) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Metadata */}
            <div className="pt-3 border-t border-white/10 text-xs text-gray-500">
              <p>
                Compression: {selectedItem?.compression_ratio}
              </p>
              <p>
                Saved: {selectedItem?.reading_time_saved}m
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
)}
{exportItemId && (
  <div
    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    onClick={() => setExportItemId(null)}
  >
    <div
      className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 w-[300px]"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-sm text-white mb-4">Export Format</h2>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => handleExport(exportItemId, "pdf")}
          className="py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30"
        >
          Export as PDF
        </button>

        <button
          onClick={() => handleExport(exportItemId, "docx")}
          className="py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
        >
          Export as DOCX
        </button>
      </div>

      <button
        onClick={() => setExportItemId(null)}
        className="mt-4 text-xs text-gray-500 hover:text-white w-full"
      >
        Cancel
      </button>
    </div>
  </div>
)}
{showConfirm && (
  <div
    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    onClick={() => setShowConfirm(false)}
  >
    <div
      className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-5 w-[320px]"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-white text-sm font-semibold mb-2">
        Delete all history?
      </h2>

      <p className="text-xs text-gray-400 mb-4">
        This action cannot be undone. All your summaries will be permanently removed.
      </p>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowConfirm(false)}
          className="px-3 py-1.5 text-xs text-gray-400 hover:text-white"
        >
          Cancel
        </button>

        <button
          disabled={loading}
          onClick={async () => {
            try {
              setLoading(true);

              await authService.allSummazrizerDelete();
              setHistory([])
              // optional: clear UI state too
              setShowConfirm(false);

              // if you store history in state:
              // setHistory([]);
summarizerHistory.response.set([])
            } catch (err) {
              console.error(err);
            } finally {
              setLoading(false);
            }
          }}
          className="px-3 py-1.5 text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg"
        >
          {loading ? "Deleting..." : "Delete All"}
        </button>
      </div>
    </div>
  </div>
)}
    </motion.div>
  );
})
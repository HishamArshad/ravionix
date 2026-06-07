"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  History,
  FileText,
  Download,
  Trash2,
  Clock,
  Wand2,
  Eye,
  Loader2,
} from "lucide-react";

import { authService } from "../api/authService";
import { observer } from "@legendapp/state/react";
import { assignmentHistory, humanizerDraft } from "../store/auth";
import {useRouter} from "next/navigation";

interface AssignmentHistoryItem {
  id: string;
  topic: string;
  subject: string;
  assignment_type: string;
  word_count: number;
  title: string;
  content: string;
  created_at: string;
}

const TYPE_COLORS: Record<string, string> = {
  research_paper:
    "text-purple-400 bg-purple-500/10 border-purple-500/20",
  essay: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  literature_review:
    "text-orange-400 bg-orange-500/10 border-orange-500/20",
  case_study:
    "text-green-400 bg-green-500/10 border-green-500/20",
  report: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  lab_report: "text-teal-400 bg-teal-500/10 border-teal-500/20",
};

export default observer(function AssignmentHistory() {
  const [loading, setLoading] = useState(true);

  const [history, setHistory] = useState<AssignmentHistoryItem[]>([]);

  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  // pagination
  const [page, setPage] = useState(1);

  const pageSize = 5;
const [selectedAssignment, setSelectedAssignment] =
  useState<AssignmentHistoryItem | null>(null);

const [viewLoading, setViewLoading] = useState(false);
const handleView = async (id) => {
  try {
    setViewLoading(true);

    const data = await authService.singleAssignmentHistory(id);

    setSelectedAssignment(data);
  } catch (err) {
    console.error("Failed to fetch assignment", err);
  } finally {
    setViewLoading(false);
  }
};
// const handleDelete = async (id) => {
//   try {
//      await authService.singleAssignmentDelete(id);

//     // remove from UI
//     // setHistory((prev) => prev.filter((item) => item.id !== id));
//   } catch (err) {
//     console.error("Delete failed", err);
//   }
// };
const router = useRouter();

const handleDelete = async (id: string) => {
  try {
    await authService.singleAssignmentDelete(id);

    const current = assignmentHistory.get();
    assignmentHistory.set(current.filter((item: any) => item.id !== id));
//     assignmentHistory.set((prev: any[]) =>
//   prev.filter((item) => item.id !== id)
// );
  } catch (err) {
    console.error("Delete failed", err);
  }
};
const handleDownload = async (id, format: "pdf" | "docx") => {
  const blob = await authService.exportAssignment(id, format);
  console.log(blob)
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `assignment.${format}`;

  document.body.appendChild(link);
  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};
useEffect(() => {
  async function fetchHistory() {
    try {
      setLoading(true);

      const res = await authService.assignmentHistory();

      assignmentHistory.set(res.results || []);

      setPage(1);
    } catch (err) {
      console.error("Assignment history fetch failed", err);
    } finally {
      setLoading(false);
    }
  }

  fetchHistory();
}, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 p-4">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading assignment history...
      </div>
    );
  }
// const handleSendToHumanizer = async (id, text: string) => {


//   humanizerDraft.text.set(text);
//   router.push("/dashboard/humanizer");
// };
const handleSendToHumanizer = async (id, text) => {
  try {
    // setViewLoading(true);

    const data = await authService.singleAssignmentHistory(id);
    humanizerDraft.text.set(data.content);
    console.log(data)
    // console.log(text)
    console.log(id)
    // setSelectedAssignment(data);
    // console.log(selectedAssignment.content.get())
    router.push("/dashboard/humanizer");
  } catch (err) {
    console.error("Failed to fetch assignment", err);
  } finally {
    setViewLoading(false);
  }
}
  // ── Field updater ──────────────────────────────────────────────
  // const update = useCallback(
  //   <K extends keyof FormData>(key: K, value: FormData[K]) => {
  //     setForm((prev) => ({ ...prev, [key]: value }));
  //   },
  //   []
  // );
const allHistory = assignmentHistory.get() || [];

    const visibleHistory = allHistory.filter(
      (h) => !deletedIds.includes(h.id)
    );
  const paginatedHistory = visibleHistory.slice(
    0,
    page * pageSize
  );  
  // console.log(paginatedHistory)
  const hasMore =
    paginatedHistory.length < visibleHistory.length;

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

          <h3 className="text-sm font-medium text-gray-300">
            Assignment History
          </h3>

          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">
            {visibleHistory.length}
          </span>
        </div>

<button
  onClick={() => handleDelete(item.id)}
  title="Delete"
  className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition"
>
  <Trash2 className="w-3.5 h-3.5" />
</button>
      </div>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-xs text-gray-600 uppercase tracking-wider">
        <div className="col-span-5">Assignment</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Words</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-1">Actions</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {paginatedHistory.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="w-8 h-8 text-gray-700 mx-auto mb-2" />

            <p className="text-sm text-gray-600">
              No assignments yet
            </p>
          </div>
        ) : (
          paginatedHistory.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 hover:bg-white/5 transition group items-center"
            >
             
              {/* Title */}
              <div className="md:col-span-5 space-y-1">
                <p className="text-sm text-gray-200 font-medium line-clamp-1">
                  {item.title}
                    
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{item.subject}</span>
                </div>
              </div>
             
              {/* Type */}
              <div className="md:col-span-2">
                <span
                  className={`inline-block text-xs px-2 py-0.5 rounded-full border ${
                    TYPE_COLORS[item.assignment_type] ??
                    "text-gray-400 bg-white/5 border-white/10"
                  }`}
                >
                  {item.assignment_type.replace("_", " ")}
                </span>
              </div>

              {/* Words */}
              <div className="md:col-span-2">
                <span className="text-sm text-gray-400">
                  {(item.word_count ?? 0).toLocaleString()}w
                </span>
              </div>

              {/* Date */}
              {/* <div className="md:col-span-2 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-gray-600" />

                <span className="text-xs text-gray-500">
                  {new Date(item.created_at).toLocaleString()}
                </span>
              </div> */}

              {/* Actions */}
              <div className="md:col-span-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                {/* View */}
        <button
        onClick={() => handleView(item.id)}
        title="View"
        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition"
      >
        <Eye className="w-3.5 h-3.5" />
      </button>

                {/* Humanize */}
                <button
                  onClick={() => handleSendToHumanizer(item.id, item.id)}
                  title="Humanize"
                  className="p-1.5 rounded-lg hover:bg-pink-500/20 text-gray-500 hover:text-pink-400 transition"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                </button>

                {/* Download */}
<div className="flex flex-col gap-1">
  <button
    onClick={() => handleDownload(item.id, "pdf")}
    className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-300"
  >
    PDF
  </button>

  <button
    onClick={() => handleDownload(item.id, "docx")}
    className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300"
  >
    DOCX
  </button>
</div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(item.id)
                  }
                  title="Delete"
                  className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="px-6 py-4 border-t border-white/5 text-center">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="text-sm text-purple-400 hover:text-purple-300 transition"
          >
            Load More
          </button>
        </div>
      )}
{selectedAssignment && (
  <div
    className="fixed inset-0 bg-black/70 flex items-center justify-center p-4"
    onClick={() => setSelectedAssignment(null)} // 👈 click outside closes
  >
    <div
      className="bg-[#0f0f0f] max-w-3xl w-full rounded-xl p-6 overflow-auto max-h-[80vh]"
      onClick={(e) => e.stopPropagation()} // 👈 prevents closing when clicking inside
    >
      <div className="flex justify-between mb-4">
        <h2 className="text-lg text-white">
          {selectedAssignment.title}
        </h2>

        <button
          onClick={() => setSelectedAssignment(null)}
          className="text-gray-400"
        >
          ✕
        </button>
      </div>

      <div className="text-sm text-gray-300 whitespace-pre-wrap">
        {selectedAssignment.content}
      </div>
    </div>
  </div>
)}
    </motion.div>
  );
})
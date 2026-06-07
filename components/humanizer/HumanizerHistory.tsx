"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  History,
  Copy,
  Trash2,
  Eye,
  Download,
  Loader2,
  Wand2,
} from "lucide-react";

import { authService } from "../api/authService";
import { observer } from "@legendapp/state/react";
import { humanizerHistory } from "../store/auth";

interface HumanizerHistoryItem {
  id: string;
  mode: string;
  original_text: string;
  humanized_text: string;
  original_word_count: number;
  score: number;
  created_at: string;
}

export default observer(function HumanizerHistory() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [selectedItem, setSelectedItem] =
    useState<HumanizerHistoryItem | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);

        const res = await authService.humanizerHistory();
        humanizerHistory.set(res.results || []);

        setPage(1);
      } catch (err) {
        console.error("History fetch failed", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

const handleCopy = (id: string, text: string) => {
  navigator.clipboard.writeText(text || "");

  setCopiedId(id);

  setTimeout(() => {
    setCopiedId(null);
  }, 1200);
};

  const handleDelete = async (id: string) => {
    try {
      await authService.singleHHumanizerDelete(id);

      const current = humanizerHistory.get() || [];
      humanizerHistory.set(
        current.filter((item: any) => item.id !== id)
      );
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleDownload = async (
    id: string,
    format: "pdf" | "docx"
  ) => {
    const blob = await authService.exportHistory(id, format);

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `humanized-${id}.${format}`;

    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 p-4">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading humanizer history...
      </div>
    );
  }

  const allHistory = humanizerHistory.get() || [];

  const paginatedHistory = allHistory.slice(0, page * pageSize);

  const hasMore =
    paginatedHistory.length < allHistory.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-gray-400" />

          <h3 className="text-sm font-medium text-gray-300">
            Humanizer History
          </h3>

          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">
            {allHistory.length}
          </span>
        </div>

        <button className="text-xs text-gray-500 hover:text-red-400 transition flex items-center gap-1">
          <Trash2 className="w-3 h-3" />
          Clear All
        </button>
      </div>

      {/* LIST */}
      <div className="divide-y divide-white/5">
        {paginatedHistory.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 hover:bg-white/5 transition group items-center"
          >
    
        
            {/* LEFT CONTENT */}
            <div className="md:col-span-7 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {item.mode}
                </span>

                <span className="text-xs text-gray-500">
                  {item.original_word_count} words
                </span>

                <span className="text-xs text-green-400">
                  {item.score}% score
                </span>
              </div>

              <p className="text-sm text-gray-400 line-clamp-2">
                {item.original_text}
              </p>
            </div>

            {/* MIDDLE */}
            {/* <div className="md:col-span-4 hidden md:block">
              <p className="text-sm text-gray-300 line-clamp-2 border-l border-purple-500/30 pl-3">
                {item.humanized_text}
              </p>
            </div> */}
 
            {/* ACTIONS */}
            <div className="md:col-span-5 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition">

              {/* VIEW */}
              <button
                onClick={() => setSelectedItem(item)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition"
                title="View"
              >
                <Eye className="w-4 h-4" />
              </button>

              {/* COPY */}
              {/* <button
                onClick={() => handleCopy(item.humanized_text)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition"
                title="Copy"
              >
                <Copy className="w-4 h-4" />
              </button> */}
<button
  onClick={() => handleCopy(item.id, item.humanized_text)}
  className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition relative"
  title="Copy"
>
  <Copy className="w-4 h-4" />

  {copiedId === item.id && (
    <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] bg-green-500 text-black px-2 py-0.5 rounded-md">
      Copied
    </span>
  )}
</button>
              {/* DOWNLOAD PDF */}
              {/* <button
                onClick={() => handleDownload(item.id, "pdf")}
                className="p-2 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition"
                title="PDF"
              >
                <Download className="w-4 h-4" />
              </button> */}
          <div className="flex justify-center items-center gap-1"> 
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
              {/* DOWNLOAD DOCX */}
              {/* <button
                onClick={() => handleDownload(item.id, "docx")}
                className="p-2 rounded-lg hover:bg-blue-500/20 text-gray-500 hover:text-blue-400 transition"
                title="DOCX"
              >
                <Wand2 className="w-4 h-4" />
              </button> */}

              {/* DELETE */}
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* LOAD MORE */}
      {hasMore && (
        <div className="px-6 py-4 text-center border-t border-white/5">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            Load more
          </button>
        </div>
      )}

      {/* MODAL */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-[#0f0f0f] border border-white/10 max-w-4xl w-full rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3 border-b border-white/10 flex justify-between">
              <h2 className="text-sm text-white font-medium">
                Humanized Output
              </h2>

              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-5 max-h-[75vh] overflow-y-auto">
              <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                {selectedItem.humanized_text}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
});
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  FileQuestion,
  Clock,
  Eye,
  Download,
  Trash2,
  ChevronDown,
  Zap,
  BarChart3,
  Play,
  Share2,
  X,
} from "lucide-react";
import { currentMCQRetake } from "../store/auth";
import { authService } from "../api/authService";
import { mcqHistory } from "../store/auth";
import { observer } from "@legendapp/state/react";

interface HistoryItem {
  id: number;
  title: string;
  topic: string;
  questions: number;
  difficulty: "easy" | "medium" | "hard" | "mixed";
  score?: number;
  date: string;
  timeSpent?: string;
  type: "generated" | "attempted";
}

const mockHistory: HistoryItem[] = [
  {
    id: 1,
    title: "Physics: Newton's Laws",
    topic: "Physics",
    questions: 10,
    difficulty: "medium",
    score: 85,
    date: "Today, 4:30 PM",
    timeSpent: "15m 23s",
    type: "attempted",
  },
  {
    id: 2,
    title: "Chemistry: Chemical Bonding",
    topic: "Chemistry",
    questions: 20,
    difficulty: "hard",
    score: 72,
    date: "Today, 2:15 PM",
    timeSpent: "28m 45s",
    type: "attempted",
  },
  {
    id: 3,
    title: "Biology: Cell Division",
    topic: "Biology",
    questions: 10,
    difficulty: "easy",
    date: "Yesterday, 6:00 PM",
    type: "generated",
  },
  { 
    id: 4,
    title: "Mathematics: Calculus Basics",
    topic: "Mathematics",
    questions: 15,
    difficulty: "mixed",
    score: 90,
    date: "2 days ago",
    timeSpent: "22m 10s",
    type: "attempted",
  },
];

const DIFFICULTY_COLORS = {
  easy: "text-green-400 bg-green-500/10",
  medium: "text-yellow-400 bg-yellow-500/10",
  hard: "text-red-400 bg-red-500/10",
  mixed: "text-blue-400 bg-blue-500/10",
};

const TYPE_ICONS = {
  generated: FileQuestion,
  attempted: Play,
};

export default observer(function MCQHistory() {
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedMCQ, setSelectedMCQ] = useState<any>(null);
const [showConfirm, setShowConfirm] = useState(false);
const [loadingDeleteAll, setLoadingDeleteAll] = useState(false);
const [loadingMCQ, setLoadingMCQ] = useState(false);

const [openModal, setOpenModal] = useState(false);
const [page, setPage] = useState(1);

const pageSize = 5;
const handleViewMCQ = async (id: number) => {
  try {
    setLoadingMCQ(true);

    const res = await authService.singleHistoryMcq(id);

    console.log(res);

    setSelectedMCQ(res);

    setOpenModal(true);
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingMCQ(false);
  }
};
useEffect(() => {
  const fetchHistory = async () => {
    // setLoading(true);

    const res = await authService.mcqHistory()
console.log(res)
    mcqHistory.response.set(res || []);
setPage(1);
    // setLoading(false);
  };

  fetchHistory();
}, []);


const handleDeleteMCQ = async (id: number) => {
  try {
    // optional optimistic UI
    const previous = mcqHistory.response.get();

    // remove instantly from UI
    mcqHistory.response.set(
      previous.filter((item: any) => item.id !== id)
    );

    // close expanded item if deleted
    if (expandedId === id) {
      setExpandedId(null);
    }

    // close modal if opened item deleted
    if (selectedMCQ?.id === id) {
      setOpenModal(false);
      setSelectedMCQ(null);
    }

    // API call
    await authService.singleMcqDelete(id);
  } catch (err) {
    console.error(err);

    // rollback if delete failed
    const res = await authService.mcqHistory();
    mcqHistory.response.set(res || []);
  }
};






  // const visible = mockHistory.filter((h) => !deletedIds.includes(h.id));
const visible = mcqHistory.response
  .get()
  .slice(0, page * pageSize);

const hasMore =
  visible.length < mcqHistory.response.get().length;
console.log(visible, "Visibles")
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
          <h3 className="text-sm font-medium text-gray-300">MCQ History</h3>
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

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-xs text-gray-600 uppercase tracking-wider">
        <div className="col-span-5">MCQ Set</div>
        <div className="col-span-2">Details</div>
        <div className="col-span-2">Score</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-1">Actions</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {visible.length === 0 ? (
          <div className="py-12 text-center">
            <FileQuestion className="w-8 h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No MCQ sets yet</p>
          </div>
        ) : (
          visible.map((item, i) => {
            const TypeIcon = TYPE_ICONS[item.type];
            const isExpanded = expandedId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="hover:bg-white/5 transition"
              >
                <div
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 items-center cursor-pointer group"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  {/* Title */}
                  <div className="md:col-span-5 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      item.type === "attempted"
                        ? "bg-indigo-500/10"
                        : "bg-blue-500/10"
                    }`}>
                      <TypeIcon className={`w-4 h-4 ${
                        item.type === "attempted"
                          ? "text-indigo-400"
                          : "text-blue-400"
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-200 font-medium line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.topic}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="md:col-span-2 space-y-0.5">
                    <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full border ${DIFFICULTY_COLORS[item.difficulty]}`}>
                      {item.questions} Qs
                    </span>
                    <p className="text-xs text-gray-500">{item.difficulty}</p>
                  </div>

                  {/* Score */}
                  <div className="md:col-span-2">
                    {item.attempt?.percentage !== undefined ? (
                      <div>
                        <p className={`text-base font-bold ${
                          item.attempt.percentage >= 80 ? "text-green-400" :
                          item.attempt.percentage >= 60 ? "text-yellow-400" :
                          "text-red-400"
                        }`}>
                          {item.attempt.percentage}%
                        </p>
                        {/* <p className="text-xs text-gray-500 mt-0.5">{item.attempt.time_spent}</p> */}
                      </div>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">
                        Not attempted
                      </span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="md:col-span-2 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-gray-600" />
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                          onClick={(e) => {
                          e.stopPropagation();
                          handleViewMCQ(item.id);
                        }}
                      title="View"
                      className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      title="Download"
                      className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={(e) => {
    e.stopPropagation();
    handleDeleteMCQ(item.id);
  }}
                      title="Delete"
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
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Questions: {item.questions}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[item.difficulty]}`}>
                              {item.difficulty}
                            </span>
                          </div>
                          {item.attempt?.percentage !== undefined && (
                            <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                              <p className="text-xs text-indigo-400 mb-1">Score: {item.attempt.percentage}%</p>
                              {/* <p className="text-[10px] text-gray-500">Time spent: {item.attempt?.time_spent}</p> */}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => {
                              e.stopPropagation();
                              handleViewMCQ(item.id);
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-gray-400 transition">
                              <Eye className="w-3.5 h-3.5" />
                              View MCQs
                            </button>
                            {/* <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 text-xs text-indigo-400 transition">
                              <Play className="w-3.5 h-3.5" />
                              Retake Quiz
                            </button> */}
                            {/* <button
  onClick={async (e) => {
    e.stopPropagation();

    try {
      const res = await authService.singleHistoryMcq(item.id);

      currentMCQRetake.set(res);

      // optional scroll
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.log(err);
    }
  }}
  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 text-xs text-indigo-400 transition"
>
  <Play className="w-3.5 h-3.5" />
  Retake Quiz
</button> */}
                            <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-gray-400 transition">
                              <Share2 className="w-3.5 h-3.5" />
                              Share
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

      {/* Footer */}
 {hasMore && (
  <div className="px-6 py-4 text-center border-t border-white/5">
    <button
      onClick={() => setPage((p) => p + 1)}
      className="text-sm text-indigo-400 hover:text-indigo-300 transition"
    >
      Load more
    </button>
  </div>
)}
      <AnimatePresence>
  {openModal && selectedMCQ && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setOpenModal(false)}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0d0d14] border border-white/10 p-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">
              {selectedMCQ.title}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {selectedMCQ.topic}
            </p>
          </div>

          <button
            onClick={() => setOpenModal(false)}
            className="p-2 rounded-xl hover:bg-white/10 text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-2xl font-bold text-indigo-400">
              {selectedMCQ.total_questions}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Questions
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-2xl font-bold text-green-400">
              {selectedMCQ.attempt?.percentage || 0}%
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Score
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-2xl font-bold text-yellow-400">
              {selectedMCQ.difficulty}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Difficulty
            </p>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {selectedMCQ.questions.map(
            (question: any, idx: number) => (
              <div
                key={question.id}
                className="p-5 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-xs px-2 py-1 rounded-lg bg-indigo-500/20 text-indigo-400">
                    Q{idx + 1}
                  </span>

                  <h3 className="text-sm font-medium text-gray-200">
                    {question.question}
                  </h3>
                </div>

                <div className="space-y-2">
                  {question.options.map((opt: any) => (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-xl border text-sm ${
                        opt.isCorrect
                          ? "bg-green-500/10 border-green-500/20 text-green-300"
                          : "bg-white/5 border-white/10 text-gray-300"
                      }`}
                    >
                      <span className="font-semibold mr-2">
                        {opt.id.toUpperCase()}.
                      </span>

                      {opt.text}
                    </div>
                  ))}
                </div>

                {question.explanation && (
                  <div className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <p className="text-xs text-blue-400 mb-1">
                      Explanation
                    </p>

                    <p className="text-sm text-gray-300">
                      {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
<AnimatePresence>
  {showConfirm && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => setShowConfirm(false)}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-5 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-white text-sm font-semibold mb-2">
          Delete all MCQ history?
        </h2>

        <p className="text-xs text-gray-400 mb-4">
          This action cannot be undone. All your MCQ history will be permanently removed.
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowConfirm(false)}
            className="px-3 py-1.5 text-xs text-gray-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            disabled={loadingDeleteAll}
            onClick={async () => {
              try {
                setLoadingDeleteAll(true);

                await authService.deleteAllMcq();

                mcqHistory.response.set([]);

                setExpandedId(null);
                setOpenModal(false);
                setSelectedMCQ(null);

                setShowConfirm(false);
              } catch (err) {
                console.error(err);
              } finally {
                setLoadingDeleteAll(false);
              }
            }}
            className="px-3 py-1.5 text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg disabled:opacity-50"
          >
            {loadingDeleteAll ? "Deleting..." : "Delete All"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </motion.div>
  );
})
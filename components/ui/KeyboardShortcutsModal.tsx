"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X, Command, Zap } from "lucide-react";

const SHORTCUTS = [
  { keys: ["Cmd/Ctrl", "K"], description: "Open command palette" },
  { keys: ["Cmd/Ctrl", "H"], description: "Go to history" },
  { keys: ["Cmd/Ctrl", "?"], description: "Show keyboard shortcuts" },
  { keys: ["Cmd/Ctrl", "1"], description: "Open Humanizer" },
  { keys: ["Cmd/Ctrl", "2"], description: "Open Assignment" },
  { keys: ["Cmd/Ctrl", "3"], description: "Open Plagiarism" },
  { keys: ["Cmd/Ctrl", "4"], description: "Open Citation" },
  { keys: ["Cmd/Ctrl", "5"], description: "Open Physics" },
  { keys: ["Cmd/Ctrl", "6"], description: "Open PDF" },
  { keys: ["Esc"], description: "Close modals" },
];

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4"
          >
            <div className="p-8 rounded-2xl bg-[#13131f] border border-white/10 shadow-2xl space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Keyboard className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Shortcuts Grid */}
              <div className="grid md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {SHORTCUTS.map((shortcut, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                  >
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {shortcut.keys.map((key, j) => (
                        <div key={j} className="flex items-center gap-1">
                          <kbd className="px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-xs font-semibold text-white font-mono">
                            {key}
                          </kbd>
                          {j < shortcut.keys.length - 1 && (
                            <span className="text-gray-600">+</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 truncate">
                      {shortcut.description}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-gray-500">
                <Zap className="w-3 h-3" />
                Pro tip: Press{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono font-semibold text-white mx-1">
                  Cmd/Ctrl
                </kbd>
                + K to search anything
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
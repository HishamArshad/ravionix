"use client";

import { motion } from "framer-motion";
import { Settings } from "lucide-react";

export default function SettingsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4"
    >
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center shadow-lg shadow-slate-500/20">
        <Settings className="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-gray-400">
          Manage your account, security and preferences
        </p>
      </div>
    </motion.div>
  );
}
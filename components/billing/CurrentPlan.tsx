"use client";

import { motion } from "framer-motion";
import { Zap, CheckCircle, Clock, TrendingUp, Crown } from "lucide-react";

const USAGE_STATS = [
  { label: "Humanizer", used: 48, total: 50, color: "from-pink-500 to-rose-500" },
  { label: "Assignments", used: 2, total: 2, color: "from-purple-500 to-violet-500" },
  { label: "Plagiarism", used: 3, total: 3, color: "from-orange-500 to-red-500" },
  { label: "Citations", used: 12, total: "∞", color: "from-blue-500 to-cyan-500" },
];

export default function CurrentPlan() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid md:grid-cols-3 gap-4"
    >
      {/* Plan Card */}
      <div className="md:col-span-1 p-6 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-5 h-5 text-yellow-400" />
          <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">
            Current Plan
          </span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-1">Free</h2>
        <p className="text-sm text-gray-400 mb-4">Limited daily usage</p>
        <div className="space-y-2 mb-6">
          {[
            "500 words/day humanizer",
            "2 assignments/day",
            "3 plagiarism checks/day",
            "Unlimited citations",
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
              <span className="text-xs text-gray-300">{f}</span>
            </div>
          ))}
        </div>
        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-sm font-semibold text-white hover:opacity-90 transition flex items-center justify-center gap-2">
          <Zap className="w-4 h-4" />
          Upgrade to Pro
        </button>
      </div>

      {/* Usage Stats */}
      <div className="md:col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-300">Today's Usage</h3>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            Resets midnight
          </div>
        </div>

        <div className="space-y-4">
          {USAGE_STATS.map((stat, i) => {
            const pct = typeof stat.total === "number"
              ? Math.min((stat.used / stat.total) * 100, 100)
              : 30;
            const isMax = stat.used === stat.total && typeof stat.total === "number";

            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-400">{stat.label}</span>
                  <span className={`text-xs font-semibold ${isMax ? "text-red-400" : "text-gray-300"}`}>
                    {stat.used} / {stat.total}
                  </span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${isMax ? "from-red-500 to-red-400" : stat.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10 flex items-center gap-3">
          <TrendingUp className="w-4 h-4 text-yellow-400 flex-shrink-0" />
          <p className="text-xs text-gray-400">
            You've hit daily limits on 2 tools.{" "}
            <span className="text-yellow-400 font-medium cursor-pointer hover:underline">
              Upgrade for unlimited access →
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
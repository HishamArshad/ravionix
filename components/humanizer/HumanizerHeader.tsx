"use client";

import { motion } from "framer-motion";
import { Wand2, Zap, Info } from "lucide-react";
import { authState, humanizerResponse } from "../store/auth";
import { observer } from "@legendapp/state/react";
import { useEffect } from "react";
import { authService } from "../api/authService";

function getScoreLabel(score: number) {
  if (score >= 85) return "Highly Human";
  if (score >= 70) return "Good Humanization";
  if (score >= 50) return "Partially Human";
  return "Needs Improvement";
}

export default observer(function HumanizerHeader() {
  
  const data = humanizerResponse.responce.get();
  const userD = authState.user.get()
  console.log(data)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authService.getMe();
        authState.user.set(user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);
  const user = authState.user.get()
  const score = data?.scores?.total ?? 0;
  // const remainingWords = data?.usage.remaining ?? 0;
const remainingWords = Math.max(
  (user?.limits?.humanizer ?? 0) -
  (user?.usage?.humanizer ?? 0),
  0
);
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      {/* Title */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
          <Wand2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Humanizer</h1>
          <p className="text-sm text-gray-400">
            Transform AI text into undetectable human writing
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-3 flex-wrap">

        {/* SCORE */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-green-400">
              {score}% {getScoreLabel(score)}
            </span>

            <span className="text-[10px] text-gray-500">
              Humanization Score
            </span>
          </div>
        </div>

        {/* WORDS LEFT */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <Zap className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-400 font-medium">
            {remainingWords} words left today
          </span>
        </div>

        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition">
          <Info className="w-4 h-4" />
          How it works
        </button>
      </div>
    </motion.div>
  );
});
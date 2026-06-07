"use client";

import { motion } from "framer-motion";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-xl"
      >
        {/* ICON */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-white">
          Payment Cancelled
        </h1>

        <p className="text-sm text-gray-400 mt-3">
          No worries — your account is still on the free plan. You can
          upgrade anytime when you're ready.
        </p>

        {/* CARD */}
        <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
          <p className="text-xs text-gray-400">
            What happened?
          </p>
          <p className="text-sm text-gray-300 mt-1">
            The payment process was cancelled before completion. No
            charges were made.
          </p>
        </div>

        {/* BUTTONS */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => router.push("/dashboard/billing")}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90"
          >
            Try Again
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full py-3 rounded-xl bg-white/10 text-gray-300 hover:bg-white/20 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </button>
        </div>

        {/* FOOTNOTE */}
        <p className="text-xs text-gray-500 mt-6">
          You can upgrade anytime — no pressure.
        </p>
      </motion.div>
    </div>
  );
}
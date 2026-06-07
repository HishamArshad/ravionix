"use client";

import { motion } from "framer-motion";
import { Plus, Smartphone, Trash2, CheckCircle } from "lucide-react";

const METHODS = [
  { id: 1, type: "JazzCash", number: "0300-1234567", isDefault: true, color: "from-red-500 to-orange-500" },
  { id: 2, type: "EasyPaisa", number: "0333-7654321", isDefault: false, color: "from-green-500 to-emerald-500" },
];

export default function PaymentMethods() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <h3 className="text-sm font-semibold text-gray-300">Payment Methods</h3>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-xs text-purple-400 hover:bg-purple-500/30 transition">
          <Plus className="w-3.5 h-3.5" />
          Add Method
        </button>
      </div>

      <div className="p-5 space-y-3">
        {METHODS.map((method, i) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition ${
              method.isDefault
                ? "bg-white/10 border-white/20"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center flex-shrink-0`}>
              <Smartphone className="w-6 h-6 text-white" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-200">{method.type}</p>
                {method.isDefault && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/20">
                    Default
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{method.number}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!method.isDefault && (
                <button className="text-xs text-gray-500 hover:text-white transition px-2 py-1 rounded-lg hover:bg-white/10">
                  Set Default
                </button>
              )}
              {method.isDefault && (
                <CheckCircle className="w-4 h-4 text-green-400" />
              )}
              {!method.isDefault && (
                <button className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {/* Add via WhatsApp Note */}
        <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
          <p className="text-xs text-gray-400">
            💬 To upgrade manually, send payment via JazzCash/EasyPaisa and{" "}
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 font-medium hover:underline"
            >
              WhatsApp us
            </a>{" "}
            with your screenshot for instant activation.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
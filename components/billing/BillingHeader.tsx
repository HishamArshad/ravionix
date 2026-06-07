"use client";

import { motion } from "framer-motion";
import { CreditCard, Shield } from "lucide-react";

export default function BillingHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/20">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Billing & Plans</h1>
          <p className="text-sm text-gray-400">
            Manage your subscription and payment methods
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
        <Shield className="w-4 h-4 text-green-400" />
        <span className="text-sm text-green-400 font-medium">
          Secure payments via JazzCash & EasyPaisa
        </span>
      </div>
    </motion.div>
  );
}
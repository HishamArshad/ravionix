"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Receipt, CheckCircle, XCircle, Download, Clock } from "lucide-react";
import { authService } from "../api/authService";
 

export default function BillingHistory() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await authService.stripeHistory();
          console.log("Billing mounted");
        setInvoices(res || []);
      } catch (err) {
        console.error("Failed to load billing history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-400 text-sm">
        Loading payment history...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-300">
            Payment History
          </h3>
        </div>

        <button className="text-xs text-gray-500 hover:text-purple-400 transition">
          Download All
        </button>
      </div>

      <div className="divide-y divide-white/5">
        {invoices.length === 0 ? (
          <div className="p-6 text-gray-500 text-sm">
            No payment history found
          </div>
        ) : (
          invoices.map((inv, i) => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition group"
            >
              {/* LEFT SIDE */}
              <div className="flex items-center gap-3">
                {inv.status === "paid" ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                )}

                <div>
                  <p className="text-sm font-medium text-gray-200 capitalize">
                    {inv.plan}
                  </p>

                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock className="w-3 h-3 text-gray-600" />
                    <span className="text-xs text-gray-500">{inv.date}</span>
                    <span className="text-xs text-gray-600">·</span>
                    <span className="text-xs text-gray-500">
                      {inv.method || "card"}
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      inv.status === "paid"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {inv.currency?.toUpperCase()}{" "}
                    {Number(inv.amount).toLocaleString()}
                  </p>

                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      inv.status === "paid"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>

                {inv.status === "paid" && (
                  <button className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 text-gray-500 hover:text-white transition">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
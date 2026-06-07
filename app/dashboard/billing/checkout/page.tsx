"use client";

import { authService } from "@/components/api/authService";
import { useState } from "react";

const PLANS = [
  {
    label: "Pro - Monthly ($4.99)",
    plan: "pro",
    cycle: "monthly",
  },
  {
    label: "Pro - Semester ($11.99)",
    plan: "pro",
    cycle: "semester",
  },
  {
    label: "Premium - Monthly ($7.99)",
    plan: "premium",
    cycle: "monthly",
  },
  {
    label: "Premium - Semester ($19.99)",
    plan: "premium",
    cycle: "semester",
  },
];

const Page = () => {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const handleCheckout = async (plan: string, cycle: string, index: number) => {
    try {
      setLoadingIndex(index);

      const data = await authService.stripeBilling({
        plan,
        cycle,
      });

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Stripe checkout error:", error);
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-6">
      {PLANS.map((p, index) => (
        <button
          key={index}
          onClick={() => handleCheckout(p.plan, p.cycle, index)}
          disabled={loadingIndex === index}
          className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm"
        >
          {loadingIndex === index ? "Redirecting..." : p.label}
        </button>
      ))}
    </div>
  );
};

export default Page;
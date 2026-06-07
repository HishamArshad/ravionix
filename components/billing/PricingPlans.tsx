"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Star, Sparkles } from "lucide-react";
import { authService } from "../api/authService";

type BillingCycle = "monthly" | "semester";

type User = {
  subscription_status: "free" | "pro" | "premium";
};

const PLANS = [
  {
    key: "free",
    name: "Free",
    icon: Star,
    monthlyPrice: 0,
    semesterPrice: 0,
    description: "Perfect for trying StudyAI",
    color: "border-white/10",
    cardBg: "bg-white/5",
    buttonClass: "bg-white/10 text-gray-300 hover:bg-white/20",
    features: [
      "1,100 humanizer words/day",
      "1 assignment/day",
      "2 MCQ/day",
      "1 summary/day",
    ],
  },

  {
    key: "pro",
    name: "Pro",
    icon: Zap,
    monthlyPrice: 3.99,
    semesterPrice: 9.99,
    description: "Best for daily study workflow",
    color: "border-purple-500/40",
    cardBg: "bg-gradient-to-b from-purple-500/10 to-pink-500/10",
    buttonClass:
      "bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90",
    features: [
      "50,000 humanizer words/day",
      "10 assignments/day",
      "20 MCQ/day",
      "10 summaries/day",
      "Priority processing",
      "Advanced AI quality",
    ],
    popular: true,
  },

  {
    key: "premium",
    name: "Premium",
    icon: Crown,
    monthlyPrice: 7.99,
    semesterPrice: 19.99,
    description: "Maximum power for heavy users",
    color: "border-yellow-500/30",
    cardBg: "bg-gradient-to-b from-yellow-500/10 to-orange-500/10",
    buttonClass:
      "bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90",
    features: [
      "Unlimited humanizer words",
      "Unlimited assignments",
      "Unlimited MCQs",
      "Fastest AI priority",
      "Best model quality",
    ],
  },
];

export default function PricingPlans() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [user, setUser] = useState<User | null>(null);
const handleCheckout = async (planKey: string, cycle: string) => {
  try {
    const res = await authService.stripeBilling({
      plan: planKey,
      cycle,
    });

    if (res?.url) {
      window.location.href = res.url;
    }
  } catch (err) {
    console.error(err);
  }
};
  useEffect(() => {
    (async () => {
      const res = await authService.getMe();
      setUser(res);
    })();
  }, []);

  if (!user) return null;

  const currentPlan = user.subscription_status;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Choose Your Plan
        </h2>

        {/* TOGGLE */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
          {(["monthly", "semester"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setCycle(item)}
              className={`px-4 py-2 rounded-lg text-sm ${
                cycle === item
                  ? "bg-white/10 text-white"
                  : "text-gray-500"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* PLANS */}
      <div className="grid md:grid-cols-3 gap-5">
        {PLANS.map((plan, i) => {
          const isCurrent = currentPlan === plan.key;
          const isFree = plan.key === "free";

          return (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`relative rounded-3xl border p-6 ${plan.color} ${plan.cardBg}`}
            >
              {/* BADGES */}
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  POPULAR
                </div>
              )}

              {/* ICON */}
              <div className="flex items-center gap-3 mb-4">
                <plan.icon className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">
                  {plan.name}
                </h3>
              </div>

              <p className="text-xs text-gray-400 mb-4">
                {plan.description}
              </p>

              {/* PRICE */}
              <div className="mb-6">
                {isFree ? (
                  <div className="text-4xl font-bold text-white">
                    Free
                  </div>
                ) : (
                  <>
                    <div className="flex items-end gap-1">
                      <span className="text-sm text-gray-400">
                        USD
                      </span>
                      <span className="text-5xl font-bold text-white">
                        {cycle === "monthly"
                          ? plan.monthlyPrice
                          : plan.semesterPrice}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      {cycle === "monthly"
                        ? "per month"
                        : "per 3 months"}
                    </p>
                  </>
                )}
              </div>

              {/* CTA */}
     <button
  onClick={() => handleCheckout(plan.key, cycle)}
  disabled={isCurrent}
  className={`w-full py-3 rounded-xl text-sm font-semibold ${
    isCurrent
      ? "bg-white/10 text-gray-400 cursor-not-allowed"
      : plan.buttonClass
  }`}
>
  {isCurrent ? "Current Plan" : `Get ${plan.name}`}
</button>

              {/* FEATURES */}
              <div className="mt-6 space-y-2">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5" />
                    <span className="text-sm text-gray-300">
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
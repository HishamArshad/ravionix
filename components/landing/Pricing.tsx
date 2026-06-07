"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    description: "Perfect for trying out",
    features: [
      "500 words/day humanizer",
      "2 assignments per month",
      "Basic plagiarism check",
      "Email support",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Student Pro",
    price: "499",
    period: "month",
    description: "For serious students",
    features: [
      "Unlimited humanizer",
      "Unlimited assignments",
      "Advanced plagiarism check",
      "All 6 tools included",
      "Priority support",
      "Export to Word/PDF",
    ],
    cta: "Get Pro",
    popular: true,
  },
  {
    name: "Semester",
    price: "1,999",
    period: "6 months",
    description: "Best value, save 33%",
    features: [
      "Everything in Pro",
      "Priority API access",
      "Early access to features",
      "1-on-1 onboarding",
      "Refund guarantee",
    ],
    cta: "Get Semester",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, <span className="gradient-text">Student-Friendly</span> Pricing
          </h2>
          <p className="text-lg text-gray-400">
            Less than the price of a meal at the cafeteria
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-2xl border ${
                plan.popular
                  ? "bg-gradient-to-b from-purple-500/20 to-pink-500/20 border-purple-500/50 glow"
                  : "bg-white/5 border-white/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xs font-medium">
                  MOST POPULAR
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-sm text-gray-400">PKR </span>
                <span className="text-5xl font-bold">{plan.price}</span>
                <span className="text-gray-400">/{plan.period}</span>
              </div>

              <Link
                href="/signup"
                className={`block text-center w-full py-3 rounded-xl font-medium mb-8 transition ${
                  plan.popular
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="space-y-3">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
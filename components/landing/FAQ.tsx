"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is this allowed by my university?",
    a: "Our tool is designed for learning assistance — drafting, research, and editing. Always check your university's policies on AI usage. We recommend using outputs as a starting point.",
  },
  {
    q: "Will the humanizer bypass Turnitin AI detection?",
    a: "Yes, our humanizer is specifically optimized to produce natural, human-like text that bypasses major AI detectors including Turnitin, GPTZero, and ZeroGPT with 99% success rate.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Absolutely. You can cancel anytime from your dashboard. No questions asked, no hidden fees.",
  },
  {
    q: "Do you offer group discounts for classes?",
    a: "Yes! We offer 25% off for groups of 10+ students. Contact us via WhatsApp for class bundles.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept JazzCash, EasyPaisa, bank transfer, and major credit/debit cards.",
  },
  {
    q: "Is my data safe?",
    a: "100%. We never store your assignments after processing, and all data is encrypted end-to-end.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition"
              >
                <span className="font-medium pr-8">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
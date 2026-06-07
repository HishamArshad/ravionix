"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative p-12 md:p-16 rounded-3xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 border border-white/10 backdrop-blur-sm text-center overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px]" />

          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="gradient-text">Ace Your Semester?</span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join 500+ students who are already using StudyAI to save time and
              get better grades.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-medium glow hover:opacity-90 transition"
            >
              Start Your Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-sm text-gray-400 mt-4">
              No credit card required • Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
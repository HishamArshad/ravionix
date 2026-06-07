"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ahmed K.",
    role: "BS Physics, GCU",
    content:
      "Saved me hours on my thermodynamics assignment. The humanizer is unreal — passed Turnitin AI check perfectly.",
    rating: 5,
  },
  {
    name: "Fatima S.",
    role: "BS English, GCU",
    content:
      "I was skeptical at first but this tool literally got me through finals week. Worth every rupee.",
    rating: 5,
  },
  {
    name: "Hassan M.",
    role: "BS CS, GCU",
    content:
      "The plagiarism checker is more accurate than the one my professor uses. Game changer for submissions.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-24 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Loved by <span className="gradient-text">Students</span>
          </h2>
          <p className="text-lg text-gray-400">
            Real reviews from real GCU students
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                "{t.content}"
              </p>
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-gray-400">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
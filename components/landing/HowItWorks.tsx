"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Sign Up in Seconds",
    description: "Create your account with just your email. No credit card required for the free trial.",
  },
  {
    number: "02",
    title: "Pick Your Tool",
    description: "Choose from assignment generator, humanizer, plagiarism checker, and more.",
  },
  {
    number: "03",
    title: "Get Results Instantly",
    description: "Receive polished, ready-to-submit content within seconds. Export to Word or PDF.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-24 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How <span className="gradient-text">It Works</span>
          </h2>
          <p className="text-lg text-gray-400">
            Three simple steps to academic success
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative p-8 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="text-6xl font-bold gradient-text mb-4 opacity-50">
                {step.number}
              </div>
              <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Wand2,
  Shield,
  BookOpen,
  Calculator,
  FileSearch,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Assignment Generator",
    description:
      "Generate complete, structured assignments on any topic with proper intro, body, and conclusion.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Wand2,
    title: "AI Humanizer",
    description:
      "Convert AI-generated text into natural, human-like writing that bypasses all AI detectors.",
    color: "from-pink-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Plagiarism Checker",
    description:
      "Scan your work against billions of sources and get instant similarity reports with citations.",
    color: "from-orange-500 to-yellow-500",
  },
  {
    icon: BookOpen,
    title: "Citation Generator",
    description:
      "Generate accurate citations in APA, MLA, Chicago, and Harvard styles in seconds.",
    color: "from-blue-500 to-purple-500",
  },
  {
    icon: Calculator,
    title: "Physics Solver",
    description:
      "Solve complex physics and math problems with step-by-step explanations.",
    color: "from-green-500 to-blue-500",
  },
  {
    icon: FileSearch,
    title: "PDF Summarizer",
    description:
      "Upload research papers and get instant summaries to save hours of reading.",
    color: "from-red-500 to-pink-500",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to <span className="gradient-text">Excel</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Six powerful tools in one platform. Stop juggling subscriptions.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-linear-to-br ${feature.color} flex items-center justify-center mb-6`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
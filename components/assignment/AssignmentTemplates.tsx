"use client";

import { motion } from "framer-motion";
import { Atom, Code, BookOpen, Globe, TrendingUp, Microscope } from "lucide-react";

const templates = [
  {
    icon: Atom,
    label: "Physics Report",
    subject: "Physics",
    type: "Lab Report",
    color: "from-blue-500 to-cyan-500",
    shadow: "shadow-blue-500/20",
    prompt: "Write a physics lab report on",
  },
  {
    icon: Code,
    label: "CS Assignment",
    subject: "Computer Science",
    type: "Technical Report",
    color: "from-green-500 to-emerald-500",
    shadow: "shadow-green-500/20",
    prompt: "Write a computer science assignment on",
  },
  {
    icon: BookOpen,
    label: "Literature Essay",
    subject: "English Literature",
    type: "Essay",
    color: "from-orange-500 to-yellow-500",
    shadow: "shadow-orange-500/20",
    prompt: "Write a literature essay analyzing",
  },
  {
    icon: Globe,
    label: "Social Sciences",
    subject: "Sociology",
    type: "Research Paper",
    color: "from-pink-500 to-rose-500",
    shadow: "shadow-pink-500/20",
    prompt: "Write a sociology research paper on",
  },
  {
    icon: TrendingUp,
    label: "Business Case",
    subject: "Business Studies",
    type: "Case Study",
    color: "from-purple-500 to-violet-500",
    shadow: "shadow-purple-500/20",
    prompt: "Write a business case study about",
  },
  {
    icon: Microscope,
    label: "Biology Report",
    subject: "Biology",
    type: "Lab Report",
    color: "from-teal-500 to-green-500",
    shadow: "shadow-teal-500/20",
    prompt: "Write a biology lab report on",
  },
];

interface AssignmentTemplatesProps {
  onSelect?: (template: typeof templates[0]) => void;
}

export default function AssignmentTemplates({ onSelect }: AssignmentTemplatesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-400">Quick Templates</p>
        <button className="text-xs text-gray-500 hover:text-purple-400 transition">
          View all →
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {templates.map((template, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSelect?.(template)}
            className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1"
          >
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center shadow-lg ${template.shadow} group-hover:scale-110 transition-transform`}
            >
              <template.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-gray-300">{template.label}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{template.type}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
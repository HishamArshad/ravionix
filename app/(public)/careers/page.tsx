"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  MapPin,
  Briefcase,
  Users,
  Heart,
  Zap,
  ArrowRight,
  Code,
  PenTool,
  TrendingUp,
} from "lucide-react";

interface JobPosting {
  id: number;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Internship";
  level: "Junior" | "Mid" | "Senior";
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  icon: React.ElementType;
  color: string;
}

const JOBS: JobPosting[] = [
  {
    id: 1,
    title: "Senior AI/ML Engineer",
    department: "Engineering",
    location: "Lahore, Pakistan",
    type: "Full-time",
    level: "Senior",
    salary: "PKR 200k - 300k",
    description:
      "Lead development of our AI models. You'll work on humanizer, assignment generator, and other cutting-edge AI features.",
    requirements: [
      "5+ years AI/ML experience",
      "Proficiency in Python, PyTorch/TensorFlow",
      "Published research or strong GitHub",
      "Experience with LLMs",
    ],
    benefits: [
      "Competitive salary",
      "Remote work option",
      "Stock options",
      "Learning budget",
    ],
    icon: Code,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "Full Stack Developer",
    department: "Engineering",
    location: "Lahore, Pakistan",
    type: "Full-time",
    level: "Mid",
    salary: "PKR 120k - 180k",
    description:
      "Build and improve StudyAI's web platform. Work on frontend (Next.js) and backend (Django/FastAPI).",
    requirements: [
      "3+ years full-stack experience",
      "React/Next.js expertise",
      "Python backend experience",
      "Strong database knowledge",
    ],
    benefits: [
      "Competitive salary",
      "Health insurance",
      "Flexible hours",
      "Career growth",
    ],
    icon: Code,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 3,
    title: "Product Manager",
    department: "Product",
    location: "Lahore, Pakistan",
    type: "Full-time",
    level: "Mid",
    salary: "PKR 100k - 150k",
    description:
      "Own the product roadmap and work directly with students to understand their needs and build features that matter.",
    requirements: [
      "3+ years product management",
      "EdTech experience preferred",
      "Data-driven mindset",
      "Strong communication skills",
    ],
    benefits: [
      "Competitive salary",
      "Equity stake",
      "Flexible work",
      "Professional development",
    ],
    icon: TrendingUp,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 4,
    title: "Marketing Manager",
    department: "Marketing",
    location: "Lahore, Pakistan",
    type: "Full-time",
    level: "Mid",
    salary: "PKR 80k - 120k",
    description:
      "Build StudyAI's brand and growth strategy. Lead campaigns, community building, and partnerships.",
    requirements: [
      "3+ years marketing experience",
      "Social media expertise",
      "Growth hacking mindset",
      "Analytics skills",
    ],
    benefits: [
      "Competitive salary",
      "Performance bonus",
      "Creative freedom",
      "Startup culture",
    ],
    icon: PenTool,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: 5,
    title: "Junior Developer (Internship)",
    department: "Engineering",
    location: "Lahore, Pakistan",
    type: "Internship",
    level: "Junior",
    salary: "PKR 30k - 50k",
    description:
      "Join our team and learn by building real features. Great opportunity for fresh graduates or students.",
    requirements: [
      "Strong fundamentals in programming",
      "Passion for learning",
      "Basic web development knowledge",
      "Eager to contribute",
    ],
    benefits: [
      "Competitive stipend",
      "Mentorship",
      "Certificate",
      "Job offer potential",
    ],
    icon: Code,
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: 6,
    title: "Community Manager",
    department: "Community",
    location: "Remote",
    type: "Part-time",
    level: "Junior",
    salary: "PKR 40k - 60k",
    description:
      "Build and nurture our student community. Manage Discord, answer questions, and gather feedback.",
    requirements: [
      "Excellent communication skills",
      "Community management experience",
      "Passion for education",
      "Available 20-30 hours/week",
    ],
    benefits: [
      "Flexible hours",
      "Remote work",
      "Equity option",
      "Fun community",
    ],
    icon: Users,
    color: "from-indigo-500 to-blue-500",
  },
];

const VALUES = [
  {
    icon: Heart,
    title: "We Care About Students",
    description:
      "We're building for real students solving real problems. Your work directly impacts thousands.",
  },
  {
    icon: Zap,
    title: "Move Fast & Iterate",
    description:
      "We ship fast, learn from students, and improve. No endless meetings, just execution.",
  },
  {
    icon: Users,
    title: "Collaborative Culture",
    description:
      "We're a small team where everyone's voice matters. Your ideas shape our product.",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative py-20 px-6 border-b border-white/5"
      >
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Join the <span className="gradient-text">StudyAI Team</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Help us build tools that transform education for students across
            Pakistan and beyond.
          </p>
        </div>
      </motion.div>

      {/* ── Culture Section ── */}
      <section className="py-16 px-6 bg-white/[0.02] border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            Our Culture
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {VALUES.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center space-y-4"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{value.title}</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Job Listings ── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-12"
          >
            Open Positions
          </motion.h2>

          <div className="space-y-4">
            {JOBS.map((job, i) => {
              const Icon = job.icon;
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${job.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold group-hover:text-purple-400 transition">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-3 flex-wrap mt-2 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                          <span className="px-2 py-0.5 rounded-lg bg-white/5 text-xs">
                            {job.type}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-lg bg-purple-500/10 text-purple-400">
                            {job.level}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-purple-400">{job.salary}</p>
                      <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-purple-400 transition mt-2" />
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">{job.description}</p>

                  <details className="group/details">
                    <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-300 transition flex items-center gap-1">
                      View details
                      <ChevronLeft className="w-4 h-4 rotate-90 group-open/details:rotate-180 transition" />
                    </summary>
                    <div className="mt-4 space-y-4 pt-4 border-t border-white/5">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">
                          Requirements
                        </h4>
                        <ul className="space-y-1">
                          {job.requirements.map((req, j) => (
                            <li key={j} className="text-xs text-gray-500 flex gap-2">
                              <span>•</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">
                          We Offer
                        </h4>
                        <ul className="space-y-1">
                          {job.benefits.map((benefit, j) => (
                            <li key={j} className="text-xs text-gray-500 flex gap-2">
                              <span>✓</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <a
                        href="mailto:careers@studyai.com"
                        className="block text-center mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-medium hover:opacity-90 transition"
                      >
                        Apply Now
                      </a>
                    </div>
                  </details>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-6 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-6 p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
        >
          <h2 className="text-2xl font-bold">Don't see your role?</h2>
          <p className="text-gray-400">
            We're always looking for talented people to join our mission. Send
            us your resume and let's talk!
          </p>
          <a
            href="mailto:careers@studyai.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-medium hover:opacity-90 transition"
          >
            Get in Touch
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </section>
    </div>
  );
}
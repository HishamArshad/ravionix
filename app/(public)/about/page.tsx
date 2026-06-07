"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  Sparkles,
  Users,
  Zap,
  Target,
  Award,
  Heart,
} from "lucide-react";
import Image from "next/image";

const TEAM_MEMBERS = [
  {
    name: "Ahmed Khan",
    role: "Co-founder & CEO",
    bio: "BS Physics student at GCU. Built StudyAI to help fellow students save time.",
    initials: "AK",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Fatima Ali",
    role: "Co-founder & CTO",
    bio: "BS Computer Science. Passionate about AI and education technology.",
    initials: "FA",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Hassan Malik",
    role: "Head of Product",
    bio: "BS Engineering. Focuses on user experience and feature development.",
    initials: "HM",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Sara Hussain",
    role: "Community Manager",
    bio: "Builds relationships with students and gathers feedback for improvements.",
    initials: "SH",
    color: "from-pink-500 to-rose-500",
  },
];

const VALUES = [
  {
    icon: Zap,
    title: "Fast & Efficient",
    description: "Save hours every week with AI-powered tools designed for students.",
  },
  {
    icon: Target,
    title: "Student-Centric",
    description: "Built by students, for students at GCU Lahore. We understand your needs.",
  },
  {
    icon: Heart,
    title: "Affordable",
    description: "Less than the price of a coffee. Education should be accessible to all.",
  },
  {
    icon: Award,
    title: "High Quality",
    description: "Premium features and reliable performance you can count on.",
  },
];

const MILESTONES = [
  { year: "2025", event: "StudyAI launches at GCU Lahore" },
  { year: "2025", event: "500+ students active on platform" },
  { year: "2025", event: "1,000+ assignments generated" },
  { year: "2025", event: "Series A funding goal" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative py-20 px-6 border-b border-white/5"
      >
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            About <span className="gradient-text">StudyAI</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Built by students at GCU Lahore to help every student save time,
            improve grades, and learn smarter.
          </p>
        </div>
      </motion.div>

      {/* ── Story Section ── */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold">Our Story</h2>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              StudyAI was born from frustration. In early 2025, four computer
              science and physics students at GCU Lahore realized they were
              spending hours every week on repetitive academic tasks—writing
              assignments, checking for plagiarism, formatting citations, and
              solving physics problems.
            </p>
            <p>
              They started building tools to automate these tasks, using the
              latest AI technology. What began as internal tools quickly became
              something their classmates wanted to use. Within weeks, 50+
              students were using the beta version.
            </p>
            <p>
              Today, StudyAI helps 500+ students save hundreds of hours every
              month. Our mission is simple: make education more efficient,
              accessible, and stress-free for every student in Pakistan and
              beyond.
            </p>
            <p>
              We're not here to replace learning—we're here to automate the
              boring parts so you can focus on actually understanding the
              material.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── Values Section ── */}
      <section className="py-16 px-6 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-12 text-center"
          >
            Our Core Values
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            {VALUES.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
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

      {/* ── Team Section ── */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-12 text-center"
        >
          Meet the Team
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-6">
          {TEAM_MEMBERS.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-2xl font-bold text-white`}>
                {member.initials}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-purple-400 font-medium">
                  {member.role}
                </p>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Timeline Section ── */}
      <section className="py-16 px-6 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-12 text-center"
          >
            Our Journey
          </motion.h2>
          <div className="relative space-y-8">
            {MILESTONES.map((milestone, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6"
              >
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 ring-4 ring-[#0a0a0f]" />
                  {i < MILESTONES.length - 1 && (
                    <div className="w-1 h-20 bg-gradient-to-b from-purple-500/50 to-transparent" />
                  )}
                </div>
                <div className="pt-1">
                  <p className="text-sm font-bold text-purple-400">
                    {milestone.year}
                  </p>
                  <p className="text-gray-300 mt-1">{milestone.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "500+", label: "Active Students" },
            { value: "1k+", label: "Assignments Generated" },
            { value: "99%", label: "Uptime" },
            { value: "48h", label: "Average Support Response" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <p className="text-3xl md:text-4xl font-bold gradient-text">
                {stat.value}
              </p>
              <p className="text-sm text-gray-400 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-12 px-6 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center space-y-6"
        >
          <h2 className="text-3xl font-bold">Join Our Mission</h2>
          <p className="text-lg text-gray-400">
            Help us make education smarter, faster, and more accessible.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:opacity-90 transition"
            >
              Start Using StudyAI
            </Link>
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 font-semibold hover:bg-white/10 transition"
            >
              Get in Touch
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
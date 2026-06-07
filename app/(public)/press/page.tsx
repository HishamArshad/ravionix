"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Download, ExternalLink, Calendar, Newspaper } from "lucide-react";

interface PressItem {
  id: number;
  type: "announcement" | "media" | "feature";
  title: string;
  publication?: string;
  excerpt: string;
  date: string;
  link: string;
  image?: string;
  icon: React.ElementType;
}

const PRESS_ITEMS: PressItem[] = [
  {
    id: 1,
    type: "announcement",
    title: "StudyAI Reaches 500 Students Milestone",
    excerpt:
      "Our AI toolkit has helped 500+ GCU students save 1000+ hours this semester. We're just getting started.",
    date: "2025-01-15",
    link: "#",
    icon: Newspaper,
  },
  {
    id: 2,
    type: "feature",
    title: "Featured in TechCrunch: Pakistani Startups to Watch",
    publication: "TechCrunch",
    excerpt:
      "StudyAI is among the most innovative edtech startups in South Asia, transforming how students learn.",
    date: "2025-01-10",
    link: "https://techcrunch.com",
    icon: ExternalLink,
  },
  {
    id: 3,
    type: "announcement",
    title: "Introducing Physics Solver - Our Newest Feature",
    excerpt:
      "We've just launched Physics Solver, helping students tackle complex equations and problems step-by-step.",
    date: "2025-01-05",
    link: "#",
    icon: Newspaper,
  },
  {
    id: 4,
    type: "feature",
    title: "AI in Education: An Interview with StudyAI Founders",
    publication: "Pakistani Tech Digest",
    excerpt:
      "Ahmed Khan and Fatima Ali discuss how AI is democratizing education in Pakistan.",
    date: "2024-12-28",
    link: "https://example.com",
    icon: ExternalLink,
  },
];

const MEDIA_KIT = [
  { name: "Logo (PNG)", size: "2.5 MB" },
  { name: "Logo (SVG)", size: "245 KB" },
  { name: "Brand Guidelines", size: "5.2 MB" },
  { name: "Product Screenshots", size: "12 MB" },
  { name: "Founder Photos", size: "15 MB" },
  { name: "Press Release Template", size: "250 KB" },
];

export default function PressPage() {
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
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Press & Media</h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            News, announcements, and updates about StudyAI. Featured in top
            publications across South Asia.
          </p>
        </div>
      </motion.div>

      {/* ── Media Kit CTA ── */}
      <section className="py-8 px-6 bg-white/[0.02] border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold mb-1">Need Our Media Kit?</h3>
              <p className="text-sm text-gray-400">
                Download logos, brand guidelines, and more
              </p>
            </div>
            <button className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-medium hover:opacity-90 transition">
              <Download className="w-4 h-4" />
              Download
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Press Items ── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-12"
          >
            In the News
          </motion.h2>

          <div className="space-y-6">
            {PRESS_ITEMS.map((item, i) => (
              <motion.a
                key={item.id}
                href={item.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group block p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {item.publication && (
                        <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-white/10 text-purple-400 mb-2">
                          {item.publication}
                        </span>
                      )}
                      <h3 className="text-lg font-semibold group-hover:text-purple-400 transition line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-purple-400 transition flex-shrink-0" />
                </div>

                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {item.excerpt}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(item.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Media Kit Downloads ── */}
      <section className="py-16 px-6 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8"
          >
            Media Kit Files
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-4">
            {MEDIA_KIT.map((file, i) => (
              <motion.a
                key={i}
                href="#"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.size}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-6 p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
        >
          <h2 className="text-2xl font-bold">Press Inquiries?</h2>
          <p className="text-gray-400">
            For interviews, feature requests, or partnership opportunities,
            please reach out to our press team.
          </p>
          <a
            href="mailto:press@studyai.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-medium hover:opacity-90 transition"
          >
            press@studyai.com
          </a>
        </motion.div>
      </section>
    </div>
  );
}
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  Search,
  Calendar,
  User,
  Eye,
  MessageSquare,
  TrendingUp,
  Zap,
  BookOpen,
} from "lucide-react";
import Image from "next/image";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  category: "Tips" | "Features" | "Stories" | "Updates" | "Research";
  date: string;
  readTime: number;
  views: number;
  comments: number;
  tags: string[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: "5-tips-to-improve-your-plagiarism-score",
    title: "5 Tips to Improve Your Plagiarism Score",
    excerpt: "Learn practical ways to reduce plagiarism and improve your academic integrity...",
    content: "Full content here...",
    image: "/blog/plagiarism.jpg",
    author: {
      name: "Ahmed Khan",
      avatar: "AK",
      role: "Co-founder",
    },
    category: "Tips",
    date: "2025-01-15",
    readTime: 5,
    views: 1240,
    comments: 28,
    tags: ["plagiarism", "tips", "writing"],
  },
  {
    id: 2,
    slug: "introducing-ai-humanizer-v2",
    title: "Introducing AI Humanizer v2 - Now 50% Smarter",
    excerpt: "We've completely redesigned our humanizer with advanced NLP models...",
    content: "Full content here...",
    image: "/blog/humanizer.jpg",
    author: {
      name: "Fatima Ali",
      avatar: "FA",
      role: "CTO",
    },
    category: "Features",
    date: "2025-01-10",
    readTime: 7,
    views: 2156,
    comments: 45,
    tags: ["feature", "update", "ai"],
  },
  {
    id: 3,
    slug: "how-500-gcu-students-saved-1000-hours",
    title: "How 500 GCU Students Saved 1000+ Hours This Semester",
    excerpt: "Real stories from real students using StudyAI to transform their academic life...",
    content: "Full content here...",
    image: "/blog/success.jpg",
    author: {
      name: "Hassan Malik",
      avatar: "HM",
      role: "Product Lead",
    },
    category: "Stories",
    date: "2025-01-05",
    readTime: 8,
    views: 3450,
    comments: 67,
    tags: ["success", "stories", "students"],
  },
  {
    id: 4,
    slug: "the-rise-of-ai-in-education",
    title: "The Rise of AI in Education: Opportunities & Challenges",
    excerpt: "A comprehensive look at how AI is reshaping the future of learning...",
    content: "Full content here...",
    image: "/blog/ai-education.jpg",
    author: {
      name: "Sara Hussain",
      avatar: "SH",
      role: "Community Manager",
    },
    category: "Research",
    date: "2024-12-28",
    readTime: 12,
    views: 2890,
    comments: 52,
    tags: ["ai", "education", "research"],
  },
  {
    id: 5,
    slug: "studyai-reaches-500-students-milestone",
    title: "StudyAI Reaches 500 Students Milestone! 🎉",
    excerpt: "We're celebrating an incredible journey and thanking our amazing community...",
    content: "Full content here...",
    image: "/blog/milestone.jpg",
    author: {
      name: "Ahmed Khan",
      avatar: "AK",
      role: "Co-founder",
    },
    category: "Updates",
    date: "2024-12-20",
    readTime: 4,
    views: 1876,
    comments: 34,
    tags: ["milestone", "announcement", "celebration"],
  },
  {
    id: 6,
    slug: "physics-solver-beta-launch",
    title: "Physics Solver Beta: Solve Complex Problems Instantly",
    excerpt: "Our newest tool helps you tackle physics and math problems step by step...",
    content: "Full content here...",
    image: "/blog/physics.jpg",
    author: {
      name: "Fatima Ali",
      avatar: "FA",
      role: "CTO",
    },
    category: "Features",
    date: "2024-12-15",
    readTime: 6,
    views: 2340,
    comments: 41,
    tags: ["physics", "math", "solver"],
  },
];

const CATEGORIES = ["All", "Tips", "Features", "Stories", "Updates", "Research"] as const;

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<typeof CATEGORIES[number]>("All");

  const filtered = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory = category === "All" || post.category === category;
      const matchesSearch = 
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative py-20 px-6 border-b border-white/5"
      >
        <div className="max-w-5xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            StudyAI <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Tips, stories, and updates from the StudyAI team. Learn how to study
            smarter and ace your exams.
          </p>
        </div>
      </motion.div>

      {/* ── Search & Filter ── */}
      <section className="py-8 px-6 border-b border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 transition"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  category === cat
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Post ── */}
      {filtered.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-2xl font-bold mb-6"
            >
              Latest Post
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition"
            >
              <Link href={`/blog/${filtered[0].slug}`} className="block">
                <div className="grid md:grid-cols-2 gap-8 p-8">
                  {/* Image */}
                  <div className="h-64 md:h-full min-h-80 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-6xl opacity-60 group-hover:opacity-100 transition overflow-hidden">
                    📰
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-between space-y-4">
                    <div>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/20 text-xs text-purple-400 mb-4"
                      >
                        <TrendingUp className="w-3 h-3" />
                        {filtered[0].category}
                      </motion.span>
                      <h3 className="text-3xl font-bold mb-3 group-hover:text-purple-400 transition">
                        {filtered[0].title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {filtered[0].excerpt}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 flex-wrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {filtered[0].author.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(filtered[0].date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {filtered[0].readTime} min read
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Blog Grid ── */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-400">No posts found matching your search.</p>
              <button
                onClick={() => { setSearch(""); setCategory("All"); }}
                className="mt-4 text-purple-400 hover:text-purple-300"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filtered.slice(1).map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="group rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition flex flex-col h-full">
                      {/* Image */}
                      <div className="h-48 rounded-t-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-5xl opacity-60 group-hover:opacity-100 transition">
                        📄
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col gap-4">
                        <span className={`inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-xs font-medium ${
                          post.category === "Tips"
                            ? "bg-blue-500/20 text-blue-400"
                            : post.category === "Features"
                            ? "bg-purple-500/20 text-purple-400"
                            : post.category === "Stories"
                            ? "bg-pink-500/20 text-pink-400"
                            : post.category === "Updates"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-orange-500/20 text-orange-400"
                        }`}>
                          {post.category}
                        </span>

                        <h3 className="text-lg font-bold group-hover:text-purple-400 transition line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-sm text-gray-400 line-clamp-2 flex-1">
                          {post.excerpt}
                        </p>

                        {/* Tags */}
                        <div className="flex gap-2 flex-wrap">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-xs px-2 py-1 rounded-lg bg-white/5 text-gray-500">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Meta */}
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-600">
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                          <span>{post.readTime} min read</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Newsletter CTA ── */}
      <section className="py-16 px-6 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center space-y-6 p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
        >
          <h2 className="text-2xl font-bold">Stay Updated</h2>
          <p className="text-gray-400">
            Get our latest tips and features delivered to your inbox weekly.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 transition"
            />
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-medium hover:opacity-90 transition">
              Subscribe
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
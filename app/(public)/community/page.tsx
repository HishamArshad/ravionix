"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  Users,
  MessageSquare,
  Award,
  Zap,
  Heart,
  Share2,
  ExternalLink,
  ArrowRight,
  Sparkles,
  BookOpen,
  Trophy,
} from "lucide-react";

const COMMUNITY_FEATURES = [
  {
    icon: MessageSquare,
    title: "Discussion Forum",
    description: "Ask questions, share tips, and learn from 500+ students",
    link: "#forum",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Users,
    title: "Study Groups",
    description: "Find classmates for collaborative learning",
    link: "#groups",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Trophy,
    title: "Leaderboards",
    description: "Compete and see who's earning the most achievements",
    link: "#leaderboard",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: BookOpen,
    title: "Resource Library",
    description: "Free study materials, templates, and guides",
    link: "#resources",
    color: "from-green-500 to-emerald-500",
  },
];

const RECENT_DISCUSSIONS = [
  {
    id: 1,
    title: "Tips for passing Physics first paper",
    author: "Ali Khan",
    avatar: "AK",
    replies: 12,
    views: 450,
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    title: "Best way to use StudyAI for group assignments?",
    author: "Sara Ahmed",
    avatar: "SA",
    replies: 8,
    views: 230,
    lastActive: "4 hours ago",
  },
  {
    id: 3,
    title: "Looking for study buddies for upcoming exams",
    author: "Hassan Malik",
    avatar: "HM",
    replies: 15,
    views: 520,
    lastActive: "1 day ago",
  },
];

const TOP_CONTRIBUTORS = [
  { name: "Ahmed K.", points: 2500, avatar: "AK", badge: "Helper" },
  { name: "Fatima A.", points: 2100, avatar: "FA", badge: "Expert" },
  { name: "Hassan M.", points: 1850, avatar: "HM", badge: "Contributor" },
  { name: "Sara H.", points: 1620, avatar: "SH", badge: "Contributor" },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative py-20 px-6 border-b border-white/5"
      >
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Join Our <span className="gradient-text">Community</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Connect with 500+ GCU students. Share tips, ask questions, and
            achieve together.
          </p>
        </div>
      </motion.div>

      {/* ── Features Grid ── */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-4">
            {COMMUNITY_FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.a
                  key={i}
                  href={feature.link}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition space-y-4"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-purple-400 group-hover:translate-x-1 transition">
                    Explore
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Recent Discussions ── */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              Latest <span className="gradient-text">Discussions</span>
            </h2>
            <a
              href="#"
              className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-2"
            >
              View All
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-3">
            {RECENT_DISCUSSIONS.map((discussion, i) => (
              <motion.a
                key={discussion.id}
                href="#"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group block p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      {discussion.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white group-hover:text-purple-400 transition truncate">
                        {discussion.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        by {discussion.author} •{" "}
                        <span className="text-gray-600">
                          {discussion.lastActive}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 flex-shrink-0">
                    <div className="text-center">
                      <div className="font-semibold text-gray-300">
                        {discussion.replies}
                      </div>
                      <div className="text-xs">replies</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-300">
                        {discussion.views}
                      </div>
                      <div className="text-xs">views</div>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Contributors ── */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8"
          >
            Top <span className="gradient-text">Contributors</span>
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-6">
            {TOP_CONTRIBUTORS.map((contributor, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold mx-auto">
                  {contributor.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{contributor.name}</h3>
                  <p className="text-xs text-purple-400 font-medium mt-1">
                    {contributor.badge}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-1 text-yellow-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-bold">{contributor.points}</span>
                  <span className="text-xs text-gray-500">points</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

{/* ── Events ── */}
<section className="py-20 px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-white/[0.02]">
  <div className="max-w-6xl mx-auto">
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="space-y-10"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-purple-400 font-medium mb-2">
            Community
          </p>

          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Upcoming{" "}
            <span className="gradient-text">Events</span>
          </h2>

          <p className="text-gray-500 mt-3 max-w-2xl">
            Participate in quizzes, live study sessions, and leaderboard
            competitions to earn rewards and improve your skills.
          </p>
        </div>

        <button className="w-fit px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm text-gray-300 hover:text-white">
          View All Events
        </button>
      </div>

      {/* Events List */}
      <div className="grid gap-4">
        {[
          {
            date: "Jan 25",
            title: "Physics Quiz Marathon",
            participants: 45,
            prize: "Free Pro Month",
            color: "from-purple-500 to-pink-500",
          },
          {
            date: "Jan 30",
            title: "Study Tips Live Session",
            participants: 32,
            prize: "Certificates",
            color: "from-blue-500 to-cyan-500",
          },
          {
            date: "Feb 5",
            title: "Monthly Leaderboard Reset",
            participants: 200,
            prize: "Badges & Points",
            color: "from-green-500 to-emerald-500",
          },
        ].map((event, i) => (
          <motion.a
            key={i}
            href="#"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300"
          >
            {/* Glow */}
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r ${event.color} transition duration-500`}
            />

            <div className="relative p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-5">
              {/* Date */}
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${event.color} flex flex-col items-center justify-center flex-shrink-0 shadow-lg`}
              >
                <span className="text-xs font-medium text-white/80">
                  {event.date.split(" ")[0]}
                </span>

                <span className="text-lg font-bold text-white leading-none">
                  {event.date.split(" ")[1]}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-lg font-semibold text-white group-hover:text-purple-300 transition">
                    {event.title}
                  </h4>

                  <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-wide text-gray-400">
                    Live Event
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-400">
                  <span>
                    👥 {event.participants} Participants
                  </span>

                  <span>
                    🎁 {event.prize}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/5 border border-white/10 group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition">
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-purple-300 transition" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  </div>
</section>

      {/* ── Community Guidelines ── */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold">Community Guidelines</h2>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  icon: Heart,
                  title: "Be Respectful",
                  desc: "Treat all members with kindness and respect",
                },
                {
                  icon: Zap,
                  title: "Be Helpful",
                  desc: "Share knowledge and help others learn",
                },
                {
                  icon: Award,
                  title: "Be Honest",
                  desc: "Share authentic experiences and feedback",
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <Icon className="w-8 h-8 mx-auto text-purple-400 mb-2" />
                    <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <p className="text-sm text-gray-400">
                Read our full{" "}
                <a href="#" className="text-blue-400 hover:text-blue-300">
                  Community Guidelines
                </a>{" "}
                to understand community standards.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Join CTA ── */}
      <section className="py-12 px-6 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-center space-y-6"
        >
          <Users className="w-16 h-16 text-purple-400 mx-auto" />
          <div>
            <h3 className="text-2xl font-bold mb-2">
              Join 500+ GCU Students Today
            </h3>
            <p className="text-gray-400">
              Connect, learn, and grow together in our thriving community.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://discord.gg/studyai"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              Join Discord Server
            </a>
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-medium transition flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp Group
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
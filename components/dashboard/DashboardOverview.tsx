"use client";

import { motion } from "framer-motion";
import {
  Wand2,
  FileText,
  Shield,
  BookOpen,
  Calculator,
  FileSearch,
  TrendingUp,
  Clock,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Award,
  Flame,
  Target,
  AlertCircle,
  Share2,
  Download,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { authState } from "../store/auth";
import { observer } from "@legendapp/state/react";
import { useEffect, useState } from "react";
import { authService } from "../api/authService";
// ── Stats Cards ────────────────────────────────────────
 

// ── Activity Feed ──────────────────────────────────────
const RECENT_ACTIVITY = [
  {
    tool: "Humanizer",
    action: "Humanized 450-word essay on thermodynamics",
    time: "2 hours ago",
    icon: Wand2,
    color: "text-pink-400",
  },
  {
    tool: "Assignment",
    action: "Generated 1500-word climate change report",
    time: "3 hours ago",
    icon: FileText,
    color: "text-purple-400",
  },
  {
    tool: "Citation",
    action: "Created 12 APA citations for research",
    time: "5 hours ago",
    icon: BookOpen,
    color: "text-blue-400",
  },
  {
    tool: "Physics",
    action: "Solved kinematics problem with 4 steps",
    time: "6 hours ago",
    icon: Calculator,
    color: "text-green-400",
  },
];

// ── Learning Tips ──────────────────────────────────────
const TIPS = [
  {
    icon: Sparkles,
    title: "Pro Tip: Chain Your Tools",
    description:
      "Generate an assignment, humanize it, then check plagiarism all in one flow!",
  },
  {
    icon: Target,
    title: "Upgrade for Unlimited Access",
    description:
      "Pro users get unlimited usage across all tools + priority processing.",
  },
  {
    icon: Award,
    title: "Referral Program",
    description:
      "Invite friends and both get 10% discount on upgrades. Unlimited earnings!",
  },
];

// ── Container Animation ────────────────────────────────
function StaggerContainer({
  children,
  delay = 0.05,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * delay }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────
 
  export default observer(function DashboardOverview() {
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await authService.dashboardOverview();
        setDashboard(res);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  // ── derived data (NOW SAFE) ───────────────────────

  const QUICK_STATS = dashboard?.quick_stats
    ? [
        {
          label: "This Week",
          value: dashboard.quick_stats.this_week,
          change: "+23%",
          icon: TrendingUp,
          color: "text-purple-400",
          bg: "bg-purple-500/10",
        },
        {
          label: "Total Usage",
          value: dashboard.quick_stats.total_usage,
          change: "+15% from last week",
          icon: Zap,
          color: "text-yellow-400",
          bg: "bg-yellow-500/10",
        },
        {
          label: "Time Saved",
          value: `${dashboard.quick_stats.time_saved_hours}h`,
          change: "2.5 hours today",
          icon: Clock,
          color: "text-green-400",
          bg: "bg-green-500/10",
        },
        {
          label: "Streak",
          value: `${dashboard.quick_stats.streak_days} days`,
          change: "Keep it going! 🔥",
          icon: Flame,
          color: "text-orange-400",
          bg: "bg-orange-500/10",
        },
      ]
    : [];

  const TOOLS =
    dashboard?.tools?.map((tool: any) => {
      const iconMap: any = {
        humanizer: Wand2,
        assignment: FileText,
        mcq: BookOpen,
        summarizer: Shield,
      };

      const colorMap: any = {
        humanizer: "text-pink-400",
        assignment: "text-purple-400",
        mcq: "text-blue-400",
        summarizer: "text-orange-400",
      };

      return {
        name:
          tool.name === "humanizer"
            ? "AI Humanizer"
            : tool.name === "assignment"
            ? "Assignment Generator"
            : tool.name === "mcq"
            ? "MCQ Generator"
            : "AI Summarizer",

        icon: iconMap[tool.name],
        href: `/dashboard/${tool.name}`,
        color: colorMap[tool.name],
        bg: "bg-white/5 border-white/10",

        count: tool.uses_today,
        label: `${tool.remaining} remaining`,
        description: "Powered by StudyAI",
        lastUsed: tool.last_used,
      };
    }) || [];
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {authState.user.first_name.get()}! 👋</h1>
          <p className="text-gray-400 text-sm mt-1">
            Tuesday, January 28, 2025 · Keep your 12-day streak alive!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-gray-300 transition">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-gray-300 transition"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </div>
      </motion.div>

      {/* ── Premium Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-5 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              Upgrade to Student Pro
            </p>
            <p className="text-xs text-gray-300 mt-0.5">
              Unlimited usage on all tools + priority processing for just
              PKR 499/month
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/billing"
          className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-semibold hover:opacity-90 transition flex items-center gap-2"
        >
          Upgrade Now
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {QUICK_STATS.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`p-5 rounded-2xl border ${stat.bg} border-white/10`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs text-gray-500">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ── Main Content ── */}
        <div className="lg:col-span-2 space-y-8">
          {/* All Tools */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">All Tools</h2>
              <Link
                href="/dashboard/history"
                className="text-xs text-purple-400 hover:text-purple-300 transition flex items-center gap-1"
              >
                View All Activity
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {TOOLS.map((tool, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  whileHover={{ y: -4 }}
                  className={`relative p-5 rounded-2xl border ${tool.bg} hover:border-white/30 transition group cursor-pointer overflow-hidden`}
                >
                  {/* Background gradient */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-white/5 to-transparent" />

                  {/* Content */}
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center`}>
                        <tool.icon className={`w-5 h-5 ${tool.color}`} />
                      </div>
                      <span className={`text-2xl font-bold ${tool.color}`}>
                        {tool.count}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {tool.description}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      {tool.label}
                    </p>
                    <p className="text-[10px] text-gray-700 mt-1">
                      Last used: {tool.lastUsed}
                    </p>

                    {/* Hover CTA */}
                    <Link
                      href={tool.href}
                      className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40 backdrop-blur-sm"
                    >
                      <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-sm font-medium text-white">
                        Open Tool
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">Recent Activity</h2>
              <Link
                href="/dashboard/history"
                className="text-xs text-purple-400 hover:text-purple-300 transition flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2">
              {RECENT_ACTIVITY.map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.06 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 group-hover:text-white transition">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {activity.time}
                    </p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">
          {/* Tips & Tricks */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold px-1">Tips & Tricks</h3>
            {TIPS.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-white/20 transition group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <tip.icon className="w-4 h-4 text-purple-400" />
                  <p className="text-xs font-semibold text-gray-200 group-hover:text-white transition">
                    {tip.title}
                  </p>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {tip.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Usage Alert */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/20"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-yellow-300">
                  Daily Limit Approaching
                </p>
                <p className="text-xs text-gray-400 mt-1">
  You've used{" "}
  {dashboard?.usage?.humanizer?.used ?? 0}/
  {dashboard?.usage?.humanizer?.limit ?? 0} humanizer words.
</p>
                <Link
                  href="/dashboard/billing"
                  className="text-xs text-yellow-400 hover:text-yellow-300 mt-2 inline-flex items-center gap-1 transition"
                >
                  View Plans
                  <ArrowRight className="w-2.5 h-2.5" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Referral Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <Share2 className="w-4 h-4 text-green-400" />
              <p className="text-xs font-semibold text-green-300">
                Invite Friends
              </p>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Get 10% off for every friend who signs up.
            </p>
            <button className="w-full py-2 rounded-lg bg-green-500/20 border border-green-500/30 text-xs text-green-400 hover:bg-green-500/30 transition font-medium">
              Get Referral Link
            </button>
          </motion.div>

          {/* Study Streak */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20 text-center"
          >
            <div className="text-3xl mb-2">🔥</div>
            <p className="text-xs font-semibold text-orange-300">
              12-Day Streak!
            </p>
            <p className="text-[10px] text-gray-500 mt-1">
              Keep using StudyAI daily to maintain your streak
            </p>
            <div className="mt-3 pt-3 border-t border-orange-500/10">
              <p className="text-[10px] text-gray-600">
                Come back tomorrow to extend your streak
              </p>
            </div>
          </motion.div>

          {/* Need Help */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20"
          >
            <p className="text-xs font-semibold text-blue-300 mb-2">
              Need Help?
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Check our docs or contact support via WhatsApp
            </p>
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center py-2 rounded-lg bg-green-500/20 text-xs text-green-400 hover:bg-green-500/30 transition font-medium"
            >
              💬 WhatsApp Support
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
})
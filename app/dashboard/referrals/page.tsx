// ## `app/dashboard/referrals/page.tsx`
// ```tsx
// import ReferralPage from "@/components/referrals/ReferralPage";

// export default function Referrals() {
//   return <ReferralPage />;
// }
// ```

// ## `components/referrals/ReferralPage.tsx`
// ```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Share2,
  Copy,
  CheckCircle,
  Users,
  Gift,
  TrendingUp,
  DollarSign,
  Mail,
  MessageCircle,
//   Twitter,
  Link as LinkIcon,
  Award,
  Zap,
  Clock,
  ChevronRight,
} from "lucide-react";

const REFERRAL_STATS = [
  {
    label: "Total Referrals",
    value: 12,
    icon: Users,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    label: "Earnings",
    value: "PKR 6,000",
    icon: DollarSign,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    label: "Conversions",
    value: "8",
    icon: TrendingUp,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    label: "Pending Rewards",
    value: "PKR 2,000",
    icon: Gift,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
];

const REFERRALS = [
  {
    name: "Fatima Ahmed",
    email: "fatima@example.com",
    status: "Active",
    joinedDate: "Jan 15, 2025",
    signupBonus: "PKR 500",
    referrerBonus: "PKR 500",
    revenue: "PKR 1,500",
  },
  {
    name: "Hassan Khan",
    email: "hassan@example.com",
    status: "Active",
    joinedDate: "Jan 10, 2025",
    signupBonus: "PKR 500",
    referrerBonus: "PKR 500",
    revenue: "PKR 2,000",
  },
  {
    name: "Zain Ali",
    email: "zain@example.com",
    status: "Pending",
    joinedDate: "Jan 28, 2025",
    signupBonus: "—",
    referrerBonus: "—",
    revenue: "—",
  },
];

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://studyai.gcu.io/ref/ahmed_khan_12345";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
          <Share2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Referral Program</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Invite friends and earn rewards for every signup
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {REFERRAL_STATS.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-5 rounded-2xl border ${stat.bg} border-white/10`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs text-gray-500">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Referral Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30"
          >
            <h2 className="text-lg font-bold mb-4">Your Referral Link</h2>
            <div className="flex gap-3">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                <LinkIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <code className="text-sm text-gray-300 truncate font-mono">
                  {referralLink}
                </code>
              </div>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition ${
                  copied
                    ? "bg-green-500/20 border border-green-500/30 text-green-400"
                    : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90"
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </>
                )}
              </button>
            </div>

            {/* Share Options */}
            <div className="mt-6 pt-6 border-t border-green-500/20 space-y-3">
              <p className="text-sm text-gray-400 mb-3">Share via:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Mail, label: "Email", color: "text-blue-400" },
                  { icon: MessageCircle, label: "WhatsApp", color: "text-green-400" },
                //   { icon: Twitter, label: "Twitter", color: "text-sky-400" },
                  { icon: Copy, label: "Copy", color: "text-gray-400" },
                ].map((method, i) => (
                  <button
                    key={i}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-medium transition"
                  >
                    <method.icon className={`w-4 h-4 ${method.color}`} />
                    <span className="hidden sm:inline">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <h2 className="text-lg font-bold mb-6">How It Works</h2>
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Share Your Link",
                  desc: "Send your unique referral link to friends via email, WhatsApp, or social media",
                },
                {
                  step: "2",
                  title: "They Sign Up",
                  desc: "Your friend creates an account using your referral link",
                },
                {
                  step: "3",
                  title: "You Earn Money",
                  desc: "You get PKR 500 for each friend who signs up + 10% of their first purchase",
                },
                {
                  step: "4",
                  title: "Track Earnings",
                  desc: "Monitor your referrals and earnings in real-time from this dashboard",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-medium text-gray-200">{item.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Referrals Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
          >
            <div className="p-6 border-b border-white/5">
              <h2 className="text-lg font-bold">Your Referrals</h2>
              <p className="text-sm text-gray-500 mt-1">
                Track all your successful referrals and earnings
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {REFERRALS.map((ref, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-200">
                            {ref.name}
                          </p>
                          <p className="text-xs text-gray-500">{ref.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
                            ref.status === "Active"
                              ? "bg-green-500/20 text-green-400 border border-green-500/20"
                              : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20"
                          }`}
                        >
                          {ref.status === "Active" ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {ref.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {ref.joinedDate}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-green-400">
                          {ref.revenue}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Rewards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
          >
            <div className="flex items-center gap-2 mb-3">
              <Gift className="w-4 h-4 text-yellow-400" />
              <p className="text-sm font-semibold text-yellow-300">Rewards Tier</p>
            </div>
            <div className="space-y-2">
              {[
                { milestone: "10 referrals", reward: "Free month" },
                { milestone: "25 referrals", reward: "2 months free" },
                { milestone: "50 referrals", reward: "Free lifetime" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{item.milestone}</span>
                  <span className="text-yellow-400 font-medium">→ {item.reward}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Referrer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
          >
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-purple-400" />
              <p className="text-sm font-semibold text-purple-300">Your Rank</p>
            </div>
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-purple-400">#47</p>
              <p className="text-xs text-gray-500 mt-1">Top referrer this month</p>
            </div>
            <p className="text-xs text-gray-600 border-t border-white/5 pt-3 mt-3">
              You're in the top 1% of referrers. Keep it up! 🚀
            </p>
          </motion.div>

          {/* Payment Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-yellow-400" />
              <p className="text-sm font-semibold text-gray-200">Payment</p>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-gray-500 mb-0.5">Next Payout</p>
                <p className="font-semibold text-green-400">Feb 15, 2025</p>
              </div>
              <div>
                <p className="text-gray-500 mb-0.5">Payout Method</p>
                <p className="text-gray-300">JazzCash: 0300-1234567</p>
              </div>
              <button className="w-full mt-2 text-center py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition text-xs font-medium">
                Change Payout
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
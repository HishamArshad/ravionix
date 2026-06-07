"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Wand2,
  FileText,
  Shield,
  BookOpen,
  Calculator,
  FileSearch,
  History,
  Settings,
  CreditCard,
  X,
  ChevronRight,
  Home,
  Share2,
  HelpCircle,
  LogOut,
  Zap,
  AlertCircle,
  ArrowUpRight,
  FileUser,
  TrendingUp,
  CircleEllipsis
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    items: [
      {
        name: "Overview",
        href: "/dashboard",
        icon: Home,
        color: "text-blue-400",
      },
      {
        name: "Referrals",
        href: "/dashboard/referrals",
        icon: Share2,
        color: "text-green-400",
        disabled: true,
      },
    ],
  },
  {
    label: "Tools",
    items: [
      {
        name: "AI Humanizer",
        href: "/dashboard/humanizer",
        icon: Wand2,
        color: "text-pink-400",
        disabled: false,
      },
      {
        name: "Assignment Gen",
        href: "/dashboard/assignment",
        icon: FileText,
        color: "text-purple-400",
        disabled: false,
      },
        {
        name: "Ai Summarizer",
        href: "/dashboard/summarizer",
        icon: FileUser,
        color: "text-orange-400",
        disabled: false,
      },
      
              {
        name: "Ai MCQs Generator",
        href: "/dashboard/mcq",
        icon: CircleEllipsis,
        color: "text-cyan-400",
        disabled: false,
      },
      {
        name: "Plagiarism Check",
        href: "/dashboard/plagiarism",
        icon: Shield,
        color: "text-orange-400",
        disabled: true,
      },
      {
        name: "Citation Gen",
        href: "/dashboard/citation",
        icon: BookOpen,
        color: "text-blue-400",
        disabled: true,
      },
      {
        name: "Physics Solver",
        href: "/dashboard/physics",
        icon: Calculator,
        color: "text-green-400",
        disabled: true,
      },
      {
        name: "PDF Summarizer",
        href: "/dashboard/pdf",
        icon: FileSearch,
        color: "text-red-400",
        disabled: true,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        name: "History",
        href: "/dashboard/history",
        icon: History,
        color: "text-cyan-400",
        disabled: false,
      },
      {
        name: "Billing",
        href: "/dashboard/billing",
        icon: CreditCard,
        color: "text-yellow-400",
        disabled: false,
      },
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        color: "text-gray-400",
        disabled: false,
      },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── Sidebar Nav Item ──────────────────────────────────
function NavItem({
  item,
  isActive,
  onClose,
}: {
  item: (typeof navItems[0]["items"])[0];
  isActive: boolean;
  onClose: () => void;
}) {
return (
  <motion.li
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    whileHover={!item.disabled ? { x: 4 } : {}}
  >
    {item.disabled ? (
      <div
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 cursor-not-allowed bg-white/[0.02] border border-white/[0.03] relative"
      >
        <item.icon className={`w-4 h-4 ${item.color} opacity-50`} />

        <span className="flex-1">{item.name}</span>

        <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-medium">
          Upcoming
        </span>
      </div>
    ) : (
      <Link
        href={item.href}
        onClick={onClose}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition group relative
          ${
            isActive
              ? "bg-white/10 text-white shadow-lg shadow-purple-500/10"
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          }`}
      >
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-r-full"
          />
        )}

        <item.icon className={`w-4 h-4 ${item.color}`} />

        <span className="flex-1">{item.name}</span>

        {isActive && (
          <ChevronRight className="w-3 h-3 text-purple-400" />
        )}
      </Link>
    )}
  </motion.li>
); 
}

// ── Main Sidebar Component ────────────────────────────
export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Calculate daily usage percentage
  const creditsUsed = 350;
  const creditsTotal = 500;
  const creditPercentage = (creditsUsed / creditsTotal) * 100;
  const isNearLimit = creditPercentage > 75;

  // Get plan upgrade info
  const userPlan = "Free Plan";
  const isPro = userPlan.includes("Pro");

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0d0d14] border-r border-white/5
          flex flex-col transition-transform duration-300 lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* ── Logo Section ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between p-5 border-b border-white/5"
        >
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Image
                    src="/logo.svg"
                    alt="Ravionix Logo"
                    width={36}
                    height={36}
                    priority
                  />
            </div>
            <span className="text-lg font-bold group-hover:text-purple-300 transition">
              Ravionix
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white hover:bg-white/10 p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>

        {/* ── Credits Badge ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-4 mt-4 p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 space-y-3"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 font-medium">Daily Credits</span>
              <span className={`text-xs font-semibold ${isNearLimit ? "text-red-400" : "text-purple-400"}`}>
                {creditsUsed} / {creditsTotal}
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full transition-all duration-500 ${
                  isNearLimit
                    ? "bg-gradient-to-r from-red-500 to-orange-500"
                    : "bg-gradient-to-r from-purple-500 to-pink-500"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${creditPercentage}%` }}
              />
            </div>
          </div>

          {/* Alert if near limit */}
          {isNearLimit && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-start gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20"
            >
              <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-400 leading-relaxed">
                You're running low on credits. Upgrade for unlimited usage.
              </p>
            </motion.div>
          )}

          {/* Upgrade CTA if not Pro */}
          {!isPro && (
            <Link
              href="/dashboard/billing"
              onClick={onClose}
              className="block w-full py-2 text-center text-xs font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              Upgrade to Pro
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          )}
        </motion.div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navItems.map((section, sectionIndex) => (
            <motion.div
              key={section.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 + sectionIndex * 0.1 }}
            >
              <p className="text-[11px] uppercase tracking-widest text-gray-600 px-3 mb-2.5 font-semibold">
                {section.label}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <NavItem
                      key={item.name}
                      item={item}
                      isActive={isActive}
                      onClose={onClose}
                    />
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </nav>

        {/* ── Pro Banner (if not Pro) ── */}
        {/* {!isPro && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 space-y-3"
          >
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-purple-300">
                  Upgrade to Pro
                </p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Get unlimited access to all tools + priority support
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/billing"
              onClick={onClose}
              className="block w-full py-2 text-center text-xs font-semibold rounded-lg bg-purple-500/30 hover:bg-purple-500/40 border border-purple-500/40 transition"
            >
              View Plans →
            </Link>
          </motion.div>
        )} */}

        {/* ── User Profile ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 border-t border-white/5 space-y-3"
        >
          {/* User Card */}
          <Link
            href="/dashboard/settings?tab=profile"
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold flex-shrink-0 group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-shadow">
              AK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate group-hover:text-purple-300 transition">
                Ahmed Khan
              </p>
              <p className={`text-xs truncate ${isPro ? "text-green-400" : "text-gray-400"}`}>
                {userPlan}
              </p>
            </div>
          </Link>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/dashboard/settings"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition text-xs text-gray-400 hover:text-white"
            >
              <Settings className="w-3.5 h-3.5" />
              Settings
            </Link>
            <Link
              href="/dashboard/referrals"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition text-xs text-gray-400 hover:text-white"
            >
              <Share2 className="w-3.5 h-3.5" />
              Referrals
            </Link>
          </div>

          {/* Support + Logout */}
          <div className="space-y-1 pt-2 border-t border-white/5">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition text-xs text-gray-400 hover:text-white">
              <HelpCircle className="w-3.5 h-3.5" />
              Help & Support
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 transition text-xs text-gray-400 hover:text-red-400">
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </motion.div>
      </aside>
    </>
  );
}
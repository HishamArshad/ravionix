"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Bell,
  Search,
  Command,
  X,
  Zap,
  AlertCircle,
  CheckCircle,
  Info,
  Clock,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import UserProfileMenu from "./UserProfileMenu";
import KeyboardShortcutsModal from "@/components/ui/KeyboardShortcutsModal";
import Link from "next/link";

interface DashboardNavProps {
  onMenuClick: () => void;
}

interface Notification {
  id: number;
  type: "info" | "warning" | "success" | "error";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    href: string;
  };
}

// ── Mock Notifications ─────────────────────────────────
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "success",
    title: "Humanization Complete",
    description: "Your 450-word essay has been successfully humanized",
    timestamp: "2 mins ago",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    title: "Daily Limit Approaching",
    description: "You've used 48/50 humanizer tokens. Upgrade for unlimited.",
    timestamp: "1 hour ago",
    read: false,
    action: { label: "Upgrade", href: "/dashboard/billing" },
  },
  {
    id: 3,
    type: "info",
    title: "New Feature Available",
    description: "Check out our new Physics Solver with step-by-step solutions",
    timestamp: "3 hours ago",
    read: true,
    action: { label: "Try It", href: "/dashboard/physics" },
  },
  {
    id: 4,
    type: "success",
    title: "Payment Received",
    description: "Your referral bonus of PKR 500 has been credited",
    timestamp: "Yesterday",
    read: true,
  },
];

// ── Notification Icon ──────────────────────────────────
function NotificationIcon({ type }: { type: Notification["type"] }) {
  switch (type) {
    case "success":
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    case "warning":
      return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    case "error":
      return <AlertCircle className="w-4 h-4 text-red-400" />;
    case "info":
    default:
      return <Info className="w-4 h-4 text-blue-400" />;
  }
}

// ── Search Dropdown ────────────────────────────────────
function SearchDropdown({
  query,
  onClose,
}: {
  query: string;
  onClose: () => void;
}) {
  const SEARCH_RESULTS = [
    { label: "AI Humanizer", href: "/dashboard/humanizer", icon: "✍️" },
    { label: "Assignment Generator", href: "/dashboard/assignment", icon: "📝" },
    { label: "Plagiarism Checker", href: "/dashboard/plagiarism", icon: "🔍" },
    { label: "Citation Generator", href: "/dashboard/citation", icon: "📚" },
    { label: "Physics Solver", href: "/dashboard/physics", icon: "⚛️" },
    { label: "PDF Summarizer", href: "/dashboard/pdf", icon: "📄" },
    { label: "History", href: "/dashboard/history", icon: "📋" },
    { label: "Billing", href: "/dashboard/billing", icon: "💳" },
    { label: "Settings", href: "/dashboard/settings", icon: "⚙️" },
  ];

  const filtered = query
    ? SEARCH_RESULTS.filter((r) =>
        r.label.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_RESULTS.slice(0, 5);

  return (
  <AnimatePresence>
    {query.trim().length > 0 && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-full left-0 mt-2 w-full max-w-sm bg-[#13131f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
      >
        {filtered.length > 0 ? (
          <div className="max-h-96 overflow-y-auto">
            {filtered.map((result) => (
              <Link
                key={result.href}
                href={result.href}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0 transition"
              >
                <span className="text-lg">{result.icon}</span>
                <span className="text-sm text-gray-300">
                  {result.label}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">
              No results found
            </p>
          </div>
        )}
      </motion.div>
    )}
  </AnimatePresence>
  );
}

// ── Main Component ────────────────────────────────────
export default function DashboardNav({ onMenuClick }: DashboardNavProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(
    MOCK_NOTIFICATIONS
  );
  const [showShortcuts, setShowShortcuts] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ── Keyboard Shortcuts ────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(!searchOpen);
        setTimeout(() => searchInputRef.current?.focus(), 0);
      }
      // Cmd/Ctrl + ? for shortcuts
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "?") {
        e.preventDefault();
        setShowShortcuts(true);
      }
      // Escape to close
      if (e.key === "Escape") {
        setSearchOpen(false);
        setNotificationsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  // ── Close notifications on outside click ────────────
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }

    if (notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [notificationsOpen]);

  // ── Mark notification as read ──────────────────────
  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#0a0a0f]/80 backdrop-blur-lg border-b border-white/5 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden text-gray-400 hover:text-white transition"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search Bar */}
            <div className="hidden md:block relative w-64">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus-within:border-purple-500/50 focus-within:bg-white/10 transition">
                <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search or press Cmd+K"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none w-full"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSearchOpen(false);
                    }}
                    className="text-gray-500 hover:text-white transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                {!searchQuery && (
                  <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-500 font-mono flex-shrink-0">
                    ⌘K
                  </kbd>
                )}
              </div>

              {/* Search Dropdown */}
              <SearchDropdown
                query={searchQuery}
                onClose={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Upgrade Badge */}
            <Link
              href="/dashboard/billing"
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-sm font-medium text-purple-400 hover:from-purple-500/30 hover:to-pink-500/30 transition group"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Upgrade to Pro</span>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/30 text-[10px] font-bold group-hover:bg-purple-500/40 transition">
                ↗
              </span>
            </Link>

            {/* Notifications */}
            <div ref={notificationRef} className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition group"
              >
                <Bell className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center text-[10px] font-bold text-white"
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </motion.span>
                )}
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute -right-2 top-full mt-2 w-96 rounded-2xl bg-[#13131f] border border-white/10 shadow-2xl z-50 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/5">
                      <h3 className="font-semibold">Notifications</h3>
                      {notifications.length > 0 && (
                        <button
                          onClick={clearAllNotifications}
                          className="text-xs text-gray-500 hover:text-white transition"
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => markAsRead(notif.id)}
                            className={`flex items-start gap-3 p-4 border-b border-white/5 cursor-pointer transition hover:bg-white/5 ${
                              !notif.read ? "bg-white/5" : ""
                            }`}
                          >
                            {/* Icon */}
                            <div className="mt-1 flex-shrink-0">
                              <NotificationIcon type={notif.type} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <p className="text-sm font-medium text-gray-200">
                                  {notif.title}
                                </p>
                                {!notif.read && (
                                  <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                {notif.description}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-[10px] text-gray-600 flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5" />
                                  {notif.timestamp}
                                </p>
                                {notif.action && (
                                  <Link
                                    href={notif.action.href}
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-[10px] text-purple-400 hover:text-purple-300 transition font-medium"
                                  >
                                    {notif.action.label}
                                  </Link>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <Bell className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">
                            All caught up! 🎉
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <Link
                        href="/dashboard/settings?tab=notifications"
                        onClick={() => setNotificationsOpen(false)}
                        className="flex items-center justify-center gap-2 w-full py-3 border-t border-white/5 text-xs text-gray-500 hover:text-gray-300 transition"
                      >
                        <Settings className="w-3 h-3" />
                        Notification Settings
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile Menu */}
            <UserProfileMenu />
          </div>
        </div>
      </header>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </>
  );
}
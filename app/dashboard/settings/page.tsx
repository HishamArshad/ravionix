"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SettingsHeader from "@/components/settings/SettingsHeader";
import ProfileSettings from "@/components/settings/ProfileSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import DangerZone from "@/components/settings/DangerZone";
import {
  User,
  Lock,
  Bell,
  Palette,
  AlertTriangle,
} from "lucide-react";

const TABS = [
  { key: "profile", label: "Profile", icon: User, desc: "Personal info" },
  { key: "security", label: "Security", icon: Lock, desc: "Password & sessions" },
  { key: "notifications", label: "Notifications", icon: Bell, desc: "Alerts & emails" },
  { key: "appearance", label: "Appearance", icon: Palette, desc: "Theme & display" },
  { key: "danger", label: "Danger Zone", icon: AlertTriangle, desc: "Delete account" },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("profile");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <SettingsHeader />

      <div className="grid lg:grid-cols-4 gap-6">
        {/* ── Sidebar Nav ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-2"
        >
          <nav className="rounded-2xl bg-white/5 border border-white/10 p-2 space-y-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              const isDanger = tab.key === "danger";
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition group ${
                    isActive
                      ? isDanger
                        ? "bg-red-500/20 border border-red-500/20"
                        : "bg-white/10 border border-white/10"
                      : isDanger
                      ? "hover:bg-red-500/10"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition ${
                    isActive
                      ? isDanger
                        ? "bg-red-500/20"
                        : "bg-purple-500/20"
                      : "bg-white/5"
                  }`}>
                    <tab.icon className={`w-4 h-4 transition ${
                      isActive
                        ? isDanger ? "text-red-400" : "text-purple-400"
                        : isDanger ? "text-red-400/50 group-hover:text-red-400" : "text-gray-400 group-hover:text-gray-200"
                    }`} />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      isActive
                        ? isDanger ? "text-red-400" : "text-white"
                        : isDanger ? "text-red-400/60 group-hover:text-red-400" : "text-gray-400 group-hover:text-gray-200"
                    }`}>
                      {tab.label}
                    </p>
                    <p className="text-[10px] text-gray-600 truncate">{tab.desc}</p>
                  </div>
                  {isActive && (
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      isDanger ? "bg-red-400" : "bg-purple-400"
                    }`} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Help Card */}
          <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 space-y-2">
            <p className="text-xs font-semibold text-purple-400">Need Help?</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Have questions about your account? We're here to help.
            </p>
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center py-2 rounded-xl bg-green-500/20 border border-green-500/20 text-xs text-green-400 font-medium hover:bg-green-500/30 transition"
            >
              💬 WhatsApp Support
            </a>
          </div>
        </motion.div>

        {/* ── Content ── */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === "profile" && <ProfileSettings />}
              {activeTab === "security" && <SecuritySettings />}
              {activeTab === "notifications" && <NotificationSettings />}
              {activeTab === "appearance" && <AppearanceSettings />}
              {activeTab === "danger" && <DangerZone />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
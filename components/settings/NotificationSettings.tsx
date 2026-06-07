"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Mail,
  Smartphone,
  Megaphone,
  Zap,
  CreditCard,
  Shield,
  Gift,
  CheckCircle,
  Loader2,
  Save,
} from "lucide-react";

// ── Toggle Row ─────────────────────────────────────────
function ToggleRow({
  icon: Icon,
  iconColor,
  title,
  description,
  checked,
  onChange,
}: {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
        <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-200">{title}</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{description}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
          checked ? "bg-purple-500" : "bg-white/10"
        }`}
      >
        <motion.div
          animate={{ x: checked ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
        />
      </button>
    </div>
  );
}

// ── Section ────────────────────────────────────────────
function NotifSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-1 pb-3 border-b border-white/5">
        <Icon className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
      </div>
      <div className="divide-y divide-white/5">
        {children}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────
export default function NotificationSettings() {
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [notifs, setNotifs] = useState({
    // Email
    emailUsageAlerts: true,
    emailBilling: true,
    emailNewFeatures: false,
    emailWeeklyReport: true,
    emailMarketing: false,

    // Push
    pushUsageAlerts: true,
    pushBilling: true,
    pushNewFeatures: true,
    pushLoginAlerts: true,

    // In-App
    appUsageWarnings: true,
    appToolCompletion: true,
    appPromoOffers: false,
    appSystemUpdates: true,
  });

  const toggle = (key: keyof typeof notifs) =>
    setNotifs((p) => ({ ...p, [key]: !p[key] }));

  const handleSave = async () => {
    setSaveState("saving");
    await new Promise((r) => setTimeout(r, 1200));
    setSaveState("saved");
    setTimeout(() => setSaveState("idle"), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      {/* Email Notifications */}
      <NotifSection title="Email Notifications" icon={Mail}>
        <ToggleRow
          icon={Zap} iconColor="text-purple-400"
          title="Usage Alerts"
          description="Get notified when approaching daily limits"
          checked={notifs.emailUsageAlerts}
          onChange={() => toggle("emailUsageAlerts")}
        />
        <ToggleRow
          icon={CreditCard} iconColor="text-yellow-400"
          title="Billing Updates"
          description="Payment receipts and subscription changes"
          checked={notifs.emailBilling}
          onChange={() => toggle("emailBilling")}
        />
        <ToggleRow
          icon={Megaphone} iconColor="text-blue-400"
          title="New Features"
          description="Announcements about new tools and updates"
          checked={notifs.emailNewFeatures}
          onChange={() => toggle("emailNewFeatures")}
        />
        <ToggleRow
          icon={Bell} iconColor="text-green-400"
          title="Weekly Usage Report"
          description="Summary of your weekly activity"
          checked={notifs.emailWeeklyReport}
          onChange={() => toggle("emailWeeklyReport")}
        />
        <ToggleRow
          icon={Gift} iconColor="text-pink-400"
          title="Promotions & Offers"
          description="Discount codes and special student deals"
          checked={notifs.emailMarketing}
          onChange={() => toggle("emailMarketing")}
        />
      </NotifSection>

      {/* Push Notifications */}
      <NotifSection title="Push Notifications" icon={Smartphone}>
        <ToggleRow
          icon={Zap} iconColor="text-purple-400"
          title="Usage Warnings"
          description="Alert when you hit 80% of daily limit"
          checked={notifs.pushUsageAlerts}
          onChange={() => toggle("pushUsageAlerts")}
        />
        <ToggleRow
          icon={CreditCard} iconColor="text-yellow-400"
          title="Payment Confirmations"
          description="Instant confirmation of successful payments"
          checked={notifs.pushBilling}
          onChange={() => toggle("pushBilling")}
        />
        <ToggleRow
          icon={Megaphone} iconColor="text-blue-400"
          title="Feature Announcements"
          description="Be first to know about new tools"
          checked={notifs.pushNewFeatures}
          onChange={() => toggle("pushNewFeatures")}
        />
        <ToggleRow
          icon={Shield} iconColor="text-red-400"
          title="Login Alerts"
          description="Notify when your account is accessed"
          checked={notifs.pushLoginAlerts}
          onChange={() => toggle("pushLoginAlerts")}
        />
      </NotifSection>

      {/* In-App Notifications */}
      <NotifSection title="In-App Notifications" icon={Bell}>
        <ToggleRow
          icon={Zap} iconColor="text-orange-400"
          title="Daily Limit Warnings"
          description="Show warning banner when limits are close"
          checked={notifs.appUsageWarnings}
          onChange={() => toggle("appUsageWarnings")}
        />
        <ToggleRow
          icon={CheckCircle} iconColor="text-green-400"
          title="Tool Completion"
          description="Notify when long tasks finish processing"
          checked={notifs.appToolCompletion}
          onChange={() => toggle("appToolCompletion")}
        />
        <ToggleRow
          icon={Gift} iconColor="text-pink-400"
          title="Promo Offers"
          description="Special deals and upgrade offers"
          checked={notifs.appPromoOffers}
          onChange={() => toggle("appPromoOffers")}
        />
        <ToggleRow
          icon={Bell} iconColor="text-blue-400"
          title="System Updates"
          description="Maintenance and platform announcements"
          checked={notifs.appSystemUpdates}
          onChange={() => toggle("appSystemUpdates")}
        />
      </NotifSection>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saveState === "saving"}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition ${
          saveState === "saved"
            ? "bg-green-500/20 border border-green-500/30 text-green-400"
            : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 disabled:opacity-70"
        }`}
      >
        {saveState === "saving" ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
        ) : saveState === "saved" ? (
          <><CheckCircle className="w-4 h-4" /> Preferences Saved!</>
        ) : (
          <><Save className="w-4 h-4" /> Save Preferences</>
        )}
      </button>
    </motion.div>
  );
}
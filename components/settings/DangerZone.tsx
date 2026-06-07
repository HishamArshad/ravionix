"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Download,
  RefreshCw,
  Trash2,
  X,
  AlertCircle,
  Loader2,
  Shield,
  CheckCircle,
  LogOut,
  FileText,
  Clock,
  Info,
} from "lucide-react";

// ── Confirm Modal ──────────────────────────────────────
function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  confirmClassName,
  requireTyping,
  confirmWord,
  isLoading,
  warnings,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  confirmClassName: string;
  requireTyping?: boolean;
  confirmWord?: string;
  isLoading?: boolean;
  warnings?: string[];
}) {
  const [typed, setTyped] = useState("");
  const canConfirm = !requireTyping || typed === confirmWord;

  // Reset typed on close
  const handleClose = () => {
    setTyped("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="p-6 rounded-2xl bg-[#13131f] border border-white/10 shadow-2xl space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{title}</h3>
                    <p className="text-xs text-red-400/70 mt-0.5">
                      This action is irreversible
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-gray-500 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 leading-relaxed">
                {description}
              </p>

              {/* Warnings List */}
              {warnings && warnings.length > 0 && (
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15 space-y-2">
                  <p className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    What will be lost:
                  </p>
                  <ul className="space-y-1.5">
                    {warnings.map((w, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Type to Confirm */}
              {requireTyping && confirmWord && (
                <div>
                  <label className="block text-xs text-gray-500 mb-2">
                    Type{" "}
                    <span className="font-mono font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                      {confirmWord}
                    </span>{" "}
                    to confirm
                  </label>
                  <input
                    type="text"
                    value={typed}
                    onChange={(e) => setTyped(e.target.value)}
                    placeholder={`Type "${confirmWord}" here`}
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 text-sm text-gray-200 placeholder-gray-600 outline-none transition border ${
                      typed && !canConfirm
                        ? "border-red-500/50 focus:border-red-500/70"
                        : canConfirm && typed
                        ? "border-green-500/50"
                        : "border-white/10 focus:border-red-500/40"
                    }`}
                  />
                  {typed && !canConfirm && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-400 mt-1.5 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      Text does not match
                    </motion.p>
                  )}
                  {canConfirm && typed && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-green-400 mt-1.5 flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Confirmed
                    </motion.p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={!canConfirm || isLoading}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed ${confirmClassName}`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    confirmLabel
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Success Toast ──────────────────────────────────────
function SuccessToast({
  message,
  visible,
}: {
  message: string;
  visible: boolean;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-green-500/20 border border-green-500/30 backdrop-blur-lg shadow-2xl"
        >
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          <p className="text-sm font-medium text-green-300 whitespace-nowrap">
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Danger Action Card ─────────────────────────────────
function DangerCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
  buttonLabel,
  buttonClass,
  onClick,
  badge,
  info,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonClass: string;
  onClick: () => void;
  badge?: string;
  info?: string;
}) {
  return (
    <motion.div
      whileHover={{ x: 2 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition group"
    >
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg}`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-gray-200">{title}</p>
            {badge && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 font-medium">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-sm">
            {description}
          </p>
          {info && (
            <p className="text-xs text-blue-400/70 mt-1.5 flex items-center gap-1">
              <Info className="w-3 h-3 flex-shrink-0" />
              {info}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={onClick}
        className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap ${buttonClass}`}
      >
        {buttonLabel}
      </button>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────
export default function DangerZone() {
  const [modal, setModal] = useState<{
    type: "export" | "reset_history" | "reset_settings" | "deactivate" | "delete" | null;
    loading: boolean;
  }>({ type: null, loading: false });

  const [toast, setToast] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });

  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: "" }), 4000);
  };

  const openModal = (
    type: "export" | "reset_history" | "reset_settings" | "deactivate" | "delete"
  ) => setModal({ type, loading: false });

  const closeModal = () => setModal({ type: null, loading: false });

  const handleConfirm = async () => {
    setModal((p) => ({ ...p, loading: true }));
    await new Promise((r) => setTimeout(r, 2000));

    const messages: Record<string, string> = {
      export: "Data export started! Check your email in 5 minutes.",
      reset_history: "All history cleared successfully.",
      reset_settings: "Settings reset to defaults.",
      deactivate: "Account deactivated. You can reactivate anytime.",
      delete: "Account deleted. Goodbye!",
    };

    showToast(messages[modal.type ?? "export"]);
    setModal({ type: null, loading: false });
  };

  // ── Modal configs ──────────────────────────────────
  const MODAL_CONFIGS = {
    export: {
      title: "Export Your Data",
      description:
        "We'll prepare a complete ZIP archive of all your account data including activity history, generated assignments, humanized texts, citations, plagiarism reports, and account settings. You'll receive a download link via email.",
      confirmLabel: "Start Export",
      confirmClassName:
        "bg-blue-500 text-white hover:bg-blue-600",
      requireTyping: false,
      warnings: undefined,
    },
    reset_history: {
      title: "Reset Activity History",
      description:
        "This will permanently delete your entire activity history. Your account, subscription, and settings will not be affected. This cannot be undone.",
      confirmLabel: "Reset History",
      confirmClassName:
        "bg-orange-500/20 border border-orange-500/30 text-orange-300 hover:bg-orange-500/30",
      requireTyping: true,
      confirmWord: "RESET",
      warnings: [
        "All humanizer history (48 entries)",
        "All generated assignments (12 entries)",
        "All plagiarism check reports (23 entries)",
        "All citation history (67 entries)",
        "All physics solutions (31 entries)",
        "All PDF summaries (9 entries)",
      ],
    },
    reset_settings: {
      title: "Reset All Settings",
      description:
        "This will reset all your preferences — profile information, notification settings, appearance, and security settings — back to defaults. Your subscription and history will not be affected.",
      confirmLabel: "Reset Settings",
      confirmClassName:
        "bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/30",
      requireTyping: true,
      confirmWord: "RESET",
      warnings: [
        "Profile information will be cleared",
        "Notification preferences reset to default",
        "Appearance settings reset to dark theme",
        "Two-factor authentication will be disabled",
      ],
    },
    deactivate: {
      title: "Deactivate Account",
      description:
        "Your account will be temporarily disabled. You won't be able to log in or use any tools until you reactivate. Your data will be preserved for 90 days, after which it will be permanently deleted if not reactivated.",
      confirmLabel: "Deactivate Account",
      confirmClassName:
        "bg-gray-500/20 border border-gray-500/30 text-gray-300 hover:bg-gray-500/30",
      requireTyping: true,
      confirmWord: "DEACTIVATE",
      warnings: [
        "Immediate loss of access to all tools",
        "Active subscription will be paused",
        "Data preserved for 90 days only",
        "Team members will lose access",
      ],
    },
    delete: {
      title: "Permanently Delete Account",
      description:
        "This is the most destructive action you can take. Your account, all data, history, and subscription will be permanently and immediately deleted with no possibility of recovery. There are no refunds for any remaining subscription time.",
      confirmLabel: "Permanently Delete Everything",
      confirmClassName:
        "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600",
      requireTyping: true,
      confirmWord: "DELETE MY ACCOUNT",
      warnings: [
        "Account and all personal data — gone forever",
        "All 190+ activity history entries — deleted",
        "Subscription cancelled, no refund issued",
        "Generated content and downloads — deleted",
        "This CANNOT be reversed under any circumstances",
      ],
    },
  };

  const activeConfig = modal.type ? MODAL_CONFIGS[modal.type] : null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-5"
      >
        {/* ── Warning Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4 p-5 rounded-2xl bg-red-500/5 border border-red-500/20"
        >
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-red-400">
              Danger Zone
            </p>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Actions in this section are permanent and cannot be undone.
              Please read each description carefully before proceeding. If
              you're unsure, contact{" "}
              <a
                href="https://wa.me/923001234567"
                className="text-green-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                support
              </a>{" "}
              before taking any action.
            </p>
          </div>
        </motion.div>

        {/* ── Account Data Section ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <FileText className="w-3.5 h-3.5 text-gray-500" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Account Data
            </p>
          </div>

          {/* Export Data */}
          <DangerCard
            icon={Download}
            iconBg="bg-blue-500/10"
            iconColor="text-blue-400"
            title="Export My Data"
            description="Download a complete archive of all your account data, history, and generated content as a ZIP file."
            buttonLabel="Export Data"
            buttonClass="bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
            onClick={() => openModal("export")}
            info="Delivered to your email within 5 minutes"
          />

          {/* Reset History */}
          <DangerCard
            icon={RefreshCw}
            iconBg="bg-orange-500/10"
            iconColor="text-orange-400"
            title="Clear Activity History"
            description="Permanently delete all your tool usage history — assignments, humanizations, plagiarism checks, citations, and more."
            buttonLabel="Clear History"
            buttonClass="bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20"
            onClick={() => openModal("reset_history")}
            badge="Irreversible"
          />
        </div>

        {/* ── Account Settings Section ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Account Settings
            </p>
          </div>

          {/* Reset Settings */}
          <DangerCard
            icon={RefreshCw}
            iconBg="bg-yellow-500/10"
            iconColor="text-yellow-400"
            title="Reset All Settings"
            description="Reset your profile, notifications, appearance, and security settings back to their default values."
            buttonLabel="Reset Settings"
            buttonClass="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
            onClick={() => openModal("reset_settings")}
          />
        </div>

        {/* ── Account Status Section ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <LogOut className="w-3.5 h-3.5 text-gray-500" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Account Status
            </p>
          </div>

          {/* Deactivate */}
          <DangerCard
            icon={LogOut}
            iconBg="bg-gray-500/10"
            iconColor="text-gray-400"
            title="Deactivate Account"
            description="Temporarily disable your account. All data is preserved for 90 days and you can reactivate at any time."
            buttonLabel="Deactivate"
            buttonClass="bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
            onClick={() => openModal("deactivate")}
            info="Account can be reactivated within 90 days"
          />

          {/* Delete Account */}
          <DangerCard
            icon={Trash2}
            iconBg="bg-red-500/15"
            iconColor="text-red-400"
            title="Delete Account Permanently"
            description="Irreversibly delete your account, all data, and cancel your subscription immediately. There are absolutely no refunds."
            buttonLabel="Delete Account"
            buttonClass="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
            onClick={() => openModal("delete")}
            badge="Permanent"
          />
        </div>

        {/* ── Last Login Info ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-400 font-medium">
                Account created
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                January 15, 2025 · Member for 12 days
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 font-medium">Last login</p>
            <p className="text-xs text-gray-600 mt-0.5">Today at 4:30 PM</p>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Confirm Modal ── */}
      {activeConfig && (
        <ConfirmModal
          isOpen={modal.type !== null}
          onClose={closeModal}
          onConfirm={handleConfirm}
          title={activeConfig.title}
          description={activeConfig.description}
          confirmLabel={activeConfig.confirmLabel}
          confirmClassName={activeConfig.confirmClassName}
          requireTyping={activeConfig.requireTyping}
          confirmWord={"confirmWord" in activeConfig ? activeConfig.confirmWord : undefined}
          warnings={activeConfig.warnings}
          isLoading={modal.loading}
        />
      )}

      {/* ── Success Toast ── */}
      <SuccessToast message={toast.message} visible={toast.visible} />
    </>
  );
}
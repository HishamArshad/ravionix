"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  Smartphone,
  LogOut,
  AlertCircle,
  CheckCircle,
  Key,
  Monitor,
  Clock,
  MapPin,
  Loader2,
} from "lucide-react";

// ── Password Strength ──────────────────────────────────
function getStrength(password: string) {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Very Weak", color: "bg-red-500" };
  if (score === 2) return { score, label: "Weak", color: "bg-orange-500" };
  if (score === 3) return { score, label: "Fair", color: "bg-yellow-500" };
  if (score === 4) return { score, label: "Strong", color: "bg-blue-500" };
  return { score, label: "Very Strong", color: "bg-green-500" };
}

// ── Sessions ───────────────────────────────────────────
const SESSIONS = [
  {
    id: 1,
    device: "Chrome on Windows 11",
    location: "Lahore, Pakistan",
    ip: "182.185.x.x",
    time: "Active now",
    current: true,
    icon: Monitor,
  },
  {
    id: 2,
    device: "Safari on iPhone 14",
    location: "Lahore, Pakistan",
    ip: "182.185.x.x",
    time: "2 hours ago",
    current: false,
    icon: Smartphone,
  },
  {
    id: 3,
    device: "Firefox on MacBook Pro",
    location: "Islamabad, Pakistan",
    ip: "59.103.x.x",
    time: "3 days ago",
    current: false,
    icon: Monitor,
  },
];

// ── Section Wrapper ────────────────────────────────────
function Section({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-gray-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
          {description && (
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────
export default function SecuritySettings() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [twoFA, setTwoFA] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [revokedIds, setRevokedIds] = useState<number[]>([]);

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const strength = getStrength(passwords.newPass);
  const passwordsMatch =
    passwords.newPass && passwords.confirm
      ? passwords.newPass === passwords.confirm
      : null;

  const canUpdate =
    passwords.current.length > 0 &&
    passwords.newPass.length >= 8 &&
    passwordsMatch === true;

  const handleUpdatePassword = async () => {
    if (!canUpdate) return;
    setSaveState("saving");
    await new Promise((r) => setTimeout(r, 1500));
    setSaveState("saved");
    setPasswords({ current: "", newPass: "", confirm: "" });
    setTimeout(() => setSaveState("idle"), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      {/* ── Change Password ── */}
      <Section
        title="Change Password"
        description="Use a strong password with letters, numbers and symbols"
        icon={Key}
      >
        <div className="space-y-3">
          {/* Current Password */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type={showCurrent ? "text" : "password"}
                value={passwords.current}
                onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                placeholder="Enter current password"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 transition"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type={showNew ? "text" : "password"}
                value={passwords.newPass}
                onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))}
                placeholder="Enter new password"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 transition"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength Meter */}
            {passwords.newPass && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-1 mr-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div
                        key={s}
                        className={`flex-1 h-1.5 rounded-full transition-all ${
                          s <= strength.score ? strength.color : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${
                    strength.score <= 2 ? "text-red-400" :
                    strength.score === 3 ? "text-yellow-400" :
                    "text-green-400"
                  }`}>
                    {strength.label}
                  </span>
                </div>

                {/* Requirements */}
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { check: passwords.newPass.length >= 8, label: "8+ characters" },
                    { check: /[A-Z]/.test(passwords.newPass), label: "Uppercase letter" },
                    { check: /[0-9]/.test(passwords.newPass), label: "Number" },
                    { check: /[^A-Za-z0-9]/.test(passwords.newPass), label: "Special character" },
                  ].map((req, i) => (
                    <div key={i} className={`flex items-center gap-1.5 text-xs ${req.check ? "text-green-400" : "text-gray-600"}`}>
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${req.check ? "bg-green-400" : "bg-gray-700"}`} />
                      {req.label}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type={showConfirm ? "text" : "password"}
                value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                placeholder="Confirm new password"
                className={`w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 text-sm text-gray-200 placeholder-gray-600 outline-none transition border ${
                  passwordsMatch === null
                    ? "border-white/10 focus:border-purple-500/50"
                    : passwordsMatch
                    ? "border-green-500/50"
                    : "border-red-500/50"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <AnimatePresence>
              {passwordsMatch === false && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 mt-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-xs text-red-400">Passwords do not match</span>
                </motion.div>
              )}
              {passwordsMatch === true && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 mt-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-xs text-green-400">Passwords match</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleUpdatePassword}
            disabled={!canUpdate || saveState === "saving"}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition ${
              saveState === "saved"
                ? "bg-green-500/20 border border-green-500/30 text-green-400"
                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            }`}
          >
            {saveState === "saving" ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
            ) : saveState === "saved" ? (
              <><CheckCircle className="w-4 h-4" /> Password Updated!</>
            ) : (
              <><Key className="w-4 h-4" /> Update Password</>
            )}
          </button>
        </div>
      </Section>

      {/* ── Two Factor Auth ── */}
      <Section
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account"
        icon={Smartphone}
      >
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-gray-200">
              Authenticator App
            </p>
            <p className="text-xs text-gray-500">
              Use an authenticator app to generate verification codes
            </p>
          </div>
          <button
            onClick={() => setTwoFA(!twoFA)}
            className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
              twoFA ? "bg-purple-500" : "bg-white/10"
            }`}
          >
            <motion.div
              animate={{ x: twoFA ? 24 : 2 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-gray-200">Login Alerts</p>
            <p className="text-xs text-gray-500">
              Get notified when someone logs into your account
            </p>
          </div>
          <button
            onClick={() => setLoginAlerts(!loginAlerts)}
            className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
              loginAlerts ? "bg-purple-500" : "bg-white/10"
            }`}
          >
            <motion.div
              animate={{ x: loginAlerts ? 24 : 2 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
            />
          </button>
        </div>

        <AnimatePresence>
          {twoFA && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-blue-300">
                    2FA is now enabled
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    A verification code will be required at every login
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Section>

      {/* ── Active Sessions ── */}
      <Section
        title="Active Sessions"
        description="Devices currently logged into your account"
        icon={Shield}
      >
        <div className="space-y-3">
          {SESSIONS.filter((s) => !revokedIds.includes(s.id)).map((session, i) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`flex items-start gap-4 p-4 rounded-xl border transition ${
                session.current
                  ? "bg-green-500/5 border-green-500/20"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                session.current ? "bg-green-500/20" : "bg-white/5"
              }`}>
                <session.icon className={`w-5 h-5 ${session.current ? "text-green-400" : "text-gray-400"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-gray-200">{session.device}</p>
                  {session.current && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/20">
                      This Device
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    {session.location}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {session.time}
                  </span>
                </div>
              </div>
              {!session.current && (
                <button
                  onClick={() => setRevokedIds((p) => [...p, session.id])}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 hover:bg-red-500/20 transition flex-shrink-0"
                >
                  <LogOut className="w-3 h-3" />
                  Revoke
                </button>
              )}
            </motion.div>
          ))}

          {SESSIONS.filter((s) => !revokedIds.includes(s.id)).length > 1 && (
            <button
              onClick={() => setRevokedIds(SESSIONS.filter((s) => !s.current).map((s) => s.id))}
              className="w-full py-2.5 rounded-xl bg-red-500/5 border border-red-500/10 text-xs text-red-400 hover:bg-red-500/10 transition"
            >
              Revoke All Other Sessions
            </button>
          )}
        </div>
      </Section>
    </motion.div>
  );
}
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Settings,
  LogOut,
  MessageSquare,
  Clock,
  Shield,
  ChevronRight,
  Mail,
  Bell,
  HelpCircle,
  FileText,
  Keyboard,
} from "lucide-react";
import Link from "next/link";
import { observer } from "@legendapp/state/react";
import { authState } from "../store/auth";
import { authService } from "../api/authService";
import { useRouter } from "next/navigation";

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  href?: string;
  action?: () => void;
  color?: string;
  divider?: boolean;
}

function MenuItem({
  icon: Icon,
  label,
  href,
  action,
  color = "text-gray-400",
  divider = false,
}: MenuItemProps) {
  const Component = href ? Link : "button";

  return (
    <>
      <Component
        href={href}
        onClick={action}
        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition text-left ${
          href
            ? "hover:bg-white/5"
            : "hover:bg-white/5 border-0 bg-transparent"
        } ${color === "text-red-400" ? "hover:text-red-400" : ""}`}
      >
        <Icon className={`w-4 h-4 ${color}`} />
        <span className={color === "text-red-400" ? color : "text-gray-300"}>
          {label}
        </span>
        {href && <ChevronRight className="w-3 h-3 ml-auto text-gray-600" />}
      </Component>
      {divider && <div className="my-1 h-px bg-white/5" />}
    </>
  );
}

export default observer(function UserProfileMenu() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false);
  const [showSignoutConfirm, setShowSignoutConfirm] = useState(false); 
  const userDum = {
    name: "Ahmed Khan",
    email: "ahmed.khan@gcu.edu.pk",
    plan: "Free Plan",
    streak: "12 days",
    initials: "AK",
  };

const handleSignOut = async () => {
  try {
    await authService.logout()

  authState.token.set(null)
  authState.user.set(null)
  authState.isAuthenticated.set(false)
    router.push('/auth/login')
  } catch (err) {
    console.log("Logout API failed, still clearing local session")
  }


  setIsOpen(false)
}
  return (
    <div className="relative">
      {/* Avatar Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white hover:shadow-lg hover:shadow-purple-500/40 transition"
      >
        {userDum.initials}
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-2 w-64 rounded-2xl bg-[#13131f] border border-white/10 shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/5 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold text-white">
                    {userDum.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {authState.user.first_name.get()}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {authState.user.email.get()}
                    </p>
                    <p className="text-[10px] text-purple-400 mt-0.5">
                      {authState.user.plan.get()}
                    </p>
                  </div>
                </div>

                {/* Streak Badge */}
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-1.5 text-xs text-orange-400">
                  <span>🔥</span>
                  <span>
                    <span className="font-bold">{userDum.streak}</span> streak
                  </span>
                </div>
              </div>

              {/* Account Section */}
              <div className="py-1">
                <MenuItem
                  icon={User}
                  label="Profile"
                  href="/dashboard/settings?tab=profile"
                />
                <MenuItem
                  icon={Shield}
                  label="Security"
                  href="/dashboard/settings?tab=security"
                />
                <MenuItem
                  icon={Bell}
                  label="Notifications"
                  href="/dashboard/settings?tab=notifications"
                />
              </div>

              {/* Quick Actions */}
              <div className="py-1">
                <MenuItem
                  icon={Mail}
                  label="Upgrade Account"
                  href="/dashboard/billing"
                  divider
                />
                <MenuItem
                  icon={Clock}
                  label="Activity History"
                  href="/dashboard/history"
                />
                <MenuItem
                  icon={HelpCircle}
                  label="Help & Support"
                  action={() => {
                    window.open("https://wa.me/923001234567", "_blank");
                    setIsOpen(false);
                  }}
                />
                <MenuItem
                  icon={Keyboard}
                  label="Keyboard Shortcuts"
                  action={() => {
                    // Show shortcuts modal
                    console.log("Show shortcuts");
                    setIsOpen(false);
                  }}
                  divider
                />
              </div>

              {/* Sign Out */}
              <div className="py-1">
                  <MenuItem
              icon={LogOut}
              label="Sign Out"
              color="text-red-400"
              action={() => {
                setIsOpen(false)
                handleSignOut()
              }}
            />
              </div>

              {/* Footer Info */}
              <div className="px-4 py-3 border-t border-white/5 bg-white/[0.02]">
                <p className="text-xs text-gray-600 text-center">
                  StudyAI v1.0.0
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sign Out Confirmation */}
      <AnimatePresence>
        {showSignoutConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSignoutConfirm(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
            >
              <div className="w-80 p-6 rounded-2xl bg-[#13131f] border border-white/10 shadow-2xl space-y-4">
                <h3 className="text-base font-bold text-white">Sign Out?</h3>
                <p className="text-sm text-gray-400">
                  Are you sure you want to sign out? Your data will be saved.
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowSignoutConfirm(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setShowSignoutConfirm(false);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 text-sm text-white hover:bg-red-600 transition font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
})
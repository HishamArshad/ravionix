"use client";
import Image from "next/image"; 

import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Wand2,
  FileText,
  Shield,
  BookOpen,
  Calculator,
  FileSearch,
  Users,
  BarChart3,
  Settings,
  LogOut,
  User,
  CreditCard,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { authState } from "../store/auth";
import { observer } from "@legendapp/state/react"
import { authService } from "../api/authService";
import router, { useRouter } from "next/navigation";
// Types
interface ToolItem {
  icon: React.ElementType;
  label: string;
  description: string;
  href: string;
  color: string;
}

interface MegaMenuSection {
  title: string;
  items: ToolItem[];
}

// Mega Menu Data
const TOOLS_SECTIONS: MegaMenuSection[] = [
  {
    title: "AI Tools",
    items: [
      {
        icon: Wand2,
        label: "AI Humanizer",
        description: "Convert AI text to human-like writing",
        href: "/dashboard/humanizer",
        color: "text-pink-400",
      },
      {
        icon: FileText,
        label: "Assignment Generator",
        description: "Generate complete, structured assignments",
        href: "/dashboard/assignment",
        color: "text-purple-400",
      },
      {
        icon: Shield,
        label: "Plagiarism Checker",
        description: "Scan against billions of sources instantly",
        href: "/dashboard/plagiarism",
        color: "text-orange-400",
      },
    ],
  },
  {
    title: "Academic Tools",
    items: [
      {
        icon: BookOpen,
        label: "Citation Generator",
        description: "Generate citations in all major styles",
        href: "/dashboard/citation",
        color: "text-blue-400",
      },
      {
        icon: Calculator,
        label: "Physics Solver",
        description: "Solve complex physics problems step-by-step",
        href: "/dashboard/physics",
        color: "text-green-400",
      },
      {
        icon: FileSearch,
        label: "PDF Summarizer",
        description: "Summarize research papers instantly",
        href: "/dashboard/pdf",
        color: "text-red-400",
      },
    ],
  },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about", icon: Users },
  { label: "Blog", href: "/blog", icon: FileText },
  // { label: "Careers", href: "/careers", icon: Zap },
  { label: "Press Kit", href: "/press", icon: BarChart3 },
];

const RESOURCE_LINKS = [
  { label: "Documentation", href: "/docs", icon: FileText },
  // { label: "Help Center", href: "/help", icon: Zap },
  { label: "API Reference", href: "/api", icon: Settings },
  { label: "Community", href: "/community", icon: Users },
];

const USER_MENU_ITEMS = [
  { label: "My Account", href: "/dashboard/settings", icon: User },
  { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Notifications", href: "/dashboard/settings", icon: Bell },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

function MegaMenuDropdown() {


  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.2 }}
      className="absolute left-1/2 top-full mt-4 -translate-x-1/2 w-[850px] rounded-3xl border border-white/10 bg-[#13131f]/95 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] overflow-hidden z-50"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.03] via-transparent to-pink-500/[0.03]" />

      <div className="relative p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-purple-400 font-semibold mb-2">
              AI Workspace
            </p>

            <h3 className="text-2xl font-bold text-white">
              Explore Study Tools
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Powerful AI tools built for students, researchers, and creators.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-medium text-purple-300">
              AI Powered
            </span>
          </div>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-2 gap-8">
          {TOOLS_SECTIONS.map((section, idx) => (
            <div key={idx}>
              {/* Section Title */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />

                <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  {section.title}
                </h4>
              </div>

              {/* Tool Cards */}
              <div className="space-y-3">
                {section.items.map((item, itemIdx) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="group relative flex items-start gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 overflow-hidden"
                    >
                      {/* Hover Glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-purple-500/[0.03] to-pink-500/[0.03]" />

                      {/* Icon */}
                      <div className="relative flex-shrink-0">
                        <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white group-hover:text-purple-300 transition">
                            {item.label}
                          </p>

                          {itemIdx === 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[9px] uppercase tracking-wide text-purple-300">
                              Popular
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      <div className="relative flex-shrink-0 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                        <ChevronDown className="w-4 h-4 rotate-[-90deg] text-purple-400" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs text-gray-600">
            More AI tools launching soon.
          </p>

          <Link
            href="/dashboard"
            className="text-sm text-purple-400 hover:text-purple-300 transition"
          >
            Open Dashboard →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
// Simple Dropdown
function SimpleDropdown({
  items,
}: {
  items: { label: string; href: string; icon: React.ElementType }[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 w-48 bg-[#13131f] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
    >
      <div className="py-1">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition"
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

// User Menu Dropdown
const UserMenuDropdown = observer(function UserMenuDropdown({
  onLogout,
}: {
  onLogout: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 w-56 bg-[#13131f] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
    >
      {/* User Info */}
      <div className="px-4 py-3 border-b border-white/10">
        <p className="text-sm font-medium text-white">
          {authState.user.first_name.get()}
        </p>

        <p className="text-xs text-gray-500">
          {authState.user.email.get()}
        </p>
      </div>

      {/* Menu Items */}
      <div className="py-1">
        {USER_MENU_ITEMS.map((item, idx) => {
          const Icon = item.icon;

          return (
            <Link
              key={idx}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition"
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <div className="border-t border-white/10 py-1">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition text-left"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </motion.div>
  );
}); 

// Main Navbar Component
export default observer(function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [mobileCompanyOpen, setMobileCompanyOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

  const isLoggedIn = false; // Change to true for logged-in state
// Helper for Desktop dropdowns
  const toggleDesktopDropdown = (menu: string) => {
    setToolsDropdownOpen(menu === 'tools' ? !toolsDropdownOpen : false);
    setCompanyDropdownOpen(menu === 'company' ? !companyDropdownOpen : false);
    setResourcesDropdownOpen(menu === 'resources' ? !resourcesDropdownOpen : false);
    setUserDropdownOpen(menu === 'user' ? !userDropdownOpen : false);
  };

  // Helper for Mobile dropdowns
  const toggleMobileDropdown = (menu: string) => {
    setMobileToolsOpen(menu === 'tools' ? !mobileToolsOpen : false);
    setMobileCompanyOpen(menu === 'company' ? !mobileCompanyOpen : false);
    setMobileResourcesOpen(menu === 'resources' ? !mobileResourcesOpen : false);
  };
  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleLogout = async () => {
    await authService.logout()

    authState.token.set(null)
    authState.user.set(null)
    authState.isAuthenticated.set(false)

    setUserDropdownOpen(false)

    router.push("/auth/login")
  }
  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-navbar]")) {
        setToolsDropdownOpen(false);
        setCompanyDropdownOpen(false);
        setResourcesDropdownOpen(false);
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 1024);
  check();
  window.addEventListener("resize", check);
  return () => window.removeEventListener("resize", check);
}, []);
  return (
    <nav
      data-navbar
      // className={`fixed top-0 w-full z-40 transition-all duration-300 ${
      //   scrolled
      //     ? "bg-[#0a0a0f]/80 backdrop-blur-lg border-b border-white/10"
      //     : "bg-transparent"
      // }`}
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
  isMobile
    ? "bg-[#0a0a0f]/80 backdrop-blur-lg border-b border-white/10"
    : scrolled
      ? "bg-[#0a0a0f]/80 backdrop-blur-lg border-b border-white/10"
      : "bg-transparent"
}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}

<Link href="/" className="flex items-center gap-2 group flex-shrink-0">
  <div className="w-9 h-9 flex items-center justify-center group-hover:scale-110 transition-transform">
    <Image
      src="/logo.svg"
      alt="Ravionix Logo"
      width={36}
      height={36}
      priority
    />
  </div>

  <span className="text-xl font-bold hidden sm:inline">
    Ravionix
  </span>
</Link>
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Tools */}
            <div className="relative">
              <button
                onClick={() => toggleDesktopDropdown('tools')}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                Tools
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    toolsDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {toolsDropdownOpen && <MegaMenuDropdown />}
              </AnimatePresence>
            </div>

            {/* Company */}
            <div className="relative">
              <button
                onClick={() => toggleDesktopDropdown('company')}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                Company
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    companyDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {companyDropdownOpen && <SimpleDropdown items={COMPANY_LINKS} />}
              </AnimatePresence>
            </div>

            {/* Resources */}
            <div className="relative">
              <button
               onClick={() => toggleDesktopDropdown('resources')}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                Resources
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    resourcesDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {resourcesDropdownOpen && <SimpleDropdown items={RESOURCE_LINKS} />}
              </AnimatePresence>
            </div>

            {/* Pricing */}
            <Link
              href="/#pricing"
              className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
            >
              Pricing
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-4">
            {authState.isAuthenticated.get() ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => toggleDesktopDropdown('user')}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                      AK
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  <AnimatePresence>
                    {userDropdownOpen && (
                      <UserMenuDropdown
                        onLogout={handleLogout}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-medium hover:opacity-90 transition shadow-lg shadow-purple-500/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/5 mt-4 pt-4 pb-4 space-y-2"
            >
               {/* className="lg:hidden border-t border-white/5 mt-4 pt-4 pb-4 space-y-2" */}
              {/* Mobile Tools */}
              <div>
                <button
                  onClick={() => toggleMobileDropdown('tools')}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/5 transition"
                >
                  Tools
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileToolsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileToolsOpen && (
                  <div className="pl-4 mt-2 space-y-1">
                    {TOOLS_SECTIONS.flatMap((section) =>
                      section.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition"
                          >
                            <Icon className={`w-4 h-4 ${item.color}`} />
                            {item.label}
                          </Link>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Company */}
              <div>
                <button
                 onClick={() => toggleMobileDropdown('company')}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/5 transition"
                >
                  Company
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileCompanyOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileCompanyOpen && (
                  <div className="pl-4 mt-2 space-y-1">
                    {COMPANY_LINKS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition"
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Mobile Resources */}
              <div>
                <button
                  onClick={() => toggleMobileDropdown('resources')}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/5 transition"
                >
                  Resources
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileResourcesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileResourcesOpen && (
                  <div className="pl-4 mt-2 space-y-1">
                    {RESOURCE_LINKS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition"
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Mobile Pricing */}
              <Link
                href="/#pricing"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/5 transition"
              >
                Pricing
              </Link>

              {/* Mobile Auth */}
              <div className="border-t border-white/5 pt-4 mt-4 space-y-2">
                {authState.isAuthenticated.get() ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/5 transition"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/5 transition"
                    >
                      Settings
                    </Link>
                    <button className="w-full px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition text-left">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/5 transition"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setMobileOpen(false)}
                      className="block text-center px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-medium"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
})
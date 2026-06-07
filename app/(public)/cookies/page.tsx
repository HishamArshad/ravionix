"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Cookie, Shield, Settings, AlertCircle } from "lucide-react";
import { useState } from "react";

const COOKIE_TYPES = [
  {
    category: "Essential Cookies",
    icon: Shield,
    description: "Required for the website to function properly",
    color: "from-blue-500 to-cyan-500",
    cookies: [
      {
        name: "session_id",
        purpose: "Maintains your login session",
        duration: "Until you log out",
        necessary: true,
      },
      {
        name: "csrf_token",
        purpose: "Protects against cross-site attacks",
        duration: "Current session",
        necessary: true,
      },
      {
        name: "user_preferences",
        purpose: "Saves your theme and layout settings",
        duration: "1 year",
        necessary: true,
      },
      {
        name: "language",
        purpose: "Stores your language preference",
        duration: "1 year",
        necessary: true,
      },
    ],
  },
  {
    category: "Analytics Cookies",
    icon: AlertCircle,
    description: "Help us understand how you use StudyAI",
    color: "from-purple-500 to-pink-500",
    cookies: [
      {
        name: "ga_id",
        purpose: "Google Analytics tracking",
        duration: "2 years",
        necessary: false,
      },
      {
        name: "pageview_data",
        purpose: "Track page visits and user flow",
        duration: "90 days",
        necessary: false,
      },
      {
        name: "feature_usage",
        purpose: "Monitor which features are most popular",
        duration: "1 year",
        necessary: false,
      },
      {
        name: "performance_metrics",
        purpose: "Measure page load times and performance",
        duration: "30 days",
        necessary: false,
      },
    ],
  },
  {
    category: "Marketing Cookies",
    icon: Cookie,
    description: "Used to deliver personalized ads and track campaigns",
    color: "from-orange-500 to-yellow-500",
    cookies: [
      {
        name: "utm_source",
        purpose: "Track which marketing channel brought you here",
        duration: "Session",
        necessary: false,
      },
      {
        name: "conversion_pixel",
        purpose: "Track conversions from marketing campaigns",
        duration: "90 days",
        necessary: false,
      },
      {
        name: "user_segment",
        purpose: "Personalize content based on interests",
        duration: "1 year",
        necessary: false,
      },
    ],
  },
  {
    category: "Functional Cookies",
    icon: Settings,
    description: "Enhance functionality and personalization",
    color: "from-green-500 to-emerald-500",
    cookies: [
      {
        name: "sidebar_state",
        purpose: "Remember if sidebar is collapsed",
        duration: "Session",
        necessary: false,
      },
      {
        name: "notification_settings",
        purpose: "Store your notification preferences",
        duration: "1 year",
        necessary: false,
      },
      {
        name: "recently_used_tools",
        purpose: "Show your most-used tools on dashboard",
        duration: "30 days",
        necessary: false,
      },
      {
        name: "saved_filters",
        purpose: "Remember your history filter preferences",
        duration: "3 months",
        necessary: false,
      },
    ],
  },
];

const COOKIE_CONSENT_OPTIONS = [
  {
    key: "essential",
    label: "Essential Only",
    description: "Only cookies required for the site to work",
    checked: true,
    disabled: true,
  },
  {
    key: "analytics",
    label: "Analytics",
    description: "Help us improve StudyAI with usage insights",
    checked: true,
    disabled: false,
  },
  {
    key: "marketing",
    label: "Marketing",
    description: "Show you relevant ads and track campaigns",
    checked: false,
    disabled: false,
  },
  {
    key: "functional",
    label: "Functional",
    description: "Enhanced features and personalization",
    checked: true,
    disabled: false,
  },
];

export default function CookiePolicyPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    "essential"
  );
  const [consent, setConsent] = useState(
    COOKIE_CONSENT_OPTIONS.reduce(
      (acc, opt) => ({ ...acc, [opt.key]: opt.checked }),
      {}
    )
  );

  const handleConsentChange = (key: string) => {
    setConsent((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative py-16 px-6 border-b border-white/5"
      >
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-lg text-gray-400">
            Understand how we use cookies to enhance your experience on StudyAI
          </p>
          <p className="text-sm text-gray-600 mt-4">
            Last updated: January 2025
          </p>
        </div>
      </motion.div>

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {/* ── What are Cookies ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Cookie className="w-6 h-6 text-yellow-400" />
            What Are Cookies?
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Cookies are small text files that are stored on your device when you
            visit a website. They allow websites to remember information about
            you and improve your browsing experience. StudyAI uses cookies to:
          </p>
          <ul className="space-y-2 pl-6">
            {[
              "Keep you logged in securely",
              "Remember your preferences (theme, language, layout)",
              "Understand how students use our platform",
              "Improve our features based on usage patterns",
              "Detect and prevent fraudulent activity",
              "Show you relevant content and offers",
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-gray-400">
                <span className="text-purple-400 font-bold mt-1">•</span>
                {item}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* ── Cookie Types ── */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold">Types of Cookies We Use</h2>
          <div className="space-y-4">
            {COOKIE_TYPES.map((cookieType, i) => {
              const Icon = cookieType.icon;
              const isExpanded = expandedCategory === cookieType.category;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedCategory(
                        isExpanded ? null : cookieType.category
                      )
                    }
                    className="w-full flex items-center justify-between p-5 hover:bg-white/10 transition text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cookieType.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {cookieType.category}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {cookieType.description}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="text-gray-600"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.div>
                  </button>

                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-white/5 space-y-4">
                        {cookieType.cookies.map((cookie, j) => (
                          <div key={j} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="font-mono text-sm text-purple-400">
                                {cookie.name}
                              </p>
                              {cookie.necessary && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400">
                              {cookie.purpose}
                            </p>
                            <p className="text-xs text-gray-600">
                              Duration: {cookie.duration}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── Cookie Consent Manager ── */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 space-y-6"
        >
          <h2 className="text-2xl font-bold">Manage Your Preferences</h2>
          <p className="text-gray-400">
            You can control which cookies we use (except essential ones that
            keep the site working).
          </p>

          <div className="space-y-3">
            {COOKIE_CONSENT_OPTIONS.map((option) => (
              <div
                key={option.key}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={option.key}
                      checked={consent[option.key] as boolean}
                      onChange={() => handleConsentChange(option.key)}
                      disabled={option.disabled}
                      className="w-4 h-4 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <label
                      htmlFor={option.key}
                      className="text-sm font-medium text-white cursor-pointer flex-1"
                    >
                      {option.label}
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-6">
                    {option.description}
                  </p>
                </div>
                {option.disabled && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 ml-4 flex-shrink-0">
                    Always On
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <button className="flex-1 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-medium transition">
              Reject All (except Essential)
            </button>
            <button className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-medium transition hover:opacity-90">
              Save Preferences
            </button>
          </div>
        </motion.section>

        {/* ── How to Control Cookies ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold">Control Cookies in Your Browser</h2>
          <p className="text-gray-400 leading-relaxed">
            Most web browsers allow you to control cookies through their
            settings. You can set your browser to refuse cookies or alert you
            when cookies are being sent.
          </p>
          <div className="space-y-3">
            {[
              { browser: "Chrome", url: "chrome://settings/cookies" },
              { browser: "Firefox", url: "about:preferences#privacy" },
              { browser: "Safari", url: "Safari → Preferences → Privacy" },
              { browser: "Edge", url: "edge://settings/privacy" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <span className="text-sm font-mono text-purple-400">
                  {item.browser}
                </span>
                <span className="text-gray-600">→</span>
                <span className="text-sm text-gray-400">{item.url}</span>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10 space-y-2">
            <p className="text-sm text-yellow-400 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Important Note
            </p>
            <p className="text-sm text-gray-400">
              Disabling essential cookies may affect StudyAI's functionality.
              Some features may not work properly without them.
            </p>
          </div>
        </motion.section>

        {/* ── Third-Party Cookies ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold">Third-Party Cookies</h2>
          <p className="text-gray-400 leading-relaxed">
            We use cookies from trusted third-party services:
          </p>
          <div className="space-y-3">
            {[
              {
                name: "Google Analytics",
                purpose: "Website analytics and user behavior",
                privacy: "https://policies.google.com/privacy",
              },
              {
                name: "Stripe",
                purpose: "Payment processing and fraud prevention",
                privacy: "https://stripe.com/privacy",
              },
              {
                name: "Cloudflare",
                purpose: "Security and content delivery",
                privacy: "https://www.cloudflare.com/privacypolicy/",
              },
            ].map((vendor, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="font-semibold text-white">{vendor.name}</h4>
                <p className="text-sm text-gray-400">{vendor.purpose}</p>
                <a
                  href={vendor.privacy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  View Privacy Policy →
                </a>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Contact ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-4"
        >
          <p className="text-sm text-gray-400">
            Questions about our cookie practices?{" "}
            <a
              href="mailto:privacy@studyai.com"
              className="text-blue-400 font-medium hover:text-blue-300"
            >
              Contact us
            </a>
            {" "}or read our full{" "}
            <Link
              href="/privacy"
              className="text-blue-400 font-medium hover:text-blue-300"
            >
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
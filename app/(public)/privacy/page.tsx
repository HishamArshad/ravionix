"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Shield, Lock, Eye, Trash2, Mail } from "lucide-react";

const sections = [
  {
    title: "1. Introduction",
    icon: Shield,
    content: [
      "StudyAI (\"we\", \"our\", or \"us\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.",
      "Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our services. By accessing and using StudyAI, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.",
    ],
  },
  {
    title: "2. Information We Collect",
    icon: Eye,
    subsections: [
      {
        subtitle: "Personal Information",
        items: [
          "Name, email address, and phone number",
          "University, department, and academic information",
          "Account credentials and authentication data",
          "Payment information (processed securely via JazzCash/EasyPaisa)",
        ],
      },
      {
        subtitle: "Usage Information",
        items: [
          "Tools accessed and features used",
          "Generated content and assignments",
          "Plagiarism check results",
          "Timestamps and duration of usage",
          "Device information and IP addresses",
        ],
      },
    ],
  },
  {
    title: "3. How We Use Your Information",
    icon: Lock,
    content: [
      "We use the information we collect to:",
      "Provide, maintain, and improve our services",
      "Process your transactions and send billing information",
      "Send transactional and promotional communications",
      "Monitor usage patterns and analytics",
      "Ensure platform security and prevent fraud",
      "Comply with legal obligations",
      "Respond to your inquiries and provide support",
    ],
  },
  {
    title: "4. Data Security",
    icon: Lock,
    content: [
      "We implement comprehensive security measures including:",
      "End-to-end encryption for sensitive data",
      "Secure server infrastructure with firewall protection",
      "Regular security audits and penetration testing",
      "Two-factor authentication options",
      "Strict access controls and role-based permissions",
      "SSL/TLS encryption for all data in transit",
      "While we strive to protect your personal information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.",
    ],
  },
  {
    title: "5. Data Retention",
    icon: Trash2,
    content: [
      "We retain your personal data for as long as necessary to provide our services and comply with legal obligations.",
      "If you delete your account, we will permanently remove your data within 30 days, except where we are required to retain it by law.",
      "Activity history can be cleared manually from your account settings anytime.",
      "Deactivated accounts are retained for 90 days before permanent deletion.",
    ],
  },
  {
    title: "6. Sharing Your Information",
    icon: Eye,
    content: [
      "We do NOT sell, trade, or rent your personal information to third parties.",
      "We may share information with:",
      "Service providers who assist in operating our platform (hosting, analytics, payment processing)",
      "Legal authorities if required by law or court order",
      "Other parties with your explicit consent",
      "All service providers are bound by confidentiality agreements.",
    ],
  },
  {
    title: "7. Your Rights",
    icon: Shield,
    content: [
      "You have the right to:",
      "Access all your personal data - Request a complete copy anytime",
      "Correct inaccurate information - Update your profile details",
      "Delete your data - Request permanent account deletion",
      "Export your data - Download all your information and generated content",
      "Opt-out of communications - Manage notification preferences",
      "Data portability - Transfer your data to another service",
      "To exercise these rights, contact us at privacy@studyai.com with proof of identity.",
    ],
  },
  {
    title: "8. Cookies & Tracking",
    icon: Eye,
    content: [
      "We use cookies and similar tracking technologies to:",
      "Remember your preferences and login information",
      "Analyze usage patterns and improve services",
      "Prevent fraud and enhance security",
      "You can control cookies through your browser settings. Disabling cookies may affect some features.",
      "We do not sell cookie data to advertisers.",
    ],
  },
  {
    title: "9. Third-Party Links",
    icon: Lock,
    content: [
      "Our website may contain links to third-party websites. We are not responsible for the privacy practices of external sites.",
      "Please review the privacy policies of any third-party services before providing your information.",
      "This Privacy Policy applies only to information collected through StudyAI.",
    ],
  },
  {
    title: "10. GDPR & International Users",
    icon: Shield,
    content: [
      "For users in the EU and other jurisdictions with data protection regulations:",
      "We process data only with your explicit consent",
      "You have the right to withdraw consent at any time",
      "We appoint a Data Protection Officer for regulatory compliance",
      "Transfers of data outside Pakistan are subject to appropriate safeguards",
      "We comply with GDPR, CCPA, and similar regulations",
    ],
  },
  {
    title: "11. Contact Us",
    icon: Mail,
    content: [
      "If you have questions about this Privacy Policy or our practices:",
      "Email: privacy@studyai.com",
      "WhatsApp: +92-300-1234567",
      "Address: GCU Lahore, Pakistan",
      "Response time: Within 48 hours",
    ],
  },
];

export default function PrivacyPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-400">
            Your privacy is important to us. Learn how we collect, use, and
            protect your data.
          </p>
          <p className="text-sm text-gray-600 mt-4">
            Last updated: January 2025 • Effective: January 2025
          </p>
        </div>
      </motion.div>

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold">{section.title}</h2>
              </div>

              {section.content && (
                <div className="space-y-3 pl-13">
                  {section.content.map((para, j) => (
                    <p
                      key={j}
                      className={`text-gray-400 leading-relaxed ${
                        para.endsWith(":") ? "font-semibold text-gray-300" : ""
                      }`}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              )}

              {section.subsections && (
                <div className="space-y-6 pl-13">
                  {section.subsections.map((sub, j) => (
                    <div key={j} className="space-y-2">
                      <h3 className="font-semibold text-gray-200">
                        {sub.subtitle}
                      </h3>
                      <ul className="space-y-2">
                        {sub.items.map((item, k) => (
                          <li key={k} className="flex gap-3 text-gray-400">
                            <span className="text-purple-400 font-bold mt-1">
                              •
                            </span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/10 space-y-4"
        >
          <p className="text-sm text-gray-400">
            Have questions about how we handle your data?{" "}
            <a
              href="mailto:privacy@studyai.com"
              className="text-purple-400 font-medium hover:text-purple-300"
            >
              Contact our privacy team
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
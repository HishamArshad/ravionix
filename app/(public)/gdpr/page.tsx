"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  Shield,
  Lock,
  User,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

const GDPR_RIGHTS = [
  {
    icon: User,
    title: "Right to Access",
    description:
      "You can request a complete copy of all your personal data we hold",
    process: [
      "Email us at privacy@studyai.com with your request",
      "Include proof of identity (student ID or email verification)",
      "We'll compile and send your data within 30 days",
    ],
  },
  {
    icon: Download,
    title: "Right to Data Portability",
    description:
      "You can download your data in a structured, portable format",
    process: [
      "Login to your StudyAI account",
      "Go to Settings → Account → Export Data",
      "Download as JSON or CSV format",
    ],
  },
  {
    icon: Trash2,
    title: "Right to Erasure (Right to be Forgotten)",
    description:
      "You can request deletion of your personal data and account",
    process: [
      "Go to Settings → Danger Zone → Delete Account",
      "Type 'DELETE MY ACCOUNT' to confirm",
      "Your data will be permanently deleted within 30 days",
    ],
  },
  {
    icon: Lock,
    title: "Right to Rectification",
    description: "You can correct inaccurate or incomplete personal data",
    process: [
      "Edit your profile information directly in Settings",
      "Submit corrections via privacy@studyai.com",
      "We'll update your data within 7 days",
    ],
  },
  {
    icon: AlertCircle,
    title: "Right to Restrict Processing",
    description:
      "You can request we limit how we process your data",
    process: [
      "Email privacy@studyai.com with your request",
      "Specify which data processing you want restricted",
      "We'll acknowledge within 10 days and implement within 30 days",
    ],
  },
  {
    icon: Shield,
    title: "Right to Object",
    description:
      "You can object to certain types of data processing",
    process: [
      "Opt out of marketing emails in Settings → Notifications",
      "Object to analytics in Settings → Appearance",
      "Contact us for other processing objections",
    ],
  },
];

const LEGAL_BASIS = [
  {
    basis: "Consent",
    examples: [
      "Marketing emails (you can withdraw anytime)",
      "Analytics and tracking cookies",
      "Non-essential cookies",
    ],
  },
  {
    basis: "Contractual Necessity",
    examples: [
      "Processing required to deliver our services",
      "Billing and subscription management",
      "Account security and authentication",
    ],
  },
  {
    basis: "Legal Obligation",
    examples: [
      "Tax and accounting compliance",
      "Law enforcement requests",
      "Platform security and fraud prevention",
    ],
  },
  {
    basis: "Legitimate Interest",
    examples: [
      "Improving our services and platform",
      "Preventing abuse and fraud",
      "Analytics and usage optimization",
    ],
  },
];

export default function GDPRPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">GDPR Compliance</h1>
          <p className="text-lg text-gray-400">
            Your data rights and how we protect your privacy under GDPR
          </p>
          <p className="text-sm text-gray-600 mt-4">
            Compliant with EU General Data Protection Regulation (GDPR)
          </p>
        </div>
      </motion.div>

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {/* ── What is GDPR ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Shield className="w-6 h-6 text-green-400" />
            What is GDPR?
          </h2>
          <p className="text-gray-400 leading-relaxed">
            The General Data Protection Regulation (GDPR) is a comprehensive
            data protection law enacted in the European Union on May 25, 2018.
            It applies to any organization that processes data of EU residents,
            regardless of where the organization is located.
          </p>
          <p className="text-gray-400 leading-relaxed">
            While StudyAI is based in Pakistan, we fully comply with GDPR for
            all users, as we believe strong data protection benefits everyone.
          </p>
        </motion.section>

        {/* ── Your GDPR Rights ── */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold">Your GDPR Rights</h2>
          <div className="space-y-4">
            {GDPR_RIGHTS.map((right, i) => {
              const Icon = right.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">
                        {right.title}
                      </h3>
                      <p className="text-gray-400 mt-1">{right.description}</p>
                    </div>
                  </div>

                  <div className="ml-14 space-y-2">
                    <p className="text-sm text-gray-500 font-semibold">
                      How to exercise this right:
                    </p>
                    <ol className="space-y-1.5">
                      {right.process.map((step, j) => (
                        <li key={j} className="flex gap-3 text-sm text-gray-400">
                          <span className="font-semibold text-green-400 flex-shrink-0">
                            {j + 1}.
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── Response Times ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-4"
        >
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Our GDPR Response Times
          </h2>
          <div className="space-y-3">
            {[
              { request: "Data Access Request", time: "Within 30 days" },
              { request: "Account Deletion", time: "Within 30 days" },
              { request: "Data Correction", time: "Within 7 days" },
              { request: "Contact Response", time: "Within 24 hours" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10">
                <span className="text-sm text-gray-300">{item.request}</span>
                <span className="text-sm font-semibold text-blue-400">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Legal Basis ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold">Legal Basis for Data Processing</h2>
          <p className="text-gray-400">
            Under GDPR, we can only process data if we have a valid legal basis.
            Here's how we process your data:
          </p>
          <div className="space-y-4">
            {LEGAL_BASIS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10"
              >
                <h3 className="font-semibold text-white mb-3">{item.basis}</h3>
                <ul className="space-y-2">
                  {item.examples.map((example, j) => (
                    <li key={j} className="flex gap-2 text-sm text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      {example}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Data Transfers ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold">International Data Transfers</h2>
          <p className="text-gray-400 leading-relaxed">
            StudyAI is based in Pakistan, but we have EU users. For data
            transfers outside the EU/EEA, we use:
          </p>
          <ul className="space-y-2 pl-6">
            {[
              "Standard Contractual Clauses (SCCs) approved by the European Commission",
              "Data Processing Agreements with all subprocessors",
              "Encryption and security measures for all data transfers",
              "Regular audits to ensure compliance with GDPR requirements",
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-gray-400">
                <span className="text-green-400 font-bold">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* ── Data Protection Officer ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/10 space-y-4"
        >
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            Data Protection Officer
          </h2>
          <p className="text-gray-400 leading-relaxed">
            We have appointed a Data Protection Officer to oversee our GDPR
            compliance. You can contact our DPO at:
          </p>
          <div className="space-y-2 text-sm text-gray-300">
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:dpo@studyai.com" className="text-purple-400 hover:text-purple-300">
                dpo@studyai.com
              </a>
            </p>
            <p>
              <strong>Address:</strong> GCU Lahore, Kachnar Road, Lahore,
              Pakistan
            </p>
            <p>
              <strong>Response Time:</strong> Within 5 business days
            </p>
          </div>
        </motion.section>

        {/* ── Data Breach Notification ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold">Data Breach Notification</h2>
          <p className="text-gray-400 leading-relaxed">
            In the unlikely event of a data breach that affects your personal
            data:
          </p>
          <ol className="space-y-3 pl-6">
            {[
              "We'll notify you within 24 hours via email",
              "We'll provide information about the breach and your rights",
              "We'll notify relevant authorities if required by GDPR",
              "We'll take immediate steps to prevent further unauthorized access",
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-gray-400">
                <span className="font-semibold text-orange-400 flex-shrink-0">
                  {i + 1}.
                </span>
                {item}
              </li>
            ))}
          </ol>
        </motion.section>

        {/* ── Complaints & Supervisory Authority ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-4"
        >
          <h2 className="text-lg font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            Your Right to Lodge a Complaint
          </h2>
          <p className="text-gray-400 leading-relaxed">
            If you believe your GDPR rights have been violated, you have the
            right to lodge a complaint with your local data protection
            authority:
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              "🇪🇺 EU: Contact your national Data Protection Authority (DPA)",
              "🇬🇧 UK: Information Commissioner's Office (ICO)",
              "🇦🇹 Austria: Österreichische Datenschutzbehörde",
              "🇩🇪 Germany: Bundesdatenschutzbeauftragte",
            ].map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </motion.section>

        {/* ── Contact ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-4"
        >
          <p className="text-sm text-gray-400">
            Questions about GDPR compliance? Contact our Data Protection Officer
            at{" "}
            <a
              href="mailto:dpo@studyai.com"
              className="text-blue-400 font-medium hover:text-blue-300"
            >
              dpo@studyai.com
            </a>
            {" "}or read our{" "}
            <Link href="/privacy" className="text-blue-400 font-medium hover:text-blue-300">
              Privacy Policy
            </Link>
            {" "}for more details.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
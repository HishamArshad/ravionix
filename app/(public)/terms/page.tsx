"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, FileText, AlertTriangle, Gavel, Ban, Zap } from "lucide-react";

const sections = [
  {
    title: "1. Agreement to Terms",
    icon: FileText,
    content: [
      "By accessing and using StudyAI (\"Service\"), you agree to be bound by these Terms of Service. If you do not agree to abide by the above, please do not use this service.",
      "StudyAI reserves the right to modify these terms at any time. Your continued use of the Service following any changes constitutes your acceptance of the new Terms of Service.",
    ],
  },
  {
    title: "2. Use License",
    icon: Zap,
    content: [
      "Permission is granted to temporarily download one copy of the materials (information or software) on StudyAI for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:",
      "Modifying or copying the materials",
      "Using the materials for any commercial purpose or for any public display",
      "Attempting to decompile or reverse engineer any software",
      "Removing any copyright or other proprietary notations",
      "Transferring the materials to another person or \"mirroring\" the materials on any other server",
      "Violating any applicable laws or regulations",
      "Harassing or causing distress or inconvenience to any person",
      "Obscuring or changing any security features or labels",
    ],
  },
  {
    title: "3. Disclaimer",
    icon: AlertTriangle,
    content: [
      "The materials on StudyAI are provided \"as is\". StudyAI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
      "Further, StudyAI does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its Internet web site or relating to such materials or on any sites linked to this site.",
    ],
  },
  {
    title: "4. Limitations",
    icon: Ban,
    content: [
      "In no event shall StudyAI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on StudyAI's website, even if StudyAI or an authorized representative has been notified orally or in writing of the possibility of such damage.",
      "Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.",
    ],
  },
  {
    title: "5. Accuracy of Materials",
    icon: FileText,
    content: [
      "The materials appearing on StudyAI could include technical, typographical, or photographic errors. StudyAI does not warrant that any of the materials on the site are accurate, complete, or current. StudyAI may make changes to the materials contained on the site at any time without notice.",
      "StudyAI does not make any commitment to update the materials.",
    ],
  },
  {
    title: "6. Links",
    icon: FileText,
    content: [
      "StudyAI has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by StudyAI of the site. Use of any such linked website is at the user's own risk.",
      "If you believe a linked site contains objectionable material, please contact us immediately.",
    ],
  },
  {
    title: "7. Modifications",
    icon: Zap,
    content: [
      "StudyAI may revise these terms of service for the website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.",
      "We will notify users of significant changes via email or prominent website notice.",
    ],
  },
  {
    title: "8. Governing Law",
    icon: Gavel,
    content: [
      "These terms and conditions are governed by and construed in accordance with the laws of Pakistan, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.",
      "If any provision of these terms is found to be invalid, the remaining provisions will continue in full force and effect.",
    ],
  },
  {
    title: "9. Prohibited Activities",
    icon: Ban,
    content: [
      "You may not use StudyAI for:",
      "Violating any applicable laws or regulations",
      "Infringing intellectual property rights of others",
      "Submitting false or misleading information",
      "Accessing accounts of other users without permission",
      "Distributing viruses or malicious code",
      "Harassing, threatening, or abusing other users",
      "Creating multiple accounts to circumvent limitations",
      "Selling or transferring your account to others",
    ],
  },
  {
    title: "10. User Responsibilities",
    icon: FileText,
    content: [
      "You are responsible for:",
      "Maintaining the confidentiality of your login credentials",
      "All activity that occurs under your account",
      "Notifying us immediately of any unauthorized access",
      "Using the Service in compliance with all applicable laws",
      "Ensuring generated content is used appropriately",
      "Reviewing assignments and content before submission",
    ],
  },
  {
    title: "11. Content Ownership",
    icon: FileText,
    content: [
      "You retain ownership of content you upload or provide to StudyAI.",
      "By using our Service, you grant us a license to process, store, and display your content to provide the Service.",
      "Generated content (assignments, summaries, etc.) is provided to you for educational purposes only.",
      "You are responsible for ensuring you have the right to use generated content in accordance with your institution's policies.",
    ],
  },
  {
    title: "12. Termination",
    icon: Ban,
    content: [
      "StudyAI may terminate your account at any time for:",
      "Violation of these Terms of Service",
      "Violation of applicable laws",
      "Harassment or abuse of other users",
      "Repeated misuse of the Service",
      "You may terminate your account anytime by deleting it from Settings.",
      "Upon termination, your access will be immediately revoked and data will be deleted per our Privacy Policy.",
    ],
  },
  {
    title: "13. Contact Information",
    icon: FileText,
    content: [
      "If you have any questions about these Terms of Service:",
      "Email: legal@studyai.com",
      "WhatsApp: +92-300-1234567",
      "Address: GCU Lahore, Pakistan",
      "We'll respond within 48 hours.",
    ],
  },
];

export default function TermsPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-400">
            Please read these terms carefully before using StudyAI.
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
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold">{section.title}</h2>
              </div>

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
            </motion.div>
          );
        })}

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-4"
        >
          <p className="text-sm text-gray-400">
            Have legal questions? Contact our legal team at{" "}
            <a
              href="mailto:legal@studyai.com"
              className="text-blue-400 font-medium hover:text-blue-300"
            >
              legal@studyai.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
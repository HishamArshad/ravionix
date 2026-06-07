"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  Mail,
  MapPin,
  Phone,
  // Twitter,
  // Linkedin,
  // Github,
  Send,
  ArrowUpRight,
} from "lucide-react";
// import InstallButton from "../ui/InstallButton";

const FOOTER_LINKS = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "How It Works", href: "#how" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Help Center", href: "/help" },
    { label: "API Reference", href: "/api" },
    { label: "Community", href: "/community" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "GDPR", href: "/gdpr" },
  ],
};

const SOCIAL_LINKS = [
  // { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  // { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  // { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Mail, href: "mailto:hello@studyai.com", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#0a0a0f] border-t border-white/5">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-500/5 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-16 space-y-12">
        {/* ── Top Section: CTA + Newsletter ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Left: CTA */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Ready to get started?</h3>
            <p className="text-gray-400 leading-relaxed">
              Join 500+ students already using StudyAI to save time and improve
              their grades.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition group"
            >
              Start Free Trial
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
            </Link>
          </div>

          {/* Right: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Get Updates</h3>
            <p className="text-gray-400 leading-relaxed">
              Subscribe to receive tips, new features, and exclusive offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 transition"
              />
              <button className="px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition flex items-center justify-center">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ── Main Footer Grid ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-5 gap-8"
        >
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">StudyAI</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              The complete AI toolkit for Pakistani students. Save time, improve
              grades, and learn smarter.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 pt-4">
              {SOCIAL_LINKS.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition"
                  title={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {[
            { title: "Product", links: FOOTER_LINKS.product },
            { title: "Company", links: FOOTER_LINKS.company },
            { title: "Resources", links: FOOTER_LINKS.resources },
            { title: "Legal", links: FOOTER_LINKS.legal },
          ].map((column, i) => (
            <motion.div
              key={column.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-3"
            >
              <h4 className="text-sm font-semibold text-white">{column.title}</h4>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-gray-300 transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ── Bottom Bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-gray-600">
            © 2025 StudyAI. All rights reserved. Built by students for
            students.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link
              href="/privacy"
              className="hover:text-gray-300 transition"
            >
              Privacy
            </Link>
            <div className="w-px h-4 bg-white/10" />
            <Link href="/terms" className="hover:text-gray-300 transition">
              Terms
            </Link>
            <div className="w-px h-4 bg-white/10" />
            <Link
              href="/contact"
              className="hover:text-gray-300 transition"
            >
              Contact
            </Link>
            <div className="w-px h-4 bg-white/10" />
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition"
            >
              WhatsApp
            </a>

          </div>
        </motion.div>
{/* <InstallButton /> */}
        {/* ── Status Bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-500"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            All systems operational
          </div>
          <a href="/status" className="text-purple-400 hover:text-purple-300">
            Status →
          </a>
        </motion.div>
      </div>
    </footer>
  );
}
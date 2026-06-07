"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react";

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@studyai.com",
    href: "mailto:hello@studyai.com",
    response: "Typically replies within 2-4 hours",
  },
  {
    icon: Phone,
    label: "WhatsApp",
    value: "+92 300-1234567",
    href: "https://wa.me/923001234567",
    response: "Chat anytime, instant replies",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "GCU Lahore, Pakistan",
    href: "#",
    response: "Open weekdays 9 AM - 6 PM",
  },
  {
    icon: MessageSquare,
    label: "Live Chat",
    value: "Chat with support",
    href: "#",
    response: "Available on this website",
  },
];

const FAQ_CATEGORIES = [
  {
    name: "Getting Started",
    questions: ["How do I create an account?", "What is free vs paid?"],
  },
  {
    name: "Billing",
    questions: ["How can I upgrade?", "Can I cancel anytime?"],
  },
  {
    name: "Technical",
    questions: ["Is my data safe?", "What browsers are supported?"],
  },
  {
    name: "Account",
    questions: ["How do I reset my password?", "Can I delete my account?"],
  },
];

export default function ContactPage() {
  const [formState, setFormState] = useState<"idle" | "sending" | "sent">(
    "idle"
  );
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("sending");
    await new Promise((r) => setTimeout(r, 2000));
    setFormState("sent");
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setFormState("idle"), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative py-20 px-6 border-b border-white/5"
      >
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-400">
            Have a question? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>
      </motion.div>

      {/* ── Contact Methods ── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold mb-8 text-center"
          >
            Get Help Quickly
          </motion.h2>
          <div className="grid md:grid-cols-4 gap-4">
            {CONTACT_INFO.map((info, i) => {
              const Icon = info.icon;
              return (
                <motion.a
                  key={i}
                  href={info.href}
                  target={info.href.startsWith("http") ? "_blank" : undefined}
                  rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">
                      {info.label}
                    </p>
                    <p className="text-sm font-semibold text-white mt-0.5">
                      {info.value}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {info.response}
                  </p>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Form + FAQ ── */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* ── Contact Form ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Ahmed Khan"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 transition"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="ahmed@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 transition"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                  placeholder="How can we help?"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 transition"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Message
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  placeholder="Tell us more..."
                  rows={5}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={formState === "sending"}
                className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition ${
                  formState === "sent"
                    ? "bg-green-500/20 border border-green-500/30 text-green-400"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 disabled:opacity-70"
                }`}
              >
                {formState === "sending" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : formState === "sent" ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* ── FAQ ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-6">Quick Help</h2>
            <div className="space-y-4">
              {FAQ_CATEGORIES.map((category, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10"
                >
                  <h3 className="font-semibold text-white mb-3">
                    {category.name}
                  </h3>
                  <ul className="space-y-2">
                    {category.questions.map((q, j) => (
                      <li key={j} className="flex gap-2 text-sm text-gray-400">
                        <span className="text-purple-400 mt-1">→</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-6 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10"
            >
              <p className="text-sm text-gray-400">
                Can't find an answer?{" "}
                <a
                  href="/help"
                  className="text-blue-400 font-medium hover:text-blue-300"
                >
                  Visit our help center
                </a>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Map Section ── */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold mb-8 text-center"
          >
            Visit Our Office
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            {/* Map Placeholder */}
            <div className="w-full h-80 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
              <MapPin className="w-12 h-12 opacity-20" />
            </div>

            {/* Location Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Government College University</h3>
                <p className="text-gray-400 leading-relaxed">
                  Kachnar Road, Lahore 54000, Pakistan
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Hours</h4>
                <ul className="space-y-1 text-gray-400 text-sm">
                  <li>Monday - Friday: 9:00 AM - 6:00 PM</li>
                  <li>Saturday: 10:00 AM - 4:00 PM</li>
                  <li>Sunday: Closed</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm font-medium"
                >
                  Get Directions
                </a>
                <a
                  href="https://wa.me/923001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 transition text-sm font-medium"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Response Guarantee ── */}
      <section className="py-12 px-6 border-t border-white/5 bg-white/[0.02]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-4"
        >
          <p className="text-lg font-semibold">💬 We Promise</p>
          <p className="text-gray-400 leading-relaxed">
            Every message gets a personal response from our team within 24 hours.
            We read every email, WhatsApp message, and contact form submission.
            Your feedback helps us improve StudyAI.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
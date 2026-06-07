"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  MessageSquare,
  Search,
  ChevronDown,
  AlertCircle,
  Lightbulb,
  Bug,
  Mail,
  ExternalLink,
} from "lucide-react";

const HELP_CATEGORIES = [
  {
    id: "common",
    title: "Common Issues",
    icon: AlertCircle,
    articles: [
      {
        title: "I forgot my password",
        slug: "forgot-password",
        content: `
Go to the login page and click "Forgot Password". Enter your email and we'll send a reset link within 2 minutes.

If you don't receive the email:
1. Check your spam/junk folder
2. Wait 5 minutes and try again
3. Use a different email if you have multiple accounts
4. Contact support if still stuck

Never share your password with anyone, including StudyAI staff.
        `,
      },
      {
        title: "Why can't I access my account?",
        slug: "account-access",
        content: `
If you're locked out:

1. **Check internet connection** - Make sure you're online
2. **Clear browser cache** - Try Ctrl+Shift+Delete (Chrome)
3. **Try another browser** - Firefox, Safari, Edge
4. **Check if account is deactivated** - See account status
5. **Wait 1 hour** - Sometimes there are server issues

Still stuck? Contact support with:
- Email address
- Last login date (if you remember)
- What error you see
        `,
      },
      {
        title: "Humanizer is slow",
        slug: "humanizer-slow",
        content: `
If humanization takes too long:

1. **Reduce text length** - Humanize in smaller chunks
2. **Use Standard mode** - Not Aggressive/Academic
3. **Check internet speed** - Use speedtest.net
4. **Close other tabs** - Free up browser memory
5. **Try different time** - Off-peak hours are faster

Pro users get priority processing - consider upgrading!
        `,
      },
    ],
  },
  {
    id: "billing",
    title: "Billing & Payments",
    icon: Mail,
    articles: [
      {
        title: "How do I upgrade to Pro?",
        slug: "upgrade-pro",
        content: `
To upgrade:

1. Go to Settings → Billing
2. Click "Upgrade to Pro"
3. Choose monthly or semester plan
4. Select payment method (JazzCash/EasyPaisa)
5. Complete payment
6. Instant activation!

You can downgrade anytime - no refund required.
        `,
      },
      {
        title: "Can I get a refund?",
        slug: "refund",
        content: `
Refund Policy:
- **7-day guarantee** - Full refund if not satisfied
- **No questions asked** - Just let us know
- **Instant processing** - Refund within 24 hours
- **Semester plan** - 30-day guarantee

To request refund:
Email refund@studyai.com with order number
        `,
      },
    ],
  },
  {
    id: "features",
    title: "Features Help",
    icon: Lightbulb,
    articles: [
      {
        title: "How does AI detection bypass work?",
        slug: "ai-bypass",
        content: `
Our humanizer:
1. Analyzes AI writing patterns
2. Rewrites preserving meaning
3. Adds natural variations
4. Maintains academic level
5. Keeps citations intact

Result: 99% bypass rate on:
- GPTZero
- Turnitin AI
- ZeroGPT
- Copyleaks

Always review humanized text before submitting!
        `,
      },
      {
        title: "What's included in Pro?",
        slug: "pro-features",
        content: `
Pro gives you:
✓ Unlimited humanizer
✓ Unlimited assignments
✓ Unlimited plagiarism checks
✓ All 6 tools unlimited
✓ Priority processing (10x faster)
✓ Export to Word/PDF
✓ Advanced AI models
✓ Priority email support

Worth every rupee for serious students!
        `,
      },
    ],
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openArticle, setOpenArticle] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return HELP_CATEGORIES;
    const query = searchQuery.toLowerCase();
    return HELP_CATEGORIES.map((cat) => ({
      ...cat,
      articles: cat.articles.filter(
        (art) =>
          art.title.toLowerCase().includes(query) ||
          art.content.toLowerCase().includes(query)
      ),
    })).filter((c) => c.articles.length > 0);
  }, [searchQuery]);

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-lg text-gray-400 mb-8">
            Find answers to common questions or get in touch with our support team.
          </p>

          {/* Search */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 max-w-md">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none flex-1"
            />
          </div>
        </div>
      </motion.div>

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category, i) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold">{category.title}</h2>
                </div>

                <div className="space-y-2">
                  {category.articles.map((article) => (
                    <motion.div
                      key={article.slug}
                      className="rounded-xl bg-white/5 border border-white/10 overflow-hidden hover:border-white/20 transition"
                    >
                      <button
                        onClick={() =>
                          setOpenArticle(
                            openArticle === article.slug ? null : article.slug
                          )
                        }
                        className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition"
                      >
                        <span className="text-left font-medium text-gray-200">
                          {article.title}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition flex-shrink-0 ${
                            openArticle === article.slug ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {openArticle === article.slug && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 border-t border-white/5 pt-4 text-gray-400 leading-relaxed space-y-2">
                            {article.content.split("\n").map((line, j) => (
                              <p key={j} className={line.endsWith(":") ? "font-semibold text-gray-300" : ""}>
                                {line}
                              </p>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              No articles found for "{searchQuery}"
            </p>
          </div>
        )}

        {/* ── Contact Support ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-center space-y-4"
        >
          <MessageSquare className="w-12 h-12 text-purple-400 mx-auto" />
          <h3 className="text-xl font-bold">Still Need Help?</h3>
          <p className="text-gray-400">
            Our support team is here to help. Reach out anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition font-medium"
            >
              Contact Support
            </Link>
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 font-medium hover:opacity-90 transition"
            >
              WhatsApp Us
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
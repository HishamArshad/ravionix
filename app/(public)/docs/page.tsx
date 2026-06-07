"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  BookOpen,
  Search,
  ChevronRight,
  Code,
  Zap,
  AlertCircle,
  Copy,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

const DOCS_SECTIONS = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Zap,
    subsections: [
      {
        id: "signup",
        title: "Sign Up & Login",
        content: `
## Creating Your Account

1. Visit studyai.com and click "Get Started"
2. Enter your email address
3. Create a strong password (8+ characters)
4. Verify your email (check spam folder)
5. Complete your profile with university details

## First Login

- You'll see a welcome tutorial
- Choose your plan (Free or Pro)
- Start using tools immediately
- No credit card required for free plan
        `,
      },
      {
        id: "plans",
        title: "Understanding Plans",
        content: `
## Free Plan
- 500 words/day humanizer
- 2 assignments/month
- 3 plagiarism checks/day
- Unlimited citations

## Student Pro (PKR 499/month)
- Unlimited all tools
- Priority processing
- Export to Word/PDF
- Advanced AI models

## Semester (PKR 1,999/6 months)
- Everything in Pro
- 33% savings
- Early feature access
- 1-on-1 onboarding
        `,
      },
    ],
  },
  {
    id: "tools",
    title: "Tools Guide",
    icon: Code,
    subsections: [
      {
        id: "humanizer",
        title: "AI Humanizer",
        content: `
## How to Use

1. Go to Dashboard → AI Humanizer
2. Paste your AI-generated text
3. Choose humanize mode (Standard/Aggressive/Academic/Casual)
4. Enable advanced options if needed
5. Click "Humanize"
6. Copy or download result

## Best Practices

- Paste complete sentences/paragraphs
- Use Academic mode for formal papers
- Check plagiarism after humanizing
- Never submit without reviewing
- Combine with your own research

## AI Score Explanation

- **High (>70%)**: Clearly AI-generated
- **Medium (30-70%)**: Possible AI content
- **Low (<30%)**: Looks human-written
        `,
      },
      {
        id: "assignment",
        title: "Assignment Generator",
        content: `
## Creating an Assignment

1. Select topic (Mechanics, Waves, etc)
2. Choose assignment type (Essay, Report, etc)
3. Set academic level and word count
4. Select writing tone
5. Add keywords (optional)
6. Configure advanced options
7. Click "Generate"

## Advanced Options

- Citation style (APA, MLA, Chicago, Harvard)
- Include abstract, table of contents, references
- Language (English/Urdu)
- Specific instructions

## After Generation

- Review carefully before submission
- Use as starting point only
- Add your own analysis
- Check plagiarism score
- Humanize if needed
        `,
      },
      {
        id: "plagiarism",
        title: "Plagiarism Checker",
        content: `
## Checking for Plagiarism

1. Paste text or upload PDF
2. Select sources to scan (Web, Academic, News, Books)
3. Choose scan depth (Standard/Deep/Academic)
4. Click "Check Plagiarism"

## Understanding Results

- **Overall Score**: Total similarity percentage
- **Green (<15%)**: Great, minimal plagiarism
- **Yellow (15-30%)**: Review sources
- **Red (>30%)**: Rewrite recommended

## Matched Sources

Each match shows:
- Source URL
- Matched text percentage
- Source type (Web/Academic/News)
- Exact matched text

## What Counts as Plagiarism

- Direct copy without quotes
- Paraphrasing without citation
- Not citing sources properly
- Self-plagiarism (reusing old work)
        `,
      },
    ],
  },
  {
    id: "account",
    title: "Account Management",
    icon: BookOpen,
    subsections: [
      {
        id: "profile",
        title: "Profile Settings",
        content: `
## Updating Profile

1. Go to Settings → Profile
2. Update personal information
3. Add academic details
4. Upload profile picture
5. Save changes

## Profile Picture

- Supports JPG, PNG, GIF
- Max 5MB file size
- Recommended: 400x400px
- Shows on assignments

## Academic Information

- University name
- Department/Program
- Semester/Year
- Roll number (optional)
        `,
      },
      {
        id: "security",
        title: "Security & Password",
        content: `
## Changing Password

1. Settings → Security
2. Enter current password
3. Set new password (8+ chars)
4. Must include uppercase, number, symbol
5. Confirm password match
6. Click "Update Password"

## Two-Factor Authentication

- Adds extra security layer
- Uses authenticator app
- Enabled in Security settings
- Required at each login

## Active Sessions

- View all logged-in devices
- Revoke access to old devices
- See login location & time
- Automatic logout after 30 days
        `,
      },
    ],
  },
];

export default function DocsPage() {
  const [selectedSection, setSelectedSection] = useState("getting-started");
  const [selectedSubsection, setSelectedSubsection] = useState("signup");
  const [searchQuery, setSearchQuery] = useState("");

  const currentSection = DOCS_SECTIONS.find((s) => s.id === selectedSection);
  const currentSubsection = currentSection?.subsections.find(
    (sub) => sub.id === selectedSubsection
  );

  const filteredSections = useMemo(() => {
    if (!searchQuery) return DOCS_SECTIONS;
    const query = searchQuery.toLowerCase();
    return DOCS_SECTIONS.map((section) => ({
      ...section,
      subsections: section.subsections.filter(
        (sub) =>
          sub.title.toLowerCase().includes(query) ||
          sub.content.toLowerCase().includes(query)
      ),
    })).filter((s) => s.subsections.length > 0);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative py-16 px-6 border-b border-white/5"
      >
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Documentation</h1>
          <p className="text-lg text-gray-400">
            Learn how to use StudyAI and get the most out of every feature.
          </p>

          {/* Search */}
          <div className="mt-6 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 max-w-md">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none flex-1"
            />
          </div>
        </div>
      </motion.div>

      {/* ── Content Grid ── */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-4 gap-8">
        {/* ── Sidebar ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-2 h-fit"
        >
          {filteredSections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id}>
                <button
                  onClick={() => {
                    setSelectedSection(section.id);
                    setSelectedSubsection(section.subsections[0].id);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition text-left ${
                    selectedSection === section.id
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : "text-gray-400 hover:text-gray-300 hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {section.title}
                </button>

                <AnimatePresence>
                  {selectedSection === section.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-4"
                    >
                      <div className="space-y-1 mt-1">
                        {section.subsections.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => setSelectedSubsection(sub.id)}
                            className={`w-full text-left px-4 py-2 rounded-lg text-xs font-medium transition ${
                              selectedSubsection === sub.id
                                ? "bg-white/10 text-white"
                                : "text-gray-500 hover:text-gray-300"
                            }`}
                          >
                            {sub.title}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>

        {/* ── Main Content ── */}
        <motion.div
          key={`${selectedSection}-${selectedSubsection}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="lg:col-span-3 space-y-6"
        >
          {currentSubsection ? (
            <>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {currentSubsection.title}
                </h1>
                <p className="text-gray-400">
                  Last updated: January 2025
                </p>
              </div>

              {/* Content */}
              <div className="prose prose-invert max-w-none">
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  {currentSubsection.content.split("\n").map((line, i) => {
                    if (line.startsWith("## ")) {
                      return (
                        <h2 key={i} className="text-2xl font-bold text-white mt-6 mb-3">
                          {line.replace("## ", "")}
                        </h2>
                      );
                    }
                    if (line.startsWith("- ")) {
                      return (
                        <li key={i} className="ml-6 flex items-start gap-2">
                          <span className="text-purple-400 mt-1.5 flex-shrink-0">
                            •
                          </span>
                          <span>{line.replace("- ", "")}</span>
                        </li>
                      );
                    }
                    if (line.trim() && !line.startsWith("#")) {
                      return (
                        <p key={i} className={line.endsWith(":") ? "font-semibold" : ""}>
                          {line}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-400">
                  Need more help?{" "}
                  <Link href="/help" className="text-blue-400 hover:text-blue-300">
                    Visit our Help Center
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No documentation found for "{searchQuery}"</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
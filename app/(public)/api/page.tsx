"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  Code,
  Copy,
  CheckCircle,
  ExternalLink,
  AlertCircle,
  Lock,
  Zap,
} from "lucide-react";

const API_ENDPOINTS = [
  {
    id: "humanize",
    name: "Humanize Text",
    method: "POST",
    path: "/api/humanize/",
    description: "Convert AI-generated text to human-like content",
    params: {
      text: "string (required) - Text to humanize",
      mode: "string - standard|aggressive|academic|casual",
      language: "string - en|ur",
    },
    response: {
      humanized_text: "string",
      original_text: "string",
      credits_used: "integer",
    },
    example: `{
  "text": "Artificial intelligence has become increasingly important...",
  "mode": "academic"
}`,
    exampleResponse: `{
  "humanized_text": "AI's growing significance cannot be overstated...",
  "credits_used": 250,
  "success": true
}`,
  },
  {
    id: "plagiarism",
    name: "Check Plagiarism",
    method: "POST",
    path: "/api/plagiarism/check/",
    description: "Scan text for plagiarism across billions of sources",
    params: {
      text: "string - Text to check",
      sources: "array - web|academic|news|books",
      depth: "string - standard|deep|academic",
    },
    response: {
      overall_score: "number (0-100)",
      matches: "array",
      unique_score: "number",
    },
    example: `{
  "text": "Climate change affects agriculture...",
  "sources": ["web", "academic"],
  "depth": "standard"
}`,
    exampleResponse: `{
  "overall_score": 23,
  "unique_score": 77,
  "matches": [
    {
      "url": "https://example.com",
      "title": "Article Title",
      "percentage": 12
    }
  ]
}`,
  },
  {
    id: "citation",
    name: "Generate Citation",
    method: "POST",
    path: "/api/citation/generate/",
    description: "Create formatted citations in multiple styles",
    params: {
      source_type: "string - book|journal|website|video",
      style: "string - apa|mla|chicago|harvard",
      data: "object - source-specific fields",
    },
    response: {
      formatted: "string",
      in_text: "string",
      style: "string",
    },
    example: `{
  "source_type": "book",
  "style": "apa",
  "data": {
    "title": "AI in Education",
    "author": "John Smith",
    "year": 2024
  }
}`,
    exampleResponse: `{
  "formatted": "Smith, J. (2024). AI in Education...",
  "in_text": "(Smith, 2024)",
  "style": "apa"
}`,
  },
];

const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  return (
    <div className="relative">
      <pre className="bg-[#1a1a2e] p-4 rounded-xl text-sm overflow-x-auto text-green-400 font-mono">
        <code>{code}</code>
      </pre>
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className={`absolute top-3 right-3 p-2 rounded-lg transition ${
          copied
            ? "bg-green-500/20 text-green-400"
            : "bg-white/5 text-gray-400 hover:bg-white/10"
        }`}
      >
        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default function APIPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState("humanize");

  const endpoint = API_ENDPOINTS.find((e) => e.id === selectedEndpoint);

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">API Reference</h1>
          <p className="text-lg text-gray-400">
            Integrate StudyAI capabilities into your own applications.
          </p>
        </div>
      </motion.div>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-4 gap-8">
        {/* ── Sidebar ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-1 h-fit"
        >
          <p className="text-xs text-gray-500 px-3 mb-3 uppercase font-semibold tracking-wider">
            Endpoints
          </p>
          {API_ENDPOINTS.map((ep) => (
            <button
              key={ep.id}
              onClick={() => setSelectedEndpoint(ep.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition ${
                selectedEndpoint === ep.id
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                  selectedEndpoint === ep.id ? "bg-purple-500/30" : "bg-white/10"
                }`}>
                  {ep.method}
                </span>
                <span className="truncate">{ep.name}</span>
              </div>
            </button>
          ))}
        </motion.div>

        {/* ── Main Content ── */}
        {endpoint && (
          <motion.div
            key={endpoint.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 space-y-8"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-sm font-bold">
                  {endpoint.method}
                </span>
                <code className="text-lg font-mono text-gray-300">
                  {endpoint.path}
                </code>
              </div>
              <p className="text-gray-400">{endpoint.description}</p>
            </div>

            {/* Authentication */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold">Authentication</h3>
              </div>
              <p className="text-sm text-gray-400">
                All requests require Bearer token authentication:
              </p>
              <CodeBlock code={`Authorization: Bearer YOUR_API_KEY`} />
              <p className="text-xs text-gray-500">
                Get your API key from{" "}
                <Link href="/settings" className="text-purple-400 hover:text-purple-300">
                  Settings → API Keys
                </Link>
              </p>
            </div>

            {/* Parameters */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Request Parameters</h3>
              <div className="space-y-3">
                {Object.entries(endpoint.params).map(([key, desc]) => (
                  <div key={key} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <code className="text-sm text-purple-400 font-mono">{key}</code>
                    <p className="text-sm text-gray-400 mt-1">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Example Request */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Example Request</h3>
              <CodeBlock code={endpoint.example} />
            </div>

            {/* Example Response */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Example Response</h3>
              <CodeBlock code={endpoint.exampleResponse} />
            </div>

            {/* Response Fields */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Response Fields</h3>
              <div className="space-y-3">
                {Object.entries(endpoint.response).map(([key, desc]) => (
                  <div key={key} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <code className="text-sm text-green-400 font-mono">{key}</code>
                    <p className="text-sm text-gray-400 mt-1">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Rate Limits */}
            <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold">Rate Limits</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Free plan: 10 requests/hour</li>
                <li>• Pro plan: 1000 requests/hour</li>
                <li>• Enterprise: Custom limits</li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Support ── */}
      <section className="py-12 px-6 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto p-8 rounded-2xl bg-white/5 border border-white/10 text-center space-y-4"
        >
          <h3 className="text-xl font-bold">Need API Help?</h3>
          <p className="text-gray-400">
            Check our full API docs or contact our developer support team.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="#"
              className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition font-medium text-sm"
            >
              Full Docs
            </a>
            <a
              href="mailto:api@studyai.com"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-medium text-sm hover:opacity-90 transition"
            >
              Email Support
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
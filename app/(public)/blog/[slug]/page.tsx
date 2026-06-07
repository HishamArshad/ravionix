"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  Calendar,
  User,
  BookOpen,
  Share2,
  Heart,
  MessageCircle,
  ThumbsUp,
//   Twitter,
//   Linkedin,
} from "lucide-react";
import { useState } from "react";

// Mock blog post data - in real app, fetch by slug
const BLOG_POST = {
  slug: "5-tips-to-improve-your-plagiarism-score",
  title: "5 Tips to Improve Your Plagiarism Score",
  excerpt:
    "Learn practical ways to reduce plagiarism and improve your academic integrity while maintaining originality in your work.",
  author: {
    name: "Ahmed Khan",
    avatar: "AK",
    role: "Co-founder",
    bio: "Ahmed leads product strategy at StudyAI. He's passionate about making education more accessible.",
  },
  date: "2025-01-15",
  readTime: 5,
  views: 1240,
  likes: 89,
  comments: 28,
  category: "Tips",
  tags: ["plagiarism", "academic-integrity", "writing"],
  content: `
## Understanding Plagiarism

Plagiarism is a serious academic offense that can result in failing grades or expulsion. Understanding what constitutes plagiarism is the first step toward avoiding it.

### What Counts as Plagiarism?

- **Direct copying**: Copying text without quotation marks or citations
- **Paraphrasing without citation**: Rewriting someone's work without crediting them
- **Mosaic plagiarism**: Mixing your words with source material without clear attribution
- **Self-plagiarism**: Submitting the same work for multiple assignments

## Tip #1: Use Your Own Words

When you paraphrase, don't just replace a few words. Truly rewrite the ideas in your own voice.

**Before (Plagiarism):**
"The student wrote an essay about the impact of social media on modern society."

**After (Your Own Words):**
"The student explored how social media platforms have transformed contemporary society."

## Tip #2: Cite Your Sources

Always include proper citations for:
- Direct quotes
- Paraphrased ideas
- Statistics and data
- Images and graphics

Use our Citation Generator tool to create proper citations in APA, MLA, or Chicago style.

## Tip #3: Take Good Notes

When researching, organize your notes clearly:
- Write down the source immediately
- Separate quotes from paraphrases
- Mark direct quotes with quotation marks
- Keep track of page numbers

## Tip #4: Use Plagiarism Checking Tools

Before submitting, check your work with plagiarism detection tools like:
- Turnitin
- Copyscape
- Our StudyAI Plagiarism Checker

This helps you catch and fix issues before submission.

## Tip #5: Review Your Work

Read through your essay one more time:
- Check that citations are in the right format
- Verify that all quotes are properly attributed
- Ensure your voice is present throughout
- Look for any accidental phrasing that matches sources

## Conclusion

Maintaining academic integrity isn't just about avoiding punishment—it's about developing your own voice as a writer and thinker. When you write in your own words and properly credit sources, you create genuine learning and demonstrate respect for other scholars' work.

Remember: your professors want to see YOUR ideas. Use sources to support and enhance your thinking, not replace it.
  `,
};

export default function BlogPostPage() {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(BLOG_POST.likes);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative py-12 px-6 border-b border-white/5"
      >
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {BLOG_POST.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-6 flex-wrap text-sm text-gray-400">
            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
              {BLOG_POST.category}
            </span>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(BLOG_POST.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {BLOG_POST.readTime} min read
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Content ── */}
      <article className="max-w-3xl mx-auto px-6 py-16">
        {/* Author */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 mb-12"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold flex-shrink-0">
            {BLOG_POST.author.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">{BLOG_POST.author.name}</p>
            <p className="text-sm text-gray-500">{BLOG_POST.author.role}</p>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="prose prose-invert prose-sm md:prose-base max-w-none mb-12 space-y-6"
        >
          {BLOG_POST.content.split("\n\n").map((para, i) => {
            if (para.startsWith("##")) {
              return (
                <h2 key={i} className="text-2xl font-bold mt-8 mb-4">
                  {para.replace("## ", "")}
                </h2>
              );
            }
            if (para.startsWith("###")) {
              return (
                <h3 key={i} className="text-xl font-semibold mt-6 mb-3">
                  {para.replace("### ", "")}
                </h3>
              );
            }
            if (para.startsWith("- ")) {
              return (
                <ul key={i} className="space-y-2 list-disc list-inside text-gray-400">
                  {para.split("\n").map((item, j) => (
                    <li key={j}>{item.replace("- ", "")}</li>
                  ))}
                </ul>
              );
            }
            if (para.startsWith("**")) {
              return (
                <p key={i} className="text-gray-300 italic bg-white/5 p-4 rounded-xl border-l-4 border-purple-500">
                  {para}
                </p>
              );
            }
            return (
              <p key={i} className="text-gray-400 leading-relaxed">
                {para}
              </p>
            );
          })}
        </motion.div>

        {/* Tags */}
        <div className="flex gap-3 flex-wrap mb-8 pb-8 border-b border-white/5">
          {BLOG_POST.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?search=${tag}`}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:border-white/20 transition"
            >
              #{tag}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between py-8 border-b border-white/5 mb-12"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                liked
                  ? "bg-red-500/20 border border-red-500/30 text-red-400"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
              {likes}
            </button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400">
              <MessageCircle className="w-4 h-4" />
              {BLOG_POST.comments}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400">
              <ThumbsUp className="w-4 h-4" />
              {BLOG_POST.views}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition">
              <Twitter className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition">
              <Linkedin className="w-4 h-4" />
            </button> */}
            <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Related Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "How to Cite Sources Properly",
                slug: "how-to-cite-sources",
              },
              {
                title: "Academic Integrity Guide",
                slug: "academic-integrity-guide",
              },
            ].map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition"
              >
                <h4 className="font-semibold group-hover:text-purple-400 transition mb-2">
                  {post.title}
                </h4>
                <p className="text-sm text-gray-500">Read article →</p>
              </Link>
            ))}
          </div>
        </motion.div>
      </article>
    </div>
  );
}
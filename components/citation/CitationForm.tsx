"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  BookOpen,
  FileText,
  Newspaper,
  Video,
  Mic,
  GraduationCap,
  Database,
  ChevronDown,
  Plus,
  Loader2,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import CitationOutput from "./CitationOutput";

// ── Types ──────────────────────────────────────────────
type SourceType =
  | "website"
  | "book"
  | "journal"
  | "newspaper"
  | "video"
  | "podcast"
  | "thesis"
  | "database";

type CitationStyle = "apa" | "mla" | "chicago" | "harvard" | "vancouver" | "ieee";

interface Author {
  id: string;
  firstName: string;
  lastName: string;
}

interface WebsiteForm {
  url: string;
  title: string;
  websiteName: string;
  publishDate: string;
  accessDate: string;
  authors: Author[];
}

interface BookForm {
  title: string;
  authors: Author[];
  publisher: string;
  publishYear: string;
  edition: string;
  city: string;
  isbn: string;
  pages: string;
}

interface JournalForm {
  title: string;
  authors: Author[];
  journalName: string;
  volume: string;
  issue: string;
  pages: string;
  publishYear: string;
  doi: string;
}

interface NewspaperForm {
  title: string;
  authors: Author[];
  newspaperName: string;
  publishDate: string;
  pages: string;
  url: string;
}

interface VideoForm {
  title: string;
  channelName: string;
  platform: string;
  publishDate: string;
  url: string;
  duration: string;
}

interface PodcastForm {
  title: string;
  hostName: string;
  podcastName: string;
  episodeNumber: string;
  publishDate: string;
  url: string;
}

interface ThesisForm {
  title: string;
  authors: Author[];
  university: string;
  degree: string;
  publishYear: string;
  city: string;
  url: string;
}

type FormFields =
  | WebsiteForm
  | BookForm
  | JournalForm
  | NewspaperForm
  | VideoForm
  | PodcastForm
  | ThesisForm;

interface GeneratedCitation {
  formatted: string;
  style: CitationStyle;
  sourceType: SourceType;
  inText: string;
  footnote?: string;
}

// ── Source Type Options ────────────────────────────────
const SOURCE_TYPES: {
  value: SourceType;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}[] = [
  { value: "website", label: "Website", icon: Globe, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
  { value: "book", label: "Book", icon: BookOpen, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30" },
  { value: "journal", label: "Journal", icon: FileText, color: "text-green-400", bg: "bg-green-500/10 border-green-500/30" },
  { value: "newspaper", label: "Newspaper", icon: Newspaper, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30" },
  { value: "video", label: "Video", icon: Video, color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
  { value: "podcast", label: "Podcast", icon: Mic, color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/30" },
  { value: "thesis", label: "Thesis", icon: GraduationCap, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30" },
  { value: "database", label: "Database", icon: Database, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/30" },
];

// ── Citation Style Options ─────────────────────────────
const CITATION_STYLES: {
  value: CitationStyle;
  label: string;
  description: string;
  usedFor: string;
}[] = [
  { value: "apa", label: "APA 7th", description: "American Psychological Association", usedFor: "Psychology, Education, Sciences" },
  { value: "mla", label: "MLA 9th", description: "Modern Language Association", usedFor: "Literature, Arts, Humanities" },
  { value: "chicago", label: "Chicago", description: "Chicago Manual of Style", usedFor: "History, Business, Fine Arts" },
  { value: "harvard", label: "Harvard", description: "Harvard Referencing System", usedFor: "Most UK universities" },
  { value: "vancouver", label: "Vancouver", description: "Vancouver Citation System", usedFor: "Medicine, Life Sciences" },
  { value: "ieee", label: "IEEE", description: "Institute of Electrical & Electronics Engineers", usedFor: "Engineering, Computer Science" },
];

// ── Default Authors ────────────────────────────────────
const newAuthor = (): Author => ({
  id: Math.random().toString(36).slice(2),
  firstName: "",
  lastName: "",
});

// ── Input Field Component ──────────────────────────────
function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 focus:bg-white/10 transition"
      />
      {hint && <p className="text-[10px] text-gray-600 mt-1">{hint}</p>}
    </div>
  );
}

// ── Authors Input ──────────────────────────────────────
function AuthorsInput({
  authors,
  onChange,
}: {
  authors: Author[];
  onChange: (authors: Author[]) => void;
}) {
  const updateAuthor = (id: string, field: "firstName" | "lastName", val: string) => {
    onChange(authors.map((a) => (a.id === id ? { ...a, [field]: val } : a)));
  };

  const removeAuthor = (id: string) => {
    if (authors.length > 1) onChange(authors.filter((a) => a.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs text-gray-500">
          Author(s) <span className="text-red-400">*</span>
        </label>
        {authors.length < 6 && (
          <button
            type="button"
            onClick={() => onChange([...authors, newAuthor()])}
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition"
          >
            <Plus className="w-3 h-3" />
            Add Author
          </button>
        )}
      </div>
      <div className="space-y-2">
        {authors.map((author, i) => (
          <div key={author.id} className="flex gap-2 items-center">
            <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] text-gray-500">{i + 1}</span>
            </div>
            <input
              type="text"
              placeholder="First name"
              value={author.firstName}
              onChange={(e) => updateAuthor(author.id, "firstName", e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 transition"
            />
            <input
              type="text"
              placeholder="Last name"
              value={author.lastName}
              onChange={(e) => updateAuthor(author.id, "lastName", e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 transition"
            />
            {authors.length > 1 && (
              <button
                type="button"
                onClick={() => removeAuthor(author.id)}
                className="w-8 h-8 rounded-lg hover:bg-red-500/20 flex items-center justify-center text-gray-600 hover:text-red-400 transition flex-shrink-0"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Style Selector ─────────────────────────────────────
function StyleSelector({
  selected,
  onChange,
}: {
  selected: CitationStyle;
  onChange: (s: CitationStyle) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = CITATION_STYLES.find((s) => s.value === selected)!;

  return (
    <div className="relative">
      <label className="block text-xs text-gray-500 mb-1.5">Citation Style</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
      >
        <div className="text-left">
          <p className="text-sm font-semibold text-blue-400">{current.label}</p>
          <p className="text-xs text-gray-500">{current.description}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full mt-2 left-0 right-0 z-50 bg-[#13131f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            {CITATION_STYLES.map((style) => (
              <button
                key={style.value}
                type="button"
                onClick={() => { onChange(style.value); setOpen(false); }}
                className={`w-full flex items-start gap-3 px-4 py-3 transition text-left ${
                  selected === style.value
                    ? "bg-blue-500/20"
                    : "hover:bg-white/5"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  selected === style.value ? "bg-blue-500/30" : "bg-white/5"
                }`}>
                  <span className={`text-xs font-bold ${
                    selected === style.value ? "text-blue-400" : "text-gray-400"
                  }`}>
                    {style.label.split(" ")[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    selected === style.value ? "text-blue-300" : "text-gray-200"
                  }`}>
                    {style.label}
                  </p>
                  <p className="text-xs text-gray-500">{style.description}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">
                    Used for: {style.usedFor}
                  </p>
                </div>
                {selected === style.value && (
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Source Type Forms ──────────────────────────────────
function WebsiteFields({
  data,
  onChange,
}: {
  data: WebsiteForm;
  onChange: (d: WebsiteForm) => void;
}) {
  const u = <K extends keyof WebsiteForm>(k: K, v: WebsiteForm[K]) =>
    onChange({ ...data, [k]: v });

  return (
    <div className="space-y-4">
      <Field label="URL" value={data.url} onChange={(v) => u("url", v)}
        placeholder="https://example.com/article" required
        hint="Paste the full URL of the webpage" />
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Page Title" value={data.title} onChange={(v) => u("title", v)}
          placeholder="Article or page title" required />
        <Field label="Website Name" value={data.websiteName} onChange={(v) => u("websiteName", v)}
          placeholder="e.g. BBC News" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Publish Date" value={data.publishDate} onChange={(v) => u("publishDate", v)}
          type="date" />
        <Field label="Access Date" value={data.accessDate} onChange={(v) => u("accessDate", v)}
          type="date" hint="Date you visited the page" />
      </div>
      <AuthorsInput authors={data.authors} onChange={(a) => u("authors", a)} />
    </div>
  );
}

function BookFields({
  data,
  onChange,
}: {
  data: BookForm;
  onChange: (d: BookForm) => void;
}) {
  const u = <K extends keyof BookForm>(k: K, v: BookForm[K]) =>
    onChange({ ...data, [k]: v });

  return (
    <div className="space-y-4">
      <Field label="Book Title" value={data.title} onChange={(v) => u("title", v)}
        placeholder="Full title of the book" required />
      <AuthorsInput authors={data.authors} onChange={(a) => u("authors", a)} />
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Publisher" value={data.publisher} onChange={(v) => u("publisher", v)}
          placeholder="e.g. Oxford University Press" required />
        <Field label="Publish Year" value={data.publishYear} onChange={(v) => u("publishYear", v)}
          placeholder="e.g. 2023" type="number" />
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Field label="Edition" value={data.edition} onChange={(v) => u("edition", v)}
          placeholder="e.g. 3rd" />
        <Field label="City" value={data.city} onChange={(v) => u("city", v)}
          placeholder="e.g. New York" />
        <Field label="ISBN" value={data.isbn} onChange={(v) => u("isbn", v)}
          placeholder="978-XXXXXXXXXX" />
      </div>
      <Field label="Pages Cited" value={data.pages} onChange={(v) => u("pages", v)}
        placeholder="e.g. 45-67" hint="Optional: specific pages you referenced" />
    </div>
  );
}

function JournalFields({
  data,
  onChange,
}: {
  data: JournalForm;
  onChange: (d: JournalForm) => void;
}) {
  const u = <K extends keyof JournalForm>(k: K, v: JournalForm[K]) =>
    onChange({ ...data, [k]: v });

  return (
    <div className="space-y-4">
      <Field label="Article Title" value={data.title} onChange={(v) => u("title", v)}
        placeholder="Full title of the article" required />
      <AuthorsInput authors={data.authors} onChange={(a) => u("authors", a)} />
      <Field label="Journal Name" value={data.journalName} onChange={(v) => u("journalName", v)}
        placeholder="e.g. Nature, The Lancet" required />
      <div className="grid md:grid-cols-4 gap-4">
        <Field label="Volume" value={data.volume} onChange={(v) => u("volume", v)}
          placeholder="e.g. 45" />
        <Field label="Issue" value={data.issue} onChange={(v) => u("issue", v)}
          placeholder="e.g. 3" />
        <Field label="Pages" value={data.pages} onChange={(v) => u("pages", v)}
          placeholder="e.g. 112-134" />
        <Field label="Year" value={data.publishYear} onChange={(v) => u("publishYear", v)}
          placeholder="2023" />
      </div>
      <Field label="DOI" value={data.doi} onChange={(v) => u("doi", v)}
        placeholder="10.xxxx/xxxxx"
        hint="Digital Object Identifier — most reliable identifier for academic papers" />
    </div>
  );
}

function NewspaperFields({
  data,
  onChange,
}: {
  data: NewspaperForm;
  onChange: (d: NewspaperForm) => void;
}) {
  const u = <K extends keyof NewspaperForm>(k: K, v: NewspaperForm[K]) =>
    onChange({ ...data, [k]: v });

  return (
    <div className="space-y-4">
      <Field label="Article Title" value={data.title} onChange={(v) => u("title", v)}
        placeholder="Full headline" required />
      <AuthorsInput authors={data.authors} onChange={(a) => u("authors", a)} />
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Newspaper Name" value={data.newspaperName} onChange={(v) => u("newspaperName", v)}
          placeholder="e.g. Dawn, The News" required />
        <Field label="Publish Date" value={data.publishDate} onChange={(v) => u("publishDate", v)}
          type="date" required />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Page(s)" value={data.pages} onChange={(v) => u("pages", v)}
          placeholder="e.g. A1, B3" />
        <Field label="URL (if online)" value={data.url} onChange={(v) => u("url", v)}
          placeholder="https://..." />
      </div>
    </div>
  );
}

function VideoFields({
  data,
  onChange,
}: {
  data: VideoForm;
  onChange: (d: VideoForm) => void;
}) {
  const u = <K extends keyof VideoForm>(k: K, v: VideoForm[K]) =>
    onChange({ ...data, [k]: v });

  return (
    <div className="space-y-4">
      <Field label="Video Title" value={data.title} onChange={(v) => u("title", v)}
        placeholder="Full title of the video" required />
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Channel / Creator" value={data.channelName} onChange={(v) => u("channelName", v)}
          placeholder="e.g. Veritasium" required />
        <Field label="Platform" value={data.platform} onChange={(v) => u("platform", v)}
          placeholder="e.g. YouTube, Vimeo" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Publish Date" value={data.publishDate} onChange={(v) => u("publishDate", v)}
          type="date" />
        <Field label="Duration" value={data.duration} onChange={(v) => u("duration", v)}
          placeholder="e.g. 12:34" />
      </div>
      <Field label="URL" value={data.url} onChange={(v) => u("url", v)}
        placeholder="https://youtube.com/watch?v=..." required />
    </div>
  );
}

function PodcastFields({
  data,
  onChange,
}: {
  data: PodcastForm;
  onChange: (d: PodcastForm) => void;
}) {
  const u = <K extends keyof PodcastForm>(k: K, v: PodcastForm[K]) =>
    onChange({ ...data, [k]: v });

  return (
    <div className="space-y-4">
      <Field label="Episode Title" value={data.title} onChange={(v) => u("title", v)}
        placeholder="Full episode title" required />
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Host Name" value={data.hostName} onChange={(v) => u("hostName", v)}
          placeholder="e.g. Lex Fridman" required />
        <Field label="Podcast Name" value={data.podcastName} onChange={(v) => u("podcastName", v)}
          placeholder="e.g. Lex Fridman Podcast" required />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Episode Number" value={data.episodeNumber} onChange={(v) => u("episodeNumber", v)}
          placeholder="e.g. 123" />
        <Field label="Publish Date" value={data.publishDate} onChange={(v) => u("publishDate", v)}
          type="date" />
      </div>
      <Field label="URL" value={data.url} onChange={(v) => u("url", v)}
        placeholder="https://..." />
    </div>
  );
}

function ThesisFields({
  data,
  onChange,
}: {
  data: ThesisForm;
  onChange: (d: ThesisForm) => void;
}) {
  const u = <K extends keyof ThesisForm>(k: K, v: ThesisForm[K]) =>
    onChange({ ...data, [k]: v });

  return (
    <div className="space-y-4">
      <Field label="Thesis Title" value={data.title} onChange={(v) => u("title", v)}
        placeholder="Full title of the thesis or dissertation" required />
      <AuthorsInput authors={data.authors} onChange={(a) => u("authors", a)} />
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="University" value={data.university} onChange={(v) => u("university", v)}
          placeholder="e.g. University of Punjab" required />
        <Field label="Degree" value={data.degree} onChange={(v) => u("degree", v)}
          placeholder="e.g. PhD, MS, BS" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Year" value={data.publishYear} onChange={(v) => u("publishYear", v)}
          placeholder="e.g. 2023" />
        <Field label="City" value={data.city} onChange={(v) => u("city", v)}
          placeholder="e.g. Lahore" />
      </div>
      <Field label="URL / Repository Link" value={data.url} onChange={(v) => u("url", v)}
        placeholder="https://..." hint="Optional: link to online repository" />
    </div>
  );
}

// ── Default Form Data ──────────────────────────────────
const DEFAULT_FORMS: Record<SourceType, FormFields> = {
  website: { url: "", title: "", websiteName: "", publishDate: "", accessDate: "", authors: [newAuthor()] },
  book: { title: "", authors: [newAuthor()], publisher: "", publishYear: "", edition: "", city: "", isbn: "", pages: "" },
  journal: { title: "", authors: [newAuthor()], journalName: "", volume: "", issue: "", pages: "", publishYear: "", doi: "" },
  newspaper: { title: "", authors: [newAuthor()], newspaperName: "", publishDate: "", pages: "", url: "" },
  video: { title: "", channelName: "", platform: "", publishDate: "", url: "", duration: "" },
  podcast: { title: "", hostName: "", podcastName: "", episodeNumber: "", publishDate: "", url: "" },
  thesis: { title: "", authors: [newAuthor()], university: "", degree: "", publishYear: "", city: "", url: "" },
  database: { url: "", title: "", websiteName: "", publishDate: "", accessDate: "", authors: [newAuthor()] },
};

// ── Main Component ─────────────────────────────────────
export default function CitationForm() {
  const [sourceType, setSourceType] = useState<SourceType>("website");
  const [citationStyle, setCitationStyle] = useState<CitationStyle>("apa");
  const [formData, setFormData] = useState<Record<SourceType, FormFields>>({ ...DEFAULT_FORMS });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<GeneratedCitation | null>(null);

  const currentForm = formData[sourceType];

  const updateForm = useCallback(
    (data: FormFields) => {
      setFormData((prev) => ({ ...prev, [sourceType]: data }));
    },
    [sourceType]
  );

  const handleReset = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      [sourceType]: { ...DEFAULT_FORMS[sourceType], authors: [newAuthor()] },
    }));
    setResult(null);
    setError("");
  }, [sourceType]);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setError("");
    setResult(null);

    try {
      // ── API CALL PLACEHOLDER ─────────────────────────
      // const response = await fetch("http://localhost:8000/api/citation/generate/", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({
      //     source_type: sourceType,
      //     citation_style: citationStyle,
      //     form_data: currentForm,
      //   }),
      // });
      // const data = await response.json();
      // setResult(data);
      // ─────────────────────────────────────────────────

      await new Promise((r) => setTimeout(r, 1500));

      // Simulated APA example
      const form = currentForm as any;
      const authorStr =
        "authors" in form && form.authors?.length
          ? form.authors
              .map((a: Author) => `${a.lastName}, ${a.firstName.charAt(0)}.`)
              .join(", ")
          : form.channelName || form.hostName || "Unknown";

      const year =
        "publishYear" in form
          ? form.publishYear || "n.d."
          : form.publishDate
          ? new Date(form.publishDate).getFullYear() || "n.d."
          : "n.d.";

      const title = form.title || "Untitled";

      let formatted = "";
      let inText = "";
      let footnote = "";

      if (citationStyle === "apa") {
        if (sourceType === "book") {
          formatted = `${authorStr} (${year}). *${title}* (${form.edition || "1st"} ed.). ${form.publisher}.`;
          inText = `(${form.authors?.[0]?.lastName || "Author"}, ${year})`;
        } else if (sourceType === "journal") {
          formatted = `${authorStr} (${year}). ${title}. *${form.journalName}*, *${form.volume}*(${form.issue}), ${form.pages}. https://doi.org/${form.doi}`;
          inText = `(${form.authors?.[0]?.lastName || "Author"}, ${year}, p. ${form.pages?.split("-")[0] || "1"})`;
        } else if (sourceType === "website") {
          formatted = `${authorStr} (${year}). ${title}. *${form.websiteName}*. ${form.url}`;
          inText = `(${form.authors?.[0]?.lastName || "Author"}, ${year})`;
        } else if (sourceType === "video") {
          formatted = `${form.channelName}. (${year}, ${form.publishDate}). *${title}* [Video]. ${form.platform}. ${form.url}`;
          inText = `(${form.channelName}, ${year})`;
        } else {
          formatted = `${authorStr} (${year}). ${title}.`;
          inText = `(${authorStr.split(",")[0]}, ${year})`;
        }
        footnote = formatted;
      } else if (citationStyle === "mla") {
        if (sourceType === "book") {
          formatted = `${authorStr} *${title}*. ${form.publisher}, ${year}.`;
          inText = `(${form.authors?.[0]?.lastName || "Author"} ${form.pages || "1"})`;
        } else if (sourceType === "journal") {
          formatted = `${authorStr} "${title}." *${form.journalName}*, vol. ${form.volume}, no. ${form.issue}, ${year}, pp. ${form.pages}.`;
          inText = `(${form.authors?.[0]?.lastName || "Author"} ${form.pages?.split("-")[0] || "1"})`;
        } else {
          formatted = `${authorStr} "${title}." ${year}.`;
          inText = `(${authorStr.split(",")[0]} ${year})`;
        }
      } else if (citationStyle === "harvard") {
        formatted = `${authorStr} (${year}) *${title}*. ${
          "publisher" in form ? form.publisher : "publisher"
        }.`;
        inText = `(${form.authors?.[0]?.lastName || "Author"}, ${year})`;
      } else if (citationStyle === "chicago") {
        formatted = `${authorStr} *${title}*. ${"city" in form ? form.city : "New York"}: ${
          "publisher" in form ? form.publisher : "Publisher"
        }, ${year}.`;
        footnote = `${authorStr.split(",").reverse().join(" ")}, *${title}* (${"city" in form ? form.city : "New York"}: ${"publisher" in form ? form.publisher : "Publisher"}, ${year}), ${"pages" in form ? form.pages : "1"}.`;
        inText = `${authorStr.split(",").reverse().join(" ")}, ${year}`;
      } else if (citationStyle === "ieee") {
        formatted = `${authorStr}, "${title}," *${"journalName" in form ? form.journalName : "Publisher"}*, vol. ${"volume" in form ? form.volume : "1"}, pp. ${"pages" in form ? form.pages : "1"}, ${year}.`;
        inText = `[1]`;
      } else {
        formatted = `${authorStr} (${year}) ${title}.`;
        inText = `(${authorStr.split(",")[0]}, ${year})`;
      }

      setResult({
        formatted,
        style: citationStyle,
        sourceType,
        inText,
        footnote: footnote || undefined,
      });
    } catch {
      setError("Failed to generate citation. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [sourceType, citationStyle, currentForm]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-4"
    >
      {/* ── Source Type Picker ── */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          Select Source Type
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {SOURCE_TYPES.map((st) => {
            const isActive = sourceType === st.value;
            return (
              <motion.button
                key={st.value}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSourceType(st.value);
                  setResult(null);
                  setError("");
                }}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition ${
                  isActive ? st.bg : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <st.icon className={`w-5 h-5 ${isActive ? st.color : "text-gray-500"}`} />
                <span className={`text-[10px] font-medium ${isActive ? st.color : "text-gray-500"}`}>
                  {st.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Form + Output Grid ── */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* Form Panel — 3 cols */}
        <div className="lg:col-span-3 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          {/* Panel Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              {(() => {
                const st = SOURCE_TYPES.find((s) => s.value === sourceType)!;
                return (
                  <>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${st.bg}`}>
                      <st.icon className={`w-3.5 h-3.5 ${st.color}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-300">
                      {st.label} Details
                    </span>
                  </>
                );
              })()}
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition"
            >
              <RefreshCw className="w-3 h-3" />
              Reset
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Citation Style Selector */}
            <StyleSelector selected={citationStyle} onChange={setCitationStyle} />

            {/* Dynamic Form Fields */}
            <div className="pt-2 border-t border-white/5">
              <p className="text-xs text-gray-500 mb-4">Source Information</p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={sourceType}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  {sourceType === "website" && (
                    <WebsiteFields
                      data={currentForm as WebsiteForm}
                      onChange={updateForm}
                    />
                  )}
                  {sourceType === "book" && (
                    <BookFields
                      data={currentForm as BookForm}
                      onChange={updateForm}
                    />
                  )}
                  {sourceType === "journal" && (
                    <JournalFields
                      data={currentForm as JournalForm}
                      onChange={updateForm}
                    />
                  )}
                  {sourceType === "newspaper" && (
                    <NewspaperFields
                      data={currentForm as NewspaperForm}
                      onChange={updateForm}
                    />
                  )}
                  {sourceType === "video" && (
                    <VideoFields
                      data={currentForm as VideoForm}
                      onChange={updateForm}
                    />
                  )}
                  {sourceType === "podcast" && (
                    <PodcastFields
                      data={currentForm as PodcastForm}
                      onChange={updateForm}
                    />
                  )}
                  {sourceType === "thesis" && (
                    <ThesisFields
                      data={currentForm as ThesisForm}
                      onChange={updateForm}
                    />
                  )}
                  {sourceType === "database" && (
                    <WebsiteFields
                      data={currentForm as WebsiteForm}
                      onChange={updateForm}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Citation...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Citation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Panel — 2 cols */}
        <div className="lg:col-span-2">
          <CitationOutput
            result={result}
            isGenerating={isGenerating}
            citationStyle={citationStyle}
            sourceType={sourceType}
            onChangeStyle={setCitationStyle}
          />
        </div>
      </div>
    </motion.div>
  );
}
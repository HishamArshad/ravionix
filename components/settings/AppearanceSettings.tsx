"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Moon,
  Sun,
  Monitor,
  Type,
  Layout,
  CheckCircle,
  Loader2,
  Save,
  Palette,
  Zap,
} from "lucide-react";

type Theme = "dark" | "light" | "system";
type AccentColor = "purple" | "blue" | "green" | "orange" | "pink" | "red";
type FontSize = "small" | "medium" | "large";
type DensityType = "compact" | "comfortable" | "spacious";
type AnimationType = "full" | "reduced" | "none";

const ACCENT_COLORS: { value: AccentColor; color: string; bg: string; ring: string }[] = [
  { value: "purple", color: "bg-purple-500", bg: "bg-purple-500/20", ring: "ring-purple-500" },
  { value: "blue", color: "bg-blue-500", bg: "bg-blue-500/20", ring: "ring-blue-500" },
  { value: "green", color: "bg-green-500", bg: "bg-green-500/20", ring: "ring-green-500" },
  { value: "orange", color: "bg-orange-500", bg: "bg-orange-500/20", ring: "ring-orange-500" },
  { value: "pink", color: "bg-pink-500", bg: "bg-pink-500/20", ring: "ring-pink-500" },
  { value: "red", color: "bg-red-500", bg: "bg-red-500/20", ring: "ring-red-500" },
];

function Section({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
          <Icon className="w-4 h-4 text-gray-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function AppearanceSettings() {
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [theme, setTheme] = useState<Theme>("dark");
  const [accent, setAccent] = useState<AccentColor>("purple");
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [density, setDensity] = useState<DensityType>("comfortable");
  const [animations, setAnimations] = useState<AnimationType>("full");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [compactCards, setCompactCards] = useState(false);

  const handleSave = async () => {
    setSaveState("saving");
    await new Promise((r) => setTimeout(r, 1200));
    setSaveState("saved");
    setTimeout(() => setSaveState("idle"), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      {/* ── Theme ── */}
      <Section
        title="Theme"
        description="Choose your preferred color scheme"
        icon={Palette}
      >
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "dark" as Theme, label: "Dark", icon: Moon, preview: "bg-[#0a0a0f]" },
            { value: "light" as Theme, label: "Light", icon: Sun, preview: "bg-white" },
            { value: "system" as Theme, label: "System", icon: Monitor, preview: "bg-gradient-to-r from-[#0a0a0f] to-white" },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={`relative p-4 rounded-2xl border transition group ${
                theme === t.value
                  ? "bg-purple-500/20 border-purple-500/50"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              {/* Preview */}
              <div className={`w-full h-16 rounded-xl mb-3 ${t.preview} border border-white/10 overflow-hidden relative`}>
                {/* Mini UI preview */}
                <div className="absolute inset-0 flex">
                  <div className={`w-1/4 h-full ${t.value === "light" ? "bg-gray-100" : "bg-white/5"}`} />
                  <div className="flex-1 p-1.5 space-y-1">
                    <div className={`h-2 rounded ${t.value === "light" ? "bg-gray-200" : "bg-white/10"}`} />
                    <div className={`h-2 w-3/4 rounded ${t.value === "light" ? "bg-gray-200" : "bg-white/10"}`} />
                    <div className={`h-4 rounded mt-1 ${t.value === "light" ? "bg-purple-200" : "bg-purple-500/30"}`} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5">
                <t.icon className={`w-3.5 h-3.5 ${theme === t.value ? "text-purple-400" : "text-gray-400"}`} />
                <span className={`text-xs font-medium ${theme === t.value ? "text-purple-300" : "text-gray-300"}`}>
                  {t.label}
                </span>
              </div>

              {theme === t.value && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="w-4 h-4 text-purple-400" />
                </div>
              )}
            </button>
          ))}
        </div>
      </Section>

      {/* ── Accent Color ── */}
      <Section
        title="Accent Color"
        description="Personalize your dashboard color"
        icon={Palette}
      >
        <div className="flex gap-3 flex-wrap">
          {ACCENT_COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => setAccent(c.value)}
              className={`w-10 h-10 rounded-xl ${c.color} transition-all hover:scale-110 ${
                accent === c.value
                  ? `ring-2 ring-offset-2 ring-offset-[#0d0d14] ${c.ring} scale-110`
                  : ""
              }`}
            >
              {accent === c.value && (
                <div className="w-full h-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs text-gray-400">
            Selected:{" "}
            <span className="capitalize font-medium text-gray-200">{accent}</span>
            {" "}- Used for buttons, highlights and active states
          </p>
        </div>
      </Section>

      {/* ── Font Size ── */}
      <Section
        title="Font Size"
        description="Adjust text size for readability"
        icon={Type}
      >
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "small" as FontSize, label: "Small", size: "text-xs", preview: "Aa" },
            { value: "medium" as FontSize, label: "Medium", size: "text-sm", preview: "Aa" },
            { value: "large" as FontSize, label: "Large", size: "text-base", preview: "Aa" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFontSize(f.value)}
              className={`p-4 rounded-xl border transition text-center ${
                fontSize === f.value
                  ? "bg-purple-500/20 border-purple-500/40"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <p className={`font-bold ${f.size} ${fontSize === f.value ? "text-purple-300" : "text-gray-300"} mb-1`}>
                {f.preview}
              </p>
              <p className={`text-xs ${fontSize === f.value ? "text-purple-400" : "text-gray-500"}`}>
                {f.label}
              </p>
            </button>
          ))}
        </div>
      </Section>

      {/* ── Layout Density ── */}
      <Section
        title="Layout Density"
        description="Control spacing between elements"
        icon={Layout}
      >
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "compact" as DensityType, label: "Compact", desc: "Less spacing" },
            { value: "comfortable" as DensityType, label: "Comfortable", desc: "Default spacing" },
            { value: "spacious" as DensityType, label: "Spacious", desc: "More breathing room" },
          ].map((d) => (
            <button
              key={d.value}
              onClick={() => setDensity(d.value)}
              className={`p-3 rounded-xl border transition text-center ${
                density === d.value
                  ? "bg-purple-500/20 border-purple-500/40"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              {/* Density visual */}
              <div className="flex flex-col gap-0.5 mb-2 items-center">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 rounded bg-current transition ${
                      density === d.value ? "text-purple-400" : "text-gray-600"
                    } ${d.value === "compact" ? "h-1" : d.value === "comfortable" ? "h-1.5" : "h-2"}`}
                  />
                ))}
              </div>
              <p className={`text-xs font-medium ${density === d.value ? "text-purple-300" : "text-gray-300"}`}>
                {d.label}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">{d.desc}</p>
            </button>
          ))}
        </div>
      </Section>

      {/* ── Animations ── */}
      <Section
        title="Animations"
        description="Control motion and transitions"
        icon={Zap}
      >
        <div className="space-y-2">
          {[
            { value: "full" as AnimationType, label: "Full Animations", desc: "All transitions and effects enabled" },
            { value: "reduced" as AnimationType, label: "Reduced Motion", desc: "Minimal animations for accessibility" },
            { value: "none" as AnimationType, label: "No Animations", desc: "Instant transitions, no effects" },
          ].map((a) => (
            <button
              key={a.value}
              onClick={() => setAnimations(a.value)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition ${
                animations === a.value
                  ? "bg-purple-500/20 border-purple-500/30"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                animations === a.value ? "border-purple-400" : "border-gray-600"
              }`}>
                {animations === a.value && (
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                )}
              </div>
              <div className="text-left">
                <p className={`text-sm font-medium ${animations === a.value ? "text-purple-300" : "text-gray-300"}`}>
                  {a.label}
                </p>
                <p className="text-xs text-gray-500">{a.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* ── Display Preferences ── */}
      <Section
        title="Display Preferences"
        description="Customize layout behavior"
        icon={Layout}
      >
        {[
          {
            key: "sidebarCollapsed",
            label: "Collapse Sidebar by Default",
            desc: "Start with sidebar collapsed on load",
            value: sidebarCollapsed,
            toggle: () => setSidebarCollapsed(!sidebarCollapsed),
          },
          {
            key: "compactCards",
            label: "Compact Tool Cards",
            desc: "Show smaller cards in dashboard",
            value: compactCards,
            toggle: () => setCompactCards(!compactCards),
          },
        ].map((pref) => (
          <div key={pref.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
            <div>
              <p className="text-sm font-medium text-gray-200">{pref.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{pref.desc}</p>
            </div>
            <button
              onClick={pref.toggle}
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${
                pref.value ? "bg-purple-500" : "bg-white/10"
              }`}
            >
              <motion.div
                animate={{ x: pref.value ? 22 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
              />
            </button>
          </div>
        ))}
      </Section>

      {/* ── Save ── */}
      <button
        onClick={handleSave}
        disabled={saveState === "saving"}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition ${
          saveState === "saved"
            ? "bg-green-500/20 border border-green-500/30 text-green-400"
            : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 disabled:opacity-70"
        }`}
      >
        {saveState === "saving" ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
        ) : saveState === "saved" ? (
          <><CheckCircle className="w-4 h-4" /> Appearance Saved!</>
        ) : (
          <><Save className="w-4 h-4" /> Save Appearance</>
        )}
      </button>
    </motion.div>
  );
}
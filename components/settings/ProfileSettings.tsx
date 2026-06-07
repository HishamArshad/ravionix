"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Save,
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Hash,
  CheckCircle,
  Loader2,
  Globe,
//   Twitter,
//   Linkedin,
} from "lucide-react";

// ── Reusable Input ─────────────────────────────────────
function InputField({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  type = "text",
  hint,
  required,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon: React.ElementType;
  type?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none transition ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "focus:border-purple-500/50 focus:bg-white/10 hover:border-white/20"
          }`}
        />
      </div>
      {hint && <p className="text-[10px] text-gray-600 mt-1">{hint}</p>}
    </div>
  );
}

// ── Section Wrapper ────────────────────────────────────
function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────
export default function ProfileSettings() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: "Ahmed",
    lastName: "Khan",
    email: "ahmed.khan@gcu.edu.pk",
    phone: "0300-1234567",
    university: "GCU Lahore",
    department: "BS Physics",
    semester: "5th Semester",
    rollNumber: "2021-PHY-045",
    bio: "BS Physics student at GCU Lahore passionate about quantum mechanics and computational physics.",
    website: "",
    twitter: "",
    linkedin: "",
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaveState("saving");
    await new Promise((r) => setTimeout(r, 1500));
    setSaveState("saved");
    setTimeout(() => setSaveState("idle"), 3000);
  };

  const initials = `${form.firstName.charAt(0)}${form.lastName.charAt(0)}`.toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      {/* ── Avatar Section ── */}
      <Section
        title="Profile Picture"
        description="Click on the avatar to upload a new photo"
      >
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center cursor-pointer overflow-hidden relative"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-white">{initials}</span>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-base font-semibold text-gray-200">
                {form.firstName} {form.lastName}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{form.email}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/20 text-purple-400">
                {form.department}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
                {form.university}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/20 hover:bg-purple-500/30 transition"
              >
                Upload Photo
              </button>
              {avatarPreview && (
                <button
                  onClick={() => setAvatarPreview(null)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 transition"
                >
                  Remove
                </button>
              )}
            </div>
            <p className="text-[10px] text-gray-600">
              JPG, PNG or GIF · Max 5MB
            </p>
          </div>
        </div>
      </Section>

      {/* ── Personal Info ── */}
      <Section
        title="Personal Information"
        description="Update your personal details"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <InputField
            label="First Name" value={form.firstName}
            onChange={(v) => update("firstName", v)}
            placeholder="First name" icon={User} required
          />
          <InputField
            label="Last Name" value={form.lastName}
            onChange={(v) => update("lastName", v)}
            placeholder="Last name" icon={User} required
          />
          <InputField
            label="Email Address" value={form.email}
            onChange={(v) => update("email", v)}
            placeholder="email@example.com"
            icon={Mail} type="email" required
            hint="Changing email requires verification"
          />
          <InputField
            label="Phone Number" value={form.phone}
            onChange={(v) => update("phone", v)}
            placeholder="03XX-XXXXXXX" icon={Phone}
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
            rows={3}
            maxLength={200}
            placeholder="Tell us about yourself..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 focus:bg-white/10 transition resize-none"
          />
          <div className="flex justify-between mt-1">
            <p className="text-[10px] text-gray-600">Optional</p>
            <p className={`text-[10px] ${form.bio.length > 180 ? "text-yellow-400" : "text-gray-600"}`}>
              {form.bio.length} / 200
            </p>
          </div>
        </div>
      </Section>

      {/* ── Academic Info ── */}
      <Section
        title="Academic Information"
        description="Your university and course details"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <InputField
            label="University" value={form.university}
            onChange={(v) => update("university", v)}
            placeholder="University name"
            icon={GraduationCap}
          />
          <InputField
            label="Department / Program" value={form.department}
            onChange={(v) => update("department", v)}
            placeholder="e.g. BS Physics"
            icon={BookOpen}
          />
          <InputField
            label="Current Semester" value={form.semester}
            onChange={(v) => update("semester", v)}
            placeholder="e.g. 5th Semester"
            icon={Hash}
          />
          <InputField
            label="Roll Number" value={form.rollNumber}
            onChange={(v) => update("rollNumber", v)}
            placeholder="e.g. 2021-PHY-045"
            icon={Hash}
            hint="Used for student verification"
          />
        </div>
      </Section>

      {/* ── Social Links ── */}
      <Section
        title="Social Links"
        description="Connect your social profiles (optional)"
      >
        <div className="space-y-3">
          <InputField
            label="Website / Portfolio" value={form.website}
            onChange={(v) => update("website", v)}
            placeholder="https://yourwebsite.com"
            icon={Globe} type="url"
          />
          {/* <InputField
            label="Twitter / X" value={form.twitter}
            onChange={(v) => update("twitter", v)}
            placeholder="@username"
            icon={Twitter}
          />
          <InputField
            label="LinkedIn" value={form.linkedin}
            onChange={(v) => update("linkedin", v)}
            placeholder="linkedin.com/in/username"
            icon={Linkedin}
          /> */}
        </div>
      </Section>

      {/* ── Save Button ── */}
      <div className="flex items-center gap-3">
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
            <><CheckCircle className="w-4 h-4" /> Saved Successfully!</>
          ) : (
            <><Save className="w-4 h-4" /> Save Changes</>
          )}
        </button>
        <p className="text-xs text-gray-600">
          Last saved: Today at 3:45 PM
        </p>
      </div>
    </motion.div>
  );
}
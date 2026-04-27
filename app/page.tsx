"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Linkedin, Twitter, Instagram, Image as ImageIcon,
  Copy, Check, Sparkles, ChevronDown, AlertCircle,
  Zap, Hash, FileText, Sun, Moon, ExternalLink,
  Clock, BarChart2, Layers, RefreshCw,
} from "lucide-react";
import { generateContent, GeneratedContent } from "@/lib/contentGenerator";

type Platform = "linkedin" | "twitter" | "instagram" | "image";
type Theme = "dark" | "light";

// ─── Platform config ──────────────────────────────────────────────────────────

const platformConfig = {
  linkedin:  { label: "LinkedIn",     icon: Linkedin,   badgeClass: "badge-linkedin",  description: "Professional · Long-form", charLimit: 3000 },
  twitter:   { label: "Twitter / X",  icon: Twitter,    badgeClass: "badge-twitter",   description: "Punchy · 280 chars",       charLimit: 280  },
  instagram: { label: "Instagram",    icon: Instagram,  badgeClass: "badge-instagram", description: "Visual · Emoji-rich",      charLimit: 2200 },
  image:     { label: "Image Prompt", icon: ImageIcon,  badgeClass: "badge-image",     description: "For AI image tools",       charLimit: null },
};

// Icon colors from CSS vars per platform
const platformIconVar: Record<Platform, string> = {
  linkedin:  "var(--li-icon)",
  twitter:   "var(--tw-icon)",
  instagram: "var(--ig-icon)",
  image:     "var(--im-icon)",
};

// ─── Background glow ──────────────────────────────────────────────────────────

function BackgroundGlow({ theme }: { theme: Theme }) {
  const isDark = theme === "dark";
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div style={{
        position: "absolute",
        top: "-200px", left: "50%", transform: "translateX(-50%)",
        width: "900px", height: "520px",
        background: isDark
          ? "radial-gradient(ellipse, rgba(16,185,129,0.09) 0%, rgba(6,182,212,0.05) 45%, transparent 70%)"
          : "radial-gradient(ellipse, rgba(4,120,87,0.07) 0%, transparent 65%)",
        filter: "blur(70px)",
      }} />
      <div style={{
        position: "absolute",
        bottom: "-80px", right: "-80px",
        width: "580px", height: "580px",
        background: isDark
          ? "radial-gradient(ellipse, rgba(6,182,212,0.07) 0%, transparent 65%)"
          : "radial-gradient(ellipse, rgba(14,116,144,0.05) 0%, transparent 65%)",
        filter: "blur(70px)",
      }} />
      <div style={{
        position: "absolute",
        top: "40%", left: "-100px",
        width: "460px", height: "460px",
        background: isDark
          ? "radial-gradient(ellipse, rgba(167,139,250,0.05) 0%, transparent 65%)"
          : "radial-gradient(ellipse, rgba(4,120,87,0.04) 0%, transparent 65%)",
        filter: "blur(60px)",
      }} />
    </div>
  );
}

// ─── Theme Toggle ─────────────────────────────────────────────────────────────

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const isDark = theme === "dark";
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300"
      style={{
        background: "var(--bg-elevated)",
        border: "1.5px solid var(--border-card)",
        color: "var(--text-secondary)",
        letterSpacing: "0.02em",
      }}
    >
      {isDark ? (
        <>
          <Sun size={13} style={{ color: "#fbbf24" }} />
          <span style={{ color: "var(--text-secondary)" }}>Light</span>
        </>
      ) : (
        <>
          <Moon size={13} style={{ color: "#5b21b6" }} />
          <span style={{ color: "var(--text-secondary)" }}>Dark</span>
        </>
      )}
    </button>
  );
}

// ─── Content Card ─────────────────────────────────────────────────────────────

function ContentCard({
  platform, content, isLoading,
}: {
  platform: Platform; content: string; isLoading: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const cfg = platformConfig[platform];
  const Icon = cfg.icon;
  const iconColor = platformIconVar[platform];
  const charCount = content.length;
  const isOver = cfg.charLimit ? charCount > cfg.charLimit : false;

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="card-glow rounded-2xl flex flex-col h-full"
      style={{
        background: "var(--bg-surface)",
        border: "1.5px solid var(--border-card)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--bg-elevated)", transition: "background 0.4s ease" }}
          >
            <Icon size={16} style={{ color: iconColor }} />
          </div>
          <div>
            <span
              className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-lg border ${cfg.badgeClass}`}
              style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.02em" }}
            >
              {cfg.label}
            </span>
            <p className="text-xs mt-0.5 leading-none" style={{ color: "var(--text-muted)" }}>
              {cfg.description}
            </p>
          </div>
        </div>

        {!isLoading && content && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex-shrink-0"
            style={{
              background: copied ? "rgba(34,197,94,0.12)" : "var(--bg-elevated)",
              color: copied ? "#4ade80" : "var(--text-secondary)",
              border: `1.5px solid ${copied ? "rgba(34,197,94,0.30)" : "var(--border)"}`,
            }}
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 px-5 pb-4">
        {isLoading ? (
          <div className="space-y-2.5 pt-1">
            {[100, 78, 92, 60, 85, 50, 72].map((w, i) => (
              <div key={i} className="shimmer h-3 rounded-full" style={{ width: `${w}%` }} />
            ))}
          </div>
        ) : content ? (
          <p
            className="text-sm leading-relaxed whitespace-pre-wrap"
            style={{ color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif" }}
          >
            {content}
          </p>
        ) : (
          <div
            className="flex flex-col items-center justify-center h-20 rounded-xl"
            style={{ background: "var(--bg-elevated)" }}
          >
            <Icon size={18} style={{ color: "var(--text-muted)" }} />
            <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
              Awaiting generation
            </p>
          </div>
        )}
      </div>

      {/* Char counter */}
      {content && !isLoading && cfg.charLimit && (
        <div
          className="px-5 pb-4 pt-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
            <span>Characters</span>
            <span style={{ color: isOver ? "#f87171" : "var(--text-muted)", fontFamily: "'JetBrains Mono',monospace" }}>
              {charCount} / {cfg.charLimit}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min((charCount / cfg.charLimit) * 100, 100)}%`,
                background: isOver
                  ? "linear-gradient(90deg,#ef4444,#dc2626)"
                  : `linear-gradient(90deg, ${iconColor}, ${iconColor}88)`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Productivity Banner ──────────────────────────────────────────────────────

const features = [
  {
    iconVar: "--feat-1",
    icon: Clock,
    title: "Save Hours Every Week",
    desc: "Stop staring at a blank page. Generate a full week of platform-ready content in under 2 minutes — from a single topic idea.",
  },
  {
    iconVar: "--feat-2",
    icon: Layers,
    title: "3 Platforms, One Click",
    desc: "LinkedIn, Twitter/X, and Instagram each have unique formats. Postcraft tailors your message for every platform automatically.",
  },
  {
    iconVar: "--feat-3",
    icon: BarChart2,
    title: "Tone That Converts",
    desc: "Choose Professional, Casual, or Creative — and your content adapts its voice, structure, and hashtags for maximum engagement.",
  },
  {
    iconVar: "--feat-4",
    icon: RefreshCw,
    title: "Infinite Fresh Takes",
    desc: "Not satisfied? Hit Regenerate for a completely new variation. Every output is unique — no two generations are ever the same.",
  },
];

function ProductivityBanner({ theme }: { theme: Theme }) {
  const gradText = {
    background: "linear-gradient(135deg, var(--grad-start) 0%, var(--grad-end) 100%)",
    WebkitBackgroundClip: "text" as const,
    WebkitTextFillColor: "transparent" as const,
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-full border mb-5"
            style={{
              border: "1.5px solid var(--border-hover)",
              color: "var(--accent)",
              background: "var(--accent-dim)",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.04em",
            }}
          >
            <Zap size={10} /> WHY POSTCRAFT?
          </div>

          <h3
            className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}
          >
            Built to{" "}
            <span style={gradText}>supercharge</span>
            {" "}your workflow
          </h3>
          <p
            className="text-base max-w-md mx-auto leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Your always-on content strategist — turning one idea into a full cross-platform content kit, instantly.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {features.map(({ iconVar, icon: Icon, title, desc }) => (
            <div key={title} className="feature-card">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `color-mix(in srgb, ${`var(${iconVar})`} 15%, transparent)` }}
              >
                <Icon size={19} style={{ color: `var(${iconVar})` }} />
              </div>
              <h4
                className="text-sm font-bold mb-2"
                style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}
              >
                {title}
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div
          className="rounded-2xl p-7 grid grid-cols-3 gap-4 text-center"
          style={{
            background: "var(--bg-surface)",
            border: "1.5px solid var(--border-card)",
            transition: "background 0.4s ease",
          }}
        >
          {[
            { value: "3×", label: "Platforms covered" },
            { value: "< 2 min", label: "From idea to post" },
            { value: "∞", label: "Unique variations" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-2xl sm:text-3xl font-bold mb-1" style={{ ...gradText, fontFamily: "'Syne',sans-serif" }}>
                {value}
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono',monospace" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("all");
  const [tone, setTone] = useState("professional");
  const [userProfile, setUserProfile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  const handleGenerate = useCallback(() => {
    if (!topic.trim()) { setError("Please enter a topic to get started."); return; }
    if (topic.trim().length < 3) { setError("Topic must be at least 3 characters."); return; }
    setError("");
    setIsLoading(true);
    setHasGenerated(true);
    setContent(null);

    setTimeout(() => {
      try {
        const result = generateContent({ topic: topic.trim(), platform, tone, userProfile });
        setContent(result);
      } catch {
        setError("Generation failed. Please try again.");
        setHasGenerated(false);
      } finally {
        setIsLoading(false);
      }
    }, 850);
  }, [topic, platform, tone, userProfile]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
  };

  const isDark = theme === "dark";

  const gradBtn = "linear-gradient(135deg, var(--grad-start) 0%, var(--grad-end) 100%)";

  const gradText = {
    background: "linear-gradient(135deg, var(--grad-start) 0%, var(--grad-end) 100%)",
    WebkitBackgroundClip: "text" as const,
    WebkitTextFillColor: "transparent" as const,
  };

  const labelStyle = {
    color: "var(--text-secondary)",
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.06em",
    fontSize: "11px",
    fontWeight: 600,
  };

  return (
    <div className="relative min-h-screen" style={{ zIndex: 1 }}>
      <BackgroundGlow theme={theme} />

      <div className="relative" style={{ zIndex: 2 }}>

        {/* ══ HEADER ══════════════════════════════════════════════════ */}
        <header style={{ borderBottom: "1px solid var(--border)", backdropFilter: "blur(12px)" }}>
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: gradBtn, boxShadow: "var(--btn-shadow)" }}
              >
                <Zap size={15} className="text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold leading-none tracking-tight"
                  style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}>
                  Postcraft
                </h1>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono',monospace" }}>
                  AI · Social Content
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <span
                className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: "var(--accent-dim)",
                  border: "1.5px solid var(--border-hover)",
                  color: "var(--accent)",
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.03em",
                }}
              >
                <Sparkles size={9} /> AI-Powered
              </span>
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-14">

          {/* ══ HERO ════════════════════════════════════════════════════ */}
          <div className="text-center mb-14 animate-fade-up">
            <div
              className="inline-flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-full border mb-6"
              style={{
                border: "1.5px solid var(--border-card)",
                color: "var(--text-secondary)",
                background: "var(--bg-elevated)",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.04em",
              }}
            >
              <Hash size={9} /> LinkedIn · Twitter/X · Instagram
            </div>

            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight leading-tight"
              style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}
            >
              Create content that{" "}
              <br className="hidden sm:block" />
              <span style={gradText}>actually converts</span>
            </h2>
            <p className="text-lg max-w-lg mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Generate platform-optimized social posts in seconds — tailored to your voice, your audience, your goals.
            </p>
          </div>

          {/* ══ FORM ════════════════════════════════════════════════════ */}
          <div
            className="rounded-3xl p-7 sm:p-9 mb-12 animate-fade-up delay-1"
            style={{
              background: "var(--bg-surface)",
              border: "1.5px solid var(--border-card)",
              transition: "background 0.4s ease, border-color 0.4s ease",
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">

              {/* Topic */}
              <div className="sm:col-span-2">
                <label className="block mb-2" style={labelStyle}>TOPIC *</label>
                <div className="relative">
                  <FileText size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                  <input
                    type="text"
                    value={topic}
                    onChange={e => { setTopic(e.target.value); if (error) setError(""); }}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. The future of remote work, AI in healthcare, Building a personal brand..."
                    className="input-base w-full rounded-xl pl-10 pr-4 py-3.5 text-sm"
                    maxLength={200}
                  />
                </div>
              </div>

              {/* Platform */}
              <div>
                <label className="block mb-2" style={labelStyle}>PLATFORM FOCUS</label>
                <div className="relative">
                  <select value={platform} onChange={e => setPlatform(e.target.value)}
                    className="input-base w-full rounded-xl px-4 py-3.5 text-sm appearance-none cursor-pointer">
                    <option value="all">All Platforms</option>
                    <option value="linkedin">LinkedIn Focus</option>
                    <option value="twitter">Twitter/X Focus</option>
                    <option value="instagram">Instagram Focus</option>
                  </select>
                  <ChevronDown size={13} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
                </div>
              </div>

              {/* Tone */}
              <div>
                <label className="block mb-2" style={labelStyle}>TONE</label>
                <div className="relative">
                  <select value={tone} onChange={e => setTone(e.target.value)}
                    className="input-base w-full rounded-xl px-4 py-3.5 text-sm appearance-none cursor-pointer">
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="creative">Creative</option>
                  </select>
                  <ChevronDown size={13} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
                </div>
              </div>

              {/* Profile */}
              <div className="sm:col-span-2">
                <label className="block mb-2" style={labelStyle}>
                  YOUR PROFILE{" "}
                  <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={userProfile}
                  onChange={e => setUserProfile(e.target.value)}
                  placeholder="e.g. Software developer, Marketing manager, Startup founder..."
                  className="input-base w-full rounded-xl px-4 py-3.5 text-sm"
                  maxLength={100}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-5 text-sm"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1.5px solid rgba(239,68,68,0.22)",
                  color: "var(--text-primary)",
                }}
              >
                <AlertCircle size={14} /> {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full rounded-xl py-4 text-sm font-bold tracking-wide transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: isLoading ? "var(--bg-elevated)" : gradBtn,
                color: isLoading ? "var(--text-muted)" : "#ffffff",
                fontFamily: "'Syne', sans-serif",
                letterSpacing: "0.04em",
                boxShadow: isLoading ? "none" : "var(--btn-shadow)",
                fontSize: "14px",
              }}
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 11-6.219-8.56" />
                    </svg>
                    Crafting your content…
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Generate Content
                    <kbd
                      className="text-xs opacity-50 ml-1 px-1.5 py-0.5 rounded"
                      style={{ background: "rgba(255,255,255,0.15)", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px" }}
                    >
                      ⌘↵
                    </kbd>
                  </>
                )}
              </span>
            </button>

            <p className="text-center text-xs mt-3" style={{ color: "var(--text-muted)" }}>
              Instant results — no API key required
            </p>
          </div>

          {/* ══ RESULTS ═════════════════════════════════════════════════ */}
          {hasGenerated && (
            <div className="animate-fade-up delay-2">
              <div className="flex items-center gap-4 mb-7">
                <div className="h-px flex-1" style={{ background: "var(--border)" }} />
                <span
                  className="text-xs tracking-widest"
                  style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono',monospace" }}
                >
                  {isLoading ? "● GENERATING" : "✦ YOUR CONTENT"}
                </span>
                <div className="h-px flex-1" style={{ background: "var(--border)" }} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {(["linkedin", "twitter", "instagram", "image"] as Platform[]).map((p, i) => (
                  <div key={p} className={`animate-fade-up delay-${i + 1}`}>
                    <ContentCard
                      platform={p}
                      content={content ? (p === "image" ? content.imagePrompt : content[p]) : ""}
                      isLoading={isLoading}
                    />
                  </div>
                ))}
              </div>

              {content && !isLoading && (
                <div className="mt-6 text-center">
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Not quite right?{" "}
                    <button
                      onClick={handleGenerate}
                      className="font-semibold underline underline-offset-2 transition-colors"
                      style={{ color: "var(--accent)" }}
                    >
                      Regenerate
                    </button>
                    {" "}for a fresh take.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ══ EMPTY STATE ══════════════════════════════════════════════ */}
          {!hasGenerated && (
            <div className="animate-fade-up delay-3">
              <div
                className="rounded-2xl p-12 text-center"
                style={{
                  background: "var(--bg-surface)",
                  border: "1.5px dashed var(--border-card)",
                  transition: "background 0.4s ease",
                }}
              >
                <div className="flex justify-center gap-5 mb-5">
                  <Linkedin size={22} style={{ color: "var(--li-icon)", opacity: 0.35 }} />
                  <Twitter size={22} style={{ color: "var(--tw-icon)", opacity: 0.35 }} />
                  <Instagram size={22} style={{ color: "var(--ig-icon)", opacity: 0.35 }} />
                  <ImageIcon size={22} style={{ color: "var(--im-icon)", opacity: 0.35 }} />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Your generated content will appear here.
                  <br />Enter a topic above and hit Generate.
                </p>
              </div>
            </div>
          )}
        </main>

        {/* ══ PRODUCTIVITY BANNER ══════════════════════════════════════ */}
        <div style={{ borderTop: "1px solid var(--border)" }}>
          <ProductivityBanner theme={theme} />
        </div>

        {/* ══ FOOTER ══════════════════════════════════════════════════ */}
        <footer style={{ borderTop: "1px solid var(--border)" }}>
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

              {/* Left — branding */}
              <div className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: gradBtn }}
                >
                  <Zap size={11} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold leading-none" style={{ color: "var(--text-primary)", fontFamily: "'Syne',sans-serif" }}>
                    Postcraft AI
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    AI-powered social media content generator
                  </p>
                </div>
              </div>

              {/* Right — portfolio button */}
              <a
                href="https://chetanyachonkarportfolio.lovable.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="portfolio-btn"
              >
                <ExternalLink size={11} />
                View My Portfolio
              </a>

            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { HackerPassModal } from "./HackerPassModal";
import {
  Github,
  Linkedin,
  MapPin,
  Share2,
  Plus,
  X,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  GitBranch,
  Star,
  Users,
  Award,
  Trophy,
  Download,
  AlertTriangle,
  RotateCw,
  ShieldCheck,
  Terminal,
  Globe,
  Layers,
  ArrowRight,
  BookOpen,
  LogOut,
  QrCode,
} from "lucide-react";

export function StudentProfileView() {
  const {
    user,
    registrations,
    tasks,
    taskSubmissions,
    submitTask,
    addSkill,
    removeSkill,
    githubData,
    syncGitHub,
    logout,
    switchAccount,
  } = useStore();

  const [activeRegFilter, setActiveRegFilter] = useState<
    "ALL" | "APPROVED" | "PENDING" | "COMPLETED"
  >("ALL");
  const [studentTasksFilter, setStudentTasksFilter] = useState<
    "ALL" | "TODO" | "SUBMITTED" | "COMPLETED"
  >("ALL");
  const [isHackerPassOpen, setIsHackerPassOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillPercent, setNewSkillPercent] = useState("85");
  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);
  const [deliverableUrl, setDeliverableUrl] = useState("https://github.com/arjun_dev/byte-agent-swarm");
  const [deliverableNotes, setDeliverableNotes] = useState("Implemented multi-agent swarm state graph in Node.js and Rust.");
  const [submittedTaskSuccess, setSubmittedTaskSuccess] = useState(false);

  // Verified Skill Percentages Map
  const [skillScores, setSkillScores] = useState<Record<string, number>>({
    "Node.js": 95,
    "TypeScript": 92,
    "PostgreSQL": 88,
    "Redis": 90,
    "Docker": 84,
    "Next.js": 82,
    "Express": 89,
    "FastAPI": 80,
    "PyTorch": 75,
    "React": 86,
    "Tailwind CSS": 91,
  });

  const handleShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/u/${user.githubUsername || "arjun_dev"}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      syncGitHub();
      setIsSyncing(false);
    }, 800);
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillName.trim()) {
      addSkill(newSkillName.trim());
      setSkillScores((prev) => ({
        ...prev,
        [newSkillName.trim()]: Number(newSkillPercent) || 85,
      }));
      setNewSkillName("");
      setIsAddingSkill(false);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    removeSkill(skill);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. TOP VERIFIED CITIZEN BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-zinc-850 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>STUDENT PASSPORT</span>
          </span>
          <span className="text-slate-300 dark:text-zinc-600">•</span>
          <span className="text-slate-800 dark:text-white font-semibold">
            Verified ID: TALENT-BLR-8921
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 text-[11px] shadow-xs">
            Campus Tier 1 Verified
          </span>
          <span className="text-blue-600 dark:text-blue-400 font-bold">
            Rank #14 / 8,240
          </span>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN GRID (LEFT: IDENTITY & GITHUB, RIGHT: SKILLS & OPPORTUNITIES) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 5 COLS */}
        <div className="lg:col-span-5 space-y-6">
          {/* Identity Passport Card */}
          <div className="rounded-2xl bg-white dark:bg-[#0E0F14] border border-slate-200 dark:border-zinc-800 p-6 space-y-5 shadow-sm dark:shadow-xl">
            {/* Top Avatar & Match Index */}
            <div className="flex items-start justify-between gap-4">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
                  alt={user.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 dark:border-zinc-700 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-[#0E0F14]">
                  ✓
                </span>
              </div>

              <div className="text-right space-y-0.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 text-xs font-mono font-bold shadow-xs">
                  98.4 Match Index
                </span>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                  Available for Q1 '25
                </div>
              </div>
            </div>

            {/* Name, Handle & Bio */}
            <div className="space-y-1.5">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {user.name}
              </h2>
              <p className="text-xs font-mono text-slate-500 dark:text-zinc-400">
                @{user.githubUsername || "arjun_dev"} • IIIT Bengaluru (CSE '25)
              </p>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed pt-1">
                {user.bio}
              </p>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 font-mono">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>{user.city || "Bengaluru, Karnataka, India"}</span>
            </div>

            {/* 4 Social Chips Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <a
                href={`https://github.com/${user.githubUsername || "arjun_dev"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-colors truncate shadow-xs"
              >
                <Github className="w-3.5 h-3.5 text-slate-900 dark:text-white shrink-0" />
                <span className="truncate">@{user.githubUsername || "arjun_dev"}</span>
              </a>

              <a
                href="https://linkedin.com/in/arjun-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-colors truncate shadow-xs"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="truncate">/in/arjun-dev</span>
              </a>

              <a
                href="https://arjunsharma.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-colors truncate shadow-xs"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">arjunsharma.d...</span>
              </a>

              <a
                href="https://x.com/arjun_codes"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-colors truncate shadow-xs"
              >
                <span className="font-bold shrink-0">𝕏</span>
                <span className="truncate">@arjun_codes</span>
              </a>
            </div>

            {/* Share Public Profile Button */}
            <button
              onClick={handleShare}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-750 hover:bg-slate-200/70 dark:hover:bg-zinc-850 text-slate-900 dark:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
              <span>
                {copiedLink
                  ? "Profile Link Copied to Clipboard!"
                  : `Share Public Profile (/u/${user.githubUsername || "arjun_dev"})`}
              </span>
            </button>
          </div>

          {/* Connected Accounts Card */}
          <div className="rounded-2xl bg-white dark:bg-[#0E0F14] border border-slate-200 dark:border-zinc-800 p-6 space-y-5 shadow-sm dark:shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>Connected Accounts</span>
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 text-[10px] font-mono font-semibold">
                2 Active
              </span>
            </div>

            {/* GitHub Developer Section */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-slate-900 dark:text-white" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      GitHub Developer
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono">
                      Synced 15 mins ago
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-[11px] font-mono text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <RotateCw
                    className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`}
                  />
                  <span>Sync</span>
                </button>
              </div>

              {/* 3 Large Stat Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-200 dark:border-zinc-850">
                <div className="p-2">
                  <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                    46
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono">Repos</div>
                </div>
                <div className="p-2">
                  <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                    528
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono">
                    Contribs
                  </div>
                </div>
                <div className="p-2">
                  <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                    1.2k
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono">Stars</div>
                </div>
              </div>

              {/* Language Breakdown Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex h-2 w-full rounded-full overflow-hidden bg-slate-200 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <div style={{ width: "58%" }} className="bg-blue-500" title="TypeScript 58%" />
                  <div style={{ width: "26%" }} className="bg-amber-500" title="Python 26%" />
                  <div style={{ width: "16%" }} className="bg-teal-400" title="Go 16%" />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-600 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>TypeScript 58%</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>Python 26%</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>Go 16%</span>
                  </span>
                </div>
              </div>

              {/* Top Featured Repositories */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-zinc-850">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-500 font-semibold">
                  TOP FEATURED REPOSITORIES
                </div>

                {/* Repo 1 */}
                <div className="p-3 rounded-lg bg-white dark:bg-black border border-slate-200 dark:border-zinc-850 space-y-1 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400">
                      hyper-queue
                    </span>
                    <span className="text-[11px] font-mono text-slate-600 dark:text-zinc-400 flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>420</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-snug">
                    In-memory lockless event queue for ultra-fast telemetry pipelines.
                  </p>
                  <div className="pt-1 flex items-center gap-1 text-[10px] font-mono text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Node.js</span>
                  </div>
                </div>

                {/* Repo 2 */}
                <div className="p-3 rounded-lg bg-white dark:bg-black border border-slate-200 dark:border-zinc-850 space-y-1 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400">
                      autonomous-agent-kit
                    </span>
                    <span className="text-[11px] font-mono text-slate-600 dark:text-zinc-400 flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>210</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-snug">
                    Deterministic agent runner for LLM orchestration & tool calling.
                  </p>
                  <div className="pt-1 flex items-center gap-1 text-[10px] font-mono text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Python</span>
                  </div>
                </div>
              </div>
            </div>

            {/* LinkedIn Integration */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <Linkedin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    LinkedIn Profile Verified
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono">
                    1st Degree Student Badge Enabled
                  </div>
                </div>
              </div>
              <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-500/30 text-xs font-bold">
                ✓
              </span>
            </div>

            {/* Account Session & Log Out Controls */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0E0F14] border border-slate-200 dark:border-zinc-850 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-500 font-semibold">
                  Account Session & Security
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active Session
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-slate-900 dark:text-white font-medium">{user.email}</div>
                <div className="text-slate-500 text-[11px] font-mono">
                  Role: {user.role === "STUDENT" ? "Student Builder" : "Organizer / Host"}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-zinc-850 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => switchAccount(user.role === "STUDENT" ? "HOST" : "STUDENT")}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-xs font-medium transition-colors shadow-xs"
                >
                  {user.role === "STUDENT" ? "Switch to Host View" : "Switch to Student View"}
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 7 COLS */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Verified Technical Skills Card */}
          <div className="rounded-2xl bg-white dark:bg-[#0E0F14] border border-slate-200 dark:border-zinc-800 p-6 space-y-4 shadow-sm dark:shadow-xl">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  <span>Verified Technical Skills</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                  Evaluated through GitHub repository analyzers and code assessment tests.
                </p>
              </div>

              <button
                onClick={() => setIsAddingSkill(true)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-750 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-blue-500" />
                <span>+ Add Skill</span>
              </button>
            </div>

            {isAddingSkill && (
              <form
                onSubmit={handleAddCustomSkill}
                className="p-3 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 flex items-center gap-2 shadow-xs"
              >
                <input
                  type="text"
                  autoFocus
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="Skill name (e.g. Go, GraphQL)"
                  className="bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none flex-1"
                />
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={newSkillPercent}
                  onChange={(e) => setNewSkillPercent(e.target.value)}
                  placeholder="%"
                  className="w-16 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded px-2 py-1 text-xs text-slate-900 dark:text-white font-mono focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-xs"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingSkill(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {/* Skill Badges with Percentages & Remove Button */}
            <div className="flex flex-wrap items-center gap-2">
              {user.skills.map((skill) => {
                const score = skillScores[skill] || 85;
                return (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-800 dark:text-zinc-200 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors shadow-xs"
                  >
                    <span className="font-semibold text-slate-900 dark:text-white">{skill}</span>
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                      {score}%
                    </span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 dark:text-zinc-500 hover:text-red-500 transition-colors ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>

          {/* 2. My Registered Opportunities Section */}
          <div className="rounded-2xl bg-white dark:bg-[#0E0F14] border border-slate-200 dark:border-zinc-800 p-6 space-y-5 shadow-sm dark:shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  My Registered Opportunities
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                  Live telemetry from hackathons, incubators, and company talent tracks
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-black p-1 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-mono shadow-inner">
                {[
                  { id: "ALL", label: "All (4)" },
                  { id: "APPROVED", label: "Approved (2)" },
                  { id: "PENDING", label: "Pending (1)" },
                  { id: "COMPLETED", label: "Completed (1)" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveRegFilter(tab.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                      activeRegFilter === tab.id
                        ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-semibold shadow-xs"
                        : "text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Opportunities List Cards */}
            <div className="space-y-4">
              {/* Card 1: OmniChain Autonomous Agent Hackathon 2025 */}
              {(activeRegFilter === "ALL" || activeRegFilter === "APPROVED") && (
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Pass Granted • Team Formed (ByteBandits)</span>
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">
                      Dec 14-16, 2025
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                      OmniChain Autonomous Agent Hackathon 2025
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Hosted by HyperScale Labs • Bengaluru In-Person Stage
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => setIsHackerPassOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl border border-blue-500/30 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>View HackerPass QR Ticket</span>
                    </button>
                    <button
                      onClick={() => setIsHackerPassOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-900 dark:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
                      <span>Download Badge</span>
                    </button>
                    <button
                      onClick={() => alert("Navigating to ByteBandits team workspace...")}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-blue-500/25 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Team Workspace</span>
                    </button>
                  </div>

                  {/* Team Squad Box */}
                  <div className="p-3 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-850 flex items-center justify-between text-xs font-mono shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="flex -space-x-1.5">
                        <div className="w-6 h-6 rounded-full bg-blue-600 border border-white dark:border-zinc-900 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                          A
                        </div>
                        <div className="w-6 h-6 rounded-full bg-indigo-600 border border-white dark:border-zinc-900 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                          N
                        </div>
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-zinc-800 border border-white dark:border-zinc-900 flex items-center justify-center text-[9px] font-bold text-slate-700 dark:text-zinc-400">
                          +2
                        </div>
                      </div>
                      <span className="text-slate-700 dark:text-zinc-300 text-[11px]">
                        ByteBandits: Arjun Sharma (Lead), Neha Verma (+2 slots confirmed)
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 text-[10px]">
                      Table #B-19 Assigned
                    </span>
                  </div>
                </div>
              )}

              {/* Card 2: Sarvam AI Backend Engineering Internship */}
              {(activeRegFilter === "ALL" || activeRegFilter === "PENDING") && (
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Host Task Pending</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-500">
                        Internship Track
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                        Sarvam AI Backend Engineering Internship
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Hosted by Sarvam AI • Bengaluru (Hybrid)
                      </p>
                    </div>

                    <button
                      onClick={() => alert("Opening Sarvam App task checklist guide...")}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 shrink-0 shadow-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                      <span>Open Task Guide</span>
                    </button>
                  </div>

                  {/* Host Task Callout Box */}
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-black border border-amber-200 dark:border-amber-800/40 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-300 shadow-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                      <strong className="text-amber-700 dark:text-amber-300">Action Required:</strong> Please install the Sarvam Companion App and complete benchmark task before <span className="text-slate-900 dark:text-white font-mono font-bold">Nov 20, 2026</span> (8 days remaining).
                    </p>
                  </div>
                </div>
              )}

              {/* Card 3: Zero-Knowledge & Privacy Summit 2025 */}
              {(activeRegFilter === "ALL" || activeRegFilter === "PENDING") && (
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 space-y-3 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>Under Review</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-500">
                        Applied Nov 12, 2026
                      </span>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400">
                      Batch Round 1
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                      Zero-Knowledge & Privacy Summit 2025
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Hosted by CloudZero Foundation • Global Remote Stage
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                    Application packet including GitHub PR telemetry submitted. Review panel decision anticipated within 72 hours.
                  </p>
                </div>
              )}

              {/* Card 4: Cred Tech Sprint 2024 */}
              {(activeRegFilter === "ALL" || activeRegFilter === "COMPLETED") && (
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 font-semibold">
                        Completed • Prize Awarded
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-500">
                        Oct 2026
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 font-bold">
                      🏆 1st Place Winner
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                      Cred Tech Sprint 2024
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Hosted by CRED Engineering • Bengaluru
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2.5. Assigned Milestone Tasks & Competition Progress Section */}
          <div className="rounded-2xl bg-white dark:bg-[#0E0F14] border border-slate-200 dark:border-zinc-800 p-6 space-y-4 shadow-sm dark:shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-500" />
                  <span>Assigned Milestone Tasks & Competition Progress</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Complete host checkpoints, upload deliverables, and track your hackathon squad standings.
                </p>
              </div>

              {/* Status Filter Tabs for Student Tasks */}
              {(() => {
                const todoCount = tasks.filter((t) => {
                  const s = taskSubmissions.find((sub) => sub.taskId === t.id && (sub.teamName?.includes(user.name) || sub.leadName?.includes(user.name) || sub.userId === user.id));
                  return !s;
                }).length;
                const submittedCount = tasks.filter((t) => {
                  const s = taskSubmissions.find((sub) => sub.taskId === t.id && (sub.teamName?.includes(user.name) || sub.leadName?.includes(user.name) || sub.userId === user.id));
                  return s && s.status === "PENDING_REVIEW";
                }).length;
                const completedCount = tasks.filter((t) => {
                  const s = taskSubmissions.find((sub) => sub.taskId === t.id && (sub.teamName?.includes(user.name) || sub.leadName?.includes(user.name) || sub.userId === user.id));
                  return s && (s.status === "COMPLETED" || s.status === "VERIFIED");
                }).length;

                return (
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-black p-1 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-mono shadow-inner">
                    {[
                      { id: "ALL", label: `All (${tasks.length})` },
                      { id: "TODO", label: `To Do (${todoCount})` },
                      { id: "SUBMITTED", label: `Submitted (${submittedCount})` },
                      { id: "COMPLETED", label: `Completed (${completedCount})` },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setStudentTasksFilter(tab.id as any)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors cursor-pointer ${
                          studentTasksFilter === tab.id
                            ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-semibold shadow-xs"
                            : "text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="space-y-3">
              {tasks
                .filter((task) => {
                  const userSub = taskSubmissions.find(
                    (s) => s.taskId === task.id && (s.teamName?.includes(user.name) || s.leadName?.includes(user.name) || s.userId === user.id)
                  );
                  const isCompleted = userSub?.status === "COMPLETED" || userSub?.status === "VERIFIED";
                  const isPending = userSub?.status === "PENDING_REVIEW";
                  if (studentTasksFilter === "TODO") return !userSub;
                  if (studentTasksFilter === "SUBMITTED") return isPending;
                  if (studentTasksFilter === "COMPLETED") return isCompleted;
                  return true;
                })
                .map((task) => {
                  const userSub = taskSubmissions.find(
                    (s) => s.taskId === task.id && (s.teamName?.includes(user.name) || s.leadName?.includes(user.name) || s.userId === user.id)
                  );
                  const isCompleted = userSub?.status === "COMPLETED" || userSub?.status === "VERIFIED";
                  const isPending = userSub?.status === "PENDING_REVIEW";

                  return (
                    <div
                      key={task.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-400">
                            {task.type.replace(/_/g, " ")}
                          </span>
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                            +{task.points} pts
                          </span>
                          {task.isRequired && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/40 font-bold">
                              Required Gate
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
                          {task.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 dark:text-zinc-400 line-clamp-1">
                          {task.description}
                        </p>
                        {userSub?.feedback && (
                          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-1">
                            Evaluator Feedback: "{userSub.feedback}"
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        {isCompleted ? (
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-semibold flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" />
                            <span>Passed ({userSub?.score} pts)</span>
                          </span>
                        ) : isPending ? (
                          <span className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-400 text-xs font-mono font-semibold flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Under Review</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSubmittingTaskId(task.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-500/25 cursor-pointer"
                          >
                            Submit Solution
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Submit Solution Modal */}
          {submittingTaskId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
              <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#0E0F14] border border-slate-200 dark:border-zinc-800 shadow-2xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Submit Milestone Solution
                    </span>
                  </div>
                  <button
                    onClick={() => setSubmittingTaskId(null)}
                    className="w-7 h-7 rounded-lg border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-700 dark:text-zinc-300 font-medium">Deliverable URL (GitHub repo / Loom / Demo link):</label>
                    <input
                      type="url"
                      required
                      value={deliverableUrl}
                      onChange={(e) => setDeliverableUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono shadow-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 dark:text-zinc-300 font-medium">Submission Notes & Architecture Details:</label>
                    <textarea
                      rows={3}
                      value={deliverableNotes}
                      onChange={(e) => setDeliverableNotes(e.target.value)}
                      placeholder="Briefly describe what your team built..."
                      className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-xs"
                    />
                  </div>

                  {submittedTaskSuccess && (
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Solution submitted to Organizer review board!</span>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSubmittingTaskId(null)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        submitTask(submittingTaskId, deliverableUrl, deliverableNotes);
                        setSubmittedTaskSuccess(true);
                        setTimeout(() => {
                          setSubmittedTaskSuccess(false);
                          setSubmittingTaskId(null);
                        }, 1200);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/25"
                    >
                      Submit for Evaluation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Verified Achievements & Trophies Section */}
          <div className="rounded-2xl bg-white dark:bg-[#0E0F14] border border-slate-200 dark:border-zinc-800 p-6 space-y-4 shadow-sm dark:shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Verified Achievements & Trophies</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-500 font-semibold">
                2 Major Titles
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Trophy 1 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 space-y-2 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      ETHIndia 2024 Top 10 Finalist
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-snug mt-0.5">
                      Selected among 2,800+ builders. Built decentralized validator telemetry.
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-zinc-850 text-[10px] font-mono text-slate-500 dark:text-zinc-500 flex items-center justify-between">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">$2,500 Prize</span>
                  <span>Verified by Devfolio</span>
                </div>
              </div>

              {/* Trophy 2 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 space-y-2 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Cred Tech Sprint 1st Place Winner
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-snug mt-0.5">
                      Engineered ultra-low latency transaction streaming framework.
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-zinc-850 text-[10px] font-mono text-slate-500 dark:text-zinc-500 flex items-center justify-between">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">Gold Medalist</span>
                  <span>Direct Fast-track Offer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verified HackerPass Digital QR Ticket Modal */}
      <HackerPassModal
        isOpen={isHackerPassOpen}
        onClose={() => setIsHackerPassOpen(false)}
        participantName={user.name}
        githubUsername={user.githubUsername || "arjun_dev"}
        eventTitle="OmniChain Autonomous Agent Hackathon 2025"
        teamName="ByteBandits (Lead)"
        tableNumber="Table #B-19 • Zone Alpha"
        ticketId="TKT-ORBIT-2025-ARJUN-884"
      />
    </div>
  );
}

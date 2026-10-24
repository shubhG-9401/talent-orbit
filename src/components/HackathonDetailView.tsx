"use client";

import React, { useState } from "react";
import { Event } from "@/types";
import { useStore } from "@/lib/store";
import {
  rankOpportunity,
  getPlatformMeta,
  formatDeadlineCountdown,
} from "@/lib/ranking";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Trophy,
  ExternalLink,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Share2,
  Bookmark,
  Check,
  Info,
  Layers,
  Code2,
  FileText,
  Flame,
  Award,
  BookOpen,
} from "lucide-react";

interface HackathonDetailViewProps {
  event: Event;
  onBack: () => void;
  onRegister: (event: Event) => void;
  onOpenSkillGapModal: (event: Event) => void;
}

export function HackathonDetailView({
  event,
  onBack,
  onRegister,
  onOpenSkillGapModal,
}: HackathonDetailViewProps) {
  const { user, registrations } = useStore();
  const [activeTab, setActiveTab] = useState<
    "overview" | "stages" | "tracks" | "prizes" | "rules"
  >("overview");
  const [copiedLink, setCopiedLink] = useState(false);

  const { rankingScore, skillGap, eligibility, deadlineInfo } = rankOpportunity(
    event,
    user
  );
  const platformMeta = getPlatformMeta(event.sourcePlatform);

  const isRegistered = registrations.some(
    (r) => r.eventId === event.id && r.userId === user.id
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. TOP BREADCRUMB & CONTROLS */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Opportunities</span>
        </button>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {event.sourceUrl && (
            <a
              href={event.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-3 py-1.5 rounded-full border text-xs font-mono font-medium flex items-center gap-1.5 hover:underline shadow-xs ${platformMeta.badgeClass}`}
            >
              <span>{platformMeta.icon} Verified on {platformMeta.name}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white shadow-xs transition-colors"
            title="Share Opportunity"
          >
            {copiedLink ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* 2. HERO SHOWCASE CARD */}
      <div className="rounded-3xl bg-white dark:bg-[#0E0F14] border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm dark:shadow-2xl relative">
        {/* Cover Banner */}
        <div className="relative h-44 md:h-56 w-full bg-gradient-to-r from-blue-100 via-indigo-50 to-slate-100 dark:from-blue-950/60 dark:via-zinc-950 dark:to-purple-950/40 border-b border-slate-200 dark:border-zinc-800">
          <div className="absolute inset-0 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
          
          <div className="absolute top-4 left-6 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/80 dark:bg-black/60 backdrop-blur-md border border-slate-200 dark:border-zinc-700 text-blue-700 dark:text-blue-400 shadow-xs">
              {event.type}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/80 dark:bg-black/60 backdrop-blur-md border border-slate-200 dark:border-zinc-700 text-emerald-700 dark:text-emerald-400 shadow-xs font-semibold">
              Free Registration
            </span>
          </div>

          <div className="absolute bottom-4 right-6 hidden sm:flex items-center gap-4 text-xs font-mono text-slate-700 dark:text-zinc-300 bg-white/80 dark:bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-xs">
            <span>👁️ {event.impressionsCount?.toLocaleString() || "18,200"} Impressions</span>
            <span>•</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">
              👥 {event.registeredCount?.toLocaleString() || "3,450"} Registered
            </span>
          </div>
        </div>

        {/* Hero Content */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-zinc-400">
                <span>Hosted by</span>
                <span className="text-slate-900 dark:text-white font-bold">{event.hostName}</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">✓ Verified Organizer</span>
              </div>

              <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                {event.title}
              </h1>

              <p className="text-xs md:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Sticky Action CTA */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 lg:w-80 shrink-0 space-y-3 shadow-xs">
              <div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">
                  Total Rewards
                </div>
                <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {event.rewardOrStipend}
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-zinc-400">Registration Closes:</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    {deadlineInfo.text}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-zinc-400">Team Size:</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    {event.participationMode === "SOLO_ONLY"
                      ? "1 Member"
                      : `${event.minTeamSize} - ${event.maxTeamSize} Members`}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                {isRegistered ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Registered for this Hackathon</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onRegister(event)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/30"
                  >
                    <span>Register Now ({rankingScore}% Match)</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Metadata Highlights Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-zinc-850 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 dark:text-zinc-500 font-mono">Mode & Venue</span>
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>{event.isRemote ? "Online / Hybrid" : event.city}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 dark:text-zinc-500 font-mono">Eligibility</span>
              <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{eligibility.badge}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 dark:text-zinc-500 font-mono">Prerequisite Stack</span>
              <div className="font-bold text-slate-900 dark:text-white">
                {event.requiredSkills.slice(0, 3).join(", ")} +
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 dark:text-zinc-500 font-mono">Original Source</span>
              <div className="font-bold text-slate-900 dark:text-white">
                {platformMeta.name} Official
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SKILL GAP BANNER WIDGET FOR CURRENT STUDENT */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white dark:from-blue-950/20 dark:via-[#0E0F14] dark:to-[#0E0F14] border border-blue-200 dark:border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Your Personal Match Analysis ({rankingScore}%)
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
            {skillGap.gapSummary}
          </p>
        </div>

        <button
          onClick={() => onOpenSkillGapModal(event)}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs text-slate-700 dark:text-white font-semibold transition-colors shrink-0 shadow-xs"
        >
          Explain Gap & Ranking
        </button>
      </div>

      {/* 4. TABS & DETAILED BREAKDOWN */}
      <div className="space-y-6">
        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: "overview", label: "Overview & Mission", icon: Info },
            { id: "stages", label: "Stages & Timeline", icon: Calendar },
            { id: "tracks", label: "Problem Statements (Tracks)", icon: Code2 },
            { id: "prizes", label: "Prizes & Rewards", icon: Trophy },
            { id: "rules", label: "Eligibility & Guidelines", icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & MISSION */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            <div className="lg:col-span-8 rounded-2xl bg-white dark:bg-[#0E0F14] border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  About "{event.title}"
                </h3>
                <p className="text-xs md:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                  The flagship national hackathon created to break down artificial barriers to entry in tech. "ABC (Anybody Can Code)" empowers passionate student engineers, self-taught coders, and multidisciplinary creators to build scalable AI products from scratch using Google Cloud, Gemini API, and cutting-edge open-source tools.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                  Why Should You Participate?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-1.5 shadow-xs">
                    <div className="font-bold text-xs text-slate-900 dark:text-white">Direct Venture & Hiring Interviews</div>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      Top performers receive direct fast-track interviews with hiring engineering teams at leading AI startups across India.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-1.5 shadow-xs">
                    <div className="font-bold text-xs text-slate-900 dark:text-white">Google Cloud & Gemini Credits</div>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      Every registered team receives developer API keys, credits, and live workshop mentorship.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Card: Quick Facts */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0E0F14] border border-slate-200 dark:border-zinc-800 space-y-4 shadow-xs">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                  Event Specifications
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-zinc-400">Team Size:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">1 - 4 Members</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-zinc-400">Registration Fee:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">100% Free</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-zinc-400">Inter-College Teams:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">Allowed</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-zinc-400">Location:</span>
                    <span className="font-mono text-slate-900 dark:text-white">Bengaluru & Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-zinc-400">Total Rounds:</span>
                    <span className="font-mono text-slate-900 dark:text-white">3 Rounds</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STAGES & TIMELINE */}
        {activeTab === "stages" && (
          <div className="rounded-2xl bg-white dark:bg-[#0E0F14] border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Competition Rounds & Timelines
            </h3>

            <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-zinc-800">
              {(event.stages || []).map((stage, idx) => (
                <div key={stage.title} className="relative pl-10 space-y-2">
                  <div
                    className={`absolute left-1.5 top-1 w-5 h-5 rounded-full border-2 border-white dark:border-[#0E0F14] flex items-center justify-center text-[10px] font-mono ${
                      stage.status === "ACTIVE"
                        ? "bg-blue-600 text-white ring-4 ring-blue-500/20"
                        : "bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400"
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {stage.title}
                    </h4>
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold">
                      📅 {stage.date}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                    {stage.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROBLEM STATEMENTS (TRACKS) */}
        {activeTab === "tracks" && (
          <div className="rounded-2xl bg-white dark:bg-[#0E0F14] border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                National Problem Statements & Innovation Tracks
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Choose one track for your Round 1 PPT submission.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(event.problemStatements || []).map((ps) => (
                <div
                  key={ps.id}
                  className="p-5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-3 flex flex-col justify-between shadow-xs"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 font-semibold">
                      {ps.track}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                      {ps.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      {ps.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-zinc-850 text-[11px] text-slate-500 dark:text-zinc-500">
                    <span className="text-slate-700 dark:text-zinc-400 font-semibold">Deliverable: </span>
                    {ps.expectedDeliverables}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PRIZES & REWARDS */}
        {activeTab === "prizes" && (
          <div className="rounded-2xl bg-white dark:bg-[#0E0F14] border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Prizes, Cloud Grants & Fast-Track Perks
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(event.prizes || []).map((prize) => (
                <div
                  key={prize.place}
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-4 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-slate-500 dark:text-zinc-400">
                      {prize.place}
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                      {prize.amount}
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-400">
                    {prize.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ELIGIBILITY & GUIDELINES */}
        {activeTab === "rules" && (
          <div className="rounded-2xl bg-white dark:bg-[#0E0F14] border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Official Guidelines, Rules & Eligibility
            </h3>

            <div className="space-y-4 text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
              {(event.rulesGuidelines || []).map((rule, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

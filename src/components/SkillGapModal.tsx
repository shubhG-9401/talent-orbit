"use client";

import React from "react";
import { Event } from "@/types";
import { useStore } from "@/lib/store";
import {
  rankOpportunity,
  getPlatformMeta,
} from "@/lib/ranking";
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Users,
  ExternalLink,
  Clock,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Lightbulb,
} from "lucide-react";

interface SkillGapModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onRegister: (event: Event) => void;
}

export function SkillGapModal({
  event,
  isOpen,
  onClose,
  onRegister,
}: SkillGapModalProps) {
  const { user } = useStore();

  if (!isOpen || !event) return null;

  const { rankingScore, skillGap, eligibility, deadlineInfo } = rankOpportunity(
    event,
    user
  );
  const platformMeta = getPlatformMeta(event.sourcePlatform);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#0E0F14] border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-zinc-850 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
                TalentOrbit Ranking & Skill Gap Engine
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {event.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Top Score & Telemetry Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-1 shadow-xs">
              <div className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                Overall Match Rank
              </div>
              <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                {rankingScore}%
              </div>
              <p className="text-[10px] text-slate-500 dark:text-zinc-500">
                Weighted across skills, eligibility, and deadline urgency
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-1 shadow-xs">
              <div className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                Application Deadline
              </div>
              <div
                className={`text-base font-bold font-mono ${
                  deadlineInfo.isUrgent ? "text-amber-600 dark:text-amber-400" : "text-slate-900 dark:text-white"
                }`}
              >
                {deadlineInfo.text}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-zinc-500">
                Due: {deadlineInfo.formattedDate}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-1 shadow-xs">
              <div className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                Eligibility Status
              </div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{eligibility.badge}</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-zinc-500 line-clamp-1">
                {eligibility.reason}
              </p>
            </div>
          </div>

          {/* Skill Breakdown (Matched vs Gaps) */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span>Normalized Skill Match & Gap Analysis</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Data normalized across tech aliases (e.g., nodejs → Node.js).
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
                {skillGap.matchedSkills.length} of {event.requiredSkills.length} Matched ({skillGap.skillMatchPercentage}%)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Matched Skills */}
              <div className="space-y-2 p-3.5 rounded-xl bg-white dark:bg-black/60 border border-emerald-200 dark:border-emerald-900/30 shadow-xs">
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Skills You Have ({skillGap.matchedSkills.length})</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {skillGap.matchedSkills.length === 0 ? (
                    <span className="text-xs text-slate-400 dark:text-zinc-500">None yet</span>
                  ) : (
                    skillGap.matchedSkills.map((s) => (
                      <span
                        key={s}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 font-semibold"
                      >
                        {s}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Missing Skills (Skill Gap) */}
              <div className="space-y-2 p-3.5 rounded-xl bg-white dark:bg-black/60 border border-amber-200 dark:border-amber-900/30 shadow-xs">
                <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Skill Gap ({skillGap.missingSkills.length})</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {skillGap.missingSkills.length === 0 ? (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                      No gaps! You match 100% of prerequisites.
                    </span>
                  ) : (
                    skillGap.missingSkills.map((s) => (
                      <span
                        key={s}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-300 font-semibold"
                      >
                        {s}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Actionable Remediation Box */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-500/30 flex items-start gap-3">
              <Lightbulb className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                  Recommendation to Bridge the Gap:
                </div>
                <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                  {skillGap.recommendedAction}
                </p>
              </div>
            </div>
          </div>

          {/* Source Link & Verification */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Original Source Listing</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${platformMeta.badgeClass}`}
                >
                  {platformMeta.icon} {platformMeta.name}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Never miss an update or deadline change from the host.
              </p>
            </div>

            {event.sourceUrl ? (
              <a
                href={event.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs text-slate-900 dark:text-white font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
              >
                <span>Visit Source</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
              </a>
            ) : (
              <span className="text-xs text-slate-400 dark:text-zinc-500">Official Host</span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-200 dark:border-zinc-850 bg-slate-50/70 dark:bg-[#080808]/60 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Eligibility checked against your profile ({user.city || "Bengaluru"}, Undergrad CS).
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors shadow-xs"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onRegister(event);
              }}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/25"
            >
              <span>Proceed to Register</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

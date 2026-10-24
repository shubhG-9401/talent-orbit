"use client";

import React, { useState, useEffect } from "react";
import { Event } from "@/types";
import { useStore } from "@/lib/store";
import { analyzeGeminiMatch, MatchAnalysisResult } from "@/lib/gemini";
import {
  X,
  Sparkles,
  Github,
  CheckCircle2,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface GeminiMatchModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onProceedToRegister: (event: Event) => void;
}

export function GeminiMatchModal({
  event,
  isOpen,
  onClose,
  onProceedToRegister,
}: GeminiMatchModalProps) {
  const { user, githubData } = useStore();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MatchAnalysisResult | null>(null);

  useEffect(() => {
    if (isOpen && event) {
      setLoading(true);
      analyzeGeminiMatch(
        event.title,
        event.description,
        event.requiredSkills,
        user.skills,
        githubData?.repos || []
      ).then((res) => {
        setAnalysis(res);
        setLoading(false);
      });
    }
  }, [isOpen, event, user.skills, githubData?.repos]);

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#0E0F14] border border-blue-500/40 shadow-2xl overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-zinc-850 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
                Gemini AI Deep Analysis
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Profile & Tech Match
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-500 animate-spin mx-auto" />
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                Gemini is cross-referencing your GitHub repos with {event.title}...
              </p>
            </div>
          ) : analysis ? (
            <>
              {/* Score Highlight Card */}
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                    Overall Compatibility
                  </span>
                  <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                    {analysis.score}%
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 ml-2">
                      Strong Match
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                    Based on language overlap, architecture repositories & hackathon focus.
                  </p>
                </div>

                <div className="w-16 h-16 rounded-full border-4 border-blue-600/30 border-t-blue-600 flex items-center justify-center font-mono font-bold text-lg text-slate-900 dark:text-white shadow-xs">
                  {analysis.score}
                </div>
              </div>

              {/* Match Reason */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  AI Rationale
                </span>
                <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-850 shadow-xs">
                  {analysis.matchReason}
                </p>
              </div>

              {/* GitHub Repositories Aligned */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
                  <span>Matching Repositories on Your GitHub</span>
                </span>
                <div className="space-y-2">
                  {githubData.repos.slice(0, 2).map((repo) => (
                    <div
                      key={repo.name}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 text-xs flex items-center justify-between shadow-xs"
                    >
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                        {repo.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400">
                        {repo.language}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategy & Key Strengths */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Winning Hackathon Tip</span>
                </span>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {analysis.suggestedFocus}
                </p>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-zinc-850 bg-slate-50/70 dark:bg-[#080808]/60 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-white text-xs font-semibold hover:bg-slate-100 dark:hover:bg-zinc-900 shadow-xs transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onProceedToRegister(event);
            }}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all"
          >
            <span>Proceed to Register</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

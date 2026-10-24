"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { StudentDiscovery } from "@/components/StudentDiscovery";
import { StudentProfileView } from "@/components/StudentProfileView";
import { HostWorkspace } from "@/components/HostWorkspace";
import { RegistrationModal } from "@/components/RegistrationModal";
import { GeminiMatchModal } from "@/components/GeminiMatchModal";
import { SkillGapModal } from "@/components/SkillGapModal";
import { HackathonDetailView } from "@/components/HackathonDetailView";
import { AuthModal } from "@/components/AuthModal";
import { CompanionAppSimulator } from "@/components/CompanionAppSimulator";
import { Event } from "@/types";
import { User, GraduationCap, Building2, Sparkles, LogIn, UserPlus } from "lucide-react";

function MainContent() {
  const {
    activeNav,
    setActiveNav,
    setActiveFilter,
    isAuthenticated,
    switchAccount,
  } = useStore();
  const [selectedEventForReg, setSelectedEventForReg] = useState<Event | null>(null);
  const [selectedEventForMatch, setSelectedEventForMatch] = useState<Event | null>(null);
  const [selectedEventForGap, setSelectedEventForGap] = useState<Event | null>(null);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<Event | null>(null);

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"LOGIN" | "SIGNUP">("LOGIN");

  // Switch to internships view
  React.useEffect(() => {
    if (activeNav === "internships") {
      setActiveFilter("Internships");
      setSelectedEventForDetail(null);
    } else if (activeNav === "events") {
      setActiveFilter("All");
    }
  }, [activeNav, setActiveFilter]);

  const handleOpenRegister = (evt: Event) => {
    if (!isAuthenticated) {
      setAuthModalMode("LOGIN");
      setAuthModalOpen(true);
      return;
    }
    setSelectedEventForReg(evt);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200 relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none bg-mesh-gradient z-0 opacity-80" />
      <div className="fixed inset-0 pointer-events-none bg-grid-pattern z-0 opacity-40" />

      <Navbar
        onOpenAuth={(mode) => {
          setAuthModalMode(mode);
          setAuthModalOpen(true);
        }}
      />

      <main className="flex-1 relative z-10">
        {selectedEventForDetail ? (
          <HackathonDetailView
            event={selectedEventForDetail}
            onBack={() => setSelectedEventForDetail(null)}
            onRegister={handleOpenRegister}
            onOpenSkillGapModal={(evt) => setSelectedEventForGap(evt)}
          />
        ) : activeNav === "companion" ? (
          <div className="py-6 sm:py-8 px-4">
            <CompanionAppSimulator />
          </div>
        ) : activeNav === "host" ? (
          <HostWorkspace />
        ) : (activeNav === "profile" || activeNav === "applications") && !isAuthenticated ? (
          <div className="max-w-xl mx-auto px-6 py-24 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center shadow-lg">
              <User className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">
                Authentication Required
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Sign in to view your Student Passport
              </h2>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed max-w-md mx-auto">
                Your Verified Talent Passport, registered event applications, and GitHub repository sync require an active TalentOrbit session.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setAuthModalMode("LOGIN");
                  setAuthModalOpen(true);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-900 dark:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                <span>Log In</span>
              </button>
              <button
                onClick={() => {
                  setAuthModalMode("SIGNUP");
                  setAuthModalOpen(true);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register Account</span>
              </button>
              <button
                onClick={() => switchAccount("STUDENT")}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-blue-300 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/30 flex items-center justify-center gap-2 transition-colors"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Explore with Demo Student</span>
              </button>
            </div>
          </div>
        ) : activeNav === "profile" || activeNav === "applications" ? (
          <StudentProfileView />
        ) : (
          <StudentDiscovery
            onSelectEvent={(evt) => setSelectedEventForDetail(evt)}
            onOpenMatchModal={(evt) => setSelectedEventForMatch(evt)}
            onOpenSkillGapModal={(evt) => setSelectedEventForGap(evt)}
          />
        )}
      </main>

      {/* Registration Modal Dialog */}
      <RegistrationModal
        event={selectedEventForReg}
        isOpen={Boolean(selectedEventForReg)}
        onClose={() => setSelectedEventForReg(null)}
        onSuccess={() => {
          setSelectedEventForReg(null);
          setActiveNav("applications");
        }}
      />

      {/* Gemini AI Deep Match Modal */}
      <GeminiMatchModal
        event={selectedEventForMatch}
        isOpen={Boolean(selectedEventForMatch)}
        onClose={() => setSelectedEventForMatch(null)}
        onProceedToRegister={(evt) => {
          setSelectedEventForMatch(null);
          setSelectedEventForReg(evt);
        }}
      />

      {/* Skill Gap & Ranking Explanation Modal */}
      <SkillGapModal
        event={selectedEventForGap}
        isOpen={Boolean(selectedEventForGap)}
        onClose={() => setSelectedEventForGap(null)}
        onRegister={(evt) => {
          setSelectedEventForGap(null);
          setSelectedEventForReg(evt);
        }}
      />

      {/* Auth Modal (Login / Sign Up) */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Modern Ultra-Clean Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-zinc-850 py-10 px-6 mt-16 text-center text-xs text-slate-500 dark:text-zinc-500 relative z-10 bg-white/50 dark:bg-black/30 backdrop-blur-sm transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white tracking-tight">TalentOrbit</span>
            <span className="text-slate-300 dark:text-zinc-600">•</span>
            <span>Intelligent Tech Discovery, Skill Gap Matching & Companion NFC Routing</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500 dark:text-zinc-400">
            <span>Verified Sources</span>
            <span>•</span>
            <span>Unstop Full View</span>
            <span>•</span>
            <span>Gemini AI Engine</span>
            <span>•</span>
            <span>Prisma ORM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return <MainContent />;
}

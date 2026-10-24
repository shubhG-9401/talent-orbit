"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  Building2,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Check,
  ChevronLeft,
  GraduationCap,
  ShieldCheck,
  Users,
} from "lucide-react";

export default function HostLoginPage() {
  const router = useRouter();
  const { login, switchAccount } = useStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter your official work/organizer email and password.");
      return;
    }

    setSuccessMsg("Opening Host & Organizer Workspace...");
    setTimeout(() => {
      login({ email, password, role: "HOST" });
      router.push("/");
    }, 600);
  };

  const handleDemoHost = () => {
    setSuccessMsg("Logging in as Organizer Demo (Sarah Chen, TechYuva)...");
    setTimeout(() => {
      switchAccount("HOST");
      router.push("/");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col justify-between selection:bg-purple-600/30">
      {/* Top Header */}
      <header className="w-full border-b border-zinc-850 bg-[#080808]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-purple-400 font-bold group-hover:border-purple-500/50 transition-colors">
              <span className="text-sm font-mono">TO</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-zinc-200 transition-colors">
              TalentOrbit <span className="text-xs font-mono font-normal text-purple-400">Host</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/student/login"
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors hidden sm:flex"
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
              <span>Student Login →</span>
            </Link>

            <Link
              href="/"
              className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Discovery</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Host Login Card */}
      <main className="flex-1 flex items-center justify-center p-6 my-8">
        <div className="w-full max-w-md rounded-2xl bg-[#0F0F12] border border-zinc-800 shadow-2xl p-8 space-y-6">
          {/* Badge & Title */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/30 text-purple-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>Organizer & Host Workspace</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Host Portal Sign In
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Create hackathons, generate problem tracks with Gemini AI, and review student squads in real-time.
            </p>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-xs text-red-300">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1-Click Instant Demo Login */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                Instant 1-Click Organizer Demo
              </span>
              <span className="text-[10px] font-mono text-purple-400">Pre-loaded</span>
            </div>
            <button
              type="button"
              onClick={handleDemoHost}
              className="w-full py-2 px-3 rounded-lg bg-purple-600/10 border border-purple-500/30 hover:bg-purple-600/20 text-purple-400 text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>Sarah Chen (TechYuva DevRel)</span>
              </div>
              <span className="text-[11px] font-mono font-bold">Open Host View →</span>
            </button>
          </div>

          {/* Host Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">
                Work / Organizer Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah.chen@techyuva.org or host@company.com"
                  className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-300">
                  Password
                </label>
                <span className="text-[11px] text-zinc-500 hover:text-zinc-400 cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.45)]"
            >
              <span>Access Organizer Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="pt-2 border-t border-zinc-850/80 text-center space-y-2 text-xs text-zinc-400">
            <div>
              New event organizer?{" "}
              <Link
                href="/host/register"
                className="text-purple-400 hover:underline font-semibold"
              >
                Register an Organizer Workspace →
              </Link>
            </div>
            <div>
              Student searching for hackathons?{" "}
              <Link
                href="/student/login"
                className="text-blue-400 hover:underline font-semibold"
              >
                Go to Student Builder Login
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-850 py-6 text-center text-xs text-zinc-500">
        TalentOrbit Host • Dedicated Workspace for Hackathon Organizers, Tech Communities & Companies
      </footer>
    </div>
  );
}

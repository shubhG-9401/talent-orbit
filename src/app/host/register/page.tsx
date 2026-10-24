"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  Building2,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  Check,
  ChevronLeft,
  GraduationCap,
  Briefcase,
  Layers,
  MapPin,
} from "lucide-react";

export default function HostRegisterPage() {
  const router = useRouter();
  const { register, switchAccount } = useStore();

  const [orgName, setOrgName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [orgType, setOrgType] = useState<"COMPANY" | "COLLEGE_CLUB" | "DEV_COMMUNITY" | "DAO">("DEV_COMMUNITY");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!orgName.trim() || !contactName.trim() || !email.trim() || !password.trim()) {
      setErrorMsg("Please fill out all required organization details.");
      return;
    }

    setSuccessMsg("Provisioning Organizer Workspace for " + orgName + "...");
    setTimeout(() => {
      register({
        name: `${contactName} (${orgName})`,
        email,
        password,
        role: "HOST",
        city,
        skills: ["Hackathon Ops", "DevRel", "Tech Community", "AI Mentorship"],
      });
      router.push("/");
    }, 700);
  };

  const handleDemoHost = () => {
    setSuccessMsg("Loading Organizer Demo (Sarah Chen, TechYuva)...");
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
              href="/student/register"
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors hidden sm:flex"
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
              <span>Student Registration →</span>
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

      {/* Main Host Register Card */}
      <main className="flex-1 flex items-center justify-center p-6 my-8">
        <div className="w-full max-w-xl rounded-2xl bg-[#0F0F12] border border-zinc-800 shadow-2xl p-8 space-y-6">
          {/* Badge & Title */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/30 text-purple-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>Host Workspace Onboarding</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Register Organizer Workspace
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto">
              Create a dedicated dashboard to host national hackathons, launch internship tracks, and review verified student candidates.
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

          {/* Quick Demo Shortcut */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
            <span className="text-zinc-400">Want to test organizer features first?</span>
            <button
              type="button"
              onClick={handleDemoHost}
              className="px-3 py-1 rounded-lg bg-purple-600/10 border border-purple-500/30 text-purple-400 font-semibold text-xs hover:bg-purple-600/20 transition-colors"
            >
              Load Demo Host →
            </button>
          </div>

          {/* Host Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">
                  Organization / Company Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Google Cloud Club, TechYuva"
                    className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">
                  Lead Organizer / POC Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Sarah Chen"
                    className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">
                  Organization Type
                </label>
                <select
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value as any)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="DEV_COMMUNITY">Developer Community / Collective</option>
                  <option value="COLLEGE_CLUB">University / College Student Club</option>
                  <option value="COMPANY">Enterprise / Tech Startup</option>
                  <option value="DAO">Web3 / Open Source DAO</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">
                  Headquarters / City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">
                  Work / Official Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="organizer@community.org"
                    className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.45)]"
              >
                <span>Launch Organizer Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="pt-2 border-t border-zinc-850/80 text-center space-y-2 text-xs text-zinc-400">
            <div>
              Already have an organizer account?{" "}
              <Link
                href="/host/login"
                className="text-purple-400 hover:underline font-semibold"
              >
                Sign in to Organizer Workspace →
              </Link>
            </div>
            <div>
              Student searching for hackathons?{" "}
              <Link
                href="/student/register"
                className="text-blue-400 hover:underline font-semibold"
              >
                Register as a Student Builder
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

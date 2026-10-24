"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { Role } from "@/types";
import {
  X,
  Github,
  Mail,
  Lock,
  User as UserIcon,
  MapPin,
  Sparkles,
  Check,
  Building2,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "LOGIN" | "SIGNUP";
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "LOGIN",
}: AuthModalProps) {
  const { login, register, switchAccount } = useStore();
  const [mode, setMode] = useState<"LOGIN" | "SIGNUP">(initialMode);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("STUDENT");
  const [city, setCity] = useState("Delhi NCR");
  const [academicLevel, setAcademicLevel] = useState<"UNDERGRAD" | "POSTGRAD" | "BOOTCAMP">("UNDERGRAD");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "Python",
    "Node.js",
    "React",
    "TypeScript",
  ]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const availableSkills = [
    "Node.js",
    "Python",
    "React",
    "TypeScript",
    "PostgreSQL",
    "Docker",
    "FastAPI",
    "Gemini API",
    "Tailwind CSS",
    "Redis",
    "LangChain",
    "Next.js",
  ];

  if (!isOpen) return null;

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleGitHubAuth = () => {
    setSuccessMsg("Connected via GitHub OAuth (@shubhg9401)");
    setTimeout(() => {
      login({
        email: "shubh.gupta@dtu.ac.in",
        name: "Shubh Gupta",
        role: "STUDENT",
      });
      onClose();
    }, 700);
  };

  const handleDemoLogin = (targetRole: Role) => {
    if (targetRole === "HOST") {
      setSuccessMsg("Logging in as Organizer Demo (Sarah Chen)...");
      setTimeout(() => {
        switchAccount("HOST");
        onClose();
      }, 500);
    } else {
      setSuccessMsg("Logging in as Student Demo (Arjun Sharma)...");
      setTimeout(() => {
        switchAccount("STUDENT");
        onClose();
      }, 500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (mode === "LOGIN") {
      if (!email.trim() || !password.trim()) {
        setErrorMsg("Please enter your email and password.");
        return;
      }

      setSuccessMsg("Welcome back to TalentOrbit!");
      setTimeout(() => {
        login({
          email,
          password,
        });
        onClose();
      }, 600);
    } else {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setErrorMsg("Please complete all required fields.");
        return;
      }

      setSuccessMsg("Your verified account has been created!");
      setTimeout(() => {
        register({
          name,
          email,
          password,
          role,
          city,
          skills: selectedSkills,
        });
        onClose();
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#0E0F14] border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-zinc-850 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
              TalentOrbit Portal Access
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
              {mode === "LOGIN" ? "Sign in to Your Account" : "Create Student / Host Account"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-zinc-850 p-1 bg-slate-100 dark:bg-black">
          <button
            type="button"
            onClick={() => {
              setMode("LOGIN");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === "LOGIN"
                ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("SIGNUP");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === "SIGNUP"
                ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Register / Sign Up
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 text-xs text-red-700 dark:text-red-300">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Social One-Click Login */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleGitHubAuth}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 hover:bg-slate-200/70 dark:hover:bg-zinc-850 text-slate-900 dark:text-white text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-xs"
            >
              <Github className="w-4 h-4 text-slate-900 dark:text-white" />
              <span>Continue with GitHub (Recommended for Devs)</span>
            </button>
          </div>

          {/* Quick Demo Access (1-Click) */}
          {mode === "LOGIN" && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-wider block font-semibold">
                Instant Demo Access
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin("STUDENT")}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-900 text-left transition-all shadow-xs"
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                    <span>Student Demo</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono mt-0.5 truncate">
                    Arjun Sharma (IIITB)
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin("HOST")}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-900 text-left transition-all shadow-xs"
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-purple-500" />
                    <span>Organizer Demo</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono mt-0.5 truncate">
                    Sarah Chen (TechYuva)
                  </div>
                </button>
              </div>
            </div>
          )}

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-zinc-850 w-full" />
            <span className="bg-white dark:bg-[#0E0F14] px-3 text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              Or with email credentials
            </span>
            <div className="border-t border-slate-200 dark:border-zinc-850 w-full" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "SIGNUP" && (
              <>
                {/* Role Switcher */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                    I am joining as:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole("STUDENT")}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all shadow-xs ${
                        role === "STUDENT"
                          ? "bg-blue-50 dark:bg-blue-600/10 border-blue-500 text-blue-700 dark:text-blue-400"
                          : "bg-slate-50 dark:bg-black border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Student / Builder</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("HOST")}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all shadow-xs ${
                        role === "HOST"
                          ? "bg-purple-50 dark:bg-purple-600/10 border-purple-500 text-purple-700 dark:text-purple-400"
                          : "bg-slate-50 dark:bg-black border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Event Host / Org</span>
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Shubh Gupta"
                      className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-xs"
                    />
                  </div>
                </div>

                {/* City & Academic Level */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                      City
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-xs"
                    >
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Pune">Pune</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                      Academic Level
                    </label>
                    <select
                      value={academicLevel}
                      onChange={(e) => setAcademicLevel(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-xs"
                    >
                      <option value="UNDERGRAD">Undergrad (B.Tech/BE)</option>
                      <option value="POSTGRAD">Postgrad (M.Tech/MCA)</option>
                      <option value="BOOTCAMP">Bootcamp / Self-Taught</option>
                    </select>
                  </div>
                </div>

                {/* Skill Selection Cloud */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 flex items-center justify-between">
                    <span>Select Your Tech Skills:</span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                      {selectedSkills.length} selected
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1.5 bg-slate-50 dark:bg-black rounded-xl border border-slate-200 dark:border-zinc-850 shadow-inner">
                    {availableSkills.map((s) => {
                      const active = selectedSkills.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSkill(s)}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md transition-colors ${
                            active
                              ? "bg-blue-600 text-white font-semibold"
                              : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/25"
            >
              <span>{mode === "LOGIN" ? "Sign In to TalentOrbit" : "Create My Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Toggle Mode Footer */}
            <div className="pt-2 text-center text-xs text-slate-500 dark:text-zinc-400">
              {mode === "LOGIN" ? (
                <p>
                  Don&apos;t have an account yet?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("SIGNUP");
                      setErrorMsg(null);
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    Register here
                  </button>
                </p>
              ) : (
                <p>
                  Already registered on TalentOrbit?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("LOGIN");
                      setErrorMsg(null);
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    Sign in here
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  Github,
  Mail,
  Lock,
  User as UserIcon,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Check,
  ChevronLeft,
  Building2,
  Code2,
} from "lucide-react";

export default function StudentRegisterPage() {
  const router = useRouter();
  const { register, switchAccount } = useStore();

  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [academicLevel, setAcademicLevel] = useState<"UNDERGRAD" | "POSTGRAD" | "BOOTCAMP">("UNDERGRAD");
  const [githubUsername, setGithubUsername] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "Node.js",
    "Python",
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
    "PyTorch",
    "Express",
    "Rust",
    "Go",
  ];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg("Please fill out your name, email, and password.");
      return;
    }

    setSuccessMsg("Generating your Verified Student Talent Passport...");
    setTimeout(() => {
      register({
        name,
        email,
        password,
        role: "STUDENT",
        city,
        skills: selectedSkills,
        githubUsername: githubUsername.trim() || name.toLowerCase().replace(/\s+/g, "_"),
      });
      router.push("/");
    }, 700);
  };

  const handleDemoStudent = () => {
    setSuccessMsg("Loading Student Demo (Arjun Sharma, IIITB)...");
    setTimeout(() => {
      switchAccount("STUDENT");
      router.push("/");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col justify-between selection:bg-blue-600/30">
      {/* Top Header */}
      <header className="w-full border-b border-zinc-850 bg-[#080808]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-500 font-bold group-hover:border-blue-500/50 transition-colors">
              <span className="text-sm font-mono">TO</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-zinc-200 transition-colors">
              TalentOrbit
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/host/register"
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors hidden sm:flex"
            >
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Organizer Sign Up →</span>
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

      {/* Main Registration Card */}
      <main className="flex-1 flex items-center justify-center p-6 my-8">
        <div className="w-full max-w-xl rounded-2xl bg-[#0F0F12] border border-zinc-800 shadow-2xl p-8 space-y-6">
          {/* Badge & Title */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/40 border border-blue-500/30 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Registration</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Create Your Student Talent Passport
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto">
              Get an instant cryptographic Verified Talent Passport, personalized Gemini AI opportunity matching, and team formation tools.
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
            <span className="text-zinc-400">Want to test without registering?</span>
            <button
              type="button"
              onClick={handleDemoStudent}
              className="px-3 py-1 rounded-lg bg-blue-600/10 border border-blue-500/30 text-blue-400 font-semibold text-xs hover:bg-blue-600/20 transition-colors"
            >
              Load Demo Student →
            </button>
          </div>

          {/* Student Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Arjun Sharma"
                    className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">
                  College / University
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. IIIT Bengaluru, DTU, IITB"
                    className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">
                  City Location
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">
                  Academic Standing
                </label>
                <select
                  value={academicLevel}
                  onChange={(e) => setAcademicLevel(e.target.value as any)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="UNDERGRAD">Undergraduate (B.Tech / B.E / BCA)</option>
                  <option value="POSTGRAD">Postgraduate (M.Tech / MS / MCA)</option>
                  <option value="BOOTCAMP">Self-Taught / Developer Collective</option>
                </select>
              </div>
            </div>

            {/* GitHub Username Sync */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">
                GitHub Username (for Repository Sync & Auto-Rank)
              </label>
              <div className="relative">
                <Github className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  placeholder="e.g. arjun_dev"
                  className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            {/* Skill Selection Cloud */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Select Your Core Tech Skills:</span>
                </label>
                <span className="text-[10px] font-mono text-zinc-500">
                  {selectedSkills.length} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 p-2 bg-black rounded-xl border border-zinc-850 max-h-32 overflow-y-auto">
                {availableSkills.map((s) => {
                  const active = selectedSkills.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSkill(s)}
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-md transition-colors ${
                        active
                          ? "bg-blue-600 text-white font-bold shadow-sm"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">
                  Student Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.45)]"
              >
                <span>Generate My Student Talent Passport</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="pt-2 border-t border-zinc-850/80 text-center space-y-2 text-xs text-zinc-400">
            <div>
              Already have a student account?{" "}
              <Link
                href="/student/login"
                className="text-blue-400 hover:underline font-semibold"
              >
                Sign in to your Student Passport →
              </Link>
            </div>
            <div>
              Event Organizer or Company?{" "}
              <Link
                href="/host/register"
                className="text-purple-400 hover:underline font-semibold"
              >
                Register an Organizer Workspace
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-850 py-6 text-center text-xs text-zinc-500">
        TalentOrbit • Student Tech Hackathons, Skill Gap Analysis & Verified Talent Passport
      </footer>
    </div>
  );
}

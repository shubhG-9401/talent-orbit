"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import {
  MapPin,
  Sparkles,
  Building2,
  User,
  ChevronDown,
  Check,
  LogIn,
  UserPlus,
  LogOut,
  ShieldCheck,
  Briefcase,
  FileText,
  Repeat,
  Search,
  Calendar,
  Trophy,
  Smartphone,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";

interface NavbarProps {
  onOpenAuth?: (mode: "LOGIN" | "SIGNUP") => void;
}

export function Navbar({ onOpenAuth }: NavbarProps) {
  const {
    activeNav,
    setActiveNav,
    selectedCity,
    setSelectedCity,
    user,
    isAuthenticated,
    logout,
    switchAccount,
    registrations,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    theme,
    toggleTheme,
  } = useStore();

  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cities = ["All", "Bengaluru", "Delhi NCR", "Mumbai", "Remote"];

  const pendingOrApprovedCount = registrations.filter(
    (r) => r.userId === user.id
  ).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-[#08080A]/85 backdrop-blur-xl transition-colors duration-200 shadow-xs dark:shadow-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Logo + Search + Core Links */}
        <div className="flex items-center gap-4 lg:gap-6 min-w-0">
          <button
            onClick={() => {
              setActiveNav("events");
              setActiveFilter("All");
            }}
            className="flex items-center gap-2.5 group text-left focus:outline-none shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-white font-bold flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <span className="text-xs font-mono font-black tracking-tighter">TO</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                TalentOrbit
              </span>
              <span className="text-[9px] font-mono tracking-wider text-slate-500 dark:text-zinc-500 uppercase -mt-1 hidden sm:inline">
                Verified Tech
              </span>
            </div>
          </button>

          {/* Search Bar */}
          <div className="relative hidden xl:flex items-center w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hackathons, AI, web3..."
              className="w-full bg-slate-100/80 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 rounded-full pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => {
                setActiveFilter("All");
                setActiveNav("events");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeNav === "events" && activeFilter !== "Hackathons"
                  ? "text-blue-600 dark:text-white bg-blue-50 dark:bg-zinc-800/90 shadow-xs border border-blue-200/60 dark:border-zinc-700/60"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/40"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>Events</span>
            </button>

            <button
              onClick={() => {
                setActiveFilter("Hackathons");
                setActiveNav("events");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeNav === "events" && activeFilter === "Hackathons"
                  ? "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-800/40 shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/40"
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Hacks</span>
            </button>

            <button
              onClick={() => setActiveNav("internships")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeNav === "internships"
                  ? "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300/60 dark:border-emerald-800/40 shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/40"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
              <span>Internships</span>
            </button>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  onOpenAuth ? onOpenAuth("LOGIN") : setActiveNav("applications");
                } else {
                  setActiveNav("applications");
                }
              }}
              className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeNav === "applications"
                  ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-800/90 shadow-xs border border-slate-200 dark:border-zinc-700/60"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/40"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
              <span>Applications</span>
              {isAuthenticated && pendingOrApprovedCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.2 text-[9px] font-mono font-bold rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800/50">
                  {pendingOrApprovedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveNav("companion")}
              className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeNav === "companion"
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-300/60 dark:border-blue-800/50 shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/40"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-500" />
              <span>Companion</span>
              <span className="ml-0.5 inline-flex items-center px-1.5 py-0.2 text-[8px] font-mono font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/50">
                NFC
              </span>
            </button>
          </nav>
        </div>

        {/* Right: City Selector, Theme Toggle, Host Workspace, Auth / Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* City Selector Dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100/80 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-700 hover:text-slate-900 dark:hover:text-white transition-all shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>{selectedCity === "All" ? "All Locations" : selectedCity}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 dark:text-zinc-400 ml-0.5" />
            </button>

            {cityDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setCityDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-[#101117] border border-slate-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-slate-400 dark:text-zinc-400 uppercase font-mono">
                    Filter by City
                  </div>
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setCityDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs flex items-center justify-between text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <span>{city === "All" ? "📍 All Locations" : `📍 ${city}`}</span>
                      {selectedCity === city && (
                        <Check className="w-3.5 h-3.5 text-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* THEME TOGGLE BUTTON (LIGHT / DARK) */}
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
            className="relative p-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-100/80 dark:bg-zinc-900/80 hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-xs flex items-center justify-center group"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform group-hover:rotate-45 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 transition-transform group-hover:-rotate-12 duration-300" />
            )}
            <span className="sr-only">Toggle theme</span>
          </button>

          {/* Conditional Auth States */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => (onOpenAuth ? onOpenAuth("LOGIN") : null)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
                <span>Log In</span>
              </button>

              <button
                onClick={() => (onOpenAuth ? onOpenAuth("SIGNUP") : null)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/25 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Register</span>
              </button>
            </div>
          ) : (
            <>
              {/* Host Workspace Button */}
              <button
                onClick={() => setActiveNav("host")}
                className={`hidden sm:flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-xl border transition-all ${
                  activeNav === "host"
                    ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/25"
                    : "bg-slate-100/80 dark:bg-zinc-900/70 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-zinc-800 shadow-xs"
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Host Workspace</span>
              </button>

              {/* User Profile Avatar with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  title="Account Menu"
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full border transition-all ${
                    userMenuOpen || activeNav === "profile"
                      ? "border-blue-500 ring-2 ring-blue-500/30"
                      : "border-slate-300 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-700"
                  }`}
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#080808]" />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#0F1015] border border-slate-200 dark:border-zinc-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      {/* User Info Header */}
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/60 border border-slate-200/80 dark:border-zinc-850/80 mb-1.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {user.name}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                              {user.email}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono">
                          <span className={`px-2 py-0.5 rounded-full border ${
                            user.role === "HOST"
                              ? "bg-purple-100 dark:bg-purple-950/50 border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300"
                              : "bg-blue-100 dark:bg-blue-950/50 border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300"
                          }`}>
                            {user.role === "HOST" ? "Organizer / Host" : "Verified Student"}
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">● Online</span>
                        </div>
                      </div>

                      {/* Navigation links */}
                      <div className="space-y-0.5">
                        <button
                          onClick={() => {
                            setActiveNav("profile");
                            setUserMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center gap-2.5 transition-colors ${
                            activeNav === "profile"
                              ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white font-medium"
                              : "text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <User className="w-3.5 h-3.5 text-blue-500" />
                          <span>Student Talent Passport</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveNav("applications");
                            setUserMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between transition-colors ${
                            activeNav === "applications"
                              ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white font-medium"
                              : "text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <FileText className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
                            <span>My Registered Events</span>
                          </div>
                          {pendingOrApprovedCount > 0 && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 font-mono">
                              {pendingOrApprovedCount}
                            </span>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            setActiveNav("host");
                            setUserMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center gap-2.5 transition-colors ${
                            activeNav === "host"
                              ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white font-medium"
                              : "text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Host Workspace</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveNav("companion");
                            setUserMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between transition-colors ${
                            activeNav === "companion"
                              ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white font-medium"
                              : "text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                            <span>Companion Mobile App</span>
                          </div>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                            NFC Live
                          </span>
                        </button>
                      </div>

                      {/* Role Switcher Demo */}
                      <div className="my-1.5 border-t border-slate-200 dark:border-zinc-850 pt-1.5">
                        <button
                          onClick={() => {
                            switchAccount(user.role === "STUDENT" ? "HOST" : "STUDENT");
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-xl flex items-center gap-2.5 transition-colors"
                        >
                          <Repeat className="w-3.5 h-3.5 text-amber-500" />
                          <span>
                            {user.role === "STUDENT"
                              ? "Switch to Demo Host (Sarah Chen)"
                              : "Switch to Demo Student (Arjun Sharma)"}
                          </span>
                        </button>
                      </div>

                      {/* Log Out CTA */}
                      <div className="border-t border-slate-200 dark:border-zinc-850 pt-1.5">
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl flex items-center gap-2.5 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5 text-red-500" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-850"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-[#08080A]/95 px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-150 backdrop-blur-lg">
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            <button
              onClick={() => {
                setActiveFilter("All");
                setActiveNav("events");
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white"
            >
              Events
            </button>
            <button
              onClick={() => {
                setActiveFilter("Hackathons");
                setActiveNav("events");
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-zinc-400"
            >
              Hacks
            </button>
            <button
              onClick={() => {
                setActiveNav("internships");
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-zinc-400"
            >
              Internships
            </button>
            <button
              onClick={() => {
                setActiveNav("companion");
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400"
            >
              Companion
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

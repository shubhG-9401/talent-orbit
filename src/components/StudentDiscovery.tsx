"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { Event } from "@/types";
import {
  rankOpportunity,
  getPlatformMeta,
  formatDeadlineCountdown,
} from "@/lib/ranking";
import {
  Search,
  Sparkles,
  MapPin,
  Users,
  Trophy,
  ArrowRight,
  ExternalLink,
  Code2,
  CheckCircle2,
  Filter,
  Flame,
  Calendar,
  Layers,
  Check,
  AlertTriangle,
  Clock,
  GraduationCap,
  SlidersHorizontal,
  ChevronDown,
  Info,
  MessageSquare,
  Plus,
} from "lucide-react";

interface StudentDiscoveryProps {
  onSelectEvent: (event: Event) => void;
  onOpenMatchModal: (event: Event) => void;
  onOpenSkillGapModal: (event: Event) => void;
}

export function StudentDiscovery({
  onSelectEvent,
  onOpenMatchModal,
  onOpenSkillGapModal,
}: StudentDiscoveryProps) {
  const {
    events,
    selectedCity,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    user,
    registrations,
  } = useStore();

  const [sortBy, setSortBy] = useState<
    "RANK" | "DEADLINE" | "REWARD" | "RECENT"
  >("RANK");
  const [onlyEligible, setOnlyEligible] = useState(false);

  // Commudle Featured Communities state (interactive join/leave)
  const [joinedCommunityIds, setJoinedCommunityIds] = useState<string[]>([
    "comm_gdg_nd",
    "comm_gdg_noida",
    "comm_knotic",
  ]);

  const featuredCommunities = [
    {
      id: "comm_gdg_nd",
      name: "GDG New Delhi",
      tagline: "DevFest for 3 days!",
      logo: (
        <span className="font-mono text-sm font-bold text-amber-500">
          &lt;&gt;
        </span>
      ),
      members: "14.2k",
    },
    {
      id: "comm_crac",
      name: "CRAC Learning",
      tagline: "CRACCON Registrations are open!",
      logo: (
        <span className="font-mono text-[10px] font-bold text-emerald-500">
          CRAC
        </span>
      ),
      members: "8.9k",
    },
    {
      id: "comm_gdg_noida",
      name: "GDG Noida",
      tagline: "DevFest is here!",
      logo: (
        <span className="font-mono text-xs font-bold text-blue-500">
          &lt;&gt;
        </span>
      ),
      members: "11.5k",
    },
    {
      id: "comm_indian_ai",
      name: "Indian AI Community",
      tagline: "AI Builders Evening in Bengaluru.",
      logo: (
        <span className="font-mono text-[10px] font-bold text-white bg-slate-900 dark:bg-black px-1 rounded">
          AIC
        </span>
      ),
      members: "22.8k",
    },
    {
      id: "comm_knotic",
      name: "KNOTiC",
      tagline: "Hackathon, hackathon, hackathon",
      logo: (
        <span className="font-mono text-[10px] font-bold text-indigo-500">
          KNOT
        </span>
      ),
      members: "6.1k",
    },
  ];

  const toggleJoinCommunity = (id: string) => {
    setJoinedCommunityIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filterTags = [
    "All",
    "Hackathons",
    "Internships",
    "Workshops",
    "Node.js",
    "Python",
    "React",
    "UI/UX Design",
    "Remote",
  ];

  // Compute Ranked Data for all events
  const rankedEvents = useMemo(() => {
    return events.map((event) => {
      const evaluation = rankOpportunity(event, user);
      return {
        ...event,
        ...evaluation,
      };
    });
  }, [events, user]);

  // Filtering Logic
  const filteredEvents = useMemo(() => {
    let result = rankedEvents.filter((item) => {
      // City filter
      if (selectedCity !== "All") {
        if (selectedCity === "Remote" && !item.isRemote) return false;
        if (selectedCity !== "Remote" && item.city !== selectedCity) return false;
      }

      // Type or Skill filter
      if (activeFilter === "Hackathons" && item.type !== "HACKATHON") return false;
      if (activeFilter === "Internships" && item.type !== "INTERNSHIP") return false;
      if (activeFilter === "Workshops" && item.type !== "WORKSHOP") return false;
      if (activeFilter === "Remote" && !item.isRemote) return false;
      if (
        !["All", "Hackathons", "Internships", "Workshops", "Remote"].includes(activeFilter)
      ) {
        const hasSkill = item.requiredSkills.some(
          (s) => s.toLowerCase() === activeFilter.toLowerCase()
        );
        if (!hasSkill) return false;
      }

      // Eligibility toggle filter
      if (onlyEligible && !item.eligibility?.isEligible) {
        return false;
      }

      // Search bar
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchHost = item.hostName.toLowerCase().includes(query);
        const matchSkill = item.requiredSkills.some((s) =>
          s.toLowerCase().includes(query)
        );
        if (!matchTitle && !matchDesc && !matchHost && !matchSkill) return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "RANK") {
        return (b.rankingScore || 0) - (a.rankingScore || 0);
      }
      if (sortBy === "DEADLINE") {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortBy === "REWARD") {
        return (b.rewardOrStipend?.length || 0) - (a.rewardOrStipend?.length || 0);
      }
      if (sortBy === "RECENT") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    return result;
  }, [rankedEvents, selectedCity, activeFilter, onlyEligible, searchQuery, sortBy]);

  // Top Gemini Match Event
  const topMatchEvent = rankedEvents.find((e) => (e.rankingScore || 0) >= 90) || rankedEvents[0];

  const isUserRegistered = (eventId: string) => {
    return registrations.some(
      (r) => r.eventId === eventId && r.userId === user.id
    );
  };

  const formatCommudleDate = (isoDate: string) => {
    try {
      const d = new Date(isoDate);
      return (
        d.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        }) + " - 6:00 pm IST onwards"
      );
    } catch {
      return "Saturday, Nov 12th, 2026 - 6:00 pm IST onwards";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* 1. TOP 2-COLUMN ARCHITECTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* ================= LEFT MAIN FEED (8 COLS) ================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* Upcoming Events Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                  Curated Catalog
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 font-semibold">
                  {filteredEvents.length} Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Upcoming Opportunities
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
                AI-matched hackathons, internships, and student sprints with verified rubrics
              </p>
            </div>

            {/* Sort & Eligibility Controls */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <button
                type="button"
                onClick={() => setOnlyEligible(!onlyEligible)}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-all shadow-xs ${
                  onlyEligible
                    ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-400 font-semibold"
                    : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {onlyEligible ? "✓ Eligible Only" : "All Eligibility"}
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-700 dark:text-zinc-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500 shadow-xs transition-colors"
              >
                <option value="RANK">Sort: AI Match Rank</option>
                <option value="DEADLINE">Sort: Deadline Urgency</option>
                <option value="REWARD">Sort: Highest Rewards</option>
                <option value="RECENT">Sort: Newly Listed</option>
              </select>
            </div>
          </div>

          {/* Search Bar & Filter Tag Pills */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search react, gdg, design, hackathon, ai, nodejs..."
                className="w-full bg-white dark:bg-[#0E0F14] border border-slate-200 dark:border-zinc-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 shadow-xs transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {filterTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={`text-xs font-medium px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
                    activeFilter === tag
                      ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/25"
                      : "bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 shadow-xs"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Gemini AI Top Match Banner */}
          {topMatchEvent && (
            <div className="rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white dark:from-blue-950/20 dark:via-[#0F1015] dark:to-[#0F1015] border border-blue-200 dark:border-blue-500/30 p-5 sm:p-6 relative overflow-hidden shadow-sm dark:shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-[11px] font-mono font-bold text-blue-700 dark:text-blue-400">
                      <Sparkles className="w-3 h-3 text-blue-500" />
                      <span>Gemini AI Recommended</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 shadow-xs">
                      {topMatchEvent.eligibility.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    {topMatchEvent.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {topMatchEvent.matchReason ||
                      "Matches your verified student GitHub repositories, backend stack, and local proximity."}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenSkillGapModal(topMatchEvent)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-700 dark:text-white text-xs font-semibold transition-colors shadow-xs"
                  >
                    Skill Gap
                  </button>
                  <button
                    onClick={() => onSelectEvent(topMatchEvent)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/25 transition-all flex items-center gap-1.5"
                  >
                    <span>View Match ({topMatchEvent.rankingScore}%)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Commudle-Style Horizontal Event Cards List */}
          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0E0F14] p-12 text-center space-y-3 shadow-xs">
                <p className="text-slate-500 dark:text-zinc-400 text-xs">
                  No opportunities found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setActiveFilter("All");
                    setSearchQuery("");
                    setOnlyEligible(false);
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              filteredEvents.map((event) => {
                const registered = isUserRegistered(event.id);
                const platformMeta = getPlatformMeta(event.sourcePlatform);

                return (
                  <div
                    key={event.id}
                    className="group rounded-2xl bg-white dark:bg-[#0E0F14] border border-slate-200 dark:border-zinc-850 hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-md dark:hover:bg-[#12131A] transition-all p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-stretch shadow-xs"
                  >
                    {/* Left: Banner Poster Graphic */}
                    <div
                      onClick={() => onSelectEvent(event)}
                      className="sm:w-56 md:w-64 shrink-0 rounded-xl overflow-hidden relative border border-slate-200 dark:border-zinc-850 cursor-pointer flex flex-col justify-between p-3.5 min-h-[140px] bg-gradient-to-br from-slate-100 via-blue-50/50 to-indigo-50/40 dark:from-[#121829] dark:via-[#0D1017] dark:to-[#151026] group-hover:border-slate-300 dark:group-hover:border-zinc-700 transition-colors shadow-inner"
                    >
                      {/* Top banner tag */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 tracking-wider uppercase font-semibold">
                          {event.hostName.split(" ")[0]}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/80 dark:bg-black/60 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 font-semibold">
                          {event.type}
                        </span>
                      </div>

                      {/* Poster Core Typographic Graphic */}
                      <div className="py-2 text-center">
                        <div className="text-sm font-extrabold uppercase tracking-tight text-slate-900 dark:text-white leading-tight font-mono group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {event.title.split("-")[0].replace("Hackathon", "").trim()}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 dark:text-zinc-500 mt-1">
                          {event.rewardOrStipend || "Prize Pool Available"}
                        </div>
                      </div>

                      {/* Poster Bottom Strip */}
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-600 dark:text-zinc-400 border-t border-slate-200/80 dark:border-white/10 pt-1.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-blue-500" />
                          <span>{event.isRemote ? "Remote" : event.city}</span>
                        </span>
                        <span className="text-slate-500 dark:text-zinc-500">
                          {platformMeta.name}
                        </span>
                      </div>
                    </div>

                    {/* Right: Event Information & Actions */}
                    <div className="flex-1 flex flex-col justify-between space-y-3 min-w-0">
                      <div className="space-y-1.5">
                        {/* Top Meta: Host row + Attendee Counter Pill + Match Badge */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-xs shrink-0 shadow-xs">
                              {event.hostAvatar || "🏢"}
                            </div>
                            <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 truncate">
                              {event.hostName}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Attendee Count Pill */}
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[10px] font-mono text-slate-700 dark:text-zinc-300 shadow-xs">
                              <Users className="w-3 h-3 text-slate-500 dark:text-zinc-400" />
                              <span>{event.registeredCount || 91}</span>
                            </span>

                            {/* Match Score */}
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 text-[10px] font-mono font-bold shadow-xs">
                              {event.rankingScore}% Match
                            </span>
                          </div>
                        </div>

                        {/* Event Title */}
                        <h3
                          onClick={() => onSelectEvent(event)}
                          className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer tracking-tight"
                        >
                          {event.title}
                        </h3>

                        {/* Date & Time format */}
                        <div className="text-xs text-slate-500 dark:text-zinc-400 font-mono flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 shrink-0" />
                          <span>{formatCommudleDate(event.deadline)}</span>
                        </div>

                        {/* Skill Tag Pills */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {event.requiredSkills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                              {skill.toLowerCase()}
                            </span>
                          ))}
                          {event.requiredSkills.length > 4 && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 text-slate-400 dark:text-zinc-500">
                              +{event.requiredSkills.length - 4}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom Info & CTAs */}
                      <div className="pt-2 border-t border-slate-100 dark:border-zinc-850/80 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white text-xs block">
                            {event.rewardOrStipend}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono">
                            {event.city} • {event.eligibilityRule === "OPEN_TO_ALL" ? "Open to All" : "Students Only"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenSkillGapModal(event)}
                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white text-[11px] font-semibold transition-colors shadow-xs"
                          >
                            Skill Gap
                          </button>

                          <button
                            type="button"
                            onClick={() => onSelectEvent(event)}
                            className={`px-3.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all shadow-xs ${
                              registered
                                ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                                : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/25"
                            }`}
                          >
                            {registered ? "✓ Registered" : "View & Register"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR (4 COLS) ================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. Featured Communities Widget */}
          <div className="rounded-2xl bg-white dark:bg-[#0E0F14] border border-slate-200 dark:border-zinc-800 p-5 space-y-4 shadow-sm dark:shadow-xl">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                Featured Communities
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Join the most active developer groups
              </p>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-zinc-850/80 space-y-3 pt-1">
              {featuredCommunities.map((comm) => {
                const isJoined = joinedCommunityIds.includes(comm.id);
                return (
                  <div
                    key={comm.id}
                    className="flex items-center justify-between gap-3 pt-3 first:pt-0"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden shadow-xs">
                        {comm.logo}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {comm.name}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                          {comm.tagline}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleJoinCommunity(comm.id)}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 shadow-xs ${
                        isJoined
                          ? "border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                          : "border border-blue-200 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-600/10 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-600/20"
                      }`}
                    >
                      {isJoined ? "Joined ▾" : "+ Join"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Upcoming Hackathons Fast Card */}
          <div className="rounded-2xl bg-white dark:bg-[#0E0F14] border border-slate-200 dark:border-zinc-800 p-5 space-y-4 shadow-sm dark:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  Upcoming Hackathons
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                  National sprints & rewards
                </p>
              </div>
              <Trophy className="w-4 h-4 text-blue-500" />
            </div>

            <div className="space-y-3">
              {events
                .filter((e) => e.type === "HACKATHON")
                .slice(0, 3)
                .map((h) => (
                  <div
                    key={h.id}
                    onClick={() => onSelectEvent(h)}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-850 hover:border-slate-300 dark:hover:border-zinc-700 cursor-pointer space-y-1.5 transition-colors group shadow-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-zinc-400">
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{h.rewardOrStipend}</span>
                      <span>{h.registeredCount || 3450}+ builders</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {h.title}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* 3. Host Workspace Promo Callout */}
          <div className="rounded-2xl bg-gradient-to-br from-purple-50 via-white to-purple-50/50 dark:from-purple-950/30 dark:via-[#0E0F14] dark:to-[#0E0F14] border border-purple-200 dark:border-purple-500/30 p-5 space-y-3 shadow-sm dark:shadow-xl">
            <div className="text-xs font-mono font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
              Are you an Organizer?
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Host Your Next Tech Event on TalentOrbit
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
              Create hackathons with Gemini AI, collect candidate GitHub rosters, and manage squad approvals in a dedicated portal.
            </p>
            <a
              href="/host/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline"
            >
              <span>Open Host Workspace →</span>
            </a>
          </div>
        </div>
      </div>

      {/* Floating Bottom-Right Community Chat Bubble */}
      <button
        type="button"
        onClick={() => alert("TalentOrbit Community & Mentor Chat: Live support available 24/7.")}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black shadow-xl hover:shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
        title="Community & Mentor Live Chat"
      >
        <MessageSquare className="w-5 h-5 text-white dark:text-black" />
      </button>
    </div>
  );
}

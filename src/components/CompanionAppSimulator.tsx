"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { HackerPassQR } from "./HackerPassQR";
import {
  Smartphone,
  Wifi,
  Battery,
  Send,
  MessageSquare,
  Award,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  QrCode,
  RefreshCw,
  Terminal,
  ChevronRight,
  Radio,
  FileCheck,
  UserCheck,
  HelpCircle,
  Hash,
  Sparkles,
  Layers,
  ArrowRight,
  AlertCircle,
  Copy,
  Check,
  Cpu,
  GraduationCap,
  Users,
  Lock,
  Unlock,
  Printer,
  Download,
} from "lucide-react";
import {
  BottomBarRouteItem,
  CompanionNavResponse,
  EventTask,
  TaskSubmission,
  ChatChannel,
  ChatMessage,
  CompetitionStanding,
} from "@/types";

export function CompanionAppSimulator() {
  const {
    user: storeUser,
    registrations,
    updateRegistrationStatus,
    tasks: storeTasks,
    taskSubmissions,
    submitTask: storeSubmitTask,
  } = useStore();

  // App Mode & Context
  const [selectedRole, setSelectedRole] = useState<"STUDENT" | "HOST">("STUDENT");
  const [selectedEventId, setSelectedEventId] = useState<string>("evt_omnichain_agentic_2025");
  const [currentTab, setCurrentTab] = useState<string>("checkin");
  const [studentTaskFilter, setStudentTaskFilter] = useState<"ALL" | "TODO" | "SUBMITTED" | "COMPLETED">("ALL");

  // Telemetry & State
  const [navData, setNavData] = useState<CompanionNavResponse | null>(null);
  const [tasks, setTasks] = useState<EventTask[]>([]);
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string>("chn_omni_bytebandits");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [standings, setStandings] = useState<CompetitionStanding[]>([]);

  // Form states
  const [newMessageText, setNewMessageText] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [submittingTask, setSubmittingTask] = useState(false);
  const [nfcCheckinStatus, setNfcCheckinStatus] = useState<any>(null);
  const [isNfcScanning, setIsNfcScanning] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [taskSubmittedToast, setTaskSubmittedToast] = useState(false);

  // Inspector & API Logs
  const [apiLogs, setApiLogs] = useState<
    Array<{ id: string; time: string; method: string; endpoint: string; status: number; payload?: any }>
  >([]);

  const addApiLog = (method: string, endpoint: string, status: number, payload?: any) => {
    setApiLogs((prev) => [
      {
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        time: new Date().toLocaleTimeString(),
        method,
        endpoint,
        status,
        payload,
      },
      ...prev.slice(0, 19),
    ]);
  };

  const currentUserId = selectedRole === "STUDENT" ? "usr_arjun_sharma" : "usr_host_sarah";

  // Participant Registration Lookup for Dynamic QR Ticket Generation
  const currentReg =
    registrations.find(
      (r) =>
        (r.userId === "usr_arjun_sharma" || r.userId === currentUserId) &&
        r.eventId === selectedEventId
    ) ||
    registrations.find((r) => r.userId === "usr_arjun_sharma") ||
    registrations[0];

  const isHostApproved = currentReg?.status === "APPROVED";

  // 1. Fetch Dynamic Bottom Bar Navigation
  const fetchNavigation = async () => {
    try {
      const res = await fetch(
        `/api/companion/navigation?userId=${currentUserId}&eventId=${selectedEventId}&role=${selectedRole}`
      );
      const json = await res.json();
      addApiLog("GET", `/api/companion/navigation?role=${selectedRole}`, res.status, json.data);
      if (json.success && json.data) {
        setNavData(json.data);
        if (json.data.routes?.length > 0 && !json.data.routes.some((r: any) => r.id === currentTab)) {
          setCurrentTab(json.data.routes[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 2. Fetch Tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch(`/api/events/${selectedEventId}/tasks`);
      const json = await res.json();
      addApiLog("GET", `/api/events/${selectedEventId}/tasks`, res.status, json);
      if (json.success && json.tasks) {
        setTasks(json.tasks);
        if (json.tasks.length > 0 && !selectedTaskId) {
          setSelectedTaskId(json.tasks[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 3. Fetch Channels
  const fetchChannels = async () => {
    try {
      const res = await fetch(`/api/events/${selectedEventId}/channels?userId=${currentUserId}`);
      const json = await res.json();
      addApiLog("GET", `/api/events/${selectedEventId}/channels`, res.status, json);
      if (json.success && json.channels) {
        setChannels(json.channels);
        if (json.channels.length > 0 && !channels.some((c) => c.id === activeChannelId)) {
          setActiveChannelId(json.channels[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 4. Fetch Messages for active channel
  const fetchMessages = async (channelId: string) => {
    if (!channelId) return;
    try {
      const res = await fetch(`/api/channels/${channelId}/messages`);
      const json = await res.json();
      addApiLog("GET", `/api/channels/${channelId}/messages`, res.status, json);
      if (json.success && json.messages) {
        setMessages(json.messages);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Initial Data Load & on role switch
  useEffect(() => {
    fetchNavigation();
    fetchTasks();
    fetchChannels();
  }, [selectedRole, selectedEventId]);

  // Load messages whenever activeChannelId changes
  useEffect(() => {
    if (activeChannelId) {
      fetchMessages(activeChannelId);
    }
  }, [activeChannelId]);

  // Handle Send Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeChannelId) return;

    try {
      const payload = {
        senderId: currentUserId,
        senderRole: selectedRole,
        text: newMessageText.trim(),
      };
      const res = await fetch(`/api/channels/${activeChannelId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      addApiLog("POST", `/api/channels/${activeChannelId}/messages`, res.status, json);
      if (json.success && json.chatMessage) {
        setMessages((prev) => [...prev, json.chatMessage]);
        setNewMessageText("");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle NFC Hardware Check-in Simulation
  const handleSimulateNfcTap = async () => {
    setIsNfcScanning(true);
    try {
      const payload = {
        userId: currentUserId,
        eventId: selectedEventId,
        deviceId: "android-pixel9-pro-kiosk-tap",
        nfcToken: "NFC_ISO14443_TYPE_A_PASS_7740",
        biometricVerified: true,
      };
      const res = await fetch(`/api/companion/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      addApiLog("POST", `/api/companion/checkin`, res.status, json);
      if (json.success) {
        setNfcCheckinStatus(json.data);
        fetchNavigation(); // Refresh navigation badge status
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsNfcScanning(false);
    }
  };

  // Handle Milestone Submission
  const handleSubmitDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId || !submissionUrl) return;

    setSubmittingTask(true);
    try {
      // 1. Sync store state for immediate reactivity across the app
      storeSubmitTask(selectedTaskId, submissionUrl, submissionNotes);

      // 2. Transmit to REST API backend
      const payload = {
        userId: currentUserId,
        submissionUrl,
        notes: submissionNotes,
      };
      const res = await fetch(`/api/tasks/${selectedTaskId}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      addApiLog("POST", `/api/tasks/${selectedTaskId}/submissions`, res.status, json);

      setTaskSubmittedToast(true);
      setTimeout(() => setTaskSubmittedToast(false), 3500);
      setSubmissionUrl("");
      setSubmissionNotes("");
      fetchTasks();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingTask(false);
    }
  };

  // Copy token helper
  const handleCopyToken = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 p-5 shadow-sm dark:shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-colors">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 shadow-xs">
              <Smartphone className="w-3.5 h-3.5" />
              Android Companion Mobile Client Simulator
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 font-semibold">
              ● Live REST Sync
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Companion App Virtual Device & REST Pipeline
          </h1>
          <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Simulates dynamic bottom-bar routing, NFC gate check-in, real-time squad chat, and milestone deliverable submission directly connected to the Next.js API endpoints.
          </p>
        </div>

        {/* Simulator Role & Event Switchers */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-1 shadow-inner">
            <button
              onClick={() => setSelectedRole("STUDENT")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === "STUDENT"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Student (Arjun)
            </button>
            <button
              onClick={() => setSelectedRole("HOST")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === "HOST"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/25"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Host / Staff (Sarah)
            </button>
          </div>

          <button
            onClick={() => {
              fetchNavigation();
              fetchTasks();
              fetchChannels();
            }}
            title="Refresh All Companion Endpoints"
            className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-850 transition-colors shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Android Frame (Left) + REST API Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Realistic Android Companion Phone Frame (5 Cols) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[370px] h-[720px] rounded-[48px] bg-[#0A0A0E] border-[10px] border-zinc-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(37,99,235,0.15)] flex flex-col overflow-hidden ring-1 ring-zinc-700">
            {/* Top Speaker / Camera Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-36 bg-zinc-900 rounded-b-2xl z-30 flex items-center justify-center">
              <div className="w-10 h-1 bg-zinc-800 rounded-full" />
              <div className="w-2.5 h-2.5 bg-black rounded-full ml-3 border border-zinc-800" />
            </div>

            {/* Android Status Bar */}
            <div className="h-10 px-6 pt-2 flex items-center justify-between text-[11px] font-mono text-zinc-400 shrink-0 select-none z-20">
              <span>09:41</span>
              <div className="flex items-center gap-2">
                <Wifi className="w-3.5 h-3.5" />
                <span className="text-[10px]">5G</span>
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* App Header */}
            <div className="px-4 py-2 border-b border-zinc-850/80 bg-zinc-950/70 backdrop-blur-md shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Smartphone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white tracking-tight leading-none">
                    TalentOrbit Mobile
                  </div>
                  <div className="text-[9px] text-zinc-500 font-mono mt-0.5 truncate max-w-[170px]">
                    {navData?.eventTitle || "Hackathon Portal"}
                  </div>
                </div>
              </div>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                selectedRole === "HOST"
                  ? "bg-purple-950/60 text-purple-300 border border-purple-800/40"
                  : "bg-blue-950/60 text-blue-300 border border-blue-800/40"
              }`}>
                {selectedRole}
              </span>
            </div>

            {/* Scrollable Android Screen Content Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gradient-to-b from-[#0A0A0E] via-zinc-950 to-[#0A0A0E]">
              {/* TAB 1: DYNAMIC QR TICKET & NFC BADGE */}
              {(currentTab === "checkin" || currentTab === "scanner") && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* If HOST Role */}
                  {selectedRole === "HOST" ? (
                    <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center space-y-3">
                      <div className="relative w-16 h-16 mx-auto rounded-2xl bg-purple-950/40 border border-purple-800/60 flex items-center justify-center text-purple-400 shadow-lg">
                        <QrCode className="w-8 h-8" />
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black" />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-white">Kiosk NFC Access Scanner</h3>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Scan attendee QR tickets and hardware wristbands at entry turnstiles.
                        </p>
                      </div>

                      <button
                        onClick={handleSimulateNfcTap}
                        disabled={isNfcScanning}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                      >
                        {isNfcScanning ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Contacting Turnstile Antenna...</span>
                          </>
                        ) : (
                          <>
                            <Radio className="w-3.5 h-3.5 animate-pulse" />
                            <span>Scan Pass (Kiosk Turnstile A-2)</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : isHostApproved ? (
                    /* STUDENT: HOST APPROVED -> OFFICIAL DIGITAL QR TICKET */
                    <div className="rounded-2xl bg-[#0F1016] border border-blue-500/40 shadow-xl overflow-hidden space-y-3 p-4">
                      {/* Top Holographic Strip */}
                      <div className="-mx-4 -mt-4 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400" />

                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>HOST APPROVED • PASS GRANTED</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40 font-bold">
                          OFFICIAL TICKET
                        </span>
                      </div>

                      <div>
                        <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                          OmniChain Hackathon 2025
                        </div>
                        <div className="text-sm font-extrabold text-white">
                          Arjun Sharma • ByteBandits
                        </div>
                      </div>

                      {/* Crisp Scannable Vector QR Code */}
                      <div className="flex flex-col items-center justify-center py-2 bg-black/60 rounded-xl border border-zinc-800/80">
                        <HackerPassQR value="TKT-ORBIT-2025-ARJUN-884" size={130} />
                        <div className="mt-2 text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
                          <QrCode className="w-3 h-3 text-blue-400" />
                          <span className="font-bold text-zinc-200">TKT-ORBIT-2025-ARJUN-884</span>
                          <button
                            onClick={() => handleCopyToken("TKT-ORBIT-2025-ARJUN-884")}
                            className="p-1 hover:text-white"
                          >
                            {copiedToken ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>

                      {/* Desk & Gate Allocation Box */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                        <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800">
                          <div className="text-zinc-500 uppercase">Assigned Table</div>
                          <div className="font-bold text-emerald-400">Table #B-19</div>
                          <div className="text-zinc-400">Zone Alpha</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800">
                          <div className="text-zinc-500 uppercase">Security Gate</div>
                          <div className="font-bold text-blue-400">Turnstile A-2</div>
                          <div className="text-zinc-400">Hall 3 Access</div>
                        </div>
                      </div>

                      {/* NFC Gate Tap Simulation */}
                      <button
                        onClick={handleSimulateNfcTap}
                        disabled={isNfcScanning}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                      >
                        {isNfcScanning ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Pairing NFC Sensor...</span>
                          </>
                        ) : (
                          <>
                            <Radio className="w-3.5 h-3.5 animate-pulse" />
                            <span>Simulate NFC Tap (Turnstile A-2)</span>
                          </>
                        )}
                      </button>

                      {/* Host Demo Action: Revoke/Reset to Pending for Testing */}
                      <div className="pt-1 text-center">
                        <button
                          type="button"
                          onClick={() => currentReg && updateRegistrationStatus(currentReg.id, "PENDING")}
                          className="text-[9px] font-mono text-zinc-500 hover:text-amber-400 transition-colors underline"
                        >
                          [Test Simulator: Lock Ticket (Set to Pending Review)]
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* STUDENT: HOST APPROVAL PENDING -> LOCKED QR TICKET */
                    <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-600/40 text-center space-y-3">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-900/30 border border-amber-600/50 flex items-center justify-center text-amber-400 shadow-md">
                        <Lock className="w-7 h-7 text-amber-400" />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-900/50 text-amber-300 border border-amber-700/50 font-bold uppercase">
                          Host Review In Progress
                        </span>
                        <h3 className="text-sm font-bold text-white pt-1">
                          QR Ticket & Pass Locked
                        </h3>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Host <strong className="text-amber-300">Sarah Chen</strong> is evaluating your squad registration and GitHub commits. Your official scannable QR Ticket and table assignment will be generated immediately once approved.
                        </p>
                      </div>

                      {/* 1-Click Interactive Host Approval Simulation */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => currentReg && updateRegistrationStatus(currentReg.id, "APPROVED")}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Host Action: Approve Arjun Sharma Now</span>
                        </button>
                        <span className="text-[9px] font-mono text-zinc-500 block mt-1">
                          Click to simulate host Sarah approving your registration packet
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Active Hardware Pass Token (if tapped) */}
                  {nfcCheckinStatus && (
                    <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/50 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-emerald-400 font-mono font-bold text-[10px]">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          HARDWARE PASS ISSUED
                        </span>
                        <span>LIVE</span>
                      </div>
                      <div className="p-2 rounded-lg bg-black/80 font-mono text-[10px] text-zinc-300 flex items-center justify-between break-all">
                        <span>{nfcCheckinStatus.hardwarePassToken}</span>
                        <button
                          onClick={() => handleCopyToken(nfcCheckinStatus.hardwarePassToken)}
                          className="p-1 hover:text-white"
                        >
                          {copiedToken ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400">
                        <div>
                          Gate: <span className="text-white">Turnstile A-2</span>
                        </div>
                        <div>
                          Biometrics: <span className="text-emerald-400">Matched</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Registered Squad Card */}
                  <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-850 space-y-2">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">Registered Squad</div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-white">ByteBandits (4 Members)</div>
                      <span className="text-[10px] font-mono text-blue-400">Rank #3</span>
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      Lead: Arjun Sharma • IIIT Bengaluru
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: STUDENT MILESTONE TASKS TO BE DONE */}
              {(currentTab === "tasks" || currentTab === "task_mgmt") && (() => {
                // Determine user's submissions
                const mySubs = taskSubmissions.filter(
                  (s) =>
                    s.userId === currentUserId ||
                    s.teamName?.includes("ByteBandits") ||
                    s.leadName?.includes("Arjun")
                );

                const getTaskStatus = (taskId: string) => {
                  const sub = mySubs.find((s) => s.taskId === taskId);
                  if (!sub) return "TODO";
                  if (sub.status === "COMPLETED" || sub.status === "VERIFIED") return "COMPLETED";
                  return "SUBMITTED";
                };

                const allEventTasks = tasks.length > 0 ? tasks : storeTasks;

                const filteredTasks = allEventTasks.filter((t) => {
                  const status = getTaskStatus(t.id);
                  if (studentTaskFilter === "TODO") return status === "TODO";
                  if (studentTaskFilter === "SUBMITTED") return status === "SUBMITTED";
                  if (studentTaskFilter === "COMPLETED") return status === "COMPLETED";
                  return true;
                });

                const todoCount = allEventTasks.filter((t) => getTaskStatus(t.id) === "TODO").length;
                const submittedCount = allEventTasks.filter((t) => getTaskStatus(t.id) === "SUBMITTED").length;
                const completedCount = allEventTasks.filter((t) => getTaskStatus(t.id) === "COMPLETED").length;
                const totalXP = allEventTasks.reduce((acc, t) => acc + (t.points || 150), 0);
                const earnedXP = mySubs
                  .filter((s) => s.status === "COMPLETED" || s.status === "VERIFIED")
                  .reduce((acc, s) => acc + (s.score || 0), 0);

                return (
                  <div className="space-y-3.5 animate-in fade-in duration-200">
                    {/* Header with Progress bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <FileCheck className="w-3.5 h-3.5 text-blue-400" />
                          <span>Assigned Milestone Tasks</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">
                          {earnedXP} / {totalXP} XP Earned
                        </span>
                      </div>

                      {/* Mini Progress Track */}
                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full transition-all"
                          style={{
                            width: `${Math.round((completedCount / Math.max(1, allEventTasks.length)) * 100)}%`,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500">
                        <span>{completedCount} of {allEventTasks.length} Completed</span>
                        <span>{todoCount} to be done</span>
                      </div>
                    </div>

                    {/* Filter Pills for Tasks to be done */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar text-[10px] font-mono">
                      {[
                        { id: "ALL", label: `All (${allEventTasks.length})` },
                        { id: "TODO", label: `To Do (${todoCount})` },
                        { id: "SUBMITTED", label: `Submitted (${submittedCount})` },
                        { id: "COMPLETED", label: `Completed (${completedCount})` },
                      ].map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setStudentTaskFilter(f.id as any)}
                          className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                            studentTaskFilter === f.id
                              ? "bg-blue-600 text-white font-bold shadow-xs"
                              : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>

                    {/* Success Toast */}
                    {taskSubmittedToast && (
                      <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 text-[11px] font-mono flex items-center gap-1.5 animate-in fade-in">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Deliverable submitted to Host Evaluation Queue!</span>
                      </div>
                    )}

                    {/* Tasks List */}
                    <div className="space-y-2.5">
                      {filteredTasks.length === 0 ? (
                        <div className="p-6 text-center text-zinc-500 text-xs font-mono rounded-xl bg-zinc-900/30 border border-zinc-800/60">
                          No tasks match the "{studentTaskFilter}" filter.
                        </div>
                      ) : (
                        filteredTasks.map((task) => {
                          const status = getTaskStatus(task.id);
                          const sub = mySubs.find((s) => s.taskId === task.id);
                          const isSelected = selectedTaskId === task.id;

                          return (
                            <div
                              key={task.id}
                              onClick={() => setSelectedTaskId(task.id)}
                              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-blue-950/30 border-blue-600/70 shadow-sm"
                                  : "bg-zinc-900/50 border-zinc-850 hover:border-zinc-800"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-0.5">
                                  <div className="text-xs font-semibold text-white">
                                    {task.title}
                                  </div>
                                  <div className="text-[10px] text-zinc-400 line-clamp-2">
                                    {task.description}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                  <span className="text-[9px] font-mono font-bold text-blue-400">
                                    +{task.points || 150} pts
                                  </span>
                                  {task.isRequired && (
                                    <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-red-950/50 text-red-400 border border-red-800/40">
                                      Required
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Rubric Criteria Snippet */}
                              {task.rubricCriteria && task.rubricCriteria.length > 0 && (
                                <div className="mt-2 pt-1.5 border-t border-zinc-850/60 space-y-0.5">
                                  <div className="text-[8px] font-mono text-zinc-500 uppercase">Rubric Criteria:</div>
                                  {task.rubricCriteria.slice(0, 2).map((r, i) => (
                                    <div key={i} className="flex items-center gap-1 text-[9px] text-zinc-400">
                                      <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                                      <span className="truncate">{r}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Status Footer */}
                              <div className="mt-2.5 pt-2 border-t border-zinc-850/60 flex items-center justify-between text-[10px] font-mono">
                                {status === "COMPLETED" ? (
                                  <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>Verified ({sub?.score || task.points || 150} pts)</span>
                                  </span>
                                ) : status === "SUBMITTED" ? (
                                  <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
                                    <Clock className="w-3 h-3 text-amber-400" />
                                    <span>Awaiting Host Review</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-blue-400 font-bold">
                                    <ArrowRight className="w-3 h-3" />
                                    <span>To Do • Tap to Submit</span>
                                  </span>
                                )}

                                <span className="text-zinc-500 text-[9px]">Due in 24h</span>
                              </div>

                              {/* Host Feedback if completed */}
                              {status === "COMPLETED" && sub?.feedback && (
                                <div className="mt-2 p-2 rounded-lg bg-emerald-950/30 border border-emerald-900/40 text-[9px] text-emerald-300 font-mono">
                                  Host Feedback: "{sub.feedback}"
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Submit Deliverable Form (For Student) */}
                    {selectedRole === "STUDENT" && selectedTaskId && (
                      <form
                        onSubmit={handleSubmitDeliverable}
                        className="p-3.5 rounded-xl bg-zinc-900/90 border border-blue-500/40 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5 text-blue-400" />
                            <span>Submit Solution Deliverable</span>
                          </div>
                          <span className="text-[9px] font-mono text-zinc-400 truncate max-w-[140px]">
                            {allEventTasks.find((t) => t.id === selectedTaskId)?.title}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-zinc-400">
                            Artifact Link (GitHub repo, APK URL, Figma)
                          </label>
                          <input
                            type="url"
                            required
                            value={submissionUrl}
                            onChange={(e) => setSubmissionUrl(e.target.value)}
                            placeholder="https://github.com/bytebandits/omnichain-agent"
                            className="w-full bg-black border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-zinc-400">
                            Execution Notes (Architecture, Docker commands)
                          </label>
                          <textarea
                            rows={2}
                            value={submissionNotes}
                            onChange={(e) => setSubmissionNotes(e.target.value)}
                            placeholder="Implemented multi-agent state graph with zero-copy IPC queues..."
                            className="w-full bg-black border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submittingTask}
                          className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                        >
                          {submittingTask ? "Transmitting..." : "Submit to Host Evaluation Board"}
                        </button>
                      </form>
                    )}
                  </div>
                );
              })()}

              {/* TAB 3 & 4: CHANNELS & TEAM CHAT / HOST DESK */}
              {(currentTab === "team_chat" ||
                currentTab === "organizer_desk" ||
                currentTab === "broadcast" ||
                currentTab === "host_dms") && (() => {
                const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];

                return (
                  <div className="flex flex-col h-[520px] space-y-3 animate-in fade-in duration-200">
                    {/* Channel Switcher Pills with Icons */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 no-scrollbar">
                      {channels.map((ch) => {
                        const isActive = activeChannelId === ch.id;
                        const ChannelIcon =
                          ch.type === "TRACK_ROOM"
                            ? Cpu
                            : ch.type === "MENTOR_DESK"
                            ? GraduationCap
                            : ch.type === "ANNOUNCEMENT"
                            ? Radio
                            : ch.isHostDM
                            ? UserCheck
                            : MessageSquare;

                        return (
                          <button
                            key={ch.id}
                            onClick={() => setActiveChannelId(ch.id)}
                            className={`px-3 py-1 rounded-full text-[10px] font-mono whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                              isActive
                                ? "bg-blue-600 text-white font-bold shadow-xs"
                                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                            }`}
                          >
                            <ChannelIcon className="w-3 h-3" />
                            <span>
                              {ch.isHostDM
                                ? "Desk: Sarah"
                                : ch.type === "TRACK_ROOM"
                                ? "AI Swarms"
                                : ch.type === "MENTOR_DESK"
                                ? "Mentors Desk"
                                : ch.type === "ANNOUNCEMENT"
                                ? "Broadcast"
                                : ch.teamName || (ch.title.length > 14 ? ch.title.substring(0, 12) + "..." : ch.title)}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Channel Mini Header Inside Phone */}
                    <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-2 shrink-0">
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-white truncate">
                          {activeChannel?.title || "Channel"}
                        </div>
                        <div className="text-[9px] font-mono text-zinc-400 truncate">
                          {activeChannel?.description || "Interactive hackathon channel"}
                        </div>
                      </div>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 font-semibold shrink-0 flex items-center gap-1">
                        <Users className="w-2.5 h-2.5" />
                        <span>{activeChannel?.members?.length || activeChannel?.memberCount || 2}</span>
                      </span>
                    </div>

                    {/* Active Message History */}
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                      {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-zinc-500 text-xs">
                          No messages yet in this channel.
                        </div>
                      ) : (
                        messages.map((msg) => {
                          const isMe = msg.senderId === currentUserId;
                          const isHostSender = msg.senderRole === "HOST";
                          const isMentor = msg.senderRole === "MENTOR";
                          const avatarPhoto =
                            msg.senderAvatarUrl ||
                            (isHostSender
                              ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                              : isMentor
                              ? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
                              : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80");

                          return (
                            <div
                              key={msg.id}
                              className={`flex items-start gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                            >
                              <img
                                src={avatarPhoto}
                                alt={msg.senderName}
                                className="w-6 h-6 rounded-full object-cover ring-1 ring-zinc-700 shrink-0 mt-0.5"
                              />

                              <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[82%]`}>
                                <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 mb-0.5">
                                  <span>{msg.senderName}</span>
                                  {isHostSender && (
                                    <span className="px-1 rounded bg-purple-950/60 text-purple-400 border border-purple-800/40">
                                      HOST
                                    </span>
                                  )}
                                  {isMentor && (
                                    <span className="px-1 rounded bg-teal-950/60 text-teal-400 border border-teal-800/40">
                                      MENTOR
                                    </span>
                                  )}
                                </div>
                                <div
                                  className={`rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                                    isMe
                                      ? "bg-blue-600 text-white rounded-tr-none shadow-xs"
                                      : isHostSender
                                      ? "bg-purple-950/40 border border-purple-800/50 text-purple-200 rounded-tl-none"
                                      : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none"
                                  }`}
                                >
                                  {msg.text}
                                </div>
                                <span className="text-[8px] font-mono text-zinc-600 mt-0.5">
                                  {new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Send Message Input */}
                    <form onSubmit={handleSendMessage} className="pt-2 shrink-0 flex items-center gap-2">
                      <input
                        type="text"
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                        placeholder={`Message ${activeChannel?.title?.split(" ")[0] || "channel"}...`}
                        className="flex-1 bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={!newMessageText.trim()}
                        className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-md cursor-pointer shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                );
              })()}

              {/* TAB 5: LEADERBOARD / TELEMETRY */}
              {(currentTab === "standings" || currentTab === "telemetry") && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>Live Squad Standings</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">Live Scoring</span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { rank: 1, name: "NeuralCraft", score: 960, verified: true },
                      { rank: 2, name: "CipherSquad", score: 920, verified: true },
                      { rank: 3, name: "ByteBandits (Your Squad)", score: 890, verified: true },
                      { rank: 4, name: "DevDynamix", score: 710, verified: false },
                    ].map((item) => (
                      <div
                        key={item.rank}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                          item.name.includes("Your Squad")
                            ? "bg-blue-950/30 border-blue-600/60"
                            : "bg-zinc-900/50 border-zinc-850"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
                            item.rank === 1
                              ? "bg-amber-400 text-black"
                              : item.rank === 2
                              ? "bg-zinc-300 text-black"
                              : item.rank === 3
                              ? "bg-amber-700 text-white"
                              : "bg-zinc-800 text-zinc-400"
                          }`}>
                            {item.rank}
                          </span>
                          <div>
                            <div className="font-semibold text-white">{item.name}</div>
                            <div className="text-[10px] font-mono text-zinc-500">
                              {item.verified ? "NFC Verified" : "Pending Checkin"}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-mono font-bold text-blue-400">{item.score} pts</div>
                          <div className="text-[9px] font-mono text-emerald-400">Qualified</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Android Bottom Navigation Bar */}
            <div className="h-16 px-2 border-t border-zinc-850 bg-black/90 backdrop-blur-md flex items-center justify-around shrink-0 z-20">
              {navData?.routes.map((route) => {
                const isActive = currentTab === route.id;
                return (
                  <button
                    key={route.id}
                    onClick={() => setCurrentTab(route.id)}
                    className={`relative flex flex-col items-center justify-center w-14 py-1 transition-all ${
                      isActive ? "text-blue-400" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {/* Badge indicator */}
                    {route.badge && (
                      <span className="absolute -top-1 right-2 px-1 py-0.2 rounded-full bg-blue-600 text-[8px] font-mono font-bold text-white">
                        {route.badge.slice(0, 3)}
                      </span>
                    )}

                    {/* Icon mapping */}
                    {route.id === "checkin" || route.id === "scanner" ? (
                      <QrCode className="w-4 h-4" />
                    ) : route.id === "tasks" || route.id === "task_mgmt" ? (
                      <FileCheck className="w-4 h-4" />
                    ) : route.id === "team_chat" || route.id === "broadcast" ? (
                      <MessageSquare className="w-4 h-4" />
                    ) : route.id === "organizer_desk" || route.id === "host_dms" ? (
                      <UserCheck className="w-4 h-4" />
                    ) : (
                      <Award className="w-4 h-4" />
                    )}

                    <span className="text-[9px] font-medium tracking-tight mt-1 truncate max-w-[56px]">
                      {route.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Android Home Bar Indicator */}
            <div className="h-4 bg-black flex items-center justify-center shrink-0">
              <div className="w-28 h-1 bg-zinc-700 rounded-full" />
            </div>
          </div>
        </div>

        {/* Right Column: Native Android Integration Guide & Live REST Telemetry (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Kotlin / Jetpack Compose Integration Card */}
          <div className="rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 p-5 space-y-4 shadow-sm dark:shadow-xl transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold shadow-xs">
                  KT
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Android Native (Jetpack Compose) Integration
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                    Dynamic BottomNavigation with Retrofit & OkHttp
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-400 font-semibold shadow-xs">
                Ready for Production
              </span>
            </div>

            {/* Jetpack Compose Sample Code */}
            <div className="p-3.5 rounded-xl bg-slate-900 dark:bg-black border border-slate-800 dark:border-zinc-850 font-mono text-[11px] text-zinc-300 overflow-x-auto space-y-1 shadow-inner">
              <div className="text-zinc-500">// Kotlin Jetpack Compose Dynamic BottomNavigation</div>
              <div><span className="text-purple-400">val</span> navResponse = companionApi.<span className="text-blue-400">getDynamicNavigation</span>(userId, eventId)</div>
              <div><span className="text-purple-400">NavigationBar</span>(containerColor = Color(0xFF0F0F12)) &#123;</div>
              <div className="pl-4">navResponse.routes.<span className="text-blue-400">forEach</span> &#123; route -&gt;</div>
              <div className="pl-8"><span className="text-purple-400">NavigationBarItem</span>(</div>
              <div className="pl-12">selected = currentRoute == route.id,</div>
              <div className="pl-12">onClick = &#123; navController.<span className="text-blue-400">navigate</span>(route.route) &#125;,</div>
              <div className="pl-12">label = &#123; <span className="text-purple-400">Text</span>(route.label) &#125;,</div>
              <div className="pl-12">icon = &#123; <span className="text-purple-400">DynamicIcon</span>(route.icon) &#125;</div>
              <div className="pl-8">)</div>
              <div className="pl-4">&#125;</div>
              <div>&#125;</div>
            </div>
          </div>

          {/* Real-Time REST Logs Deck */}
          <div className="rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 p-5 space-y-3 shadow-sm dark:shadow-xl transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
                  Live Companion HTTP Requests & Responses
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-500 font-semibold">
                {apiLogs.length} Events captured
              </span>
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
              {apiLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 dark:text-zinc-600 font-mono text-xs">
                  No requests sent yet. Click around the virtual phone to capture traffic.
                </div>
              ) : (
                apiLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-850/80 space-y-1.5 text-xs font-mono shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            log.method === "GET"
                              ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-800/40"
                              : log.method === "POST"
                              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/40"
                              : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800/40"
                          }`}
                        >
                          {log.method}
                        </span>
                        <span className="text-slate-800 dark:text-zinc-300 truncate max-w-[280px]">
                          {log.endpoint}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold ${
                            log.status < 300 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
                          }`}
                        >
                          {log.status} OK
                        </span>
                        <span className="text-slate-400 dark:text-zinc-600 text-[10px]">{log.time}</span>
                      </div>
                    </div>

                    {log.payload && (
                      <div className="p-2 rounded bg-white dark:bg-zinc-950 border border-slate-200/60 dark:border-transparent text-[10px] text-slate-600 dark:text-zinc-400 overflow-x-auto max-h-24">
                        <pre>{JSON.stringify(log.payload, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

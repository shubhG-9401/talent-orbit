"use client";

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  QrCode,
  Download,
  Copy,
  Check,
  MapPin,
  Calendar,
  Users,
  Radio,
  Sparkles,
  Printer,
} from "lucide-react";
import { HackerPassQR } from "./HackerPassQR";

interface HackerPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  participantName?: string;
  githubUsername?: string;
  eventTitle?: string;
  teamName?: string;
  tableNumber?: string;
  ticketId?: string;
  venue?: string;
  date?: string;
}

export function HackerPassModal({
  isOpen,
  onClose,
  participantName = "Arjun Sharma",
  githubUsername = "arjun_dev",
  eventTitle = "OmniChain Autonomous Agent Hackathon 2025",
  teamName = "ByteBandits (Lead)",
  tableNumber = "Table #B-19 • Zone Alpha",
  ticketId = "TKT-ORBIT-2025-ARJUN-884",
  venue = "Bengaluru International Tech Convention Center • Hall 3",
  date = "Dec 14-16, 2025",
}: HackerPassModalProps) {
  const [copied, setCopied] = useState(false);
  const [simulatedGateStatus, setSimulatedGateStatus] = useState<"IDLE" | "SCANNED">("IDLE");

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSimulateScan = () => {
    setSimulatedGateStatus("SCANNED");
    setTimeout(() => setSimulatedGateStatus("IDLE"), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 text-white border border-slate-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(37,99,235,0.25)] overflow-hidden">
        {/* Holographic Header Bar */}
        <div className="h-2.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 via-purple-500 to-emerald-400" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors z-20 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 space-y-5">
          {/* Top Verification Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-wider text-emerald-400 uppercase">
                Official HackerPass • Host Approved
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/60 font-bold">
              VERIFIED CITIZEN
            </span>
          </div>

          {/* Event & Candidate Header */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Admission Credential // Turnstile Access
            </div>
            <h3 className="text-lg font-extrabold text-white tracking-tight leading-snug">
              {eventTitle}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-0.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>{date}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate">Bengaluru Stage</span>
              </span>
            </div>
          </div>

          {/* QR Ticket Core Container */}
          <div className="relative rounded-2xl bg-black/90 border border-slate-800 p-5 flex flex-col items-center justify-center space-y-4 shadow-inner">
            <div className="relative group">
              <HackerPassQR value={ticketId} size={160} />
              <div className="absolute inset-0 border-2 border-dashed border-blue-500/30 rounded-xl pointer-events-none" />
            </div>

            {/* Scannable Token Badge */}
            <div className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2">
                <QrCode className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-300 font-bold tracking-wider">{ticketId}</span>
              </div>
              <button
                onClick={handleCopy}
                className="text-slate-400 hover:text-white transition-colors"
                title="Copy Pass ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Gate Simulation Banner */}
            {simulatedGateStatus === "SCANNED" ? (
              <div className="w-full py-2 px-3 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs font-mono flex items-center justify-center gap-2 animate-in fade-in">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Turnstile A-2 Opened • Hardware Gate Passed!</span>
              </div>
            ) : (
              <div className="text-[10px] font-mono text-slate-500 text-center">
                Present this scannable QR ticket at registration desk or security turnstiles.
              </div>
            )}
          </div>

          {/* Seat & Squad Allocation Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
              <div className="text-[10px] text-slate-400 uppercase">Attendee</div>
              <div className="font-bold text-white truncate">{participantName}</div>
              <div className="text-[10px] text-blue-400">@{githubUsername}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
              <div className="text-[10px] text-slate-400 uppercase">Assigned Table</div>
              <div className="font-bold text-emerald-400 truncate">{tableNumber}</div>
              <div className="text-[10px] text-slate-400 truncate">{teamName}</div>
            </div>
          </div>

          {/* Venue Info */}
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div className="leading-tight">{venue}</div>
          </div>

          {/* Actions Deck */}
          <div className="pt-2 flex items-center gap-2.5">
            <button
              onClick={handleSimulateScan}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/25 cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Simulate Gate Scan</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print Pass</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

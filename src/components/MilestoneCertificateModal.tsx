"use client";

import React, { useState } from "react";
import {
  X,
  Award,
  CheckCircle2,
  Download,
  Printer,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
} from "lucide-react";

interface MilestoneCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  squadName: string;
  leadName: string;
  eventTitle: string;
  totalScore: number;
  completedTasks: string[];
  issuedAt?: string;
  verificationHash?: string;
}

export function MilestoneCertificateModal({
  isOpen,
  onClose,
  squadName,
  leadName,
  eventTitle,
  totalScore,
  completedTasks,
  issuedAt = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }),
  verificationHash = `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}...${Math.random().toString(16).substring(2, 6).toUpperCase()}`,
}: MilestoneCertificateModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#0A0B10] text-slate-900 dark:text-white border-4 border-amber-400/40 dark:border-amber-500/30 shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_60px_rgba(245,158,11,0.2)] p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Certificate Decorative Top Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold shadow-xs">
            <Award className="w-4 h-4 text-amber-500" />
            <span>TALENTORBIT VERIFIED CREDENTIAL</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-slate-900 dark:text-white">
            Certificate of Milestone Completion
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono uppercase tracking-widest">
            Recognizing Exceptional Technical Architecture & Delivery
          </p>
        </div>

        {/* Recipient Details */}
        <div className="text-center py-4 border-y border-slate-200 dark:border-zinc-800 space-y-3">
          <div className="text-xs text-slate-500 dark:text-zinc-400 font-mono">This credential is awarded to</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
            {squadName}
          </div>
          <div className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
            Lead Engineer: <span className="text-slate-900 dark:text-white font-bold">{leadName}</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
            For successfully constructing, benchmarking, and delivering all required engineering checkpoints for{" "}
            <strong className="text-slate-900 dark:text-white">{eventTitle}</strong> with a verified aggregate score of{" "}
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{totalScore} XP</span>.
          </p>
        </div>

        {/* Completed Milestones Grid */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
            Verified Completed Milestones:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {completedTasks.map((taskTitle, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 flex items-center gap-2 text-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-slate-800 dark:text-zinc-200 font-medium truncate">{taskTitle}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Signatures & Seal */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-zinc-800 text-xs">
          <div className="space-y-1 text-center sm:text-left">
            <div className="font-serif italic text-base text-slate-800 dark:text-zinc-200">Sarah Chen</div>
            <div className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 uppercase">
              Hackathon Director • TechYuva
            </div>
          </div>

          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 border-2 border-amber-400/80 dark:border-amber-500/60 flex flex-col items-center justify-center text-amber-600 dark:text-amber-400 font-mono text-[9px] font-bold text-center shadow-inner">
            <Award className="w-5 h-5 mb-0.5" />
            <span>SEAL</span>
          </div>

          <div className="space-y-1 text-center sm:text-right">
            <div className="font-mono text-[10px] text-slate-400 dark:text-zinc-500">Hash: {verificationHash}</div>
            <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              Issued {issuedAt}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-500/25 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
}

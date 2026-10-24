"use client";

import React, { useState } from "react";
import { Event } from "@/types";
import { useStore } from "@/lib/store";
import {
  X,
  User,
  Users,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";

interface RegistrationModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RegistrationModal({
  event,
  isOpen,
  onClose,
  onSuccess,
}: RegistrationModalProps) {
  const { user, registerForEvent } = useStore();

  const [mode, setMode] = useState<"SOLO" | "TEAM">("SOLO");
  const [teamAction, setTeamAction] = useState<"CREATE" | "JOIN">("CREATE");
  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    message: string;
    teamCode?: string;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen || !event) return null;

  const handleRegister = () => {
    setErrorMsg(null);

    if (mode === "TEAM") {
      if (teamAction === "CREATE" && !teamName.trim()) {
        setErrorMsg("Please provide a name for your team.");
        return;
      }
      if (teamAction === "JOIN" && !inviteCode.trim()) {
        setErrorMsg("Please enter the 6-character team invite code.");
        return;
      }
    }

    const result = registerForEvent({
      eventId: event.id,
      isTeam: mode === "TEAM",
      teamName: teamAction === "CREATE" ? teamName : undefined,
      inviteCode: teamAction === "JOIN" ? inviteCode : undefined,
      completedAppDownload: true,
    });

    if (result.success) {
      setSuccessInfo({
        message: result.message,
        teamCode: result.teamCode,
      });
      setTimeout(() => {
        onSuccess();
      }, 2500);
    } else {
      setErrorMsg(result.message);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-[#0E0F14] border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
              Event Registration
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
              {event.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {successInfo ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Registration Confirmed!
              </h4>
              <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-sm mx-auto">
                {successInfo.message}
              </p>

              {successInfo.teamCode && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 max-w-xs mx-auto space-y-2 shadow-xs">
                  <span className="text-xs text-slate-600 dark:text-zinc-400">
                    Share this Team Invite Code:
                  </span>
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white dark:bg-black border border-slate-200 dark:border-zinc-800">
                    <span className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400">
                      {successInfo.teamCode}
                    </span>
                    <button
                      onClick={() => copyToClipboard(successInfo.teamCode!)}
                      className="text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white flex items-center gap-1 font-semibold"
                    >
                      {copiedCode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedCode ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 flex items-center gap-2.5 text-xs text-red-700 dark:text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Step 1: Mode Selection */}
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Step 1: Choose Participation Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMode("SOLO")}
                    disabled={event.participationMode === "TEAM_ONLY"}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      mode === "SOLO"
                        ? "bg-blue-50/70 dark:bg-zinc-900 border-blue-500 shadow-sm"
                        : "bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-100/60"
                    } ${
                      event.participationMode === "TEAM_ONLY"
                        ? "opacity-40 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <User
                        className={`w-4 h-4 ${
                          mode === "SOLO" ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-zinc-500"
                        }`}
                      />
                      {mode === "SOLO" && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      Register as Individual
                    </div>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1">
                      Compete or join solo under your verified student profile.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("TEAM")}
                    disabled={event.participationMode === "SOLO_ONLY"}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      mode === "TEAM"
                        ? "bg-blue-50/70 dark:bg-zinc-900 border-blue-500 shadow-sm"
                        : "bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-100/60"
                    } ${
                      event.participationMode === "SOLO_ONLY"
                        ? "opacity-40 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Users
                        className={`w-4 h-4 ${
                          mode === "TEAM" ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-zinc-500"
                        }`}
                      />
                      {mode === "TEAM" && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      Create / Join a Team
                    </div>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1">
                      Collaborate in teams of {event.minTeamSize}-{event.maxTeamSize} builders.
                    </p>
                  </button>
                </div>
              </div>

              {/* Step 2: Team Details (if Team) */}
              {mode === "TEAM" && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-4 shadow-xs">
                  <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-850 pb-3">
                    <button
                      type="button"
                      onClick={() => setTeamAction("CREATE")}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                        teamAction === "CREATE"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      Create New Team
                    </button>
                    <button
                      type="button"
                      onClick={() => setTeamAction("JOIN")}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                        teamAction === "JOIN"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      Join Existing Team
                    </button>
                  </div>

                  {teamAction === "CREATE" ? (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                        Team Name
                      </label>
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="e.g. Orbit Alpha, ByteBuilders"
                        className="w-full bg-white dark:bg-[#080808] border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 shadow-xs"
                      />
                      <p className="text-[11px] text-slate-500 dark:text-zinc-500">
                        A unique 6-character invite code will be generated for your teammates.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                        6-Character Team Invite Code
                      </label>
                      <input
                        type="text"
                        maxLength={8}
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                        placeholder="e.g. ORB92A"
                        className="w-full font-mono bg-white dark:bg-[#080808] border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white uppercase placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 shadow-xs"
                      />
                      <p className="text-[11px] text-slate-500 dark:text-zinc-500">
                        Ask your team leader for the invite code to join their roster.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!successInfo && (
          <div className="p-6 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-[#080808]/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-white text-xs font-semibold hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors shadow-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRegister}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-blue-500/25"
            >
              Confirm Registration
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

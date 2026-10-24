"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import {
  Event,
  OpportunityType,
  ApplicationStatus,
  Registration,
  Task,
  TaskSubmission,
  CompetitionStanding,
  TaskType,
  ChatChannel,
  ChannelMember,
  ChatMessage,
} from "@/types";
import {
  AVAILABLE_CHAT_PARTICIPANTS,
  INITIAL_CHANNELS,
  INITIAL_MESSAGES,
} from "@/lib/data";
import { generateEventWithGemini, generateTaskWithGemini } from "@/lib/gemini";
import { MilestoneCertificateModal } from "./MilestoneCertificateModal";
import {
  Building2,
  Calendar,
  Sparkles,
  PlusCircle,
  Users,
  Check,
  X,
  ExternalLink,
  Github,
  Linkedin,
  MapPin,
  Trophy,
  Smartphone,
  CheckCircle2,
  Clock,
  ArrowRight,
  Loader2,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Share2,
  Sliders,
  ChevronDown,
  Layers,
  LogOut,
  Download,
  ArrowUpDown,
  Eye,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  FileText,
  Radio,
  ShieldCheck,
  Terminal,
  Key,
  Cpu,
  Zap,
  Award,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  MessagesSquare,
  Hash,
  UserPlus,
  UserMinus,
  UserCheck,
  Send,
  RefreshCw,
  Plus,
  Trash2,
  AtSign,
  MessageCircle,
  GraduationCap,
  Flame,
  Activity,
  Sun,
  Moon,
  Shield,
  Globe,
  Crown,
  Compass,
} from "lucide-react";

export function HostWorkspace() {
  const {
    events,
    registrations,
    tasks,
    taskSubmissions,
    competitionStandings,
    createEvent,
    createTask,
    gradeSubmission,
    updateRegistrationStatus,
    setActiveNav,
    user,
    isAuthenticated,
    logout,
    theme,
    toggleTheme,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    "overview" | "create_event" | "review_applicants" | "tasks_competition" | "analytics" | "community_chats"
  >("overview");

  // Community Chats & Channels State (Stitch Designed)
  const [channels, setChannels] = useState<ChatChannel[]>(INITIAL_CHANNELS);
  const [selectedChannelId, setSelectedChannelId] = useState<string>(
    INITIAL_CHANNELS[0]?.id || "chn_omni_announcements"
  );
  const [channelFilter, setChannelFilter] = useState<
    "ALL" | "TRACK_ROOM" | "MENTOR_DESK" | "GROUP" | "ANNOUNCEMENT"
  >("ALL");
  const [channelSearch, setChannelSearch] = useState("");
  const [chatViewMode, setChatViewMode] = useState<"chat" | "create_group">("chat");
  const [activeMessages, setActiveMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [hostMessageInput, setHostMessageInput] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Group Creation Form State
  const [newGroupTitle, setNewGroupTitle] = useState("AI Agent Swarms & Memory Architecture");
  const [newGroupDescription, setNewGroupDescription] = useState(
    "Interactive track discussion and technical office room for teams building multi-agent coordination frameworks."
  );
  const [newGroupType, setNewGroupType] = useState<"GROUP" | "TRACK_ROOM" | "MENTOR_DESK" | "ANNOUNCEMENT">("TRACK_ROOM");
  const [newGroupEventId, setNewGroupEventId] = useState("evt_omnichain_agentic_2025");
  const [newGroupSelectedMemberIds, setNewGroupSelectedMemberIds] = useState<string[]>([
    "usr_arjun_sharma",
    "usr_tanmay_dev",
    "usr_mentor_alex",
  ]);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [memberRoleFilter, setMemberRoleFilter] = useState<"ALL" | "STUDENT" | "MENTOR">("ALL");
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupCreatedSuccess, setGroupCreatedSuccess] = useState(false);

  // Member Management Drawer / Modal State
  const [isMemberDrawerOpen, setIsMemberDrawerOpen] = useState(false);
  const [managingChannelId, setManagingChannelId] = useState<string | null>(null);
  const [candidateSearchQuery, setCandidateSearchQuery] = useState("");

  // Toggle candidate selection for new group
  const toggleMemberSelection = (userId: string) => {
    setNewGroupSelectedMemberIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const selectAllStudents = () => {
    const studentIds = AVAILABLE_CHAT_PARTICIPANTS.filter((p) => p.role === "STUDENT").map(
      (p) => p.userId
    );
    setNewGroupSelectedMemberIds((prev) => Array.from(new Set([...prev, ...studentIds])));
  };

  const selectAllMentors = () => {
    const mentorIds = AVAILABLE_CHAT_PARTICIPANTS.filter((p) => p.role === "MENTOR").map(
      (p) => p.userId
    );
    setNewGroupSelectedMemberIds((prev) => Array.from(new Set([...prev, ...mentorIds])));
  };

  const clearSelectedMembers = () => {
    setNewGroupSelectedMemberIds([]);
  };

  // Switch channel
  const handleSelectChannel = (channelId: string) => {
    setSelectedChannelId(channelId);
    setChatViewMode("chat");
  };

  // Host send message
  const handleSendHostMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostMessageInput.trim() || !selectedChannelId) return;

    const messageText = hostMessageInput.trim();
    setHostMessageInput("");
    setIsSendingMessage(true);

    try {
      const res = await fetch(`/api/channels/${selectedChannelId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: "usr_host_sarah",
          senderRole: "HOST",
          senderName: "Sarah Chen (Host)",
          text: messageText,
        }),
      });
      const data = await res.json();
      if (data.success && data.chatMessage) {
        setActiveMessages((prev) => [...prev, data.chatMessage]);
      } else {
        const optimisticMsg: ChatMessage = {
          id: `msg_${Date.now()}`,
          channelId: selectedChannelId,
          senderId: "usr_host_sarah",
          senderName: "Sarah Chen (Host)",
          senderRole: "HOST",
          text: messageText,
          createdAt: new Date().toISOString(),
        };
        setActiveMessages((prev) => [...prev, optimisticMsg]);
      }

      // Update channel last message
      setChannels((prev) =>
        prev.map((c) =>
          c.id === selectedChannelId
            ? { ...c, lastMessage: messageText, lastMessageAt: new Date().toISOString() }
            : c
        )
      );
    } catch {
      const optimisticMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        channelId: selectedChannelId,
        senderId: "usr_host_sarah",
        senderName: "Sarah Chen (Host)",
        senderRole: "HOST",
        text: messageText,
        createdAt: new Date().toISOString(),
      };
      setActiveMessages((prev) => [...prev, optimisticMsg]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Quick preset broadcast
  const handleQuickBroadcast = (text: string) => {
    setHostMessageInput(text);
  };

  // Create Group Channel
  const handleCreateGroupChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupTitle.trim()) return;

    setIsCreatingGroup(true);
    try {
      const payload = {
        title: newGroupTitle.trim(),
        description: newGroupDescription.trim(),
        type: newGroupType,
        memberIds: newGroupSelectedMemberIds,
        createdById: "usr_host_sarah",
        createdByName: "Sarah Chen (Host)",
      };

      const res = await fetch(`/api/events/${newGroupEventId}/channels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.channel) {
        setChannels((prev) => [data.channel, ...prev]);
        setSelectedChannelId(data.channel.id);
        setChatViewMode("chat");
        setGroupCreatedSuccess(true);
        setTimeout(() => setGroupCreatedSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Failed to create group channel", err);
    } finally {
      setIsCreatingGroup(false);
    }
  };

  // Add member to channel
  const handleAddMemberToChannel = async (channelId: string, participant: typeof AVAILABLE_CHAT_PARTICIPANTS[0]) => {
    try {
      const res = await fetch(`/api/channels/${channelId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member: participant }),
      });
      const data = await res.json();
      if (data.success && data.members) {
        setChannels((prev) =>
          prev.map((c) =>
            c.id === channelId
              ? { ...c, members: data.members, memberCount: data.currentMemberCount }
              : c
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Remove member from channel
  const handleRemoveMemberFromChannel = async (channelId: string, userId: string) => {
    try {
      const res = await fetch(`/api/channels/${channelId}/members?userId=${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success && data.members) {
        setChannels((prev) =>
          prev.map((c) =>
            c.id === channelId
              ? { ...c, members: data.members, memberCount: data.currentMemberCount }
              : c
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Overview Tab States
  const [overviewFilter, setOverviewFilter] = useState<"ALL" | "ACTIVE" | "DRAFTS" | "PAST">("ALL");
  const [overviewSearch, setOverviewSearch] = useState("");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Review Applicants Filter & Search states
  const [applicantFilter, setApplicantFilter] = useState<
    "ALL" | "APP_VERIFIED" | "TASK_PENDING" | "APPROVED" | "SHORTLISTED"
  >("ALL");
  const [selectedEventFilter, setSelectedEventFilter] = useState("ALL");
  const [applicantSearch, setApplicantSearch] = useState("");
  const [selectedSkillTag, setSelectedSkillTag] = useState<string | null>(null);

  // Tasks & Competition States
  const [tasksSubView, setTasksSubView] = useState<
    "directory" | "create_task" | "submissions" | "completed_participants" | "leaderboard"
  >("directory");
  const [selectedTaskEventFilter, setSelectedTaskEventFilter] = useState("ALL");
  const [taskSearchQuery, setTaskSearchQuery] = useState("");
  const [inspectingSubmission, setInspectingSubmission] = useState<TaskSubmission | null>(null);
  const [gradingScore, setGradingScore] = useState<number>(340);
  const [gradingFeedback, setGradingFeedback] = useState<string>("");
  const [fastTrackedTeams, setFastTrackedTeams] = useState<string[]>([]);

  // Submissions & Completed Participants Filters & State
  const [submissionFilter, setSubmissionFilter] = useState<"ALL" | "PENDING" | "COMPLETED" | "REVISE">("ALL");
  const [submissionSearch, setSubmissionSearch] = useState("");
  const [completedParticipantsFilter, setCompletedParticipantsFilter] = useState<"ALL" | "PERFECT_SCORE" | "FAST_TRACKED">("ALL");
  const [completedParticipantsSearch, setCompletedParticipantsSearch] = useState("");
  const [certificateModalData, setCertificateModalData] = useState<{
    isOpen: boolean;
    squadName: string;
    leadName: string;
    eventTitle: string;
    totalScore: number;
    completedTasks: string[];
  }>({
    isOpen: false,
    squadName: "",
    leadName: "",
    eventTitle: "",
    totalScore: 0,
    completedTasks: [],
  });

  // Create Task Form State
  const [newTaskEventId, setNewTaskEventId] = useState<string>("evt_omnichain_agentic_2025");
  const [newTaskTitle, setNewTaskTitle] = useState("Milestone 3: Zero-Knowledge Verification Proof Circuits");
  const [newTaskDescription, setNewTaskDescription] = useState(
    "Implement Circom proof circuits for private agent verification. Submit the compiled WASM and groth16 verifier smart contract with test coverage."
  );
  const [newTaskType, setNewTaskType] = useState<TaskType>("CODE_SUBMISSION");
  const [newTaskPoints, setNewTaskPoints] = useState<number>(300);
  const [newTaskDeadline, setNewTaskDeadline] = useState("2026-10-29T23:59");
  const [newTaskIsRequired, setNewTaskIsRequired] = useState(true);
  const [newTaskRubricStr, setNewTaskRubricStr] = useState(
    "Correct Circom circuit constraints, Sub-200ms witness generation, Verified Solidity verifier deployment"
  );
  const [taskCreatedSuccess, setTaskCreatedSuccess] = useState(false);
  const [isGeneratingTaskAI, setIsGeneratingTaskAI] = useState(false);
  const [taskAiPrompt, setTaskAiPrompt] = useState(
    "Design a real-time benchmarking task for autonomous agent swarms running on decentralized testnet nodes."
  );

  // Table Management States
  const [sortColumn, setSortColumn] = useState<"name" | "velocity" | "date" | "status">("velocity");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedApplicantIds, setSelectedApplicantIds] = useState<string[]>([]);
  const [inspectingApplicant, setInspectingApplicant] = useState<Registration | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  // Event Creation State (Studio)
  const [creationMode, setCreationMode] = useState<"AI" | "MANUAL">("AI");
  const [aiPrompt, setAiPrompt] = useState(
    "A 2-day student hackathon in Bengaluru for backend engineers with prizes up to ₹1,00,000, teams of 2 to 4, requiring our companion tester app for venue NFC check-in and automated evaluation."
  );
  const [isGenerating, setIsGenerating] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("OmniChain Autonomous Agent Hackathon 2025");
  const [type, setType] = useState<OpportunityType>("HACKATHON");
  const [city, setCity] = useState("Bengaluru");
  const [description, setDescription] = useState(
    "A 2-day student hackathon in Bengaluru for backend engineers focusing on autonomous distributed agent systems, memory caches, and multi-agent coordination."
  );
  const [skillsStr, setSkillsStr] = useState("Rust, EVM / Solidity, Distributed Systems, Go / K8s");
  const [reward, setReward] = useState("₹1,00,000 Prize Pool");
  const [participationMode, setParticipationMode] = useState<"SOLO_OR_TEAM" | "SOLO_ONLY" | "TEAM_ONLY">("SOLO_OR_TEAM");
  const [minTeam, setMinTeam] = useState(2);
  const [maxTeam, setMaxTeam] = useState(4);
  const [requiresApp, setRequiresApp] = useState(true);
  const [appName, setAppName] = useState("HyperScale Companion");
  const [appUrl, setAppUrl] = useState("https://app.hyperscale.xyz/companion");
  const [enforceNfc, setEnforceNfc] = useState(true);
  const [liveTelemetry, setLiveTelemetry] = useState(true);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  // Focus Presets for Specification Engine
  const handleApplyPreset = (preset: string) => {
    if (preset === "web3") {
      setAiPrompt((prev) => prev + " Inject Web3 & Rollup focus with smart contract verification.");
      setSkillsStr("Rust, EVM / Solidity, Circom, Go / K8s");
    } else if (preset === "hardware") {
      setAiPrompt((prev) => prev + " Add hardware NFC verification gate at physical registration desk.");
      setEnforceNfc(true);
    } else if (preset === "fellowship") {
      setType("INTERNSHIP");
      setTitle("HyperScale AI Infrastructure Residency & Fellowship");
      setReward("₹60,000/mo Stipend");
      setSkillsStr("PyTorch, CUDA, Python, C++, Docker");
    } else if (preset === "prize") {
      setReward("₹2,50,000 Prize Pool");
      setAiPrompt((prev) => prev + " Boost total prize pool to ₹2.5 Lakh with sponsor bounties.");
    }
  };

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const generated = await generateEventWithGemini(aiPrompt);
      setTitle(generated.title);
      setType(generated.type as OpportunityType);
      setCity(generated.city);
      setDescription(generated.description);
      setSkillsStr(generated.requiredSkills.join(", "));
      setReward(generated.rewardOrStipend);
      setParticipationMode(generated.participationMode);
      setMinTeam(generated.minTeamSize);
      setMaxTeam(generated.maxTeamSize);
      setRequiresApp(generated.requiresAppDownload);
      if (generated.appName) setAppName(generated.appName);
      if (generated.appDownloadUrl) setAppUrl(generated.appDownloadUrl);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const skills = skillsStr
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    createEvent({
      title,
      type,
      city,
      isRemote: city.toLowerCase().includes("remote"),
      description,
      requiredSkills: skills,
      rewardOrStipend: reward,
      participationMode,
      minTeamSize: minTeam,
      maxTeamSize: maxTeam,
      requiresAppDownload: requiresApp,
      appName: requiresApp ? appName : undefined,
      appDownloadUrl: requiresApp ? appUrl : undefined,
    });

    setPublishedSuccess(true);
    setTimeout(() => {
      setPublishedSuccess(false);
      setActiveTab("overview");
    }, 1800);
  };

  const handleShareEvent = (eventId: string) => {
    const url = `${window.location.origin}/event/${eventId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(eventId);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleCreateNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const parentEvent = events.find((ev) => ev.id === newTaskEventId);
    const rubrics = newTaskRubricStr
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    createTask({
      eventId: newTaskEventId,
      eventTitle: parentEvent?.title || "OmniChain Autonomous Agent Hackathon 2025",
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      type: newTaskType,
      deadline: newTaskDeadline,
      points: Number(newTaskPoints) || 250,
      isRequired: newTaskIsRequired,
      rubricCriteria: rubrics,
    });

    setTaskCreatedSuccess(true);
    setTimeout(() => {
      setTaskCreatedSuccess(false);
      setTasksSubView("directory");
    }, 1500);
  };

  const handleGenerateTaskWithAI = async () => {
    if (!taskAiPrompt.trim()) return;
    setIsGeneratingTaskAI(true);
    try {
      const generated = await generateTaskWithGemini(taskAiPrompt);
      setNewTaskTitle(generated.title);
      setNewTaskDescription(generated.description);
      setNewTaskType(generated.type as TaskType);
      setNewTaskPoints(generated.points);
      setNewTaskRubricStr(generated.rubricCriteria.join(", "));
    } finally {
      setIsGeneratingTaskAI(false);
    }
  };

  const handleConfirmGrade = (status: "COMPLETED" | "REVISE_REQUESTED") => {
    if (!inspectingSubmission) return;
    const finalScore = Number(gradingScore) || 300;
    const finalFeedback = gradingFeedback.trim() || undefined;

    // 1. Grade in store for instant reactive update
    gradeSubmission(
      inspectingSubmission.id,
      finalScore,
      status,
      finalFeedback
    );

    // 2. Synchronize with Next.js REST API
    fetch(`/api/submissions/${inspectingSubmission.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        score: finalScore,
        feedback: finalFeedback,
      }),
    }).catch(console.error);

    setInspectingSubmission(null);
    setGradingFeedback("");
  };

  const handleFastTrack = (teamName: string) => {
    setFastTrackedTeams((prev) => [...prev, teamName]);
    alert(`🎉 Fast-Track Approved! ${teamName} has been directly invited to the Grand Finale demo day.`);
  };

  // Filtered applicants
  const filteredRegistrations = registrations.filter((reg) => {
    if (selectedEventFilter !== "ALL" && reg.eventId !== selectedEventFilter) {
      return false;
    }

    if (applicantFilter === "APP_VERIFIED" && !reg.completedAppDownload) return false;
    if (applicantFilter === "TASK_PENDING" && reg.completedAppDownload) return false;
    if (applicantFilter === "APPROVED" && reg.status !== "APPROVED") return false;
    if (applicantFilter === "SHORTLISTED" && reg.status !== "APPROVED") return false;

    if (selectedSkillTag) {
      const hasSkill = reg.userSkills.some(
        (s) => s.toLowerCase() === selectedSkillTag.toLowerCase()
      );
      if (!hasSkill) return false;
    }

    if (applicantSearch.trim().length > 0) {
      const q = applicantSearch.toLowerCase();
      const matchName = reg.userName.toLowerCase().includes(q);
      const matchTeam = reg.teamName?.toLowerCase().includes(q) || false;
      const matchGithub = reg.githubUsername?.toLowerCase().includes(q) || false;
      const matchSkill = reg.userSkills.some((s) => s.toLowerCase().includes(q));
      const matchEvent = reg.eventTitle.toLowerCase().includes(q);
      const matchUni = reg.university?.toLowerCase().includes(q) || false;
      return matchName || matchTeam || matchGithub || matchSkill || matchEvent || matchUni;
    }

    return true;
  });

  // Sorted applicants
  const sortedRegistrations = [...filteredRegistrations].sort((a, b) => {
    if (sortColumn === "velocity") {
      const velA = a.githubVelocity?.commitsPerYear || (a.status === "APPROVED" ? 500 : 100);
      const velB = b.githubVelocity?.commitsPerYear || (b.status === "APPROVED" ? 500 : 100);
      return sortDirection === "asc" ? velA - velB : velB - velA;
    } else if (sortColumn === "name") {
      const valA = (a.teamName || a.userName).toLowerCase();
      const valB = (b.teamName || b.userName).toLowerCase();
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    } else if (sortColumn === "status") {
      const valA = a.status;
      const valB = b.status;
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    } else {
      const valA = a.createdAt;
      const valB = b.createdAt;
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    }
  });

  const totalPages = Math.ceil(sortedRegistrations.length / rowsPerPage) || 1;
  const paginatedRegistrations = sortedRegistrations.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleToggleSelectOne = (id: string) => {
    setSelectedApplicantIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplicantIds(paginatedRegistrations.map((r) => r.id));
    } else {
      setSelectedApplicantIds([]);
    }
  };

  const handleBatchApproveVerified = () => {
    const verifiedIds = registrations
      .filter((r) => r.completedAppDownload && r.status !== "APPROVED")
      .map((r) => r.id);
    verifiedIds.forEach((id) => updateRegistrationStatus(id, "APPROVED"));
    setSelectedApplicantIds([]);
    alert(`Batch Approved ${verifiedIds.length || 122} App-Verified Teams! HackerPass QR keys dispatched.`);
  };

  const handleBulkApprove = () => {
    selectedApplicantIds.forEach((id) => {
      updateRegistrationStatus(id, "APPROVED");
    });
    setSelectedApplicantIds([]);
  };

  const handleBulkDecline = () => {
    selectedApplicantIds.forEach((id) => {
      updateRegistrationStatus(id, "REJECTED");
    });
    setSelectedApplicantIds([]);
  };

  const exportToCSV = () => {
    const headers = ["Team / Candidate", "Lead Name", "Email", "University", "GitHub", "Commits/Yr", "Public Repos", "Host App Status", "Device ID", "Event Title", "Review Status"];
    const rows = filteredRegistrations.map((r) => [
      `"${r.teamName || r.userName}"`,
      `"${r.userName}"`,
      `"${r.userEmail}"`,
      `"${r.university || "Engineering Dept"}"`,
      `"${r.githubUsername || ""}"`,
      `"${r.githubVelocity?.commitsPerYear || 450}"`,
      `"${r.githubVelocity?.publicRepos || 20}"`,
      `"${r.completedAppDownload ? "Completed & Handshake" : "Pending Install"}"`,
      `"${r.deviceId || "dev-unassigned"}"`,
      `"${r.eventTitle}"`,
      `"${r.status}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `talentorbit_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

    return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-12 space-y-10 sm:space-y-12 transition-colors">
      {/* 1. TOP HEADER & SWITCHER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-zinc-800">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_#10B981] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
              TalentOrbit // Host Operations Center
            </span>
            <span className="text-slate-300 dark:text-zinc-700 font-mono text-xs">•</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-[11px] font-mono text-blue-700 dark:text-blue-300 font-semibold">
              <ShieldCheck className="w-3 h-3 text-blue-500" />
              HyperScale Labs (Organizer Desk)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Organizer Portal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">
              LIVE MESH V3.0
            </span>
          </div>

          <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Provision hackathons with Gemini AI, coordinate specialized discussion circles, inspect hardware companion onboarding, and oversee live leaderboard operations.
          </p>
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-700 shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-blue-600" />
                <span>Dark</span>
              </>
            )}
          </button>

          {/* Switch to Student Discovery View */}
          <button
            onClick={() => setActiveNav("events")}
            className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800 shadow-xs transition-colors flex items-center gap-2"
          >
            <Compass className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
            <span>Student View</span>
          </button>

          <button
            onClick={() => setActiveTab("create_event")}
            className="px-4.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-2 transition-all shadow-md shadow-blue-500/25"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Create Event</span>
          </button>

          {/* Host Profile Chip with Avatar */}
          <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-zinc-800">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
              alt="Sarah Chen"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
            />
            <div className="text-left text-xs">
              <div className="font-bold text-slate-900 dark:text-white leading-tight">Sarah Chen</div>
              <div className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 leading-tight">Lead DevRel</div>
            </div>
          </div>

          {/* Host Log Out Option */}
          {isAuthenticated && (
            <button
              onClick={logout}
              title="Sign out of Host Portal"
              className="p-2 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 text-xs font-semibold flex items-center justify-center transition-colors shadow-xs"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === "overview"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
              : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>My Events ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("create_event")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === "create_event"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
              : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Create New Event</span>
        </button>

        <button
          onClick={() => setActiveTab("review_applicants")}
          className={`relative px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === "review_applicants"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
              : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Applicants & Teams</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-zinc-800 text-[10px] text-slate-700 dark:text-zinc-300 font-bold">
            146
          </span>
        </button>

        <button
          onClick={() => setActiveTab("tasks_competition")}
          className={`relative px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === "tasks_competition"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
              : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Tasks & Competition</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[10px] text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 font-mono font-bold">
            {tasks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("community_chats")}
          className={`relative px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === "community_chats"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
              : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900"
          }`}
        >
          <MessagesSquare className="w-3.5 h-3.5" />
          <span>Group Chats & Channels</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[10px] text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 font-mono font-bold">
            {channels.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === "analytics"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
              : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytics</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: ORGANIZER OVERVIEW (Screen 2 from Stitch)
          ========================================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Header Row: Title & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Organizer Overview
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 text-[10px] font-mono font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Verified Host
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Manage your active hackathons, internships, and applicant pipelines in one unified workspace.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={overviewSearch}
                  onChange={(e) => setOverviewSearch(e.target.value)}
                  placeholder="Quick search events..."
                  className="bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 w-48 transition-colors shadow-xs"
                />
              </div>

              <button
                type="button"
                onClick={exportToCSV}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-850 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                <span>Export CSV Telemetry</span>
              </button>

              <button
                onClick={() => setActiveTab("create_event")}
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/25"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Create Event</span>
              </button>
            </div>
          </div>

          {/* Top 3 Metric Cards (Stitch Screen 2 Exact Metrics) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Active Opportunities */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-mono uppercase tracking-wider">
                <span>Active Opportunities</span>
                <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">3 Live</span>
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded-full">
                  +1 this month
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-850 flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400 font-mono">
                <span>• 1 Hackathon</span>
                <span>• 2 Internships</span>
              </div>
            </div>

            {/* Card 2: Total Applications */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-mono uppercase tracking-wider">
                <span>Total Applications</span>
                <Users className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">428</span>
                <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">Candidates</span>
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded-full ml-auto">
                  +12% vs last cohort
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-850 flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400 font-mono">
                <span>• 320 Hackathon</span>
                <span>• 108 Residency</span>
              </div>
            </div>

            {/* Card 3: Companion App Verification */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-mono uppercase tracking-wider">
                <span>Companion App Verification</span>
                <Smartphone className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">78%</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium">334 of 428 Verified</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-zinc-900 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: "78%" }} />
              </div>
              <div className="pt-1 flex items-center justify-between text-xs text-slate-400 dark:text-zinc-500 font-mono">
                <span>334 Installed & Verified</span>
                <span>94 Pending</span>
              </div>
            </div>
          </div>

          {/* Sub-Filter Tabs Bar & Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2">
              {[
                { id: "ALL", label: "All Events (3)" },
                { id: "ACTIVE", label: "Active & Open (2)" },
                { id: "DRAFTS", label: "Drafts (1)" },
                { id: "PAST", label: "Past Events (0)" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setOverviewFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    overviewFilter === tab.id
                      ? "bg-blue-600 text-white font-semibold shadow-xs"
                      : "bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 shadow-xs"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 font-mono">
              <span>Sort:</span>
              <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white shadow-xs">
                <span>Recently Created</span>
                <ChevronDown className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
              </button>
            </div>
          </div>

          {/* Horizontal Event Cards (Exact Stitch Screen 2 List) */}
          <div className="space-y-4">
            {/* Card 1: OmniChain Autonomous Agent Hackathon 2025 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-all space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 text-[10px] font-mono font-semibold">
                    Hackathon
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">
                    Bengaluru • In-Person (Volkswagen Hall)
                  </span>
                  <span className="text-slate-300 dark:text-zinc-600 font-mono text-xs">•</span>
                  <span className="text-xs font-mono text-slate-700 dark:text-zinc-300 font-semibold">Prize: ₹1,00,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                    Active • Closes in 48 Hours
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  OmniChain Autonomous Agent Hackathon 2025
                </h3>
              </div>

              {/* 4 Stat Blocks in Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-zinc-855">
                <div>
                  <div className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono uppercase">Registered Teams</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">146</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono uppercase">Total Applicants</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">342</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500 font-mono uppercase">
                    <span>Registration Window</span>
                    <span className="text-slate-600 dark:text-zinc-400 font-bold">88% Elapsed</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: "88%" }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500 font-mono uppercase">
                    <span>Companion App Verified</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">76% (260/342)</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "76%" }} />
                  </div>
                </div>
              </div>

              {/* Footer Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-zinc-850 text-xs">
                <span className="text-slate-400 dark:text-zinc-500 font-mono text-[11px]">
                  talentorbit.com/e/omnichain-agent
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("create_event")}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-700 dark:text-zinc-300 text-xs font-medium transition-colors shadow-xs"
                  >
                    Edit Blueprint
                  </button>

                  <button
                    onClick={() => {
                      setSelectedEventFilter("evt_omnichain_agentic_2025");
                      setActiveTab("review_applicants");
                    }}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/25"
                  >
                    <span>Review Applicants (146)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: HyperScale AI Infrastructure Residency & Fellowship */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-all space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 text-[10px] font-mono font-semibold">
                    Internship / Track
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">
                    Bengaluru (Hybrid)
                  </span>
                  <span className="text-slate-300 dark:text-zinc-600 font-mono text-xs">•</span>
                  <span className="text-xs font-mono text-slate-700 dark:text-zinc-300 font-semibold">Stipend: ₹60,000/mo</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-medium">
                    Reviewing Round 1
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  HyperScale AI Infrastructure Residency & Fellowship
                </h3>
              </div>

              {/* 4 Stat Blocks in Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-zinc-850">
                <div>
                  <div className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono uppercase">Candidates</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">85 Applicants</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono uppercase">Shortlisted</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">14 In Stage 2</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500 font-mono uppercase">
                    <span>Candidate Evaluation</span>
                    <span className="text-slate-600 dark:text-zinc-400 font-bold">60% Complete</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: "60%" }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500 font-mono uppercase">
                    <span>Tutor Task Completed</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">81% (70)</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "81%" }} />
                  </div>
                </div>
              </div>

              {/* Footer Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-zinc-850 text-xs">
                <span className="text-slate-400 dark:text-zinc-500 font-mono text-[11px]">
                  talentorbit.com/e/hyperscale-ai
                </span>

                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-700 dark:text-zinc-300 text-xs font-medium transition-colors shadow-xs">
                    Manage Seats
                  </button>

                  <button
                    onClick={() => {
                      setSelectedEventFilter("evt_hyperscale_residency");
                      setActiveTab("review_applicants");
                    }}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/25"
                  >
                    <span>Review Candidates (85)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Zero-Knowledge Privacy & Compute Summit 2025 (Draft) */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-all space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 text-[10px] font-mono font-semibold">
                    Hackathon
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">Global Remote</span>
                  <span className="text-slate-300 dark:text-zinc-600 font-mono text-xs">•</span>
                  <span className="text-xs font-mono text-slate-700 dark:text-zinc-300 font-semibold">Bounties: $25,000 USD</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-zinc-500" />
                  <span className="text-xs font-mono text-slate-500 dark:text-zinc-400 font-medium">
                    Draft • Ready to Publish
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Zero-Knowledge Privacy & Compute Summit 2025
                </h3>
              </div>

              {/* Callout Info Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-zinc-850 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Configuration verified by automated checklist
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                      Judging criteria, rubric, and prize pool escrow terms have been staged.
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono shrink-0">
                  Last edited 2h ago
                </span>
              </div>

              {/* Footer Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-zinc-850 text-xs">
                <span className="text-slate-400 dark:text-zinc-500 font-mono text-[11px]">
                  Unpublished • Invisible to student discovery feed
                </span>

                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-700 dark:text-zinc-300 text-xs font-medium transition-colors shadow-xs">
                    Preview
                  </button>
                  <button
                    onClick={() => setActiveTab("create_event")}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-700 dark:text-zinc-300 text-xs font-medium transition-colors shadow-xs"
                  >
                    Edit Draft
                  </button>
                  <button
                    onClick={() => alert("Event published to live directory!")}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-500/25"
                  >
                    Publish Event
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Webhooks & Telemetry API Card (Screen 2 Bottom) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 flex items-center justify-center shrink-0">
                <Terminal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  TalentOrbit Webhooks & Telemetry API
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
                  Stream real-time candidate registration events and companion app telemetry into your Discord, Slack, or internal HR tools.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => alert("Webhook integration settings opened")}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors shadow-xs"
              >
                Configure Webhooks
              </button>
              <button
                onClick={() => alert("API Keys modal opened")}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Key className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
                <span>API Keys ↗</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: EVENT PROVISIONING STUDIO (Screen 1 from Stitch)
          ========================================================================= */}
      {activeTab === "create_event" && (
        <div className="space-y-8">
          {/* Top Title Strip & Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[10px] font-mono text-slate-500 dark:text-zinc-400 tracking-wider">
                WORKSPACE // PROVISIONING • SPEC_BUILDER V2.1
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Event Provisioning Studio
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Create and broadcast live hackathons, hiring sprints, or tech residencies with AI-assisted blueprint synthesis.
              </p>
            </div>

            {/* Creation Mode Switcher */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-black rounded-xl border border-slate-200 dark:border-zinc-800 shadow-xs">
              <button
                type="button"
                onClick={() => setCreationMode("AI")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  creationMode === "AI"
                    ? "bg-blue-600 text-white shadow-xs font-semibold"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>&lt; Build with AI Prompt (Gemini)</span>
              </button>
              <button
                type="button"
                onClick={() => setCreationMode("MANUAL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  creationMode === "MANUAL"
                    ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-semibold"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Manual Form Builder
              </button>
            </div>
          </div>

          {/* Top 4 Status Chips Grid (Stitch Screen 1) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 flex items-center gap-2.5 shadow-xs">
              <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono uppercase">Engine Model</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Gemini 1.5 Pro</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 flex items-center gap-2.5 shadow-xs">
              <Radio className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono uppercase">Telemetry Ingestion</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Active (NFC + SDK)</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 flex items-center gap-2.5 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-purple-500 dark:text-purple-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono uppercase">Verification Mode</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Mandatory Check</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 flex items-center gap-2.5 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono uppercase">Draft Status</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Uncommitted (Live)</div>
              </div>
            </div>
          </div>

          {/* 2-Column Grid: Specification Engine (Left) & Live Synchronous Preview (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {creationMode === "AI" ? (
                <div className="p-6 rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                        Natural Language Specification Engine
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
                      Gemini 1.5 Pro • Spec Generator
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-600 dark:text-zinc-400">Prompt Directive:</label>
                    <textarea
                      rows={4}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g. A 2-day student hackathon in Bengaluru for backend engineers with prizes up to ₹1,00,000..."
                      className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-xl p-3.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors leading-relaxed"
                    />
                  </div>

                  {/* Focus Presets (Click to inject parameters) */}
                  <div className="space-y-2">
                    <span className="text-[11px] text-slate-500 dark:text-zinc-500 font-mono uppercase">
                      Focus Specification Presets (Click to inject parameters):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleApplyPreset("web3")}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-xs font-mono transition-colors"
                      >
                        + Web3 & Rollup Focus
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyPreset("hardware")}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-xs font-mono transition-colors"
                      >
                        + Hardware Verification Gate
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyPreset("fellowship")}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-xs font-mono transition-colors"
                      >
                        + Paid Fellowship Track
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyPreset("prize")}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-xs font-mono transition-colors"
                      >
                        + ₹2.5L Prize Pool
                      </button>
                    </div>
                  </div>

                  {/* Mandatory Host App Onboarding Gate */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-850 space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="gateApp"
                        checked={requiresApp}
                        onChange={(e) => setRequiresApp(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-blue-600 focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="gateApp" className="text-xs font-bold text-slate-900 dark:text-white cursor-pointer flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Mandatory Host App Onboarding Gate</span>
                      </label>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 pl-6">
                      Enforce companion app download to check-in NFC and unlock problem statements.
                    </p>

                    {requiresApp && (
                      <div className="pl-6 space-y-3 pt-1">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono uppercase">
                            Mandatory Companion App URL (Verification Gate)
                          </label>
                          <input
                            type="text"
                            value={appUrl}
                            onChange={(e) => setAppUrl(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                          />
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700 dark:text-zinc-300">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={enforceNfc}
                              onChange={(e) => setEnforceNfc(e.target.checked)}
                              className="w-3.5 h-3.5 rounded border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-blue-600 cursor-pointer"
                            />
                            <span>Enforce NFC Check-in Sensor</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={liveTelemetry}
                              onChange={(e) => setLiveTelemetry(e.target.checked)}
                              className="w-3.5 h-3.5 rounded border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-blue-600 cursor-pointer"
                            />
                            <span>Live Host Telemetry Streaming</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Generate Button & Latency Indicator */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={handleGenerateWithAI}
                      disabled={isGenerating}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-blue-500/25"
                    >
                      {isGenerating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      <span>
                        {isGenerating
                          ? "Gemini Synthesizing Blueprint..."
                          : "Generate Event Specification with Gemini"}
                      </span>
                    </button>

                    <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono">
                      Latency: ~312ms via Edge Mesh
                    </span>
                  </div>
                </div>
              ) : (
                /* Manual Form Builder */
                <form onSubmit={handlePublish} className="p-6 rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-4 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Manual Parameter Entry</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600 dark:text-zinc-400">Opportunity Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600 dark:text-zinc-400">Opportunity Type</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as OpportunityType)}
                        className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="HACKATHON">Hackathon</option>
                        <option value="INTERNSHIP">Internship</option>
                        <option value="WORKSHOP">Workshop</option>
                        <option value="MEETUP">Meetup</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-600 dark:text-zinc-400">Full Description</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-lg p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600 dark:text-zinc-400">City / Location</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600 dark:text-zinc-400">Prize Pool / Stipend</label>
                      <input
                        type="text"
                        value={reward}
                        onChange={(e) => setReward(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-600 dark:text-zinc-400">Required Skills</label>
                    <input
                      type="text"
                      value={skillsStr}
                      onChange={(e) => setSkillsStr(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </form>
              )}

              {/* Extracted Configuration Payload Card (Stitch Screen 1) */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-3 font-mono shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-zinc-400 uppercase tracking-wider text-[11px] font-bold">
                    Extracted Configuration Payload
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 text-[10px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded font-bold">
                    JSON SCHEMA // VALID
                  </span>
                </div>

                <pre className="p-4 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-850 text-[11px] text-slate-800 dark:text-zinc-300 overflow-x-auto leading-relaxed">
{`{
  "track": "${type === "HACKATHON" ? "Autonomous Systems & Distributed Backend" : "AI Infrastructure Kernel Systems"}",
  "location": "${city} (In-Person)",
  "telemetry_engine": "HyperScale-Von-Telemetry-SDK-v1.4",
  "companion_required": ${requiresApp},
  "target_capacity": 500,
  "evaluation_metric": "Automated Code Velocity + NFC Arrival"
}`}
                </pre>
              </div>
            </div>

            {/* Right Column: Live Synchronous Specification Card (5 Cols) */}
            <div className="lg:col-span-5 space-y-4 sticky top-24">
              <div className="rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xl space-y-5 p-6">
                {/* Header status bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-850 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-slate-700 dark:text-zinc-300 text-[11px] font-bold">
                      LIVE SYNCHRONOUS SPECIFICATION
                    </span>
                  </div>
                  <span className="text-slate-400 dark:text-zinc-500 font-mono text-[10px]">Auto-synced</span>
                </div>

                {/* Banner graphic preview */}
                <div className="w-full h-32 rounded-xl bg-gradient-to-r from-blue-100 via-indigo-50 to-slate-100 dark:from-blue-900/40 dark:via-indigo-950/40 dark:to-black border border-blue-200 dark:border-zinc-800 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:12px_12px]" />
                  <div className="relative text-center space-y-1">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-600/30 border border-blue-500/30 dark:border-blue-500/40 mx-auto flex items-center justify-center text-xl">
                      🪐
                    </div>
                    <span className="text-[10px] font-mono text-blue-700 dark:text-blue-300 font-semibold">
                      HyperScale Labs • Official Host
                    </span>
                  </div>
                </div>

                {/* Badges strip */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 text-[10px] font-mono font-semibold">
                    In-Person Hackathon • Bengaluru
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 text-[10px] font-mono">
                    Teams of 2-4
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 text-[10px] font-mono">
                    36 Hours
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                    {description}
                  </p>
                </div>

                {/* Dates & Reward */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-850 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono uppercase">Event Timeline</div>
                    <div className="font-bold text-slate-900 dark:text-white">Dec 15-16, 2025</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono uppercase">Prize Allocation</div>
                    <div className="font-bold text-blue-600 dark:text-blue-400">{reward}</div>
                  </div>
                </div>

                {/* Companion App Callout */}
                {requiresApp && (
                  <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-500/30 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold">
                        <Smartphone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Host Requirement: Mandatory Companion App</span>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50 font-bold">
                        TESTNET-GATE-01/12
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                      Candidates must validate active installation with shadow telemetry logs enabled to receive passcodes at the entry checkpoint.
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-blue-200/60 dark:border-blue-900/40 text-[11px] font-mono">
                      <span className="text-blue-600 dark:text-blue-400 underline truncate max-w-[200px]">
                        app.hyperscale.xyz/companion
                      </span>
                      <span className="text-slate-400 dark:text-zinc-400 text-[10px]">Required Client</span>
                    </div>
                  </div>
                )}

                {/* Target Tech Stack */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono uppercase">
                    Target Candidate Preferred Tech Stack:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsStr.split(",").map((s) => (
                      <span
                        key={s.trim()}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 font-mono text-[10px]"
                      >
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Publish Action Button */}
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500 font-mono">
                    <span>Draft Blueprint Ready</span>
                    <span>v1.0.4-rc</span>
                  </div>

                  <button
                    type="button"
                    onClick={handlePublish}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/25"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Deploy & Publish Event</span>
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => alert("Draft saved locally to session storage")}
                      className="text-[11px] text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 font-mono underline"
                    >
                      Save as Private Draft
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: REGISTERED APPLICANTS & TEAMS (Screen 3 from Stitch)
          ========================================================================= */}
      {activeTab === "review_applicants" && (
        <div className="space-y-6">
          {/* Top Breadcrumb & Headline */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 dark:text-zinc-500">
                <span>Sub-Cohort Teams (146)</span>
                <span>•</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">OmniChain Autonomous Agent Hackathon 2025</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Registered Applicants & Teams
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Telemetry rosters, GitHub engineering profile analysis, companion app completion handshakes, and one-click vetting.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={exportToCSV}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-850 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
                <span>Export CSV Telemetry</span>
              </button>

              <button
                type="button"
                onClick={handleBatchApproveVerified}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/25"
              >
                <Check className="w-4 h-4" />
                <span>Batch Approve App-Verified Teams (122)</span>
              </button>
            </div>
          </div>

          {/* 4 Metric Tiles (Stitch Screen 3) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-1 shadow-xs">
              <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                Target Capacity
              </span>
              <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                500 Seats <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">(68%)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-1 shadow-xs">
              <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                Formed Squads
              </span>
              <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                122 Teams <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">(82.6%)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-1 shadow-xs">
              <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                Average Cohort Score
              </span>
              <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                708 <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">/ 1000</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-1 shadow-xs">
              <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                Pending Decisions
              </span>
              <div className="text-xl font-bold text-amber-600 dark:text-amber-400 tracking-tight">
                94 Teams
              </div>
            </div>
          </div>

          {/* Sub-Filter Tabs, Quick Skill Tags, and Search Row */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "ALL", label: "All 146" },
                  { id: "APP_VERIFIED", label: "Companion App Verified 122" },
                  { id: "TASK_PENDING", label: "Task Pending 24" },
                  { id: "APPROVED", label: "Approved 52" },
                  { id: "SHORTLISTED", label: "Shortlisted 18" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setApplicantFilter(tab.id as any);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      applicantFilter === tab.id
                        ? "bg-blue-600 text-white font-semibold shadow-xs"
                        : "bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 shadow-xs"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Right Sort Dropdown */}
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 font-mono">
                <span>Sorting:</span>
                <button
                  onClick={() => setSortDirection((d) => (d === "desc" ? "asc" : "desc"))}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white shadow-xs"
                >
                  <span>Highest GitHub Velocity</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
                </button>
              </div>
            </div>

            {/* Filter Search Input and Quick Skill Pills */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={applicantSearch}
                  onChange={(e) => {
                    setApplicantSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Filter by candidate name, team name, university, or tech stack..."
                  className="w-full bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                />
              </div>

              {/* Quick skill pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {["Rust", "Solidity", "Python", "Go", "Circom", "Full Stack (107)"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedSkillTag((prev) => (prev === tag ? null : tag));
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                      selectedSkillTag === tag
                        ? "bg-blue-600 text-white font-semibold"
                        : "bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 shadow-xs"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bulk Operations Toolbar */}
          {selectedApplicantIds.length > 0 && (
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/40 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in shadow-xs">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                <span className="font-bold text-blue-700 dark:text-blue-400">{selectedApplicantIds.length} candidate(s) selected</span>
                <span className="text-slate-500 dark:text-zinc-400">• Ready for batch review</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBulkApprove}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  Bulk Approve Selected
                </button>
                <button
                  type="button"
                  onClick={handleBulkDecline}
                  className="px-3.5 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 text-xs font-semibold transition-colors"
                >
                  Bulk Decline Selected
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedApplicantIds([])}
                  className="px-2 py-1 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white text-xs"
                >
                  Deselect All
                </button>
              </div>
            </div>
          )}

          {/* Telemetry Data Table (Stitch Screen 3 Exact Structure) */}
          <div className="rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-mono text-[10px] bg-slate-50 dark:bg-black/60">
                    <th className="py-3.5 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={
                          paginatedRegistrations.length > 0 &&
                          paginatedRegistrations.every((r) =>
                            selectedApplicantIds.includes(r.id)
                          )
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="py-3.5 px-4">TEAM / CANDIDATE</th>
                    <th className="py-3.5 px-4">LEAD & UNIVERSITY</th>
                    <th className="py-3.5 px-4">TOP VERIFIED SKILLS</th>
                    <th className="py-3.5 px-4">GITHUB TELEMETRY</th>
                    <th className="py-3.5 px-4">HOST COMPANION APP STATUS</th>
                    <th className="py-3.5 px-5 text-right">REVIEW ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-zinc-850">
                  {paginatedRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-zinc-500">
                        No candidate squads found matching the active filter criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedRegistrations.map((reg) => {
                      const isSelected = selectedApplicantIds.includes(reg.id);
                      return (
                        <tr
                          key={reg.id}
                          className={`hover:bg-slate-50 dark:hover:bg-zinc-900/40 transition-colors ${
                            isSelected ? "bg-blue-50/70 dark:bg-blue-950/15" : ""
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="py-4 px-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectOne(reg.id)}
                              className="w-3.5 h-3.5 rounded border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-blue-600 focus:ring-0 cursor-pointer"
                            />
                          </td>

                          {/* Column 1: Team / Candidate */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center font-bold text-slate-800 dark:text-white text-xs shrink-0">
                                {reg.teamName ? "🛡️" : "👤"}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                                  <span>{reg.teamName || reg.userName}</span>
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                                  {reg.memberCount && reg.memberCount > 1
                                    ? `${reg.memberCount} Members • Squad`
                                    : "Solo Developer"}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Column 2: Lead & University */}
                          <td className="py-4 px-4">
                            <div className="font-semibold text-slate-900 dark:text-white">{reg.userName}</div>
                            <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                              {reg.university || "IIT Roorkee ('25)"}
                            </div>
                          </td>

                          {/* Column 3: Top Verified Skills */}
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                              {reg.userSkills.slice(0, 3).map((s) => (
                                <span
                                  key={s}
                                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Column 4: GitHub Telemetry */}
                          <td className="py-4 px-4 font-mono">
                            <div className="flex items-center gap-2">
                              <Github className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                              <span className="font-bold text-slate-900 dark:text-white text-xs">
                                {reg.githubVelocity?.commitsPerYear || 526}
                              </span>
                              <span className="text-[11px] text-slate-500 dark:text-zinc-400">commits / yr</span>
                            </div>
                            <div className="text-[10px] text-slate-400 dark:text-zinc-500 pl-5">
                              {reg.githubVelocity?.publicRepos || 28} public repositories
                            </div>
                          </td>

                          {/* Column 5: Host Companion App Status */}
                          <td className="py-4 px-4">
                            {reg.completedAppDownload ? (
                              <div className="space-y-0.5">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 font-mono">
                                  <Check className="w-3 h-3" />
                                  <span>Completed & Handshake</span>
                                </span>
                                <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                                  Device ID: {reg.deviceId || "dev-c743-f823-ce"}
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-0.5">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 font-mono">
                                  <Clock className="w-3 h-3" />
                                  <span>Pending Install</span>
                                </span>
                                <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                                  0 Host Pings
                                </div>
                              </div>
                            )}
                          </td>

                          {/* Column 6: Review Actions */}
                          <td className="py-4 px-5 text-right space-x-1.5">
                            {/* Inspect Passport Button */}
                            <button
                              type="button"
                              onClick={() => setInspectingApplicant(reg)}
                              title="Inspect Candidate Passport"
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-colors shadow-xs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => updateRegistrationStatus(reg.id, "APPROVED")}
                              className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] transition-colors shadow-xs ${
                                reg.status === "APPROVED"
                                  ? "bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 cursor-default"
                                  : "bg-blue-600 hover:bg-blue-500 text-white"
                              }`}
                            >
                              {reg.status === "APPROVED" ? "Approved" : "Approve"}
                            </button>

                            <button
                              type="button"
                              onClick={() => updateRegistrationStatus(reg.id, "REJECTED")}
                              className="px-2 py-1 text-slate-400 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 text-[11px] transition-colors"
                            >
                              Decline ▾
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Stitch Metrics & Pagination */}
            <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-black/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-zinc-400">
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span>Showing 1-4 of 146 registered teams</span>
                <span>•</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                  122 Ready for automated fast-track badge issue
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors shadow-xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <span className="px-2 font-mono text-[11px] text-slate-400 dark:text-zinc-500">
                  Page 1 of 37
                </span>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors shadow-xs"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 3 Bottom Feature Explainers (Stitch Screen 3 Bottom) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs tracking-tight">
                <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Companion Compliant SLA</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                Participants verify their local device identity through the TalentOrbit mobile companion app to secure arrival badges.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs tracking-tight">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Automated Skill Score</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                Parsed with autonomous agent models (LangChain, AutoGPT, ZK proofs) against enterprise industry prioritization telemetry.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs tracking-tight">
                <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>One-Click Dispatch</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                Approvals immediately generate authenticated Discord invitations, HackerPass QR keys, and event stipend allocations.
              </p>
            </div>
          </div>

          {/* Candidate Inspection Modal */}
          {inspectingApplicant && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
              <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 shadow-2xl p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Candidate Passport Verification
                    </span>
                  </div>
                  <button
                    onClick={() => setInspectingApplicant(null)}
                    className="w-7 h-7 rounded-lg border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Candidate Identity */}
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-850">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                      {inspectingApplicant.userName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {inspectingApplicant.userName}
                      </div>
                      <div className="text-slate-500 dark:text-zinc-400 font-mono text-[11px]">
                        {inspectingApplicant.userEmail}
                      </div>
                    </div>
                  </div>

                  {/* Applied Event & Team Details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 space-y-1">
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono uppercase">
                        Opportunity
                      </span>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {inspectingApplicant.eventTitle}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 space-y-1">
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono uppercase">
                        Roster Format
                      </span>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {inspectingApplicant.teamName ? `Team: ${inspectingApplicant.teamName}` : "Individual (Solo)"}
                      </div>
                    </div>
                  </div>

                  {/* GitHub Telemetry */}
                  {inspectingApplicant.githubUsername && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Github className="w-4 h-4 text-slate-700 dark:text-white" />
                        <span className="font-mono text-slate-700 dark:text-zinc-300">
                          @{inspectingApplicant.githubUsername}
                        </span>
                      </div>
                      <a
                        href={`https://github.com/${inspectingApplicant.githubUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                      >
                        <span>View Repositories</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {/* Verified Skills */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono uppercase">
                      Verified Technical Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-850">
                      {inspectingApplicant.userSkills.map((s: string) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 font-mono text-[10px]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      updateRegistrationStatus(inspectingApplicant.id, "REJECTED");
                      setInspectingApplicant(null);
                    }}
                    className="px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold transition-colors"
                  >
                    Decline Candidate
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateRegistrationStatus(inspectingApplicant.id, "APPROVED");
                      setInspectingApplicant(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-blue-500/25"
                  >
                    Approve Candidate
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB: TASKS & LIVE COMPETITION ARENA (Admin can create task, view completion, etc.)
          ========================================================================= */}
      {activeTab === "tasks_competition" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[10px] font-mono text-slate-500 dark:text-zinc-400 tracking-wider">
                OPERATIONS // CHALLENGES • TASK_ENGINE V2.4
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Task Operations & Live Competition Arena
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Create engineering milestones, monitor companion app hardware check-ins, grade submissions, and oversee live hackathon leaderboard standings.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const headers = ["Rank", "Squad Name", "Lead", "Total Score", "Tasks Completed", "Commits/Yr", "Companion Handshake", "Status"];
                  const rows = competitionStandings.map((s) => [
                    s.rank,
                    `"${s.teamName}"`,
                    `"${s.leadName}"`,
                    s.totalScore,
                    `"${s.tasksCompleted}/${s.totalTasks}"`,
                    s.githubCommitsPerYear,
                    s.companionHandshake ? "VERIFIED" : "PENDING",
                    s.status,
                  ]);
                  const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
                  const link = document.createElement("a");
                  link.href = encodeURI(csv);
                  link.download = `talentorbit_standings_${Date.now()}.csv`;
                  link.click();
                }}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-850 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
                <span>Export Standings CSV</span>
              </button>

              <button
                onClick={() => setTasksSubView("create_task")}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/25"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Create New Task</span>
              </button>
            </div>
          </div>

          {/* Sub-Navigation Switcher Row */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-zinc-850 pb-3">
            {[
              { id: "directory", label: `Milestones & Rubrics (${tasks.length})`, icon: Calendar },
              { id: "create_task", label: "+ Create New Task (Studio)", icon: PlusCircle },
              {
                id: "submissions",
                label: `Review Submissions (${taskSubmissions.filter((s) => s.status === "PENDING_REVIEW").length} Pending)`,
                icon: FileText,
              },
              {
                id: "completed_participants",
                label: `Completed Participants (${competitionStandings.filter((s) => s.tasksCompleted > 0).length})`,
                icon: UserCheck,
              },
              { id: "leaderboard", label: `Live Leaderboard (${competitionStandings.length} Squads)`, icon: Trophy },
            ].map((sub) => {
              const Icon = sub.icon;
              const isActive = tasksSubView === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setTasksSubView(sub.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 shadow-xs"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>

          {/* =====================================================================
              SUB-VIEW 1: TASK DIRECTORY & PROGRESS ("VIEW COMPLETION")
              ===================================================================== */}
          {tasksSubView === "directory" && (
            <div className="space-y-6">
              {/* 4 Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-1 shadow-xs">
                  <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                    Total Active Tasks
                  </span>
                  <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {tasks.length} Milestones
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400">Across {events.length} active tracks</div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-1 shadow-xs">
                  <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                    Overall Completion
                  </span>
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                    74.8%
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "74.8%" }} />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-1 shadow-xs">
                  <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                    NFC App Handshakes
                  </span>
                  <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    122 Verified
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400">Hardware tokens synchronized</div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-1 shadow-xs">
                  <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                    Pending Evaluations
                  </span>
                  <div className="text-xl font-bold text-amber-600 dark:text-amber-400 tracking-tight">
                    {taskSubmissions.filter((s) => s.status === "PENDING_REVIEW").length} Awaiting Review
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400">Ready for scoring feedback</div>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">Filter by Track:</span>
                  <select
                    value={selectedTaskEventFilter}
                    onChange={(e) => setSelectedTaskEventFilter(e.target.value)}
                    className="bg-white dark:bg-[#0F0F12] border border-slate-300 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-xs"
                  >
                    <option value="ALL">All Event Tracks ({tasks.length})</option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={taskSearchQuery}
                    onChange={(e) => setTaskSearchQuery(e.target.value)}
                    placeholder="Search milestones..."
                    className="bg-white dark:bg-[#0F0F12] border border-slate-300 dark:border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 w-56 transition-colors shadow-xs"
                  />
                </div>
              </div>

              {/* Task Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasks
                  .filter((t) => {
                    if (selectedTaskEventFilter !== "ALL" && t.eventId !== selectedTaskEventFilter) return false;
                    if (taskSearchQuery.trim()) {
                      const q = taskSearchQuery.toLowerCase();
                      return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
                    }
                    return true;
                  })
                  .map((task) => {
                    const pct = Math.round((task.completedCount / Math.max(1, task.assignedCount)) * 100);
                    const taskSubs = taskSubmissions.filter((s) => s.taskId === task.id);
                    return (
                      <div
                        key={task.id}
                        className="p-6 rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-all space-y-5 flex flex-col justify-between shadow-xs"
                      >
                        <div className="space-y-3.5">
                          {/* Top Badges */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 font-semibold">
                                {task.type.replace(/_/g, " ")}
                              </span>
                              {task.isRequired ? (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/40 font-semibold">
                                  Mandatory Gate
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400">
                                  Elective Track
                                </span>
                              )}
                            </div>

                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                              +{task.points} pts
                            </span>
                          </div>

                          <div>
                            <div className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono">
                              {task.eventTitle}
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
                              {task.title}
                            </h3>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                            {task.description}
                          </p>

                          {/* Completion Progress Bar */}
                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-slate-500 dark:text-zinc-400">Squad Completion Rate:</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                {task.completedCount} / {task.assignedCount} Completed ({pct}%)
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-zinc-900 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-emerald-500 h-full rounded-full transition-all"
                                style={{ width: `${Math.min(100, pct)}%` }}
                              />
                            </div>
                          </div>

                          {/* Evaluation Criteria Checklist */}
                          {task.rubricCriteria && task.rubricCriteria.length > 0 && (
                            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-zinc-850">
                              <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono uppercase">
                                Acceptance Criteria & Rubric:
                              </div>
                              <div className="space-y-1">
                                {task.rubricCriteria.map((c, i) => (
                                  <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-zinc-300">
                                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                    <span>{c}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Card Footer Actions */}
                        <div className="pt-4 border-t border-slate-100 dark:border-zinc-850 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-1.5 text-slate-400 dark:text-zinc-500 font-mono text-[11px]">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Due {new Date(task.deadline).toLocaleDateString()}</span>
                          </div>

                          <button
                            onClick={() => setTasksSubView("submissions")}
                            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1 transition-colors shadow-sm"
                          >
                            <span>Submissions ({taskSubs.length})</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* =====================================================================
              SUB-VIEW 2: TASK CREATION STUDIO ("ADMIN CAN CREATE A TASK")
              ===================================================================== */}
          {tasksSubView === "create_task" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Form: Task Builder Studio (7 Cols) */}
              <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 p-8 space-y-6 shadow-xs">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span>Create & Broadcast New Milestone Task</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Define technical deliverables, rubrics, and automated completion verification gates for competing squads.
                  </p>
                </div>

                {/* Gemini AI Task Rubric Generator Prompt */}
                <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Gemini AI Task & Rubric Architect:</span>
                    </label>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/40 font-bold">
                      Auto-Generator
                    </span>
                  </div>
                  <input
                    type="text"
                    value={taskAiPrompt}
                    onChange={(e) => setTaskAiPrompt(e.target.value)}
                    placeholder="e.g. Design a real-time benchmarking task for autonomous agent swarms..."
                    className="w-full bg-white dark:bg-[#080808] border border-slate-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateTaskWithAI}
                    disabled={isGeneratingTaskAI}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-blue-500/25"
                  >
                    {isGeneratingTaskAI ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {isGeneratingTaskAI ? "Gemini is Drafting Task Rubric..." : "Generate Task & Rubric with AI"}
                    </span>
                  </button>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleCreateNewTask} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                        Target Hackathon / Event Track
                      </label>
                      <select
                        value={newTaskEventId}
                        onChange={(e) => setNewTaskEventId(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      >
                        {events.map((ev) => (
                          <option key={ev.id} value={ev.id}>
                            {ev.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                        Milestone Category / Type
                      </label>
                      <select
                        value={newTaskType}
                        onChange={(e) => setNewTaskType(e.target.value as TaskType)}
                        className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="CODE_SUBMISSION">Code Repository Submission</option>
                        <option value="COMPANION_APP">Companion App & NFC Check-in</option>
                        <option value="API_BENCHMARK">Live API & Stress Benchmark</option>
                        <option value="IDEATION_DECK">Architecture & Slide Deck</option>
                        <option value="VERIFICATION">Identity & Verification Gate</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                      Milestone Task Title
                    </label>
                    <input
                      type="text"
                      required
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="e.g. Milestone 3: Zero-Knowledge Verification Proof Circuits"
                      className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                        Points Allocation (Weight)
                      </label>
                      <input
                        type="number"
                        required
                        min={50}
                        max={1000}
                        step={25}
                        value={newTaskPoints}
                        onChange={(e) => setNewTaskPoints(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                        Submission Deadline
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={newTaskDeadline}
                        onChange={(e) => setNewTaskDeadline(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                      Problem Statement & Deliverable Specifications
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      placeholder="Outline technical expectations, repository folder structure, dependencies..."
                      className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-lg p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                      Acceptance Criteria & Rubric Checklist (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newTaskRubricStr}
                      onChange={(e) => setNewTaskRubricStr(e.target.value)}
                      placeholder="e.g. Correct Circom constraints, Sub-200ms witness generation, Passing unit tests"
                      className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                    <input
                      type="checkbox"
                      id="mandCheck"
                      checked={newTaskIsRequired}
                      onChange={(e) => setNewTaskIsRequired(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="mandCheck" className="text-xs text-slate-800 dark:text-white font-medium cursor-pointer">
                      Mandatory Checkpoint (Required before advancing to subsequent stages or finals)
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setTasksSubView("directory")}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white text-xs font-medium transition-colors shadow-xs"
                    >
                      Cancel
                    </button>

                    <div className="flex items-center gap-3">
                      {taskCreatedSuccess && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Task dispatched to all registered squads!</span>
                        </span>
                      )}

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-blue-500/25"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Publish & Dispatch Task</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Right Live Preview Card (5 Cols) */}
              <div className="lg:col-span-5 space-y-4 sticky top-24">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                  <span className="font-semibold uppercase tracking-wider">
                    Student Participant Live Preview
                  </span>
                  <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">
                    Real-time Rendering
                  </span>
                </div>

                <div className="rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 text-[10px] font-mono font-semibold">
                      {newTaskType.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                      +{newTaskPoints} pts
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono uppercase">
                      {events.find((e) => e.id === newTaskEventId)?.title || "OmniChain Hackathon"}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
                      {newTaskTitle || "Milestone Task Title"}
                    </h4>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {newTaskDescription || "Deliverable instructions and challenge specifications..."}
                  </p>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-850 space-y-1.5">
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono uppercase">
                      Evaluation Rubric Checklist:
                    </span>
                    <div className="space-y-1">
                      {newTaskRubricStr
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((r, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-zinc-300">
                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>{r}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-zinc-850 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 font-mono">
                    <span>Deadline: {new Date(newTaskDeadline).toLocaleDateString()}</span>
                    <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 text-[11px]">
                      Dropzone Ready
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              SUB-VIEW 3: SUBMISSION REVIEW & GRADING ("THE HOST CAN VIEW THE SUBMITTED TASK OF STUDENTS")
              ===================================================================== */}
          {tasksSubView === "submissions" && (() => {
            const pendingCount = taskSubmissions.filter((s) => s.status === "PENDING_REVIEW").length;
            const completedCount = taskSubmissions.filter((s) => s.status === "COMPLETED" || s.status === "VERIFIED").length;
            const reviseCount = taskSubmissions.filter((s) => s.status === "REVISE_REQUESTED" || s.status === "REJECTED").length;

            const filteredSubs = taskSubmissions.filter((sub) => {
              if (submissionFilter === "PENDING" && sub.status !== "PENDING_REVIEW") return false;
              if (submissionFilter === "COMPLETED" && sub.status !== "COMPLETED" && sub.status !== "VERIFIED") return false;
              if (submissionFilter === "REVISE" && sub.status !== "REVISE_REQUESTED" && sub.status !== "REJECTED") return false;
              if (submissionSearch.trim()) {
                const q = submissionSearch.toLowerCase();
                const matchTeam = sub.teamName?.toLowerCase().includes(q);
                const matchLead = sub.leadName?.toLowerCase().includes(q);
                const matchTitle = sub.taskTitle?.toLowerCase().includes(q);
                const matchNotes = sub.submissionNotes?.toLowerCase().includes(q);
                if (!matchTeam && !matchLead && !matchTitle && !matchNotes) return false;
              }
              return true;
            });

            return (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                      Squad Submissions & Evaluation Queue
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Review candidate deliverable links, inspect code quality, assign milestone points, and issue completion certificates.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">Queue Status:</span>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 text-xs font-mono font-semibold">
                      {completedCount} Completed
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 text-xs font-mono font-semibold">
                      {pendingCount} Pending Review
                    </span>
                  </div>
                </div>

                {/* Filters & Search Row for Submissions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
                    {[
                      { id: "ALL", label: `All (${taskSubmissions.length})` },
                      { id: "PENDING", label: `Pending Review (${pendingCount})` },
                      { id: "COMPLETED", label: `Completed (${completedCount})` },
                      { id: "REVISE", label: `Needs Revision (${reviseCount})` },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setSubmissionFilter(tab.id as any)}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          submissionFilter === tab.id
                            ? "bg-blue-600 text-white font-bold shadow-xs"
                            : "bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={submissionSearch}
                      onChange={(e) => setSubmissionSearch(e.target.value)}
                      placeholder="Search submissions by team, lead, task..."
                      className="bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 w-64 shadow-xs"
                    />
                  </div>
                </div>

                {/* Submissions Table */}
                <div className="rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-mono text-[10px] bg-slate-50 dark:bg-black/60">
                          <th className="py-3.5 px-4">SQUAD / CANDIDATE</th>
                          <th className="py-3.5 px-4">MILESTONE TASK</th>
                          <th className="py-3.5 px-4">SUBMITTED DELIVERABLE</th>
                          <th className="py-3.5 px-4">COMPANION STATUS</th>
                          <th className="py-3.5 px-4">STATUS & SCORE</th>
                          <th className="py-3.5 px-5 text-right">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-zinc-850">
                        {filteredSubs.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-zinc-600 font-mono">
                              No submissions found matching "{submissionFilter}".
                            </td>
                          </tr>
                        ) : (
                          filteredSubs.map((sub) => (
                            <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-zinc-900/40 transition-colors">
                              <td className="py-4 px-4">
                                <div className="font-bold text-slate-900 dark:text-white text-sm">{sub.teamName}</div>
                                <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">{sub.leadName}</div>
                              </td>

                              <td className="py-4 px-4">
                                <div className="font-semibold text-slate-900 dark:text-white">{sub.taskTitle}</div>
                                <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                                  Max: {sub.maxScore} pts
                                </div>
                              </td>

                              <td className="py-4 px-4 font-mono">
                                <a
                                  href={sub.submissionUrl || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 truncate max-w-[220px]"
                                >
                                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                  <span className="truncate">{sub.submissionUrl || "No link"}</span>
                                </a>
                                {sub.submissionNotes && (
                                  <div className="text-[10px] text-slate-500 dark:text-zinc-400 truncate max-w-[220px] mt-0.5">
                                    {sub.submissionNotes}
                                  </div>
                                )}
                              </td>

                              <td className="py-4 px-4">
                                {sub.companionAppVerified ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 font-mono">
                                    <Check className="w-3 h-3" />
                                    <span>Handshake Verified</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 font-mono">
                                    <Clock className="w-3 h-3" />
                                    <span>Pending Install</span>
                                  </span>
                                )}
                              </td>

                              <td className="py-4 px-4">
                                {sub.status === "COMPLETED" || sub.status === "VERIFIED" ? (
                                  <div>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 font-mono">
                                      COMPLETED ({sub.score}/{sub.maxScore} pts)
                                    </span>
                                    {sub.feedback && (
                                      <div className="text-[10px] text-slate-400 dark:text-zinc-500 truncate max-w-[200px] mt-0.5">
                                        "{sub.feedback}"
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 font-mono">
                                    PENDING REVIEW
                                  </span>
                                )}
                              </td>

                              <td className="py-4 px-5 text-right">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setInspectingSubmission(sub);
                                    setGradingScore(sub.score ?? sub.maxScore ?? 340);
                                    setGradingFeedback(sub.feedback || "Solid implementation matching technical requirements and architecture standards.");
                                  }}
                                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] transition-colors shadow-xs cursor-pointer"
                                >
                                  Grade / Review
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Grading Modal */}
                {inspectingSubmission && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
                    <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 shadow-2xl p-6 space-y-5">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                            Milestone Submission Evaluation
                          </span>
                        </div>
                        <button
                          onClick={() => setInspectingSubmission(null)}
                          className="w-7 h-7 rounded-lg border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-4 text-xs">
                        {/* Team & Task Identity */}
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-850 space-y-1">
                          <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono uppercase">
                            {inspectingSubmission.taskTitle}
                          </div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm">
                            {inspectingSubmission.teamName} • {inspectingSubmission.leadName}
                          </div>
                          <div className="pt-1">
                            <a
                              href={inspectingSubmission.submissionUrl || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 font-mono text-xs"
                            >
                              <span>Inspect Artifact: {inspectingSubmission.submissionUrl || "None provided"}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          {inspectingSubmission.submissionNotes && (
                            <div className="text-[11px] text-slate-600 dark:text-zinc-400 pt-1 border-t border-slate-200 dark:border-zinc-800 mt-2">
                              <strong>Notes:</strong> {inspectingSubmission.submissionNotes}
                            </div>
                          )}
                        </div>

                        {/* Score Input */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                              Milestone Points Awarded (Max: {inspectingSubmission.maxScore} pts):
                            </label>
                            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                              {gradingScore} / {inspectingSubmission.maxScore} pts
                            </span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={inspectingSubmission.maxScore}
                            step={5}
                            value={gradingScore}
                            onChange={(e) => setGradingScore(Number(e.target.value))}
                            className="w-full accent-blue-600 cursor-pointer"
                          />
                        </div>

                        {/* Feedback Textarea */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                            Evaluator Feedback & Code Review Notes:
                          </label>
                          <textarea
                            rows={3}
                            value={gradingFeedback}
                            onChange={(e) => setGradingFeedback(e.target.value)}
                            placeholder="e.g. Exceptional architecture with custom message queues and clean Dockerfile..."
                            className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-lg p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      {/* Modal Footer Actions */}
                      <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleConfirmGrade("REVISE_REQUESTED")}
                          className="px-3.5 py-2 rounded-xl border border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Request Revision
                        </button>

                        <button
                          type="button"
                          onClick={() => handleConfirmGrade("COMPLETED")}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-blue-500/25 cursor-pointer"
                        >
                          Approve & Mark Completed
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* =====================================================================
              SUB-VIEW 4: COMPLETED PARTICIPANTS ("THE HOST CAN VIEW THE PARTICIPANT THAT COMPLETED THE TASK")
              ===================================================================== */}
          {tasksSubView === "completed_participants" && (() => {
            const completedSquads = competitionStandings.filter((s) => s.tasksCompleted > 0);
            const perfectSquads = completedSquads.filter((s) => s.tasksCompleted >= s.totalTasks);

            const filteredCompleted = completedSquads.filter((s) => {
              if (completedParticipantsFilter === "PERFECT_SCORE" && s.tasksCompleted < s.totalTasks) return false;
              if (completedParticipantsFilter === "FAST_TRACKED" && !fastTrackedTeams.includes(s.teamName)) return false;
              if (completedParticipantsSearch.trim()) {
                const q = completedParticipantsSearch.toLowerCase();
                return s.teamName.toLowerCase().includes(q) || s.leadName.toLowerCase().includes(q);
              }
              return true;
            });

            return (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-emerald-500" />
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Task Completion Registry & Qualified Participants
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                      Inspect candidates and squads who have fulfilled technical milestones, earned evaluation points, and verified their deliverables.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/40 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{completedSquads.length} Qualified Squads</span>
                  </div>
                </div>

                {/* 4 Summary Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-1 shadow-xs">
                    <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                      Squads with Completions
                    </span>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {completedSquads.length}
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                      ● Technical criteria met
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-1 shadow-xs">
                    <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                      100% Milestones Done
                    </span>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
                      {perfectSquads.length} Squads
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-zinc-400">All checkpoints passed</div>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-1 shadow-xs">
                    <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                      Top Milestone XP
                    </span>
                    <div className="text-2xl font-bold text-amber-500 tracking-tight">
                      {Math.max(...competitionStandings.map((s) => s.totalScore), 0)} pts
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-zinc-400">Leaderboard apex</div>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-1 shadow-xs">
                    <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                      Fast-Tracked Finalists
                    </span>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 tracking-tight">
                      {fastTrackedTeams.length} Teams
                    </div>
                    <div className="text-[11px] text-purple-600 dark:text-purple-400">Direct Grand Finale Pass</div>
                  </div>
                </div>

                {/* Filters & Search Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
                    {[
                      { id: "ALL", label: `All Completed (${completedSquads.length})` },
                      { id: "PERFECT_SCORE", label: `100% Checkpoints (${perfectSquads.length})` },
                      { id: "FAST_TRACKED", label: `Fast-Track Finalists (${fastTrackedTeams.length})` },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setCompletedParticipantsFilter(tab.id as any)}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          completedParticipantsFilter === tab.id
                            ? "bg-blue-600 text-white font-bold shadow-xs"
                            : "bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={completedParticipantsSearch}
                      onChange={(e) => setCompletedParticipantsSearch(e.target.value)}
                      placeholder="Search candidate, team, or college..."
                      className="bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 w-64 shadow-xs"
                    />
                  </div>
                </div>

                {/* Completed Participants Table */}
                <div className="rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-mono text-[10px] bg-slate-50 dark:bg-black/60">
                          <th className="py-3.5 px-4">PARTICIPANT / SQUAD</th>
                          <th className="py-3.5 px-4">COMPLETED MILESTONES</th>
                          <th className="py-3.5 px-4">AGGREGATE XP SCORE</th>
                          <th className="py-3.5 px-4">COMPANION NFC STATUS</th>
                          <th className="py-3.5 px-4">SELECTION STATUS</th>
                          <th className="py-3.5 px-5 text-right">HOST ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-zinc-850">
                        {filteredCompleted.map((squad) => {
                          const isFast = fastTrackedTeams.includes(squad.teamName);
                          const squadSubs = taskSubmissions.filter(
                            (s) =>
                              (s.teamName === squad.teamName || s.leadName?.includes(squad.leadName.split(" ")[0])) &&
                              (s.status === "COMPLETED" || s.status === "VERIFIED")
                          );
                          const completedTitles = squadSubs.length > 0
                            ? squadSubs.map((s) => s.taskTitle || "Technical Milestone")
                            : ["Milestone 1: Multi-Agent Swarm Architecture", "Milestone 2: Companion App NFC Handshake"];

                          return (
                            <tr key={squad.teamName} className="hover:bg-slate-50 dark:hover:bg-zinc-900/40 transition-colors">
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center font-mono text-xs shadow-xs">
                                    {squad.teamName.substring(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                                      {squad.teamName}
                                    </div>
                                    <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                                      {squad.leadName}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-4 px-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                      {squad.tasksCompleted} of {squad.totalTasks} Completed
                                    </span>
                                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 font-bold">
                                      {Math.round((squad.tasksCompleted / squad.totalTasks) * 100)}%
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {completedTitles.slice(0, 2).map((title, i) => (
                                      <span
                                        key={i}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[10px] text-slate-700 dark:text-zinc-300 font-mono"
                                      >
                                        <Check className="w-2.5 h-2.5 text-emerald-500" />
                                        <span className="truncate max-w-[130px]">{title.replace(/Milestone \d: /, "")}</span>
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </td>

                              <td className="py-4 px-4 font-mono">
                                <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                  {squad.totalScore} pts
                                </div>
                                <div className="text-[10px] text-slate-400 dark:text-zinc-500">
                                  Max {squad.maxPossibleScore} pts
                                </div>
                              </td>

                              <td className="py-4 px-4">
                                {squad.companionHandshake ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 font-mono">
                                    <Check className="w-3 h-3" />
                                    <span>Kiosk A-2 Verified</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 font-mono">
                                    <Clock className="w-3 h-3" />
                                    <span>Pending Turnstile</span>
                                  </span>
                                )}
                              </td>

                              <td className="py-4 px-4">
                                {isFast ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 shadow-xs">
                                    <Sparkles className="w-3 h-3 text-purple-500" />
                                    <span>GRAND FINALIST</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">
                                    QUALIFIED
                                  </span>
                                )}
                              </td>

                              <td className="py-4 px-5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {/* Issue Certificate Action */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCertificateModalData({
                                        isOpen: true,
                                        squadName: squad.teamName,
                                        leadName: squad.leadName,
                                        eventTitle: "OmniChain Autonomous Agent Hackathon 2025",
                                        totalScore: squad.totalScore,
                                        completedTasks: completedTitles,
                                      });
                                    }}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-700 dark:text-zinc-300 text-[11px] font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                                    title="Generate verified milestone credential"
                                  >
                                    <Award className="w-3.5 h-3.5 text-amber-500" />
                                    <span>Certificate</span>
                                  </button>

                                  {/* Fast Track Action */}
                                  {isFast ? (
                                    <span className="text-purple-600 dark:text-purple-400 font-mono text-[11px] font-bold px-2 py-1">
                                      Invited ✓
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleFastTrack(squad.teamName)}
                                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] transition-colors shadow-xs cursor-pointer"
                                    >
                                      Fast-Track ➔
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* =====================================================================
              SUB-VIEW 4: LIVE COMPETITION LEADERBOARD ("VIEW COMPETITION")
              ===================================================================== */}
          {tasksSubView === "leaderboard" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                      Live Hackathon Competition Leaderboard
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                    Real-time leaderboard updated from verified task completion scores, companion app telemetry, and code review velocity.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Telemetry Live Sync</span>
                </div>
              </div>

              {/* Top 3 Podium Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {competitionStandings.slice(0, 3).map((standing) => {
                  const isFirst = standing.rank === 1;
                  return (
                    <div
                      key={standing.teamName}
                      className={`p-6 rounded-2xl bg-white dark:bg-[#0F0F12] border transition-all space-y-4 relative overflow-hidden shadow-xs ${
                        isFirst
                          ? "border-amber-400 dark:border-amber-500/50 shadow-md shadow-amber-500/10"
                          : "border-slate-200 dark:border-zinc-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">
                          {standing.rank === 1 ? "🥇" : standing.rank === 2 ? "🥈" : "🥉"}
                        </span>
                        <span
                          className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                            standing.status === "LEADER"
                              ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50"
                              : "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50"
                          }`}
                        >
                          {standing.status.replace(/_/g, " ")}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                          {standing.teamName}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-0.5">
                          {standing.leadName}
                        </p>
                      </div>

                      <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-850">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-500 dark:text-zinc-400">Total Score:</span>
                          <span className="text-slate-900 dark:text-white font-bold text-sm">
                            {standing.totalScore} / {standing.maxPossibleScore} pts
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{
                              width: `${Math.round((standing.totalScore / standing.maxPossibleScore) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-zinc-500">
                        <span>{standing.tasksCompleted} / {standing.totalTasks} Tasks Done</span>
                        <span>{standing.githubCommitsPerYear} commits / yr</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Full Standings Data Table */}
              <div className="rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-mono text-[10px] bg-slate-50 dark:bg-black/60">
                        <th className="py-3.5 px-4 w-16">RANK</th>
                        <th className="py-3.5 px-4">SQUAD & LEAD</th>
                        <th className="py-3.5 px-4">TASKS COMPLETED</th>
                        <th className="py-3.5 px-4">TOTAL SCORE</th>
                        <th className="py-3.5 px-4">GITHUB VELOCITY</th>
                        <th className="py-3.5 px-4">COMPANION HANDSHAKE</th>
                        <th className="py-3.5 px-4">STATUS</th>
                        <th className="py-3.5 px-5 text-right">DISPATCH ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-zinc-850">
                      {competitionStandings.map((standing) => {
                        const isFastTracked = fastTrackedTeams.includes(standing.teamName);
                        return (
                          <tr key={standing.teamName} className="hover:bg-slate-50 dark:hover:bg-zinc-900/40 transition-colors">
                            <td className="py-4 px-4 font-mono font-bold text-slate-900 dark:text-white text-sm">
                              #{standing.rank}
                            </td>

                            <td className="py-4 px-4">
                              <div className="font-bold text-slate-900 dark:text-white text-sm">{standing.teamName}</div>
                              <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">{standing.leadName}</div>
                            </td>

                            <td className="py-4 px-4 font-mono">
                              <div className="text-slate-900 dark:text-white font-semibold">
                                {standing.tasksCompleted} / {standing.totalTasks} Done
                              </div>
                              <div className="w-24 bg-slate-100 dark:bg-zinc-900 h-1 rounded-full overflow-hidden mt-1">
                                <div
                                  className="bg-emerald-500 h-full rounded-full"
                                  style={{
                                    width: `${Math.round((standing.tasksCompleted / standing.totalTasks) * 100)}%`,
                                  }}
                                />
                              </div>
                            </td>

                            <td className="py-4 px-4 font-mono">
                              <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                {standing.totalScore} pts
                              </div>
                              <div className="text-[10px] text-slate-400 dark:text-zinc-500">
                                Max {standing.maxPossibleScore}
                              </div>
                            </td>

                            <td className="py-4 px-4 font-mono text-slate-700 dark:text-zinc-300">
                              <div className="flex items-center gap-1.5">
                                <Github className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                                <span>{standing.githubCommitsPerYear} commits / yr</span>
                              </div>
                            </td>

                            <td className="py-4 px-4">
                              {standing.companionHandshake ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 font-mono">
                                  <Check className="w-3 h-3" />
                                  <span>Hardware Sync</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 font-mono">
                                  <Clock className="w-3 h-3" />
                                  <span>Pending</span>
                                </span>
                              )}
                            </td>

                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold ${
                                  standing.status === "LEADER"
                                    ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40"
                                    : standing.status === "QUALIFIED_FINAL"
                                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40"
                                    : "bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800"
                                }`}
                              >
                                {standing.status.replace(/_/g, " ")}
                              </span>
                            </td>

                            <td className="py-4 px-5 text-right">
                              {isFastTracked ? (
                                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold inline-flex items-center gap-1">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Fast-Tracked!</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleFastTrack(standing.teamName)}
                                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] transition-colors shadow-xs"
                                >
                                  Fast-Track Final ➔
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Verified Milestone Credential Certificate Modal */}
          <MilestoneCertificateModal
            isOpen={certificateModalData.isOpen}
            onClose={() => setCertificateModalData((prev) => ({ ...prev, isOpen: false }))}
            squadName={certificateModalData.squadName}
            leadName={certificateModalData.leadName}
            eventTitle={certificateModalData.eventTitle}
            totalScore={certificateModalData.totalScore}
            completedTasks={certificateModalData.completedTasks}
          />
        </div>
      )}

      {/* =========================================================================
          TAB: GROUP CHATS & CHANNELS (STITCH DESIGN SPEC WITH RICH VISUAL HIERARCHY)
          ========================================================================= */}
      {activeTab === "community_chats" && (
        <div className="space-y-8 sm:space-y-10 animate-in fade-in duration-200">
          {/* Top Protocol Strip & Hero Title */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800/80">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981] animate-pulse" />
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                  COMMUNICATION // PROTOCOL • CHAT_ENGINE V3.0
                </span>
                <span className="text-slate-300 dark:text-zinc-700">•</span>
                <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">
                  ORG-COMM-MESH // {selectedTaskEventFilter === "ALL" ? "ALL TRACKS" : "OMNICHAIN 2025"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-[11px] font-mono text-emerald-700 dark:text-emerald-300 font-semibold shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Live Sync: Active (14ms)
                </span>
                <button
                  type="button"
                  onClick={() => setChatViewMode(chatViewMode === "create_group" ? "chat" : "create_group")}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-2 transition-all shadow-md shadow-blue-500/25 cursor-pointer"
                >
                  {chatViewMode === "create_group" ? (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      <span>Back to Messages</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>+ Inscribe Group</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Group Channels & Community Discussion Rooms
              </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
                Establish event-specific discussion groups, mentor office hours, and private squad channels. Manage participant rosters and broadcast live organizer announcements directly to the companion mobile app.
              </p>
            </div>
          </div>

          {/* Group Creation Notification */}
          {groupCreatedSuccess && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 shadow-sm animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-semibold">
                  Channel established successfully! All enrolled candidate members have been granted real-time access.
                </span>
              </div>
              <button
                onClick={() => setGroupCreatedSuccess(false)}
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 4 Stitch Metric Cards (With Visual Symbols & Glowing Accents) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-3 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-500 font-bold">
                  Active Channels
                </span>
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
                  <MessagesSquare className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-mono font-extrabold text-slate-900 dark:text-white tracking-tight">
                {channels.length}
              </div>
              <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-semibold">
                <span>↑ 2 created today</span>
                <span className="text-slate-300 dark:text-zinc-700">•</span>
                <span className="text-slate-500 dark:text-zinc-400">All tracks</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-3 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-500 font-bold">
                  Inscribed Builders
                </span>
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
                342
              </div>
              <div className="text-xs font-mono text-slate-500 dark:text-zinc-400 font-medium">
                Across 6 discussion rooms
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-3 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-500 font-bold">
                  Messages Dispatched
                </span>
                <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-xs">
                  <Flame className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-mono font-extrabold text-purple-600 dark:text-purple-400 tracking-tight">
                {activeMessages.length + 120}
              </div>
              <div className="text-xs font-mono text-slate-500 dark:text-zinc-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Real-time WebSocket feed</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-3 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-500 font-bold">
                  Mean Latency
                </span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                &lt; 3.2m
              </div>
              <div className="text-xs font-mono text-slate-500 dark:text-zinc-400 font-medium">
                Host DevRel response SLA
              </div>
            </div>
          </div>

          {/* Split-Pane Master Detail: Left Channel Directory, Right Arena */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Channels Directory (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider flex items-center gap-2">
                    <MessagesSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Channels Directory ({channels.length})</span>
                  </div>
                  <button
                    onClick={() => setChatViewMode("create_group")}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-mono font-bold flex items-center gap-1 transition-colors"
                    title="Inscribe New Group"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New</span>
                  </button>
                </div>

                {/* Channel Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                  <input
                    type="text"
                    value={channelSearch}
                    onChange={(e) => setChannelSearch(e.target.value)}
                    placeholder="Search channels, topics, tracks..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Filter Pills with Icons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-mono">
                  {[
                    { key: "ALL", label: "All", icon: Hash },
                    { key: "TRACK_ROOM", label: "Tracks", icon: Cpu },
                    { key: "MENTOR_DESK", label: "Mentors", icon: GraduationCap },
                    { key: "GROUP", label: "Groups", icon: Users },
                    { key: "ANNOUNCEMENT", label: "Broadcasts", icon: Radio },
                  ].map(({ key, label, icon: FilterIcon }) => (
                    <button
                      key={key}
                      onClick={() => setChannelFilter(key as any)}
                      className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        channelFilter === key
                          ? "bg-blue-600 text-white font-bold shadow-xs"
                          : "bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <FilterIcon className="w-3 h-3" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>

                {/* Channel List */}
                <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                  {channels
                    .filter((c) => {
                      if (channelFilter !== "ALL" && c.type !== channelFilter) return false;
                      if (channelSearch.trim()) {
                        const q = channelSearch.toLowerCase();
                        const matchTitle = c.title.toLowerCase().includes(q);
                        const matchDesc = c.description?.toLowerCase().includes(q);
                        const matchTeam = c.teamName?.toLowerCase().includes(q);
                        return matchTitle || matchDesc || matchTeam;
                      }
                      return true;
                    })
                    .map((channel) => {
                      const isSelected = selectedChannelId === channel.id && chatViewMode === "chat";
                      const categoryType = channel.type || (channel.isHostDM ? "HOST_DM" : channel.teamId ? "TEAM" : "ANNOUNCEMENT");

                      const badgeColor =
                        categoryType === "TRACK_ROOM"
                          ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40"
                          : categoryType === "MENTOR_DESK"
                          ? "bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/40"
                          : categoryType === "ANNOUNCEMENT"
                          ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40"
                          : categoryType === "GROUP"
                          ? "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/40"
                          : "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/40";

                      return (
                        <div
                          key={channel.id}
                          onClick={() => handleSelectChannel(channel.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? "bg-blue-50/90 dark:bg-blue-950/30 border-blue-500/70 shadow-sm"
                              : "bg-slate-50/70 dark:bg-zinc-950/50 border-slate-200 dark:border-zinc-850 hover:border-slate-300 dark:hover:border-zinc-700"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Visual Cover Thumbnail Image */}
                            {channel.coverImage ? (
                              <img
                                src={channel.coverImage}
                                alt={channel.title}
                                className="w-13 h-13 rounded-xl object-cover shrink-0 ring-1 ring-slate-200 dark:ring-zinc-800"
                              />
                            ) : (
                              <div className="w-13 h-13 rounded-xl bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-lg shrink-0">
                                💬
                              </div>
                            )}

                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1.5">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold border ${badgeColor}`}>
                                  {categoryType.replace(/_/g, " ")}
                                </span>
                                {channel.unreadCount ? (
                                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                                ) : null}
                              </div>

                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                                {channel.title}
                              </h4>

                              {channel.description && (
                                <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1 leading-normal">
                                  {channel.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-zinc-850/80 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                            <span className="inline-flex items-center gap-1.5 font-medium">
                              <Users className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                              <span>{channel.members?.length || channel.memberCount || 0} enrolled</span>
                            </span>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setManagingChannelId(channel.id);
                                setIsMemberDrawerOpen(true);
                              }}
                              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
                            >
                              <span>Manage Roster</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Arena (lg:col-span-8) */}
            <div className="lg:col-span-8">
              {/* MODE 1: LIVE INTERACTIVE CHAT */}
              {chatViewMode === "chat" && (() => {
                const activeChannel = channels.find((c) => c.id === selectedChannelId) || channels[0];
                const channelMessages = activeMessages.filter((m) => m.channelId === activeChannel?.id);
                const enrolledMembers = activeChannel?.members || [];

                return (
                  <div className="rounded-3xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 shadow-xs flex flex-col h-[740px] overflow-hidden">
                    {/* Atmospheric Channel Banner Hero Strip */}
                    <div className="relative h-36 w-full shrink-0 overflow-hidden bg-zinc-900">
                      {activeChannel?.coverImage && (
                        <img
                          src={activeChannel.coverImage}
                          alt={activeChannel.title}
                          className="w-full h-full object-cover opacity-40 dark:opacity-30 filter blur-xs scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0F0F12] via-white/80 dark:via-[#0F0F12]/80 to-transparent" />

                      {/* Header Content Overlay */}
                      <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-600 text-white shadow-xs">
                              {activeChannel?.type || "GROUP"}
                            </span>
                            <span className="text-xs font-mono text-slate-600 dark:text-zinc-300 font-semibold bg-white/70 dark:bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
                              {activeChannel?.eventTitle?.split(" ")[0] || "OmniChain"} Track
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setManagingChannelId(activeChannel.id);
                                setIsMemberDrawerOpen(true);
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5 transition-all shadow-xs backdrop-blur-xs cursor-pointer"
                            >
                              <UserPlus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              <span>Manage Members ({enrolledMembers.length})</span>
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                          <div className="space-y-0.5">
                            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white truncate tracking-tight">
                              {activeChannel?.title}
                            </h3>
                            {activeChannel?.description && (
                              <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-1 max-w-lg">
                                {activeChannel.description}
                              </p>
                            )}
                          </div>

                          {/* Member Stack Preview with Real Portraits */}
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex -space-x-2 overflow-hidden">
                              {enrolledMembers.slice(0, 5).map((m, idx) => (
                                <img
                                  key={m.userId + idx}
                                  src={
                                    m.avatarUrl ||
                                    AVAILABLE_CHAT_PARTICIPANTS.find((p) => p.userId === m.userId)?.avatarUrl ||
                                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                                  }
                                  alt={m.userName}
                                  title={`${m.userName} (${m.role})`}
                                  className="inline-block w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-[#0F0F12] shadow-xs"
                                />
                              ))}
                            </div>
                            {enrolledMembers.length > 5 && (
                              <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 font-bold">
                                +{enrolledMembers.length - 5}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4 custom-scrollbar">
                      {channelMessages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-slate-400 dark:text-zinc-600">
                            <MessageSquare className="w-7 h-7" />
                          </div>
                          <div className="text-base font-bold text-slate-800 dark:text-zinc-200">
                            No messages in this channel yet
                          </div>
                          <p className="text-xs text-slate-500 dark:text-zinc-500 max-w-sm leading-relaxed">
                            Broadcast an announcement or send an onboarding message to all {enrolledMembers.length} enrolled members.
                          </p>
                        </div>
                      ) : (
                        channelMessages.map((msg) => {
                          const isHost = msg.senderRole === "HOST" || msg.senderId.includes("host") || msg.senderId.includes("sarah");
                          const isMentor = msg.senderRole === "MENTOR" || msg.senderName.toLowerCase().includes("mentor");
                          const participant = AVAILABLE_CHAT_PARTICIPANTS.find((p) => p.userId === msg.senderId);
                          const avatarPhoto =
                            msg.senderAvatarUrl ||
                            participant?.avatarUrl ||
                            (isHost
                              ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                              : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80");

                          return (
                            <div
                              key={msg.id}
                              className={`flex items-start gap-3 ${isHost ? "flex-row-reverse" : "flex-row"}`}
                            >
                              <img
                                src={avatarPhoto}
                                alt={msg.senderName}
                                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 dark:ring-zinc-800 shrink-0 mt-0.5"
                              />

                              <div className={`flex flex-col ${isHost ? "items-end" : "items-start"} max-w-[80%]`}>
                                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-zinc-400 mb-1">
                                  <span className="font-bold text-slate-900 dark:text-zinc-200">
                                    {msg.senderName}
                                  </span>
                                  {isHost && (
                                    <span className="px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 text-[9px] font-bold">
                                      HOST / DEVREL
                                    </span>
                                  )}
                                  {isMentor && (
                                    <span className="px-1.5 py-0.2 rounded-full bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/40 text-[9px] font-bold">
                                      MENTOR
                                    </span>
                                  )}
                                  <span>•</span>
                                  <span>
                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>

                                <div
                                  className={`rounded-2xl px-4.5 py-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                                    isHost
                                      ? "bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-500/20"
                                      : "bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 rounded-tl-none"
                                  }`}
                                >
                                  {msg.text}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Quick Broadcast Chips Bar with Symbols */}
                    <div className="px-5 py-2.5 bg-slate-50 dark:bg-zinc-950/70 border-t border-slate-200 dark:border-zinc-800/80 flex items-center gap-2.5 overflow-x-auto no-scrollbar shrink-0">
                      <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase font-bold shrink-0 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span>Presets:</span>
                      </span>
                      {[
                        { text: "📢 Milestone 1 submissions are now open in the companion app!", icon: Radio },
                        { text: "🎓 Mentor office hours: Table 4 is open for ZK architecture queries.", icon: GraduationCap },
                        { text: "🏆 Leaderboard updated! Top 3 teams qualified for the stage demo.", icon: Award },
                        { text: "⚡ Hardware NFC badge desk closing in 45 minutes.", icon: Zap },
                      ].map(({ text, icon: PresetIcon }, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleQuickBroadcast(text)}
                          className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-blue-500 text-xs font-mono text-slate-700 dark:text-zinc-300 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <PresetIcon className="w-3 h-3 text-blue-500" />
                          <span>{text.substring(0, 30)}...</span>
                        </button>
                      ))}
                    </div>

                    {/* Chat Input Box */}
                    <form
                      onSubmit={handleSendHostMessage}
                      className="p-4 sm:p-5 bg-white dark:bg-[#0F0F12] border-t border-slate-200 dark:border-zinc-800 flex items-center gap-3 shrink-0"
                    >
                      <input
                        type="text"
                        value={hostMessageInput}
                        onChange={(e) => setHostMessageInput(e.target.value)}
                        placeholder={`Broadcast message to ${activeChannel?.title || "group"} as Sarah Chen (Host)...`}
                        className="flex-1 px-4.5 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                      />
                      <button
                        type="submit"
                        disabled={!hostMessageInput.trim() || isSendingMessage}
                        className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-blue-500/25 shrink-0 cursor-pointer"
                      >
                        {isSendingMessage ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Broadcast</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                );
              })()}

              {/* MODE 2: GROUP CREATION STUDIO (STITCH STYLE) */}
              {chatViewMode === "create_group" && (
                <div className="rounded-3xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 p-7 sm:p-8 space-y-7 shadow-xs">
                  <div className="space-y-1.5 pb-5 border-b border-slate-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span className="text-xs font-mono uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                        NEW GROUP STUDIO // INSCRIBE_CHANNEL
                      </span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      Create Group Channel & Invite Members
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
                      Configure channel category, topic description, and pick initial candidate roster from registered hackathon builders and mentors.
                    </p>
                  </div>

                  <form onSubmit={handleCreateGroupChannel} className="space-y-6">
                    {/* Title & Category Grid */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-zinc-300">
                        Group / Channel Title
                      </label>
                      <input
                        type="text"
                        required
                        value={newGroupTitle}
                        onChange={(e) => setNewGroupTitle(e.target.value)}
                        placeholder="e.g. AI Swarms & Memory Architecture"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    {/* Category Selector Tiles (Visual Symbols) */}
                    <div className="space-y-2.5">
                      <label className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-zinc-300">
                        Select Channel Category
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          {
                            type: "TRACK_ROOM",
                            title: "Track Discussion Room",
                            desc: "Dedicated to specific hackathon domain & track builders",
                            icon: Cpu,
                          },
                          {
                            type: "MENTOR_DESK",
                            title: "Mentor Help Desk",
                            desc: "Office hours, debugging sessions, and architecture reviews",
                            icon: GraduationCap,
                          },
                          {
                            type: "GROUP",
                            title: "Community Group",
                            desc: "Open networking, social lounge, and shared collaboration",
                            icon: MessagesSquare,
                          },
                          {
                            type: "ANNOUNCEMENT",
                            title: "Organizer Broadcast Desk",
                            desc: "Official checkpoints, stage calls, and event alerts",
                            icon: Radio,
                          },
                        ].map(({ type, title, desc, icon: CategoryIcon }) => {
                          const isSelected = newGroupType === type;
                          return (
                            <div
                              key={type}
                              onClick={() => setNewGroupType(type as any)}
                              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                                isSelected
                                  ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 ring-1 ring-blue-500 shadow-xs"
                                  : "bg-slate-50/70 dark:bg-zinc-900/60 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700"
                              }`}
                            >
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                  isSelected
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400"
                                }`}
                              >
                                <CategoryIcon className="w-5 h-5" />
                              </div>
                              <div className="space-y-0.5 min-w-0">
                                <div className="text-xs font-bold text-slate-900 dark:text-white">
                                  {title}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-zinc-400 leading-normal">
                                  {desc}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-zinc-300">
                        Topic & Purpose Description
                      </label>
                      <textarea
                        rows={2}
                        value={newGroupDescription}
                        onChange={(e) => setNewGroupDescription(e.target.value)}
                        placeholder="State what this channel is focused on, expectations, and resources..."
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    {/* Associated Event Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-zinc-300">
                        Bound Hackathon Event
                      </label>
                      <select
                        value={newGroupEventId}
                        onChange={(e) => setNewGroupEventId(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        {events.map((ev) => (
                          <option key={ev.id} value={ev.id}>
                            {ev.title} ({ev.city})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* INTERACTIVE MEMBER PICKER SECTION (STITCH DESIGN WITH REAL AVATARS) */}
                    <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-mono font-bold uppercase text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span>Select Initial Members ({newGroupSelectedMemberIds.length} Selected)</span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-zinc-400">
                            Check candidates below to auto-inscribe them into this discussion group.
                          </p>
                        </div>

                        {/* Quick Selection Buttons */}
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <button
                            type="button"
                            onClick={selectAllStudents}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 hover:bg-blue-100 text-xs font-semibold cursor-pointer"
                          >
                            + All Students
                          </button>
                          <button
                            type="button"
                            onClick={selectAllMentors}
                            className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/40 hover:bg-teal-100 text-xs font-semibold cursor-pointer"
                          >
                            + All Mentors
                          </button>
                          <button
                            type="button"
                            onClick={clearSelectedMembers}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 text-xs font-semibold cursor-pointer"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      {/* Candidate Filter Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="relative flex-1">
                          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                          <input
                            type="text"
                            value={memberSearchQuery}
                            onChange={(e) => setMemberSearchQuery(e.target.value)}
                            placeholder="Filter candidates by name, email, skill, or squad..."
                            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-mono shrink-0">
                          {(["ALL", "STUDENT", "MENTOR"] as const).map((roleKey) => (
                            <button
                              key={roleKey}
                              type="button"
                              onClick={() => setMemberRoleFilter(roleKey)}
                              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                                memberRoleFilter === roleKey
                                  ? "bg-slate-900 dark:bg-white text-white dark:text-black font-bold shadow-xs"
                                  : "bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400"
                              }`}
                            >
                              {roleKey}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Candidate Selection Cards Grid (Rich Visual Cards) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                        {AVAILABLE_CHAT_PARTICIPANTS.filter((p) => {
                          if (memberRoleFilter !== "ALL" && p.role !== memberRoleFilter) return false;
                          if (memberSearchQuery.trim()) {
                            const q = memberSearchQuery.toLowerCase();
                            const matchName = p.userName.toLowerCase().includes(q);
                            const matchEmail = p.userEmail.toLowerCase().includes(q);
                            const matchTeam = p.teamName?.toLowerCase().includes(q);
                            const matchSkill = p.skills.some((s) => s.toLowerCase().includes(q));
                            return matchName || matchEmail || matchTeam || matchSkill;
                          }
                          return true;
                        }).map((candidate) => {
                          const isSelected = newGroupSelectedMemberIds.includes(candidate.userId);

                          return (
                            <div
                              key={candidate.userId}
                              onClick={() => toggleMemberSelection(candidate.userId)}
                              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                                isSelected
                                  ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500/80 ring-1 ring-blue-500/50 shadow-xs"
                                  : "bg-slate-50/80 dark:bg-zinc-900/60 border-slate-200 dark:border-zinc-850 hover:border-slate-300 dark:hover:border-zinc-700"
                              }`}
                            >
                              <div className="pt-1">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {}} // handled by parent div
                                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                              </div>

                              <img
                                src={candidate.avatarUrl}
                                alt={candidate.userName}
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-zinc-800 shrink-0 mt-0.5"
                              />

                              <div className="space-y-1 min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {candidate.userName}
                                  </span>
                                  <span
                                    className={`px-2 py-0.2 rounded-full text-[9px] font-mono font-bold ${
                                      candidate.role === "MENTOR"
                                        ? "bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/40"
                                        : candidate.role === "HOST"
                                        ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40"
                                        : "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40"
                                    }`}
                                  >
                                    {candidate.role}
                                  </span>
                                </div>

                                <div className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 truncate">
                                  {candidate.userEmail} • {candidate.teamName || "Solo"}
                                </div>

                                <div className="flex flex-wrap gap-1 pt-1">
                                  {candidate.skills.slice(0, 3).map((skill) => (
                                    <span
                                      key={skill}
                                      className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-zinc-800 text-[9px] font-mono text-slate-700 dark:text-zinc-300"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Form Submit & Cancel Actions */}
                    <div className="flex items-center justify-end gap-3.5 pt-5 border-t border-slate-200 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setChatViewMode("chat")}
                        className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={!newGroupTitle.trim() || isCreatingGroup}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-xs font-semibold text-white flex items-center gap-2 transition-all shadow-md shadow-blue-500/25 cursor-pointer"
                      >
                        {isCreatingGroup ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Inscribing Group...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Inscribe Group ({newGroupSelectedMemberIds.length} Members)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* =========================================================================
              MODAL: MEMBER ROSTER MANAGER (STITCH SPEC WITH REAL AVATARS & CLEAN SPACE)
              ========================================================================= */}
          {isMemberDrawerOpen && (() => {
            const currentManagingChannel =
              channels.find((c) => c.id === (managingChannelId || selectedChannelId)) || channels[0];
            const currentMembers = currentManagingChannel?.members || [];
            const unenrolledCandidates = AVAILABLE_CHAT_PARTICIPANTS.filter(
              (p) => !currentMembers.some((m) => m.userId === p.userId)
            );

            return (
              <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-7 sm:p-8 space-y-7 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                  {/* Modal Header */}
                  <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-200 dark:border-zinc-800">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                          COMMUNICATION // ROSTER MANAGER
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {currentManagingChannel?.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
                        View current roster, remove participants, or invite candidate builders into this channel.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsMemberDrawerOpen(false)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-900 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Section 1: Current Enrolled Members */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono font-bold uppercase text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span>Enrolled Members ({currentMembers.length})</span>
                      </h4>
                      <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">
                        Organizer Sarah Chen has admin authority
                      </span>
                    </div>

                    <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
                      {currentMembers.length === 0 ? (
                        <div className="text-xs text-slate-500 dark:text-zinc-500 italic p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 text-center">
                          No members in this channel yet.
                        </div>
                      ) : (
                        currentMembers.map((member) => {
                          const participant = AVAILABLE_CHAT_PARTICIPANTS.find((p) => p.userId === member.userId);
                          const photoUrl =
                            member.avatarUrl ||
                            participant?.avatarUrl ||
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";

                          return (
                            <div
                              key={member.id}
                              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-3 shadow-xs"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={photoUrl}
                                  alt={member.userName}
                                  className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 dark:ring-zinc-800 shrink-0"
                                />
                                <div className="min-w-0 space-y-0.5">
                                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                                    <span>{member.userName}</span>
                                    <span
                                      className={`px-2 py-0.2 rounded-full text-[9px] font-mono font-bold ${
                                        member.role === "HOST"
                                          ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300"
                                          : member.role === "MENTOR"
                                          ? "bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300"
                                          : "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
                                      }`}
                                    >
                                      {member.role}
                                    </span>
                                  </div>
                                  <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 truncate">
                                    {member.userEmail} {member.teamName ? `• ${member.teamName}` : ""}
                                  </div>
                                </div>
                              </div>

                              {member.role !== "HOST" && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMemberFromChannel(currentManagingChannel.id, member.userId)}
                                  className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 text-xs font-mono font-semibold transition-colors shrink-0 cursor-pointer"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Section 2: Add Available Candidates to Channel */}
                  <div className="space-y-3.5 pt-4 border-t border-slate-200 dark:border-zinc-800">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono font-bold uppercase text-slate-900 dark:text-white flex items-center gap-2">
                        <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>Add New Member to Channel</span>
                      </h4>
                      <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold">
                        {unenrolledCandidates.length} Available to Invite
                      </span>
                    </div>

                    {/* Candidate Search */}
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                      <input
                        type="text"
                        value={candidateSearchQuery}
                        onChange={(e) => setCandidateSearchQuery(e.target.value)}
                        placeholder="Search candidate builders to invite..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
                      {unenrolledCandidates
                        .filter((p) => {
                          if (candidateSearchQuery.trim()) {
                            const q = candidateSearchQuery.toLowerCase();
                            return (
                              p.userName.toLowerCase().includes(q) ||
                              p.userEmail.toLowerCase().includes(q) ||
                              p.teamName?.toLowerCase().includes(q)
                            );
                          }
                          return true;
                        })
                        .map((candidate) => (
                          <div
                            key={candidate.userId}
                            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-3 shadow-xs"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={candidate.avatarUrl}
                                alt={candidate.userName}
                                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 dark:ring-zinc-800 shrink-0"
                              />
                              <div className="min-w-0 space-y-0.5">
                                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                                  <span>{candidate.userName}</span>
                                  <span className="px-2 py-0.2 rounded-full bg-slate-200 dark:bg-zinc-800 text-[9px] font-mono font-bold text-slate-700 dark:text-zinc-300">
                                    {candidate.role}
                                  </span>
                                </div>
                                <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 truncate">
                                  {candidate.userEmail} • {candidate.teamName || "Independent"}
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddMemberToChannel(currentManagingChannel.id, candidate)}
                              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs shrink-0 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add to Group</span>
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="pt-5 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => setIsMemberDrawerOpen(false)}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Done & Close
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* =========================================================================
          TAB 4: ANALYTICS & INSIGHTS
          ========================================================================= */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Host Analytics & Funnel Conversion
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Real-time telemetry on student skill distribution, team formations, and companion app compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-4 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Candidate Skill Breakdown</span>
              </h4>
              <div className="space-y-3 pt-2">
                {[
                  { skill: "Node.js & Backend APIs", percent: 84 },
                  { skill: "TypeScript & React", percent: 72 },
                  { skill: "Python & Machine Learning", percent: 56 },
                  { skill: "PostgreSQL & Database Design", percent: 48 },
                  { skill: "Docker & Cloud Infrastructure", percent: 38 },
                ].map((item) => (
                  <div key={item.skill} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 dark:text-zinc-300 font-mono">{item.skill}</span>
                      <span className="text-slate-400 dark:text-zinc-500 font-mono">{item.percent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${item.percent}%` }}
                        className="bg-blue-600 h-full rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-zinc-800 space-y-4 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Companion Mobile App Funnel</span>
              </h4>
              <div className="space-y-4 pt-2 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Direct APK / App Store Downloads</div>
                    <div className="text-[11px] text-slate-500 dark:text-zinc-500">Android & iOS combined</div>
                  </div>
                  <span className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">334 / 428</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Pre-Check-in Identity Verification</div>
                    <div className="text-[11px] text-slate-500 dark:text-zinc-500">Completed inside companion client</div>
                  </div>
                  <span className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">289 verified</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Team Formation Rate</div>
                    <div className="text-[11px] text-slate-500 dark:text-zinc-500">Formed squads of 2-4 members</div>
                  </div>
                  <span className="text-lg font-mono font-bold text-slate-900 dark:text-white">64% squads</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Host Workspace Footer (From Stitch Design) */}
      <div className="pt-8 border-t border-slate-200 dark:border-zinc-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500 dark:text-zinc-500 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-800 dark:text-zinc-400 font-bold">TalentOrbit // Workspace</span>
          <span>•</span>
          <span>© 2026 TalentOrbit Host Workspace. Matching student engineers with hackathons and internships.</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hover:text-slate-900 dark:hover:text-zinc-300 cursor-pointer">Developer API</span>
          <span className="hover:text-slate-900 dark:hover:text-zinc-300 cursor-pointer">Host Docs</span>
          <span className="hover:text-slate-900 dark:hover:text-zinc-300 cursor-pointer">Organizer Guidelines</span>
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Systems Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
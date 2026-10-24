"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  Role,
  Event,
  Registration,
  Team,
  OpportunityType,
  ApplicationStatus,
  Task,
  TaskSubmission,
  CompetitionStanding,
} from "@/types";
import {
  INITIAL_USER,
  DEMO_HOST_USER,
  GUEST_USER,
  INITIAL_EVENTS,
  INITIAL_REGISTRATIONS,
  INITIAL_TEAMS,
  INITIAL_TASKS,
  INITIAL_SUBMISSIONS,
  INITIAL_STANDINGS,
  GITHUB_MOCK_DATA,
} from "./data";

interface StoreContextType {
  user: User;
  isAuthenticated: boolean;
  events: Event[];
  registrations: Registration[];
  teams: Team[];
  tasks: Task[];
  taskSubmissions: TaskSubmission[];
  competitionStandings: CompetitionStanding[];
  selectedCity: string;
  theme: "dark" | "light";
  toggleTheme: () => void;
  setTheme: (theme: "dark" | "light") => void;
  activeNav: "events" | "internships" | "applications" | "profile" | "host" | "companion";
  activeFilter: string;
  searchQuery: string;
  githubSynced: boolean;
  githubData: typeof GITHUB_MOCK_DATA;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  setSelectedCity: (city: string) => void;
  setActiveNav: (nav: "events" | "internships" | "applications" | "profile" | "host" | "companion") => void;
  setActiveFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
  login: (data: { email: string; password?: string; name?: string; role?: Role }) => void;
  register: (data: {
    name: string;
    email: string;
    password?: string;
    role: Role;
    city?: string;
    skills?: string[];
    githubUsername?: string;
  }) => void;
  logout: () => void;
  switchAccount: (role: Role) => void;
  registerForEvent: (params: {
    eventId: string;
    isTeam: boolean;
    teamName?: string;
    inviteCode?: string;
    completedAppDownload?: boolean;
  }) => { success: boolean; message: string; teamCode?: string };
  updateRegistrationStatus: (regId: string, status: ApplicationStatus) => void;
  createEvent: (eventData: Partial<Event>) => Event;
  createTask: (taskData: {
    eventId: string;
    eventTitle?: string;
    title: string;
    description: string;
    type: Task["type"];
    deadline: string;
    points: number;
    isRequired: boolean;
    rubricCriteria?: string[];
  }) => Task;
  gradeSubmission: (
    submissionId: string,
    score: number,
    status: "COMPLETED" | "REVISE_REQUESTED",
    feedback?: string
  ) => void;
  submitTask: (taskId: string, submissionUrl: string, notes?: string) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  syncGitHub: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [registrations, setRegistrations] = useState<Registration[]>(INITIAL_REGISTRATIONS);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [taskSubmissions, setTaskSubmissions] = useState<TaskSubmission[]>(INITIAL_SUBMISSIONS);
  const [competitionStandings, setCompetitionStandings] = useState<CompetitionStanding[]>(INITIAL_STANDINGS);
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [theme, setThemeState] = useState<"dark" | "light">("dark");
  const [activeNav, setActiveNav] = useState<"events" | "internships" | "applications" | "profile" | "host" | "companion">("events");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [githubSynced, setGithubSynced] = useState<boolean>(true);
  const [githubData, setGithubData] = useState(GITHUB_MOCK_DATA);

  const setTheme = (newTheme: "dark" | "light") => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("talentorbit_theme", newTheme);
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      }
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("talentorbit_theme") as "dark" | "light" | null;
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
      } else {
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(prefersDark ? "dark" : "light");
      }
      const savedAuth = localStorage.getItem("talentorbit_auth");
      if (savedAuth !== null) {
        setIsAuthenticated(savedAuth === "true");
      }

      const savedEvents = localStorage.getItem("talentorbit_events");
      if (savedEvents) setEvents(JSON.parse(savedEvents));

      const savedRegs = localStorage.getItem("talentorbit_registrations");
      if (savedRegs) setRegistrations(JSON.parse(savedRegs));

      const savedUser = localStorage.getItem("talentorbit_user");
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedTasks = localStorage.getItem("talentorbit_tasks");
      if (savedTasks) setTasks(JSON.parse(savedTasks));

      const savedSubs = localStorage.getItem("talentorbit_submissions");
      if (savedSubs) setTaskSubmissions(JSON.parse(savedSubs));
    } catch {
      // Ignore storage error
    }
  }, []);

  // Sync back to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("talentorbit_auth", isAuthenticated ? "true" : "false");
      localStorage.setItem("talentorbit_events", JSON.stringify(events));
      localStorage.setItem("talentorbit_registrations", JSON.stringify(registrations));
      localStorage.setItem("talentorbit_user", JSON.stringify(user));
      localStorage.setItem("talentorbit_tasks", JSON.stringify(tasks));
      localStorage.setItem("talentorbit_submissions", JSON.stringify(taskSubmissions));
    } catch {
      // Ignore storage error
    }
  }, [isAuthenticated, events, registrations, user, tasks, taskSubmissions]);

  const logout = () => {
    setIsAuthenticated(false);
    setUser(GUEST_USER);
    try {
      localStorage.setItem("talentorbit_auth", "false");
      localStorage.setItem("talentorbit_user", JSON.stringify(GUEST_USER));
    } catch {}
    if (activeNav === "profile" || activeNav === "host") {
      setActiveNav("events");
    }
  };

  const login = ({
    email,
    password,
    name,
    role = "STUDENT",
  }: {
    email: string;
    password?: string;
    name?: string;
    role?: Role;
  }) => {
    setIsAuthenticated(true);
    let loggedInUser: User;
    if (role === "HOST" || email.toLowerCase().includes("host") || email.toLowerCase().includes("techyuva") || email.toLowerCase().includes("sarah")) {
      loggedInUser = {
        ...DEMO_HOST_USER,
        email,
        name: name || DEMO_HOST_USER.name,
      };
    } else if (email.toLowerCase().includes("arjun") || email.toLowerCase().includes("iiitb")) {
      loggedInUser = INITIAL_USER;
    } else {
      const extractedName = name || (email.split("@")[0].replace(/[\._]/g, " ") || "Student Builder");
      const formattedName = extractedName
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      loggedInUser = {
        ...INITIAL_USER,
        id: "usr_" + Date.now(),
        email,
        name: formattedName,
        role: role || "STUDENT",
        githubUsername: email.split("@")[0],
      };
    }
    setUser(loggedInUser);
    try {
      localStorage.setItem("talentorbit_auth", "true");
      localStorage.setItem("talentorbit_user", JSON.stringify(loggedInUser));
    } catch {}
  };

  const register = ({
    name,
    email,
    password,
    role,
    city = "Bengaluru",
    skills = ["Node.js", "React", "Python"],
    githubUsername,
  }: {
    name: string;
    email: string;
    password?: string;
    role: Role;
    city?: string;
    skills?: string[];
    githubUsername?: string;
  }) => {
    setIsAuthenticated(true);
    const newUser: User = {
      id: "usr_" + Date.now(),
      name,
      email,
      role,
      city: city || "Bengaluru",
      bio: role === "STUDENT"
        ? `Full-stack student engineer passionate about building modern web applications, AI tools, and developer infra.`
        : `Organizer and Tech Community Lead at ${name.split(" ")[0]} Labs.`,
      skills: skills.length > 0 ? skills : ["Node.js", "React", "Python"],
      githubUsername: githubUsername || name.toLowerCase().replace(/\s+/g, "_"),
      linkedinUrl: `https://linkedin.com/in/${name.toLowerCase().replace(/\s+/g, "-")}`,
      academicLevel: "UNDERGRAD",
      graduationYear: 2026,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    try {
      localStorage.setItem("talentorbit_auth", "true");
      localStorage.setItem("talentorbit_user", JSON.stringify(newUser));
    } catch {}
  };

  const switchAccount = (targetRole: Role) => {
    if (targetRole === "HOST") {
      setUser(DEMO_HOST_USER);
      setIsAuthenticated(true);
      setActiveNav("host");
    } else {
      setUser(INITIAL_USER);
      setIsAuthenticated(true);
      setActiveNav("events");
    }
  };

  const registerForEvent = ({
    eventId,
    isTeam,
    teamName,
    inviteCode,
    completedAppDownload = false,
  }: {
    eventId: string;
    isTeam: boolean;
    teamName?: string;
    inviteCode?: string;
    completedAppDownload?: boolean;
  }) => {
    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) return { success: false, message: "Event not found" };

    const existing = registrations.find(
      (r) => r.eventId === eventId && r.userId === user.id
    );
    if (existing) {
      return { success: false, message: "You are already registered for this event." };
    }

    let finalTeamId: string | null = null;
    let finalTeamName: string | null = null;
    let generatedCode: string | undefined;

    if (isTeam) {
      if (inviteCode && inviteCode.trim().length > 0) {
        // Joining existing team
        const foundTeam = teams.find(
          (t) =>
            t.eventId === eventId &&
            t.inviteCode.toUpperCase() === inviteCode.trim().toUpperCase()
        );
        if (!foundTeam) {
          return {
            success: false,
            message: "Invalid team invite code for this event.",
          };
        }
        finalTeamId = foundTeam.id;
        finalTeamName = foundTeam.name;

        // Add to team members
        setTeams((prev) =>
          prev.map((t) =>
            t.id === foundTeam.id
              ? {
                  ...t,
                  members: [
                    ...t.members,
                    {
                      id: `mem_${Date.now()}`,
                      teamId: t.id,
                      userId: user.id,
                      userName: user.name,
                      userRole: "Engineer",
                      joinedAt: new Date().toISOString(),
                    },
                  ],
                }
              : t
          )
        );
      } else {
        // Creating new team
        const cleanName = teamName?.trim() || `${user.name.split(" ")[0]}'s Orbit Team`;
        generatedCode = "ORB" + Math.random().toString(36).substring(2, 5).toUpperCase();
        const newTeamId = `team_${Date.now()}`;
        const newTeam: Team = {
          id: newTeamId,
          eventId,
          name: cleanName,
          inviteCode: generatedCode,
          leaderId: user.id,
          leaderName: user.name,
          members: [
            {
              id: `mem_lead_${Date.now()}`,
              teamId: newTeamId,
              userId: user.id,
              userName: user.name,
              userRole: "Team Leader",
              joinedAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
        };
        setTeams((prev) => [newTeam, ...prev]);
        finalTeamId = newTeamId;
        finalTeamName = cleanName;
      }
    }

    const newReg: Registration = {
      id: `reg_${Date.now()}`,
      eventId,
      eventTitle: targetEvent.title,
      eventType: targetEvent.type,
      eventCity: targetEvent.city,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userSkills: user.skills,
      githubUsername: user.githubUsername,
      teamId: finalTeamId,
      teamName: finalTeamName,
      status: "PENDING",
      completedAppDownload,
      createdAt: new Date().toISOString(),
    };

    setRegistrations((prev) => [newReg, ...prev]);
    return {
      success: true,
      message: isTeam
        ? `Registered in team "${finalTeamName}"!`
        : "Successfully registered as an Individual!",
      teamCode: generatedCode,
    };
  };

  const updateRegistrationStatus = (regId: string, status: ApplicationStatus) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === regId ? { ...r, status } : r))
    );
  };

  const createEvent = (eventData: Partial<Event>): Event => {
    const newEvent: Event = {
      id: `evt_${Date.now()}`,
      hostId: "usr_host_current",
      hostName: "TalentOrbit Organizer Workspace",
      hostAvatar: "🪐",
      type: eventData.type || "HACKATHON",
      title: eventData.title || "Untitled Opportunity",
      description: eventData.description || "Exciting tech challenge for student builders.",
      city: eventData.city || "Bengaluru",
      isRemote: eventData.isRemote ?? false,
      requiredSkills: eventData.requiredSkills || ["Node.js", "TypeScript"],
      rewardOrStipend: eventData.rewardOrStipend || "₹50,000 Prize Pool",
      participationMode: eventData.participationMode || "SOLO_OR_TEAM",
      minTeamSize: eventData.minTeamSize || 1,
      maxTeamSize: eventData.maxTeamSize || 4,
      requiresAppDownload: eventData.requiresAppDownload || false,
      appName: eventData.appName,
      appDownloadUrl: eventData.appDownloadUrl,
      deadline:
        eventData.deadline ||
        new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      matchScore: 94,
      matchReason: `Newly launched opportunity in ${eventData.city || "Bengaluru"} matching your background.`,
    };

    setEvents((prev) => [newEvent, ...prev]);
    return newEvent;
  };

  const createTask = (taskData: {
    eventId: string;
    eventTitle?: string;
    title: string;
    description: string;
    type: Task["type"];
    deadline: string;
    points: number;
    isRequired: boolean;
    rubricCriteria?: string[];
  }): Task => {
    const parentEvent = events.find((e) => e.id === taskData.eventId);
    const newTask: Task = {
      id: "task_" + Date.now(),
      eventId: taskData.eventId,
      eventTitle: taskData.eventTitle || parentEvent?.title || "OmniChain Autonomous Agent Hackathon 2025",
      title: taskData.title,
      description: taskData.description,
      type: taskData.type,
      deadline: taskData.deadline,
      points: taskData.points,
      isRequired: taskData.isRequired,
      assignedCount: parentEvent?.candidateCount || parentEvent?.registeredCount || 146,
      completedCount: 0,
      rubricCriteria: taskData.rubricCriteria || [],
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const gradeSubmission = (
    submissionId: string,
    score: number,
    status: "COMPLETED" | "REVISE_REQUESTED",
    feedback?: string
  ) => {
    setTaskSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === submissionId) {
          return {
            ...sub,
            score,
            status,
            feedback: feedback || sub.feedback,
          };
        }
        return sub;
      })
    );

    // Update standing if completed
    if (status === "COMPLETED") {
      setCompetitionStandings((prev) => {
        return prev.map((std) => {
          return {
            ...std,
            totalScore: std.totalScore + Math.min(score, 50),
          };
        });
      });
    }
  };

  const submitTask = (taskId: string, submissionUrl: string, notes?: string) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    const newSub: TaskSubmission = {
      id: "sub_" + Date.now(),
      taskId,
      taskTitle: targetTask.title,
      eventId: targetTask.eventId,
      teamId: null,
      teamName: user.name + "'s Squad",
      leadName: user.name,
      submissionUrl,
      submissionNotes: notes,
      status: "PENDING_REVIEW",
      maxScore: targetTask.points,
      companionAppVerified: true,
      submittedAt: new Date().toISOString(),
    };

    setTaskSubmissions((prev) => [newSub, ...prev]);
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completedCount: t.completedCount + 1 } : t
      )
    );
  };

  const addSkill = (newSkill: string) => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (user.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return;
    setUser((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
  };

  const removeSkill = (skillToRemove: string) => {
    setUser((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const syncGitHub = () => {
    setGithubSynced(true);
    // Add top language to user skills if not present
    if (!user.skills.includes("Python")) {
      setUser((prev) => ({ ...prev, skills: [...prev.skills, "Python"] }));
    }
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        isAuthenticated,
        events,
        registrations,
        teams,
        tasks,
        taskSubmissions,
        competitionStandings,
        selectedCity,
        theme,
        toggleTheme,
        setTheme,
        activeNav,
        activeFilter,
        searchQuery,
        githubSynced,
        githubData,
        setUser,
        setSelectedCity,
        setActiveNav,
        setActiveFilter,
        setSearchQuery,
        login,
        register,
        logout,
        switchAccount,
        registerForEvent,
        updateRegistrationStatus,
        createEvent,
        createTask,
        gradeSubmission,
        submitTask,
        addSkill,
        removeSkill,
        syncGitHub,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}

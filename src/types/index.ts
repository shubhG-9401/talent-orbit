export type Role = "STUDENT" | "HOST";

export type OpportunityType = "HACKATHON" | "INTERNSHIP" | "WORKSHOP" | "MEETUP";

export type ParticipationMode = "SOLO_ONLY" | "TEAM_ONLY" | "SOLO_OR_TEAM";

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type SourcePlatform = "COMMUDLE" | "DEVPOST" | "UNSTOP" | "GITHUB" | "HOST_PORTAL";

export type EligibilityRule =
  | "OPEN_TO_ALL"
  | "UNDERGRAD_ONLY"
  | "PRE_FINAL_OR_FINAL_YEAR"
  | "MASTERS_AND_UNDERGRAD";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  city?: string | null;
  bio?: string | null;
  skills: string[];
  githubUsername?: string | null;
  linkedinUrl?: string | null;
  avatarUrl?: string;
  academicLevel?: "UNDERGRAD" | "POSTGRAD" | "BOOTCAMP";
  graduationYear?: number;
  createdAt: string;
}

export interface SkillGapAnalysis {
  matchedSkills: string[];
  missingSkills: string[];
  skillMatchPercentage: number;
  gapSummary: string;
  recommendedAction: string;
}

export interface HackathonStage {
  title: string;
  date: string;
  description: string;
  status: "COMPLETED" | "ACTIVE" | "UPCOMING";
}

export interface ProblemStatement {
  id: string;
  title: string;
  track: string;
  description: string;
  expectedDeliverables: string;
}

export interface PrizeTier {
  place: string;
  amount: string;
  perks: string[];
}

export interface Event {
  id: string;
  hostId: string;
  hostName: string;
  hostAvatar?: string;
  type: OpportunityType;
  title: string;
  description: string;
  city: string;
  isRemote: boolean;
  requiredSkills: string[];
  rewardOrStipend?: string | null;
  participationMode: ParticipationMode;
  minTeamSize: number;
  maxTeamSize: number;
  requiresAppDownload: boolean;
  appDownloadUrl?: string | null;
  appName?: string | null;
  deadline: string; // ISO 8601
  sourcePlatform?: SourcePlatform;
  sourceUrl?: string;
  eligibilityRule?: EligibilityRule;
  academicEligibilityText?: string;
  createdAt: string;
  matchScore?: number;
  matchReason?: string;
  skillGap?: SkillGapAnalysis;
  rankingScore?: number;

  // Stitch & organizer status indicators
  isDraft?: boolean;
  statusLabel?: string;
  registeredTeamsCount?: number;
  candidateCount?: number;
  appVerifiedPercent?: number;

  // Rich Unstop-style detailed hackathon fields
  coverImage?: string;
  registeredCount?: number;
  impressionsCount?: number;
  stages?: HackathonStage[];
  problemStatements?: ProblemStatement[];
  prizes?: PrizeTier[];
  rulesGuidelines?: string[];
  contactEmail?: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  userName: string;
  userRole?: string;
  joinedAt: string;
}

export interface Team {
  id: string;
  eventId: string;
  name: string;
  inviteCode: string;
  leaderId: string;
  leaderName: string;
  members: TeamMember[];
  createdAt: string;
}

export interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  eventType: OpportunityType;
  eventCity: string;
  userId: string;
  userName: string;
  userEmail: string;
  userSkills: string[];
  githubUsername?: string | null;
  teamId?: string | null;
  teamName?: string | null;
  status: ApplicationStatus;
  completedAppDownload: boolean;
  createdAt: string;

  // Stitch telemetry additions
  memberCount?: number;
  university?: string;
  gradYear?: string | number;
  githubVelocity?: {
    commitsPerYear: number;
    publicRepos: number;
  };
  deviceId?: string;
  appHandshake?: boolean;
}

export interface GitHubRepoInfo {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
}

export interface GitHubProfileData {
  username: string;
  name: string;
  bio: string;
  topLanguages: { name: string; percentage: number }[];
  repos: GitHubRepoInfo[];
}

export type TaskType =
  | "COMPANION_APP"
  | "CODE_SUBMISSION"
  | "IDEATION_DECK"
  | "API_BENCHMARK"
  | "VERIFICATION";

export interface Task {
  id: string;
  eventId: string;
  eventTitle: string;
  title: string;
  description: string;
  type: TaskType;
  deadline: string;
  points: number;
  isRequired: boolean;
  assignedCount: number;
  completedCount: number;
  rubricCriteria?: string[];
  createdAt: string;
}

export type TaskStatus = "PENDING" | "SUBMITTED" | "VERIFIED" | "REJECTED";

export interface EventTask {
  id: string;
  eventId: string;
  title: string;
  description: string;
  deadline?: string | null;
  isRequired: boolean;
  points?: number;
  rubricCriteria?: string[];
  type?: string;
  createdAt: string;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  taskTitle?: string;
  eventId?: string;
  teamId?: string | null;
  teamName?: string;
  leadName?: string;
  userId?: string;
  submissionUrl?: string | null;
  notes?: string | null;
  submissionNotes?: string;
  status: TaskStatus | "COMPLETED" | "PENDING_REVIEW" | "REVISE_REQUESTED";
  score?: number;
  maxScore?: number;
  feedback?: string;
  companionAppVerified?: boolean;
  submittedAt: string;
  user?: {
    name: string;
    email: string;
    githubUsername?: string | null;
  };
}

export interface ChannelMember {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  role: "HOST" | "STUDENT" | "MENTOR";
  teamName?: string;
  avatar?: string;
  avatarUrl?: string;
  joinedAt: string;
}

export interface ChatChannel {
  id: string;
  eventId: string;
  eventTitle?: string;
  teamId?: string | null;
  teamName?: string | null;
  isHostDM: boolean;
  studentId?: string | null;
  studentName?: string | null;
  title: string;
  description?: string;
  type?: "ANNOUNCEMENT" | "GROUP" | "TEAM" | "HOST_DM" | "MENTOR_DESK" | "TRACK_ROOM";
  createdById?: string;
  createdByName?: string;
  coverImage?: string;
  icon?: string;
  tags?: string[];
  members?: ChannelMember[];
  memberCount?: number;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderRole: "STUDENT" | "HOST" | "MENTOR";
  senderAvatarUrl?: string;
  text: string;
  mediaUrl?: string | null;
  createdAt: string;
}

export interface BottomBarRouteItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  badge?: string | null;
  active?: boolean;
}

export interface CompanionNavResponse {
  eventId: string;
  userId: string;
  role: "STUDENT" | "HOST";
  eventTitle: string;
  routes: BottomBarRouteItem[];
  isCheckedIn: boolean;
  pendingTasksCount: number;
  teamId?: string | null;
  teamName?: string | null;
}

export interface CompetitionStanding {
  rank: number;
  teamName: string;
  leadName: string;
  eventId: string;
  totalScore: number;
  maxPossibleScore: number;
  tasksCompleted: number;
  totalTasks: number;
  githubCommitsPerYear: number;
  companionHandshake: boolean;
  status: "LEADER" | "QUALIFIED_FINAL" | "IN_EVALUATION" | "SHORTLISTED";
}

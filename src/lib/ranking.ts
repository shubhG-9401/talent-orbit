import { Event, User, SkillGapAnalysis, SourcePlatform } from "@/types";

// 1. DATA NORMALIZATION: Canonical Skill Mapping
const SKILL_CANONICAL_MAP: Record<string, string> = {
  // JavaScript & TypeScript ecosystem
  "node": "Node.js",
  "nodejs": "Node.js",
  "node.js": "Node.js",
  "node js": "Node.js",
  "express": "Express",
  "express.js": "Express",
  "expressjs": "Express",
  "ts": "TypeScript",
  "typescript": "TypeScript",
  "js": "JavaScript",
  "javascript": "JavaScript",
  "react": "React",
  "reactjs": "React",
  "react.js": "React",
  "next": "Next.js",
  "nextjs": "Next.js",
  "next.js": "Next.js",
  "tailwind": "Tailwind CSS",
  "tailwindcss": "Tailwind CSS",

  // Python & AI ecosystem
  "py": "Python",
  "python": "Python",
  "python3": "Python",
  "fastapi": "FastAPI",
  "fast-api": "FastAPI",
  "django": "Django",
  "flask": "Flask",
  "gemini": "Gemini API",
  "gemini api": "Gemini API",
  "langchain": "LangChain",
  "llm": "LLMs",
  "llms": "LLMs",
  "pytorch": "PyTorch",
  "tensorflow": "TensorFlow",
  "machine learning": "Machine Learning",
  "ml": "Machine Learning",

  // Databases & Cloud
  "postgres": "PostgreSQL",
  "postgresql": "PostgreSQL",
  "psql": "PostgreSQL",
  "mongodb": "MongoDB",
  "mongo": "MongoDB",
  "redis": "Redis",
  "docker": "Docker",
  "k8s": "Kubernetes",
  "kubernetes": "Kubernetes",
  "aws": "AWS",
  "gcp": "Google Cloud",
  "cloud": "Cloud Infra",
  "graphql": "GraphQL",
  "prisma": "Prisma",
};

/**
 * Normalizes any raw tech skill string into its standardized canonical name.
 * e.g. "nodejs" -> "Node.js", "postgres" -> "PostgreSQL"
 */
export function normalizeSkill(raw: string): string {
  const cleaned = raw.trim().toLowerCase();
  return SKILL_CANONICAL_MAP[cleaned] || raw.trim();
}

/**
 * Normalizes an array of skills, removing duplicates.
 */
export function normalizeSkillsList(skills: string[]): string[] {
  const normalized = skills.map(normalizeSkill);
  return Array.from(new Set(normalized));
}

// 2. DATA NORMALIZATION: Deadline Formatting & Urgency Telemetry
export interface DeadlineInfo {
  text: string;
  daysRemaining: number;
  isUrgent: boolean;
  isPassed: boolean;
  formattedDate: string;
}

export function formatDeadlineCountdown(deadlineIso: string): DeadlineInfo {
  const now = new Date();
  const deadlineDate = new Date(deadlineIso);
  const diffTime = deadlineDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const formattedDate = deadlineDate.toLocaleDateString("en-US", options);

  if (daysRemaining < 0) {
    return {
      text: "Closed",
      daysRemaining,
      isUrgent: false,
      isPassed: true,
      formattedDate,
    };
  }

  if (daysRemaining === 0) {
    return {
      text: "Closes Today!",
      daysRemaining: 0,
      isUrgent: true,
      isPassed: false,
      formattedDate,
    };
  }

  if (daysRemaining === 1) {
    return {
      text: "1 day left",
      daysRemaining: 1,
      isUrgent: true,
      isPassed: false,
      formattedDate,
    };
  }

  return {
    text: `${daysRemaining} days left`,
    daysRemaining,
    isUrgent: daysRemaining <= 3,
    isPassed: false,
    formattedDate,
  };
}

// 3. ELIGIBILITY RULES EVALUATION
export interface EligibilityEvaluation {
  isEligible: boolean;
  badge: string;
  reason: string;
  level: "FULL" | "PARTIAL" | "INELIGIBLE";
}

export function evaluateEligibility(
  event: Event,
  user: User
): EligibilityEvaluation {
  const rule = event.eligibilityRule || "OPEN_TO_ALL";
  const userAcademic = user.academicLevel || "UNDERGRAD";

  // Check Academic Eligibility Rule
  if (rule === "UNDERGRAD_ONLY" && userAcademic !== "UNDERGRAD") {
    return {
      isEligible: false,
      badge: "🎓 Undergrads Only",
      reason: "This opportunity is strictly reserved for undergraduate engineering students.",
      level: "INELIGIBLE",
    };
  }

  // Check Location Eligibility (if onsite and in different city, allowed with travel notice)
  const isCityMismatch =
    !event.isRemote && user.city && event.city !== "Remote" && user.city !== event.city;

  if (isCityMismatch) {
    return {
      isEligible: true,
      badge: `📍 ${event.city} (Onsite)`,
      reason: `Requires onsite physical presence in ${event.city}. Travel required if outside the city.`,
      level: "PARTIAL",
    };
  }

  const badgeMap: Record<string, string> = {
    OPEN_TO_ALL: "🌍 Open to All Students",
    UNDERGRAD_ONLY: "🎓 Undergrads Only",
    PRE_FINAL_OR_FINAL_YEAR: "⚡ Pre-Final & Final Year",
    MASTERS_AND_UNDERGRAD: "📚 Undergrad & Masters",
  };

  return {
    isEligible: true,
    badge: badgeMap[rule] || "🎓 Student Eligible",
    reason: "You meet all academic, graduation year, and geographical prerequisites.",
    level: "FULL",
  };
}

// 4. SKILL GAP ANALYSIS ENGINE
export function analyzeSkillGaps(
  requiredSkills: string[],
  userSkills: string[]
): SkillGapAnalysis {
  const normRequired = normalizeSkillsList(requiredSkills);
  const normUser = normalizeSkillsList(userSkills);

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  normRequired.forEach((req) => {
    const isMatched = normUser.some(
      (u) => u.toLowerCase() === req.toLowerCase()
    );
    if (isMatched) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  const total = normRequired.length || 1;
  const skillMatchPercentage = Math.round((matchedSkills.length / total) * 100);

  let gapSummary = "";
  let recommendedAction = "";

  if (missingSkills.length === 0) {
    gapSummary = `Full Technical Match! You possess 100% of the required technical stack (${matchedSkills.join(", ")}).`;
    recommendedAction = "Apply immediately or lead a hackathon squad!";
  } else if (matchedSkills.length >= 2) {
    gapSummary = `Strong foundation. You match ${matchedSkills.length}/${normRequired.length} skills (${matchedSkills.join(", ")}). Missing: ${missingSkills.join(", ")}.`;
    recommendedAction = `Pair with a teammate proficient in ${missingSkills.join(", ")} to boost your squad compatibility to 98%!`;
  } else {
    gapSummary = `Skill Gap Detected. You have ${matchedSkills.length || 0}/${normRequired.length} skills. Gaps: ${missingSkills.join(", ")}.`;
    recommendedAction = `Consider a 2-hour crash course on ${missingSkills[0]} or join an existing team seeking your ${matchedSkills[0] || "core"} strengths.`;
  }

  return {
    matchedSkills,
    missingSkills,
    skillMatchPercentage,
    gapSummary,
    recommendedAction,
  };
}

// 5. WEIGHTED MULTI-FACTOR RANKING ENGINE
export interface RankedResult {
  rankingScore: number;
  skillGap: SkillGapAnalysis;
  eligibility: EligibilityEvaluation;
  deadlineInfo: DeadlineInfo;
}

export function rankOpportunity(event: Event, user: User): RankedResult {
  const skillGap = analyzeSkillGaps(event.requiredSkills, user.skills);
  const eligibility = evaluateEligibility(event, user);
  const deadlineInfo = formatDeadlineCountdown(event.deadline);

  // 1. Skill Score Component (50%)
  const skillComponent = skillGap.skillMatchPercentage * 0.50;

  // 2. Eligibility Component (20%)
  let eligibilityComponent = 20;
  if (eligibility.level === "PARTIAL") eligibilityComponent = 12;
  if (eligibility.level === "INELIGIBLE") eligibilityComponent = 0;

  // 3. Deadline Urgency Component (15%)
  // Items ending soon get prioritized so students don't miss them!
  let urgencyComponent = 10;
  if (deadlineInfo.daysRemaining <= 3 && deadlineInfo.daysRemaining >= 0) {
    urgencyComponent = 15; // Max urgency bonus
  } else if (deadlineInfo.daysRemaining <= 7) {
    urgencyComponent = 13;
  } else if (deadlineInfo.daysRemaining > 30) {
    urgencyComponent = 6;
  } else if (deadlineInfo.isPassed) {
    urgencyComponent = 0;
  }

  // 4. Proximity / Remote Component (15%)
  let locationComponent = 10;
  if (event.isRemote) {
    locationComponent = 15;
  } else if (user.city && event.city === user.city) {
    locationComponent = 15; // Local home city bonus
  }

  const rawScore = Math.round(
    skillComponent + eligibilityComponent + urgencyComponent + locationComponent
  );
  const rankingScore = Math.min(99, Math.max(35, rawScore));

  return {
    rankingScore,
    skillGap,
    eligibility,
    deadlineInfo,
  };
}

// Helper to get platform styling badge
export function getPlatformMeta(platform?: SourcePlatform) {
  switch (platform) {
    case "COMMUDLE":
      return {
        name: "Commudle",
        badgeClass: "bg-blue-950/40 text-blue-400 border-blue-800/40",
        icon: "🟣",
      };
    case "DEVPOST":
      return {
        name: "Devpost",
        badgeClass: "bg-teal-950/40 text-teal-300 border-teal-800/40",
        icon: "🌐",
      };
    case "UNSTOP":
      return {
        name: "Unstop",
        badgeClass: "bg-amber-950/40 text-amber-300 border-amber-800/40",
        icon: "🔷",
      };
    case "GITHUB":
      return {
        name: "GitHub",
        badgeClass: "bg-zinc-900 text-zinc-300 border-zinc-700",
        icon: "🐙",
      };
    default:
      return {
        name: "Host Portal",
        badgeClass: "bg-indigo-950/40 text-indigo-300 border-indigo-800/40",
        icon: "🏢",
      };
  }
}

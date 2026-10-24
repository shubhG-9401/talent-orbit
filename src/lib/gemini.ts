import { GoogleGenAI } from "@google/genai";

export interface MatchAnalysisResult {
  score: number;
  matchReason: string;
  keyStrengths: string[];
  suggestedFocus: string;
}

export interface GeneratedEventResult {
  title: string;
  type: "HACKATHON" | "INTERNSHIP" | "WORKSHOP";
  city: string;
  isRemote: boolean;
  description: string;
  requiredSkills: string[];
  rewardOrStipend: string;
  participationMode: "SOLO_OR_TEAM" | "SOLO_ONLY" | "TEAM_ONLY";
  minTeamSize: number;
  maxTeamSize: number;
  requiresAppDownload: boolean;
  appName?: string;
  appDownloadUrl?: string;
  deadlineDaysAhead: number;
}

export async function analyzeGeminiMatch(
  eventTitle: string,
  eventDescription: string,
  requiredSkills: string[],
  studentSkills: string[],
  githubRepos: { name: string; description: string; language: string }[]
): Promise<MatchAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim().length > 0) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are the Principal AI Talent Matcher for TalentOrbit.
Evaluate this student's match for the following opportunity.

EVENT DETAILS:
Title: ${eventTitle}
Description: ${eventDescription}
Required Skills: ${requiredSkills.join(", ")}

STUDENT PROFILE:
Skills: ${studentSkills.join(", ")}
GitHub Repos: ${JSON.stringify(githubRepos)}

Return a pure JSON object (without markdown or backticks) matching this exact schema:
{
  "score": number (0-100),
  "matchReason": "1-2 concise, encouraging sentences explaining why this matches their specific github repos and skills",
  "keyStrengths": ["string", "string", "string"],
  "suggestedFocus": "One sentence tip on how they can ace the registration or hackathon"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text?.trim() || "";
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return {
        score: Math.min(100, Math.max(50, parsed.score || 92)),
        matchReason: parsed.matchReason || `Matches your ${requiredSkills.slice(0, 2).join(" and ")} background.`,
        keyStrengths: parsed.keyStrengths || requiredSkills.slice(0, 3),
        suggestedFocus: parsed.suggestedFocus || "Highlight your backend repository and real-time APIs during registration.",
      };
    } catch (err) {
      console.warn("Gemini API call failed or timed out, using fallback matcher:", err);
    }
  }

  // Graceful intelligent fallback when no key is provided
  const matchingSkills = requiredSkills.filter((s) =>
    studentSkills.some((userSkill) => userSkill.toLowerCase() === s.toLowerCase())
  );
  const ratio = matchingSkills.length / Math.max(1, requiredSkills.length);
  const calculatedScore = Math.min(98, Math.max(70, Math.round(75 + ratio * 23)));

  return {
    score: calculatedScore,
    matchReason: `Matches your ${studentSkills.slice(0, 2).join(" & ")} projects and backend repositories. Perfectly aligned with this opportunity's tech stack.`,
    keyStrengths: matchingSkills.length > 0 ? matchingSkills : studentSkills.slice(0, 3),
    suggestedFocus: `Emphasize your hands-on experience with ${requiredSkills.slice(0, 2).join(", ")} in your submission.`,
  };
}

export async function generateEventWithGemini(
  promptText: string
): Promise<GeneratedEventResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim().length > 0) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a Principal Hackathon & Tech Event Designer for TalentOrbit.
Based on the organizer's idea prompt, generate a structured event specification.

ORGANIZER PROMPT: "${promptText}"

Return a pure JSON object (without markdown or backticks) matching this exact schema:
{
  "title": "Clean, professional, catchy event title",
  "type": "HACKATHON" or "INTERNSHIP" or "WORKSHOP",
  "city": "Bengaluru" or "Delhi NCR" or "Mumbai" or "Remote",
  "isRemote": boolean,
  "description": "2-3 concise, spacious sentences describing the event vision and challenge",
  "requiredSkills": ["Tech1", "Tech2", "Tech3", "Tech4"],
  "rewardOrStipend": "e.g. ₹1,00,000 Prize Pool or ₹40,000/mo",
  "participationMode": "SOLO_OR_TEAM" or "SOLO_ONLY" or "TEAM_ONLY",
  "minTeamSize": number (1-2),
  "maxTeamSize": number (2-4),
  "requiresAppDownload": boolean,
  "appName": "Optional companion app name if needed, or null",
  "appDownloadUrl": "Optional download link or null",
  "deadlineDaysAhead": number (14-30)
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text?.trim() || "";
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleaned);
    } catch (err) {
      console.warn("Gemini API generation failed, using intelligent builder fallback:", err);
    }
  }

  // Graceful contextual parser fallback
  const isInternship = /intern|stipend|role|job/i.test(promptText);
  const isWorkshop = /workshop|masterclass|bootcamp/i.test(promptText);
  const city = /delhi/i.test(promptText)
    ? "Delhi NCR"
    : /mumbai/i.test(promptText)
    ? "Mumbai"
    : /remote|online/i.test(promptText)
    ? "Remote"
    : "Bengaluru";

  return {
    title: isInternship
      ? "Backend Systems Engineering Intern"
      : isWorkshop
      ? "Advanced Cloud & Microservices Masterclass"
      : "Bengaluru High-Performance Systems Hackathon",
    type: isInternship ? "INTERNSHIP" : isWorkshop ? "WORKSHOP" : "HACKATHON",
    city,
    isRemote: city === "Remote",
    description: `A fast-paced opportunity built from: "${promptText}". Focuses on real-world engineering standards, scalable infrastructure, and collaborative problem-solving.`,
    requiredSkills: ["Node.js", "TypeScript", "PostgreSQL", "Docker"],
    rewardOrStipend: isInternship ? "₹40,000/mo" : "₹1,00,000 Prize Pool",
    participationMode: isInternship ? "SOLO_ONLY" : "SOLO_OR_TEAM",
    minTeamSize: 1,
    maxTeamSize: isInternship ? 1 : 4,
    requiresAppDownload: /app|companion|check-in/i.test(promptText),
    appName: /app|companion/i.test(promptText) ? "EventOrbit Companion" : undefined,
    appDownloadUrl: /app|companion/i.test(promptText) ? "https://talentorbit.dev/companion" : undefined,
    deadlineDaysAhead: 21,
  };
}

export interface GeneratedTaskResult {
  title: string;
  description: string;
  type: "COMPANION_APP" | "CODE_SUBMISSION" | "IDEATION_DECK" | "API_BENCHMARK" | "VERIFICATION";
  points: number;
  rubricCriteria: string[];
}

export async function generateTaskWithGemini(
  taskPrompt: string
): Promise<GeneratedTaskResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim().length > 0) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a Principal Hackathon Milestone & Technical Task Architect.
Generate a structured engineering task and evaluation rubric for hackathon participants.

TASK PROMPT: "${taskPrompt}"

Return a pure JSON object (without markdown or backticks):
{
  "title": "Clean, milestone task title (e.g. Milestone 2: Distributed Agent Benchmark)",
  "description": "Clear technical deliverables instructions (2-3 sentences)",
  "type": "CODE_SUBMISSION" or "COMPANION_APP" or "IDEATION_DECK" or "API_BENCHMARK" or "VERIFICATION",
  "points": number (e.g. 250 or 350),
  "rubricCriteria": ["Acceptance criterion 1", "Acceptance criterion 2", "Acceptance criterion 3"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text?.trim() || "";
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleaned);
    } catch (err) {
      console.warn("Gemini Task generation failed, using intelligent fallback:", err);
    }
  }

  // Graceful fallback
  const isCompanion = /companion|nfc|app|sensor/i.test(taskPrompt);
  const isBenchmark = /benchmark|stress|speed|latency/i.test(taskPrompt);
  const isDeck = /deck|ppt|presentation|slide/i.test(taskPrompt);

  return {
    title: isCompanion
      ? "Companion App Hardware Check-in & Telemetry Gate"
      : isBenchmark
      ? "Milestone 2: Distributed Stress Benchmark & Video Demo"
      : isDeck
      ? "Milestone 1: Architecture Deck & Problem Ideation"
      : "Milestone 3: Core Implementation & Public Repository",
    description: `Complete technical requirements for: "${taskPrompt}". Ensure deterministic execution, test scripts, and automated validation.`,
    type: isCompanion
      ? "COMPANION_APP"
      : isBenchmark
      ? "API_BENCHMARK"
      : isDeck
      ? "IDEATION_DECK"
      : "CODE_SUBMISSION",
    points: isBenchmark ? 500 : isCompanion ? 150 : 300,
    rubricCriteria: [
      "Passed all automated test suites and validation scripts",
      "Clean architecture with well-documented API specifications",
      "Live working demo with real-world verification",
    ],
  };
}

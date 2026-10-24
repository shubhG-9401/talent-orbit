import { NextResponse } from "next/server";
import { analyzeGeminiMatch } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { eventTitle, eventDescription, requiredSkills, studentSkills, githubRepos } =
      await request.json();

    const analysis = await analyzeGeminiMatch(
      eventTitle || "Hackathon",
      eventDescription || "",
      requiredSkills || [],
      studentSkills || [],
      githubRepos || []
    );

    return NextResponse.json(analysis);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

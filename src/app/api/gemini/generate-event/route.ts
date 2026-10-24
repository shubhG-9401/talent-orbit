import { NextResponse } from "next/server";
import { generateEventWithGemini } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const generated = await generateEventWithGemini(prompt);
    return NextResponse.json(generated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

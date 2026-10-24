import { NextResponse } from "next/server";
import { INITIAL_EVENTS } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const type = searchParams.get("type");

  let filtered = INITIAL_EVENTS;
  if (city && city !== "All") {
    filtered = filtered.filter((e) =>
      city === "Remote" ? e.isRemote : e.city.toLowerCase() === city.toLowerCase()
    );
  }
  if (type) {
    filtered = filtered.filter((e) => e.type.toLowerCase() === type.toLowerCase());
  }

  return NextResponse.json({ events: filtered });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newEvent = {
      id: `evt_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...body,
    };
    return NextResponse.json({ success: true, event: newEvent }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

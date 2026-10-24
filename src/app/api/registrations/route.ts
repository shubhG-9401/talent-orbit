import { NextResponse } from "next/server";
import { INITIAL_REGISTRATIONS } from "@/lib/data";

let registrationsStore = [...INITIAL_REGISTRATIONS];

export async function GET() {
  return NextResponse.json({ registrations: registrationsStore });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newReg = {
      id: `reg_${Date.now()}`,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      ...body,
    };
    registrationsStore.unshift(newReg);
    return NextResponse.json({ success: true, registration: newReg }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    registrationsStore = registrationsStore.map((r) =>
      r.id === id ? { ...r, status } : r
    );
    return NextResponse.json({ success: true, id, status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { INITIAL_TASKS } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const task = INITIAL_TASKS.find((t) => t.id === taskId);

    if (!task) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, task });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const body = await request.json();
    const task = INITIAL_TASKS.find((t) => t.id === taskId);

    if (!task) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    if (body.title) task.title = body.title;
    if (body.description) task.description = body.description;
    if (body.deadline) task.deadline = body.deadline;
    if (typeof body.isRequired === "boolean") task.isRequired = body.isRequired;
    if (body.points) task.points = Number(body.points);

    return NextResponse.json({ success: true, message: "Task updated", task });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const idx = INITIAL_TASKS.findIndex((t) => t.id === taskId);

    if (idx === -1) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    INITIAL_TASKS.splice(idx, 1);
    return NextResponse.json({ success: true, message: "Task deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

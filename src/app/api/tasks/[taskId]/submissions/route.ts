import { NextResponse } from "next/server";
import { INITIAL_TASKS, INITIAL_SUBMISSIONS } from "@/lib/data";

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

    const submissions = INITIAL_SUBMISSIONS.filter((s) => s.taskId === taskId);

    return NextResponse.json({
      success: true,
      taskId,
      taskTitle: task.title,
      count: submissions.length,
      submissions,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const body = await request.json();
    const { userId = "usr_arjun_sharma", submissionUrl, notes, teamName = "ByteBandits", leadName = "Arjun Sharma" } = body;

    const task = INITIAL_TASKS.find((t) => t.id === taskId);
    if (!task) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    if (!submissionUrl && !notes) {
      return NextResponse.json(
        { success: false, error: "submissionUrl or notes is required to submit a task deliverable." },
        { status: 400 }
      );
    }

    const existingIndex = INITIAL_SUBMISSIONS.findIndex(
      (s) => s.taskId === taskId && (s.userId === userId || s.teamName === teamName)
    );

    const newSubmission = {
      id: existingIndex !== -1 ? INITIAL_SUBMISSIONS[existingIndex].id : `sub_${Date.now()}`,
      taskId,
      taskTitle: task.title,
      eventId: task.eventId,
      userId,
      teamId: "team_bytebandits",
      teamName,
      leadName,
      submissionUrl: submissionUrl || null,
      notes: notes || null,
      status: "SUBMITTED" as const,
      maxScore: task.points,
      companionAppVerified: true,
      submittedAt: new Date().toISOString(),
    };

    if (existingIndex !== -1) {
      INITIAL_SUBMISSIONS[existingIndex] = newSubmission as any;
    } else {
      INITIAL_SUBMISSIONS.unshift(newSubmission as any);
      task.completedCount += 1;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Deliverable successfully submitted to host evaluation queue.",
        submission: newSubmission,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

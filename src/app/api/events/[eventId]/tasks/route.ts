import { NextResponse } from "next/server";
import { INITIAL_TASKS, INITIAL_SUBMISSIONS, INITIAL_EVENTS } from "@/lib/data";
import { EventTask } from "@/types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const event = INITIAL_EVENTS.find((e) => e.id === eventId);
    const tasks = INITIAL_TASKS.filter((t) => t.eventId === eventId);

    const enrichedTasks = tasks.map((task) => {
      const taskSubs = INITIAL_SUBMISSIONS.filter((s) => s.taskId === task.id);
      const userSubmission = userId ? taskSubs.find((s) => s.userId === userId || s.teamName?.includes(userId)) : null;

      return {
        id: task.id,
        eventId: task.eventId,
        title: task.title,
        description: task.description,
        type: task.type,
        deadline: task.deadline,
        isRequired: task.isRequired,
        points: task.points,
        rubricCriteria: task.rubricCriteria,
        createdAt: task.createdAt,
        stats: {
          assignedCount: task.assignedCount,
          completedCount: task.completedCount,
          completionPercentage: Math.round((task.completedCount / Math.max(1, task.assignedCount)) * 100),
          submissionCount: taskSubs.length,
        },
        userStatus: userSubmission
          ? {
              submitted: true,
              status: userSubmission.status,
              score: userSubmission.score,
              submissionUrl: userSubmission.submissionUrl,
              submittedAt: userSubmission.submittedAt,
            }
          : {
              submitted: false,
              status: "PENDING",
            },
      };
    });

    return NextResponse.json({
      success: true,
      eventId,
      eventTitle: event?.title || "Event Challenges",
      count: enrichedTasks.length,
      tasks: enrichedTasks,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch event tasks" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const body = await request.json();
    const { title, description, deadline, isRequired = true, points = 200, rubricCriteria = [] } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: "Title and description are required to create a task." },
        { status: 400 }
      );
    }

    const newTask = {
      id: `task_${Date.now()}`,
      eventId,
      eventTitle: INITIAL_EVENTS.find((e) => e.id === eventId)?.title || "Hackathon Milestone",
      title: title.trim(),
      description: description.trim(),
      type: body.type || "CODE_SUBMISSION",
      deadline: deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isRequired: Boolean(isRequired),
      points: Number(points) || 200,
      assignedCount: 146,
      completedCount: 0,
      rubricCriteria: Array.isArray(rubricCriteria) ? rubricCriteria : [],
      createdAt: new Date().toISOString(),
    };

    INITIAL_TASKS.unshift(newTask as any);

    return NextResponse.json(
      {
        success: true,
        message: "Event task successfully created and broadcasted to companion app.",
        task: newTask,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create task" },
      { status: 500 }
    );
  }
}

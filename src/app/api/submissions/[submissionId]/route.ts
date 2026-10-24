import { NextResponse } from "next/server";
import { INITIAL_SUBMISSIONS } from "@/lib/data";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    const { submissionId } = await params;
    const body = await request.json();
    const { status, score, feedback } = body;

    const sub = INITIAL_SUBMISSIONS.find((s) => s.id === submissionId);
    if (!sub) {
      return NextResponse.json({ success: false, error: "Submission not found" }, { status: 404 });
    }

    if (status) {
      // Map TaskStatus enum
      if (status === "VERIFIED" || status === "COMPLETED") {
        sub.status = "VERIFIED";
      } else if (status === "REJECTED" || status === "REVISE_REQUESTED") {
        sub.status = "REJECTED";
      } else {
        sub.status = status;
      }
    }

    if (typeof score === "number") sub.score = score;
    if (feedback) sub.feedback = feedback;

    return NextResponse.json({
      success: true,
      message: `Submission marked as ${sub.status}. Telemetry updated.`,
      submission: sub,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

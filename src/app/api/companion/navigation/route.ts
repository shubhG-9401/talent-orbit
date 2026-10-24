import { NextResponse } from "next/server";
import { INITIAL_EVENTS, INITIAL_REGISTRATIONS, INITIAL_TASKS, INITIAL_CHANNELS, INITIAL_USER } from "@/lib/data";
import { BottomBarRouteItem, CompanionNavResponse } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "usr_arjun_sharma";
    const eventId = searchParams.get("eventId") || "evt_omnichain_agentic_2025";
    const roleParam = searchParams.get("role") || (userId.includes("host") || userId.includes("sarah") ? "HOST" : "STUDENT");

    const event = INITIAL_EVENTS.find((e) => e.id === eventId) || INITIAL_EVENTS[0];
    const registration = INITIAL_REGISTRATIONS.find((r) => r.eventId === eventId && r.userId === userId);

    const isHost = roleParam === "HOST";
    const isCheckedIn = registration?.completedAppDownload ?? true;
    const teamId = registration?.teamId || "team_bytebandits";
    const teamName = registration?.teamName || "ByteBandits";

    const eventTasks = INITIAL_TASKS.filter((t) => t.eventId === eventId);
    const pendingTasksCount = eventTasks.filter((t) => t.isRequired).length;

    let routes: BottomBarRouteItem[] = [];

    if (isHost) {
      // Dynamic bottom-bar for Organizers / Host Staff
      routes = [
        {
          id: "scanner",
          label: "NFC Scanner",
          icon: "qr_code_scanner",
          route: `/companion/${eventId}/scanner`,
          badge: "Live Gate",
          active: true,
        },
        {
          id: "task_mgmt",
          label: "Host Tasks",
          icon: "checklist",
          route: `/companion/${eventId}/tasks`,
          badge: `${eventTasks.length} Milestones`,
        },
        {
          id: "broadcast",
          label: "Announce",
          icon: "campaign",
          route: `/companion/${eventId}/broadcast`,
        },
        {
          id: "host_dms",
          label: "Student DMs",
          icon: "forum",
          route: `/companion/${eventId}/dms`,
          badge: "Active",
        },
        {
          id: "telemetry",
          label: "Live Stats",
          icon: "insights",
          route: `/companion/${eventId}/telemetry`,
        },
      ];
    } else {
      // Dynamic bottom-bar for Student Participants
      routes = [
        {
          id: "checkin",
          label: isCheckedIn ? "Arrival Badge" : "NFC Check-In",
          icon: isCheckedIn ? "verified" : "nfc",
          route: `/companion/${eventId}/checkin`,
          badge: isCheckedIn ? "Verified" : "Required",
          active: true,
        },
        {
          id: "tasks",
          label: "Host Tasks",
          icon: "task_alt",
          route: `/companion/${eventId}/tasks`,
          badge: pendingTasksCount > 0 ? `${pendingTasksCount} Due` : null,
        },
        {
          id: "team_chat",
          label: teamName ? "Team Chat" : "General Chat",
          icon: "chat",
          route: `/companion/${eventId}/chat/team`,
          badge: teamName || "Chat",
        },
        {
          id: "organizer_desk",
          label: "Host Desk",
          icon: "support_agent",
          route: `/companion/${eventId}/chat/organizer`,
          badge: "Official",
        },
        {
          id: "standings",
          label: "Leaderboard",
          icon: "leaderboard",
          route: `/companion/${eventId}/leaderboard`,
        },
      ];
    }

    const responseData: CompanionNavResponse = {
      eventId,
      userId,
      role: isHost ? "HOST" : "STUDENT",
      eventTitle: event.title,
      routes,
      isCheckedIn,
      pendingTasksCount,
      teamId: isHost ? null : teamId,
      teamName: isHost ? null : teamName,
    };

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: responseData,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate dynamic navigation" },
      { status: 500 }
    );
  }
}

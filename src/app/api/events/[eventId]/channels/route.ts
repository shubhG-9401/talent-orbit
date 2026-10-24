import { NextResponse } from "next/server";
import { INITIAL_CHANNELS, INITIAL_EVENTS, AVAILABLE_CHAT_PARTICIPANTS } from "@/lib/data";
import { ChatChannel, ChannelMember } from "@/types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "usr_arjun_sharma";
    const teamIdParam = searchParams.get("teamId");
    const showAll = searchParams.get("all") === "true";

    // Channels for this event
    const channels = INITIAL_CHANNELS.filter((c) => c.eventId === eventId);

    const isHost = userId.includes("host") || userId.includes("sarah") || showAll;

    const accessibleChannels = channels.filter((c) => {
      if (isHost) return true; // Organizers have full visibility
      if (!c.isHostDM && !c.teamId && (c.type === "ANNOUNCEMENT" || c.type === "TRACK_ROOM" || c.type === "MENTOR_DESK")) return true;
      if (c.type === "GROUP") {
        // Visible if public or user is in members list
        if (!c.members || c.members.length === 0) return true;
        return c.members.some((m) => m.userId === userId);
      }
      if (c.teamId && (c.teamId === teamIdParam || c.teamId === "team_bytebandits")) return true;
      if (c.isHostDM && c.studentId === userId) return true;
      return false;
    });

    return NextResponse.json({
      success: true,
      eventId,
      count: accessibleChannels.length,
      channels: accessibleChannels,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const body = await request.json();
    const {
      title,
      description,
      type = "GROUP",
      memberIds = [],
      members = [],
      createdById = "usr_host_sarah",
      createdByName = "Sarah Chen (Host)",
      teamId = null,
      teamName = null,
      isHostDM = false,
      studentId = null,
      studentName = null,
    } = body;

    const event = INITIAL_EVENTS.find((e) => e.id === eventId);

    // Build member roster
    const resolvedMembers: ChannelMember[] = [];

    // Add creator as HOST member
    resolvedMembers.push({
      id: `mem_creator_${Date.now()}`,
      userId: createdById,
      userName: createdByName,
      userEmail: "host@talentorbit.xyz",
      role: "HOST",
      avatar: "🪐",
      joinedAt: new Date().toISOString(),
    });

    // Add custom members provided
    if (Array.isArray(members)) {
      for (const m of members) {
        if (m.userId && !resolvedMembers.some((r) => r.userId === m.userId)) {
          resolvedMembers.push({
            id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            userId: m.userId,
            userName: m.userName || "Participant",
            userEmail: m.userEmail || "builder@talentorbit.xyz",
            role: m.role || "STUDENT",
            teamName: m.teamName,
            avatar: m.avatar || "👤",
            joinedAt: new Date().toISOString(),
          });
        }
      }
    }

    // Add memberIds resolved from AVAILABLE_CHAT_PARTICIPANTS
    if (Array.isArray(memberIds)) {
      for (const id of memberIds) {
        if (!resolvedMembers.some((r) => r.userId === id)) {
          const participant = AVAILABLE_CHAT_PARTICIPANTS.find((p) => p.userId === id);
          if (participant) {
            resolvedMembers.push({
              id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
              userId: participant.userId,
              userName: participant.userName,
              userEmail: participant.userEmail,
              role: participant.role,
              teamName: participant.teamName,
              avatar: participant.avatar,
              joinedAt: new Date().toISOString(),
            });
          }
        }
      }
    }

    const newChannel: ChatChannel = {
      id: `chn_${Date.now()}`,
      eventId,
      eventTitle: event?.title || "Hackathon Channel",
      teamId,
      teamName,
      isHostDM: Boolean(isHostDM),
      studentId,
      studentName,
      title: title || (isHostDM ? `Support Desk: Host Contact` : teamName ? `${teamName} Private Squad` : "Community Group"),
      description: description || "Interactive collaboration & track discussion room.",
      type: type as any,
      createdById,
      createdByName,
      members: resolvedMembers,
      memberCount: resolvedMembers.length,
      unreadCount: 0,
      lastMessage: "Group channel established. All designated members joined.",
      lastMessageAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    INITIAL_CHANNELS.unshift(newChannel);

    return NextResponse.json(
      {
        success: true,
        message: "Channel successfully created for companion mobile & web routing.",
        channel: newChannel,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { INITIAL_CHANNELS, AVAILABLE_CHAT_PARTICIPANTS } from "@/lib/data";
import { ChannelMember } from "@/types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const { channelId } = await params;
    const channel = INITIAL_CHANNELS.find((c) => c.id === channelId);

    if (!channel) {
      return NextResponse.json(
        { success: false, error: `Channel with id ${channelId} not found.` },
        { status: 404 }
      );
    }

    if (!channel.members) {
      channel.members = [];
    }

    return NextResponse.json({
      success: true,
      channelId,
      channelTitle: channel.title,
      memberCount: channel.members.length,
      members: channel.members,
      availableCandidates: AVAILABLE_CHAT_PARTICIPANTS.filter(
        (p) => !channel.members?.some((m) => m.userId === p.userId)
      ),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const { channelId } = await params;
    const channel = INITIAL_CHANNELS.find((c) => c.id === channelId);

    if (!channel) {
      return NextResponse.json(
        { success: false, error: `Channel with id ${channelId} not found.` },
        { status: 404 }
      );
    }

    if (!channel.members) {
      channel.members = [];
    }

    const body = await request.json();
    const { member, members, memberIds } = body;

    const added: ChannelMember[] = [];

    // Support single member addition
    if (member && member.userId) {
      const exists = channel.members.some((m) => m.userId === member.userId);
      if (!exists) {
        const newM: ChannelMember = {
          id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          userId: member.userId,
          userName: member.userName || "Participant",
          userEmail: member.userEmail || "builder@talentorbit.xyz",
          role: member.role || "STUDENT",
          teamName: member.teamName,
          avatar: member.avatar || "👤",
          joinedAt: new Date().toISOString(),
        };
        channel.members.push(newM);
        added.push(newM);
      }
    }

    // Support multiple members array
    if (Array.isArray(members)) {
      for (const m of members) {
        if (!m.userId) continue;
        const exists = channel.members.some((existing) => existing.userId === m.userId);
        if (!exists) {
          const newM: ChannelMember = {
            id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            userId: m.userId,
            userName: m.userName || "Participant",
            userEmail: m.userEmail || "builder@talentorbit.xyz",
            role: m.role || "STUDENT",
            teamName: m.teamName,
            avatar: m.avatar || "👤",
            joinedAt: new Date().toISOString(),
          };
          channel.members.push(newM);
          added.push(newM);
        }
      }
    }

    // Support memberIds lookup from AVAILABLE_CHAT_PARTICIPANTS
    if (Array.isArray(memberIds)) {
      for (const id of memberIds) {
        const exists = channel.members.some((existing) => existing.userId === id);
        if (!exists) {
          const participant = AVAILABLE_CHAT_PARTICIPANTS.find((p) => p.userId === id);
          if (participant) {
            const newM: ChannelMember = {
              id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
              userId: participant.userId,
              userName: participant.userName,
              userEmail: participant.userEmail,
              role: participant.role,
              teamName: participant.teamName,
              avatar: participant.avatar,
              joinedAt: new Date().toISOString(),
            };
            channel.members.push(newM);
            added.push(newM);
          }
        }
      }
    }

    channel.memberCount = channel.members.length;

    return NextResponse.json({
      success: true,
      message: `Added ${added.length} member(s) to channel.`,
      addedCount: added.length,
      currentMemberCount: channel.members.length,
      members: channel.members,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const { channelId } = await params;
    const channel = INITIAL_CHANNELS.find((c) => c.id === channelId);

    if (!channel) {
      return NextResponse.json(
        { success: false, error: `Channel with id ${channelId} not found.` },
        { status: 404 }
      );
    }

    if (!channel.members) {
      channel.members = [];
    }

    const { searchParams } = new URL(request.url);
    let userId = searchParams.get("userId");

    if (!userId) {
      try {
        const body = await request.json();
        userId = body.userId;
      } catch (e) {
        // body could be empty if passed as query param
      }
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required to remove a member." },
        { status: 400 }
      );
    }

    const initialCount = channel.members.length;
    channel.members = channel.members.filter((m) => m.userId !== userId);
    channel.memberCount = channel.members.length;

    const removed = initialCount !== channel.members.length;

    return NextResponse.json({
      success: true,
      message: removed ? `Member ${userId} removed from channel.` : "Member not found in channel.",
      removed,
      currentMemberCount: channel.members.length,
      members: channel.members,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

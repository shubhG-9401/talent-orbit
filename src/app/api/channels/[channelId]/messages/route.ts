import { NextResponse } from "next/server";
import { INITIAL_CHANNELS, INITIAL_MESSAGES, INITIAL_USER, DEMO_HOST_USER } from "@/lib/data";
import { ChatMessage } from "@/types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const { channelId } = await params;
    const channel = INITIAL_CHANNELS.find((c) => c.id === channelId);

    if (!channel) {
      return NextResponse.json(
        { success: false, error: `Channel not found with id: ${channelId}` },
        { status: 404 }
      );
    }

    const messages = INITIAL_MESSAGES.filter((m) => m.channelId === channelId).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Reset unread count when messages are fetched
    channel.unreadCount = 0;

    return NextResponse.json({
      success: true,
      channelId,
      channelTitle: channel.title,
      isHostDM: channel.isHostDM,
      teamId: channel.teamId,
      count: messages.length,
      messages,
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
        { success: false, error: `Channel not found with id: ${channelId}` },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { senderId, text, mediaUrl = null, senderName, senderRole } = body;

    if (!text || text.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Message text cannot be empty." },
        { status: 400 }
      );
    }

    const isHost =
      senderRole === "HOST" ||
      (senderId && (senderId.includes("host") || senderId.includes("sarah")));

    const inferredSenderName =
      senderName ||
      (isHost
        ? DEMO_HOST_USER.name + " (Host / DevRel)"
        : senderId === INITIAL_USER.id
        ? INITIAL_USER.name
        : "Participant");

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      channelId,
      senderId: senderId || (isHost ? DEMO_HOST_USER.id : INITIAL_USER.id),
      senderName: inferredSenderName,
      senderRole: isHost ? "HOST" : "STUDENT",
      text: text.trim(),
      mediaUrl: mediaUrl || null,
      createdAt: new Date().toISOString(),
    };

    INITIAL_MESSAGES.push(newMessage);

    // Update channel metadata
    channel.lastMessage = newMessage.text;
    channel.lastMessageAt = newMessage.createdAt;

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully.",
        chatMessage: newMessage,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

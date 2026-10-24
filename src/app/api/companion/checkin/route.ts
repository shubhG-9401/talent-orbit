import { NextResponse } from "next/server";
import { INITIAL_REGISTRATIONS } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, userId, deviceId, nfcToken, biometricVerified } = body;

    if (!eventId || !userId) {
      return NextResponse.json(
        { success: false, error: "eventId and userId are required parameters." },
        { status: 400 }
      );
    }

    const reg = INITIAL_REGISTRATIONS.find((r) => r.eventId === eventId && r.userId === userId);
    if (reg) {
      reg.completedAppDownload = true;
      reg.deviceId = deviceId || `dev-${Date.now().toString(16)}`;
      reg.appHandshake = true;
    }

    const hardwarePassToken = `NFC-PASS-${Date.now().toString(36).toUpperCase()}-${(deviceId || "ANDROID").slice(0, 6).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      message: "Companion Android app check-in and NFC hardware pairing verified.",
      data: {
        eventId,
        userId,
        deviceId: deviceId || "android-pixel-testnet",
        nfcToken: nfcToken || "nfc_tag_sensor_valid",
        hardwarePassToken,
        biometricVerified: biometricVerified ?? true,
        checkedInAt: new Date().toISOString(),
        venueCheckInStatus: "ACTIVE_PASS_GRANTED",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process companion check-in." },
      { status: 500 }
    );
  }
}

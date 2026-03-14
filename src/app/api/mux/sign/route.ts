import { NextRequest, NextResponse } from "next/server";
import { getSignedPlaybackToken } from "@/lib/mux";

const PLAYBACK_ID_REGEX = /^[a-zA-Z0-9]+$/;
const MAX_PLAYBACK_ID_LENGTH = 100;

export async function POST(request: NextRequest) {
  const { playbackId } = await request.json();

  if (!playbackId || typeof playbackId !== "string") {
    return NextResponse.json({ error: "Missing playbackId" }, { status: 400 });
  }

  if (playbackId.length > MAX_PLAYBACK_ID_LENGTH || !PLAYBACK_ID_REGEX.test(playbackId)) {
    return NextResponse.json({ error: "Invalid playbackId format" }, { status: 400 });
  }

  try {
    const token = await getSignedPlaybackToken(playbackId);
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Failed to sign Mux playback token:", error);
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
  }
}

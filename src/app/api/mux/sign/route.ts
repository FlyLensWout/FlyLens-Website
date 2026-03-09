import { NextRequest, NextResponse } from "next/server";
import { getSignedPlaybackToken } from "@/lib/mux";

export async function POST(request: NextRequest) {
  const { playbackId } = await request.json();

  if (!playbackId) {
    return NextResponse.json({ error: "Missing playbackId" }, { status: 400 });
  }

  const token = await getSignedPlaybackToken(playbackId);

  return NextResponse.json({ token });
}

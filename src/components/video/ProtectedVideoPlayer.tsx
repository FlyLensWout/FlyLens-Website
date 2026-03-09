"use client";

import MuxPlayer from "@mux/mux-player-react";

interface ProtectedVideoPlayerProps {
  playbackId: string;
  token: string;
  title?: string;
  poster?: string;
}

export default function ProtectedVideoPlayer({
  playbackId,
  token,
  title,
  poster,
}: ProtectedVideoPlayerProps) {
  return (
    <div
      className="relative rounded-lg overflow-hidden"
      onContextMenu={(e) => e.preventDefault()}
    >
      <MuxPlayer
        playbackId={playbackId}
        tokens={{ playback: token }}
        metadata={{ video_title: title }}
        poster={poster}
        streamType="on-demand"
        accentColor="#33C6F2"
        style={{ aspectRatio: "16/9", width: "100%" }}
        maxResolution="1080p"
      />
      {/* Watermark overlay */}
      <div className="absolute top-4 right-4 pointer-events-none opacity-50 z-10">
        <span className="text-white text-sm font-semibold tracking-wider bg-black/30 px-2 py-1 rounded">
          FLYLENS
        </span>
      </div>
    </div>
  );
}

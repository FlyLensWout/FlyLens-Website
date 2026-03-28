"use client";

import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  videoFileName: string;
  title?: string;
}

export default function VideoPlayer({
  videoFileName,
  title,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "s" || e.key === "S" || e.key === "u" || e.key === "U")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className="relative rounded-lg overflow-hidden select-none"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <video
        ref={videoRef}
        src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${encodeURIComponent(videoFileName.trim())}`}
        title={title}
        controls
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        playsInline
        preload="metadata"
        style={{ aspectRatio: "16/9", width: "100%" }}
        className="bg-black"
        onContextMenu={(e) => e.preventDefault()}
      />
      {/* Overlay covering only the video area above the controls */}
      <div
        className="absolute inset-0"
        style={{ bottom: "48px", background: "transparent" }}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onClick={() => {
          if (videoRef.current) {
            if (videoRef.current.paused) {
              videoRef.current.play();
            } else {
              videoRef.current.pause();
            }
          }
        }}
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

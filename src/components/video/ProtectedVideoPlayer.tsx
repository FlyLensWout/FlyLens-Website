"use client";

import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  videoFileName: string;
  title?: string;
}

export default function VideoPlayer({
  videoFileName,
  title,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    async function loadVideo() {
      try {
        const res = await fetch(`/api/video?file=${encodeURIComponent(videoFileName)}`);
        if (!res.ok) throw new Error("Failed to load");
        const blob = await res.blob();
        if (cancelled) return;

        objectUrl = URL.createObjectURL(blob);

        if (videoRef.current) {
          videoRef.current.src = objectUrl;
          // Revoke after the video element has grabbed the reference.
          // The video keeps playing, but the blob URL becomes useless
          // if someone copies it to another tab.
          setTimeout(() => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
          }, 1000);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadVideo();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [videoFileName]);

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
      {loading && (
        <div className="aspect-video bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}
      {error && (
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Failed to load video</p>
        </div>
      )}
      <video
        ref={videoRef}
        title={title}
        controls
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        playsInline
        preload="metadata"
        style={{ aspectRatio: "16/9", width: "100%", display: loading || error ? "none" : "block" }}
        className="bg-black"
        onContextMenu={(e) => e.preventDefault()}
      />
      {/* Invisible overlay to block drag-to-save */}
      {!loading && !error && (
        <div
          className="absolute inset-0"
          style={{ background: "transparent" }}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const controlsHeight = 40;
            const clickY = e.clientY - rect.top;
            if (clickY < rect.height - controlsHeight) {
              if (videoRef.current) {
                if (videoRef.current.paused) {
                  videoRef.current.play();
                } else {
                  videoRef.current.pause();
                }
              }
            }
          }}
        />
      )}
      {/* Watermark overlay */}
      {!loading && !error && (
        <div className="absolute top-4 right-4 pointer-events-none opacity-50 z-10">
          <span className="text-white text-sm font-semibold tracking-wider bg-black/30 px-2 py-1 rounded">
            FLYLENS
          </span>
        </div>
      )}
    </div>
  );
}

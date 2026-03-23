"use client";

import { useState } from "react";
import VideoPlayer from "@/components/video/ProtectedVideoPlayer";

interface PortfolioCardProps {
  title: string;
  description: string;
  videoFileName: string;
  tags: string[];
}

export default function PortfolioCard({
  title,
  description,
  videoFileName,
  tags,
}: PortfolioCardProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="hover-lift group rounded-xl overflow-hidden border border-gray-200 bg-white hover:border-accent shadow-sm hover:shadow-md transition-all">
      {playing ? (
        <VideoPlayer
          videoFileName={videoFileName}
          title={title}
        />
      ) : (
        <button
          type="button"
          className="relative aspect-video cursor-pointer w-full bg-black"
          aria-label={`Play video: ${title}`}
          onClick={() => setPlaying(true)}
        >
          {/* Thumbnail from proxied video */}
          <video
            src={`/api/video?file=${encodeURIComponent(videoFileName)}#t=0.5`}
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
            onContextMenu={(e) => e.preventDefault()}
          />
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
            <div className="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-primary">{title}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{description}</p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

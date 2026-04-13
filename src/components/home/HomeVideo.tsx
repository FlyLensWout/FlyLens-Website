"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import FadeIn from "@/components/animations/FadeIn";

const H265_SRC = "/homepageVideo/Introductie_FlyLens_H.265_LowQ.mp4";
const H264_SRC = "/homepageVideo/Introductie_FlyLens_H.264_LowQ.mp4";

function checkBlackFrames(video: HTMLVideoElement): boolean {
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext("2d");
  if (!ctx) return false;
  ctx.drawImage(video, 0, 0, 16, 16);
  const data = ctx.getImageData(0, 0, 16, 16).data;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] > 0 || data[i + 1] > 0 || data[i + 2] > 0) return false;
  }
  return true;
}

export default function HomeVideo() {
  const t = useTranslations("home.video");
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const userPaused = useRef(false);
  const [videoSrc, setVideoSrc] = useState(H265_SRC);
  const fellBack = useRef(false);
  const checkedPixels = useRef(false);

  const startPlayback = useCallback(async (video: HTMLVideoElement) => {
    try {
      video.muted = false;
      await video.play();
      setPlaying(true);
      setMuted(false);
    } catch {
      try {
        video.muted = true;
        await video.play();
        setPlaying(true);
        setMuted(true);
      } catch {
        // Can't autoplay at all
      }
    }
  }, []);

  // When videoSrc changes, reload the video and start playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load();

    // If we fell back to H.264, auto-play it
    if (fellBack.current) {
      const onCanPlay = () => {
        startPlayback(video);
      };
      video.addEventListener("canplay", onCanPlay, { once: true });
      return () => video.removeEventListener("canplay", onCanPlay);
    }
  }, [videoSrc, startPlayback]);

  // Intersection observer for auto-play on scroll
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!userPaused.current) {
            startPlayback(video).then(() => {
              // After playback starts with H.265, check for black frames
              if (!checkedPixels.current && !fellBack.current && videoSrc === H265_SRC) {
                checkedPixels.current = true;
                setTimeout(() => {
                  if (checkBlackFrames(video)) {
                    video.pause();
                    fellBack.current = true;
                    setVideoSrc(H264_SRC);
                  }
                }, 500);
              }
            });
          }
        } else if (!video.paused) {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [videoSrc, startPlayback]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      userPaused.current = true;
    } else {
      videoRef.current.play();
      userPaused.current = false;
    }
    setPlaying(!playing);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if ((video as any).webkitEnterFullscreen) {
      (video as any).webkitEnterFullscreen();
    }
  };

  return (
    <section ref={sectionRef} className="pt-0 md:pt-2 pb-10 md:pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            {t("title")}
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
        <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            loop
            playsInline
            preload="metadata"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          <div className="absolute bottom-4 right-4 z-20 flex gap-2">
          <button
            onClick={togglePlay}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors backdrop-blur-sm"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <line x1="6" y1="4" x2="6" y2="20" />
                <line x1="18" y1="4" x2="18" y2="20" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>
          <button
            onClick={toggleMute}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors backdrop-blur-sm"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M19.07 4.93a10 10 0 010 14.14" />
                <path d="M15.54 8.46a5 5 0 010 7.08" />
              </svg>
            )}
          </button>
          <button
            onClick={toggleFullscreen}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors backdrop-blur-sm"
            aria-label="Fullscreen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </button>
          </div>
        </div>
        </FadeIn>
      </div>
    </section>
  );
}

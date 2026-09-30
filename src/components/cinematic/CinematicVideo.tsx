'use client';

import React, { useRef, useEffect, useState } from 'react';

interface CinematicVideoProps {
  srcMp4: string;
  srcWebm?: string;
  poster?: string;
  progress?: number; // Normalized 0 to 1 for scroll scrubbing
  isScrubbing?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  onLoadedMetadata?: (duration: number) => void;
}

export default function CinematicVideo({
  srcMp4,
  srcWebm,
  poster,
  progress,
  isScrubbing = false,
  autoPlay = false,
  loop = true,
  muted = true,
  className = '',
  onLoadedMetadata,
}: CinematicVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [duration, setDuration] = useState(0);
  const targetTimeRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Handle Metadata
  const handleLoaded = () => {
    const video = videoRef.current;
    if (!video) return;
    const dur = video.duration || 0;
    setDuration(dur);
    if (onLoadedMetadata) onLoadedMetadata(dur);
    if (autoPlay && !isScrubbing) {
      video.play().catch(() => {});
    }
  };

  // Synchronized Scroll Scrubbing via requestAnimationFrame
  useEffect(() => {
    if (!isScrubbing || duration <= 0) return;
    const video = videoRef.current;
    if (!video) return;

    video.pause();

    const normalized = Math.max(0, Math.min(1, progress ?? 0));
    targetTimeRef.current = normalized * duration;

    const smoothScrub = () => {
      if (!video) return;
      const current = video.currentTime;
      const target = targetTimeRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.02) {
        video.currentTime = current + diff * 0.35;
        rafIdRef.current = requestAnimationFrame(smoothScrub);
      } else {
        video.currentTime = target;
        rafIdRef.current = null;
      }
    };

    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(smoothScrub);
    }

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [progress, isScrubbing, duration]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        playsInline
        muted={muted}
        loop={loop}
        autoPlay={autoPlay && !isScrubbing}
        poster={poster}
        onLoadedMetadata={handleLoaded}
        className="w-full h-full object-cover pointer-events-none will-change-transform"
      >
        {srcWebm && <source src={srcWebm} type="video/webm" />}
        <source src={srcMp4} type="video/mp4" />
      </video>
    </div>
  );
}

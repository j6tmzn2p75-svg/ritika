'use client';

import React, { useRef, useEffect } from 'react';

interface CinematicSequenceProps {
  frameTemplate: (index: number) => string;
  totalFrames: number;
  progress: number; // 0 to 1
  startFrame?: number;
  className?: string;
}

export default function CinematicSequence({
  frameTemplate,
  totalFrames,
  progress,
  startFrame = 0,
  className = '',
}: CinematicSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const activeFrameRef = useRef<number>(-1);

  // Preload and progressive cache
  useEffect(() => {
    const cache = cacheRef.current;
    const preloadWindow = 12; // Window around current frame
    const currentFrame = Math.floor(progress * (totalFrames - 1)) + startFrame;

    for (let i = Math.max(startFrame, currentFrame - preloadWindow); i <= Math.min(startFrame + totalFrames - 1, currentFrame + preloadWindow); i++) {
      if (!cache.has(i)) {
        const img = new Image();
        img.src = frameTemplate(i);
        cache.set(i, img);
      }
    }

    // Clean up distant frames if cache exceeds limit
    if (cache.size > 50) {
      for (const [key] of cache) {
        if (Math.abs(key - currentFrame) > 30) {
          cache.delete(key);
        }
      }
    }
  }, [progress, totalFrames, startFrame, frameTemplate]);

  // Render to single Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frameIndex = Math.min(
      startFrame + totalFrames - 1,
      Math.max(startFrame, Math.floor(progress * (totalFrames - 1)) + startFrame)
    );

    if (frameIndex === activeFrameRef.current) return;
    activeFrameRef.current = frameIndex;

    const renderImage = (img: HTMLImageElement) => {
      if (!canvas || !ctx) return;
      if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
        }
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    const cached = cacheRef.current.get(frameIndex);
    if (cached && cached.complete && cached.naturalWidth > 0) {
      renderImage(cached);
    } else {
      const img = new Image();
      img.src = frameTemplate(frameIndex);
      img.onload = () => {
        cacheRef.current.set(frameIndex, img);
        if (activeFrameRef.current === frameIndex) {
          renderImage(img);
        }
      };
    }
  }, [progress, totalFrames, startFrame, frameTemplate]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full object-cover pointer-events-none ${className}`}
    />
  );
}

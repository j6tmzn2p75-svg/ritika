'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, Crown } from 'lucide-react';
import ThreeCakeCanvas from '@/components/3d/ThreeCakeCanvas';
import confetti from 'canvas-confetti';

interface CakeSceneProps {
  onEnterMemoryBox: () => void;
  cakeHeading?: string;
  cakeSubheading?: string;
  cakeText?: string;
}

export default function CakeScene({
  onEnterMemoryBox,
  cakeHeading = 'HAPPY BIRTHDAY',
  cakeSubheading = 'RITIKA',
  cakeText = 'Happy Birthday Ritika',
}: CakeSceneProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTypography, setShowTypography] = useState(false);
  const [isTransitioningOut, setIsTransitioningOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTypography(true);
      try {
        confetti({
          particleCount: 70,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#ff2e93', '#ffd166', '#ffb3d9', '#ffffff'],
        });
      } catch {}
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  // Handle scroll / wheel progression
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setScrollProgress((prev) => {
        const delta = e.deltaY * 0.0014;
        const next = Math.max(0, Math.min(1, prev + delta));
        if (next >= 0.98 && !isTransitioningOut) {
          triggerExit();
        }
        return next;
      });
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = (touchStartY - e.touches[0].clientY) * 0.005;
      setScrollProgress((prev) => {
        const next = Math.max(0, Math.min(1, prev + deltaY));
        if (next >= 0.98 && !isTransitioningOut) {
          triggerExit();
        }
        return next;
      });
      touchStartY = e.touches[0].clientY;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isTransitioningOut]);

  const triggerExit = () => {
    setIsTransitioningOut(true);
    setTimeout(() => {
      onEnterMemoryBox();
    }, 700);
  };

  const handleManualEnter = () => {
    const interval = setInterval(() => {
      setScrollProgress((prev) => {
        if (prev >= 0.98) {
          clearInterval(interval);
          triggerExit();
          return 1;
        }
        return prev + 0.08;
      });
    }, 30);
  };

  return (
    <div className="relative w-screen min-h-[100dvh] overflow-hidden bg-[#0c0107] select-none flex flex-col justify-between">
      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <ThreeCakeCanvas
          scrollProgress={scrollProgress}
          cakeText={cakeText}
          onEnterMessage={triggerExit}
        />
      </div>

      {/* Floating Rose Petals Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-pink-400/25 blur-[1px] animate-float-slow"
            style={{
              width: `${(i % 3 + 1) * 4 + 4}px`,
              height: `${(i % 2 + 1) * 3 + 4}px`,
              left: `${(i * 17) % 100}%`,
              top: `${(i * 29) % 100}%`,
              transform: `rotate(${i * 45}deg)`,
              animationDuration: `${(i % 3 + 4)}s`,
            }}
          />
        ))}
      </div>

      {/* Top Grand Birthday Typography */}
      <AnimatePresence>
        {showTypography && scrollProgress < 0.6 && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1 - scrollProgress * 1.5, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            className="relative z-20 flex flex-col items-center pt-8 sm:pt-12 px-4 pointer-events-none text-center"
          >
            <div className="mb-2">
              <span className="eyebrow-badge">
                <Crown className="w-3 h-3 text-pink-300" />
                <span>Fairytale Royal Coronation</span>
                <Sparkles className="w-3 h-3 text-pink-300" />
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif-display font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-pink-200 to-rose-300 filter drop-shadow-[0_4px_25px_rgba(255,46,147,0.7)]">
              {cakeHeading}
            </h1>

            <h2 className="text-4xl sm:text-6xl md:text-8xl font-serif-display font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 glow-pink-text mt-1">
              {cakeSubheading}
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Scroll / Dive-in Cue with Button-in-Button Architecture */}
      <div className="relative z-20 flex flex-col items-center pb-8 px-4">
        {scrollProgress < 0.6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.7 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="p-1 rounded-full bg-pink-500/10 border border-white/10">
              <button
                onClick={handleManualEnter}
                className="pl-6 pr-2 py-2 rounded-full bg-black/40 backdrop-blur-md border border-pink-400/30 flex items-center gap-3 text-xs sm:text-sm text-pink-200 hover:text-white transition-all cursor-pointer group shadow-lg"
              >
                <span className="font-serif-display uppercase tracking-widest text-[11px]">
                  Scroll into cake message
                </span>
                {/* Button-in-Button Trailing Icon Wrapper */}
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-pink-300 group-hover:translate-y-0.5 transition-transform">
                  <ChevronDown className="w-4 h-4 animate-bounce" />
                </div>
              </button>
            </div>

            {/* Scroll Progress indicator pill */}
            <div className="w-32 h-1 rounded-full bg-pink-950/60 overflow-hidden border border-pink-500/20">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-amber-300 rounded-full transition-all duration-100"
                style={{ width: `${Math.max(5, scrollProgress * 100)}%` }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Exit Flash when zooming through the text */}
      <AnimatePresence>
        {isTransitioningOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="fixed inset-0 z-50 pointer-events-none bg-gradient-to-b from-[#ffd166]/80 via-white to-[#ff2e93] backdrop-blur-md"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

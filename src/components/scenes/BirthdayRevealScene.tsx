'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Crown, ArrowDown } from 'lucide-react';
import ThreeCakeCanvas from '@/components/3d/ThreeCakeCanvas';
import confetti from 'canvas-confetti';

interface BirthdayRevealSceneProps {
  onEnterMemoryBox: () => void;
  cakeHeading?: string;
  cakeSubheading?: string;
  cakeText?: string;
}

export default function BirthdayRevealScene({
  onEnterMemoryBox,
  cakeHeading = 'HAPPY BIRTHDAY',
  cakeSubheading = 'RITIKA',
  cakeText = 'HAPPY BIRTHDAY RITIKA',
}: BirthdayRevealSceneProps) {
  const [candlesLit, setCandlesLit] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTransitioningOut, setIsTransitioningOut] = useState(false);
  const scrollRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const exitTriggeredRef = useRef(false);

  // Global helper for precise automation/testing
  useEffect(() => {
    (window as unknown as { __setCakeScrollProgress?: (v: number) => void }).__setCakeScrollProgress = (val: number) => {
      setScrollProgress(Math.max(0, Math.min(1, val)));
      scrollRef.current = Math.max(0, Math.min(1, val));
    };
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setCandlesLit(1), 350);
    const t2 = setTimeout(() => setCandlesLit(3), 900);
    const t3 = setTimeout(() => {
      setCandlesLit(6);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.65, x: 0.7 },
          colors: ['#ffd166', '#ff2e93', '#ffb3d9', '#ffffff'],
        });
      } catch {}
    }, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const triggerExit = useCallback(() => {
    if (exitTriggeredRef.current) return;
    exitTriggeredRef.current = true;
    setIsTransitioningOut(true);
    setTimeout(() => {
      onEnterMemoryBox();
    }, 700);
  }, [onEnterMemoryBox]);

  // GPU-composited scroll handling with rAF batching
  useEffect(() => {
    let pendingDelta = 0;
    let isScheduled = false;

    const applyScroll = () => {
      isScheduled = false;
      const newVal = Math.max(0, Math.min(1, scrollRef.current + pendingDelta));
      pendingDelta = 0;
      scrollRef.current = newVal;
      setScrollProgress(newVal);

      if (newVal >= 0.96 && !exitTriggeredRef.current) {
        triggerExit();
      }
    };

    const scheduleUpdate = () => {
      if (!isScheduled) {
        isScheduled = true;
        requestAnimationFrame(applyScroll);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      pendingDelta += e.deltaY * 0.00045;
      scheduleUpdate();
    };

    let touchY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = (touchY - e.touches[0].clientY) * 0.0022;
      pendingDelta += deltaY;
      touchY = e.touches[0].clientY;
      scheduleUpdate();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [triggerExit]);

  // Smooth programmatic drone flight using rAF instead of setInterval
  const handleAutoFlyDrone = useCallback(() => {
    let startTime: number | null = null;
    const phase1Duration = 2000; // 2s to reach overhead
    const pauseDuration = 1200;  // 1.2s pause
    const phase2Duration = 2000; // 2s zoom into name

    const initialProgress = scrollRef.current;

    const tick = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed < phase1Duration) {
        // Phase 1: fly to overhead (0 -> 0.55)
        const t = elapsed / phase1Duration;
        const eased = t * t * (3 - 2 * t); // smoothstep
        const val = initialProgress + (0.55 - initialProgress) * eased;
        scrollRef.current = val;
        setScrollProgress(val);
        rafRef.current = requestAnimationFrame(tick);
      } else if (elapsed < phase1Duration + pauseDuration) {
        // Pause at overhead
        scrollRef.current = 0.55;
        setScrollProgress(0.55);
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Phase 2: zoom into name gap (0.55 -> 1.0)
        const phase2Elapsed = elapsed - phase1Duration - pauseDuration;
        const t = Math.min(1, phase2Elapsed / phase2Duration);
        const eased = t * t * (3 - 2 * t);
        const val = 0.55 + 0.45 * eased;
        scrollRef.current = val;
        setScrollProgress(val);

        if (t >= 1) {
          triggerExit();
        } else {
          rafRef.current = requestAnimationFrame(tick);
        }
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [triggerExit]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Left half opacity & slide-out
  const leftHalfOpacity = Math.max(0, 1 - scrollProgress * 2.8);
  const leftHalfTranslateX = -scrollProgress * 90;

  return (
    <div className="relative w-full min-h-[100dvh] overflow-x-hidden overflow-y-auto bg-gradient-to-r from-[#ffeef4] via-[#ffd6e6] to-[#0d0107] select-none flex flex-col justify-between">
      {/* THREE.JS 3D CAKE CANVAS */}
      {candlesLit >= 1 && (
        <div className="absolute inset-0 z-0">
          <ThreeCakeCanvas
            scrollProgress={scrollProgress}
            cakeText={cakeText}
            onEnterMessage={triggerExit}
          />
        </div>
      )}

      {/* INITIAL BLACK SCREEN WITH CANDLE FLAMES */}
      {candlesLit < 6 && (
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center bg-black/90 transition-opacity duration-700">
          <div className="flex items-center gap-6">
            {candlesLit >= 1 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.25, 1], opacity: 1 }}
                transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-5 h-8 rounded-full bg-gradient-to-t from-amber-500 via-amber-200 to-white shadow-[0_0_25px_orange]"
                style={{ willChange: 'transform' }}
              />
            )}
            {candlesLit >= 3 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.18, 1], opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-6 h-9 rounded-full bg-gradient-to-t from-amber-500 via-amber-200 to-white shadow-[0_0_30px_orange]"
                style={{ willChange: 'transform' }}
              />
            )}
            {candlesLit >= 3 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.25, 1], opacity: 1 }}
                transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
                className="w-5 h-8 rounded-full bg-gradient-to-t from-amber-500 via-amber-200 to-white shadow-[0_0_25px_orange]"
                style={{ willChange: 'transform' }}
              />
            )}
          </div>
        </div>
      )}

      {/* LEFT HALF: HAPPY BIRTHDAY MESSAGE - Optimized for mobile & desktop */}
      {candlesLit >= 6 && (
        <div
          className="relative z-20 w-full md:w-1/2 min-h-[100dvh] flex flex-col justify-between md:justify-center px-4 sm:px-12 py-5 sm:py-8 pointer-events-auto"
          style={{
            opacity: leftHalfOpacity,
            transform: `translate3d(${leftHalfTranslateX}px, 0, 0)`,
            willChange: 'transform, opacity',
          }}
        >
          <div className="max-w-md w-full flex flex-col items-center md:items-start text-center md:text-left mx-auto md:mx-0">
            {/* Top Coronation Badge */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-1.5 sm:mb-3"
            >
              <span className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-pink-600/10 border border-pink-400/30 text-pink-700 font-serif-display uppercase text-[10px] sm:text-xs tracking-[0.25em] shadow-sm backdrop-blur-md">
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span>Royal Fairytale Coronation</span>
                <Sparkles className="w-3 h-3 text-pink-500" />
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-serif-display font-light text-[#4a0d2a] tracking-wider leading-none drop-shadow-sm"
            >
              {cakeHeading}
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.6 }}
              className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-serif-display font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-amber-600 mt-1 mb-2 sm:mb-4 glow-pink-text"
            >
              {cakeSubheading}
            </motion.h2>

            {/* Desktop Full Princess Artwork (Hidden on mobile so 3D cake is unobstructed) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.8 }}
              className="hidden md:block relative w-full max-w-[340px] sm:max-w-[380px] aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(190,24,93,0.25)] border-2 border-pink-300/60 my-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/disney_princesses_pale_pink.jpg"
                alt="Realistic Disney Princesses Celebrating"
                className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.02]"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-900/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 inset-x-3 text-center text-[10px] font-serif-display tracking-widest text-white/95 uppercase drop-shadow-md">
                ✦ Royal Princesses • Palace of Joy ✦
              </div>
            </motion.div>

            {/* Fairytale Greeting Quote */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="font-serif-display italic text-xs sm:text-base text-[#701a3f] mt-1 sm:mt-3 leading-relaxed max-w-sm px-2 sm:px-0"
            >
              &ldquo;May your special day be graced with the timeless elegance, warmth, and fairytale wonder of a thousand royal blessings.&rdquo;
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-4 sm:mt-5 flex flex-col items-center md:items-start gap-2"
            >
              <button
                onClick={handleAutoFlyDrone}
                className="group pl-5 pr-3 py-2.5 rounded-full bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-serif-display uppercase tracking-[0.2em] text-xs flex items-center gap-3 transition-all shadow-lg shadow-pink-500/30 cursor-pointer pointer-events-auto"
              >
                <span>Enter Memory Box (Drone Shot)</span>
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-y-0.5 transition-transform">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
              </button>

              <button
                onClick={triggerExit}
                className="text-[11px] text-pink-800/80 hover:text-pink-950 font-serif-display italic underline cursor-pointer transition-colors"
              >
                Skip drone & open Memory Box directly →
              </button>
            </motion.div>
          </div>
        </div>
      )}

      {/* DRONE CAMERA STATUS CUE */}
      {scrollProgress > 0.25 && scrollProgress < 0.95 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-8 inset-x-0 z-30 pointer-events-none flex flex-col items-center text-center px-4"
        >
          <div className="px-5 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 text-white shadow-2xl flex items-center gap-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="font-serif-display text-xs uppercase tracking-[0.25em] text-pink-200 font-medium">
              Drone Aerial Shot • Zooming into Top Lettering
            </span>
          </div>

          <div className="w-36 h-1 rounded-full bg-white/20 overflow-hidden mt-2.5">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-amber-300 to-rose-400 rounded-full"
              style={{
                width: `${Math.min(100, Math.max(5, (scrollProgress - 0.25) * 150))}%`,
                transition: 'width 50ms linear',
              }}
            />
          </div>
        </motion.div>
      )}

      {/* PASS-THROUGH FLASH TRANSITION */}
      <AnimatePresence>
        {isTransitioningOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="fixed inset-0 z-50 pointer-events-none bg-gradient-to-b from-[#ffd166]/85 via-white to-[#ff2e93] backdrop-blur-md"
            style={{ willChange: 'opacity' }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

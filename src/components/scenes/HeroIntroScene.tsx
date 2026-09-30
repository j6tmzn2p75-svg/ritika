'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Terminal } from 'lucide-react';
import { soundManager } from '@/lib/audioEngine';
import PinkMatrixCanvas from './PinkMatrixCanvas';

interface HeroIntroSceneProps {
  onProceed: () => void;
  recipientName?: string;
}

export default function HeroIntroScene({ onProceed, recipientName = 'Ritika' }: HeroIntroSceneProps) {
  // Sequence: 0=black, 1=matrix+light, 2=volumetric, 3=clock counting, 4=flash, 5=proceed
  const [stage, setStage] = useState(0);
  const [showMatrix, setShowMatrix] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Clock animation state
  const [clockDigits, setClockDigits] = useState('24:00:00');
  const [clockPhase, setClockPhase] = useState<'counting' | 'flash' | 'done'>('counting');
  const clockRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // GPU-optimized clock countdown: 24:00:00 → 00:00:00 in 2 seconds
  const animateClock = useCallback(() => {
    const DURATION = 2000; // 2 seconds total

    const tick = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / DURATION, 1);

      // Easing: cubic-out for cinematic deceleration
      const eased = 1 - Math.pow(1 - progress, 3);

      // Total seconds from 86400 (24h) to 0
      const totalSeconds = Math.round(86400 * (1 - eased));
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      setClockDigits(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      );

      if (progress < 1) {
        clockRef.current = requestAnimationFrame(tick);
      } else {
        setClockDigits('00:00:00');
        // Trigger flash
        setClockPhase('flash');
        setTimeout(() => {
          setClockPhase('done');
        }, 800);
      }
    };

    clockRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    // Stage 1: Pinpoint light + Pink Matrix
    const t1 = setTimeout(() => setStage(1), 300);
    // Stage 2: Volumetric glow & atmosphere
    const t2 = setTimeout(() => setStage(2), 1000);
    // Stage 3: Clock starts counting
    const t3 = setTimeout(() => {
      setStage(3);
      animateClock();
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (clockRef.current) cancelAnimationFrame(clockRef.current);
    };
  }, [animateClock]);

  const handleProceed = () => {
    soundManager.playMagicChime();
    setIsTransitioning(true);
    setTimeout(() => {
      onProceed();
    }, 1100);
  };

  return (
    <div className="relative w-full min-h-[100dvh] bg-[#050003] overflow-x-hidden overflow-y-auto flex flex-col items-center justify-center select-none px-3 sm:px-6 py-6 sm:py-10">
      {/* Quick Skip button for immediate mobile exploration */}
      <button
        onClick={onProceed}
        className="absolute top-4 sm:top-6 right-4 sm:right-6 z-30 px-3 py-1.5 rounded-full bg-pink-500/10 hover:bg-pink-500/20 active:scale-95 border border-pink-400/30 backdrop-blur-md flex items-center gap-1.5 text-[10px] sm:text-xs text-pink-200 font-sans tracking-wider cursor-pointer transition-all"
      >
        <span>Skip Intro</span>
        <ArrowRight className="w-3 h-3 text-pink-300" />
      </button>
      {/* 1. PINK MATRIX RAIN CANVAS */}
      {stage >= 1 && showMatrix && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 pointer-events-none z-0"
          style={{ willChange: 'opacity' }}
        >
          <PinkMatrixCanvas opacity={0.8} />
        </motion.div>
      )}

      {/* Background Volumetric Red Atmosphere */}
      {stage >= 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="absolute inset-0 pointer-events-none z-0"
          style={{ willChange: 'opacity' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[700px] sm:h-[900px] bg-gradient-to-tr from-[#6e1737]/35 via-[#350b1b]/40 to-transparent blur-3xl rounded-full" />
          <div className="absolute inset-0 bg-radial-gradient from-pink-500/10 via-transparent to-black/80 pointer-events-none" />
        </motion.div>
      )}

      {/* Floating Dust Motes - Reduced count for performance */}
      {stage >= 2 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.15, 0.45, 0.15] }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
              className="absolute rounded-full bg-amber-100/40 blur-[0.5px]"
              style={{
                left: `${(i * 17) % 100}%`,
                top: `${(i * 23) % 100}%`,
                width: `${(i % 3) + 1.5}px`,
                height: `${(i % 3) + 1.5}px`,
                willChange: 'opacity',
              }}
            />
          ))}
        </div>
      )}

      {/* Pinpoint Pink Light */}
      {stage >= 1 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: stage >= 3 ? 1 : 0.4,
            opacity: 1,
          }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-tr from-pink-600/30 via-rose-400/40 to-amber-200/20 blur-2xl pointer-events-none z-0"
          style={{ willChange: 'transform, opacity' }}
        />
      )}

      {/* Matrix Mode Toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        whileHover={{ opacity: 1, scale: 1.05 }}
        onClick={() => setShowMatrix((prev) => !prev)}
        className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md flex items-center gap-2 text-[10px] sm:text-xs text-pink-200 font-mono tracking-wider cursor-pointer transition-all"
        title="Toggle Pink Matrix digital rain"
      >
        <Terminal className="w-3 h-3 text-pink-400" />
        <span>Matrix Rain: {showMatrix ? 'Active' : 'Muted'}</span>
      </motion.button>

      {/* FLASH OVERLAY when clock hits 00:00:00 */}
      <AnimatePresence>
        {clockPhase === 'flash' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0.6, 0] }}
            transition={{ duration: 0.8, times: [0, 0.1, 0.3, 0.6, 1], ease: 'easeOut' }}
            className="fixed inset-0 z-40 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(255,46,147,0.6) 40%, rgba(255,209,102,0.3) 70%, transparent 100%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Clock + Proceed Card */}
      <AnimatePresence>
        {stage >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(16px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.3, filter: 'blur(20px)' }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl w-full"
            style={{ willChange: 'transform, opacity, filter' }}
          >
            {/* Eyebrow */}
            <div className="mb-3 sm:mb-4">
              <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-pink-500/10 border border-pink-400/20 text-[10px] sm:text-xs font-serif-display uppercase tracking-[0.25em] text-pink-200/90 shadow-sm backdrop-blur-md">
                <Sparkles className="w-3 h-3 text-pink-300" />
                <span>A Cinematic Fairytale Experience</span>
                <Sparkles className="w-3 h-3 text-pink-300" />
              </span>
            </div>

            {/* Enormous Clock Display with digit morphing */}
            <div className="relative">
              <h1
                className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif-display font-light text-white tracking-wider sm:tracking-widest leading-none whitespace-nowrap"
                style={{
                  textShadow: clockPhase === 'done'
                    ? '0 0 60px rgba(255,46,147,0.7), 0 0 120px rgba(255,46,147,0.3)'
                    : '0 0 40px rgba(255,46,147,0.45)',
                  transition: 'text-shadow 0.5s ease',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {clockDigits}
              </h1>

              {/* Pulsing glow ring behind 00:00:00 */}
              {clockPhase === 'done' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0, 0.6, 0.3], scale: [0.8, 1.2, 1] }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none"
                >
                  <div className="w-full h-full bg-gradient-to-r from-pink-500/20 via-amber-300/15 to-pink-500/20 blur-3xl rounded-full" />
                </motion.div>
              )}
            </div>

            {/* Recipient subtitle */}
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-pink-200/75 font-sans tracking-[0.25em] uppercase">
              Dedicated to <span className="text-pink-300 font-semibold drop-shadow-[0_0_15px_rgba(255,46,147,0.8)]">{recipientName}</span>
            </p>

            {/* Proceed Button - appears after clock finishes */}
            <AnimatePresence>
              {clockPhase === 'done' && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-8 sm:mt-12"
                >
                  <button
                    id="proceed-button"
                    onClick={handleProceed}
                    className="group relative pl-7 sm:pl-8 pr-2.5 sm:pr-3 py-3 rounded-full bg-white/10 hover:bg-pink-600/80 active:scale-95 border border-white/20 hover:border-pink-300/60 backdrop-blur-xl flex items-center gap-3.5 sm:gap-4 text-xs sm:text-sm font-serif-display uppercase tracking-[0.25em] text-white transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.6)] cursor-pointer"
                  >
                    <span>PROCEED</span>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 group-hover:bg-black/30 flex items-center justify-center text-pink-200 group-hover:text-white transition-all duration-300 shadow-inner group-hover:translate-x-0.5">
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continuous Shot Camera Push-Through Transition */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 14 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-amber-300 via-pink-400 to-white blur-xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

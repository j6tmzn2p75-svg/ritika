'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Wind, Sun, ArrowRight } from 'lucide-react';
import { soundManager } from '@/lib/audioEngine';
import CinematicText from '@/components/cinematic/CinematicText';

interface PhotorealisticSakuraSceneProps {
  isOpen: boolean;
  onClose: () => void;
  onTransitionToGift?: () => void;
}

export default function PhotorealisticSakuraScene({
  isOpen,
  onClose,
  onTransitionToGift,
}: PhotorealisticSakuraSceneProps) {
  // Cinematic camera shot stages: 0 = 35mm wide landscape meadow, 1 = 50mm moving through ancient trees, 2 = 85mm macro blossoms
  const [shotPhase, setShotPhase] = useState(0);
  const [isPetalFlyingToCamera, setIsPetalFlyingToCamera] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShotPhase(0);
      setIsPetalFlyingToCamera(false);
      return;
    }

    const t1 = setTimeout(() => setShotPhase(1), 2200);
    const t2 = setTimeout(() => setShotPhase(2), 4800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isOpen]);

  const handlePetalTransition = () => {
    soundManager.playMagicChime();
    setIsPetalFlyingToCamera(true);
    setTimeout(() => {
      onClose();
      if (onTransitionToGift) onTransitionToGift();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 overflow-hidden bg-[#0c0409] flex flex-col justify-between p-4 sm:p-6 select-none"
    >
      {/* 1. BACKGROUND LAYER: Real-life Japanese Cherry Blossom Field of Trees at Golden Hour */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: shotPhase === 0 ? 1 : shotPhase === 1 ? 1.07 : 1.15,
            x: shotPhase === 0 ? 0 : shotPhase === 1 ? -15 : -30,
            y: shotPhase === 2 ? -10 : 0,
          }}
          transition={{ duration: 4, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Responsive Real-Life Field of Trees: 9:16 mobile, 16:9 desktop */}
          <picture className="w-full h-full">
            <source
              media="(max-width: 768px)"
              srcSet="/sakura_field_trees_mobile_4k.jpg"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/sakura_field_trees_4k.jpg"
              alt="Real-Life Japanese Cherry Blossom Field of Trees at Golden Hour"
              className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
            />
          </picture>

          {/* Warm Golden Hour Sun Rays & Natural Atmospheric Vignette */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#250616]/50 via-transparent to-[#ffd885]/30 mix-blend-screen pointer-events-none" />
          <div className="absolute top-1/6 left-1/3 w-[500px] h-[500px] bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0409]/90 via-transparent to-[#0c0409]/60 pointer-events-none" />
        </motion.div>
      </div>

      {/* 2. MIDGROUND LAYER: Realistic Falling Petals with Natural Wind Currents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {[
          { left: '10%', size: 22, duration: 6.2, delay: 0 },
          { left: '26%', size: 16, duration: 7.8, delay: 1.1 },
          { left: '42%', size: 28, duration: 5.4, delay: 0.4 },
          { left: '58%', size: 20, duration: 8.2, delay: 2.3 },
          { left: '74%', size: 24, duration: 6.5, delay: 1.6 },
          { left: '88%', size: 18, duration: 7.0, delay: 2.8 },
          { left: '34%', size: 20, duration: 6.8, delay: 3.4 },
        ].map((petal, i) => (
          <motion.div
            key={i}
            initial={{ y: -40, opacity: 0 }}
            animate={{
              y: '105vh',
              opacity: [0, 0.9, 0.9, 0],
              x: [0, Math.sin(i * 1.5) * 45, -Math.cos(i) * 35, 10],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: petal.duration,
              repeat: Infinity,
              delay: petal.delay,
              ease: 'linear',
            }}
            className="absolute rounded-full bg-gradient-to-br from-[#ffe0ec] via-[#ffb3d1] to-[#ff7ba9] shadow-[0_0_10px_rgba(255,133,179,0.55)]"
            style={{
              left: petal.left,
              width: `${petal.size}px`,
              height: `${petal.size * 0.72}px`,
              borderRadius: '50% 50% 50% 0%',
            }}
          />
        ))}
      </div>

      {/* Top Header Bar */}
      <div className="relative z-40 flex items-center justify-between max-w-5xl mx-auto w-full pt-1 sm:pt-2 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 text-white shadow-xl min-w-0">
          <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
          <span className="font-serif-display text-[11px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.25em] text-pink-100 font-medium truncate">
            Golden Hour Grove • Real-life Sakura Field
          </span>
          <span className="hidden xs:inline text-[10px] font-mono text-pink-300/80 border-l border-white/20 pl-2">
            {shotPhase === 0 ? '35mm Wide' : shotPhase === 1 ? '50mm Cinema' : '85mm Macro'}
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center transition-all shadow-xl cursor-pointer hover:scale-105 shrink-0"
          aria-label="Close Sakura Forest"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Editorial Poetry Overlay (Fluid organic glass without hard borders) */}
      <div className="relative z-40 max-w-xl mx-auto text-center my-auto px-2">
        <div className="p-5 sm:p-8 rounded-3xl bg-black/55 backdrop-blur-xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          <div className="mb-2 sm:mb-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-400/30 text-[10px] sm:text-xs font-serif-display uppercase tracking-[0.2em] text-pink-200 shadow-sm">
              <Sparkles className="w-3 h-3 text-pink-300" />
              <span>Real-Life Cherry Blossom Field</span>
              <Wind className="w-3 h-3 text-pink-300" />
            </span>
          </div>

          <CinematicText as="h3" className="text-xl sm:text-4xl font-serif-display font-light text-white tracking-wide mb-2 sm:mb-3 leading-snug">
            A Bloom That Never Fades
          </CinematicText>

          <p className="font-serif-display text-sm sm:text-lg text-pink-100/90 leading-relaxed font-light">
            “Standing amidst ancient weeping cherry trees bathed in golden sunset, every falling petal carries a wish of timeless joy for Ritika.”
          </p>

          {/* Trigger to advance into Gift Box via flying petal */}
          <div className="mt-5 sm:mt-6 flex justify-center">
            <button
              onClick={handlePetalTransition}
              className="pl-5 sm:pl-6 pr-2 sm:pr-2.5 py-2 sm:py-2.5 rounded-full bg-pink-600/90 hover:bg-pink-500 active:scale-95 text-white font-serif-display uppercase tracking-[0.2em] text-xs flex items-center gap-2.5 sm:gap-3 transition-all shadow-lg hover:shadow-pink-500/50 cursor-pointer"
            >
              <span>Follow the falling petal</span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer subtle camera status */}
      <div className="relative z-40 text-center text-[10px] sm:text-xs text-white/60 font-serif-display tracking-widest uppercase pb-2">
        ✦ Natural Golden Hour Light • Real-Life Japanese Cherry Blossom Grove ✦
      </div>

      {/* SAKURA TRANSITION: One petal flies toward the camera and fills screen into gift ribbon */}
      <AnimatePresence>
        {isPetalFlyingToCamera && (
          <motion.div
            initial={{ scale: 0.1, opacity: 0, rotate: 0 }}
            animate={{ scale: 40, opacity: 1, rotate: 180 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          >
            <div
              className="w-24 h-16 rounded-full bg-gradient-to-tr from-[#9d174d] via-[#f43f5e] to-[#be185d] shadow-[0_0_50px_rgba(244,63,94,0.8)]"
              style={{ borderRadius: '50% 50% 50% 0%' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

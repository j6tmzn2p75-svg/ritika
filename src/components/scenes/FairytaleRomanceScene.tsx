'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { soundManager } from '@/lib/audioEngine';
import CinematicText from '@/components/cinematic/CinematicText';
import ParallaxLayer from '@/components/cinematic/ParallaxLayer';

interface FairytaleRomanceSceneProps {
  onYes: () => void;
  characterVisualUrl?: string;
}

export default function FairytaleRomanceScene({
  onYes,
  characterVisualUrl,
}: FairytaleRomanceSceneProps) {
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });

  // Camera push and warmth scaling when NO is pressed
  const cameraZoom = 1 + noCount * 0.05;
  const warmthOpacity = Math.min(0.65, noCount * 0.14);

  // YES growth progression from master prompt: +10%, +20%, +35%, +55%, +75%, then dominates
  const yesScales = [1, 1.1, 1.2, 1.35, 1.55, 1.75, 2.1, 2.7];
  const currentYesScale = yesScales[Math.min(noCount, yesScales.length - 1)];

  const handleNoClick = () => {
    soundManager.playKeypadClick();
    setNoCount((prev) => prev + 1);

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 50 + 40;
    setNoPosition({
      x: Math.max(-80, Math.min(80, Math.cos(angle) * distance)),
      y: Math.max(-40, Math.min(40, Math.sin(angle) * distance)),
    });
  };

  const handleYesClick = () => {
    soundManager.playMagicChime();
    onYes();
  };

  return (
    <div className="relative w-full min-h-[100dvh] overflow-x-hidden bg-[#080106] select-none flex flex-col justify-between py-6 sm:py-10 px-4">
      {/* 1. CINEMATIC BACKGROUND: 4K Photorealistic Disney Princess & Prince Romantic Film Still */}
      <ParallaxLayer depth="background" speed={-0.12}>
        <motion.div
          animate={{ scale: cameraZoom }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Responsive 4K Imagery: 9:16 vertical on mobile, 16:9 cinematic widescreen on desktop */}
          <picture className="w-full h-full">
            <source
              media="(max-width: 768px)"
              srcSet={characterVisualUrl || '/princess_portrait_mobile_4k.jpg'}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={characterVisualUrl || '/princess_fairytale_4k.jpg'}
              alt="4K Disney Princess & Prince Fairytale Romance"
              className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
            />
          </picture>

          {/* Organic Vignettes & Gradients: Seamless borderless blending into black */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080106] via-transparent to-[#080106]/70 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080106]/80 via-transparent to-[#080106] pointer-events-none" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#080106]/30 to-[#080106]/85 pointer-events-none" />
        </motion.div>
      </ParallaxLayer>

      {/* 2. MIDGROUND LAYER: Floating Sky Lanterns (Tangled Atmosphere) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {[
          { x: '12%', y: '18%', size: 24, delay: 0 },
          { x: '82%', y: '15%', size: 30, delay: 1.4 },
          { x: '24%', y: '48%', size: 18, delay: 0.8 },
          { x: '75%', y: '52%', size: 22, delay: 2.1 },
          { x: '48%', y: '10%', size: 32, delay: 1.1 },
          { x: '6%', y: '65%', size: 16, delay: 2.7 },
        ].map((l, idx) => (
          <motion.div
            key={idx}
            animate={{
              y: [0, -30, 0],
              x: [0, idx % 2 === 0 ? 10 : -10, 0],
            }}
            transition={{
              duration: 5.5 + idx,
              repeat: Infinity,
              delay: l.delay,
              ease: 'easeInOut',
            }}
            className="absolute flex flex-col items-center"
            style={{ left: l.x, top: l.y }}
          >
            <div
              className="rounded-md bg-gradient-to-t from-amber-500 via-amber-200 to-yellow-100 shadow-[0_0_35px_rgba(255,200,100,0.9)] border-t border-amber-800/40"
              style={{ width: `${l.size}px`, height: `${l.size * 1.35}px` }}
            />
            <div className="w-10 h-10 -mt-6 rounded-full bg-amber-400/35 blur-md pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {/* 3. FOREGROUND LAYER: Ambient Golden Twilight Glow & Bokeh */}
      <ParallaxLayer depth="foreground" speed={0.2}>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-t from-amber-500/15 via-pink-500/10 to-transparent blur-3xl rounded-full pointer-events-none" />
      </ParallaxLayer>

      {/* Spacer to push text towards center/bottom */}
      <div className="flex-1" />

      {/* 4. TEXT REVEAL: Organic Floating Serif Typography (No Boxy Cards) */}
      <div className="relative z-30 flex flex-col items-center text-center max-w-2xl mx-auto mb-4 px-4">
        <CinematicText
          delay={0.2}
          as="h2"
          className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-serif-display font-light text-white tracking-wide leading-snug drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]"
        >
          I made something special for you.
        </CinematicText>

        <CinematicText
          delay={0.8}
          as="h3"
          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-serif-display font-medium text-pink-200 tracking-wider mt-1.5 glow-pink-text drop-shadow-[0_4px_25px_rgba(255,46,147,0.7)]"
        >
          Wanna see?
        </CinematicText>
      </div>

      {/* 5. MINIMAL LUXURY GLASS YES / NO BUTTONS */}
      <div className="relative z-30 flex items-center justify-center gap-5 sm:gap-8 pb-6 sm:pb-8">
        {/* YES BUTTON (Organic glass pill with progressive scale) */}
        <motion.button
          id="yes-button"
          onClick={handleYesClick}
          animate={{ scale: currentYesScale }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          whileHover={{ scale: currentYesScale * 1.05 }}
          whileTap={{ scale: currentYesScale * 0.95 }}
          className={`pl-7 sm:pl-8 pr-2.5 py-3 rounded-full bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 text-white font-serif-display uppercase tracking-[0.25em] font-semibold text-xs sm:text-sm flex items-center gap-3 shadow-[0_10px_35px_rgba(255,46,147,0.55)] border border-pink-300/50 cursor-pointer backdrop-blur-md ${
            noCount >= 4
              ? 'shadow-[0_0_70px_rgba(255,46,147,0.95)] border-yellow-200 text-base sm:text-xl'
              : ''
          }`}
        >
          <span>YES</span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/25 flex items-center justify-center text-pink-200 shadow-inner">
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-pink-200" />
          </div>
        </motion.button>

        {/* NO BUTTON (Minimal glass button with playful evasion) */}
        <AnimatePresence mode="wait">
          <motion.button
            key={noCount}
            id="no-button"
            onClick={handleNoClick}
            animate={{
              x: noPosition.x,
              y: noPosition.y,
              scale: Math.max(0.75, 1 - noCount * 0.05),
              opacity: Math.max(0.65, 1 - noCount * 0.05),
            }}
            transition={{ type: 'spring', stiffness: 240, damping: 16 }}
            className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-pink-200/90 hover:text-white font-serif-display uppercase tracking-[0.2em] text-xs transition-colors cursor-pointer backdrop-blur-md"
          >
            NO
          </motion.button>
        </AnimatePresence>
      </div>

      {/* Dynamic environmental warming tint on NO clicks */}
      {noCount > 0 && (
        <div
          className="fixed inset-0 pointer-events-none bg-gradient-to-t from-pink-900/30 via-amber-600/15 to-transparent transition-opacity duration-700"
          style={{ opacity: warmthOpacity }}
        />
      )}
    </div>
  );
}

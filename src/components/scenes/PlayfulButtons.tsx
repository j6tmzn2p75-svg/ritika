'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Crown, Compass, HelpCircle, ArrowRight } from 'lucide-react';
import { soundManager } from '@/lib/audioEngine';

interface PlayfulButtonsProps {
  onYes: () => void;
}

const NO_PHRASES = [
  'NO',
  'Are you sure?',
  'Wrong button!',
  'Think again!',
  'You know you want to!',
  'Fairytale awaits!',
  'Just say YES!',
];

export default function PlayfulButtons({ onYes }: PlayfulButtonsProps) {
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Master Prompt Growth Progression: +10%, +20%, +35%, +55%, +75%, then dominates the screen
  const scales = [1, 1.1, 1.2, 1.35, 1.55, 1.75, 2.1, 2.6];
  const currentScale = scales[Math.min(noCount, scales.length - 1)];

  const handleNoClick = () => {
    soundManager.playKeypadClick();
    setNoCount((prev) => prev + 1);

    // Playful dodge offset
    const randomAngle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 70 + 60;
    const offsetX = Math.cos(randomAngle) * distance;
    const offsetY = Math.sin(randomAngle) * distance;

    setNoPosition({
      x: Math.max(-110, Math.min(110, offsetX)),
      y: Math.max(-60, Math.min(60, offsetY)),
    });
  };

  const handleYesClick = () => {
    soundManager.playMagicChime();
    onYes();
  };

  const currentNoPhrase = NO_PHRASES[noCount % NO_PHRASES.length];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[170px] w-full max-w-xl mx-auto px-4 mt-2">
      {/* Interactive area holding YES and NO buttons */}
      <div className="relative flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
        {/* YES BUTTON (Button-in-Button Architecture) */}
        <motion.div
          animate={{ scale: currentScale }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          className="p-1 rounded-full bg-pink-500/10 border border-white/10"
        >
          <motion.button
            id="yes-button"
            onClick={handleYesClick}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className={`relative z-20 font-serif-display font-black uppercase text-white rounded-full transition-all duration-300 flex items-center cursor-pointer ${
              noCount >= 4
                ? 'pl-10 pr-3 py-4 text-xl sm:text-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 shadow-[0_0_60px_rgba(255,46,147,0.9)] border-2 border-yellow-200 gap-4'
                : 'pl-8 pr-2.5 py-3 text-sm sm:text-base bg-gradient-to-r from-pink-600 to-rose-500 shadow-[0_0_30px_rgba(255,46,147,0.5)] border border-pink-300/40 gap-3'
            }`}
          >
            <Sparkles className="w-4 h-4 text-yellow-200 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="tracking-[0.2em]">YES</span>

            {/* Nested Button-in-Button Trailing Icon Wrapper */}
            <div className="w-8 h-8 rounded-full bg-black/25 border border-white/25 flex items-center justify-center text-yellow-200">
              <Heart className="w-4 h-4 fill-yellow-200" />
            </div>
          </motion.button>
        </motion.div>

        {/* NO BUTTON */}
        <AnimatePresence mode="wait">
          <motion.button
            key={noCount}
            id="no-button"
            onClick={handleNoClick}
            onMouseEnter={noCount > 1 ? handleNoClick : undefined}
            animate={{
              x: noPosition.x,
              y: noPosition.y,
              scale: Math.max(0.75, 1 - noCount * 0.04),
              opacity: Math.max(0.65, 1 - noCount * 0.04),
            }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 16,
            }}
            whileTap={{ scale: 0.95 }}
            className="z-10 px-6 py-3 rounded-full bg-black/40 backdrop-blur-md border border-pink-500/25 text-pink-200/90 hover:text-white hover:border-pink-400 text-xs sm:text-sm font-serif-display tracking-wider transition-colors shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>{currentNoPhrase}</span>
            <HelpCircle className="w-3.5 h-3.5 text-pink-400/60" />
          </motion.button>
        </AnimatePresence>
      </div>

      {/* Playful hint text if NO clicked repeatedly */}
      {noCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex items-center gap-2"
        >
          <span className="eyebrow-badge">
            <Crown className="w-3 h-3 text-pink-300" />
            <span>
              {noCount >= 5
                ? 'Destiny beckons Ritika toward YES'
                : 'Click YES to enter the fairytale'}
            </span>
            <Sparkles className="w-3 h-3 text-pink-300" />
          </span>
        </motion.div>
      )}
    </div>
  );
}

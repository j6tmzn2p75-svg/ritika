'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import TangledSunsetCanvas from './TangledSunsetCanvas';
import FairytaleCharacters from './FairytaleCharacters';
import PlayfulButtons from './PlayfulButtons';

interface FairytaleSceneProps {
  onYes: () => void;
  romancePrompt?: string;
}

export default function FairytaleScene({ onYes, romancePrompt }: FairytaleSceneProps) {
  const promptText = romancePrompt || 'I have made something special for you! Wanna see?';

  return (
    <div className="relative w-screen min-h-[100dvh] overflow-hidden flex flex-col items-center justify-between py-8 px-4 select-none">
      {/* Dynamic Tangled Floating Lanterns & Sunset sky */}
      <TangledSunsetCanvas />

      {/* Top Banner / Dialogue Bubble with Double-Bezel Architecture */}
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        className="relative z-20 max-w-xl text-center mt-2 sm:mt-4"
      >
        <div className="bezel-outer-gold">
          <div className="liquid-glass-gold px-6 py-4 sm:px-10 sm:py-5 flex flex-col items-center">
            <span className="eyebrow-badge-gold mb-2">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Enchanted Fairytale Romance</span>
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
            </span>

            <p className="text-lg sm:text-2xl font-serif-display font-medium text-amber-100 glow-gold-text tracking-wide leading-snug">
              “{promptText}”
            </p>
          </div>
        </div>
      </motion.div>

      {/* Center: Fairytale Prince & Princess Characters with Floating Lantern */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
        className="relative z-10 w-full flex justify-center -my-2 sm:my-0"
      >
        <FairytaleCharacters />
      </motion.div>

      {/* Bottom: Playful YES / NO Interaction */}
      <div className="relative z-20 w-full max-w-md pb-4">
        <PlayfulButtons onYes={onYes} />
      </div>
    </div>
  );
}

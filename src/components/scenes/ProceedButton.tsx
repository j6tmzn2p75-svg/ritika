'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { soundManager } from '@/lib/audioEngine';

interface ProceedButtonProps {
  onProceed: () => void;
}

export default function ProceedButton({ onProceed }: ProceedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Spring physics for desktop magnetic feel
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = (e.clientX - centerX) * 0.2;
    const deltaY = (e.clientY - centerY) * 0.2;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleClick = () => {
    soundManager.playMagicChime();
    setTimeout(() => {
      onProceed();
    }, 350);
  };

  return (
    <div className="p-1 rounded-full bg-pink-500/10 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <motion.button
        ref={buttonRef}
        id="proceed-button"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 180, damping: 14 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="group relative overflow-hidden pl-7 pr-3 py-2.5 rounded-full bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 border border-pink-300/40 shadow-[0_0_30px_rgba(255,46,147,0.4)] hover:shadow-[0_0_45px_rgba(255,46,147,0.7)] transition-all duration-300 flex items-center gap-4 cursor-pointer"
      >
        {/* Leading Sparkle */}
        <Sparkles className="w-4 h-4 text-pink-200 group-hover:rotate-45 transition-transform duration-500" />

        {/* Text */}
        <span className="font-serif-display font-bold tracking-[0.25em] text-xs sm:text-sm text-white uppercase glow-pink-text">
          PROCEED
        </span>

        {/* Button-in-Button Trailing Icon Wrapper */}
        <div className="w-9 h-9 rounded-full bg-black/25 border border-white/20 flex items-center justify-center text-pink-200 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300 shadow-inner">
          <ArrowRight className="w-4 h-4" />
        </div>
      </motion.button>
    </div>
  );
}

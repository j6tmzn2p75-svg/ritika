'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Hourglass } from 'lucide-react';

export default function CountdownTimer() {
  const [secondsRemaining, setSecondsRemaining] = useState(24 * 3600);
  const [millis, setMillis] = useState(99);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 24 * 3600));
    }, 1000);

    const msTimer = setInterval(() => {
      setMillis((prev) => (prev > 0 ? prev - 1 : 99));
    }, 45);

    return () => {
      clearInterval(timer);
      clearInterval(msTimer);
    };
  }, []);

  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;

  const formatDigit = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="relative flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-2xl select-none">
      {/* Outer ambient glow */}
      <div className="absolute -inset-2 bg-gradient-to-r from-pink-600/15 via-rose-500/25 to-purple-600/15 rounded-[2.5rem] blur-2xl pointer-events-none" />

      {/* Double-Bezel Architecture: Outer Shell */}
      <div className="bezel-outer w-full">
        {/* Double-Bezel Architecture: Inner Core with Liquid Glass */}
        <div className="liquid-glass px-6 py-8 sm:px-12 sm:py-10 flex flex-col items-center text-center">
          {/* Eyebrow Badge */}
          <div className="mb-4">
            <span className="eyebrow-badge">
              <Sparkles className="w-3 h-3 text-pink-300" />
              <span>Dimensional Birthday Gateway</span>
              <Hourglass className="w-3 h-3 text-pink-300" />
            </span>
          </div>

          {/* Time Display */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 font-mono font-bold">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <span className="text-4xl sm:text-7xl md:text-8xl font-black text-white glow-pink-text tracking-tighter">
                {formatDigit(hours)}
              </span>
              <span className="text-[9px] sm:text-[10px] text-pink-300/60 uppercase tracking-[0.2em] mt-1 font-sans">
                Hours
              </span>
            </div>

            {/* Separator */}
            <motion.span
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: [0.32, 0.72, 0, 1] }}
              className="text-3xl sm:text-6xl text-pink-400 font-light mb-4"
            >
              :
            </motion.span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <span className="text-4xl sm:text-7xl md:text-8xl font-black text-white glow-pink-text tracking-tighter">
                {formatDigit(minutes)}
              </span>
              <span className="text-[9px] sm:text-[10px] text-pink-300/60 uppercase tracking-[0.2em] mt-1 font-sans">
                Mins
              </span>
            </div>

            {/* Separator */}
            <motion.span
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: [0.32, 0.72, 0, 1] }}
              className="text-3xl sm:text-6xl text-pink-400 font-light mb-4"
            >
              :
            </motion.span>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <span className="text-4xl sm:text-7xl md:text-8xl font-black text-pink-200 glow-pink-text tracking-tighter">
                {formatDigit(seconds)}
              </span>
              <span className="text-[9px] sm:text-[10px] text-pink-300/60 uppercase tracking-[0.2em] mt-1 font-sans">
                Secs
              </span>
            </div>

            {/* Micro Milliseconds */}
            <div className="flex flex-col items-center ml-1 sm:ml-2 opacity-70">
              <span className="text-base sm:text-2xl text-pink-400 font-mono">
                .{formatDigit(millis)}
              </span>
              <span className="text-[7px] sm:text-[8px] text-pink-400/50 uppercase tracking-widest font-sans">
                MS
              </span>
            </div>
          </div>

          {/* Recipient Status */}
          <div className="mt-4 pt-3 border-t border-white/5 w-full flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs text-pink-200/70 font-sans tracking-wide">
              Temporal portal synchronized for: <span className="text-pink-200 font-semibold">Ritika</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

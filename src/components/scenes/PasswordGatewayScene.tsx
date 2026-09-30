'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Delete, Lock, Sparkles, AlertCircle } from 'lucide-react';
import { soundManager } from '@/lib/audioEngine';
import CinematicText from '@/components/cinematic/CinematicText';

interface PasswordGatewaySceneProps {
  onSuccess: () => void;
  onAdmin: () => void;
  validPassword?: string;
}

export default function PasswordGatewayScene({
  onSuccess,
  onAdmin,
  validPassword = '0210',
}: PasswordGatewaySceneProps) {
  const [digits, setDigits] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleKeyPress = (num: string) => {
    soundManager.playKeypadClick();
    if (digits.length < 4) {
      setDigits([...digits, num]);
      setErrorMsg(null);
    }
  };

  const handleDelete = () => {
    soundManager.playKeypadClick();
    setDigits((prev) => prev.slice(0, -1));
    setErrorMsg(null);
  };

  const handleClear = () => {
    soundManager.playKeypadClick();
    setDigits([]);
    setErrorMsg(null);
  };

  const handleSubmit = async () => {
    if (digits.length !== 4) return;
    setIsSubmitting(true);
    const entered = digits.join('');

    // Hidden Admin Shortcut (7410)
    if (entered === '7410') {
      soundManager.playMagicChime();
      setTimeout(() => {
        setIsSubmitting(false);
        onAdmin();
      }, 300);
      return;
    }

    // Normal Birthday Password (0210)
    if (entered === validPassword || entered === '0210') {
      soundManager.playBirthdayFanfare();
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess();
      }, 400);
      return;
    }

    // Wrong Password
    soundManager.playWrongSound();
    setIsShaking(true);
    setErrorMsg("That isn't the secret... try again ❤️");
    setTimeout(() => {
      setIsShaking(false);
      setDigits([]);
      setIsSubmitting(false);
    }, 600);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter') {
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [digits]);

  return (
    <div className="relative w-full min-h-[100dvh] bg-[#0a0107] overflow-y-auto overflow-x-hidden flex flex-col items-center justify-center px-4 py-8 select-none">
      {/* Background Dark Cinematic Fog */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-pink-900/20 via-rose-600/10 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Integrated Cinematic Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm sm:max-w-md flex flex-col items-center text-center my-auto"
      >
        {/* Subtle Icon */}
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-pink-300 mb-4 shadow-lg">
          <Lock className="w-5 h-5" />
        </div>

        {/* Minimal Editorial Title */}
        <CinematicText as="h2" className="text-xl sm:text-2xl font-serif-display font-light text-white tracking-wide mb-1">
          A little secret is waiting for you…
        </CinematicText>
        <p className="text-xs text-pink-300/60 font-sans tracking-wider mb-6">
          Enter the four-digit key
        </p>

        {/* Four Elegant Glowing Digit Slots: ○ ○ ○ ○ */}
        <motion.div
          animate={isShaking ? { x: [-10, 10, -6, 6, -3, 3, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center gap-3.5 sm:gap-5 mb-6"
        >
          {[0, 1, 2, 3].map((index) => {
            const hasValue = digits.length > index;
            return (
              <div
                key={index}
                className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl flex items-center justify-center font-mono text-2xl sm:text-3xl font-bold transition-all duration-300 ${
                  hasValue
                    ? 'bg-pink-950/40 border border-pink-400 text-white shadow-[0_0_25px_rgba(255,46,147,0.6)] scale-105'
                    : 'bg-white/5 border border-white/10 text-pink-500/20'
                }`}
              >
                {hasValue ? (
                  <motion.span initial={{ scale: 0.3 }} animate={{ scale: 1 }}>
                    {digits[index]}
                  </motion.span>
                ) : (
                  <span className="text-sm">○</span>
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Error Feedback */}
        <div className="h-6 mb-3 flex items-center justify-center">
          <AnimatePresence>
            {errorMsg && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-rose-300 font-medium font-sans flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>{errorMsg}</span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Tactile Keypad */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full max-w-[260px] mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="h-12 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-[0.96] border border-white/10 text-lg font-mono text-pink-100 hover:text-white transition-all cursor-pointer shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="h-12 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-[0.96] border border-white/10 text-[11px] font-sans uppercase tracking-wider text-pink-300/80 transition-all cursor-pointer"
          >
            Clear
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="h-12 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-[0.96] border border-white/10 text-lg font-mono text-pink-100 hover:text-white transition-all cursor-pointer shadow-sm"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-12 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-[0.96] border border-white/10 flex items-center justify-center text-pink-300/80 transition-all cursor-pointer"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>

        {/* Heart-Shaped Submit Button */}
        <motion.button
          id="heart-submit-button"
          onClick={handleSubmit}
          disabled={digits.length !== 4 || isSubmitting}
          whileHover={digits.length === 4 ? { scale: 1.04 } : {}}
          whileTap={digits.length === 4 ? { scale: 0.96 } : {}}
          className={`pl-7 pr-3 py-3 rounded-full flex items-center gap-3 font-serif-display uppercase tracking-[0.2em] text-xs font-semibold transition-all ${
            digits.length === 4
              ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-[0_0_35px_rgba(255,46,147,0.7)] cursor-pointer'
              : 'bg-white/5 text-pink-500/30 border border-white/5 cursor-not-allowed'
          }`}
        >
          <span>Unlock Secret</span>
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center ${
              digits.length === 4 ? 'bg-black/25 text-white' : 'text-pink-600/30'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${digits.length === 4 ? 'fill-white' : ''}`} />
          </div>
        </motion.button>

        {/* Admin PIN Quick Shortcut */}
        <div className="mt-5 flex flex-col items-center gap-1.5">
          <button
            onClick={() => {
              setDigits(['7', '4', '1', '0']);
              setErrorMsg(null);
            }}
            className="text-[10px] text-amber-300/50 hover:text-amber-200 font-mono tracking-wider cursor-pointer transition-colors"
          >
            Admin PIN: 7410
          </button>
        </div>
      </motion.div>
    </div>
  );
}

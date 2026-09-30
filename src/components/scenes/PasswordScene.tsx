'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Delete, Lock, Sparkles, Key, AlertCircle } from 'lucide-react';
import { soundManager } from '@/lib/audioEngine';

interface PasswordSceneProps {
  onSuccess: () => void;
  onAdmin: () => void;
  validPassword?: string;
}

export default function PasswordScene({
  onSuccess,
  onAdmin,
  validPassword = '0210',
}: PasswordSceneProps) {
  const [digits, setDigits] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleKeyPress = (num: string) => {
    soundManager.playKeypadClick();
    if (digits.length < 4) {
      const updated = [...digits, num];
      setDigits(updated);
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

    // Isolated Hidden Admin Shortcut Check
    if (entered === '7410') {
      soundManager.playMagicChime();
      setTimeout(() => {
        setIsSubmitting(false);
        onAdmin();
      }, 300);
      return;
    }

    // Normal Birthday Password Check
    if (entered === validPassword || entered === '0210') {
      soundManager.playBirthdayFanfare();
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess();
      }, 400);
      return;
    }

    // Wrong password feedback
    soundManager.playWrongSound();
    setIsShaking(true);
    setErrorMsg("That isn't the secret... try again");
    setTimeout(() => {
      setIsShaking(false);
      setDigits([]);
      setIsSubmitting(false);
    }, 600);
  };

  // Support physical keyboard typing
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
    <div className="relative w-screen min-h-[100dvh] overflow-hidden flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-b from-[#240313] via-[#14010b] to-[#0a0005] select-none">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-pink-500/10 blur-xl animate-float-slow"
            style={{
              left: `${(i * 19) % 100}%`,
              top: `${(i * 23) % 100}%`,
              width: `${(i % 3 + 2) * 55}px`,
              height: `${(i % 3 + 2) * 55}px`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Double-Bezel Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
        className="bezel-outer w-full max-w-sm sm:max-w-md relative z-10"
      >
        <div className="liquid-glass p-6 sm:p-8 flex flex-col items-center">
          {/* Eyebrow Pill */}
          <div className="mb-4">
            <span className="eyebrow-badge">
              <Lock className="w-3 h-3 text-pink-300" />
              <span>Secret Vault Access</span>
              <Sparkles className="w-3 h-3 text-pink-300" />
            </span>
          </div>

          {/* Title */}
          <h2 className="text-lg sm:text-2xl font-serif-display font-medium text-pink-100 text-center mb-1.5 tracking-wide glow-pink-text">
            A little secret is waiting for you…
          </h2>
          <p className="text-xs text-pink-300/60 text-center mb-6 font-sans">
            Enter the 4-digit key to unlock Ritika’s birthday surprise
          </p>

          {/* 4 Digit Display Slots */}
          <motion.div
            animate={isShaking ? { x: [-10, 10, -6, 6, -3, 3, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-3 sm:gap-4 mb-6"
          >
            {[0, 1, 2, 3].map((index) => {
              const hasValue = digits.length > index;
              return (
                <div
                  key={index}
                  className={`w-13 h-16 sm:w-15 sm:h-18 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-mono font-bold transition-all duration-200 ${
                    hasValue
                      ? 'border border-pink-400 bg-pink-900/40 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_20px_rgba(255,46,147,0.6)] scale-105'
                      : 'border border-white/10 bg-black/40 text-pink-500/30'
                  }`}
                >
                  {hasValue ? (
                    <motion.span
                      initial={{ scale: 0.3 }}
                      animate={{ scale: 1 }}
                      className="glow-pink-text"
                    >
                      {digits[index]}
                    </motion.span>
                  ) : (
                    <span className="text-pink-400/25 text-xl font-light">_</span>
                  )}
                </div>
              );
            })}
          </motion.div>

          {/* Contextual Error Message */}
          <div className="h-6 mb-3 flex items-center justify-center">
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-xs text-rose-300 font-medium font-sans"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>{errorMsg}</span>
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Keypad Grid with Tactile Springs */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full max-w-[280px] mb-6">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                onClick={() => handleKeyPress(num)}
                className="h-12 sm:h-13 rounded-2xl bg-white/5 border border-white/10 text-lg sm:text-xl font-mono font-semibold text-pink-100 hover:text-white hover:bg-white/10 active:scale-[0.96] transition-all duration-150 cursor-pointer shadow-sm"
              >
                {num}
              </button>
            ))}
            {/* Clear */}
            <button
              onClick={handleClear}
              className="h-12 sm:h-13 rounded-2xl bg-white/5 border border-white/10 text-[11px] uppercase tracking-wider font-semibold text-pink-300/80 hover:text-white hover:bg-white/10 active:scale-[0.96] transition-all duration-150 cursor-pointer"
            >
              Clear
            </button>
            {/* 0 */}
            <button
              onClick={() => handleKeyPress('0')}
              className="h-12 sm:h-13 rounded-2xl bg-white/5 border border-white/10 text-lg sm:text-xl font-mono font-semibold text-pink-100 hover:text-white hover:bg-white/10 active:scale-[0.96] transition-all duration-150 cursor-pointer"
            >
              0
            </button>
            {/* Delete */}
            <button
              onClick={handleDelete}
              className="h-12 sm:h-13 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-pink-300/80 hover:text-white hover:bg-white/10 active:scale-[0.96] transition-all duration-150 cursor-pointer"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>

          {/* Heart-Shaped Submit Button (Button-in-Button Architecture) */}
          <div className="p-1 rounded-full bg-pink-500/10 border border-white/10">
            <motion.button
              id="heart-submit-button"
              onClick={handleSubmit}
              disabled={digits.length !== 4 || isSubmitting}
              whileHover={digits.length === 4 ? { scale: 1.03 } : {}}
              whileTap={digits.length === 4 ? { scale: 0.97 } : {}}
              className={`relative group pl-7 pr-2.5 py-2.5 rounded-full flex items-center gap-3 transition-all duration-300 ${
                digits.length === 4
                  ? 'bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 text-white shadow-[0_0_30px_rgba(255,46,147,0.6)] cursor-pointer'
                  : 'bg-black/30 text-pink-400/40 border border-white/5 cursor-not-allowed'
              }`}
            >
              <span className="font-serif-display font-semibold tracking-widest text-xs uppercase">
                Unlock Heart
              </span>

              {/* Nested Button-in-Button Trailing Icon */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  digits.length === 4
                    ? 'bg-black/25 border border-white/25 text-white'
                    : 'bg-transparent text-pink-600/40'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    digits.length === 4 ? 'fill-white text-white animate-pulse' : ''
                  }`}
                />
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

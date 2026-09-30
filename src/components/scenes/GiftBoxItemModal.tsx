'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, Sparkles, Heart } from 'lucide-react';
import { soundManager } from '@/lib/audioEngine';

interface GiftBoxItemModalProps {
  giftPhotoUrl: string;
  caption: string;
  isFullscreen?: boolean;
}

export default function GiftBoxItemModal({
  giftPhotoUrl,
  caption,
  isFullscreen = false,
}: GiftBoxItemModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpeningAnim, setIsOpeningAnim] = useState(false);

  const handleOpen = () => {
    if (isFullscreen) return;
    soundManager.playGiftOpening();
    setIsOpeningAnim(true);
    setTimeout(() => {
      setIsOpeningAnim(false);
      setIsOpen(true);
    }, 400);
  };

  // Fullscreen mode: render gift photo directly
  if (isFullscreen) {
    return (
      <div className="relative max-w-md w-full mx-auto p-6 sm:p-7 rounded-3xl border-2 border-amber-300/60 shadow-[0_0_50px_rgba(255,209,102,0.4)]" style={{ background: 'linear-gradient(135deg, rgba(35,14,4,0.85), rgba(20,5,2,0.95))' }}>
        {/* Gold Filigree Frame */}
        <div className="relative p-2 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-200 to-amber-500 shadow-xl">
          <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-slate-900 border-2 border-amber-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={giftPhotoUrl}
              alt="Gift for Ritika"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Caption */}
        <div className="mt-4 text-center">
          <p className="font-serif-display text-base sm:text-lg text-amber-100 font-semibold glow-gold-text">
            {caption || 'A Treasured Keepsake For You'}
          </p>
          <div className="flex items-center justify-center gap-1.5 text-pink-300 mt-1 font-handwriting text-2xl">
            <span>Wrapped in eternal affection</span>
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          </div>
        </div>
      </div>
    );
  }

  // Default box-mode rendering
  return (
    <>
      <motion.div
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleOpen}
        className="group relative cursor-pointer flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-2xl bg-gradient-to-b from-[#240a18]/80 to-[#12020b]/90 hover:from-[#351025] hover:to-[#1a0410] active:scale-[0.98] transition-all duration-300 border border-amber-400/25 hover:border-pink-400/60 shadow-inner h-full w-full"
      >
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-b from-[#3a182c] to-[#1f0917] rounded-xl border border-pink-400/30 p-2 flex items-center justify-center shadow-inner">
          <div className="relative flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
            <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300 group-hover:text-amber-200" />
            <div className="absolute inset-0 bg-amber-400/20 blur-md rounded-full" />
          </div>
          <Sparkles className="absolute top-1.5 right-1.5 w-3 h-3 text-amber-300 animate-spin" style={{ animationDuration: '5s' }} />
        </div>

        <span className="mt-2 text-xs font-serif-display font-medium text-pink-100 group-hover:text-white tracking-wider text-center">
          Secret Gift Box
        </span>
        <span className="text-[10px] text-pink-300/60 font-sans">Tap to unwrap</span>
      </motion.div>

      {/* Opening Light Burst */}
      <AnimatePresence>
        {isOpeningAnim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: 2.5, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="w-72 h-72 rounded-full bg-gradient-to-tr from-amber-300 via-pink-400 to-white blur-3xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Framed Picture Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 25 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-sm sm:max-w-md w-full glass-panel-gold p-6 sm:p-7 rounded-3xl border-2 border-amber-300/60 shadow-[0_0_50px_rgba(255,209,102,0.4)]"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center hover:bg-pink-700 shadow-lg cursor-pointer transition-transform hover:scale-105"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative p-2 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-200 to-amber-500 shadow-xl">
                <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-slate-900 border-2 border-amber-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={giftPhotoUrl}
                    alt="Gift for Ritika"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="font-serif-display text-base sm:text-lg text-amber-100 font-semibold glow-gold-text">
                  {caption || 'A Treasured Keepsake For You'}
                </p>
                <div className="flex items-center justify-center gap-1.5 text-pink-300 mt-1 font-handwriting text-2xl">
                  <span>Wrapped in eternal affection</span>
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

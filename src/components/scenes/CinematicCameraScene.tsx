'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Sparkles, Heart } from 'lucide-react';
import { soundManager } from '@/lib/audioEngine';

interface CinematicCameraSceneProps {
  photoUrl: string;
  caption: string;
  isFullscreen?: boolean;
}

export default function CinematicCameraScene({
  photoUrl,
  caption,
  isFullscreen = false,
}: CinematicCameraSceneProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLensSweeping, setIsLensSweeping] = useState(false);

  const handleOpen = () => {
    if (isFullscreen) return; // Don't open modal in fullscreen mode
    soundManager.playCameraShutter();
    setIsLensSweeping(true);
    setTimeout(() => {
      setIsLensSweeping(false);
      setIsOpen(true);
    }, 450);
  };

  // Fullscreen mode: render the photo content directly
  if (isFullscreen) {
    return (
      <div className="relative max-w-lg w-full mx-auto">
        <div className="relative bg-[#fcf9f2] p-5 sm:p-6 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.9)] border-4 border-[#eae3d5] text-slate-800">
          {/* Physical Photo */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-900 border border-slate-300 shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt="Birthday Memory"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
          </div>

          {/* Caption */}
          <div className="mt-4 pt-2 text-center border-t border-slate-200">
            <p className="font-handwriting text-2xl sm:text-3xl text-pink-900 font-bold tracking-wide">
              {caption || 'A moment frozen in starlight'}
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-1 text-slate-400 text-xs">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span className="font-serif-display uppercase tracking-widest text-[9px]">
                Preserved with love for Ritika
              </span>
              <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default box-mode rendering (not used in new flow, but kept for backward compat)
  return (
    <>
      <motion.div
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleOpen}
        className="group relative cursor-pointer flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-2xl bg-gradient-to-b from-[#240a18]/80 to-[#12020b]/90 hover:from-[#351025] hover:to-[#1a0410] active:scale-[0.98] transition-all duration-300 border border-amber-400/25 hover:border-pink-400/60 shadow-inner h-full w-full"
      >
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-b from-[#251f23] to-[#120f12] rounded-xl border border-white/15 p-2 flex items-center justify-center shadow-xl overflow-hidden">
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent transform pointer-events-none" />
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#0a080a] via-[#38202d] to-[#0a080a] border-2 border-white/30 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-500">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-pink-500/30 to-transparent border border-pink-300/40 flex items-center justify-center">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-300/80 shadow-[0_0_10px_cyan]" />
            </div>
          </div>
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400/80 shadow-[0_0_6px_orange]" />
        </div>

        <span className="mt-2 text-xs font-serif-display font-medium text-pink-100 group-hover:text-white tracking-wider text-center">
          Precision Camera
        </span>
        <span className="text-[10px] text-pink-300/60 font-sans">Apple Macro</span>
      </motion.div>

      {/* Lens Sweep Transition */}
      <AnimatePresence>
        {isLensSweeping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black pointer-events-none flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.4 }}
              animate={{ scale: 3 }}
              transition={{ duration: 0.45 }}
              className="w-48 h-48 rounded-full border-4 border-cyan-300/60 shadow-[0_0_60px_cyan]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Frame Modal */}
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
              initial={{ scale: 0.88, rotate: -2, y: 25 }}
              animate={{ scale: 1, rotate: -0.5, y: 0 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-sm sm:max-w-md w-full bg-[#fcf9f2] p-5 sm:p-6 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.9)] border-4 border-[#eae3d5] text-slate-800"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center hover:bg-pink-700 shadow-lg cursor-pointer transition-transform hover:scale-105"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-900 border border-slate-300 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt="Birthday Memory"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
              </div>

              <div className="mt-4 pt-2 text-center border-t border-slate-200">
                <p className="font-handwriting text-2xl sm:text-3xl text-pink-900 font-bold tracking-wide">
                  {caption || 'A moment frozen in starlight'}
                </p>
                <div className="flex items-center justify-center gap-1.5 mt-1 text-slate-400 text-xs">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span className="font-serif-display uppercase tracking-widest text-[9px]">
                    Preserved with love for Ritika
                  </span>
                  <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

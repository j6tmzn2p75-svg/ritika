'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Sparkles, Heart } from 'lucide-react';
import { soundManager } from '@/lib/audioEngine';

interface CameraItemModalProps {
  photoUrl: string;
  caption: string;
}

export default function CameraItemModal({
  photoUrl,
  caption,
}: CameraItemModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  const handleOpen = () => {
    soundManager.playCameraShutter();
    setIsFlashing(true);
    setTimeout(() => {
      setIsFlashing(false);
      setIsOpen(true);
    }, 220);
  };

  return (
    <>
      {/* Interactive Camera in Box with Double-Bezel */}
      <div className="p-1 rounded-2xl bg-white/5 border border-white/10 w-full">
        <motion.div
          whileHover={{ scale: 1.04, y: -4 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpen}
          className="group relative cursor-pointer flex flex-col items-center p-4 rounded-xl bg-black/40 hover:bg-black/60 transition-all duration-300 border border-white/5"
        >
          <div className="relative w-20 h-18 sm:w-24 sm:h-20 bg-gradient-to-b from-[#3a202a] to-[#201018] rounded-xl border border-pink-400/40 p-2 flex items-center justify-center shadow-inner">
            {/* Camera Lens */}
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-[#1a0a14] via-[#4a1530] to-[#1a0a14] border-2 border-amber-300/60 flex items-center justify-center shadow-md group-hover:rotate-45 transition-transform duration-500">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500/40 to-transparent border border-pink-300/40 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-300/60 shadow-[0_0_8px_cyan]" />
              </div>
            </div>
            {/* Flash bulb */}
            <div className="absolute top-2 right-2 w-3 h-2 rounded-sm bg-amber-200/80 border border-amber-400" />
          </div>

          <span className="mt-2.5 text-xs font-serif-display font-medium text-pink-200 group-hover:text-white tracking-wider">
            Vintage Camera
          </span>
          <span className="text-[10px] text-pink-300/50 font-sans">Click to inspect</span>
        </motion.div>
      </div>

      {/* Shutter Flash Effect */}
      <AnimatePresence>
        {isFlashing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Polaroid / Photo Frame Modal */}
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
              initial={{ scale: 0.85, rotate: -4, y: 25 }}
              animate={{ scale: 1, rotate: -1, y: 0 }}
              exit={{ scale: 0.85, rotate: 4, opacity: 0 }}
              transition={{ type: 'spring', damping: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-sm sm:max-w-md w-full bg-[#fdfbf7] p-5 sm:p-6 rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-[#e5e0d8] text-slate-800"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center hover:bg-pink-700 shadow-lg cursor-pointer transition-transform hover:scale-105"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Photo Image */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-slate-900 border border-slate-300 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt="Birthday Memory"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/15 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Handwritten Caption */}
              <div className="mt-4 pt-2 text-center border-t border-slate-200">
                <p className="font-handwriting text-2xl sm:text-3xl text-pink-800 font-bold tracking-wide">
                  {caption || 'A moment frozen in starlight'}
                </p>
                <div className="flex items-center justify-center gap-1.5 mt-1 text-slate-400 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-serif-display uppercase tracking-widest text-[9px]">
                    Captured with love for Ritika
                  </span>
                  <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

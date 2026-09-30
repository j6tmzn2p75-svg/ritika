'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flower2, X, Sparkles, Wind, Heart } from 'lucide-react';
import { soundManager } from '@/lib/audioEngine';
import SakuraFieldCanvas from './SakuraFieldCanvas';

export default function BouquetItemModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    soundManager.playMagicChime();
    setIsOpen(true);
  };

  return (
    <>
      {/* Interactive Bouquet in Box with Double-Bezel */}
      <div className="p-1 rounded-2xl bg-white/5 border border-white/10 w-full">
        <motion.div
          whileHover={{ scale: 1.04, y: -4 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpen}
          className="group relative cursor-pointer flex flex-col items-center p-4 rounded-xl bg-black/40 hover:bg-black/60 transition-all duration-300 border border-white/5"
        >
          <div className="relative w-20 h-18 sm:w-24 sm:h-20 bg-gradient-to-b from-[#3b1227] to-[#1c0713] rounded-xl border border-pink-400/40 p-2 flex items-center justify-center shadow-inner">
            <div className="relative flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <Flower2 className="w-10 h-10 text-pink-400 group-hover:text-pink-300 transition-colors" />
              <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <div className="absolute inset-0 bg-pink-500/20 blur-md rounded-full" />
            </div>
          </div>

          <span className="mt-2.5 text-xs font-serif-display font-medium text-pink-200 group-hover:text-white tracking-wider">
            Enchanted Bouquet
          </span>
          <span className="text-[10px] text-pink-300/50 font-sans">Click to enter bloom</span>
        </motion.div>
      </div>

      {/* Enchanted Sakura Blossom Field Fullscreen Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-hidden flex flex-col justify-between p-6 bg-black"
          >
            {/* Animated Sakura Field Canvas */}
            <SakuraFieldCanvas />

            {/* Top Close Bar */}
            <div className="relative z-30 flex items-center justify-between max-w-4xl mx-auto w-full pt-4">
              <div className="flex items-center gap-2 glass-panel px-4 py-2 rounded-full border border-pink-300/40">
                <Wind className="w-4 h-4 text-pink-300 animate-pulse" />
                <span className="font-serif-display text-xs sm:text-sm tracking-widest text-pink-100 uppercase">
                  Eternal Sakura Garden • Ritika
                </span>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-full bg-rose-600/80 hover:bg-rose-500 text-white flex items-center justify-center transition-all shadow-lg cursor-pointer hover:scale-105"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Romantic Poetry Message in Sakura Realm */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative z-30 max-w-lg mx-auto text-center glass-panel px-8 py-6 rounded-3xl border border-pink-400/40 shadow-[0_0_50px_rgba(255,105,180,0.4)] mb-8"
            >
              <h3 className="font-serif-display text-2xl sm:text-3xl text-pink-100 glow-pink-text font-semibold mb-2">
                A Bloom That Never Fades
              </h3>
              <p className="font-handwriting text-xl sm:text-2xl text-pink-200/90 leading-relaxed">
                “Like a thousand cherry blossoms dancing in the twilight breeze, every moment with you is pure fairytale magic.”
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-3 text-pink-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[10px] font-serif-display uppercase tracking-widest text-pink-300">
                  Forever in Bloom
                </span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

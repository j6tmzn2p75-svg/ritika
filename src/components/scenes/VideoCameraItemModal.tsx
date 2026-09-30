'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, X, Film, Volume2, VolumeX, Heart, Sparkles } from 'lucide-react';
import { soundManager } from '@/lib/audioEngine';

interface VideoCameraItemModalProps {
  videoUrl: string;
  caption: string;
  isFullscreen?: boolean;
}

export default function VideoCameraItemModal({
  videoUrl,
  caption,
  isFullscreen = false,
}: VideoCameraItemModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleOpen = () => {
    if (isFullscreen) return;
    soundManager.playMagicChime();
    setIsOpen(true);
  };

  // Fullscreen mode: render video player directly
  if (isFullscreen) {
    return (
      <div className="relative max-w-2xl w-full mx-auto rounded-3xl overflow-hidden border-2 border-amber-300/50 shadow-[0_0_60px_rgba(255,209,102,0.35)]">
        {/* Film Strip Header */}
        <div className="bg-[#180a14] px-5 py-2.5 border-b border-amber-400/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-300">
            <Film className="w-4 h-4" />
            <span className="font-serif-display text-xs tracking-widest uppercase font-semibold">
              Fairytale Cinema Reel • Ritika
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-200/70">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>PLAYING</span>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          {videoUrl ? (
            <video
              src={videoUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-pink-300 gap-2">
              <Video className="w-12 h-12 text-pink-400 animate-pulse" />
              <p className="text-sm font-serif-display">No video URL loaded</p>
            </div>
          )}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/60 pointer-events-none" />
        </div>

        {/* Caption & Controls */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#200518] to-[#12010c] flex items-center justify-between border-t border-amber-300/20">
          <div>
            <h4 className="font-serif-display text-base sm:text-lg text-amber-100 font-medium">
              {caption || 'Our endless memories under the stars'}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-pink-300/80 font-handwriting text-xl">
              <span>A special screening crafted just for you</span>
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 rounded-full bg-pink-950/60 border border-pink-500/40 text-pink-200 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
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
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-b from-[#2b1828] to-[#170914] rounded-xl border border-pink-400/30 p-2 flex items-center justify-center shadow-inner">
          <div className="absolute -top-1.5 left-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-amber-300/50 flex items-center justify-center bg-black/50 group-hover:rotate-180 transition-transform duration-700">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          </div>
          <div className="absolute -top-1.5 right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-amber-300/50 flex items-center justify-center bg-black/50 group-hover:rotate-180 transition-transform duration-700">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          </div>

          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-slate-900 via-pink-950 to-slate-900 border-2 border-pink-400 flex items-center justify-center">
            <Video className="w-4 h-4 text-pink-300" />
          </div>

          <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-[7px] sm:text-[8px] font-mono font-bold text-red-400">REC</span>
          </div>
        </div>

        <span className="mt-2 text-xs font-serif-display font-medium text-pink-100 group-hover:text-white tracking-wider text-center">
          Cinema Projector
        </span>
        <span className="text-[10px] text-pink-300/60 font-sans">Tap to watch</span>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.88, y: 25 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full glass-panel-gold rounded-3xl overflow-hidden border-2 border-amber-300/50 shadow-[0_0_60px_rgba(255,209,102,0.35)]"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-rose-600/80 text-white flex items-center justify-center hover:bg-rose-500 transition-colors shadow-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="bg-[#180a14] px-5 py-2.5 border-b border-amber-400/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300">
                  <Film className="w-4 h-4" />
                  <span className="font-serif-display text-xs tracking-widest uppercase font-semibold">
                    Fairytale Cinema Reel • Ritika
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-200/70">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>PLAYING</span>
                </div>
              </div>

              <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
                {videoUrl ? (
                  <video
                    src={videoUrl}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-pink-300 gap-2">
                    <Video className="w-12 h-12 text-pink-400 animate-pulse" />
                    <p className="text-sm font-serif-display">No video URL loaded</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/60 pointer-events-none" />
              </div>

              <div className="p-4 sm:p-5 bg-gradient-to-r from-[#200518] to-[#12010c] flex items-center justify-between border-t border-amber-300/20">
                <div>
                  <h4 className="font-serif-display text-base sm:text-lg text-amber-100 font-medium">
                    {caption || 'Our endless memories under the stars'}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-pink-300/80 font-handwriting text-xl">
                    <span>A special screening crafted just for you</span>
                    <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2.5 rounded-full bg-pink-950/60 border border-pink-500/40 text-pink-200 hover:text-white transition-colors cursor-pointer"
                    title={isMuted ? 'Unmute video' : 'Mute video'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

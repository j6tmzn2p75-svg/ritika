'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flower2, Star, Wind, Crown, X, Camera, Video, Gift, Feather } from 'lucide-react';
import CinematicCameraScene from './CinematicCameraScene';
import VideoCameraItemModal from './VideoCameraItemModal';
import PhotorealisticSakuraScene from './PhotorealisticSakuraScene';
import GiftBoxItemModal from './GiftBoxItemModal';
import CinematicLetterPadScene from './CinematicLetterPadScene';
import { AppConfig } from '@/types';

interface MemoryBoxSceneProps {
  config: AppConfig;
  onRefreshLetters?: () => void;
}

// Ornate Victorian / Baroque Filigree Corner Bracket Component
function FiligreeCorner({
  className = '',
  rotation = 0,
}: {
  className?: string;
  rotation?: number;
}) {
  return (
    <div
      className={`absolute pointer-events-none z-20 ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-14 h-14 sm:w-20 sm:h-20 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] filter brightness-110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldFiligreeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff5cc" />
            <stop offset="25%" stopColor="#ffd166" />
            <stop offset="60%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
        </defs>
        <path
          d="M 6 6 L 82 6 C 70 12, 60 22, 54 36 C 46 22, 34 14, 20 16 C 14 34, 22 46, 36 54 C 22 60, 12 70, 6 82 Z"
          fill="url(#goldFiligreeGrad)"
          stroke="#b45309"
          strokeWidth="1.2"
        />
        <path
          d="M 12 12 Q 45 16 38 48 Q 28 32 12 12 Z"
          fill="#fef08a"
          opacity="0.85"
        />
        <path
          d="M 18 18 Q 28 40 48 38 Q 32 28 18 18 Z"
          fill="#f59e0b"
          opacity="0.9"
        />
        <circle cx="16" cy="16" r="4.5" fill="#fef08a" stroke="#78350f" strokeWidth="1" />
        <circle cx="16" cy="16" r="2" fill="#ffffff" />
        <path
          d="M 28 10 Q 52 14 68 8"
          stroke="#ffd166"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 10 28 Q 14 52 8 68"
          stroke="#ffd166"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// Fullscreen expandable wrapper for memory box items
type ExpandedItem = 'camera' | 'video' | 'sakura' | 'gift' | 'letter' | null;

export default function MemoryBoxScene({
  config,
  onRefreshLetters,
}: MemoryBoxSceneProps) {
  const [isSakuraOpen, setIsSakuraOpen] = useState(false);
  const [isGiftOpenAfterSakura, setIsGiftOpenAfterSakura] = useState(false);
  const [expandedItem, setExpandedItem] = useState<ExpandedItem>(null);

  const handleExpand = useCallback((item: ExpandedItem) => {
    setExpandedItem(item);
  }, []);

  const handleClose = useCallback(() => {
    setExpandedItem(null);
  }, []);

  return (
    <div className="relative min-h-[100dvh] w-full max-w-full bg-[#070105] overflow-y-auto overflow-x-hidden flex flex-col items-center justify-between py-6 sm:py-10 px-3 sm:px-6 select-none">
      {/* Studio Romantic Lighting Focus */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] h-[600px] sm:h-[850px] bg-gradient-to-tr from-pink-600/12 via-amber-400/15 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-rose-500/10 blur-3xl rounded-full" />
      </div>

      {/* Floating Gold & Amber Dust Motes - Reduced count for performance */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-200/25 blur-[0.5px] animate-float-slow"
            style={{
              left: `${(i * 13.7) % 100}%`,
              top: `${(i * 27.3) % 100}%`,
              width: `${(i % 3) + 1.5}px`,
              height: `${(i % 3) + 1.5}px`,
              animationDelay: `${i * 0.25}s`,
            }}
          />
        ))}
      </div>

      {/* Title Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center max-w-xl mx-auto mb-4 sm:mb-6 px-4"
      >
        <div className="mb-2">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-amber-500/20 border border-amber-300/40 text-[10px] sm:text-xs font-serif-display uppercase tracking-[0.25em] text-amber-200 shadow-md backdrop-blur-md">
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span>Decorated Keepsake Box</span>
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
          </span>
        </div>

        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-serif-display font-light text-white tracking-wide">
          Magical Memory Box
        </h2>
        <p className="text-xs sm:text-sm text-pink-200/70 font-sans mt-1.5 max-w-md mx-auto">
          Five cinematic treasures handcrafted for {config?.recipientName || 'Ritika'}. Tap any keepsake to enter its story.
        </p>
      </motion.div>

      {/* SQUARE-SHAPED DECORATED CARDBOARD GIFT BOX */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[540px] sm:max-w-[620px] aspect-square mx-auto flex flex-col my-auto"
      >
        {/* Main Decorated Cardboard Box Shell */}
        <div
          className="relative w-full h-full rounded-[2rem] sm:rounded-[2.75rem] p-3.5 sm:p-5 overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.98),0_0_35px_rgba(255,209,102,0.15)] border-[3px] border-[#9c633a] flex flex-col justify-between"
          style={{
            backgroundColor: '#5a341e',
            backgroundImage: `
              radial-gradient(#764426 15%, transparent 16%),
              radial-gradient(#4d2b17 15%, transparent 16%),
              linear-gradient(135deg, rgba(255,215,0,0.06) 0%, transparent 50%, rgba(0,0,0,0.4) 100%)
            `,
            backgroundSize: '16px 16px, 16px 16px, 100% 100%',
            backgroundPosition: '0 0, 8px 8px, 0 0',
          }}
        >
          {/* ORNATE GOLD FILIGREE CORNER BRACKETS */}
          <FiligreeCorner className="top-1 left-1 sm:top-2 sm:left-2" rotation={0} />
          <FiligreeCorner className="top-1 right-1 sm:top-2 sm:right-2" rotation={90} />
          <FiligreeCorner className="bottom-1 right-1 sm:bottom-2 sm:right-2" rotation={180} />
          <FiligreeCorner className="bottom-1 left-1 sm:bottom-2 sm:left-2" rotation={270} />

          {/* DECORATIVE BORDERS */}
          <div className="absolute inset-2 sm:inset-3 rounded-[1.6rem] sm:rounded-[2.25rem] border-2 border-[#d97706]/50 shadow-[inset_0_0_12px_rgba(255,215,0,0.2)] pointer-events-none" />
          <div className="absolute inset-3 sm:inset-4 rounded-[1.4rem] sm:rounded-[2rem] border border-dashed border-[#ffd166]/40 pointer-events-none" />

          {/* TOP DECORATIVE BOX LATCH */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <div className="px-4 sm:px-6 py-1 rounded-b-xl bg-gradient-to-r from-[#78350f] via-[#d97706] to-[#78350f] border-x border-b border-[#fef08a]/60 shadow-[0_4px_12px_rgba(0,0,0,0.8)] flex items-center gap-2">
              <Sparkles className="w-2.5 h-2.5 text-[#fef08a]" />
              <span className="text-[9px] sm:text-[10px] font-serif-display uppercase tracking-[0.25em] text-[#fff8db] font-semibold">
                {config?.recipientName || 'Ritika'}&apos;s Keepsake Chest
              </span>
              <Sparkles className="w-2.5 h-2.5 text-[#fef08a]" />
            </div>
          </div>

          {/* Interior Velvet Tray */}
          <div className="relative z-10 bg-gradient-to-b from-[#180410] via-[#10020b] to-[#180410] rounded-[1.6rem] sm:rounded-[2.25rem] p-3 sm:p-4.5 backdrop-blur-sm border-2 border-[#ffb3d9]/25 shadow-[inset_0_6px_30px_rgba(0,0,0,0.95),0_0_15px_rgba(255,105,180,0.15)] w-full h-full flex flex-col justify-between overflow-hidden">
            {/* Fairy Lights */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_8px_#ffd166] animate-pulse"
                  style={{
                    left:
                      i < 5
                        ? `${(i / 4) * 92 + 4}%`
                        : i < 9
                        ? '96%'
                        : i < 13
                        ? `${((12 - i) / 4) * 92 + 4}%`
                        : '4%',
                    top:
                      i < 5
                        ? '4%'
                        : i < 9
                        ? `${((i - 4) / 4) * 92 + 4}%`
                        : i < 13
                        ? '96%'
                        : `${((16 - i) / 4) * 92 + 4}%`,
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: '2.5s',
                  }}
                />
              ))}
            </div>

            {/* GRID OF FIVE MEMORY ITEMS - Each expands to fullscreen on tap */}
            <div className="relative z-10 grid grid-cols-2 gap-2.5 sm:gap-3.5 h-full w-full">
              {/* ITEM 1: Camera (Top-Left) */}
              <div className="h-full w-full flex">
                <ExpandableItem
                  onExpand={() => handleExpand('camera')}
                  icon={<Camera className="w-7 h-7 sm:w-8 sm:h-8 text-pink-300 group-hover:text-pink-100 transition-colors" />}
                  title="Precision Camera"
                  subtitle="Apple Macro"
                  accentColor="cyan"
                />
              </div>

              {/* ITEM 2: Video (Top-Right) */}
              <div className="h-full w-full flex">
                <ExpandableItem
                  onExpand={() => handleExpand('video')}
                  icon={<Video className="w-6 h-6 sm:w-7 sm:h-7 text-pink-300 group-hover:text-pink-100 transition-colors" />}
                  title="Cinema Projector"
                  subtitle="Tap to watch"
                  accentColor="pink"
                  hasRecLight
                />
              </div>

              {/* ITEM 3: Sakura (Center - Spans 2 Columns) */}
              <div className="col-span-2 h-full w-full flex">
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsSakuraOpen(true)}
                  className="group relative cursor-pointer flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-[#240817] via-[#350f24] to-[#1a0512] hover:from-[#330c22] hover:to-[#24081a] active:bg-white/[0.12] transition-all duration-300 border-2 border-amber-400/40 hover:border-pink-400/70 w-full shadow-[inset_0_2px_12px_rgba(0,0,0,0.7),0_0_15px_rgba(255,209,102,0.15)] overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-30 group-hover:opacity-45 transition-opacity duration-700 pointer-events-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/sakura_field_trees_4k.jpg"
                      alt="Sakura Field"
                      className="w-full h-full object-cover object-center filter brightness-95 group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1a0512]/90 via-transparent to-[#1a0512]/90" />
                  </div>

                  <div className="relative z-10 flex items-center gap-3 sm:gap-4">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-b from-[#4a1834] to-[#1f0917] rounded-xl border border-pink-400/50 p-2 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 shrink-0">
                      <Flower2 className="w-7 h-7 sm:w-8 sm:h-8 text-pink-300 group-hover:text-pink-100 transition-colors" />
                      <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    </div>

                    <div className="flex flex-col text-left">
                      <span className="text-xs sm:text-sm font-serif-display font-medium text-pink-100 group-hover:text-white tracking-wider flex items-center gap-2">
                        <span>Sakura Blossom Grove</span>
                        <Wind className="w-3 h-3 text-pink-400 animate-pulse hidden xs:inline" />
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-pink-300/80 font-sans">
                        Real-life Japanese Cherry Blossom Field of Trees
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-[10px] font-serif-display uppercase tracking-wider text-amber-200 shrink-0 shadow-sm">
                    <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                    <span>4K Golden Hour</span>
                  </div>
                </motion.div>
              </div>

              {/* ITEM 4: Gift (Bottom-Left) */}
              <div className="h-full w-full flex">
                <ExpandableItem
                  onExpand={() => handleExpand('gift')}
                  icon={<Gift className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300 group-hover:text-amber-200 transition-colors" />}
                  title="Secret Gift Box"
                  subtitle="Tap to unwrap"
                  accentColor="amber"
                  hasSparkle
                />
              </div>

              {/* ITEM 5: Letter (Bottom-Right) */}
              <div className="h-full w-full flex">
                <ExpandableItem
                  onExpand={() => handleExpand('letter')}
                  icon={<Feather className="w-5 h-5 sm:w-6 sm:h-6 text-[#8b3a1a] group-hover:text-amber-200 transition-colors" />}
                  title="Shakespearean Folio"
                  subtitle="Poetic Keepsake"
                  accentColor="amber"
                  isLetter
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ====== FULLSCREEN EXPANDED MODALS ====== */}
      <AnimatePresence>
        {expandedItem === 'camera' && (
          <FullscreenModal onClose={handleClose} title="Precision Camera" subtitle="Apple Macro Photography">
            <CinematicCameraScene
              photoUrl={config.cameraPhotoUrl}
              caption={config.cameraPhotoCaption}
              isFullscreen
            />
          </FullscreenModal>
        )}

        {expandedItem === 'video' && (
          <FullscreenModal onClose={handleClose} title="Cinema Projector" subtitle="Fairytale Cinema Reel">
            <VideoCameraItemModal
              videoUrl={config.videoUrl}
              caption={config.videoCaption}
              isFullscreen
            />
          </FullscreenModal>
        )}

        {expandedItem === 'gift' && (
          <FullscreenModal onClose={handleClose} title="Secret Gift Box" subtitle="Treasured Keepsake">
            <GiftBoxItemModal
              giftPhotoUrl={config.giftPhotoUrl}
              caption={config.giftPhotoCaption}
              isFullscreen
            />
          </FullscreenModal>
        )}

        {expandedItem === 'letter' && (
          <FullscreenModal onClose={handleClose} title="Shakespearean Folio" subtitle="Poetic Inscriptions">
            <CinematicLetterPadScene
              letterHeading={config.letterHeading}
              onLetterSaved={onRefreshLetters}
              isFullscreen
            />
          </FullscreenModal>
        )}
      </AnimatePresence>

      {/* Sakura Scene (already fullscreen) */}
      <PhotorealisticSakuraScene
        isOpen={isSakuraOpen}
        onClose={() => setIsSakuraOpen(false)}
        onTransitionToGift={() => setIsGiftOpenAfterSakura(true)}
      />

      {/* Footer */}
      <div className="relative z-10 text-center mt-4 sm:mt-6">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs text-pink-200/80 font-sans tracking-wider backdrop-blur-sm">
          <Star className="w-3 h-3 text-pink-300" />
          <span>Every memory preserved with cinematic intention</span>
          <Star className="w-3 h-3 text-pink-300" />
        </span>
      </div>
    </div>
  );
}

// Expandable item button for the memory box grid
function ExpandableItem({
  onExpand,
  icon,
  title,
  subtitle,
  accentColor = 'pink',
  hasRecLight = false,
  hasSparkle = false,
  isLetter = false,
}: {
  onExpand: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  accentColor?: string;
  hasRecLight?: boolean;
  hasSparkle?: boolean;
  isLetter?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onExpand}
      className="group relative cursor-pointer flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-2xl bg-gradient-to-b from-[#240a18]/80 to-[#12020b]/90 hover:from-[#351025] hover:to-[#1a0410] active:scale-[0.98] transition-all duration-300 border border-amber-400/25 hover:border-pink-400/60 shadow-inner h-full w-full"
    >
      <div className={`relative w-16 h-16 sm:w-20 sm:h-20 ${isLetter ? 'bg-[#e8dac1]' : 'bg-gradient-to-b from-[#2b1828] to-[#170914]'} rounded-xl border ${isLetter ? 'border-amber-700/40' : 'border-pink-400/30'} p-2 flex items-center justify-center shadow-lg overflow-hidden`}>
        {/* Rim light sweep */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent transform pointer-events-none" />

        {isLetter ? (
          <div className="w-full h-full flex flex-col justify-around py-1 px-1.5 border border-amber-800/20 rounded bg-[#f5ede0] shadow-inner relative">
            <div className="w-full h-[1px] bg-amber-800/30" />
            <div className="w-full h-[1px] bg-amber-800/30" />
            <div className="w-3/4 h-[1px] bg-amber-800/30" />
            <div className="absolute bottom-1 right-1">
              {icon}
            </div>
          </div>
        ) : (
          <div className="relative flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
            {icon}
          </div>
        )}

        {hasRecLight && (
          <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-[7px] sm:text-[8px] font-mono font-bold text-red-400">REC</span>
          </div>
        )}

        {hasSparkle && (
          <Sparkles className="absolute top-1.5 right-1.5 w-3 h-3 text-amber-300 animate-spin" style={{ animationDuration: '5s' }} />
        )}
      </div>

      <span className="mt-2 text-xs font-serif-display font-medium text-pink-100 group-hover:text-white tracking-wider text-center">
        {title}
      </span>
      <span className={`text-[10px] ${isLetter ? 'text-amber-200/60 font-serif-display italic' : 'text-pink-300/60 font-sans'}`}>
        {subtitle}
      </span>
    </motion.div>
  );
}

// Fullscreen modal wrapper with smooth transition
function FullscreenModal({
  onClose,
  title,
  subtitle,
  children,
}: {
  onClose: () => void;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col"
      style={{ willChange: 'opacity' }}
    >
      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/10 bg-black/60 backdrop-blur-xl z-20 shrink-0"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-pink-300" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-serif-display font-semibold text-white tracking-wider">
              {title}
            </h3>
            <p className="text-[10px] sm:text-xs text-pink-200/60 font-sans">{subtitle}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Content Area - Fills remaining space with mobile-optimized scroll */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 overflow-y-auto flex flex-col items-center justify-start sm:justify-center p-2.5 sm:p-6 md:p-8 overscroll-contain w-full"
        style={{ willChange: 'transform, opacity' }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

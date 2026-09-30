'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Feather, X, Sparkles, Heart, Send, BookOpen, Scroll, CheckCircle2 } from 'lucide-react';
import { soundManager } from '@/lib/audioEngine';

interface CinematicLetterPadSceneProps {
  letterHeading?: string;
  onLetterSaved?: () => void;
  isFullscreen?: boolean;
}

export default function CinematicLetterPadScene({
  letterHeading = 'Inscribe a Sonnet for Ritika',
  onLetterSaved,
  isFullscreen = false,
}: CinematicLetterPadSceneProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Envelope sealing states: 'editing' | 'folding' | 'enveloped' | 'sealed'
  const [envelopeState, setEnvelopeState] = useState<'editing' | 'folding' | 'enveloped' | 'sealed'>('editing');

  const handleOpen = () => {
    soundManager.playMagicChime();
    setIsOpen(true);
    setEnvelopeState('editing');
  };

  // Auto-open when in fullscreen mode
  useEffect(() => {
    if (isFullscreen && !isOpen) {
      setIsOpen(true);
      setEnvelopeState('editing');
    }
  }, [isFullscreen]);

  const handleSave = async () => {
    if (!message.trim()) return;
    setIsSaving(true);
    setEnvelopeState('folding');

    try {
      // Step 1: Paper folds into envelope
      setTimeout(() => {
        setEnvelopeState('enveloped');
      }, 700);

      // Step 2: Heart wax seal stamped
      setTimeout(() => {
        soundManager.playLetterSave();
        setEnvelopeState('sealed');
      }, 1400);

      // Persist to backend API
      const res = await fetch('/api/letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: author.trim() || 'A Devoted Poet',
          message: message.trim(),
        }),
      });

      if (res.ok && onLetterSaved) {
        onLetterSaved();
      }
    } catch (e) {
      console.error(e);
      setEnvelopeState('editing');
      setIsSaving(false);
    }
  };

  // The reusable manuscript card content
  const renderManuscriptBody = () => (
    <div className="relative w-full max-w-xl mx-auto rounded-2xl sm:rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.95)] border-2 sm:border-4 border-[#4a2612] ring-1 ring-amber-500/30 overflow-hidden bg-gradient-to-b from-[#24130a] via-[#1a0e08] to-[#120904]">
      {/* Authentic Elizabethan Manuscript Background Texture & Warm Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/shakespeare_parchment.jpg"
          alt="Shakespeare Parchment"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-rose-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-20 p-3.5 sm:p-7 flex flex-col justify-between">
        {envelopeState === 'editing' || envelopeState === 'folding' ? (
          <>
            {/* Shakespearean Folio Header */}
            <div className="text-center pb-2.5 sm:pb-3 border-b border-amber-600/30 mb-3 sm:mb-4">
              {/* Renaissance Fleuron & Quill */}
              <div className="flex items-center justify-center gap-2 text-amber-300 mb-1">
                <span className="text-amber-500/70 text-xs select-none">❧</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/15 border border-amber-400/40 flex items-center justify-center shadow-inner">
                  <Feather className="w-4 h-4 text-amber-300 transform -rotate-12" />
                </div>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-amber-500/70 text-xs select-none">☙</span>
              </div>

              {/* Title with Stylish Gilded Typography */}
              <h3 className="font-decorative text-lg sm:text-2xl font-bold tracking-wide text-gold-gilded">
                {letterHeading}
              </h3>

              {/* Shakespeare Sonnet 18 Epigraph */}
              <div className="mt-1.5 max-w-md mx-auto px-2">
                <p className="font-playfair italic text-xs sm:text-sm text-amber-200/90 leading-relaxed font-normal">
                  &ldquo;Shall I compare thee to a summer&apos;s day? Thou art more lovely and more temperate...&rdquo;
                </p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-amber-500/40" />
                  <span className="text-[9px] sm:text-[10px] font-serif-display uppercase tracking-[0.25em] text-amber-400/75">
                    William Shakespeare • Sonnet XVIII
                  </span>
                  <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-amber-500/40" />
                </div>
              </div>
            </div>

            {/* Author Signature Field (The Poet's Signature) - Stylish & Mobile Friendly */}
            <div className="mb-2.5 sm:mb-3">
              <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-serif-display uppercase tracking-widest text-amber-300/80 mb-1 px-1">
                <Feather className="w-3 h-3 text-amber-400" />
                <span>Thy Signature / The Poet:</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g., Thy Faithful Romeo, A Devoted Admirer"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full min-h-[42px] px-3.5 sm:px-4 py-2 text-base sm:text-lg bg-[#140a05]/85 border border-amber-500/40 rounded-xl text-amber-100 focus:outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-400/30 placeholder:font-serif-display placeholder:text-xs sm:placeholder:text-sm placeholder:text-amber-400/30 font-handwriting shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500/40 font-serif text-sm select-none pointer-events-none">
                  ✒
                </span>
              </div>
            </div>

            {/* Antique Deckled Parchment Writing Canvas */}
            <div className="relative mb-3.5 sm:mb-4 bg-[#faf2e1] border-2 border-amber-800/40 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-[inset_0_2px_14px_rgba(43,18,6,0.18),0_4px_20px_rgba(0,0,0,0.3)] text-amber-950 overflow-hidden">
              {/* Filigree Corner Accents */}
              <div className="absolute top-1.5 left-2 text-amber-800/35 text-xs sm:text-sm select-none font-serif">❦</div>
              <div className="absolute top-1.5 right-2 text-amber-800/35 text-xs sm:text-sm select-none font-serif">❧</div>
              <div className="absolute bottom-1.5 left-2 text-amber-800/35 text-xs sm:text-sm select-none font-serif">❧</div>
              <div className="absolute bottom-1.5 right-2 text-amber-800/35 text-xs sm:text-sm select-none font-serif">❦</div>

              {/* Subtle antique watermark in the center */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
                <BookOpen className="w-48 h-48 text-amber-900" />
              </div>

              <textarea
                rows={5}
                placeholder="Speak from the depths of thy heart... compose verses or birthday wishes for Ritika upon this antique parchment..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full min-h-[150px] sm:min-h-[190px] bg-transparent resize-none focus:outline-none font-handwriting text-lg sm:text-xl md:text-2xl text-quill-ink leading-[32px] sm:leading-[36px] placeholder:font-serif-display placeholder:text-xs sm:placeholder:text-sm placeholder:text-amber-900/40 font-normal selection:bg-amber-300/40 relative z-10"
                style={{
                  backgroundImage: 'linear-gradient(transparent 31px, rgba(139, 58, 26, 0.15) 32px)',
                  backgroundSize: '100% 32px',
                  lineHeight: '32px',
                }}
              />
            </div>

            {/* Submission Section - Optimized for all mobile screen widths */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 pt-1">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-serif-display italic text-amber-300/70 order-2 sm:order-1">
                <Scroll className="w-3.5 h-3.5 text-amber-400/80" />
                <span>Inscribed with eternal ink for Ritika</span>
              </div>

              {/* Royal Wax Seal Stamp Button */}
              <button
                id="save-letter-button"
                onClick={handleSave}
                disabled={!message.trim() || isSaving}
                className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-serif-display font-bold tracking-widest text-xs uppercase flex items-center justify-center gap-3 transition-all order-1 sm:order-2 ${
                  message.trim() && !isSaving
                    ? 'bg-gradient-to-r from-[#831843] via-[#991b1b] to-[#b45309] text-amber-100 shadow-[0_4px_25px_rgba(185,28,28,0.55)] cursor-pointer hover:scale-102 active:scale-98 border border-amber-300/50 hover:border-amber-200'
                    : 'bg-stone-800/80 text-stone-500 cursor-not-allowed border border-stone-700/60'
                }`}
              >
                <span>{isSaving ? 'Sealing with Wax...' : 'SEAL WITH ROYAL WAX'}</span>
                <div className="w-6 h-6 rounded-full bg-black/30 border border-amber-400/30 flex items-center justify-center text-amber-200 shrink-0">
                  <Feather className="w-3 h-3" />
                </div>
              </button>
            </div>
          </>
        ) : (
          /* Sealed State: Folded Parchment & Stamped Royal Seal */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 sm:py-12 text-center flex flex-col items-center px-2"
          >
            {/* Antique Folded Envelope with Wax Seal */}
            <div className="relative w-48 sm:w-56 h-32 sm:h-38 bg-[#e8dac1] border-2 border-amber-800/60 rounded-xl shadow-2xl flex items-center justify-center mb-5 sm:mb-6 overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-16 sm:h-20 bg-[#d8c3a5] border-b-2 border-amber-800/40 [clip-path:polygon(0_0,100%_0,50%_100%)]" />

              {/* Crimson Royal Wax Stamp Seal */}
              <motion.div
                initial={{ scale: 2.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 14 }}
                className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#7f1d1d] via-[#991b1b] to-[#b91c1c] border-2 border-amber-300 flex items-center justify-center text-amber-100 shadow-[0_0_30px_rgba(185,28,28,0.85)]"
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-100 text-amber-100 animate-pulse" />
              </motion.div>
            </div>

            <h3 className="font-decorative text-lg sm:text-2xl text-gold-gilded font-bold mb-2 tracking-wide">
              Inscribed in Shakespeare&apos;s Eternal Folio
            </h3>

            <p className="font-playfair italic text-sm sm:text-lg text-amber-200/90 max-w-sm mx-auto leading-relaxed">
              &ldquo;Thy heartfelt verses have been sealed in eternal royal wax upon golden vellum for Ritika ❤️&rdquo;
            </p>

            <button
              onClick={() => {
                setEnvelopeState('editing');
                setMessage('');
              }}
              className="mt-5 sm:mt-6 px-4 py-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 text-xs sm:text-sm text-amber-200 font-serif-display transition-all cursor-pointer tracking-wider flex items-center gap-2"
            >
              <Feather className="w-3.5 h-3.5 text-amber-400" />
              <span>Inscribe another poetic verse</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );

  // In fullscreen mode, render content directly
  if (isFullscreen) {
    return renderManuscriptBody();
  }

  return (
    <>
      {/* Shakespearean Folio Item in Memory Box Compartment */}
      <motion.div
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleOpen}
        className="group relative cursor-pointer flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-[#240a18]/80 to-[#12020b]/90 hover:from-[#351025] hover:to-[#1a0410] active:scale-[0.98] transition-all duration-300 border border-amber-400/25 hover:border-pink-400/60 shadow-inner h-full w-full"
      >
        {/* Antique Folio Miniature with Gold Foil Leaf */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-[#e8dac1] rounded-xl border border-amber-700/40 p-2 flex items-center justify-center shadow-lg group-hover:rotate-2 transition-transform duration-300 overflow-hidden">
          <div className="w-full h-full flex flex-col justify-around py-1 px-1.5 border border-amber-800/20 rounded bg-[#f5ede0] shadow-inner">
            <div className="w-full h-[1px] bg-amber-800/30" />
            <div className="w-full h-[1px] bg-amber-800/30" />
            <div className="w-3/4 h-[1px] bg-amber-800/30" />
            <Feather className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8b3a1a] absolute bottom-1 right-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </div>

        <span className="mt-2 text-xs font-decorative font-bold text-amber-100 group-hover:text-white tracking-wider text-center">
          Shakespearean Folio
        </span>
        <span className="text-[10px] text-amber-200/60 font-playfair italic">Poetic Keepsake</span>
      </motion.div>

      {/* Fallback Non-Fullscreen Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl my-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -top-3 -right-3 z-30 w-8 h-8 rounded-full bg-[#522915] border border-amber-400/50 text-amber-100 flex items-center justify-center hover:bg-[#72391d] shadow-lg cursor-pointer transition-transform hover:scale-105"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {renderManuscriptBody()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

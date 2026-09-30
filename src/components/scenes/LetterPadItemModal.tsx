'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Feather, X, Sparkles, Heart, CheckCircle2, Send } from 'lucide-react';
import { soundManager } from '@/lib/audioEngine';

interface LetterPadItemModalProps {
  letterHeading?: string;
  onLetterSaved?: () => void;
}

export default function LetterPadItemModal({
  letterHeading = 'Write something for Ritika',
  onLetterSaved,
}: LetterPadItemModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleOpen = () => {
    soundManager.playMagicChime();
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!message.trim()) return;
    setIsSaving(true);

    try {
      const res = await fetch('/api/letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: author.trim() || 'A devoted friend',
          message: message.trim(),
        }),
      });

      if (res.ok) {
        soundManager.playLetterSave();
        setIsSaved(true);
        if (onLetterSaved) onLetterSaved();
      }
    } catch (e) {
      console.error('Failed to save letter:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Interactive Letter Pad in Box with Double-Bezel */}
      <div className="p-1 rounded-2xl bg-white/5 border border-white/10 w-full">
        <motion.div
          whileHover={{ scale: 1.04, y: -4 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpen}
          className="group relative cursor-pointer flex flex-col items-center p-4 rounded-xl bg-black/40 hover:bg-black/60 transition-all duration-300 border border-white/5"
        >
          <div className="relative w-20 h-18 sm:w-24 sm:h-20 bg-[#fffaf0] rounded-xl border border-amber-300/60 p-2 flex items-center justify-center shadow-md group-hover:rotate-2 transition-transform duration-300">
            <div className="w-full h-full flex flex-col justify-around py-1 px-2 border-b-2 border-r-2 border-amber-200/80 rounded bg-[#fffdfa]">
              <div className="w-full h-[1px] bg-pink-300/40" />
              <div className="w-full h-[1px] bg-pink-300/40" />
              <div className="w-3/4 h-[1px] bg-pink-300/40" />
              <Feather className="w-4 h-4 text-pink-600 absolute bottom-2 right-2 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>

          <span className="mt-2.5 text-xs font-serif-display font-medium text-pink-200 group-hover:text-white tracking-wider">
            Enchanted Parchment
          </span>
          <span className="text-[10px] text-pink-300/50 font-sans">Click to write</span>
        </motion.div>
      </div>

      {/* Realistic Ruled Stationery Modal */}
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
              animate={{ scale: 1, rotate: 0, y: 0 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: 'spring', damping: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full bg-[#fffcf5] text-slate-800 p-6 sm:p-8 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] border-4 border-[#f5ede0]"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center hover:bg-pink-700 shadow-lg cursor-pointer transition-transform hover:scale-105"
              >
                <X className="w-4 h-4" />
              </button>

              {!isSaved ? (
                <>
                  {/* Parchment Header */}
                  <div className="text-center pb-3 border-b-2 border-amber-200/60 mb-4">
                    <div className="flex items-center justify-center gap-2 text-pink-600 mb-1">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <Feather className="w-4 h-4" />
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    </div>
                    <h3 className="font-serif-display text-xl sm:text-2xl text-pink-900 font-semibold tracking-wide">
                      {letterHeading}
                    </h3>
                    <p className="text-xs text-amber-900/60 font-sans tracking-wide">
                      A personalized note saved directly into Ritika’s keepsake vault
                    </p>
                  </div>

                  {/* Name Input */}
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Your name or signature"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-4 py-2 text-sm bg-[#faf4e6] border border-amber-300/60 rounded-lg text-slate-800 focus:outline-none focus:border-pink-500 placeholder-slate-400 font-sans"
                    />
                  </div>

                  {/* Ruled Writing Textarea */}
                  <div className="relative mb-5 bg-[#fffefb] border border-amber-200 rounded-lg p-3 shadow-inner">
                    <textarea
                      rows={6}
                      placeholder="Write your birthday message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-transparent resize-none focus:outline-none font-handwriting text-2xl sm:text-3xl text-pink-950 leading-relaxed placeholder-pink-300/40"
                      style={{
                        backgroundImage: 'linear-gradient(transparent 39px, rgba(244, 114, 182, 0.25) 40px)',
                        backgroundSize: '100% 40px',
                        lineHeight: '40px',
                      }}
                    />
                  </div>

                  {/* Submit Button with Button-in-Button Architecture */}
                  <div className="flex items-center justify-end">
                    <div className="p-1 rounded-full bg-pink-500/10 border border-slate-200">
                      <motion.button
                        id="save-letter-button"
                        whileHover={message.trim() && !isSaving ? { scale: 1.03 } : {}}
                        whileTap={message.trim() && !isSaving ? { scale: 0.97 } : {}}
                        onClick={handleSave}
                        disabled={!message.trim() || isSaving}
                        className={`pl-6 pr-2 py-2 rounded-full font-serif-display font-semibold tracking-widest text-xs uppercase flex items-center gap-3 transition-all ${
                          message.trim() && !isSaving
                            ? 'bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white shadow-md shadow-pink-500/30 cursor-pointer'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <span>{isSaving ? 'Inscribing...' : 'SAVE LETTER'}</span>
                        {/* Nested Button-in-Button Trailing Icon Wrapper */}
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center ${
                            message.trim() && !isSaving
                              ? 'bg-black/20 text-white'
                              : 'bg-slate-300 text-slate-500'
                          }`}
                        >
                          <Send className="w-3.5 h-3.5" />
                        </div>
                      </motion.button>
                    </div>
                  </div>
                </>
              ) : (
                /* Saved Confirmation */
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center flex flex-col items-center"
                >
                  <div className="w-14 h-14 rounded-full bg-pink-100 border-2 border-pink-400 flex items-center justify-center text-pink-600 mb-4 shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif-display text-xl text-pink-900 font-bold mb-1.5">
                    Message Sealed In Magic
                  </h3>
                  <p className="font-handwriting text-2xl text-pink-700 max-w-sm mx-auto leading-relaxed">
                    “Your letter has been safely tucked away”
                  </p>
                  <p className="text-xs text-amber-900/60 mt-3 font-sans">
                    Ritika can view and cherish your heartfelt words anytime.
                  </p>

                  <button
                    onClick={() => {
                      setIsSaved(false);
                      setMessage('');
                    }}
                    className="mt-5 text-xs text-pink-600 underline font-medium hover:text-pink-800 cursor-pointer"
                  >
                    Write another note
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

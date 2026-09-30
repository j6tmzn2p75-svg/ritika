'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PinkMatrixCanvas from './PinkMatrixCanvas';
import CountdownTimer from './CountdownTimer';
import ProceedButton from './ProceedButton';

interface IntroSceneProps {
  onNext: () => void;
}

export default function IntroScene({ onNext }: IntroSceneProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleProceed = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onNext();
    }, 850);
  };

  return (
    <div className="relative w-screen min-h-[100dvh] overflow-hidden flex flex-col items-center justify-center bg-[#110107]">
      {/* Pink Matrix background canvas */}
      <PinkMatrixCanvas />

      {/* Content wrapper with spring entrance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
        className="relative z-10 flex flex-col items-center gap-6 max-w-4xl px-4 py-8"
      >
        <CountdownTimer />

        <div className="mt-2">
          <ProceedButton onProceed={handleProceed} />
        </div>
      </motion.div>

      {/* Cinematic light-flash / particle dissolve transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-50 pointer-events-none bg-gradient-to-t from-pink-500 via-rose-300 to-white flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 3, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-96 h-96 rounded-full bg-white blur-3xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

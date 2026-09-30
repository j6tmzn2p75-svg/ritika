'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundManager } from '@/lib/audioEngine';

interface AudioControlProps {
  customTrackUrl?: string;
}

export default function AudioControl({ customTrackUrl }: AudioControlProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const toggleSound = () => {
    if (!hasStarted) {
      soundManager.startBGM(customTrackUrl);
      setHasStarted(true);
      setIsMuted(false);
    } else {
      const muted = soundManager.toggleMute();
      setIsMuted(muted);
    }
  };

  useEffect(() => {
    // Start audio on first user click anywhere if not yet started
    const handleFirstInteraction = () => {
      if (!hasStarted) {
        soundManager.startBGM(customTrackUrl);
        setHasStarted(true);
      }
      window.removeEventListener('click', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
    };
  }, [hasStarted, customTrackUrl]);

  return (
    <div className="fixed top-3.5 sm:top-6 right-3.5 sm:right-6 z-50 flex items-center gap-2">
      <button
        id="audio-toggle-button"
        onClick={toggleSound}
        className="glass-panel px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-full flex items-center gap-2 text-[10px] sm:text-xs tracking-wider uppercase text-pink-200 hover:text-white hover:border-pink-400 transition-all duration-300 shadow-lg group hover:scale-105"
        title={isMuted ? 'Unmute fairytale music' : 'Mute music'}
      >
        <div className="relative flex items-center justify-center">
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400" />
          ) : (
            <div className="flex items-end gap-[2px] h-3 sm:h-3.5 w-3 sm:w-3.5">
              <span className="w-[2px] bg-pink-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-full" />
              <span className="w-[2px] bg-pink-300 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.2s] h-2/3" />
              <span className="w-[2px] bg-pink-500 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.4s] h-4/5" />
            </div>
          )}
        </div>
        <span className="font-medium font-serif-display tracking-widest text-[10px] sm:text-[11px]">
          {isMuted ? 'Muted' : 'Enchanted BGM'}
        </span>
        <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-pink-400 group-hover:rotate-45 transition-transform" />
      </button>
    </div>
  );
}

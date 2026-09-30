'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LenisProvider from '@/components/cinematic/LenisProvider';
import HeroIntroScene from '@/components/scenes/HeroIntroScene';
import FairytaleRomanceScene from '@/components/scenes/FairytaleRomanceScene';
import PasswordGatewayScene from '@/components/scenes/PasswordGatewayScene';
import BirthdayRevealScene from '@/components/scenes/BirthdayRevealScene';
import MemoryBoxScene from '@/components/scenes/MemoryBoxScene';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AudioControl from '@/components/common/AudioControl';
import FilmGrain from '@/components/common/FilmGrain';
import { AppConfig } from '@/types';

type SceneState = 'INTRO' | 'FAIRYTALE' | 'PASSWORD' | 'CAKE' | 'MEMORY_BOX';

const INITIAL_CONFIG: AppConfig = {
  recipientName: 'Ritika',
  normalPassword: '0210',
  adminShortcut: '7410',
  cakeHeading: 'HAPPY BIRTHDAY',
  cakeSubheading: 'RITIKA',
  romancePrompt: 'I have made something special for you! Wanna see?',
  letterHeading: 'Write something for Ritika',
  cameraPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
  cameraPhotoCaption: 'Radiant smile on an enchanted evening',
  videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-with-flying-fireflies-and-stars-41551-large.mp4',
  videoCaption: 'Our endless magical memories under the stars',
  giftPhotoUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1000&q=80',
  giftPhotoCaption: 'A treasured gift wrapped in eternal love',
  theme: {
    primaryColor: '#ff2e93',
    accentColor: '#ffb3d9',
    ambientGlow: '#800020',
  },
  musicEnabled: true,
  backgroundTrackUrl: '',
};

export default function BirthdayApp() {
  const [currentScene, setCurrentScene] = useState<SceneState>('INTRO');
  const [config, setConfig] = useState<AppConfig>(INITIAL_CONFIG);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Fetch initial config from backend
  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.recipientName) {
          setConfig((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => console.log('Using default config:', err));
  }, []);

  // Global keyboard shortcut to open Admin Dashboard (Alt + A)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <LenisProvider>
      <main className="relative w-full max-w-full min-h-[100dvh] overflow-x-hidden bg-[#070004]">
        {/* Subtle Film Grain & Vignette */}
        <FilmGrain />

        {/* Global Floating Audio Controller */}
        <AudioControl customTrackUrl={config.backgroundTrackUrl} />

        {/* Central Master Scene Choreography */}
        <AnimatePresence mode="wait">
          {currentScene === 'INTRO' && (
            <motion.div
              key="scene-intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              <HeroIntroScene
                recipientName={config.recipientName}
                onProceed={() => setCurrentScene('FAIRYTALE')}
              />
            </motion.div>
          )}

          {currentScene === 'FAIRYTALE' && (
            <motion.div
              key="scene-fairytale"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              <FairytaleRomanceScene onYes={() => setCurrentScene('PASSWORD')} />
            </motion.div>
          )}

          {currentScene === 'PASSWORD' && (
            <motion.div
              key="scene-password"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              <PasswordGatewayScene
                validPassword={config.normalPassword}
                onSuccess={() => setCurrentScene('CAKE')}
                onAdmin={() => setIsAdminOpen(true)}
              />
            </motion.div>
          )}

          {currentScene === 'CAKE' && (
            <motion.div
              key="scene-cake"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              <BirthdayRevealScene
                cakeHeading={config.cakeHeading}
                cakeSubheading={config.cakeSubheading}
                cakeText={`Happy Birthday ${config.recipientName}`}
                onEnterMemoryBox={() => setCurrentScene('MEMORY_BOX')}
              />
            </motion.div>
          )}

          {currentScene === 'MEMORY_BOX' && (
            <motion.div
              key="scene-memory-box"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="w-full min-h-[100dvh]"
            >
              <MemoryBoxScene config={config} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden Admin Command Center Modal */}
        <AdminDashboard
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          config={config}
          onConfigUpdated={(newConfig) => setConfig(newConfig)}
        />
      </main>
    </LenisProvider>
  );
}

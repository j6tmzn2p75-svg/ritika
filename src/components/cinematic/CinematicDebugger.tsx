'use client';

import React, { useState, useEffect } from 'react';
import { Sliders, Activity, Eye, EyeOff, Zap } from 'lucide-react';
import { DeviceProfile, detectDeviceProfile } from '@/lib/adaptiveQuality';

interface CinematicDebuggerProps {
  currentScene: string;
  progress: number;
  onScrub?: (newProgress: number) => void;
  onSceneChange?: (sceneName: string) => void;
  availableScenes: string[];
}

export default function CinematicDebugger({
  currentScene,
  progress,
  onScrub,
  onSceneChange,
  availableScenes,
}: CinematicDebuggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fps, setFps] = useState(60);
  const [deviceProfile, setDeviceProfile] = useState<DeviceProfile | null>(null);

  // Measure actual live FPS
  useEffect(() => {
    setDeviceProfile(detectDeviceProfile());

    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const measureFps = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(measureFps);
    };

    animId = requestAnimationFrame(measureFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="fixed bottom-3 sm:bottom-6 left-3 sm:left-6 z-50 select-none">
      {/* Discreet Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-[10px] sm:text-[11px] font-mono text-pink-300 hover:text-white flex items-center gap-1.5 sm:gap-2 shadow-lg transition-all cursor-pointer"
        title="Cinematic Timeline & Performance Debugger"
      >
        <Sliders className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink-400" />
        <span>{fps} FPS</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      </button>

      {/* Expanded Panel */}
      {isOpen && (
        <div className="mt-2 w-80 p-4 rounded-2xl bg-black/85 backdrop-blur-2xl border border-white/20 shadow-2xl text-xs font-mono text-slate-200">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
            <div className="flex items-center gap-1.5 text-pink-300 font-bold text-[11px] uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-pink-400" />
              <span>Cinematic Director HUD</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-pink-900/60 text-pink-200">
              {deviceProfile?.tier || 'HIGH'} MODE
            </span>
          </div>

          {/* Metrics List */}
          <div className="space-y-2 mb-3 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Current Scene:</span>
              <span className="text-white font-semibold">{currentScene}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Timeline Progress:</span>
              <span className="text-pink-300">{(progress * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Rendering Engine:</span>
              <span className="text-emerald-400">Hybrid (Video+GSAP+Canvas)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Frame Stability:</span>
              <span className={fps >= 55 ? 'text-emerald-400' : 'text-amber-400'}>
                {fps} FPS ({fps >= 55 ? 'Butter 60' : 'Optimizing'})
              </span>
            </div>
          </div>

          {/* Manual Scrubbing Slider */}
          <div className="mb-3">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>Scrub Timeline</span>
              <span>{(progress * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.005"
              value={progress}
              onChange={(e) => onScrub && onScrub(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          {/* Scene Jump Buttons */}
          <div>
            <span className="block text-[10px] text-slate-400 mb-1.5">Direct Scene Jump:</span>
            <div className="grid grid-cols-2 gap-1.5">
              {availableScenes.map((scene) => (
                <button
                  key={scene}
                  onClick={() => onSceneChange && onSceneChange(scene)}
                  className={`px-2 py-1 rounded text-[10px] transition-colors ${
                    currentScene === scene
                      ? 'bg-pink-600 text-white font-semibold'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {scene}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

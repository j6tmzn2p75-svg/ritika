'use client';

import React from 'react';

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number; // e.g. -0.2 (slower) to 0.4 (faster)
  offsetY?: number;
  className?: string;
  depth?: 'foreground' | 'midground' | 'background';
}

export default function ParallaxLayer({
  children,
  speed = 0,
  offsetY = 0,
  className = '',
  depth = 'midground',
}: ParallaxLayerProps) {
  const zIndex = depth === 'foreground' ? 'z-30' : depth === 'midground' ? 'z-20' : 'z-10';

  return (
    <div
      className={`absolute inset-0 pointer-events-none will-change-transform ${zIndex} ${className}`}
      style={{
        transform: `translate3d(0, ${offsetY * speed}px, 0)`,
      }}
    >
      {children}
    </div>
  );
}

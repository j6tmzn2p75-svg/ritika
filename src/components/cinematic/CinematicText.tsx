'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CinematicTextProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export default function CinematicText({
  children,
  delay = 0,
  className = '',
  as = 'h2',
}: CinematicTextProps) {
  const Component = motion[as];

  return (
    <div className="overflow-hidden">
      <Component
        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
        transition={{
          duration: 1.1,
          delay,
          ease: [0.16, 1, 0.3, 1], // Apple-style cinematic ease out
        }}
        className={className}
      >
        {children}
      </Component>
    </div>
  );
}

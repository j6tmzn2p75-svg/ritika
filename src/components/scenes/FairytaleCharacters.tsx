'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function FairytaleCharacters() {
  return (
    <div className="relative w-full max-w-lg h-72 sm:h-96 flex items-center justify-center select-none">
      {/* Background ambient halo around the couple */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-t from-pink-500/20 via-amber-400/20 to-transparent blur-3xl animate-pulse-glow" />

      {/* Stylized SVG Character Composition */}
      <svg
        viewBox="0 0 500 400"
        className="w-full h-full filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
      >
        <defs>
          <linearGradient id="princeTunic" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#312e81" />
          </linearGradient>
          <linearGradient id="princessDress" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#be185d" />
            <stop offset="50%" stopColor="#db2777" />
            <stop offset="100%" stopColor="#9d174d" />
          </linearGradient>
          <linearGradient id="goldTrim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffd166" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <radialGradient id="lanternRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffbeb" stopOpacity="1" />
            <stop offset="40%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* --- PRINCE (Left side) --- */}
        <g className="animate-float" style={{ animationDelay: '0s' }}>
          {/* Prince Cape */}
          <path
            d="M 175 160 Q 140 220 135 340 L 195 340 Q 185 240 190 170 Z"
            fill="#4a0417"
            opacity="0.9"
          />

          {/* Prince Body & Tunic */}
          <path
            d="M 180 160 L 230 160 L 240 280 L 170 280 Z"
            fill="url(#princeTunic)"
          />

          {/* Gold Sash & Belt */}
          <path d="M 185 160 L 225 240 L 235 240 L 195 160 Z" fill="url(#goldTrim)" />
          <rect x="170" y="240" width="70" height="12" rx="4" fill="url(#goldTrim)" />

          {/* Prince Legs */}
          <rect x="175" y="280" width="28" height="90" rx="6" fill="#18181b" />
          <rect x="207" y="280" width="28" height="90" rx="6" fill="#09090b" />

          {/* Prince Neck & Head */}
          <rect x="195" y="140" width="20" height="22" rx="4" fill="#fcd34d" opacity="0.8" />
          <ellipse cx="205" cy="125" rx="20" ry="24" fill="#fed7aa" />

          {/* Prince Hair (Wavy brown enchanted royal cut) */}
          <path
            d="M 182 120 Q 190 95 215 96 Q 230 98 228 115 Q 220 108 205 106 Q 192 108 185 125 Z"
            fill="#451a03"
          />
          <path
            d="M 182 118 Q 178 135 186 142 Q 188 128 185 120 Z"
            fill="#381302"
          />

          {/* Prince Face Silhouette profile looking right towards Princess */}
          <ellipse cx="212" cy="123" rx="2.5" ry="2.5" fill="#451a03" />
          <path d="M 218 125 L 223 129 L 217 131" stroke="#f97316" strokeWidth="1.5" fill="none" />
          {/* Gentle Smile */}
          <path d="M 212 136 Q 218 140 222 136" stroke="#c2410c" strokeWidth="1.8" fill="none" />

          {/* Prince Arm extending to hold the lantern */}
          <path
            d="M 225 170 Q 248 190 260 215"
            stroke="#1e1b4b"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="260" cy="215" r="7" fill="#fed7aa" />
        </g>

        {/* --- PRINCESS (Right side) --- */}
        <g className="animate-float" style={{ animationDelay: '0.6s' }}>
          {/* Princess Flowing Long Golden-Brown Hair (Inspired by fairytale locks) */}
          <path
            d="M 295 108 Q 320 90 335 110 Q 355 130 350 200 Q 345 280 370 360 Q 330 350 320 280 Q 315 220 310 140 Z"
            fill="#d97706"
            opacity="0.95"
          />
          <path
            d="M 292 105 Q 310 92 325 105 Q 318 135 320 180 Q 308 140 300 115 Z"
            fill="#f59e0b"
          />

          {/* Princess Royal Gown (Pink & Magenta fairytale dress) */}
          <path
            d="M 270 170 Q 285 240 250 370 L 350 370 Q 315 240 310 170 Z"
            fill="url(#princessDress)"
          />

          {/* Gown Corset with Gold Details */}
          <path d="M 275 168 L 305 168 L 300 230 L 280 230 Z" fill="#9d174d" />
          <path d="M 285 175 L 295 185 L 285 195 L 295 205 L 285 215" stroke="url(#goldTrim)" strokeWidth="2.5" fill="none" />

          {/* Princess Neck & Face (Looking left toward Prince) */}
          <rect x="280" y="142" width="16" height="20" rx="4" fill="#fcd34d" opacity="0.8" />
          <ellipse cx="286" cy="125" rx="18" ry="22" fill="#ffedd5" />

          {/* Princess Tiara / Floral Crown */}
          <path
            d="M 278 105 L 283 95 L 288 103 L 293 93 L 298 105 Z"
            fill="url(#goldTrim)"
            stroke="#f59e0b"
            strokeWidth="1"
          />
          <circle cx="288" cy="101" r="2.5" fill="#f43f5e" />

          {/* Princess Face Profile */}
          <ellipse cx="278" cy="124" rx="2.5" ry="3" fill="#362208" />
          {/* Long Eyelash */}
          <path d="M 276 122 Q 273 120 271 123" stroke="#362208" strokeWidth="1.2" fill="none" />
          <path d="M 272 126 L 268 129 L 273 131" stroke="#fb923c" strokeWidth="1.2" fill="none" />
          {/* Rose Lips Smile */}
          <path d="M 272 135 Q 276 139 280 136" stroke="#e11d48" strokeWidth="2" fill="none" />

          {/* Princess Arm extending to hold the lantern */}
          <path
            d="M 280 175 Q 266 195 255 215"
            stroke="#be185d"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="255" cy="215" r="6" fill="#ffedd5" />
        </g>

        {/* --- SHARED FLOATING LANTERN BETWEEN THEIR HANDS --- */}
        <g className="animate-float" style={{ animationDelay: '0.3s' }}>
          {/* Massive warm radiance */}
          <circle cx="257" cy="212" r="50" fill="url(#lanternRadial)" />

          {/* Lantern Body */}
          <rect x="246" y="196" width="22" height="32" rx="4" fill="#fef08a" stroke="#d97706" strokeWidth="1.5" />
          {/* Inner candle flame */}
          <ellipse cx="257" cy="212" rx="4" ry="7" fill="#ea580c" />
          <ellipse cx="257" cy="211" rx="2" ry="4" fill="#ffffff" />

          {/* Wooden rims */}
          <rect x="244" y="194" width="26" height="3" rx="1" fill="#78350f" />
          <rect x="244" y="227" width="26" height="3" rx="1" fill="#78350f" />

          {/* Sparkles rising from lantern */}
          <circle cx="252" cy="184" r="2" fill="#fff" opacity="0.9" />
          <circle cx="264" cy="178" r="1.5" fill="#fef08a" opacity="0.8" />
          <circle cx="256" cy="168" r="2.5" fill="#fcd34d" opacity="0.85" />
        </g>
      </svg>
    </div>
  );
}

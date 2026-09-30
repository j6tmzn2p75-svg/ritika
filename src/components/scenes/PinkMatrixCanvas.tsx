'use client';

import React, { useEffect, useRef } from 'react';

interface PinkMatrixCanvasProps {
  opacity?: number;
}

export default function PinkMatrixCanvas({ opacity = 0.85 }: PinkMatrixCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let lastFrameTime = 0;
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Fairytale & romantic symbols: runic glyphs, hearts, sparkles, stars
    const chars = '♡♥✦✧*｡❀✿❦❧0124KARTIKASPARKLE';
    const fontSize = width < 640 ? 13 : 15;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = Array.from({ length: columns }, () => Math.floor(Math.random() * -60));

    // Floating heart and stardust particles
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      type: 'heart' | 'sparkle' | 'orb';
    }

    const particles: Particle[] = Array.from({ length: width < 640 ? 15 : 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 4,
      speedY: -(Math.random() * 0.7 + 0.3),
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.7 + 0.3,
      type: Math.random() > 0.5 ? 'heart' : Math.random() > 0.3 ? 'sparkle' : 'orb',
    }));

    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
      c.save();
      c.translate(x, y);
      c.scale(size / 15, size / 15);
      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(-5, -7, -12, 0, 0, 10);
      c.bezierCurveTo(12, 0, 5, -7, 0, 0);
      c.fillStyle = `rgba(255, 46, 147, ${alpha})`;
      c.shadowColor = '#ff2e93';
      c.shadowBlur = 10;
      c.fill();
      c.restore();
    };

    const render = (timestamp: number) => {
      // Semi-transparent deep burgundy trail for soft trailing persistence
      ctx.fillStyle = 'rgba(7, 1, 5, 0.18)';
      ctx.fillRect(0, 0, width, height);

      // Ambient radial glow from center
      const gradient = ctx.createRadialGradient(
        width / 2,
        height * 0.4,
        20,
        width / 2,
        height * 0.5,
        width * 0.7
      );
      gradient.addColorStop(0, 'rgba(255, 46, 147, 0.08)');
      gradient.addColorStop(0.6, 'rgba(110, 23, 55, 0.04)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw Matrix Falling Streams
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Leading char is bright white-pink with glow
        ctx.shadowColor = '#ff2e93';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#fff0f6';
        ctx.fillText(char, x, y);

        // Previous stream char
        ctx.shadowBlur = 6;
        ctx.fillStyle = 'rgba(255, 46, 147, 0.65)';
        ctx.fillText(char, x, y - fontSize);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      // Draw floating hearts & sparkles
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < -20) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        if (p.type === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.opacity);
        } else if (p.type === 'sparkle') {
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 209, 102, ${p.opacity})`;
          ctx.shadowColor = '#ffd166';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.restore();
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 179, 217, ${p.opacity * 0.5})`;
          ctx.shadowColor = '#ff2e93';
          ctx.shadowBlur = 15;
          ctx.fill();
          ctx.restore();
        }
      });

      animationFrameId = requestAnimationFrame(renderThrottled);
    };

    const renderThrottled = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(renderThrottled);
      const delta = timestamp - lastFrameTime;
      if (delta < FRAME_INTERVAL) return;
      lastFrameTime = timestamp - (delta % FRAME_INTERVAL);
      render(timestamp);
    };

    animationFrameId = requestAnimationFrame(renderThrottled);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ opacity }}
      className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1000 z-0"
    />
  );
}


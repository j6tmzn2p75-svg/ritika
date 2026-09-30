'use client';

import React, { useEffect, useRef } from 'react';

export default function TangledSunsetCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Lanterns rising smoothly (Tangled style)
    interface Lantern {
      x: number;
      y: number;
      width: number;
      height: number;
      speedY: number;
      swayOffset: number;
      swaySpeed: number;
      brightness: number;
      pulseSpeed: number;
      pulseOffset: number;
    }

    const lanterns: Lantern[] = Array.from({ length: 38 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 1.2,
      width: Math.random() * 18 + 14,
      height: Math.random() * 26 + 20,
      speedY: Math.random() * 0.45 + 0.25,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.01,
      brightness: Math.random() * 0.4 + 0.6,
      pulseSpeed: Math.random() * 0.04 + 0.02,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    // Fireflies hovering over meadow
    interface Firefly {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      pulse: number;
    }

    const fireflies: Firefly[] = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: height * 0.6 + Math.random() * (height * 0.4),
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
      alpha: Math.random(),
      pulse: Math.random() * 0.05 + 0.02,
    }));

    let time = 0;

    const render = () => {
      time += 0.016;

      // 1. Sky Gradient: Deep night purple into glowing fairytale sunset magenta & peach
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#100115'); // Night indigo/violet
      skyGrad.addColorStop(0.3, '#31032b'); // Deep enchanted plum
      skyGrad.addColorStop(0.65, '#781347'); // Radiant magenta
      skyGrad.addColorStop(0.85, '#d4496b'); // Warm coral pink
      skyGrad.addColorStop(1, '#ffc085'); // Golden twilight glow
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Warm Sun / Moon behind castle
      const moonX = width * 0.5;
      const moonY = height * 0.58;
      const moonGrad = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, 180);
      moonGrad.addColorStop(0, 'rgba(255, 240, 200, 0.9)');
      moonGrad.addColorStop(0.3, 'rgba(255, 180, 160, 0.5)');
      moonGrad.addColorStop(0.7, 'rgba(255, 120, 150, 0.15)');
      moonGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = moonGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Fairytale Castle Silhouette in the distance
      const castleCenterX = width * 0.5;
      const castleBaseY = height * 0.68;
      ctx.fillStyle = '#1c011a';

      // Castle Central Keep & Spires
      ctx.beginPath();
      // Main central tower
      ctx.rect(castleCenterX - 25, castleBaseY - 140, 50, 140);
      // Spire cone
      ctx.moveTo(castleCenterX - 30, castleBaseY - 140);
      ctx.lineTo(castleCenterX, castleBaseY - 210);
      ctx.lineTo(castleCenterX + 30, castleBaseY - 140);

      // Left Tower
      ctx.rect(castleCenterX - 75, castleBaseY - 100, 35, 100);
      ctx.moveTo(castleCenterX - 80, castleBaseY - 100);
      ctx.lineTo(castleCenterX - 57, castleBaseY - 155);
      ctx.lineTo(castleCenterX - 35, castleBaseY - 100);

      // Right Tower
      ctx.rect(castleCenterX + 40, castleBaseY - 100, 35, 100);
      ctx.moveTo(castleCenterX + 35, castleBaseY - 100);
      ctx.lineTo(castleCenterX + 57, castleBaseY - 155);
      ctx.lineTo(castleCenterX + 80, castleBaseY - 100);

      // Outer ramparts
      ctx.rect(castleCenterX - 110, castleBaseY - 60, 220, 60);
      ctx.fill();

      // Glowing castle window slits
      ctx.fillStyle = '#ffecb3';
      ctx.shadowColor = '#ffd166';
      ctx.shadowBlur = 10;
      ctx.fillRect(castleCenterX - 4, castleBaseY - 110, 8, 16);
      ctx.fillRect(castleCenterX - 62, castleBaseY - 80, 7, 14);
      ctx.fillRect(castleCenterX + 54, castleBaseY - 80, 7, 14);
      ctx.shadowBlur = 0;

      // 4. Rolling Mountain / Floral Hills
      const hillGrad = ctx.createLinearGradient(0, castleBaseY, 0, height);
      hillGrad.addColorStop(0, '#1c011a');
      hillGrad.addColorStop(1, '#0e000d');
      ctx.fillStyle = hillGrad;

      ctx.beginPath();
      ctx.moveTo(0, height * 0.72);
      ctx.bezierCurveTo(width * 0.25, height * 0.65, width * 0.4, height * 0.74, width, height * 0.68);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fill();

      // Foreground lush hill
      ctx.fillStyle = '#0b000a';
      ctx.beginPath();
      ctx.moveTo(0, height * 0.85);
      ctx.bezierCurveTo(width * 0.35, height * 0.8, width * 0.7, height * 0.88, width, height * 0.82);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fill();

      // 5. Draw Tangled Floating Lanterns
      lanterns.forEach((l) => {
        l.y -= l.speedY;
        if (l.y < -50) {
          l.y = height + 40;
          l.x = Math.random() * width;
        }

        const sway = Math.sin(time * 1.5 + l.swayOffset) * 6;
        const currentX = l.x + sway;
        const pulse = Math.sin(time * 3 + l.pulseOffset) * 0.15 + l.brightness;

        // Draw lantern warm glow
        ctx.save();
        const lanternGlow = ctx.createRadialGradient(
          currentX + l.width / 2,
          l.y + l.height / 2,
          2,
          currentX + l.width / 2,
          l.y + l.height / 2,
          l.width * 1.8
        );
        lanternGlow.addColorStop(0, `rgba(255, 235, 170, ${pulse * 0.85})`);
        lanternGlow.addColorStop(0.4, `rgba(255, 140, 80, ${pulse * 0.45})`);
        lanternGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = lanternGlow;
        ctx.beginPath();
        ctx.arc(currentX + l.width / 2, l.y + l.height / 2, l.width * 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Lantern cylindrical body
        ctx.shadowColor = '#ffb347';
        ctx.shadowBlur = 12;
        ctx.fillStyle = `rgba(255, 220, 140, ${pulse})`;

        // Rounded cylinder
        ctx.beginPath();
        const rad = 4;
        ctx.roundRect(currentX, l.y, l.width, l.height, [rad, rad, rad, rad]);
        ctx.fill();

        // Intricate sun royal crest silhouette on lantern
        ctx.fillStyle = 'rgba(180, 80, 20, 0.45)';
        ctx.beginPath();
        ctx.arc(currentX + l.width / 2, l.y + l.height * 0.48, l.width * 0.22, 0, Math.PI * 2);
        ctx.fill();

        // Top and bottom dark wooden rim
        ctx.fillStyle = 'rgba(70, 20, 10, 0.7)';
        ctx.fillRect(currentX + 1, l.y - 1, l.width - 2, 2.5);
        ctx.fillRect(currentX + 1, l.y + l.height - 1.5, l.width - 2, 2.5);

        ctx.restore();
      });

      // 6. Draw Fireflies
      fireflies.forEach((f) => {
        f.x += f.vx;
        f.y += f.vy;
        if (f.x < 0 || f.x > width) f.vx *= -1;
        if (f.y < height * 0.55 || f.y > height) f.vy *= -1;

        f.alpha += f.pulse;
        if (f.alpha > 1 || f.alpha < 0.2) f.pulse *= -1;

        ctx.save();
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 245, 160, ${f.alpha})`;
        ctx.shadowColor = '#ffe600';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

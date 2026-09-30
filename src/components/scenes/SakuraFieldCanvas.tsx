'use client';

import React, { useEffect, useRef } from 'react';

export default function SakuraFieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Falling Sakura Petals with 3D rotation & wind sway
    interface Petal {
      x: number;
      y: number;
      z: number;
      size: number;
      speedY: number;
      speedX: number;
      rotation: number;
      rotSpeed: number;
      flip: number;
      flipSpeed: number;
      color: string;
      alpha: number;
    }

    const colors = ['#ffd1e3', '#ffb6d3', '#ffa4c8', '#ff85b3', '#fff0f6'];
    const petals: Petal[] = Array.from({ length: 85 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height - height * 0.2,
      z: Math.random() * 2 + 0.5,
      size: Math.random() * 14 + 10,
      speedY: Math.random() * 1.5 + 0.8,
      speedX: Math.random() * 1.2 + 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      flip: Math.random() * Math.PI,
      flipSpeed: Math.random() * 0.03 + 0.015,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.4 + 0.6,
    }));

    let time = 0;

    const drawSakuraPetal = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      flip: number,
      color: string,
      alpha: number
    ) => {
      c.save();
      c.translate(x, y);
      c.rotate(rotation);
      c.scale(1, Math.cos(flip));

      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(-size * 0.5, -size * 0.7, -size * 0.3, -size * 1.3, 0, -size * 1.5);
      c.bezierCurveTo(size * 0.3, -size * 1.3, size * 0.5, -size * 0.7, 0, 0);

      c.fillStyle = color;
      c.globalAlpha = alpha;
      c.shadowColor = '#ff85b3';
      c.shadowBlur = 6;
      c.fill();

      // Delicate petal central vein
      c.beginPath();
      c.moveTo(0, -size * 0.2);
      c.lineTo(0, -size * 1.2);
      c.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      c.lineWidth = 1;
      c.stroke();

      c.restore();
    };

    const render = () => {
      time += 0.016;

      // Sunset sakura garden gradient
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#2c0419');
      grad.addColorStop(0.4, '#5c1236');
      grad.addColorStop(0.7, '#8e2354');
      grad.addColorStop(1, '#ffc2c2');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Atmospheric Pink Fog at bottom
      const fogGrad = ctx.createRadialGradient(
        width / 2,
        height * 0.9,
        50,
        width / 2,
        height * 0.9,
        width * 0.8
      );
      fogGrad.addColorStop(0, 'rgba(255, 182, 193, 0.35)');
      fogGrad.addColorStop(0.7, 'rgba(255, 105, 180, 0.15)');
      fogGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, 0, width, height);

      // Distant Sakura Trees silhouettes
      ctx.fillStyle = '#230214';
      ctx.beginPath();
      // Tree 1 (Left)
      ctx.arc(width * 0.15, height * 0.65, 160, 0, Math.PI * 2);
      // Tree 2 (Right)
      ctx.arc(width * 0.85, height * 0.62, 180, 0, Math.PI * 2);
      // Center far tree
      ctx.arc(width * 0.5, height * 0.72, 120, 0, Math.PI * 2);
      ctx.fill();

      // Animate and draw petals
      const wind = Math.sin(time * 0.8) * 1.5;

      petals.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + wind;
        p.rotation += p.rotSpeed;
        p.flip += p.flipSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width - 100;
        }
        if (p.x > width + 50) {
          p.x = -50;
        }

        drawSakuraPetal(ctx, p.x, p.y, p.size, p.rotation, p.flip, p.color, p.alpha);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

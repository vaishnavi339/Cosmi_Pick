'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from './ThemeProvider';

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

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

    // Generate stars
    const starCount = Math.min(85, Math.floor((width * height) / 14000));
    const stars: {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      speed: number;
      color: string;
    }[] = [];

    const colors = ['#38BDF8', '#818CF8', '#C084FC', '#FFFFFF'];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.4 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.015 + 0.005,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Only render visible cosmic stars in dark mode, or very subtle in light mode
      const baseAlphaMultiplier = theme === 'dark' ? 1 : 0.25;

      for (const star of stars) {
        star.alpha += star.speed;
        if (star.alpha > 0.95 || star.alpha < 0.15) {
          star.speed = -star.speed;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, star.alpha * baseAlphaMultiplier));
        ctx.shadowBlur = 4;
        ctx.shadowColor = star.color;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 opacity-70 transition-opacity duration-700"
    />
  );
}

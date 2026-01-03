'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Project, PROJECTS } from '@/lib/projects';
import { generateWave, calculateAccuracy, hslToString } from '@/lib/waveGenerator';

interface OscillatorCanvasProps {
  frequency: number;
  phase: number;
  tuningProgress: Record<number, number>;
  lockedProject: Project | null;
  mousePos: { x: number; y: number };
  glitchIntensity: number;
  onGlitchDecay: () => void;
}

export default function OscillatorCanvas({
  frequency,
  phase,
  tuningProgress,
  lockedProject,
  mousePos,
  glitchIntensity,
  onGlitchDecay,
}: OscillatorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    timeRef.current += 0.016;
    const time = timeRef.current;
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    // Clear with subtle trail effect
    ctx.fillStyle = `rgba(8, 8, 12, ${lockedProject ? 1 : 0.15})`;
    ctx.fillRect(0, 0, w, h);

    // Draw interference grid when not locked
    if (!lockedProject) {
      ctx.strokeStyle = 'rgba(40, 40, 50, 0.3)';
      ctx.lineWidth = 0.5;
      const gridSize = 50;
      const maxProgress = Math.max(...Object.values(tuningProgress), 0);

      for (let x = 0; x < w; x += gridSize) {
        const offset = Math.sin(time * 0.5 + x * 0.01) * 5 * (1 - maxProgress);
        ctx.beginPath();
        ctx.moveTo(x + offset, 0);
        ctx.lineTo(x + offset, h);
        ctx.stroke();
      }

      for (let y = 0; y < h; y += gridSize) {
        const offset = Math.cos(time * 0.5 + y * 0.01) * 5 * (1 - maxProgress);
        ctx.beginPath();
        ctx.moveTo(0, y + offset);
        ctx.lineTo(w, y + offset);
        ctx.stroke();
      }
    }

    // Draw each project's waveform
    PROJECTS.forEach((project, idx) => {
      const accuracy = tuningProgress[project.id] || 0;
      const { color } = project;
      const baseY = h * (0.2 + idx * 0.15);

      const alpha = 0.1 + accuracy * 0.7;
      const glowAlpha = accuracy * 0.5;

      // Glow effect for tuned waves
      if (accuracy > 0.3) {
        ctx.shadowColor = hslToString(color, glowAlpha);
        ctx.shadowBlur = 20 * accuracy;
      }

      ctx.strokeStyle = hslToString(color, alpha);
      ctx.lineWidth = 1 + accuracy * 2;
      ctx.beginPath();

      for (let x = 0; x < w; x += 2) {
        const normalX = x / w;
        const waveY = generateWave(normalX * Math.PI * 4, project, time, accuracy);
        const amplitude = 30 + accuracy * 40;
        const y = baseY + waveY * amplitude;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw frequency indicator dots
      if (accuracy > 0.5) {
        const dotCount = Math.floor(accuracy * 8);
        for (let i = 0; i < dotCount; i++) {
          const dotX = w * (0.1 + i * 0.1);
          const waveY = generateWave((dotX / w) * Math.PI * 4, project, time, accuracy);
          const dotY = baseY + waveY * (30 + accuracy * 40);

          ctx.fillStyle = hslToString({ ...color, l: color.l + 20 }, accuracy);
          ctx.beginPath();
          ctx.arc(dotX, dotY, 3 * accuracy, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });

    // Glitch effect during lock-in
    if (glitchIntensity > 0) {
      const sliceCount = Math.floor(glitchIntensity * 20);
      for (let i = 0; i < sliceCount; i++) {
        const y = Math.random() * h;
        const sliceHeight = Math.random() * 10 + 5;
        const xOffset = (Math.random() - 0.5) * 50 * glitchIntensity;

        try {
          const imgData = ctx.getImageData(0, y, w, sliceHeight);
          ctx.putImageData(imgData, xOffset, y);
        } catch (e) {
          // Ignore cross-origin errors
        }
      }
      onGlitchDecay();
    }

    // Draw tuning crosshair
    if (!lockedProject) {
      const cursorX = mousePos.x * w;
      const cursorY = mousePos.y * h;

      ctx.strokeStyle = 'rgba(200, 200, 210, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 10]);

      ctx.beginPath();
      ctx.moveTo(cursorX, 0);
      ctx.lineTo(cursorX, h);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, cursorY);
      ctx.lineTo(w, cursorY);
      ctx.stroke();

      ctx.setLineDash([]);

      // Cursor glow
      const nearestAccuracy = Math.max(...Object.values(tuningProgress), 0);
      const glowSize = 20 + nearestAccuracy * 30;
      const gradient = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, glowSize);
      gradient.addColorStop(0, `rgba(200, 200, 210, ${0.1 + nearestAccuracy * 0.3})`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(cursorX - glowSize, cursorY - glowSize, glowSize * 2, glowSize * 2);
    }

    // Scanline effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    for (let y = 0; y < h; y += 3) {
      ctx.fillRect(0, y, w, 1);
    }

    animationRef.current = requestAnimationFrame(render);
  }, [tuningProgress, lockedProject, mousePos, glitchIntensity, onGlitchDecay]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);
    animationRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [render]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
}

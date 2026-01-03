'use client';

import { useState, useCallback, useEffect } from 'react';
import { PROJECTS, Project, TUNING_THRESHOLD, LOCK_DURATION } from '@/lib/projects';
import { calculateAccuracy, findNearestProject } from '@/lib/waveGenerator';
import OscillatorCanvas from '@/components/OscillatorCanvas';
import SignalBars from '@/components/SignalBars';
import FrequencyDisplay from '@/components/FrequencyDisplay';
import ProjectReveal from '@/components/ProjectReveal';
import TuningCursor from '@/components/TuningCursor';
import styles from './page.module.css';

export default function Home() {
  const [frequency, setFrequency] = useState(0.5);
  const [phase, setPhase] = useState(0.5);
  const [lockedProject, setLockedProject] = useState<Project | null>(null);
  const [tuningProgress, setTuningProgress] = useState<Record<number, number>>({});
  const [isLocking, setIsLocking] = useState(false);
  const [showProject, setShowProject] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [glitchIntensity, setGlitchIntensity] = useState(0);

  // Calculate tuning accuracy for each project
  const calculateTuning = useCallback(() => {
    const newProgress: Record<number, number> = {};

    PROJECTS.forEach((project) => {
      newProgress[project.id] = calculateAccuracy(frequency, phase, project);
    });

    setTuningProgress(newProgress);

    // Check for lock-in
    const nearest = findNearestProject(frequency, phase, PROJECTS);
    if (nearest && nearest.distance < TUNING_THRESHOLD && !isLocking && !lockedProject) {
      setIsLocking(true);
      setGlitchIntensity(0.8);

      setTimeout(() => {
        setLockedProject(nearest.project);
        setGlitchIntensity(0);
        setTimeout(() => setShowProject(true), 300);
      }, LOCK_DURATION);
    }
  }, [frequency, phase, isLocking, lockedProject]);

  useEffect(() => {
    calculateTuning();
  }, [calculateTuning]);

  // Mouse movement handler
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (lockedProject) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      setMousePos({ x, y });
      setFrequency(x);
      setPhase(y);
    },
    [lockedProject]
  );

  // Reset function
  const handleReset = () => {
    setLockedProject(null);
    setShowProject(false);
    setIsLocking(false);
    setGlitchIntensity(0);
  };

  // Glitch decay handler
  const handleGlitchDecay = useCallback(() => {
    setGlitchIntensity((prev) => prev * 0.95);
  }, []);

  const nearestAccuracy = Math.max(...Object.values(tuningProgress), 0);

  return (
    <div
      className={styles.container}
      style={{ cursor: lockedProject ? 'default' : 'none' }}
      onMouseMove={handleMouseMove}
    >
      <OscillatorCanvas
        frequency={frequency}
        phase={phase}
        tuningProgress={tuningProgress}
        lockedProject={lockedProject}
        mousePos={mousePos}
        glitchIntensity={glitchIntensity}
        onGlitchDecay={handleGlitchDecay}
      />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.version}>SIGNAL_INTERFACE v2.4</div>
        <div className={styles.status}>
          {lockedProject ? 'SIGNAL LOCKED' : 'SCANNING FREQUENCIES'}
        </div>
      </div>

      {/* Frequency indicators */}
      {!lockedProject && <FrequencyDisplay frequency={frequency} phase={phase} />}

      {/* Signal strength bars */}
      {!lockedProject && <SignalBars tuningProgress={tuningProgress} />}

      {/* Locking overlay */}
      {isLocking && !lockedProject && (
        <div className={styles.lockingOverlay}>
          <div className={styles.lockingText}>LOCKING SIGNAL...</div>
        </div>
      )}

      {/* Locked project display */}
      {lockedProject && showProject && (
        <ProjectReveal project={lockedProject} onReset={handleReset} />
      )}

      {/* Center guidance */}
      {!lockedProject && (
        <div className={styles.centerGuide}>
          <div
            className={styles.guideText}
            style={{ opacity: 0.2 + nearestAccuracy * 0.3 }}
          >
            {nearestAccuracy < 0.3 && 'MOVE TO TUNE'}
            {nearestAccuracy >= 0.3 && nearestAccuracy < 0.7 && 'SIGNAL DETECTED'}
            {nearestAccuracy >= 0.7 && nearestAccuracy < 0.94 && 'APPROACHING RESONANCE'}
          </div>
        </div>
      )}

      {/* Custom cursor */}
      {!lockedProject && <TuningCursor mousePos={mousePos} accuracy={nearestAccuracy} />}

      {/* Corner decorations */}
      <div className={`${styles.corner} ${styles.topLeft}`} />
      <div className={`${styles.corner} ${styles.topRight}`} />
      <div className={`${styles.corner} ${styles.bottomLeft}`} />
      <div className={`${styles.corner} ${styles.bottomRight}`} />
    </div>
  );
}

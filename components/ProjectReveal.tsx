'use client';

import { Project } from '@/lib/projects';
import { hslToString } from '@/lib/waveGenerator';
import styles from './ProjectReveal.module.css';

interface ProjectRevealProps {
  project: Project;
  onReset: () => void;
}

export default function ProjectReveal({ project, onReset }: ProjectRevealProps) {
  const { color } = project;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div
          className={styles.indicator}
          style={{
            background: hslToString(color, 1),
            boxShadow: `0 0 20px ${hslToString(color, 0.5)}`,
          }}
        />

        <div
          className={styles.meta}
          style={{
            color: hslToString({ ...color, s: color.s - 20, l: color.l + 20 }, 0.6),
          }}
        >
          PROJECT {String(project.id + 1).padStart(2, '0')} / {project.waveType.toUpperCase()} WAVE
        </div>

        <h1
          className={styles.title}
          style={{
            textShadow: `0 0 40px ${hslToString(color, 0.3)}`,
          }}
        >
          {project.title}
        </h1>

        <p className={styles.description}>{project.description}</p>

        <p className={styles.longDescription}>{project.longDescription}</p>

        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={styles.tag}
              style={{
                borderColor: hslToString(color, 0.3),
                color: hslToString(color, 0.7),
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className={styles.specs}>
          <div className={styles.spec}>
            FREQ: {(project.targetFreq * 100).toFixed(1)} Hz
          </div>
          <div className={styles.specDot} />
          <div className={styles.spec}>
            PHASE: {(project.targetPhase * 360).toFixed(0)}°
          </div>
          <div className={styles.specDot} />
          <div className={styles.spec}>{project.year}</div>
        </div>

        <button
          onClick={onReset}
          className={styles.resetButton}
          style={
            {
              '--hover-color': hslToString(color, 0.6),
            } as React.CSSProperties
          }
        >
          SCAN ANOTHER SIGNAL
        </button>
      </div>
    </div>
  );
}

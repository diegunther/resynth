'use client';

import { PROJECTS } from '@/lib/projects';
import { hslToString } from '@/lib/waveGenerator';
import styles from './SignalBars.module.css';

interface SignalBarsProps {
  tuningProgress: Record<number, number>;
}

export default function SignalBars({ tuningProgress }: SignalBarsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.bars}>
        {PROJECTS.map((project, idx) => {
          const accuracy = tuningProgress[project.id] || 0;
          const { color } = project;

          return (
            <div key={project.id} className={styles.barWrapper}>
              <div
                className={styles.label}
                style={{
                  color: hslToString(color, 0.4 + accuracy * 0.6),
                }}
              >
                CH_{String(idx + 1).padStart(2, '0')}
              </div>
              <div className={styles.track}>
                <div
                  className={styles.fill}
                  style={{
                    width: `${accuracy * 100}%`,
                    background: `linear-gradient(90deg, 
                      ${hslToString(color, 0.6)}, 
                      ${hslToString({ ...color, l: color.l + 15 }, 0.9)})`,
                    boxShadow:
                      accuracy > 0.7
                        ? `0 0 10px ${hslToString(color, 0.5)}`
                        : 'none',
                  }}
                />
              </div>
              {accuracy > 0.8 && (
                <div
                  className={styles.resonance}
                  style={{
                    color: hslToString(color, 0.8),
                  }}
                >
                  RESONANCE DETECTED
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

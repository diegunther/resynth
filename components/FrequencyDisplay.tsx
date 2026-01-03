'use client';

import styles from './FrequencyDisplay.module.css';

interface FrequencyDisplayProps {
  frequency: number;
  phase: number;
}

export default function FrequencyDisplay({ frequency, phase }: FrequencyDisplayProps) {
  return (
    <div className={styles.container}>
      <div className={styles.label}>FREQUENCY</div>
      <div className={styles.value}>{(frequency * 100).toFixed(1)} Hz</div>
      <div className={styles.label} style={{ marginTop: 12 }}>
        PHASE
      </div>
      <div className={styles.value}>{(phase * 360).toFixed(0)}°</div>
    </div>
  );
}

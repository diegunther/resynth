'use client';

import styles from './TuningCursor.module.css';

interface TuningCursorProps {
  mousePos: { x: number; y: number };
  accuracy: number;
}

export default function TuningCursor({ mousePos, accuracy }: TuningCursorProps) {
  return (
    <div
      className={styles.cursor}
      style={{
        left: mousePos.x * (typeof window !== 'undefined' ? window.innerWidth : 0) - 12,
        top: mousePos.y * (typeof window !== 'undefined' ? window.innerHeight : 0) - 12,
        borderColor: `rgba(180, 180, 200, ${0.3 + accuracy * 0.4})`,
        boxShadow:
          accuracy > 0.7
            ? `0 0 15px rgba(180, 180, 200, ${accuracy * 0.3})`
            : 'none',
      }}
    >
      <div
        className={styles.dot}
        style={{
          background: `rgba(200, 200, 220, ${0.5 + accuracy * 0.5})`,
        }}
      />
    </div>
  );
}

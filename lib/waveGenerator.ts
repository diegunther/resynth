import { Project } from './projects';

// Pre-computed noise array for consistent organic movement
const noiseArray = Array(100).fill(0).map(() => Math.random());

/**
 * Generate waveform value at a given x position
 * Each project has a unique wave signature based on:
 * - Base waveform type (sine, triangle, pulse, complex, noise)
 * - Harmonic series (defines overtone structure)
 * - Accuracy (controls noise/distortion level)
 */
export function generateWave(
  x: number,
  project: Project,
  time: number,
  accuracy: number
): number {
  const { waveType, harmonics, targetFreq } = project;
  let y = 0;
  const freqBase = targetFreq * 20;

  harmonics.forEach((amp, i) => {
    const freq = freqBase * (i + 1);
    const phaseOffset = time * (1 + i * 0.3);

    switch (waveType) {
      case 'sine':
        // Pure sine wave - clean, fundamental
        y += amp * Math.sin(x * freq + phaseOffset);
        break;

      case 'triangle':
        // Triangle wave - softer harmonics
        y += amp * (2 * Math.abs(2 * ((x * freq + phaseOffset) / (2 * Math.PI) % 1) - 1) - 1);
        break;

      case 'pulse':
        // Pulse/square wave - harsh, digital
        y += amp * (Math.sin(x * freq + phaseOffset) > 0.3 ? 1 : -1);
        break;

      case 'complex':
        // Complex wave - sine modulated by cosine
        y += amp * Math.sin(x * freq + phaseOffset) * Math.cos(x * freq * 0.5 + phaseOffset * 1.3);
        break;

      case 'noise':
        // Noise-modulated wave - organic, unpredictable
        const noiseIdx = Math.floor((x * freq + phaseOffset) * 10) % 100;
        y += amp * (noiseArray[Math.abs(noiseIdx)] * 2 - 1) * Math.sin(x * freq * 0.5 + phaseOffset);
        break;

      default:
        y += amp * Math.sin(x * freq + phaseOffset);
    }
  });

  // Add noise inversely proportional to tuning accuracy
  const noise = (1 - accuracy) * (Math.random() - 0.5) * 2;
  return y + noise;
}

/**
 * Calculate tuning accuracy for a given frequency/phase against a project
 * Returns value 0-1 where 1 = perfectly tuned
 */
export function calculateAccuracy(
  frequency: number,
  phase: number,
  project: Project
): number {
  const freqDiff = Math.abs(frequency - project.targetFreq);
  const phaseDiff = Math.abs(phase - project.targetPhase);
  const distance = Math.sqrt(freqDiff ** 2 + phaseDiff ** 2);
  return Math.max(0, 1 - distance / 0.3);
}

/**
 * Find the nearest project to current tuning
 */
export function findNearestProject(
  frequency: number,
  phase: number,
  projects: Project[]
): { project: Project; distance: number } | null {
  let nearest: { project: Project; distance: number } | null = null;

  projects.forEach((project) => {
    const freqDiff = Math.abs(frequency - project.targetFreq);
    const phaseDiff = Math.abs(phase - project.targetPhase);
    const distance = Math.sqrt(freqDiff ** 2 + phaseDiff ** 2);

    if (!nearest || distance < nearest.distance) {
      nearest = { project, distance };
    }
  });

  return nearest;
}

/**
 * HSL color to CSS string
 */
export function hslToString(
  color: { h: number; s: number; l: number },
  alpha: number = 1
): string {
  return `hsla(${color.h}, ${color.s}%, ${color.l}%, ${alpha})`;
}

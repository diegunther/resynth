export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  targetFreq: number;
  targetPhase: number;
  color: { h: number; s: number; l: number };
  waveType: 'sine' | 'triangle' | 'pulse' | 'complex' | 'noise';
  harmonics: number[];
  tags: string[];
  year: string;
}

export const PROJECTS: Project[] = [
  {
    id: 0,
    title: "MEMBRANE",
    description: "Haptic interface for digital archaeology",
    longDescription: "A multi-sensory installation exploring the tactile boundaries between physical artifacts and their digital reconstructions. Visitors interact through pressure-sensitive membranes that translate touch into data visualizations of archaeological sites.",
    targetFreq: 0.15,
    targetPhase: 0.3,
    color: { h: 180, s: 60, l: 50 },
    waveType: 'sine',
    harmonics: [1, 0.5, 0.25],
    tags: ['Installation', 'Haptics', 'Data Viz'],
    year: '2024'
  },
  {
    id: 1,
    title: "RESONANCE",
    description: "Sound sculpture installation — Berlin 2024",
    longDescription: "A network of resonating chambers distributed across an abandoned industrial space. Each chamber responds to ambient sound, creating feedback loops that evolve over hours, transforming noise pollution into emergent composition.",
    targetFreq: 0.28,
    targetPhase: 0.6,
    color: { h: 350, s: 70, l: 55 },
    waveType: 'complex',
    harmonics: [1, 0.8, 0.3, 0.6],
    tags: ['Sound Art', 'Installation', 'Generative'],
    year: '2024'
  },
  {
    id: 2,
    title: "LIMINAL",
    description: "Generative identity system for threshold spaces",
    longDescription: "A visual identity that refuses to be static. Designed for a transitional housing initiative, the system generates unique marks based on real-time data — occupancy, weather, time of day — ensuring the identity is never the same twice.",
    targetFreq: 0.42,
    targetPhase: 0.45,
    color: { h: 60, s: 50, l: 60 },
    waveType: 'triangle',
    harmonics: [1, 0.33, 0.2],
    tags: ['Branding', 'Generative', 'Systems'],
    year: '2023'
  },
  {
    id: 3,
    title: "SUBSTRATE",
    description: "Data visualization of underground networks",
    longDescription: "Mapping the invisible infrastructure beneath cities — water, gas, electricity, fiber, sewage — as an interconnected organism. The visualization pulses with real usage data, revealing the metabolism of urban life.",
    targetFreq: 0.65,
    targetPhase: 0.8,
    color: { h: 270, s: 55, l: 50 },
    waveType: 'pulse',
    harmonics: [1, 1, 0.5, 0.5, 0.25],
    tags: ['Data Viz', 'Urban', 'Infrastructure'],
    year: '2023'
  },
  {
    id: 4,
    title: "ECHO",
    description: "Temporal archive of disappearing sounds",
    longDescription: "A preservation project capturing sounds at risk of extinction — the last speakers of dying languages, machines being decommissioned, ecosystems under threat. Each recording exists as a waveform monument, playable but never downloadable.",
    targetFreq: 0.85,
    targetPhase: 0.15,
    color: { h: 140, s: 45, l: 45 },
    waveType: 'noise',
    harmonics: [1, 0.7, 0.5, 0.3, 0.2, 0.1],
    tags: ['Archive', 'Sound', 'Preservation'],
    year: '2022'
  }
];

export const TUNING_THRESHOLD = 0.06;
export const LOCK_DURATION = 1500;

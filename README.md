# SIGNAL_INTERFACE — Oscillator Portfolio

A portfolio landing page that behaves like an oscillator signal tuner. Each of the 5 projects is represented as a distinct frequency that must be "tuned into" to reveal its content.

![Signal Interface Preview](docs/preview.gif)

## Concept

The experience feels like searching for meaning inside noise — each project is a signal waiting to be found. The interface creates an uncanny, liminal atmosphere where visitors must actively engage to discover content.

## The Tuning Mechanic

### Mathematical Foundation

Each project has a unique "signal signature" defined by:

```typescript
{
  targetFreq: number,   // X-axis position (0-1)
  targetPhase: number,  // Y-axis position (0-1)
  waveType: string,     // Waveform shape
  harmonics: number[]   // Amplitude of overtones
}
```

**Tuning Accuracy** is calculated as:

```
accuracy = max(0, 1 - distance / 0.3)

where:
  freqDiff = |currentFreq - targetFreq|
  phaseDiff = |currentPhase - targetPhase|
  distance = √(freqDiff² + phaseDiff²)
```

When `distance < 0.06` (TUNING_THRESHOLD), a lock sequence initiates.

### Waveform Types

| Type | Character | Formula |
|------|-----------|---------|
| **sine** | Pure, clean | `sin(x * freq + time)` |
| **triangle** | Softer harmonics | `2|2((x*f+t)/2π % 1) - 1| - 1` |
| **pulse** | Harsh, digital | `sin(x*f+t) > 0.3 ? 1 : -1` |
| **complex** | Modulated | `sin(x*f+t) * cos(x*f*0.5+t*1.3)` |
| **noise** | Organic chaos | Noise-table modulated sine |

## The 5 Projects

| # | Title | Freq | Phase | Wave | Color |
|---|-------|------|-------|------|-------|
| 1 | MEMBRANE | 15% | 30% | Sine | Cyan |
| 2 | RESONANCE | 28% | 60% | Complex | Rose |
| 3 | LIMINAL | 42% | 45% | Triangle | Gold |
| 4 | SUBSTRATE | 65% | 80% | Pulse | Purple |
| 5 | ECHO | 85% | 15% | Noise | Green |

## Project Structure

```
oscillator-portfolio/
├── app/
│   ├── layout.tsx        # Root layout with fonts
│   ├── page.tsx          # Main orchestration component
│   ├── page.module.css   # Page-specific styles
│   └── globals.css       # Global styles
├── components/
│   ├── OscillatorCanvas.tsx   # Canvas rendering engine
│   ├── SignalBars.tsx         # Signal strength indicators
│   ├── FrequencyDisplay.tsx   # Current frequency readout
│   ├── ProjectReveal.tsx      # Locked project display
│   └── TuningCursor.tsx       # Custom cursor
├── lib/
│   ├── projects.ts       # Project data & constants
│   └── waveGenerator.ts  # Wave math utilities
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Pages deployment
├── next.config.js        # Static export config
└── package.json
```

## Visual Design

### Aesthetic Direction
- **Dark void base** (#08080c) — feels like tuning into the void
- **Subtle glow accents** — signals emerge from darkness
- **Scanline overlay** — CRT monitor nostalgia
- **Trailing motion blur** — canvas doesn't fully clear
- **Corner brackets** — technical/scientific framing

### Animation States
1. **Scanning** — All waves visible but noisy/distorted
2. **Detecting** — Nearest wave gains clarity, others fade
3. **Approaching** — Wave locks into focus, glow intensifies
4. **Locking** — Glitch effect, horizontal noise
5. **Locked** — Calm reveal, project fades in

## Interaction Flow

```
[Mouse moves] → [Frequency/Phase updates] → [Calculate accuracy for all projects]
                                                    ↓
                                          [Nearest project detected]
                                                    ↓
                                          [Distance < threshold?]
                                           ↓               ↓
                                          NO             YES
                                           ↓               ↓
                                    [Continue      [Initiate lock]
                                     scanning]           ↓
                                                  [Glitch effect]
                                                        ↓
                                                 [Reveal project]
                                                        ↓
                                                [Show reset button]
```

## GitHub Pages Deployment

### Automatic (Recommended)

1. Push to GitHub
2. Go to Settings → Pages
3. Set Source to "GitHub Actions"
4. The included workflow will build and deploy on every push to `main`

### Manual

```bash
# Build static export
npm run build

# Output will be in ./out directory
# Upload contents to any static host
```

### Custom Domain

If using a custom domain, update `next.config.js`:

```javascript
const nextConfig = {
  output: 'export',
  // Remove or update basePath for custom domain
  images: { unoptimized: true },
};
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Performance Notes

- Canvas runs at ~60fps via requestAnimationFrame
- Trail effect (partial alpha clear) creates motion blur cheaply
- Noise array is pre-computed to avoid GC pressure
- Device pixel ratio respected for crisp rendering on HiDPI displays

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Canvas 2D required. WebGL not used (intentionally simple renderer).

## Customization

### Adding Projects

Edit `lib/projects.ts`:

```typescript
{
  id: 5,
  title: "YOUR_PROJECT",
  description: "Short tagline",
  longDescription: "Full description...",
  targetFreq: 0.5,  // Position on X axis (0-1)
  targetPhase: 0.5, // Position on Y axis (0-1)
  color: { h: 200, s: 60, l: 50 }, // HSL values
  waveType: 'sine', // sine | triangle | pulse | complex | noise
  harmonics: [1, 0.5, 0.25], // Overtone amplitudes
  tags: ['Tag1', 'Tag2'],
  year: '2025'
}
```

### Adjusting Difficulty

In `lib/projects.ts`:

```typescript
export const TUNING_THRESHOLD = 0.06; // Lower = harder to lock
export const LOCK_DURATION = 1500;    // ms before lock completes
```

---

*Searching for signals in the noise.*

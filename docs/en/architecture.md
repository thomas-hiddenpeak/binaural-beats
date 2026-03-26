# Technical Architecture

[中文版](../zh/architecture.md)

## Tech Stack

- **Pure frontend** — zero dependencies, zero backend, ES Module architecture
- Web Audio API (OscillatorNode / AudioWorklet / ChannelMerger)
- SSB modulation runs on the AudioWorklet audio rendering thread (ScriptProcessorNode auto-fallback)
- Web Worker offline preprocessing: hand-written radix-2 Cooley-Tukey FFT + overlap-save chunked Hilbert transform
- Independent stereo processing preserves original stereo imaging (toggle available)
- Loop crossfade eliminates seam clicks
- Canvas real-time beat envelope visualization
- Drag & drop audio file upload
- Left-right alternating balance mode (pure/drone: 5-min timed swap; music: loop-boundary swap)
- Chinese/English bilingual i18n
- PWA support — installable, works offline
- Mobile responsive layout + touch optimization

## Project Structure

```
├── index.html                  # Pure structure, no inline scripts/styles
├── css/style.css               # All styles (incl. mobile responsive)
├── manifest.json               # PWA manifest
├── sw.js                       # Service Worker offline cache
├── icons/                      # PWA icons
├── docs/
│   ├── en/                     # English documentation
│   └── zh/                     # Chinese documentation
├── js/
│   ├── app.js                  # App entry, module assembly, i18n integration
│   ├── audio-engine.js         # Audio engine Facade
│   ├── modes/
│   │   ├── base-mode.js        # Abstract base class (Template Method)
│   │   ├── pure-tone.js        # Pure tone mode (with alternating timer)
│   │   ├── music-ssb.js        # Music SSB shift mode (with stereo toggle)
│   │   └── drone.js            # Drone mode (with alternating timer)
│   ├── ui/
│   │   ├── visualizer.js       # Canvas waveform visualization
│   │   ├── info-panel.js       # Frequency band info panel
│   │   ├── file-handler.js     # File upload / drag & drop
│   │   └── controls.js         # Control binding & parameter reading
│   ├── utils/
│   │   └── freq-distribution.js # Frequency distribution strategy (Strategy Pattern)
│   ├── i18n/
│   │   ├── i18n.js             # i18n manager
│   │   ├── zh.js               # Chinese language pack
│   │   └── en.js               # English language pack
│   └── workers/
│       ├── hilbert-worker.js   # FFT/Hilbert Web Worker
│       └── ssb-worklet.js      # SSB AudioWorklet Processor
└── README.md
```

## Design Patterns

| Pattern | Application |
|---------|-------------|
| **Strategy** | Frequency distribution strategies (symmetric / left-only / right-only / alternating) — independently extensible |
| **Template Method** | `BaseMode` defines start/stop/update lifecycle; subclasses implement specific audio graphs |
| **Facade** | `AudioEngine` unifies AudioContext management, mode switching, parameter passing |

## Key Implementation Details

### SSB (Single-Sideband) Frequency Shifting

Given a signal $x(t)$, obtain the analytic signal via Hilbert transform $x_a(t) = x(t) + j\hat{x}(t)$, then:

$$y(t) = \text{Re}\left[x_a(t) \cdot e^{j2\pi \Delta f \cdot t}\right] = x(t)\cos(2\pi \Delta f \cdot t) - \hat{x}(t)\sin(2\pi \Delta f \cdot t)$$

This achieves precise linear frequency shifting of $\Delta f$ across the entire spectrum, with no lower sideband leakage.

### Symmetric Distribution

In symmetric mode, the shift is split equally between ears:

$$y_L(t) = \text{Re}\left[x_a(t) \cdot e^{-j\pi \Delta f \cdot t}\right], \quad y_R(t) = \text{Re}\left[x_a(t) \cdot e^{+j\pi \Delta f \cdot t}\right]$$

$$f_{R} - f_{L} = \Delta f \quad \text{(beat frequency preserved)}$$

Each ear's actual frequency shift is halved, significantly reducing timbral distortion while maintaining the same binaural beat.

### Left-Right Alternating Mode

To reduce ear fatigue during extended sessions, the frequency shift direction is periodically swapped:

- **Pure tone / Drone:** Every 5 minutes, a 2.5-second `linearRampToValueAtTime` crossfade swaps frequencies. The ~0.2s brief weakening of the beat is nearly imperceptible.
- **Music mode:** Swap occurs at the loop crossfade boundary, fully masked by the existing 2048-sample crossfade envelope.

### Hilbert Transform: Overlap-Save Processing

- A 5-minute 44.1kHz song has ~13M samples; a single-shot FFT would require 2²⁴ = 16M points and ~128MB memory.
- Solution: overlap-save chunked processing — 32768-point FFT per chunk, 4096-point overlap guard bands, stitching only the "trusted" middle segments.
- All computation runs in a Web Worker to avoid blocking the main thread.

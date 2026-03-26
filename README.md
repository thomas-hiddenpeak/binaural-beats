# 🎧 Binaural Beats Explorer

An open-source, interactive binaural beats experience tool. Pure frontend, zero dependencies, runs directly in the browser.

**👉 [Live Demo](https://thomas-hiddenpeak.github.io/binaural-beats/)** · [中文说明](docs/zh/science.md)

> **Headphones required.** Binaural beats rely on delivering different frequencies to each ear — speakers won't work.

---

## What Is This

Binaural beats are an auditory phenomenon: when each ear receives a pure tone at a slightly different frequency (e.g., 395 Hz left, 405 Hz right), the brain perceives a rhythmic pulsation at the difference frequency (10 Hz in this case). This beat **does not exist in the physical sound wave** — it is a neural product of the brainstem's Superior Olivary Complex encoding interaural phase differences.

This tool lets you experience and explore this phenomenon firsthand.

## Features

### Three Audio Modes

| Mode | Technique | Highlights |
|------|-----------|------------|
| 🎵 **Pure Tone** | Classic binaural beats | Clearest beat perception, ideal for first-time experience |
| 🎶 **Music SSB** | FFT-based SSB frequency shift | Upload any audio; uniform beat frequency across the full spectrum |
| 🕉 **Drone** | Multi-harmonic linear shift | Tambura / Singing Bowl / Organ / Synth Pad |

### Four Frequency Distribution Strategies

| Strategy | Description | Recommended For |
|----------|-------------|-----------------|
| ⚖️ Symmetric | Each ear shifts ±½ beat freq | **Default** — most balanced perception |
| ↔️ Alternating | Symmetric + periodic auto-swap | **Extended listening** — reduces single-ear fatigue |
| ➡️ Right Only | Left original, right +Δf | Single-side comparison |
| ⬅️ Left Only | Left −Δf, right original | Single-side comparison |

### Additional Features

- Real-time beat envelope visualization (Canvas)
- Stereo preservation toggle for music mode
- Loop crossfade for seamless audio looping
- Drag-and-drop audio file upload (MP3 / WAV / FLAC)
- Chinese / English bilingual UI (i18n)
- PWA — installable, works offline
- Mobile responsive layout with touch optimization

## Quick Start

1. Open the [Live Demo](https://thomas-hiddenpeak.github.io/binaural-beats/) (Chrome / Edge / Safari recommended)
2. **Put on headphones**
3. Choose a mode and press Start
4. Adjust beat frequency, distribution strategy, and other parameters
5. In Music mode, upload your own audio file

## Tech Stack

Pure frontend, zero backend, ES Modules architecture:

- **Web Audio API** — OscillatorNode, AudioWorklet, ChannelMerger
- **AudioWorklet** — SSB modulation on the audio rendering thread (ScriptProcessorNode auto-fallback)
- **Web Worker** — Offline preprocessing with hand-written radix-2 Cooley-Tukey FFT + overlap-save Hilbert transform
- **Canvas** — Real-time visualization
- **PWA** — Service Worker cache-first offline strategy

## Project Structure

```
├── index.html                  # Pure markup, no inline scripts/styles
├── css/style.css               # All styles (incl. mobile responsive)
├── manifest.json               # PWA manifest
├── sw.js                       # Service Worker offline cache
├── icons/                      # PWA icons
├── js/
│   ├── app.js                  # Entry point, module assembly, i18n
│   ├── audio-engine.js         # Audio engine Facade
│   ├── modes/
│   │   ├── base-mode.js        # Abstract base class (Template Method)
│   │   ├── pure-tone.js        # Pure tone mode
│   │   ├── music-ssb.js        # Music SSB mode
│   │   └── drone.js            # Drone mode
│   ├── ui/
│   │   ├── visualizer.js       # Canvas waveform visualization
│   │   ├── info-panel.js       # Frequency band info panel
│   │   ├── file-handler.js     # File upload / drag-drop
│   │   └── controls.js         # Control bindings & parameter reading
│   ├── utils/
│   │   └── freq-distribution.js # Frequency distribution (Strategy Pattern)
│   ├── i18n/
│   │   ├── i18n.js             # i18n manager
│   │   ├── zh.js               # Chinese language pack
│   │   └── en.js               # English language pack
│   └── workers/
│       ├── hilbert-worker.js   # FFT/Hilbert Web Worker
│       └── ssb-worklet.js      # SSB AudioWorklet Processor
├── docs/
│   ├── en/                     # English documentation
│   └── zh/                     # 中文文档
└── README.md
```

## 📖 Documentation

Detailed documentation is available in both English and Chinese:

| Topic | English | 中文 |
|-------|---------|------|
| Science Background & Honest Clarification | [Science](docs/en/science.md) | [科学背景](docs/zh/science.md) |
| Technical Architecture & Design Patterns | [Architecture](docs/en/architecture.md) | [技术架构](docs/zh/architecture.md) |
| Engineering Journey (8-Step Evolution) | [Engineering Journey](docs/en/engineering-journey.md) | [工程探索历程](docs/zh/engineering-journey.md) |

## License

MIT

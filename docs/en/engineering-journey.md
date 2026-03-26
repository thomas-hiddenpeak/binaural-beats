# Engineering Journey

[中文版](../zh/engineering-journey.md)

The evolution of this project is itself worth documenting — each step started from "something doesn't sound right" and traced back to fundamental signal processing issues.

## Step 1: Pure Tone Binaural Beats

The most basic implementation: a sine wave for each ear with the frequency difference as the beat frequency. Web Audio API's `OscillatorNode` supports this directly in a few lines of code. No technical difficulty here, but it establishes the core experience — you can clearly "hear" a pulsation that doesn't physically exist.

## Step 2: Music Mode — Why You Can't Simply "Shift the Pitch"

The pure tone experience is limited, naturally leading to: can we use our favorite music to produce binaural beats?

**Naive idea:** Speed up the right ear's audio slightly? — No. Changing speed simultaneously alters duration and all frequency relationships. And Pitch Shifting (changing pitch without changing speed) operates non-linearly in the frequency domain — it preserves frequency *ratios* (multiplication), but binaural beats require *linear* frequency shifting (addition). A 200 Hz and a 2000 Hz component both need +10 Hz each, becoming 210 Hz and 2010 Hz, not proportional scaling.

**Correct approach:** SSB (Single-Sideband) modulation — a classic communications engineering technique.

Transform signal $x(t)$ via Hilbert transform to obtain the analytic signal $x_a(t) = x(t) + j\hat{x}(t)$, then:

$$y(t) = \text{Re}\left[x_a(t) \cdot e^{j2\pi \Delta f \cdot t}\right] = x(t)\cos(2\pi \Delta f \cdot t) - \hat{x}(t)\sin(2\pi \Delta f \cdot t)$$

This achieves precise linear shifting of $\Delta f$ across the entire spectrum, with no lower sideband leakage.

## Step 3: Engineering the Hilbert Transform

The theory is straightforward but the implementation has pitfalls:

- **Can't do a single FFT on the full audio:** A 5-minute 44.1kHz song has ~13M samples; `nextPow2` yields $2^{24}$ = 16M points, two Float32Arrays consume 128MB — long audio causes OOM.
- **Solution:** Overlap-save chunked processing. 32768-point FFT per chunk, 4096-point overlap guard bands on each side, stitching only the "trusted" middle segments. This is the standard DSP textbook approach for long-sequence convolution, but boundary alignment requires care when implementing from scratch.
- **UI can't freeze:** FFT is CPU-intensive and the browser main thread is single-threaded. Using `async/await` + `setTimeout(0)` to yield control every few chunks keeps the progress bar updating and UI responsive.

## Step 4: Single-Ear Perception & Symmetric Distribution

After implementation, actual listening revealed: at high beat frequencies (e.g., 30 Hz), the right ear's timbral change is noticeably perceptible — because every frequency component in the entire song has been shifted up by 30 Hz, destroying harmonic relationships and making the timbre "off."

This isn't a bug — it's an inherent property of SSB frequency shifting. But concentrating the entire beat frequency on one ear makes the distortion focused and obvious.

**Solution:** Introduce frequency distribution strategies — in symmetric mode, the left ear shifts $-\Delta f/2$ and the right ear shifts $+\Delta f/2$. Each ear's actual shift is halved, dramatically reducing timbral distortion while keeping the binaural beat intact:

$$y_L(t) = \text{Re}\left[x_a(t) \cdot e^{-j\pi \Delta f \cdot t}\right], \quad y_R(t) = \text{Re}\left[x_a(t) \cdot e^{+j\pi \Delta f \cdot t}\right]$$

$$f_{R} - f_{L} = \Delta f \quad \text{(beat frequency conserved)}$$

## Step 5: Drone Mode — Binaural Beats with Harmonic Structure

Pure tones are too monotonous; music shifting has timbral distortion — can we construct a class of natural, comfortable sounds for extended listening?

The answer is additive synthesis to build multi-harmonic drones, with each harmonic component independently frequency-shifted. Tambura, singing bowl, and other instruments each have distinctive harmonic structures, providing different sonic textures for the beat experience. The singing bowl's non-harmonic overtone ratios (2.71, 4.8, 7.2) create interesting compound rhythms in the pulsation.

## Reflection

The pattern throughout: **propose idea → implement → listen → discover problems → trace back to signal processing theory → find a better approach.** Each "something feels off" has a precise physical/mathematical explanation — more convincing than any textbook.

## Step 6: Architecture Optimization — Moving Computation to the Right Thread

Steps 1–5 achieved functionality but left engineering quality concerns:

- **Hilbert preprocessing blocks the main thread:** Despite `async/await` + `setTimeout(0)`, intensive FFT computation still executes on the main thread, causing UI jank for long audio.
- **ScriptProcessorNode is deprecated:** It runs SSB modulation logic in main-thread audio callbacks, potentially causing audio glitches under high load.
- **Mono downmix loses spatial information:** Original stereo music was mixed to mono before Hilbert transform, losing the stereo field.
- **Loop playback has seam clicks:** Jumping directly back to the start at the end creates waveform discontinuities.

The solution was a coordinated set of optimizations:

1. **Web Worker preprocessing:** All FFT and Hilbert transform computation moved into a Web Worker. `postMessage` + Transferable arrays enable zero-copy communication. The main thread is completely unblocked during preprocessing.

2. **AudioWorklet real-time processing:** SSB modulation migrated from main-thread ScriptProcessorNode to AudioWorklet. SSB computation runs on the dedicated audio rendering thread, no longer competing with UI for CPU time. ScriptProcessorNode retained as automatic fallback.

3. **Stereo preservation:** Hilbert transform computed independently for each channel. During SSB modulation, the left ear outputs the left channel and the right ear outputs the right channel (each with different shift amounts). Memory doubles, but original stereo imaging is preserved.

4. **Loop crossfade:** At 2048 samples (~46ms) before the end, linear cross-fading with the beginning eliminates waveform discontinuity at loop boundaries. The loop reset point jumps to `cfLen` to avoid repeating content that has already faded in.

5. **Drag & drop upload:** Added `dragover`/`dragleave`/`drop` event handling to the file selection area.

## Step 7: Modular Refactoring — From Single File to Maintainable Architecture

The result of steps 1–6 was a fully functional single HTML file (~1050 lines), with all CSS, HTML, and JS inlined. Worker and Worklet code were embedded as strings and dynamically created via Blob URLs. While convenient for single-file deployment, maintainability deteriorated rapidly as features grew.

Refactoring approach:

1. **HTML/CSS/JS separation:** `index.html` retains only pure structural markup — no inline `<style>` or `<script>`. CSS extracted to `css/style.css`. JS loaded via `<script type="module">` ES Module entry point.

2. **Design pattern-guided decomposition:**
   - **Strategy:** Frequency distribution strategies (`freq-distribution.js`) encapsulate symmetric/left-only/right-only as replaceable strategy objects. Adding a new distribution only requires adding a strategy.
   - **Template Method:** `BaseMode` defines audio mode lifecycle (start → update → stop); three modes each implement their own audio graph construction, independent of each other.
   - **Facade:** `AudioEngine` provides a unified `start()`/`stop()`/`update()` interface for the UI layer, hiding AudioContext management, mode switching, and Worker/Worklet coordination.

3. **Independent Worker/Worklet files:** No longer created from strings via Blob URLs — referenced as standalone `.js` files. Debug-friendly (DevTools can set breakpoints directly), and paves the way for Service Worker caching.

4. **UI modularization:** Visualization, info panel, file handling, control binding each independent, assembled through `app.js`. Each UI module only handles its own DOM interaction without directly manipulating audio.

## Step 8: Experience Enhancement — Alternating Balance, Stereo Toggle, i18n & PWA

The modular architecture makes adding new features clean and straightforward.

1. **Left-right alternating balance mode:** During extended listening, one ear continuously receiving frequency-shifted audio causes auditory fatigue. The solution is to periodically swap the shift direction between ears. But you can't simply flip instantly — phase discontinuity would produce clicks. The implementation strategy varies by mode:
   - **Pure tone / Drone:** Every 5 minutes, `linearRampToValueAtTime` performs a 2.5-second frequency crossfade swap. The ~0.2s brief weakening of the beat is nearly imperceptible.
   - **Music mode:** Swap at the loop boundary (loop crossfade point). The existing 2048-sample crossfade mask completely hides the frequency flip. Both AudioWorklet and ScriptProcessorNode fallback paths toggle a `swapped` flag when `pos` resets.

2. **Stereo preservation toggle:** Music mode gains a new switch — when preserving stereo, Hilbert transform and SSB modulation are applied independently to left and right channels (doubling memory and computation but preserving imaging); when off, channels are downmixed to mono, reducing resource usage.

3. **i18n internationalization:** A lightweight approach — `zh.js` and `en.js` under `js/i18n/` each export a key-value object, `i18n.js` manages the current language and provides a `t(key)` function. Language preference is stored in `localStorage`. UI switching uses `data-i18n` attributes for batch static text updates; dynamic text (channel info, status panels) uses `t()` calls in their respective modules.

4. **PWA support:** `manifest.json` defines app metadata; `sw.js` implements a cache-first offline strategy for all static assets. Users can "install" the app to their desktop or phone home screen, and it works offline (audio files need to be loaded in advance).

5. **Mobile responsive:** CSS media queries at ≤480px and ≤360px breakpoints adjust layout — preset buttons from 3 columns to 2, channel info stacks vertically, slider touch targets enlarged to 24px. `@media (hover: none)` optimizes tap target sizes for touch devices (≥44px).

export default {
  // Header
  title: 'Binaural Beat Explorer Pro',
  subtitle: 'Binaural Beat Explorer — Pure Tone · Music SSB · Drone',
  warning: '⚠️ <strong>Headphones required!</strong> Each ear must receive a different frequency. Speakers won\'t work. Start at low volume.',

  // Tabs
  tabPure: '🎵 Pure Tone',
  tabMusic: '🎶 Music SSB',
  tabDrone: '🕉 Drone',

  // Play
  playStart: '▶ Put on headphones, tap to start',
  playStop: '■ Stop',

  // Pure panel
  carrier: 'Carrier Frequency',

  // Music panel
  fileArea: '📁 Click or drag & drop audio file (MP3 / WAV / OGG / FLAC)',
  loop: 'Loop',
  stereo: 'Preserve Stereo',
  decoding: 'Decoding...',
  preProcess: 'Processing',
  ready: 'Ready',
  decodeFail: 'Decode failed',
  preProcessFail: 'Processing failed',

  // Drone panel
  droneTypeLabel: 'Drone Type',
  droneFreqLabel: 'Base Frequency',
  tambura: '🪕 Tambura — Rich harmonics',
  bowl: '🔔 Singing Bowl — Inharmonic overtones',
  organ: '⛪ Organ — Solemn harmony',
  pad: '🎹 Synth Pad — Warm & thick',

  // Shared controls
  beatLabel: 'Beat Frequency (binaural beat)',
  distLabel: 'Frequency Distribution',
  volumeLabel: 'Volume',
  distSymmetric: '⚖️ Symmetric — ±½ beat per ear (recommended)',
  distRight: '➡️ Right ear only — Left original, Right +beat',
  distLeft: '⬅️ Left ear only — Left -beat, Right original',
  distAlternating: '↔️ Alternating — Symmetric + periodic swap (for long sessions)',

  // Channel info
  leftEar: 'L',
  rightEar: 'R',
  freqShift: 'shift',
  original: 'original',

  // Presets
  presetDelta: 'Delta · Deep',
  presetTheta: 'Theta · Meditate',
  presetAlpha: 'Alpha · Relax',
  presetBeta: 'Beta · Focus',
  presetLimit: 'Limit · Rough',
  presetCollapse: 'Beyond · Compare',

  // Info panel
  bandDelta: 'Delta (δ) 1–4 Hz',
  bandTheta: 'Theta (θ) 4–8 Hz',
  bandAlpha: 'Alpha (α) 8–13 Hz',
  bandBeta: 'Beta (β) 13–30 Hz',
  bandCollapse: 'Collapse Zone 30–40 Hz',
  bandOver: 'Out of Range >40 Hz',
  descDelta: 'Slow pulsation, like breathing rhythm.',
  descTheta: 'Clear rhythmic pulsation, meditation range.',
  descAlpha: 'Steady and distinct pulsation, relaxation range.',
  descBeta: 'Rapid pulsation → flutter → roughness.',
  descCollapse: 'Brainstem phase-locking limit, beat starts to collapse.',
  descOver: 'Binaural beat disappears, two separate tones heard.',
  currentBeat: 'Current beat',
  modeMusic: '📌 Music mode: SSB linear frequency shift',
  modeDrone: '📌 Drone mode: All harmonics shifted linearly',
  modePure: '📌 Pure tone mode: Classic binaural beat',
  distLabelSymmetric: 'Symmetric',
  distLabelLeft: 'Left ear only',
  distLabelRight: 'Right ear only',
  distLabelAlternating: 'Alternating',

  // Visualizer
  vizWaiting: 'Waveform appears after start',
  vizPure: 'Pure',
  vizMusic: 'Music',
  vizDrone: 'Drone',
  vizEnvelope: 'Beat Envelope',

  // Errors
  needFile: 'Please select an audio file and wait for processing to complete',
  audioFail: 'Failed to start audio',
};

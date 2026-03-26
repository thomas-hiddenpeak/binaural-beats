/**
 * Visualizer — 波形可视化模块
 */
import { t } from '../i18n/i18n.js';

export class Visualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx2d = this.canvas.getContext('2d');
    this.animId = null;
    this.startTime = 0;
  }

  start(getParams, modeName) {
    this._resize();
    this.startTime = performance.now();

    const draw = () => {
      const beat = getParams().beat;
      const t = (performance.now() - this.startTime) / 1000;
      const w = this.canvas.width, h = this.canvas.height;
      const ctx = this.ctx2d;
      ctx.clearRect(0, 0, w, h);

      const periods = 4 / Math.max(beat, 0.5);

      // Beat envelope
      ctx.beginPath();
      const color = modeName === 'music' ? 'rgba(78,223,138,0.6)'
        : modeName === 'drone' ? 'rgba(176,122,255,0.6)' : 'rgba(126,184,255,0.6)';
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      for (let x = 0; x < w; x++) {
        const tx = t + (x / w) * periods;
        const env = Math.cos(2 * Math.PI * beat * tx);
        const y = h / 2 - env * h * 0.35;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Fill
      ctx.lineTo(w, h / 2); ctx.lineTo(0, h / 2); ctx.closePath();
      const fillColor = modeName === 'music' ? 'rgba(78,223,138,0.06)'
        : modeName === 'drone' ? 'rgba(176,122,255,0.06)' : 'rgba(126,184,255,0.06)';
      ctx.fillStyle = fillColor;
      ctx.fill();

      // Negative
      ctx.beginPath();
      ctx.strokeStyle = color.replace('0.6', '0.25');
      ctx.lineWidth = 2;
      for (let x = 0; x < w; x++) {
        const tx = t + (x / w) * periods;
        const env = -Math.cos(2 * Math.PI * beat * tx);
        const y = h / 2 - env * h * 0.35;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Center line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Label
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.font = '18px sans-serif';
      const modeLabel = modeName === 'music' ? t('vizMusic') : modeName === 'drone' ? t('vizDrone') : t('vizPure');
      ctx.fillText(modeLabel + ' · ' + t('vizEnvelope') + ' ' + beat + ' Hz', 10, 24);

      this.animId = requestAnimationFrame(draw);
    };
    draw();
  }

  stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    this.clear();
  }

  clear() {
    this._resize();
    const ctx = this.ctx2d;
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.font = '18px sans-serif';
    ctx.fillText(t('vizWaiting'), 10, this.canvas.height / 2 + 5);
  }

  _resize() {
    this.canvas.width = this.canvas.offsetWidth * 2;
    this.canvas.height = this.canvas.offsetHeight * 2;
  }
}

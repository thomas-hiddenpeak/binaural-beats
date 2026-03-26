import { BaseMode } from './base-mode.js';
import { getPureFreqs, isAlternating } from '../utils/freq-distribution.js';
import { t } from '../i18n/i18n.js';

const SWAP_INTERVAL = 5 * 60 * 1000;  // 5 minutes
const SWAP_FADE_SEC = 2.5;            // 2.5 second crossfade

export class PureToneMode extends BaseMode {
  constructor() {
    super('pure');
    this.oscL = null;
    this.oscR = null;
    this.gainL = null;
    this.gainR = null;
    this.swapped = false;
    this._swapTimer = null;
  }

  async _doStart(ctx, params) {
    const { carrier, beat, dist, volume } = params;
    const vol = volume / 100;
    this.swapped = false;
    const freqs = getPureFreqs(carrier, beat, dist, this.swapped);

    const merger = ctx.createChannelMerger(2);
    this.gainL = ctx.createGain();
    this.gainR = ctx.createGain();
    this.gainL.gain.setValueAtTime(vol, ctx.currentTime);
    this.gainR.gain.setValueAtTime(vol, ctx.currentTime);

    this.oscL = ctx.createOscillator();
    this.oscR = ctx.createOscillator();
    this.oscL.type = 'sine';
    this.oscR.type = 'sine';
    this.oscL.frequency.setValueAtTime(freqs.left, ctx.currentTime);
    this.oscR.frequency.setValueAtTime(freqs.right, ctx.currentTime);

    this.oscL.connect(this.gainL); this.gainL.connect(merger, 0, 0);
    this.oscR.connect(this.gainR); this.gainR.connect(merger, 0, 1);
    merger.connect(ctx.destination);

    this.oscL.start();
    this.oscR.start();

    this.nodes.push(this.oscL, this.oscR, this.gainL, this.gainR, merger);

    if (isAlternating(dist)) this._startSwapTimer(ctx, params);
  }

  _startSwapTimer(ctx, params) {
    this._clearSwapTimer();
    this._swapTimer = setInterval(() => {
      this.swapped = !this.swapped;
      const freqs = getPureFreqs(params.carrier, params.beat, params.dist, this.swapped);
      const now = ctx.currentTime;
      // Use linearRampToValueAtTime for smooth crossfade
      if (this.oscL) {
        this.oscL.frequency.linearRampToValueAtTime(freqs.left, now + SWAP_FADE_SEC);
      }
      if (this.oscR) {
        this.oscR.frequency.linearRampToValueAtTime(freqs.right, now + SWAP_FADE_SEC);
      }
    }, SWAP_INTERVAL);
  }

  _clearSwapTimer() {
    if (this._swapTimer) {
      clearInterval(this._swapTimer);
      this._swapTimer = null;
    }
  }

  _doUpdate(ctx, params) {
    const { carrier, beat, dist, volume } = params;
    const vol = volume / 100;
    const freqs = getPureFreqs(carrier, beat, dist, this.swapped);
    const now = ctx.currentTime;

    if (this.oscL) this.oscL.frequency.setValueAtTime(freqs.left, now);
    if (this.oscR) this.oscR.frequency.setValueAtTime(freqs.right, now);
    if (this.gainL) this.gainL.gain.setValueAtTime(vol, now);
    if (this.gainR) this.gainR.gain.setValueAtTime(vol, now);

    // Manage timer based on dist mode
    if (isAlternating(dist) && !this._swapTimer) {
      this._startSwapTimer(ctx, params);
    } else if (!isAlternating(dist) && this._swapTimer) {
      this._clearSwapTimer();
      this.swapped = false;
    }
  }

  _doStop() {
    this._clearSwapTimer();
    this.swapped = false;
    this.oscL = null;
    this.oscR = null;
    this.gainL = null;
    this.gainR = null;
  }

  getChannelInfo(params) {
    const freqs = getPureFreqs(params.carrier, params.beat, params.dist, this.swapped);
    const suffix = isAlternating(params.dist) ? ' ↔' : '';
    return {
      left: t('leftEar') + ': ' + freqs.left.toFixed(1) + ' Hz' + suffix,
      right: t('rightEar') + ': ' + freqs.right.toFixed(1) + ' Hz' + suffix
    };
  }
}

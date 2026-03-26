/**
 * Controls — 控件绑定与参数读取
 */
import { t } from '../i18n/i18n.js';

export class Controls {
  constructor() {
    this.els = {
      carrier: document.getElementById('carrier'),
      beat: document.getElementById('beat'),
      volume: document.getElementById('volume'),
      freqDist: document.getElementById('freqDist'),
      droneType: document.getElementById('droneType'),
      droneFreq: document.getElementById('droneFreq'),
      loopToggle: document.getElementById('loopToggle'),
      stereoToggle: document.getElementById('stereoToggle'),

      carrierVal: document.getElementById('carrierVal'),
      beatVal: document.getElementById('beatVal'),
      volVal: document.getElementById('volVal'),
      droneFreqVal: document.getElementById('droneFreqVal'),

      leftInfo: document.getElementById('leftInfo'),
      rightInfo: document.getElementById('rightInfo'),
      playBtn: document.getElementById('playBtn'),
    };
  }

  getParams(modeName) {
    const base = {
      beat: parseFloat(this.els.beat.value),
      volume: parseFloat(this.els.volume.value),
      dist: this.els.freqDist.value,
    };

    if (modeName === 'pure') {
      base.carrier = parseFloat(this.els.carrier.value);
    } else if (modeName === 'music') {
      base.loop = this.els.loopToggle.checked;
      base.stereoPreserve = this.els.stereoToggle.checked;
    } else if (modeName === 'drone') {
      base.droneType = this.els.droneType.value;
      base.droneFreq = parseFloat(this.els.droneFreq.value);
    }

    return base;
  }

  /** 更新显示值 */
  updateLabels(params, modeName) {
    this.els.beatVal.textContent = params.beat + ' Hz';
    this.els.volVal.textContent = Math.round(params.volume) + '%';

    if (modeName === 'pure') {
      this.els.carrierVal.textContent = params.carrier + ' Hz';
    } else if (modeName === 'drone') {
      this.els.droneFreqVal.textContent = params.droneFreq + ' Hz';
    }
  }

  updateChannelInfo(info) {
    this.els.leftInfo.textContent = info.left;
    this.els.rightInfo.textContent = info.right;
  }

  setPlaying(playing) {
    if (playing) {
      this.els.playBtn.textContent = t('playStop');
      this.els.playBtn.className = 'play-btn on';
    } else {
      this.els.playBtn.textContent = t('playStart');
      this.els.playBtn.className = 'play-btn off';
    }
  }

  setBeat(value) {
    this.els.beat.value = value;
  }

  /** 绑定所有 oninput/onchange 到统一回调 */
  bindAll(onUpdate, onDroneTypeChange, onTogglePlay, onSwitchMode) {
    // Range inputs
    ['carrier', 'beat', 'volume', 'droneFreq'].forEach(id => {
      this.els[id].addEventListener('input', onUpdate);
    });

    // Selects
    this.els.freqDist.addEventListener('change', onUpdate);
    this.els.droneType.addEventListener('change', onDroneTypeChange);

    // Play button
    this.els.playBtn.addEventListener('click', onTogglePlay);

    // Mode tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => onSwitchMode(btn.dataset.mode));
    });
  }
}

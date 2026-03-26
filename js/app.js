/**
 * App — 应用入口，连接所有模块
 */
import { AudioEngine } from './audio-engine.js';
import { DRONE_TYPES } from './modes/drone.js';
import { Visualizer } from './ui/visualizer.js';
import { InfoPanel } from './ui/info-panel.js';
import { FileHandler } from './ui/file-handler.js';
import { Controls } from './ui/controls.js';
import { t, getLang, setLang, onLangChange, getEdition, setEdition, isMarketing, onEditionChange } from './i18n/i18n.js';

class App {
  constructor() {
    this.engine = new AudioEngine();
    this.controls = new Controls();
    this.visualizer = new Visualizer('waveCanvas');
    this.infoPanel = new InfoPanel('infoPanel');

    this._initFileHandler();
    this._bindControls();
    this._initPresets();
    this._initLangSwitcher();
    this._initEditionSwitcher();
    this._initMarketingStats();

    // 初始状态
    this.applyEdition();
    this.applyI18n();
    this.updateParams();
    this.visualizer.clear();
  }

  _initFileHandler() {
    this.fileHandler = new FileHandler({
      fileAreaId: 'fileArea',
      fileInputId: 'fileInput',
      fileInfoId: 'fileInfo',
      onFileLoad: (file, callbacks) => {
        const ctx = this.engine.getCtx();
        const stereoPreserve = this.controls.els.stereoToggle.checked;
        this.engine.musicMode.loadFile(file, ctx,
          callbacks.onProgress,
          callbacks.onReady,
          callbacks.onError,
          stereoPreserve
        );
      }
    });
  }

  _bindControls() {
    this.controls.bindAll(
      () => this.updateParams(),
      () => this._onDroneTypeChange(),
      () => this.togglePlay(),
      (mode) => this.switchMode(mode)
    );
  }

  _initPresets() {
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const freq = parseFloat(btn.dataset.beat);
        if (!isNaN(freq)) {
          this.controls.setBeat(freq);
          this.updateParams();
        }
      });
    });
  }

  _initLangSwitcher() {
    const btn = document.getElementById('langBtn');
    btn.addEventListener('click', () => {
      setLang(getLang() === 'zh' ? 'en' : 'zh');
    });
    onLangChange(() => {
      this.applyI18n();
      this.updateParams();
      this.visualizer.clear();
    });
  }

  _initEditionSwitcher() {
    const btn = document.getElementById('editionBtn');
    btn.addEventListener('click', () => {
      setEdition(isMarketing() ? 'science' : 'marketing');
    });
    onEditionChange(() => {
      this.applyEdition();
      this.applyI18n();
      this.updateParams();
      this.visualizer.clear();
      // Start/stop marketing stats if playing
      if (this.engine.isPlaying && isMarketing()) {
        this._startMarketingStats();
      } else {
        this._stopMarketingStats();
      }
    });
  }

  applyEdition() {
    const marketing = isMarketing();
    document.body.classList.toggle('marketing', marketing);
    document.getElementById('editionBtn').textContent = t('editionSwitch');
  }

  _initMarketingStats() {
    this._mstatTimer = null;
    this._mstatEnergy = 0;
  }

  _startMarketingStats() {
    if (this._mstatTimer) return;
    this._mstatEnergy = 0;
    this._mstatTick();
    this._mstatTimer = setInterval(() => this._mstatTick(), 2000);
  }

  _stopMarketingStats() {
    if (this._mstatTimer) { clearInterval(this._mstatTimer); this._mstatTimer = null; }
    const ids = ['mstatSync', 'mstatPineal', 'mstatDimension', 'mstatEnergy'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = id === 'mstatDimension' ? '3.0D' : '0';
    });
    const bar = document.getElementById('mstatSyncBar');
    if (bar) bar.style.width = '0%';
    const status = document.getElementById('mstatStatus');
    if (status) {
      const lang = getLang();
      status.textContent = lang === 'zh' ? '等待启动脑波校准...' : 'Awaiting neural calibration...';
    }
    this._updateMarketingLabels();
  }

  _mstatTick() {
    if (!isMarketing() || !this.engine.isPlaying) return;
    const lang = getLang();
    const beat = parseFloat(this.controls.els.beat.value) || 10;

    // Fake sync rate: converges to 80-95% with noise
    const syncBase = 75 + Math.min(beat, 30) * 0.6;
    const sync = Math.min(99.8, syncBase + (Math.random() * 8 - 2)).toFixed(1);
    document.getElementById('mstatSync').textContent = sync + '%';
    document.getElementById('mstatSyncBar').style.width = sync + '%';

    // Fake pineal activation
    const pineal = (70 + Math.random() * 25).toFixed(1);
    document.getElementById('mstatPineal').textContent = pineal + '%';

    // Fake dimension
    const dim = (3.5 + Math.random() * 3.5).toFixed(1);
    document.getElementById('mstatDimension').textContent = dim + 'D';

    // Fake energy accumulator
    this._mstatEnergy += Math.floor(100 + Math.random() * 300);
    document.getElementById('mstatEnergy').textContent = this._mstatEnergy.toLocaleString();

    // Fake status messages
    const zhStatuses = [
      '⚡ 脑波深度同步中...',
      '📡 正在接收宇宙源头频率信号...',
      '🧬 DNA 修复序列激活中...',
      '🌟 意识维度正在提升...',
      '🔮 松果体量子共振已建立...',
      '💎 高维能量通道稳定传输中...',
      '🧠 神经突触高速重塑中...',
      '✨ 灵性能量场已达最佳状态...',
    ];
    const enStatuses = [
      '⚡ Deep brain wave synchronization...',
      '📡 Receiving universal source frequency signal...',
      '🧬 DNA repair sequence activating...',
      '🌟 Consciousness dimension ascending...',
      '🔮 Pineal quantum resonance established...',
      '💎 Higher-dimensional energy channel stable...',
      '🧠 Neural synapses rapidly remodeling...',
      '✨ Spiritual energy field at optimal state...',
    ];
    const statuses = lang === 'zh' ? zhStatuses : enStatuses;
    document.getElementById('mstatStatus').textContent = statuses[Math.floor(Math.random() * statuses.length)];

    // Marketing stat labels
    const labels = document.querySelectorAll('[data-mstat]');
    const mstatMap = lang === 'zh' ? {
      sync: '脑波同步率:', pineal: '松果体激活度:', dimension: '意识维度:',
      energy: '累计能量:', unit: '光子单位', status: ''
    } : {
      sync: 'Brain Wave Sync:', pineal: 'Pineal Activation:', dimension: 'Consciousness Dim:',
      energy: 'Accumulated Energy:', unit: 'photon units', status: ''
    };
    labels.forEach(el => {
      const key = el.getAttribute('data-mstat');
      if (key !== 'status' && mstatMap[key]) el.textContent = mstatMap[key];
    });
  }

  _updateMarketingLabels() {
    const lang = getLang();
    const labels = document.querySelectorAll('[data-mstat]');
    const mstatMap = lang === 'zh' ? {
      sync: '脑波同步率:', pineal: '松果体激活度:', dimension: '意识维度:',
      energy: '累计能量:', unit: '光子单位'
    } : {
      sync: 'Brain Wave Sync:', pineal: 'Pineal Activation:', dimension: 'Consciousness Dim:',
      energy: 'Accumulated Energy:', unit: 'photon units'
    };
    labels.forEach(el => {
      const key = el.getAttribute('data-mstat');
      if (key !== 'status' && mstatMap[key]) el.textContent = mstatMap[key];
    });
  }

  applyI18n() {
    const lang = getLang();
    document.getElementById('langBtn').textContent = lang === 'zh' ? 'EN' : '中文';

    // Static text via data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });

    // Warning (has HTML)
    document.querySelector('.warning').innerHTML = t('warning');

    // Tabs
    const tabs = document.querySelectorAll('.tab-btn');
    tabs[0].textContent = t('tabPure');
    tabs[1].textContent = t('tabMusic');
    tabs[2].textContent = t('tabDrone');

    // Play button (only update if not playing)
    if (!this.engine.isPlaying) {
      this.controls.els.playBtn.textContent = t('playStart');
    }

    // Labels
    document.querySelector('#panel-pure .name').textContent = t('carrier');
    const names = document.querySelectorAll('.controls .name');
    names[0].textContent = t('beatLabel');
    names[1].textContent = t('distLabel');
    names[2].textContent = t('volumeLabel');

    // Drone panel labels
    const droneNames = document.querySelectorAll('#panel-drone .name');
    droneNames[0].textContent = t('droneTypeLabel');
    droneNames[1].textContent = t('droneFreqLabel');

    // File area
    const fa = document.getElementById('fileArea');
    if (!fa.classList.contains('loaded')) {
      fa.childNodes[0].textContent = t('fileArea');
    }

    // Freq dist options
    const distSel = this.controls.els.freqDist;
    distSel.options[0].textContent = t('distSymmetric');
    distSel.options[1].textContent = t('distRight');
    distSel.options[2].textContent = t('distLeft');
    distSel.options[3].textContent = t('distAlternating');

    // Drone type options
    const droneSel = this.controls.els.droneType;
    droneSel.options[0].textContent = t('tambura');
    droneSel.options[1].textContent = t('bowl');
    droneSel.options[2].textContent = t('organ');
    droneSel.options[3].textContent = t('pad');

    // Presets
    const presetBtns = document.querySelectorAll('.preset-btn .desc');
    const presetKeys = ['presetDelta', 'presetTheta', 'presetAlpha', 'presetBeta', 'presetLimit', 'presetCollapse'];
    presetBtns.forEach((el, i) => {
      if (presetKeys[i]) el.textContent = t(presetKeys[i]);
    });

    // Edition button
    document.getElementById('editionBtn').textContent = t('editionSwitch');

    // Marketing stats labels (update for current language)
    this._updateMarketingLabels();
  }

  async togglePlay() {
    if (this.engine.isPlaying) {
      this.engine.stop();
      this.controls.setPlaying(false);
      this.visualizer.stop();
      this._stopMarketingStats();
    } else {
      try {
        const params = this.controls.getParams(this.engine.currentModeName);
        await this.engine.start(params);
        this.controls.setPlaying(true);
        this.visualizer.start(
          () => this.controls.getParams(this.engine.currentModeName),
          this.engine.currentModeName
        );
        this.updateParams();
        if (isMarketing()) this._startMarketingStats();
      } catch (e) {
        console.error('Start audio error:', e);
        alert(e.message || t('audioFail'));
      }
    }
  }

  switchMode(mode) {
    this.engine.switchMode(mode);
    this.controls.setPlaying(false);
    this.visualizer.stop();

    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.mode === mode);
    });
    document.querySelectorAll('.panel').forEach(p => {
      p.classList.toggle('active', p.id === 'panel-' + mode);
    });

    this.updateParams();
  }

  updateParams() {
    const modeName = this.engine.currentModeName;
    const params = this.controls.getParams(modeName);

    this.controls.updateLabels(params, modeName);

    // 更新引擎
    if (this.engine.isPlaying) {
      this.engine.update(params);
    }

    // 更新频道信息
    const info = this.engine.getChannelInfo(params);
    this.controls.updateChannelInfo(info);

    // 更新信息面板
    this.infoPanel.update(params.beat, modeName, params.dist);
  }

  _onDroneTypeChange() {
    const type = this.controls.els.droneType.value;
    const def = DRONE_TYPES[type];
    this.controls.els.droneFreq.value = def.baseFreq;
    this.controls.els.droneFreqVal.textContent = def.baseFreq + ' Hz';

    if (this.engine.isPlaying && this.engine.currentModeName === 'drone') {
      this.engine.stop();
      this.togglePlay();
    }
  }
}

// 启动应用
new App();

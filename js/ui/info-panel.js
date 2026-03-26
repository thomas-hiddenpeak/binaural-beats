/**
 * InfoPanel — 频段信息面板
 */
import { t } from '../i18n/i18n.js';

export class InfoPanel {
  constructor(elementId) {
    this.el = document.getElementById(elementId);
  }

  update(beat, modeName, dist) {
    let bandHtml, desc;
    if (beat <= 4) {
      bandHtml = '<span class="band-delta">' + t('bandDelta') + '</span>';
      desc = t('descDelta');
    } else if (beat <= 8) {
      bandHtml = '<span class="band-theta">' + t('bandTheta') + '</span>';
      desc = t('descTheta');
    } else if (beat <= 13) {
      bandHtml = '<span class="band-alpha">' + t('bandAlpha') + '</span>';
      desc = t('descAlpha');
    } else if (beat <= 30) {
      bandHtml = '<span class="band-beta">' + t('bandBeta') + '</span>';
      desc = t('descBeta');
    } else if (beat <= 40) {
      bandHtml = '<span class="band-collapse">' + t('bandCollapse') + '</span>';
      desc = t('descCollapse');
    } else {
      bandHtml = '<span class="band-collapse">' + t('bandOver') + '</span>';
      desc = t('descOver');
    }

    const distKey = 'distLabel' + dist.charAt(0).toUpperCase() + dist.slice(1);
    const distLabel = t(distKey);
    const modeMap = {
      music: t('modeMusic') + ' · ' + distLabel,
      drone: t('modeDrone') + ' · ' + distLabel,
      pure: t('modePure') + ' · ' + distLabel
    };

    this.el.innerHTML = bandHtml + ' — ' + desc +
      '<br>' + t('currentBeat') + ' <strong>' + beat + ' Hz</strong>' +
      '<br>' + (modeMap[modeName] || modeMap.pure);
  }
}

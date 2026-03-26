/**
 * i18n — 国际化管理（支持科学版/营销版/神棍版切换）
 */
import zh from './zh.js';
import en from './en.js';
import zhMarketing from './zh-marketing.js';
import enMarketing from './en-marketing.js';
import zhMystic from './zh-mystic.js';
import enMystic from './en-mystic.js';

const EDITIONS = ['science', 'marketing', 'mystic'];

const packs = {
  zh, en,
  'zh-marketing': zhMarketing,
  'en-marketing': enMarketing,
  'zh-mystic': zhMystic,
  'en-mystic': enMystic
};

let currentLang = 'zh';
let currentEdition = 'science'; // 'science' | 'marketing' | 'mystic'
const listeners = [];
const editionListeners = [];

export function getLang() { return currentLang; }
export function getEdition() { return currentEdition; }
export function isMarketing() { return currentEdition === 'marketing'; }
export function isMystic() { return currentEdition === 'mystic'; }

export function setLang(lang) {
  if (lang !== 'zh' && lang !== 'en') return;
  currentLang = lang;
  localStorage.setItem('bb-lang', lang);
  listeners.forEach(fn => fn(lang));
}

export function setEdition(edition) {
  if (!EDITIONS.includes(edition)) return;
  currentEdition = edition;
  localStorage.setItem('bb-edition', edition);
  editionListeners.forEach(fn => fn(edition));
  // Also trigger lang listeners to refresh UI
  listeners.forEach(fn => fn(currentLang));
}

export function t(key) {
  // Edition-specific: try edition pack first, fallback to base
  if (currentEdition !== 'science') {
    const epack = packs[currentLang + '-' + currentEdition];
    if (epack && epack[key]) return epack[key];
  }
  return packs[currentLang]?.[key] || packs.zh[key] || key;
}

export function onLangChange(fn) {
  listeners.push(fn);
}

export function onEditionChange(fn) {
  editionListeners.push(fn);
}

// Restore saved preferences
const savedLang = localStorage.getItem('bb-lang');
if (savedLang && (savedLang === 'zh' || savedLang === 'en')) currentLang = savedLang;

const savedEdition = localStorage.getItem('bb-edition');
if (savedEdition && EDITIONS.includes(savedEdition)) currentEdition = savedEdition;

// URL param override
const urlEdition = new URLSearchParams(window.location.search).get('edition');
if (urlEdition && EDITIONS.includes(urlEdition)) currentEdition = urlEdition;

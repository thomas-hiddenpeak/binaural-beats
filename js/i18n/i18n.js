/**
 * i18n — 国际化管理
 */
import zh from './zh.js';
import en from './en.js';

const packs = { zh, en };
let current = 'zh';
const listeners = [];

export function getLang() { return current; }

export function setLang(lang) {
  if (!packs[lang]) return;
  current = lang;
  localStorage.setItem('bb-lang', lang);
  listeners.forEach(fn => fn(lang));
}

export function t(key) {
  return packs[current][key] || packs.zh[key] || key;
}

export function onLangChange(fn) {
  listeners.push(fn);
}

// Restore saved preference
const saved = localStorage.getItem('bb-lang');
if (saved && packs[saved]) current = saved;

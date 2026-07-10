// utils.js - 通用工具函数

function $(selector, parent = document) {
  return parent.querySelector(selector);
}

function $$(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function getQueryParam(key) {
  const url = new URL(window.location.href);
  return url.searchParams.get(key);
}

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${pad(s)}`;
}

function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const WEEKDAY_NAMES = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

function formatDateWithWeekday(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${WEEKDAY_NAMES[d.getDay()]}`;
}

async function forceUpdateAppCache() {
  const tasks = [];

  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      registrations.forEach(reg => {
        if (reg.active) reg.active.postMessage({ type: 'CLEAR_CACHES' });
        tasks.push(reg.update().catch(() => {}));
        tasks.push(reg.unregister().catch(() => {}));
      });
    } catch (e) {}
  }

  if ('caches' in window) {
    try {
      const keys = await caches.keys();
      keys.forEach(key => tasks.push(caches.delete(key).catch(() => {})));
    } catch (e) {}
  }

  await Promise.all(tasks);

  const url = new URL(window.location.href);
  url.searchParams.set('force_update', String(Date.now()));
  window.location.replace(url.toString());
}

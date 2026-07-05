// storage.js - IndexedDB 数据持久化（使用 Dexie.js）

const DB_NAME = 'EBPProgress';
const DB_VERSION = 1;

let db;

function initDB() {
  if (db) return Promise.resolve(db);

  return new Promise((resolve, reject) => {
    // 如果 Dexie 已加载（CDN），使用 Dexie；否则用原生 IndexedDB
    if (typeof Dexie !== 'undefined') {
      db = new Dexie(DB_NAME);
      db.version(DB_VERSION).stores({
        progress: 'day',
        journal_entries: '++id, day'
      });
      db.open().then(() => resolve(db)).catch(() => {
        // Dexie 失败，降级到原生
        db = null;
        initNativeDB().then(resolve).catch(reject);
      });
    } else {
      initNativeDB().then(resolve).catch(reject);
    }
  });
}

// 原生 IndexedDB 降级方案
function initNativeDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('progress')) {
        db.createObjectStore('progress', { keyPath: 'day' });
      }
      if (!db.objectStoreNames.contains('journal_entries')) {
        const store = db.createObjectStore('journal_entries', { keyPath: 'id', autoIncrement: true });
        store.createIndex('day', 'day', { unique: false });
      }
    };
    request.onsuccess = (e) => {
      db = e.target.result;
      resolve(db);
    };
    request.onerror = () => reject(request.error);
  });
}

// 通用操作封装
function dbPut(storeName, data) {
  if (db.put) {
    return db[storeName].put(data);
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.put(data);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function dbGet(storeName, key) {
  if (db[storeName] && db[storeName].get) {
    return db[storeName].get(key);
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function dbGetAll(storeName) {
  if (db[storeName] && db[storeName].toArray) {
    return db[storeName].toArray();
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function dbGetByIndex(storeName, indexName, value) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const index = store.index(indexName);
    const req = index.getAll(value);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function dbDelete(storeName, key) {
  if (db[storeName] && db[storeName].delete) {
    return db[storeName].delete(key);
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// 进度操作
async function getProgress(day) {
  const p = await dbGet('progress', day);
  return p || { day, status: 'locked', task1_completed: null, task2_completed: null, task3_completed: null };
}

async function getAllProgress() {
  const all = await dbGetAll('progress');
  const map = {};
  all.forEach(p => { map[p.day] = p; });
  return map;
}

async function saveProgress(day, data) {
  data.updated_at = new Date().toISOString();
  await dbPut('progress', data);
  if (typeof schedulePush === 'function') schedulePush();
}

// 初始化第一天为可用
async function initDay1() {
  const p = await getProgress(1);
  if (p.status === 'locked') {
    p.status = 'available';
    await saveProgress(1, p);
  }
}

// 获取当前可操作的最大天数
async function getMaxAvailableDay() {
  const all = await getAllProgress();
  let maxDay = 1;
  for (let d = 1; d <= 25; d++) {
    const p = all[d];
    if (!p || p.status === 'locked') {
      maxDay = d;
      break;
    }
    if (p.status === 'completed') {
      maxDay = d + 1;
    } else {
      maxDay = d;
      break;
    }
  }
  return Math.min(maxDay, 25);
}

// 获取已完成天数
async function getCompletedCount() {
  const all = await getAllProgress();
  let count = 0;
  for (let d = 1; d <= 25; d++) {
    if (all[d] && all[d].status === 'completed') count++;
  }
  return count;
}

// 日志操作
async function getJournalEntry(day) {
  const entries = await dbGetByIndex('journal_entries', 'day', day);
  return entries[0] || null;
}

async function saveJournalEntry(day, text, imageBlobs) {
  const existing = await getJournalEntry(day);
  const entry = {
    day,
    text: text || '',
    created_at: new Date().toISOString()
  };
  if (imageBlobs && imageBlobs.length > 0) {
    entry.image_blobs = imageBlobs;
  } else if (existing && existing.image_blobs) {
    entry.image_blobs = existing.image_blobs;
  }
  if (existing) {
    entry.id = existing.id;
  }
  await dbPut('journal_entries', entry);
  if (typeof schedulePush === 'function') schedulePush();
}

// 主题偏好
function getThemePreference() {
  const stored = localStorage.getItem('ebp_theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setThemePreference(theme) {
  localStorage.setItem('ebp_theme', theme);
  applyTheme(theme);
  if (typeof schedulePush === 'function') schedulePush();
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.innerHTML = theme === 'dark' ? iconSun(20) : iconMoon(20);
  }
}

// ── 数据导出/导入（用于 GitHub 同步） ──

async function exportAllData() {
  const progress = await dbGetAll('progress');
  const journals = await dbGetAll('journal_entries');

  const processedJournals = await Promise.all(journals.map(async (entry) => {
    const e = { ...entry };
    if (e.image_blobs && e.image_blobs.length > 0) {
      e.image_blobs_base64 = await Promise.all(
        e.image_blobs.map(b => blobToBase64(b))
      );
      delete e.image_blobs;
    }
    return e;
  }));

  return { progress, journals: processedJournals };
}

async function importAllData(progressList, journalList) {
  if (progressList && progressList.length > 0) {
    for (const remote of progressList) {
      const local = await getProgress(remote.day);
      if (!local.updated_at || (remote.updated_at && remote.updated_at > local.updated_at)) {
        await dbPut('progress', remote);
      }
    }
  }

  if (journalList && journalList.length > 0) {
    for (const remote of journalList) {
      const local = await getJournalEntry(remote.day);
      if (!local || !local.created_at || (remote.created_at && remote.created_at > local.created_at)) {
        if (remote.image_blobs_base64 && !remote.image_blobs) {
          remote.image_blobs = await Promise.all(
            remote.image_blobs_base64.map(b64 => base64ToBlob(b64))
          );
        }
        delete remote.image_blobs_base64;
        await dbPut('journal_entries', remote);
      }
    }
  }
}

function exportSettings() {
  return {
    theme: localStorage.getItem('ebp_theme') || 'light',
    has_started: localStorage.getItem('ebp_has_started') || '0',
    lock_password: localStorage.getItem('ebp_lock_password') || ''
  };
}

function importSettings(settings) {
  if (!settings) return;
  if (settings.lock_password && !localStorage.getItem('ebp_lock_password')) {
    localStorage.setItem('ebp_lock_password', settings.lock_password);
  }
  if (settings.theme && !localStorage.getItem('ebp_theme')) {
    localStorage.setItem('ebp_theme', settings.theme);
  }
  if (settings.has_started && !localStorage.getItem('ebp_has_started')) {
    localStorage.setItem('ebp_has_started', settings.has_started);
  }
}

function blobToBase64(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

function base64ToBlob(dataUrl) {
  return fetch(dataUrl).then(r => r.blob());
}

// 初始化存储
async function initStorage() {
  await initDB();
  await initDay1();
}
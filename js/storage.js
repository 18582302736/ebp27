// storage.js - IndexedDB 数据持久化（使用 Dexie.js）
// 多课程架构：progress key 格式为 courseId_day

const DB_NAME = 'EBPProgress';
const DB_VERSION = 1;

// 课程 ID 常量
const COURSE_EBP = 'ebp';
const COURSE_CBT = 'cbt';
const COURSE_ACT = 'act';

function makeKey(courseId, day) {
  return `${courseId}_${day}`;
}

function parseKey(key) {
  const idx = key.indexOf('_');
  if (idx === -1) return null; // 旧格式，数字key
  return { courseId: key.substring(0, idx), day: parseInt(key.substring(idx + 1)) };
}

let db;

function initDB() {
  if (db) return Promise.resolve(db);

  return new Promise((resolve, reject) => {
    if (typeof Dexie !== 'undefined') {
      db = new Dexie(DB_NAME);
      db.version(DB_VERSION).stores({
        progress: 'day',
        journal_entries: '++id, day'
      });
      db.open().then(() => resolve(db)).catch(() => {
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
      const d = e.target.result;
      if (!d.objectStoreNames.contains('progress')) {
        d.createObjectStore('progress', { keyPath: 'day' });
      }
      if (!d.objectStoreNames.contains('journal_entries')) {
        const store = d.createObjectStore('journal_entries', { keyPath: 'id', autoIncrement: true });
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

// ── 进度操作（多课程） ──

async function getProgress(courseId, day) {
  const key = makeKey(courseId, day);
  const p = await dbGet('progress', key);
  return p || { day: key, status: 'locked', task1_completed: null, task2_completed: null, task3_completed: null, task4_completed: null };
}

async function getAllProgress(courseId) {
  const all = await dbGetAll('progress');
  const map = {};
  all.forEach(p => {
    const parsed = parseKey(p.day);
    if (parsed && parsed.courseId === courseId) {
      map[parsed.day] = p;
    }
  });
  return map;
}

async function saveProgress(courseId, day, data) {
  data.day = makeKey(courseId, day);
  data.updated_at = new Date().toISOString();
  await dbPut('progress', data);
  if (typeof markBackupDirty === 'function') markBackupDirty();
}

// 初始化课程第一天为可用
async function initCourseDay1(courseId) {
  const p = await getProgress(courseId, 1);
  if (p.status === 'locked') {
    p.status = 'available';
    await saveProgress(courseId, 1, p);
  }
}

// 获取课程当前可操作的最大天数
async function getMaxAvailableDay(courseId, totalDays) {
  const all = await getAllProgress(courseId);
  let maxDay = 1;
  for (let d = 1; d <= totalDays; d++) {
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
  return Math.min(maxDay, totalDays);
}

// 获取课程已完成天数
async function getCompletedCount(courseId) {
  const all = await getAllProgress(courseId);
  let count = 0;
  for (const p of Object.values(all)) {
    if (p.status === 'completed') count++;
  }
  return count;
}

// 课程整体状态
async function getCourseStatus(courseId, totalDays) {
  const completed = await getCompletedCount(courseId);
  if (completed >= totalDays) return 'completed';
  const all = await getAllProgress(courseId);
  const hasProgress = Object.values(all).some(p => p.status !== 'locked');
  if (hasProgress) return 'in_progress';
  // 检查是否解锁（第一天是否为 available）
  const day1 = await getProgress(courseId, 1);
  if (day1.status === 'available') return 'available';
  return 'locked';
}

// 设置课程解锁
async function unlockCourse(courseId) {
  await initCourseDay1(courseId);
}

// ── 日志操作（多课程） ──

async function getJournalEntry(courseId, day) {
  const key = makeKey(courseId, day);
  const entries = await dbGetByIndex('journal_entries', 'day', key);
  return entries[0] || null;
}

async function saveJournalEntry(courseId, day, text, imageBase64s, formData) {
  const key = makeKey(courseId, day);
  const existing = await getJournalEntry(courseId, day);
  const entry = {
    day: key,
    text: text || '',
    created_at: existing && existing.created_at ? existing.created_at : new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  if (imageBase64s && imageBase64s.length > 0) {
    entry.image_base64 = imageBase64s;
  } else if (existing && existing.image_base64) {
    entry.image_base64 = existing.image_base64;
  }
  if (existing) {
    entry.id = existing.id;
  }
  if (formData !== undefined) {
    entry.form_data = formData;
    entry.form_version = 2;
  } else if (existing && existing.form_data) {
    entry.form_data = existing.form_data;
    entry.form_version = existing.form_version || 2;
  }
  await dbPut('journal_entries', entry);
  if (typeof markBackupDirty === 'function') markBackupDirty();
}

// ── 主题偏好 ──

function getThemePreference() {
  const stored = localStorage.getItem('ebp_theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setThemePreference(theme) {
  localStorage.setItem('ebp_theme', theme);
  applyTheme(theme);
  if (typeof markBackupDirty === 'function') markBackupDirty();
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
    if (e.image_base64 && e.image_base64.length > 0) {
      e.image_blobs_base64 = e.image_base64;
      delete e.image_base64;
    }
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
      // 拒绝旧格式（纯数字 day），统一使用 courseId_day 格式
      if (typeof remote.day === 'number') continue;
      const local = await dbGet('progress', remote.day);
      if (!local || !local.updated_at || (remote.updated_at && remote.updated_at > local.updated_at)) {
        await dbPut('progress', remote);
      }
    }
  }

  if (journalList && journalList.length > 0) {
    for (const remote of journalList) {
      // 拒绝旧格式（纯数字 day），统一使用 courseId_day 格式
      if (typeof remote.day === 'number') continue;
      const local = (await dbGetByIndex('journal_entries', 'day', remote.day))[0] || null;
      if (!local || !local.updated_at || (remote.updated_at && remote.updated_at > local.updated_at)) {
        if (remote.image_blobs_base64 && remote.image_blobs_base64.length > 0) {
          remote.image_base64 = remote.image_blobs_base64;
        }
        delete remote.image_blobs_base64;
        delete remote.image_blobs;
        delete remote.id;
        if (local) remote.id = local.id;
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

// ── 初始化存储 + 旧数据迁移 ──

async function initStorage() {
  await initDB();
  await migrateOldData();
  await initCourseDay1(COURSE_EBP);
}

// 迁移旧数据：数字 key（旧格式）→ courseId_day 格式
async function migrateOldData() {
  try {
    const allProgress = await dbGetAll('progress');
    const hasOldProgress = allProgress.some(p => typeof p.day === 'number');
    const allJournals = await dbGetAll('journal_entries');
    const hasOldJournals = allJournals.some(j => typeof j.day === 'number');

    if (!hasOldProgress && !hasOldJournals) return;

    // 迁移 progress：数字 day → ebp_N
    if (hasOldProgress) {
      const toUpsert = [];
      const toDelete = [];
      for (const p of allProgress) {
        if (typeof p.day === 'number') {
          toDelete.push(p.day);
          const newKey = makeKey(COURSE_EBP, p.day);
          const existing = await dbGet('progress', newKey);
          if (!existing) {
            p.day = newKey;
            toUpsert.push(p);
          }
        }
      }
      for (const p of toUpsert) await dbPut('progress', p);
      for (const d of toDelete) await dbDelete('progress', d);
    }

    // 迁移 journal：数字 day → ebp_N（id 不变，dbPut 原地更新）
    if (hasOldJournals) {
      for (const j of allJournals) {
        if (typeof j.day === 'number') {
          j.day = makeKey(COURSE_EBP, j.day);
          await dbPut('journal_entries', j);
        }
      }
    }

    console.log('数据迁移完成：旧格式 → 多课程格式');
  } catch (e) {
    console.warn('数据迁移失败（不影响使用）:', e);
  }
}

// backup.js - iCloud Drive 文件备份与恢复
const BACKUP_MAGIC = 'AnxietyHealBackup';
const BACKUP_VERSION = 1;
const BACKUP_APP_VERSION = '2.11.2';
const BACKUP_DIRTY_KEY = 'ebp_backup_dirty';
const LAST_BACKUP_KEY = 'ebp_last_backup_at';
const LAST_BACKUP_MANIFEST_KEY = 'ebp_last_backup_manifest';
const LEGACY_TOKEN_KEY = 'ebp_github_token';
let pendingBackupFile = null;
let pendingRestore = null;

function disableLegacyGithubSync() {
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  localStorage.removeItem('ebp_sync_state');
}

function markBackupDirty() {
  localStorage.setItem(BACKUP_DIRTY_KEY, '1');
  if (typeof updateBackupUI === 'function') updateBackupUI();
}

function markBackupComplete(manifest, backedUpAt) {
  localStorage.setItem(BACKUP_DIRTY_KEY, '0');
  localStorage.setItem(LAST_BACKUP_KEY, backedUpAt || new Date().toISOString());
  if (manifest) localStorage.setItem(LAST_BACKUP_MANIFEST_KEY, JSON.stringify(manifest));
  if (typeof updateBackupUI === 'function') updateBackupUI();
}

function isBackupDirty() { return localStorage.getItem(BACKUP_DIRTY_KEY) === '1'; }
function getLastBackupAt() { return localStorage.getItem(LAST_BACKUP_KEY) || null; }

function getLastBackupManifest() {
  try { return JSON.parse(localStorage.getItem(LAST_BACKUP_MANIFEST_KEY) || 'null'); }
  catch (e) { return null; }
}

function getRecordDayKey(record) {
  return record && typeof record.day === 'string' && parseKey(record.day) ? record.day : null;
}

function hasJournalContent(entry) {
  return !!(entry && (entry.text || entry.form_data || countImages(entry.image_base64) || countImages(entry.image_blobs_base64)));
}

function hasProgressContent(progress) {
  if (!progress) return false;
  return progress.status === 'completed'
    || ['task1_completed', 'task2_completed', 'task3_completed', 'task4_completed'].some(key => !!progress[key])
    || !!progress.recovery;
}

function buildBackupManifest(data) {
  const manifest = {};
  (data.progress || []).forEach(record => {
    const key = getRecordDayKey(record);
    if (key && hasProgressContent(record)) manifest[key] = record.updated_at || record.created_at || '';
  });
  (data.journals || []).forEach(record => {
    const key = getRecordDayKey(record);
    if (!key || !hasJournalContent(record)) return;
    const changedAt = record.updated_at || record.created_at || '';
    if (!manifest[key] || changedAt > manifest[key]) manifest[key] = changedAt;
  });
  return manifest;
}

function getUnbackedDayKeys(data) {
  const current = buildBackupManifest(data);
  const backedUp = getLastBackupManifest();
  if (!backedUp) return isBackupDirty() ? Object.keys(current).sort(compareDayKeys) : [];
  return Object.keys(current).filter(key => !backedUp[key] || current[key] > backedUp[key]).sort(compareDayKeys);
}

function compareDayKeys(a, b) {
  const pa = parseKey(a); const pb = parseKey(b);
  if (!pa || !pb) return a.localeCompare(b);
  return pa.courseId === pb.courseId ? pa.day - pb.day : pa.courseId.localeCompare(pb.courseId);
}

function formatBackupDay(key) {
  const parsed = parseKey(key);
  if (!parsed) return key;
  const names = { ebp: '情绪EBP', cbt: 'CBT综合', act: 'ACT行动' };
  return (names[parsed.courseId] || parsed.courseId.toUpperCase()) + ' Day ' + parsed.day;
}

async function getBackupSummary(data) {
  const source = data || await exportAllData();
  const progress = source.progress || [];
  const journals = source.journals || [];
  let photoCount = 0;
  journals.forEach(entry => {
    photoCount += countImages(entry.image_base64 || entry.image_blobs_base64 || []);
    const form = entry.form_data || {};
    photoCount += countImages(form.images || []);
    (form.items || []).forEach(item => { photoCount += countImages(item.images || []); });
  });
  return {
    progressCount: progress.filter(p => p.status === 'completed').length,
    cardCount: progress.filter(p => p.recovery && p.recovery.card && p.recovery.card.unlocked_at).length,
    journalCount: journals.filter(j => j.text || j.form_data || (j.image_blobs_base64 && j.image_blobs_base64.length)).length,
    photoCount,
    unbackedDays: getUnbackedDayKeys(source)
  };
}

function countImages(value) { return Array.isArray(value) ? value.length : 0; }

async function createBackupFile() {
  const data = await exportAllData();
  const manifest = buildBackupManifest(data);
  const createdAt = new Date().toISOString();
  const payload = {
    magic: BACKUP_MAGIC,
    version: BACKUP_VERSION,
    appVersion: BACKUP_APP_VERSION,
    createdAt,
    backupManifest: manifest,
    progress: data.progress || [],
    journals: data.journals || [],
    settings: exportSettings()
  };
  const envelope = {
    magic: BACKUP_MAGIC,
    version: BACKUP_VERSION,
    encrypted: false,
    payload
  };
  const file = new File([JSON.stringify(envelope)], 'AnxietyHeal.ahbackup', { type: 'application/octet-stream' });
  file.backupManifest = manifest;
  file.backupCreatedAt = createdAt;
  return file;
}

async function readBackupFile(file) {
  let envelope;
  const text = await file.text();
  try { envelope = JSON.parse(text); }
  catch (e) { throw new Error('这不是有效的 AnxietyHeal 备份文件。请在 iCloud Drive 里选择以 AnxietyHeal 开头、以 .ahbackup 结尾的文件。'); }
  if (!envelope || envelope.magic !== BACKUP_MAGIC) throw new Error('备份文件格式不正确。请确认选择的是 AnxietyHeal 的 .ahbackup 文件。');
  if (envelope.version > BACKUP_VERSION) throw new Error('备份来自更新版本，请先更新小应用');
  if (!envelope.encrypted) {
    const payload = envelope.payload || envelope;
    validateBackupPayload(payload);
    return payload;
  }
  throw new Error('这是旧版加密备份。新版恢复不需要密码，请先用 v1.9.5 重新生成一个新的备份文件。');
}

function validateBackupPayload(payload) {
  if (!payload || payload.magic !== BACKUP_MAGIC || !Array.isArray(payload.progress) || !Array.isArray(payload.journals)) {
    throw new Error('备份文件内容格式不正确');
  }
}

async function restoreBackupPayload(payload) {
  validateBackupPayload(payload);
  const progCount = Array.isArray(payload.progress) ? payload.progress.length : 0;
  const jrnlCount = Array.isArray(payload.journals) ? payload.journals.length : 0;
  console.log('[Restore] 备份包含 ' + progCount + ' 条进度 + ' + jrnlCount + ' 条书写，开始写入...');

  // Restoring is an explicit rollback: records contained in the selected
  // backup replace the matching local Day, even when the local edit is newer.
  const imported = await importAllData(payload.progress, payload.journals, { force: true });

  // 验证写入：读回进度数据确认
  let verifyCount = 0;
  try {
    const allAfter = await dbGetAll('progress');
    verifyCount = Array.isArray(allAfter) ? allAfter.length : 0;
    console.log('[Restore] 写入后验证：IndexedDB 中共有 ' + verifyCount + ' 条进度记录');
  } catch (e) {
    console.warn('[Restore] 验证读取失败:', e);
  }

  if (payload.settings) {
    if (payload.settings.theme) localStorage.setItem('ebp_theme', payload.settings.theme);
    if (payload.settings.has_started) localStorage.setItem('ebp_has_started', payload.settings.has_started);
    if (payload.settings.lock_password) localStorage.setItem('ebp_lock_password', payload.settings.lock_password);
  }
  localStorage.setItem(LAST_BACKUP_KEY, payload.createdAt || new Date().toISOString());
  localStorage.setItem(LAST_BACKUP_MANIFEST_KEY, JSON.stringify(payload.backupManifest || buildBackupManifest(payload)));
  const currentData = await exportAllData();
  localStorage.setItem(BACKUP_DIRTY_KEY, getUnbackedDayKeys(currentData).length ? '1' : '0');

  return { progCount, jrnlCount, verifyCount, ...imported };
}

async function shareBackupFile(file) {
  if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
    try {
      await navigator.share({ files: [file] });
      markBackupComplete(file.backupManifest, file.backupCreatedAt);
      return 'shared';
    } catch (e) {
      if (e.name === 'AbortError') throw e;
      // 某些内嵌浏览器声明支持文件分享，但真正调用时失败，自动降级为下载。
    }
  }
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url; link.download = file.name; document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  markBackupComplete(file.backupManifest, file.backupCreatedAt);
  return 'downloaded';
}

async function deriveBackupKey(password, salt, usages) {
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 250000, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, usages);
}

function bytesToBase64(bytes) {
  let out = ''; const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) out += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  return btoa(out);
}
function base64ToBytes(value) { const raw = atob(value); const bytes = new Uint8Array(raw.length); for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i); return bytes; }
function formatBackupFilenameDate(date) { const pad = n => String(n).padStart(2, '0'); return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + '-' + pad(date.getHours()) + pad(date.getMinutes()); }
function formatBackupTime(value) { if (!value) return '从未备份'; const d = new Date(value); return d.toLocaleString('zh-CN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }

disableLegacyGithubSync();

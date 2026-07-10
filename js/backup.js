// backup.js - iCloud Drive 文件备份与恢复
const BACKUP_MAGIC = 'AnxietyHealBackup';
const BACKUP_VERSION = 1;
const BACKUP_APP_VERSION = '1.9.4';
const BACKUP_DIRTY_KEY = 'ebp_backup_dirty';
const LAST_BACKUP_KEY = 'ebp_last_backup_at';
const LEGACY_TOKEN_KEY = 'ebp_github_token';
let pendingBackupFile = null;
let pendingRestore = null;

function disableLegacyGithubSync() {
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  localStorage.removeItem('ebp_sync_state');
}

function markBackupDirty() {
  localStorage.setItem(BACKUP_DIRTY_KEY, '1');
  updateBackupIndicator();
  if (typeof updateBackupUI === 'function') updateBackupUI();
}

function markBackupComplete() {
  localStorage.setItem(BACKUP_DIRTY_KEY, '0');
  localStorage.setItem(LAST_BACKUP_KEY, new Date().toISOString());
  updateBackupIndicator();
  if (typeof updateBackupUI === 'function') updateBackupUI();
}

function isBackupDirty() { return localStorage.getItem(BACKUP_DIRTY_KEY) !== '0'; }
function getLastBackupAt() { return localStorage.getItem(LAST_BACKUP_KEY) || null; }

function updateBackupIndicator() {
  const dirty = isBackupDirty();
  document.querySelectorAll('.sync-dot').forEach(dot => {
    dot.className = 'sync-dot ' + (dirty ? 'error' : 'success');
    dot.title = dirty ? '有新内容待备份' : '本机内容已备份';
  });
  const settingsBtn = document.getElementById('settingsBtn');
  if (settingsBtn) settingsBtn.classList.toggle('has-backup-reminder', dirty);
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
    journalCount: journals.filter(j => j.text || j.form_data || (j.image_blobs_base64 && j.image_blobs_base64.length)).length,
    photoCount
  };
}

function countImages(value) { return Array.isArray(value) ? value.length : 0; }

async function createBackupFile() {
  const data = await exportAllData();
  const payload = {
    magic: BACKUP_MAGIC,
    version: BACKUP_VERSION,
    appVersion: BACKUP_APP_VERSION,
    createdAt: new Date().toISOString(),
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
  const stamp = formatBackupFilenameDate(new Date());
  return new File([JSON.stringify(envelope)], 'AnxietyHeal-' + stamp + '.ahbackup', { type: 'application/octet-stream' });
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
  throw new Error('这是旧版加密备份。新版恢复不需要密码，请先用 v1.9.4 重新生成一个新的备份文件。');
}

function validateBackupPayload(payload) {
  if (!payload || payload.magic !== BACKUP_MAGIC || !Array.isArray(payload.progress) || !Array.isArray(payload.journals)) {
    throw new Error('备份文件内容格式不正确');
  }
}

async function restoreBackupPayload(payload) {
  validateBackupPayload(payload);
  await importAllData(payload.progress, payload.journals, { force: true });
  if (payload.settings) {
    if (payload.settings.theme) localStorage.setItem('ebp_theme', payload.settings.theme);
    if (payload.settings.has_started) localStorage.setItem('ebp_has_started', payload.settings.has_started);
    if (payload.settings.lock_password) localStorage.setItem('ebp_lock_password', payload.settings.lock_password);
  }
  localStorage.setItem(BACKUP_DIRTY_KEY, '0');
  localStorage.setItem(LAST_BACKUP_KEY, payload.createdAt || new Date().toISOString());
}

async function shareBackupFile(file) {
  if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
    try {
      await navigator.share({ files: [file] });
      markBackupComplete();
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
  markBackupComplete();
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

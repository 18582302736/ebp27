// sync.js - GitHub 自动云备份模块

const REPO_OWNER = '18582302736';
const REPO_NAME = 'ebp27';
const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data`;
const TOKEN_KEY = 'ebp_github_token';
const SYNC_STATE_KEY = 'ebp_sync_state';
const DATA_FILES = ['progress.json', 'journal.json', 'settings.json'];

let pushTimer = null;
let isSyncing = false;

// ── Token 管理 ──

function getGithubToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

function setGithubToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function hasGithubToken() {
  return !!getGithubToken();
}

// ── 同步状态 ──

function getSyncState() {
  try {
    return JSON.parse(localStorage.getItem(SYNC_STATE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function setSyncState(partial) {
  const state = getSyncState();
  Object.assign(state, partial);
  localStorage.setItem(SYNC_STATE_KEY, JSON.stringify(state));
}

function getSyncStatus() {
  const state = getSyncState();
  return {
    lastSync: state.lastSync || null,
    lastError: state.lastError || null,
    syncing: isSyncing
  };
}

// ── GitHub API 封装 ──

async function githubApi(path, method, body) {
  const token = getGithubToken();
  if (!token) throw new Error('Token 未配置');

  const headers = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json'
  };
  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (res.status === 401 || res.status === 403) {
    const data = await res.json().catch(() => ({}));
    if (data.message && data.message.includes('rate limit')) {
      throw new Error('API 请求频率超限，请稍后再试');
    }
    // Token 无效
    localStorage.removeItem(TOKEN_KEY);
    setSyncState({ lastError: 'Token 无效或已过期，请重新配置' });
    throw new Error('Token 无效或已过期');
  }

  if (res.status === 404) {
    return null; // 文件不存在
  }

  if (!res.ok) {
    throw new Error(`GitHub API 错误: ${res.status}`);
  }

  return res.json();
}

// ── 拉取：从 GitHub 下载数据 ──

async function pullFromGithub() {
  if (!hasGithubToken()) return;

  isSyncing = true;
  try {
    // 拉取 progress
    const progressData = await githubApi('progress.json', 'GET');
    if (progressData) {
      const content = JSON.parse(base64ToUtf8(progressData.content));
      if (content.records && content.records.length > 0) {
        await importAllData(content.records, null);
      }
    }

    // 拉取 journal
    const journalData = await githubApi('journal.json', 'GET');
    if (journalData) {
      const content = JSON.parse(base64ToUtf8(journalData.content));
      if (content.entries && content.entries.length > 0) {
        await importAllData(null, content.entries);
      }
    }

    // 拉取 settings
    const settingsData = await githubApi('settings.json', 'GET');
    if (settingsData) {
      const content = JSON.parse(base64ToUtf8(settingsData.content));
      importSettings(content);
    }

    setSyncState({ lastSync: new Date().toISOString(), lastError: null });
  } catch (e) {
    setSyncState({ lastError: e.message });
    throw e;
  } finally {
    isSyncing = false;
  }
}

// ── 推送：上传本地数据到 GitHub ──

async function pushToGithub() {
  if (!hasGithubToken()) return;

  isSyncing = true;
  try {
    const allData = await exportAllData();

    // 构建 payload
    const progressPayload = {
      version: 1,
      updated_at: new Date().toISOString(),
      records: allData.progress || []
    };

    const journalPayload = {
      version: 1,
      updated_at: new Date().toISOString(),
      entries: (allData.journals || []).map(entry => {
        const e = { ...entry };
        if (e.image_blobs_base64 && e.image_blobs_base64.length > 0) {
          // exportAllData 已经将 image_base64 映射为 image_blobs_base64
        }
        delete e.image_blobs;
        delete e.image_base64;
        return e;
      })
    };

    const settingsPayload = {
      version: 1,
      updated_at: new Date().toISOString(),
      ...exportSettings()
    };

    // 上传三个文件
    await uploadFile('progress.json', progressPayload);
    await uploadFile('journal.json', journalPayload);
    await uploadFile('settings.json', settingsPayload);

    setSyncState({ lastSync: new Date().toISOString(), lastError: null });
  } catch (e) {
    setSyncState({ lastError: e.message });
    throw e;
  } finally {
    isSyncing = false;
  }
}

async function uploadFile(filename, data) {
  const content = utf8ToBase64(JSON.stringify(data, null, 2));

  // 先获取当前 SHA（如果文件存在）
  let sha = null;
  try {
    const existing = await githubApi(filename, 'GET');
    if (existing) sha = existing.sha;
  } catch (e) {
    // 文件不存在，继续
  }

  const body = { message: `backup: update ${filename}`, content };
  if (sha) body.sha = sha;

  try {
    await githubApi(filename, 'PUT', body);
  } catch (e) {
    if (e.message.includes('409') || (sha && e.message.includes('conflict'))) {
      // SHA 冲突，重新获取后重试一次
      const existing = await githubApi(filename, 'GET');
      if (existing) {
        body.sha = existing.sha;
        await githubApi(filename, 'PUT', body);
      }
    } else {
      throw e;
    }
  }
}

// ── 调度推送（debounce 3秒） ──

function schedulePush() {
  if (!hasGithubToken()) return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushTimer = null;
    pushToGithub().catch(e => console.warn('自动同步失败:', e.message));
  }, 3000);
}

// ── 手动全量同步 ──

async function syncNow() {
  if (!hasGithubToken()) throw new Error('请先配置 GitHub Token');
  await pullFromGithub();
  await pushToGithub();
}

// ── 初始化同步（应用启动时调用） ──

async function initSync() {
  if (!hasGithubToken()) return;
  try {
    await pullFromGithub();
  } catch (e) {
    console.warn('启动同步失败:', e.message);
  }
}

// ── 同步指示器更新 ──

function updateSyncIndicator() {
  const timeEl = document.getElementById('syncTime');
  const dot = document.getElementById('syncDot');
  if (!timeEl && !dot) return;

  const status = getSyncStatus();
  const hasToken = hasGithubToken();

  if (!hasToken) {
    if (timeEl) timeEl.textContent = '';
    if (dot) { dot.className = 'sync-dot'; dot.title = '未配置同步'; }
    return;
  }

  if (status.syncing) {
    if (timeEl) timeEl.textContent = '同步中...';
    if (dot) { dot.className = 'sync-dot syncing'; dot.title = '同步中'; }
  } else if (status.lastError) {
    if (timeEl) timeEl.textContent = status.lastSync ? formatSyncTime(status.lastSync) : '同步失败';
    if (dot) { dot.className = 'sync-dot error'; dot.title = '同步失败: ' + status.lastError; }
  } else if (status.lastSync) {
    if (timeEl) timeEl.textContent = '上次同步: ' + formatSyncTime(status.lastSync);
    if (dot) { dot.className = 'sync-dot success'; dot.title = '已同步'; }
  } else {
    if (timeEl) timeEl.textContent = '尚未同步';
    if (dot) { dot.className = 'sync-dot'; dot.title = '等待同步'; }
  }
}

function formatSyncTime(isoStr) {
  const date = new Date(isoStr);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return '刚刚';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + '分钟前';
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + '小时前';
  const days = Math.floor(hours / 24);
  return days + '天前';
}

// ── 工具函数 ──

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary);
}

function base64ToUtf8(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

function base64ToBlob(dataUrl) {
  return fetch(dataUrl).then(r => r.blob());
}

function blobToBase64(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}
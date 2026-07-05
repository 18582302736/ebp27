// settings.js - 设置页面 UI 模块

let settingsOverlay = null;
let settingsPanel = null;

function initSettingsPage() {
  // 设置按钮点击事件（两个页面都有）
  const settingsBtn = document.getElementById('settingsBtn');
  if (settingsBtn) {
    settingsBtn.innerHTML = iconSettings(20);
    settingsBtn.addEventListener('click', openSettings);
  }

  // 查找弹窗元素
  settingsOverlay = document.getElementById('settingsOverlay');
  settingsPanel = document.querySelector('.settings-panel');

  if (!settingsOverlay) return;

  // 关闭按钮
  const closeBtn = document.getElementById('settingsClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeSettings);
  }

  // 点击遮罩关闭
  settingsOverlay.addEventListener('click', (e) => {
    if (e.target === settingsOverlay) closeSettings();
  });

  // Token 显示/隐藏切换
  const toggleBtn = document.getElementById('toggleTokenVisibility');
  const tokenInput = document.getElementById('tokenInput');
  if (toggleBtn && tokenInput) {
    toggleBtn.addEventListener('click', () => {
      const isPassword = tokenInput.type === 'password';
      tokenInput.type = isPassword ? 'text' : 'password';
      toggleBtn.textContent = isPassword ? '隐藏' : '显示';
    });
  }

  // 保存 Token
  const saveBtn = document.getElementById('saveTokenBtn');
  if (saveBtn && tokenInput) {
    saveBtn.addEventListener('click', () => {
      const token = tokenInput.value.trim();
      if (!token) {
        showTokenStatus('请输入 Token', 'error');
        return;
      }
      if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
        showTokenStatus('Token 格式不正确，应以 ghp_ 或 github_pat_ 开头', 'error');
        return;
      }
      setGithubToken(token);
      showTokenStatus('Token 已保存，正在首次同步...', 'success');
      updateSyncUI();
      // 触发首次同步
      syncNow()
        .then(() => updateSyncUI())
        .catch(e => updateSyncUI());
    });
  }

  // 立即同步按钮
  const syncBtn = document.getElementById('syncNowBtn');
  if (syncBtn) {
    syncBtn.addEventListener('click', async () => {
      if (isSyncing) return;
      updateSyncUI();
      try {
        await syncNow();
      } catch (e) {
        // 错误已在 sync state 中记录
      }
      updateSyncUI();
    });
  }

  // 初始化时加载 token 到输入框
  if (tokenInput) {
    const savedToken = getGithubToken();
    if (savedToken) {
      tokenInput.value = savedToken;
      showTokenStatus('已配置', 'success');
    }
  }

  updateSyncUI();
}

function openSettings() {
  if (settingsOverlay) {
    // 刷新 token 输入框
    const tokenInput = document.getElementById('tokenInput');
    if (tokenInput && !tokenInput.value) {
      const savedToken = getGithubToken();
      if (savedToken) tokenInput.value = savedToken;
    }
    updateSyncUI();
    settingsOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeSettings() {
  if (settingsOverlay) {
    settingsOverlay.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function showTokenStatus(msg, type) {
  const el = document.getElementById('tokenStatus');
  if (el) {
    el.textContent = msg;
    el.className = 'settings-token-status ' + type;
  }
}

function updateSyncUI() {
  const status = getSyncStatus();
  const statusIcon = document.querySelector('.sync-status-icon');
  const statusText = document.querySelector('.sync-status-text');
  const syncBtn = document.getElementById('syncNowBtn');
  const lastSyncEl = document.getElementById('lastSyncTime');
  const hasToken = hasGithubToken();

  if (!statusIcon || !statusText) return;

  if (!hasToken) {
    statusIcon.textContent = '○';
    statusIcon.style.color = 'var(--text-muted)';
    statusText.textContent = '未配置';
    statusText.style.color = 'var(--text-muted)';
    if (syncBtn) syncBtn.disabled = true;
    if (lastSyncEl) lastSyncEl.textContent = '';
    return;
  }

  if (status.syncing) {
    statusIcon.textContent = '⟳';
    statusIcon.style.color = 'var(--primary)';
    statusIcon.style.animation = 'spin 1s linear infinite';
    statusText.textContent = '同步中...';
    statusText.style.color = 'var(--primary)';
    if (syncBtn) syncBtn.disabled = true;
    return;
  }

  statusIcon.style.animation = '';

  if (status.lastError) {
    statusIcon.textContent = '✕';
    statusIcon.style.color = '#c62828';
    statusText.textContent = '同步失败: ' + status.lastError;
    statusText.style.color = '#c62828';
    if (syncBtn) syncBtn.disabled = false;
  } else if (status.lastSync) {
    statusIcon.textContent = '✓';
    statusIcon.style.color = 'var(--primary)';
    statusText.textContent = '已同步 ' + formatSyncTime(status.lastSync);
    statusText.style.color = 'var(--primary)';
    if (syncBtn) syncBtn.disabled = false;
  } else {
    statusIcon.textContent = '○';
    statusIcon.style.color = 'var(--text-secondary)';
    statusText.textContent = '等待首次同步';
    statusText.style.color = 'var(--text-secondary)';
    if (syncBtn) syncBtn.disabled = false;
  }

  if (lastSyncEl) {
    lastSyncEl.textContent = status.lastSync
      ? '上次同步: ' + formatSyncTime(status.lastSync)
      : '';
  }
}
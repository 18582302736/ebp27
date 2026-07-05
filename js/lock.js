// lock.js - 密码锁屏
const LOCK_STORAGE_KEY = 'ebp_lock_password';
const UNLOCK_KEY = 'ebp_unlocked';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60 * 1000;

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'ebp_salt');

  // Web Crypto API（需要安全上下文：HTTPS 或 localhost）
  if (crypto.subtle) {
    try {
      const hash = await crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {}
  }

  // 非安全上下文 fallback（如 HTTP 局域网 IP 访问）
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash) + data[i];
    hash |= 0;
  }
  return 'v2_' + Math.abs(hash).toString(16);
}

async function initLockScreen() {
  const lockScreen = document.getElementById('lockScreen');
  const lockTitle = document.getElementById('lockTitle');
  const lockSub = document.getElementById('lockSub');
  const lockInput = document.getElementById('lockInput');
  const lockBtn = document.getElementById('lockBtn');
  const lockError = document.getElementById('lockError');
  const appContent = document.getElementById('appContent');
  const lockIcon = document.getElementById('lockIcon');

  if (!lockScreen) return;

  // 设置锁屏 SVG 图标
  if (lockIcon) {
    lockIcon.innerHTML = iconLock(40);
  }

  // 已解锁则直接跳过
  if (localStorage.getItem(UNLOCK_KEY) === '1') {
    lockScreen.classList.add('hidden');
    if (appContent) appContent.classList.remove('hidden');
    if (typeof initApp === 'function') initApp();
    return;
  }

  let savedHash = localStorage.getItem(LOCK_STORAGE_KEY);

  // 首次使用：自动设置默认密码 555000
  if (!savedHash) {
    savedHash = await hashPassword('555000');
    localStorage.setItem(LOCK_STORAGE_KEY, savedHash);
  }

  lockTitle.textContent = '需要密码';
  lockSub.textContent = '输入密码以继续使用';

  const lockoutUntil = localStorage.getItem('ebp_lockout_until');
  if (lockoutUntil && Date.now() < parseInt(lockoutUntil)) {
    const remaining = Math.ceil((parseInt(lockoutUntil) - Date.now()) / 60000);
    lockError.textContent = '尝试次数过多，请 ' + remaining + ' 分钟后重试';
    lockInput.disabled = true;
    lockBtn.disabled = true;
    return;
  }

  let attempts = 0;

  lockBtn.addEventListener('click', async () => {
    const password = lockInput.value.trim();
    if (!password) {
      lockError.textContent = '请输入密码';
      return;
    }
    if (password.length < 2) {
      lockError.textContent = '密码至少2位';
      return;
    }

    const hash = await hashPassword(password);
    if (hash === savedHash) {
      localStorage.setItem(UNLOCK_KEY, '1');
      lockScreen.classList.add('hidden');
      if (appContent) appContent.classList.remove('hidden');
      localStorage.removeItem('ebp_lockout_until');
      if (typeof initApp === 'function') initApp();
    } else {
      attempts++;
      const remaining = MAX_ATTEMPTS - attempts;
      if (remaining <= 0) {
        const lockoutTime = Date.now() + LOCKOUT_DURATION;
        localStorage.setItem('ebp_lockout_until', lockoutTime.toString());
        lockError.textContent = '尝试次数过多，请30分钟后重试';
        lockInput.disabled = true;
        lockBtn.disabled = true;
      } else {
        lockError.textContent = '密码错误，还剩 ' + remaining + ' 次机会';
      }
      lockInput.value = '';
    }
  });

  lockInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') lockBtn.click();
  });
}
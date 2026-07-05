// lock.js - 密码锁屏
const LOCK_STORAGE_KEY = 'ebp_lock_password';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60 * 1000;

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'ebp_salt');
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function initLockScreen() {
  const lockScreen = document.getElementById('lockScreen');
  const lockTitle = document.getElementById('lockTitle');
  const lockSub = document.getElementById('lockSub');
  const lockInput = document.getElementById('lockInput');
  const lockBtn = document.getElementById('lockBtn');
  const lockError = document.getElementById('lockError');
  const lockReset = document.getElementById('lockReset');
  const appContent = document.getElementById('appContent');

  if (!lockScreen) return;

  const savedHash = localStorage.getItem(LOCK_STORAGE_KEY);
  const lockoutUntil = localStorage.getItem('ebp_lockout_until');

  let mode = savedHash ? 'unlock' : 'create';

  if (mode === 'unlock') {
    lockTitle.textContent = '需要密码';
    lockSub.textContent = '输入密码以继续使用';
    lockReset.style.display = 'block';
  }

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

    if (mode === 'create') {
      const hash = await hashPassword(password);
      localStorage.setItem(LOCK_STORAGE_KEY, hash);
      lockScreen.classList.add('hidden');
      if (appContent) appContent.classList.remove('hidden');
    } else {
      const hash = await hashPassword(password);
      if (hash === savedHash) {
        lockScreen.classList.add('hidden');
        if (appContent) appContent.classList.remove('hidden');
        localStorage.removeItem('ebp_lockout_until');
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
    }
  });

  lockInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') lockBtn.click();
  });

  lockReset.addEventListener('click', () => {
    if (confirm('重置密码将清除所有练习数据，确定继续吗？')) {
      localStorage.removeItem(LOCK_STORAGE_KEY);
      localStorage.removeItem('ebp_lockout_until');
      location.reload();
    }
  });
}
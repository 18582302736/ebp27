// app.js - 主入口

async function initApp() {
  await initStorage();

  // 同步指示器
  if (typeof updateSyncIndicator === 'function') {
    updateSyncIndicator();
    setInterval(updateSyncIndicator, 2000);
  }

  // 主题初始化
  const theme = getThemePreference();
  applyTheme(theme);

  // 顶部吸顶滚动效果
  const appHeader = document.querySelector('.app-header');
  if (appHeader) {
    window.addEventListener('scroll', () => {
      appHeader.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  // 主题切换
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.innerHTML = theme === 'dark' ? iconSun(20) : iconMoon(20);
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    setThemePreference(next);
    themeToggle.innerHTML = next === 'dark' ? iconSun(20) : iconMoon(20);
  });

  // 刷新按钮：清缓存 + 重新加载
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.innerHTML = iconRefresh(20);
    refreshBtn.addEventListener('click', async () => {
      if (!confirm('确定要刷新缓存并重新加载页面吗？')) return;
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(r => r.unregister()));
      } catch (e) {}
      window.location.href = window.location.href.split('?')[0] + '?t=' + Date.now();
    });
  }

  // 检查是否已经看过进入页
  const hasStarted = localStorage.getItem('ebp_has_started');

  // 后台同步：始终先拉取远程数据，后续渲染时等待同步完成
  let syncReady = Promise.resolve();
  if (typeof initSync === 'function') {
    syncReady = initSync().then(() => {
      updateSyncIndicator();
    }).catch(e => console.warn('Sync init failed:', e));
  }

  if (hasStarted) {
    showCalendar();
  } else {
    const entryPage = document.getElementById('entryPage');
    entryPage.style.display = 'flex';
    document.getElementById('startBtn').addEventListener('click', () => {
      localStorage.setItem('ebp_has_started', '1');
      entryPage.style.opacity = '0';
      entryPage.style.transition = 'opacity 0.3s ease';
      setTimeout(() => showCalendar(), 300);
    });
  }

  async function showCalendar() {
    const calendarPage = document.getElementById('calendarPage');
    const entryPage = document.getElementById('entryPage');
    entryPage.style.display = 'none';
    calendarPage.style.display = 'block';
    await syncReady;  // 等待同步完成，确保 IndexedDB 已有最新数据
    await renderCalendar();
  }
}
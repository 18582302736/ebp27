// day.js - 每日详情页

async function initApp() {
  try {
    await initStorage();

    // 同步指示器
    if (typeof updateSyncIndicator === 'function') {
      updateSyncIndicator();
      setInterval(updateSyncIndicator, 2000);
    }

    // 主题
    const theme = getThemePreference();
    applyTheme(theme);

    // 顶部吸顶滚动效果
    const appHeader = document.querySelector('.app-header');
    if (appHeader) {
      window.addEventListener('scroll', () => {
        appHeader.classList.toggle('scrolled', window.scrollY > 10);
      }, { passive: true });
    }

    const themeToggle = document.getElementById('themeToggle');
    themeToggle.innerHTML = theme === 'dark' ? iconSun(20) : iconMoon(20);
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      setThemePreference(next);
      themeToggle.innerHTML = next === 'dark' ? iconSun(20) : iconMoon(20);
    });

    // 刷新按钮
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

    // 设置返回图标
    const backIcon = document.getElementById('backIcon');
    if (backIcon) backIcon.innerHTML = iconArrowLeft(18);

    // 获取天数
    const day = parseInt(getQueryParam('day')) || 1;
    if (day < 1 || day > 25) {
      window.location.href = 'index.html';
      return;
    }

    const data = getCourseData(day);
    if (!data) {
      window.location.href = 'index.html';
      return;
    }

    // 检查是否可访问：锁定天数可查看但不可操作
    const maxAvailable = await getMaxAvailableDay();
    const isLocked = day > maxAvailable;

    const progress = await getProgress(day);

    // 渲染页面标题
    document.getElementById('dayTheme').textContent = `第${day}天：${data.theme}`;
    document.getElementById('daySubtitle').textContent = data.readingAudios[0].title;

    // 感官焦点标识
    if (data.sensory) {
      const badge = document.getElementById('sensoryBadge');
      badge.style.display = 'inline-flex';
      badge.innerHTML = `<span class="sensory-icon svg-icon">${getSensoryIcon(data.sensory.icon, 16)}</span><span class="sensory-label">今日感官焦点：${data.sensory.label}</span>`;
    }

    // 锁定状态提示
    if (isLocked) {
      const lockBanner = document.createElement('div');
      lockBanner.className = 'lock-banner';
      lockBanner.innerHTML = '<span class="svg-icon" style="display:inline-flex;vertical-align:middle;margin-right:4px;">' + iconLock(16) + '</span> 本日内容尚未解锁，请先完成前一天的所有任务';
      const taskList = document.getElementById('taskList');
      taskList.parentNode.insertBefore(lockBanner, taskList);
    }

    const taskList = document.getElementById('taskList');

    // 任务完成状态
    let task1Done = !!progress.task1_completed;
    let task2Done = !!progress.task2_completed;
    let task3Done = !!progress.task3_completed;
    const allDone = task1Done && task2Done && task3Done;

    // 检查所有任务是否完成，更新天状态
    async function checkAllDone() {
      if (task1Done && task2Done && task3Done) {
        progress.status = 'completed';
        await saveProgress(day, progress);

        // 解锁下一天
        if (day < 25) {
          const nextProgress = await getProgress(day + 1);
          if (nextProgress.status === 'locked') {
            nextProgress.status = 'available';
            await saveProgress(day + 1, nextProgress);
          }
        }
        showCompletion();
      }
    }

    // === 任务1：音频引导（支持多个音频） ===
    const readingAudios = data.readingAudios;
    const task1Desc = readingAudios.length > 1
      ? readingAudios.map(a => a.title).join(' + ')
      : readingAudios[0].title;
    const task1Card = createTaskCard(1, iconHeadphones(22), '音频引导', task1Desc, task1Done, progress.task1_completed);
    const task1Body = task1Card.querySelector('.task-body');

    if (isLocked) {
      task1Card.classList.add('locked');
      task1Body.innerHTML = '<div class="locked-hint">解锁后可播放音频</div>';
    } else {
      let completedCount = 0;
      const totalCount = readingAudios.length;

      readingAudios.forEach((audio, idx) => {
        createAudioPlayer(task1Body, audio.src, async () => {
          if (task1Done) return;
          completedCount++;
          if (completedCount >= totalCount) {
            task1Done = true;
            progress.task1_completed = new Date().toISOString();
            if (progress.status === 'available') progress.status = 'in_progress';
            await saveProgress(day, progress);
            updateTaskCardStatus(task1Card, true, progress.task1_completed);
            await checkAllDone();
          }
        });
      });
    }
    taskList.appendChild(task1Card);

    // === 任务2：书写练习 ===
    const task2Card = createTaskCard(2, iconPen(22), '书写练习', '记录你的练习心得', task2Done, progress.task2_completed);
    const task2Body = task2Card.querySelector('.task-body');

    if (isLocked) {
      task2Card.classList.add('locked');
      task2Body.innerHTML = '<div class="locked-hint">解锁后可书写练习</div>';
    } else {
      const journal = createJournal(task2Body, day, data.worksheet, async () => {
        if (task2Done) return;
        task2Done = true;
        progress.task2_completed = new Date().toISOString();
        if (progress.status === 'available') progress.status = 'in_progress';
        await saveProgress(day, progress);
        updateTaskCardStatus(task2Card, true, progress.task2_completed);
        await checkAllDone();
      });
    }
    taskList.appendChild(task2Card);

    // === 任务3：正念练习（支持多个音频） ===
    const mindfulnessAudios = data.mindfulnessAudios;
    const task3Desc = mindfulnessAudios.length > 1
      ? mindfulnessAudios.map(a => a.title).join(' + ')
      : mindfulnessAudios[0].title;
    const task3Card = createTaskCard(3, iconMeditation(22), '正念练习', task3Desc, task3Done, progress.task3_completed);
    const task3Body = task3Card.querySelector('.task-body');

    if (isLocked) {
      task3Card.classList.add('locked');
      task3Body.innerHTML = '<div class="locked-hint">解锁后可播放音频</div>';
    } else {
      let completedCount = 0;
      const totalCount = mindfulnessAudios.length;

      mindfulnessAudios.forEach((audio, idx) => {
        createAudioPlayer(task3Body, audio.src, async () => {
          if (task3Done) return;
          completedCount++;
          if (completedCount >= totalCount) {
            task3Done = true;
            progress.task3_completed = new Date().toISOString();
            if (progress.status === 'available') progress.status = 'in_progress';
            await saveProgress(day, progress);
            updateTaskCardStatus(task3Card, true, progress.task3_completed);
            await checkAllDone();
          }
        });
      });
    }
    taskList.appendChild(task3Card);

    // 如果已经全部完成，显示完成状态
    if (allDone) {
      showCompletion();
    }

    function showCompletion() {
      document.getElementById('completionBanner').classList.add('visible');
      const bannerIcon = document.getElementById('bannerIcon');
      if (bannerIcon) bannerIcon.innerHTML = iconStar(32);
      // 完成后返回首页
      const nextBtn = document.getElementById('nextDayBtn');
      nextBtn.href = 'index.html';
      nextBtn.textContent = '返回首页';
      nextBtn.classList.add('visible');
    }

    // === 手动同步功能 ===
    const detailSyncSection = document.getElementById('detailSyncSection');
    const detailSyncBtn = document.getElementById('detailSyncBtn');
    const detailSyncIcon = document.getElementById('detailSyncIcon');

    if (detailSyncSection && detailSyncBtn) {
      detailSyncSection.style.display = 'block'; // 总是显示按钮，提高功能发现性
      if (detailSyncIcon) detailSyncIcon.innerHTML = iconRefresh(16);

      detailSyncBtn.addEventListener('click', async () => {
        // 如果未配置 Token，提示并自动打开设置面板
        if (typeof hasGithubToken === 'function' && !hasGithubToken()) {
          showToast('请先配置 GitHub Token', 'warning');
          if (typeof openSettings === 'function') {
            openSettings();
          }
          return;
        }

        detailSyncBtn.disabled = true;
        const originalText = detailSyncBtn.innerHTML;
        detailSyncBtn.innerHTML = `<span class="svg-icon" style="margin-right:6px;animation:spin 1s linear infinite;">${iconRefresh(16)}</span>正在同步到云端...`;
        
        try {
          if (typeof syncNow === 'function') {
            await syncNow();
            showToast('保存成功，即将返回日历页', 'success');
            detailSyncBtn.innerHTML = `<span class="svg-icon" style="margin-right:6px;color:var(--success);">${iconCheck(16)}</span>保存成功！`;
            setTimeout(() => {
              window.location.href = 'index.html';
            }, 800);
          }
        } catch (e) {
          showToast('同步失败: ' + e.message, 'error');
          detailSyncBtn.innerHTML = `<span class="svg-icon" style="margin-right:6px;color:#c62828;">✕</span>同步失败，请重试`;
          detailSyncBtn.disabled = false;
          setTimeout(() => {
            detailSyncBtn.innerHTML = originalText;
          }, 3000);
        }
      });
    }

  } catch (e) {
    console.error('页面初始化失败:', e);
    const taskList = document.getElementById('taskList');
    if (taskList) {
      taskList.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-secondary);">页面加载失败：' + e.message + '<br><small>请尝试刷新页面</small></div>';
    }
  }
}

function createTaskCard(index, iconHtml, name, desc, done, completedDate) {
  const card = document.createElement('div');
  card.className = 'task-card';
  if (done) card.classList.add('completed');

  const dateHtml = done && completedDate
    ? `<div class="task-completed-date">完成于 ${formatDateWithWeekday(completedDate)}</div>`
    : '';
  const statusHtml = done ? `<div class="task-status-icon">${iconCheck(20)}</div>` : '';

  card.innerHTML = `
    <div class="task-card-header">
      <div class="task-icon">${iconHtml}</div>
      <div class="task-info">
        <div class="task-name">任务${index}：${name}</div>
        <div class="task-desc">${desc}</div>
        ${dateHtml}
      </div>
      ${statusHtml}
    </div>
    <div class="task-body"></div>
  `;

  return card;
}

function updateTaskCardStatus(card, done, completedDate) {
  if (done) {
    card.classList.add('completed');
    const statusIcon = card.querySelector('.task-status-icon');
    if (statusIcon) statusIcon.innerHTML = iconCheck(20);
    if (completedDate) {
      const taskInfo = card.querySelector('.task-info');
      let dateEl = card.querySelector('.task-completed-date');
      if (!dateEl) {
        dateEl = document.createElement('div');
        dateEl.className = 'task-completed-date';
        taskInfo.appendChild(dateEl);
      }
      dateEl.textContent = `完成于 ${formatDateWithWeekday(completedDate)}`;
    }
  }
}
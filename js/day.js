// day.js - 每日详情页（多课程支持）

const ICON_FN = {
  headphones: iconHeadphones,
  pen: iconPen,
  meditation: iconMeditation,
  book: iconBook,
  lightbulb: iconBulb
};

async function initApp() {
  try {
    await initStorage();

    if (typeof updateSyncIndicator === 'function') {
      updateSyncIndicator();
      setInterval(updateSyncIndicator, 2000);
    }

    const theme = getThemePreference();
    applyTheme(theme);

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

    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
      refreshBtn.innerHTML = iconRefresh(20);
      refreshBtn.addEventListener('click', async () => {
        if (!confirm('确定要刷新缓存并重新加载页面吗？')) return;
        try {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg && reg.active) { reg.active.postMessage({ type: 'CLEAR_CACHES' }); }
          const keys = await caches.keys();
          await Promise.all(keys.map(k => caches.delete(k)));
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map(r => r.unregister()));
          await new Promise(r => setTimeout(r, 300));
        } catch (e) {}
        window.location.replace(window.location.origin + window.location.pathname + '?v=' + Date.now());
      });
    }

    const backIcon = document.getElementById('backIcon');
    if (backIcon) backIcon.innerHTML = iconArrowLeft(18);

    setupPdfViewer();

    // 解析参数
    const day = parseInt(getQueryParam('day')) || 1;
    const courseId = getQueryParam('course') || 'ebp';
    const config = getCourseConfig(courseId);

    if (day < 1 || day > config.totalDays) {
      window.location.href = 'index.html';
      return;
    }

    const data = getCourseData(courseId, day);
    if (!data) {
      window.location.href = 'index.html';
      return;
    }

    // 检查课程是否解锁
    let courseLocked = false;
    if (config.unlockCondition) {
      const { courseId: reqCourseId, completedDays } = config.unlockCondition;
      const completed = await getCompletedCount(reqCourseId);
      if (completed < completedDays) {
        courseLocked = true;
      }
    }

    const maxAvailable = courseLocked ? 0 : await getMaxAvailableDay(courseId, config.totalDays);
    const isLocked = courseLocked || day > maxAvailable;
    const progress = await getProgress(courseId, day);

    // 更新返回链接
    const backBtn = document.querySelector('a.back-btn');
    if (backBtn) backBtn.href = `index.html?course=${courseId}`;

    // 渲染页面标题
    document.getElementById('dayTheme').textContent = `第${day}天：${data.theme}`;

    // 副标题：显示模块和陪伴者
    document.getElementById('daySubtitle').style.display = 'none';

    // 感官焦点（仅EBP有）
    const sensoryBadge = document.getElementById('sensoryBadge');
    if (data.sensory) {
      sensoryBadge.style.display = 'inline-flex';
      sensoryBadge.innerHTML = `<span class="sensory-icon svg-icon">${getSensoryIcon(data.sensory.icon, 16)}</span><span class="sensory-label">今日感官焦点：${data.sensory.label}</span>`;
    } else {
      sensoryBadge.style.display = 'none';
    }

    // 锁定状态提示
    if (isLocked) {
      const lockBanner = document.createElement('div');
      lockBanner.className = 'lock-banner';
      if (courseLocked) {
        const reqConfig = getCourseConfig(config.unlockCondition.courseId);
        lockBanner.innerHTML = '<span class="svg-icon" style="display:inline-flex;vertical-align:middle;margin-right:4px;">' + iconLock(16) + '</span> 本课程尚未解锁，请先完成「' + reqConfig.name + '」全部 ' + reqConfig.totalDays + ' 天后自动解锁';
      } else {
        lockBanner.innerHTML = '<span class="svg-icon" style="display:inline-flex;vertical-align:middle;margin-right:4px;">' + iconLock(16) + '</span> 本日内容尚未解锁，请先完成前一天的所有任务';
      }
      const taskList = document.getElementById('taskList');
      taskList.parentNode.insertBefore(lockBanner, taskList);
    }

    const taskList = document.getElementById('taskList');

    // 任务完成状态追踪
    const taskDone = {};
    config.taskKeys.forEach(key => {
      taskDone[key] = !!(progress[key + '_completed']);
    });

    const allDone = config.taskKeys.every(k => taskDone[k]);

    async function checkAllDone() {
      if (config.taskKeys.every(k => taskDone[k])) {
        progress.status = 'completed';
        await saveProgress(courseId, day, progress);
        if (day < config.totalDays) {
          const nextProgress = await getProgress(courseId, day + 1);
          if (nextProgress.status === 'locked') {
            nextProgress.status = 'available';
            await saveProgress(courseId, day + 1, nextProgress);
          }
        }
        // 完成最后一天时，解锁下一阶段课程
        if (day >= config.totalDays) {
          const nextCourse = COURSES.find(c =>
            c.unlockCondition && c.unlockCondition.courseId === courseId
          );
          if (nextCourse) {
            await unlockCourse(nextCourse.id);
          }
        }
      }
    }

    // 渲染每个任务
    config.taskKeys.forEach((taskKey, idx) => {
      const taskNum = idx + 1;
      const taskLabel = config.taskLabels[idx];
      const iconName = config.taskIcons[idx];
      const iconFn = ICON_FN[iconName] || iconPen;
      const completedKey = taskKey + '_completed';
      const taskDesc = getTaskDescription(courseId, data, taskKey);

      const card = createTaskCard(taskNum, iconFn(22), `任务${taskNum}：${taskLabel}`, taskDesc, taskDone[taskKey], progress[completedKey]);
      const taskBody = card.querySelector('.task-body');

      if (isLocked) {
        card.classList.add('locked');
        taskBody.innerHTML = '<div class="locked-hint">解锁后可操作</div>';
      } else {
        renderTaskBody(courseId, data, taskKey, taskBody, async () => {
          if (taskDone[taskKey]) return;
          taskDone[taskKey] = true;
          progress[completedKey] = new Date().toISOString();
          if (progress.status === 'available') progress.status = 'in_progress';
          await saveProgress(courseId, day, progress);
          updateTaskCardStatus(card, true, progress[completedKey]);
          await checkAllDone();
        });
      }

      taskList.appendChild(card);
    });

    // 全部完成时隐藏横幅
    if (allDone) {
      document.getElementById('completionBanner').classList.remove('visible');
      document.getElementById('nextDayBtn').classList.remove('visible');
    }

    function showResultOverlay() {
      const overlay = document.getElementById('resultOverlay');
      if (!overlay || overlay.style.display === 'flex') return;
      document.getElementById('resultTitle').textContent = `第${day}天完成：${data.theme}`;
      document.getElementById('resultSubtitle').textContent = `完成于 ${formatDateWithWeekday(new Date().toISOString())}`;
      const resultIcon = document.getElementById('resultIcon');
      if (resultIcon) resultIcon.innerHTML = iconStar(48);
      overlay.style.display = 'flex';
      document.getElementById('resultDetailBtn').addEventListener('click', () => {
        overlay.style.display = 'none';
      });
    }

    // 手动同步按钮
    const detailSyncSection = document.getElementById('detailSyncSection');
    const detailSyncBtn = document.getElementById('detailSyncBtn');
    const detailSyncIcon = document.getElementById('detailSyncIcon');

    if (detailSyncSection && detailSyncBtn) {
      detailSyncSection.style.display = 'block';
      if (detailSyncIcon) detailSyncIcon.innerHTML = iconRefresh(16);

      detailSyncBtn.addEventListener('click', async () => {
        if (typeof hasGithubToken === 'function' && !hasGithubToken()) {
          showToast('请先配置 GitHub Token', 'warning');
          if (typeof openSettings === 'function') openSettings();
          return;
        }
        detailSyncBtn.disabled = true;
        detailSyncBtn.innerHTML = `<span class="svg-icon" style="margin-right:6px;animation:spin 1s linear infinite;">${iconRefresh(16)}</span>正在同步到云端...`;

        try {
          if (typeof syncNow === 'function') {
            await syncNow();
            const allDoneNow = config.taskKeys.every(k => taskDone[k]);
            if (allDoneNow) {
              detailSyncBtn.innerHTML = `<span class="svg-icon" style="margin-right:6px;color:var(--success);">${iconCheck(16)}</span>提交成功！`;
              showResultOverlay();
            } else {
              showToast('进度已保存', 'success');
              detailSyncBtn.innerHTML = `<span class="svg-icon" style="margin-right:6px;color:var(--success);">${iconCheck(16)}</span>保存成功`;
            }
            detailSyncBtn.disabled = false;
          }
        } catch (e) {
          showToast('同步失败: ' + e.message, 'error');
          detailSyncBtn.innerHTML = `<span class="svg-icon" style="margin-right:6px;color:#c62828;">✕</span>同步失败，请重试`;
          detailSyncBtn.disabled = false;
          setTimeout(() => {
            detailSyncBtn.innerHTML = `<span class="svg-icon" style="margin-right:6px;">${iconRefresh(16)}</span>保存提交`;
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

// ── 任务描述 ──

function getTaskDescription(courseId, data, taskKey) {
  if (courseId === 'cbt') {
    switch (taskKey) {
      case 'task1':
        return '';
      case 'task2':
        return '';
    }
  }
  if (courseId === 'act') {
    switch (taskKey) {
      case 'task1':
        return '阅读今日陪伴者分享';
      case 'task2':
        return '完成今日书写练习';
    }
  }
  // EBP
  switch (taskKey) {
    case 'task1':
      if (data.readingAudios && data.readingAudios.length > 0) {
        return data.readingAudios.map(a => a.title).join(' + ');
      }
      return '听音频了解今日主题';
    case 'task2':
      return '记录你的练习心得';
    case 'task3':
      if (data.mindfulnessAudios && data.mindfulnessAudios.length > 0) {
        return data.mindfulnessAudios.map(a => a.title).join(' + ');
      }
      return '正念练习';
  }
  return '';
}

// ── 任务内容渲染 ──

function renderTaskBody(courseId, data, taskKey, container, onComplete) {
  if (courseId === 'cbt') {
    renderCBTTaskBody(courseId, data, taskKey, container, onComplete);
  } else if (courseId === 'act') {
    renderACTTaskBody(courseId, data, taskKey, container, onComplete);
  } else {
    renderEBPTaskBody(courseId, data, taskKey, container, onComplete);
  }
}

function renderEBPTaskBody(courseId, data, taskKey, container, onComplete) {
  const day = parseInt(getQueryParam('day')) || 1;
  if (taskKey === 'task1') {
    const audios = data.readingAudios || [];
    let completedCount = 0;
    audios.forEach(audio => {
      createAudioPlayer(container, audio.src, () => {
        completedCount++;
        if (completedCount >= audios.length) onComplete();
      });
    });
    if (audios.length === 0) {
      container.innerHTML = '<div class="locked-hint">暂无音频内容</div>';
    }
  } else if (taskKey === 'task2') {
    createJournal(container, courseId, day, data.worksheet, onComplete);
  } else if (taskKey === 'task3') {
    const audios = data.mindfulnessAudios || [];
    let completedCount = 0;
    audios.forEach(audio => {
      createAudioPlayer(container, audio.src, () => {
        completedCount++;
        if (completedCount >= audios.length) onComplete();
      });
    });
    if (audios.length === 0) {
      container.innerHTML = '<div class="locked-hint">暂无音频内容</div>';
    }
  }
}

function renderCBTTaskBody(courseId, data, taskKey, container, onComplete) {
  const day = parseInt(getQueryParam('day')) || 1;
  if (taskKey === 'task1') {
    renderLearningZone(container, data, onComplete);
  } else if (taskKey === 'task2') {
    const dayStr = String(day).padStart(2, '0');
    // 获取格式化后的书写模板/示例HTML
    const worksheetHtml = (typeof getCBTWorksheetHtml === 'function') ? getCBTWorksheetHtml(day) : null;
    const wsData = {
      src: 'assets/cbt/worksheet/day-' + dayStr + '.jpg',
      title: '第' + day + '天书写模板',
      prompt: '根据今日学习内容，完成书写练习',
      prompts: data.worksheetPrompts || null,
      worksheetHtml: worksheetHtml,
      writingGuideAudio: data.writingGuideAudio || null
    };
    createJournal(container, courseId, day, wsData, onComplete);
  }
}

function renderACTTaskBody(courseId, data, taskKey, container, onComplete) {
  const day = parseInt(getQueryParam('day')) || 1;
  if (taskKey === 'task1') {
    renderACTGuideZone(container, data, onComplete);
  } else if (taskKey === 'task2') {
    const worksheetHtml = (typeof getACTWorksheetHtml === 'function') ? getACTWorksheetHtml(day) : null;
    const wsData = {
      src: null,
      title: '第' + day + '天书写练习',
      prompt: '根据今日学习内容，完成书写练习',
      prompts: data.worksheetPrompts || null,
      worksheetHtml: worksheetHtml
    };
    createJournal(container, courseId, day, wsData, onComplete);
  }
}

// ── ACT 阅读指南区 ──

function renderACTGuideZone(container, data, onComplete) {
  const wrapper = document.createElement('div');
  wrapper.className = 'learning-zone';

  let html = '';

  if (typeof ACT_GUIDE_TEXTS !== 'undefined') {
    const guideText = ACT_GUIDE_TEXTS[data.day];
    if (guideText) {
      html += '<div class="learning-text">'
        + '<div class="learning-text-header">'
        + '<span class="svg-icon">' + iconBook(16) + '</span> 阅读指南'
        + '</div>'
        + '<div class="learning-text-body learning-text-html">' + guideText + '</div>'
        + '</div>';
    }
  }

  html += '<button class="btn btn-primary learning-done-btn">'
    + '<span class="svg-icon">' + iconCheck(16) + '</span> 完成阅读，开始书写'
    + '</button>';

  wrapper.innerHTML = html;
  container.appendChild(wrapper);

  const doneBtn = wrapper.querySelector('.learning-done-btn');
  doneBtn.addEventListener('click', () => {
    doneBtn.disabled = true;
    doneBtn.innerHTML = '<span class="svg-icon">' + iconCheck(16) + '</span> 已完成';
    doneBtn.classList.add('done');
    onComplete();
  });
}

// ── 纯文本 → 格式化 HTML（用于 Days 4-21 的 OCR 文本自动排版）──

function formatPlainGuideText(rawText) {
  // 去掉开头的乱码标题行（如 "和4 书写指南"）
  let text = rawText.replace(/^[^\n]{1,20}书写指南\n+/, '');

  // 将 3+ 换行统一为段落分隔符
  text = text.replace(/\n{3,}/g, '\n\n');

  const blocks = text.split(/\n\n/);
  let html = '<div class="guide-content"><div class="guide-section">';
  let inList = false;

  const HEADERS = /^(今日书写|书写指南|陪伴者分享|瞳伴者分享|CBT.*知识|《CU.*|拓展阅读|模块小结|总结)/;

  for (let i = 0; i < blocks.length; i++) {
    let b = blocks[i].trim();
    if (!b) continue;

    // 合并 OCR 单行换行（中文不需要空格）
    b = b.replace(/\n/g, '');

    // 修正常见 OCR 识别错误
    b = b.replace(/瞳伴者/g, '陪伴者').replace(/情结/g, '情绪').replace(/关要的/g, '关爱的').replace(/罗浩贯/g, '罗浩贤').replace(/暂壤/g, '暂停');

    // 跳过无意义的 OCR 碎片
    if (b.length < 2) continue;

    // 检测段落标题
    if (HEADERS.test(b) || (b.length <= 25 && i < 3 && !/[，。；]/.test(b))) {
      if (inList) { html += '</ul>'; inList = false; }
      html += '<h3>' + b.replace(/^瞳伴者分享/, '陪伴者分享').replace(/^《CU.*/, 'CBT知识分享') + '</h3>';
      continue;
    }

    // 检测副标题（短行 + 以冒号结尾）
    if (b.length <= 40 && /[：:]$/.test(b) && !/[，。]/.test(b)) {
      if (inList) { html += '</ul>'; inList = false; }
      html += '<h4>' + b + '</h4>';
      continue;
    }

    // 检测列表项（以 。 或 · 开头）
    if (/^[。·•▪▸☞]/.test(b)) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += '<li>' + b.replace(/^[。·•▪▸☞]\s*/, '') + '</li>';
      continue;
    }

    // 普通段落
    if (inList) { html += '</ul>'; inList = false; }
    html += '<p>' + b + '</p>';
  }

  if (inList) { html += '</ul>'; }
  html += '</div></div>';
  return html;
}

// ── 学习任务区：文字内容 + 结构图（一体化排版）──

function renderLearningZone(container, data, onComplete) {
  const wrapper = document.createElement('div');
  wrapper.className = 'learning-zone';

  let html = '';

  // 音频播放器（仅原始录音 .mp3，跳过 AI 生成的 .m4a）
  const hasMainAudio = data.audio && data.audio.src && data.audio.src.endsWith('.mp3');
  if (hasMainAudio) {
    html += '<div class="learning-audio">'
      + '<div class="learning-audio-header">'
      + '<span class="svg-icon">' + iconHeadphones(16) + '</span> ' + (data.audio.title || '音频引导')
      + '</div>'
      + '<div class="audio-placeholder"></div>'
      + '</div>';
  }

  // 指南文字内容
  if (typeof CBT_GUIDE_TEXTS !== 'undefined') {
    let guideText = CBT_GUIDE_TEXTS[data.day];
    if (guideText) {
      const isHtml = guideText.trim().startsWith('<div');
      if (!isHtml) {
        guideText = formatPlainGuideText(guideText);
      }
      html += '<div class="learning-text">'
        + '<div class="learning-text-header">'
        + '<span class="svg-icon">' + iconBook(16) + '</span> 阅读指南'
        + '</div>'
        + '<div class="learning-text-body learning-text-html">' + guideText + '</div>'
        + '</div>';
    }
  }

  // 拓展资源（折叠在底部，原始 .mp3 显示音频播放器）
  if (data.extendedResources && data.extendedResources.length > 0) {
    html += '<details class="learning-extended">'
      + '<summary><span class="svg-icon">' + iconBulb(16) + '</span> 拓展资源（' + data.extendedResources.length + '个）</summary>'
      + '<div class="learning-extended-body">';
    data.extendedResources.forEach(r => {
      html += '<div class="learning-extended-item">'
        + '<span class="learning-extended-title">' + r.title + '</span>';
      if (r.src && r.src.endsWith('.mp3')) {
        html += '<div class="audio-placeholder"></div>';
      }
      html += '</div>';
    });
    html += '</div></details>';
  }

  // 完成按钮
  html += '<button class="btn btn-primary learning-done-btn">'
    + '<span class="svg-icon">' + iconCheck(16) + '</span> 完成学习，开始书写'
    + '</button>';

  wrapper.innerHTML = html;
  container.appendChild(wrapper);

  // 初始化音频播放器（.mp3 原始录音）
  if (hasMainAudio) {
    const mainPlaceholder = wrapper.querySelector('.learning-audio .audio-placeholder');
    if (mainPlaceholder) {
      createAudioPlayer(mainPlaceholder, data.audio.src, () => {});
    }
  }
  const mp3Extended = data.extendedResources ? data.extendedResources.filter(r => r.src && r.src.endsWith('.mp3')) : [];
  const extendedPlaceholders = wrapper.querySelectorAll('.learning-extended-body .audio-placeholder');
  extendedPlaceholders.forEach((ph, i) => {
    if (i < mp3Extended.length) createAudioPlayer(ph, mp3Extended[i].src, () => {});
  });

  // 完成按钮
  const doneBtn = wrapper.querySelector('.learning-done-btn');
  doneBtn.addEventListener('click', () => {
    doneBtn.disabled = true;
    doneBtn.innerHTML = '<span class="svg-icon">' + iconCheck(16) + '</span> 已完成';
    doneBtn.classList.add('done');
    onComplete();
  });
}

// ── 任务卡片 UI ──

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
        <div class="task-name">${name}</div>
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

// ── 书写指南查看器 ──

let _guideOverlayReady = false;

function setupPdfViewer() {
  if (_guideOverlayReady) return;
  const overlay = document.getElementById('guideOverlay');
  if (!overlay) return;

  document.getElementById('guideClose').addEventListener('click', closePdfViewer);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePdfViewer();
  });

  _guideOverlayReady = true;
}

function openPdfViewer(src, title, day) {
  const overlay = document.getElementById('guideOverlay');
  if (!overlay) { window.open(src, '_blank', 'noopener'); return; }

  document.getElementById('guideTitle').textContent = title || '阅读指南';
  document.getElementById('guideExternalLink').href = src;

  const article = document.getElementById('guideArticle');
  const frame = document.getElementById('guideFrame');
  const loading = document.getElementById('guideLoading');

  const textContent = (typeof getWorksheetText === 'function' && day) ? getWorksheetText(day) : null;

  const extLink = document.getElementById('guideExternalLink');
  const footer = extLink ? extLink.parentNode : null;
  if (loading) loading.style.display = 'none';

  if (textContent) {
    frame.style.display = 'none';
    article.style.display = '';
    let formatted = textContent
      .replace(/【第\d+页】/g, '')
      .replace(/\/\s*([^\/\n]+?)\s*([\n\/])/g, '<h3>$1</h3>')
      .replace(/\n{2,}/g, '\n\n');
    article.innerHTML = formatted;
    if (footer) footer.style.display = src ? '' : 'none';
  } else if (src) {
    article.style.display = 'none';
    frame.style.display = 'none';
    frame.src = src;
    frame.addEventListener('load', () => {
      frame.style.display = '';
    }, { once: true });
    if (loading) loading.style.display = '';
    if (footer) footer.style.display = '';
  } else {
    article.style.display = '';
    article.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px 0;">本日无阅读指南，请根据提示自由练习</p>';
    if (footer) footer.style.display = 'none';
  }

  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closePdfViewer() {
  const overlay = document.getElementById('guideOverlay');
  if (!overlay) return;
  overlay.style.display = 'none';
  document.body.style.overflow = '';
  const frame = document.getElementById('guideFrame');
  if (frame) frame.src = '';
}

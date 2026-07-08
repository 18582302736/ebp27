// app.js - 主入口

let currentCourseId = null;

async function initApp() {
  await initStorage();

  // 同步指示器
  if (typeof updateSyncIndicator === 'function') {
    updateSyncIndicator();
    setInterval(updateSyncIndicator, 2000);
  }

  // 主题
  const theme = getThemePreference();
  applyTheme(theme);

  // 共享头部吸顶效果
  const appHeader = document.getElementById('appHeader');
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

  // 刷新按钮
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

  // 后台同步（不阻塞页面渲染）
  if (typeof initSync === 'function') {
    initSync().then(() => {
      if (typeof updateSyncIndicator === 'function') updateSyncIndicator();
    }).catch(e => console.warn('Sync init failed:', e));
  }

  // 检查是否首次使用
  const hasStarted = localStorage.getItem('ebp_has_started');

  if (hasStarted) {
    showSharedHeader();
    // 检查是否从任务详情页返回，直接跳转到对应日历
    const params = new URLSearchParams(window.location.search);
    const courseParam = params.get('course');
    if (courseParam) {
      selectCourse(courseParam);
    } else {
      await showCourses();
    }
  } else {
    showEntryPage();
  }
}

function showEntryPage() {
  const entryPage = document.getElementById('entryPage');
  entryPage.style.display = 'flex';
  document.getElementById('startBtn').addEventListener('click', async () => {
    localStorage.setItem('ebp_has_started', '1');
    entryPage.style.opacity = '0';
    entryPage.style.transition = 'opacity 0.3s ease';
    setTimeout(async () => {
      entryPage.style.display = 'none';
      showSharedHeader();
      await showCourses();
    }, 300);
  });
}

function showSharedHeader() {
  document.getElementById('appHeader').style.display = 'flex';
}

// ── 课程选择页 ──

async function showCourses() {
  hideAllPages();
  document.getElementById('coursePage').style.display = 'block';

  const backBtn = document.getElementById('backToCourses');
  if (backBtn) backBtn.style.display = 'none';
  document.querySelector('.app-title').textContent = 'AnxietyHeal For TT';

  await renderCourseCards();
}

async function renderCourseCards() {
  const list = document.getElementById('courseList');
  list.innerHTML = '';

  for (const config of COURSES) {
    const card = document.createElement('div');
    card.className = 'course-card';

    let status = 'locked';
    if (config.id === COURSE_EBP) {
      status = 'unlocked';
    } else if (config.unlockCondition) {
      const { courseId, completedDays } = config.unlockCondition;
      const completed = await getCompletedCount(courseId);
      if (completed >= completedDays) {
        status = 'unlocked';
      } else {
        // 检查是否通过跨课程解锁机制手动解锁
        const day1 = await getProgress(config.id, 1);
        if (day1 && day1.status === 'available') {
          status = 'unlocked';
        }
      }
    }

    // 再检查课程本身的进度
    let completedCount = 0;
    let courseStatus = 'available';
    if (status === 'unlocked') {
      completedCount = await getCompletedCount(config.id);
      courseStatus = await getCourseStatus(config.id, config.totalDays);
    }

    // 卡片整体状态
    let cardStatus = status === 'locked' ? 'locked' : 'unlocked';
    if (cardStatus === 'unlocked' && courseStatus === 'completed') {
      cardStatus = 'completed';
    } else if (cardStatus === 'unlocked' && completedCount > 0) {
      cardStatus = 'in-progress';
    }

    const progressPercent = config.totalDays > 0 ? Math.round((completedCount / config.totalDays) * 100) : 0;

    card.innerHTML = `
      <div class="course-card-inner" data-course="${config.id}">
        <div class="course-card-top">
          <div class="course-card-icon" style="background:${config.color}18; color:${config.color};"><span class="svg-icon" style="display:inline-flex;">${config.icon && window[config.icon] ? window[config.icon](22) : iconStar(22)}</span></div>
          <div class="course-card-header">
            <h3 class="course-card-name">${config.name}</h3>
            <span class="course-card-subtitle">${config.subtitle}</span>
          </div>
          ${cardStatus === 'locked' ? '<div class="course-card-lock">' + iconLock(20) + '</div>' : ''}
          ${cardStatus === 'completed' ? '<div class="course-card-badge">' + iconCheck(20) + '</div>' : ''}
        </div>
        <p class="course-card-desc">${config.description}</p>
        <div class="course-card-bottom">
          ${cardStatus === 'locked'
            ? '<span class="course-card-status locked">完成「' + getCourseConfig(config.unlockCondition.courseId).name + '」后解锁</span>'
            : cardStatus === 'completed'
              ? '<span class="course-card-status completed">已完成 ' + config.totalDays + ' 天</span>'
              : '<span class="course-card-status active">已坚持 ' + completedCount + '/' + config.totalDays + ' 天</span>'
          }
          ${cardStatus !== 'locked' ? `
            <div class="course-mini-progress">
              <div class="course-mini-progress-fill" style="width:${progressPercent}%;background:${config.color};"></div>
            </div>
          ` : ''}
        </div>
        ${cardStatus === 'locked' ? '<div class="course-card-overlay"></div>' : ''}
      </div>
    `;

    if (cardStatus !== 'locked') {
      card.querySelector('.course-card-inner').addEventListener('click', () => {
        selectCourse(config.id);
      });
    } else {
      card.querySelector('.course-card-inner').addEventListener('click', () => {
        const requiredCourse = getCourseConfig(config.unlockCondition.courseId);
        showToast('请先完成「' + requiredCourse.name + '」后自动解锁，加油！', 'warning');
      });
    }

    list.appendChild(card);
  }
}

function selectCourse(courseId) {
  currentCourseId = courseId;
  showCalendar(courseId);
}

// ── 日历页 ──

async function showCalendar(courseId) {
  hideAllPages();
  document.getElementById('calendarPage').style.display = 'block';

  // 显示返回按钮
  let backBtn = document.getElementById('backToCourses');
  if (!backBtn) {
    backBtn = document.createElement('button');
    backBtn.id = 'backToCourses';
    backBtn.className = 'back-btn-header';
    backBtn.innerHTML = iconArrowLeft(18);
    const headerLeft = document.querySelector('.header-left');
    if (!headerLeft) {
      const left = document.createElement('div');
      left.className = 'header-left';
      const title = document.querySelector('.app-header .app-title');
      title.parentNode.insertBefore(left, title);
      left.appendChild(backBtn);
      left.appendChild(title);
    } else if (!headerLeft.querySelector('#backToCourses')) {
      headerLeft.insertBefore(backBtn, headerLeft.firstChild);
    }
  }
  backBtn.style.display = 'flex';
  backBtn.onclick = () => {
    backBtn.style.display = 'none';
    showCourses();
  };

  const config = getCourseConfig(courseId);
  document.querySelector('.app-title').textContent = config.name;

  await renderCalendar(courseId);
}

function hideAllPages() {
  ['entryPage', 'coursePage', 'calendarPage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}

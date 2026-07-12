// app.js - 主入口

let currentCourseId = null;

async function initApp() {
  await initStorage();

  if (typeof updateBackupIndicator === 'function') updateBackupIndicator();

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

  const collectionBtn = document.getElementById('collectionBtn');
  if (collectionBtn) {
    collectionBtn.innerHTML = iconCollection(20);
    collectionBtn.title = '我的练习图鉴';
    collectionBtn.addEventListener('click', showCollection);
  }

  // 页脚强制刷新：低频操作不占用顶部空间
  document.querySelectorAll('.footer-refresh').forEach(refreshBtn => {
    refreshBtn.addEventListener('click', async () => {
      if (!confirm('确定要强制更新应用吗？这只会清除应用代码缓存，不会删除你的书写和照片。')) return;
      refreshBtn.disabled = true;
      try {
        await forceUpdateAppCache();
      } catch (e) {
        window.location.reload();
      }
    });
  });

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

async function showCollection() {
  hideAllPages();
  document.getElementById('collectionPage').style.display = 'block';
  document.querySelector('.app-title').textContent = '我的练习图鉴';
  let backBtn = document.getElementById('backToCourses');
  if (!backBtn) {
    backBtn = document.createElement('button');
    backBtn.id = 'backToCourses';
    backBtn.className = 'back-btn-header';
    backBtn.innerHTML = iconArrowLeft(18);
    const left = document.createElement('div');
    left.className = 'header-left';
    const title = document.querySelector('.app-header .app-title');
    title.parentNode.insertBefore(left, title);
    left.appendChild(backBtn);
    left.appendChild(title);
  }
  backBtn.style.display = 'flex';
  backBtn.onclick = () => { backBtn.style.display = 'none'; showCourses(); };
  await renderCardCollection(document.getElementById('cardCollection'));
}

async function renderCourseCards() {
  const list = document.getElementById('courseList');
  list.innerHTML = '';
  let resumeTarget = null;

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
      if (!resumeTarget && courseStatus !== 'completed') {
        const day = await getMaxAvailableDay(config.id, config.totalDays);
        const dayProgress = await getProgress(config.id, day);
        const completedTasks = config.taskKeys.filter(key => dayProgress && dayProgress[key + '_completed']).length;
        resumeTarget = { config, day, completedTasks };
      }
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

  renderResumeCard(resumeTarget);
}

function renderResumeCard(target) {
  const card = document.getElementById('resumeCard');
  if (!card) return;
  if (!target) {
    card.style.display = 'none';
    return;
  }
  card.href = `day.html?course=${target.config.id}&day=${target.day}`;
  document.getElementById('resumeCardTitle').textContent = `继续第 ${target.day} 天`;
  document.getElementById('resumeCardMeta').textContent = target.config.name + (target.completedTasks ? ` · 已完成 ${target.completedTasks}/${target.config.taskKeys.length} 项` : ' · 今天从这里开始');
  document.getElementById('resumeCardArrow').innerHTML = iconArrowRight(18);
  card.style.display = 'flex';
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
  ['entryPage', 'coursePage', 'calendarPage', 'collectionPage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}

// day.js - 每日详情页

async function initApp() {
  await initStorage();

  // 主题
  const theme = getThemePreference();
  applyTheme(theme);

  document.getElementById('themeToggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    setThemePreference(next);
  });

  // 获取天数
  const day = parseInt(getQueryParam('day')) || 1;
  if (day < 1 || day > 27) {
    window.location.href = '/';
    return;
  }

  const data = getCourseData(day);
  if (!data) {
    window.location.href = '/';
    return;
  }

  // 检查是否可访问
  const maxAvailable = await getMaxAvailableDay();
  if (day > maxAvailable) {
    window.location.href = '/';
    return;
  }

  const progress = await getProgress(day);

  // 渲染页面标题
  document.getElementById('dayTheme').textContent = `第${day}天：${data.theme}`;
  document.getElementById('daySubtitle').textContent = data.readingAudio.title;

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
      if (day < 27) {
        const nextProgress = await getProgress(day + 1);
        if (nextProgress.status === 'locked') {
          nextProgress.status = 'available';
          await saveProgress(day + 1, nextProgress);
        }
      }
      showCompletion();
    }
  }

  // === 任务1：音频引导 ===
  const task1Card = createTaskCard(1, '🎧', '音频引导', data.readingAudio.title, task1Done);
  const task1Body = task1Card.querySelector('.task-body');

  if (!task1Done) {
    createAudioPlayer(task1Body, data.readingAudio.src, async () => {
      task1Done = true;
      progress.task1_completed = new Date().toISOString();
      if (progress.status === 'available') progress.status = 'in_progress';
      await saveProgress(day, progress);
      updateTaskCardStatus(task1Card, true);
      await checkAllDone();
    });
  }
  taskList.appendChild(task1Card);

  // === 任务2：书写练习 ===
  const task2Card = createTaskCard(2, '✍️', '书写练习', '记录你的练习心得', task2Done);
  const task2Body = task2Card.querySelector('.task-body');

  const journal = createJournal(task2Body, day, data.worksheet);

  if (!task2Done) {
    const completeBtn = document.createElement('button');
    completeBtn.className = 'btn btn-primary';
    completeBtn.textContent = '标记书写完成';
    completeBtn.style.marginTop = '12px';
    completeBtn.addEventListener('click', async () => {
      await journal.save();
      task2Done = true;
      progress.task2_completed = new Date().toISOString();
      if (progress.status === 'available') progress.status = 'in_progress';
      await saveProgress(day, progress);
      updateTaskCardStatus(task2Card, true);
      completeBtn.remove();
      await checkAllDone();
    });
    task2Body.appendChild(completeBtn);
  }
  taskList.appendChild(task2Card);

  // === 任务3：正念练习 ===
  const task3Card = createTaskCard(3, '🧘', '正念练习', data.mindfulnessAudio.title, task3Done);
  const task3Body = task3Card.querySelector('.task-body');

  if (!task3Done) {
    createAudioPlayer(task3Body, data.mindfulnessAudio.src, async () => {
      task3Done = true;
      progress.task3_completed = new Date().toISOString();
      if (progress.status === 'available') progress.status = 'in_progress';
      await saveProgress(day, progress);
      updateTaskCardStatus(task3Card, true);
      await checkAllDone();
    });
  }
  taskList.appendChild(task3Card);

  // 如果已经全部完成，显示完成状态
  if (allDone) {
    showCompletion();
  }

  function showCompletion() {
    document.getElementById('completionBanner').classList.add('visible');
    if (day < 27) {
      const nextBtn = document.getElementById('nextDayBtn');
      nextBtn.href = `/day.html?day=${day + 1}`;
      nextBtn.classList.add('visible');
    }
  }
}

function createTaskCard(index, icon, name, desc, done) {
  const card = document.createElement('div');
  card.className = 'task-card';
  if (done) card.classList.add('completed');

  card.innerHTML = `
    <div class="task-card-header">
      <div class="task-icon">${icon}</div>
      <div class="task-info">
        <div class="task-name">任务${index}：${name}</div>
        <div class="task-desc">${desc}</div>
      </div>
      <div class="task-status-icon">${done ? '✅' : ''}</div>
    </div>
    <div class="task-body"></div>
  `;

  return card;
}

function updateTaskCardStatus(card, done) {
  if (done) {
    card.classList.add('completed');
    const statusIcon = card.querySelector('.task-status-icon');
    if (statusIcon) statusIcon.textContent = '✅';
  }
}
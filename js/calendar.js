// calendar.js - 日历首页渲染

const PHASES = [
  { name: "觉察 · 投入当下", range: "Day 1-7", days: [1, 7], cssClass: "phase-1" },
  { name: "接纳 · 认识情绪", range: "Day 8-13", days: [8, 13], cssClass: "phase-2" },
  { name: "行动 · 向价值方向", range: "Day 14-25", days: [14, 25], cssClass: "phase-3" }
];

function renderPhaseStrip() {
  const strip = document.getElementById('phaseStrip');
  if (!strip) return;

  strip.innerHTML = PHASES.map(p => `
    <div class="phase-segment ${p.cssClass}">
      <div class="phase-name">${p.name}</div>
      <div class="phase-range">${p.range}</div>
    </div>
  `).join('');
}

async function renderCalendar() {
  renderPhaseStrip();

  const allProgress = await getAllProgress();
  const completedCount = await getCompletedCount();
  const maxAvailable = await getMaxAvailableDay();

  // 更新进度条
  const progress = completedCount / 25;
  const barFill = document.getElementById('progressBarFill');
  barFill.style.width = `${progress * 100}%`;
  document.getElementById('progressCount').textContent = `${completedCount}/25`;

  // 渲染日历网格
  const grid = document.getElementById('calendarGrid');
  grid.innerHTML = '';

  for (let d = 1; d <= 25; d++) {
    const cell = document.createElement('div');
    cell.className = 'day-cell';

    const p = allProgress[d];

    // 确定状态
    let status = 'locked';
    if (d < maxAvailable) status = 'completed';
    else if (d === maxAvailable) {
      if (p && p.status === 'completed') status = 'completed';
      else if (p && (p.task1_completed || p.task2_completed || p.task3_completed)) status = 'in-progress';
      else status = 'today';
    }

    if (status === 'completed') {
      cell.classList.add('completed');
      cell.innerHTML = `<span class="day-num">${d}</span><span class="day-icon">✓</span>`;
    } else if (status === 'in-progress') {
      cell.classList.add('in-progress');
      cell.innerHTML = `<span class="day-num">${d}</span><span class="day-label">进行中</span>`;
    } else if (status === 'locked') {
      cell.classList.add('locked');
      cell.innerHTML = `<span class="day-num">${d}</span><span class="day-icon">🔒</span>`;
    } else {
      // today / available
      cell.classList.add('today');
      cell.innerHTML = `<span class="day-num">${d}</span><span class="day-label">今天</span>`;
    }

    // 所有天数都可以点击（锁定天数也可查看内容，但任务不可操作）
    cell.addEventListener('click', () => {
      window.location.href = `day.html?day=${d}`;
    });

    grid.appendChild(cell);
  }
}
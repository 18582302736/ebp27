// calendar.js - 日历首页渲染

const PHASES = [
  { name: "觉察 · 投入当下", range: "Day 1-8", days: [1, 8], cssClass: "phase-1" },
  { name: "接纳 · 认识情绪", range: "Day 9-14", days: [9, 14], cssClass: "phase-2" },
  { name: "行动 · 向价值方向", range: "Day 15-27", days: [15, 27], cssClass: "phase-3" }
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

  // 更新进度环
  const circumference = 276.46;
  const progress = completedCount / 27;
  const offset = circumference * (1 - progress);
  const ring = document.getElementById('progressRing');
  ring.style.strokeDashoffset = offset;
  document.getElementById('progressNum').textContent = `${completedCount}/27`;

  // 渲染日历网格
  const grid = document.getElementById('calendarGrid');
  grid.innerHTML = '';

  for (let d = 1; d <= 27; d++) {
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

    // 高亮今天
    if (d === maxAvailable && status !== 'completed' && status !== 'in-progress') {
      cell.classList.add('today');
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
      cell.innerHTML = `<span class="day-num">${d}</span><span class="day-label">今天</span>`;
    }

    if (status !== 'locked') {
      cell.addEventListener('click', () => {
        window.location.href = `/day.html?day=${d}`;
      });
    }

    grid.appendChild(cell);
  }
}
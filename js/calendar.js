// calendar.js - 日历首页渲染

const PHASES = [
  { name: "觉察 · 投入当下", range: "Day 1-7", start: 1, end: 7, cssClass: "phase-1", gridId: "phase1Grid" },
  { name: "接纳 · 认识情绪", range: "Day 8-12", start: 8, end: 12, cssClass: "phase-2", gridId: "phase2Grid" },
  { name: "行动 · 向价值方向", range: "Day 13-25", start: 13, end: 25, cssClass: "phase-3", gridId: "phase3Grid" }
];

function getCompletedDate(progress) {
  if (!progress) return null;
  const dates = [progress.task1_completed, progress.task2_completed, progress.task3_completed].filter(Boolean);
  if (dates.length === 0) return null;
  const latest = dates.sort().reverse()[0];
  const d = new Date(latest);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

async function renderCalendar() {
  const allProgress = await getAllProgress();
  const completedCount = await getCompletedCount();
  const maxAvailable = await getMaxAvailableDay();

  // 更新进度条
  const progress = completedCount / 25;
  const barFill = document.getElementById('progressBarFill');
  barFill.style.width = `${progress * 100}%`;
  document.getElementById('progressCount').textContent = `${completedCount}/25`;

  // 渲染三个阶段
  PHASES.forEach(phase => {
    const grid = document.getElementById(phase.gridId);
    if (!grid) return;
    grid.innerHTML = '';

    for (let d = phase.start; d <= phase.end; d++) {
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
        const completedDate = getCompletedDate(p);
        const dateLabel = completedDate ? `<span class="day-label">${completedDate}</span>` : '';
        cell.innerHTML = `<span class="day-num">${d}</span><span class="day-icon">${iconCheck(18)}</span>${dateLabel}`;
      } else if (status === 'in-progress') {
        cell.classList.add('in-progress');
        cell.innerHTML = `<span class="day-num">${d}</span><span class="day-label">进行中</span>`;
      } else if (status === 'locked') {
        cell.classList.add('locked');
        cell.innerHTML = `<span class="day-num">${d}</span><span class="day-icon">${iconLock(18)}</span>`;
      } else {
        cell.classList.add('today');
        cell.innerHTML = `<span class="day-num">${d}</span><span class="day-label">今天</span>`;
      }

      cell.addEventListener('click', () => {
        window.location.href = `day.html?day=${d}`;
      });

      grid.appendChild(cell);
    }
  });
}
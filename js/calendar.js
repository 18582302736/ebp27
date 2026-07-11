// calendar.js - 日历首页渲染（多课程支持）

function getCompletedDate(progress) {
  if (!progress) return null;
  const dates = [progress.task1_completed, progress.task2_completed, progress.task3_completed, progress.task4_completed].filter(Boolean);
  if (dates.length === 0) return null;
  const latest = dates.sort().reverse()[0];
  const d = new Date(latest);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

async function renderCalendar(courseId) {
  const config = getCourseConfig(courseId);
  const allProgress = await getAllProgress(courseId);
  const completedCount = await getCompletedCount(courseId);
  const maxAvailable = await getMaxAvailableDay(courseId, config.totalDays);

  // 更新进度条
  const progress = completedCount / config.totalDays;
  const barFill = document.getElementById('progressBarFill');
  barFill.style.width = `${progress * 100}%`;
  document.getElementById('progressCount').textContent = `${completedCount}/${config.totalDays}`;

  // 更新进度条颜色
  barFill.style.background = config.color;

  // 渲染阶段
  const section = document.querySelector('.calendar-section');
  section.innerHTML = '';

  config.phases.forEach((phase, idx) => {
    const block = document.createElement('div');
    block.className = 'phase-block phase-' + (idx + 1);

    let gridHTML = '';
    for (let d = phase.start; d <= phase.end; d++) {
      const p = allProgress[d];
      let status = 'locked';
      if (d < maxAvailable) status = 'completed';
      else if (d === maxAvailable) {
        if (p && p.status === 'completed') status = 'completed';
        else if (p && (p.task1_completed || p.task2_completed || p.task3_completed || p.task4_completed)) status = 'in-progress';
        else status = 'today';
      }

      let cellHTML = '';
      const dayNum = `<span class="day-num">${d}</span>`;

      if (status === 'completed') {
        const date = getCompletedDate(p);
        const dateLabel = date ? `<span class="day-label">${date}</span>` : '';
        cellHTML = `${dayNum}<span class="day-icon">${iconCheck(18)}</span>${dateLabel}`;
      } else if (status === 'in-progress') {
        cellHTML = `${dayNum}<span class="day-label">进行中</span>`;
      } else if (status === 'locked') {
        cellHTML = `${dayNum}<span class="day-icon">${iconLock(18)}</span>`;
      } else {
        cellHTML = `${dayNum}<span class="day-label">今天</span>`;
      }

      gridHTML += `<div class="day-cell ${status}" data-day="${d}">${cellHTML}</div>`;
    }

    block.innerHTML = `
      <div class="phase-header">
        <span class="phase-name">${phase.name}</span>
        <span class="phase-range">${phase.range}</span>
      </div>
      <div class="phase-grid">${gridHTML}</div>
    `;

    section.appendChild(block);
  });

  // 绑定点击事件
  section.querySelectorAll('.day-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const day = cell.dataset.day;
      window.location.href = `day.html?course=${courseId}&day=${day}`;
    });
  });

  // 打开日历时把当前进度带入视野，减少在长课程中寻找当天的成本。
  const currentCell = section.querySelector('.day-cell.in-progress, .day-cell.today');
  if (currentCell) {
    requestAnimationFrame(() => currentCell.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  }
}

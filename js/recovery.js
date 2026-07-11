// recovery.js - 练习前后验证、节点收获与恢复趋势

const RECOVERY_SYMPTOMS = ['心慌', '胸闷', '叹气', '呼吸急促', '肩颈紧', '胃部不适', '头晕', '坐立不安'];

function recoveryEscape(value) {
  const div = document.createElement('div');
  div.textContent = value || '';
  return div.innerHTML;
}

function ensureRecovery(progress) {
  if (!progress.recovery || typeof progress.recovery !== 'object') progress.recovery = {};
  if (!progress.recovery.task_reflections) progress.recovery.task_reflections = {};
  return progress.recovery;
}

function renderScale(name, selected) {
  let html = '<div class="recovery-scale" role="radiogroup" aria-label="焦虑程度">';
  for (let i = 0; i <= 10; i++) {
    html += '<button type="button" class="recovery-scale-btn' + (Number(selected) === i ? ' selected' : '') + '" data-value="' + i + '" aria-label="' + i + '分">' + i + '</button>';
  }
  return html + '</div><div class="recovery-scale-labels"><span>平静</span><span>非常强烈</span></div><input type="hidden" name="' + name + '" value="' + (selected === 0 || selected ? selected : '') + '">';
}

function bindScale(container) {
  container.querySelectorAll('.recovery-scale').forEach(scale => {
    scale.addEventListener('click', event => {
      const button = event.target.closest('.recovery-scale-btn');
      if (!button) return;
      scale.querySelectorAll('.recovery-scale-btn').forEach(item => item.classList.remove('selected'));
      button.classList.add('selected');
      const input = scale.parentNode.querySelector('input[type="hidden"]');
      if (input) input.value = button.dataset.value;
    });
  });
}

function renderRecoveryCheckIn(container, progress, onSave) {
  if (!container) return;
  const recovery = ensureRecovery(progress);
  const before = recovery.before || {};
  const selectedSymptoms = before.symptoms || [];
  container.className = 'recovery-card recovery-checkin';
  container.innerHTML = `
    <div class="recovery-heading"><span class="recovery-kicker">练习前 · 约30秒</span><h2>先感受一下此刻的自己</h2><p>没有标准答案，只是为今天留下一个起点。</p></div>
    <div class="recovery-field"><label>此刻焦虑程度</label>${renderScale('before_anxiety', before.anxiety)}</div>
    <div class="recovery-field"><label>身体有哪些感受？</label><div class="recovery-chips">${RECOVERY_SYMPTOMS.map(item => '<label class="recovery-chip"><input type="checkbox" value="' + item + '"' + (selectedSymptoms.includes(item) ? ' checked' : '') + '><span>' + item + '</span></label>').join('')}</div></div>
    <div class="recovery-field"><label for="recoveryTrigger">今天主要是什么触发了焦虑？</label><textarea id="recoveryTrigger" rows="2" placeholder="例如：想到还没完成的项目方案">${recoveryEscape(before.trigger)}</textarea></div>
    <div class="recovery-field"><label for="recoveryIntention">今天希望从练习中获得什么？</label><textarea id="recoveryIntention" rows="2" placeholder="例如：让自己慢下来，看清哪些是我能控制的">${recoveryEscape(before.intention)}</textarea></div>
    <button type="button" class="btn btn-secondary recovery-save">${before.saved_at ? '更新练习前记录' : '保存，开始今天的练习'}</button>
    <p class="recovery-saved"${before.saved_at ? '' : ' hidden'}>已保存，可以安心开始。</p>`;
  bindScale(container);
  container.querySelector('.recovery-save').addEventListener('click', async () => {
    const anxiety = container.querySelector('[name="before_anxiety"]').value;
    if (anxiety === '') { showToast('先选择此刻的焦虑程度', 'warning'); return; }
    recovery.before = {
      anxiety: Number(anxiety),
      symptoms: Array.from(container.querySelectorAll('.recovery-chip input:checked')).map(input => input.value),
      trigger: container.querySelector('#recoveryTrigger').value.trim(),
      intention: container.querySelector('#recoveryIntention').value.trim(),
      saved_at: new Date().toISOString()
    };
    await onSave();
    container.querySelector('.recovery-saved').hidden = false;
    container.querySelector('.recovery-save').textContent = '更新练习前记录';
    showToast('练习前状态已保存', 'success');
  });
}

function createTaskReflection(progress, taskKey, taskLabel, available, onSave) {
  const recovery = ensureRecovery(progress);
  const value = recovery.task_reflections[taskKey] || {};
  const details = document.createElement('details');
  details.className = 'task-reflection';
  details.hidden = !available;
  details.innerHTML = `
    <summary>${value.saved_at ? '✓ 已记录这一节的收获' : '记录这一节的收获（约1分钟）'}</summary>
    <div class="task-reflection-body">
      <label>这一节，我理解到什么？</label>
      <textarea rows="2" data-field="takeaway" placeholder="用自己的一句话写下来">${recoveryEscape(value.takeaway)}</textarea>
      <label>它和我今天的实际处境有什么关系？</label>
      <textarea rows="2" data-field="connection" placeholder="例如：项目有风险，但不等于全部责任都只能由我承担">${recoveryEscape(value.connection)}</textarea>
      <button type="button" class="btn btn-secondary">${value.saved_at ? '更新收获' : '保存收获'}</button>
    </div>`;
  details.querySelector('button').addEventListener('click', async () => {
    recovery.task_reflections[taskKey] = {
      label: taskLabel,
      takeaway: details.querySelector('[data-field="takeaway"]').value.trim(),
      connection: details.querySelector('[data-field="connection"]').value.trim(),
      saved_at: new Date().toISOString()
    };
    await onSave();
    details.querySelector('summary').textContent = '✓ 已记录这一节的收获';
    details.querySelector('button').textContent = '更新收获';
    showToast('这一节的收获已保存', 'success');
  });
  details.setAvailable = () => { details.hidden = false; };
  return details;
}

function renderDailyReview(container, progress, taskLabels, available, onSave, onFinished) {
  if (!container) return null;
  const recovery = ensureRecovery(progress);
  const after = recovery.after || {};
  container.className = 'recovery-card daily-review';
  container.hidden = !available;
  container.innerHTML = `
    <div class="recovery-heading"><span class="recovery-kicker">今日总结 · 约2分钟</span><h2>把练习带回今天的生活</h2><p>焦虑没有立刻下降也没关系，理解和行动同样是收获。</p></div>
    <div class="recovery-field"><label>练习结束后的焦虑程度</label>${renderScale('after_anxiety', after.anxiety)}</div>
    <div class="recovery-field"><label for="helpfulTask">今天最有帮助的节点</label><select id="helpfulTask"><option value="">请选择</option>${taskLabels.map((label, index) => '<option value="task' + (index + 1) + '"' + (after.helpful_task === 'task' + (index + 1) ? ' selected' : '') + '>' + recoveryEscape(label) + '</option>').join('')}</select></div>
    <div class="recovery-field"><label for="newUnderstanding">今天对焦虑或自己有了什么新理解？</label><textarea id="newUnderstanding" rows="2" placeholder="一句话就可以">${recoveryEscape(after.understanding)}</textarea></div>
    <div class="recovery-field"><label for="realAction">接下来准备尝试的一个现实行动</label><textarea id="realAction" rows="2" placeholder="例如：今晚不处理项目消息，明天固定时间再看">${recoveryEscape(after.action)}</textarea></div>
    <label class="recovery-action-check"><input type="checkbox" id="actionDone"${after.action_done ? ' checked' : ''}><span>这个行动我已经做到了</span></label>
    <button type="button" class="btn btn-primary recovery-finish">${after.saved_at ? '更新今日总结' : '保存今日总结'}</button>`;
  bindScale(container);
  container.querySelector('.recovery-finish').addEventListener('click', async () => {
    const anxiety = container.querySelector('[name="after_anxiety"]').value;
    if (anxiety === '') { showToast('先选择练习结束后的焦虑程度', 'warning'); return; }
    recovery.after = {
      anxiety: Number(anxiety),
      helpful_task: container.querySelector('#helpfulTask').value,
      understanding: container.querySelector('#newUnderstanding').value.trim(),
      action: container.querySelector('#realAction').value.trim(),
      action_done: container.querySelector('#actionDone').checked,
      saved_at: new Date().toISOString()
    };
    await onSave();
    container.querySelector('.recovery-finish').textContent = '更新今日总结';
    showToast('今日总结已保存', 'success');
    if (onFinished) onFinished();
  });
  container.setAvailable = () => { container.hidden = false; };
  return container;
}

async function renderRecoveryDashboard(container) {
  if (!container) return;
  const records = [];
  for (const course of COURSES) {
    const progressMap = await getAllProgress(course.id);
    Object.keys(progressMap).forEach(day => {
      const item = progressMap[day];
      const recovery = item.recovery || {};
      if (!recovery.before && !recovery.after) return;
      records.push({ course, day: Number(day), before: recovery.before, after: recovery.after, date: (recovery.after && recovery.after.saved_at) || (recovery.before && recovery.before.saved_at) || item.updated_at });
    });
  }
  records.sort((a, b) => new Date(b.date) - new Date(a.date));
  const recent = records.slice(0, 7).reverse();
  container.className = 'recovery-dashboard';
  if (!recent.length) {
    container.innerHTML = '<div class="recovery-dashboard-head"><div><span class="recovery-kicker">恢复记录</span><h2>从下一次练习开始看见变化</h2></div></div><p class="recovery-empty">练习前后各记录一次状态，这里会逐渐呈现你的恢复轨迹。</p>';
    return;
  }
  const paired = recent.filter(item => item.before && item.after && Number.isFinite(item.before.anxiety) && Number.isFinite(item.after.anxiety));
  const beforeAvg = paired.length ? (paired.reduce((sum, item) => sum + item.before.anxiety, 0) / paired.length).toFixed(1) : '—';
  const afterAvg = paired.length ? (paired.reduce((sum, item) => sum + item.after.anxiety, 0) / paired.length).toFixed(1) : '—';
  const actions = recent.filter(item => item.after && item.after.action);
  const actionsDone = actions.filter(item => item.after.action_done).length;
  container.innerHTML = `
    <div class="recovery-dashboard-head"><div><span class="recovery-kicker">最近 ${recent.length} 次记录</span><h2>我的恢复趋势</h2></div><div class="recovery-average"><span>${beforeAvg}</span><b>→</b><span>${afterAvg}</span><small>练习前 / 后</small></div></div>
    <div class="recovery-trend">${recent.map(item => {
      const before = item.before && Number.isFinite(item.before.anxiety) ? item.before.anxiety : null;
      const after = item.after && Number.isFinite(item.after.anxiety) ? item.after.anxiety : null;
      return '<div class="trend-row"><span class="trend-day">' + recoveryEscape(item.course.shortName || item.course.name) + ' ' + item.day + '</span><div class="trend-bars"><i class="trend-before" style="width:' + (before === null ? 0 : before * 10) + '%"></i><i class="trend-after" style="width:' + (after === null ? 0 : after * 10) + '%"></i></div><span class="trend-value">' + (before === null ? '—' : before) + ' → ' + (after === null ? '—' : after) + '</span></div>';
    }).join('')}</div>
    <div class="recovery-dashboard-foot"><span>现实行动 ${actionsDone}/${actions.length} 次做到</span><span>一次没有下降，也不代表练习无效</span></div>`;
}

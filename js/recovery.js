// recovery.js - 每日成果卡与练习图鉴

const CARD_MOODS = ['平静了一些', '更清楚了', '更愿意接纳', '有一点力量', '仍有些紧绷', '有些疲惫', '暂时没感觉'];
const CARD_SYMBOLS = {
  ebp: ['🌱','💧','🍃','🌼','🫧','☀️','⭐','🌙','🌊','🪷','🪶','🌈','🍀','🕊️','🐚','🌿','🪴','🌤️','🦋','🌻','🍵','🪨','🌳','✨','🏡'],
  cbt: ['🔍','💡','🧭','🪞','🧩','🔦','⚖️','🗺️','🔭','🧠','🛤️','🪜','🔑','🧱','🛡️','📝','🧶','🎯','🧰','🌉','🏆'],
  act: ['⛵','🧘','🌾','🚶','🧗','🌬️','🪁','🚪','👣','🌄','⛰️','🛶','🧭','🌊','🔥','🌌','🪵','🌲','🕯️','🌅','🏔️']
};

function recoveryEscape(value) {
  const div = document.createElement('div');
  div.textContent = value || '';
  return div.innerHTML;
}

function ensureRecovery(progress) {
  if (!progress.recovery || typeof progress.recovery !== 'object') progress.recovery = {};
  return progress.recovery;
}

function getCardSymbol(courseId, day) {
  const symbols = CARD_SYMBOLS[courseId] || CARD_SYMBOLS.ebp;
  return symbols[(day - 1) % symbols.length];
}

function getCardCode(courseId, day) {
  const prefix = courseId === 'ebp' ? 'EBP' : courseId === 'cbt' ? 'CBT' : 'ACT';
  return prefix + '-' + String(day).padStart(2, '0');
}

function renderDailyReview(container, progress, context, available, onSave, onFinished) {
  if (!container) return null;
  const recovery = ensureRecovery(progress);
  const legacyAfter = recovery.after || {};
  const card = recovery.card || {};
  const selectedMoods = card.moods || [];
  const initialTakeaway = card.takeaway || legacyAfter.understanding || '';
  container.className = 'recovery-card daily-review';
  container.hidden = !available;
  container.innerHTML = `
    <div class="recovery-heading">
      <span class="recovery-kicker">完成今日练习</span>
      <h2>留下今天的成果卡</h2>
      <p>不需要总结得很深刻，写下此刻真正留下的一点就好。</p>
    </div>
    <div class="recovery-field">
      <label for="cardTakeaway">今天留下了什么？</label>
      <textarea id="cardTakeaway" rows="3" maxlength="160" placeholder="一句理解、一点感受，或一句想记住的话">${recoveryEscape(initialTakeaway)}</textarea>
      <p class="recovery-field-hint">暂时没有明确收获也没关系，可以写“我完成了今天的练习”。</p>
    </div>
    <div class="recovery-field">
      <label>此刻的心态 <small>可多选</small></label>
      <div class="recovery-chips">${CARD_MOODS.map(item => '<label class="recovery-chip"><input type="checkbox" value="' + item + '"' + (selectedMoods.includes(item) ? ' checked' : '') + '><span>' + item + '</span></label>').join('')}</div>
    </div>
    <button type="button" class="btn btn-primary recovery-finish">${card.saved_at ? '更新成果卡' : '解锁今天的成果卡'}</button>`;

  container.querySelector('.recovery-finish').addEventListener('click', async () => {
    const takeaway = container.querySelector('#cardTakeaway').value.trim();
    const moods = Array.from(container.querySelectorAll('.recovery-chip input:checked')).map(input => input.value);
    if (!takeaway) { showToast('写下一句今天留下的内容吧', 'warning'); return; }
    if (!moods.length) { showToast('选择一个最接近此刻的心态吧', 'warning'); return; }
    recovery.card = {
      takeaway,
      moods,
      code: getCardCode(context.courseId, context.day),
      symbol: getCardSymbol(context.courseId, context.day),
      unlocked_at: card.unlocked_at || new Date().toISOString(),
      saved_at: new Date().toISOString()
    };
    await onSave();
    container.querySelector('.recovery-finish').textContent = '更新成果卡';
    showToast(card.saved_at ? '成果卡已更新' : '新的成果卡已解锁', 'success');
    if (onFinished) onFinished(recovery.card);
  });
  container.setAvailable = () => { container.hidden = false; };
  return container;
}

async function collectCardRecords() {
  const records = [];
  for (const course of COURSES) {
    const progressMap = await getAllProgress(course.id);
    for (let day = 1; day <= course.totalDays; day++) {
      const progress = progressMap[day] || {};
      const recovery = progress.recovery || {};
      const card = recovery.card || null;
      const data = getCourseData(course.id, day) || {};
      records.push({ course, day, theme: data.theme || ('第' + day + '天'), card });
    }
  }
  return records;
}

async function renderCardCollection(container) {
  if (!container) return;
  const records = await collectCardRecords();
  const unlocked = records.filter(item => item.card && item.card.unlocked_at);
  container.innerHTML = `
    <div class="collection-summary">
      <div><span>已发现</span><strong>${unlocked.length}<small>/ ${records.length}</small></strong></div>
      ${COURSES.map(course => {
        const count = unlocked.filter(item => item.course.id === course.id).length;
        return '<div class="collection-course-count"><span>' + recoveryEscape(course.name) + '</span><b>' + count + '/' + course.totalDays + '</b></div>';
      }).join('')}
    </div>
    <div class="collection-filters" role="tablist">
      <button class="selected" data-course="all">全部</button>
      ${COURSES.map(course => '<button data-course="' + course.id + '">' + recoveryEscape(course.name) + '</button>').join('')}
    </div>
    <div class="card-album"></div>
    <div class="collection-modal" hidden><button class="collection-modal-close" aria-label="关闭">×</button><div class="collection-modal-body"></div></div>`;

  const album = container.querySelector('.card-album');
  const modal = container.querySelector('.collection-modal');
  const modalBody = container.querySelector('.collection-modal-body');

  function draw(filter) {
    const visible = filter === 'all' ? records : records.filter(item => item.course.id === filter);
    album.innerHTML = visible.map(item => {
      const unlockedCard = item.card && item.card.unlocked_at;
      return `<button class="album-card ${unlockedCard ? 'unlocked' : 'locked'}" data-course="${item.course.id}" data-day="${item.day}" style="--card-color:${item.course.color}">
        <span class="album-card-code">${getCardCode(item.course.id, item.day)}</span>
        <span class="album-card-symbol">${unlockedCard ? getCardSymbol(item.course.id, item.day) : '？'}</span>
        <strong>${unlockedCard ? recoveryEscape(item.theme) : '等待发现'}</strong>
        <small>${unlockedCard ? '已收集' : '完成第 ' + item.day + ' 天后解锁'}</small>
      </button>`;
    }).join('');
  }

  draw('all');
  container.querySelectorAll('.collection-filters button').forEach(button => {
    button.addEventListener('click', () => {
      container.querySelectorAll('.collection-filters button').forEach(item => item.classList.remove('selected'));
      button.classList.add('selected');
      draw(button.dataset.course);
    });
  });
  album.addEventListener('click', event => {
    const button = event.target.closest('.album-card.unlocked');
    if (!button) return;
    const item = records.find(record => record.course.id === button.dataset.course && record.day === Number(button.dataset.day));
    if (!item) return;
    modalBody.innerHTML = renderUnlockedCard(item);
    modal.hidden = false;
  });
  modal.querySelector('.collection-modal-close').addEventListener('click', () => { modal.hidden = true; });
  modal.addEventListener('click', event => { if (event.target === modal) modal.hidden = true; });
}

function renderUnlockedCard(item) {
  const date = item.card.unlocked_at ? new Date(item.card.unlocked_at).toLocaleDateString('zh-CN') : '';
  return `<article class="achievement-card" style="--card-color:${item.course.color}">
    <div class="achievement-card-top"><span>${getCardCode(item.course.id, item.day)}</span><span>${recoveryEscape(item.course.name)}</span></div>
    <div class="achievement-card-symbol">${getCardSymbol(item.course.id, item.day)}</div>
    <h3>${recoveryEscape(item.theme)}</h3>
    <div class="achievement-card-copy"><small>今天留下了</small><p>${recoveryEscape(item.card.takeaway)}</p></div>
    <div class="achievement-card-moods">${(item.card.moods || []).map(mood => '<span>' + recoveryEscape(mood) + '</span>').join('')}</div>
    <footer>${date} · 完成练习后发现</footer>
  </article>`;
}

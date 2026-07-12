// recovery.js - 每日成果卡与练习图鉴

const CARD_MOODS = ['平静了一些', '更清楚了', '更愿意接纳', '有一点力量', '仍有些紧绷', '有些疲惫', '暂时没感觉'];
const CARD_SYMBOLS = {
  ebp: ['🌱','💧','🍃','🌼','🫧','☀️','⭐','🌙','🌊','🪷','🪶','🌈','🍀','🕊️','🐚','🌿','🪴','🌤️','🦋','🌻','🍵','🪨','🌳','✨','🏡'],
  cbt: ['🔍','💡','🧭','🪞','🧩','🔦','⚖️','🗺️','🔭','🧠','🛤️','🪜','🔑','🧱','🛡️','📝','🧶','🎯','🧰','🌉','🏆'],
  act: ['⛵','🧘','🌾','🚶','🧗','🌬️','🪁','🚪','👣','🌄','⛰️','🛶','🧭','🌊','🔥','🌌','🪵','🌲','🕯️','🌅','🏔️']
};

// 每日课程重点：属于课程内容，不随用户的成果卡记录变化。
const CARD_KNOWLEDGE = {
  ebp: [
    '用好奇心看见当下的小美好，不急着评价。',
    '专注味道与进食过程，让注意力回到此刻。',
    '觉察温度、质地与触感，用身体连接当下。',
    '留意气味带来的细微感受，积累积极体验。',
    '倾听身体信号，温柔地照顾当下的需要。',
    '主动记录开心小事，会让积极体验更容易被看见。',
    '小成就也值得记录，专注今天更容易坚持。',
    '情绪是会变化的体验，不是需要立刻消灭的问题。',
    '给情绪准确命名，能帮助我们更清楚地理解自己。',
    '允许情绪存在，比压抑或对抗更有助于它自然流动。',
    '情绪背后常有需要，觉察它比责备自己更有帮助。',
    '接纳不是认同或放弃，而是停止与现实继续较劲。',
    '价值像方向，帮助我们在情绪波动时仍知道往哪走。',
    '把价值变成具体小行动，改变才会在生活里发生。',
    '行动不必等状态完美，可以从当下能做的一小步开始。',
    '困难情绪可以同行，但不必替我们决定下一步。',
    '把觉察、接纳和行动放进日常，技能才会逐渐稳固。',
    '反复练习比一次做到完美更重要。',
    '情绪能力像一棵树，需要持续照料与练习。',
    '幸福不只是一时愉快，也来自投入、意义与成长。',
    '情绪都有功能，理解信息后再选择如何回应。',
    '觉察让我们看见体验，接纳让我们不被体验困住。',
    '了解自己的需要、优势与价值，是稳定行动的基础。',
    '记住开始的原因，能在困难时重新连接改变的动力。',
    '把有效方法整理成锦囊，需要时就能更快调用。'
  ],
  cbt: [
    '先判断情绪是否过强，再选择安抚、检验或解决问题。',
    '情绪既可能保护我们，也可能带来代价，可以权衡后再回应。',
    '给情绪强度打分，能帮助我们选择合适的调节方法。',
    '温和的身体接触能传递安全感，帮助情绪降温。',
    '视觉、听觉、嗅觉、触觉和味觉都可以成为安抚资源。',
    '交替绷紧与放松肌肉，可以降低身体的紧张水平。',
    '适度运动能帮助身体释放压力，改变情绪状态。',
    '高强度情绪先处理身体，再做理性分析会更有效。',
    '事件不直接决定情绪，我们对事件的想法也在发挥作用。',
    '把可观察事实和主观解释分开，能减少想当然。',
    '检查情绪是否符合事实，再决定接纳还是调节。',
    '多数评价不是非黑即白，把它放回连续刻度会更准确。',
    '用比例分配责任，避免把复杂结果全归咎于自己。',
    '用证据和不同视角提问，能形成更平衡的新想法。',
    '旧经验形成的信念会自动播放，但它并不等于事实。',
    '把想法当作心理事件观察，而不是必须服从的命令。',
    '刻意留意积极证据，能修正大脑习惯性的负面偏向。',
    '想法出现时不急着回应，它会像其他体验一样变化。',
    '先把问题说具体，才能区分可解决部分与情绪困扰。',
    '把方案拆成足够小的一步，行动会比反复思考更有帮助。',
    '持续练习并建立个人工具库，才能在需要时灵活调用。'
  ],
  act: [
    '明确焦虑带来的代价与想要的生活，为改变找到方向。',
    '从外界、身体、想法和行为四个方面识别焦虑链条。',
    '焦虑会因回避暂时下降，却可能因此被长期维持。',
    '焦虑常高估风险、低估能力，需要同时检验两部分。',
    '反复担忧不等于有效准备，要看它是否真的帮助生活。',
    '能解决的问题就确定下一步，把担忧转化为行动。',
    '通过小实验接触不确定性，大脑会逐渐学会承受它。',
    '安全行为带来短暂安心，也可能阻止我们获得新证据。',
    '逐步减少回避，才能验证自己是否真的无法应对。',
    '减少确认、依赖等靠近型安全行为，练习相信自己的能力。',
    '带着可承受的焦虑靠近目标，是重新学习安全的过程。',
    '把挑战排成由易到难的阶梯，练习更可持续。',
    '行动前允许焦虑存在，行动后记录事实而非只看感受。',
    '针对未来担忧，用现实实验检验预测，而非继续想象。',
    '主动接触身体感觉，可以修正“这些感觉很危险”的误解。',
    '在社交场景中减少自我监控，把注意力带回真实互动。',
    '一次实验不是终点，重复和升级才能形成稳定的新学习。',
    '用“足够好”的行动挑战完美主义，而不是等待万无一失。',
    '实验要具体、可重复，并同时记录预测、结果与应对。',
    '挫折也是数据，复盘和调整比给自己判失败更重要。',
    '回顾勇敢行动与有效方法，把练习继续带进未来生活。'
  ]
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

function getCardKnowledge(courseId, day) {
  const items = CARD_KNOWLEDGE[courseId] || [];
  return items[day - 1] || '完成练习后，记住今天对自己最有帮助的一点。';
}

function getCardRank(day) {
  if (day % 7 === 0 || day === 21 || day === 25) return { label: '里程碑', mark: '✦' };
  if (day % 5 === 0) return { label: '闪光', mark: '◆' };
  return { label: '日常发现', mark: '●' };
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
      records.push({ course, day, theme: data.theme || ('第' + day + '天'), knowledge: getCardKnowledge(course.id, day), card });
    }
  }
  return records;
}

async function renderCardCollection(container) {
  if (!container) return;
  const records = await collectCardRecords();
  const unlocked = records.filter(item => item.card && item.card.unlocked_at);
  const completion = Math.round(unlocked.length / records.length * 100);
  container.innerHTML = `
    <div class="collection-summary">
      <div class="collection-emblem" style="--collection-progress:${completion * 3.6}deg"><div><strong>${completion}<small>%</small></strong><span>图鉴进度</span></div></div>
      <div class="collection-summary-copy"><span class="collection-eyebrow">MY HEALING DEX</span><h3>我的疗愈图鉴</h3><p>每一次完成，都在发现一个更有力量的自己。</p></div>
      <div class="collection-counts">${COURSES.map(course => {
        const count = unlocked.filter(item => item.course.id === course.id).length;
        return '<div class="collection-course-count" style="--course-color:' + course.color + '"><i></i><span>' + recoveryEscape(course.name) + '</span><b>' + count + '<small>/' + course.totalDays + '</small></b></div>';
      }).join('')}</div>
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
      const rank = getCardRank(item.day);
      return `<button class="album-card ${unlockedCard ? 'unlocked' : 'locked'}" data-course="${item.course.id}" data-day="${item.day}" style="--card-color:${item.course.color}">
        <span class="album-card-head"><span class="album-card-code">NO.${String(item.day).padStart(2, '0')}</span><span class="album-card-rank">${rank.mark} ${rank.label}</span></span>
        <span class="album-card-art"><span class="album-card-orbit"></span><span class="album-card-symbol">${unlockedCard ? getCardSymbol(item.course.id, item.day) : '✦'}</span></span>
        <span class="album-card-info"><strong>${unlockedCard ? recoveryEscape(item.theme) : '尚未相遇'}</strong><small>${unlockedCard ? getCardCode(item.course.id, item.day) + ' · 已发现' : '完成第 ' + item.day + ' 天后发现'}</small></span>
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
  const rank = getCardRank(item.day);
  return `<article class="achievement-card" style="--card-color:${item.course.color}">
    <div class="achievement-card-shine"></div>
    <div class="achievement-card-top"><span>${getCardCode(item.course.id, item.day)}</span><span>${rank.mark} ${rank.label}</span></div>
    <div class="achievement-card-visual"><span class="achievement-card-halo"></span><div class="achievement-card-symbol">${getCardSymbol(item.course.id, item.day)}</div></div>
    <div class="achievement-card-course">${recoveryEscape(item.course.name)}</div>
    <h3>${recoveryEscape(item.theme)}</h3>
    <div class="achievement-card-knowledge"><small>今日重点</small><p>${recoveryEscape(item.knowledge || getCardKnowledge(item.course.id, item.day))}</p></div>
    <div class="achievement-card-copy"><small>今天留下了</small><p>${recoveryEscape(item.card.takeaway)}</p></div>
    <div class="achievement-card-moods">${(item.card.moods || []).map(mood => '<span>' + recoveryEscape(mood) + '</span>').join('')}</div>
    <footer>${date} · 完成练习后发现</footer>
  </article>`;
}

// recovery.js - 每日成果卡与练习图鉴

const CARD_MOODS = ['平静了一些', '更清楚了', '更愿意接纳', '有一点力量', '仍有些紧绷', '有些疲惫', '暂时没感觉'];
const CARD_SYMBOLS = {
  ebp: ['🌱','💧','🍃','🌼','🫧','☀️','⭐','🌙','🌊','🪷','🪶','🌈','🍀','🕊️','🐚','🌿','🪴','🌤️','🦋','🌻','🍵','🪨','🌳','✨','🏡'],
  cbt: ['🔍','💡','🧭','🪞','🧩','🔦','⚖️','🗺️','🔭','🧠','🛤️','🪜','🔑','🧱','🛡️','📝','🧶','🎯','🧰','🌉','🏆'],
  act: ['⛵','🧘','🌾','🚶','🧗','🌬️','🪁','🚪','👣','🌄','⛰️','🛶','🧭','🌊','🔥','🌌','🪵','🌲','🕯️','🌅','🏔️']
};

// 67 只原创疗愈精灵：技能用于提示当天可练习的心理能力，不代表医疗效果。
const CARD_COMPANIONS = {
  ebp: [
    ['好奇芽','初见微光','带着好奇看见当下，而不是急着评价。'],
    ['慢尝团','一口此刻','把注意力带回味道与正在发生的体验。'],
    ['触触绒','柔软落地','借助触感回到身体，减轻思绪拉扯。'],
    ['闻香鹿','气息寻路','用熟悉气味找到片刻安稳与愉悦。'],
    ['听身熊','身体来信','听见身体需要，并给自己温柔照顾。'],
    ['拾喜雀','小喜收藏','更容易发现并保存生活里的开心小事。'],
    ['微光芽','小步生长','看见已经做到的部分，减轻完美压力。'],
    ['流云团','情绪流动','提醒你情绪会变化，不必马上消灭它。'],
    ['名名狐','情绪点名','为感受准确命名，让内心变得更清楚。'],
    ['容容鲸','给它空间','允许情绪暂时存在，减少与它的对抗。'],
    ['寻需鹿','内心译员','从情绪背后听见自己真正的需要。'],
    ['松手獭','停止较劲','接纳眼前现实，把力气留给下一步。'],
    ['向心鸟','方向罗盘','情绪摇晃时，仍记得自己重视的方向。'],
    ['行动芽','价值落地','把重要的事变成今天能做的小动作。'],
    ['一步龟','现在就走','不等状态完美，也能开始一小步。'],
    ['同行鹿','带着感受走','让困难情绪同行，但不替你做决定。'],
    ['日常狸','练习入袋','把觉察、接纳和行动带进普通生活。'],
    ['再来鸟','温柔重复','允许不完美，用重复练习积累能力。'],
    ['心树灵','持续照料','提醒你像照料树一样照料情绪能力。'],
    ['丰盛蜂','幸福拼图','看见愉快之外的投入、意义与成长。'],
    ['信使鸽','情绪来信','理解情绪的信息，再选择怎样回应。'],
    ['觉容莲','看见与容纳','先觉察体验，再给它可以待着的位置。'],
    ['识己猫','认识自己','连接需要、优势和价值，稳定行动方向。'],
    ['初心萤','动力微光','困难时重新想起自己为什么开始。'],
    ['锦囊狸','随身工具箱','整理有效方法，需要时更快调用。']
  ],
  cbt: [
    ['分流狐','三路选择','判断强度后选择安抚、检验或解决。'],
    ['权衡獭','代价天平','同时看见情绪的保护作用和现实代价。'],
    ['刻度熊','强度读数','用评分看清程度，选择合适的调节方式。'],
    ['安心绒','安全轻触','用温和触碰向身体传递安全感。'],
    ['五感狸','感官庇护','调用五种感官，为自己建立安抚空间。'],
    ['松松熊','肌肉融雪','用绷紧与放松帮助身体释放紧张。'],
    ['动能犬','压力出口','借适度运动让身体完成压力循环。'],
    ['降温企鹅','先稳身体','高强度情绪时先降温，再分析问题。'],
    ['想法镜','看见解释','发现事件之外，想法也在影响情绪。'],
    ['事实鹿','事实分界','把可观察事实与脑中的解释分开。'],
    ['核实猫','证据核验','检查情绪是否符合事实，再决定回应。'],
    ['灰度狐','连续光谱','跳出非黑即白，看见更多可能程度。'],
    ['分责蜂','责任拼图','按比例分配责任，不把结果全压给自己。'],
    ['多面鸮','换角提问','用证据和不同视角形成平衡想法。'],
    ['旧声鹦','旧念识别','认出自动播放的旧信念并不等于事实。'],
    ['观念云','念头路过','把想法当心理事件，而非必须服从的命令。'],
    ['寻光雀','积极证据','主动留意积极证据，修正负面偏向。'],
    ['缓答龟','稍后回应','想法出现时不急回应，给变化留出时间。'],
    ['拆题鼠','问题定形','把困扰说具体，找到真正可解决的部分。'],
    ['一步獾','最小行动','把方案缩成足够小、可以马上做的一步。'],
    ['工具象','灵活调用','建立个人工具库，按情境选择合适方法。']
  ],
  act: [
    ['启程鹿','方向启航','看清焦虑代价与想要生活，找到改变方向。'],
    ['四象猫','焦虑地图','从外界、身体、想法和行为看清焦虑链。'],
    ['回避兔','循环识破','识别短暂轻松如何让回避被长期维持。'],
    ['估险狐','双面估算','同时检验风险大小与自己的应对能力。'],
    ['担忧鸦','有用检验','分辨担忧是在准备，还是只让自己打转。'],
    ['解题獭','下一步行动','把能解决的担忧转成清晰的下一步。'],
    ['未知蝶','不确定练习','用小实验逐渐提升对不确定性的承受力。'],
    ['护栏狸','安全松绑','看见安全行为如何阻挡你获得新证据。'],
    ['靠近鹿','减少回避','逐步靠近曾躲开的事，验证真实能力。'],
    ['自信熊','少问一次','减少反复确认，练习相信自己的判断。'],
    ['勇行犬','带着焦虑走','允许可承受的焦虑存在，同时靠近目标。'],
    ['阶梯羊','由易到难','把挑战排成阶梯，让练习可以持续。'],
    ['事实雀','行动复盘','行动后记录真实结果，而不只看感受。'],
    ['实验狐','预测验证','用现实实验检验未来预测，停止空转想象。'],
    ['心跳鲸','感觉重学','安全接触身体感觉，修正危险误解。'],
    ['外向猫','注意外移','减少自我监控，把注意力放回真实互动。'],
    ['升级龙','重复进阶','通过重复和升级，让新学习逐渐稳定。'],
    ['够好熊','完成护盾','用足够好的行动挑战完美主义。'],
    ['记录鸮','实验笔记','记录预测、结果和应对，让练习可复盘。'],
    ['复盘狸','挫折成图','把挫折当数据，调整方法而非判定失败。'],
    ['远行鹿','勇气续航','带上有效方法，让勇敢行动继续发生。']
  ]
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

function getCardCompanion(courseId, day) {
  const item = (CARD_COMPANIONS[courseId] || [])[day - 1] || ['陪伴芽','今日陪伴','陪你记住今天最有帮助的一点。'];
  return { name: item[0], skill: item[1], help: item[2] };
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
      records.push({ course, day, theme: data.theme || ('第' + day + '天'), knowledge: getCardKnowledge(course.id, day), companion: getCardCompanion(course.id, day), card });
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
        <span class="album-card-info"><strong>${unlockedCard ? recoveryEscape(item.companion.name) : '尚未相遇'}</strong><span class="album-card-theme">${unlockedCard ? recoveryEscape(item.theme) : '等待与你见面'}</span><small>${unlockedCard ? '技能 · ' + recoveryEscape(item.companion.skill) : '完成第 ' + item.day + ' 天后发现'}</small></span>
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
    <h3>${recoveryEscape(item.companion.name)}</h3>
    <div class="achievement-card-skill"><small>专属技能 · ${recoveryEscape(item.companion.skill)}</small><p>${recoveryEscape(item.companion.help)}</p></div>
    <div class="achievement-card-theme">第 ${item.day} 天 · ${recoveryEscape(item.theme)}</div>
    <div class="achievement-card-knowledge"><small>今日重点</small><p>${recoveryEscape(item.knowledge || getCardKnowledge(item.course.id, item.day))}</p></div>
    <div class="achievement-card-copy"><small>今天留下了</small><p>${recoveryEscape(item.card.takeaway)}</p></div>
    <div class="achievement-card-moods">${(item.card.moods || []).map(mood => '<span>' + recoveryEscape(mood) + '</span>').join('')}</div>
    <footer>${date} · 完成练习后发现</footer>
  </article>`;
}

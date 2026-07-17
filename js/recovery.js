// recovery.js - 每日成果卡与练习图鉴

const CARD_MOODS = ['平静了一些', '更清楚了', '更愿意接纳', '有一点力量', '仍有些紧绷', '有些疲惫', '暂时没感觉'];
const CARD_SYMBOLS = {
  ebp: ['🌱','💧','🍃','🌼','🫧','☀️','⭐','🌙','🌊','🪷','🪶','🌈','🍀','🕊️','🐚','🌿','🪴','🌤️','✨','🌻','🍵','🪨','🌳','✨','🏡'],
  cbt: ['🔍','💡','🧭','🪞','🧩','🔦','⚖️','🗺️','🔭','🧠','🛤️','🪜','🔑','🧱','🛡️','📝','🧶','🎯','🧰','🌉','🏆'],
  act: ['⛵','🧘','🌾','🚶','🧗','🌬️','🪁','🚪','👣','🌄','⛰️','🛶','🧭','🌊','🔥','🌌','🪵','🌲','🕯️','🌅','🏔️']
};

// 每一天都对应独立精灵与独立插画；数组顺序严格对应课程天数。
const COMPANION_ARTWORK = {
  ebp: [
    'ebp-01-curiosity-sprout', 'ebp-02-slow-tasting-mochi', 'ebp-03-tactile-grounding-plush',
    'ebp-04-scent-finding-cat', 'ebp-05-body-listening-bear', 'ebp-06-joy-gathering-magpie',
    'ebp-07-glimmer-sprout', 'ebp-08-flowing-cloud-mochi', 'ebp-09-emotion-naming-fox',
    'ebp-10-space-giving-whale', 'ebp-11-inner-listening-cat', 'ebp-12-letting-go-otter',
    'ebp-13-direction-bird', 'ebp-14-action-sprout', 'ebp-15-one-step-turtle',
    'ebp-16-feelings-along-rabbit', 'ebp-17-daily-practice-raccoon', 'ebp-18-gentle-repeat-bird',
    'ebp-19-heart-tree-spirit', 'ebp-20-flourishing-bear', 'ebp-21-emotion-messenger-pigeon',
    'ebp-22-awareness-lotus', 'ebp-23-self-knowing-cat', 'ebp-24-original-light-firefly',
    'ebp-25-coping-kit-raccoon'
  ],
  cbt: [
    'cbt-01-three-way-fox', 'cbt-02-cost-balance-otter', 'cbt-03-intensity-meter-bear',
    'cbt-04-safe-touch-lamb', 'cbt-05-five-senses-raccoon', 'cbt-06-muscle-melting-bear',
    'cbt-07-motion-dog', 'cbt-08-cooling-penguin', 'cbt-09-thought-mirror',
    'cbt-10-fact-boundary-cat', 'cbt-11-evidence-check-cat', 'cbt-12-grayscale-fox',
    'cbt-13-responsibility-raccoon', 'cbt-14-perspective-owl', 'cbt-15-old-belief-parrot',
    'cbt-16-passing-thought-cloud', 'cbt-17-positive-evidence-sparrow', 'cbt-18-pause-turtle',
    'cbt-19-problem-shaping-mouse', 'cbt-20-smallest-step-badger', 'cbt-21-flexible-tool-elephant'
  ],
  act: [
    'act-01-departure-cat', 'act-02-four-part-map-cat', 'act-03-avoidance-rabbit',
    'act-04-risk-estimating-fox', 'act-05-worry-crow', 'act-06-problem-solving-otter',
    'act-07-uncertainty-bird', 'act-08-safety-rail-raccoon', 'act-09-approaching-rabbit',
    'act-10-self-trust-bear', 'act-11-courage-walking-dog', 'act-12-step-ladder-sheep',
    'act-13-fact-review-sparrow', 'act-14-experiment-fox', 'act-15-heartbeat-whale',
    'act-16-outward-attention-cat', 'act-17-repeat-upgrade-dragon', 'act-18-good-enough-bear',
    'act-19-experiment-notes-owl', 'act-20-setback-map-raccoon', 'act-21-long-journey-cat'
  ]
};

const COMPANION_NICKNAMES = {
  ebp: ['芽芽','糯糯','绒桃','香柚','听朵','喜啾','微灯','云泡','名米','容蓝','心铃','松栗','向晴','动芽','步步','伴伴','日狸','再啾','木木','丰糖','信团','莲露','知知','初萤','囊宝'],
  cbt: ['岔岔','衡豆','刻刻','安绵','五五','松饼','跳跳','冰豆','镜圆','实实','核桃','灰米','分分','鸮鸮','旧啾','云念','光雀','停停','拆米','小獾','象宝'],
  act: ['启米','四叶','躲躲','估估','忧啾','解宝','未未','栏狸','靠靠','信熊','勇豆','阶绵','真啾','验验','心蓝','向外','升升','够够','记鸮','复复','远星']
};

const STORY_LEADS = { hero: '田田', heroine: '缓缓' };
const DUO_MOMENTS = {
  ebp: [
    '田田负责把细小的变化记下来，缓缓负责提醒两个人慢一点感受；它会陪他们把普通日子过成可以珍藏的小故事。',
    '田田会在忙乱时找回此刻，缓缓会在疲惫时留出温柔空间；它愿意做两个人身边那盏不催促的小灯。',
    '田田带着好奇发现生活，缓缓把感受轻轻说出来；它会帮两个人把每一次觉察都收进共同回忆。'
  ],
  cbt: [
    '田田负责收集事实线索，缓缓负责补上一种更温柔的解释；它会陪两个人一起把担心看得更清楚。',
    '田田提醒两个人先暂停，缓缓陪着分清想法与事实；它是他们共同工具箱里认真又柔软的小助手。',
    '田田愿意试着换个角度，缓缓会记得肯定已经做到的部分；它陪两个人把难题拆成可以商量的小步骤。'
  ],
  act: [
    '田田负责迈出可以做到的一小步，缓缓负责守住舒服的节奏；它会陪两个人带着不确定继续靠近生活。',
    '田田在前面探一探路，缓缓在身边确认感受；它不催促谁勇敢，只为两个人记住每一次真实尝试。',
    '田田把方向装进口袋，缓缓把耐心放进行囊；它会和两个人一起走，把“做过一次”慢慢变成新的底气。'
  ]
};

const COMPANION_FAVORITES = {
  ebp: ['清晨的露珠','草莓牛奶','晒过太阳的软毯','橘皮和花香','窗边的雨声','亮晶晶纽扣','睡前小灯','看云朵变形','给心情挑颜色','留一张空椅','听朋友慢慢说','放走一片落叶','清晨吹来的风','把种子装进口袋','走短短的小路','雨后一起散步','整理随身小包','重复同一首晚安歌','给新叶浇水','拼一幅暖暖的画','送出手写小信','清水与莲香','照一会儿小镜子','黄昏亮起灯','收集实用小物'],
  cbt: ['看三岔路口','把东西放平衡','观察颜色刻度','柔软的抱抱','五种味道的小点心','慢慢伸懒腰','绕院子跑一圈','凉凉的毛巾','擦亮圆镜子','收集真实脚印','核对小线索','排列深浅石子','分一块小蛋糕','从不同窗户看风景','关小旧唱机','看念头云飘过','找藏起来的亮点','等沙漏落完','拆开打结的线团','搭第一层台阶','整理工具围裙'],
  act: ['在港口看小船','画四格小地图','从门后探出头','练习估算远近','把乱线绕成团','搭一座小桥','雾里找星星','解开护栏绳结','向门口靠近一步','自己看指南针','带着雨云散步','爬圆圆的台阶','收集行动后的石子','做安全的小实验','听海浪和心跳','看朋友说话的眼睛','把旧台阶再走一遍','做完不完美的小手工','记下旅途小事','在地图上重画路线','背着灯去看日出']
};

const COMPANION_TRAITS = ['好奇又认真','慢热但很可靠','柔软又细心','安静却有主见','爱照顾身边的人','有一点冒失但很真诚','喜欢把复杂的事变简单','遇到困难会先歇一歇','擅长发现别人忽略的小事','愿意陪朋友多试一次','温柔又勇敢','喜欢用行动表达关心'];

function getCompanionHome(courseId, day) {
  const homes = {
    ebp: day <= 7 ? '微光花园' : day <= 12 ? '云朵邮局' : day <= 19 ? '向前小径' : '心愿街',
    cbt: day <= 3 ? '三岔观察所' : day <= 8 ? '五感暖屋' : day <= 15 ? '事实侦探社' : '工具工坊',
    act: day <= 7 ? '启程港' : day <= 14 ? '勇气练习场' : '远行山谷'
  };
  return homes[courseId] || '微光花园';
}

function getCompanionLore(courseId, day) {
  const names = COMPANION_NICKNAMES[courseId] || COMPANION_NICKNAMES.ebp;
  const index = Math.max(0, Math.min(names.length - 1, day - 1));
  const previous = names[(index - 1 + names.length) % names.length];
  const next = names[(index + 1) % names.length];
  const courseOrder = ['ebp', 'cbt', 'act'];
  const crossCourse = courseOrder[(Math.max(0, courseOrder.indexOf(courseId)) + 1) % courseOrder.length];
  const crossNames = COMPANION_NICKNAMES[crossCourse];
  const penPal = crossNames[index % crossNames.length];
  const offset = { ebp: 0, cbt: 4, act: 8 }[courseId] || 0;
  const favorite = (COMPANION_FAVORITES[courseId] || COMPANION_FAVORITES.ebp)[index];
  const home = getCompanionHome(courseId, day);
  const duoMoments = DUO_MOMENTS[courseId] || DUO_MOMENTS.ebp;
  return {
    nickname: names[index],
    home,
    personality: COMPANION_TRAITS[(index + offset) % COMPANION_TRAITS.length],
    favorite,
    relation: '和' + previous + '、' + next + '是日常搭档，也会和笔友' + penPal + '交换近况小纸条。',
    story: '在' + home + '，' + names[index] + '正忙着' + favorite + '。它听说' + STORY_LEADS.hero + '和' + STORY_LEADS.heroine + '一起完成了第' + day + '天练习，便带着自己的小本领赶来，成为两个人今天遇见的新伙伴。',
    duo: duoMoments[index % duoMoments.length]
  };
}

function getCardArtwork(courseId, day) {
  const filename = (COMPANION_ARTWORK[courseId] || [])[day - 1] || COMPANION_ARTWORK.ebp[0];
  return { src: 'assets/companions/v2/' + filename + '.webp', hue: 0 };
}

// 每日能力文案：精灵与技能都唯一对应当天内容，不代表医疗效果。
const CARD_COMPANIONS = {
  ebp: [
    ['好奇芽','初见微光','带着好奇看见当下，而不是急着评价。'],
    ['慢尝团','一口此刻','把注意力带回味道与正在发生的体验。'],
    ['触触绒','柔软落地','借助触感回到身体，减轻思绪拉扯。'],
    ['闻香猫','气息寻路','用熟悉气味找到片刻安稳与愉悦。'],
    ['听身熊','身体来信','听见身体需要，并给自己温柔照顾。'],
    ['拾喜雀','小喜收藏','更容易发现并保存生活里的开心小事。'],
    ['微光芽','小步生长','看见已经做到的部分，减轻完美压力。'],
    ['流云团','情绪流动','提醒你情绪会变化，不必马上消灭它。'],
    ['名名狐','情绪点名','为感受准确命名，让内心变得更清楚。'],
    ['容容鲸','给它空间','允许情绪暂时存在，减少与它的对抗。'],
    ['寻心猫','内心译员','从情绪背后听见自己真正的需要。'],
    ['松手獭','停止较劲','接纳眼前现实，把力气留给下一步。'],
    ['向心鸟','方向罗盘','情绪摇晃时，仍记得自己重视的方向。'],
    ['行动芽','价值落地','把重要的事变成今天能做的小动作。'],
    ['一步龟','现在就走','不等状态完美，也能开始一小步。'],
    ['同行兔','带着感受走','让困难情绪同行，但不替你做决定。'],
    ['日常狸','练习入袋','把觉察、接纳和行动带进普通生活。'],
    ['再来鸟','温柔重复','允许不完美，用重复练习积累能力。'],
    ['心树灵','持续照料','提醒你像照料树一样照料情绪能力。'],
    ['丰盛熊','幸福拼图','看见愉快之外的投入、意义与成长。'],
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
    ['事实猫','事实分界','把可观察事实与脑中的解释分开。'],
    ['核实猫','证据核验','检查情绪是否符合事实，再决定回应。'],
    ['灰度狐','连续光谱','跳出非黑即白，看见更多可能程度。'],
    ['分责狸','责任拼图','按比例分配责任，不把结果全压给自己。'],
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
    ['启程猫','方向启航','看清焦虑代价与想要生活，找到改变方向。'],
    ['四象猫','焦虑地图','从外界、身体、想法和行为看清焦虑链。'],
    ['回避兔','循环识破','识别短暂轻松如何让回避被长期维持。'],
    ['估险狐','双面估算','同时检验风险大小与自己的应对能力。'],
    ['担忧鸦','有用检验','分辨担忧是在准备，还是只让自己打转。'],
    ['解题獭','下一步行动','把能解决的担忧转成清晰的下一步。'],
    ['未知鸟','不确定练习','用小实验逐渐提升对不确定性的承受力。'],
    ['护栏狸','安全松绑','看见安全行为如何阻挡你获得新证据。'],
    ['靠近兔','减少回避','逐步靠近曾躲开的事，验证真实能力。'],
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
    ['远行猫','勇气续航','带上有效方法，让勇敢行动继续发生。']
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
  const lore = getCompanionLore(courseId, day);
  return {
    name: lore.nickname,
    title: item[0],
    skill: item[1],
    help: item[2],
    message: '“' + STORY_LEADS.hero + '、' + STORY_LEADS.heroine + '，' + item[2] + ' 今天不必做到完美，愿意一起练习就已经很珍贵了。”',
    ...lore
  };
}

function renderDailyReview(container, progress, context, available, onSave, onFinished) {
  if (!container) return null;
  const recovery = ensureRecovery(progress);
  const legacyAfter = recovery.after || {};
  const card = recovery.card || {};
  const initialTakeaway = card.takeaway || legacyAfter.understanding || '';
  container.className = 'recovery-card daily-review';
  container.hidden = !available;
  const companion = getCardCompanion(context.courseId, context.day);
  const artwork = getCardArtwork(context.courseId, context.day, companion.name);

  function renderClosed() {
    container.innerHTML = `<div class="encounter-intro">
      <span class="recovery-kicker">今天的练习完成了</span>
      <h2>有一位伙伴来到这里</h2>
      <p>你认真走过的这一段，被它悄悄看见了。</p>
      <button type="button" class="encounter-capsule" aria-label="打开今日心灵胶囊"><span></span><i>✦</i></button>
      <button type="button" class="btn btn-primary encounter-open">看看是谁</button>
    </div>`;
    const open = async () => {
      const openBtn = container.querySelector('.encounter-open');
      if (openBtn.disabled) return;
      openBtn.disabled = true;
      recovery.card = {
        takeaway: initialTakeaway,
        moods: card.moods || [],
        code: getCardCode(context.courseId, context.day),
        symbol: getCardSymbol(context.courseId, context.day),
        unlocked_at: card.unlocked_at || new Date().toISOString(),
        saved_at: new Date().toISOString()
      };
      try {
        await onSave();
      } catch (error) {
        openBtn.disabled = false;
        showToast('伙伴暂时没有保存成功，请再试一次', 'error');
        return;
      }
      container.classList.add('encounter-opening');
      const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 900;
      setTimeout(() => {
        container.classList.remove('encounter-opening');
        renderRevealed();
        if (onFinished) onFinished(recovery.card);
      }, delay);
    };
    container.querySelector('.encounter-open').addEventListener('click', open);
    container.querySelector('.encounter-capsule').addEventListener('click', open);
  }

  function renderRevealed() {
    const savedCard = recovery.card || card;
    container.innerHTML = `<div class="encounter-revealed">
      <span class="recovery-kicker">今日相遇</span>
      <div class="encounter-halo"><img src="${artwork.src}" alt="${recoveryEscape(companion.name)}" style="--art-hue:${artwork.hue}deg"></div>
      <h2>${recoveryEscape(companion.name)}来陪你了</h2>
      <span class="encounter-character-title">${recoveryEscape(companion.title)} · 来自${recoveryEscape(companion.home)}</span>
      <strong>${recoveryEscape(companion.skill)}</strong>
      <p>${recoveryEscape(companion.help)}</p>
      <div class="encounter-story"><span>相遇故事</span><p>${recoveryEscape(companion.story)}</p></div>
      <div class="encounter-duo"><span>和田田、缓缓的日常</span><p>${recoveryEscape(companion.duo)}</p></div>
      <blockquote class="encounter-message">${recoveryEscape(companion.message)}</blockquote>
      <div class="encounter-collected">✓ 已收进田田与缓缓的练习图鉴</div>
      <details class="encounter-note"${savedCard.takeaway ? ' open' : ''}>
        <summary>留下一句今天想记住的话 <span>可选</span></summary>
        <textarea rows="3" maxlength="160" placeholder="一句理解、一点感受，或一句想记住的话">${recoveryEscape(savedCard.takeaway || '')}</textarea>
        <button type="button" class="btn btn-secondary btn-small">保存这句话</button>
      </details>
    </div>`;
    const note = container.querySelector('.encounter-note textarea');
    container.querySelector('.encounter-note button').addEventListener('click', async () => {
      recovery.card.takeaway = note.value.trim();
      recovery.card.saved_at = new Date().toISOString();
      await onSave();
      showToast('已经替你收好了', 'success');
    });
  }

  if (card && card.unlocked_at) renderRevealed(); else renderClosed();
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
      <div class="collection-summary-copy"><span class="collection-eyebrow">TIANTIAN & HUANHUAN'S HEALING DEX</span><h3>田田与缓缓的疗愈图鉴</h3><p>两个人一起练习，也一起收藏生活里慢慢长出的力量。</p></div>
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
      const artwork = getCardArtwork(item.course.id, item.day, item.companion.name);
      return `<button class="album-card ${unlockedCard ? 'unlocked' : 'locked'}" data-course="${item.course.id}" data-day="${item.day}" style="--card-color:${item.course.color}">
        <span class="album-card-head"><span class="album-card-code">NO.${String(item.day).padStart(2, '0')}</span></span>
        <span class="album-card-art"><span class="album-card-orbit"></span>${unlockedCard ? '<img class="album-card-creature" src="' + artwork.src + '" alt="' + recoveryEscape(item.companion.name) + '" style="--art-hue:' + artwork.hue + 'deg">' : '<span class="album-card-silhouette">✦</span>'}</span>
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
    const saveButton = modalBody.querySelector('.achievement-save');
    saveButton.addEventListener('click', () => saveCompanionCardImage(item, saveButton));
    modal.hidden = false;
  });
  modal.querySelector('.collection-modal-close').addEventListener('click', () => { modal.hidden = true; });
  modal.addEventListener('click', event => { if (event.target === modal) modal.hidden = true; });
}

function renderUnlockedCard(item) {
  const date = item.card.unlocked_at ? new Date(item.card.unlocked_at).toLocaleDateString('zh-CN') : '';
  const artwork = getCardArtwork(item.course.id, item.day, item.companion.name);
  return `<article class="achievement-card" style="--card-color:${item.course.color}">
    <div class="achievement-card-shine"></div>
    <div class="achievement-card-top"><span>${getCardCode(item.course.id, item.day)}</span></div>
    <div class="achievement-card-visual"><span class="achievement-card-halo"></span><span class="achievement-stars">✦ · ✧ · ✦</span><img class="achievement-card-creature" src="${artwork.src}" alt="${recoveryEscape(item.companion.name)}" style="--art-hue:${artwork.hue}deg"></div>
    <div class="achievement-card-course">${recoveryEscape(item.course.name)} · 第 ${item.day} 天 · ${recoveryEscape(item.companion.title)}</div>
    <div class="achievement-card-skill-name">${recoveryEscape(item.companion.skill)}</div>
    <h3>✦ ${recoveryEscape(item.companion.name)} ✦</h3>
    <p class="achievement-card-help">${recoveryEscape(item.companion.help)}</p>
    <div class="achievement-card-profile">
      <div><small>住在</small><p>${recoveryEscape(item.companion.home)}</p></div>
      <div><small>性格</small><p>${recoveryEscape(item.companion.personality)}</p></div>
      <div><small>喜欢</small><p>${recoveryEscape(item.companion.favorite)}</p></div>
    </div>
    <details class="achievement-card-lore">
      <summary><span>故事档案</span><small>相遇 · 日常 · 朋友 · 寄语</small><i>⌄</i></summary>
      <div class="achievement-card-story"><small>相遇故事</small><p>${recoveryEscape(item.companion.story)}</p></div>
      <div class="achievement-card-duo"><small>和田田、缓缓的日常</small><p>${recoveryEscape(item.companion.duo)}</p></div>
      <div class="achievement-card-relationship"><i>♡</i><div><small>朋友关系</small><p>${recoveryEscape(item.companion.relation)}</p></div></div>
      <blockquote class="achievement-card-message">${recoveryEscape(item.companion.message)}</blockquote>
    </details>
    <div class="achievement-card-theme">${recoveryEscape(item.theme)}</div>
    <div class="achievement-card-knowledge"><i>✦</i><div><small>今日重点</small><p>${recoveryEscape(item.knowledge || getCardKnowledge(item.course.id, item.day))}</p></div></div>
    ${item.card.takeaway ? '<div class="achievement-card-copy"><i>◇</i><div><small>今天留下了</small><p>' + recoveryEscape(item.card.takeaway) + '</p></div></div>' : ''}
    <div class="achievement-card-moods">${(item.card.moods || []).map(mood => '<span>' + recoveryEscape(mood) + '</span>').join('')}</div>
    <footer>${date} · 田田与缓缓共同收藏</footer>
  </article>
  <div class="achievement-card-actions"><button type="button" class="achievement-save"><span>⇩</span> 保存完整卡片图片</button><small>图片会包含全部故事内容</small></div>`;
}

function recoveryCanvasRoundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function recoveryCanvasLines(ctx, text, maxWidth) {
  const source = String(text || '');
  const lines = [];
  let line = '';
  for (const character of source) {
    const test = line + character;
    if (line && ctx.measureText(test).width > maxWidth) {
      lines.push(line);
      line = character;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function recoveryCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const lines = recoveryCanvasLines(ctx, text, maxWidth);
  const visible = typeof maxLines === 'number' ? lines.slice(0, maxLines) : lines;
  visible.forEach((line, index) => {
    let value = line;
    if (index === visible.length - 1 && visible.length < lines.length) value = value.replace(/[，。；、]$/, '') + '…';
    ctx.fillText(value, x, y + index * lineHeight);
  });
  return y + visible.length * lineHeight;
}

function recoveryCanvasSection(ctx, label, text, y, accent, options) {
  const config = options || {};
  const height = config.height || 172;
  recoveryCanvasRoundRect(ctx, 70, y, 940, height, 30);
  ctx.fillStyle = config.background || '#fffdf5';
  ctx.fill();
  ctx.strokeStyle = accent + '55';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = '700 27px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
  ctx.fillText(label, 105, y + 47);
  ctx.fillStyle = '#40564c';
  ctx.font = '29px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
  recoveryCanvasText(ctx, text, 105, y + 93, 870, 43, config.maxLines || 2);
  return y + height;
}

function recoveryLoadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('伙伴图片加载失败'));
    image.src = src;
  });
}

async function createCompanionCardCanvas(item) {
  if (document.fonts && document.fonts.ready) await document.fonts.ready;
  const artwork = getCardArtwork(item.course.id, item.day, item.companion.name);
  const creature = await recoveryLoadImage(artwork.src);
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 2200;
  const ctx = canvas.getContext('2d');
  const accent = item.course.color || '#779b86';

  const background = ctx.createLinearGradient(0, 0, 1080, 2200);
  background.addColorStop(0, '#f2f4e8');
  background.addColorStop(.55, '#fffaf0');
  background.addColorStop(1, '#eee7d4');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 1080, 2200);
  recoveryCanvasRoundRect(ctx, 34, 34, 1012, 2132, 64);
  ctx.strokeStyle = '#b99a54';
  ctx.lineWidth = 7;
  ctx.stroke();
  recoveryCanvasRoundRect(ctx, 54, 54, 972, 2092, 50);
  ctx.strokeStyle = '#d7c58d';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#80652c';
  ctx.font = '700 28px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText(getCardCode(item.course.id, item.day), 82, 105);
  ctx.textAlign = 'right';
  ctx.fillText('TIANTIAN & HUANHUAN', 998, 105);

  ctx.save();
  ctx.globalAlpha = .2;
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(540, 325, 228, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  const scale = Math.min(430 / creature.naturalWidth, 390 / creature.naturalHeight);
  const artWidth = creature.naturalWidth * scale;
  const artHeight = creature.naturalHeight * scale;
  ctx.save();
  ctx.filter = 'drop-shadow(0 24px 18px rgba(48,60,51,.22))';
  ctx.drawImage(creature, 540 - artWidth / 2, 335 - artHeight / 2, artWidth, artHeight);
  ctx.restore();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#76652f';
  ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
  ctx.fillText(item.course.name + ' · 第 ' + item.day + ' 天 · ' + item.companion.title, 540, 555);
  recoveryCanvasRoundRect(ctx, 375, 580, 330, 62, 31);
  ctx.fillStyle = accent;
  ctx.fill();
  ctx.fillStyle = '#fff9dc';
  ctx.font = '700 27px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
  ctx.fillText(item.companion.skill, 540, 621);
  ctx.fillStyle = '#314b3c';
  ctx.font = '600 52px Georgia, "Songti SC", serif';
  ctx.fillText('✦ ' + item.companion.name + ' ✦', 540, 704);
  ctx.fillStyle = '#5c7166';
  ctx.font = '30px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
  recoveryCanvasText(ctx, item.companion.help, 540, 755, 850, 44, 2);

  const profile = [
    ['住在', item.companion.home],
    ['性格', item.companion.personality],
    ['喜欢', item.companion.favorite]
  ];
  profile.forEach((entry, index) => {
    const x = 70 + index * 320;
    recoveryCanvasRoundRect(ctx, x, 835, 300, 112, 24);
    ctx.fillStyle = '#ffffffaa';
    ctx.fill();
    ctx.fillStyle = '#8a7b57';
    ctx.font = '23px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(entry[0], x + 150, 872);
    ctx.fillStyle = '#40564c';
    ctx.font = '700 25px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
    recoveryCanvasText(ctx, entry[1], x + 150, 915, 250, 34, 1);
  });

  ctx.textAlign = 'left';
  let sectionY = 978;
  sectionY = recoveryCanvasSection(ctx, '相遇故事', item.companion.story, sectionY, accent, { height: 188, maxLines: 3 });
  sectionY += 16;
  sectionY = recoveryCanvasSection(ctx, '和田田、缓缓的日常', item.companion.duo, sectionY, accent, { height: 188, maxLines: 3 });
  sectionY += 16;
  sectionY = recoveryCanvasSection(ctx, '朋友关系', item.companion.relation, sectionY, '#c0857a', { height: 156, maxLines: 2 });
  sectionY += 16;
  sectionY = recoveryCanvasSection(ctx, '精灵寄语', item.companion.message, sectionY, '#b58b36', { height: 188, maxLines: 3, background: '#fff8e8' });
  sectionY += 16;
  sectionY = recoveryCanvasSection(ctx, '今日重点', item.knowledge || getCardKnowledge(item.course.id, item.day), sectionY, accent, { height: 168, maxLines: 2 });
  if (item.card.takeaway) {
    sectionY += 16;
    recoveryCanvasSection(ctx, '今天留下了', item.card.takeaway, sectionY, '#8b769d', { height: 150, maxLines: 2 });
  }

  const date = item.card.unlocked_at ? new Date(item.card.unlocked_at).toLocaleDateString('zh-CN') : '';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#7b806f';
  ctx.font = '25px Georgia, "Songti SC", serif';
  ctx.fillText(date + ' · 田田与缓缓共同收藏', 540, 2120);
  return canvas;
}

async function saveCompanionCardImage(item, button) {
  const original = button.innerHTML;
  button.disabled = true;
  button.textContent = '正在绘制完整卡片…';
  try {
    const canvas = await createCompanionCardCanvas(item);
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(value => value ? resolve(value) : reject(new Error('图片生成失败')), 'image/png');
    });
    const filename = '田田与缓缓-' + getCardCode(item.course.id, item.day) + '-' + item.companion.name + '.png';
    const file = typeof File === 'function' ? new File([blob], filename, { type: 'image/png' }) : null;
    if (file && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: item.companion.name + '的疗愈卡片' });
      } catch (error) {
        if (error && error.name === 'AbortError') return;
        throw error;
      }
    } else {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    }
    showToast('完整卡片图片已经准备好了', 'success');
  } catch (error) {
    console.error('保存图鉴卡片失败', error);
    showToast('卡片图片暂时没有生成成功，请再试一次', 'error');
  } finally {
    button.disabled = false;
    button.innerHTML = original;
  }
}

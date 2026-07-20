// recovery.js - 每日成果卡与练习图鉴

const CARD_MOODS = ['平静了一些', '更清楚了', '更愿意接纳', '有一点力量', '仍有些紧绷', '有些疲惫', '暂时没感觉'];
const CARD_SYMBOLS = {
  ebp: ['🌱','💧','🍃','🌼','🫧','☀️','⭐','🌙','🌊','🪷','🪶','🌈','🍀','🕊️','🐚','🌿','🪴','🌤️','✨','🌻','🍵','🪨','🌳','✨','🏡'],
  cbt: ['🔍','💡','🧭','🪞','🧩','🔦','⚖️','🗺️','🔭','🧠','🛤️','🪜','🔑','🧱','🛡️','📝','🧶','🎯','🧰','🌉','🏆'],
  act: ['⛵','🧘','🌾','🚶','🧗','🌬️','🪁','🚪','👣','🌄','⛰️','🛶','🧭','🌊','🔥','🌌','🪵','🌲','🕯️','🌅','🏔️']
};

// 每一天都对应一张独立配图；数组顺序严格对应课程天数。
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

function getCardArtwork(courseId, day) {
  const filename = (COMPANION_ARTWORK[courseId] || [])[day - 1] || COMPANION_ARTWORK.ebp[0];
  return { src: 'assets/companions/v2/' + filename + '.webp', hue: 0 };
}

// 每日能力文案：与当天课程内容对应，不代表医疗效果。
const CARD_COMPANIONS = {
  ebp: [
    ['好奇芽','初见微光','带着好奇看见当下，而不是急着评价。'],
    ['慢尝团','一口此刻','把注意力带回味道与正在发生的体验。'],
    ['触触绒','柔软落地','借助触感回到身体，减轻思绪拉扯。'],
    ['闻香猫','气息寻路','用熟悉气味找到片刻安稳与愉悦。'],
    ['听身熊','行走觉察','在行动中感受身体与环境，让注意力回到当下。'],
    ['拾喜雀','小喜收藏','更容易发现并保存生活里的开心小事。'],
    ['微光芽','小步生长','看见已经做到的部分，减轻完美压力。'],
    ['流云团','感官回望','回顾多种感官练习，找到最适合自己的当下入口。'],
    ['名名狐','情绪点名','为感受准确命名，让内心变得更清楚。'],
    ['容容鲸','读懂信号','理解情绪在提醒什么，再选择合适的回应。'],
    ['寻心猫','看清链条','分清事件、想法、情绪、身体和行为如何相互影响。'],
    ['松手獭','识别循环','看见念头与行为如何维持情绪，找到可以改变的一环。'],
    ['向心鸟','念头命名','给反复出现的想法起名字，与它拉开一点距离。'],
    ['行动芽','允许来去','觉察情绪、想法和身体反应，不评判地让它们自然变化。'],
    ['一步龟','模式观察','识别行为带来的短期效果与长期影响。'],
    ['同行兔','回应选择','澄清自己的期待，选择更能满足需要的行为。'],
    ['日常狸','价值罗盘','找到真正重视的方向，为后续行动提供坐标。'],
    ['再来鸟','目标落地','把抽象价值转成具体、可执行的近期目标。'],
    ['心树灵','应对组合','把觉察、接纳和调节方法组合起来，应对日常压力。'],
    ['丰盛熊','日常践行','让重要的价值进入日常安排，而不只停留在想法里。'],
    ['信使鸽','耐心培育','把情绪能力看成需要反复练习、逐渐生长的系统。'],
    ['觉容莲','幸福全景','看见幸福不只来自愉快，也来自投入、关系、意义和成长。'],
    ['识己猫','情绪来信','把情绪当作信息，理解它与环境、需要和行动的关系。'],
    ['初心萤','觉察与接纳','先看见正在发生的体验，再允许它如实存在。'],
    ['锦囊狸','成为自己','整合需要、优势与价值，选择更符合自己的生活方向。']
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
    ['启程猫','方向启航','看清焦虑的代价与想要的生活，找到改变方向。'],
    ['四象猫','焦虑地图','从外界、身体、想法和行为看清焦虑链。'],
    ['回避兔','循环识破','识别短暂轻松如何让回避被长期维持。'],
    ['估险狐','双面估算','同时检验风险大小与自己的应对能力。'],
    ['担忧鸦','有用检验','分辨担忧是在准备，还是只让自己打转。'],
    ['解题獭','下一步行动','把能解决的担忧转成清晰的下一步。'],
    ['未知鸟','不确定练习','用小实验练习与不确定性相处，逐步扩大可承受范围。'],
    ['护栏狸','安全松绑','看见安全行为如何让人难以获得新证据。'],
    ['靠近兔','减少回避','逐步靠近曾躲开的事，收集自己能够应对的现实证据。'],
    ['自信熊','少问一次','减少反复确认，练习相信自己的判断。'],
    ['勇行犬','带着焦虑走','允许可承受的焦虑存在，同时靠近目标。'],
    ['阶梯羊','由易到难','把挑战排成阶梯，让练习可以持续。'],
    ['事实雀','行动复盘','行动后记录真实结果，而不只看感受。'],
    ['实验狐','预测验证','用现实实验检验未来预测，停止空转想象。'],
    ['心跳鲸','感觉重学','在安全且可承受的范围内接触身体感觉，修正危险误解。'],
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
    '在行走与活动中留意身体感受，让注意力重新回到当下。',
    '主动记录开心小事，会让积极体验更容易被看见。',
    '小成就也值得记录，专注今天更容易坚持。',
    '回顾视觉、味觉、触觉、嗅觉与行动体验，建立自己的当下练习组合。',
    '用名称、强度和持续时间描述情绪，比笼统地说“难受”更清楚。',
    '情绪有提醒和保护功能，读懂信息后再决定如何回应。',
    '事件、想法、情绪、身体反应和行为会彼此影响，共同构成情绪过程。',
    '情绪会随时间和行动变化；看清维持它的环节，才能找到切入点。',
    '给反复出现的想法起名字，能帮助我们把“念头”与“事实”分开。',
    '觉察内心体验而不急着评判，允许情绪、想法和身体反应自然来去。',
    '行为可能立即减轻不适，也可能带来长期代价；需要把两者一起看。',
    '先澄清真正期待，再选择更可能满足这些期待的行为。',
    '价值是想要持续靠近的生活方向，不是一次完成就结束的目标。',
    '把价值转成近24小时和未来一周可以采取的具体行动。',
    '根据情绪强度与现实处境，组合使用觉察、接纳、调节和行动技能。',
    '将价值行动放进日常安排，并为可能的阻碍预留应对方法。',
    '情绪能力不靠一次顿悟，而是在反复练习与调整中逐渐生长。',
    '幸福不只是愉快感，也来自投入、关系、胜任、意义与成长。',
    '情绪不是故障，而是与环境、需要和行动有关的信息。',
    '觉察是如实看见当下体验，接纳是允许体验暂时按它本来的样子存在。',
    '把需要、优势与价值连在一起，更清楚地选择自己想成为的人。'
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
    '通过小实验接触不确定性，练习逐步扩大自己的可承受范围。',
    '安全行为带来短暂安心，也可能阻止我们获得新证据。',
    '逐步减少回避，才有机会收集自己能够应对的现实证据。',
    '减少确认、依赖等靠近型安全行为，练习相信自己的能力。',
    '带着可承受的焦虑靠近目标，是重新学习安全的过程。',
    '把挑战排成由易到难的阶梯，练习更可持续。',
    '行动前允许焦虑存在，行动后记录事实而非只看感受。',
    '针对未来担忧，用现实实验检验预测，而非继续想象。',
    '在安全且可承受的范围内接触身体感觉，有助于检验“这些感觉很危险”的理解。',
    '在社交场景中减少自我监控，把注意力带回真实互动。',
    '一次实验不是终点，重复和升级才能形成稳定的新学习。',
    '用“足够好”的行动挑战完美主义，而不是等待万无一失。',
    '实验要具体、可重复，并同时记录预测、结果与应对。',
    '挫折也是数据，复盘和调整比给自己判失败更重要。',
    '回顾勇敢行动与有效方法，把练习继续带进未来生活。'
  ]
};

// 67 天共同构成一条连续旅程：回到当下 → 看清想法 → 走进生活。
// 故事只承载课程重点，不另造一套庞大世界观。
const CARD_STORIES = {
  ebp: [
    '不急着得出结论，先看清眼前正在发生的事。',
    '第二天，他把速度慢下来，从一口食物里重新感受“此刻”。',
    '当思绪再次跑远，可以借助手中真实的温度和质地，把注意力带回身体。',
    '气味让一段普通时刻变得清晰。他开始明白，稳定不一定来自想通，也可以来自感受。',
    '出门走一段路，留意脚步、呼吸和周围的声音，把注意力带回正在发生的生活。',
    '他开始把开心小事写进记录。那些事没有变大，只是终于没再被忽略。',
    '记下已经做到的事，把“还不够”改成“我正在往前”。',
    '他回顾这一周的感官练习，给自己留下一张“回到当下”的路线图。',
    '用名称、强度和持续时间描述情绪，比一句“我不好”更具体。',
    '把情绪视为信号，并尝试理解它正在提醒什么。',
    '他把一次情绪起伏拆成事件、想法、身体反应和行为，终于看见了它的来路。',
    '持续记录可以帮助我们看见：情绪会被某些念头和行为维持，也会因新的选择而变化。',
    '给反复出现的“一定会搞砸”起一个名字，有助于区分念头与事实。',
    '这一阶段的终点不是让内心安静，而是能够看见所有体验，并允许它们暂时存在。',
    '观察哪些行为只带来短暂轻松，哪些行为能让生活靠近真正重视的方向。',
    '当期待变得具体，选择也开始清楚。他不再只问“怎样才不难受”，而是问“我想怎样回应”。',
    '他为自己重视的关系、成长和生活方式写下了方向。这是旅程中第一枚真正的罗盘。',
    '方向不能代替行动，把价值改写成今天和本周能完成的具体动作。',
    '面对压力时，他开始按强度和处境选择工具：先觉察，必要时调节，然后决定下一步。',
    '把重要的事放进真实日程，让价值落实为时间和精力的具体安排。',
    '他不再期待一次掌握所有方法，而是把每次练习当作为能力系统添加的一个新连接。',
    '幸福不只意味着情绪高涨，也包括投入、关系、意义和成长。',
    '他再次翻开情绪记录，这次看到的不是故障清单，而是一封封关于处境与需要的来信。',
    '觉察是看清，接纳是不再否认；不必先达到理想状态，才允许自己生活。',
    '这一阶段没有标准答案，重要的是更清楚地理解自己并选择适合自己的方法。'
  ],
  cbt: [
    '情绪出现时，先判断强度和问题性质，再选择合适的应对方式。',
    '他学会把情绪的保护作用和现实代价同时放上天平，而不再只问它是好是坏。',
    '第三天，模糊的“很难受”被改写成可观察的强度读数，也让选择工具有了依据。',
    '当情绪强度过高，先放下分析，用温和触碰帮助身体恢复安全感。',
    '他为自己准备了一组五感资源。它们不负责消除情绪，只帮他先稳住当下。',
    '练习先绷紧、再放松不同肌群，通过对比重新识别身体里的紧张。',
    '一次适度运动让他看见：身体不只承受压力，也可以参与调节压力。',
    '他把降温作为高强度情绪时的紧急入口：先让身体回到可承受范围，再处理问题。',
    '在事件和情绪之间，留意“我如何解释它”这一环节。',
    '他练习像摄像机一样重述事件，把可观察的事实与头脑中的判断分开。',
    '结合更多事实线索，检查情绪的类型和强度是否与现实相符。',
    '当头脑只剩“全好”或“全坏”，他把判断放回连续刻度，找回了中间的细节。',
    '面对不理想的结果，重新评估各项影响因素，避免把全部责任归于自己。',
    '他开始用证据、其他视角和对朋友的标准追问旧想法，让新解释有机会出现。',
    '那些熟悉的自我批评被他识别为“旧磁带”。它们可以播放，却不再拥有最终解释权。',
    '把自己放在观察念头的位置：想法仍会出现，但不必跟随每一个想法。',
    '为了修正负面偏向，他主动收集曾被忽略的积极证据，让评价回到更完整的现实。',
    '当念头催促立即反应时，尝试稍后再回应，给想法和情绪留出变化时间。',
    '他把一团模糊的烦恼改写成一个具体问题，也因此分清了哪些部分能行动。',
    '问题不需要一次解决，可以先把方案缩小到今天能够完成的第一步。',
    '第二段旅程结束时，那棵决策树已经变成工具库：先看清处境，再选择方法，最后回到行动。'
  ],
  act: [
    '把关注点从“如何不焦虑”转向“我想过怎样的生活”。',
    '他为焦虑画了一张四部分地图：外界、身体、想法与行为，每一部分都可以被观察。',
    '识别回避的循环：它带来短暂轻松，却也让危险感长期得不到更新。',
    '当焦虑同时高估风险、低估能力，他开始要求自己把两边的证据都写下来。',
    '他检查每一段担忧：它是在准备一个行动，还是只让思绪在原地打转？',
    '对于能够解决的问题，停止继续预演，把担忧转化成一个清晰的下一步。',
    '对于无法完全确定的事，他不再等待绝对安心，而是设计了第一个可承受的小实验。',
    '识别那些带来暂时安心、却妨碍新证据出现的安全行为。',
    '他把一个长期避开的场景拆小，往前靠近一步，为现实结果留出更新旧预测的机会。',
    '面对反复确认的冲动，尝试少确认一次，练习相信自己的判断。',
    '直面焦虑不是证明无所畏惧，而是带着可承受的不适继续靠近真正重视的事。',
    '为了让练习可持续，他把挑战按难度排成阶梯，每一级都明确到可以执行。',
    '实验后不只记录“我有多焦虑”，也记录真实发生了什么以及自己如何应对。',
    '当担忧指向未来，他把预测写成可验证的命题，再让现实给出答案。',
    '当危险感来自心跳、呼吸或眩晕，可以在安全且可承受的范围内接触这些感觉，重新理解它们。',
    '走进社交场景时，他将注意力从“我表现得怎么样”移回对方、对话和正在发生的互动。',
    '一次成功不足以改变旧规律，需要重复练习，并在可承受的范围内逐步升级。',
    '完美主义要求万无一失，他却选择了一次“足够好”的完成，并让结果留在现实中。',
    '像研究者一样记录实验：预测、行动、结果与应对，而不是只留下成败结论。',
    '一次挫折出现后，他没有把它当作退回原点的证明，而是用新数据调整了下一次练习。',
    '不必等待焦虑完全消失后才开始行动，可以带着有效方法继续进入真实生活。'
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

function getCardStory(courseId, day) {
  const items = CARD_STORIES[courseId] || [];
  return items[day - 1] || '这一天的练习，为整段旅程留下了一个新坐标。';
}

function getCardCompanion(courseId, day) {
  const item = (CARD_COMPANIONS[courseId] || [])[day - 1] || ['陪伴芽','今日陪伴','陪你记住今天最有帮助的一点。'];
  return {
    name: '',
    title: item[0],
    skill: '课程重点',
    help: getCardKnowledge(courseId, day),
    story: ''
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
  const course = getCourseConfig(context.courseId);
  const dailyData = getCourseData(context.courseId, context.day) || {};
  const dailyTheme = dailyData.theme || `第 ${context.day} 天练习`;

  function renderClosed() {
    container.innerHTML = `<div class="encounter-intro">
      <span class="recovery-kicker">今天的练习完成了</span>
      <h2>查看今日练习回顾</h2>
      <p>回顾课程重点，也可以记下今天对你最有帮助的内容。</p>
      <button type="button" class="encounter-capsule" aria-label="查看今日练习回顾"><span></span><i>✓</i></button>
      <button type="button" class="btn btn-primary encounter-open">查看练习回顾</button>
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
        showToast('成果卡暂时没有保存成功，请再试一次', 'error');
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
      <span class="recovery-kicker">练习回顾</span>
      <div class="encounter-halo"><img src="${artwork.src}" alt="第 ${context.day} 天练习配图" style="--art-hue:${artwork.hue}deg"></div>
      <h2>${recoveryEscape(dailyTheme)}</h2>
      <span class="encounter-character-title">${recoveryEscape(course.name)} · 第 ${context.day} 天</span>
      <strong>课程重点</strong>
      <p>${recoveryEscape(companion.help)}</p>
      <div class="encounter-collected">✓ 已保存至练习图鉴</div>
      <details class="encounter-note"${savedCard.takeaway ? ' open' : ''}>
        <summary>记录今天想保留的内容 <span>可选</span></summary>
        <textarea rows="3" maxlength="160" placeholder="可以记录一项理解、感受或提醒">${recoveryEscape(savedCard.takeaway || '')}</textarea>
        <button type="button" class="btn btn-secondary btn-small">保存记录</button>
      </details>
    </div>`;
    const note = container.querySelector('.encounter-note textarea');
    container.querySelector('.encounter-note button').addEventListener('click', async () => {
      recovery.card.takeaway = note.value.trim();
      recovery.card.saved_at = new Date().toISOString();
      await onSave();
      showToast('记录已保存', 'success');
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
      <div class="collection-summary-copy"><span class="collection-eyebrow">MY COLLECTION</span><h3>我的图鉴</h3><p>回顾每天的课程重点，也看见一条从觉察到行动的完整路径。</p></div>
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
        <span class="album-card-art"><span class="album-card-orbit"></span>${unlockedCard ? '<img class="album-card-creature" src="' + artwork.src + '" alt="第 ' + item.day + ' 天练习配图" style="--art-hue:' + artwork.hue + 'deg">' : '<span class="album-card-silhouette">—</span>'}</span>
        <span class="album-card-info"><strong>${unlockedCard ? recoveryEscape(item.theme) : '尚未完成'}</strong><span class="album-card-theme">${unlockedCard ? recoveryEscape(item.course.name) + ' · 第 ' + item.day + ' 天' : '完成课程后查看'}</span><small>${unlockedCard ? '查看课程重点' : '完成第 ' + item.day + ' 天后查看'}</small></span>
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
    <div class="achievement-card-top"><span>${getCardCode(item.course.id, item.day)}</span><span>课程重点</span></div>
    <div class="achievement-card-visual"><span class="achievement-card-halo"></span><img class="achievement-card-creature" src="${artwork.src}" alt="第 ${item.day} 天练习配图" style="--art-hue:${artwork.hue}deg"></div>
    <div class="achievement-card-course">${recoveryEscape(item.course.name)} · 第 ${item.day} 天</div>
    <h3>${recoveryEscape(item.theme)}</h3>
    <div class="achievement-card-theme">${recoveryEscape(item.theme)}</div>
    <div class="achievement-card-knowledge"><i>✦</i><div><small>今日重点</small><p>${recoveryEscape(item.knowledge || getCardKnowledge(item.course.id, item.day))}</p></div></div>
    ${item.card.takeaway ? '<div class="achievement-card-copy"><i>◇</i><div><small>今天留下了</small><p>' + recoveryEscape(item.card.takeaway) + '</p></div></div>' : ''}
    <footer>${date} · 我的练习收藏</footer>
  </article>
  <div class="achievement-card-actions"><button type="button" class="achievement-save"><span>⇩</span> 保存练习卡片图片</button><small>图片会包含课程重点与个人记录</small></div>`;
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
    image.onerror = () => reject(new Error('练习配图加载失败'));
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
  ctx.fillText('MY COLLECTION', 998, 105);

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
  ctx.fillText(item.course.name + ' · 第 ' + item.day + ' 天', 540, 555);
  recoveryCanvasRoundRect(ctx, 375, 580, 330, 62, 31);
  ctx.fillStyle = accent;
  ctx.fill();
  ctx.fillStyle = '#fff9dc';
  ctx.font = '700 27px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
  ctx.fillText('课程重点', 540, 621);
  ctx.fillStyle = '#314b3c';
  ctx.font = '600 52px Georgia, "Songti SC", serif';
  ctx.fillText(item.theme, 540, 704);

  ctx.textAlign = 'left';
  let sectionY = 790;
  sectionY = recoveryCanvasSection(ctx, '今日重点', item.knowledge || getCardKnowledge(item.course.id, item.day), sectionY, accent, { height: 248, maxLines: 4 });
  if (item.card.takeaway) {
    sectionY += 16;
    recoveryCanvasSection(ctx, '今天留下了', item.card.takeaway, sectionY, '#8b769d', { height: 204, maxLines: 3 });
  }

  const date = item.card.unlocked_at ? new Date(item.card.unlocked_at).toLocaleDateString('zh-CN') : '';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#7b806f';
  ctx.font = '25px Georgia, "Songti SC", serif';
  ctx.fillText(date + ' · 我的练习收藏', 540, 2120);
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
    const filename = '我的图鉴-' + getCardCode(item.course.id, item.day) + '.png';
    const file = typeof File === 'function' ? new File([blob], filename, { type: 'image/png' }) : null;
    if (file && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: item.course.name + '第' + item.day + '天练习卡' });
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

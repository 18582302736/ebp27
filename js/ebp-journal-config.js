// EBP 第一阶段 25 天结构化书写配置（依据原始书写 PDF）
const EBP_LEGACY_JOURNAL_CONFIG = {
  1: repeatConfig('记录看到的积极画面', '暂时没有素材也没关系。可以先去生活，晚些时候再回来记录。', '幸福瞬间', [
    field('moment', '我看到了什么？', 'textarea', '描述眼睛看到的、带来积极体验的画面'),
    field('feeling', '它带给我什么感受或体验？', 'textarea')
  ], true),
  2: repeatConfig('记录愉悦的食物味道', '留意一日三餐，慢一点品尝。想到多少都可以记录。', '味觉瞬间', [
    field('moment', '我品尝了什么？', 'textarea', '可以写食物、味道、口感和温度'),
    field('feeling', '它带给我什么感受或联想？', 'textarea')
  ], true),
  3: repeatConfig('记录舒服的触觉体验', '触感可以来自双手，也可以是围巾、微风、拥抱或宠物。', '触觉瞬间', [
    field('moment', '我接触到了什么？', 'textarea'),
    field('feeling', '这是什么触感？它带给我什么体验？', 'textarea')
  ], true),
  4: repeatConfig('记录愉悦的气味', '气味可能带来情绪，也可能唤起一段记忆或联想。', '气味瞬间', [
    field('moment', '我闻到了什么？', 'textarea'),
    field('feeling', '这个气味带给我什么感受或联想？', 'textarea')
  ], true),
  5: repeatConfig('记录“动起来”时的积极体验', '可以记录一个活动的多个体验，也可以记录多个活动。', '活动', [
    field('activity', '我做了什么？', 'textarea', '散步、锻炼、做家务等都可以'),
    field('experiences', '活动中的体验', 'list', '看到、听到、闻到或身体感受到什么？')
  ], true),
  6: repeatConfig('我的开心小事清单', '不一定写 10 件，也不只限于 10 件，之后随时可以补充。', '开心小事', [
    field('thing', '做了就会开心的事情', 'textarea')
  ], true),
  7: mixedConfig('第一阶段回顾', '“至少没有变得更糟”也可以是一项成就。', {
    repeatLabel: '成就', repeatFields: [field('achievement', '我的成就', 'textarea')], photos: true,
    fields: [field('persistence', '我是如何做到坚持的？', 'textarea'), field('next', '还有哪些行动可以帮助我坚持下去？', 'textarea')]
  }),
  8: repeatConfig('觉察一天中的情绪', '可以只记录 1 个，也可以记录 3 个以上。分数没有好坏对错。', '情绪', [
    field('emotion', '我经历的情绪', 'text', '例如：焦虑、平静、愉悦'), field('scene', '当时的场景', 'textarea'),
    field('intensity', '情绪强度', 'range'), field('duration', '持续时间', 'text', '没印象时可以估计')
  ], true),
  9: fixedConfig('理解情绪传递的信息', '', [
    heading('积极情绪'), field('positiveEmotion', '我体验到的一个积极情绪', 'text'), field('positiveScene', '当时的场景', 'textarea'), field('positiveIntensity', '情绪强度', 'range'), field('desire', '我感受到它，可能因为我渴望', 'textarea'),
    heading('消极情绪'), field('negativeEmotion', '我体验到的一个消极情绪', 'text'), field('negativeScene', '当时的场景', 'textarea'), field('negativeIntensity', '情绪强度', 'range'), field('avoid', '我感受到它，可能因为我不想要', 'textarea')
  ]),
  10: fixedConfig('拆解一次情绪过程', '选择最近一件影响心情的事情，快乐或不开心都可以。', chain([
    ['event','影响我心情的事情'], ['thoughts','当时头脑里的想法'], ['emotions','当时的情绪'], ['body','当时身体的感受'], ['actions','我做了这些事情']
  ])),
  11: mixedConfig('制作我的情绪气象图', '记录一天里的变化，最后为整天的情绪天气起名。', {
    repeatLabel: '情绪时段', repeatFields: [field('time','时间','text'), field('event','事件','textarea'), field('emotion','情绪关键词','text'), field('intensity','情绪强度','range'), field('duration','持续时间','text')],
    fields: [field('weather', '我给今天的“情绪天气”起名为', 'text')]
  }),
  12: fixedConfig('认识我的“想法小人”', '想法是大脑面对事件时自然产生的评论，不一定等于现实。', chain([
    ['emotion','情绪关键词'], ['event','我遇到的事情'], ['thought','头脑里的“想法小人”说了什么'], ['name','我给这个“想法小人”取名为']
  ])),
  13: fixedConfig('分析行为的短期与长期效果', '', chain([
    ['emotion','我的情绪关键词'], ['scene','当时的场景'], ['action','当时采取的行动'], ['shortTerm','短期效果'], ['longTerm','长期效果'], ['decision','这是值得保持，还是需要减少的行为？']
  ])),
  14: fixedConfig('看清行为背后的期待', '不评价行为对错，只看它是否带来了期待的结果。', chain([
    ['emotion','我的情绪关键词'], ['scene','当时的场景'], ['action','当时采取的行动'], ['expectation','我这么做原本的期待'], ['result','这个行为是否满足期待'], ['newAction','下一次，我也许可以尝试的新行动']
  ])),
  15: fixedConfig('澄清我重视的价值', '如果有多个价值，先挑选一个此刻更重视的。', [
    field('value','我重视的价值','text'), field('meaning','它对我意味着什么？','textarea'), field('actions','从现在开始，我可以做的小事','list','写下一件今天或明天可以开始的小事')
  ]),
  16: fixedConfig('从价值形成近期目标', '', chain([
    ['goal','近期生活中想达成的目标'], ['value','这个目标背后的价值'], ['dayActions','未来 24 小时可以完成的小事'], ['weekActions','未来数天至一周可以完成的事'], ['coping','遇到困难、挑战时，我可以这样做']
  ])),
  17: fixedConfig('梳理情绪，并选择新的行动', '给感受命名，是为了看清它们，而不是评价自己。', chain([
    ['event','我想到的事情'], ['emotion','当时的情绪'], ['thought','当时的想法'], ['body','身体部位与身体感受'], ['oldAction','当时采取的行动'], ['newAction','现在可以采取的新行动'], ['shortResult','新行动可能带来的短期结果'], ['longResult','新行动可能带来的长期结果']
  ])),
  18: fixedConfig('拆解目标并跨过阻碍', '', [
    field('goal','近期想达成的目标','textarea'), field('value','目标背后的价值','textarea'), field('steps','我可以把目标拆成这些步骤','list','添加一个步骤'),
    field('easiest','马上能开始、最容易达成的一步','textarea'), field('startTime','我打算什么时候开始','text'), field('obstacles','可能遇到的阻碍','textarea','情绪、想法、身体感受或欲望'), field('coping','遇到困难时，我可以这样做','textarea')
  ]),
  19: fixedConfig('回顾初心、成就与坚持方法', '', [
    field('intention','我参加课程的初心','textarea'), field('achievements','我积累的成就','list','添加一项成就'), field('methods','帮助我坚持的方法','list','添加一种方法')
  ]),
  20: fixedConfig('我对幸福的理解', '', reflection(['我眼中的幸福是什么？','我的幸福来自哪里？','关于幸福，我还有什么感悟？'])),
  21: fixedConfig('我对情绪的理解', '', reflection(['情绪是什么？','我的情绪最近告诉我哪些事？','关于情绪，我还有什么感悟？'])),
  22: fixedConfig('觉察与接纳', '', reflection(['觉察意味着什么？','接纳意味着什么？','这两个词带给我哪些新的生活态度？'])),
  23: fixedConfig('探索自己', '', reflection(['我眼中的“自己”是什么样的？','如何成为理想中的自己？','关于探索自我，我还有什么感悟？'])),
  24: fixedConfig('我的初心与承诺', '', reflection(['我参加这个课程的初心是什么？','对未来，我给自己什么承诺？'])),
  25: fixedConfig('我的情绪小锦囊', '', reflection(['回顾 25 天，我最想带走的一个情绪锦囊是什么？','这个锦囊未来会如何帮助我？']))
};

// 结构化书写也严格跟随原始 PDF 1-25；第 8、14 天是正式总结日。
const EBP_JOURNAL_CONFIG = {};
for (let day = 1; day <= 7; day++) EBP_JOURNAL_CONFIG[day] = EBP_LEGACY_JOURNAL_CONFIG[day];
for (let oldDay = 8; oldDay <= 12; oldDay++) EBP_JOURNAL_CONFIG[oldDay + 1] = EBP_LEGACY_JOURNAL_CONFIG[oldDay];
for (let oldDay = 13; oldDay <= 23; oldDay++) EBP_JOURNAL_CONFIG[oldDay + 2] = EBP_LEGACY_JOURNAL_CONFIG[oldDay];

EBP_JOURNAL_CONFIG[7].initialItems = 5;
EBP_JOURNAL_CONFIG[7].minItems = 5;
for (let day = 1; day <= 4; day++) EBP_JOURNAL_CONFIG[day].initialItems = 2;
EBP_JOURNAL_CONFIG[8] = repeatConfig('第一阶段小结：回味幸福', '记录过去一天里带来幸福感的 3 个瞬间，并写下每个瞬间带来的感受或联想。', '幸福瞬间', [
  field('moment', '幸福瞬间', 'textarea'),
  field('feeling', '我的感受或联想', 'textarea')
], true);
EBP_JOURNAL_CONFIG[8].initialItems = 3;
EBP_JOURNAL_CONFIG[8].minItems = 3;
// 兼容 v2.8.2 以前第 8 天按 moment1/feeling1 等固定字段保存的数据。
EBP_JOURNAL_CONFIG[8].legacyGroupCount = 3;
EBP_JOURNAL_CONFIG[10] = groupedConfig('理解情绪传递的信息', '', [
  group('积极情绪', [
    field('positiveEmotion', '我今天体验到的一个积极情绪是', 'text'),
    field('positiveScene', '当时的场景', 'textarea'),
    field('positiveIntensity', '情绪强度分数', 'range'),
    field('desire', '我感受到这个情绪，可能因为我渴望', 'textarea')
  ]),
  group('消极情绪', [
    field('negativeEmotion', '我今天体验到的一个消极情绪是', 'text'),
    field('negativeScene', '当时的场景', 'textarea'),
    field('negativeIntensity', '情绪强度分数', 'range'),
    field('avoid', '我感受到这个情绪，可能因为我不想要', 'textarea')
  ])
]);
EBP_JOURNAL_CONFIG[12].initialItems = 2;
EBP_JOURNAL_CONFIG[9].helpTitle = '情绪强度参考示例';
EBP_JOURNAL_CONFIG[9].help = `最强烈 9 — 爱｜第一次抱着孩子，碰到她握拳的小手。
强烈 7 — 自豪｜申请了一年的研究项目进入了公示期。
中等 5 — 高兴｜和好久没见的大学舍友聚会，聊得很开心。
轻度 3 — 愉悦｜公园里偶遇一只黏人的小猫，和它玩了会儿。
没有情绪 1 — 平静｜无所事事地发呆。

最强烈 9 — 恐惧｜大学时，自己走夜路被人持刀抢劫。
强烈 7 — 焦虑｜几年前第一次在几百人的大教堂讲课，全程低头念 PPT。
中等 5 — 紧张｜有个工作任务，明天就是截止日期了，进度才到一半。
轻度 3 — 烦躁｜准备做饭，发现伴侣答应要洗的碗还在水槽里。
没有情绪 1 — 平静｜一个人走在去公司的路上。`;
EBP_JOURNAL_CONFIG[14] = fixedConfig('第二阶段小结：允许情绪自然来去', '把情绪、想法和身体反应视为会自然升起、维持和消失的内心体验。', [
  field('event', '1. 我想到的事情是', 'textarea'),
  field('emotions', '2. 当时我有这些情绪', 'textarea'),
  field('thoughts', '3. 当时头脑里有这些想法', 'textarea'),
  field('body', '4. 当时身体还出现这些反应', 'textarea'),
  field('name', '5. 我给这些内心体验取名为', 'text'),
  heading('6. 请记住：这些体验是大脑和身体遭遇事件时的正常反应。它们会自然地升起、维持和消失。允许它们停留一会儿，然后继续投入当下的生活。')
]);

// 交互表单沿用原有字段 key，避免影响已经保存的日记；显示文案逐项对齐原课程模板。
setJournalFieldLabels(1, ['幸福瞬间', '我的感受']);
setJournalFieldLabels(2, ['幸福瞬间', '我的感受']);
setJournalFieldLabels(3, ['幸福瞬间', '我的感受']);
setJournalFieldLabels(4, ['幸福瞬间', '我的感受']);
setJournalFieldLabels(5, ['我记录的活动', '活动中的积极体验']);
setJournalFieldLabels(6, ['开心小事']);
setJournalFieldLabels(7, ['我是如何做到坚持的', '还有哪些可以帮助我坚持下去的行动']);
setJournalRepeatFieldLabels(7, ['我的成就']);
setJournalFieldLabels(8, ['幸福瞬间', '我的感受或联想']);
setJournalFieldLabels(9, ['我今天经历的情绪', '当时的场景', '情绪强度分数', '情绪持续时间']);
setJournalFieldLabels(11, ['1. 影响我心情的事情是', '2. 我注意到，当时头脑里有这些想法', '3. 我注意到，当时头脑里有这些情绪', '4. 我注意到，当时身体有这些感受', '5. 我注意到，我做了这些事情']);
setJournalFieldLabels(12, ['我给今天一整天的“情绪天气”起名为']);
setJournalRepeatFieldLabels(12, ['时间', '事件', '情绪关键词', '情绪强度分数', '情绪持续时间']);
setJournalFieldLabels(13, ['1. 我想到的情绪关键词', '2. 我遇到的事情是', '3. 我注意到，当时头脑里有一个“想法小人”，它说', '4. 我给这个“想法小人”取名为']);
setJournalFieldLabels(14, ['1. 我想到的事情是', '2. 我注意到，当时我有这些情绪', '3. 我注意到，当时头脑里有这些想法', '4. 我注意到，当时身体还出现这些反应', '5. 这些来自头脑和身体的体验感受，我给它取名为']);
setJournalFieldLabels(15, ['1. 我的情绪关键词是', '2. 当时，我所处的场景是', '3. 当时，我有这样的行动', '4. 从短期内，行为带来这样的效果', '5. 从长期看，行为带来这样的效果', '6. 根据上述分析，我认为这是一个值得保持的行为，或是要减少的行为（例如回避、拖延等）']);
setJournalFieldLabels(16, ['1. 我的情绪关键词是', '2. 当时，我所处的场景是', '3. 当时，我有这样的行动', '4. 我这么做，原本的期待是', '5. 从结果看，这个行为是否满足期待', '6. 下一次，我也许能试试这些行动']);
setJournalFieldLabels(17, ['1. 我重视的价值是', '2. 它对我来说，意味着', '3. 为了实现它，从现在开始，我可以做这些小事']);
setJournalFieldLabels(18, ['1. 近期生活中，我想要达成的目标是', '2. 这个目标背后的价值是', '3. 为了达成目标，我可以在未来 24 小时里，完成这些小事', '4. 为了达成目标，我可以在未来数天至一周里，完成这些事', '5. 当遇到困难、挑战的时候，我可以这样做']);
setJournalFieldLabels(19, ['1. 我想到的事情是', '2. 我注意到，当时（你的名字）有 ______ 的情绪', '3. 我注意到，当时（你的名字）有这样的想法', '4. 我注意到，当时（你的名字）的 ______（身体部位），有一些这样的感受', '5. 当时，我采取了这样的行动', '6. 回顾学到的技巧，我现在可以采取这些新行动', '7. 新行动带来的短期结果是', '8. 新行动带来的长期结果是']);
setJournalFieldLabels(20, ['1. 近期生活中，我想要达成的目标是', '2. 这个目标背后的价值是', '3. 我可以把这个目标拆解成以下几步', '4. 马上就能开始做的、最容易达成的一个步骤是', '5. 你打算今天什么时候，开始做这一步', '6. 行动过程中，我可能会遇到这些阻碍（情绪、想法、身体感受、欲望）', '7. 回顾学到的技巧，当遇到困难、挑战的时候，我可以这样做']);
setJournalFieldLabels(21, ['1. 我参加行动营的初心是', '2. 参加行动过程中，我积累了这些成就', '3. 这些方法能帮助我更好地坚持行动']);

function setJournalFieldLabels(day, labels) {
  const config = EBP_JOURNAL_CONFIG[day];
  if (!config || !config.fields) return;
  const fields = config.fields.filter(item => item.kind === 'field');
  labels.forEach((label, index) => { if (fields[index]) fields[index].label = label; });
}

function setJournalRepeatFieldLabels(day, labels) {
  const config = EBP_JOURNAL_CONFIG[day];
  if (!config || !config.repeatFields) return;
  labels.forEach((label, index) => { if (config.repeatFields[index]) config.repeatFields[index].label = label; });
}

function field(key, label, type, placeholder) { return { kind: 'field', key, label, type: type || 'textarea', placeholder: placeholder || '' }; }
function heading(label) { return { kind: 'heading', label }; }
function group(label, fields) { return { label, fields }; }
function repeatConfig(title, note, repeatLabel, fields, photos) { return { type: 'repeat', title, note, repeatLabel, fields, photos: !!photos }; }
function fixedConfig(title, note, fields) { return { type: 'fixed', title, note, fields, photos: true }; }
function mixedConfig(title, note, options) { return Object.assign({ type: 'mixed', title, note, photos: true }, options); }
function groupedConfig(title, note, groups) { return { type: 'grouped', title, note, groups, photos: true }; }
function chain(items) { return items.map(x => field(x[0], x[1], 'textarea')); }
function reflection(labels) { return labels.map((x, i) => field('answer' + (i + 1), x, 'textarea')); }

function getEBPJournalConfig(day) { return EBP_JOURNAL_CONFIG[day] || null; }

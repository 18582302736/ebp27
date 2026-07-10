// EBP 第一阶段 25 天结构化书写配置（依据原始书写 PDF）
const EBP_JOURNAL_CONFIG = {
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
  ]),
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

function field(key, label, type, placeholder) { return { kind: 'field', key, label, type: type || 'textarea', placeholder: placeholder || '' }; }
function heading(label) { return { kind: 'heading', label }; }
function repeatConfig(title, note, repeatLabel, fields, photos) { return { type: 'repeat', title, note, repeatLabel, fields, photos: !!photos }; }
function fixedConfig(title, note, fields) { return { type: 'fixed', title, note, fields, photos: true }; }
function mixedConfig(title, note, options) { return Object.assign({ type: 'mixed', title, note }, options); }
function chain(items) { return items.map(x => field(x[0], x[1], 'textarea')); }
function reflection(labels) { return labels.map((x, i) => field('answer' + (i + 1), x, 'textarea')); }

function getEBPJournalConfig(day) { return EBP_JOURNAL_CONFIG[day] || null; }

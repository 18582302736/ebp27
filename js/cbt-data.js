// cbt-data.js - CBT综合 21天课程数据（v2.0 — 两段式：学习任务 + 书写任务）

const CBT_COURSE_DATA = [
  // ═══ 模块一：情绪降温 (Day 1-8) ═══
  {
    day: 1, theme: "情绪决策树介绍 + 应对资源列举", module: "情绪降温", speaker: "罗浩贤",
    audio: { src: "assets/cbt/audio/day-01.mp3", title: "认识情绪决策树", duration: "约10分钟", hasAudio: true },
    extendedResources: [
      { title: "可选：我的初心与承诺", src: "assets/cbt/extended/day-01.mp3", type: "audio" }
    ],
    worksheetPrompts: [
      "在遇到压力、情绪困扰的时候，我可以这样应对（例如：学习过的心理学技术、常用的应对方式等）"
    ]
  },
  {
    day: 2, theme: "辩证理解情绪：利弊权衡", module: "情绪降温", speaker: "孙轶群",
    audio: { src: "assets/cbt/audio/day-02.m4a", title: "辩证理解情绪", duration: "约4分钟", hasAudio: true },
    extendedResources: [],
    worksheetPrompts: [
      "回忆一个生活中我体验过的情绪（例如焦虑、生气等）",
      "这个情绪在当时，可能带来的帮助是",
      "这个情绪在当时，可能带来的负面影响是",
      "权衡利弊后，也许我当时（保留/调节）这个情绪更有帮助"
    ]
  },
  {
    day: 3, theme: "情绪温度计：量化情绪强度", module: "情绪降温", speaker: "罗浩贤",
    audio: { src: "assets/cbt/audio/day-03.mp3", title: "制造你的情绪温度计", duration: "约10分钟", hasAudio: true },
    writingGuideAudio: { src: "assets/cbt/audio/day-03-writing-guide.m4a", title: "书写语音引导：情绪温度计", duration: "约8分钟" },
    extendedResources: [],
    worksheetPrompts: [
      "我想评估的情绪是（例如焦虑、悲伤等）",
      "情绪100分的经历",
      "情绪75分的经历",
      "情绪50分的经历",
      "情绪25分的经历",
      "情绪0分的经历",
      "最近发生的、让我体验类似情绪的经历，它的情绪温度是（0-100分）"
    ]
  },
  {
    day: 4, theme: "情绪安抚：关怀触碰", module: "情绪降温", speaker: "罗浩贤",
    audio: { src: "assets/cbt/audio/day-04.mp3", title: "用身体感受给情绪降温", duration: "约10分钟", hasAudio: true },
    extendedResources: [],
    worksheetPrompts: [
      "跟随录音体验“关怀触碰”",
      "我练习后的感受是",
      "未来，我也许能在这些场景下使用它"
    ]
  },
  {
    day: 5, theme: "情绪安抚：五感安抚小行动", module: "情绪降温", speaker: "孙轶群",
    audio: { src: "assets/cbt/audio/day-05.mp3", title: "用感官创造愉悦", duration: "约10分钟", hasAudio: true },
    extendedResources: [],
    worksheetPrompts: [
      "我可以做这些事，去创造愉快的视觉体验",
      "我可以做这些事，去创造愉快的听觉体验",
      "我可以做这些事，去创造愉快的嗅觉体验",
      "我可以做这些事，去创造愉快的触觉体验",
      "我可以做这些事，去创造愉快的味觉体验",
      "从上面的资源库中，挑一件立刻能做的事情，试一试"
    ]
  },
  {
    day: 6, theme: "情绪安抚：渐进式肌肉放松", module: "情绪降温", speaker: "罗浩贤",
    audio: { src: "assets/cbt/audio/day-06.m4a", title: "渐进式肌肉放松", duration: "约4分钟", hasAudio: true },
    extendedResources: [
      { title: "补充：渐进式肌肉放松（正念版）", src: "assets/cbt/extended/day-06.mp3", type: "audio" }
    ],
    worksheetPrompts: [
      "跟随任意一个录音体验“渐进式肌肉放松”",
      "我练习后的感受是",
      "未来，我也许能在这些场景下使用它"
    ]
  },
  {
    day: 7, theme: "情绪安抚：身体运动", module: "情绪降温", speaker: null,
    audio: { src: "assets/cbt/audio/day-07.m4a", title: "身体运动与情绪", duration: "约4分钟", hasAudio: true },
    extendedResources: [],
    worksheetPrompts: [
      "打开“情绪降温运动清单”，挑选一个试试看",
      "我练习后的感受是",
      "未来，我也许能在这些场景下使用它"
    ]
  },
  {
    day: 8, theme: "情绪安抚：冷水降温 + 安抚小结", module: "情绪降温", speaker: "罗浩贤",
    audio: { src: "assets/cbt/audio/day-08.m4a", title: "冷水降温法 + 情绪安抚小结", duration: "约5分钟", hasAudio: true },
    extendedResources: [],
    worksheetPrompts: [
      "回顾最近几日的练习，我所学到的情绪调节方法有",
      "在情绪温度计分数为100-75时，对我最有效的方法是",
      "在情绪温度计分数为75-50时，对我最有效的方法是",
      "在情绪温度计分数为50-25时，对我最有效的方法是"
    ]
  },

  // ═══ 模块二：事实检验 (Day 9-11) ═══
  {
    day: 9, theme: "ABC表：看见想法的影响", module: "事实检验", speaker: "孙轶群",
    audio: { src: "assets/cbt/audio/day-09.mp3", title: "探索想法和情绪的联系", duration: "约10分钟", hasAudio: true },
    extendedResources: [],
    worksheetPrompts: [
      "诱发我情绪的事件是",
      "对于这个事件，我产生了这些想法（如果想法很多，选择记录主要的想法）",
      "我体验到的情绪是",
      "我的身体反应是",
      "我采取的行动是",
      "如果现在被情绪困扰，可以尝试情绪安抚技术"
    ]
  },
  {
    day: 10, theme: "事件重述：区分事件和想法", module: "事实检验", speaker: "罗浩贤",
    audio: { src: "assets/cbt/audio/day-10.mp3", title: "区分事实与评价", duration: "约10分钟", hasAudio: true },
    extendedResources: [],
    worksheetPrompts: [
      "最近诱发我情绪的事件是（尽可能包含全部关键信息）",
      "我体验到的情绪是；它的强烈程度是（0-100）",
      "重新回顾记录的事件，我发现这些想法、评价",
      "重述这个经历，确保只包含客观事件",
      "对于这个新的描述，我的情绪类型是；我的情绪强度是（0-100）"
    ]
  },
  {
    day: 11, theme: "事实检验：情绪是否符合事实", module: "事实检验", speaker: null,
    audio: { src: "assets/cbt/audio/day-11.mp3", title: "检验情绪是否符合事实", duration: "约10分钟", hasAudio: true },
    extendedResources: [],
    worksheetPrompts: [
      "最近诱发我消极情绪的事件是（如果书写新的事件，请剔除主观想法，重述事件）",
      "我体验到的情绪是；它的强烈程度是（0-100）",
      "通常来说，这些情绪会在怎样的情况下出现",
      "回顾我的情绪温度计，这样的情绪强度对应以前的哪些经历",
      "利用前两题的信息判断：我的情绪类型是否受到主观想法影响；情绪强度是否受到主观想法影响",
      "综合以上信息，我情绪困扰的来源可能是（客观事件 / 主观想法）"
    ]
  },

  // ═══ 模块三：认知调整 (Day 12-15) ═══
  {
    day: 12, theme: "灰色刻度尺：评价维度化", module: "认知调整", speaker: null,
    audio: { src: "assets/cbt/audio/day-12.mp3", title: "评价维度化", duration: "约10分钟", hasAudio: true },
    writingGuideAudio: { src: "assets/cbt/audio/day-12-writing-guide.m4a", title: "书写语音引导：灰色刻度尺", duration: "约7分钟" },
    extendedResources: [],
    worksheetPrompts: [
      "我对自己的评价是",
      "这个评价存在的两极是",
      "如果一个人完全符合积极评价，ta是怎样的？我知道的人里面，有谁是这样的",
      "如果一个人完全符合消极评价，ta是怎样的？我知道的人里面，有谁是这样的",
      "一个处于中间的普通人是怎样的？我知道的人里面，有谁是这样的",
      "把自己和上述这些人或描述对比，我应该处于什么位置",
      "经过书写后，我现在会这样描述自己"
    ]
  },
  {
    day: 13, theme: "责任比例图", module: "认知调整", speaker: "罗浩贤",
    audio: { src: "assets/cbt/audio/day-13.m4a", title: "责任比例图", duration: "约4分钟", hasAudio: true },
    writingGuideAudio: { src: "assets/cbt/audio/day-13-writing-guide.m4a", title: "书写语音引导：责任比例图", duration: "约7分钟" },
    extendedResources: [],
    worksheetPrompts: [
      "我遇到的事件是",
      "对于这个事件，我产生的想法是；我对这些想法的信任程度是（0-100分）",
      "我体验到的情绪是",
      "导致这件事情发生的原因可能是（列举尽可能多的原因）",
      "评估一下，这些可能原因各自占的责任比例",
      "再次评估你对旧想法的信任程度（0-100分）",
      "现在，我对这件事情的新想法是"
    ]
  },
  {
    day: 14, theme: "苏格拉底提问", module: "认知调整", speaker: "罗浩贤",
    audio: { src: "assets/cbt/audio/day-14.mp3", title: "苏格拉底提问", duration: "约10分钟", hasAudio: true },
    writingGuideAudio: { src: "assets/cbt/audio/day-14-writing-guide.m4a", title: "书写语音引导：苏格拉底提问", duration: "约9分钟" },
    extendedResources: [],
    worksheetPrompts: [
      "我遇到的事情是",
      "我当时内心的想法是（用0-100分评估相信程度）",
      "想法带来的情绪是（用0-100分评估强烈程度）",
      "支持这个想法的证据是什么",
      "反对这个想法的证据是什么",
      "结合前两个回答判断，我是否夸大了想法的可能性",
      "如果最坏的情况发生了，会怎么样",
      "如果最坏的情况发生了，我能如何应对",
      "如果最好的情况发生了，会怎么样",
      "现实中，最可能会发生的情况是什么",
      "再次评估你对想法的信任程度",
      "经过书写后，我现在对这件事的新想法是"
    ]
  },
  {
    day: 15, theme: "探索内心旧磁带", module: "认知调整", speaker: "孙轶群",
    audio: { src: "assets/cbt/audio/day-15.mp3", title: "探索影响更深的底层想法", duration: "约10分钟", hasAudio: true },
    writingGuideAudio: { src: "assets/cbt/audio/day-15-writing-guide.m4a", title: "书写语音引导：探索内心旧磁带", duration: "约7分钟" },
    extendedResources: [],
    worksheetPrompts: [
      "回顾前几天的书写练习，是否出现了一些相似的想法或相同的主题？请把它们写下来",
      "这些想法背后，是否隐藏了不合理的内心旧磁带？试着把它们提炼成一个陈述句",
      "这个内心旧磁带在我的生活中还有什么样的影响",
      "我可以用这些技术松动对这个内心旧磁带的信任（灰色刻度尺、责任比例图、苏格拉底提问）"
    ]
  },

  // ═══ 模块四：调整与想法的关系 (Day 16-18) ═══
  {
    day: 16, theme: "成为想法的观众", module: "调整与想法", speaker: "孙轶群",
    audio: { src: "assets/cbt/audio/day-16.m4a", title: "成为想法的观众", duration: "约4分钟", hasAudio: true },
    extendedResources: [],
    worksheetPrompts: [
      "回顾昨天的书写练习，我的内心旧磁带是（也可以从之前的ABC表中选择一个经常出现的想法）",
      "用这个句式复述：我注意到我现在有一个想法，它的内容是……",
      "我观察到，自己在这个过程中的体验是"
    ]
  },
  {
    day: 17, theme: "培育积极想法", module: "调整与想法", speaker: "孙轶群",
    audio: { src: "assets/cbt/audio/day-17.mp3", title: "建立新的想法", duration: "约10分钟", hasAudio: true },
    extendedResources: [],
    worksheetPrompts: [
      "查看“积极想法清单”，我的体验和感受是",
      "写下我喜欢的积极想法1",
      "写下我喜欢的积极想法2",
      "写下我喜欢的积极想法3"
    ]
  },
  {
    day: 18, theme: "对想法不反应", module: "调整与想法", speaker: "孙轶群",
    audio: { src: "assets/cbt/audio/day-18.mp3", title: "用价值和行动，培育新想法", duration: "约10分钟", hasAudio: true },
    extendedResources: [],
    worksheetPrompts: [
      "写下一个在生活中经常出现、给我带来情绪困扰的想法",
      "这个想法有可能带来哪些行为",
      "接下来，在这个想法出现的时候，我会尝试“不反应”。我可以这样做",
      "我的体验是（如果暂时还没机会体验，可以跳过）"
    ]
  },

  // ═══ 模块五：问题解决 + 总结 (Day 19-21) ═══
  {
    day: 19, theme: "问题解决：澄清问题", module: "问题解决+总结", speaker: "孙轶群",
    audio: { src: "assets/cbt/audio/day-19.mp3", title: "找出需要解决的问题", duration: "约10分钟", hasAudio: true },
    extendedResources: [],
    worksheetPrompts: [
      "最近让我不愉快的经历是（尽可能包含全部关键信息）",
      "重述这个经历，确保只包含客观事件",
      "我希望这个事件的情况变成（尽可能详细地描述期待的场景）",
      "在这份期待中，哪些部分有机会达成？哪些部分暂时难以实现",
      "如果聚焦于一个可实现的目标，我希望是",
      "综合以上信息，让我困扰的问题以及我希望的结果是"
    ]
  },
  {
    day: 20, theme: "问题解决：从一点点改变开始", module: "问题解决+总结", speaker: "孙轶群",
    audio: { src: "assets/cbt/audio/day-20.mp3", title: "制定解决问题的方案", duration: "约10分钟", hasAudio: true },
    extendedResources: [],
    worksheetPrompts: [
      "最近让我困扰的问题，以及我希望的结果",
      "如果10分代表问题已经被解决，0分是情况最糟糕，我觉得当前情况是几分",
      "如果向前推进1分，可能是因为哪些一点点的改变",
      "我可以从谁或哪里得到帮助",
      "如果朋友遇到了类似困扰，我会如何建议",
      "以前遇到类似困扰时，我曾怎样成功应对",
      "综合以上思考，在当下，我可以为自己做哪些事来推进哪怕一点点的改变",
      "我可以完成的第一步是"
    ]
  },
  {
    day: 21, theme: "总结：持续行动培育想法 + 工具库卡片", module: "问题解决+总结", speaker: "罗浩贤",
    audio: { src: "assets/cbt/audio/day-21.mp3", title: "照料你的情绪花园", duration: "约10分钟", hasAudio: true },
    extendedResources: [
      { title: "工具库：情绪降温", src: "assets/cbt/extended/day-21-1.mp3", type: "audio" },
      { title: "工具库：情绪小锦囊", src: "assets/cbt/extended/day-21-2.mp3", type: "audio" },
      { title: "工具库：渐进式肌肉放松练习", src: "assets/cbt/extended/day-21-3.mp3", type: "audio" }
    ],
    worksheetPrompts: [
      "回顾第一天的练习，我当时列举了这些应对情绪困扰的方法",
      "经过这段时间的练习，我现在拥有这些应对情绪困扰的新选择",
      "试着把这些工具和技术写在卡片上，制作自己的“工具库”"
    ]
  }
];

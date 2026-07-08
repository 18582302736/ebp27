// cbt-data.js - CBT综合 21天课程数据（v2.0 — 两段式：学习任务 + 书写任务）

const CBT_COURSE_DATA = [
  // ═══ 模块一：情绪降温 (Day 1-8) ═══
  {
    day: 1, theme: "情绪决策树介绍 + 应对资源列举", module: "情绪降温", speaker: "罗浩贤",
    audio: { src: "assets/cbt/audio/day-01.mp3", title: "认识情绪决策树", duration: "约10分钟", hasAudio: true },
    guideImage: "assets/cbt/guide/day-01.jpg",
    extendedResources: [
      { title: "可选：我的初心与承诺", src: "assets/cbt/extended/day-01.mp3", type: "audio" }
    ],
    worksheetPrompts: [
      "回忆最近一个因为情绪产生的困扰，把它写下来",
      "把你能想到的、应对情绪困扰的选择写下来",
      "未来21天，我们将培育自己的情绪技能树，拥有更丰富、更灵活的选择"
    ]
  },
  {
    day: 2, theme: "辩证理解情绪：利弊权衡", module: "情绪降温", speaker: "孙轶群",
    audio: { src: "assets/cbt/audio/day-02.m4a", title: "辩证理解情绪", duration: "约4分钟", hasAudio: true },
    guideImage: "assets/cbt/guide/day-02.jpg",
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
    guideImage: "assets/cbt/guide/day-03.jpg",
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
    guideImage: "assets/cbt/guide/day-04.jpg",
    extendedResources: [],
    worksheetPrompts: [
      "进行关怀触碰练习后的身体感受",
      "触碰前后情绪强度的变化（1-9分）",
      "这个练习中你最舒服的触碰方式是什么"
    ]
  },
  {
    day: 5, theme: "情绪安抚：五感安抚小行动", module: "情绪降温", speaker: "孙轶群",
    audio: { src: "assets/cbt/audio/day-05.mp3", title: "用感官创造愉悦", duration: "约10分钟", hasAudio: true },
    guideImage: "assets/cbt/guide/day-05.jpg",
    extendedResources: [],
    worksheetPrompts: [
      "你选择了哪几种感官来安抚自己",
      "每种感官安抚的效果如何（1-9分）",
      "哪两种感官安抚对你最有效？可以把它们加入你的紧急安抚清单"
    ]
  },
  {
    day: 6, theme: "情绪安抚：渐进式肌肉放松", module: "情绪降温", speaker: "罗浩贤",
    audio: { src: "assets/cbt/audio/day-06.m4a", title: "渐进式肌肉放松", duration: "约4分钟", hasAudio: true },
    guideImage: "assets/cbt/guide/day-06-a.jpg",
    extendedResources: [
      { title: "补充：渐进式肌肉放松（正念版）", src: "assets/cbt/extended/day-06.mp3", type: "audio" }
    ],
    worksheetPrompts: [
      "渐进式肌肉放松前的身体紧绷程度（1-9分）",
      "放松后的身体感受",
      "放松前后的情绪变化",
      "哪几个身体部位的放松效果最明显"
    ]
  },
  {
    day: 7, theme: "情绪安抚：身体运动", module: "情绪降温", speaker: null,
    audio: { src: "assets/cbt/audio/day-07.m4a", title: "身体运动与情绪", duration: "约4分钟", hasAudio: true },
    guideImage: "assets/cbt/guide/day-07.jpg",
    extendedResources: [],
    worksheetPrompts: [
      "你尝试了哪种身体运动",
      "运动前后的情绪对比",
      "运动时的身体感受",
      "你愿意继续哪种运动"
    ]
  },
  {
    day: 8, theme: "情绪安抚：冷水降温 + 安抚小结", module: "情绪降温", speaker: "罗浩贤",
    audio: { src: "assets/cbt/audio/day-08.m4a", title: "冷水降温法 + 情绪安抚小结", duration: "约5分钟", hasAudio: true },
    guideImage: "assets/cbt/guide/day-08.jpg",
    extendedResources: [],
    worksheetPrompts: [
      "回顾情绪降温模块，列出对你最有效的3种情绪降温方法",
      "制作你的紧急安抚卡片：第1步做什么、第2步做什么、第3步做什么",
      "在什么情况下你会优先使用哪个安抚方法"
    ]
  },

  // ═══ 模块二：事实检验 (Day 9-11) ═══
  {
    day: 9, theme: "ABC表：看见想法的影响", module: "事实检验", speaker: "孙轶群",
    audio: { src: "assets/cbt/audio/day-09.mp3", title: "探索想法和情绪的联系", duration: "约10分钟", hasAudio: true },
    guideImage: "assets/cbt/guide/day-09.jpg",
    extendedResources: [],
    worksheetPrompts: [
      "A（激活事件）：发生了什么",
      "B（信念/想法）：你当时怎么想",
      "C（后果）：情绪和行为结果是什么"
    ]
  },
  {
    day: 10, theme: "事件重述：区分事件和想法", module: "事实检验", speaker: "罗浩贤",
    audio: { src: "assets/cbt/audio/day-10.mp3", title: "区分事实与评价", duration: "约10分钟", hasAudio: true },
    guideImage: "assets/cbt/guide/day-10.jpg",
    extendedResources: [],
    worksheetPrompts: [
      "客观描述事件（只用事实，不加评价）",
      "你头脑里的想法/评价是什么",
      "区分后你有什么新发现"
    ]
  },
  {
    day: 11, theme: "事实检验：情绪是否符合事实", module: "事实检验", speaker: null,
    audio: { src: "assets/cbt/audio/day-11.mp3", title: "检验情绪是否符合事实", duration: "约10分钟", hasAudio: true },
    guideImage: "assets/cbt/guide/day-11.jpg",
    extendedResources: [],
    worksheetPrompts: [
      "情绪是什么？强度多高（1-9分）",
      "支持这个情绪的事实有哪些",
      "不支持这个情绪的事实有哪些",
      "最终判断：情绪是否符合事实"
    ]
  },

  // ═══ 模块三：认知调整 (Day 12-15) ═══
  {
    day: 12, theme: "灰色刻度尺：评价维度化", module: "认知调整", speaker: null,
    audio: { src: "assets/cbt/audio/day-12.mp3", title: "评价维度化", duration: "约10分钟", hasAudio: true },
    guideImage: "assets/cbt/guide/day-12.jpg",
    extendedResources: [],
    worksheetPrompts: [
      "你对_____的评判是什么",
      "用0-100%的灰色刻度尺重新评价",
      "有哪些中间地带被你忽略了",
      "这种新的评价方式给你什么启发"
    ]
  },
  {
    day: 13, theme: "责任比例图", module: "认知调整", speaker: "罗浩贤",
    audio: { src: "assets/cbt/audio/day-13.m4a", title: "责任比例图", duration: "约4分钟", hasAudio: true },
    guideImage: "assets/cbt/guide/day-13.jpg",
    extendedResources: [],
    worksheetPrompts: [
      "事件中涉及哪些因素/人（包括环境、运气等）",
      "画出责任比例图，分配每个因素的比例",
      "你承担了不该承担的部分吗",
      "重新分配后，你有什么感受"
    ]
  },
  {
    day: 14, theme: "苏格拉底提问", module: "认知调整", speaker: "罗浩贤",
    audio: { src: "assets/cbt/audio/day-14.mp3", title: "苏格拉底提问", duration: "约10分钟", hasAudio: true },
    guideImage: "assets/cbt/guide/day-14.jpg",
    extendedResources: [],
    worksheetPrompts: [
      "你的自动负面想法是什么",
      "有什么证据支持它",
      "有什么证据反对它",
      "有没有其他的解释方式",
      "如果你的朋友有同样的想法，你会对ta说什么"
    ]
  },
  {
    day: 15, theme: "探索内心旧磁带", module: "认知调整", speaker: "孙轶群",
    audio: { src: "assets/cbt/audio/day-15.mp3", title: "探索影响更深的底层想法", duration: "约10分钟", hasAudio: true },
    guideImage: "assets/cbt/guide/day-15.jpg",
    extendedResources: [],
    worksheetPrompts: [
      "从自动想法往下挖：如果这是真的，那意味着什么",
      "你最深的恐惧是什么",
      "这个信念最初是什么时候形成的",
      "回头看这个信念，它现在对你还适用吗"
    ]
  },

  // ═══ 模块四：调整与想法的关系 (Day 16-18) ═══
  {
    day: 16, theme: "成为想法的观众", module: "调整与想法", speaker: "孙轶群",
    audio: { src: "assets/cbt/audio/day-16.m4a", title: "成为想法的观众", duration: "约4分钟", hasAudio: true },
    guideImage: "assets/cbt/guide/day-16.jpg",
    extendedResources: [],
    worksheetPrompts: [
      "选一个反复出现的负面想法",
      "以观众的身份描述它（“我注意到我有一个想法……”）",
      "观察这个想法时，它有什么变化",
      "作为观众，你与这个想法的关系有什么不同"
    ]
  },
  {
    day: 17, theme: "培育积极想法", module: "调整与想法", speaker: "孙轶群",
    audio: { src: "assets/cbt/audio/day-17.mp3", title: "建立新的想法", duration: "约10分钟", hasAudio: true },
    guideImage: "assets/cbt/guide/day-17.jpg",
    extendedResources: [],
    worksheetPrompts: [
      "旧想法是什么",
      "新想法是什么（基于事实）",
      "你做了什么来培育这个新想法",
      "培育新想法的过程中，你遇到了什么困难"
    ]
  },
  {
    day: 18, theme: "灵活行动", module: "调整与想法", speaker: "孙轶群",
    audio: { src: "assets/cbt/audio/day-18.mp3", title: "用价值和行动培育新想法", duration: "约10分钟", hasAudio: true },
    guideImage: "assets/cbt/guide/day-18.jpg",
    extendedResources: [],
    worksheetPrompts: [
      "你的价值方向是什么",
      "今天能做的最小行动是什么",
      "遇到困难时的备用方案",
      "完成这个行动后，你有什么感受"
    ]
  },

  // ═══ 模块五：问题解决 + 总结 (Day 19-21) ═══
  {
    day: 19, theme: "问题解决：澄清问题", module: "问题解决+总结", speaker: "孙轶群",
    audio: { src: "assets/cbt/audio/day-19.mp3", title: "找出需要解决的问题", duration: "约10分钟", hasAudio: true },
    guideImage: "assets/cbt/guide/day-19.jpg",
    extendedResources: [],
    worksheetPrompts: [
      "你面临的具体问题是什么（客观描述）",
      "哪些因素在你能控制的范围内",
      "哪些不在你控制范围内",
      "你真正想要的结果是什么"
    ]
  },
  {
    day: 20, theme: "问题解决：从一点点改变开始", module: "问题解决+总结", speaker: "孙轶群",
    audio: { src: "assets/cbt/audio/day-20.mp3", title: "制定解决问题的方案", duration: "约10分钟", hasAudio: true },
    guideImage: "assets/cbt/guide/day-20.jpg",
    extendedResources: [],
    worksheetPrompts: [
      "你的最小可行动方案是什么",
      "什么时候开始",
      "可能的阻碍和应对方法",
      "完成后你如何奖励自己"
    ]
  },
  {
    day: 21, theme: "总结：持续行动培育想法 + 工具库卡片", module: "问题解决+总结", speaker: "罗浩贤",
    audio: { src: "assets/cbt/audio/day-21.mp3", title: "照料你的情绪花园", duration: "约10分钟", hasAudio: true },
    guideImage: "assets/cbt/guide/day-21.jpg",
    extendedResources: [
      { title: "工具库：情绪降温", src: "assets/cbt/extended/day-21-1.mp3", type: "audio" },
      { title: "工具库：情绪小锦囊", src: "assets/cbt/extended/day-21-2.mp3", type: "audio" },
      { title: "工具库：渐进式肌肉放松练习", src: "assets/cbt/extended/day-21-3.mp3", type: "audio" }
    ],
    worksheetPrompts: [
      "回顾21天：你最核心的3个工具是什么",
      "你最大的改变是什么",
      "你对未来的自己说什么",
      "制作你的情绪工具库卡片"
    ]
  }
];

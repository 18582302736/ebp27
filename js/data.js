// data.js - 课程配置与数据

// 课程元数据
const COURSES = [
  {
    id: 'ebp',
    name: '情绪EBP',
    subtitle: '打好情绪基础',
    description: '觉察→接纳→行动，用25天学会与情绪温柔相处',
    totalDays: 25,
    phases: [
      { name: '觉察 · 投入当下', range: 'Day 1-7', start: 1, end: 7, cssClass: 'phase-1', gridId: 'phase1Grid' },
      { name: '接纳 · 认识情绪', range: 'Day 8-12', start: 8, end: 12, cssClass: 'phase-2', gridId: 'phase2Grid' },
      { name: '行动 · 向价值方向', range: 'Day 13-25', start: 13, end: 25, cssClass: 'phase-3', gridId: 'phase3Grid' }
    ],
    taskKeys: ['task1', 'task2', 'task3'],
    taskLabels: ['音频引导', '书写练习', '正念练习'],
    taskIcons: ['headphones', 'pen', 'meditation'],
    color: '#6db88d',
    icon: 'iconEBP',
    unlockCondition: null
  },
  {
    id: 'cbt',
    name: 'CBT综合',
    subtitle: '灵活理性应对情绪',
    description: '情绪决策树→事实检验→认知调整，21天掌握CBT核心技能',
    totalDays: 21,
    phases: [
      { name: '情绪降温', range: 'Day 1-8', start: 1, end: 8, cssClass: 'phase-1', gridId: 'phase1Grid' },
      { name: '事实检验', range: 'Day 9-11', start: 9, end: 11, cssClass: 'phase-2', gridId: 'phase2Grid' },
      { name: '认知调整', range: 'Day 12-15', start: 12, end: 15, cssClass: 'phase-3', gridId: 'phase3Grid' },
      { name: '调整与想法', range: 'Day 16-18', start: 16, end: 18, cssClass: 'phase-4', gridId: 'phase4Grid' },
      { name: '问题解决+总结', range: 'Day 19-21', start: 19, end: 21, cssClass: 'phase-5', gridId: 'phase5Grid' }
    ],
    taskKeys: ['task1', 'task2'],
    taskLabels: ['学习任务', '书写练习'],
    taskIcons: ['book', 'pen'],
    color: '#8b9dc3',
    icon: 'iconCBT',
    unlockCondition: { courseId: 'ebp', completedDays: 25 }
  },
  {
    id: 'act',
    name: '焦虑应对行动计划',
    subtitle: '逐个击破焦虑症状',
    description: '针对常见焦虑模式设计行为实验，逐步提升应对焦虑的能力',
    totalDays: 21,
    phases: [
      { name: '认识焦虑', range: 'Day 1-3', start: 1, end: 3, cssClass: 'phase-1', gridId: 'phase1Grid' },
      { name: '改变认知', range: 'Day 4-7', start: 4, end: 7, cssClass: 'phase-2', gridId: 'phase2Grid' },
      { name: '改变行为', range: 'Day 8-10', start: 8, end: 10, cssClass: 'phase-3', gridId: 'phase3Grid' },
      { name: '直面焦虑', range: 'Day 11-21', start: 11, end: 21, cssClass: 'phase-4', gridId: 'phase4Grid' }
    ],
    taskKeys: ['task1', 'task2'],
    taskLabels: ['阅读指南', '书写练习'],
    taskIcons: ['book', 'pen'],
    color: '#b8916a',
    icon: 'iconACT',
    unlockCondition: { courseId: 'cbt', completedDays: 21 }
  }
];

function getCourseConfig(courseId) {
  return COURSES.find(c => c.id === courseId) || COURSES[0];
}

// 情绪EBP 25天课程数据
const COURSE_DATA = [
  {
    day: 1,
    theme: "投入当下，积累积极资源",
    sensory: { icon: "👁", label: "视觉" },
    readingAudios: [
      { src: "assets/reading-audio/day-01.mp3", title: "记录视觉幸福小事", duration: "约11分钟" }
    ],
    worksheet: {
      src: "assets/worksheets/day-01.pdf",
      title: "第1天书写练习",
      prompt: "今天，请留意你看到的让你感到幸福的小事。把它们记录下来。",
      curiosityGuide: "试着用好奇心去观察周围，把自己想象成来到地球第一天。不带好坏美丑的评价，只是去感受。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-01.mp3", title: "正念初体验：呼吸", duration: "约12分钟" }
    ]
  },
  {
    day: 2,
    theme: "投入当下，积累积极资源",
    sensory: { icon: "👅", label: "味觉" },
    readingAudios: [
      { src: "assets/reading-audio/day-02.mp3", title: "记录味觉幸福小事", duration: "约7分钟" }
    ],
    worksheet: {
      src: "assets/worksheets/day-02.pdf",
      title: "第2天书写练习",
      prompt: "今天，请留意你品尝到的让你感到幸福的味道。",
      curiosityGuide: "试着用好奇心去品尝，就像第一次尝到这种味道。不带好坏的评价，只是去感受。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-02.mp3", title: "用正念的方式进食", duration: "约12分钟" }
    ]
  },
  {
    day: 3,
    theme: "投入当下，积累积极资源",
    sensory: { icon: "✋", label: "触觉" },
    readingAudios: [
      { src: "assets/reading-audio/day-03.mp3", title: "记录触觉幸福小事", duration: "约7分钟" }
    ],
    worksheet: {
      src: "assets/worksheets/day-03.pdf",
      title: "第3天书写练习",
      prompt: "今天，请留意你触摸到的让你感到幸福的触感。",
      curiosityGuide: "试着用好奇心去触摸，感受每一种材质的温度和纹理。不带好坏的评价，只是去感受。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-03.mp3", title: "让注意力重回当下", duration: "约14分钟" }
    ]
  },
  {
    day: 4,
    theme: "投入当下，积累积极资源",
    sensory: { icon: "👃", label: "嗅觉" },
    readingAudios: [
      { src: "assets/reading-audio/day-04.mp3", title: "记录嗅觉幸福小事", duration: "约6分钟" }
    ],
    worksheet: {
      src: "assets/worksheets/day-04.pdf",
      title: "第4天书写练习",
      prompt: "今天，请留意你闻到的让你感到幸福的气味。",
      curiosityGuide: "试着用好奇心去闻，留意每一种气味带来的记忆和感受。不带好坏的评价，只是去感受。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-04.mp3", title: "感受呼吸", duration: "约16分钟" }
    ]
  },
  {
    day: 5,
    theme: "投入当下，积累积极资源",
    sensory: { icon: "🚶", label: "身体感受" },
    readingAudios: [
      { src: "assets/reading-audio/day-05.mp3", title: "记录行走的体验", duration: "约7分钟" }
    ],
    worksheet: {
      src: "assets/worksheets/day-05.pdf",
      title: "第5天书写练习",
      prompt: "今天，请留意你行走时的身体感受。",
      curiosityGuide: "试着用好奇心去感受身体的每一个动作，脚步的起落、肌肉的收缩。只是去感受，无需评判。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-05.mp3", title: "在行走中休息大脑", duration: "约13分钟" }
    ]
  },
  {
    day: 6,
    theme: "投入当下，积累积极资源",
    sensory: { icon: "😊", label: "开心清单" },
    readingAudios: [
      { src: "assets/reading-audio/day-06.mp3", title: "收集开心清单", duration: "约8分钟" }
    ],
    worksheet: {
      src: "assets/worksheets/day-06.pdf",
      title: "第6天书写练习",
      prompt: "今天，请列出让你感到开心的事情清单。",
      curiosityGuide: "回想今天发生的每一件小事，哪怕只是喝到一杯刚好温度的茶。开心的时刻，值得被记住。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-06.mp3", title: "从想法回到呼吸", duration: "约14分钟" }
    ]
  },
  {
    day: 7,
    theme: "小结：投入当下，积累积极资源",
    sensory: { icon: "⭐", label: "成就清单" },
    readingAudios: [
      { src: "assets/reading-audio/day-07-1.mp3", title: "记录成就清单", duration: "约10分钟" },
      { src: "assets/reading-audio/day-07-2.mp3", title: "小结：投入当下，积累积极资源", duration: "约7分钟" }
    ],
    worksheet: {
      src: "assets/worksheets/day-07.pdf",
      title: "第7天书写练习",
      prompt: "今天，请记录你取得的各种成就，无论大小。",
      curiosityGuide: "成就无关大小，把今天没赖床、按时吃饭、出门散步都算上。你比自己想象的更了不起。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-07.mp3", title: "允许想法自由来去", duration: "约13分钟" }
    ]
  },
  {
    day: 8,
    theme: "认识情绪",
    sensory: null,
    readingAudios: [
      { src: "assets/reading-audio/day-08.mp3", title: "用语言和数字，描述你的情绪", duration: "约12分钟" }
    ],
    worksheet: {
      src: "assets/worksheets/day-08.pdf",
      title: "第8天书写练习",
      prompt: "尝试用语言和数字来描述你今天感受到的情绪。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-08.mp3", title: "用行走在情绪中着陆", duration: "约14分钟" }
    ]
  },
  {
    day: 9,
    theme: "认识情绪",
    sensory: null,
    readingAudios: [
      { src: "assets/reading-audio/day-09.mp3", title: "认识情绪的功能", duration: "约10分钟" }
    ],
    worksheet: {
      src: "assets/worksheets/day-09.pdf",
      title: "第9天书写练习",
      prompt: "思考情绪在生活中的功能，记录你的理解。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-09.mp3", title: "和身体重建连接", duration: "约14分钟" }
    ]
  },
  {
    day: 10,
    theme: "认识情绪",
    sensory: null,
    readingAudios: [
      { src: "assets/reading-audio/day-10.mp3", title: "看清情绪产生的过程", duration: "约11分钟" }
    ],
    worksheet: {
      src: "assets/worksheets/day-10.pdf",
      title: "第10天书写练习",
      prompt: "观察情绪是如何产生的，记录一个具体例子。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-10.mp3", title: "放下头脑的担忧", duration: "约13分钟" }
    ]
  },
  {
    day: 11,
    theme: "认识情绪",
    sensory: null,
    readingAudios: [
      { src: "assets/reading-audio/day-11.mp3", title: "认识情绪如何维持和变化", duration: "约8分钟" }
    ],
    worksheet: {
      src: "assets/worksheets/day-11.pdf",
      title: "第11天书写练习",
      prompt: "观察情绪如何持续和变化，记录下来。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-11.mp3", title: "掌控注意的方向", duration: "约15分钟" }
    ]
  },
  {
    day: 12,
    theme: "小结：接纳，让情绪自然来去",
    sensory: null,
    readingAudios: [
      { src: "assets/reading-audio/day-12-1.mp3", title: "给想法起个名字", duration: "约12分钟" },
      { src: "assets/reading-audio/day-12-2.mp3", title: "小结：接纳，让情绪自然来去", duration: "约11分钟" }
    ],
    worksheet: {
      src: "assets/worksheets/day-12.pdf",
      title: "第12天书写练习",
      prompt: "尝试给你的想法命名，用观察者的视角看待它们。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-12.mp3", title: "了解身体与情绪的关系", duration: "约14分钟" }
    ]
  },
  {
    day: 13,
    theme: "向价值的方向行动",
    sensory: null,
    readingAudios: [
      { src: "assets/reading-audio/day-13.mp3", title: "识别行为模式", duration: "约10分钟" }
    ],
    worksheet: {
      src: "assets/worksheets/day-13.pdf",
      title: "第13天书写练习",
      prompt: "识别你在情绪驱动下的行为模式。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-13.mp3", title: "不评判地和感受共处", duration: "约14分钟" }
    ]
  },
  {
    day: 14,
    theme: "向价值的方向行动",
    sensory: null,
    readingAudios: [
      { src: "assets/reading-audio/day-14.mp3", title: "澄清期待", duration: "约6分钟" }
    ],
    worksheet: {
      src: "assets/worksheets/day-14.pdf",
      title: "第14天书写练习",
      prompt: "澄清你的期待，明确真正重要的东西。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-14.mp3", title: "自我关怀的力量", duration: "约15分钟" }
    ]
  },
  {
    day: 15,
    theme: "向价值的方向行动",
    sensory: null,
    readingAudios: [
      { src: "assets/reading-audio/day-15.mp3", title: "向价值的方向行动", duration: "约8分钟" }
    ],
    worksheet: {
      src: "assets/worksheets/day-15.pdf",
      title: "第15天书写练习",
      prompt: "制定一个向价值方向行动的具体计划。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-15.mp3", title: "允许感受自然起伏", duration: "约14分钟" }
    ]
  },
  {
    day: 16,
    theme: "向价值的方向行动",
    sensory: null,
    readingAudios: [
      { src: "assets/reading-audio/day-16.mp3", title: "制定你的行动计划", duration: "约10分钟" }
    ],
    worksheet: {
      src: "assets/worksheets/day-16.pdf",
      title: "第16天书写练习",
      prompt: "制定具体的行动计划，把所学付诸实践。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-16.mp3", title: "正念地面对情绪", duration: "约15分钟" }
    ]
  },
  {
    day: 17,
    theme: "融入生活",
    sensory: null,
    readingAudios: [
      { src: "assets/reading-audio/day-17.mp3", title: "把应对情绪压力的技能，融入生活", duration: "约12分钟" }
    ],
    worksheet: {
      src: "assets/worksheets/day-17.pdf",
      title: "第17天书写练习",
      prompt: "思考如何将情绪应对技能融入日常生活。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-17.mp3", title: "正念地面对想法", duration: "约16分钟" }
    ]
  },
  {
    day: 18,
    theme: "融入生活",
    sensory: null,
    readingAudios: [
      { src: "assets/reading-audio/day-18.mp3", title: "把向着价值行动的技能，融入生活", duration: "约12分钟" }
    ],
    worksheet: {
      src: "assets/worksheets/day-18.pdf",
      title: "第18天书写练习",
      prompt: "思考如何将价值行动技能融入日常生活。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-18.mp3", title: "感受瑜伽中的内心体验", duration: "约14分钟" }
    ]
  },
  {
    day: 19,
    theme: "培育情绪技能树",
    sensory: null,
    readingAudios: [
      { src: "assets/reading-audio/day-19.mp3", title: "培育情绪技能树", duration: "约12分钟" }
    ],
    worksheet: {
      src: "assets/worksheets/day-19.pdf",
      title: "第19天书写练习",
      prompt: "回顾你培育的情绪技能，画一棵属于你的技能树。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-19-1.mp3", title: "和不适感和平相处", duration: "约15分钟" },
      { src: "assets/mindfulness-audio/day-19-2.mp3", title: "总结：身体扫描练习", duration: "约14分钟" }
    ]
  },
  {
    day: 20,
    theme: "拓展阅读：理解幸福",
    sensory: null,
    readingAudios: [
      { src: "assets/reading-audio/day-20.mp3", title: "从心理学家的视角，理解幸福", duration: "约7分钟" }
    ],
    worksheet: {
      src: "assets/worksheets/day-20.pdf",
      title: "第20天书写练习",
      prompt: "从心理学家的视角，记录你对幸福的新理解。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-20-1.mp3", title: "总结：正念综合练习", duration: "约20分钟" },
      { src: "assets/mindfulness-audio/day-20-2.mp3", title: "日常练习：正念呼吸", duration: "约13分钟" }
    ]
  },
  {
    day: 21,
    theme: "拓展阅读：理解情绪",
    sensory: null,
    readingAudios: [
      { src: "assets/reading-audio/day-21.mp3", title: "从心理学家的视角，理解情绪", duration: "约11分钟" }
    ],
    worksheet: {
      src: "assets/worksheets/day-21.pdf",
      title: "第21天书写练习",
      prompt: "从心理学家的视角，记录你对情绪的新理解。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-21.mp3", title: "日常练习：身体扫描", duration: "约12分钟" }
    ]
  },
  {
    day: 22,
    theme: "拓展阅读：理解觉察与接纳",
    sensory: null,
    readingAudios: [
      { src: "assets/reading-audio/day-22.mp3", title: "从心理学家的视角，理解觉察与接纳", duration: "约9分钟" }
    ],
    worksheet: {
      src: "assets/worksheets/day-22.pdf",
      title: "第22天书写练习",
      prompt: "从心理学家的视角，记录你对觉察与接纳的新理解。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-22.mp3", title: "日常练习：正念行走", duration: "约13分钟" }
    ]
  },
  {
    day: 23,
    theme: "拓展阅读：探索自己",
    sensory: null,
    readingAudios: [],
    worksheet: {
      src: "assets/worksheets/day-23.pdf",
      title: "第23天书写练习",
      prompt: "从心理学家的视角探索自我，记录你对自己的理解。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-23.mp3", title: "日常练习：情绪共处", duration: "约13分钟" }
    ]
  },
  {
    day: 24,
    theme: "我的初心与承诺",
    sensory: null,
    readingAudios: [
      { src: "assets/reading-audio/day-24.mp3", title: "我的初心与承诺", duration: "约13分钟" }
    ],
    worksheet: {
      src: null,
      title: null,
      prompt: "写下你参加这个课程的初心，以及对未来的承诺。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-24.mp3", title: "我的初心与承诺", duration: "约11分钟" }
    ]
  },
  {
    day: 25,
    theme: "情绪小锦囊",
    sensory: null,
    readingAudios: [
      { src: "assets/reading-audio/day-25.mp3", title: "情绪小锦囊", duration: "约11分钟" }
    ],
    worksheet: {
      src: null,
      title: null,
      prompt: "回顾整个25天的旅程，记录你最想带走的一个情绪锦囊。"
    },
    mindfulnessAudios: [
      { src: "assets/mindfulness-audio/day-25.mp3", title: "情绪小锦囊 正念练习", duration: "约9分钟" }
    ]
  }
];

// 每日书写模板引导问题（显示在 textarea 上方）
const WORKSHEET_PROMPTS = {
  1: ['幸福瞬间 1：描述你用眼睛看到的、感到美好的画面', '我的感受 1：这个画面带给你的情绪体验', '幸福瞬间 2：另一个美好画面', '我的感受 2：它带给你的情绪体验'],
  2: ['幸福瞬间 1：描述你尝到的、感到幸福的味道', '我的感受 1：这个味道带给你的情绪体验', '幸福瞬间 2：另一个美好味道', '我的感受 2：它带给你的情绪体验'],
  3: ['幸福瞬间 1：描述你触摸到的、感到幸福的触感', '我的感受 1：这个触感带给你的情绪体验', '幸福瞬间 2：另一个美好触感', '我的感受 2：它带给你的情绪体验'],
  4: ['幸福瞬间 1：描述你闻到的、感到幸福的气味', '我的感受 1：这个气味带给你的情绪体验', '幸福瞬间 2：另一个美好气味', '我的感受 2：它带给你的情绪体验'],
  5: ['我的活动：描述一个身体活动（散步、瑜伽、运动等）', '幸福感受：活动中的积极身体体验'],
  6: ['写下今天让你开心的每一件小事，不一定要写满，也不一定只写这些'],
  7: ['我的成就（至少写3个，大小都算）', '我是如何做到坚持的：', '还有哪些可以帮助我坚持下去的行动：'],
  8: ['情绪名称：', '当时的场景：', '情绪强度（1-9分）', '情绪持续时间：'],
  9: ['积极情绪：名称、场景、强度、可能因为渴望什么', '消极情绪：名称、场景、强度、可能因为不想要什么'],
  10: ['影响心情的事情：', '头脑里的想法：', '情绪感受：', '身体感受：', '我做了这些事：'],
  11: ['情绪名称、时间、事件、强度、持续时间', '给今天的「情绪天气」起个名字：'],
  12: ['情绪关键词：', '遇到的事情：', '头脑里的「想法小人」说了什么：', '给这个想法小人取个名字：'],
  13: ['情绪关键词：', '所处场景：', '采取的行动：', '短期效果：', '长期效果：', '这是值得保持还是需要减少的行为：'],
  14: ['情绪关键词：', '所处场景：', '采取的行动：', '原本的期待：', '是否满足期待：', '下一次可以尝试的新行动：'],
  15: ['我重视的价值：', '它对我意味着什么：', '为实现它，我现在可以做的具体小事：'],
  16: ['近期目标：', '背后的价值：', '未来24小时内可以做的小事：', '未来一周内可以做的事：', '遇到困难时的应对方法：'],
  17: ['想到的事情：', '当时的情绪：', '当时的想法：', '身体感受：', '当时采取的行动：', '现在可以尝试的新行动：', '新行动可能带来的短期结果：', '新行动可能带来的长期结果：'],
  18: ['近期目标：', '背后的价值：', '拆解步骤（第一/二/三步）：', '最容易开始的一步：', '今天什么时候开始做：', '可能遇到的阻碍：', '应对方法：'],
  19: ['参加行动营的初心：', '过程中积累的成就：', '帮助我坚持的方法：'],
  20: ['我眼中的幸福是什么？', '我的幸福来自哪里？', '关于幸福，我还有什么感悟？'],
  21: ['情绪是什么？', '我的情绪最近告诉我哪些事？', '关于情绪，我还有什么感悟？'],
  22: ['觉察意味着什么？', '接纳意味着什么？', '这两个词带给我哪些新的生活态度？'],
  23: ['我眼中的「自己」是什么样的？', '如何成为理想中的自己？', '关于探索自我，我还有什么感悟？'],
  24: ['写下你参加这个课程的初心', '对未来，你给自己什么承诺？'],
  25: ['回顾25天旅程，你最想带走的一个情绪锦囊是什么？', '这个锦囊未来如何帮到你？']
};

function getCourseData(courseId, day) {
  // 兼容旧调用：单参数 getCourseData(day)
  if (arguments.length === 1 && typeof courseId === 'number') {
    day = courseId;
    courseId = 'ebp';
  }

  let data = null;
  if (courseId === 'cbt' && typeof CBT_COURSE_DATA !== 'undefined') {
    data = CBT_COURSE_DATA.find(d => d.day === day) || null;
  } else if (courseId === 'act' && typeof ACT_COURSE_DATA !== 'undefined') {
    data = ACT_COURSE_DATA.find(d => d.day === day) || null;
  } else {
    // 默认：EBP
    data = COURSE_DATA.find(d => d.day === day) || null;
    if (data && data.worksheet) {
      data.worksheet.prompts = WORKSHEET_PROMPTS[day] || null;
    }
  }
  return data;
}

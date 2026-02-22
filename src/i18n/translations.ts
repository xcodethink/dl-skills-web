// Bilingual translation dictionary for all UI strings
// Skill content itself comes from _cn/_en data fields

export type Lang = 'cn' | 'en';

const cn = {
  // Nav
  'nav.skills': '技能',
  'nav.workflows': '工作流',
  'nav.setup': '接入',
  'nav.about': '关于',

  // Types
  'type.discipline': '纪律型',
  'type.tool': '工具型',
  'type.process': '流程型',
  'type.reference': '参考型',

  // Difficulty
  'diff.starter': '入门',
  'diff.intermediate': '中级',
  'diff.advanced': '高级',

  // General UI
  'ui.all': '全部',
  'ui.category': '分类',
  'ui.search': '搜索技能... ⌘K',
  'ui.noMatch': '没有找到匹配的技能',
  'ui.clearSearch': '清除搜索',
  'ui.nSkills': '个技能',
  'ui.nSteps': '步骤',
  'ui.nStep': '步',
  'ui.copied': '已复制',
  'ui.copyConfig': '复制配置',
  'ui.copy': '复制',
  'ui.featured': '推荐',
  'ui.verified': 'Verified',
  'ui.viewDetail': '查看详情',
  'ui.viewGuide': '查看完整配置指南 →',
  'ui.detailLink': '详细说明 →',
  'ui.close': '关闭',
  'ui.nActivated': '个技能激活',
  'ui.back': '返回',
  'ui.backToSources': '返回来源列表',
  'ui.backToWorkflows': '返回工作流列表',
  'ui.noWorkflows': '暂无工作流',
  'ui.fullCoverage': '完整覆盖',
  'ui.partialCoverage': '部分覆盖',
  'ui.viewsTooltip': '浏览次数',
  'ui.copiesTooltip': '复制次数',
  'ui.invocationsTooltip': '调用次数',
  'ui.menu': '导航',

  // Setup page
  'setup.title': '快速接入',
  'setup.quickGuide': '快速接入指南',
  'setup.desc': '30 秒接入 Claude Code Skills',
  'setup.openConfig': '打开配置文件',
  'setup.editFile': '编辑',
  'setup.addMcp': '添加 MCP 配置',
  'setup.addInstructions': '在 mcpServers 中加入以下内容：',
  'setup.restart': '重启 Claude Code',
  'setup.autoActivate': '个技能自动激活，无需安装任何依赖',
  'setup.addOneLine': '在 settings.json 中添加一行配置即可',
  'setup.saveRestart': '保存后重启 Claude Code，所有技能自动可用。',
  'setup.mcpFull': 'MCP 全量接入，',
  'setup.allActivated': '个技能全部激活',
  'setup.addInMcp': '的 mcpServers 中添加：',

  // Workflows
  'wf.title': '工作流',
  'wf.desc': '将多个技能串联为完整流程，按步骤引导你完成复杂任务',
  'wf.list': '工作流列表',
  'wf.entry': '入口条件',
  'wf.exit': '交付物',
  'wf.copyAll': '复制全部',
  'wf.quality': '质量标准',
  'wf.verification': '验证门',
  'wf.multiAgent': '多人协作',
  'wf.soloOrMulti': '可多人',

  // Sources
  'src.title': '来源仓库',
  'src.desc': '所有技能来自以下精选开源仓库，经过解读、翻译和整理',
  'src.superpowers': '开发纪律方法论——铁律体系，反合理化表格，让 AI 严格执行',
  'src.claudekit': '最全面的技能集——覆盖前后端、DevOps、AI、文档处理',
  'src.bear2u': '实战脚手架——项目生成器、设计工具、AI 工程',
  'src.composio': '集成自动化——API 对接、营销工具、商业流程',
  'src.dataviz': '数据可视化专项——Matplotlib、Plotly、Seaborn 等',
  'src.superpowers.short': '开发纪律方法论',
  'src.claudekit.short': '综合技能集',
  'src.bear2u.short': '实战脚手架',
  'src.composio.short': '集成自动化',
  'src.dataviz.short': '数据可视化',

  // Skill detail
  'skill.copyFull': '复制完整技能',
  'skill.copyContent': '复制正文',
  'skill.workflows': '包含此技能的工作流',
  'skill.related': '相关技能',

  // About page
  'about.title': '关于',
  'about.desc': '一个人，一个 AI，一个技能库。CC Skills 背后的故事。',
  'about.memorial': 'In memory of Wayne & Jet',
  'about.heading': '我们的故事',
  'about.p1': '我叫 <strong>Wayne</strong>，今年 46 岁，从事市场营销已经 25 年——在这个项目之前，我连一行代码都写不出来。',
  'about.p2': '2025 年，我的弟弟 <strong>Jet</strong> 突然离世。这件事迫使我直面一个再简单不过的事实：生命是有限的，任何一天都可能是最后一天。我开始认真思考，自己剩下的时间里，究竟还能做些什么真正有意义的事情。',
  'about.p3': '在用 Claude Code 构建产品的过程中，我积累了大量实战经验——哪些 AI 技能真正有效、哪些只是噱头、怎样的工作流能让一个完全不懂代码的人独立交付产品级软件。这些经验散落在各处，我想把它们整理出来，分享给和我一样的人。',
  'about.p4': '2026 年 1 月，我第一次下载了 VS Code，开始借助 AI 编程助手 Claude Code 学习如何构建软件。CC Skills 是我用 Claude Code 构建的第 14 个产品。这个系统中的每一行代码都由 AI 生成，而我的角色是产品方向、内容策展，以及把这些经过验证的技能带给更多需要它们的人。',
  'about.p5': 'CC Skills 不是一个技术团队的专业输出。<br/>它只是一个普通人，借助 AI 工具，把自己踩过的坑和验证过的方法，整理成一个对所有人开放的技能库。',
} as const;

const en: Record<keyof typeof cn, string> = {
  // Nav
  'nav.skills': 'Skills',
  'nav.workflows': 'Workflows',
  'nav.setup': 'Setup',
  'nav.about': 'About',

  // Types
  'type.discipline': 'Discipline',
  'type.tool': 'Tool',
  'type.process': 'Process',
  'type.reference': 'Reference',

  // Difficulty
  'diff.starter': 'Starter',
  'diff.intermediate': 'Intermediate',
  'diff.advanced': 'Advanced',

  // General UI
  'ui.all': 'All',
  'ui.category': 'Category',
  'ui.search': 'Search skills... ⌘K',
  'ui.noMatch': 'No matching skills found',
  'ui.clearSearch': 'Clear search',
  'ui.nSkills': 'skills',
  'ui.nSteps': 'steps',
  'ui.nStep': 'steps',
  'ui.copied': 'Copied',
  'ui.copyConfig': 'Copy Config',
  'ui.copy': 'Copy',
  'ui.featured': 'Featured',
  'ui.verified': 'Verified',
  'ui.viewDetail': 'View Details',
  'ui.viewGuide': 'View full setup guide →',
  'ui.detailLink': 'Details →',
  'ui.close': 'Close',
  'ui.nActivated': 'skills activated',
  'ui.back': 'Back',
  'ui.backToSources': 'Back to sources',
  'ui.backToWorkflows': 'Back to workflows',
  'ui.noWorkflows': 'No workflows yet',
  'ui.fullCoverage': 'Full Coverage',
  'ui.partialCoverage': 'Partial',
  'ui.viewsTooltip': 'Views',
  'ui.copiesTooltip': 'Copies',
  'ui.invocationsTooltip': 'Invocations',
  'ui.menu': 'Menu',

  // Setup page
  'setup.title': 'Quick Setup',
  'setup.quickGuide': 'Quick Setup Guide',
  'setup.desc': 'Set up Claude Code Skills in 30 seconds',
  'setup.openConfig': 'Open config file',
  'setup.editFile': 'Edit',
  'setup.addMcp': 'Add MCP config',
  'setup.addInstructions': 'Add the following to mcpServers:',
  'setup.restart': 'Restart Claude Code',
  'setup.autoActivate': 'skills auto-activated, no dependencies needed',
  'setup.addOneLine': 'Just add one line to settings.json',
  'setup.saveRestart': 'Save and restart Claude Code. All skills are ready to use.',
  'setup.mcpFull': 'Full MCP access, ',
  'setup.allActivated': 'skills activated',
  'setup.addInMcp': 'Add to mcpServers in:',

  // Workflows
  'wf.title': 'Workflows',
  'wf.desc': 'Chain multiple skills into complete workflows that guide you step by step through complex tasks',
  'wf.list': 'Workflows',
  'wf.entry': 'Entry Condition',
  'wf.exit': 'Deliverables',
  'wf.copyAll': 'Copy all',
  'wf.quality': 'Quality Criteria',
  'wf.verification': 'Verification Gate',
  'wf.multiAgent': 'Multi-Agent',
  'wf.soloOrMulti': 'Solo or Multi',

  // Sources
  'src.title': 'Sources',
  'src.desc': 'All skills come from these curated open-source repositories, analyzed, translated and organized',
  'src.superpowers': 'Development discipline methodology — iron law system, anti-rationalization, strict AI execution',
  'src.claudekit': 'Most comprehensive skill set — covering frontend, backend, DevOps, AI, document processing',
  'src.bear2u': 'Practical scaffolding — project generators, design tools, AI engineering',
  'src.composio': 'Integration automation — API connections, marketing tools, business workflows',
  'src.dataviz': 'Data visualization — Matplotlib, Plotly, Seaborn and more',
  'src.superpowers.short': 'Dev Discipline',
  'src.claudekit.short': 'Comprehensive Skills',
  'src.bear2u.short': 'Practical Scaffolding',
  'src.composio.short': 'Integration Automation',
  'src.dataviz.short': 'Data Visualization',

  // Skill detail
  'skill.copyFull': 'Copy Full Skill',
  'skill.copyContent': 'Copy Content',
  'skill.workflows': 'Workflows containing this skill',
  'skill.related': 'Related Skills',

  // About page
  'about.title': 'About',
  'about.desc': 'One person, one AI, one skill library. The story behind CC Skills.',
  'about.memorial': 'In memory of Wayne & Jet',
  'about.heading': 'Our Story',
  'about.p1': "My name is <strong>Wayne</strong>. I'm 46 years old, with 25 years in marketing — before this project, I couldn't write a single line of code.",
  'about.p2': 'In 2025, my brother <strong>Jet</strong> passed away suddenly. It forced me to face a simple truth: life is finite, and any day could be the last. I started seriously thinking about what meaningful things I could still do with my remaining time.',
  'about.p3': "While building products with Claude Code, I accumulated extensive hands-on experience — which AI skills truly work, which are just hype, and what workflows enable someone with zero coding background to independently deliver production-grade software. These insights were scattered everywhere, and I wanted to organize and share them with people like me.",
  'about.p4': 'In January 2026, I downloaded VS Code for the first time and began learning to build software with the AI coding assistant Claude Code. CC Skills is the 14th product I built with Claude Code. Every line of code in this system was generated by AI, while my role has been product direction, content curation, and bringing these battle-tested skills to the people who need them.',
  'about.p5': "CC Skills isn't the professional output of a tech team.<br/>It's just an ordinary person, with the help of AI tools, turning hard-won lessons and proven methods into a skill library open to everyone.",
};

export const translations = { cn, en } as const;

export type TranslationKey = keyof typeof cn;

export function t(lang: Lang, key: TranslationKey): string {
  return translations[lang]?.[key] ?? translations.cn[key] ?? key;
}

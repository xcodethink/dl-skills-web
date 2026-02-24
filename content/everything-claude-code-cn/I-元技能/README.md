# I-元技能

> 来源：[everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

关于如何编写 Skill 本身、优化 AI 编码工具使用效率、管理成本和上下文的元级技能。

## 文件索引

| 文件 | 原始技能名 | 核心理念 |
|------|-----------|---------|
| [01-Skill创建.md](./01-Skill创建.md) | skill-create | 通过分析 Git 历史自动提取编码模式，生成 SKILL.md 文件 |
| [02-性能与Token优化.md](./02-性能与Token优化.md) | common/performance | 根据任务复杂度选择合适模型，管理上下文窗口和扩展思考 |
| [03-成本感知LLM管道.md](./03-成本感知LLM管道.md) | cost-aware-llm-pipeline | 模型路由+预算追踪+重试逻辑+提示缓存的组合管道 |
| [04-正则vsLLM决策框架.md](./04-正则vsLLM决策框架.md) | regex-vs-llm-structured-text | 正则处理 95% 结构化文本，LLM 仅处理边缘案例 |
| [05-内容哈希缓存.md](./05-内容哈希缓存.md) | content-hash-cache-pattern | 用 SHA-256 内容哈希缓存文件处理结果，路径无关且自动失效 |
| [06-Claude-Code长篇指南.md](./06-Claude-Code长篇指南.md) | the-longform-guide | Token经济学、记忆持久化、验证模式、并行化与可复用工作流 |
| [07-Claude-Code短篇指南.md](./07-Claude-Code短篇指南.md) | the-shortform-guide | Claude Code 完整配置速查：技能、钩子、子代理、MCP、插件 |
| [08-通用设计模式.md](./08-通用设计模式.md) | common/patterns | 骨架项目、仓库模式、统一 API 响应格式 |
| [09-文档处理.md](./09-文档处理.md) | nutrient-document-processing | 使用 Nutrient API 进行文档转换、OCR、脱敏、签名等 |

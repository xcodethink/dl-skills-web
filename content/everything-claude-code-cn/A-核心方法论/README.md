# A 类：核心方法论

> 来源：[affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)

定义 Claude Code 如何思考、如何验证、如何学习的底层纪律。

| 文件 | 原始来源 | 核心理念 |
|------|----------|----------|
| [01-测试驱动开发-TDD](01-测试驱动开发-TDD.md) | tdd-guide agent + tdd command + tdd-workflow skill | 红-绿-重构循环，80%+ 覆盖率 |
| [02-验证循环](02-验证循环.md) | verification-loop skill + verify command | 6 阶段验证：构建→类型→Lint→测试→安全→差异 |
| [03-持续学习系统](03-持续学习系统.md) | continuous-learning v1/v2 + learn/instinct/evolve commands | 跨会话知识积累，本能式学习 + 置信度评分 |
| [04-评估驱动开发](04-评估驱动开发.md) | eval-harness skill + eval command | pass@k / pass^k 指标，能力评估 + 回归评估 |
| [05-战略性压缩](05-战略性压缩.md) | strategic-compact skill | 在逻辑边界手动压缩，而非依赖自动压缩 |
| [06-研究优先工作流](06-研究优先工作流.md) | search-first skill | 写代码前先搜索现有方案，避免重复造轮子 |
| [07-迭代检索](07-迭代检索.md) | iterative-retrieval skill | 4 阶段渐进上下文精炼，最多 3 个周期 |

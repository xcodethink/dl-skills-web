# everything-claude-code 中文整理版

> 来源仓库：[affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> 作者：Affaan Mustafa（Anthropic x Cerebral Valley 黑客松冠军）
> 整理日期：2026-02-21

## 项目简介

一个完整的 Claude Code 软件工程工作流系统。通过模块化技能（Skills）、自动化钩子（Hooks）、分层代理（Agents）和结构化规则（Rules），将 Claude Code 从对话式编码工具提升为有纪律、有记忆、有成本意识的自动化开发工作流。

**规模**：13 Agents + 27 Rules + 32 Commands + 45 Skills + 2 指南
**语言**：TypeScript, Python, Go, Java, C++, Swift, SQL
**框架**：React, Django, Spring Boot, Next.js, Playwright

## 分类索引

### [A-核心方法论](A-核心方法论/)（7 个文件）

定义 Claude Code 如何思考、验证、学习的底层纪律。

| 文件 | 核心理念 |
|------|----------|
| [01-测试驱动开发-TDD](A-核心方法论/01-测试驱动开发-TDD.md) | 红-绿-重构循环，80%+ 覆盖率 |
| [02-验证循环](A-核心方法论/02-验证循环.md) | 6 阶段验证：构建→类型→Lint→测试→安全→差异 |
| [03-持续学习系统](A-核心方法论/03-持续学习系统.md) | 跨会话知识积累，本能式学习 + 置信度评分 |
| [04-评估驱动开发](A-核心方法论/04-评估驱动开发.md) | pass@k / pass^k 指标 |
| [05-战略性压缩](A-核心方法论/05-战略性压缩.md) | 在逻辑边界手动压缩 |
| [06-研究优先工作流](A-核心方法论/06-研究优先工作流.md) | 写代码前先搜索现有方案 |
| [07-迭代检索](A-核心方法论/07-迭代检索.md) | 4 阶段渐进上下文精炼 |

### [B-规划与执行](B-规划与执行/)（5 个文件）

从规划到执行的全流程管控，包括多模型协作。

| 文件 | 核心理念 |
|------|----------|
| [01-实施规划](B-规划与执行/01-实施规划.md) | 先规划再编码，等确认才动手 |
| [02-架构设计](B-规划与执行/02-架构设计.md) | ADR 模板、权衡分析 |
| [03-Agent编排](B-规划与执行/03-Agent编排.md) | 声明式 Agent 流水线 |
| [04-多模型协作](B-规划与执行/04-多模型协作.md) | Codex + Gemini + Claude 分工 |
| [05-检查点管理](B-规划与执行/05-检查点管理.md) | 基于 git 的工作流快照 |

### [C-代码质量](C-代码质量/)（4 个文件）

代码评审、重构、编码标准、构建错误修复。

| 文件 | 核心理念 |
|------|----------|
| [01-代码评审](C-代码质量/01-代码评审.md) | 置信度过滤（>80%），按严重级别分类 |
| [02-重构与清理](C-代码质量/02-重构与清理.md) | 工具驱动死代码检测，分级风险评估 |
| [03-编码标准](C-代码质量/03-编码标准.md) | 不可变性为 CRITICAL，KISS/DRY/YAGNI |
| [04-构建错误修复](C-代码质量/04-构建错误修复.md) | 最小差异策略，10 种常见错误模式 |

### [D-测试策略](D-测试策略/)（7 个文件）

多语言测试框架与最佳实践。

| 文件 | 核心理念 |
|------|----------|
| [01-E2E端到端测试](D-测试策略/01-E2E端到端测试.md) | Playwright + Agent Browser，POM 模式 |
| [02-测试覆盖率](D-测试策略/02-测试覆盖率.md) | 覆盖率分析 + 缺失测试自动生成 |
| [03-Python测试](D-测试策略/03-Python测试.md) | pytest + Fixtures + Mock |
| [04-Go测试](D-测试策略/04-Go测试.md) | 表驱动测试 + 竞态检测 + Fuzzing |
| [05-C++测试](D-测试策略/05-C++测试.md) | GoogleTest + Sanitizers + Fuzzing |
| [06-Django-TDD](D-测试策略/06-Django-TDD.md) | pytest-django + factory_boy |
| [07-SpringBoot-TDD](D-测试策略/07-SpringBoot-TDD.md) | JUnit 5 + Mockito + Testcontainers |

### [E-安全保障](E-安全保障/)（6 个文件）

从代码到基础设施的多层安全防护。

| 文件 | 核心理念 |
|------|----------|
| [01-安全评审](E-安全保障/01-安全评审.md) | OWASP Top 10 + 金融/区块链安全 |
| [02-AgentShield配置审计](E-安全保障/02-AgentShield配置审计.md) | 扫描 Claude 配置的安全漏洞 |
| [03-云基础设施安全](E-安全保障/03-云基础设施安全.md) | IAM/密钥/网络/日志/CDN/WAF |
| [04-Django安全](E-安全保障/04-Django安全.md) | CSRF/XSS/SQL 注入/RBAC/CSP |
| [05-SpringBoot安全](E-安全保障/05-SpringBoot安全.md) | JWT/OAuth2/Spring Security |
| [06-多语言安全规则](E-安全保障/06-多语言安全规则.md) | 各语言安全检查 + 工具链 |

### [F-工具链与自动化](F-工具链与自动化/)（9 个文件）

开发基础设施配置与自动化。

| 文件 | 核心理念 |
|------|----------|
| [01-Git工作流](F-工具链与自动化/01-Git工作流.md) | Conventional Commits + Agent 整合 |
| [02-Hook系统](F-工具链与自动化/02-Hook系统.md) | 三层质量网：预防→修复→终检 |
| [03-MCP配置指南](F-工具链与自动化/03-MCP配置指南.md) | 15 个 MCP 服务器模板 |
| [04-PM2进程管理](F-工具链与自动化/04-PM2进程管理.md) | 自动检测服务并生成配置 |
| [05-包管理器配置](F-工具链与自动化/05-包管理器配置.md) | npm/pnpm/yarn/bun 自动检测 |
| [06-会话管理](F-工具链与自动化/06-会话管理.md) | 会话列表/加载/别名/统计 |
| [07-文档与代码地图](F-工具链与自动化/07-文档与代码地图.md) | AST 分析 + 依赖映射 |
| [08-Docker模式](F-工具链与自动化/08-Docker模式.md) | Compose 开发模式、容器安全 |
| [09-部署模式](F-工具链与自动化/09-部署模式.md) | 滚动/蓝绿/金丝雀 + CI/CD |

### [G-语言与框架](G-语言与框架/)（11 个文件）

7 种语言和 5 个框架的编码模式与最佳实践。

| 文件 | 核心理念 |
|------|----------|
| [01-TypeScript模式](G-语言与框架/01-TypeScript模式.md) | Zod 校验、不可变 spread、Prettier |
| [02-Python模式](G-语言与框架/02-Python模式.md) | Protocol、Dataclass、PEP 8 |
| [03-Go模式](G-语言与框架/03-Go模式.md) | Functional Options、小接口、goroutine 安全 |
| [04-Java编码标准](G-语言与框架/04-Java编码标准.md) | Java 17+ Records、Optional、Streams |
| [05-C++编码标准](G-语言与框架/05-C++编码标准.md) | RAII、Concepts、Core Guidelines |
| [06-Swift模式](G-语言与框架/06-Swift模式.md) | Actor 线程安全、Protocol DI |
| [07-React前端模式](G-语言与框架/07-React前端模式.md) | 组合、复合组件、a11y |
| [08-Django模式](G-语言与框架/08-Django模式.md) | DRF ViewSets、服务层、信号 |
| [09-SpringBoot模式](G-语言与框架/09-SpringBoot模式.md) | 分层架构、JPA/Hibernate |
| [10-API与后端设计](G-语言与框架/10-API与后端设计.md) | REST 规范、仓储模式、缓存 |
| [11-上下文模式](G-语言与框架/11-上下文模式.md) | 开发/研究/评审模式切换 |

### [H-数据库专项](H-数据库专项/)（4 个文件）

数据库选型、优化与迁移。

| 文件 | 核心理念 |
|------|----------|
| [01-PostgreSQL模式](H-数据库专项/01-PostgreSQL模式.md) | 索引策略、RLS 优化、SKIP LOCKED |
| [02-ClickHouse分析](H-数据库专项/02-ClickHouse分析.md) | MergeTree、物化视图、ETL/CDC |
| [03-JPA-Hibernate模式](H-数据库专项/03-JPA-Hibernate模式.md) | N+1 防护、事务、连接池 |
| [04-数据库迁移](H-数据库专项/04-数据库迁移.md) | expand-contract 零停机迁移 |

### [I-元技能](I-元技能/)（9 个文件）

如何创建技能、优化成本、管理 Claude Code 本身。

| 文件 | 核心理念 |
|------|----------|
| [01-Skill创建](I-元技能/01-Skill创建.md) | 从 git 历史提取编码模式 |
| [02-性能与Token优化](I-元技能/02-性能与Token优化.md) | 模型选择策略、上下文窗口管理 |
| [03-成本感知LLM管道](I-元技能/03-成本感知LLM管道.md) | 按复杂度路由 Haiku/Sonnet/Opus |
| [04-正则vsLLM决策框架](I-元技能/04-正则vsLLM决策框架.md) | 95-98% 场景用正则 |
| [05-内容哈希缓存](I-元技能/05-内容哈希缓存.md) | SHA-256 路径无关缓存 |
| [06-Claude-Code长篇指南](I-元技能/06-Claude-Code长篇指南.md) | Token 经济学、记忆持久化 |
| [07-Claude-Code短篇指南](I-元技能/07-Claude-Code短篇指南.md) | Hook/Skill/MCP 入门 |
| [08-通用设计模式](I-元技能/08-通用设计模式.md) | 骨架项目策略、Repository 模式 |
| [09-文档处理](I-元技能/09-文档处理.md) | PDF/DOCX/OCR/PII 脱敏 |

## 详细分析

完整的分类分析和去重对比请见 [分析报告](分析报告.md)。

> 来源：DL Skills 精选 | 分类：评审与验证

---
name: ai-coding-anti-patterns
description: Common mistakes AI coding assistants make and systematic prevention strategies
---

# AI 编码防错清单（AI Coding Anti-Patterns Checklist）

## 概述

AI 编码助手能大幅提升开发效率，但也会引入特定类型的错误。本清单总结了 8 种最常见的 AI 编码反模式，每种均附带具体示例和预防措施。在使用 AI 辅助编码时，将此清单作为验收标准。

## 反模式清单

### 1. 幻觉依赖（Hallucinated Dependencies）

AI 建议使用不存在或已废弃的包。

**错误示例：**
```bash
npm install react-fast-table  # 该包不存在
```

**预防措施：**
- 安装前执行 `npm info <包名>` 或 `pip show <包名>` 验证包是否存在
- 检查包的最近更新时间和下载量
- 优先使用你已知的、经过验证的包

### 2. 上下文漂移（Context Drift）

AI 忘记之前的决策，在后续代码中引入不一致。

**错误示例：**
```javascript
// 前面约定用 camelCase，后面突然用 snake_case
const userName = 'Alice';       // 之前的风格
const user_email = 'a@b.com';  // AI 忘记了约定
```

**预防措施：**
- 使用 CLAUDE.md 或类似配置文件明确编码规范
- 长会话中定期复述关键决策
- 发现不一致时立即纠正，不要累积

### 3. 过度工程（Over-Engineering）

AI 生成无人要求的抽象层、设计模式或泛化方案。

**错误示例：**
```python
# 只需要一个简单函数，AI 却生成了工厂模式 + 策略模式 + 抽象基类
class AbstractProcessorFactory:
    ...
```

**预防措施：**
- 在提示中明确要求 "最简实现"
- 执行 YAGNI 原则（You Aren't Gonna Need It）
- 审查时问自己：删掉这段抽象，代码还能工作吗？

### 4. 复制粘贴安全隐患（Copy-Paste Security）

AI 复制的代码模式中包含硬编码密钥或不安全的默认配置。

**错误示例：**
```python
API_KEY = "sk-1234567890abcdef"  # 硬编码在源码中
DEBUG = True                      # 不安全的默认值
```

**预防措施：**
- 绝不接受代码中出现真实凭据或密钥
- 使用环境变量或密钥管理服务
- 提交前用 `git diff` 检查是否有敏感信息泄漏

### 5. 过时模式（Outdated Patterns）

AI 建议已废弃的 API 或旧版语法。

**错误示例：**
```javascript
// React 已废弃的生命周期方法
componentWillMount() { ... }
```

**预防措施：**
- 在提示中指定框架和语言版本
- 对照官方文档验证 API 是否仍受支持
- 关注编辑器或编译器的废弃警告

### 6. 静默吞错（Silent Error Swallowing）

AI 用空的 try/catch 包裹一切，错误被静默忽略。

**错误示例：**
```javascript
try {
  await fetchData();
} catch (e) {
  // AI 留空，错误被吞掉
}
```

**预防措施：**
- 要求 AI 为每个 catch 块提供明确的错误处理策略
- 至少记录日志：`console.error(e)` 或上报错误追踪服务
- 区分可恢复错误和不可恢复错误

### 7. 测试戏剧（Test Theatre）

AI 写的测试永远通过，实际上在测试实现细节而非行为。

**错误示例：**
```javascript
// 测试了 mock 本身，而不是真实行为
jest.mock('./api');
test('fetches data', () => {
  expect(api.fetch).toBeDefined();  // 永远为真
});
```

**预防措施：**
- 写完测试后，故意破坏被测代码，确认测试会失败
- 测试行为而非实现：关注输入输出，不关注内部调用
- 检查断言是否有意义（不是 `toBeDefined` 这种弱断言）

### 8. 不完整迁移（Incomplete Migration）

AI 只迁移了部分代码，新旧模式混杂在项目中。

**错误示例：**
```javascript
// 部分文件用了新的 fetch API，部分还在用 axios
// 部分组件迁移到了 TypeScript，部分仍是 JavaScript
```

**预防措施：**
- 迁移完成后，全局搜索旧模式确认零残留
- 一次只迁移一种模式，完成后再迁下一种
- 在 CI 中添加 lint 规则禁止旧模式

## 提交前快速检查清单

1. 所有新依赖是否经过 `npm info` / `pip show` 验证？
2. 代码风格是否与项目已有风格一致？
3. 是否有硬编码的密钥或不安全的默认值？
4. 使用的 API 是否为当前版本所支持？
5. 每个 catch 块是否有明确的错误处理？
6. 测试在被测代码破坏后是否会失败？
7. 迁移是否完整，无新旧模式混杂？
8. 是否有不必要的抽象层可以删除？

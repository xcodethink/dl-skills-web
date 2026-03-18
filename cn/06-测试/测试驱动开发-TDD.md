> 来源：[obra/superpowers](https://github.com/obra/superpowers) | 分类：开发方法论

---
name: test-driven-development
description: Use when implementing any feature or bugfix, before writing implementation code
---

# TDD（测试驱动开发）

## 概述

先写测试，看它失败，再写最少的代码让测试通过。

**核心原则：** 如果你没有亲眼看到测试失败，你就不知道它是否在测试正确的东西。

**违反规则的字面意思就是违反规则的精神。**

## 何时使用

**始终使用：**
- 新功能
- Bug（缺陷）修复
- Refactoring（重构）
- 行为变更

**例外情况（请先征得你的搭档同意）：**
- 一次性原型
- 生成的代码
- 配置文件

想着"就这一次跳过 TDD"？停下来。那是在给自己找借口。

## 铁律

```
没有先写出失败的测试，就不能写生产代码
```

先写了代码再补测试？删掉它。从头来过。

**没有例外：**
- 不要把它留作"参考"
- 不要在写测试时"改编"它
- 不要看它
- 删除就是删除

从测试出发，重新实现。就这样。

## Red-Green-Refactor（红-绿-重构）

### RED（红灯）- 编写失败的测试

编写一个最小化的测试，展示期望的行为。

<Good>
```typescript
test('retries failed operations 3 times', async () => {
  let attempts = 0;
  const operation = () => {
    attempts++;
    if (attempts < 3) throw new Error('fail');
    return 'success';
  };

  const result = await retryOperation(operation);

  expect(result).toBe('success');
  expect(attempts).toBe(3);
});
```
命名清晰，测试真实行为，只测一件事
</Good>

<Bad>
```typescript
test('retry works', async () => {
  const mock = jest.fn()
    .mockRejectedValueOnce(new Error())
    .mockRejectedValueOnce(new Error())
    .mockResolvedValueOnce('success');
  await retryOperation(mock);
  expect(mock).toHaveBeenCalledTimes(3);
});
```
命名模糊，测试的是 mock（模拟对象）而非真实代码
</Bad>

**要求：**
- 只测一个行为
- 命名清晰
- 使用真实代码（除非不得已才用 mock）

### 验证 RED - 观察测试失败

**必须执行。绝不跳过。**

```bash
npm test path/to/test.test.ts
```

确认：
- 测试失败（不是报错）
- 失败信息符合预期
- 失败原因是功能缺失（不是拼写错误）

**测试通过了？** 说明你在测试已有的行为。修改测试。

**测试报错了？** 修复错误，重新运行，直到它正确地失败。

### GREEN（绿灯）- 最少的代码

编写最简单的代码让测试通过。

<Good>
```typescript
async function retryOperation<T>(fn: () => Promise<T>): Promise<T> {
  for (let i = 0; i < 3; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === 2) throw e;
    }
  }
  throw new Error('unreachable');
}
```
刚好让测试通过
</Good>

<Bad>
```typescript
async function retryOperation<T>(
  fn: () => Promise<T>,
  options?: {
    maxRetries?: number;
    backoff?: 'linear' | 'exponential';
    onRetry?: (attempt: number) => void;
  }
): Promise<T> {
  // YAGNI（你不会需要它的）
}
```
过度设计
</Bad>

不要添加功能，不要重构其他代码，不要做超出测试要求的"改进"。

### 验证 GREEN - 观察测试通过

**必须执行。**

```bash
npm test path/to/test.test.ts
```

确认：
- 测试通过
- 其他测试仍然通过
- 输出干净（无错误、无警告）

**测试失败了？** 修改代码，而不是修改测试。

**其他测试失败了？** 立即修复。

### REFACTOR（重构）- 整理代码

只在绿灯之后进行：
- 消除重复
- 改善命名
- 提取辅助函数

保持测试全绿。不要添加新行为。

### 重复

为下一个功能编写下一个失败的测试。

## 好的测试

| 质量标准 | 好的做法 | 坏的做法 |
|----------|---------|---------|
| **最小化** | 只测一件事。名称中有"和"？拆分它。 | `test('validates email and domain and whitespace')` |
| **清晰** | 名称描述行为 | `test('test1')` |
| **表达意图** | 展示期望的 API 用法 | 隐藏代码应该做什么 |

## 为什么顺序很重要

**"我先写代码，再补测试来验证它能不能工作"**

先写代码再补的测试会立刻通过。立刻通过什么也证明不了：
- 可能测错了东西
- 可能测的是实现细节，而不是行为
- 可能遗漏了你忘记的边界情况
- 你从未看到测试捕获到 bug

先写测试迫使你看到测试失败，证明它确实在测试某些东西。

**"我已经手动测过所有边界情况了"**

手动测试是随意的。你以为测了所有情况，但实际上：
- 没有测试记录
- 代码改了之后无法重新运行
- 压力大的时候容易遗漏
- "我试过没问题" ≠ 全面测试

自动化测试是系统化的。每次运行方式完全相同。

**"删掉 X 小时的工作太浪费了"**

沉没成本谬误。时间已经花了。你现在的选择是：
- 删掉并用 TDD 重写（再花 X 小时，高置信度）
- 保留并补测试（30 分钟，低置信度，可能有 bug）

真正的"浪费"是保留你无法信任的代码。没有真正测试的"能用的代码"就是技术债务。

**"TDD 太教条了，务实应该灵活变通"**

TDD 本身就是务实的：
- 在提交前发现 bug（比提交后调试更快）
- 防止回归（测试能立即捕获破坏性变更）
- 记录行为（测试展示如何使用代码）
- 支持重构（放心修改，测试会捕获问题）

所谓"务实"的捷径 = 在生产环境调试 = 更慢。

**"后补测试也能达到同样的目的——重要的是精神而非仪式"**

不对。后补的测试回答的是"这段代码做了什么？"先写的测试回答的是"这段代码应该做什么？"

后补的测试受你的实现的影响。你测的是你写出来的东西，而不是需求要求的东西。你验证的是你记得的边界情况，而不是你发现的边界情况。

先写测试迫使你在实现之前发现边界情况。后补测试只是验证你记住了所有东西（你没有）。

30 分钟的后补测试 ≠ TDD。你得到了覆盖率，却失去了测试有效的证明。

## 常见的借口

| 借口 | 现实 |
|------|------|
| "太简单了不用测" | 简单的代码也会出 bug。写个测试只要 30 秒。 |
| "我之后再补测试" | 立刻通过的测试什么也证明不了。 |
| "后补测试也能达到同样目的" | 后补测试 ="这代码做了什么？" 先写测试 ="这代码应该做什么？" |
| "已经手动测过了" | 随意 ≠ 系统化。没有记录，无法重新运行。 |
| "删掉 X 小时的工作太浪费了" | 沉没成本谬误。保留未验证的代码才是技术债务。 |
| "留作参考，但先写测试" | 你会改编它。那就是后补测试。删除就是删除。 |
| "需要先探索一下" | 可以。探索完了扔掉，然后用 TDD 开始。 |
| "测试难写 = 设计不清晰" | 听测试的话。难以测试 = 难以使用。 |
| "TDD 会拖慢我" | TDD 比调试快。务实 = 先写测试。 |
| "手动测试更快" | 手动测试无法证明边界情况。每次改动你都得重新测。 |
| "现有代码没有测试" | 你正在改善它。给现有代码补测试。 |

## 危险信号 - 停下来，从头开始

- 先写了代码再写测试
- 实现之后才补测试
- 测试一写就通过了
- 无法解释测试为什么失败
- 测试"之后再补"
- 给"就这一次"找借口
- "我已经手动测过了"
- "后补测试也能达到同样目的"
- "重要的是精神而非仪式"
- "留作参考"或"改编现有代码"
- "已经花了 X 小时了，删掉太浪费"
- "TDD 太教条了，我在务实"
- "这次情况不一样，因为……"

**以上所有情况都意味着：删掉代码。用 TDD 从头开始。**

## 示例：修复 Bug

**Bug：** 空邮箱被接受了

**RED（红灯）**
```typescript
test('rejects empty email', async () => {
  const result = await submitForm({ email: '' });
  expect(result.error).toBe('Email required');
});
```

**验证 RED**
```bash
$ npm test
FAIL: expected 'Email required', got undefined
```

**GREEN（绿灯）**
```typescript
function submitForm(data: FormData) {
  if (!data.email?.trim()) {
    return { error: 'Email required' };
  }
  // ...
}
```

**验证 GREEN**
```bash
$ npm test
PASS
```

**REFACTOR（重构）**
如果需要，提取验证逻辑以支持多个字段。

## 验证清单

在标记工作完成之前：

- [ ] 每个新函数/方法都有测试
- [ ] 在实现之前观察了每个测试失败
- [ ] 每个测试因预期原因失败（功能缺失，而非拼写错误）
- [ ] 为每个测试编写了最少的代码使其通过
- [ ] 所有测试通过
- [ ] 输出干净（无错误、无警告）
- [ ] 测试使用真实代码（只在不得已时使用 mock）
- [ ] 边界情况和错误情况已覆盖

无法全部打勾？你跳过了 TDD。从头开始。

## 遇到困难时

| 问题 | 解决方案 |
|------|---------|
| 不知道怎么测试 | 写出你期望的 API 用法。先写断言。问你的搭档。 |
| 测试太复杂 | 说明设计太复杂。简化接口。 |
| 必须 mock 所有东西 | 代码耦合度太高。使用 DI（依赖注入）。 |
| 测试准备工作太多 | 提取辅助函数。还是复杂？简化设计。 |

## 最终规则

```
生产代码 → 必须有一个先失败的测试
否则 → 不是 TDD
```

未经搭档许可，没有例外。

---

## 附录：测试反模式参考

**在以下情况加载此参考：** 编写或修改测试、添加 mock、或想在生产代码中添加仅测试用方法时。

### 概述

测试必须验证真实行为，而非 mock 行为。Mock 是隔离的手段，不是被测试的对象。

**核心原则：** 测试代码做了什么，而不是 mock 做了什么。

**严格遵循 TDD 可以防止这些反模式。**

### 铁律

```
1. 绝不测试 mock 的行为
2. 绝不在生产类中添加仅测试用的方法
3. 绝不在不理解依赖关系的情况下使用 mock
```

### 反模式 1：测试 Mock 的行为

**违规示例：**
```typescript
// ❌ 错误：测试的是 mock 是否存在
test('renders sidebar', () => {
  render(<Page />);
  expect(screen.getByTestId('sidebar-mock')).toBeInTheDocument();
});
```

**为什么这是错的：**
- 你在验证 mock 能工作，而不是组件能工作
- mock 存在就通过，不存在就失败
- 对真实行为毫无价值

**正确做法：**
```typescript
// ✅ 正确：测试真实组件或不使用 mock
test('renders sidebar', () => {
  render(<Page />);  // 不要 mock sidebar
  expect(screen.getByRole('navigation')).toBeInTheDocument();
});
```

### 反模式 2：在生产代码中添加仅测试用的方法

**违规示例：**
```typescript
// ❌ 错误：destroy() 只在测试中使用
class Session {
  async destroy() {
    await this._workspaceManager?.destroyWorkspace(this.id);
  }
}

// 在测试中
afterEach(() => session.destroy());
```

**正确做法：**
```typescript
// ✅ 正确：测试工具函数处理测试清理
export async function cleanupSession(session: Session) {
  const workspace = session.getWorkspaceInfo();
  if (workspace) {
    await workspaceManager.destroyWorkspace(workspace.id);
  }
}

// 在测试中
afterEach(() => cleanupSession(session));
```

### 反模式 3：不理解依赖就使用 Mock

**正确做法：** 在正确的层级进行 mock——mock 慢的部分，保留测试需要的行为。

### 反模式 4：不完整的 Mock

**铁律：** 按照真实存在的完整数据结构进行 mock，而不是只 mock 当前测试用到的字段。

### 反模式 5：把集成测试当作事后补充

测试是实现的一部分，不是可选的后续工作。

### 速查表

| 反模式 | 修复方法 |
|--------|---------|
| 对 mock 元素做断言 | 测试真实组件或取消 mock |
| 生产代码中的仅测试用方法 | 移到测试工具函数中 |
| 不理解依赖就使用 mock | 先理解依赖关系，最小化 mock |
| 不完整的 mock | 完整镜像真实 API |
| 测试作为事后补充 | TDD——先写测试 |
| 过于复杂的 mock | 考虑使用集成测试 |

### 危险信号

- 断言检查 `*-mock` 测试 ID
- 方法只在测试文件中被调用
- Mock 设置占测试的 50% 以上
- 移除 mock 后测试就失败
- 无法解释为什么需要 mock
- "为了保险起见"才加的 mock

**Mock 是隔离的工具，不是被测试的对象。**

> 来源：[bear2u/my-skills](https://github.com/bear2u/my-skills) | 分类：F-工具与效率

# Codex-Claude 工程循环（Codex-Claude Engineering Loop）

## 核心工作流理念

本技能实现一个均衡的工程循环：
- **Claude Code**：架构、规划和执行
- **Codex**：验证和代码审查
- **持续审查**：每个 AI 审查另一个的工作
- **上下文交接**：始终由最后清理代码的一方继续

## 第一阶段：Claude Code 规划

1. 为任务创建详细计划
2. 将实现拆分为清晰的步骤
3. 记录假设和潜在问题
4. 以结构化格式输出计划

## 第二阶段：Codex 验证计划

1. 询问用户（通过 `AskUserQuestion`）：
   - 模型：`gpt-5` 或 `gpt-5-codex`
   - 推理努力程度：`low`、`medium` 或 `high`
2. 将计划发送给 Codex 进行验证：
```bash
   echo "审查此实现计划并找出问题：
   [Claude 的计划]

   检查以下方面：
   - 逻辑错误
   - 缺失的边界情况
   - 架构缺陷
   - 安全问题" | codex exec -m <模型> --config model_reasoning_effort="<程度>" --sandbox read-only
```
3. 捕获 Codex 的反馈

## 第三阶段：反馈循环

如果 Codex 发现问题：
1. 向用户总结 Codex 的关注点
2. 根据反馈优化计划
3. 询问用户："需要修改计划并重新验证，还是继续修复？"
4. 如需要则重复第二阶段

## 第四阶段：执行

计划验证通过后：
1. Claude 使用可用工具（Edit、Write、Read 等）实现代码
2. 将实现拆分为可管理的步骤
3. 仔细执行每步，做好错误处理
4. 记录实现内容

## 第五阶段：变更后的交叉审查

每次变更后：
1. 将 Claude 的实现发送给 Codex 审查：
   - Bug 检测
   - 性能问题
   - 最佳实践验证
   - 安全漏洞
2. Claude 分析 Codex 的反馈并决定：
   - 如果是关键问题则立即修复
   - 如需架构变更则与用户讨论
   - 记录所做的决策

## 第六阶段：迭代改进

1. Codex 审查后，Claude 实施必要修复
2. 对重大变更，重新发送给 Codex 验证
3. 持续循环直到代码质量达标
4. 使用 `codex exec resume --last` 继续验证会话：
```bash
   echo "审查更新后的实现" | codex exec resume --last
```
   **注意**：resume 会继承原始会话的所有设置（模型、推理程度、沙箱）

## 发现问题时的恢复流程

当 Codex 识别出问题：
1. Claude 分析根本原因
2. 使用可用工具实施修复
3. 将更新的代码发回 Codex 验证
4. 重复直到验证通过

当实现出错时：
1. Claude 审查错误/问题
2. 调整实现策略
3. 继续前先用 Codex 重新验证

## 最佳实践

- **始终验证计划**后再执行
- **绝不跳过交叉审查**
- **保持清晰的交接**
- **记录谁做了什么**
- **使用 resume** 保持会话状态

## 命令参考

| 阶段 | 命令模式 | 用途 |
|------|----------|------|
| 验证计划 | `echo "plan" \| codex exec --sandbox read-only` | 编码前检查逻辑 |
| 实现代码 | Claude 使用 Edit/Write/Read 工具 | Claude 实现已验证的计划 |
| 审查代码 | `echo "review changes" \| codex exec --sandbox read-only` | Codex 验证 Claude 的实现 |
| 继续审查 | `echo "next step" \| codex exec resume --last` | 继续验证会话 |
| 实施修复 | Claude 使用 Edit/Write 工具 | Claude 修复 Codex 发现的问题 |
| 重新验证 | `echo "verify fixes" \| codex exec resume --last` | Codex 修复后重新检查 |

## 错误处理

1. Codex 返回非零退出码时停止
2. 总结 Codex 反馈并通过 `AskUserQuestion` 请示方向
3. 在以下情况下实施前先确认：
   - 需要重大架构变更
   - 多个文件将受影响
   - 需要破坏性变更
4. 出现 Codex 警告时，Claude 评估严重性并决定后续步骤

## 完美循环

```
规划（Claude）-> 验证计划（Codex）-> 反馈 ->
实现（Claude）-> 审查代码（Codex）->
修复问题（Claude）-> 重新验证（Codex）-> 重复直至完美
```

这创建了一个自我修正的高质量工程系统：
- **Claude** 负责所有代码实现和修改
- **Codex** 提供验证、审查和质量保证

---

## 附录：三 AI 循环（Codex-Claude-Cursor 三方工程循环）

在双 AI 循环的基础上，可以扩展为三方协作的验证循环：
- **Claude Code**：架构和规划、最终审查
- **Codex**：计划验证（逻辑/安全）、代码审查（Bug/性能）
- **Cursor Agent**：代码实现和执行
- **顺序验证**：Claude 规划 -> Codex 验证 -> Cursor 实现 -> Codex 审查 -> Claude 最终检查 -> 循环

### 三方循环工作流

```
1. 规划（Claude）
   |
2. 验证计划（Codex）-> 有问题 -> 优化计划 -> 重复
   |
3. 实现（Cursor）
   |
4. 代码审查（Codex）-> 捕获 Bug/性能问题
   |
5. 最终审查（Claude）-> 架构检查
   |
6. 发现问题？-> 修复计划（Claude）-> 实现修复（Cursor）-> 返回步骤 4
   |
7. 全部通过？-> 完成！
```

### Cursor Agent 命令

**新会话：**
```bash
cursor-agent --model "<模型名>" -p --force "实现此计划：
[已验证的计划]"
```

**恢复会话：**
```bash
cursor-agent --resume="<会话ID>" -p --force "继续实现：
[已验证的计划]"
```

### 三方循环最佳实践

- **始终用 Codex 验证计划**后再实现
- **绝不跳过 Codex 代码审查**
- **绝不跳过 Claude 最终审查**
- **保持清晰的三方交接**
- **使用相同模型**保持一致性（同一 Codex 模型，同一 Cursor 模型）
- **会话管理**：
  - 迭代修复时始终使用 `--resume` 和相同会话 ID
  - 起始时记录会话 ID 并全程复用
  - 用 `cursor-agent ls` 查找之前的会话
  - 仅在开始全新功能时启动新会话

### 三方命令参考

| 阶段 | 执行者 | 命令模式 | 用途 |
|------|--------|----------|------|
| 规划 | Claude | TodoWrite、Read、分析工具 | 创建详细计划 |
| 验证计划 | Codex | `echo "plan" \| codex exec -m <模型> --sandbox read-only` | 验证逻辑/安全 |
| 优化 | Claude | 分析 Codex 反馈，更新计划 | 修复计划问题 |
| 会话设置 | Claude + 用户 | 询问新建/恢复，`cursor-agent ls` | 设置或恢复 Cursor 会话 |
| 实现 | Cursor | `cursor-agent --model "<模型>" -p --force "提示词"` | 实现已验证的计划 |
| 代码审查 | Codex | `echo "review" \| codex exec --sandbox read-only` | 审查 Bug/性能 |
| 最终审查 | Claude | Read 工具、分析 | Claude 最终架构检查 |
| 修复计划 | Claude | 创建详细修复计划 | 基于所有反馈规划修复 |
| 实施修复 | Cursor | `cursor-agent --resume="<ID>" -p --force "修复内容"` | 在同一会话中实施修复 |
| 重新审查 | Codex + Claude | 重复审查阶段 | 验证修复直至完美 |

这创建了一个三重验证、自我修正的高质量工程系统：
- **Claude**：所有规划、架构和最终监督
- **Codex**：所有验证（计划逻辑 + 代码质量）
- **Cursor Agent**：所有实现和编码

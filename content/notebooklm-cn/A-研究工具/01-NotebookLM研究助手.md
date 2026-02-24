> 来源：[PleasePrompto/notebooklm-skill](https://github.com/PleasePrompto/notebooklm-skill) | 分类：效率工具

---
name: notebooklm
description: Query Google NotebookLM notebooks from Claude Code for source-grounded, citation-backed answers. Browser automation with persistent auth. Use when you need document-grounded research with reduced hallucinations.
---

# NotebookLM 研究助手

## 概述

让 Claude Code 直接与 Google NotebookLM 对话。查询你上传的文档，获取基于源文档的、带引用的 Gemini 回答。通过浏览器自动化实现，每次问题都是独立会话，大幅减少幻觉。

## 适用场景

- 需要基于特定文档回答问题（减少 AI 幻觉）
- 研究项目中有大量参考资料已上传到 NotebookLM
- 需要带引用的答案（每个回答都标注来源段落）
- 用户明确提到 NotebookLM 或分享了 NotebookLM URL

## 工作流程

1. **检查认证** — `python scripts/run.py auth_manager.py status`
2. **首次认证** — `python scripts/run.py auth_manager.py setup`（浏览器可见，需手动登录 Google）
3. **管理笔记本库** — 添加、列表、搜索、激活笔记本
4. **提问** — `python scripts/run.py ask_question.py --question "你的问题"`
5. **追问循环** — 分析答案是否完整，不完整则继续追问
6. **综合回答** — 组合多次回答后响应用户

## 核心命令

### 认证管理
```bash
python scripts/run.py auth_manager.py setup    # 首次设置（浏览器可见）
python scripts/run.py auth_manager.py status   # 检查状态
python scripts/run.py auth_manager.py reauth   # 重新认证
```

### 笔记本管理
```bash
python scripts/run.py notebook_manager.py list                    # 列出所有笔记本
python scripts/run.py notebook_manager.py add --url URL --name "名称" --description "描述" --topics "主题1,主题2"
python scripts/run.py notebook_manager.py search --query "关键词"  # 按主题搜索
python scripts/run.py notebook_manager.py activate --id ID        # 设置活跃笔记本
```

### 提问
```bash
python scripts/run.py ask_question.py --question "问题"                    # 使用活跃笔记本
python scripts/run.py ask_question.py --question "问题" --notebook-id ID   # 指定笔记本
python scripts/run.py ask_question.py --question "问题" --show-browser     # 显示浏览器调试
```

## 智能添加笔记本

用户不提供详情时，先查询发现内容再添加：

```bash
# 第 1 步：查询笔记本内容
python scripts/run.py ask_question.py --question "What is the content of this notebook?" --notebook-url "[URL]"

# 第 2 步：基于发现添加
python scripts/run.py notebook_manager.py add --url "[URL]" --name "基于内容的名称" --description "基于内容的描述" --topics "发现的主题"
```

## 追问机制

每次 NotebookLM 回答后：
1. **停下** — 不要立即回复用户
2. **分析** — 对比答案与用户原始请求
3. **找差距** — 判断是否需要更多信息
4. **追问** — 有差距就立即发送追问
5. **综合** — 组合所有回答后再响应用户

## 限制与注意

| 限制 | 说明 |
|------|------|
| 无会话持久性 | 每次提问 = 新浏览器会话 |
| 速率限制 | 免费 Google 账号约 50 次/天 |
| 手动上传 | 用户需自行将文档添加到 NotebookLM |
| 浏览器开销 | 每次提问需几秒启动浏览器 |

## 故障排除

| 问题 | 解决方案 |
|------|----------|
| ModuleNotFoundError | 必须使用 `run.py` 包装器 |
| 认证失败 | 设置时浏览器必须可见：`--show-browser` |
| 达到速率限制 | 等待或切换 Google 账号 |
| 浏览器崩溃 | `python scripts/run.py cleanup_manager.py --preserve-library` |

## 关键规则

- **始终使用 run.py** — 自动管理虚拟环境和依赖
- **先检查认证** — 任何操作前先确认认证状态
- **不要猜测笔记本描述** — 不确定就用智能添加先查询
- **追问不要停** — 第一个答案很少是完整的

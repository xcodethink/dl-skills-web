# AgentShield 配置审计（Security Scan）

> **来源**: [affaan-m/everything-claude-code](https://github.com/AffaanM/everything-claude-code)
> **原始文件**: skills/security-scan/SKILL.md
> **类别**: E-安全保障

---

## 概述

使用 [AgentShield](https://github.com/affaan-m/agentshield) 扫描 Claude Code 配置（`.claude/` 目录）中的安全漏洞、配置错误和注入风险。检查 CLAUDE.md、settings.json、MCP 服务器、Hooks 和 Agent 定义。

---

## 激活时机

- 设置新的 Claude Code 项目时
- 修改 `.claude/settings.json`、`CLAUDE.md` 或 MCP 配置后
- 提交配置变更前
- 接手包含现有 Claude Code 配置的新仓库时
- 定期安全卫生检查

---

## 扫描范围

| 文件 | 检查项 |
|------|--------|
| `CLAUDE.md` | 硬编码密钥、自动运行指令、提示注入（Prompt Injection）模式 |
| `settings.json` | 过于宽松的允许列表、缺失的拒绝列表、危险的绕过标志 |
| `mcp.json` | 高风险 MCP 服务器、硬编码环境变量密钥、npx 供应链风险 |
| `hooks/` | 通过插值（Interpolation）进行的命令注入、数据泄露、静默错误抑制 |
| `agents/*.md` | 不受限的工具访问、提示注入攻击面、缺失的模型规格 |

---

## 前置条件

AgentShield 必须已安装。检查并在需要时安装：

```bash
# 检查是否已安装
npx ecc-agentshield --version

# 全局安装（推荐）
npm install -g ecc-agentshield

# 或直接通过 npx 运行（无需安装）
npx ecc-agentshield scan .
```

---

## 使用方法

### 基本扫描

对当前项目的 `.claude/` 目录运行扫描：

```bash
# 扫描当前项目
npx ecc-agentshield scan

# 扫描指定路径
npx ecc-agentshield scan --path /path/to/.claude

# 按最低严重程度过滤扫描
npx ecc-agentshield scan --min-severity medium
```

### 输出格式

```bash
# 终端输出（默认） — 带评级的彩色报告
npx ecc-agentshield scan

# JSON — 用于 CI/CD 集成
npx ecc-agentshield scan --format json

# Markdown — 用于文档
npx ecc-agentshield scan --format markdown

# HTML — 自包含的深色主题报告
npx ecc-agentshield scan --format html > security-report.html
```

### 自动修复

自动应用安全修复（仅修复标记为可自动修复的问题）：

```bash
npx ecc-agentshield scan --fix
```

此操作将：
- 将硬编码密钥替换为环境变量引用
- 将通配符权限收紧为范围化替代方案
- 不修改仅限手动处理的建议

### Opus 4.6 深度分析

运行对抗性三 Agent 管道进行深度分析：

```bash
# 需要 ANTHROPIC_API_KEY
export ANTHROPIC_API_KEY=your-key
npx ecc-agentshield scan --opus --stream
```

此分析运行三个 Agent：
1. **攻击者（Red Team，红队）** — 查找攻击向量
2. **防御者（Blue Team，蓝队）** — 推荐加固措施
3. **审计员（Final Verdict，最终裁决）** — 综合双方视角

### 初始化安全配置

从零开始脚手架创建安全的 `.claude/` 配置：

```bash
npx ecc-agentshield init
```

创建内容：
- `settings.json`：带有范围化权限和拒绝列表
- `CLAUDE.md`：包含安全最佳实践
- `mcp.json`：占位符

### GitHub Action 集成

添加到 CI 管道：

```yaml
- uses: affaan-m/agentshield@v1
  with:
    path: '.'
    min-severity: 'medium'
    fail-on-findings: true
```

---

## 严重程度等级

| 评级 | 分数 | 含义 |
|------|------|------|
| A | 90-100 | 安全配置 |
| B | 75-89 | 轻微问题 |
| C | 60-74 | 需要关注 |
| D | 40-59 | 显著风险 |
| F | 0-39 | 严重漏洞 |

---

## 结果解读

### 严重发现（Critical） — 立即修复

- 配置文件中硬编码的 API 密钥或令牌
- 允许列表中的 `Bash(*)`（不受限的 Shell 访问）
- Hooks 中通过 `${file}` 插值进行的命令注入
- 运行 Shell 的 MCP 服务器

### 高危发现（High） — 生产前修复

- CLAUDE.md 中的自动运行指令（提示注入攻击向量）
- 权限中缺失拒绝列表
- 具有不必要 Bash 访问权限的 Agent

### 中危发现（Medium） — 建议修复

- Hooks 中的静默错误抑制（`2>/dev/null`、`|| true`）
- 缺失 PreToolUse 安全钩子
- MCP 服务器配置中的 `npx -y` 自动安装

### 信息发现（Info） — 了解即可

- MCP 服务器缺失描述
- 被正确标记为良好实践的禁止性指令

---

## 相关链接

- **GitHub**: [github.com/affaan-m/agentshield](https://github.com/affaan-m/agentshield)
- **npm**: [npmjs.com/package/ecc-agentshield](https://www.npmjs.com/package/ecc-agentshield)

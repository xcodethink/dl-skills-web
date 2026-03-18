> 来源：[mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | 分类：G-工具与效率

# 技能创建器（Skill Creator）

此技能提供创建有效技能的指导。

## 关于技能

技能是模块化、自包含的包，通过提供专业知识、工作流和工具来扩展 Claude 的能力。可以将它们视为特定领域或任务的"入职指南" —— 它们将 Claude 从通用 Agent 转变为配备了程序性知识的专业 Agent。

**重要：**
- 技能不是文档，而是 Claude Code 使用工具、包、插件或 API 完成任务的实际操作指令。
- 每个技能教会 Claude 如何执行特定的开发任务，而非工具做什么。
- Claude Code 可以自动激活多个技能来完成用户的请求。

### 技能提供什么

1. 专业工作流 - 特定领域的多步骤程序
2. 工具集成 - 使用特定文件格式或 API 的指令
3. 领域专业知识 - 公司特定知识、模式、业务逻辑
4. 捆绑资源 - 用于复杂和重复任务的脚本、参考和资产

### 技能结构

每个技能包含一个必需的 SKILL.md 文件和可选的捆绑资源：

```
.claude/skills/
└── skill-name/
    ├── SKILL.md（必需）
    │   ├── YAML 前置元数据（必需）
    │   │   ├── name:（必需）
    │   │   ├── description:（必需）
    │   │   ├── license:（可选）
    │   │   └── version:（可选）
    │   └── Markdown 指令（必需）
    └── 捆绑资源（可选）
        ├── scripts/          - 可执行代码（Python/Bash 等）
        ├── references/       - 按需加载到上下文的文档
        └── assets/           - 用于输出的文件（模板、图标、字体等）
```

#### 要求（**重要**）

- 技能应按特定主题合并，例如：`cloudflare`、`cloudflare-r2`、`cloudflare-workers`、`docker`、`gcloud` 应合并为 `devops`
- `SKILL.md` 应**少于 150 行**，并包含相关 Markdown 文件和脚本的引用。
- 每个脚本或引用的 Markdown 文件也应**少于 150 行**，记住可以将它们拆分为多个文件（**渐进式披露**原则）。
- `SKILL.md` 文件元数据中的描述应既简洁（**少于 200 个字符**）又包含足够的引用和脚本使用场景，这有助于在 Claude Code 的实现过程中自动激活技能。
- **引用的 Markdown 文件**：
  - 为简洁起见可牺牲语法。
  - 也可以引用其他 Markdown 文件或脚本。
- **引用的脚本**：
  - 优先使用 Node.js 或 Python 脚本而非 Bash 脚本，因为 Bash 脚本在 Windows 上支持不佳。
  - 如果编写 Python 脚本，确保有 `requirements.txt`。
  - 确保脚本按以下顺序尊重 `.env` 文件：`process.env` > `$HOME/.claude/skills/${SKILL}/.env`（全局）> `$HOME/.claude/skills/.env`（全局）> `$HOME/.claude/.env`（全局）> `./.claude/skills/${SKILL}/.env`（当前目录）> `./.claude/skills/.env`（当前目录）> `./.claude/.env`（当前目录）
  - 创建 `.env.example` 文件展示所需的环境变量。
  - 始终为脚本编写测试。

**重要：**
- 始终记住 `SKILL.md` 和引用文件应高效使用 Token，以便最大化利用**渐进式披露**。
- `SKILL.md` 应**少于 150 行**
- 引用的 Markdown 文件也应**少于 150 行**，记住可以将它们拆分为多个文件（**渐进式披露**原则）。
- 引用的脚本：无长度限制，只要确保能工作，无编译问题、无运行时问题、无依赖问题、无环境问题、无平台问题。

**为什么？**
更好的**上下文工程**：利用 Agent 技能的**渐进式披露**技术，当 Agent 技能被激活时，Claude Code 会考虑仅将相关文件加载到上下文中，而不是像以前那样读取所有冗长的 `SKILL.md`。

#### SKILL.md（必需）

**文件名：** `SKILL.md`（大写）
**文件大小：** 少于 150 行，如果需要更多内容，将其拆分为 `references` 文件夹中的多个文件（每个 <150 行）。
`SKILL.md` 始终简短精炼，直奔主题，将其视为快速参考指南。

**元数据质量：** YAML 前置元数据中的 `name` 和 `description`（**必须少于 200 个字符**）决定了 Claude 何时使用该技能。要具体说明技能做什么以及何时使用它，不要听起来通用、模糊或教育性。使用第三人称（例如"此技能应在...时使用"而非"在...时使用此技能"）。

#### 捆绑资源（可选）

##### 脚本（`scripts/`）

用于需要确定性可靠性或被反复重写的任务的可执行代码（Python/Bash 等）。

- **何时包含**：当相同代码被反复重写或需要确定性可靠性时
- **示例**：`scripts/rotate_pdf.py` 用于 PDF 旋转任务
- **优势**：Token 高效、确定性、可在不加载到上下文的情况下执行
- **说明**：脚本可能仍需要被 Claude 读取以进行修补或环境特定调整

**重要：**
- 为脚本编写测试。
- 运行测试并确保通过，如果测试失败则修复并重新运行，重复直到测试通过。
- 使用一些用例手动运行脚本以确保它能工作。
- 确保脚本按指定顺序尊重 `.env` 文件。

##### 参考文档（`references/`）

按需加载到上下文中以指导 Claude 流程和思考的文档和参考材料。

- **何时包含**：Claude 在工作时应引用的文档
- **示例**：`references/finance.md` 金融模式、`references/mnda.md` 公司 NDA 模板、`references/policies.md` 公司政策、`references/api_docs.md` API 规范
- **用例**：数据库模式、最佳实践、常见工作流、速查表、工具指令、API 文档、领域知识、公司政策、详细工作流指南
- **优势**：保持 SKILL.md 精简，仅在 Claude 确定需要时加载，使信息可发现而不占用上下文窗口。
- **最佳实践**：如果文件很大（>150 行），将其拆分为 `references` 文件夹中的多个文件（每个 <150 行），在 `SKILL.md` 中包含 grep 搜索模式。
- **避免重复**：信息应存在于 `SKILL.md` 或 `references` 文件中的一个位置，而非两者。将详细信息放在 `references` 文件中 —— 这保持 `SKILL.md` 精简。

##### 资产（`assets/`）

不打算加载到上下文中，而是用于 Claude 生成输出的文件。

- **何时包含**：技能需要用于最终输出的文件
- **示例**：`assets/logo.png` 品牌资产、`assets/slides.pptx` PowerPoint 模板、`assets/frontend-template/` HTML/React 样板、`assets/font.ttf` 字体
- **用例**：模板、图像、图标、样板代码、字体、被复制或修改的示例文档
- **优势**：将输出资源与文档分开，使 Claude 能在不加载到上下文的情况下使用文件

### 渐进式披露设计原则

技能使用三级加载系统来高效管理上下文：

1. **元数据（name + description）** - 始终在上下文中（**少于 200 个字符**）
2. **SKILL.md 正文** - 技能触发时（<5k 词）
3. **捆绑资源** - 按 Claude 需要加载（无限制*）

*无限制是因为脚本可以在不读入上下文窗口的情况下执行。

## 技能创建流程

创建技能时，按顺序遵循以下步骤，仅在有明确理由时才跳过。

### 步骤一：通过具体示例理解技能

仅当技能的使用模式已经被清楚理解时才跳过此步骤。

要创建有效的技能，需要清楚理解技能将如何被使用的具体示例。可以来自用户直接提供的示例或经过用户反馈验证的生成示例。

使用 `AskUserQuestion` 工具收集用户反馈并验证理解。

例如，构建图像编辑技能时，相关问题包括：

- "图像编辑技能应该支持什么功能？编辑、旋转，还有其他的吗？"
- "能给出一些这个技能会如何被使用的示例吗？"
- "什么样的用户输入应该触发此技能？"

为避免让用户应接不暇，避免在单条消息中问太多问题。

### 步骤二：互联网调研

有效的技能是来自专业工作流和案例研究的真实工作流子集。

激活 `/docs-seeker` 技能搜索文档。

激活 `/research` 技能研究：
- 最佳实践和行业标准
- 现有 CLI 工具（通过 `npx`、`bunx` 或 `pipx` 可执行）及其使用模式
- 工作流和成功案例
- 常见模式、用例和示例
- 边缘情况、潜在陷阱和规避策略

记录研究报告以在下一步使用。

### 步骤三：规划可复用的技能内容

将具体示例转化为有效技能，分析每个示例：

1. 考虑如何从头执行该示例
2. 优先使用现有 CLI 工具的执行（通过 `npx`、`bunx` 或 `pipx`）而非编写自定义代码
3. 识别在反复执行这些工作流时哪些脚本、参考文档和资产会有帮助
4. 分析当前技能目录以避免功能重复，尽可能复用现有技能

### 步骤四：初始化技能

创建新技能时，始终运行 `init_skill.py` 脚本：

```bash
scripts/init_skill.py <skill-name> --path <output-directory>
```

脚本功能：
- 在指定路径创建技能目录
- 生成带有适当前置元数据和 TODO 占位符的 SKILL.md 模板
- 创建示例资源目录：`scripts/`、`references/` 和 `assets/`
- 在每个目录中添加可自定义或删除的示例文件

### 步骤五：编辑技能

编辑技能时，记住技能是为另一个 Claude 实例创建的。专注于包含对 Claude 有益且非显而易见的信息。

#### 从可复用技能内容开始

从上面识别的可复用资源开始实现：`scripts/`、`references/` 和 `assets/` 文件。

删除技能不需要的示例文件和目录。

#### 更新 SKILL.md

**写作风格：** 使用**祈使/不定式形式**（动词优先指令），而非第二人称。使用客观的指导性语言（例如"要完成 X，执行 Y"而非"你应该执行 X"）。

完成 SKILL.md 需回答以下问题：

1. 技能的目的是什么？用几句话说明
2. 技能应在何时使用？
3. 在实践中，Claude 应如何使用此技能？上面开发的所有可复用技能内容都应被引用

### 步骤五（续）：打包技能

技能准备就绪后，打包为可分发的 zip 文件：

```bash
scripts/package_skill.py <path/to/skill-folder>
```

可选指定输出目录：

```bash
scripts/package_skill.py <path/to/skill-folder> ./dist
```

打包脚本将：

1. **验证**技能，自动检查：
   - YAML 前置元数据格式和必填字段
   - 技能命名约定和目录结构
   - 描述完整性和质量（**必须少于 200 个字符**）
   - 文件组织和资源引用

2. 验证通过后**打包**技能，创建以技能命名的 zip 文件，包含所有文件并保持适当的目录结构用于分发。

### 步骤六：迭代

测试技能后，用户可能会请求改进。

**迭代工作流：**
1. 在真实任务上使用技能
2. 注意困难或低效之处
3. 注意 Token 使用和性能
4. 识别 SKILL.md 或捆绑资源应如何更新
5. 实施更改并再次测试

## 验证标准

评估技能的详细验证标准：

- **快速检查清单**：`references/validation-checklist.md`
- **元数据质量**：`references/metadata-quality-criteria.md`
- **Token 效率**：`references/token-efficiency-criteria.md`
- **脚本质量**：`references/script-quality-criteria.md`
- **结构与组织**：`references/structure-organization-criteria.md`

## 插件市场

通过市场分发技能为插件，参见：
- **概述**：`references/plugin-marketplace-overview.md`
- **模式**：`references/plugin-marketplace-schema.md`
- **来源**：`references/plugin-marketplace-sources.md`
- **托管**：`references/plugin-marketplace-hosting.md`
- **故障排除**：`references/plugin-marketplace-troubleshooting.md`

## 参考资料
- [Agent Skills](https://docs.claude.com/en/docs/claude-code/skills.md)
- [Agent Skills Spec](../agent_skills_spec.md)
- [Agent Skills Overview](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview.md)
- [Best Practices](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices.md)
- [Plugin Marketplaces](https://code.claude.com/docs/en/plugin-marketplaces.md)

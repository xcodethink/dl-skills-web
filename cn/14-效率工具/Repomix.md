> 来源：[mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | 分类：G-工具与效率

# Repomix 技能

Repomix 将整个代码仓库打包成单个 AI 友好的文件。非常适合将代码库提供给 Claude、ChatGPT 和 Gemini 等 LLM。

## 适用场景

- 为 AI 分析打包代码库
- 为 LLM 上下文创建仓库快照
- 分析第三方库
- 准备安全审计
- 生成文档上下文
- 跨大型代码库调查缺陷
- 创建 AI 友好的代码表示

## 快速开始

### 检查安装
```bash
repomix --version
```

### 安装
```bash
# npm
npm install -g repomix

# Homebrew（macOS/Linux）
brew install repomix
```

### 基本用法
```bash
# 打包当前目录（生成 repomix-output.xml）
repomix

# 指定输出格式
repomix --style markdown
repomix --style json

# 打包远程仓库
npx repomix --remote owner/repo

# 带过滤器的自定义输出
repomix --include "src/**/*.ts" --remove-comments -o output.md
```

## 核心能力

### 仓库打包
- AI 优化的格式，带清晰分隔符
- 多种输出格式：XML、Markdown、JSON、纯文本
- Git 感知处理（遵循 .gitignore）
- 用于 LLM 上下文管理的 Token 计数
- 敏感信息安全检查

### 远程仓库支持
无需克隆即可处理远程仓库：
```bash
# 简写形式
npx repomix --remote yamadashy/repomix

# 完整 URL
npx repomix --remote https://github.com/owner/repo

# 特定提交
npx repomix --remote https://github.com/owner/repo/commit/hash
```

### 注释移除
从支持的语言中剥离注释（HTML、CSS、JavaScript、TypeScript、Vue、Svelte、Python、PHP、Ruby、C、C#、Java、Go、Rust、Swift、Kotlin、Dart、Shell、YAML）：
```bash
repomix --remove-comments
```

## 常见用例

### 代码审查准备
```bash
# 为 AI 审查打包功能分支
repomix --include "src/**/*.ts" --remove-comments -o review.md --style markdown
```

### 安全审计
```bash
# 打包第三方库
npx repomix --remote vendor/library --style xml -o audit.xml
```

### 文档生成
```bash
# 打包文档和代码
repomix --include "src/**,docs/**,*.md" --style markdown -o context.md
```

### 缺陷调查
```bash
# 打包特定模块
repomix --include "src/auth/**,src/api/**" -o debug-context.xml
```

### 实现规划
```bash
# 完整代码库上下文
repomix --remove-comments --copy
```

## 命令行参考

### 文件选择
```bash
# 包含特定模式
repomix --include "src/**/*.ts,*.md"

# 额外忽略模式
repomix -i "tests/**,*.test.js"

# 禁用 .gitignore 规则
repomix --no-gitignore
```

### 输出选项
```bash
# 输出格式
repomix --style markdown  # 或 xml、json、plain

# 输出文件路径
repomix -o output.md

# 移除注释
repomix --remove-comments

# 复制到剪贴板
repomix --copy
```

### 配置
```bash
# 使用自定义配置文件
repomix -c custom-config.json

# 初始化新配置
repomix --init  # 创建 repomix.config.json
```

## Token 管理

Repomix 自动计算各个文件、整个仓库和每种格式输出的 Token 数量。

典型 LLM 上下文限制：
- Claude Sonnet 4.5：约 200K tokens
- GPT-4：约 128K tokens
- GPT-3.5：约 16K tokens

## 安全注意事项

Repomix 使用 Secretlint 检测敏感数据（API 密钥、密码、凭据、私钥、AWS 密钥）。

最佳实践：
1. 分享前始终审查输出
2. 对敏感文件使用 `.repomixignore`
3. 对未知代码库启用安全检查
4. 避免打包 `.env` 文件
5. 检查硬编码的凭据

如需禁用安全检查：
```bash
repomix --no-security-check
```

## 实现工作流

用户请求仓库打包时：

1. **评估需求**
   - 识别目标仓库（本地/远程）
   - 确定所需输出格式
   - 检查敏感数据方面的顾虑

2. **配置过滤器**
   - 设置包含模式匹配相关文件
   - 添加忽略模式排除不必要的文件
   - 启用/禁用注释移除

3. **执行打包**
   - 使用适当选项运行 repomix
   - 监控 Token 计数
   - 验证安全检查

4. **验证输出**
   - 审查生成的文件
   - 确认无敏感数据
   - 检查目标 LLM 的 Token 限制

5. **交付上下文**
   - 向用户提供打包文件
   - 包含 Token 计数摘要
   - 注明任何警告或问题

## 参考文档

详细信息参见：
- [配置参考](./references/configuration.md) - 配置文件、包含/排除模式、输出格式、高级选项
- [使用模式](./references/usage-patterns.md) - AI 分析工作流、安全审计准备、文档生成、库评估

## 补充资源

- GitHub：https://github.com/yamadashy/repomix
- 文档：https://repomix.com/guide/
- MCP 服务器：可用于 AI 助手集成

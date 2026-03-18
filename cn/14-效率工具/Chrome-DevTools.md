> 来源：[mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | 分类：G-工具与效率

# Chrome DevTools Agent 技能

通过可执行的 Puppeteer 脚本实现浏览器自动化。所有脚本输出 JSON 格式便于解析。

## 快速开始

**关键提示**：运行脚本前务必检查 `pwd`。

### 安装

#### 步骤一：安装系统依赖（仅限 Linux/WSL）

在 Linux/WSL 上，Chrome 需要系统库。先安装它们：

```bash
pwd  # 应显示当前工作目录
cd .claude/skills/chrome-devtools/scripts
./install-deps.sh  # 自动检测操作系统并安装所需库
```

支持：Ubuntu、Debian、Fedora、RHEL、CentOS、Arch、Manjaro

**macOS/Windows**：跳过此步骤（依赖已随 Chrome 捆绑）

#### 步骤二：安装 Node 依赖

```bash
npm install  # 安装 puppeteer、debug、yargs
```

#### 步骤三：安装 ImageMagick（可选，推荐）

ImageMagick 可自动压缩超过 5MB 的截图：

**macOS：**
```bash
brew install imagemagick
```

**Ubuntu/Debian/WSL：**
```bash
sudo apt-get install imagemagick
```

**验证：**
```bash
magick -version  # 或：convert -version
```

未安装 ImageMagick 时，超过 5MB 的截图将不会被压缩（可能无法在 Gemini/Claude 中加载）。

### 测试
```bash
node navigate.js --url https://example.com
# 输出：{"success": true, "url": "https://example.com", "title": "Example Domain"}
```

## 可用脚本

所有脚本位于 `.claude/skills/chrome-devtools/scripts/`

**关键提示**：运行脚本前务必检查 `pwd`。

### 脚本用法
- `./scripts/README.md`

### 核心自动化
- `navigate.js` - 导航到 URL
- `screenshot.js` - 捕捉截图（整页或元素）
- `click.js` - 点击元素
- `fill.js` - 填写表单字段
- `evaluate.js` - 在页面上下文中执行 JavaScript

### 分析与监控
- `snapshot.js` - 提取带元数据的交互元素
- `console.js` - 监控控制台消息/错误
- `network.js` - 跟踪 HTTP 请求/响应
- `performance.js` - 测量 Core Web Vitals + 录制追踪

## 使用模式

### 单个命令
```bash
pwd  # 应显示当前工作目录
cd .claude/skills/chrome-devtools/scripts
node screenshot.js --url https://example.com --output ./docs/screenshots/page.png
```
**重要**：始终将截图保存到 `./docs/screenshots` 目录。

### 自动图像压缩
如果截图超过 5MB，会**自动压缩**以确保与 Gemini API 和 Claude Code（均有 5MB 限制）的兼容性。内部使用 ImageMagick：

```bash
# 默认：超过 5MB 自动压缩
node screenshot.js --url https://example.com --output page.png

# 自定义大小阈值（例如 3MB）
node screenshot.js --url https://example.com --output page.png --max-size 3

# 禁用压缩
node screenshot.js --url https://example.com --output page.png --no-compress
```

**压缩行为：**
- PNG：缩放至 90% + 质量 85（如仍过大则 75% + 质量 70）
- JPEG：质量 80 + 渐进编码（如仍过大则质量 60）
- 其他格式：转换为 JPEG 并压缩
- 需要安装 ImageMagick（参见 imagemagick 技能）

**输出包含压缩信息：**
```json
{
  "success": true,
  "output": "/path/to/page.png",
  "compressed": true,
  "originalSize": 8388608,
  "size": 3145728,
  "compressionRatio": "62.50%",
  "url": "https://example.com"
}
```

### 链式命令（复用浏览器）
```bash
# 使用 --close false 保持浏览器打开
node navigate.js --url https://example.com/login --close false
node fill.js --selector "#email" --value "user@example.com" --close false
node fill.js --selector "#password" --value "secret" --close false
node click.js --selector "button[type=submit]"
```

### 解析 JSON 输出
```bash
# 用 jq 提取特定字段
node performance.js --url https://example.com | jq '.vitals.LCP'

# 保存到文件
node network.js --url https://example.com --output /tmp/requests.json
```

## 执行协议

### 工作目录验证

执行任何脚本**之前**：
1. 用 `pwd` 检查当前工作目录
2. 确认在 `.claude/skills/chrome-devtools/scripts/` 目录中
3. 如果目录错误，`cd` 到正确位置
4. 所有输出文件使用绝对路径

示例：
```bash
pwd  # 应显示：.../chrome-devtools/scripts
# 如果目录错误：
cd .claude/skills/chrome-devtools/scripts
```

### 输出验证

截图/捕捉操作**之后**：
1. 用 `ls -lh <output-path>` 验证文件已创建
2. 使用 Read 工具读取截图确认内容
3. 检查 JSON 输出的 success:true
4. 报告文件大小和压缩状态

示例：
```bash
node screenshot.js --url https://example.com --output ./docs/screenshots/page.png
ls -lh ./docs/screenshots/page.png  # 验证文件存在
# 然后使用 Read 工具进行视觉检查
```

5. 将工作目录重置到项目根目录。

### 错误恢复

脚本失败时：
1. 检查错误消息中的选择器问题
2. 使用 snapshot.js 发现正确的选择器
3. 如果 CSS 选择器失败，尝试 XPath 选择器
4. 验证元素可见且可交互

示例：
```bash
# CSS 选择器失败
node click.js --url https://example.com --selector ".btn-submit"
# 错误：等待选择器 ".btn-submit" 失败

# 发现正确的选择器
node snapshot.js --url https://example.com | jq '.elements[] | select(.tagName=="BUTTON")'

# 尝试 XPath
node click.js --url https://example.com --selector "//button[contains(text(),'Submit')]"
```

### 常见错误

- 工作目录错误 -> 输出文件到了错误位置
- 跳过输出验证 -> 静默失败
- 未测试就使用复杂 CSS 选择器 -> 选择器错误
- 未检查元素可见性 -> 超时错误

正确做法：
- 运行脚本前始终验证 `pwd`
- 截图后始终验证输出
- 使用 snapshot.js 发现选择器
- 先用简单命令测试选择器

## 常见工作流

### 网页抓取
```bash
node evaluate.js --url https://example.com --script "
  Array.from(document.querySelectorAll('.item')).map(el => ({
    title: el.querySelector('h2')?.textContent,
    link: el.querySelector('a')?.href
  }))
" | jq '.result'
```

### 性能测试
```bash
PERF=$(node performance.js --url https://example.com)
LCP=$(echo $PERF | jq '.vitals.LCP')
if (( $(echo "$LCP < 2500" | bc -l) )); then
  echo "LCP 通过：${LCP}ms"
else
  echo "LCP 失败：${LCP}ms"
fi
```

### 表单自动化
```bash
node fill.js --url https://example.com --selector "#search" --value "query" --close false
node click.js --selector "button[type=submit]"
```

### 错误监控
```bash
node console.js --url https://example.com --types error,warn --duration 5000 | jq '.messageCount'
```

## 脚本选项

所有脚本支持：
- `--headless false` - 显示浏览器窗口
- `--close false` - 保持浏览器打开以便链式操作
- `--timeout 30000` - 设置超时（毫秒）
- `--wait-until networkidle2` - 等待策略

参见 `./scripts/README.md` 了解完整选项。

## 输出格式

所有脚本将 JSON 输出到 stdout：
```json
{
  "success": true,
  "url": "https://example.com",
  ... // 脚本特定数据
}
```

错误输出到 stderr：
```json
{
  "success": false,
  "error": "错误消息"
}
```

## 查找元素

使用 `snapshot.js` 发现选择器：
```bash
node snapshot.js --url https://example.com | jq '.elements[] | {tagName, text, selector}'
```

## 故障排除

### 常见错误

**"Cannot find package 'puppeteer'"**
- 运行：在 scripts 目录中执行 `npm install`

**"error while loading shared libraries: libnss3.so"**（Linux/WSL）
- 缺少系统依赖
- 修复：在 scripts 目录中运行 `./install-deps.sh`
- 手动安装：`sudo apt-get install -y libnss3 libnspr4 libasound2t64 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1`

**"Failed to launch the browser process"**
- 检查系统依赖是否已安装（Linux/WSL）
- 验证 Chrome 已下载：`ls ~/.cache/puppeteer`
- 尝试：`npm rebuild` 然后 `npm install`

**Chrome 未找到**
- Puppeteer 在 `npm install` 时自动下载 Chrome
- 如果失败，手动触发：`npx puppeteer browsers install chrome`

### 脚本问题

**元素未找到**
- 先获取快照找到正确选择器：`node snapshot.js --url <url>`

**脚本挂起**
- 增加超时：`--timeout 60000`
- 更改等待策略：`--wait-until load` 或 `--wait-until domcontentloaded`

**空白截图**
- 等待页面加载：`--wait-until networkidle2`
- 增加超时：`--timeout 30000`

**脚本权限被拒绝**
- 添加执行权限：`chmod +x *.sh`

**截图过大（>5MB）**
- 安装 ImageMagick 以实现自动压缩
- 手动设置更低阈值：`--max-size 3`
- 使用 JPEG 格式代替 PNG：`--format jpeg --quality 80`
- 捕捉特定元素而非整页：`--selector .main-content`

**压缩不工作**
- 验证 ImageMagick 已安装：`magick -version` 或 `convert -version`
- 检查输出 JSON 中文件是否已压缩：`"compressed": true`
- 对于非常大的页面，使用 `--selector` 仅捕捉需要的区域

## 参考文档

`./references/` 中的详细指南：
- [CDP 域参考](./references/cdp-domains.md) - 47 个 Chrome DevTools Protocol 域
- [Puppeteer 快速参考](./references/puppeteer-reference.md) - 完整的 Puppeteer API 模式
- [性能分析指南](./references/performance-guide.md) - Core Web Vitals 优化

## 高级用法

### 自定义脚本
使用共享库创建自定义脚本：
```javascript
import { getBrowser, getPage, closeBrowser, outputJSON } from './lib/browser.js';
// 你的自动化逻辑
```

### 直接 CDP 访问
```javascript
const client = await page.createCDPSession();
await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
```

参见参考文档了解高级模式和完整 API 覆盖。

## 外部资源

- [Puppeteer 文档](https://pptr.dev/)
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)
- [脚本 README](./scripts/README.md)

> 来源：[everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# PM2 进程管理

## 概述

PM2 Init 命令可以自动分析项目结构，检测前端/后端/数据库等服务，并生成 PM2 配置文件和管理命令文件，实现开发环境中多服务的统一管理。

## 工作流程

1. 检查 PM2（如未安装则通过 `npm install -g pm2` 安装）
2. 扫描项目，识别服务类型（前端/后端/数据库）
3. 生成配置文件和各个命令文件

## 服务检测

| 类型 | 检测方式 | 默认端口 |
|------|----------|----------|
| Vite | vite.config.* | 5173 |
| Next.js | next.config.* | 3000 |
| Nuxt | nuxt.config.* | 3000 |
| CRA | package.json 中的 react-scripts | 3000 |
| Express/Node | server/backend/api 目录 + package.json | 3000 |
| FastAPI/Flask | requirements.txt / pyproject.toml | 8000 |
| Go | go.mod / main.go | 8080 |

**端口检测优先级**：用户指定 > .env > 配置文件 > 脚本参数 > 默认端口

## 生成的文件结构

```
project/
├── ecosystem.config.cjs              # PM2 配置文件
├── {backend}/start.cjs               # Python 包装脚本（如适用）
└── .claude/
    ├── commands/
    │   ├── pm2-all.md                # 启动全部 + 监控面板
    │   ├── pm2-all-stop.md           # 停止全部
    │   ├── pm2-all-restart.md        # 重启全部
    │   ├── pm2-{port}.md             # 启动单个 + 日志
    │   ├── pm2-{port}-stop.md        # 停止单个
    │   ├── pm2-{port}-restart.md     # 重启单个
    │   ├── pm2-logs.md               # 查看所有日志
    │   └── pm2-status.md             # 查看状态
    └── scripts/
        ├── pm2-logs-{port}.ps1       # 单服务日志（PowerShell）
        └── pm2-monit.ps1             # PM2 监控面板（PowerShell）
```

## Windows 配置（重要）

### ecosystem.config.cjs

**必须使用 `.cjs` 扩展名**

```javascript
module.exports = {
  apps: [
    // Node.js（Vite/Next/Nuxt）
    {
      name: 'project-3000',
      cwd: './packages/web',
      script: 'node_modules/vite/bin/vite.js',
      args: '--port 3000',
      interpreter: 'C:/Program Files/nodejs/node.exe',
      env: { NODE_ENV: 'development' }
    },
    // Python
    {
      name: 'project-8000',
      cwd: './backend',
      script: 'start.cjs',
      interpreter: 'C:/Program Files/nodejs/node.exe',
      env: { PYTHONUNBUFFERED: '1' }
    }
  ]
}
```

**各框架脚本路径：**

| 框架 | script | args |
|------|--------|------|
| Vite | `node_modules/vite/bin/vite.js` | `--port {port}` |
| Next.js | `node_modules/next/dist/bin/next` | `dev -p {port}` |
| Nuxt | `node_modules/nuxt/bin/nuxt.mjs` | `dev --port {port}` |
| Express | `src/index.js` 或 `server.js` | - |

### Python 包装脚本（start.cjs）

```javascript
const { spawn } = require('child_process');
const proc = spawn('python', ['-m', 'uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', '8000', '--reload'], {
  cwd: __dirname, stdio: 'inherit', windowsHide: true
});
proc.on('close', (code) => process.exit(code));
```

## 命令文件模板

### pm2-all.md（启动全部 + 监控）

```bash
cd "{PROJECT_ROOT}" && pm2 start ecosystem.config.cjs && start wt.exe -d "{PROJECT_ROOT}" pwsh -NoExit -c "pm2 monit"
```

### pm2-all-stop.md（停止全部）

```bash
cd "{PROJECT_ROOT}" && pm2 stop all
```

### pm2-all-restart.md（重启全部）

```bash
cd "{PROJECT_ROOT}" && pm2 restart all
```

### pm2-{port}.md（启动单个 + 日志）

```bash
cd "{PROJECT_ROOT}" && pm2 start ecosystem.config.cjs --only {name} && start wt.exe -d "{PROJECT_ROOT}" pwsh -NoExit -c "pm2 logs {name}"
```

### pm2-{port}-stop.md（停止单个）

```bash
cd "{PROJECT_ROOT}" && pm2 stop {name}
```

### pm2-{port}-restart.md（重启单个）

```bash
cd "{PROJECT_ROOT}" && pm2 restart {name}
```

### pm2-logs.md（查看所有日志）

```bash
cd "{PROJECT_ROOT}" && pm2 logs
```

### pm2-status.md（查看状态）

```bash
cd "{PROJECT_ROOT}" && pm2 status
```

## 关键规则

1. **配置文件**：使用 `ecosystem.config.cjs`（不是 .js）
2. **Node.js**：直接指定 bin 路径 + 解释器
3. **Python**：使用 Node.js 包装脚本 + `windowsHide: true`
4. **打开新窗口**：`start wt.exe -d "{path}" pwsh -NoExit -c "command"`
5. **最小化内容**：每个命令文件只有 1-2 行描述 + bash 代码块
6. **直接执行**：无需 AI 解析，直接运行 bash 命令

## 初始化后操作

### 更新 CLAUDE.md

在项目的 `CLAUDE.md` 中追加 PM2 部分：

```markdown
## PM2 服务

| 端口 | 名称 | 类型 |
|------|------|------|
| {port} | {name} | {type} |

**终端命令：**
pm2 start ecosystem.config.cjs   # 首次启动
pm2 start all                    # 之后启动
pm2 stop all / pm2 restart all
pm2 start {name} / pm2 stop {name}
pm2 logs / pm2 status / pm2 monit
pm2 save                         # 保存进程列表
pm2 resurrect                    # 恢复已保存的列表
```

### 显示完成摘要

```
## PM2 初始化完成

**服务：**

| 端口 | 名称 | 类型 |
|------|------|------|
| {port} | {name} | {type} |

**Claude 命令：** /pm2-all, /pm2-all-stop, /pm2-{port}, /pm2-{port}-stop, /pm2-logs, /pm2-status

**终端命令：**
## 首次启动（使用配置文件）
pm2 start ecosystem.config.cjs && pm2 save

## 之后启动（简化命令）
pm2 start all          # 启动全部
pm2 stop all           # 停止全部
pm2 restart all        # 重启全部
pm2 start {name}       # 启动单个
pm2 stop {name}        # 停止单个
pm2 logs               # 查看日志
pm2 monit              # 监控面板
pm2 resurrect          # 恢复已保存的进程

**提示：** 首次启动后运行 `pm2 save`，即可使用简化命令。
```

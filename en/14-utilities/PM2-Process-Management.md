> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# PM2 Process Management

## Overview

Auto-analyze a project's service structure and generate PM2 configuration files plus management commands, enabling unified multi-service orchestration in development environments.

## Workflow

1. Check PM2 installation (install via `npm install -g pm2` if missing)
2. Scan project to identify services (frontend/backend/database)
3. Generate config files and individual command files

## Service Detection

| Type | Detection | Default Port |
|------|-----------|--------------|
| Vite | vite.config.* | 5173 |
| Next.js | next.config.* | 3000 |
| Nuxt | nuxt.config.* | 3000 |
| CRA | react-scripts in package.json | 3000 |
| Express/Node | server/backend/api directory + package.json | 3000 |
| FastAPI/Flask | requirements.txt / pyproject.toml | 8000 |
| Go | go.mod / main.go | 8080 |

**Port Detection Priority:** User specified > .env > config file > script args > default port

## Generated File Structure

```
project/
├── ecosystem.config.cjs              # PM2 config (must be .cjs)
├── {backend}/start.cjs               # Python wrapper (if applicable)
└── .claude/
    ├── commands/
    │   ├── pm2-all.md                # Start all + monitor
    │   ├── pm2-all-stop.md           # Stop all
    │   ├── pm2-all-restart.md        # Restart all
    │   ├── pm2-{port}.md             # Start single + logs
    │   ├── pm2-{port}-stop.md        # Stop single
    │   ├── pm2-{port}-restart.md     # Restart single
    │   ├── pm2-logs.md               # View all logs
    │   └── pm2-status.md             # View status
    └── scripts/
        ├── pm2-logs-{port}.ps1       # Single service logs
        └── pm2-monit.ps1             # PM2 monitor
```

## Configuration (ecosystem.config.cjs)

```javascript
module.exports = {
  apps: [
    // Node.js (Vite/Next/Nuxt)
    {
      name: 'project-3000',
      cwd: './packages/web',
      script: 'node_modules/vite/bin/vite.js',
      args: '--port 3000',
      interpreter: 'C:/Program Files/nodejs/node.exe',
      env: { NODE_ENV: 'development' }
    },
    // Python (via Node.js wrapper)
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

**Framework script paths:**

| Framework | script | args |
|-----------|--------|------|
| Vite | `node_modules/vite/bin/vite.js` | `--port {port}` |
| Next.js | `node_modules/next/dist/bin/next` | `dev -p {port}` |
| Nuxt | `node_modules/nuxt/bin/nuxt.mjs` | `dev --port {port}` |
| Express | `src/index.js` or `server.js` | -- |

## Key Rules

1. Config file must be `ecosystem.config.cjs` (not `.js`)
2. Node.js: specify bin path directly + interpreter
3. Python: use Node.js wrapper script + `windowsHide: true`
4. New windows: `start wt.exe -d "{path}" pwsh -NoExit -c "command"`
5. Minimal content: each command file has only 1-2 lines description + bash block
6. Direct execution: no AI parsing needed, just run the bash command

## Essential Terminal Commands

```bash
pm2 start ecosystem.config.cjs   # First time
pm2 start all                    # After first time
pm2 stop all / pm2 restart all
pm2 start {name} / pm2 stop {name}
pm2 logs / pm2 status / pm2 monit
pm2 save                         # Save process list
pm2 resurrect                    # Restore saved list
```

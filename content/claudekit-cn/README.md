# ClaudeKit Skills 中文翻译版

> 原始仓库：[mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills)
> 作者：mrgoonie
> 整理：DL Skills 项目

## 概述

一套完整的 Claude Code 技能集合，涵盖开发方法论、前后端开发、AI/Agent、DevOps、设计、工具效率和文档处理等 8 大类别 33 个技能文件。内容经过翻译整理，保留英文技术术语，代码注释中文化。

## 目录

### A. 开发方法论（核心纪律）

| 文件 | 核心内容 |
|------|----------|
| [01-代码评审](A-开发方法论/01-代码评审.md) | 接收评审、请求评审、验证门控 |
| [02-系统化调试](A-开发方法论/02-系统化调试.md) | 四阶段调试 + 4个子技巧附录（根因追踪、纵深防御、完成前验证） |
| [03-创意问题解决](A-开发方法论/03-创意问题解决.md) | 问题解决 + 6个子技巧附录（碰撞区思维、反转练习、元模式识别等） |
| [04-序列化思维](A-开发方法论/04-序列化思维.md) | MCP 序列化思维工具，支持修订和分支 |
| [05-Web测试](A-开发方法论/05-Web测试.md) | 测试金字塔 70-20-10（单元/集成/E2E/负载/安全/可访问性） |

### B. 前端开发

| 文件 | 核心内容 |
|------|----------|
| [01-前端设计](B-前端开发/01-前端设计.md) | 创意设计 + Anime.js v4 完整参考 |
| [02-前端开发](B-前端开发/02-前端开发.md) | React 综合指南（Suspense、TanStack、MUI v7、TypeScript） |
| [03-Three.js-3D开发](B-前端开发/03-Three.js-3D开发.md) | Three.js 3D 从基础到高级渲染和性能优化 |
| [04-UI样式](B-前端开发/04-UI样式.md) | shadcn/ui + Tailwind CSS + Canvas 视觉设计 |
| [05-Web框架](B-前端开发/05-Web框架.md) | Next.js App Router + Turborepo + RemixIcon |

### C. 后端开发

| 文件 | 核心内容 |
|------|----------|
| [01-后端开发](C-后端开发/01-后端开发.md) | API 设计、安全、性能、测试决策矩阵 |
| [02-Better-Auth认证](C-后端开发/02-Better-Auth认证.md) | TypeScript 认证框架，11 大功能特性 |
| [03-数据库](C-后端开发/03-数据库.md) | MongoDB vs PostgreSQL 选型与操作对比 |
| [04-支付集成](C-后端开发/04-支付集成.md) | 5 大支付平台（SePay、Polar、Stripe、Paddle、Creem.io） |
| [05-Shopify开发](C-后端开发/05-Shopify开发.md) | Shopify 应用、扩展、主题、API 集成 |

### D. DevOps 与部署

| 文件 | 核心内容 |
|------|----------|
| [01-DevOps](D-DevOps与部署/01-DevOps.md) | 9 大平台场景（Cloudflare、Docker、GCP、K8s 快速上手） |

### E. AI 与 Agent

| 文件 | 核心内容 |
|------|----------|
| [01-多模态AI](E-AI与Agent/01-多模态AI.md) | Google Gemini 多模态 API |
| [02-上下文工程](E-AI与Agent/02-上下文工程.md) | 上下文四桶策略（写入/选择/压缩/隔离） |
| [03-Google-ADK](E-AI与Agent/03-Google-ADK.md) | Google Agent Development Kit Python |
| [04-MCP构建](E-AI与Agent/04-MCP构建.md) | MCP 服务器开发四阶段流程 |

### F. 设计与内容

| 文件 | 核心内容 |
|------|----------|
| [01-美学设计](F-设计与内容/01-美学设计.md) | BEAUTIFUL/RIGHT/SATISFYING/PEAK 四阶段设计 |
| [02-Mermaid图表](F-设计与内容/02-Mermaid图表.md) | Mermaid.js v11，24+ 种图表类型 |

### G. 工具与效率

| 文件 | 核心内容 |
|------|----------|
| [01-Chrome-DevTools](G-工具与效率/01-Chrome-DevTools.md) | Puppeteer 浏览器自动化 |
| [02-Claude-Code指南](G-工具与效率/02-Claude-Code指南.md) | Claude Code 专家指南（命令/技能/MCP/Hooks） |
| [03-文档搜索](G-工具与效率/03-文档搜索.md) | llms.txt + context7.com 文档发现 |
| [04-MCP管理](G-工具与效率/04-MCP管理.md) | MCP 多服务器编排管理 |
| [05-媒体处理](G-工具与效率/05-媒体处理.md) | FFmpeg + ImageMagick 媒体处理 |
| [06-Repomix](G-工具与效率/06-Repomix.md) | 仓库打包供 AI 分析 |
| [07-技能创建器](G-工具与效率/07-技能创建器.md) | Claude 技能创建与发布 |

### H. 文档处理

| 文件 | 核心内容 |
|------|----------|
| [01-Word文档](H-文档处理/01-Word文档.md) | DOCX 创建/编辑（docx-js、OOXML） |
| [02-PDF处理](H-文档处理/02-PDF处理.md) | PDF 操作（pypdf、pdfplumber、reportlab） |
| [03-PPT演示](H-文档处理/03-PPT演示.md) | PPTX 创建/编辑 |
| [04-Excel表格](H-文档处理/04-Excel表格.md) | Excel 处理（openpyxl、pandas） |

---

## 统计

- **原始仓库**：33 个技能目录，100+ markdown 文件
- **整理文件**：33 个中文文件，8 大类别
- **覆盖率**：100%（所有技能和子技巧合并整理）

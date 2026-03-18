> 来源：[mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | 分类：DevOps与部署

# DevOps 技能

跨 Cloudflare、Docker、Google Cloud 和 Kubernetes 部署与管理云基础设施。

## 适用场景

- 将无服务器（Serverless）应用部署到 Cloudflare Workers/Pages
- 使用 Docker、Docker Compose 容器化应用
- 通过 gcloud CLI 管理 GCP（Cloud Run、GKE、Cloud SQL）
- Kubernetes 集群管理（kubectl、Helm）
- GitOps 工作流（Argo CD、Flux）
- CI/CD 流水线、多区域部署
- 安全审计、RBAC（基于角色的访问控制）、网络策略（Network Policies）

## 平台选型

| 需求 | 推荐选择 |
|------|----------|
| 全球亚 50ms 延迟 | Cloudflare Workers |
| 大文件存储（零出口流量费） | Cloudflare R2 |
| SQL 数据库（全球读取） | Cloudflare D1 |
| 容器化工作负载 | Docker + Cloud Run/GKE |
| 企业级 Kubernetes | GKE |
| 托管关系型数据库 | Cloud SQL |
| 静态站点 + API | Cloudflare Pages |
| 容器编排 | Kubernetes |
| K8s 包管理 | Helm |

## 快速开始

```bash
# Cloudflare Worker
wrangler init my-worker && cd my-worker && wrangler deploy

# Docker
docker build -t myapp . && docker run -p 3000:3000 myapp

# GCP Cloud Run
gcloud run deploy my-service --image gcr.io/project/image --region us-central1

# Kubernetes
kubectl apply -f manifests/ && kubectl get pods
```

## 参考文档导航

### Cloudflare 平台
- `cloudflare-platform.md` — 边缘计算（Edge Computing）概览
- `cloudflare-workers-basics.md` — 处理器类型、模式
- `cloudflare-workers-advanced.md` — 性能、优化
- `cloudflare-workers-apis.md` — 运行时 API、绑定（Bindings）
- `cloudflare-r2-storage.md` — 对象存储、S3 兼容
- `cloudflare-d1-kv.md` — D1 SQLite、KV 键值存储
- `browser-rendering.md` — Puppeteer 自动化

### Docker
- `docker-basics.md` — Dockerfile、镜像（Images）、容器（Containers）
- `docker-compose.md` — 多容器应用编排

### Google Cloud
- `gcloud-platform.md` — gcloud CLI、认证
- `gcloud-services.md` — Compute Engine、GKE、Cloud Run

### Kubernetes
- `kubernetes-basics.md` — 核心概念、架构、工作负载（Workloads）
- `kubernetes-kubectl.md` — 常用命令、调试工作流
- `kubernetes-helm.md` / `kubernetes-helm-advanced.md` — Helm Charts、模板
- `kubernetes-security.md` / `kubernetes-security-advanced.md` — RBAC、Secrets 管理
- `kubernetes-workflows.md` / `kubernetes-workflows-advanced.md` — GitOps、CI/CD
- `kubernetes-troubleshooting.md` / `kubernetes-troubleshooting-advanced.md` — 故障排查

### 脚本
- `scripts/cloudflare-deploy.py` — 自动化 Worker 部署
- `scripts/docker-optimize.py` — Dockerfile 分析优化

## 最佳实践

**安全：** 非 root 容器运行、RBAC 权限控制、密钥存储在环境变量中、镜像漏洞扫描
**性能：** 多阶段构建（Multi-stage Builds）、边缘缓存、资源限制（Resource Limits）
**成本：** R2 用于大出口流量场景、启用缓存、合理配置资源规格
**开发：** Docker Compose 本地开发、wrangler dev 本地调试、基础设施即代码（IaC）版本管理

## 资源

- Cloudflare：https://developers.cloudflare.com
- Docker：https://docs.docker.com
- GCP：https://cloud.google.com/docs
- Kubernetes：https://kubernetes.io/docs
- Helm：https://helm.sh/docs

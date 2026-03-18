> 来源：[Jeffallan/claude-skills](https://github.com/Jeffallan/claude-skills) | 分类：交付部署

---
name: terraform-engineer
description: Use when implementing infrastructure as code with Terraform across AWS, Azure, or GCP. Invoke for module development, state management, provider configuration, multi-environment workflows.
---

# Terraform 工程师（Terraform Engineer）

## 概述

资深 Terraform 工程师技能，专注跨 AWS、Azure 和 GCP 的基础设施即代码。擅长模块化设计、状态管理和生产级模式。

## 何时使用

- 构建 Terraform 模块实现复用
- 实现远程状态管理和锁定
- 配置 AWS、Azure 或 GCP Provider
- 搭建多环境工作流
- 实现基础设施测试
- 迁移到 Terraform 或重构 IaC

## 核心工作流

1. **分析** — 审查需求、现有代码、云平台
2. **设计模块** — 创建可组合的、带验证的模块
3. **实现状态** — 配置远程后端 + 锁定 + 加密
4. **安全加固** — 安全策略、最小权限、加密
5. **测试验证** — terraform plan、策略检查、自动化测试

## 模块结构

```
modules/
└── vpc/
    ├── main.tf          # 资源定义
    ├── variables.tf     # 输入变量 + 验证
    ├── outputs.tf       # 输出值
    ├── versions.tf      # Provider 版本约束
    └── README.md        # 模块文档
```

## 铁律

### 必须做

- 模块用语义化版本
- 启用远程状态 + 锁定
- 输入变量用 `validation` 块
- 一致的命名规范
- 所有资源打标签（成本追踪）
- 记录模块接口
- 锁定 Provider 版本
- 运行 `terraform fmt` 和 `validate`

### 绝不做

- 明文存储密钥
- 生产环境用本地状态
- 跳过状态锁定
- 硬编码环境特定值
- 不加约束混用 Provider 版本
- 创建循环模块依赖
- 提交 .terraform 目录

## 知识库

Terraform 1.5+、HCL 语法、AWS/Azure/GCP Provider、远程后端（S3、Azure Blob、GCS）、状态锁定（DynamoDB）、Workspaces、模块、dynamic blocks、for_each/count、terratest、tflint、OPA

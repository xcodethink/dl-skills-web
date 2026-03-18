> 来源：[mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | 分类：后端开发

# Shopify 开发技能

在 Shopify 平台上构建应用、扩展、主题和 API 集成的综合指南。

## 平台概览

**核心组件：**
- **Shopify CLI** — 开发工作流工具
- **GraphQL Admin API** — 主要的数据操作 API（推荐使用）
- **REST Admin API** — 旧版 API（维护模式）
- **Polaris UI** — 统一界面的设计系统
- **Liquid** — 主题模板语言

**扩展点（Extension Points）：**
- Checkout UI — 自定义结账体验
- Admin UI — 扩展管理后台面板
- POS UI — 销售终端（Point of Sale）自定义
- Customer Account — 购后页面
- Theme App Extensions — 嵌入主题的功能扩展

## 快速开始

### 前置条件

```bash
# 安装 Shopify CLI
npm install -g @shopify/cli@latest

# 验证安装
shopify version
```

### 创建新应用

```bash
# 初始化应用
shopify app init

# 启动开发服务器
shopify app dev

# 生成扩展
shopify app generate extension --type checkout_ui_extension

# 部署
shopify app deploy
```

### 主题开发

```bash
# 初始化主题
shopify theme init

# 启动本地预览
shopify theme dev

# 从商店拉取
shopify theme pull --live

# 推送到商店
shopify theme push --development
```

## 开发工作流

### 1. 应用开发

**初始化：**
```bash
shopify app init
cd my-app
```

**配置访问权限范围**（`shopify.app.toml`）：
```toml
[access_scopes]
scopes = "read_products,write_products,read_orders"
```

**启动开发：**
```bash
shopify app dev  # 启动本地服务器并创建隧道
```

**添加扩展：**
```bash
shopify app generate extension --type checkout_ui_extension
```

**部署：**
```bash
shopify app deploy  # 构建并上传到 Shopify
```

### 2. 扩展开发

**可用类型：**
- Checkout UI — `checkout_ui_extension`（结账界面扩展）
- Admin Action — `admin_action`（管理后台操作）
- Admin Block — `admin_block`（管理后台区块）
- POS UI — `pos_ui_extension`（POS 界面扩展）
- Function — `function`（折扣、支付、配送、验证函数）

**开发流程：**
```bash
shopify app generate extension
# 选择类型，进行配置
shopify app dev  # 本地测试
shopify app deploy  # 发布
```

### 3. 主题开发

**初始化：**
```bash
shopify theme init
# 选择 Dawn（参考主题）或从零开始
```

**本地开发：**
```bash
shopify theme dev
# 在 localhost:9292 预览
# 自动同步到开发主题
```

**部署：**
```bash
shopify theme push --development  # 推送到开发主题
shopify theme publish --theme=123  # 设为正式主题
```

## 构建类型选择指南

### 应该构建应用（App）的场景：
- 集成外部服务
- 为多个商店添加功能
- 构建面向商家的管理工具
- 通过编程方式管理商店数据
- 实现复杂业务逻辑
- 需要对功能收费

### 应该构建扩展（Extension）的场景：
- 自定义结账流程
- 在管理后台页面添加字段/功能
- 为零售场景创建 POS 操作
- 实现折扣/支付/物流规则
- 扩展客户账户页面

### 应该构建主题（Theme）的场景：
- 创建自定义店面设计
- 打造独特的购物体验
- 自定义产品/集合页面
- 实现品牌特定的布局
- 修改首页/内容页面

### 组合方案：
**应用 + 主题扩展：**
- 应用处理后端逻辑和数据
- 主题扩展提供店面 UI
- 示例：产品评论、愿望清单、尺码指南

## 核心模式

### GraphQL 产品查询

```graphql
query GetProducts($first: Int!) {
  products(first: $first) {
    edges {
      node {
        id
        title
        handle
        variants(first: 5) {
          edges {
            node {
              id
              price
              inventoryQuantity
            }
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### 结账扩展（React）

```javascript
import { reactExtension, BlockStack, TextField, Checkbox } from '@shopify/ui-extensions-react/checkout';

export default reactExtension('purchase.checkout.block.render', () => <Extension />);

function Extension() {
  const [message, setMessage] = useState('');

  return (
    <BlockStack>
      <TextField label="礼品留言" value={message} onChange={setMessage} />
    </BlockStack>
  );
}
```

### Liquid 产品展示

```liquid
{% for product in collection.products %}
  <div class="product-card">
    <img src="{{ product.featured_image | img_url: 'medium' }}" alt="{{ product.title }}">
    <h3>{{ product.title }}</h3>
    <p>{{ product.price | money }}</p>
    <a href="{{ product.url }}">查看详情</a>
  </div>
{% endfor %}
```

## 最佳实践

**API 使用：**
- 新开发优先使用 GraphQL 而非 REST
- 仅请求需要的字段以降低成本
- 大数据集实现分页（Pagination）
- 批量处理使用 Bulk Operations
- 遵守速率限制（GraphQL 基于成本计算）

**安全：**
- 将 API 凭据存储在环境变量中
- 验证 Webhook 签名
- 公开应用使用 OAuth
- 请求最小权限范围
- 嵌入式应用实现 Session Token

**性能：**
- 适当缓存 API 响应
- 优化主题中的图片
- 减少 Liquid 逻辑复杂度
- 扩展使用异步加载
- 监控 GraphQL 查询成本

**测试：**
- 使用开发商店（Development Store）进行测试
- 跨不同商店套餐测试
- 验证移动端响应式
- 检查无障碍性（键盘操作、屏幕阅读器）
- 确保 GDPR 合规

## 参考文档

详细的进阶指南：

- **[应用开发](references/app-development.md)** — OAuth、API、Webhook、计费
- **[扩展](references/extensions.md)** — Checkout、Admin、POS、Functions
- **[主题](references/themes.md)** — Liquid、Sections、部署

## 脚本

**[shopify_init.py](scripts/shopify_init.py)** — 交互式初始化 Shopify 项目
```bash
python scripts/shopify_init.py
```

## 故障排除

**速率限制错误（Rate Limit Errors）：**
- 监控 `X-Shopify-Shop-Api-Call-Limit` 响应头
- 实现指数退避（Exponential Backoff）
- 大数据集使用 Bulk Operations

**认证失败（Authentication Failures）：**
- 验证 Access Token 是否有效
- 检查是否已授予所需权限范围
- 确保 OAuth 流程已完成

**扩展不显示（Extension Not Appearing）：**
- 验证扩展目标（Extension Target）是否正确
- 检查扩展是否已发布
- 确保应用已安装到商店

**Webhook 未收到（Webhook Not Receiving）：**
- 验证 Webhook URL 是否可访问
- 检查签名验证逻辑
- 在 Partner Dashboard 中查看日志

## 资源

**官方文档：**
- Shopify 文档：https://shopify.dev/docs
- GraphQL API：https://shopify.dev/docs/api/admin-graphql
- Shopify CLI：https://shopify.dev/docs/api/shopify-cli
- Polaris：https://polaris.shopify.com

**工具：**
- GraphiQL Explorer（管理后台 -> 设置 -> 应用 -> 开发应用）
- Partner Dashboard（应用管理）
- 开发商店（免费测试）

**API 版本管理：**
- 每季度发布（YYYY-MM 格式）
- 当前版本：2025-01
- 每个版本支持 12 个月
- 更新版本前务必测试

---

**注意：** 此技能涵盖截至 2025 年 1 月的 Shopify 平台信息。请参阅官方文档获取最新更新。

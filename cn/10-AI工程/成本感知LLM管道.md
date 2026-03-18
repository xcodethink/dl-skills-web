> 来源：[everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# 成本感知 LLM 管道（Cost-Aware LLM Pipeline）

## 概述

在维持输出质量的前提下控制 LLM API 成本的模式集合。将模型路由（Model Routing）、预算追踪（Budget Tracking）、重试逻辑（Retry Logic）和提示缓存（Prompt Caching）组合成一个可组合的管道。

## 何时使用

- 构建调用 LLM API（Claude、GPT 等）的应用
- 处理复杂度各异的批量任务
- 需要控制 API 支出在预算内
- 在不牺牲复杂任务质量的前提下优化成本

## 核心概念

### 1. 按任务复杂度路由模型

自动为简单任务选择更便宜的模型，将昂贵的模型留给复杂任务。

```python
MODEL_SONNET = "claude-sonnet-4-6"
MODEL_HAIKU = "claude-haiku-4-5-20251001"

_SONNET_TEXT_THRESHOLD = 10_000  # 字符数
_SONNET_ITEM_THRESHOLD = 30     # 条目数

def select_model(
    text_length: int,
    item_count: int,
    force_model: str | None = None,
) -> str:
    """根据任务复杂度选择模型。"""
    if force_model is not None:
        return force_model
    if text_length >= _SONNET_TEXT_THRESHOLD or item_count >= _SONNET_ITEM_THRESHOLD:
        return MODEL_SONNET  # 复杂任务
    return MODEL_HAIKU  # 简单任务（便宜 3-4 倍）
```

### 2. 不可变成本追踪

使用冻结数据类（Frozen Dataclass）追踪累计支出。每次 API 调用返回一个新的追踪器 — 永不修改状态。

```python
from dataclasses import dataclass

@dataclass(frozen=True, slots=True)
class CostRecord:
    model: str
    input_tokens: int
    output_tokens: int
    cost_usd: float

@dataclass(frozen=True, slots=True)
class CostTracker:
    budget_limit: float = 1.00
    records: tuple[CostRecord, ...] = ()

    def add(self, record: CostRecord) -> "CostTracker":
        """返回添加了记录的新追踪器（永不修改自身）。"""
        return CostTracker(
            budget_limit=self.budget_limit,
            records=(*self.records, record),
        )

    @property
    def total_cost(self) -> float:
        return sum(r.cost_usd for r in self.records)

    @property
    def over_budget(self) -> bool:
        return self.total_cost > self.budget_limit
```

### 3. 精确重试逻辑

仅对瞬时错误（Transient Errors）重试。对认证或错误请求立即失败。

```python
from anthropic import (
    APIConnectionError,
    InternalServerError,
    RateLimitError,
)

_RETRYABLE_ERRORS = (APIConnectionError, RateLimitError, InternalServerError)
_MAX_RETRIES = 3

def call_with_retry(func, *, max_retries: int = _MAX_RETRIES):
    """仅对瞬时错误重试，其他错误立即失败。"""
    for attempt in range(max_retries):
        try:
            return func()
        except _RETRYABLE_ERRORS:
            if attempt == max_retries - 1:
                raise
            time.sleep(2 ** attempt)  # 指数退避（Exponential Backoff）
    # AuthenticationError、BadRequestError 等 → 立即抛出
```

### 4. 提示缓存（Prompt Caching）

缓存长系统提示（System Prompt），避免每次请求都重新发送。

```python
messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": system_prompt,
                "cache_control": {"type": "ephemeral"},  # 缓存此内容
            },
            {
                "type": "text",
                "text": user_input,  # 可变部分
            },
        ],
    }
]
```

## 组合使用

在单个管道函数中组合所有四种技术：

```python
def process(text: str, config: Config, tracker: CostTracker) -> tuple[Result, CostTracker]:
    # 1. 路由模型
    model = select_model(len(text), estimated_items, config.force_model)

    # 2. 检查预算
    if tracker.over_budget:
        raise BudgetExceededError(tracker.total_cost, tracker.budget_limit)

    # 3. 带重试和缓存的调用
    response = call_with_retry(lambda: client.messages.create(
        model=model,
        messages=build_cached_messages(system_prompt, text),
    ))

    # 4. 追踪成本（不可变）
    record = CostRecord(model=model, input_tokens=..., output_tokens=..., cost_usd=...)
    tracker = tracker.add(record)

    return parse_result(response), tracker
```

## 价格参考（2025-2026）

| 模型 | 输入（$/1M tokens） | 输出（$/1M tokens） | 相对成本 |
|------|---------------------|----------------------|----------|
| Haiku 4.5 | $0.80 | $4.00 | 1x |
| Sonnet 4.6 | $3.00 | $15.00 | ~4x |
| Opus 4.5 | $15.00 | $75.00 | ~19x |

## 最佳实践

- **从最便宜的模型开始**，仅在复杂度阈值满足时才路由到昂贵模型
- **在处理批量任务前设置明确的预算限制** — 宁可提前失败也不要超支
- **记录模型选择决策**，以便根据真实数据调整阈值
- **对超过 1024 Token 的系统提示使用提示缓存** — 节省成本和延迟
- **永远不要对认证或验证错误重试** — 仅对瞬时故障（网络、限流、服务器错误）重试

## 应避免的反模式

- 不论复杂度一律使用最贵模型处理所有请求
- 对所有错误都重试（在永久性故障上浪费预算）
- 修改成本追踪状态（使调试和审计变得困难）
- 在代码库中硬编码模型名称（应使用常量或配置）
- 忽略对重复系统提示的提示缓存

## 适用场景

- 任何调用 Claude、OpenAI 或类似 LLM API 的应用
- 成本快速累积的批量处理管道
- 需要智能路由的多模型架构
- 需要预算防护的生产系统

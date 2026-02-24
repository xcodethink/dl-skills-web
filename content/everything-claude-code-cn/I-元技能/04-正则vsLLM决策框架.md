> 来源：[everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# 正则（Regex）vs LLM 结构化文本解析决策框架

## 概述

一个用于解析结构化文本（测验、表单、发票、文档）的实用决策框架。核心洞察：正则表达式（Regex）能够廉价且确定性地处理 95-98% 的情况，将昂贵的 LLM 调用留给剩余的边缘案例。

## 何时使用

- 解析具有重复模式的结构化文本（题目、表单、表格）
- 在正则和 LLM 之间做文本提取技术选型
- 构建结合两种方法的混合管道（Hybrid Pipeline）
- 优化文本处理中的成本/准确率权衡

## 决策框架

```
文本格式是否一致且重复？
├── 是（>90% 遵循同一模式）→ 从正则开始
│   ├── 正则处理 95%+ → 完成，不需要 LLM
│   └── 正则处理 <95% → 仅对边缘案例使用 LLM
└── 否（自由格式、高度可变）→ 直接使用 LLM
```

## 架构模式

```
源文本
    │
    ▼
[正则解析器] ─── 提取结构（95-98% 准确率）
    │
    ▼
[文本清理器] ─── 移除噪声（标记、页码、伪影）
    │
    ▼
[置信度评分器] ─── 标记低置信度提取
    │
    ├── 高置信度（≥0.95）→ 直接输出
    │
    └── 低置信度（<0.95）→ [LLM 验证器] → 输出
```

## 实现

### 1. 正则解析器（处理大多数情况）

```python
import re
from dataclasses import dataclass

@dataclass(frozen=True)
class ParsedItem:
    id: str
    text: str
    choices: tuple[str, ...]
    answer: str
    confidence: float = 1.0

def parse_structured_text(content: str) -> list[ParsedItem]:
    """使用正则模式解析结构化文本。"""
    pattern = re.compile(
        r"(?P<id>\d+)\.\s*(?P<text>.+?)\n"
        r"(?P<choices>(?:[A-D]\..+?\n)+)"
        r"Answer:\s*(?P<answer>[A-D])",
        re.MULTILINE | re.DOTALL,
    )
    items = []
    for match in pattern.finditer(content):
        choices = tuple(
            c.strip() for c in re.findall(r"[A-D]\.\s*(.+)", match.group("choices"))
        )
        items.append(ParsedItem(
            id=match.group("id"),
            text=match.group("text").strip(),
            choices=choices,
            answer=match.group("answer"),
        ))
    return items
```

### 2. 置信度评分（Confidence Scoring）

标记可能需要 LLM 审查的条目：

```python
@dataclass(frozen=True)
class ConfidenceFlag:
    item_id: str
    score: float
    reasons: tuple[str, ...]

def score_confidence(item: ParsedItem) -> ConfidenceFlag:
    """评估提取置信度并标记问题。"""
    reasons = []
    score = 1.0

    if len(item.choices) < 3:
        reasons.append("few_choices")      # 选项过少
        score -= 0.3

    if not item.answer:
        reasons.append("missing_answer")   # 缺少答案
        score -= 0.5

    if len(item.text) < 10:
        reasons.append("short_text")       # 文本过短
        score -= 0.2

    return ConfidenceFlag(
        item_id=item.id,
        score=max(0.0, score),
        reasons=tuple(reasons),
    )

def identify_low_confidence(
    items: list[ParsedItem],
    threshold: float = 0.95,
) -> list[ConfidenceFlag]:
    """返回低于置信度阈值的条目。"""
    flags = [score_confidence(item) for item in items]
    return [f for f in flags if f.score < threshold]
```

### 3. LLM 验证器（仅处理边缘案例）

```python
def validate_with_llm(
    item: ParsedItem,
    original_text: str,
    client,
) -> ParsedItem:
    """使用 LLM 修复低置信度的提取结果。"""
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",  # 用最便宜的模型做验证
        max_tokens=500,
        messages=[{
            "role": "user",
            "content": (
                f"从以下文本中提取题目、选项和答案。\n\n"
                f"文本：{original_text}\n\n"
                f"当前提取结果：{item}\n\n"
                f"如需纠正请返回 JSON，如准确则返回 'CORRECT'。"
            ),
        }],
    )
    # 解析 LLM 响应并返回纠正后的条目...
    return corrected_item
```

### 4. 混合管道（Hybrid Pipeline）

```python
def process_document(
    content: str,
    *,
    llm_client=None,
    confidence_threshold: float = 0.95,
) -> list[ParsedItem]:
    """完整管道：正则 -> 置信度检查 -> LLM 处理边缘案例。"""
    # 步骤 1：正则提取（处理 95-98%）
    items = parse_structured_text(content)

    # 步骤 2：置信度评分
    low_confidence = identify_low_confidence(items, confidence_threshold)

    if not low_confidence or llm_client is None:
        return items

    # 步骤 3：LLM 验证（仅针对标记的条目）
    low_conf_ids = {f.item_id for f in low_confidence}
    result = []
    for item in items:
        if item.id in low_conf_ids:
            result.append(validate_with_llm(item, content, llm_client))
        else:
            result.append(item)

    return result
```

## 真实场景指标

来自生产环境的测验解析管道（410 个条目）：

| 指标 | 值 |
|------|------|
| 正则成功率 | 98.0% |
| 低置信度条目 | 8（2.0%） |
| 所需 LLM 调用 | ~5 次 |
| 相比全 LLM 方案的成本节省 | ~95% |
| 测试覆盖率 | 93% |

## 最佳实践

- **从正则开始** — 即使不完美的正则也能提供一个可改进的基线
- **使用置信度评分**以编程方式识别哪些内容需要 LLM 辅助
- **使用最便宜的 LLM** 做验证（Haiku 级别的模型即可胜任）
- **永不修改**已解析的条目 — 在清理/验证步骤中返回新实例
- **TDD 非常适合解析器** — 先为已知模式编写测试，再处理边缘案例
- **记录指标**（正则成功率、LLM 调用次数）以追踪管道健康状况

## 应避免的反模式

- 当正则能处理 95%+ 的情况时，将所有文本发送给 LLM（昂贵且缓慢）
- 对自由格式、高度可变的文本使用正则（LLM 在这方面更好）
- 跳过置信度评分，期望正则"就是能用"
- 在清理/验证步骤中修改已解析对象
- 不测试边缘案例（格式错误的输入、缺失字段、编码问题）

## 适用场景

- 测验/考试题目解析
- 表单数据提取
- 发票/收据处理
- 文档结构解析（标题、章节、表格）
- 任何具有重复模式且关注成本的结构化文本处理

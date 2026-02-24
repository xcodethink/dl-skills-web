> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Cost-Aware LLM Pipeline

## Overview

Composable patterns for controlling LLM API costs while maintaining quality. Combines model routing, budget tracking, retry logic, and prompt caching into a single pipeline.

## Core Techniques

### 1. Model Routing by Task Complexity

Route simple tasks to cheap models, reserve expensive models for complex ones.

```python
MODEL_SONNET = "claude-sonnet-4-6"
MODEL_HAIKU = "claude-haiku-4-5-20251001"

_SONNET_TEXT_THRESHOLD = 10_000  # chars
_SONNET_ITEM_THRESHOLD = 30     # items

def select_model(text_length: int, item_count: int, force_model: str | None = None) -> str:
    if force_model is not None:
        return force_model
    if text_length >= _SONNET_TEXT_THRESHOLD or item_count >= _SONNET_ITEM_THRESHOLD:
        return MODEL_SONNET
    return MODEL_HAIKU  # 3-4x cheaper
```

### 2. Immutable Cost Tracking

Track cumulative spend with frozen dataclasses. Each API call returns a new tracker — never mutates state.

```python
@dataclass(frozen=True, slots=True)
class CostTracker:
    budget_limit: float = 1.00
    records: tuple[CostRecord, ...] = ()

    def add(self, record: CostRecord) -> "CostTracker":
        return CostTracker(budget_limit=self.budget_limit, records=(*self.records, record))

    @property
    def over_budget(self) -> bool:
        return sum(r.cost_usd for r in self.records) > self.budget_limit
```

### 3. Narrow Retry Logic

Retry only on transient errors. Fail fast on authentication or bad request errors.

```python
_RETRYABLE_ERRORS = (APIConnectionError, RateLimitError, InternalServerError)

def call_with_retry(func, *, max_retries=3):
    for attempt in range(max_retries):
        try:
            return func()
        except _RETRYABLE_ERRORS:
            if attempt == max_retries - 1:
                raise
            time.sleep(2 ** attempt)  # Exponential backoff
```

### 4. Prompt Caching

Cache long system prompts to avoid resending on every request:

```python
{"type": "text", "text": system_prompt, "cache_control": {"type": "ephemeral"}}
```

## Composed Pipeline

```python
def process(text, config, tracker):
    model = select_model(len(text), estimated_items, config.force_model)
    if tracker.over_budget:
        raise BudgetExceededError(...)
    response = call_with_retry(lambda: client.messages.create(
        model=model, messages=build_cached_messages(system_prompt, text)))
    tracker = tracker.add(CostRecord(...))
    return parse_result(response), tracker
```

## Pricing Reference (2025-2026)

| Model | Input ($/1M tokens) | Output ($/1M tokens) | Relative Cost |
|-------|---------------------|----------------------|---------------|
| Haiku 4.5 | $0.80 | $4.00 | 1x |
| Sonnet 4.6 | $3.00 | $15.00 | ~4x |
| Opus 4.5 | $15.00 | $75.00 | ~19x |

## Best Practices

- Start with the cheapest model; upgrade only when complexity thresholds are met
- Set explicit budget limits before batch processing
- Log model selection decisions for threshold tuning
- Use prompt caching for system prompts over 1024 tokens
- Never retry on authentication or validation errors

## Anti-Patterns

- Using the most expensive model for all requests regardless of complexity
- Retrying on all errors (wastes budget on permanent failures)
- Mutating cost tracking state
- Hardcoding model names throughout the codebase
- Ignoring prompt caching for repetitive system prompts

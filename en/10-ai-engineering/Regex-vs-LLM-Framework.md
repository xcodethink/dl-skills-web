> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Regex vs LLM Decision Framework for Structured Text

## Overview

A practical decision framework for parsing structured text. The key insight: regex handles 95-98% of cases cheaply and deterministically. Reserve expensive LLM calls for the remaining edge cases.

## Decision Tree

```
Is the text format consistent and repeating?
├── Yes (>90% follows a pattern) → Start with Regex
│   ├── Regex handles 95%+ → Done, no LLM needed
│   └── Regex handles <95% → Add LLM for edge cases only
└── No (free-form, highly variable) → Use LLM directly
```

## Architecture

```
Source Text → [Regex Parser] → [Confidence Scorer]
                                    │
                    ├── High confidence (≥0.95) → Direct output
                    └── Low confidence (<0.95) → [LLM Validator] → Output
```

## Implementation Pattern

### 1. Regex Parser (handles 95-98%)

```python
def parse_structured_text(content: str) -> list[ParsedItem]:
    pattern = re.compile(
        r"(?P<id>\d+)\.\s*(?P<text>.+?)\n"
        r"(?P<choices>(?:[A-D]\..+?\n)+)"
        r"Answer:\s*(?P<answer>[A-D])",
        re.MULTILINE | re.DOTALL,
    )
    # Extract matches into frozen dataclasses
```

### 2. Confidence Scoring

Flag items that may need LLM review based on heuristics (few choices, missing answers, short text).

### 3. LLM Validator (edge cases only)

Use the cheapest available model (Haiku-class) to fix low-confidence extractions.

### 4. Hybrid Pipeline

```python
def process_document(content, *, llm_client=None, confidence_threshold=0.95):
    items = parse_structured_text(content)         # Step 1: Regex
    low_confidence = identify_low_confidence(items) # Step 2: Score
    # Step 3: LLM only for flagged items
```

## Production Metrics (410 items)

| Metric | Value |
|--------|-------|
| Regex success rate | 98.0% |
| Low confidence items | 8 (2.0%) |
| LLM calls needed | ~5 |
| Cost savings vs all-LLM | ~95% |

## Best Practices

- Start with regex even if imperfect — it provides a baseline to improve
- Use confidence scoring to programmatically identify what needs LLM help
- Use the cheapest LLM for validation (Haiku-class models suffice)
- Never mutate parsed items — return new instances
- TDD works well for parsers — test known patterns first, then edge cases
- Log metrics (regex success rate, LLM call count) for pipeline health

## Anti-Patterns

- Sending all text to an LLM when regex handles 95%+ (expensive and slow)
- Using regex for free-form, highly variable text (LLM is better)
- Skipping confidence scoring
- Mutating parsed objects during validation

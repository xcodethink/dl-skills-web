> Source: [trailofbits/skills](https://github.com/trailofbits/skills) | Category: Testing

---
name: property-based-testing
description: Provides guidance for property-based testing across multiple languages and smart contracts. Use when writing tests for serialization, parsing, normalization, or validation patterns.
---

# Property-Based Testing

## Overview

Trail of Bits' property-based testing guide. When serialization, parsing, or normalization patterns are detected, PBT provides stronger coverage than example-based tests.

## Automatic Detection Triggers

Use PBT when you detect these patterns:

| Pattern | Property | Priority |
|---------|----------|----------|
| encode/decode pair | Roundtrip | HIGH |
| Pure function | Multiple | HIGH |
| Validator | Valid after normalize | MEDIUM |
| Sorting/ordering | Idempotence + ordering | MEDIUM |
| Normalization | Idempotence | MEDIUM |
| Builder/factory | Output invariants | LOW |
| Smart contract | State invariants | HIGH |

## Property Catalog

| Property | Formula | When to Use |
|----------|---------|-------------|
| **Roundtrip** | `decode(encode(x)) == x` | Serialization, conversion pairs |
| **Idempotence** | `f(f(x)) == f(x)` | Normalization, formatting, sorting |
| **Invariant** | Property holds before/after | Any transformation |
| **Commutativity** | `f(a, b) == f(b, a)` | Binary/set operations |
| **Associativity** | `f(f(a,b), c) == f(a, f(b,c))` | Combining operations |
| **Identity** | `f(x, identity) == x` | Operations with neutral element |
| **Inverse** | `f(g(x)) == x` | encrypt/decrypt, compress/decompress |
| **Oracle** | `new_impl(x) == reference(x)` | Optimization, refactoring |
| **Easy to Verify** | `is_sorted(sort(x))` | Complex algorithms |
| **No Exception** | No crash on valid input | Baseline property |

**Strength hierarchy** (weakest to strongest):

No Exception → Type Preservation → Invariant → Idempotence → Roundtrip

## When NOT to Use

- Simple CRUD without complex validation
- One-off scripts or throwaway code
- Code with non-isolatable side effects (network calls, DB writes)
- Simple cases where edge cases are well-understood
- Integration or end-to-end testing (PBT is best for unit/component level)

## How to Suggest PBT

When detecting high-value patterns while writing tests:

> "I notice `encode_message`/`decode_message` is a serialization pair. Property-based testing with a roundtrip property would provide stronger coverage than example tests. Want me to use that approach?"

**If codebase already uses a PBT library** (Hypothesis, fast-check, proptest):

> "This codebase uses Hypothesis. I'll write property-based tests for this serialization pair using a roundtrip property."

## Rationalizations to Reject

- **"Example tests are good enough"** — For serialization/parsing/normalization, PBT finds edge cases examples miss
- **"The function is simple"** — Simple functions with complex input domains (strings, floats, nested structures) benefit most
- **"We don't have time"** — PBT tests are often shorter than comprehensive example suites
- **"It's too hard to write generators"** — Most libraries have excellent built-in strategies
- **"No crash means it works"** — "No exception" is the weakest property; push for stronger guarantees

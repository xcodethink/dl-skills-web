# Python Patterns

> Source: [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> Files: skills/python-patterns/SKILL.md + rules/python/ + agents/python-reviewer.md + commands/python-review.md

---

## Core Principles

1. **Readability Counts** — code should be obvious and easy to understand
2. **Explicit is Better Than Implicit** — avoid magic; be clear about intent
3. **EAFP** — Easier to Ask Forgiveness than Permission (prefer exceptions over condition checks)

---

## Style & Tooling

- Follow **PEP 8** conventions
- **Type annotations** on all function signatures
- Format with **black**, sort imports with **isort**, lint with **ruff**
- Type check with **mypy**, security scan with **bandit**

---

## Key Patterns

### Type Hints (Python 3.9+)

```python
def process_items(items: list[str]) -> dict[str, int]:
    return {item: len(item) for item in items}

T = TypeVar('T')
def first(items: list[T]) -> T | None:
    return items[0] if items else None
```

### Protocol-Based Duck Typing

```python
from typing import Protocol

class Renderable(Protocol):
    def render(self) -> str: ...

def render_all(items: list[Renderable]) -> str:
    return "\n".join(item.render() for item in items)
```

### Error Handling

- Catch specific exceptions, never bare `except`
- Chain exceptions with `raise ... from e`
- Build custom exception hierarchies for domain errors

### Context Managers

Always use `with` for resource management. Create custom context managers with `@contextmanager` or `__enter__`/`__exit__`.

### Data Classes

```python
@dataclass
class User:
    email: str
    age: int

    def __post_init__(self):
        if "@" not in self.email:
            raise ValueError(f"Invalid email: {self.email}")
```

### Decorators

Function decorators with `functools.wraps`, parameterized decorators, and class-based decorators for stateful decoration.

### Concurrency

| Task Type | Solution |
|-----------|----------|
| I/O-bound | `ThreadPoolExecutor` or `asyncio` |
| CPU-bound | `ProcessPoolExecutor` |
| Concurrent I/O | `asyncio.gather` |

### Performance

- `__slots__` for memory efficiency
- Generators for large datasets (yield instead of return lists)
- `"".join()` instead of string concatenation in loops

---

## Anti-Patterns to Avoid

- Mutable default arguments: `def f(x=[])` — use `def f(x=None)`
- `type()` for type checking — use `isinstance()`
- `value == None` — use `value is None`
- `from module import *` — use explicit imports
- Bare except — always catch specific exceptions

---

## Code Review Priorities

| Severity | Issues |
|----------|--------|
| **CRITICAL** | SQL injection, command injection, eval/exec abuse, hardcoded secrets, bare except |
| **HIGH** | Missing type hints, mutable defaults, no context managers, C-style loops |
| **MEDIUM** | PEP 8 violations, missing docstrings, print() instead of logging |

### Approval: No CRITICAL/HIGH = approve; MEDIUM only = warning; CRITICAL/HIGH found = block.

### Framework-Specific Checks

- **Django**: N+1 queries, missing migrations, `transaction.atomic()`
- **FastAPI**: CORS config, Pydantic validation, async correctness
- **Flask**: Context management, error handlers, blueprints

---

**Remember**: Python code should be readable, explicit, and follow the principle of least surprise.

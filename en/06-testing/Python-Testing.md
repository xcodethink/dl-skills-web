# Python Testing with pytest

> **Source:** [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> **Original files:** skills/python-testing/SKILL.md, rules/python/testing.md
> **Curated:** 2026-02-21

---

## Overview

Comprehensive pytest testing strategies: TDD methodology, fixtures, mocking, parametrization, async testing, and coverage requirements. Target: 80%+ coverage, 100% on critical paths.

---

## TDD Cycle

```python
# RED: Write failing test
def test_add_numbers():
    assert add(2, 3) == 5

# GREEN: Minimal implementation
def add(a, b):
    return a + b

# REFACTOR: Improve while green
```

---

## Fixtures

### Basic

```python
@pytest.fixture
def sample_data():
    return {"name": "Alice", "age": 30}
```

### Setup/Teardown

```python
@pytest.fixture
def database():
    db = Database(":memory:")
    db.create_tables()
    yield db
    db.close()
```

### Scopes

```python
@pytest.fixture(scope="function")  # Default -- per test
@pytest.fixture(scope="module")    # Once per module
@pytest.fixture(scope="session")   # Once per session
```

### Parametrized Fixtures

```python
@pytest.fixture(params=["sqlite", "postgresql", "mysql"])
def db(request):
    return Database(request.param)
```

### Shared via conftest.py

```python
# tests/conftest.py
@pytest.fixture
def client():
    app = create_app(testing=True)
    with app.test_client() as client:
        yield client
```

---

## Parametrization

```python
@pytest.mark.parametrize("input,expected", [
    ("hello", "HELLO"),
    ("world", "WORLD"),
], ids=["lowercase", "another"])
def test_uppercase(input, expected):
    assert input.upper() == expected

@pytest.mark.parametrize("a,b,expected", [
    (2, 3, 5), (0, 0, 0), (-1, 1, 0),
])
def test_add(a, b, expected):
    assert add(a, b) == expected
```

---

## Mocking

```python
from unittest.mock import patch, Mock

@patch("mypackage.external_api_call")
def test_with_mock(api_mock):
    api_mock.return_value = {"status": "success"}
    result = my_function()
    api_mock.assert_called_once()

@patch("mypackage.api_call")
def test_error(api_mock):
    api_mock.side_effect = ConnectionError("fail")
    with pytest.raises(ConnectionError):
        api_call()

@patch("mypackage.DBConnection", autospec=True)
def test_autospec(db_mock):
    # Catches API misuse
    db_mock.return_value.query("SELECT 1")
```

---

## Async Testing

```python
@pytest.mark.asyncio
async def test_async_function():
    result = await async_add(2, 3)
    assert result == 5

@pytest.mark.asyncio
@patch("mypackage.async_api_call")
async def test_async_mock(api_mock):
    api_mock.return_value = {"status": "ok"}
    result = await my_async_function()
    api_mock.assert_awaited_once()
```

---

## Markers

```python
@pytest.mark.slow
@pytest.mark.integration
@pytest.mark.unit
```

```bash
pytest -m "not slow"          # Skip slow
pytest -m integration         # Only integration
pytest -m "unit and not slow" # Unit, excluding slow
```

---

## Test Organization

```
tests/
├── conftest.py
├── unit/
│   ├── test_models.py
│   └── test_utils.py
├── integration/
│   ├── test_api.py
│   └── test_database.py
└── e2e/
    └── test_user_flow.py
```

---

## Configuration

```toml
# pyproject.toml
[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = ["--strict-markers", "--cov=mypackage", "--cov-report=term-missing"]
markers = ["slow", "integration", "unit"]
```

---

## Essential Commands

```bash
pytest                          # All tests
pytest tests/test_utils.py      # Specific file
pytest -v                       # Verbose
pytest --cov=mypackage          # With coverage
pytest -m "not slow"            # Skip slow
pytest -x                       # Stop on first failure
pytest --lf                     # Last failed
pytest -k "test_user"           # Pattern match
pytest --pdb                    # Debug on failure
```

---

## Best Practices

**DO:** Follow TDD, test one thing per test, use descriptive names, use fixtures, mock externals, test edge cases, aim for 80%+

**DON'T:** Test implementation details, use complex conditionals in tests, ignore failures, test third-party code, share state between tests, catch exceptions in tests

> Source: [trailofbits/skills](https://github.com/trailofbits/skills) | Category: Project Setup

---
name: modern-python-project
description: Modern Python project setup with uv + ruff + pyproject.toml replacing legacy pip/virtualenv/flake8/black
---

# Modern Python Project Setup

## Overview

The Python project toolchain has fundamentally shifted. `uv` replaces pip + virtualenv + pip-tools. `ruff` unifies flake8 + black + isort. `pyproject.toml` is the single config file. Based on Trail of Bits' modern-python practice, this skill walks you through bootstrapping a Python project with the modern toolchain.

## Toolchain Overview

| Responsibility | Legacy Tool | Modern Replacement |
|---------------|-------------|-------------------|
| Package manager | pip + virtualenv | **uv** |
| Lock file | pip freeze / pip-tools | **uv.lock** |
| Linter | flake8 + isort + pylint | **ruff check** |
| Formatter | black + isort | **ruff format** |
| Config | setup.py + setup.cfg + requirements.txt | **pyproject.toml** |
| Test framework | unittest | **pytest** |

## Workflow

1. Install uv (one-time setup)
2. Create project skeleton with `uv init`
3. Configure `pyproject.toml` (dependencies, ruff rules, pytest options)
4. Establish `src/` layout and `tests/` directory
5. Install dev dependencies with `uv sync`
6. Configure pre-commit hooks
7. Write first test and run `uv run pytest`
8. Set up CI pipeline

## Initialization

### 1. Install uv

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 2. Create Project

```bash
uv init my-project
cd my-project
```

Generated structure:

```
my-project/
├── pyproject.toml    # Single config file
├── README.md
└── src/
    └── my_project/
        └── __init__.py
```

### 3. Configure pyproject.toml (PEP 735)

```toml
[project]
name = "my-project"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = []

[dependency-groups]
dev = [
    "pytest>=8.0",
    "pytest-cov>=6.0",
    "ruff>=0.8",
    "pre-commit>=4.0",
    "pip-audit>=2.7",
]

[tool.ruff]
target-version = "py311"
line-length = 100
src = ["src"]

[tool.ruff.lint]
select = [
    "E",    # pycodestyle errors
    "W",    # pycodestyle warnings
    "F",    # pyflakes
    "I",    # isort
    "B",    # flake8-bugbear
    "UP",   # pyupgrade
    "S",    # flake8-bandit (security)
]

[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "--cov=src --cov-report=term-missing"
```

### 4. src/ Layout Standard

```
my-project/
├── src/
│   └── my_project/
│       ├── __init__.py
│       ├── core.py
│       └── utils.py
├── tests/
│   ├── __init__.py
│   ├── test_core.py
│   └── test_utils.py
├── pyproject.toml
├── uv.lock
└── README.md
```

**Why `src/` layout?** Prevents tests from accidentally importing the uninstalled local package, ensuring tests run against the truly installed version.

## Legacy Command Mapping

| Legacy Command | Modern Replacement | Notes |
|---------------|-------------------|-------|
| `python script.py` | `uv run script.py` | Auto-activates virtual env |
| `pip install package` | `uv add package` | Auto-updates pyproject.toml |
| `pip install -r requirements.txt` | `uv add -r requirements.txt` | Bulk import |
| `pip install -e .` | `uv sync` | Auto editable install |
| `python -m venv .venv` | `uv venv` | Usually not needed manually |
| `pip freeze > requirements.txt` | `uv lock` | Auto-generates `uv.lock` |
| `black .` | `ruff format .` | 10-100x faster |
| `isort .` | `ruff check --select I --fix .` | Integrated in ruff |
| `flake8` | `ruff check .` | More comprehensive rules |

## Pre-commit Hooks

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.8.0
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format

  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.5.0
    hooks:
      - id: detect-secrets

  - repo: https://github.com/koalaman/shellcheck-precommit
    rev: v0.10.0
    hooks:
      - id: shellcheck
```

```bash
uv run pre-commit install
```

## Security Scanning

### pip-audit -- Dependency Vulnerability Scanning

```bash
uv run pip-audit
```

Run regularly in CI. Block builds when known CVEs are detected.

### Dependabot Configuration

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"
```

## Coverage Enforcement

Configure pytest-cov in `pyproject.toml`:

```toml
[tool.pytest.ini_options]
addopts = "--cov=src --cov-report=term-missing --cov-fail-under=80"
```

Tests fail if coverage drops below 80%, preventing gradual coverage erosion.

## MUST DO

- Use `src/` layout -- do not place packages at the project root
- Commit `uv.lock` to version control for reproducible builds
- Run `ruff check` + `ruff format --check` + `pytest` in CI
- Enable ruff security rules (`S` series)
- Run `pip-audit` regularly to check for dependency vulnerabilities
- Add type hints to at least all public APIs

## MUST NOT DO

- Never use `pip install` directly -- use `uv add`
- Never maintain `requirements.txt` manually -- `uv.lock` is your lock file
- Never use both `setup.py` and `pyproject.toml` -- keep only the latter
- Never skip type annotations for public APIs
- Never start collaboration without pre-commit hooks configured

> 来源：[trailofbits/skills](https://github.com/trailofbits/skills) | 分类：项目搭建

---
name: modern-python-project
description: Modern Python project setup with uv + ruff + pyproject.toml replacing legacy pip/virtualenv/flake8/black
---

# 现代 Python 项目搭建（Modern Python Project）

## 概述

Python 项目工具链已发生根本性变化。`uv` 取代了 pip + virtualenv + pip-tools 三件套，`ruff` 统一了 flake8 + black + isort 的职责，`pyproject.toml` 成为唯一配置文件。本技能基于 Trail of Bits 的 modern-python 实践，帮你用现代工具链从零搭建 Python 项目。

## 工具链对照表

| 职责 | 旧工具 | 现代替代 |
|------|--------|----------|
| 包管理器（Package Manager） | pip + virtualenv | **uv** |
| 锁文件（Lock File） | pip freeze / pip-tools | **uv.lock** |
| 代码检查（Linter） | flake8 + isort + pylint | **ruff check** |
| 代码格式化（Formatter） | black + isort | **ruff format** |
| 项目配置（Config） | setup.py + setup.cfg + requirements.txt | **pyproject.toml** |
| 测试框架（Test Framework） | unittest | **pytest** |

## 工作流

1. 安装 uv（一次性操作）
2. 使用 `uv init` 创建项目骨架
3. 配置 `pyproject.toml`（依赖、ruff 规则、pytest 选项）
4. 建立 `src/` 布局和 `tests/` 目录
5. 安装开发依赖 `uv sync`
6. 配置 pre-commit 钩子
7. 编写第一个测试并运行 `uv run pytest`
8. 配置 CI 流水线

## 初始化步骤

### 1. 安装 uv

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 2. 创建项目

```bash
uv init my-project
cd my-project
```

生成的项目结构：

```
my-project/
├── pyproject.toml    # 唯一配置文件
├── README.md
└── src/
    └── my_project/
        └── __init__.py
```

### 3. 配置 pyproject.toml

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
    "E",    # pycodestyle 错误
    "W",    # pycodestyle 警告
    "F",    # pyflakes
    "I",    # isort（导入排序）
    "B",    # flake8-bugbear（常见 bug 检测）
    "UP",   # pyupgrade（语法升级）
    "S",    # flake8-bandit（安全检查）
]

[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "--cov=src --cov-report=term-missing"
```

### 4. src/ 布局标准（src Layout）

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

**为什么用 `src/` 布局？** 防止测试意外导入未安装的本地包，确保测试运行的是真正安装的版本。

## 命令对照表：旧工具 -> 新工具

| 旧命令 | 现代替代 | 说明 |
|--------|----------|------|
| `python script.py` | `uv run script.py` | 自动激活虚拟环境 |
| `pip install package` | `uv add package` | 自动更新 pyproject.toml |
| `pip install -r requirements.txt` | `uv add -r requirements.txt` | 批量导入依赖 |
| `pip install -e .` | `uv sync` | 自动可编辑安装（Editable Install） |
| `python -m venv .venv` | `uv venv` | 通常不需要手动创建 |
| `pip freeze > requirements.txt` | `uv lock` | 自动生成 `uv.lock` |
| `black .` | `ruff format .` | 速度快 10-100 倍 |
| `isort .` | `ruff check --select I --fix .` | 集成在 ruff 中 |
| `flake8` | `ruff check .` | 规则更全面 |

## Pre-commit 钩子配置

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

## 安全扫描（Security Scanning）

### pip-audit -- 依赖漏洞检查

```bash
uv run pip-audit
```

定期在 CI 中运行，发现已知漏洞（CVE）时阻断构建。

### Dependabot 配置

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"
```

## 覆盖率强制（Coverage Enforcement）

在 `pyproject.toml` 中配置 pytest-cov：

```toml
[tool.pytest.ini_options]
addopts = "--cov=src --cov-report=term-missing --cov-fail-under=80"
```

覆盖率低于 80% 时测试失败，防止覆盖率逐步滑坡。

## 必须做（MUST DO）

- 使用 `src/` 布局，不要把包直接放在项目根目录
- 提交 `uv.lock` 到版本控制（确保可复现构建）
- 在 CI 中运行 `ruff check` + `ruff format --check` + `pytest`
- 启用 ruff 的安全规则（`S` 系列）
- 定期运行 `pip-audit` 检查依赖漏洞
- 至少为公共 API（Public API）添加类型提示（Type Hints）

## 禁止做（MUST NOT DO）

- 禁止使用 `pip install` 直接安装——用 `uv add`
- 禁止手动维护 `requirements.txt`——`uv.lock` 是你的锁文件
- 禁止同时使用 `setup.py` 和 `pyproject.toml`——只保留后者
- 禁止跳过类型标注——至少为公共 API 添加
- 禁止在没有 pre-commit 钩子的情况下开始多人协作

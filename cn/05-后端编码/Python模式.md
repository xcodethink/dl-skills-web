# Python 模式

> 来源：[affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> 原始文件：skills/python-patterns/SKILL.md + rules/python/（coding-style, patterns, hooks, security, testing）+ agents/python-reviewer.md + commands/python-review.md

---

## 何时激活

- 编写新的 Python 代码
- 审查 Python 代码
- 重构现有 Python 代码
- 设计 Python 包/模块

---

## 核心原则

### 1. 可读性至上（Readability Counts）

Python 优先考虑可读性，代码应该显而易见且易于理解。

```python
# 正确：清晰可读
def get_active_users(users: list[User]) -> list[User]:
    """返回提供列表中的活跃用户。"""
    return [user for user in users if user.is_active]

# 错误：聪明但令人困惑
def get_active_users(u):
    return [x for x in u if x.a]
```

### 2. 显式优于隐式（Explicit is Better Than Implicit）

避免魔法行为，明确代码的功能。

```python
# 正确：显式配置
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# 错误：隐藏的副作用
import some_module
some_module.setup()  # 这做了什么？
```

### 3. EAFP -- 请求宽恕比请求许可更容易

Python 更倾向于异常处理而非条件检查。

```python
# 正确：EAFP 风格
def get_value(dictionary: dict, key: str) -> Any:
    try:
        return dictionary[key]
    except KeyError:
        return default_value

# 错误：LBYL（三思而后行）风格
def get_value(dictionary: dict, key: str) -> Any:
    if key in dictionary:
        return dictionary[key]
    else:
        return default_value
```

---

## 编码风格

- 遵循 **PEP 8** 规范
- 在所有函数签名上使用**类型注解**（Type Annotations）
- 使用 **black** 格式化代码
- 使用 **isort** 排序导入
- 使用 **ruff** 进行 lint 检查

### 不可变性

优先使用不可变数据结构：

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class User:
    name: str
    email: str

from typing import NamedTuple

class Point(NamedTuple):
    x: float
    y: float
```

---

## 类型提示（Type Hints）

### 基本类型注解

```python
from typing import Optional, List, Dict, Any

def process_user(
    user_id: str,
    data: Dict[str, Any],
    active: bool = True
) -> Optional[User]:
    """处理用户并返回更新后的 User 或 None。"""
    if not active:
        return None
    return User(user_id, data)
```

### 现代类型提示（Python 3.9+）

```python
# Python 3.9+ -- 使用内置类型
def process_items(items: list[str]) -> dict[str, int]:
    return {item: len(item) for item in items}

# Python 3.8 及更早 -- 使用 typing 模块
from typing import List, Dict

def process_items(items: List[str]) -> Dict[str, int]:
    return {item: len(item) for item in items}
```

### 类型别名与泛型（TypeVar）

```python
from typing import TypeVar, Union

# 复杂类型的类型别名
JSON = Union[dict[str, Any], list[Any], str, int, float, bool, None]

def parse_json(data: str) -> JSON:
    return json.loads(data)

# 泛型类型
T = TypeVar('T')

def first(items: list[T]) -> T | None:
    """返回第一个元素，如果列表为空则返回 None。"""
    return items[0] if items else None
```

### 基于协议的鸭子类型（Protocol-Based Duck Typing）

```python
from typing import Protocol

class Renderable(Protocol):
    def render(self) -> str:
        """将对象渲染为字符串。"""

def render_all(items: list[Renderable]) -> str:
    """渲染所有实现了 Renderable 协议的项目。"""
    return "\n".join(item.render() for item in items)
```

---

## 错误处理模式

### 捕获特定异常

```python
# 正确：捕获特定异常
def load_config(path: str) -> Config:
    try:
        with open(path) as f:
            return Config.from_json(f.read())
    except FileNotFoundError as e:
        raise ConfigError(f"配置文件未找到: {path}") from e
    except json.JSONDecodeError as e:
        raise ConfigError(f"配置中的 JSON 无效: {path}") from e

# 错误：裸 except
def load_config(path: str) -> Config:
    try:
        with open(path) as f:
            return Config.from_json(f.read())
    except:
        return None  # 静默失败！
```

### 异常链（Exception Chaining）

```python
def process_data(data: str) -> Result:
    try:
        parsed = json.loads(data)
    except json.JSONDecodeError as e:
        # 链接异常以保留回溯信息
        raise ValueError(f"解析数据失败: {data}") from e
```

### 自定义异常层次结构

```python
class AppError(Exception):
    """所有应用程序错误的基础异常。"""
    pass

class ValidationError(AppError):
    """输入验证失败时抛出。"""
    pass

class NotFoundError(AppError):
    """请求的资源未找到时抛出。"""
    pass

# 用法
def get_user(user_id: str) -> User:
    user = db.find_user(user_id)
    if not user:
        raise NotFoundError(f"用户未找到: {user_id}")
    return user
```

---

## 上下文管理器（Context Managers）

### 资源管理

```python
# 正确：使用上下文管理器
def process_file(path: str) -> str:
    with open(path, 'r') as f:
        return f.read()

# 错误：手动管理资源
def process_file(path: str) -> str:
    f = open(path, 'r')
    try:
        return f.read()
    finally:
        f.close()
```

### 自定义上下文管理器

```python
from contextlib import contextmanager

@contextmanager
def timer(name: str):
    """计时代码块的上下文管理器。"""
    start = time.perf_counter()
    yield
    elapsed = time.perf_counter() - start
    print(f"{name} 耗时 {elapsed:.4f} 秒")

# 用法
with timer("数据处理"):
    process_large_dataset()
```

### 上下文管理器类

```python
class DatabaseTransaction:
    def __init__(self, connection):
        self.connection = connection

    def __enter__(self):
        self.connection.begin_transaction()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is None:
            self.connection.commit()
        else:
            self.connection.rollback()
        return False  # 不抑制异常

# 用法
with DatabaseTransaction(conn):
    user = conn.create_user(user_data)
    conn.create_profile(user.id, profile_data)
```

---

## 推导式与生成器（Comprehensions and Generators）

### 列表推导式

```python
# 正确：简单转换使用列表推导式
names = [user.name for user in users if user.is_active]

# 复杂推导式应该展开
# 错误：过于复杂
result = [x * 2 for x in items if x > 0 if x % 2 == 0]

# 正确：使用函数
def filter_and_transform(items: Iterable[int]) -> list[int]:
    result = []
    for x in items:
        if x > 0 and x % 2 == 0:
            result.append(x * 2)
    return result
```

### 生成器表达式

```python
# 正确：使用生成器进行惰性求值
total = sum(x * x for x in range(1_000_000))

# 错误：创建大型中间列表
total = sum([x * x for x in range(1_000_000)])
```

### 生成器函数

```python
def read_large_file(path: str) -> Iterator[str]:
    """逐行读取大文件。"""
    with open(path) as f:
        for line in f:
            yield line.strip()

# 用法
for line in read_large_file("huge.txt"):
    process(line)
```

---

## 数据类与命名元组

### 数据类（Data Classes）

```python
from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class User:
    """自动生成 __init__、__repr__ 和 __eq__ 的用户实体。"""
    id: str
    name: str
    email: str
    created_at: datetime = field(default_factory=datetime.now)
    is_active: bool = True
```

### 带验证的数据类

```python
@dataclass
class User:
    email: str
    age: int

    def __post_init__(self):
        # 验证邮箱格式
        if "@" not in self.email:
            raise ValueError(f"无效邮箱: {self.email}")
        # 验证年龄范围
        if self.age < 0 or self.age > 150:
            raise ValueError(f"无效年龄: {self.age}")
```

---

## 装饰器（Decorators）

### 函数装饰器

```python
import functools
import time

def timer(func: Callable) -> Callable:
    """计时函数执行的装饰器。"""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} 耗时 {elapsed:.4f}s")
        return result
    return wrapper
```

### 参数化装饰器

```python
def repeat(times: int):
    """重复执行函数多次的装饰器。"""
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            results = []
            for _ in range(times):
                results.append(func(*args, **kwargs))
            return results
        return wrapper
    return decorator

@repeat(times=3)
def greet(name: str) -> str:
    return f"Hello, {name}!"
```

### 基于类的装饰器

```python
class CountCalls:
    """统计函数调用次数的装饰器。"""
    def __init__(self, func: Callable):
        functools.update_wrapper(self, func)
        self.func = func
        self.count = 0

    def __call__(self, *args, **kwargs):
        self.count += 1
        print(f"{self.func.__name__} 已被调用 {self.count} 次")
        return self.func(*args, **kwargs)
```

---

## 并发模式

### 线程：用于 I/O 密集型任务

```python
import concurrent.futures

def fetch_all_urls(urls: list[str]) -> dict[str, str]:
    """使用线程并发获取多个 URL。"""
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        future_to_url = {executor.submit(fetch_url, url): url for url in urls}
        results = {}
        for future in concurrent.futures.as_completed(future_to_url):
            url = future_to_url[future]
            try:
                results[url] = future.result()
            except Exception as e:
                results[url] = f"错误: {e}"
    return results
```

### 多进程：用于 CPU 密集型任务

```python
def process_all(datasets: list[list[int]]) -> list[int]:
    """使用多进程处理多个数据集。"""
    with concurrent.futures.ProcessPoolExecutor() as executor:
        results = list(executor.map(process_data, datasets))
    return results
```

### Async/Await：用于并发 I/O

```python
import asyncio

async def fetch_all(urls: list[str]) -> dict[str, str]:
    """并发获取多个 URL。"""
    tasks = [fetch_async(url) for url in urls]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    return dict(zip(urls, results))
```

---

## 内存与性能

### 使用 `__slots__` 提高内存效率

```python
# 正确：__slots__ 减少内存使用
class Point:
    __slots__ = ['x', 'y']

    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y
```

### 避免在循环中拼接字符串

```python
# 错误：由于字符串不可变性导致 O(n^2)
result = ""
for item in items:
    result += str(item)

# 正确：使用 join，O(n)
result = "".join(str(item) for item in items)
```

---

## 包组织

### 标准项目布局

```
myproject/
├── src/
│   └── mypackage/
│       ├── __init__.py
│       ├── main.py
│       ├── api/
│       ├── models/
│       └── utils/
├── tests/
│   ├── conftest.py
│   ├── test_api.py
│   └── test_models.py
├── pyproject.toml
└── README.md
```

### 导入规范

```python
# 正确：导入顺序 -- 标准库、第三方、本地
import os
import sys
from pathlib import Path

import requests
from fastapi import FastAPI

from mypackage.models import User
from mypackage.utils import format_name
```

---

## 反模式

```python
# 错误：可变默认参数
def append_to(item, items=[]):
    items.append(item)
    return items

# 正确：使用 None 并创建新列表
def append_to(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

# 错误：使用 type() 检查类型
if type(obj) == list:
    process(obj)

# 正确：使用 isinstance
if isinstance(obj, list):
    process(obj)

# 错误：用 == 比较 None
if value == None:
    process()

# 正确：使用 is
if value is None:
    process()

# 错误：裸 except
try:
    risky_operation()
except:
    pass

# 正确：特定异常
try:
    risky_operation()
except SpecificError as e:
    logger.error(f"操作失败: {e}")
```

---

## Python 惯用法速查表

| 惯用法 | 描述 |
|--------|------|
| EAFP | 请求宽恕比请求许可更容易 |
| 上下文管理器 | 使用 `with` 管理资源 |
| 列表推导式 | 用于简单转换 |
| 生成器 | 用于惰性求值和大数据集 |
| 类型提示 | 注解函数签名 |
| 数据类 | 自动生成方法的数据容器 |
| `__slots__` | 内存优化 |
| f-strings | 字符串格式化（Python 3.6+） |
| `pathlib.Path` | 路径操作（Python 3.4+） |
| `enumerate` | 循环中获取索引-元素对 |

---

## 附录A：Python 代码审查 Agent

> 来源：agents/python-reviewer.md

### 审查优先级

| 级别 | 检查项 |
|------|--------|
| **严重** | SQL 注入、命令注入、路径遍历、eval/exec 滥用、不安全反序列化、硬编码密钥、弱加密、YAML 不安全加载 |
| **严重** | 裸 except、被吞掉的异常、缺少上下文管理器 |
| **高** | 缺少类型注解、使用 `Any`、缺少 `Optional`、可变默认参数 |
| **高** | 应使用列表推导式、`isinstance()` 而非 `type()`、`Enum` 而非魔法数字、`"".join()` 而非循环拼接 |
| **高** | 函数超过 50 行、超过 5 个参数、深层嵌套超过 4 层 |
| **中** | PEP 8 违规、缺少文档字符串、`print()` 代替 `logging`、`from module import *` |

### 诊断命令

```bash
mypy .                                     # 类型检查
ruff check .                               # 快速 lint
black --check .                            # 格式检查
bandit -r .                                # 安全扫描
pytest --cov=app --cov-report=term-missing # 测试覆盖率
```

### 审批标准

- **通过**：没有严重或高级别问题
- **警告**：仅有中级别问题（可谨慎合并）
- **阻止**：发现严重或高级别问题

---

## 附录B：框架特定检查

### Django 项目
- N+1 查询问题（使用 `select_related` 和 `prefetch_related`）
- 模型更改缺少迁移
- 可以用 ORM 时使用了原始 SQL
- 多步操作缺少 `transaction.atomic()`

### FastAPI 项目
- CORS 配置错误
- Pydantic 模型用于请求验证
- 响应模型正确性
- 正确的 async/await 用法

### Flask 项目
- 上下文管理（应用上下文、请求上下文）
- 正确的错误处理
- Blueprint 组织
- 配置管理

---

## 附录C：工具配置参考

### pyproject.toml 配置

```toml
[tool.black]
line-length = 88
target-version = ['py39']

[tool.ruff]
line-length = 88
select = ["E", "F", "I", "N", "W"]

[tool.mypy]
python_version = "3.9"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true

[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "--cov=mypackage --cov-report=term-missing"
```

---

**记住**：Python 代码应该可读、显式，并遵循最小惊讶原则。在不确定时，优先选择清晰而非聪明。

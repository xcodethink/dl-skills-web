# C++ 测试（C++ Testing）

> **来源：** [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> **原始文件：** skills/cpp-testing/SKILL.md
> **整理日期：** 2026-02-21

---

## 概述

面向 Agent 的现代 C++（C++17/20）测试工作流，使用 GoogleTest/GoogleMock 配合 CMake/CTest。涵盖 TDD 工作流、单元测试、Fixture、Mock、覆盖率、Sanitizer 和模糊测试（Fuzzing）。

---

## 何时使用

- 编写新的 C++ 测试或修复现有测试
- 设计 C++ 组件的单元/集成测试覆盖
- 添加测试覆盖、CI 门控或回归保护
- 配置 CMake/CTest 工作流以实现一致的执行
- 调查测试失败或不稳定行为
- 启用 Sanitizer 进行内存/竞态诊断

### 何时不使用

- 不涉及测试变更的新功能实现
- 与测试覆盖或失败无关的大规模重构
- 无需测试回归验证的性能调优
- 非 C++ 项目或非测试任务

---

## 核心概念

- **TDD 循环**：红 -> 绿 -> 重构（先写测试、最小修复、再清理）
- **隔离**：优先使用依赖注入（Dependency Injection）和 Fake，而非全局状态
- **测试布局**：`tests/unit`、`tests/integration`、`tests/testdata`
- **Mock 与 Fake**：Mock 用于交互验证，Fake 用于有状态行为
- **CTest 发现**：使用 `gtest_discover_tests()` 实现稳定的测试发现
- **CI 信号**：先运行子集，再运行带 `--output-on-failure` 的完整套件

---

## TDD 工作流

遵循 RED -> GREEN -> REFACTOR 循环：

1. **RED**：编写一个捕获新行为的失败测试
2. **GREEN**：实现最小的代码变更使其通过
3. **REFACTOR**：在测试保持绿色的前提下清理代码

```cpp
// tests/add_test.cpp
#include <gtest/gtest.h>

int Add(int a, int b); // 由生产代码提供

TEST(AddTest, AddsTwoNumbers) { // RED（红灯）
  EXPECT_EQ(Add(2, 3), 5);
}

// src/add.cpp
int Add(int a, int b) { // GREEN（绿灯）
  return a + b;
}

// REFACTOR（重构）：测试通过后简化/重命名
```

---

## 代码示例

### 基本单元测试（gtest）

```cpp
// tests/calculator_test.cpp
#include <gtest/gtest.h>

int Add(int a, int b); // 由生产代码提供

TEST(CalculatorTest, AddsTwoNumbers) {
    EXPECT_EQ(Add(2, 3), 5);
}
```

### Fixture（gtest）

```cpp
// tests/user_store_test.cpp
#include <gtest/gtest.h>
#include <memory>
#include <optional>
#include <string>

struct User { std::string name; };
class UserStore {
public:
    explicit UserStore(std::string /*path*/) {}
    void Seed(std::initializer_list<User> /*users*/) {}
    std::optional<User> Find(const std::string &/*name*/) { return User{"alice"}; }
};

class UserStoreTest : public ::testing::Test {
protected:
    void SetUp() override {
        store = std::make_unique<UserStore>(":memory:");
        store->Seed({{"alice"}, {"bob"}});
    }

    std::unique_ptr<UserStore> store;
};

TEST_F(UserStoreTest, FindsExistingUser) {
    auto user = store->Find("alice");
    ASSERT_TRUE(user.has_value());
    EXPECT_EQ(user->name, "alice");
}
```

### Mock（gmock）

```cpp
// tests/notifier_test.cpp
#include <gmock/gmock.h>
#include <gtest/gtest.h>
#include <string>

class Notifier {
public:
    virtual ~Notifier() = default;
    virtual void Send(const std::string &message) = 0;
};

class MockNotifier : public Notifier {
public:
    MOCK_METHOD(void, Send, (const std::string &message), (override));
};

class Service {
public:
    explicit Service(Notifier &notifier) : notifier_(notifier) {}
    void Publish(const std::string &message) { notifier_.Send(message); }

private:
    Notifier &notifier_;
};

TEST(ServiceTest, SendsNotifications) {
    MockNotifier notifier;
    Service service(notifier);

    EXPECT_CALL(notifier, Send("hello")).Times(1);
    service.Publish("hello");
}
```

---

## CMake/CTest 快速开始

```cmake
# CMakeLists.txt（摘录）
cmake_minimum_required(VERSION 3.20)
project(example LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
# 使用项目锁定的版本
set(GTEST_VERSION v1.17.0) # 按项目策略调整
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/${GTEST_VERSION}.zip
)
FetchContent_MakeAvailable(googletest)

add_executable(example_tests
  tests/calculator_test.cpp
  src/calculator.cpp
)
target_link_libraries(example_tests GTest::gtest GTest::gmock GTest::gtest_main)

enable_testing()
include(GoogleTest)
gtest_discover_tests(example_tests)
```

### 构建和运行

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug
cmake --build build -j
ctest --test-dir build --output-on-failure
```

---

## 运行测试

```bash
# 使用 CTest 运行
ctest --test-dir build --output-on-failure
ctest --test-dir build -R ClampTest
ctest --test-dir build -R "UserStoreTest.*" --output-on-failure

# 使用 gtest 过滤器直接运行
./build/example_tests --gtest_filter=ClampTest.*
./build/example_tests --gtest_filter=UserStoreTest.FindsExistingUser
```

---

## 调试失败

1. 使用 gtest 过滤器重新运行单个失败的测试
2. 在失败的断言周围添加作用域日志
3. 启用 Sanitizer 重新运行
4. 根因修复后扩展到完整套件

---

## 覆盖率

优先使用目标级别的设置而非全局标志。

```cmake
option(ENABLE_COVERAGE "启用覆盖率标志" OFF)

if(ENABLE_COVERAGE)
  if(CMAKE_CXX_COMPILER_ID MATCHES "GNU")
    target_compile_options(example_tests PRIVATE --coverage)
    target_link_options(example_tests PRIVATE --coverage)
  elseif(CMAKE_CXX_COMPILER_ID MATCHES "Clang")
    target_compile_options(example_tests PRIVATE -fprofile-instr-generate -fcoverage-mapping)
    target_link_options(example_tests PRIVATE -fprofile-instr-generate)
  endif()
endif()
```

### GCC + gcov + lcov

```bash
cmake -S . -B build-cov -DENABLE_COVERAGE=ON
cmake --build build-cov -j
ctest --test-dir build-cov
lcov --capture --directory build-cov --output-file coverage.info
lcov --remove coverage.info '/usr/*' --output-file coverage.info
genhtml coverage.info --output-directory coverage
```

### Clang + llvm-cov

```bash
cmake -S . -B build-llvm -DENABLE_COVERAGE=ON -DCMAKE_CXX_COMPILER=clang++
cmake --build build-llvm -j
LLVM_PROFILE_FILE="build-llvm/default.profraw" ctest --test-dir build-llvm
llvm-profdata merge -sparse build-llvm/default.profraw -o build-llvm/default.profdata
llvm-cov report build-llvm/example_tests -instr-profile=build-llvm/default.profdata
```

---

## Sanitizer

```cmake
option(ENABLE_ASAN "启用 AddressSanitizer" OFF)
option(ENABLE_UBSAN "启用 UndefinedBehaviorSanitizer" OFF)
option(ENABLE_TSAN "启用 ThreadSanitizer" OFF)

if(ENABLE_ASAN)
  add_compile_options(-fsanitize=address -fno-omit-frame-pointer)
  add_link_options(-fsanitize=address)
endif()
if(ENABLE_UBSAN)
  add_compile_options(-fsanitize=undefined -fno-omit-frame-pointer)
  add_link_options(-fsanitize=undefined)
endif()
if(ENABLE_TSAN)
  add_compile_options(-fsanitize=thread)
  add_link_options(-fsanitize=thread)
endif()
```

---

## 不稳定测试防护

- **永远不要**使用 `sleep` 做同步；使用条件变量（condition variables）或闭锁（latches）
- 每个测试的临时目录要唯一，并始终清理
- 单元测试中避免依赖真实时间、网络或文件系统
- 对随机化输入使用确定性种子

---

## 最佳实践

### 应该做

- 保持测试确定性和隔离性
- 优先使用依赖注入而非全局变量
- 使用 `ASSERT_*` 做前置条件检查，`EXPECT_*` 做多项检查
- 通过 CTest 标签或目录分离单元测试和集成测试
- 在 CI 中运行 Sanitizer 做内存和竞态检测

### 不应该做

- 不要在单元测试中依赖真实时间或网络
- 不要在可以使用条件变量的地方使用 sleep 做同步
- 不要过度 Mock 简单值对象
- 不要对非关键日志使用脆弱的字符串匹配

### 常见陷阱

| 陷阱 | 解决方案 |
|------|----------|
| 使用固定临时路径 | 每个测试生成唯一的临时目录并清理 |
| 依赖系统时钟 | 注入时钟或使用 Fake 时间源 |
| 不稳定的并发测试 | 使用条件变量/闭锁和有界等待 |
| 隐藏的全局状态 | 在 Fixture 中重置全局状态或移除全局变量 |
| 过度 Mock | 对有状态行为优先使用 Fake，仅 Mock 交互 |
| 缺少 Sanitizer 运行 | 在 CI 中添加 ASan/UBSan/TSan 构建 |
| 覆盖率仅在 Debug 构建上 | 确保覆盖率目标使用一致的标志 |

---

## 附录：模糊测试 / 属性测试

仅在项目已支持 LLVM/libFuzzer 或属性测试库时使用。

- **libFuzzer**：最适合最小 I/O 的纯函数
- **RapidCheck**：基于属性的测试以验证不变量

最小 libFuzzer 骨架：

```cpp
#include <cstddef>
#include <cstdint>
#include <string>

extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    std::string input(reinterpret_cast<const char *>(data), size);
    // ParseConfig(input); // 项目函数
    return 0;
}
```

---

## GoogleTest 的替代方案

- **Catch2**：仅头文件，表达性强的匹配器
- **doctest**：轻量级，最小编译开销

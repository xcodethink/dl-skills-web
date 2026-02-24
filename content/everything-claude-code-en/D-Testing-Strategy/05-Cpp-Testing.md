# C++ Testing with GoogleTest

> **Source:** [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> **Original files:** skills/cpp-testing/SKILL.md
> **Curated:** 2026-02-21

---

## Overview

Modern C++ (C++17/20) testing with GoogleTest/GoogleMock and CMake/CTest. Covers TDD workflow, fixtures, mocks, coverage, sanitizers, and fuzzing.

---

## Core Concepts

- **TDD loop:** RED -> GREEN -> REFACTOR
- **Isolation:** Prefer dependency injection and fakes over globals
- **Layout:** `tests/unit`, `tests/integration`, `tests/testdata`
- **Mocks vs fakes:** Mock for interactions, fake for stateful behavior
- **CTest:** Use `gtest_discover_tests()` for stable test discovery

---

## TDD Workflow

```cpp
// RED: Failing test
TEST(AddTest, AddsTwoNumbers) {
  EXPECT_EQ(Add(2, 3), 5);
}

// GREEN: Minimal implementation
int Add(int a, int b) { return a + b; }

// REFACTOR: Clean up while green
```

---

## Fixtures

```cpp
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

---

## Mocking with gmock

```cpp
class Notifier {
public:
    virtual ~Notifier() = default;
    virtual void Send(const std::string &message) = 0;
};

class MockNotifier : public Notifier {
public:
    MOCK_METHOD(void, Send, (const std::string &message), (override));
};

TEST(ServiceTest, SendsNotifications) {
    MockNotifier notifier;
    Service service(notifier);
    EXPECT_CALL(notifier, Send("hello")).Times(1);
    service.Publish("hello");
}
```

---

## CMake/CTest Setup

```cmake
cmake_minimum_required(VERSION 3.20)
project(example LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 20)

include(FetchContent)
set(GTEST_VERSION v1.17.0)
FetchContent_Declare(googletest
  URL https://github.com/google/googletest/archive/refs/tags/${GTEST_VERSION}.zip)
FetchContent_MakeAvailable(googletest)

add_executable(example_tests tests/calculator_test.cpp src/calculator.cpp)
target_link_libraries(example_tests GTest::gtest GTest::gmock GTest::gtest_main)

enable_testing()
include(GoogleTest)
gtest_discover_tests(example_tests)
```

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug
cmake --build build -j
ctest --test-dir build --output-on-failure
```

---

## Coverage

### CMake Configuration

```cmake
option(ENABLE_COVERAGE "Enable coverage" OFF)
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

### GCC + lcov

```bash
cmake -S . -B build-cov -DENABLE_COVERAGE=ON
cmake --build build-cov -j && ctest --test-dir build-cov
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

## Sanitizers

```cmake
option(ENABLE_ASAN "AddressSanitizer" OFF)
option(ENABLE_UBSAN "UndefinedBehaviorSanitizer" OFF)
option(ENABLE_TSAN "ThreadSanitizer" OFF)

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

## Flaky Test Prevention

- Never use `sleep` for synchronization; use condition variables or latches
- Unique temp directories per test, always cleaned up
- No real time, network, or filesystem dependencies in unit tests
- Deterministic seeds for randomized inputs

---

## Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| Fixed temp paths | Unique temp dirs per test |
| Wall clock time | Inject clock or use fakes |
| Flaky concurrency | Condition variables + bounded waits |
| Hidden global state | Reset in fixtures or remove |
| Over-mocking | Fakes for state, mocks for interactions |
| No sanitizer runs | Add ASan/UBSan/TSan in CI |

---

## Best Practices

**DO:** Keep tests deterministic, prefer DI over globals, use `ASSERT_*` for preconditions and `EXPECT_*` for checks, separate unit/integration tests, run sanitizers in CI

**DON'T:** Depend on real time/network in unit tests, use sleeps for sync, over-mock value objects, use brittle string matching

---

## Appendix: Fuzzing

```cpp
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    std::string input(reinterpret_cast<const char *>(data), size);
    // ParseConfig(input);
    return 0;
}
```

Alternatives to GoogleTest: **Catch2** (header-only, expressive), **doctest** (lightweight).

# C++ 编码标准

> 来源：[affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> 原始文件：skills/cpp-coding-standards/SKILL.md
> 参考：[C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

---

## 何时使用

- 编写新的 C++ 代码（类、函数、模板）
- 审查或重构现有 C++ 代码
- 在 C++ 项目中做架构决策
- 在语言特性间做选择（如 `enum` vs `enum class`、裸指针 vs 智能指针）

---

## 贯穿性原则

1. **RAII 无处不在**（P.8, R.1, E.6, CP.20）：将资源生命周期绑定到对象生命周期
2. **默认不可变**（P.10, Con.1-5, ES.25）：从 `const`/`constexpr` 开始；可变是例外
3. **类型安全**（P.4, I.4, ES.46-49, Enum.3）：利用类型系统在编译时防止错误
4. **表达意图**（P.3, F.1, NL.1-2, T.10）：名称、类型和概念应传达目的
5. **最小化复杂性**（F.2-3, ES.5, Per.4-5）：简单的代码才是正确的代码
6. **值语义优于指针语义**（C.10, R.3-5, F.20, CP.31）：优先按值返回和使用作用域对象

---

## 函数（F.*）

### 参数传递

```cpp
// F.16：廉价类型按值传递，其他按 const& 传递
void print(int x);                           // 廉价：按值
void analyze(const std::string& data);       // 昂贵：按 const&
void transform(std::string s);               // 接收器：按值（会移动）

// F.20 + F.21：返回值，而非输出参数
struct ParseResult {
    std::string token;
    int position;
};

ParseResult parse(std::string_view input);   // 正确：返回结构体

// 错误：输出参数
void parse(std::string_view input,
           std::string& token, int& pos);    // 避免这样
```

### 纯函数和 constexpr

```cpp
// F.4 + F.8：尽可能使用纯函数和 constexpr
constexpr int factorial(int n) noexcept {
    return (n <= 1) ? 1 : n * factorial(n - 1);
}

static_assert(factorial(5) == 120);
```

---

## 类与类层次（C.*）

### 零规则（Rule of Zero）

```cpp
// C.20：让编译器生成特殊成员
struct Employee {
    std::string name;
    std::string department;
    int id;
    // 不需要析构函数、拷贝/移动构造函数或赋值运算符
};
```

### 五规则（Rule of Five）

```cpp
// C.21：如果必须管理资源，定义所有五个
class Buffer {
public:
    explicit Buffer(std::size_t size)
        : data_(std::make_unique<char[]>(size)), size_(size) {}

    ~Buffer() = default;

    Buffer(const Buffer& other)
        : data_(std::make_unique<char[]>(other.size_)), size_(other.size_) {
        std::copy_n(other.data_.get(), size_, data_.get());
    }

    Buffer& operator=(const Buffer& other) {
        if (this != &other) {
            auto new_data = std::make_unique<char[]>(other.size_);
            std::copy_n(other.data_.get(), other.size_, new_data.get());
            data_ = std::move(new_data);
            size_ = other.size_;
        }
        return *this;
    }

    Buffer(Buffer&&) noexcept = default;
    Buffer& operator=(Buffer&&) noexcept = default;

private:
    std::unique_ptr<char[]> data_;
    std::size_t size_;
};
```

### 类层次结构

```cpp
// C.35 + C.128：虚析构函数，使用 override
class Shape {
public:
    virtual ~Shape() = default;
    virtual double area() const = 0;
};

class Circle : public Shape {
public:
    explicit Circle(double r) : radius_(r) {}
    double area() const override { return 3.14159 * radius_ * radius_; }

private:
    double radius_;
};
```

---

## 资源管理（R.*）

### 智能指针用法

```cpp
// R.11 + R.20 + R.21：使用智能指针的 RAII
auto widget = std::make_unique<Widget>("config");  // 唯一所有权
auto cache  = std::make_shared<Cache>(1024);        // 共享所有权

// R.3：裸指针 = 非拥有观察者
void render(const Widget* w) {  // 不拥有 w
    if (w) w->draw();
}

render(widget.get());
```

### RAII 模式

```cpp
class FileHandle {
public:
    explicit FileHandle(const std::string& path)
        : handle_(std::fopen(path.c_str(), "r")) {
        if (!handle_) throw std::runtime_error("打开失败: " + path);
    }

    ~FileHandle() {
        if (handle_) std::fclose(handle_);
    }

    FileHandle(const FileHandle&) = delete;
    FileHandle& operator=(const FileHandle&) = delete;
    FileHandle(FileHandle&& other) noexcept
        : handle_(std::exchange(other.handle_, nullptr)) {}
    FileHandle& operator=(FileHandle&& other) noexcept {
        if (this != &other) {
            if (handle_) std::fclose(handle_);
            handle_ = std::exchange(other.handle_, nullptr);
        }
        return *this;
    }

private:
    std::FILE* handle_;
};
```

---

## 表达式与语句（ES.*）

### 初始化

```cpp
// ES.20 + ES.23 + ES.25：总是初始化，优先用 {}，默认为 const
const int max_retries{3};
const std::string name{"widget"};
const std::vector<int> primes{2, 3, 5, 7, 11};

// ES.28：用 Lambda 进行复杂的 const 初始化
const auto config = [&] {
    Config c;
    c.timeout = std::chrono::seconds{30};
    c.retries = max_retries;
    c.verbose = debug_mode;
    return c;
}();
```

---

## 错误处理（E.*）

### 异常层次结构

```cpp
// E.14 + E.15：自定义异常类型，按值抛出，按引用捕获
class AppError : public std::runtime_error {
public:
    using std::runtime_error::runtime_error;
};

class NetworkError : public AppError {
public:
    NetworkError(const std::string& msg, int code)
        : AppError(msg), status_code(code) {}
    int status_code;
};

void run() {
    try {
        fetch_data("https://api.example.com");
    } catch (const NetworkError& e) {
        log_error(e.what(), e.status_code);
    } catch (const AppError& e) {
        log_error(e.what());
    }
    // E.17：不要在这里捕获所有异常 -- 让意外错误传播
}
```

---

## 常量与不可变性（Con.*）

```cpp
class Sensor {
public:
    explicit Sensor(std::string id) : id_(std::move(id)) {}

    // Con.2：默认使用 const 成员函数
    const std::string& id() const { return id_; }
    double last_reading() const { return reading_; }

    // 仅在需要修改时使用非 const
    void record(double value) { reading_ = value; }

private:
    const std::string id_;  // Con.4：构造后永不改变
    double reading_{0.0};
};

// Con.3：按 const 引用传递
void display(const Sensor& s) {
    std::cout << s.id() << ": " << s.last_reading() << '\n';
}

// Con.5：编译时常量
constexpr double PI = 3.14159265358979;
constexpr int MAX_SENSORS = 256;
```

---

## 并发与并行（CP.*）

### 安全加锁

```cpp
// CP.20 + CP.44：RAII 锁，总是命名
class ThreadSafeQueue {
public:
    void push(int value) {
        std::lock_guard<std::mutex> lock(mutex_);  // CP.44：命名！
        queue_.push(value);
        cv_.notify_one();
    }

    int pop() {
        std::unique_lock<std::mutex> lock(mutex_);
        // CP.42：总是带条件等待
        cv_.wait(lock, [this] { return !queue_.empty(); });
        const int value = queue_.front();
        queue_.pop();
        return value;
    }

private:
    std::mutex mutex_;
    std::condition_variable cv_;
    std::queue<int> queue_;
};
```

### 多互斥锁

```cpp
// CP.21：std::scoped_lock 用于多互斥锁（无死锁）
void transfer(Account& from, Account& to, double amount) {
    std::scoped_lock lock(from.mutex_, to.mutex_);
    from.balance_ -= amount;
    to.balance_ += amount;
}
```

---

## 模板与泛型编程（T.*）

### 概念（Concepts，C++20）

```cpp
#include <concepts>

// T.10 + T.11：用标准概念约束模板
template<std::integral T>
T gcd(T a, T b) {
    while (b != 0) {
        a = std::exchange(b, a % b);
    }
    return a;
}

// T.13：简写概念语法
void sort(std::ranges::random_access_range auto& range) {
    std::ranges::sort(range);
}

// 自定义概念
template<typename T>
concept Serializable = requires(const T& t) {
    { t.serialize() } -> std::convertible_to<std::string>;
};
```

---

## 枚举（Enum.*）

```cpp
// Enum.3 + Enum.5：作用域枚举，不用 ALL_CAPS
enum class Color { red, green, blue };
enum class LogLevel { debug, info, warning, error };

// 错误：普通 enum 泄漏名称，ALL_CAPS 与宏冲突
enum { RED, GREEN, BLUE };           // 违规
#define MAX_SIZE 100                  // 违规 -- 使用 constexpr
```

---

## 标准库（SL.*）

```cpp
// SL.con.1 + SL.con.2：优先使用 vector/array 而非 C 数组
const std::array<int, 4> fixed_data{1, 2, 3, 4};
std::vector<std::string> dynamic_data;

// SL.str.1 + SL.str.2：string 拥有，string_view 观察
std::string build_greeting(std::string_view name) {
    return "Hello, " + std::string(name) + "!";
}

// SL.io.50：使用 '\n' 而非 endl
std::cout << "result: " << value << '\n';
```

---

## 命名规范

```cpp
// NL.8 + NL.10：一致的 underscore_style
namespace my_project {

constexpr int max_buffer_size = 4096;  // NL.9：不用 ALL_CAPS（它不是宏）

class tcp_connection {
public:
    void send_message(std::string_view msg);
    bool is_connected() const;

private:
    std::string host_;                 // 成员使用尾部下划线
    int port_;
};

}  // namespace my_project
```

---

## 快速参考清单

完成 C++ 工作前检查：

- [ ] 没有裸 `new`/`delete` -- 使用智能指针或 RAII（R.11）
- [ ] 对象在声明时初始化（ES.20）
- [ ] 变量默认为 `const`/`constexpr`（Con.1, ES.25）
- [ ] 成员函数尽可能为 `const`（Con.2）
- [ ] `enum class` 而非普通 `enum`（Enum.3）
- [ ] `nullptr` 而非 `0`/`NULL`（ES.47）
- [ ] 无窄化转换（ES.46）
- [ ] 无 C 风格强制转换（ES.48）
- [ ] 单参数构造函数声明为 `explicit`（C.46）
- [ ] 应用零规则或五规则（C.20, C.21）
- [ ] 模板使用概念约束（T.10）
- [ ] 头文件全局作用域无 `using namespace`（SF.7）
- [ ] 锁使用 RAII（`scoped_lock`/`lock_guard`）（CP.20）
- [ ] 异常是自定义类型，按值抛出，按引用捕获（E.14, E.15）
- [ ] `'\n'` 而非 `std::endl`（SL.io.50）
- [ ] 无魔法数字（ES.45）

---

**记住**：现代 C++ 强调安全性、清晰性和零开销抽象。遵循 C++ Core Guidelines 可以编写出更安全、更易维护的代码。

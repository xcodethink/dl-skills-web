# Go 模式

> 来源：[affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> 原始文件：skills/golang-patterns/SKILL.md + rules/golang/（coding-style, patterns, hooks, security, testing）+ agents/go-reviewer.md + agents/go-build-resolver.md + commands/go-review.md + commands/go-build.md + commands/go-test.md

---

## 何时激活

- 编写新的 Go 代码
- 审查 Go 代码
- 重构现有 Go 代码
- 设计 Go 包/模块

---

## 核心原则

### 1. 简洁与清晰（Simplicity and Clarity）

Go 崇尚简洁胜过聪明。代码应该显而易见、易于阅读。

```go
// 正确：清晰直接
func GetUser(id string) (*User, error) {
    user, err := db.FindUser(id)
    if err != nil {
        return nil, fmt.Errorf("get user %s: %w", id, err)
    }
    return user, nil
}

// 错误：过于巧妙
func GetUser(id string) (*User, error) {
    return func() (*User, error) {
        if u, e := db.FindUser(id); e == nil {
            return u, nil
        } else {
            return nil, e
        }
    }()
}
```

### 2. 让零值有用（Make the Zero Value Useful）

设计类型时确保零值可以立即使用，无需初始化。

```go
// 正确：零值可用
type Counter struct {
    mu    sync.Mutex
    count int // 零值为 0，可直接使用
}

// bytes.Buffer 零值可直接使用
var buf bytes.Buffer
buf.WriteString("hello")

// 错误：需要初始化
type BadCounter struct {
    counts map[string]int // nil map 会 panic
}
```

### 3. 接受接口，返回结构体（Accept Interfaces, Return Structs）

函数应该接受接口参数，返回具体类型。

```go
// 正确：接受接口，返回具体类型
func ProcessData(r io.Reader) (*Result, error) {
    data, err := io.ReadAll(r)
    if err != nil {
        return nil, err
    }
    return &Result{Data: data}, nil
}
```

---

## 编码风格

- **gofmt** 和 **goimports** 是强制性的 -- 没有风格争论
- 接口保持小型化（1-3 个方法）
- 始终用上下文包裹错误

```go
if err != nil {
    return fmt.Errorf("failed to create user: %w", err)
}
```

---

## 错误处理模式

### 带上下文的错误包裹

```go
func LoadConfig(path string) (*Config, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, fmt.Errorf("load config %s: %w", path, err)
    }

    var cfg Config
    if err := json.Unmarshal(data, &cfg); err != nil {
        return nil, fmt.Errorf("parse config %s: %w", path, err)
    }

    return &cfg, nil
}
```

### 自定义错误类型

```go
// 定义领域特定的错误
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation failed on %s: %s", e.Field, e.Message)
}

// 哨兵错误（Sentinel errors）用于常见情况
var (
    ErrNotFound     = errors.New("resource not found")
    ErrUnauthorized = errors.New("unauthorized")
    ErrInvalidInput = errors.New("invalid input")
)
```

### 使用 errors.Is 和 errors.As 检查错误

```go
func HandleError(err error) {
    // 检查特定错误
    if errors.Is(err, sql.ErrNoRows) {
        log.Println("未找到记录")
        return
    }

    // 检查错误类型
    var validationErr *ValidationError
    if errors.As(err, &validationErr) {
        log.Printf("字段 %s 验证错误: %s",
            validationErr.Field, validationErr.Message)
        return
    }
}
```

### 永远不要忽略错误

```go
// 错误：用空标识符忽略错误
result, _ := doSomething()

// 正确：处理或明确记录为什么可以安全忽略
result, err := doSomething()
if err != nil {
    return err
}

// 可接受：当错误真的不重要时（罕见）
_ = writer.Close() // 尽力清理，错误在其他地方记录
```

---

## 并发模式

### 工作池（Worker Pool）

```go
func WorkerPool(jobs <-chan Job, results chan<- Result, numWorkers int) {
    var wg sync.WaitGroup

    for i := 0; i < numWorkers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for job := range jobs {
                results <- process(job)
            }
        }()
    }

    wg.Wait()
    close(results)
}
```

### Context 用于取消和超时

```go
func FetchWithTimeout(ctx context.Context, url string) ([]byte, error) {
    ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
    defer cancel()

    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    if err != nil {
        return nil, fmt.Errorf("create request: %w", err)
    }

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return nil, fmt.Errorf("fetch %s: %w", url, err)
    }
    defer resp.Body.Close()

    return io.ReadAll(resp.Body)
}
```

### 优雅关闭（Graceful Shutdown）

```go
func GracefulShutdown(server *http.Server) {
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

    <-quit
    log.Println("正在关闭服务器...")

    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()

    if err := server.Shutdown(ctx); err != nil {
        log.Fatalf("服务器被迫关闭: %v", err)
    }

    log.Println("服务器已退出")
}
```

### errgroup 用于协调 Goroutine

```go
import "golang.org/x/sync/errgroup"

func FetchAll(ctx context.Context, urls []string) ([][]byte, error) {
    g, ctx := errgroup.WithContext(ctx)
    results := make([][]byte, len(urls))

    for i, url := range urls {
        i, url := i, url // 捕获循环变量
        g.Go(func() error {
            data, err := FetchWithTimeout(ctx, url)
            if err != nil {
                return err
            }
            results[i] = data
            return nil
        })
    }

    if err := g.Wait(); err != nil {
        return nil, err
    }
    return results, nil
}
```

### 避免 Goroutine 泄漏

```go
// 错误：如果上下文被取消会导致 goroutine 泄漏
func leakyFetch(ctx context.Context, url string) <-chan []byte {
    ch := make(chan []byte)
    go func() {
        data, _ := fetch(url)
        ch <- data // 没有接收者时永远阻塞
    }()
    return ch
}

// 正确：正确处理取消
func safeFetch(ctx context.Context, url string) <-chan []byte {
    ch := make(chan []byte, 1) // 带缓冲的 channel
    go func() {
        data, err := fetch(url)
        if err != nil {
            return
        }
        select {
        case ch <- data:
        case <-ctx.Done():
        }
    }()
    return ch
}
```

---

## 接口设计

### 小型、聚焦的接口

```go
// 正确：单方法接口
type Reader interface {
    Read(p []byte) (n int, err error)
}

// 按需组合接口
type ReadWriteCloser interface {
    Reader
    Writer
    Closer
}
```

### 在使用处定义接口

```go
// 在消费者包中，而非提供者包中
package service

// UserStore 定义此服务需要什么
type UserStore interface {
    GetUser(id string) (*User, error)
    SaveUser(user *User) error
}

type Service struct {
    store UserStore
}
```

---

## 函数选项模式（Functional Options Pattern）

```go
type Server struct {
    addr    string
    timeout time.Duration
    logger  *log.Logger
}

type Option func(*Server)

func WithTimeout(d time.Duration) Option {
    return func(s *Server) {
        s.timeout = d
    }
}

func WithLogger(l *log.Logger) Option {
    return func(s *Server) {
        s.logger = l
    }
}

func NewServer(addr string, opts ...Option) *Server {
    s := &Server{
        addr:    addr,
        timeout: 30 * time.Second, // 默认值
        logger:  log.Default(),    // 默认值
    }
    for _, opt := range opts {
        opt(s)
    }
    return s
}

// 用法
server := NewServer(":8080",
    WithTimeout(60*time.Second),
    WithLogger(customLogger),
)
```

---

## 包组织

### 标准项目布局

```
myproject/
├── cmd/
│   └── myapp/
│       └── main.go           # 入口点
├── internal/
│   ├── handler/              # HTTP 处理器
│   ├── service/              # 业务逻辑
│   ├── repository/           # 数据访问
│   └── config/               # 配置
├── pkg/
│   └── client/               # 公共 API 客户端
├── api/
│   └── v1/                   # API 定义（proto, OpenAPI）
├── testdata/                 # 测试固定数据
├── go.mod
├── go.sum
└── Makefile
```

### 包命名

```go
// 正确：简短、小写、无下划线
package http
package json
package user

// 错误：冗长、混合大小写或冗余
package httpHandler
package json_parser
package userService // 冗余的 'Service' 后缀
```

### 避免包级状态

```go
// 错误：全局可变状态
var db *sql.DB

func init() {
    db, _ = sql.Open("postgres", os.Getenv("DATABASE_URL"))
}

// 正确：依赖注入
type Server struct {
    db *sql.DB
}

func NewServer(db *sql.DB) *Server {
    return &Server{db: db}
}
```

---

## 内存与性能

### 已知大小时预分配切片

```go
// 错误：多次增长切片
func processItems(items []Item) []Result {
    var results []Result
    for _, item := range items {
        results = append(results, process(item))
    }
    return results
}

// 正确：单次分配
func processItems(items []Item) []Result {
    results := make([]Result, 0, len(items))
    for _, item := range items {
        results = append(results, process(item))
    }
    return results
}
```

### 使用 sync.Pool 处理频繁分配

```go
var bufferPool = sync.Pool{
    New: func() interface{} {
        return new(bytes.Buffer)
    },
}

func ProcessRequest(data []byte) []byte {
    buf := bufferPool.Get().(*bytes.Buffer)
    defer func() {
        buf.Reset()
        bufferPool.Put(buf)
    }()

    buf.Write(data)
    // 处理...
    return buf.Bytes()
}
```

### 避免在循环中拼接字符串

```go
// 错误：大量字符串分配
func join(parts []string) string {
    var result string
    for _, p := range parts {
        result += p + ","
    }
    return result
}

// 正确：使用 strings.Builder 单次分配
func join(parts []string) string {
    var sb strings.Builder
    for i, p := range parts {
        if i > 0 {
            sb.WriteString(",")
        }
        sb.WriteString(p)
    }
    return sb.String()
}

// 最佳：使用标准库
func join(parts []string) string {
    return strings.Join(parts, ",")
}
```

---

## Go 惯用法速查表

| 惯用法 | 描述 |
|--------|------|
| 接受接口，返回结构体 | 函数接受接口参数，返回具体类型 |
| 错误即值 | 将错误视为一等值，而非异常 |
| 不要通过共享内存通信 | 使用 channel 在 goroutine 间协调 |
| 让零值有用 | 类型应无需显式初始化即可工作 |
| 少量复制优于少量依赖 | 避免不必要的外部依赖 |
| 清晰优于聪明 | 优先考虑可读性 |
| gofmt 没人喜欢但人人的朋友 | 始终使用 gofmt/goimports 格式化 |
| 提前返回 | 先处理错误，保持正常路径不缩进 |

---

## 反模式

```go
// 错误：长函数中的裸返回
func process() (result int, err error) {
    // ... 50 行 ...
    return // 返回的是什么？
}

// 错误：使用 panic 做控制流
func GetUser(id string) *User {
    user, err := db.Find(id)
    if err != nil {
        panic(err) // 不要这样做
    }
    return user
}

// 错误：在结构体中传递 context
type Request struct {
    ctx context.Context // Context 应该作为第一个参数
    ID  string
}

// 正确：Context 作为第一个参数
func ProcessRequest(ctx context.Context, id string) error {
    // ...
}
```

---

## 附录A：Go 代码审查 Agent

> 来源：agents/go-reviewer.md

### 审查优先级

| 级别 | 检查项 |
|------|--------|
| **严重 -- 安全** | SQL 注入、命令注入、路径遍历、竞态条件、unsafe 包使用、硬编码密钥、不安全的 TLS |
| **严重 -- 错误处理** | 忽略错误（使用 `_`）、缺少错误包裹、用 panic 处理可恢复错误、缺少 errors.Is/As |
| **高 -- 并发** | goroutine 泄漏、无缓冲 channel 死锁、缺少 sync.WaitGroup、mutex 未使用 defer |
| **高 -- 代码质量** | 大函数（超过 50 行）、深嵌套（超过 4 层）、非惯用代码、包级变量、接口过度抽象 |
| **中 -- 性能** | 循环中字符串拼接、切片未预分配、N+1 查询、热路径中不必要的分配 |
| **中 -- 最佳实践** | context 应为第一个参数、表驱动测试、错误消息小写无标点、包名简短小写 |

### 诊断命令

```bash
go vet ./...
staticcheck ./...
golangci-lint run
go build -race ./...
go test -race ./...
govulncheck ./...
```

---

## 附录B：Go 构建错误解决器

> 来源：agents/go-build-resolver.md

### 常见修复模式

| 错误 | 原因 | 修复 |
|------|------|------|
| `undefined: X` | 缺少导入、拼写错误、未导出 | 添加导入或修正大小写 |
| `cannot use X as type Y` | 类型不匹配、指针/值 | 类型转换或解引用 |
| `X does not implement Y` | 缺少方法 | 用正确的接收者实现方法 |
| `import cycle not allowed` | 循环依赖 | 提取共享类型到新包 |
| `cannot find package` | 缺少依赖 | `go get pkg@version` 或 `go mod tidy` |
| `declared but not used` | 未使用的变量/导入 | 删除或使用空标识符 |

### 解决流程

```
1. go build ./...     -> 解析错误消息
2. 读取受影响文件     -> 理解上下文
3. 应用最小修复       -> 只做需要的
4. go build ./...     -> 验证修复
5. go vet ./...       -> 检查警告
6. go test ./...      -> 确保没有破坏
```

### 关键原则

- **只做手术式修复** -- 不要重构，只修复错误
- **永远不要**在没有明确批准的情况下添加 `//nolint`
- **永远不要**非必要地更改函数签名
- **总是**在添加/删除导入后运行 `go mod tidy`

---

## 附录C：Go TDD 测试模式

> 来源：commands/go-test.md

### 表驱动测试（Table-Driven Tests）

```go
func TestValidateEmail(t *testing.T) {
    tests := []struct {
        name    string
        email   string
        wantErr bool
    }{
        // 有效邮箱
        {"简单邮箱", "user@example.com", false},
        {"带子域名", "user@mail.example.com", false},

        // 无效邮箱
        {"空字符串", "", true},
        {"无 @ 符号", "userexample.com", true},
        {"无域名", "user@", true},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            err := ValidateEmail(tt.email)
            if tt.wantErr && err == nil {
                t.Errorf("ValidateEmail(%q) = nil; 期望错误", tt.email)
            }
            if !tt.wantErr && err != nil {
                t.Errorf("ValidateEmail(%q) = %v; 期望 nil", tt.email, err)
            }
        })
    }
}
```

### 并行测试

```go
for _, tt := range tests {
    tt := tt // 捕获循环变量
    t.Run(tt.name, func(t *testing.T) {
        t.Parallel()
        // 测试体
    })
}
```

### 测试辅助函数

```go
func setupTestDB(t *testing.T) *sql.DB {
    t.Helper()
    db := createDB()
    t.Cleanup(func() { db.Close() })
    return db
}
```

### 覆盖率目标

| 代码类型 | 目标 |
|----------|------|
| 关键业务逻辑 | 100% |
| 公共 API | 90%+ |
| 通用代码 | 80%+ |
| 生成的代码 | 排除 |

---

**记住**：Go 代码应该以最好的方式"无聊" -- 可预测、一致、易于理解。在不确定时，保持简单。

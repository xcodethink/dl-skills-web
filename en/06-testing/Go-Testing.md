# Go Testing Patterns

> **Source:** [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> **Original files:** skills/golang-testing/SKILL.md, commands/go-test.md, rules/golang/testing.md
> **Curated:** 2026-02-21

---

## Overview

Idiomatic Go testing patterns: table-driven tests, subtests, benchmarks, fuzzing (Go 1.18+), and coverage. Always run with `-race` flag.

---

## TDD Cycle

```go
// RED: Write failing test
func TestAdd(t *testing.T) {
    got := Add(2, 3)
    if got != 5 {
        t.Errorf("Add(2, 3) = %d; want 5", got)
    }
}

// GREEN: Minimal implementation
func Add(a, b int) int { return a + b }

// REFACTOR: Improve while green
```

---

## Table-Driven Tests

The standard Go testing pattern:

```go
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive", 2, 3, 5},
        {"negative", -1, -2, -3},
        {"zero", 0, 0, 0},
        {"mixed", -1, 1, 0},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got := Add(tt.a, tt.b)
            if got != tt.expected {
                t.Errorf("Add(%d, %d) = %d; want %d", tt.a, tt.b, got, tt.expected)
            }
        })
    }
}
```

### With Error Cases

```go
tests := []struct {
    name    string
    input   string
    want    *Config
    wantErr bool
}{
    {"valid", `{"host":"localhost"}`, &Config{Host: "localhost"}, false},
    {"invalid JSON", `{invalid}`, nil, true},
    {"empty", "", nil, true},
}
```

---

## Parallel Subtests

```go
for _, tt := range tests {
    tt := tt // Capture range variable
    t.Run(tt.name, func(t *testing.T) {
        t.Parallel()
        result := Process(tt.input)
        // assertions...
    })
}
```

---

## Test Helpers

```go
func setupTestDB(t *testing.T) *sql.DB {
    t.Helper()
    db, err := sql.Open("sqlite3", ":memory:")
    if err != nil {
        t.Fatalf("failed to open db: %v", err)
    }
    t.Cleanup(func() { db.Close() })
    return db
}

func assertEqual[T comparable](t *testing.T, got, want T) {
    t.Helper()
    if got != want {
        t.Errorf("got %v; want %v", got, want)
    }
}
```

---

## Golden Files

```go
var update = flag.Bool("update", false, "update golden files")

func TestRender(t *testing.T) {
    got := Render(input)
    golden := filepath.Join("testdata", name+".golden")

    if *update {
        os.WriteFile(golden, got, 0644)
    }

    want, _ := os.ReadFile(golden)
    if !bytes.Equal(got, want) {
        t.Errorf("mismatch:\ngot:\n%s\nwant:\n%s", got, want)
    }
}
```

---

## Interface-Based Mocking

```go
type UserRepository interface {
    GetUser(id string) (*User, error)
    SaveUser(user *User) error
}

type MockUserRepository struct {
    GetUserFunc  func(id string) (*User, error)
    SaveUserFunc func(user *User) error
}

func (m *MockUserRepository) GetUser(id string) (*User, error) {
    return m.GetUserFunc(id)
}

func TestUserService(t *testing.T) {
    mock := &MockUserRepository{
        GetUserFunc: func(id string) (*User, error) {
            if id == "123" { return &User{ID: "123", Name: "Alice"}, nil }
            return nil, ErrNotFound
        },
    }
    service := NewUserService(mock)
    user, err := service.GetUserProfile("123")
    // assertions...
}
```

---

## Benchmarks

```go
func BenchmarkProcess(b *testing.B) {
    data := generateTestData(1000)
    b.ResetTimer()
    for i := 0; i < b.N; i++ {
        Process(data)
    }
}
// Run: go test -bench=BenchmarkProcess -benchmem
```

### Size Variants

```go
func BenchmarkSort(b *testing.B) {
    for _, size := range []int{100, 1000, 10000} {
        b.Run(fmt.Sprintf("size=%d", size), func(b *testing.B) {
            data := generateRandomSlice(size)
            b.ResetTimer()
            for i := 0; i < b.N; i++ {
                tmp := make([]int, len(data))
                copy(tmp, data)
                sort.Ints(tmp)
            }
        })
    }
}
```

---

## Fuzzing (Go 1.18+)

```go
func FuzzParseJSON(f *testing.F) {
    f.Add(`{"name": "test"}`)
    f.Add(`[]`)

    f.Fuzz(func(t *testing.T, input string) {
        var result map[string]interface{}
        err := json.Unmarshal([]byte(input), &result)
        if err != nil { return }
        _, err = json.Marshal(result)
        if err != nil {
            t.Errorf("Marshal failed after Unmarshal: %v", err)
        }
    })
}
// Run: go test -fuzz=FuzzParseJSON -fuzztime=30s
```

---

## HTTP Handler Testing

```go
func TestHealthHandler(t *testing.T) {
    req := httptest.NewRequest(http.MethodGet, "/health", nil)
    w := httptest.NewRecorder()
    HealthHandler(w, req)

    resp := w.Result()
    if resp.StatusCode != http.StatusOK {
        t.Errorf("got %d; want 200", resp.StatusCode)
    }
}
```

---

## Coverage

```bash
go test -cover ./...                           # Basic
go test -coverprofile=coverage.out ./...       # Profile
go tool cover -html=coverage.out               # Browser
go tool cover -func=coverage.out               # By function
go test -race -coverprofile=coverage.out ./... # With race detection
```

| Code Type | Target |
|-----------|--------|
| Critical business logic | 100% |
| Public APIs | 90%+ |
| General code | 80%+ |
| Generated code | Exclude |

---

## Essential Commands

```bash
go test ./...                     # All tests
go test -v ./...                  # Verbose
go test -run TestAdd ./...        # Specific test
go test -run "TestUser/Create"    # Subtest pattern
go test -race ./...               # Race detection
go test -short ./...              # Short tests only
go test -bench=. -benchmem ./...  # Benchmarks
go test -count=10 ./...           # Detect flakiness
```

---

## Best Practices

**DO:** Write tests first (TDD), use table-driven tests, test behavior not implementation, use `t.Helper()`, use `t.Parallel()`, use `t.Cleanup()`, always run with `-race`

**DON'T:** Test private functions directly, use `time.Sleep()` in tests, ignore flaky tests, mock everything, skip error path testing

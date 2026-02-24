# Swift 模式

> 来源：[affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> 原始文件：skills/swift-actor-persistence/SKILL.md + skills/swift-protocol-di-testing/SKILL.md

---

## 何时激活

- 在 Swift 5.5+ 中构建数据持久化层
- 需要对共享可变状态进行线程安全访问
- 编写访问文件系统、网络或外部 API 的 Swift 代码
- 设计使用 Swift 并发（actors、结构化并发）的可测试架构

---

## 第一部分：Actor 实现线程安全持久化

### 核心模式：基于 Actor 的仓库

Actor 模型保证序列化访问 -- 没有数据竞争，由编译器强制执行。

```swift
public actor LocalRepository<T: Codable & Identifiable> where T.ID == String {
    private var cache: [String: T] = [:]
    private let fileURL: URL

    public init(directory: URL = .documentsDirectory, filename: String = "data.json") {
        self.fileURL = directory.appendingPathComponent(filename)
        // 初始化期间同步加载（actor 隔离尚未激活）
        self.cache = Self.loadSynchronously(from: fileURL)
    }

    // MARK: - 公共 API

    public func save(_ item: T) throws {
        cache[item.id] = item
        try persistToFile()
    }

    public func delete(_ id: String) throws {
        cache[id] = nil
        try persistToFile()
    }

    public func find(by id: String) -> T? {
        cache[id]
    }

    public func loadAll() -> [T] {
        Array(cache.values)
    }

    // MARK: - 私有方法

    private func persistToFile() throws {
        let data = try JSONEncoder().encode(Array(cache.values))
        try data.write(to: fileURL, options: .atomic)
    }

    private static func loadSynchronously(from url: URL) -> [String: T] {
        guard let data = try? Data(contentsOf: url),
              let items = try? JSONDecoder().decode([T].self, from: data) else {
            return [:]
        }
        return Dictionary(uniqueKeysWithValues: items.map { ($0.id, $0) })
    }
}
```

### 使用方式

所有调用因 actor 隔离而自动变为异步：

```swift
let repository = LocalRepository<Question>()

// 读取 -- 从内存缓存快速 O(1) 查找
let question = await repository.find(by: "q-001")
let allQuestions = await repository.loadAll()

// 写入 -- 更新缓存并原子写入文件
try await repository.save(newQuestion)
try await repository.delete("q-001")
```

### 结合 @Observable ViewModel

```swift
@Observable
final class QuestionListViewModel {
    private(set) var questions: [Question] = []
    private let repository: LocalRepository<Question>

    init(repository: LocalRepository<Question> = LocalRepository()) {
        self.repository = repository
    }

    func load() async {
        questions = await repository.loadAll()
    }

    func add(_ question: Question) async throws {
        try await repository.save(question)
        questions = await repository.loadAll()
    }
}
```

### 关键设计决策

| 决策 | 理由 |
|------|------|
| Actor（而非 class + 锁） | 编译器强制的线程安全，无需手动同步 |
| 内存缓存 + 文件持久化 | 从缓存快速读取，持久化写入磁盘 |
| 初始化时同步加载 | 避免异步初始化的复杂性 |
| 按 ID 索引的字典 | O(1) 标识符查找 |
| 泛型于 `Codable & Identifiable` | 可在任何模型类型上复用 |
| 原子文件写入（`.atomic`） | 防止崩溃时的部分写入 |

### Actor 最佳实践

- 对所有跨 actor 边界的数据使用 **`Sendable`** 类型
- **保持 actor 公共 API 最小化** -- 只暴露领域操作，不暴露持久化细节
- 使用 **`.atomic` 写入** 防止应用崩溃时的数据损坏
- **在 `init` 中同步加载** -- 异步初始化器对本地文件增加复杂性但收益很小
- 结合 **`@Observable`** ViewModel 进行响应式 UI 更新

### Actor 反模式

- 在新 Swift 并发代码中使用 `DispatchQueue` 或 `NSLock` 替代 actors
- 将内部缓存字典暴露给外部调用者
- 忘记所有 actor 方法调用都是 `await` -- 调用者必须处理异步上下文
- 使用 `nonisolated` 绕过 actor 隔离（违背了初衷）

---

## 第二部分：基于协议的依赖注入与测试

### 核心模式

### 1. 定义小型、聚焦的协议

每个协议处理一个外部关注点。

```swift
// 文件系统访问
public protocol FileSystemProviding: Sendable {
    func containerURL(for purpose: Purpose) -> URL?
}

// 文件读写操作
public protocol FileAccessorProviding: Sendable {
    func read(from url: URL) throws -> Data
    func write(_ data: Data, to url: URL) throws
    func fileExists(at url: URL) -> Bool
}

// 书签存储（如沙盒应用）
public protocol BookmarkStorageProviding: Sendable {
    func saveBookmark(_ data: Data, for key: String) throws
    func loadBookmark(for key: String) throws -> Data?
}
```

### 2. 创建默认（生产）实现

```swift
public struct DefaultFileSystemProvider: FileSystemProviding {
    public init() {}

    public func containerURL(for purpose: Purpose) -> URL? {
        FileManager.default.url(forUbiquityContainerIdentifier: nil)
    }
}

public struct DefaultFileAccessor: FileAccessorProviding {
    public init() {}

    public func read(from url: URL) throws -> Data {
        try Data(contentsOf: url)
    }

    public func write(_ data: Data, to url: URL) throws {
        try data.write(to: url, options: .atomic)
    }

    public func fileExists(at url: URL) -> Bool {
        FileManager.default.fileExists(atPath: url.path)
    }
}
```

### 3. 创建测试用的 Mock 实现

```swift
public final class MockFileAccessor: FileAccessorProviding, @unchecked Sendable {
    public var files: [URL: Data] = [:]
    public var readError: Error?
    public var writeError: Error?

    public init() {}

    public func read(from url: URL) throws -> Data {
        if let error = readError { throw error }
        guard let data = files[url] else {
            throw CocoaError(.fileReadNoSuchFile)
        }
        return data
    }

    public func write(_ data: Data, to url: URL) throws {
        if let error = writeError { throw error }
        files[url] = data
    }

    public func fileExists(at url: URL) -> Bool {
        files[url] != nil
    }
}
```

### 4. 使用默认参数注入依赖

生产代码使用默认值；测试注入 mock。

```swift
public actor SyncManager {
    private let fileSystem: FileSystemProviding
    private let fileAccessor: FileAccessorProviding

    public init(
        fileSystem: FileSystemProviding = DefaultFileSystemProvider(),
        fileAccessor: FileAccessorProviding = DefaultFileAccessor()
    ) {
        self.fileSystem = fileSystem
        self.fileAccessor = fileAccessor
    }

    public func sync() async throws {
        guard let containerURL = fileSystem.containerURL(for: .sync) else {
            throw SyncError.containerNotAvailable
        }
        let data = try fileAccessor.read(
            from: containerURL.appendingPathComponent("data.json")
        )
        // 处理数据...
    }
}
```

### 5. 使用 Swift Testing 编写测试

```swift
import Testing

@Test("同步管理器处理缺失容器")
func testMissingContainer() async {
    let mockFileSystem = MockFileSystemProvider(containerURL: nil)
    let manager = SyncManager(fileSystem: mockFileSystem)

    await #expect(throws: SyncError.containerNotAvailable) {
        try await manager.sync()
    }
}

@Test("同步管理器正确读取数据")
func testReadData() async throws {
    let mockFileAccessor = MockFileAccessor()
    mockFileAccessor.files[testURL] = testData

    let manager = SyncManager(fileAccessor: mockFileAccessor)
    let result = try await manager.loadData()

    #expect(result == expectedData)
}

@Test("同步管理器优雅处理读取错误")
func testReadError() async {
    let mockFileAccessor = MockFileAccessor()
    mockFileAccessor.readError = CocoaError(.fileReadCorruptFile)

    let manager = SyncManager(fileAccessor: mockFileAccessor)

    await #expect(throws: SyncError.self) {
        try await manager.sync()
    }
}
```

### 协议 DI 最佳实践

- **单一职责**：每个协议处理一个关注点 -- 不创建包含大量方法的"上帝协议"
- **Sendable 遵从**：跨 actor 边界使用协议时需要
- **默认参数**：让生产代码默认使用真实实现；只有测试需要指定 mock
- **错误模拟**：设计带有可配置错误属性的 mock 来测试失败路径
- **只 mock 边界**：Mock 外部依赖（文件系统、网络、API），不要 mock 内部类型

### 协议 DI 反模式

- 创建一个覆盖所有外部访问的大型协议
- Mock 没有外部依赖的内部类型
- 使用 `#if DEBUG` 条件编译替代正确的依赖注入
- 与 actors 一起使用时忘记 `Sendable` 遵从
- 过度工程化：如果一个类型没有外部依赖，它不需要协议

---

## 适用场景

- iOS/macOS 应用中的本地数据存储（用户数据、设置、缓存内容）
- 先离线架构，后续同步到服务器
- 应用多个部分并发访问的共享可变状态
- 用现代 Swift 并发替代基于 `DispatchQueue` 的线程安全方案
- 任何接触文件系统、网络或外部 API 的 Swift 代码
- 需要在应用、测试和 SwiftUI 预览上下文中工作的模块

---

**记住**：Swift 的 actor 模型和协议系统提供了编译时安全保证。利用这些语言特性来消除数据竞争并构建可测试的架构。

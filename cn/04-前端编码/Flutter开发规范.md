> 来源：[flutter/flutter](https://github.com/flutter/flutter) + [evanca/flutter-ai-rules](https://github.com/evanca/flutter-ai-rules) | 分类：前端编码 | ⭐ Flutter 官方

---
name: flutter-rules
description: Flutter official AI rules covering project structure, Dart best practices, widget composition, state management, routing, theming, accessibility, and testing.
---

# Flutter 开发规范（Flutter AI Rules）

## 概述

本技能整合了 Flutter 官方文档中的 AI 开发规范，涵盖应用架构、Dart 语言最佳实践、Widget 组合、状态管理、测试、常见错误处理以及代码审查等方面。所有规则均来源于 Flutter/Dart 官方文档及主流包的官方指南，无主观偏好，客观中立。

适用于在 AI 辅助 IDE（如 Cursor、Windsurf 等）中配置 Flutter 项目规则，确保 AI 生成的代码符合官方最佳实践。

---

## 一、Flutter 应用架构（App Architecture）

### 分层架构

1. 将功能分为 **UI 层**（表示层）、**数据层**（业务数据与逻辑），对于复杂应用，在 UI 和数据层之间添加 **领域层**（Domain/Logic Layer）来封装业务逻辑和用例（Use Cases）。
2. 可按功能组织代码：将每个功能所需的类归组到一起。例如 `auth/` 目录包含 `auth_viewmodel.dart`、`login_usecase.dart`、`login_screen.dart` 等。也可按类型组织或使用混合方式。
3. 仅允许相邻层之间通信：UI 层不应直接访问数据层，反之亦然。
4. 仅在业务逻辑复杂且不适合放在 UI 层或数据层时，才引入领域层。
5. 明确定义每一层和每个组件（Views、View Models、Repositories、Services）的职责、边界和接口。

### UI 层

6. 使用 **Views** 描述如何向用户呈现数据，保持逻辑最少且仅限 UI 相关。
7. 在用户交互时，从 Views 将事件传递给 View Models。
8. **View Models** 负责将应用数据转换为 UI 状态，并维护视图所需的当前状态。
9. 从 View Models 向 Views 暴露回调（Commands），从 Repositories 检索和转换数据。

### 数据层

10. 使用 **Repositories** 作为模型数据的单一数据源（SSOT），处理缓存、错误处理和数据刷新等业务逻辑。
11. 只有 SSOT 类（通常是 Repository）能够修改其数据，其他类只能读取。
12. Repositories 应将 Services 的原始数据转换为领域模型，输出供 View Models 消费的数据。
13. 使用 **Services** 封装 API 端点，暴露异步响应对象；Services 应隔离数据加载且不持有状态。
14. 使用**依赖注入**（Dependency Injection）为组件提供依赖，提高可测试性和灵活性。

### 数据流与状态

15. 遵循**单向数据流**：状态从数据层经逻辑层流向 UI 层，用户交互事件沿反方向流动。
16. 数据变更应始终在 SSOT（数据层）中发生，而不是在 UI 或逻辑层中。
17. UI 应始终反映当前（不可变的）状态；仅在状态变更时触发 UI 重建。

### 用例 / 交互器（Use Cases / Interactors）

18. 仅当逻辑复杂、被复用或需要合并多个 Repository 的数据时，才在领域层引入 Use Cases。
19. Use Cases 依赖 Repositories，可被多个 View Models 使用。

### 可扩展性与可测试性

20. 所有架构组件应有明确定义的输入和输出（接口）。
21. 优先使用依赖注入，以便在不更改消费者的情况下替换实现。
22. 通过 Mock Repositories 测试 View Models；独立于 Widget 测试 UI 逻辑。

### 最佳实践

23. 强烈推荐遵循**关注点分离**和**分层架构**。
24. 推荐使用 **MVVM** 作为默认模式，但可根据应用复杂度调整。
25. 使用键值存储处理简单数据（如配置、偏好），使用 SQL 存储处理复杂关系。
26. 使用**乐观更新**（Optimistic Updates）在操作完成前先更新 UI，提高感知响应速度。
27. 支持离线优先策略，在 Repositories 中组合本地和远程数据源，适时启用同步。
28. 对于小型不可变领域模型或数据模型，优先使用带有 `const` 构造函数和 `final` 字段的 `abstract class`，以提高可读性并强制不可变性。
29. 使用描述性常量名称标识资源和表名（例如使用 `_todoTableName` 而非简写前缀 `_kTableTodo`）。

---

## 二、Effective Dart 规则

### 命名约定

1. 在代码中始终如一地使用术语。
2. 类型参数遵循既有的助记约定（如 `E` 表示元素、`K`/`V` 表示键/值、`T`/`S`/`U` 表示泛型类型）。
3. 类型名称使用 `UpperCamelCase`（类、枚举、typedef、类型参数）。
4. 扩展（Extensions）使用 `UpperCamelCase`。
5. 包、目录和源文件使用 `lowercase_with_underscores`。
6. 导入前缀使用 `lowercase_with_underscores`。
7. 其他标识符使用 `lowerCamelCase`（变量、参数、命名参数）。
8. 超过两个字母的缩写词按单词首字母大写（如 `HttpClient`，不是 `HTTPClient`）。
9. 除非缩写比全称更常见，否则避免使用缩写。
10. 布尔类型属性/变量优先使用正面形式（如 `isEnabled` 而非 `isDisabled`）。
11. 非布尔属性/变量优先使用名词短语命名。
12. 布尔属性/变量优先使用非祈使动词短语命名。

### 类型与函数

13. 使用类修饰符（class modifiers）控制类是否可被继承或用作接口。
14. 对没有初始化器的变量添加类型注解。
15. 如果类型不明显，对字段和顶层变量添加类型注解。
16. 对函数声明注解返回类型和参数类型。
17. 对未推断的泛型调用写明类型参数。
18. 使用 `dynamic` 代替让推断失败。
19. 对不产生值的异步成员使用 `Future<void>` 作为返回类型。

### 代码风格

20. 使用 `dart format` 格式化代码。
21. 对所有流控制语句使用花括号。
22. 变量值不变时优先使用 `final` 而非 `var`。
23. 对编译时常量使用 `const`。
24. 行宽推荐 80 字符或更少以保持可读性。

### 导入与文件

25. 不要导入其他包 `src` 目录下的库。
26. 不要让导入路径进入或离开 `lib`。
27. 包内优先使用相对导入路径。
28. 导入路径中不使用 `/lib/` 或 `../`。

### 结构

29. 保持文件聚焦于单一职责。
30. 限制文件长度以保持可读性。
31. 将相关功能分组在一起。
32. 优先将字段和顶层变量设为 `final`。
33. 如果类支持，考虑将构造函数设为 `const`。
34. 优先将声明设为 `private`。

### 使用惯例

35. 尽可能使用集合字面量。
36. 使用 `whereType()` 按类型过滤集合。
37. 尽可能在声明处初始化字段。
38. 尽可能使用初始化形式参数（Initializing Formals）。
39. 空构造函数体使用 `;` 代替 `{}`。
40. 使用 `rethrow` 重新抛出已捕获的异常。
41. 如果重写了 `==`，也要重写 `hashCode`。
42. 优先使用特定异常处理：避免通用的 `catch (e)` 处理器；使用 `on SomeException catch (e, _)` 和 `.onError<T>` 而非宽泛的 `.catchError`/`catch` 块。

### 文档

43. 使用 `///` 文档注释记录成员和类型，不要使用块注释写文档。
44. 优先为公共 API 编写文档注释。
45. 文档注释以单句摘要开头，并将其分为独立段落。
46. 在文档注释中使用方括号引用作用域内的标识符。
47. 使用散文解释参数、返回值和异常。
48. 文档注释放在元数据注解之前。
49. 记录代码存在的原因或使用方式，而不仅仅是做了什么。

---

## 三、Dart 3 新特性

### 分支（Branches）

1. 使用 `if-case` 语句匹配和解构单个模式：
```dart
if (pair case [int x, int y]) {
  print('坐标：$x, $y');
}
```
2. 使用 `switch` 语句/表达式匹配多个模式，每个 `case` 可使用任意模式。
3. `switch` 中匹配成功后自动跳出，不需要 `break`。
4. 使用逻辑或模式（`case a || b`）在 case 之间共享主体或守卫。
5. 使用 `switch` 表达式生成值：省略 `case`，使用 `=>` 作为主体，逗号分隔各 case。
6. Dart 检查 `switch` 的穷举性，未覆盖所有可能值会报编译时错误。
7. 对类使用 `sealed` 修饰符可在 switch 其子类型时启用穷举性检查。
8. 使用 `when` 为 `case` 添加守卫子句进一步约束匹配条件。

### 模式（Patterns）

9. 模式是表示值形状的语法类别，用于匹配和解构。
10. 模式可用于：局部变量声明/赋值、for/for-in 循环、if-case 和 switch-case。
11. 模式变量声明：`var (a, [b, c]) = ('str', [1, 2]);`
12. 模式变量赋值可用于交换值：`(b, a) = (a, b);`
13. 对象模式匹配命名对象类型并使用 getter 解构：`var Foo(:one, :two) = myFoo;`
14. 模式简化了复杂数据结构（如 JSON）的验证和解构：
```dart
if (data case {'user': [String name, int age]}) {
  print('$name 的年龄是 $age');
}
```

### 模式类型

15. 逻辑或模式（`pattern1 || pattern2`）：任一分支匹配即成功，所有分支必须绑定相同变量集。
16. 逻辑与模式（`pattern1 && pattern2`）：两个子模式都匹配才成功。
17. 关系模式（`==`, `!=`, `<`, `>`, `<=`, `>=`）：与常量比较。可与逻辑与组合用于数值范围。
18. 类型转换模式（`subpattern as Type`）：断言并转换类型后传递给子模式。
19. 空值检查模式（`subpattern?`）：值不为 null 时匹配。
20. 列表模式（`[subpattern1, subpattern2]`）：按位置匹配和解构列表元素。
21. 映射模式（`{"key": subpattern}`）：按键匹配和解构 Map。
22. 记录模式（`(subpattern1, subpattern2)`）：按形状匹配和解构记录。
23. 通配符模式（`_`, `Type _`）：匹配任意值但不绑定。

### 记录（Records）

24. 记录是匿名的、不可变的、聚合类型，将多个对象打包为单个值。
25. 记录是固定大小、异构、强类型的。每个字段可以有不同类型。
26. 记录表达式使用圆括号，含逗号分隔的位置字段和/或命名字段：
```dart
var record = ('first', a: 2, b: true, 'last');
```
27. 记录字段通过内置 getter 访问：位置字段为 `$1`、`$2`；命名字段按名称访问。
28. 记录是结构化类型，自动定义 `hashCode` 和 `==`。
29. 使用记录实现函数返回多个值，并用模式匹配解构：
```dart
var (name, age) = userInfo(json);
final (:name, :age) = userInfo(json);  // 命名字段解构
```
30. 记录适合简单的不可变数据聚合；需要抽象、封装和行为时使用类。

---

## 四、Widget 与性能

### Widget 最佳实践

1. 将可复用 Widget 提取为独立组件。
2. 尽可能使用 `StatelessWidget`。
3. 保持 `build` 方法简洁且聚焦。
4. 避免不必要的 `StatefulWidget`。
5. 保持状态尽可能局部化。

### 性能优化

6. 尽可能使用 `const` 构造函数。
7. 避免在 `build` 方法中执行昂贵操作。
8. 对大型列表实现分页。

---

## 五、常见 Flutter 错误

1. **"RenderFlex overflowed"** — 检查 `Row` 或 `Column` 是否包含未约束的 Widget。使用 `Flexible`、`Expanded` 包裹子组件或设置约束。
2. **"Vertical viewport was given unbounded height"** — 确保 `Column` 内的 `ListView` 等滚动 Widget 有有界高度（如用 `Expanded` 或 `SizedBox` 包裹）。
3. **"An InputDecorator...cannot have an unbounded width"** — 使用 `Expanded`、`SizedBox` 或将 `TextField` 等 Widget 放入有宽度约束的父级中。
4. **"setState called during build"** — 不要在 `build` 方法内直接调用 `setState` 或 `showDialog`。在用户操作响应中或构建完成后触发（如使用 `addPostFrameCallback`）。
5. **"The ScrollController is attached to multiple scroll views"** — 确保每个 `ScrollController` 同一时间只附着到一个可滚动 Widget。
6. **"RenderBox was not laid out"** — 检查 Widget 树中缺失或无界的约束，常由 `ListView` 或 `Column` 没有正确尺寸约束导致。
7. 使用 Flutter Inspector 和审查 Widget 约束来调试布局问题。

---

## 六、状态管理

### ChangeNotifier（Flutter 内置）

1. 将共享状态放在 Widget 树中使用它的 Widget 之上，以启用正确的重建。
2. 使用继承 `ChangeNotifier` 的模型类管理状态并通知监听器。

```dart
class CartModel extends ChangeNotifier {
  final List<Item> _items = [];
  UnmodifiableListView<Item> get items => UnmodifiableListView(_items);

  void add(Item item) {
    _items.add(item);
    notifyListeners();
  }
}
```

3. 保持模型内部状态为私有，向 UI 暴露不可修改的视图。
4. 状态变更时调用 `notifyListeners()` 触发 UI 重建。
5. 使用 `ChangeNotifierProvider` 向需要的 Widget 子树提供模型。
6. 使用 `Consumer<T>` 包裹依赖模型状态的 Widget，仅在相关数据变更时重建。
7. 将 `Consumer` 放在 Widget 树中尽可能深的位置以最小化重建范围。
8. 使用 `Provider.of<T>(context, listen: false)` 访问模型进行操作但不触发重建。

### Provider

9. 使用 `Provider`、`ChangeNotifierProvider`、`FutureProvider`、`StreamProvider` 暴露值和管理状态。
10. 始终为 `Provider`、`Consumer`、`context.watch`、`context.read`、`context.select` 指定泛型类型。
11. 使用 `MultiProvider` 分组多个 Provider，避免深度嵌套。
12. 使用 `context.watch<T>()` 监听变化并重建，`context.read<T>()` 一次性访问（如在回调中），`context.select<T, R>()` 监听 `T` 的特定部分。
13. 不要在 `initState` 或构造函数中获取 Provider；在 `build`、回调或组件完全挂载后的生命周期方法中使用。

### Bloc/Cubit

14. 简单状态管理使用 `Cubit`（无事件）；复杂的事件驱动状态管理使用 `Bloc`。
15. 事件命名使用过去时（如 `LoginButtonPressed`、`UserProfileLoaded`）。
16. 状态命名为名词，使用格式：`BlocSubject` + `Initial`/`Success`/`Failure`/`InProgress`。
17. 所有状态类继承 `Equatable` 以启用值相等性，使用 `@immutable` 注解强制不可变性。
18. 实现 `copyWith` 方法方便状态更新。
19. 使用 `BlocBuilder` 根据状态变化重建 Widget，`BlocListener` 执行副作用（导航、对话框等），`BlocConsumer` 同时需要两者时使用。
20. 使用 `BlocProvider` 通过依赖注入向子树提供 Bloc。
21. 使用 `context.read<T>()` 在回调中访问 Bloc，`context.watch<T>()` 在 `build` 方法中监听变化。
22. 将 Repositories 通过构造函数注入 Bloc；Bloc 不应直接访问 Data Providers。
23. 避免 Bloc 间直接通信以防止紧耦合。

### Riverpod

24. 在应用根部使用 `ProviderScope` 包裹整个应用。
25. Provider 变量定义为 `final` 并放在顶层（全局作用域）。
26. 使用 `ref.watch` 响应式监听其他 Provider，`ref.read` 一次性访问，`ref.listen` 命令式订阅，`ref.onDispose` 清理资源。

```dart
class MyWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final value = ref.watch(myProvider);
    return Text('$value');
  }
}
```

27. 代码生成默认状态在 Provider 不再被监听一帧后销毁；使用 `keepAlive: true` 阻止自动销毁。
28. 对接收参数的 Provider 始终启用 `autoDispose` 以防内存泄漏。
29. 使用 `Notifier`/`AsyncNotifier` 暴露执行副作用的方法并修改 Provider 状态。
30. 使用 Provider "families"（`.family`）向 Provider 传递参数；每个参数组合独立缓存。
31. 安装并使用 `riverpod_lint` 启用 IDE 重构和最佳实践检查。

---

## 七、测试

### 通用原则

1. 为业务逻辑编写单元测试。
2. 为 UI 组件编写 Widget 测试。
3. 目标是良好的测试覆盖率。
4. 审视测试时自问："如果真实代码出错，这个测试实际上能失败吗？" 避免编写仅测试 mock/fake 行为的测试。
5. 避免编写仅确认语言或标准库保证行为的测试。
6. 始终在测试文件中使用 `group()`，以被测类命名。
7. 使用 "should" 命名测试用例以清楚描述预期行为：`test('value should start at 0', () {...})`。

### Mocktail 测试规则

8. 需要轻量自定义实现时使用 `Fake`，需要验证交互或动态 stub 时使用 `Mock`。
9. 使用 `registerFallbackValue` 为参数匹配器中使用的自定义类型注册默认值。
10. 使用 `when(() => mock.method()).thenReturn(value)` 进行 stub，`verify(() => mock.method())` 验证调用。
11. 优先使用真实对象；其次使用经过测试的 Fake 实现；最后才使用 Mock。
12. 仅在测试断言交互（调用 `verify`）时使用 Mock。

### Mockito 测试规则

13. 使用 `@GenerateMocks` 或 `@GenerateNiceMocks` 生成 Mock 类，运行 `dart run build_runner build`。
14. 使用 `when(mock.method()).thenReturn(value)` 进行 stub，`thenAnswer` 计算运行时响应。
15. 使用 `captureAny` 和 `captureThat` 捕获传递给 Mock 的参数用于后续断言。
16. 数据模型如果可以用 stub 数据构造，就不应该被 Mock。

### Bloc 测试

17. 将 `test` 和 `bloc_test` 包添加到开发依赖中。
18. 为每个 Bloc 创建专用测试文件。
19. 使用 `setUp` 初始化 Bloc 实例，`tearDown` 清理。
20. 使用 `blocTest` 函数测试 Bloc 状态转换：
```dart
blocTest<CounterBloc, int>(
  'emits [1] when CounterIncrementPressed is added',
  build: () => CounterBloc(),
  act: (bloc) => bloc.add(CounterIncrementPressed()),
  expect: () => [1],
);
```

### Riverpod 测试

21. 单元测试使用 `ProviderContainer`，Widget 测试使用 `ProviderScope`，每个测试创建新实例避免共享状态。
22. 使用 `overrides` 参数注入 Mock 或 Fake。
23. 优先 Mock 依赖（如 Repositories）而非直接 Mock Notifiers。

---

## 八、代码审查规范

1. 检查当前分支是功能（feature）/修复（bugfix）/PR 分支，而非 main 或 develop 分支。
2. 验证分支已与目标分支保持最新。
3. 对每个变更文件检查：文件位置正确、文件名符合命名约定、职责清晰。
4. 审查代码可读性，确保变量/函数/类名描述性且一致。
5. 检查逻辑正确性，确保无逻辑错误或遗漏的边界情况。
6. 检查代码模块化，无不必要的重复。
7. 确保错误和异常处理得当。
8. 检查安全性问题（输入验证、代码中的敏感信息等）。
9. 检查明显的性能问题。
10. 验证公共 API、复杂逻辑和新模块有文档。
11. 确保新/变更的逻辑有足够的测试覆盖。
12. 验证变更集聚焦于声明的目的，不包含无关变更。
13. 尽量客观合理，不默认赞美或批评；采用**魔鬼代言人**方式给出真诚、深思熟虑的反馈。

---

## 附录：Firebase 集成（参考）

本仓库还包含详细的 Firebase 集成规则，涵盖以下服务：
- FlutterFire 配置（多环境/Flavor 支持）
- Firebase Auth（认证）
- Cloud Firestore（文档数据库）
- Firebase Realtime Database
- Cloud Functions
- Firebase Storage
- Firebase Messaging（推送通知）
- Firebase Crashlytics（崩溃报告）
- Firebase Analytics（分析）
- Firebase App Check（安全检查）
- Firebase Remote Config（远程配置）
- Firebase In-App Messaging（应用内消息）
- Firebase Data Connect
- Firebase AI

详细规则请参考原始仓库 `rules/firebase/` 目录。

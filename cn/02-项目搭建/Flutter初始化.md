> 来源：[bear2u/my-skills](https://github.com/bear2u/my-skills) | 分类：A-项目初始化

# Flutter 初始化技能（Flutter Init Skill）

基于领域（Domain）创建 Flutter 项目，并自动配置现代化架构。
可选择 Todo、Habit、Note、Expense 或自定义领域，立即生成基于 Clean Architecture 的完整 CRUD 应用。

## 快速开始

技能执行时需要输入以下信息：
- 文件夹名（如：my_habit_app）
- 项目名/包名（如：habit_app）
- 领域选择（Todo/Habit/Note/Expense/Custom）
- 技术栈预设（Minimal/Essential/Full Stack/Custom）

之后将自动执行以下步骤：

```bash
# 1. 创建项目（Android/Kotlin, iOS/Swift）
flutter create --platforms android,ios --android-language kotlin --org com.example [文件夹名]

# 2. 安装依赖包
flutter pub get

# 3. 按领域自动生成 Clean Architecture 代码
# - domain/entities/[domain].dart（Freezed 实体）
# - data/datasources/local/app_database.dart（Drift 数据表）
# - data/repositories/[domain]_repository_impl.dart（Repository 实现）
# - presentation/providers/[domain]_providers.dart（Riverpod 3.0）
# - presentation/screens/*（列表/详情/表单 页面）

# 4. 代码生成（Freezed, Drift, JSON Serializable）
dart run build_runner build --delete-conflicting-outputs

# 5. 代码检查及自动修复（必须）
flutter analyze

# 6. 运行应用
flutter run
```

## 任务指引

**重要**：本技能以对话方式进行。

### 第一步：询问领域与项目配置

**首先向用户询问：**

"即将创建 Flutter 应用。请提供以下信息：

**1. 领域（实体）选择**

您想创建哪种领域的应用？

**A) Todo（待办事项管理）**
- 字段：title, description, isCompleted, createdAt, completedAt
- 功能：CRUD、筛选（全部/进行中/已完成）、复选框切换

**B) Habit（习惯追踪）**
- 字段：name, description, frequency(daily/weekly/monthly), streak, lastCompletedAt, goal, isActive
- 功能：CRUD、连续记录追踪、目标达成率、完成打卡

**C) Note（备忘录）**
- 字段：title, content, tags, isPinned, createdAt, updatedAt
- 功能：CRUD、标签筛选、置顶备忘、搜索

**D) Expense（支出管理）**
- 字段：amount, category, description, date, paymentMethod
- 功能：CRUD、按类别汇总、按月统计、筛选

**E) Custom（自定义）**
- 自行输入实体名称和字段

**2. 项目信息**
- **文件夹名**：项目创建目录名称（默认：[领域]_app，如：habit_app）
  - Flutter 项目将在此文件夹中创建
- **项目名（包名）**：Flutter 包名称（默认与文件夹名相同）
  - 用于 pubspec.yaml 的 name 字段
  - 用于 import 语句（如：package:habit_app/...）
- **组织名**：（默认：com.example）
  - 用于 Android/iOS 包标识符（如：com.example.habit_app）

**3. 技术栈预设选择**

请选择以下选项之一：

**A) Essential（推荐）**
- GoRouter（类型安全路由）
- SharedPreferences（本地设置存储）
- FPDart（函数式错误处理）
- Google Fonts
- FluentUI Icons
- 不含认证系统
- 不含 Responsive Utils

**B) Minimal（最简配置）**
- 不含 GoRouter（使用默认 Navigator）
- SharedPreferences
- 不含 FPDart
- 不含 Google Fonts
- 基础 FluentUI Icons
- 不含认证系统
- 不含 Responsive Utils

**C) Full Stack（全功能）**
- GoRouter
- SharedPreferences
- FPDart（函数式错误处理）
- Google Fonts
- Responsive Utils
- FluentUI Icons
- 认证系统（Login/Register）- 根据所选领域

**D) Custom（自定义选择）**
- 逐一选择各项功能

请选择领域和预设。（领域：A/B/C/D/E，预设：A/B/C/D）"

### 第二步：自定义选项的追加询问

#### 2-1. 选择自定义领域（E）时：

1. **实体名**：请输入实体名称（如：Task, Event, Book）
2. **字段定义**：请输入各字段（格式：字段名:类型，如：title:String, amount:double, isActive:bool）
   - 支持类型：String, int, double, bool, DateTime
   - createdAt, updatedAt 将自动添加
3. **主要功能**：请选择用于筛选/排序的字段

#### 2-2. 选择自定义技术栈预设（D）时：

依次询问以下问题：

1. **导航**：是否使用 GoRouter？（是/否）
2. **错误处理**：是否使用 FPDart？（是/否）
3. **UI**：是否使用 Google Fonts？（是/否）
4. **响应式**：是否包含 Responsive Utils？（是/否）
5. **认证系统**：是否包含 Auth 系统？（是/否）

### 第三步：根据所选领域和技术栈生成项目

1. **创建 Flutter 项目**：
   - 使用用户指定的**文件夹名**创建项目
   - 命令：`flutter create --platforms android,ios --android-language kotlin --org [组织名] [文件夹名]`
   - 示例：`flutter create --platforms android,ios --android-language kotlin --org com.example my_habit_app`
   - 若文件夹名与项目名（包名）不同，创建后修改 pubspec.yaml 的 `name` 字段
2. **检查 Kotlin DSL**（最新 Flutter 自动使用 Kotlin DSL）
3. **安装所选依赖包**：更新 `pubspec.yaml` 后执行 `flutter pub get`
4. **生成文件夹结构**：Clean Architecture（core, data, domain, presentation）
5. **按领域生成样板代码**：

   **A) Todo**：title, description, isCompleted, createdAt, completedAt
   - Repository：getTodos, createTodo, updateTodo, toggleCompletion, deleteTodo
   - Providers：filteredTodosProvider（all/pending/completed）
   - UI：TodoListScreen（筛选）、TodoDetailScreen、TodoFormDialog

   **B) Habit**：name, description, frequency, streak, lastCompletedAt, goal, isActive
   - Repository：getHabits, createHabit, updateHabit, completeHabit, deleteHabit
   - Providers：filteredHabitsProvider（active/inactive）、habitStatsProvider
   - UI：HabitListScreen（统计）、HabitDetailScreen、HabitFormDialog

   **C) Note**：title, content, tags, isPinned, createdAt, updatedAt
   - Repository：getNotes, createNote, updateNote, togglePin, deleteNote
   - Providers：filteredNotesProvider（pinned/all/byTag）、searchProvider
   - UI：NoteListScreen（搜索/标签）、NoteDetailScreen、NoteFormDialog

   **D) Expense**：amount, category, description, date, paymentMethod
   - Repository：getExpenses, createExpense, updateExpense, deleteExpense
   - Providers：expensesByCategory、monthlyStats、filteredExpenses
   - UI：ExpenseListScreen（统计）、ExpenseDetailScreen、ExpenseFormDialog

   **E) Custom**：用户自定义字段
   - Repository：基础 CRUD 方法
   - Providers：基础 list provider
   - UI：基础 List/Detail/Form 页面

6. **生成配置文件**（路由、存储、多语言等）
7. **更新 Android 配置**（flutter_local_notifications 关键配置）：
   - 在 `android/app/build.gradle.kts` 中启用 core library desugaring：
     ```kotlin
     android {
         compileOptions {
             sourceCompatibility = JavaVersion.VERSION_11
             targetCompatibility = JavaVersion.VERSION_11
             isCoreLibraryDesugaringEnabled = true  // 添加
         }
     }
     dependencies {
         coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:2.0.4")  // 添加
     }
     ```
8. **代码生成**：`dart run build_runner build --delete-conflicting-outputs`
9. **代码检查及错误修复**：

   a. 执行 `flutter analyze`

   b. 修复发现的错误：
   - **Freezed 3.0 兼容性**（关键）：所有 Freezed 实体必须使用 `sealed class`
     - 错误写法：`class User with _$User`
     - 正确写法：`sealed class User with _$User`
   - **主题设置**：使用 `CardThemeData` 替代 `CardTheme`（已废弃）
   - **API Client Map 类型**：返回 `Map<String, dynamic>` 时需检查生成代码
     - retrofit_generator 生成的 `dynamic.fromJson` 错误需修复
   - **修改 import 路径**：将所有相对路径改为 `package:` 格式
     - 示例：`import '../../domain/entities/todo.dart';` 改为 `import 'package:todo_app/domain/entities/todo.dart';`
   - **检查依赖包**：补充缺失的包（如：`shared_preferences`）
   - **Riverpod 3.0 兼容性**：`StateNotifier` 改为 `Notifier`，`StateProvider` 改为 `NotifierProvider`
   - **FluentUI 图标名称确认**：不存在的图标需替换
   - **类型安全**：使用 switch expression，遵循 null safety

   c. 重新检查：循环直到所有 error 级别错误清零

   d. 目标：`flutter analyze` 结果为 "0-1 issues found"（仅允许 info 级别）

   **关键**：此步骤为必须。所有 error 必须清除后才能进入下一步。

### 第四步：最终验证与说明

**关键**：此步骤是项目完成的必要条件。

1. **执行最终分析**：
   ```bash
   flutter analyze
   ```

2. **成功标准**：
   - 成功示例：
     ```
     Analyzing todo_app...
     No issues found!
     ```
     或
     ```
     Analyzing todo_app...
     1 issue found. (ran in 2.3s)
     info - Prefer using lowerCamelCase for constant names - lib/core/constants.dart:5:7 - constant_identifier_names
     ```

   - 失败示例（有 error 必须修复）：
     ```
     error - Target of URI doesn't exist: 'package:...' - lib/main.dart:5:8 - uri_does_not_exist
     error - The getter 'xyz' isn't defined for the type 'ABC' - lib/presentation/screens/home.dart:42:15
     ```

3. **验证结果摘要**（成功时）：
   ```
   Flutter 项目创建完成！
   代码生成完成（Freezed, Drift, JSON Serializable）
   Flutter analyze 通过（0-1 issues found，仅 info 级别）
   所有依赖包安装完成
   ```

4. **提供项目信息**：
   - **文件夹名**：[用户输入值]（如：my_habit_app）
   - **项目名（包名）**：[用户输入值]（如：habit_app）
   - **组织名**：[用户输入值]（如：com.example）
   - **领域**：[所选领域]（Todo/Habit/Note/Expense/Custom）
   - **所选技术栈**：[预设名]（GoRouter, Drift, FPDart 等）
   - **主要功能**：[领域] CRUD、多语言支持、本地存储等
   - **生成文件**：XX 个 Dart 文件（core, data, domain, presentation）

5. **运行说明**：
   ```bash
   cd [文件夹名]
   flutter run
   ```

6. **后续步骤建议**（可选，按领域）：
   - **Todo**：添加/编辑/删除项目、筛选（全部/进行中/已完成）、完成切换
   - **Habit**：习惯记录、连续天数确认、目标达成率、查看统计
   - **Note**：编写/编辑备忘录、添加标签、置顶备忘、搜索
   - **Expense**：记录支出、按类别统计、按月汇总、筛选
   - **通用**：语言切换（英语 <-> 韩语）、深色/浅色主题切换

## 核心原则

- **Repository 模式**：分离数据层与领域层
- **依赖注入**：通过 Riverpod 3.x 管理依赖
- **不可变性**：使用 Freezed 创建不可变模型
- **多语言支持**：通过 Easy Localization 实现 i18n
- **现代 UI**：使用 FluentUI Icons

## 参考文件

[references/setup-guide.md](references/setup-guide.md) - 完整指南
- 基础设置（按领域 CRUD、多语言、FluentUI Icons）
- 可选选项：GoRouter、Auth、FPDart、Google Fonts、Responsive Utils、包更新

## 备注

- **对话式技能**：通过让用户选择领域和预设来定制应用配置
- **领域支持**：Todo、Habit、Note、Expense、Custom（用户自定义）
- **预设提供**：Full Stack、Essential、Minimal、Custom
- **可选功能**：GoRouter、Auth、FPDart、Google Fonts、Responsive Utils
- **默认包含**：Riverpod 3.x、Easy Localization、FluentUI Icons、Drift、Dio、SharedPreferences
- **多语言**：英语/韩语（可扩展）
- **平台**：Android/Kotlin、iOS/Swift（不含 Web/Windows/Linux）
- **质量保证**：
  - 所有项目必须通过 `flutter analyze`
  - 遵循 package: imports 风格
  - 保证类型安全
  - 自动化代码生成
  - 按领域优化的 UI/UX

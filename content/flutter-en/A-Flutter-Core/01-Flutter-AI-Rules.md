> Source: [flutter/flutter](https://github.com/flutter/flutter) + [evanca/flutter-ai-rules](https://github.com/evanca/flutter-ai-rules) | Category: Frontend | ⭐ Flutter Official

---
name: flutter-rules
description: Flutter official AI rules covering project structure, Dart best practices, widget composition, state management, routing, theming, accessibility, and testing.
---

# Flutter AI Rules

## Overview

A comprehensive, non-opinionated collection of Flutter development rules sourced entirely from official documentation (Flutter, Dart, and major package docs). Designed for AI-powered IDEs (Cursor, Windsurf, etc.) to ensure generated code follows official best practices.

Covers: app architecture, Dart language rules, Dart 3 features, widget composition, state management (ChangeNotifier, Provider, Bloc, Riverpod), testing (Mocktail, Mockito), common errors, and code review.

---

## 1. App Architecture

### Layered Architecture

1. Separate features into a **UI Layer** (presentation), a **Data Layer** (business data and logic), and optionally a **Domain Layer** for complex business logic.
2. Organize code by feature (e.g., `auth/` containing viewmodel, use cases, screens) or by type, or use a hybrid approach.
3. Only allow communication between adjacent layers.
4. Define clear responsibilities, boundaries, and interfaces for each layer and component (Views, View Models, Repositories, Services).

### UI Layer

5. **Views** describe how to present data; keep logic minimal and UI-related only.
6. Pass events from Views to View Models in response to user interactions.
7. **View Models** convert app data into UI state and maintain view-needed state.
8. Expose callbacks (commands) from View Models to Views.

### Data Layer

9. **Repositories** are the single source of truth (SSOT) for model data; handle caching, error handling, and data refresh.
10. Only the SSOT class can mutate its data; all others read from it.
11. Repositories transform raw service data into domain models consumed by View Models.
12. **Services** wrap API endpoints, expose async response objects, isolate data-loading, hold no state.
13. Use **dependency injection** for testability and flexibility.

### Data Flow

14. Follow unidirectional data flow: state flows data -> logic -> UI; events flow UI -> logic -> data.
15. Data changes happen in the SSOT only. UI always reflects current immutable state.

### Best Practices

16. Use MVVM as default pattern; adapt for complexity.
17. Use optimistic updates to improve perceived responsiveness.
18. Support offline-first by combining local and remote data sources in repositories.
19. For small immutable models, prefer `abstract class` with `const` constructors and `final` fields.
20. Use descriptive constant names (e.g., `_todoTableName` not `_kTableTodo`).

---

## 2. Effective Dart

### Naming

1. Use `UpperCamelCase` for types (classes, enums, typedefs, type parameters, extensions).
2. Use `lowercase_with_underscores` for packages, directories, source files, import prefixes.
3. Use `lowerCamelCase` for other identifiers (variables, parameters).
4. Capitalize acronyms longer than two letters like words (e.g., `HttpClient`).
5. Prefer positive form for booleans (`isEnabled` not `isDisabled`).

### Types and Functions

6. Type annotate variables without initializers and fields where type isn't obvious.
7. Annotate return types and parameter types on function declarations.
8. Use `Future<void>` for async members that produce no values.
9. Use class modifiers to control extensibility/interface usage.

### Style

10. Format code using `dart format`.
11. Use curly braces for all flow control statements.
12. Prefer `final` over `var` when values won't change. Use `const` for compile-time constants.

### Imports & Structure

13. Don't import `src` directories of other packages; don't reach into/out of `lib`.
14. Prefer relative imports within a package.
15. Keep files single-responsibility; limit file length; group related functionality.
16. Prefer `final` fields and `private` declarations.

### Usage

17. Use collection literals. Use `whereType()` to filter by type.
18. Use initializing formals. Use `;` for empty constructor bodies.
19. Use `rethrow` for caught exceptions. Override `hashCode` when overriding `==`.
20. Prefer specific exception handling over generic `catch (e)`.

### Documentation

21. Use `///` doc comments (not block comments). Start with single-sentence summary.
22. Use square brackets to reference in-scope identifiers.
23. Document why code exists, not just what it does. Put doc comments before metadata annotations.

---

## 3. Dart 3 Features

### Branches

1. Use `if-case` for single-pattern matching:
```dart
if (pair case [int x, int y]) {
  print('Coords: $x, $y');
}
```
2. `switch` statements/expressions match multiple patterns. No `break` needed after match.
3. Use `sealed` class modifier for exhaustiveness checking on subtypes.
4. Use `when` guard clauses to further constrain case matching.
5. Use logical-or patterns (`case a || b`) to share bodies between cases.

### Patterns

6. Patterns match value shapes and destructure into variables. Can be used in declarations, assignments, loops, if-case, switch-case.
7. Pattern variable declarations: `var (a, [b, c]) = ('str', [1, 2]);`
8. Swap values: `(b, a) = (a, b);`
9. Object patterns: `var Foo(:one, :two) = myFoo;`
10. JSON validation:
```dart
if (data case {'user': [String name, int age]}) {
  print('$name is $age');
}
```

### Pattern Types

11. Logical-or (`||`), logical-and (`&&`), relational (`<`, `>=`, etc.), cast (`as`), null-check (`?`), null-assert (`!`).
12. List patterns (`[a, b]`), map patterns (`{"key": v}`), record patterns (`(a, b: v)`), object patterns, wildcards (`_`).
13. All pattern types can be nested and combined.

### Records

14. Anonymous, immutable, aggregate types bundling multiple objects.
15. Positional fields accessed via `$1`, `$2`; named fields by name.
16. Structural typing with automatic `hashCode` and `==`.
17. Return multiple values and destructure:
```dart
var (name, age) = userInfo(json);
final (:name, :age) = userInfo(json);
```
18. Records for simple data aggregation; classes for abstraction and behavior.

---

## 4. Widgets & Performance

1. Extract reusable widgets into separate components. Use `StatelessWidget` when possible.
2. Keep `build` methods simple. Avoid unnecessary `StatefulWidget`s.
3. Use `const` constructors. Avoid expensive operations in build methods.
4. Implement pagination for large lists. Keep state as local as possible.

---

## 5. Common Flutter Errors

1. **"RenderFlex overflowed"** -- Wrap children in `Flexible`/`Expanded` or set constraints.
2. **"Vertical viewport was given unbounded height"** -- Give `ListView` inside `Column` a bounded height (`Expanded`, `SizedBox`).
3. **"InputDecorator...unbounded width"** -- Constrain `TextField` width with `Expanded`/`SizedBox`.
4. **"setState called during build"** -- Don't call `setState`/`showDialog` in build. Use `addPostFrameCallback`.
5. **"ScrollController attached to multiple scroll views"** -- One controller per scrollable widget.
6. **"RenderBox was not laid out"** -- Check for unbounded constraints in widget tree.
7. Use Flutter Inspector to debug layout issues.

---

## 6. State Management

### ChangeNotifier (Built-in)

1. Use `ChangeNotifier` model classes with `notifyListeners()` for state changes.

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

2. Keep internal state private; expose unmodifiable views.
3. Use `ChangeNotifierProvider` to provide models. Use `Consumer<T>` for targeted rebuilds.
4. Place `Consumer` deep in the tree. Use `Provider.of<T>(context, listen: false)` for actions without rebuild.

### Provider

5. Use `MultiProvider` to avoid nested providers.
6. `context.watch<T>()` for reactive listening, `context.read<T>()` for one-time access, `context.select<T, R>()` for partial listening.
7. Don't access providers in `initState` or constructors.

### Bloc / Cubit

8. Use `Cubit` for simple state; `Bloc` for event-driven state. Start with `Cubit`, refactor to `Bloc` as needed.
9. Name events in past tense (`LoginButtonPressed`). Name states as nouns (`LoginSuccess`, `LoginFailure`).
10. Extend `Equatable` for states. Use `@immutable`. Implement `copyWith`.
11. `BlocBuilder` for rebuilds, `BlocListener` for side effects, `BlocConsumer` for both.
12. Inject repositories via constructors. Avoid direct bloc-to-bloc communication.
13. Use `bloc_lint` to enforce best practices.

### Riverpod

14. Wrap app root with `ProviderScope`. Define providers as `final` at top level.
15. `ref.watch` for reactive listening, `ref.read` for one-time, `ref.listen` for imperative subscriptions.

```dart
class MyWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final value = ref.watch(myProvider);
    return Text('$value');
  }
}
```

16. Enable `autoDispose` for parameterized providers to prevent memory leaks.
17. Use Notifiers (`Notifier`, `AsyncNotifier`) for side effects. Use `.family` for parameterized providers.
18. Install `riverpod_lint` for IDE refactoring and best practices.

---

## 7. Testing

### General Principles

1. Write unit tests for business logic, widget tests for UI.
2. Ask: "Can this test actually fail if the real code is broken?"
3. Always use `group()` named after the class under test.
4. Name tests with "should": `test('value should start at 0', () {...})`.

### Mocktail

5. Use `Fake` for lightweight implementations; `Mock` for interaction verification.
6. `registerFallbackValue` for custom types in argument matchers.
7. `when(() => mock.method()).thenReturn(value)` for stubbing; `verify` for interaction checks.
8. Prefer real objects > tested fakes > mocks.

### Mockito

9. `@GenerateMocks`/`@GenerateNiceMocks` + `dart run build_runner build`.
10. `when(mock.method()).thenReturn(value)` for stubs; `thenAnswer` for runtime responses.
11. `captureAny`/`captureThat` for argument capture. Don't mock data models.

### Bloc Testing

12. Use `bloc_test` package with `blocTest` function:
```dart
blocTest<CounterBloc, int>(
  'emits [1] when increment is added',
  build: () => CounterBloc(),
  act: (bloc) => bloc.add(CounterIncrementPressed()),
  expect: () => [1],
);
```

### Riverpod Testing

13. Create new `ProviderContainer` (unit) or `ProviderScope` (widget) per test.
14. Use `overrides` to inject mocks/fakes. Mock dependencies, not Notifiers.

---

## 8. Code Review

1. Verify branch is feature/bugfix/PR, not main/develop. Check branch is up-to-date.
2. For each file: correct directory, naming conventions, clear responsibility.
3. Review readability, logic correctness, edge cases, modularity, error handling.
4. Check security (input validation, no secrets), performance, documentation, test coverage.
5. Verify change set is focused on stated purpose with no unrelated changes.
6. Be objective; use devil's advocate approach for honest feedback.

---

## Appendix: Firebase Integration (Reference)

The source repository includes detailed Firebase rules for:
Cloud Firestore, Firebase Auth, Realtime Database, Cloud Functions, Firebase Storage, Messaging (FCM), Crashlytics, Analytics, App Check, Remote Config, In-App Messaging, Data Connect, Firebase AI, and FlutterFire CLI configuration (multi-flavor support).

See `rules/firebase/` in the original repository for full details.

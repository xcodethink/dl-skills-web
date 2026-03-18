> Source: [bear2u/my-skills](https://github.com/bear2u/my-skills) | Category: A-Project-Initialization

---
name: flutter-init
description: Create a domain-based Flutter project with Clean Architecture and modern tooling
---

# Flutter Init Skill

## Overview

Create a Flutter project based on a selected domain (Todo, Habit, Note, Expense, or Custom) with automatic Clean Architecture configuration. The skill generates a complete CRUD application with Riverpod 3.x state management, Freezed models, Drift local database, and multi-language support.

## Quick Start

The skill requires the following inputs:
- **Folder name** (e.g., `my_habit_app`)
- **Project/package name** (e.g., `habit_app`)
- **Domain selection** (Todo / Habit / Note / Expense / Custom)
- **Tech stack preset** (Minimal / Essential / Full Stack / Custom)

After input, the following steps execute automatically:

```bash
# 1. Create project (Android/Kotlin, iOS/Swift)
flutter create --platforms android,ios --android-language kotlin --org com.example [folder_name]

# 2. Install dependencies
flutter pub get

# 3. Generate Clean Architecture code by domain
# - domain/entities/[domain].dart (Freezed entity)
# - data/datasources/local/app_database.dart (Drift tables)
# - data/repositories/[domain]_repository_impl.dart (Repository impl)
# - presentation/providers/[domain]_providers.dart (Riverpod 3.0)
# - presentation/screens/* (List/Detail/Form screens)

# 4. Code generation (Freezed, Drift, JSON Serializable)
dart run build_runner build --delete-conflicting-outputs

# 5. Static analysis and auto-fix (required)
flutter analyze

# 6. Run the app
flutter run
```

## Task Guide

**Important**: This skill operates in conversational mode.

### Step 1: Ask for Domain and Project Configuration

**Prompt the user with:**

"Ready to create a Flutter application. Please provide the following:

**1. Domain (Entity) Selection**

Which type of app would you like to build?

**A) Todo (Task Management)**
- Fields: title, description, isCompleted, createdAt, completedAt
- Features: CRUD, filtering (all/active/completed), checkbox toggle

**B) Habit (Habit Tracker)**
- Fields: name, description, frequency (daily/weekly/monthly), streak, lastCompletedAt, goal, isActive
- Features: CRUD, streak tracking, goal completion rate, check-in

**C) Note (Memo/Notes)**
- Fields: title, content, tags, isPinned, createdAt, updatedAt
- Features: CRUD, tag filtering, pinning, search

**D) Expense (Expense Tracker)**
- Fields: amount, category, description, date, paymentMethod
- Features: CRUD, category summary, monthly stats, filtering

**E) Custom**
- Define your own entity name and fields

**2. Project Info**
- **Folder name**: Directory for the project (default: `[domain]_app`)
- **Package name**: Flutter package name (default: same as folder name)
- **Organization**: (default: `com.example`)

**3. Tech Stack Preset**

**A) Essential (Recommended)**
- GoRouter (type-safe routing), SharedPreferences, FPDart, Google Fonts, FluentUI Icons
- No auth system, no responsive utils

**B) Minimal**
- Default Navigator, SharedPreferences, basic FluentUI Icons
- No GoRouter, FPDart, Google Fonts, auth, or responsive utils

**C) Full Stack**
- GoRouter, SharedPreferences, FPDart, Google Fonts, Responsive Utils, FluentUI Icons
- Auth system (Login/Register)

**D) Custom**
- Select features individually

Choose domain and preset. (Domain: A/B/C/D/E, Preset: A/B/C/D)"

### Step 2: Follow-up Questions for Custom Options

#### 2-1. Custom Domain (E):

1. **Entity name**: e.g., Task, Event, Book
2. **Field definitions**: Format `fieldName:type` (e.g., `title:String, amount:double, isActive:bool`)
   - Supported types: String, int, double, bool, DateTime
   - `createdAt`, `updatedAt` are added automatically
3. **Key features**: Fields to use for filtering/sorting

#### 2-2. Custom Tech Stack (D):

Ask each question sequentially:

1. **Navigation**: Use GoRouter? (Yes/No)
2. **Error handling**: Use FPDart? (Yes/No)
3. **UI**: Use Google Fonts? (Yes/No)
4. **Responsive**: Include Responsive Utils? (Yes/No)
5. **Auth**: Include Auth system? (Yes/No)

### Step 3: Generate Project Based on Domain and Stack

1. **Create Flutter project** using the specified folder name
2. **Check Kotlin DSL** (latest Flutter uses Kotlin DSL automatically)
3. **Install selected dependencies**: Update `pubspec.yaml`, run `flutter pub get`
4. **Generate folder structure**: Clean Architecture (core, data, domain, presentation)
5. **Generate domain-specific boilerplate**:

   | Domain | Repository Methods | Providers | UI Screens |
   |--------|-------------------|-----------|------------|
   | Todo | getTodos, createTodo, updateTodo, toggleCompletion, deleteTodo | filteredTodosProvider (all/pending/completed) | TodoList, TodoDetail, TodoFormDialog |
   | Habit | getHabits, createHabit, updateHabit, completeHabit, deleteHabit | filteredHabitsProvider, habitStatsProvider | HabitList, HabitDetail, HabitFormDialog |
   | Note | getNotes, createNote, updateNote, togglePin, deleteNote | filteredNotesProvider, searchProvider | NoteList, NoteDetail, NoteFormDialog |
   | Expense | getExpenses, createExpense, updateExpense, deleteExpense | expensesByCategory, monthlyStats, filteredExpenses | ExpenseList, ExpenseDetail, ExpenseFormDialog |
   | Custom | Basic CRUD methods | Basic list provider | Basic List/Detail/Form screens |

6. **Generate config files** (routes, storage, i18n)
7. **Update Android config** (core library desugaring for flutter_local_notifications):
   ```kotlin
   android {
       compileOptions {
           isCoreLibraryDesugaringEnabled = true
       }
   }
   dependencies {
       coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:2.0.4")
   }
   ```
8. **Code generation**: `dart run build_runner build --delete-conflicting-outputs`
9. **Analysis and error fixing**:
   - Run `flutter analyze`
   - Fix errors:
     - **Freezed 3.0**: All entities must use `sealed class` (not `class ... with _$...`)
     - **Theme**: Use `CardThemeData` instead of deprecated `CardTheme`
     - **Imports**: Convert all relative imports to `package:` format
     - **Riverpod 3.0**: `StateNotifier` -> `Notifier`, `StateProvider` -> `NotifierProvider`
     - **FluentUI icons**: Verify icon names exist
     - **Type safety**: Use switch expressions, follow null safety
   - Loop until 0 error-level issues remain

### Step 4: Final Verification

**Required** before marking the project complete.

1. Run `flutter analyze`
2. **Success criteria**: 0-1 issues (info-level only)
3. Provide project summary:
   - Folder name, package name, organization
   - Selected domain, tech stack, key features
   - Number of generated Dart files
4. Run instructions:
   ```bash
   cd [folder_name]
   flutter run
   ```

## Core Principles

- **Repository Pattern**: Separate data and domain layers
- **Dependency Injection**: Managed via Riverpod 3.x
- **Immutability**: Freezed models for immutable entities
- **Internationalization**: Easy Localization for i18n (English/Korean, extensible)
- **Modern UI**: FluentUI Icons

## Notes

- **Conversational skill**: User selects domain and preset to customize the app
- **Domain support**: Todo, Habit, Note, Expense, Custom
- **Presets**: Full Stack, Essential, Minimal, Custom
- **Optional features**: GoRouter, Auth, FPDart, Google Fonts, Responsive Utils
- **Always included**: Riverpod 3.x, Easy Localization, FluentUI Icons, Drift, Dio, SharedPreferences
- **Platforms**: Android/Kotlin, iOS/Swift (no Web/Windows/Linux)
- **Quality assurance**: All projects must pass `flutter analyze`, use `package:` imports, ensure type safety

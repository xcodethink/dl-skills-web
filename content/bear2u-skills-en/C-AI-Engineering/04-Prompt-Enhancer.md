> Source: [bear2u/my-skills](https://github.com/bear2u/my-skills) | Category: C-AI-Engineering

---
name: prompt-enhancer
description: Transform brief development requests into detailed requirement specs by analyzing project context
---

# Prompt Enhancer

## Overview

Transform short development requests into clear, detailed requirement specifications by analyzing project context (code structure, dependencies, conventions, existing patterns). The skill generates context-aware, accurate prompts and presents the enhanced requirements to the user for confirmation before implementation.

## When to Use

- User provides a brief development request like "add login" or "build an API"
- Request lacks specific implementation details
- User has uploaded project files or mentions "this project"
- Task requires understanding the project architecture

## Core Workflow

### Step 1: Analyze Project Context

**Check uploaded files:**
```bash
view /mnt/user-data/uploads
```

**Gather key information:**
- Project structure and organization
- Tech stack (package.json, pubspec.yaml, requirements.txt, etc.)
- Existing patterns (state management, API calls, routing)
- Code conventions (naming, file structure)
- Similar existing features

### Step 2: Extract Request Intent

Identify from the user's brief request:
- **Feature type**: New feature, bug fix, refactor, API integration
- **Scope**: Single page, complete flow, backend + frontend
- **Dependencies**: Related features or systems

### Step 3: Build Enhanced Requirements

Create a structured requirements document:

```markdown
# [Feature Name] Implementation Requirements

## Project Context
- Framework: [Detected framework and version]
- Architecture: [Detected pattern]
- State Management: [Detected library]
- Key Libraries: [List relevant dependencies]

## Implementation Scope

### Main Features
1. [Feature 1]
2. [Feature 2]
3. [Feature 3]

### File Structure
```
[Expected file structure based on project]
```

## Detailed Requirements

### 1. [Layer/Component Name]
- **Location**: [File path]
- **Purpose**: [What it does]
- **Implementation**:
  - [Specific requirement 1]
  - [Specific requirement 2]
- **Follow existing pattern**: [Reference to existing pattern]

### 2. [Next layer/component]
...

## Success Criteria
- [ ] [Acceptance criterion 1]
- [ ] [Acceptance criterion 2]
- [ ] [Acceptance criterion 3]
- [ ] Maintains existing code style and architecture consistency
- [ ] Tests written for all major functionality

## Items to Confirm
- [Questions needing clarification]
- [Assumptions made]

---
Shall I proceed with these requirements? Let me know if anything needs changes.
```

### Step 4: Present to User

**Important**: After creating the enhanced requirements, present them to the user and request confirmation:

```
Above are the requirements based on my analysis.

Shall I proceed with this plan?
Let me know if anything needs changes or additions!
```

**Do not begin implementation until the user confirms.** The goal is to clarify requirements first.

## Analysis Patterns by Tech Stack

### Flutter Projects

**Detection markers**: pubspec.yaml, lib/ directory

**Key context to gather:**
- State management (Riverpod, Bloc, Provider, GetX)
- Architecture (Clean Architecture, MVVM, MVC)
- Navigation (go_router, auto_route, Navigator)
- Networking (Dio, http)
- Local storage (Hive, SharedPreferences, SQLite)

**Enhanced requirements should include:**

| Layer | File Pattern | Details |
|-------|-------------|---------|
| Presentation | `lib/presentation/[feature]/[screen]_screen.dart` | Screens, StateNotifier/Bloc/Controller, reusable widgets |
| Domain | `lib/domain/entities/`, `lib/domain/usecases/`, `lib/domain/repositories/` | Entities, use cases, repository interfaces |
| Data | `lib/data/models/`, `lib/data/repositories/`, `lib/data/datasources/` | Models (fromJson/toJson), repository impl, data sources |
| Navigation | Route path, navigation method | GoRouter-based context.go/push |

**Success criteria**: State management, style consistency, API error handling, loading states, widget tests

### Next.js/React Projects

**Detection markers**: package.json containing "next" or "react"

**Key context to gather:**
- Next.js version (App Router vs Pages Router)
- State management (Zustand, Redux, Context)
- Styling (Tailwind, CSS Modules, styled-components)
- API approach (Next.js API routes, external API)
- TypeScript usage

**Enhanced requirements should include:**

| Layer | File Pattern | Details |
|-------|-------------|---------|
| UI Components | `[path]/[ComponentName].tsx` | Component, Props interface, styling approach |
| State Management | Store structure, action naming | Existing state patterns |
| API Layer | `app/api` or external endpoints | Methods, response TypeScript interfaces |
| Routing | `app/[route]` or `pages/[route]` | Dynamic segments if needed |

**Success criteria**: TypeScript type safety, component reuse, responsive design, SEO metadata, unit + integration tests

### Python (Django/FastAPI) Projects

**Detection markers**: requirements.txt, manage.py, main.py

**Key context to gather:**
- Framework (Django, FastAPI, Flask)
- ORM (SQLAlchemy, Django ORM, Tortoise)
- Auth approach
- API documentation (OpenAPI/Swagger)

**Enhanced requirements should include:**

| Layer | File Pattern | Details |
|-------|-------------|---------|
| Models/Schema | `[app]/models.py` or `schemas/[name].py` | Fields with types, relationships |
| Views/Endpoints | Route path, HTTP methods | Request/Response schemas (Pydantic models) |
| Business Logic | Services (if applicable) | Validation rules |
| Database | Migration commands | Migration strategy |

**Success criteria**: Auto-generated API docs, request validation, error handling with correct status codes, unit + integration tests

## Enhancement Example

**User input:**
```
Add login functionality
```

**Skill output:**
```markdown
# Login Feature Implementation Requirements

## Project Context
- Framework: Flutter 3.16.0 (null safety)
- Architecture: Clean Architecture
- State Management: Riverpod (StateNotifier pattern)
- Networking: Dio 5.3.0
- Storage: flutter_secure_storage
- Navigation: go_router

## Implementation Scope

### Main Features
1. Email/password login form
2. JWT token-based authentication
3. Navigate to home screen on success
4. Error handling and user feedback

### File Structure
lib/
├── presentation/auth/
│   ├── login_screen.dart
│   ├── login_notifier.dart
│   └── login_state.dart
├── domain/
│   ├── entities/user.dart
│   ├── usecases/login_usecase.dart
│   └── repositories/auth_repository.dart
└── data/
    ├── models/user_model.dart, login_response.dart
    ├── repositories/auth_repository_impl.dart
    └── datasources/auth_remote_datasource.dart

## Detailed Requirements

### 1. Presentation Layer - Login Screen
- **Location**: lib/presentation/auth/login_screen.dart
- **Purpose**: User login UI
- **Implementation**:
  - ConsumerStatefulWidget
  - Email TextFormField (email format validation)
  - Password TextFormField (min 8 chars, obscureText)
  - Login PrimaryButton
  - Registration link
  - Loading overlay during submission
- **Follow existing pattern**: Use core/widgets/custom_text_field.dart style

### 2. State Management
- **Location**: lib/presentation/auth/login_notifier.dart
- **Implementation**:
  - Extends StateNotifier<LoginState>
  - login(email, password) method
  - Save token and update state on success
  - Set error message state on failure

[...additional detailed requirements...]

## Success Criteria
- [ ] User can enter email and password
- [ ] Login button calls API
- [ ] Token saved and navigated to home on success
- [ ] Appropriate error message displayed on failure (SnackBar)
- [ ] Button disabled with loading indicator during submission
- [ ] Email format and password length validation
- [ ] Maintains existing code style and architecture
- [ ] Widget tests for login screen
- [ ] Repository tests (mock API)
- [ ] UseCase tests

## Items to Confirm
- Is the API endpoint at `https://api.example.com`?
- Do you need automatic token refresh on expiration?
- Should social login (Google, Apple, etc.) be included?
- Do you need a "Forgot Password" feature?

---
Shall I proceed with these requirements? Let me know if anything needs changes!
```

## Tips for Effective Enhancement

### Always Request Clarification

When project context is unclear:
```
If you can upload your project files, I can generate more accurate requirements.
Or please tell me:
- Framework being used
- State management library
- Existing project structure
```

### Include Visual References

Reference existing pages/components when appropriate:
```
Implement with a layout similar to the existing ProfileScreen:
- Same AppBar style
- Reuse TextFormField design
- Use PrimaryButton component
```

### Note Dependencies

```
## Related Features
- UserRepository: Reused for user info queries
- TokenStorage: Uses existing token storage logic
- ErrorHandler: Apply common error handling
```

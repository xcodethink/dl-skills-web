> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: Frontend Development

---
name: frontend-development
description: Modern React development guide covering Suspense-based data fetching, lazy loading, canonical file organization, TanStack Query/Router, MUI v7 styling, TypeScript best practices, and performance optimization. Consolidated from 10+ resource files.
---

# Frontend Development Guide

## Overview

Comprehensive guide for modern React development, focusing on Suspense-based data fetching, lazy loading, canonical file organization, and performance optimization. Covers the complete frontend stack from component patterns to routing, styling, and TypeScript standards.

## When to Use

- Creating new components or pages
- Building new features
- Fetching data with TanStack Query
- Setting up routes with TanStack Router
- Styling components with MUI v7
- Performance optimization
- Organizing frontend code
- TypeScript best practices

---

## Quick Start

### New Component Checklist

When creating a component, follow this checklist:

- [ ] Use `React.FC<Props>` pattern with TypeScript
- [ ] Lazy load heavy components: `React.lazy(() => import())`
- [ ] Wrap with `<SuspenseLoader>` for loading states
- [ ] Use `useSuspenseQuery` for data fetching
- [ ] Import aliases: `@/`, `~types`, `~components`, `~features`
- [ ] Styles: inline if < 100 lines, separate file if > 100 lines
- [ ] `useCallback` for event handlers passed to children
- [ ] Default export at bottom
- [ ] No early returns for loading spinners
- [ ] Use `useMuiSnackbar` for user notifications

### New Feature Checklist

When creating a feature module, establish this structure:

- [ ] Create `features/{feature-name}/` directory
- [ ] Create subdirectories: `api/`, `components/`, `hooks/`, `helpers/`, `types/`
- [ ] Create API service file: `api/{feature}Api.ts`
- [ ] Set up TypeScript types in `types/`
- [ ] Create route in `routes/{feature-name}/index.tsx`
- [ ] Lazy load feature components
- [ ] Use Suspense boundaries
- [ ] Export public API from feature's `index.ts`

---

## Import Alias Quick Reference

| Alias | Resolves To | Example |
|-------|-------------|---------|
| `@/` | `src/` | `import { apiClient } from '@/lib/apiClient'` |
| `~types` | `src/types` | `import type { User } from '~types/user'` |
| `~components` | `src/components` | `import { SuspenseLoader } from '~components/SuspenseLoader'` |
| `~features` | `src/features` | `import { authApi } from '~features/auth'` |

---

## Common Imports Cheat Sheet

```typescript
// React & lazy loading
import React, { useState, useCallback, useMemo } from 'react';
const Heavy = React.lazy(() => import('./Heavy'));

// MUI components
import { Box, Paper, Typography, Button, Grid } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

// TanStack Query (Suspense)
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';

// TanStack Router
import { createFileRoute } from '@tanstack/react-router';

// Project components
import { SuspenseLoader } from '~components/SuspenseLoader';

// Hooks
import { useAuth } from '@/hooks/useAuth';
import { useMuiSnackbar } from '@/hooks/useMuiSnackbar';

// Types
import type { Post } from '~types/post';
```

---

## Component Patterns

### React.FC Pattern (Recommended)

All components use `React.FC<Props>` for:
- Explicit props type safety
- Consistent component signatures
- Clear prop interface documentation
- Better IDE autocompletion

#### Basic Pattern

```typescript
import React from 'react';

interface MyComponentProps {
    /** User ID to display */
    userId: number;
    /** Optional callback when action occurs */
    onAction?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ userId, onAction }) => {
    return (
        <div>
            User: {userId}
        </div>
    );
};

export default MyComponent;
```

**Key points:**
- Props interface defined separately with JSDoc comments
- `React.FC<Props>` provides type safety
- Destructure props in parameters
- Default export at bottom

### Lazy Loading Pattern

**When to use lazy loading:**
- Heavy components (DataGrid, charts, rich text editors)
- Route-level components
- Modal/dialog content (not visible initially)
- Below-the-fold content

```typescript
import React from 'react';

// Lazy load heavy components
const PostDataGrid = React.lazy(() =>
    import('./grids/PostDataGrid')
);

// Named exports
const MyComponent = React.lazy(() =>
    import('./MyComponent').then(module => ({
        default: module.MyComponent
    }))
);
```

### Suspense Boundaries

#### SuspenseLoader Component

```typescript
import { SuspenseLoader } from '~components/SuspenseLoader';

// Basic usage
<SuspenseLoader>
    <LazyLoadedComponent />
</SuspenseLoader>
```

**Features:**
- Shows loading indicator while lazy components load
- Smooth fade-in animation
- Consistent loading experience
- Prevents layout shift

#### Placement

**Route level:**
```typescript
const MyPage = lazy(() => import('@/features/my-feature/components/MyPage'));

function Route() {
    return (
        <SuspenseLoader>
            <MyPage />
        </SuspenseLoader>
    );
}
```

**Component level:**
```typescript
function ParentComponent() {
    return (
        <Box>
            <Header />
            <SuspenseLoader>
                <HeavyDataGrid />
            </SuspenseLoader>
        </Box>
    );
}
```

**Multiple Suspense boundaries:** Each section loads independently for better UX.

```typescript
function Page() {
    return (
        <Box>
            <SuspenseLoader>
                <HeaderSection />
            </SuspenseLoader>
            <SuspenseLoader>
                <MainContent />
            </SuspenseLoader>
            <SuspenseLoader>
                <Sidebar />
            </SuspenseLoader>
        </Box>
    );
}
```

### Component Structure Template

Recommended order:

```typescript
/**
 * Component description
 * What it does and when to use it
 */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Box, Paper, Button } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';

// Feature imports
import { myFeatureApi } from '../api/myFeatureApi';
import type { MyData } from '~types/myData';

// Component imports
import { SuspenseLoader } from '~components/SuspenseLoader';

// Hooks
import { useAuth } from '@/hooks/useAuth';
import { useMuiSnackbar } from '@/hooks/useMuiSnackbar';

// 1. PROPS INTERFACE (with JSDoc)
interface MyComponentProps {
    /** Entity ID to display */
    entityId: number;
    /** Optional callback when action completes */
    onComplete?: () => void;
    /** Display mode */
    mode?: 'view' | 'edit';
}

// 2. STYLES (inline when < 100 lines)
const componentStyles: Record<string, SxProps<Theme>> = {
    container: {
        p: 2,
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        mb: 2,
        display: 'flex',
        justifyContent: 'space-between',
    },
};

// 3. COMPONENT DEFINITION
export const MyComponent: React.FC<MyComponentProps> = ({
    entityId,
    onComplete,
    mode = 'view',
}) => {
    // 4. HOOKS (in this order)
    // - Context hooks first
    const { user } = useAuth();
    const { showSuccess, showError } = useMuiSnackbar();

    // - Data fetching
    const { data } = useSuspenseQuery({
        queryKey: ['myEntity', entityId],
        queryFn: () => myFeatureApi.getEntity(entityId),
    });

    // - Local state
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    // - Memoized values
    const filteredData = useMemo(() => {
        return data.filter(item => item.active);
    }, [data]);

    // - Side effects
    useEffect(() => {
        // initialization
        return () => {
            // cleanup
        };
    }, []);

    // 5. EVENT HANDLERS (use useCallback)
    const handleItemSelect = useCallback((itemId: string) => {
        setSelectedItem(itemId);
    }, []);

    const handleSave = useCallback(async () => {
        try {
            await myFeatureApi.updateEntity(entityId, { /* data */ });
            showSuccess('Entity updated successfully');
            onComplete?.();
        } catch (error) {
            showError('Failed to update entity');
        }
    }, [entityId, onComplete, showSuccess, showError]);

    // 6. RENDER
    return (
        <Box sx={componentStyles.container}>
            <Box sx={componentStyles.header}>
                <h2>My Component</h2>
                <Button onClick={handleSave}>Save</Button>
            </Box>
            <Paper sx={{ p: 2 }}>
                {filteredData.map(item => (
                    <div key={item.id}>{item.name}</div>
                ))}
            </Paper>
        </Box>
    );
};

// 7. EXPORT (default export at bottom)
export default MyComponent;
```

### Component Splitting Guidelines

**Split into multiple components when:**
- Component exceeds 300 lines
- Multiple distinct responsibilities
- Reusable parts exist
- Nested JSX is complex

**Keep in a single file when:**
- Component is under 200 lines
- Logic is tightly coupled
- Not reused elsewhere
- Simple presentational component

### Export Pattern (Recommended: Named Constant + Default Export)

```typescript
export const MyComponent: React.FC<Props> = ({ ... }) => {
    // component logic
};

export default MyComponent;
```

**Reasoning:**
- Named export for testing/refactoring
- Default export for lazy loading
- Consumer can choose either style

---

## Data Fetching

### Primary Pattern: useSuspenseQuery

All **new components** use `useSuspenseQuery` instead of plain `useQuery`:

**Advantages:**
- No `isLoading` checks needed
- Integrates with Suspense boundaries
- Cleaner component code
- Consistent loading UX
- Better error handling (with error boundaries)

#### Basic Pattern

```typescript
import { useSuspenseQuery } from '@tanstack/react-query';
import { myFeatureApi } from '../api/myFeatureApi';

export const MyComponent: React.FC<Props> = ({ id }) => {
    // No isLoading needed - Suspense handles it!
    const { data } = useSuspenseQuery({
        queryKey: ['myEntity', id],
        queryFn: () => myFeatureApi.getEntity(id),
    });

    // data is always defined here (not undefined | Data)
    return <div>{data.name}</div>;
};

// Wrap with Suspense boundary
<SuspenseLoader>
    <MyComponent id={123} />
</SuspenseLoader>
```

#### useSuspenseQuery vs useQuery

| Feature | useSuspenseQuery | useQuery |
|---------|------------------|----------|
| Loading state | Suspense handles | Manual `isLoading` check |
| Data type | Always defined | `Data \| undefined` |
| Use with | Suspense boundaries | Traditional components |
| Recommended for | **New components** | Legacy code only |
| Error handling | Error boundaries | Manual error state |

### Cache-First Strategy

```typescript
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';

export function useSuspensePost(postId: number) {
    const queryClient = useQueryClient();

    return useSuspenseQuery({
        queryKey: ['post', postId],
        queryFn: async () => {
            // Strategy 1: Try list cache first
            const cachedListData = queryClient.getQueryData<{ posts: Post[] }>([
                'posts', 'list'
            ]);

            if (cachedListData?.posts) {
                const cachedPost = cachedListData.posts.find(
                    (post) => post.id === postId
                );
                if (cachedPost) {
                    return cachedPost;  // Return from cache!
                }
            }

            // Strategy 2: Not in cache, fetch from API
            return postApi.getPost(postId);
        },
        staleTime: 5 * 60 * 1000,      // Fresh for 5 minutes
        gcTime: 10 * 60 * 1000,         // Cache retained for 10 minutes
        refetchOnWindowFocus: false,    // Don't refetch on window focus
    });
}
```

### Parallel Data Fetching

```typescript
import { useSuspenseQueries } from '@tanstack/react-query';

export const Dashboard: React.FC = () => {
    const [statsQuery, projectsQuery, notificationsQuery] = useSuspenseQueries({
        queries: [
            {
                queryKey: ['stats'],
                queryFn: () => statsApi.getStats(),
            },
            {
                queryKey: ['projects', 'active'],
                queryFn: () => projectsApi.getActiveProjects(),
            },
            {
                queryKey: ['notifications', 'unread'],
                queryFn: () => notificationsApi.getUnread(),
            },
        ],
    });

    return (
        <Box>
            <StatsCard data={statsQuery.data} />
            <ProjectsList projects={projectsQuery.data} />
            <Notifications items={notificationsQuery.data} />
        </Box>
    );
};
```

### API Service Layer Pattern

Create a centralized API service for each feature:

```typescript
/**
 * Centralized API service for the feature module
 * Uses apiClient for unified error handling
 */
import apiClient from '@/lib/apiClient';
import type { MyEntity, UpdatePayload } from '../types';

export const myFeatureApi = {
    /** Get a single entity */
    getEntity: async (blogId: number, entityId: number): Promise<MyEntity> => {
        const { data } = await apiClient.get(
            `/blog/entities/${blogId}/${entityId}`
        );
        return data;
    },

    /** Get all entities */
    getEntities: async (blogId: number, view: 'summary' | 'flat'): Promise<MyEntity[]> => {
        const { data } = await apiClient.get(
            `/blog/entities/${blogId}`,
            { params: { view } }
        );
        return data.rows;
    },

    /** Update an entity */
    updateEntity: async (
        blogId: number,
        entityId: number,
        payload: UpdatePayload
    ): Promise<MyEntity> => {
        const { data } = await apiClient.put(
            `/blog/entities/${blogId}/${entityId}`,
            payload
        );
        return data;
    },

    /** Delete an entity */
    deleteEntity: async (blogId: number, entityId: number): Promise<void> => {
        await apiClient.delete(`/blog/entities/${blogId}/${entityId}`);
    },
};
```

**Key points:**
- Export a single object with all methods
- Use `apiClient` (axios instance from `@/lib/apiClient`)
- Type-safe parameters and return values
- JSDoc comments on each method
- Centralized error handling (apiClient handles it)

### Route Format Rules (Important)

```typescript
// Correct - use service path directly
await apiClient.get('/blog/posts/123');
await apiClient.post('/projects/create', data);

// Wrong - do NOT add /api/ prefix
await apiClient.get('/api/blog/posts/123');  // Wrong!
```

**Reason:** API routes are handled by proxy configuration; no `/api/` prefix needed.

### Mutations

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMuiSnackbar } from '@/hooks/useMuiSnackbar';

export const MyComponent: React.FC = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useMuiSnackbar();

    const updateMutation = useMutation({
        mutationFn: (payload: UpdatePayload) =>
            myFeatureApi.updateEntity(blogId, entityId, payload),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['entity', blogId, entityId]
            });
            showSuccess('Entity updated successfully');
        },

        onError: (error) => {
            showError('Failed to update entity');
            console.error('Update error:', error);
        },
    });

    const handleUpdate = () => {
        updateMutation.mutate({ name: 'New Name' });
    };

    return (
        <Button
            onClick={handleUpdate}
            disabled={updateMutation.isPending}
        >
            {updateMutation.isPending ? 'Updating...' : 'Update'}
        </Button>
    );
};
```

### Optimistic Updates

```typescript
const updateMutation = useMutation({
    mutationFn: (payload) => myFeatureApi.update(id, payload),

    onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ['entity', id] });
        const previousData = queryClient.getQueryData(['entity', id]);

        queryClient.setQueryData(['entity', id], (old) => ({
            ...old,
            ...newData,
        }));

        return { previousData };
    },

    onError: (err, newData, context) => {
        queryClient.setQueryData(['entity', id], context.previousData);
        showError('Update failed');
    },

    onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['entity', id] });
    },
});
```

---

## File Organization

### features/ vs components/

#### features/ Directory

**Purpose**: Domain-specific features with their own logic, API, and components

**Use when:**
- Feature has multiple related components
- Feature has its own API endpoints
- Domain-specific logic exists
- Custom hooks/utilities needed

**Structure:**
```
features/
  my-feature/
    api/
      myFeatureApi.ts         # API service layer
    components/
      MyFeatureMain.tsx       # Main component
      SubComponents/          # Related components
    hooks/
      useMyFeature.ts         # Custom hooks
      useSuspenseMyFeature.ts # Suspense hooks
    helpers/
      myFeatureHelpers.ts     # Utilities
    types/
      index.ts                # TypeScript types
    index.ts                  # Public exports
```

#### components/ Directory

**Purpose**: Truly reusable components used across multiple features

**Use when:**
- Component used in 3+ places
- Component is generic (no feature-specific logic)
- Component is a UI primitive or pattern

**Examples:** `SuspenseLoader/`, `CustomAppBar/`, `ErrorBoundary/`

### File Naming Conventions

| Type | Naming Pattern | Example |
|------|---------------|---------|
| Components | PascalCase + `.tsx` | `MyComponent.tsx` |
| Hooks | camelCase + `use` prefix + `.ts` | `useMyFeature.ts` |
| API services | camelCase + `Api` suffix + `.ts` | `myFeatureApi.ts` |
| Utilities | camelCase + `.ts` | `myFeatureHelpers.ts` |
| Types | camelCase + `.ts` | `types/index.ts` |

### Import Order (Recommended)

```typescript
// 1. React and React-related
import React, { useState, useCallback, useMemo } from 'react';

// 2. Third-party libraries (alphabetical)
import { Box, Paper, Button } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';

// 3. Alias imports (@ first, then ~)
import { apiClient } from '@/lib/apiClient';
import { SuspenseLoader } from '~components/SuspenseLoader';

// 4. Type imports (grouped)
import type { Post } from '~types/post';
import type { User } from '~types/user';

// 5. Relative imports (within same feature)
import { MySubComponent } from './MySubComponent';
```

### Full Directory Structure

```
src/
+-- features/                    # Domain-specific features
|   +-- posts/
|   |   +-- api/
|   |   +-- components/
|   |   +-- hooks/
|   |   +-- helpers/
|   |   +-- types/
|   |   +-- index.ts
|   +-- blogs/
|   +-- auth/
|
+-- components/                  # Reusable components
|   +-- SuspenseLoader/
|   +-- CustomAppBar/
|   +-- ErrorBoundary/
|
+-- routes/                      # TanStack Router routes
|   +-- __root.tsx
|   +-- index.tsx
|   +-- my-route/
|       +-- index.tsx
|
+-- hooks/                       # Shared hooks
|   +-- useAuth.ts
|   +-- useMuiSnackbar.ts
|
+-- lib/                         # Shared utilities
|   +-- apiClient.ts
|
+-- types/                       # Shared TypeScript types
|   +-- user.ts
|   +-- post.ts
|
+-- App.tsx                      # Root component
```

---

## Styling Guide

### Inline vs Separate File

| Condition | Approach |
|-----------|----------|
| Less than 100 lines | Inline at component top |
| More than 100 lines | Separate `.styles.ts` file |

#### Inline Styles Example

```typescript
import type { SxProps, Theme } from '@mui/material';

const componentStyles: Record<string, SxProps<Theme>> = {
    container: {
        p: 2,
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        mb: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
    },
};
```

#### Separate File Example

```typescript
// MyComponent.styles.ts
import type { SxProps, Theme } from '@mui/material';

export const componentStyles: Record<string, SxProps<Theme>> = {
    container: { ... },
    header: { ... },
    // 100+ lines of styles...
};

// MyComponent.tsx
import { componentStyles } from './MyComponent.styles';
```

### sx Prop Patterns

```typescript
// Basic usage
<Box sx={{ p: 2, mb: 3, display: 'flex' }}>Content</Box>

// Theme access
<Box sx={{
    p: 2,
    backgroundColor: (theme) => theme.palette.primary.main,
    color: (theme) => theme.palette.primary.contrastText,
}} />

// Responsive styles
<Box sx={{
    p: { xs: 1, sm: 2, md: 3 },
    width: { xs: '100%', md: '50%' },
}} />

// Pseudo-selectors
<Box sx={{
    '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
    '& .child-class': { color: 'primary.main' },
}} />
```

### MUI v7 Grid (Important Syntax Change)

```typescript
// Correct - v7 syntax with size prop
<Grid container spacing={2}>
    <Grid size={{ xs: 12, md: 6 }}>Left column</Grid>
    <Grid size={{ xs: 12, md: 6 }}>Right column</Grid>
</Grid>

// Wrong - old v6 syntax
<Grid container spacing={2}>
    <Grid xs={12} md={6}>Content</Grid>  {/* Old syntax - do not use */}
</Grid>
```

### Prohibited Styling Approaches

- **makeStyles** (MUI v4 pattern) - deprecated
- **styled() components** - sx prop is more flexible

### Code Style Standards

- **Indentation**: 4 spaces
- **Quotes**: Single quotes
- **Trailing commas**: Always

---

## Routing Guide

### TanStack Router Folder-Based Routing

```
routes/
  __root.tsx                    # Root layout
  index.tsx                     # Home route (/)
  posts/
    index.tsx                   # /posts
    create/
      index.tsx                 # /posts/create
    $postId.tsx                 # /posts/:postId (dynamic)
```

### Basic Route Pattern

```typescript
import { createFileRoute } from '@tanstack/react-router';
import { lazy } from 'react';

const PostsList = lazy(() =>
    import('@/features/posts/components/PostsList').then(
        (module) => ({ default: module.PostsList }),
    ),
);

export const Route = createFileRoute('/posts/')({
    component: PostsPage,
    loader: () => ({
        crumb: 'Posts List',
    }),
});

function PostsPage() {
    return <PostsList title='All Posts' showFilters={true} />;
}
```

### Dynamic Routes

```typescript
// routes/users/$userId.tsx
export const Route = createFileRoute('/users/$userId')({
    component: UserPage,
});

function UserPage() {
    const { userId } = Route.useParams();
    return <UserProfile userId={userId} />;
}
```

### Programmatic Navigation

```typescript
import { useNavigate } from '@tanstack/react-router';

const navigate = useNavigate();

// Basic navigation
navigate({ to: '/posts' });

// With params
navigate({ to: '/users/$userId', params: { userId: '123' } });

// With search params
navigate({ to: '/search', search: { query: 'test', page: 1 } });
```

---

## Loading & Error States

### Strict Rule: NEVER Use Early Returns

```typescript
// Wrong - causes layout shift
if (isLoading) {
    return <LoadingSpinner />;
}

// Correct - maintains consistent layout
<SuspenseLoader>
    <Content />
</SuspenseLoader>
```

**Reasons:**
1. **Layout shift**: Content position jumps when loading completes
2. **CLS**: Poor Core Web Vitals score
3. **Bad UX**: Page structure changes abruptly
4. **Lost scroll position**: User loses their place on the page

### Loading Approach Priority

1. **Preferred**: SuspenseLoader + useSuspenseQuery (modern pattern)
2. **Acceptable**: LoadingOverlay (legacy pattern)
3. **Tolerable**: Skeleton screens (maintains same layout)
4. **Prohibited**: Early returns or conditional layouts

### Error Handling

**Must use `useMuiSnackbar`, not react-toastify**

```typescript
import { useMuiSnackbar } from '@/hooks/useMuiSnackbar';

const { showSuccess, showError, showInfo, showWarning } = useMuiSnackbar();

// Available methods:
// showSuccess(message)  - Green success message
// showError(message)    - Red error message
// showWarning(message)  - Orange warning message
// showInfo(message)     - Blue info message
```

### Error Boundaries

```typescript
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error) => console.error('Boundary caught:', error)}
>
    <SuspenseLoader>
        <ComponentThatMightError />
    </SuspenseLoader>
</ErrorBoundary>
```

---

## Performance Optimization

### useMemo - Expensive Computations

```typescript
const filteredItems = useMemo(() => {
    return items
        .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));
}, [items, searchTerm]);
```

**Use for:** Filtering/sorting large arrays, complex calculations, data transformations

### useCallback - Event Handlers Passed to Children

```typescript
const handleClick = useCallback((id: string) => {
    console.log('Clicked:', id);
}, []);

return <Child onClick={handleClick} />;
```

### React.memo - Component Memoization

```typescript
export const ExpensiveComponent = React.memo<ExpensiveComponentProps>(
    function ExpensiveComponent({ data, onAction }) {
        return <ComplexVisualization data={data} />;
    }
);
```

### Debounced Search

```typescript
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

const { data } = useSuspenseQuery({
    queryKey: ['search', debouncedSearchTerm],
    queryFn: () => api.search(debouncedSearchTerm),
});
```

**Optimal debounce times:**
- **300-500ms**: Search/filtering
- **1000ms**: Auto-save
- **100-200ms**: Real-time validation

### Memory Leak Prevention

```typescript
useEffect(() => {
    const intervalId = setInterval(() => {
        setCount(c => c + 1);
    }, 1000);

    return () => {
        clearInterval(intervalId);  // Cleanup!
    };
}, []);
```

### Lazy Loading Heavy Dependencies

```typescript
// Wrong - top-level import of heavy library
import jsPDF from 'jspdf';

// Correct - dynamic import when needed
const handleExportPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    // use it
};
```

---

## TypeScript Standards

### Strict Mode

```json
// tsconfig.json
{
    "compilerOptions": {
        "strict": true,
        "noImplicitAny": true,
        "strictNullChecks": true
    }
}
```

### No `any` Type

```typescript
// Wrong
function handleData(data: any) { return data.something; }

// Correct - use specific types
interface MyData { something: string; }
function handleData(data: MyData) { return data.something; }

// Correct - use unknown for truly unknown data
function handleUnknown(data: unknown) {
    if (typeof data === 'object' && data !== null && 'something' in data) {
        return (data as MyData).something;
    }
}
```

### Type Imports

```typescript
// Correct - explicitly marked as type imports
import type { User } from '~types/user';
import type { SxProps, Theme } from '@mui/material';

// Avoid - mixing value and type imports
import { User } from '~types/user';  // Unclear if type or value
```

### Utility Types

```typescript
Partial<T>     // All properties optional
Pick<T, K>     // Select specific properties
Omit<T, K>     // Exclude specific properties
Required<T>    // All properties required
Record<K, V>   // Type-safe objects/maps
```

---

## Common Patterns

### Authentication: useAuth Hook

```typescript
import { useAuth } from '@/hooks/useAuth';

const { user } = useAuth();
// user.id, user.email, user.username, user.roles
```

**NEVER** call auth APIs directly; always use the `useAuth` hook.

### Forms: React Hook Form + Zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof formSchema>;

const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
});
```

### Dialog Standard Structure

All dialogs should include: icon in title, close button (X), action buttons at the bottom.

### State Management

| Data Type | Solution | Notes |
|-----------|----------|-------|
| Server data | TanStack Query | Primary approach |
| Local UI state | useState | Modals, selected tabs, etc. |
| Global client state | Zustand | Only for theme preferences, etc. |

---

## Core Principles

1. **Lazy load all heavy content**: Routes, DataGrids, charts, editors
2. **Use Suspense for loading**: SuspenseLoader, not early returns
3. **useSuspenseQuery**: Primary data fetching pattern for new code
4. **Canonical feature organization**: api/, components/, hooks/, helpers/ subdirectories
5. **Styles by size**: Inline if < 100 lines, separate file if > 100 lines
6. **Import aliases**: Use @/, ~types, ~components, ~features
7. **No early returns**: Prevents layout shift
8. **useMuiSnackbar**: Unified user notifications

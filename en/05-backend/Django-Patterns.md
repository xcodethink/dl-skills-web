# Django Patterns

> Source: [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> File: skills/django-patterns/SKILL.md

---

## Project Structure

Split settings (base/development/production/test), apps directory with models, views, serializers, services, and tests per app.

## Model Design

- Custom QuerySet methods: `active()`, `with_category()`, `in_stock()`, `search()`
- Manager methods: `get_or_none()`, `create_with_tags()`, `bulk_update_stock()`
- Proper Meta: indexes, constraints, ordering

## Django REST Framework

### Serializers
- ModelSerializer with computed fields (`SerializerMethodField`)
- Separate serializers for create vs read operations
- Field-level and object-level validation

### ViewSets
- `select_related`/`prefetch_related` on queryset
- `get_serializer_class()` for action-specific serializers
- Custom actions with `@action` decorator
- Filter backends, search fields, ordering

## Service Layer

Separate business logic from views. Use `@transaction.atomic` for multi-step operations.

## Caching

- View-level: `@cache_page(60 * 15)`
- Low-level: `cache.get(key)` / `cache.set(key, value, timeout)`
- Template fragments: `{% cache 500 sidebar %}`

## Performance

- `select_related` for ForeignKey (prevents N+1)
- `prefetch_related` for ManyToMany
- `bulk_create` / `bulk_update` for batch operations
- Database indexes on common filter fields

## Signals & Middleware

- Signals for side effects (create profile on user creation)
- Custom middleware for request logging, active user tracking

---

| Pattern | Purpose |
|---------|---------|
| Split settings | Environment-specific configuration |
| Custom QuerySet | Reusable, chainable queries |
| Service Layer | Business logic separation |
| select_related/prefetch_related | N+1 prevention |
| Caching | Performance optimization |

---

**Remember**: Structure and organization matter more than concise code for production Django apps.

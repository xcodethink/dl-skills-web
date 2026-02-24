# Django Security

> **Source**: [affaan-m/everything-claude-code](https://github.com/AffaanM/everything-claude-code)
> **Original file**: skills/django-security/SKILL.md
> **Category**: E-Security

---

## Overview

Comprehensive security guidelines for Django applications covering authentication, authorization, CSRF, SQL injection prevention, XSS prevention, and secure deployment configuration.

---

## When to Activate

- Setting up Django authentication/authorization
- Implementing user permissions and roles
- Configuring production security settings
- Reviewing Django apps for security issues
- Deploying Django to production

---

## Core Production Settings

```python
DEBUG = False  # CRITICAL: Never True in production

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
if not SECRET_KEY:
    raise ImproperlyConfigured('DJANGO_SECRET_KEY required')
```

---

## Authentication

- Use a **custom user model** with email as `USERNAME_FIELD`
- Use **Argon2** or **BCrypt** password hashers (stronger than default PBKDF2)
- Configure all password validators with minimum length of 12

```python
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.Argon2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
]
```

---

## Authorization

### Django Permissions + DRF

```python
# Model-level permissions
class Post(models.Model):
    class Meta:
        permissions = [
            ('can_publish', 'Can publish posts'),
            ('can_edit_others', 'Can edit posts of others'),
        ]

# View-level with mixins
class PostUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    permission_required = 'app.can_edit_others'
    raise_exception = True
```

### DRF Custom Permissions

```python
class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user
```

### RBAC Pattern

```python
class User(AbstractUser):
    ROLE_CHOICES = [('admin', 'Admin'), ('moderator', 'Mod'), ('user', 'User')]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')

    def is_admin(self):
        return self.role == 'admin' or self.is_superuser
```

---

## SQL Injection Prevention

```python
# SAFE: ORM (auto-parameterized)
User.objects.filter(email__iexact=email)
User.objects.filter(Q(username__icontains=q) | Q(email__icontains=q))

# SAFE: raw() with parameters
User.objects.raw('SELECT * FROM users WHERE email = %s', [email])

# DANGEROUS: String interpolation
User.objects.raw(f'SELECT * FROM users WHERE username = {username}')  # NEVER
```

---

## XSS Prevention

- Django auto-escapes template variables by default
- Never use `|safe` with user input
- Use `format_html()` for dynamic HTML
- Use `escapejs` filter for JavaScript contexts
- Set security headers: CSP, X-Content-Type-Options, X-Frame-Options

---

## CSRF Protection

- CSRF enabled by default; include `{% csrf_token %}` in forms
- For AJAX: read `csrftoken` cookie and send as `X-CSRFToken` header
- Use `@csrf_exempt` only for external webhooks
- Set `CSRF_COOKIE_SECURE`, `CSRF_COOKIE_HTTPONLY`, `CSRF_COOKIE_SAMESITE`

---

## File Upload Security

```python
def validate_file_extension(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
    if ext.lower() not in valid_extensions:
        raise ValidationError('Unsupported file extension.')

def validate_file_size(value):
    if value.size > 5 * 1024 * 1024:
        raise ValidationError('File too large. Max 5MB.')
```

Store uploads outside web root; use S3 or CDN for production.

---

## API Security (DRF)

```python
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',
        'user': '1000/day',
        'upload': '10/hour',
    },
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}
```

---

## Environment Variables

Use `django-environ` or `python-decouple`:
```python
import environ
env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env()
SECRET_KEY = env('DJANGO_SECRET_KEY')
```

Never commit `.env` files.

---

## Quick Checklist

| Check | Description |
|-------|-------------|
| `DEBUG = False` | Never run DEBUG in production |
| HTTPS only | Force SSL, secure cookies |
| Strong secrets | Environment variables for SECRET_KEY |
| Password validation | All validators enabled, min 12 chars |
| CSRF protection | Enabled by default, don't disable |
| XSS prevention | Don't use `|safe` with user input |
| SQL injection | Use ORM, never concatenate queries |
| File uploads | Validate type and size |
| Rate limiting | Throttle API endpoints |
| Security headers | CSP, X-Frame-Options, HSTS |
| Logging | Log security events |
| Updates | Keep Django and dependencies current |

---

**Remember**: Security is a process, not a product. Regularly review and update your practices.

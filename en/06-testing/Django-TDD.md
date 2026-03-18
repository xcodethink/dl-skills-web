# Django TDD with pytest

> **Source:** [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> **Original files:** skills/django-tdd/SKILL.md
> **Curated:** 2026-02-21

---

## Overview

Test-driven development for Django applications using pytest-django, factory_boy, and Django REST Framework. Covers model testing, view testing, API testing, mocking, integration tests, and coverage configuration.

---

## TDD Cycle

```python
# RED: Failing test
def test_user_creation():
    user = User.objects.create_user(email='test@example.com', password='pass123')
    assert user.email == 'test@example.com'

# GREEN: Create model/factory to pass
# REFACTOR: Improve while green
```

---

## Setup

### pytest.ini

```ini
[pytest]
DJANGO_SETTINGS_MODULE = config.settings.test
testpaths = tests
addopts = --reuse-db --nomigrations --cov=apps --cov-report=term-missing --strict-markers
```

### Test Settings

```python
# config/settings/test.py
DATABASES = {'default': {'ENGINE': 'django.db.backends.sqlite3', 'NAME': ':memory:'}}
PASSWORD_HASHERS = ['django.contrib.auth.hashers.MD5PasswordHasher']
CELERY_TASK_ALWAYS_EAGER = True
```

### conftest.py

```python
@pytest.fixture
def user(db):
    return User.objects.create_user(email='test@example.com', password='pass123')

@pytest.fixture
def authenticated_client(client, user):
    client.force_login(user)
    return client

@pytest.fixture
def api_client():
    from rest_framework.test import APIClient
    return APIClient()

@pytest.fixture
def authenticated_api_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client
```

---

## Factory Boy

```python
class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
    email = factory.Sequence(lambda n: f"user{n}@example.com")
    password = factory.PostGenerationMethodCall('set_password', 'pass123')

class ProductFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Product
    name = factory.Faker('sentence', nb_words=3)
    price = fuzzy.FuzzyDecimal(10.00, 1000.00, 2)
    category = factory.SubFactory(CategoryFactory)
```

Usage:
```python
product = ProductFactory(price=100.00)
products = ProductFactory.create_batch(10)
product_with_tags = ProductFactory(tags=[tag1, tag2])
```

---

## Model Testing

```python
class TestProductModel:
    def test_creation(self, db):
        product = ProductFactory()
        assert product.id is not None

    def test_slug_generation(self, db):
        product = ProductFactory(name='Test Product')
        assert product.slug == 'test-product'

    def test_price_validation(self, db):
        product = ProductFactory(price=-10)
        with pytest.raises(ValidationError):
            product.full_clean()

    def test_stock_management(self, db):
        product = ProductFactory(stock=10)
        product.reduce_stock(5)
        assert product.stock == 5
        with pytest.raises(ValueError):
            product.reduce_stock(10)
```

---

## DRF API Testing

```python
class TestProductAPI:
    def test_list(self, api_client, db):
        ProductFactory.create_batch(10)
        response = api_client.get(reverse('api:product-list'))
        assert response.status_code == 200
        assert response.data['count'] == 10

    def test_create_unauthorized(self, api_client, db):
        response = api_client.post(reverse('api:product-list'), {'name': 'Test'})
        assert response.status_code == 401

    def test_create_authorized(self, authenticated_api_client, db):
        data = {'name': 'Test', 'price': '99.99', 'stock': 10}
        response = authenticated_api_client.post(reverse('api:product-list'), data)
        assert response.status_code == 201

    def test_filter_by_price(self, api_client, db):
        ProductFactory(price=50)
        ProductFactory(price=150)
        response = api_client.get(reverse('api:product-list'), {'price_min': 100})
        assert response.data['count'] == 1
```

---

## Mocking External Services

```python
@patch('apps.payments.services.stripe')
def test_payment(mock_stripe, client, user, product):
    mock_stripe.Charge.create.return_value = {'id': 'ch_123', 'status': 'succeeded'}
    client.force_login(user)
    response = client.post(reverse('payments:process'), {'product_id': product.id})
    assert response.status_code == 302
    mock_stripe.Charge.create.assert_called_once()
```

### Email Testing

```python
@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
def test_confirmation_email(db, order):
    order.send_confirmation_email()
    assert len(mail.outbox) == 1
    assert order.user.email in mail.outbox[0].to
```

---

## Integration Testing

```python
class TestCheckoutFlow:
    def test_guest_to_purchase(self, client, db):
        # Register -> Login -> Browse -> Add to cart -> Checkout -> Purchase
        client.post(reverse('users:register'), {...})
        client.post(reverse('users:login'), {...})
        product = ProductFactory(price=100)
        client.post(reverse('cart:add'), {'product_id': product.id})
        with patch('apps.checkout.services.process_payment') as mock:
            mock.return_value = True
            client.post(reverse('checkout:complete'))
        assert Order.objects.filter(user__email='test@example.com').exists()
```

---

## Coverage Targets

| Component | Target |
|-----------|--------|
| Models | 90%+ |
| Serializers | 85%+ |
| Views | 80%+ |
| Services | 90%+ |
| Overall | 80%+ |

---

## Best Practices

**DO:** Use factories, one assertion per test, descriptive names, test edge cases, mock externals, use fixtures, test permissions, keep tests fast (`--reuse-db`, `--nomigrations`)

**DON'T:** Test Django internals, test third-party code, ignore failures, make tests dependent, over-mock, test private methods, use production database

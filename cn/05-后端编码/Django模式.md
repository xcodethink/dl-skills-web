# Django 模式

> 来源：[affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> 原始文件：skills/django-patterns/SKILL.md

---

## 何时激活

- 构建 Django Web 应用
- 设计 Django REST Framework API
- 使用 Django ORM 和模型
- 设置 Django 项目结构
- 实现缓存、信号（Signals）、中间件（Middleware）

---

## 项目结构

```
myproject/
├── config/
│   ├── settings/
│   │   ├── base.py          # 基础设置
│   │   ├── development.py   # 开发设置
│   │   ├── production.py    # 生产设置
│   │   └── test.py          # 测试设置
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── manage.py
└── apps/
    ├── users/
    │   ├── models.py
    │   ├── views.py
    │   ├── serializers.py
    │   ├── urls.py
    │   ├── permissions.py
    │   ├── services.py       # 业务逻辑
    │   └── tests/
    └── products/
```

---

## 模型设计模式

### 模型最佳实践

```python
class Product(models.Model):
    """带有适当字段配置的产品模型。"""
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=250)
    description = models.TextField(blank=True)
    price = models.DecimalField(
        max_digits=10, decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    category = models.ForeignKey(
        'Category', on_delete=models.CASCADE, related_name='products'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'products'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['-created_at']),
            models.Index(fields=['category', 'is_active']),
        ]
        constraints = [
            models.CheckConstraint(
                check=models.Q(price__gte=0),
                name='price_non_negative'
            )
        ]
```

### 自定义 QuerySet

```python
class ProductQuerySet(models.QuerySet):
    def active(self):
        """只返回活跃产品。"""
        return self.filter(is_active=True)

    def with_category(self):
        """关联查询分类，避免 N+1 查询。"""
        return self.select_related('category')

    def with_tags(self):
        """预获取多对多关系的标签。"""
        return self.prefetch_related('tags')

    def in_stock(self):
        return self.filter(stock__gt=0)

    def search(self, query):
        return self.filter(
            models.Q(name__icontains=query) |
            models.Q(description__icontains=query)
        )

# 用法
Product.objects.active().with_category().in_stock()
```

---

## Django REST Framework 模式

### 序列化器（Serializer）

```python
class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    discount_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'description', 'price',
                  'discount_price', 'stock', 'category_name', 'created_at']
        read_only_fields = ['id', 'slug', 'created_at']

    def get_discount_price(self, obj):
        if hasattr(obj, 'discount') and obj.discount:
            return obj.price * (1 - obj.discount.percent / 100)
        return obj.price

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("价格不能为负数。")
        return value
```

### ViewSet 模式

```python
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category').prefetch_related('tags')
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'name']

    def get_serializer_class(self):
        """根据操作返回适当的序列化器。"""
        if self.action == 'create':
            return ProductCreateSerializer
        return ProductSerializer

    def perform_create(self, serializer):
        """保存时带上用户上下文。"""
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """返回推荐产品。"""
        featured = self.queryset.filter(is_featured=True)[:10]
        serializer = self.get_serializer(featured, many=True)
        return Response(serializer.data)
```

---

## 服务层模式（Service Layer）

```python
class OrderService:
    """订单相关业务逻辑的服务层。"""

    @staticmethod
    @transaction.atomic
    def create_order(user, cart: Cart) -> Order:
        """从购物车创建订单。"""
        order = Order.objects.create(
            user=user, total_price=cart.total_price
        )

        for item in cart.items.all():
            OrderItem.objects.create(
                order=order, product=item.product,
                quantity=item.quantity, price=item.product.price
            )

        cart.items.all().delete()  # 清空购物车
        return order
```

---

## 缓存策略

### 视图级缓存

```python
@method_decorator(cache_page(60 * 15), name='dispatch')  # 15 分钟
class ProductListView(generic.ListView):
    model = Product
```

### 底层缓存

```python
from django.core.cache import cache

def get_featured_products():
    """获取带缓存的推荐产品。"""
    cache_key = 'featured_products'
    products = cache.get(cache_key)

    if products is None:
        products = list(Product.objects.filter(is_featured=True))
        cache.set(cache_key, products, timeout=60 * 15)

    return products
```

---

## 信号（Signals）

```python
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """用户创建时创建配置文件。"""
    if created:
        Profile.objects.create(user=instance)
```

---

## 中间件（Middleware）

```python
class RequestLoggingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.start_time = time.time()

    def process_response(self, request, response):
        if hasattr(request, 'start_time'):
            duration = time.time() - request.start_time
            logger.info(f'{request.method} {request.path} - {response.status_code} - {duration:.3f}s')
        return response
```

---

## 性能优化

### N+1 查询防范

```python
# 错误 -- N+1 查询
products = Product.objects.all()
for product in products:
    print(product.category.name)  # 每个产品一条单独查询

# 正确 -- 使用 select_related 单次查询
products = Product.objects.select_related('category').all()

# 正确 -- 多对多使用 prefetch_related
products = Product.objects.prefetch_related('tags').all()
```

### 批量操作

```python
# 批量创建
Product.objects.bulk_create([
    Product(name=f'产品 {i}', price=10.00)
    for i in range(1000)
])

# 批量更新
Product.objects.bulk_update(products, ['is_active'])
```

---

## 分离设置模式（Split Settings）

```python
# config/settings/production.py
from .base import *

DEBUG = False
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS')
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
```

---

## 速查表

| 模式 | 描述 |
|------|------|
| 分离设置 | 分开 dev/prod/test 设置 |
| 自定义 QuerySet | 可复用的查询方法 |
| 服务层 | 业务逻辑分离 |
| ViewSet | REST API 端点 |
| select_related | 外键优化 |
| prefetch_related | 多对多优化 |
| 缓存优先 | 缓存昂贵操作 |
| 信号 | 事件驱动操作 |
| 中间件 | 请求/响应处理 |

---

**记住**：Django 提供了很多快捷方式，但对于生产应用，结构和组织比简洁代码更重要。为可维护性而构建。

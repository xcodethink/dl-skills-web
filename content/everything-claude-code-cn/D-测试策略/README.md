# D-测试策略

> **来源：** [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)

本分类包含各种语言和框架的测试策略、TDD 工作流、覆盖率分析和最佳实践。

---

## 文件索引

| 文件 | 原始技能名 | 核心理念 |
|------|-----------|---------|
| [01-E2E端到端测试.md](01-E2E端到端测试.md) | e2e-runner + e2e + e2e-testing | 使用 Playwright 进行端到端测试：页面对象模型、不稳定测试处理、工件管理、CI/CD 集成 |
| [02-测试覆盖率.md](02-测试覆盖率.md) | test-coverage + common/testing | 多框架覆盖率分析，80% 最低目标，TDD 强制工作流 |
| [03-Python测试.md](03-Python测试.md) | python-testing + python/testing | pytest 全面测试策略：Fixtures、Mock、参数化、异步测试、覆盖率 |
| [04-Go测试.md](04-Go测试.md) | golang-testing + go-test + golang/testing | Go 地道测试模式：表驱动测试、子测试、基准测试、模糊测试、竞态检测 |
| [05-C++测试.md](05-C++测试.md) | cpp-testing | GoogleTest/GoogleMock + CMake/CTest 测试工作流：Sanitizer、覆盖率、模糊测试 |
| [06-Django-TDD.md](06-Django-TDD.md) | django-tdd | Django TDD 工作流：pytest-django、factory_boy、DRF API 测试、集成测试 |
| [07-SpringBoot-TDD.md](07-SpringBoot-TDD.md) | springboot-tdd | Spring Boot TDD：JUnit 5、Mockito、MockMvc、Testcontainers、JaCoCo |

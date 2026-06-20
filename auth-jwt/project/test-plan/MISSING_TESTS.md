# Testes Faltantes - Todo List

## 📋 Arquivos sem Testes Diretos

### 🏛️ Domain Layer - Domain Exceptions

- [ ] `src/domain/domain-exceptions/cart.exceptions.ts` - Exceções de domínio: carrinho
- [ ] `src/domain/domain-exceptions/email.exception.ts` - Exceção de domínio: email inválido
- [ ] `src/domain/domain-exceptions/password.exception.ts` - Exceção de domínio: senha inválida
- [ ] `src/domain/domain-exceptions/product.exceptions.ts` - Exceções de domínio: produto
- [ ] `src/domain/domain-exceptions/user.exceptions.ts` - Exceções de domínio: usuário

### 🔄 Mappers (Infrastructure)

- [ ] `src/infrastructure/mappers/cart.mapper.ts` - Mapeador: domain ↔ persistência (carrinho)
- [ ] `src/infrastructure/mappers/product.mapper.ts` - Mapeador: domain ↔ persistência (produto)

### 🗃️ Repositories (Infrastructure)

- [ ] `src/infrastructure/repositories/cart.repository.ts` - Repositório de carrinhos (infraestrutura)
- [ ] `src/infrastructure/repositories/user.repository.ts` - Repositório de usuários (infraestrutura)

### 📦 DTOs (Services)

- [ ] `src/services/dto/create-user.dto.ts` - DTO de criação de usuário
- [ ] `src/services/dto/update-user.dto.ts` - DTO de atualização de usuário

### 🌐 Testes E2E

- [ ] `test/e2e/controllers/product-controller.e2e.spec.ts` - Arquivo vazio (0 linhas), sem implementação

---

## ✅ Arquivos com Testes (cobertura existente)

### 🌐 Application Layer

- [x] `src/app.ts` — `test/unit/app.spec.ts`
- [x] `src/webserver/server.ts` — `test/unit/webserver/server.spec.ts`

### 🗄️ Database Layer

- [x] `src/database/source.ts` — `test/unit/database/source.spec.ts`
- [x] `src/database/migrations/create-table-users.ts` — `test/unit/database/migrations/create-tables.spec.ts`
- [x] `src/database/migrations/1779670012718-create-table-products.ts` — `test/unit/database/migrations/create-tables.spec.ts`
- [x] `src/database/migrations/1779670052952-create-table-cart.ts` — `test/unit/database/migrations/create-tables.spec.ts`
- [x] `src/database/migrations/1779670100000-create-table-cart-items.ts` — `test/unit/database/migrations/create-tables.spec.ts`
- [x] `src/database/seeds/main.ts` — `test/unit/database/seeds/main.spec.ts`
- [x] `src/database/seeds/user.seed.ts` — `test/unit/database/seeds/user.seed.spec.ts`
- [x] `src/database/seeds/cart.seed.ts` — `test/unit/database/seeds/cart.seed.spec.ts`
- [x] `src/database/seeds/product.seed.ts` — `test/unit/database/seeds/product.seed.spec.ts`

### 📚 Documentation Layer

- [x] `src/docs/swagger.ts` — `test/unit/docs/swagger.spec.ts`
- [x] `src/docs/types.ts` — `test/unit/docs/types.spec.ts`

### 🎮 HTTP Controllers

- [x] `src/http/controllers/auth.controller.ts` — `test/unit/http/controllers/auth.controller.spec.ts` + e2e
- [x] `src/http/controllers/user.controller.ts` — `test/unit/http/controllers/user.controller.spec.ts` + e2e
- [x] `src/http/controllers/cart.controller.ts` — `test/unit/http/controllers/cart.controller.spec.ts` + e2e

### 🔐 Middlewares

- [x] `src/http/controllers/middlewares/api-token.middleware.ts` — `test/unit/http/controllers/middlewares/api-token.middleware.spec.ts`
- [x] `src/http/controllers/middlewares/auth.middleware.ts` — `test/unit/http/controllers/middlewares/auth.middleware.spec.ts`
- [x] `src/http/controllers/middlewares/cart.middleware.ts` — `test/unit/http/controllers/middlewares/cart.middleware.spec.ts`

### ⚠️ HTTP Exceptions

- [x] `src/http/exceptions/auth.exception.ts` — `test/unit/http/exceptions/auth.exception.spec.ts`
- [x] `src/http/exceptions/user.exceptions.ts` — `test/unit/http/exceptions/user.exceptions.spec.ts`
- [x] `src/http/exceptions/cart.exception.ts` — `test/unit/http/exceptions/cart.exception.spec.ts`

### 🔄 Mappers

- [x] `src/infrastructure/mappers/user.mapper.ts` — `test/unit/services/user.mapper.spec.ts`

### 🏢 Persistence Entities

- [x] `src/infrastructure/persistence/user-persistence.entity.ts` — `test/unit/infrastructure/persistence/persistence-entities.spec.ts`
- [x] `src/infrastructure/persistence/cart-persistence.entity.ts` — `test/unit/infrastructure/persistence/persistence-entities.spec.ts`
- [x] `src/infrastructure/persistence/cart-items-persistence.entity.ts` — `test/unit/infrastructure/persistence/persistence-entities.spec.ts`
- [x] `src/infrastructure/persistence/product-persistence.entity.ts` — `test/unit/infrastructure/persistence/persistence-entities.spec.ts`

### 🧱 Base / Abstrações

- [x] `src/infrastructure/persistence/base-typeORM/base-persistence.entity.ts` — `test/unit/infrastructure/persistence/base-persistence.entity.spec.ts`
- [x] `src/lib/specifications-base/base.specifications.ts` — `test/unit/lib/specifications-base/base.specifications.spec.ts`

### 🛣️ Routes

- [x] `src/router/auth-router.ts` — `test/unit/router/routes.spec.ts`
- [x] `src/router/user-router.ts` — `test/unit/router/routes.spec.ts`
- [x] `src/router/cart-router.ts` — `test/unit/router/routes.spec.ts`

### 📦 Services (Use Cases)

- [x] `src/services/auth.use-cases.ts` — `test/unit/services/auth.use-case.spec.ts`
- [x] `src/services/user.use-cases.ts` — `test/unit/services/create-user.use-case.spec.ts`, `update-user.use-case.spec.ts`, `delete-user.use-case.spec.ts`, `find-user.use-case.spec.ts`
- [x] `src/services/cart.use-cases.ts` — `test/unit/services/cart.use-cases.spec.ts`

### 🛠️ Utilities

- [x] `src/lib/consts.ts` — `test/unit/lib/consts.spec.ts`
- [x] `src/lib/log.ts` — `test/unit/lib/log.spec.ts`

### 🏛️ Domain Layer - Entities

- [x] `src/domain/entities/user.entity.ts` — `test/unit/domain/entities/user.entity.spec.ts`
- [x] `src/domain/entities/cart.entity.ts` — `test/unit/domain/entities/cart.entity.spec.ts`
- [x] `src/domain/entities/cart-items.entity.ts` — `test/unit/domain/entities/cart-items.entity.spec.ts`
- [x] `src/domain/entities/product.entity.ts` — `test/unit/domain/entities/product.entity.spec.ts`

### 🏛️ Domain Layer - Value Objects

- [x] `src/domain/value-objects/email.value-object.ts` — `test/unit/domain/value-objects/email.value-object.spec.ts`
- [x] `src/domain/value-objects/password.value-object.ts` — `test/unit/domain/value-objects/password.value-object.spec.ts`

### 🏛️ Domain Layer - Specifications

- [x] `src/domain/specifications/user.specifications.ts` — `test/unit/domain/specifications/user.specifications.spec.ts`
- [x] `src/domain/specifications/cart.specifications.ts` — `test/unit/domain/specifications/cart.specifications.spec.ts`

### 🏛️ Domain Layer - Repositories (Interfaces)

- [x] `src/domain/repositories/user.repository.ts` — `test/unit/domain/repositories/user.repository.spec.ts`
- [x] `src/domain/repositories/cart.repository.ts` — `test/unit/domain/repositories/cart.repository.spec.ts`

---

## 📊 Resumo

| Categoria | Sem testes | Com testes |
|---|---|---|
| Application (app, server) | 0 | 2 |
| Database (source, migrations, seeds) | 0 | 9 |
| Docs (swagger, types) | 0 | 2 |
| HTTP Controllers | 0 | 3 |
| Middlewares | 0 | 3 |
| HTTP Exceptions | 0 | 3 |
| Mappers | 2 | 1 |
| Persistence Entities | 0 | 4 |
| Base / Abstrações | 0 | 2 |
| Repositories (infra) | 2 | 0 |
| Domain Exceptions | 5 | 0 |
| DTOs | 2 | 0 |
| Routes | 0 | 3 |
| Services (use cases) | 0 | 3 |
| Utilities (lib) | 0 | 2 |
| Domain Entities | 0 | 4 |
| Domain Value Objects | 0 | 2 |
| Domain Specifications | 0 | 2 |
| Domain Repositories | 0 | 2 |
| E2E (vazio/placeholder) | 1 | 3 |
| **Total** | **12** | **48** |

### Prioridade sugerida:

1. 🔴 **Crítica**: Repositories de infraestrutura (`cart.repository.ts`, `user.repository.ts`) — dependência para testes e2e com banco real
2. 🟠 **Alta**: Mappers (`cart.mapper.ts`, `product.mapper.ts`) e Domain Exceptions (5 arquivos)
3. 🟢 **Baixa**: DTOs (`create-user.dto.ts`, `update-user.dto.ts`) — classes simples sem lógica
4. ⬜ **Placeholder**: E2E product controller (`product-controller.e2e.spec.ts` — arquivo vazio)

# Testes Faltantes - Todo List

## 📋 Arquivos sem Testes Diretos

### 🌐 Application Layer

- [x] `src/app.ts` - Configuração principal da aplicação — `test/unit/app.spec.ts`
- [x] `src/webserver/server.ts` - Inicialização do servidor — `test/unit/webserver/server.spec.ts`

### 🗄️ Database Layer

- [x] `src/database/source.ts` - Configuração da conexão com banco de dados — `test/unit/database/source.spec.ts`
- [x] `src/database/migrations/create-table-users.ts` - Migração: criação tabela usuários — `test/unit/database/migrations/create-tables.spec.ts`
- [x] `src/database/migrations/1779670012718-create-table-products.ts` - Migração: criação tabela produtos — `test/unit/database/migrations/create-tables.spec.ts`
- [x] `src/database/migrations/1779670052952-create-table-cart.ts` - Migração: criação tabela carrinho — `test/unit/database/migrations/create-tables.spec.ts`
- [x] `src/database/migrations/1779670100000-create-table-cart-items.ts` - Migração: criação tabela itens do carrinho — `test/unit/database/migrations/create-tables.spec.ts`
- [x] `src/database/seeds/main.ts` - Script principal de seeds — `test/unit/database/seeds/main.spec.ts`
- [x] `src/database/seeds/user.seed.ts` - Seed de usuários — `test/unit/database/seeds/user.seed.spec.ts`
- [x] `src/database/seeds/cart.seed.ts` - Seed de carrinhos — `test/unit/database/seeds/cart.seed.spec.ts`

### 📚 Documentation Layer

- [x] `src/docs/swagger.ts` - Configuração do Swagger — `test/unit/docs/swagger.spec.ts`
- [x] `src/docs/types.ts` - Tipos para documentação — `test/unit/docs/types.spec.ts`

### 🎮 HTTP Controllers

- [ ] `src/http/controllers/auth.controller.ts` - Controller de autenticação
- [ ] `src/http/controllers/user.controller.ts` - Controller de usuários
- [ ] `src/http/controllers/cart.controller.ts` - Controller de carrinhos

### 🔐 Middlewares

- [ ] `src/http/controllers/middlewares/api-token.middleware.ts` - Middleware de validação de token API
- [ ] `src/http/controllers/middlewares/auth.middleware.ts` - Middleware de autenticação
- [ ] `src/http/controllers/middlewares/cart.middleware.ts` - Middleware de validação do carrinho

### ⚠️ HTTP Exceptions

- [ ] `src/http/exceptions/auth.exception.ts` - Exceções de autenticação
- [ ] `src/http/exceptions/user.exceptions.ts` - Exceções de usuários
- [ ] `src/http/exceptions/cart.exception.ts` - Exceções de carrinho

### 🔄 Mappers

- [ ] `src/infrastructure/mappers/cart.mapper.ts` - Mapeador: domain ↔ persistência (carrinho)
- [ ] `src/infrastructure/mappers/product.mapper.ts` - Mapeador: domain ↔ persistência (produto)

### 💾 Repositories (Infrastructure)

- [ ] `src/infrastructure/repositories/cart.repository.ts` - Repositório de carrinhos (infraestrutura)
- [ ] `src/infrastructure/repositories/user.repository.ts` - Repositório de usuários (infraestrutura)

### 🏢 Persistence Entities

- [ ] `src/infrastructure/persistence/user-persistence.entity.ts` - Entidade de persistência: usuário
- [ ] `src/infrastructure/persistence/cart-persistence.entity.ts` - Entidade de persistência: carrinho
- [ ] `src/infrastructure/persistence/cart-product-persistence.entity.ts` - Entidade de persistência: item do carrinho
- [ ] `src/infrastructure/persistence/product-persistence.entity.ts` - Entidade de persistência: produto

### 🛣️ Routes

- [ ] `src/router/auth-router.ts` - Rotas de autenticação
- [ ] `src/router/user-router.ts` - Rotas de usuários
- [ ] `src/router/cart-router.ts` - Rotas de carrinhos

### 📦 Services (Use Cases)

- [ ] `src/services/cart.use-cases.ts` - Use cases do carrinho

### 🛠️ Utilities

- [x] `src/lib/consts.ts` - Constantes da aplicação — `test/unit/lib/consts.spec.ts`

### 🏛️ Domain Layer - Specifications

- [ ] `src/domain/specifications/user.specifications.ts` - Especificações de usuário
- [ ] `src/domain/specifications/cart.specifications.ts` - Especificações de carrinho

### 🏛️ Domain Layer - Repositories (Interfaces)

- [ ] `src/domain/repositorie/user.repository.ts` - Interface do repositório de usuários
- [ ] `src/domain/repositorie/cart.repository.ts` - Interface do repositório de carrinhos

### 🏛️ Domain Layer - Entities

- [ ] `src/domain/entities/user.entity.ts` - Entidade de domínio: usuário
- [ ] `src/domain/entities/cart.entity.ts` - Entidade de domínio: carrinho
- [ ] `src/domain/entities/cart-product.entity.ts` - Entidade de domínio: item do carrinho
- [ ] `src/domain/entities/product.entity.ts` - Entidade de domínio: produto

### 🏛️ Domain Layer - Value Objects

- [ ] `src/domain/value-objects/password.value-objects.ts` - Value object: senha

---

## ✅ Arquivos com Testes

- [x] `src/services/auth.use-cases.ts` - ✓ Testes unitários
- [x] `src/services/user.use-cases.ts` - ✓ Testes unitários
- [x] `src/lib/log.ts` - ✓ Testes unitários
- [x] `src/infrastructure/mappers/user.mapper.ts` - ✓ Testes unitários
- [x] `src/domain/value-objects/email.value-objects.ts` - ✓ Testes unitários
- [x] `src/http/controllers/auth.controller.ts` - ✓ Testes e2e
- [x] `src/http/controllers/user.controller.ts` - ✓ Testes e2e
- [x] `src/app.ts` - ✓ Testes unitários
- [x] `src/webserver/server.ts` - ✓ Testes unitários
- [x] `src/docs/swagger.ts` - ✓ Testes unitários
- [x] `src/docs/types.ts` - ✓ Testes unitários
- [x] `src/lib/consts.ts` - ✓ Testes unitários
- [x] `src/database/source.ts` - ✓ Testes unitários
- [x] `src/database/migrations/create-table-users.ts` - ✓ Testes de integração
- [x] `src/database/migrations/1779670012718-create-table-products.ts` - ✓ Testes de integração
- [x] `src/database/migrations/1779670052952-create-table-cart.ts` - ✓ Testes de integração
- [x] `src/database/migrations/1779670100000-create-table-cart-items.ts` - ✓ Testes de integração
- [x] `src/database/seeds/main.ts` - ✓ Testes unitários
- [x] `src/database/seeds/user.seed.ts` - ✓ Testes unitários
- [x] `src/database/seeds/cart.seed.ts` - ✓ Testes unitários

---

## 📊 Resumo

### **Total de arquivos sem testes: 28**

### **Prioridade sugerida:**

1. 🔴 **Crítica**: Controllers e middlewares HTTP
2. 🟠 **Alta**: Repositories e Mappers
3. 🟡 **Média**: Entities, Specifications, Value Objects
4. 🟢 **Baixa**: Migrations, Seeds, Routes

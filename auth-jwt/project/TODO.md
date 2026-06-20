# TODO — auth-jwt

## 🔴 Crítico

- [ x ] Resolver merge conflict em `src/domain/repositorie/user.repository.ts` (linhas 11-15, `Partial<UserEntity>` vs `UserEntity`)

## 🟠 Alta prioridade

### Testes

- [ ] Corrigir `test/unit/unit-helpers/make-user.helper.ts` — usa `UserEntity.create()` inexistente
- [ ] Corrigir `test/unit/services/auth.use-case.spec.ts` — espera `result.token`, mas caso de uso retorna `{ user, accessToken, refreshToken }`
- [ ] Corrigir `test/unit/services/token-provider.spec.ts` — falta argumento `id` em `generateRefreshToken()`
- [ ] Corrigir `test/unit/services/user.mapper.spec.ts` — usa `UserEntity.create()` inexistente
- [ ] Adicionar header `x-api-token` nos testes E2E (`test/e2e/controllers/`)
- [ ] Adicionar Bearer token nos testes E2E de rotas protegidas
- [ ] Rodar `npm test` e confirmar que tudo passa
- [ ] Rodar `npm run test:e2e` e confirmar que tudo passa

### Dependências & Config

- [x] Adicionar `uuid` como dependência explícita no `package.json`
- [x] Migrar `.eslintrc.js` para `eslint.config.js` (ESLint v10)
- [x] Remover `.eslintignore` (depreciado no v10)
- [x] Rodar `npm run lint` e confirmar que passa

## 🟡 Média prioridade

- [x] Implementar `src/database/seeds/product.seed.ts` (arquivo vazio)
- [x] Corrigir `src/database/seeds/main.ts` — `messageHash` inicializado como `{}` causa `TypeError`
- [x] Sincronizar `src/database/seeds/main.ts` com `product.seed.ts` (seeds de produtos não são executadas)

## 🔵 Baixa prioridade

- [x] Renomear `src/domain/repositorie/` para `src/domain/repositories/`
- [x] Corrigir typo no `.env.example`: `JWT_ACCESS_TOKEN_EXPIRESINT` → `JWT_ACCESS_TOKEN_EXPIRESIN`
- [x] Verificar se `cart.http` (test/http) reflete as rotas atuais
- [-] Revisar e implementar testes pendentes (41 arquivos sem teste — ver `project/test-plan/MISSING_TESTS.md`)

---

## ✅ Como usar

Edite este arquivo e troque `[ ]` por `[x]` conforme for completando cada item.

# Páginas

- [ x ] **Login** - Formulário de autenticação (email + senha), chama o service de login
- [ ] **Register** - Criação de conta, já autentica automaticamente após cadastro
- [ ] **Products** - Página protegida. Lista os produtos da API. Testa token válido e refresh automático
- [ ] **Cart** - Página protegida. Exibe o carrinho do usuário logado. Exige autenticação
- [ ] **Profile** - Página protegida. Dados do usuário + botão de logout

# Funcionalidades compartilhadas

- [ ] Serviço de auth (axios + interceptor de refresh)
- [ ] Store global de autenticação (zustand)
- [ ] Rota protegida (roteador)
- [ ] Componente de formulário compartilhado (shadcn/ui)

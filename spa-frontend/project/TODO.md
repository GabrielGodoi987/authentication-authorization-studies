# Páginas

- [ x ] **Login** - Formulário de autenticação (email + senha), chama o service de login
- [ x ] **Register** - Criação de conta, já autentica automaticamente após cadastro
- [ x ] **Products** - Página protegida. Lista os produtos da API. Testa token válido e refresh automático
- [ x ] **Cart** - Página protegida. Exibe o carrinho do usuário logado. Exige autenticação
- [ x ] **Profile** - Página protegida. Dados do usuário + botão de logout

# Funcionalidades compartilhadas

- [ x ] Serviço de auth (axios + interceptor de refresh)
- [ x ]  Store global de autenticação (zustand)
- [ x ] Rota protegida (roteador)
- [ x ] Componente de formulário compartilhado (shadcn/ui)

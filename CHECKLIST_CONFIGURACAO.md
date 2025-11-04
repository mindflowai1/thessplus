# ✅ Checklist de Configuração - Thess+

## 📋 Passos para Configurar o Projeto

### 1. ✅ Variáveis de Ambiente
- [x] Arquivo `.env` criado com as credenciais do Supabase
- [x] URL do Supabase: `https://ldhxfiyjopesopqiwxyk.supabase.co`
- [x] Anon Key configurada

### 2. ⚠️ Banco de Dados no Supabase
- [ ] Acessar o Supabase Dashboard: https://ldhxfiyjopesopqiwxyk.supabase.co
- [ ] Ir para **SQL Editor**
- [ ] Executar o script completo em `database/schema.sql`
- [ ] Verificar se as tabelas foram criadas:
  - [ ] `profiles`
  - [ ] `transactions`
  - [ ] `limites_gastos`
  - [ ] `reminders`

### 3. ⚠️ Configurar Google OAuth (Para Google Calendar)
- [ ] Acessar o [Google Cloud Console](https://console.cloud.google.com)
- [ ] Criar um novo projeto ou selecionar um existente
- [ ] Ativar a **Google Calendar API**
- [ ] Criar credenciais OAuth 2.0:
  - [ ] **Client ID**
  - [ ] **Client Secret**
- [ ] Configurar URIs de redirecionamento:
  - [ ] `https://ldhxfiyjopesopqiwxyk.supabase.co/auth/v1/callback`
  - [ ] `http://localhost:5173` (para desenvolvimento)

### 4. ⚠️ Configurar Google OAuth no Supabase
- [ ] Acessar o Supabase Dashboard
- [ ] Ir para **Authentication** > **Providers**
- [ ] Habilitar o provedor **Google**
- [ ] Adicionar as credenciais:
  - [ ] **Client ID (for OAuth)**
  - [ ] **Client Secret (for OAuth)**
- [ ] **Importante**: Adicionar o escopo `https://www.googleapis.com/auth/calendar`
- [ ] Salvar as configurações

### 5. ✅ Instalar Dependências
```bash
npm install
# ou se houver conflitos:
npm install --legacy-peer-deps
```

### 6. ✅ Testar o Projeto
```bash
npm run dev
```

O projeto deve estar disponível em: `http://localhost:5173`

### 7. ⚠️ Testar Funcionalidades
- [ ] Acessar a Landing Page
- [ ] Testar autenticação com email/senha
- [ ] Testar autenticação com Google
- [ ] Verificar se o perfil é criado automaticamente
- [ ] Testar criação de transações
- [ ] Testar definição de limites
- [ ] Testar integração com Google Calendar (após configurar OAuth)

## 🔐 Segurança

⚠️ **IMPORTANTE**: 
- O arquivo `.env` contém credenciais sensíveis
- **NÃO** commite o arquivo `.env` no Git (já está no `.gitignore`)
- O `service_role` secret deve ser mantido em segredo e usado apenas no backend

## 📝 Próximos Passos Após Configuração

1. **Executar o script SQL** no Supabase (prioridade alta)
2. **Configurar Google OAuth** se quiser usar a funcionalidade de lembretes no Google Calendar
3. **Testar todas as funcionalidades** para garantir que está tudo funcionando

## 🆘 Problemas Comuns

### Erro: "Missing Supabase environment variables"
- Verifique se o arquivo `.env` existe na raiz do projeto
- Verifique se as variáveis estão corretas

### Erro: "RLS policy violation"
- Execute o script `database/schema.sql` no Supabase
- Verifique se as políticas RLS foram criadas

### Erro: "Google token not found"
- Configure o Google OAuth no Supabase
- Certifique-se de que o usuário autenticou com Google
- Verifique se o escopo do Calendar está configurado

---

**Status Atual**: Variáveis de ambiente configuradas ✅
**Próximo Passo**: Executar o script SQL no Supabase


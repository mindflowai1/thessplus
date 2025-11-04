# 🚀 Setup Inicial - Base SaaS

Guia rápido para configurar o projeto pela primeira vez.

## ⚡ Setup Rápido (5 minutos)

### 1. Clone e Instale

```bash
git clone https://github.com/mindflowai1/basesaas.git
cd basesaas
npm install
```

### 2. Configure Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite `.env` com suas credenciais do Supabase.

### 3. Configure o Banco de Dados

1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Crie um novo projeto
3. Vá em **SQL Editor**
4. Execute `database/schema.sql`

### 4. Inicie o Projeto

```bash
npm run dev
```

Pronto! 🎉

## 📋 Checklist Completo

### ✅ Variáveis de Ambiente
- [ ] Criado arquivo `.env` a partir de `.env.example`
- [ ] Configurado `VITE_SUPABASE_URL`
- [ ] Configurado `VITE_SUPABASE_ANON_KEY`

### ✅ Banco de Dados
- [ ] Projeto criado no Supabase
- [ ] Script `database/schema.sql` executado
- [ ] Tabelas criadas:
  - [ ] `profiles`
  - [ ] `transactions`
  - [ ] `limites_gastos`
  - [ ] `reminders`

### ✅ Autenticação (Opcional)
- [ ] Google OAuth configurado (se quiser usar Google Calendar)
- [ ] Escopo do Calendar adicionado

### ✅ Testes
- [ ] Projeto inicia sem erros
- [ ] Landing page carrega
- [ ] Autenticação funciona
- [ ] Dashboard acessível

## 🆘 Problemas Comuns

### Erro: "Missing Supabase environment variables"
- Verifique se o arquivo `.env` existe
- Verifique se as variáveis estão corretas

### Erro: "RLS policy violation"
- Execute o script `database/schema.sql` novamente
- Verifique se as políticas RLS foram criadas

### Erro ao instalar dependências
```bash
npm install --legacy-peer-deps
```

## 📚 Próximos Passos

1. Personalize o nome do projeto
2. Customize as cores/tema
3. Adicione suas próprias páginas
4. Configure o Google OAuth (se necessário)

---

**Boa sorte com seu projeto!** 🚀


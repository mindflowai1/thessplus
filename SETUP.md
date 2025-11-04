# 🚀 Guia de Configuração - Thess+

Este guia contém todas as instruções necessárias para configurar e executar o projeto Thess+.

## 📋 Pré-requisitos

1. **Node.js 18+** e npm/yarn instalados
2. **Conta no Supabase** (gratuita)
3. **Credenciais do Google OAuth** (para Google Calendar)

## 🔧 Passo a Passo

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env` e adicione suas credenciais do Supabase:
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

### 3. Configurar o Banco de Dados no Supabase

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto (ou crie um novo)
3. Vá para **SQL Editor**
4. Execute o script completo em `database/schema.sql`
5. Verifique se todas as tabelas foram criadas:
   - `profiles`
   - `transactions`
   - `limites_gastos`
   - `reminders`

### 4. Configurar Autenticação Google no Supabase

1. No Supabase Dashboard, vá para **Authentication** > **Providers**
2. Habilite o provedor **Google**
3. Configure as credenciais do Google OAuth:
   - **Client ID (for OAuth)**: Seu Client ID do Google
   - **Client Secret (for OAuth)**: Seu Client Secret do Google
4. **Importante**: Adicione o escopo `https://www.googleapis.com/auth/calendar`
5. Configure a URL de redirecionamento:
   - `https://seu-projeto.supabase.co/auth/v1/callback`

### 5. Configurar Google OAuth

1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione um existente
3. Ative a **Google Calendar API**
4. Vá para **Credenciais** > **Criar credenciais** > **ID do cliente OAuth 2.0**
5. Configure:
   - **Tipo de aplicativo**: Aplicativo da Web
   - **URIs de redirecionamento autorizados**:
     - `https://seu-projeto.supabase.co/auth/v1/callback`
     - `http://localhost:5173` (para desenvolvimento)
6. Copie o **Client ID** e **Client Secret** para o Supabase

### 6. Iniciar o Projeto

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

## 🎯 Funcionalidades Implementadas

### ✅ Landing Page
- Design moderno baseado no site da Thees Engenharia
- Seções: Hero, Serviços, Sobre, Projetos, Contato
- Animações com Framer Motion
- Responsivo e acessível

### ✅ Autenticação
- Login/Registro com email e senha
- Autenticação com Google OAuth
- Integração com Google Calendar
- Proteção de rotas

### ✅ Dashboard
- Visualização de transações financeiras
- Filtros por data e categoria
- Busca de transações
- Cálculo automático de totais (Entradas, Saídas, Saldo)
- Seleção múltipla e exclusão de transações

### ✅ Limites de Gastos
- Definição de limites por categoria
- Salvamento automático no Supabase
- Interface intuitiva

### ✅ Perfil/Conta
- Edição de informações pessoais
- Atualização de telefone
- Alteração de senha
- Integração com Supabase Auth

### ✅ Integração Google Calendar
- Criação de lembretes no Google Calendar
- Listagem de eventos
- Atualização e exclusão de eventos
- Tabela `reminders` no banco de dados

## 📁 Estrutura do Projeto

```
thessplus/
├── src/
│   ├── components/          # Componentes React
│   │   ├── ui/              # Componentes UI (MagicUI)
│   │   ├── AppLayout.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/            # Contextos (Estado Global)
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── pages/               # Páginas
│   │   ├── LandingPage.tsx
│   │   ├── AuthPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── LimitsPage.tsx
│   │   └── AccountPage.tsx
│   ├── services/            # Serviços Externos
│   │   ├── supabase.ts
│   │   └── googleCalendar.ts
│   ├── lib/                 # Utilitários
│   │   └── utils.ts
│   ├── types/               # Tipos TypeScript
│   │   └── supabase.ts
│   ├── App.tsx
│   └── main.tsx
├── database/
│   └── schema.sql           # Script SQL
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas Criadas:

1. **profiles** - Perfis de usuário
   - `id` (UUID, FK para auth.users)
   - `full_name` (TEXT)
   - `phone` (TEXT, UNIQUE)
   - `created_at`, `updated_at`

2. **transactions** - Transações financeiras
   - `id` (UUID)
   - `user_id` (UUID, FK)
   - `descricao` (TEXT)
   - `tipo` ('Entrada' | 'Saída')
   - `categoria` (TEXT)
   - `valor` (NUMERIC)
   - `data` (TIMESTAMPTZ)

3. **limites_gastos** - Limites de gastos
   - `id` (UUID)
   - `user_id` (UUID, UNIQUE)
   - Colunas por categoria (alimentacao, lazer, etc.)

4. **reminders** - Lembretes
   - `id` (UUID)
   - `user_id` (UUID)
   - `title` (TEXT)
   - `description` (TEXT)
   - `date` (DATE)
   - `time` (TIME)
   - `google_event_id` (TEXT)

### Políticas RLS (Row Level Security)

Todas as tabelas têm RLS habilitado, garantindo que usuários só acessem seus próprios dados.

## 🔐 Segurança

- **RLS (Row Level Security)** habilitado em todas as tabelas
- **Autenticação** via Supabase Auth
- **OAuth** com Google para acesso ao Calendar
- **Validação** de dados no frontend e backend
- **HTTPS** obrigatório em produção

## 🚀 Deploy

### Vercel/Netlify

1. Faça push do código para o GitHub
2. Conecte o repositório no Vercel/Netlify
3. Configure as variáveis de ambiente
4. Deploy automático!

### Variáveis de Ambiente Necessárias

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📝 Próximos Passos

1. **Implementar página de Reminders** completa
2. **Adicionar gráficos** no Dashboard
3. **Exportar relatórios** em PDF/Excel
4. **Notificações push** para lembretes
5. **Integração WhatsApp** (via n8n) para registrar transações

## 🐛 Troubleshooting

### Erro: "Missing Supabase environment variables"
- Verifique se o arquivo `.env` existe e está configurado corretamente

### Erro: "Google token not found"
- Certifique-se de que o usuário autenticou com Google
- Verifique se o escopo do Calendar está configurado

### Erro: "RLS policy violation"
- Verifique se as políticas RLS foram criadas corretamente
- Execute o script `database/schema.sql` novamente

## 📞 Suporte

Para dúvidas ou problemas, consulte:
- Documentação do Supabase: https://supabase.com/docs
- Documentação do Google Calendar API: https://developers.google.com/calendar
- Documentação do React Router: https://reactrouter.com

---

**Desenvolvido com ❤️ para Thess+**


# 🚀 Base SaaS - React + TypeScript + Supabase

Base/Boilerplate completa para projetos SaaS modernos com React, TypeScript, Supabase e integração Google Calendar.

## 🎯 O que é este projeto?

Este é um **boilerplate/base** completo e pronto para uso em projetos futuros. Inclui:

- ✅ Autenticação completa (Email/Senha + Google OAuth)
- ✅ Integração com Supabase (Backend + Auth)
- ✅ Integração com Google Calendar API
- ✅ Landing Page moderna e responsiva
- ✅ Dashboard completo
- ✅ Sistema de temas (Dark/Light)
- ✅ Componentes UI modernos (MagicUI)
- ✅ Estrutura de banco de dados completa
- ✅ TypeScript configurado
- ✅ Tailwind CSS configurado

## 🚀 Tecnologias

- **React 19** + **TypeScript**
- **Vite 6** - Build tool
- **Tailwind CSS 3** - Estilização
- **React Router DOM 7** - Roteamento
- **Supabase** - Backend e Autenticação
- **Google Auth** - Autenticação com Google
- **Google Calendar API** - Integração para lembretes
- **MagicUI** - Componentes UI modernos
- **Framer Motion** - Animações

## 📋 Pré-requisitos

- Node.js 18+ e npm/yarn
- Conta Supabase
- Credenciais do Google OAuth (opcional, para Google Calendar)

## 🛠️ Como usar como base para um novo projeto

### 1. Clone este repositório

```bash
git clone https://github.com/mindflowai1/basesaas.git meu-novo-projeto
cd meu-novo-projeto
```

### 2. Instale as dependências

```bash
npm install
# ou se houver conflitos:
npm install --legacy-peer-deps
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

### 4. Configure o banco de dados no Supabase

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Crie um novo projeto (ou use um existente)
3. Vá para **SQL Editor**
4. Execute o script completo em `database/schema.sql`

Isso criará todas as tabelas necessárias:
- `profiles` - Perfis de usuário
- `transactions` - Transações financeiras
- `limites_gastos` - Limites de gastos por categoria
- `reminders` - Lembretes (integração com Google Calendar)

### 5. Configure o Google OAuth (Opcional)

**No Google Cloud Console:**
1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione um existente
3. Ative a **Google Calendar API**
4. Crie credenciais OAuth 2.0:
   - **Client ID**
   - **Client Secret**
5. Configure URIs de redirecionamento:
   - `https://seu-projeto.supabase.co/auth/v1/callback`
   - `http://localhost:5173` (para desenvolvimento)

**No Supabase Dashboard:**
1. Vá para **Authentication** > **Providers**
2. Habilite o provedor **Google**
3. Adicione as credenciais:
   - **Client ID (for OAuth)**
   - **Client Secret (for OAuth)**
4. **Importante**: Adicione o escopo `https://www.googleapis.com/auth/calendar`
5. Salve as configurações

### 6. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
├── src/
│   ├── components/          # Componentes React reutilizáveis
│   │   ├── ui/              # Componentes UI (MagicUI)
│   │   ├── AppLayout.tsx    # Layout principal
│   │   └── ProtectedRoute.tsx
│   ├── contexts/            # Contextos React (estado global)
│   │   ├── AuthContext.tsx  # Autenticação
│   │   └── ThemeContext.tsx # Tema (dark/light)
│   ├── pages/               # Páginas da aplicação
│   │   ├── LandingPage.tsx  # Landing page
│   │   ├── AuthPage.tsx     # Login/Registro
│   │   ├── DashboardPage.tsx
│   │   ├── LimitsPage.tsx
│   │   └── AccountPage.tsx
│   ├── services/            # Serviços externos
│   │   ├── supabase.ts      # Cliente Supabase
│   │   └── googleCalendar.ts # Google Calendar API
│   ├── lib/                 # Utilitários
│   │   └── utils.ts
│   ├── types/               # Tipos TypeScript
│   │   └── supabase.ts
│   ├── App.tsx              # Componente raiz
│   └── main.tsx             # Entry point
├── database/
│   └── schema.sql           # Script SQL do banco
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🗄️ Banco de Dados

O banco de dados possui as seguintes tabelas:

- **profiles** - Perfis de usuário
- **transactions** - Transações financeiras
- **limites_gastos** - Limites de gastos por categoria
- **reminders** - Lembretes (integração com Google Calendar)

Execute o script `database/schema.sql` no Supabase SQL Editor.

## 🔐 Autenticação

O sistema suporta:
- Autenticação por email/senha
- Autenticação com Google (OAuth)
- Integração com Google Calendar para lembretes

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Preview do build
- `npm run lint` - Executa o linter

## 🎨 Personalização

### Mudar o nome do projeto

1. Edite `package.json`:
   ```json
   {
     "name": "seu-novo-projeto"
   }
   ```

2. Edite `index.html`:
   ```html
   <title>Seu Novo Projeto</title>
   ```

3. Edite os componentes que contêm "Thess+" ou "Thess+"

### Adicionar novas páginas

1. Crie o componente em `src/pages/NovaPage.tsx`
2. Adicione a rota em `src/App.tsx`
3. Adicione o link de navegação em `src/components/AppLayout.tsx`

### Personalizar cores/tema

Edite `tailwind.config.js` e `src/index.css` para personalizar as cores do tema.

## 🚢 Deploy

O projeto pode ser deployado em:
- **Vercel** (recomendado)
- **Netlify**
- **Google Cloud Run**
- Qualquer plataforma que suporte aplicações React/Vite

**Importante**: Configure as variáveis de ambiente no serviço de deploy.

## 📄 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuindo

Este é um boilerplate/base para projetos futuros. Sinta-se à vontade para:
- Fazer fork do projeto
- Criar branches para suas modificações
- Abrir issues para sugestões
- Fazer pull requests com melhorias

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte a documentação do [Supabase](https://supabase.com/docs)
- Consulte a documentação do [Google Calendar API](https://developers.google.com/calendar)

---

**Desenvolvido como base para projetos SaaS modernos** 🚀

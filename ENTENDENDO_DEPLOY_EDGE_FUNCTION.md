# 🎯 Entendendo: Onde Executar os Comandos?

## ⚠️ Confusão Comum

Você pode estar pensando:
> "Meu projeto está no Cloud Run via GitHub, onde eu executo esses comandos?"

**Resposta:** Os comandos são executados **no seu computador local** (PowerShell), **NÃO** no Cloud Run!

---

## 🏗️ Arquitetura: Duas Coisas Diferentes

### 1️⃣ **Cloud Run** (Frontend da Aplicação)
- ✅ **O que é:** Onde seu site está rodando
- ✅ **URL:** `https://thessplus-454059341133.europe-west1.run.app`
- ✅ **Como deploya:** Via GitHub → Cloud Build → Cloud Run (automático)
- ✅ **O que faz:** Serve o frontend React para os usuários
- ✅ **Onde está:** Google Cloud Platform

### 2️⃣ **Supabase Edge Functions** (Webhook Handler)
- ✅ **O que é:** Serviço que recebe webhooks da PerfectPay
- ✅ **URL:** `https://SEU_ID.supabase.co/functions/v1/perfectpay-webhook`
- ✅ **Como deploya:** Via Supabase CLI no seu computador
- ✅ **O que faz:** Processa pagamentos e cria contas automaticamente
- ✅ **Onde está:** Supabase (servidor deles)

---

## 📍 Onde Executar os Comandos?

### ❌ **NÃO** execute no Cloud Run
- Cloud Run é apenas onde o **frontend** roda
- Você não tem acesso SSH/shell no Cloud Run
- O deploy do Cloud Run é automático via GitHub

### ✅ **SIM**, execute no seu computador local

**No PowerShell do seu Windows:**

```powershell
# 1. Abra o PowerShell
# 2. Navegue até a pasta do projeto
cd "C:\Gaveta 2\Projetos\thessplus"

# 3. Execute os comandos aqui (no seu computador)
npm install -g supabase
supabase login
supabase link --project-ref SEU_ID
supabase functions deploy perfectpay-webhook
```

---

## 🔄 Fluxo Completo Explicado

```
┌─────────────────────────────────────────────────────────────┐
│  SEU COMPUTADOR (Windows)                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ PowerShell                                           │   │
│  │                                                       │   │
│  │ 1. npm install -g supabase                           │   │
│  │ 2. supabase login                                    │   │
│  │ 3. supabase link --project-ref ID                    │   │
│  │ 4. supabase functions deploy perfectpay-webhook      │   │
│  │                                                       │   │
│  │ ↓ Deploy envia código para Supabase                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  SUPABASE (Servidor deles)                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Edge Function: perfectpay-webhook                    │   │
│  │ URL: https://ID.supabase.co/functions/v1/...        │   │
│  │                                                       │   │
│  │ Recebe webhooks da PerfectPay                        │   │
│  │ Cria usuários no Supabase Auth                       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  PERFECTPAY (Gateway de Pagamento)                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Quando pagamento é aprovado:                         │   │
│  │ → Envia webhook para Edge Function                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  CLOUD RUN (Google Cloud)                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Frontend React                                       │   │
│  │ URL: https://thessplus-454059341133.europe-west1... │   │
│  │                                                       │   │
│  │ Usuário acessa /checkout                             │   │
│  │ Redireciona para PerfectPay                          │   │
│  │ Após pagamento, usuário faz login em /auth           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Resumo Visual

```
┌─────────────────────────────────────────────────────────────┐
│  ONDE EXECUTAR COMANDOS?                                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ✅ NO SEU COMPUTADOR (PowerShell)                            │
│     ↓                                                         │
│     Comandos: supabase login, deploy, etc.                   │
│                                                               │
│  ❌ NÃO NO CLOUD RUN                                          │
│     (Cloud Run é apenas para o frontend)                     │
│                                                               │
│  ✅ O RESULTADO VAI PARA SUPABASE                            │
│     (Edge Function roda no servidor do Supabase)              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Passo a Passo Simplificado

### Passo 1: Abrir PowerShell no seu computador

1. Pressione `Windows + X`
2. Clique em **"Windows PowerShell"** ou **"Terminal"**
3. Navegue até a pasta do projeto:
   ```powershell
   cd "C:\Gaveta 2\Projetos\thessplus"
   ```

### Passo 2: Instalar Supabase CLI

```powershell
npm install -g supabase
```

**Isso instala no seu computador**, não no Cloud Run!

### Passo 3: Login no Supabase

```powershell
supabase login
```

**Isso abre o navegador** para você autorizar. Ainda no seu computador!

### Passo 4: Link com projeto

```powershell
supabase link --project-ref ldhxfiyjopesopqiwxyk
```

**Isso conecta seu computador** com o projeto no Supabase.

### Passo 5: Deploy da função

```powershell
supabase functions deploy perfectpay-webhook
```

**Isso envia o código** da Edge Function para o Supabase (servidor deles).

---

## 🔍 Verificando se Funcionou

### No seu computador (PowerShell):

```powershell
# Ver logs da função
supabase functions logs perfectpay-webhook --tail
```

### No navegador:

1. Acesse: https://supabase.com/dashboard
2. Vá em **Edge Functions**
3. Você deve ver **`perfectpay-webhook`** listada
4. Clique nela para ver detalhes

---

## ❓ Perguntas Frequentes

### "Preciso fazer algo no Cloud Run?"

**Não!** O Cloud Run continua funcionando normalmente. Ele só serve o frontend. A Edge Function é independente.

### "O código vai para o GitHub?"

**Não necessariamente.** A Edge Function pode ser deployada diretamente do seu computador para o Supabase, sem passar pelo GitHub.

**Mas se quiser versionar:**
- O código da Edge Function já está no GitHub (`supabase/functions/perfectpay-webhook/index.ts`)
- Você pode fazer commit/push normalmente
- Mas o deploy é feito via CLI, não via GitHub

### "Preciso configurar algo no Cloud Build?"

**Não!** O Cloud Build só cuida do frontend. A Edge Function é deployada separadamente.

### "E se eu não tiver o código localmente?"

Se você não tiver o código no seu computador:

1. **Clone do GitHub:**
   ```powershell
   cd "C:\Gaveta 2\Projetos"
   git clone https://github.com/mindflowai1/thessplus.git
   cd thessplus
   ```

2. **Ou baixe o ZIP:**
   - GitHub → Code → Download ZIP
   - Extraia na pasta desejada

---

## ✅ Checklist: Onde Estou?

Antes de executar comandos, confirme:

- [ ] Estou no **PowerShell do meu computador** (não no Cloud Run)
- [ ] Estou na pasta do projeto: `C:\Gaveta 2\Projetos\thessplus`
- [ ] Tenho Node.js instalado (`node --version`)
- [ ] Tenho acesso à internet
- [ ] Tenho conta no Supabase

---

## 🎯 Resumo Final

| O que | Onde está | Como deploya |
|-------|-----------|--------------|
| **Frontend React** | Cloud Run (Google) | GitHub → Cloud Build (automático) |
| **Edge Function** | Supabase (servidor deles) | Supabase CLI (no seu computador) |

**Os comandos são executados no seu computador, mas o resultado (Edge Function) roda no Supabase!**

---

## 🚀 Próximo Passo

Agora que entendeu, abra o PowerShell e execute:

```powershell
cd "C:\Gaveta 2\Projetos\thessplus"
npm install -g supabase
```

**Isso é tudo!** Os comandos são executados localmente, mas a função roda no Supabase. 🎉


# 🔐 Configurar Variáveis de Ambiente no Supabase

Guia passo a passo para configurar as variáveis de ambiente da Edge Function.

---

## 📍 Onde Configurar

### Passo 1: Acessar o Menu "Secrets"

Na tela que você está vendo:

1. **Olhe para o menu lateral ESQUERDO**
2. **Procure por "MANAGE"** (geralmente em letras maiúsculas)
3. **Clique em "Secrets"** (não em "Functions")

**Você verá algo assim:**
```
MANAGE
  Functions  ← (você está aqui)
  Secrets    ← CLIQUE AQUI!
```

---

## ⚙️ Passo 2: Adicionar Variáveis

Depois de clicar em **"Secrets"**, você verá:

1. Uma lista de variáveis (pode estar vazia)
2. Um botão **"+ Add secret"** ou **"+ New secret"** ou **"Add variable"**

### Clique em **"+ Add secret"**

---

## 📝 Passo 3: Adicionar Cada Variável

Você precisa adicionar **3 variáveis**. Para cada uma:

### Variável 1: SUPABASE_URL

1. Clique em **"+ Add secret"**
2. Preencha:
   - **Name:** `SUPABASE_URL`
   - **Value:** `https://ldhxfiyjopesopqiwxyk.supabase.co`
3. Clique em **"Save"** ou **"Add"**

### Variável 2: SUPABASE_SERVICE_ROLE_KEY

1. Clique em **"+ Add secret"** novamente
2. Preencha:
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** (Cole a Service Role Key)

**Como obter a Service Role Key:**
1. No menu lateral, clique em **"Settings"** (⚙️)
2. Clique em **"API"**
3. Role até **"Project API keys"**
4. Ao lado de **"service_role"**, clique no ícone **👁️ (Reveal)**
5. Clique no ícone **📋 (Copy)** para copiar
6. Volte para **"Secrets"** e cole no campo **Value**

3. Clique em **"Save"** ou **"Add"**

### Variável 3: APP_URL

1. Clique em **"+ Add secret"** novamente
2. Preencha:
   - **Name:** `APP_URL`
   - **Value:** `https://thessplus-454059341133.europe-west1.run.app`
3. Clique em **"Save"** ou **"Add"**

---

## ✅ Passo 4: Verificar

Depois de adicionar as 3 variáveis, você deve ver:

```
Secrets
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
  APP_URL
```

---

## 🎯 Resumo Visual

```
┌─────────────────────────────────────────┐
│  MENU LATERAL ESQUERDO                   │
├─────────────────────────────────────────┤
│  Edge Functions                         │
│                                          │
│  MANAGE                                 │
│    Functions  ← Você está aqui          │
│    Secrets    ← CLIQUE AQUI! ⭐          │
│                                          │
└─────────────────────────────────────────┘
```

Depois de clicar em "Secrets":

```
┌─────────────────────────────────────────┐
│  SECRETS                                 │
├─────────────────────────────────────────┤
│  [ + Add secret ]  ← Clique aqui        │
│                                          │
│  (Lista de variáveis aparecerá aqui)     │
│                                          │
└─────────────────────────────────────────┘
```

---

## 🆘 Se Não Encontrar "Secrets"

### Alternativa 1: Via Aba "Details"

1. Na área principal, clique na aba **"Details"**
2. Procure por **"Environment Variables"** ou **"Secrets"**
3. Clique em **"+ Add"** ou **"+ New"**

### Alternativa 2: Via Aba "Code"

1. Clique na aba **"Code"**
2. Procure por um botão **"Settings"** ou **"Environment"** no topo
3. Ou procure por **"Secrets"** nas opções

### Alternativa 3: Menu de Configurações

1. Procure por um ícone de **⚙️ Settings** ou **Configurações** no topo da página
2. Clique nele
3. Procure por **"Secrets"** ou **"Environment Variables"**

---

## 📸 Onde Está na Sua Tela

Baseado na sua tela atual:

1. **Menu lateral ESQUERDO** → Procure por **"MANAGE"**
2. **Abaixo de "Functions"** → Clique em **"Secrets"**
3. **Na área principal** → Clique em **"+ Add secret"**

---

## ✅ Checklist

- [ ] Cliquei em **"Secrets"** no menu lateral
- [ ] Vi o botão **"+ Add secret"**
- [ ] Adicionei `SUPABASE_URL`
- [ ] Adicionei `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Adicionei `APP_URL`
- [ ] Todas as 3 variáveis aparecem na lista

---

**Dica:** Se ainda não encontrar, me diga o que você vê na tela e eu te ajudo a localizar! 😊


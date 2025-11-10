# 🚀 Deploy Edge Function - Guia Rápido

## Comandos Essenciais (Copie e Cole)

### 1️⃣ Instalar Supabase CLI
```powershell
npm install -g supabase
```

### 2️⃣ Login
```powershell
supabase login
```
*Vai abrir o navegador → Clique em "Authorize"*

### 3️⃣ Link com seu projeto
```powershell
cd "C:\Gaveta 2\Projetos\thessplus"
supabase link --project-ref ldhxfiyjopesopqiwxyk
```
*Pressione Enter quando pedir senha*

### 4️⃣ Deploy
```powershell
supabase functions deploy perfectpay-webhook
```
*Copie a URL que aparecer!*

---

## ⚙️ Configurar Variáveis (No Dashboard)

**Acesse:** https://supabase.com/dashboard → Edge Functions → perfectpay-webhook → Settings

**Adicione 3 variáveis:**

```
SUPABASE_URL = https://ldhxfiyjopesopqiwxyk.supabase.co

SUPABASE_SERVICE_ROLE_KEY = (Copie de: Settings → API → service_role)

APP_URL = https://thessplus-454059341133.europe-west1.run.app
```

---

## 🔗 Configurar Webhook na PerfectPay

**URL do Webhook:**
```
https://ldhxfiyjopesopqiwxyk.supabase.co/functions/v1/perfectpay-webhook
```

**Eventos:**
- ✅ Pagamento Aprovado
- ✅ Pagamento Cancelado  
- ✅ Pagamento Reembolsado

---

## ✅ Testar

```powershell
# Ver logs em tempo real
supabase functions logs perfectpay-webhook --tail

# Fazer teste de pagamento no site
# Verificar se usuário foi criado em: Authentication → Users
```

---

## 📊 Onde obter informações

| Informação | Onde encontrar |
|------------|----------------|
| **Project Reference ID** | Dashboard URL ou Settings → General |
| **Service Role Key** | Settings → API → service_role (clique em 👁️) |
| **SUPABASE_URL** | URL do projeto: `https://SEU_ID.supabase.co` |
| **Function URL** | Aparece após deploy ou Edge Functions → perfectpay-webhook |

---

## 🆘 Problemas?

```powershell
# Reinstalar CLI
npm install -g supabase --force

# Login novamente
supabase logout
supabase login

# Deploy novamente
supabase functions deploy perfectpay-webhook

# Ver logs
supabase functions logs perfectpay-webhook --limit 20
```

---

**✅ Tudo certo?** Faça um teste de pagamento e verifique se o usuário foi criado!


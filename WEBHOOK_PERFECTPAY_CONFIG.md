# Configuração do Webhook PerfectPay

Este documento explica como configurar o webhook da PerfectPay para criar contas automaticamente após pagamento aprovado.

## 📋 Visão Geral do Fluxo

1. **Usuário acessa `/checkout`** → Preenche email e nome
2. **Redirecionamento** → PerfectPay recebe o email no campo `custom`
3. **Pagamento aprovado** → PerfectPay envia webhook para nossa Edge Function
4. **Edge Function processa** → Cria usuário no Supabase Auth
5. **Perfil criado** → Cria perfil na tabela `profiles` com assinatura ativa
6. **Email enviado** → Usuário recebe credenciais por email (opcional)

---

## 🚀 Passo 1: Deploy da Edge Function

### 1.1. Instalar Supabase CLI

```bash
# Windows (PowerShell)
scoop install supabase

# macOS/Linux
brew install supabase/tap/supabase

# Ou via npm (todas as plataformas)
npm install -g supabase
```

### 1.2. Login no Supabase

```bash
supabase login
```

### 1.3. Link com seu projeto

```bash
supabase link --project-ref SEU_PROJECT_REF
```

> **Como obter o PROJECT_REF:**
> 1. Acesse seu projeto no [Supabase Dashboard](https://supabase.com/dashboard)
> 2. Vá em **Settings** → **General**
> 3. Copie o **Reference ID**

### 1.4. Deploy da função

```bash
supabase functions deploy perfectpay-webhook
```

### 1.5. Configurar variáveis de ambiente

No [Supabase Dashboard](https://supabase.com/dashboard):

1. Vá em **Edge Functions** → **perfectpay-webhook**
2. Clique em **Settings**
3. Adicione as variáveis:

```
SUPABASE_URL=https://SEU_PROJETO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=SEU_SERVICE_ROLE_KEY
APP_URL=https://SEU_DOMINIO.com
```

> **⚠️ IMPORTANTE:** 
> - O `SUPABASE_SERVICE_ROLE_KEY` é encontrado em **Settings** → **API** → **service_role key**
> - **NUNCA** exponha essa chave no frontend!

---

## 🔗 Passo 2: Configurar Webhook na PerfectPay

### 2.1. Obter URL da Edge Function

Após o deploy, a URL será:
```
https://SEU_PROJETO.supabase.co/functions/v1/perfectpay-webhook
```

### 2.2. Configurar na PerfectPay

1. Acesse o [Dashboard da PerfectPay](https://app.perfectpay.com.br)
2. Vá em **Produtos** → Selecione seu produto → **Webhooks**
3. Adicione a URL da Edge Function
4. Selecione os eventos:
   - ✅ Pagamento Aprovado (`paid` / `approved`)
   - ✅ Pagamento Cancelado (`cancelled`)
   - ✅ Pagamento Reembolsado (`refunded`)

### 2.3. Salvar e Testar

A PerfectPay deve enviar um webhook de teste. Verifique os logs:

```bash
supabase functions logs perfectpay-webhook --tail
```

---

## 🧪 Passo 3: Testar o Fluxo Completo

### 3.1. Teste Local (Desenvolvimento)

Para testar localmente, você pode usar o Supabase CLI:

```bash
# 1. Inicie a Edge Function localmente
supabase functions serve perfectpay-webhook

# 2. Em outro terminal, envie um webhook de teste
curl -X POST http://localhost:54321/functions/v1/perfectpay-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved",
    "transaction_id": "test-123",
    "email": "teste@exemplo.com",
    "name": "João Silva",
    "amount": "45.00",
    "payment_date": "2024-01-01T12:00:00Z"
  }'
```

### 3.2. Teste em Produção

1. Acesse `/checkout` no seu site
2. Preencha email e nome
3. Complete o pagamento (pode usar modo sandbox da PerfectPay)
4. Verifique os logs:

```bash
supabase functions logs perfectpay-webhook --tail
```

5. Verifique se o usuário foi criado:
   - Supabase Dashboard → **Authentication** → **Users**
   - Supabase Dashboard → **Table Editor** → **profiles**

---

## 🔍 Passo 4: Verificar Logs e Debug

### 4.1. Ver logs em tempo real

```bash
supabase functions logs perfectpay-webhook --tail
```

### 4.2. Ver logs históricos

```bash
supabase functions logs perfectpay-webhook --limit 100
```

### 4.3. Campos esperados do webhook

O webhook deve conter (nomes podem variar):

```json
{
  "status": "approved" | "paid" | "cancelled" | "refunded",
  "transaction_id": "string",
  "email": "string",          // Ou "custom", "customer_email", "buyer_email"
  "name": "string",           // Ou "customer_name", "buyer_name", "full_name"
  "amount": "number",
  "payment_date": "string"
}
```

### 4.4. Logs úteis

A Edge Function loga:
- ✅ Dados recebidos do webhook (JSON completo)
- ✅ Email, nome e transactionId extraídos
- ✅ Sucesso/erro na criação do usuário
- ✅ Sucesso/erro na criação do perfil

---

## 🛠️ Troubleshooting

### Erro: "Email não encontrado nos dados do webhook"

**Causa:** O webhook da PerfectPay não está enviando o email ou está usando um nome de campo diferente.

**Solução:**
1. Verifique os logs: `supabase functions logs perfectpay-webhook --tail`
2. Procure por `Available fields:` no log
3. Atualize o código em `src/services/webhook.ts` para incluir o nome do campo correto

### Erro: "User already registered"

**Causa:** O usuário já existe no Supabase.

**Solução:** O webhook atualiza automaticamente a assinatura do usuário existente. O usuário deve fazer login com a senha que recebeu anteriormente.

### Erro: "SUPABASE_SERVICE_ROLE_KEY não configurado"

**Causa:** Variável de ambiente não configurada na Edge Function.

**Solução:**
1. Acesse Supabase Dashboard → **Edge Functions** → **perfectpay-webhook** → **Settings**
2. Adicione `SUPABASE_SERVICE_ROLE_KEY` com o valor correto
3. Faça um novo deploy: `supabase functions deploy perfectpay-webhook`

### Erro: "Failed to create profile"

**Causa:** RLS (Row Level Security) está bloqueando a criação do perfil.

**Solução:** Verifique as políticas RLS da tabela `profiles` e garanta que o service role tem permissão para inserir.

---

## 📧 Configurar Envio de Email (Opcional)

Por padrão, o webhook apenas loga as credenciais no console. Para enviar emails reais:

### Opção 1: Resend

1. Crie conta em [Resend](https://resend.com)
2. Obtenha a API Key
3. Adicione variável de ambiente: `RESEND_API_KEY`
4. Descomente o código de envio de email em `src/services/userCreation.ts`

### Opção 2: SendGrid

1. Crie conta em [SendGrid](https://sendgrid.com)
2. Obtenha a API Key
3. Adicione variável de ambiente: `SENDGRID_API_KEY`
4. Implemente o código de envio em `src/services/userCreation.ts`

---

## 🔐 Segurança

### Validação de Webhook

Adicione validação de assinatura/token do webhook:

```typescript
// src/services/perfectPay.ts
export function validateWebhookSignature(
  webhookData: any, 
  signature: string,
  secret: string
): boolean {
  // Implementar validação conforme documentação da PerfectPay
  // Exemplo com HMAC-SHA256:
  const crypto = require('crypto')
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(webhookData))
    .digest('hex')
  
  return hash === signature
}
```

### Adicione na Edge Function:

```typescript
// supabase/functions/perfectpay-webhook/index.ts
const signature = req.headers.get('x-perfectpay-signature')
const secret = Deno.env.get('PERFECTPAY_WEBHOOK_SECRET')

if (!validateWebhookSignature(webhookData, signature, secret)) {
  return new Response(
    JSON.stringify({ success: false, message: 'Invalid signature' }),
    { status: 401, headers: corsHeaders }
  )
}
```

---

## 📚 Recursos Adicionais

- [Documentação Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Documentação PerfectPay Webhooks](https://docs.perfectpay.com.br)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)

---

## ✅ Checklist Final

Antes de ir para produção:

- [ ] Edge Function deployada com sucesso
- [ ] Variáveis de ambiente configuradas
- [ ] Webhook configurado na PerfectPay
- [ ] Teste de pagamento sandbox realizado com sucesso
- [ ] Logs verificados sem erros
- [ ] Usuário de teste criado corretamente
- [ ] Perfil de teste com assinatura ativa
- [ ] (Opcional) Email de boas-vindas sendo enviado
- [ ] (Opcional) Validação de assinatura do webhook implementada

---

**Data de criação:** Novembro de 2024  
**Última atualização:** Novembro de 2024


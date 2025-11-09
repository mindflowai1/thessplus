# 🚀 Configurar PerfectPay - Passo a Passo

Guia completo para configurar o PerfectPay após criar o produto.

---

## 📋 Checklist de Configuração

- [ ] Obter Product ID do produto criado
- [ ] Configurar variáveis de ambiente no projeto
- [ ] Criar Edge Function no Supabase
- [ ] Configurar webhook na PerfectPay
- [ ] Testar checkout
- [ ] Testar webhook

---

## 1️⃣ Obter Product ID

### Passo 1: Acessar o Painel PerfectPay

1. Acesse [https://app.perfectpay.com.br](https://app.perfectpay.com.br)
2. Faça login na sua conta

### Passo 2: Encontrar o Product ID

1. No menu lateral, clique em **Produtos** ou **Meus Produtos**
2. Clique no produto que você criou
3. O **Product ID** estará visível na página do produto

**Onde encontrar:**
- Geralmente aparece como "ID do Produto" ou "Product ID"
- Pode estar na URL: `https://app.perfectpay.com.br/produtos/SEU_PRODUCT_ID`
- Ou na página de detalhes do produto

**Exemplo de Product ID:**
```
abc123def456ghi789
```

---

## 2️⃣ Configurar Variáveis de Ambiente

### Passo 1: Criar/Editar arquivo `.env`

Na raiz do projeto, crie ou edite o arquivo `.env`:

```env
# PerfectPay
VITE_PERFECTPAY_PRODUCT_ID=seu_product_id_aqui
VITE_PERFECTPAY_API_URL=https://app.perfectpay.com.br
```

**Substitua `seu_product_id_aqui` pelo Product ID obtido no passo anterior.**

### Passo 2: Verificar se o arquivo está sendo carregado

O Vite carrega automaticamente variáveis que começam com `VITE_`.

### Passo 3: Reiniciar o servidor de desenvolvimento

```bash
# Pare o servidor (Ctrl+C) e inicie novamente
npm run dev
```

**Importante:** Variáveis de ambiente só são carregadas quando o servidor inicia. Sempre reinicie após alterar o `.env`.

---

## 3️⃣ Criar Edge Function no Supabase

### Passo 1: Instalar Supabase CLI

```bash
npm install -g supabase
```

### Passo 2: Fazer Login

```bash
supabase login
```

Isso abrirá o navegador para autenticação.

### Passo 3: Linkar Projeto

```bash
supabase link --project-ref seu-project-ref
```

**Onde encontrar o project-ref:**
- No Supabase Dashboard, vá em **Settings** > **General**
- O **Reference ID** é o seu project-ref
- Exemplo: `abcdefghijklmnop`

### Passo 4: Criar a Edge Function

```bash
supabase functions new perfectpay-webhook
```

Isso criará a pasta `supabase/functions/perfectpay-webhook/`.

### Passo 5: Copiar o Código

Copie o conteúdo do arquivo `supabase/functions/perfectpay-webhook/index.ts` (já criado no projeto) para a função criada.

Ou crie o arquivo `supabase/functions/perfectpay-webhook/index.ts` com este conteúdo:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { handlePerfectPayWebhook } from '../../../src/services/webhook.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Obter variáveis de ambiente
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const appUrl = Deno.env.get('APP_URL') || 'https://seu-dominio.com'

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Variáveis de ambiente não configuradas' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Obter dados do webhook
    const webhookData = await req.json()

    // Processar webhook
    const result = await handlePerfectPayWebhook(
      webhookData,
      supabaseUrl,
      serviceRoleKey,
      appUrl
    )

    return new Response(
      JSON.stringify(result),
      { 
        status: result.success ? 200 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Erro ao processar webhook',
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
```

**Nota:** Se o código usar imports do projeto, você precisará adaptar ou copiar as funções diretamente para a Edge Function.

### Passo 6: Fazer Deploy

```bash
supabase functions deploy perfectpay-webhook
```

### Passo 7: Obter URL da Edge Function

Após o deploy, você receberá a URL:

```
https://seu-project-ref.supabase.co/functions/v1/perfectpay-webhook
```

**Anote esta URL** - você precisará dela no próximo passo.

### Passo 8: Configurar Variáveis de Ambiente da Edge Function

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Vá em **Edge Functions** > **perfectpay-webhook** > **Settings**
3. Adicione as seguintes variáveis:

```
SUPABASE_URL=https://seu-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
APP_URL=https://seu-dominio.com
```

**Onde encontrar a Service Role Key:**
- No Supabase Dashboard, vá em **Settings** > **API**
- Role: `service_role`
- Copie a **service_role key** (não a anon key!)

---

## 4️⃣ Configurar Webhook na PerfectPay

### Passo 1: Acessar Configurações de Webhook

1. Acesse [https://app.perfectpay.com.br](https://app.perfectpay.com.br)
2. No menu lateral, procure por:
   - **Ferramentas** > **PostBack - Webhook**
   - Ou **Configurações** > **Webhooks**
   - Ou **Integrações** > **Webhooks**

### Passo 2: Criar Novo Webhook

1. Clique em **Adicionar** ou **Criar Webhook**
2. Preencha os campos:

**Configurações Básicas:**
- **Nome**: `Thess+ Webhook` (ou qualquer nome)
- **Produto**: Selecione o produto criado
- **URL de Retorno**: Cole a URL da Edge Function
  ```
  https://seu-project-ref.supabase.co/functions/v1/perfectpay-webhook
  ```

**Eventos:**
- ✅ **Pagamento Aprovado** (obrigatório)
- ✅ **Pagamento Pendente** (opcional)
- ✅ **Pagamento Cancelado** (opcional)
- ✅ **Reembolso** (opcional)

**Método HTTP:**
- **POST** (padrão)

### Passo 3: Salvar Configuração

1. Clique em **Salvar** ou **Criar**
2. Anote o **Webhook ID** (se disponível)

### Passo 4: Testar Webhook (Opcional)

Algumas plataformas permitem testar o webhook. Se disponível:
1. Clique em **Testar Webhook**
2. Verifique se a requisição foi recebida
3. Verifique os logs da Edge Function no Supabase

---

## 5️⃣ Testar Checkout

### Passo 1: Iniciar Aplicação

```bash
npm run dev
```

### Passo 2: Acessar Página de Checkout

1. Abra o navegador em `http://localhost:5173`
2. Navegue para `/checkout` ou clique em "Assinar Agora"

### Passo 3: Preencher Formulário

1. Preencha o **Email**
2. Preencha o **Nome** (opcional)
3. Clique em **Ir para Pagamento**

### Passo 4: Verificar Redirecionamento

Você deve ser redirecionado para uma URL como:

```
https://app.perfectpay.com.br/checkout?product=seu_product_id&email=usuario@email.com&custom=usuario@email.com
```

### Passo 5: Verificar Dados no Checkout

No checkout da PerfectPay, verifique se:
- ✅ O email está preenchido corretamente
- ✅ O nome está preenchido (se fornecido)
- ✅ O valor está correto (R$ 45,00)

---

## 6️⃣ Testar Webhook

### Opção 1: Teste Real (Recomendado)

1. Complete um pagamento de teste na PerfectPay
2. Use um cartão de teste (se disponível)
3. Verifique os logs da Edge Function no Supabase Dashboard

### Opção 2: Teste Manual com cURL

```bash
curl -X POST https://seu-project-ref.supabase.co/functions/v1/perfectpay-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved",
    "transaction_id": "test-123456",
    "email": "teste@email.com",
    "name": "Usuário Teste",
    "amount": "45.00",
    "payment_date": "2024-01-15T10:00:00Z"
  }'
```

### Verificar Logs

1. Acesse o Supabase Dashboard
2. Vá em **Edge Functions** > **perfectpay-webhook** > **Logs**
3. Verifique se o webhook foi processado
4. Verifique se há erros

### Verificar Banco de Dados

```sql
-- Verificar se a conta foi criada
SELECT * FROM auth.users 
WHERE email = 'teste@email.com';

-- Verificar se o perfil foi criado
SELECT * FROM profiles 
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'teste@email.com'
);
```

---

## 🔍 Verificação Final

### ✅ Checklist de Verificação

- [ ] Product ID configurado no `.env`
- [ ] Variáveis de ambiente carregadas (servidor reiniciado)
- [ ] Edge Function criada e deployada
- [ ] Variáveis de ambiente da Edge Function configuradas
- [ ] Webhook configurado na PerfectPay
- [ ] URL do webhook está correta
- [ ] Checkout redireciona corretamente
- [ ] Webhook recebe e processa requisições
- [ ] Conta é criada após pagamento aprovado

---

## 🐛 Troubleshooting

### Erro: "PERFECTPAY_PRODUCT_ID não configurado"

**Solução:**
1. Verifique se o arquivo `.env` existe na raiz do projeto
2. Verifique se a variável está escrita corretamente: `VITE_PERFECTPAY_PRODUCT_ID`
3. Reinicie o servidor de desenvolvimento

### Erro: "Variáveis de ambiente não configuradas" (Edge Function)

**Solução:**
1. Acesse o Supabase Dashboard
2. Vá em **Edge Functions** > **perfectpay-webhook** > **Settings**
3. Verifique se todas as variáveis estão configuradas:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `APP_URL`

### Webhook não está sendo recebido

**Solução:**
1. Verifique se a URL está correta na PerfectPay
2. Verifique se a Edge Function está deployada
3. Teste a URL manualmente com cURL
4. Verifique os logs da Edge Function

### Conta não está sendo criada

**Solução:**
1. Verifique os logs da Edge Function
2. Verifique se o email já existe no Supabase
3. Verifique se a `SUPABASE_SERVICE_ROLE_KEY` está correta
4. Verifique se o webhook está enviando o email corretamente

### Checkout não redireciona

**Solução:**
1. Verifique se o Product ID está correto
2. Verifique o console do navegador para erros
3. Verifique se a URL da PerfectPay está correta

---

## 📚 Recursos Adicionais

### Documentação

- [PerfectPay - Documentação](https://support.perfectpay.com.br)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

### Arquivos do Projeto

- `src/services/perfectPay.ts` - Serviço de integração
- `src/pages/CheckoutPage.tsx` - Página de checkout
- `src/services/webhook.ts` - Processamento de webhooks
- `supabase/functions/perfectpay-webhook/index.ts` - Edge Function

---

## 🎯 Próximos Passos

Após configurar tudo:

1. **Testar fluxo completo:**
   - Checkout → Pagamento → Webhook → Criação de conta

2. **Configurar envio de email:**
   - Implementar serviço de email real (Resend, SendGrid, etc.)
   - Atualizar função `sendWelcomeEmail`

3. **Monitorar em produção:**
   - Configurar alertas para erros
   - Monitorar logs da Edge Function
   - Verificar criação de contas

4. **Otimizar:**
   - Adicionar validação de assinatura do webhook
   - Implementar retry para falhas
   - Adicionar logging detalhado

---

**Última Atualização**: Janeiro 2025






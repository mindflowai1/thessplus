# 🎯 Configuração da PerfectPay

## 📋 Pré-requisitos

1. Conta na PerfectPay ([https://app.perfectpay.com.br](https://app.perfectpay.com.br))
2. Produto criado na PerfectPay com valor de R$ 45,00/mês
3. Acesso ao painel da PerfectPay para configurar webhooks

## 🔧 Configuração

### 1. Variáveis de Ambiente

Adicione as seguintes variáveis de ambiente no arquivo `.env`:

```env
VITE_PERFECTPAY_PRODUCT_ID=seu_product_id_aqui
VITE_PERFECTPAY_API_URL=https://app.perfectpay.com.br
```

**Onde encontrar o Product ID:**
- Acesse o painel da PerfectPay
- Vá em **Produtos** > Selecione o produto desejado
- O Product ID estará visível na página do produto

### 2. Configuração do Webhook

1. Acesse o painel da PerfectPay
2. Vá em **Ferramentas** > **PostBack - Webhook**
3. Clique em **Adicionar** para criar um novo webhook
4. Configure:
   - **Produto**: Selecione o produto criado
   - **URL de Retorno**: `https://seu-dominio.com/api/webhook/perfectpay`
   - **Eventos**: Marque **Todos os Eventos**
5. Salve as configurações

### 3. Criar Edge Function no Supabase (Opcional)

Para processar webhooks de forma segura, crie uma Edge Function no Supabase:

```typescript
// supabase/functions/perfectpay-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const webhookData = await req.json()
    
    // Validação básica
    if (!webhookData.status || !webhookData.transaction_id || !webhookData.custom) {
      return new Response(JSON.stringify({ error: 'Dados inválidos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const userId = webhookData.custom
    const status = webhookData.status.toLowerCase()

    // Se o pagamento foi aprovado
    if (status === 'aprovado' || status === 'approved' || status === 'paid') {
      const now = new Date()
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 1)

      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'active',
          subscription_plan: 'premium',
          subscription_start_date: now.toISOString(),
          subscription_end_date: endDate.toISOString(),
          subscription_renewal_date: endDate.toISOString(),
          payment_provider: 'perfectpay',
          payment_customer_id: userId,
          payment_subscription_id: webhookData.transaction_id,
          updated_at: now.toISOString(),
        })
        .eq('id', userId)

      if (error) {
        console.error('Erro ao atualizar assinatura:', error)
        return new Response(JSON.stringify({ error: 'Erro ao atualizar assinatura' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return new Response(JSON.stringify({ error: 'Erro interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

## 🚀 Como Funciona

1. **Usuário clica em "Assinar Agora"**
   - Redireciona para `/checkout`
   - Verifica se está logado
   - Redireciona para o checkout da PerfectPay

2. **Usuário completa o pagamento na PerfectPay**
   - PerfectPay processa o pagamento
   - Envia webhook para o endpoint configurado

3. **Webhook processa o pagamento**
   - Valida os dados recebidos
   - Atualiza a assinatura no banco de dados
   - Define status como `active` e plano como `premium`

## 📝 Atualização do Banco de Dados

Para suportar a PerfectPay, atualize o banco de dados:

```sql
-- Adicionar 'perfectpay' como opção de payment_provider
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_payment_provider_check;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_payment_provider_check 
CHECK (payment_provider IN ('stripe', 'mercadopago', 'asaas', 'pagar_me', 'perfectpay') OR payment_provider IS NULL);
```

## ✅ Testes

1. **Teste de Checkout:**
   - Clique em "Assinar Agora" na Landing Page
   - Verifique se redireciona para o checkout da PerfectPay
   - Verifique se os dados do usuário são passados corretamente

2. **Teste de Webhook:**
   - Use a ferramenta de teste da PerfectPay para enviar webhooks
   - Verifique se a assinatura é atualizada no banco de dados
   - Verifique se o status muda para `active`

## 🔒 Segurança

- Sempre valide os dados do webhook antes de processar
- Use HTTPS para o endpoint do webhook
- Considere adicionar autenticação ao webhook (token secreto)
- Não exponha chaves de API no frontend

## 📚 Documentação

- [Documentação da PerfectPay](https://support.perfectpay.com.br/doc/perfect-pay/perfectpay-api/conhecendo-a-api)
- [API da PerfectPay](https://support.perfectpay.com.br/doc/perfect-pay/perfectpay-api)



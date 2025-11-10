# 🔧 Configuração do Webhook PerfectPay

Este documento explica como configurar o sistema para criar contas automaticamente após pagamento aprovado.

## 📋 Fluxo Completo

1. **Usuário acessa `/checkout`** (sem estar logado)
2. **Preenche email e nome** no formulário
3. **É redirecionado para PerfectPay** para pagamento
4. **PerfectPay processa pagamento** e envia webhook
5. **Edge Function recebe webhook** e cria conta no Supabase
6. **Usuário recebe email** com credenciais de acesso

## 🚀 Configuração

### 1. Criar Edge Function no Supabase

1. Instale o Supabase CLI:
```bash
npm install -g supabase
```

2. Faça login:
```bash
supabase login
```

3. Link seu projeto:
```bash
supabase link --project-ref seu-project-ref
```

4. Crie a função:
```bash
supabase functions new perfectpay-webhook
```

5. Copie o conteúdo de `supabase/functions/perfectpay-webhook/index.ts` para a função criada

6. Faça deploy:
```bash
supabase functions deploy perfectpay-webhook
```

### 2. Configurar Variáveis de Ambiente

No Supabase Dashboard, vá em **Edge Functions** > **Settings** e configure:

- `SUPABASE_URL`: URL do seu projeto Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Service Role Key (encontre em Settings > API)
- `APP_URL`: URL da sua aplicação (ex: `https://seu-dominio.com`)

### 3. Configurar Webhook na PerfectPay

1. Acesse o painel da PerfectPay
2. Vá em **Configurações** > **Webhooks**
3. Adicione a URL do webhook:
   ```
   https://seu-project-ref.supabase.co/functions/v1/perfectpay-webhook
   ```
4. Configure os eventos:
   - ✅ Pagamento aprovado
   - ✅ Pagamento cancelado
   - ✅ Reembolso

### 4. Executar Script SQL

Execute o script `database/schema.sql` no Supabase SQL Editor para criar a tabela `pending_users`.

## 📝 Estrutura de Dados do Webhook

A PerfectPay deve enviar os seguintes dados no webhook:

```json
{
  "status": "approved",
  "transaction_id": "123456",
  "email": "usuario@email.com",
  "name": "Nome do Cliente",
  "amount": "45.00",
  "payment_date": "2024-01-15T10:00:00Z"
}
```

Ou usando o campo `custom`:

```json
{
  "status": "approved",
  "transaction_id": "123456",
  "custom": "usuario@email.com",
  "amount": "45.00"
}
```

## 🔐 Segurança

⚠️ **IMPORTANTE**: 

- **NUNCA** exponha a `SUPABASE_SERVICE_ROLE_KEY` no frontend
- Use apenas em Edge Functions ou backend
- Valide a assinatura do webhook da PerfectPay (se disponível)
- Use HTTPS para todas as comunicações

## 📧 Envio de Email

O sistema envia um email com credenciais após criar a conta. Para implementar envio real:

1. Configure um serviço de email (Resend, SendGrid, etc.)
2. Atualize a função `sendWelcomeEmail` em `src/services/userCreation.ts`
3. Adicione a API key nas variáveis de ambiente da Edge Function

## 🧪 Testando

1. Acesse `/checkout` sem estar logado
2. Preencha email e nome
3. Complete o pagamento na PerfectPay (use cartão de teste)
4. Verifique os logs da Edge Function no Supabase Dashboard
5. Verifique se o email foi recebido (ou logs do console)

## 🐛 Troubleshooting

### Webhook não está sendo recebido

- Verifique se a URL está correta na PerfectPay
- Verifique os logs da Edge Function no Supabase Dashboard
- Teste a URL manualmente com um POST request

### Conta não está sendo criada

- Verifique se a `SUPABASE_SERVICE_ROLE_KEY` está configurada corretamente
- Verifique os logs da Edge Function
- Verifique se o email já existe no Supabase

### Email não está sendo enviado

- Verifique se a função `sendWelcomeEmail` está implementada
- Verifique os logs do console (em desenvolvimento)
- Configure serviço de email real para produção

## 📚 Referências

- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [PerfectPay Webhooks](https://docs.perfectpay.com.br/webhooks)
- [Supabase Admin API](https://supabase.com/docs/reference/javascript/auth-admin-createuser)








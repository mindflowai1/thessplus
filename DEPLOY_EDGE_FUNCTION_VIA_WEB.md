# 🌐 Deploy Edge Function via Site do Supabase (Sem CLI)

Sim! É possível criar a Edge Function diretamente pelo site do Supabase, sem usar a CLI. Este guia mostra como fazer.

---

## ⚠️ Limitação Importante

**A interface web do Supabase permite criar funções simples**, mas nossa função precisa importar código de outros arquivos (`src/services/webhook.ts`). 

**Solução:** Vamos criar uma versão **autocontida** da função (todo o código em um único arquivo).

---

## 🚀 Passo 1: Acessar Edge Functions no Dashboard

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. No menu lateral esquerdo, clique em **"Edge Functions"**
4. Você verá a lista de funções (pode estar vazia)

---

## ➕ Passo 2: Criar Nova Função

1. Clique no botão **"+ New Function"** ou **"Create Function"**
2. Preencha:
   - **Function Name:** `perfectpay-webhook`
   - **Description:** `Webhook handler para processar pagamentos da PerfectPay`
3. Clique em **"Create"** ou **"Create Function"**

---

## 📝 Passo 3: Copiar o Código Completo

Agora você precisa copiar o código completo. Vou criar uma versão autocontida:

### 3.1. Abrir o Editor

Após criar a função, você verá um editor de código no navegador.

### 3.2. Substituir o Código Padrão

**Delete todo o código padrão** e cole este código completo:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Interface para dados do webhook
interface WebhookData {
  status: string
  transaction_id?: string
  id?: string
  payment_id?: string
  custom?: string
  email?: string
  customer_email?: string
  buyer_email?: string
  name?: string
  customer_name?: string
  buyer_name?: string
  full_name?: string
  amount?: string | number
  payment_date?: string
  [key: string]: any
}

// Gera senha temporária segura
function generateTemporaryPassword(): string {
  const length = 12
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]
  password += '0123456789'[Math.floor(Math.random() * 10)]
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]
  
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

// Cria usuário no Supabase Auth
async function createUserInSupabase(
  email: string,
  fullName: string | undefined,
  supabaseUrl: string,
  serviceRoleKey: string
): Promise<{ userId: string; email: string; temporaryPassword: string }> {
  const password = generateTemporaryPassword()
  
  // Criar usuário via Admin API
  const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey,
    },
    body: JSON.stringify({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || null,
      },
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('Error creating user:', errorData)
    
    if (errorData.code === 'user_already_exists' || 
        errorData.msg?.includes('already registered') ||
        errorData.message?.includes('already registered')) {
      throw new Error('User already registered')
    }
    
    throw new Error(errorData.message || errorData.msg || 'Erro ao criar usuário')
  }

  const user = await response.json()
  console.log('User created successfully:', user.id)

  // Criar perfil na tabela profiles
  const profileResponse = await fetch(`${supabaseUrl}/rest/v1/profiles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({
      id: user.id,
      full_name: fullName || null,
      subscription_status: 'active',
      subscription_plan: 'premium',
      subscription_start_date: new Date().toISOString(),
      subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      subscription_renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      payment_provider: 'perfectpay',
    }),
  })

  if (!profileResponse.ok) {
    const profileError = await profileResponse.text()
    console.error('Erro ao criar perfil:', profileError)
  } else {
    console.log('Profile created successfully for user:', user.id)
  }

  return {
    userId: user.id,
    email: user.email,
    temporaryPassword: password,
  }
}

// Processa webhook da PerfectPay
async function handlePerfectPayWebhook(
  webhookData: WebhookData,
  supabaseUrl: string,
  serviceRoleKey: string,
  appUrl: string
): Promise<{
  success: boolean
  message: string
  userId?: string
  email?: string
}> {
  try {
    console.log('Webhook data received:', JSON.stringify(webhookData, null, 2))
    
    // Extrai email do webhook (pode vir em vários campos diferentes)
    const email = webhookData.email || 
                  webhookData.custom || 
                  webhookData.customer_email ||
                  webhookData.buyer_email
    
    const name = webhookData.name || 
                 webhookData.customer_name || 
                 webhookData.buyer_name ||
                 webhookData.full_name
    
    const transactionId = webhookData.transaction_id || 
                         webhookData.id || 
                         webhookData.payment_id
    
    const status = webhookData.status?.toLowerCase()

    console.log('Extracted data:', { email, name, transactionId, status })

    if (!email) {
      console.error('Email not found in webhook data. Available fields:', Object.keys(webhookData))
      return {
        success: false,
        message: 'Email não encontrado nos dados do webhook',
      }
    }

    // Se o pagamento foi aprovado, cria a conta
    if (status === 'approved' || status === 'aprovado' || status === 'paid') {
      try {
        // Cria usuário no Supabase
        const userResult = await createUserInSupabase(
          email,
          name,
          supabaseUrl,
          serviceRoleKey
        )

        // Log das credenciais (em produção, enviar por email)
        console.log('User created:', {
          email: userResult.email,
          password: userResult.temporaryPassword,
          appUrl: appUrl
        })

        return {
          success: true,
          message: 'Conta criada com sucesso',
          userId: userResult.userId,
          email: userResult.email,
        }
      } catch (error: any) {
        console.error('Erro ao criar usuário:', error)
        
        // Se o usuário já existe, tenta atualizar apenas a assinatura
        if (error.message?.includes('already registered') || 
            error.message?.includes('already exists') ||
            error.message?.includes('duplicate') ||
            error.message?.includes('User already registered')) {
          
          console.log('Usuário já existe, tentando atualizar assinatura...')
          
          try {
            // Busca o usuário existente pelo email
            const getUserResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
              },
            })
            
            if (getUserResponse.ok) {
              const users = await getUserResponse.json()
              const existingUser = users.users?.find((u: any) => u.email === email)
              
              if (existingUser) {
                // Atualiza o perfil com a assinatura ativa
                const updateProfileResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${existingUser.id}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Prefer': 'return=representation',
                  },
                  body: JSON.stringify({
                    subscription_status: 'active',
                    subscription_plan: 'premium',
                    subscription_start_date: new Date().toISOString(),
                    subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    subscription_renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    payment_provider: 'perfectpay',
                  }),
                })
                
                if (updateProfileResponse.ok) {
                  return {
                    success: true,
                    message: 'Usuário já existe, assinatura atualizada com sucesso',
                    userId: existingUser.id,
                    email: existingUser.email,
                  }
                }
              }
            }
          } catch (updateError) {
            console.error('Erro ao atualizar assinatura do usuário existente:', updateError)
          }
          
          return {
            success: true,
            message: 'Usuário já existe. Se não recebeu o email, entre em contato com o suporte.',
          }
        }

        return {
          success: false,
          message: `Erro ao criar conta: ${error.message}`,
        }
      }
    }

    // Se o pagamento foi cancelado ou reembolsado
    if (status === 'cancelled' || status === 'cancelado' || status === 'refunded' || status === 'reembolsado') {
      return {
        success: true,
        message: 'Pagamento cancelado ou reembolsado',
      }
    }

    // Para outros status (pending, etc), apenas registra
    return {
      success: true,
      message: `Status do pagamento: ${status}. Aguardando confirmação.`,
    }
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return {
      success: false,
      message: 'Erro ao processar webhook',
    }
  }
}

// Handler principal da Edge Function
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

### 3.3. Salvar a Função

1. Clique em **"Deploy"** ou **"Save"** (geralmente no canto superior direito)
2. Aguarde alguns segundos
3. Você verá uma mensagem de sucesso

---

## ⚙️ Passo 4: Configurar Variáveis de Ambiente

### 4.1. Acessar Settings

Na página da função:
1. Clique na aba **"Settings"** (no topo)
2. Role até **"Secrets"** ou **"Environment Variables"**

### 4.2. Adicionar Variáveis

Clique em **"Add new secret"** ou **"+ Add variable"**

**Adicione 3 variáveis:**

#### Variável 1: SUPABASE_URL
```
Name:  SUPABASE_URL
Value: https://ldhxfiyjopesopqiwxyk.supabase.co
```
*Substitua pelo URL do seu projeto*

#### Variável 2: SUPABASE_SERVICE_ROLE_KEY
```
Name:  SUPABASE_SERVICE_ROLE_KEY
Value: (Cole a Service Role Key)
```
*Para obter: Settings → API → service_role → Reveal → Copy*

#### Variável 3: APP_URL
```
Name:  APP_URL
Value: https://thessplus-454059341133.europe-west1.run.app
```
*URL do seu site em produção*

### 4.3. Salvar

Clique em **"Save"** para cada variável.

---

## 🔗 Passo 5: Obter URL da Função

1. Na página da função, procure por **"Function URL"** ou **"Endpoint"**
2. Copie a URL (algo como):
   ```
   https://ldhxfiyjopesopqiwxyk.supabase.co/functions/v1/perfectpay-webhook
   ```

**Esta é a URL que você vai usar na PerfectPay!**

---

## ✅ Passo 6: Testar a Função

### 6.1. Testar via Dashboard

No Dashboard do Supabase:
1. Vá em **Edge Functions** → **perfectpay-webhook**
2. Clique na aba **"Logs"**
3. Você pode testar enviando um webhook de teste

### 6.2. Testar via Navegador (Opcional)

Abra uma nova aba e cole esta URL (substitua pela sua):

```
https://ldhxfiyjopesopqiwxyk.supabase.co/functions/v1/perfectpay-webhook
```

Deve retornar um erro (esperado, pois precisa de dados do webhook), mas confirma que a função está rodando.

---

## 🔄 Passo 7: Configurar Webhook na PerfectPay

1. Acesse: https://app.perfectpay.com.br
2. Vá em **Produtos** → Seu Produto → **Webhooks**
3. Adicione a URL:
   ```
   https://ldhxfiyjopesopqiwxyk.supabase.co/functions/v1/perfectpay-webhook
   ```
4. Selecione eventos: **Aprovado**, **Cancelado**, **Reembolsado**
5. Salve

---

## 📊 Passo 8: Monitorar Logs

No Dashboard do Supabase:
1. **Edge Functions** → **perfectpay-webhook** → **Logs**
2. Você verá todos os webhooks recebidos
3. Verifique se há erros

---

## ✅ Vantagens de Fazer pelo Site

- ✅ **Não precisa instalar CLI**
- ✅ **Não precisa usar terminal**
- ✅ **Interface visual**
- ✅ **Edição direta no navegador**
- ✅ **Logs visíveis no dashboard**

---

## ⚠️ Desvantagens

- ⚠️ **Código em um único arquivo** (mais difícil de manter)
- ⚠️ **Não sincroniza com Git** automaticamente
- ⚠️ **Edições futuras precisam ser feitas no site**

---

## 🔄 Atualizar a Função no Futuro

Se precisar atualizar o código:

1. Acesse **Edge Functions** → **perfectpay-webhook**
2. Edite o código no editor
3. Clique em **"Deploy"** ou **"Save"**
4. Pronto!

---

## 🎉 Pronto!

Agora sua Edge Function está deployada **sem usar CLI**!

**Próximos passos:**
1. ✅ Função criada e deployada
2. ✅ Variáveis de ambiente configuradas
3. ⏳ Configurar webhook na PerfectPay
4. ⏳ Testar com pagamento real

---

**Última atualização:** Novembro 2024


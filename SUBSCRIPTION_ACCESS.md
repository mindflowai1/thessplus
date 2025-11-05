# 📋 Sistema de Controle de Acesso por Assinatura

## 📊 Estrutura de Dados

A informação de assinatura fica na tabela **`profiles`** no banco de dados Supabase.

### Campos de Assinatura:

```sql
subscription_status: 'free' | 'trial' | 'active' | 'canceled' | 'expired' | 'past_due'
subscription_plan: 'free' | 'basic' | 'premium' | 'enterprise'
subscription_start_date: TIMESTAMPTZ
subscription_end_date: TIMESTAMPTZ
subscription_renewal_date: TIMESTAMPTZ
payment_provider: 'stripe' | 'mercadopago' | 'asaas' | 'pagar_me' | NULL
payment_customer_id: TEXT
payment_subscription_id: TEXT
trial_end_date: TIMESTAMPTZ
```

## 🔧 Como Usar no Código

### 1. Verificar Acesso Básico (Dashboard)

```tsx
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { hasAccess } = useAuth()
  
  if (!hasAccess()) {
    return <div>Você precisa de uma assinatura para acessar</div>
  }
  
  return <div>Dashboard</div>
}
```

### 2. Verificar Acesso Premium

```tsx
import { useAuth } from '@/contexts/AuthContext'

function PremiumFeature() {
  const { hasPremiumAccess } = useAuth()
  
  if (!hasPremiumAccess()) {
    return <div>Esta funcionalidade requer plano Premium</div>
  }
  
  return <div>Funcionalidade Premium</div>
}
```

### 3. Obter Informações Completas da Assinatura

```tsx
import { useAuth } from '@/contexts/AuthContext'

function SubscriptionInfo() {
  const { getSubscriptionInfo } = useAuth()
  const subscription = getSubscriptionInfo()
  
  if (!subscription) {
    return <div>Carregando...</div>
  }
  
  return (
    <div>
      <p>Plano: {subscription.plan}</p>
      <p>Status: {subscription.status}</p>
      <p>Ativo: {subscription.isActive ? 'Sim' : 'Não'}</p>
      <p>Tem Acesso: {subscription.hasAccess ? 'Sim' : 'Não'}</p>
    </div>
  )
}
```

### 4. Usar Funções Diretamente (sem hook)

```tsx
import { hasDashboardAccess, hasPremiumAccess, getSubscriptionInfo } from '@/lib/subscription'

// Verificar acesso
const canAccess = hasDashboardAccess(status, plan, endDate)
const canUsePremium = hasPremiumAccess(status, plan, endDate)

// Obter informações completas
const info = getSubscriptionInfo(status, plan, endDate, trialEndDate)
```

## 📝 Regras de Acesso

### Acesso ao Dashboard:
- ✅ **Plano Free**: Sempre tem acesso básico
- ✅ **Plano Basic/Premium/Enterprise**: Precisa estar `active` ou `trial` e não expirado
- ❌ **Status `expired`**: Sem acesso
- ❌ **Status `canceled`**: Sem acesso (a menos que seja free)

### Acesso Premium:
- ❌ **Plano Free**: Sem acesso premium
- ✅ **Plano Basic/Premium/Enterprise**: Precisa estar `active` ou `trial` válido e não expirado

## 🔄 Atualizar Assinatura

Para atualizar a assinatura de um usuário:

```sql
UPDATE profiles 
SET 
  subscription_status = 'active',
  subscription_plan = 'premium',
  subscription_start_date = NOW(),
  subscription_end_date = NOW() + INTERVAL '1 month',
  payment_provider = 'stripe',
  payment_customer_id = 'cus_xxx',
  payment_subscription_id = 'sub_xxx'
WHERE id = 'user-uuid';
```

## 🎯 Próximos Passos

1. Integrar com gateway de pagamento (Stripe, MercadoPago, etc)
2. Criar página de assinatura/upgrade
3. Adicionar middleware de verificação de acesso nas rotas
4. Criar notificações de expiração de assinatura


-- ============================================
-- ADICIONAR CAMPOS DE ASSINATURA NA TABELA profiles
-- Execute este script se já tem a tabela profiles criada
-- ============================================

-- Adicionar colunas de assinatura
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'trial', 'active', 'canceled', 'expired', 'past_due')),
ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'premium', 'enterprise')),
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_renewal_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_provider TEXT CHECK (payment_provider IN ('stripe', 'mercadopago', 'asaas', 'pagar_me', NULL)),
ADD COLUMN IF NOT EXISTS payment_customer_id TEXT,
ADD COLUMN IF NOT EXISTS payment_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMPTZ;

-- Índices para consultas de assinaturas
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status) WHERE subscription_status IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_plan ON profiles(subscription_plan) WHERE subscription_plan IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_payment_customer_id ON profiles(payment_customer_id) WHERE payment_customer_id IS NOT NULL;

-- ============================================
-- FIM DO SCRIPT
-- ============================================

-- Exemplo de uso:
-- UPDATE profiles SET 
--   subscription_status = 'active',
--   subscription_plan = 'premium',
--   subscription_start_date = NOW(),
--   subscription_end_date = NOW() + INTERVAL '1 month',
--   payment_provider = 'stripe',
--   payment_customer_id = 'cus_xxx',
--   payment_subscription_id = 'sub_xxx'
-- WHERE id = 'user-uuid';



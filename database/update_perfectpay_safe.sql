-- ============================================
-- ATUALIZAÇÃO SEGURA PARA ADICIONAR PERFECTPAY
-- Este script é seguro e não quebra nada existente
-- Execute este script se já tem a estrutura de assinatura criada
-- ============================================

-- Verificar e remover constraints antigos (pode ter nomes diferentes)
-- PostgreSQL pode criar constraints com nomes diferentes dependendo de como foi criado
DO $$
BEGIN
    -- Tenta remover o constraint se existir com esse nome exato
    ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_payment_provider_check;
    
    -- Tenta remover outros possíveis nomes de constraint
    -- (PostgreSQL pode gerar nomes automáticos como profiles_payment_provider_check_1, etc)
    EXECUTE (
        SELECT 'ALTER TABLE profiles DROP CONSTRAINT IF EXISTS ' || constraint_name || ';'
        FROM information_schema.table_constraints
        WHERE table_schema = 'public'
          AND table_name = 'profiles'
          AND constraint_type = 'CHECK'
          AND constraint_name LIKE '%payment_provider%'
        LIMIT 1
    );
EXCEPTION
    WHEN OTHERS THEN
        -- Se não encontrar, continua sem erro
        NULL;
END $$;

-- Adicionar novo constraint com 'perfectpay' incluído
-- Mantém todas as opções anteriores + perfectpay
ALTER TABLE profiles 
ADD CONSTRAINT profiles_payment_provider_check 
CHECK (payment_provider IN ('stripe', 'mercadopago', 'asaas', 'pagar_me', 'perfectpay') OR payment_provider IS NULL);

-- ============================================
-- FIM DO SCRIPT
-- ============================================

-- NOTA: Este script é idempotente (pode ser executado múltiplas vezes sem problemas)
-- Se a coluna payment_provider não existir, execute primeiro o add_subscriptions.sql



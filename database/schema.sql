-- ============================================
-- SCRIPT COMPLETO DE CRIAÇÃO DO BANCO DE DADOS
-- Thess+ - Estrutura Completa
-- ============================================

-- ============================================
-- 1. FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 2. TABELA: profiles (Perfis de Usuário)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para profiles
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone) WHERE phone IS NOT NULL;

-- Trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;
CREATE POLICY "Users can delete own profile"
    ON profiles FOR DELETE
    USING (auth.uid() = id);

-- ============================================
-- 3. TABELA: transactions (Transações Financeiras)
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    descricao TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('Entrada', 'Saída')),
    categoria TEXT NOT NULL,
    valor NUMERIC(10, 2) NOT NULL CHECK (valor > 0),
    data TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para transactions
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, data DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_category ON transactions(user_id, categoria);
CREATE INDEX IF NOT EXISTS idx_transactions_data ON transactions(data DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_tipo ON transactions(tipo);

-- Trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para transactions
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
CREATE POLICY "Users can view own transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
CREATE POLICY "Users can insert own transactions"
    ON transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own transactions" ON transactions;
CREATE POLICY "Users can update own transactions"
    ON transactions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own transactions" ON transactions;
CREATE POLICY "Users can delete own transactions"
    ON transactions FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 4. TABELA: limites_gastos (Limites de Gastos por Categoria)
-- ============================================
CREATE TABLE IF NOT EXISTS limites_gastos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    alimentacao NUMERIC(10, 2) DEFAULT 0 CHECK (alimentacao >= 0),
    lazer NUMERIC(10, 2) DEFAULT 0 CHECK (lazer >= 0),
    impostos NUMERIC(10, 2) DEFAULT 0 CHECK (impostos >= 0),
    saude NUMERIC(10, 2) DEFAULT 0 CHECK (saude >= 0),
    transporte NUMERIC(10, 2) DEFAULT 0 CHECK (transporte >= 0),
    moradia NUMERIC(10, 2) DEFAULT 0 CHECK (moradia >= 0),
    educacao NUMERIC(10, 2) DEFAULT 0 CHECK (educacao >= 0),
    outros NUMERIC(10, 2) DEFAULT 0 CHECK (outros >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para limites_gastos
CREATE INDEX IF NOT EXISTS idx_limites_gastos_user_id ON limites_gastos(user_id);

-- Trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_limites_gastos_updated_at ON limites_gastos;
CREATE TRIGGER update_limites_gastos_updated_at
    BEFORE UPDATE ON limites_gastos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE limites_gastos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para limites_gastos
DROP POLICY IF EXISTS "Users can view own limits" ON limites_gastos;
CREATE POLICY "Users can view own limits"
    ON limites_gastos FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own limits" ON limites_gastos;
CREATE POLICY "Users can insert own limits"
    ON limites_gastos FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own limits" ON limites_gastos;
CREATE POLICY "Users can update own limits"
    ON limites_gastos FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own limits" ON limites_gastos;
CREATE POLICY "Users can delete own limits"
    ON limites_gastos FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 5. TABELA: reminders (Lembretes)
-- ============================================
CREATE TABLE IF NOT EXISTS reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME,
    google_event_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para reminders
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_date ON reminders(date);
CREATE INDEX IF NOT EXISTS idx_reminders_google_event_id ON reminders(google_event_id) WHERE google_event_id IS NOT NULL;

-- Trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_reminders_updated_at ON reminders;
CREATE TRIGGER update_reminders_updated_at
    BEFORE UPDATE ON reminders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para reminders
DROP POLICY IF EXISTS "Users can view own reminders" ON reminders;
CREATE POLICY "Users can view own reminders"
    ON reminders FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own reminders" ON reminders;
CREATE POLICY "Users can insert own reminders"
    ON reminders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own reminders" ON reminders;
CREATE POLICY "Users can update own reminders"
    ON reminders FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own reminders" ON reminders;
CREATE POLICY "Users can delete own reminders"
    ON reminders FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 6. FUNÇÃO: change_user_password (Trocar Senha)
-- ============================================
CREATE OR REPLACE FUNCTION change_user_password(current_password text, new_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
  user_email text;
BEGIN
  -- Pegar o ID do usuário autenticado
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Não autenticado');
  END IF;
  
  -- Pegar o email do usuário
  SELECT email INTO user_email FROM auth.users WHERE id = current_user_id;
  
  -- Atualizar a senha
  UPDATE auth.users
  SET 
    encrypted_password = crypt(new_password, gen_salt('bf')),
    updated_at = now()
  WHERE id = current_user_id;
  
  -- Retornar sucesso
  RETURN json_build_object(
    'success', true, 
    'message', 'Senha atualizada com sucesso'
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false, 
      'message', 'Erro ao atualizar senha: ' || SQLERRM
    );
END;
$$;

-- Dar permissão para usuários autenticados chamarem a função
GRANT EXECUTE ON FUNCTION change_user_password(text, text) TO authenticated;

-- ============================================
-- FIM DO SCRIPT DE CRIAÇÃO
-- ============================================


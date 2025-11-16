# 📋 Guia de Scripts SQL - Thess+

## 🎯 Qual Script Executar?

### Se você já tem a estrutura completa do banco:

**Execute apenas:**
```sql
database/add_perfectpay.sql
```

Este script:
- ✅ Remove o constraint antigo de `payment_provider` (se existir)
- ✅ Adiciona o novo constraint com `'perfectpay'` incluído
- ✅ **Não modifica dados existentes**
- ✅ **Não remove colunas**
- ✅ Pode ser executado múltiplas vezes sem problemas

### Se você ainda não tem a estrutura de assinatura:

**Execute nesta ordem:**
1. `database/add_subscriptions.sql` (cria todas as colunas de assinatura)
2. `database/add_perfectpay.sql` (adiciona 'perfectpay' ao constraint)

## 📝 Scripts Disponíveis

### `database/schema.sql`
- **Quando usar:** Criação inicial completa do banco de dados
- **Cuidado:** Este script cria toda a estrutura do zero

### `database/add_subscriptions.sql`
- **Quando usar:** Se já tem o banco criado mas não tem os campos de assinatura
- **O que faz:** Adiciona todas as colunas de assinatura na tabela `profiles`
- **Seguro:** Usa `IF NOT EXISTS`, não quebra nada existente

### `database/add_perfectpay.sql` ⭐ **RECOMENDADO**
- **Quando usar:** Se já tem a estrutura de assinatura criada
- **O que faz:** Atualiza o constraint de `payment_provider` para incluir 'perfectpay'
- **Seguro:** Remove o constraint antigo e adiciona o novo, mantendo todos os valores anteriores

### `database/update_perfectpay_safe.sql`
- **Quando usar:** Alternativa mais robusta ao `add_perfectpay.sql`
- **O que faz:** Mesmo que `add_perfectpay.sql`, mas com busca dinâmica do nome do constraint

## ✅ Verificação

Após executar o script, você pode verificar se funcionou:

```sql
-- Verificar se o constraint foi atualizado
SELECT 
    constraint_name,
    check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'profiles'
  AND tc.constraint_type = 'CHECK'
  AND check_clause LIKE '%payment_provider%';

-- Verificar se a coluna existe
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name = 'payment_provider';
```

## 🔒 Segurança

Todos os scripts usam:
- `IF NOT EXISTS` - Não recria se já existe
- `IF EXISTS` - Não erro se não existe
- `DROP CONSTRAINT IF EXISTS` - Não quebra se o constraint não existir

## ⚠️ Importante

- **Faça backup do banco antes de executar scripts SQL**
- **Teste em ambiente de desenvolvimento primeiro**
- Os scripts são idempotentes (podem ser executados múltiplas vezes)













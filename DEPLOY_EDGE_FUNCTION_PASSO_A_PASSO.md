# 🚀 Deploy da Edge Function - Guia Passo a Passo

Este guia mostra **exatamente** como fazer o deploy da Edge Function do webhook PerfectPay no Supabase.

---

## 📋 Pré-requisitos

Antes de começar, você precisa:

- ✅ Conta no Supabase (gratuita)
- ✅ Projeto criado no Supabase
- ✅ PowerShell ou Terminal aberto

---

## 🔧 Passo 1: Instalar Supabase CLI

### Opção 1: Via npm (Recomendado para Windows)

Abra o PowerShell e execute:

```powershell
npm install -g supabase
```

Aguarde a instalação terminar. Depois teste:

```powershell
supabase --version
```

Deve mostrar algo como: `Supabase CLI 1.x.x`

### Opção 2: Via Scoop (Alternativa para Windows)

Se preferir usar Scoop:

```powershell
scoop install supabase
```

---

## 🔑 Passo 2: Login no Supabase

### 2.1. Executar comando de login

No PowerShell, execute:

```powershell
supabase login
```

### 2.2. Autorizar no navegador

Isso vai abrir seu navegador automaticamente. Você verá uma página do Supabase pedindo autorização.

**Se não abrir automaticamente:**
1. Copie a URL que aparece no terminal
2. Cole no navegador
3. Faça login na sua conta Supabase

### 2.3. Confirmar autorização

Clique em **"Authorize"** ou **"Autorizar"** na página do navegador.

### 2.4. Verificar sucesso

Volte ao PowerShell. Deve aparecer:

```
✔ Logged in successfully!
```

---

## 🔗 Passo 3: Obter o Project Reference ID

### 3.1. Acessar Dashboard do Supabase

1. Abra seu navegador
2. Acesse: https://supabase.com/dashboard
3. Faça login (se necessário)
4. Você verá a lista dos seus projetos

### 3.2. Selecionar seu projeto

Clique no projeto **"thessplus"** (ou o nome que você deu)

### 3.3. Obter o Reference ID

**Método 1: Via URL**
- Olhe a URL do navegador: `https://supabase.com/dashboard/project/SEU_PROJECT_REF`
- O `SEU_PROJECT_REF` é o que você precisa
- Exemplo: `ldhxfiyjopesopqiwxyk`

**Método 2: Via Settings**
1. No menu lateral esquerdo, clique em **⚙️ Settings** (Configurações)
2. Clique em **General**
3. Procure por **"Reference ID"**
4. Copie o valor (algo como `ldhxfiyjopesopqiwxyk`)

---

## 🔗 Passo 4: Link com seu projeto

### 4.1. Voltar ao PowerShell

Certifique-se de estar na pasta do projeto:

```powershell
cd "C:\Gaveta 2\Projetos\thessplus"
```

### 4.2. Executar comando de link

Substitua `SEU_PROJECT_REF` pelo ID que você copiou:

```powershell
supabase link --project-ref ldhxfiyjopesopqiwxyk
```

### 4.3. Confirmar senha do banco (se solicitado)

O Supabase pode pedir a senha do banco de dados:

```
Enter your database password (or leave blank to skip):
```

**Opções:**
- **Opção 1:** Deixe em branco (apenas pressione Enter) - recomendado para Edge Functions
- **Opção 2:** Insira a senha do banco se souber

### 4.4. Verificar sucesso

Deve aparecer:

```
✔ Finished supabase link.
```

---

## 📦 Passo 5: Deploy da Edge Function

### 5.1. Verificar que a pasta existe

No PowerShell, execute:

```powershell
dir supabase\functions\perfectpay-webhook
```

Deve mostrar o arquivo `index.ts`

### 5.2. Executar o deploy

```powershell
supabase functions deploy perfectpay-webhook
```

### 5.3. Aguardar o deploy

Você verá algo como:

```
Deploying Function...
  ✓ Bundling function...
  ✓ Uploading function...
  ✓ Deploying function...

Function URL: https://ldhxfiyjopesopqiwxyk.supabase.co/functions/v1/perfectpay-webhook
```

### 5.4. Copiar a URL

**IMPORTANTE:** Copie essa URL! Você vai precisar dela para configurar na PerfectPay.

Exemplo:
```
https://ldhxfiyjopesopqiwxyk.supabase.co/functions/v1/perfectpay-webhook
```

---

## 🔐 Passo 6: Obter Service Role Key

### 6.1. Acessar Settings do projeto

No Supabase Dashboard:
1. Clique em **⚙️ Settings** (menu lateral esquerdo)
2. Clique em **API**

### 6.2. Localizar a Service Role Key

Role a página até encontrar:

```
Project API keys
```

Você verá duas chaves:
- **anon / public**: Esta você já usa no frontend ✅
- **service_role**: Esta é a que você precisa! ⚠️

### 6.3. Copiar a Service Role Key

1. Clique no ícone de **"Reveal"** (👁️) ao lado de `service_role`
2. A chave será revelada (algo como `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
3. Clique no ícone de **"Copy"** (📋) para copiar

**⚠️ ATENÇÃO:** 
- Esta chave tem **ACESSO TOTAL** ao seu banco!
- **NUNCA** exponha ela no frontend
- **NUNCA** commit ela no Git
- Use **APENAS** em Edge Functions e backend

---

## ⚙️ Passo 7: Configurar Variáveis de Ambiente

### 7.1. Acessar Edge Functions

No Supabase Dashboard:
1. No menu lateral esquerdo, clique em **Edge Functions**
2. Você verá a lista de funções
3. Clique em **`perfectpay-webhook`**

### 7.2. Abrir Settings da função

Na página da função:
1. Clique na aba **"Settings"** (no topo)
2. Role até **"Secrets"** ou **"Environment Variables"**

### 7.3. Adicionar variáveis

Clique em **"Add new secret"** ou **"+ Add variable"**

**Adicione 3 variáveis:**

#### Variável 1: SUPABASE_URL
```
Name:  SUPABASE_URL
Value: https://ldhxfiyjopesopqiwxyk.supabase.co
```
*Substitua pelo URL do seu projeto (o mesmo da URL do navegador, sem o `/dashboard/...`)*

#### Variável 2: SUPABASE_SERVICE_ROLE_KEY
```
Name:  SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
*Cole a Service Role Key que você copiou no Passo 6*

#### Variável 3: APP_URL
```
Name:  APP_URL
Value: https://thessplus-454059341133.europe-west1.run.app
```
*Use a URL do seu site em produção (Cloud Run)*

### 7.4. Salvar

Clique em **"Save"** ou **"Update"** para cada variável.

---

## ✅ Passo 8: Verificar Deploy

### 8.1. Testar a função

No PowerShell, execute:

```powershell
curl -X POST https://ldhxfiyjopesopqiwxyk.supabase.co/functions/v1/perfectpay-webhook -H "Content-Type: application/json" -d '{\"status\":\"test\"}'
```

*Substitua pela URL da sua função*

Deve retornar algo como:
```json
{"success":true,"message":"Status do pagamento: test. Aguardando confirmação."}
```

### 8.2. Ver logs

No Dashboard do Supabase:
1. Vá em **Edge Functions** → **perfectpay-webhook**
2. Clique na aba **"Logs"**
3. Você deve ver os logs do teste

**Ou via CLI:**

```powershell
supabase functions logs perfectpay-webhook --limit 10
```

---

## 🔄 Passo 9: Configurar Webhook na PerfectPay

Agora que a Edge Function está deployada, você precisa configurar na PerfectPay:

### 9.1. Acessar Dashboard PerfectPay

1. Acesse: https://app.perfectpay.com.br
2. Faça login na sua conta

### 9.2. Ir para configurações do produto

1. No menu lateral, clique em **"Produtos"**
2. Selecione o produto que você criou para o Thess+
3. Role até **"Webhooks"** ou **"Notificações"**

### 9.3. Adicionar URL do webhook

1. Clique em **"Adicionar Webhook"** ou **"Configurar Webhook"**
2. Cole a URL da Edge Function:
   ```
   https://ldhxfiyjopesopqiwxyk.supabase.co/functions/v1/perfectpay-webhook
   ```

### 9.4. Selecionar eventos

Marque os eventos:
- ✅ **Pagamento Aprovado** (ou `paid`, `approved`)
- ✅ **Pagamento Cancelado** (ou `cancelled`)
- ✅ **Pagamento Reembolsado** (ou `refunded`)

### 9.5. Salvar e testar

1. Clique em **"Salvar"**
2. Se houver opção de **"Testar Webhook"**, clique para enviar um teste
3. Verifique os logs no Supabase

---

## 🧪 Passo 10: Testar Fluxo Completo

### 10.1. Fazer teste de pagamento

1. Acesse seu site: https://thessplus-454059341133.europe-west1.run.app
2. Vá para `/checkout`
3. Preencha:
   - Email: `teste@exemplo.com`
   - Nome: `Teste Usuário`
4. Clique em **"Ir para Pagamento"**
5. Complete o pagamento (use modo sandbox/teste se disponível)

### 10.2. Monitorar logs em tempo real

Em outro terminal PowerShell, execute:

```powershell
supabase functions logs perfectpay-webhook --tail
```

Isso mostrará os logs em tempo real conforme o webhook for recebido.

### 10.3. Verificar usuário criado

**No Supabase Dashboard:**

1. Vá em **Authentication** → **Users**
2. Procure pelo email `teste@exemplo.com`
3. Se o usuário foi criado, o webhook funcionou! ✅

**Verifique também o perfil:**

1. Vá em **Table Editor** → **profiles**
2. Procure pelo usuário
3. Verifique se `subscription_status` = `active`

---

## 🔍 Troubleshooting

### Erro: "command not found: supabase"

**Solução:** A CLI não foi instalada corretamente.

```powershell
# Tente reinstalar
npm install -g supabase --force

# Ou feche e reabra o PowerShell
```

### Erro: "Failed to link project"

**Solução:** Verifique se o Project Reference ID está correto.

```powershell
# Liste seus projetos
supabase projects list

# Link novamente com o ID correto
supabase link --project-ref SEU_ID_CORRETO
```

### Erro: "Authentication required"

**Solução:** Faça login novamente.

```powershell
supabase logout
supabase login
```

### Erro ao acessar a função: "Function not found"

**Solução:** Verifique se o deploy foi bem-sucedido.

```powershell
# Liste as funções deployadas
supabase functions list

# Se não aparecer, faça deploy novamente
supabase functions deploy perfectpay-webhook
```

### Variáveis de ambiente não funcionam

**Solução:** 
1. Verifique se salvou as variáveis no Dashboard
2. Faça um novo deploy após adicionar variáveis:
   ```powershell
   supabase functions deploy perfectpay-webhook
   ```

---

## 📚 Comandos Úteis

```powershell
# Ver versão da CLI
supabase --version

# Ver projetos disponíveis
supabase projects list

# Ver funções deployadas
supabase functions list

# Ver logs (últimos 50)
supabase functions logs perfectpay-webhook --limit 50

# Ver logs em tempo real
supabase functions logs perfectpay-webhook --tail

# Fazer deploy novamente
supabase functions deploy perfectpay-webhook

# Deslink do projeto (se precisar reconectar)
supabase unlink

# Logout
supabase logout
```

---

## ✅ Checklist de Deploy

Use esta checklist para garantir que tudo foi configurado:

- [ ] Supabase CLI instalada (`supabase --version`)
- [ ] Login feito com sucesso (`supabase login`)
- [ ] Projeto linkado (`supabase link`)
- [ ] Edge Function deployada (`supabase functions deploy`)
- [ ] URL da função copiada
- [ ] Service Role Key copiada
- [ ] Variável `SUPABASE_URL` configurada
- [ ] Variável `SUPABASE_SERVICE_ROLE_KEY` configurada
- [ ] Variável `APP_URL` configurada
- [ ] Webhook configurado na PerfectPay
- [ ] Teste de webhook realizado
- [ ] Logs verificados sem erros
- [ ] Usuário de teste criado com sucesso

---

## 🎉 Pronto!

Se todos os passos foram concluídos:

✅ **Edge Function está deployada e funcionando**
✅ **Webhook está configurado na PerfectPay**
✅ **Sistema está pronto para criar contas automaticamente**

Agora, sempre que um pagamento for aprovado na PerfectPay:
1. Webhook será enviado automaticamente
2. Edge Function processará o pagamento
3. Conta será criada no Supabase
4. Usuário receberá email com credenciais (se configurado)
5. Usuário poderá fazer login em `/auth`

**Qualquer dúvida, consulte os logs:**
```powershell
supabase functions logs perfectpay-webhook --tail
```

---

**Última atualização:** Novembro 2024


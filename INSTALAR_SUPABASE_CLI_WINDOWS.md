# 🪟 Instalar Supabase CLI no Windows (PowerShell)

Guia completo para instalar o Supabase CLI no Windows usando PowerShell.

---

## 📋 Pré-requisitos

- ✅ Windows 10/11
- ✅ PowerShell (já vem instalado)
- ✅ Acesso de Administrador (para instalar Scoop)

---

## 🚀 Passo 1: Instalar Scoop

O Scoop é um gerenciador de pacotes para Windows (como o npm, mas para programas).

### 1.1. Abrir PowerShell como Administrador

1. Pressione `Windows + X`
2. Clique em **"Windows PowerShell (Admin)"** ou **"Terminal (Admin)"**
3. Se aparecer uma janela pedindo permissão, clique em **"Sim"**

### 1.2. Permitir execução de scripts

No PowerShell (como Admin), execute:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Se perguntar algo, digite `S` e pressione Enter.

### 1.3. Instalar Scoop

Ainda no PowerShell (como Admin), execute:

```powershell
irm get.scoop.sh | iex
```

Aguarde alguns segundos. Você verá mensagens de instalação.

**Se der erro:**
- Certifique-se de que está executando como Administrador
- Tente novamente

### 1.4. Verificar instalação do Scoop

```powershell
scoop --version
```

Deve mostrar algo como: `Current Scoop version: 0.x.x`

---

## 📦 Passo 2: Adicionar Bucket do Supabase

O "bucket" é o repositório onde o Scoop busca o Supabase CLI.

### 2.1. Adicionar bucket

No PowerShell (pode ser normal agora, não precisa ser Admin):

```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
```

### 2.2. Verificar bucket adicionado

```powershell
scoop bucket list
```

Deve mostrar `supabase` na lista.

---

## 🔧 Passo 3: Instalar Supabase CLI

### 3.1. Instalar

No PowerShell:

```powershell
scoop install supabase
```

Aguarde a instalação terminar.

### 3.2. Verificar instalação

```powershell
supabase --version
```

Deve mostrar algo como: `Supabase CLI 1.x.x`

**Se funcionou, você está pronto!** ✅

---

## 🎯 Passo 4: Navegar até o Projeto

Agora vamos para a pasta do projeto:

```powershell
cd "C:\Gaveta 2\Projetos\thessplus"
```

Verifique se está na pasta certa:

```powershell
dir
```

Deve mostrar os arquivos do projeto (package.json, src, etc.)

---

## 🔑 Passo 5: Login no Supabase

### 5.1. Executar login

```powershell
supabase login
```

### 5.2. Autorizar no navegador

Isso vai abrir seu navegador automaticamente. Você verá uma página do Supabase pedindo autorização.

**Se não abrir automaticamente:**
1. Copie a URL que aparece no terminal
2. Cole no navegador
3. Faça login na sua conta Supabase

### 5.3. Confirmar autorização

Clique em **"Authorize"** ou **"Autorizar"** na página do navegador.

### 5.4. Verificar sucesso

Volte ao PowerShell. Deve aparecer:

```
✔ Logged in successfully!
```

---

## 🔗 Passo 6: Link com seu Projeto

### 6.1. Obter Project Reference ID

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Olhe a URL: `https://supabase.com/dashboard/project/SEU_PROJECT_REF`
4. Copie o `SEU_PROJECT_REF` (exemplo: `ldhxfiyjopesopqiwxyk`)

**Ou:**

1. Settings → General
2. Copie o **"Reference ID"**

### 6.2. Link com projeto

No PowerShell, execute (substitua pelo seu ID):

```powershell
supabase link --project-ref ldhxfiyjopesopqiwxyk
```

### 6.3. Confirmar senha (se solicitado)

Se pedir senha do banco, apenas pressione **Enter** (deixe em branco).

### 6.4. Verificar sucesso

Deve aparecer:

```
✔ Finished supabase link.
```

---

## 📦 Passo 7: Deploy da Edge Function

### 7.1. Verificar que a pasta existe

```powershell
dir supabase\functions\perfectpay-webhook
```

Deve mostrar o arquivo `index.ts`

### 7.2. Executar deploy

```powershell
supabase functions deploy perfectpay-webhook
```

### 7.3. Aguardar deploy

Você verá algo como:

```
Deploying Function...
  ✓ Bundling function...
  ✓ Uploading function...
  ✓ Deploying function...

Function URL: https://ldhxfiyjopesopqiwxyk.supabase.co/functions/v1/perfectpay-webhook
```

### 7.4. Copiar a URL

**IMPORTANTE:** Copie essa URL! Você vai precisar dela.

---

## ⚙️ Passo 8: Configurar Variáveis de Ambiente

### 8.1. Acessar Dashboard

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Edge Functions** → **perfectpay-webhook**
4. Clique na aba **"Settings"**

### 8.2. Adicionar variáveis

Clique em **"Add new secret"** ou **"+ Add variable"**

**Adicione 3 variáveis:**

#### Variável 1: SUPABASE_URL
```
Name:  SUPABASE_URL
Value: https://ldhxfiyjopesopqiwxyk.supabase.co
```

#### Variável 2: SUPABASE_SERVICE_ROLE_KEY
```
Name:  SUPABASE_SERVICE_ROLE_KEY
Value: (Cole a Service Role Key)
```

**Para obter a Service Role Key:**
1. Settings → API
2. Role até **"Project API keys"**
3. Clique em **👁️ Reveal** ao lado de `service_role`
4. Clique em **📋 Copy**

#### Variável 3: APP_URL
```
Name:  APP_URL
Value: https://thessplus-454059341133.europe-west1.run.app
```

### 8.3. Salvar

Clique em **"Save"** para cada variável.

---

## ✅ Passo 9: Verificar Deploy

### 9.1. Ver logs

No PowerShell:

```powershell
supabase functions logs perfectpay-webhook --limit 10
```

### 9.2. Testar função

No PowerShell:

```powershell
curl -X POST https://ldhxfiyjopesopqiwxyk.supabase.co/functions/v1/perfectpay-webhook -H "Content-Type: application/json" -d '{\"status\":\"test\"}'
```

*Substitua pela URL da sua função*

Deve retornar algo como:
```json
{"success":true,"message":"Status do pagamento: test. Aguardando confirmação."}
```

---

## 🔄 Passo 10: Configurar Webhook na PerfectPay

1. Acesse: https://app.perfectpay.com.br
2. Vá em **Produtos** → Seu Produto → **Webhooks**
3. Adicione a URL:
   ```
   https://ldhxfiyjopesopqiwxyk.supabase.co/functions/v1/perfectpay-webhook
   ```
4. Eventos: **Aprovado**, **Cancelado**, **Reembolsado**
5. Salve

---

## 🆘 Troubleshooting

### Erro: "scoop: command not found"

**Solução:** O Scoop não foi instalado corretamente.

1. Abra PowerShell como Admin
2. Execute novamente: `irm get.scoop.sh | iex`
3. Verifique: `scoop --version`

### Erro: "supabase: command not found"

**Solução:** O Supabase CLI não foi instalado.

1. Verifique: `scoop list` (deve mostrar `supabase`)
2. Se não aparecer, instale: `scoop install supabase`
3. Feche e reabra o PowerShell

### Erro: "ExecutionPolicy"

**Solução:** Permissão não configurada.

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Erro ao fazer deploy: "Function not found"

**Solução:** Verifique se a pasta existe:

```powershell
dir supabase\functions\perfectpay-webhook
```

Se não existir, você precisa criar a função primeiro ou usar o método via web.

---

## 📚 Comandos Úteis

```powershell
# Ver versão do Supabase CLI
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

# Deslink do projeto
supabase unlink

# Logout
supabase logout
```

---

## ✅ Checklist Completo

- [ ] Scoop instalado (`scoop --version`)
- [ ] Bucket do Supabase adicionado (`scoop bucket list`)
- [ ] Supabase CLI instalado (`supabase --version`)
- [ ] Login feito com sucesso (`supabase login`)
- [ ] Projeto linkado (`supabase link`)
- [ ] Edge Function deployada (`supabase functions deploy`)
- [ ] URL da função copiada
- [ ] Service Role Key copiada
- [ ] Variável `SUPABASE_URL` configurada
- [ ] Variável `SUPABASE_SERVICE_ROLE_KEY` configurada
- [ ] Variável `APP_URL` configurada
- [ ] Webhook configurado na PerfectPay
- [ ] Teste realizado com sucesso

---

## 🎉 Pronto!

Agora você tem o Supabase CLI instalado e pode fazer deploy de Edge Functions facilmente!

**Próximos passos:**
1. ✅ CLI instalada
2. ✅ Função deployada
3. ✅ Variáveis configuradas
4. ⏳ Configurar webhook na PerfectPay
5. ⏳ Testar com pagamento real

---

**Última atualização:** Novembro 2024


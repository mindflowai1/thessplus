# 🔧 Instalar Supabase CLI - Método Alternativo (Sem Scoop)

Como o Scoop não pode ser instalado como Admin, vamos usar um método alternativo mais simples.

---

## 🎯 Opção 1: Instalar Scoop em PowerShell Normal (Recomendado)

### Passo 1: Abrir PowerShell Normal (NÃO como Admin)

1. Pressione `Windows + R`
2. Digite: `powershell`
3. Pressione Enter
4. **NÃO** clique com botão direito e "Executar como administrador"

### Passo 2: Executar comandos

No PowerShell normal:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

Agora deve funcionar! ✅

---

## 🎯 Opção 2: Baixar Binário Direto (Mais Simples)

Se o Scoop não funcionar, podemos baixar o Supabase CLI diretamente.

### Passo 1: Baixar o Supabase CLI

1. Acesse: https://github.com/supabase/cli/releases
2. Procure pela versão mais recente
3. Baixe o arquivo para Windows:
   - `supabase_X.X.X_windows_amd64.zip` (para 64-bit)
   - Ou `supabase_X.X.X_windows_386.zip` (para 32-bit)

### Passo 2: Extrair o arquivo

1. Extraia o ZIP em uma pasta (exemplo: `C:\supabase-cli`)
2. Você verá um arquivo `supabase.exe`

### Passo 3: Adicionar ao PATH

#### Método A: Via Interface Gráfica

1. Pressione `Windows + R`
2. Digite: `sysdm.cpl`
3. Pressione Enter
4. Clique na aba **"Avançado"**
5. Clique em **"Variáveis de Ambiente"**
6. Em **"Variáveis do sistema"**, encontre **"Path"**
7. Clique em **"Editar"**
8. Clique em **"Novo"**
9. Adicione o caminho onde extraiu o Supabase CLI (exemplo: `C:\supabase-cli`)
10. Clique em **"OK"** em todas as janelas

#### Método B: Via PowerShell

No PowerShell (pode ser Admin agora):

```powershell
# Adicionar ao PATH (substitua pelo caminho onde extraiu)
$env:Path += ";C:\supabase-cli"
[Environment]::SetEnvironmentVariable("Path", $env:Path, [EnvironmentVariableTarget]::User)
```

**Substitua `C:\supabase-cli` pelo caminho onde você extraiu o arquivo!**

### Passo 4: Verificar instalação

Feche e reabra o PowerShell, depois execute:

```powershell
supabase --version
```

Se mostrar a versão, está funcionando! ✅

---

## 🎯 Opção 3: Usar Chocolatey (Se já tiver instalado)

Se você já tem Chocolatey instalado:

```powershell
choco install supabase
```

---

## 🎯 Opção 4: Usar Winget (Windows 11)

Se você tem Windows 11, pode usar o Winget:

```powershell
winget install --id=Supabase.CLI
```

---

## ✅ Recomendação

**Recomendo a Opção 1** (Scoop em PowerShell normal), pois é mais fácil de manter atualizado.

**Se não funcionar, use a Opção 2** (baixar binário direto).

---

## 🚀 Depois de Instalar

Depois que o Supabase CLI estiver instalado, continue com:

```powershell
# Navegar até o projeto
cd "C:\Gaveta 2\Projetos\thessplus"

# Login
supabase login

# Link com projeto
supabase link --project-ref ldhxfiyjopesopqiwxyk

# Deploy
supabase functions deploy perfectpay-webhook
```

---

**Última atualização:** Novembro 2024


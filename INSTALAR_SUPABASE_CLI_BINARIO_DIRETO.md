# 📥 Instalar Supabase CLI - Baixar Binário Direto

Método mais simples: baixar o executável diretamente, sem Scoop.

---

## 🚀 Passo 1: Baixar o Supabase CLI

1. Acesse: https://github.com/supabase/cli/releases/latest
2. Procure por **"Assets"** (clique para expandir)
3. Baixe o arquivo:
   - **`supabase_X.X.X_windows_amd64.zip`** (para Windows 64-bit)
   - Ou **`supabase_X.X.X_windows_386.zip`** (para Windows 32-bit)

**Exemplo:** `supabase_1.234.5_windows_amd64.zip`

---

## 📂 Passo 2: Extrair o Arquivo

1. Abra a pasta **Downloads** (ou onde baixou)
2. Clique com botão direito no arquivo ZIP
3. Clique em **"Extrair Tudo..."** ou **"Extract All..."**
4. Escolha uma pasta para extrair (exemplo: `C:\supabase-cli`)
5. Clique em **"Extrair"**

**Você verá um arquivo `supabase.exe` dentro da pasta extraída.**

---

## 🔧 Passo 3: Adicionar ao PATH

### Método A: Via Interface Gráfica (Mais Fácil)

1. Pressione `Windows + R`
2. Digite: `sysdm.cpl`
3. Pressione Enter
4. Clique na aba **"Avançado"**
5. Clique em **"Variáveis de Ambiente"**
6. Em **"Variáveis do usuário"** (não "Variáveis do sistema"), encontre **"Path"**
7. Clique em **"Editar"**
8. Clique em **"Novo"**
9. Cole o caminho onde você extraiu o arquivo (exemplo: `C:\supabase-cli`)
10. Clique em **"OK"** em todas as janelas

### Método B: Via PowerShell

No PowerShell (pode ser Admin agora):

```powershell
# Substitua C:\supabase-cli pelo caminho onde você extraiu o arquivo
$caminho = "C:\supabase-cli"
$env:Path += ";$caminho"
[Environment]::SetEnvironmentVariable("Path", $env:Path, [EnvironmentVariableTarget]::User)
```

**Substitua `C:\supabase-cli` pelo caminho real onde você extraiu!**

---

## ✅ Passo 4: Verificar Instalação

1. **Feche e reabra o PowerShell** (importante!)
2. Execute:

```powershell
supabase --version
```

**Se mostrar a versão (exemplo: `Supabase CLI 1.234.5`), está funcionando!** ✅

---

## 🎯 Passo 5: Usar o Supabase CLI

Agora você pode usar normalmente:

```powershell
# Navegar até o projeto
cd "C:\Gaveta 2\Projetos\thessplus"

# Login no Supabase
supabase login

# Link com projeto
supabase link --project-ref ldhxfiyjopesopqiwxyk

# Deploy da função
supabase functions deploy perfectpay-webhook
```

---

## 🆘 Troubleshooting

### Erro: "supabase: command not found"

**Solução:**
1. Verifique se adicionou o caminho corretamente ao PATH
2. **Feche e reabra o PowerShell** (muito importante!)
3. Tente novamente: `supabase --version`

### Erro: "The term 'supabase' is not recognized"

**Solução:**
1. Verifique se o arquivo `supabase.exe` existe na pasta
2. Verifique se o caminho está correto no PATH
3. Feche e reabra o PowerShell

### Não consegue adicionar ao PATH

**Solução alternativa:** Use o caminho completo sempre:

```powershell
# Em vez de: supabase --version
# Use: C:\supabase-cli\supabase.exe --version

# Ou crie um alias:
Set-Alias supabase "C:\supabase-cli\supabase.exe"
```

---

## 📝 Resumo Rápido

1. ✅ Baixar ZIP do GitHub
2. ✅ Extrair em uma pasta (exemplo: `C:\supabase-cli`)
3. ✅ Adicionar pasta ao PATH
4. ✅ Fechar e reabrir PowerShell
5. ✅ Testar: `supabase --version`

---

**Última atualização:** Novembro 2024


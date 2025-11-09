# 🚀 Deploy no Google Cloud Run - Guia Completo

Este guia explica como fazer deploy do projeto Thess+ no Google Cloud Run.

---

## 🎯 Opções de Deploy

Você tem **duas opções** para fazer deploy:

1. **🚀 CI/CD Automático com GitHub** (Recomendado - Mais fácil!)
   - Conecta GitHub ao Cloud Build
   - Build e deploy automáticos a cada push
   - Não precisa de Docker local
   - [Ir para seção CI/CD](#-deploy-automático-com-github-cicd)

2. **🔧 Deploy Manual com Script**
   - Usa Docker local
   - Mais controle sobre o processo
   - [Ir para seção Deploy Manual](#-deploy-manual-com-script)

---

## 🚀 Deploy Automático com GitHub (CI/CD)

**✅ Vantagens:**
- Não precisa instalar Docker localmente
- Deploy automático a cada push no GitHub
- Build acontece na nuvem
- Mais simples e rápido

### Pré-requisitos

- [ ] Conta Google Cloud Platform (GCP)
- [ ] Google Cloud SDK (gcloud) instalado
- [ ] Projeto criado no GCP
- [ ] **Billing habilitado no projeto** ⚠️ **OBRIGATÓRIO**
- [ ] Repositório no GitHub com o código

### Passo 1: Habilitar APIs Necessárias

```powershell
# Configurar projeto
gcloud config set project SEU-PROJECT-ID

# Habilitar APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Passo 2: Conectar GitHub ao Cloud Build

1. **Acesse o Cloud Build Console:**
   - https://console.cloud.google.com/cloud-build/triggers

2. **Clique em "Connect Repository"**

3. **Selecione "GitHub (Cloud Build GitHub App)"**

4. **Autorize o Cloud Build:**
   - Faça login no GitHub
   - Autorize o Google Cloud Build
   - Selecione o repositório `thessplus`

5. **Configure o Trigger:**
   - **Name**: `deploy-thessplus`
   - **Event**: Push to a branch
   - **Branch**: `^main$` (ou `^master$`)
   
   **Na seção "Configuração do build":**
   - **Tipo**: Selecione **"Arquivo de configuração do Cloud Build (yaml ou json)"** ✅
   - **Local**: Selecione **"Repositório"** (NÃO "In-line"!) ⚠️ **IMPORTANTE**
   - **Caminho do arquivo**: `cloudbuild.yaml` (ou apenas `cloudbuild.yaml` se estiver na raiz)
   - Isso permite mais controle e já está configurado com as variáveis
   
   **⚠️ ERRO COMUM:** Se você selecionar "In-line", o Cloud Build não vai encontrar o arquivo no repositório!
   
   **⚠️ Alternativa (mais simples, mas menos controle):**
   - **Tipo de build**: Selecione **"Dockerfile"**
   - **Local de origem**: `Dockerfile`
   - Mas você ainda precisará configurar as variáveis manualmente

6. **Configure Substitution Variables (Variáveis de Substituição):**
   
   **⚠️ IMPORTANTE:** Você precisa configurar as variáveis **uma única vez** no trigger. Depois disso, elas ficam salvas e não precisa configurar novamente!
   
   - Role até a seção "Variáveis de substituição" ou "Substitution variables"
   - Clique em "Add variable" ou "Adicionar variável"
   - Adicione cada variável (use o prefixo `_` antes do nome):
     ```
     _VITE_SUPABASE_URL = https://ldhxfiyjopesopqiwxyk.supabase.co
     _VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkaHhmaXlqb3Blc29wcWl3eHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMDA1NjQsImV4cCI6MjA3Njg3NjU2NH0.BKb6XMECfSvBcdfnhe3hqOwF13O6haiiFAnfuXg_a3s
     _VITE_PERFECTPAY_PRODUCT_ID = (deixe vazio se não tiver)
     _VITE_PERFECTPAY_API_URL = https://app.perfectpay.com.br
     ```
   
   **💡 Dica:** 
   - Configure as variáveis **uma vez** e elas ficam salvas no trigger
   - Se precisar mudar depois, é só editar o trigger
   - Use o prefixo `_` (underscore) antes do nome da variável
   - Exemplo: `_VITE_SUPABASE_URL` (não `VITE_SUPABASE_URL`)

7. **Configure o Serviço Cloud Run:**
   
   Na seção "Serviço" ou "Service":
   - **Nome do serviço**: `thessplus`
   - **Região**: `us-central1` (ou a região mais próxima)
   - **Autenticação**: Selecione **"Permitir tráfego não autenticado"** (Allow unauthenticated traffic)
   - **Porta**: `8080`
   - **Memória**: `512Mi`
   - **CPU**: `1`
   - **Instâncias mínimas**: `0`
   - **Instâncias máximas**: `10`

8. **Clique em "Salvar" ou "Create"**

### Passo 3: Fazer Push para GitHub

```powershell
# Se ainda não fez commit
git add .
git commit -m "Configurar CI/CD"

# Fazer push para a branch main
git push origin main
```

### Passo 4: Verificar Deploy

1. **Acompanhe o build:**
   - https://console.cloud.google.com/cloud-build/builds

2. **Aguarde o build completar** (5-10 minutos na primeira vez)

3. **Obter URL do serviço:**
   ```powershell
   gcloud run services describe thessplus --region us-central1 --format 'value(status.url)'
   ```

### Passo 5: Atualizar Variáveis (se necessário)

Se precisar mudar as variáveis de ambiente:

1. Acesse: https://console.cloud.google.com/cloud-build/triggers
2. Clique no trigger `deploy-thessplus`
3. Clique em "Edit"
4. Atualize as "Substitution variables"
5. Salve
6. Faça um novo push ou execute o trigger manualmente

### Executar Deploy Manualmente

Se quiser fazer deploy sem fazer push:

1. Acesse: https://console.cloud.google.com/cloud-build/triggers
2. Clique no trigger `deploy-thessplus`
3. Clique em "Run trigger"
4. Selecione a branch e clique em "Run"

---

## 🔧 Deploy Manual com Script

Se preferir fazer deploy manualmente usando Docker local.

### Pré-requisitos

- [ ] Conta Google Cloud Platform (GCP)
- [ ] Google Cloud SDK (gcloud) instalado
- [ ] Projeto criado no GCP
- [ ] **Billing habilitado no projeto** ⚠️ **OBRIGATÓRIO**
- [ ] **Docker Desktop instalado e rodando** ⚠️ **OBRIGATÓRIO**

### Passo 1: Habilitar Billing

**⚠️ IMPORTANTE:** O billing deve estar habilitado antes de continuar!

```powershell
# Verificar se o billing está habilitado
gcloud billing projects describe SEU-PROJECT-ID

# Se não estiver, liste suas contas de billing
gcloud billing accounts list

# Vincule uma conta de billing ao projeto
gcloud billing projects link SEU-PROJECT-ID --billing-account=BILLING-ACCOUNT-ID
```

### Passo 2: Executar Script de Deploy

```powershell
# Navegar até o projeto
cd "C:\Gaveta 2\Projetos\thessplus"

# Executar script
.\deploy.ps1
```

O script irá:
1. Verificar instalações (gcloud, Docker)
2. Habilitar APIs necessárias
3. Solicitar variáveis de ambiente
4. Fazer build da imagem Docker
5. Fazer push para Container Registry
6. Fazer deploy no Cloud Run

### Passo 3: Fornecer Variáveis de Ambiente

Quando o script pedir, forneça:

- **VITE_SUPABASE_URL**: `https://ldhxfiyjopesopqiwxyk.supabase.co`
- **VITE_SUPABASE_ANON_KEY**: Sua chave anon do Supabase
- **VITE_PERFECTPAY_PRODUCT_ID**: (opcional, pode deixar em branco)
- **VITE_PERFECTPAY_API_URL**: `https://app.perfectpay.com.br`

---

## 📋 Variáveis de Ambiente

### Onde Encontrar as Credenciais do Supabase

1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Settings** > **API**
4. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

### Onde Encontrar o PerfectPay Product ID

1. Acesse: https://app.perfectpay.com.br
2. Vá em **Produtos**
3. Selecione o produto desejado
4. Copie o **Product ID**

---

## ✅ Checklist de Deploy

### Para CI/CD com GitHub:
- [ ] APIs habilitadas (Cloud Build, Cloud Run, Container Registry)
- [ ] GitHub conectado ao Cloud Build
- [ ] Trigger criado com variáveis de substituição
- [ ] Código no GitHub
- [ ] Push realizado
- [ ] Build concluído com sucesso
- [ ] URL do serviço obtida

### Para Deploy Manual:
- [ ] Google Cloud SDK instalado
- [ ] Docker Desktop instalado e rodando
- [ ] Billing habilitado
- [ ] APIs habilitadas
- [ ] Variáveis de ambiente anotadas
- [ ] Script executado com sucesso
- [ ] URL do serviço obtida

---

## 🔍 Verificar Deploy

### Obter URL do Serviço

```powershell
gcloud run services describe thessplus --region us-central1 --format 'value(status.url)'
```

### Ver Logs

```powershell
# Logs em tempo real
gcloud run services logs read thessplus --region us-central1 --follow

# Últimas 100 linhas
gcloud run services logs read thessplus --region us-central1 --limit 100
```

### Testar Aplicação

1. Acesse a URL do serviço no navegador
2. Verifique se a aplicação carrega
3. Teste funcionalidades principais

---

## 🔄 Atualizar Deploy

### Com CI/CD (GitHub):
- Faça push para a branch `main`
- O deploy acontece automaticamente

### Manualmente:
```powershell
# Atualizar código e fazer push
git add .
git commit -m "Atualização"
git push origin main

# Ou executar script novamente
.\deploy.ps1
```

---

## 💰 Custos

### Free Tier
- **2 milhões de requisições/mês** gratuitas
- **360.000 GB-segundos** de memória gratuitos
- **180.000 vCPU-segundos** gratuitos

### Após Free Tier
- **Requisições**: $0.40 por milhão
- **Memória**: $0.0000025 por GB-segundo
- **CPU**: $0.00002400 por vCPU-segundo

**Estimativa para 10.000 requisições/mês:** ~$0.004 (praticamente grátis)

---

## 🐛 Troubleshooting

### Erro: "Billing not found"
- Habilite o billing no projeto
- Veja seção "Habilitar Billing" acima

### Erro: "Docker not running"
- Inicie o Docker Desktop
- Aguarde até aparecer "Docker Desktop is running"

### Erro: "Image not found"
- Verifique se o build foi concluído
- Verifique logs do Cloud Build

### Aplicação não carrega
- Verifique logs do Cloud Run
- Verifique se as variáveis de ambiente estão corretas
- Teste a URL do health check: `/health`

---

## 📚 Referências

- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Cloud Run Pricing](https://cloud.google.com/run/pricing)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

**Última Atualização**: Janeiro 2025

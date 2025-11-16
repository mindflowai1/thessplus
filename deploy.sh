#!/bin/bash

# Script de deploy para Google Cloud Run
# Uso: ./deploy.sh

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Iniciando deploy no Google Cloud Run...${NC}"

# Verificar se gcloud está instalado
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Google Cloud SDK não está instalado.${NC}"
    echo "Instale em: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Verificar se está logado
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${YELLOW}⚠️  Não está logado no Google Cloud.${NC}"
    echo "Fazendo login..."
    gcloud auth login
fi

# Obter Project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ Nenhum projeto configurado.${NC}"
    echo "Configure com: gcloud config set project SEU-PROJECT-ID"
    exit 1
fi

echo -e "${GREEN}✓ Projeto: ${PROJECT_ID}${NC}"

# Verificar se .env existe
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado.${NC}"
    echo "Criando .env.example..."
    cat > .env.example << EOF
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
VITE_PERFECTPAY_PRODUCT_ID=seu-product-id
VITE_PERFECTPAY_API_URL=https://app.perfectpay.com.br
EOF
    echo -e "${YELLOW}Por favor, crie um arquivo .env com as variáveis necessárias.${NC}"
    exit 1
fi

# Carregar variáveis de ambiente
source .env

# Verificar variáveis obrigatórias
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}❌ Variáveis de ambiente obrigatórias não configuradas.${NC}"
    echo "Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env"
    exit 1
fi

# Nome do serviço
SERVICE_NAME="thessplus"
REGION="us-central1"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest"

echo -e "${GREEN}✓ Configuração verificada${NC}"

# Build da imagem
echo -e "${YELLOW}📦 Buildando imagem Docker...${NC}"
docker build -t ${IMAGE_NAME} .

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao buildar imagem.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Imagem buildada com sucesso${NC}"

# Push da imagem
echo -e "${YELLOW}📤 Fazendo push da imagem...${NC}"
gcloud auth configure-docker --quiet
docker push ${IMAGE_NAME}

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao fazer push da imagem.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Imagem enviada com sucesso${NC}"

# Deploy no Cloud Run
echo -e "${YELLOW}🚀 Fazendo deploy no Cloud Run...${NC}"

ENV_VARS="VITE_SUPABASE_URL=${VITE_SUPABASE_URL},VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}"

if [ ! -z "$VITE_PERFECTPAY_PRODUCT_ID" ]; then
    ENV_VARS="${ENV_VARS},VITE_PERFECTPAY_PRODUCT_ID=${VITE_PERFECTPAY_PRODUCT_ID}"
fi

if [ ! -z "$VITE_PERFECTPAY_API_URL" ]; then
    ENV_VARS="${ENV_VARS},VITE_PERFECTPAY_API_URL=${VITE_PERFECTPAY_API_URL}"
fi

gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars "${ENV_VARS}"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao fazer deploy.${NC}"
    exit 1
fi

# Obter URL do serviço
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format 'value(status.url)')

echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo -e "${GREEN}🌐 URL do serviço: ${SERVICE_URL}${NC}"
echo ""
echo -e "${YELLOW}📝 Próximos passos:${NC}"
echo "1. Teste a aplicação: ${SERVICE_URL}"
echo "2. Configure o webhook do PerfectPay com esta URL"
echo "3. Configure o Supabase com esta URL nas configurações de redirect"












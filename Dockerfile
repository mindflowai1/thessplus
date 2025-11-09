# Dockerfile para Google Cloud Run
# Build multi-stage para otimizar tamanho da imagem

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Definir argumentos de build (variáveis de ambiente para o build)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_PERFECTPAY_PRODUCT_ID
ARG VITE_PERFECTPAY_API_URL

# Definir variáveis de ambiente para o build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_PERFECTPAY_PRODUCT_ID=$VITE_PERFECTPAY_PRODUCT_ID
ENV VITE_PERFECTPAY_API_URL=$VITE_PERFECTPAY_API_URL

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copiar arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 8080 (padrão do Cloud Run)
EXPOSE 8080

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]

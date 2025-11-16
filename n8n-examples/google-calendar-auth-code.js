/**
 * Código para Node "Code" no N8N
 * Autentica com Google usando Service Account e retorna access token
 */

// Carregar credenciais do Service Account
// IMPORTANTE: Configure GOOGLE_SERVICE_ACCOUNT_JSON como variável de ambiente no N8N
const serviceAccountJson = $env.GOOGLE_SERVICE_ACCOUNT_JSON;

if (!serviceAccountJson) {
  throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON não configurado');
}

const serviceAccount = typeof serviceAccountJson === 'string' 
  ? JSON.parse(serviceAccountJson) 
  : serviceAccountJson;

// Criar JWT para autenticação
// Nota: N8N pode não ter jsonwebtoken instalado
// Se não tiver, use a abordagem HTTP Request abaixo

const now = Math.floor(Date.now() / 1000);
const expiry = now + 3600; // 1 hora

// Criar JWT manualmente (simplificado)
// Em produção, use a biblioteca jsonwebtoken ou faça via HTTP Request

// Alternativa: Fazer requisição HTTP para obter token
const jwtPayload = {
  iss: serviceAccount.client_email,
  sub: serviceAccount.client_email,
  aud: 'https://oauth2.googleapis.com/token',
  iat: now,
  exp: expiry,
  scope: 'https://www.googleapis.com/auth/calendar'
};

// Se jsonwebtoken estiver disponível:
// const jwt = require('jsonwebtoken');
// const token = jwt.sign(jwtPayload, serviceAccount.private_key, { algorithm: 'RS256' });

// Por enquanto, retornar dados para fazer requisição HTTP no próximo node
return {
  serviceAccount: serviceAccount,
  jwtPayload: jwtPayload,
  eventData: $input.item.json
};

// Nota: O próximo node deve fazer a requisição HTTP para obter o access token
// ou usar a biblioteca googleapis se disponível











